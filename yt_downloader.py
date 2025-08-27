#!/usr/bin/env python3
"""
yt_downloader.py
-----------------
Baixa vídeos/áudios do YouTube e gera MP3 ou MP4 usando yt-dlp + FFmpeg.

Uso:
  python yt_downloader.py <URL> --formato mp3
  python yt_downloader.py <URL> --formato mp4 --saida downloads/

Requisitos:
  - Python 3.8+
  - FFmpeg instalado e disponível no PATH (ffmpeg -version)
  - pip install -r requirements.txt
"""
import argparse
import os
import sys
from pathlib import Path

try:
    import yt_dlp
except ImportError:
    print("Erro: yt-dlp não instalado. Rode: pip install yt-dlp", file=sys.stderr)
    sys.exit(1)


def progress_hook(d):
    status = d.get('status')
    if status == 'downloading':
        downloaded = d.get('downloaded_bytes') or 0
        total = d.get('total_bytes') or d.get('total_bytes_estimate') or 0
        pct = (downloaded / total * 100) if total else 0
        speed = d.get('speed')
        eta = d.get('eta')
        # Imprime sempre na mesma linha
        sys.stdout.write(f"\rBaixando: {pct:5.1f}% | Vel: {speed or 0:.0f} B/s | ETA: {eta or 0}s ")
        sys.stdout.flush()
    elif status == 'finished':
        filename = d.get('filename', 'desconhecido')
        print(f"\nDownload concluído: {filename}")  # nova linha
    elif status == 'error':
        print("\nOcorreu um erro durante o download.", file=sys.stderr)


def make_opts(url: str, formato: str, saida: Path, bitrate: str):
    saida.mkdir(parents=True, exist_ok=True)
    outtmpl = str(saida / "%(title)s.%(ext)s")

    # Configuração base
    opts = {
        "outtmpl": outtmpl,
        "progress_hooks": [progress_hook],
        "concurrent_fragment_downloads": 4,
        "noprogress": False,
        "noplaylist": False,  # permite playlists também
    }

    if formato.lower() == "mp3":
        # Melhor áudio e extrai para MP3 (requer FFmpeg)
        opts.update({
            "format": "bestaudio/best",
            "postprocessors": [{
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": bitrate,  # 192, 256, 320...
            }],
            # Força extensão .mp3 na saída final
            "postprocessor_args": [
                "-vn"
            ],
            "prefer_ffmpeg": True,
        })
    elif formato.lower() == "mp4":
        # Melhor vídeo+áudio com contêiner mp4 quando possível
        opts.update({
            "format": "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
            "merge_output_format": "mp4",  # mescla no formato mp4
            "prefer_ffmpeg": True,
        })
    else:
        raise ValueError("Formato inválido. Use 'mp3' ou 'mp4'.")

    return opts


def main():
    parser = argparse.ArgumentParser(
        description="Baixa um vídeo do YouTube e gera MP3 ou MP4 (yt-dlp + FFmpeg)."
    )
    parser.add_argument("url", help="URL do vídeo (ou playlist) do YouTube")
    parser.add_argument("--formato", "-f", default="mp3", choices=["mp3", "mp4"],
                        help="Escolha o formato de saída (padrão: mp3)")
    parser.add_argument("--saida", "-o", default="saida",
                        help="Pasta onde o arquivo será salvo (padrão: ./saida)")
    parser.add_argument("--bitrate", "-b", default="192",
                        help="Bitrate do MP3 (ex.: 128, 192, 256, 320). Padrão: 192")

    args = parser.parse_args()
    url = args.url
    formato = args.formato.lower()
    saida = Path(args.saida).expanduser().resolve()
    bitrate = args.bitrate

    try:
        ydl_opts = make_opts(url, formato, saida, bitrate)
    except ValueError as e:
        print(f"Erro: {e}", file=sys.stderr)
        sys.exit(2)

    print(f"Destino: {saida}")
    print(f"Formato: {formato.upper()}")
    if formato == "mp3":
        print(f"Bitrate: {bitrate} kbps")

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        print("\nTudo certo! Arquivo(s) salvo(s) em:", saida)
    except yt_dlp.utils.DownloadError as e:
        print("\nFalha no download:", e, file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print("\nErro inesperado:", e, file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
