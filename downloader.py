from __future__ import annotations

from pathlib import Path
from typing import Callable, Optional
from urllib.parse import urlparse

import yt_dlp

ProgressCallback = Optional[Callable[[str, Optional[float]], None]]
VIDEO_QUALITIES = {"best", "1080p", "720p", "480p", "360p"}


class DownloadError(Exception):
    """Application-level error for a failed download."""


def _notify(callback: ProgressCallback, message: str, percent: Optional[float] = None) -> None:
    if callback:
        callback(message, percent)


def _is_valid_url(url: str) -> bool:
    parsed = urlparse(url)
    host = parsed.netloc.lower()
    return bool(parsed.scheme and host and ("youtube.com" in host or "youtu.be" in host))


def _build_video_format_selector(video_quality: str) -> str:
    if video_quality == "best":
        return "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/best"

    height = video_quality.removesuffix("p")
    return (
        f"bv*[height<={height}][ext=mp4]+ba[ext=m4a]/"
        f"b[height<={height}][ext=mp4]/best[height<={height}]"
    )


def download_youtube(
    url: str,
    format_choice: str,
    output_dir: str,
    progress_callback: ProgressCallback = None,
    video_quality: str = "best",
    download_playlist: bool = False,
) -> Path:
    """Download a YouTube URL as MP3 or MP4 and return the saved path.

    Use only for content you own or have permission to download.
    """
    if not url.strip():
        raise DownloadError("Informe um link do YouTube.")

    if not _is_valid_url(url.strip()):
        raise DownloadError("O link informado não parece ser um URL válido do YouTube.")

    if format_choice not in {"mp3", "mp4"}:
        raise DownloadError("Formato inválido. Escolha MP3 ou MP4.")

    if video_quality not in VIDEO_QUALITIES:
        raise DownloadError("Qualidade de vídeo inválida.")

    target_dir = Path(output_dir).expanduser().resolve()
    target_dir.mkdir(parents=True, exist_ok=True)

    _notify(progress_callback, "A preparar download...", 0.0)

    def progress_hook(data: dict) -> None:
        status = data.get("status")
        info = data.get("info_dict") or {}
        title = info.get("title") or "conteúdo"

        prefix = ""
        if download_playlist:
            playlist_index = info.get("playlist_index")
            playlist_total = info.get("n_entries") or info.get("playlist_count")
            if playlist_index and playlist_total:
                prefix = f"[{playlist_index}/{playlist_total}] "

        if status == "downloading":
            total = data.get("total_bytes") or data.get("total_bytes_estimate")
            downloaded = data.get("downloaded_bytes", 0)
            if total:
                percent = max(0.0, min(100.0, downloaded / total * 100))
                details: list[str] = []
                speed = data.get("speed")
                eta = data.get("eta")
                if speed:
                    details.append(f"{speed / 1024 / 1024:.1f} MB/s")
                if eta is not None:
                    details.append(f"ETA {int(eta)}s")
                suffix = f" ({' • '.join(details)})" if details else ""
                _notify(progress_callback, f"{prefix}A descarregar {title}... {percent:.1f}%{suffix}", percent)
            else:
                _notify(progress_callback, f"{prefix}A descarregar {title}...", None)
        elif status == "finished":
            _notify(progress_callback, f"{prefix}Download concluído. A processar ficheiro...", 100.0)

    ydl_opts = {
        "noplaylist": not download_playlist,
        "outtmpl": str(target_dir / "%(title)s.%(ext)s"),
        "quiet": True,
        "noprogress": True,
        "progress_hooks": [progress_hook],
    }

    if format_choice == "mp3":
        ydl_opts.update(
            {
                "format": "bestaudio/best",
                "postprocessors": [
                    {
                        "key": "FFmpegExtractAudio",
                        "preferredcodec": "mp3",
                        "preferredquality": "192",
                    }
                ],
            }
        )
    else:
        ydl_opts.update(
            {
                "format": _build_video_format_selector(video_quality),
                "merge_output_format": "mp4",
            }
        )

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)

            if download_playlist or info.get("_type") == "playlist":
                _notify(progress_callback, "Playlist concluída com sucesso.", 100.0)
                return target_dir

            file_stem = ydl.prepare_filename(info)

        expected_extension = ".mp3" if format_choice == "mp3" else ".mp4"
        final_path = Path(file_stem).with_suffix(expected_extension)

        if not final_path.exists():
            matches = sorted(target_dir.glob(f"{final_path.stem}.*"), key=lambda item: item.stat().st_mtime, reverse=True)
            if matches:
                final_path = matches[0]

        _notify(progress_callback, f"Concluído: {final_path.name}", 100.0)
        return final_path

    except yt_dlp.utils.DownloadError as exc:
        message = str(exc)
        if "ffmpeg is not installed" in message.lower():
            raise DownloadError("O FFmpeg não está instalado ou não está no PATH do Windows.") from exc
        raise DownloadError(f"Não foi possível baixar o conteúdo: {message}") from exc
    except Exception as exc:  # pragma: no cover - defensive guard
        raise DownloadError(f"Erro inesperado: {exc}") from exc
