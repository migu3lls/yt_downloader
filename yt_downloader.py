import argparse
import sys
from pathlib import Path
from datetime import datetime
import yt_dlp
from tqdm import tqdm  # pip install tqdm


def progress_hook(d):
    status = d.get('status')
    if status == 'downloading':
        downloaded = d.get('downloaded_bytes') or 0
        total = d.get('total_bytes') or d.get('total_bytes_estimate') or 0
        pct = (downloaded / total * 100) if total else 0
        speed = d.get('speed')
        eta = d.get('eta')
        sys.stdout.write(f"\r  {pct:5.1f}% | Vel: {speed or 0:.0f} B/s | ETA: {eta or 0}s ")
        sys.stdout.flush()
    elif status == 'finished':
        filename = d.get('filename', 'desconhecido')
        print(f"\n  ✅ Concluído: {filename}")
    elif status == 'error':
        print("\n  ❌ Erro durante o download.", file=sys.stderr)


def make_opts(formato: str, saida: Path, bitrate: str):
    saida.mkdir(parents=True, exist_ok=True)
    outtmpl = str(saida / "%(title)s.%(ext)s")

    opts = {
        "outtmpl": outtmpl,
        "progress_hooks": [progress_hook],
        "concurrent_fragment_downloads": 4,
        "noprogress": False,
        "noplaylist": False,
        "ignoreerrors": True,  
    }       

    if formato == "mp3":
        opts.update({
            "format": "bestaudio/best",
            "postprocessors": [{
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": bitrate,
            }],
            "postprocessor_args": ["-vn"],
            "prefer_ffmpeg": True,
        })
    elif formato == "mp4":
        opts.update({
            "format": "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
            "merge_output_format": "mp4",
            "prefer_ffmpeg": True,
        })
    else:
        raise ValueError("Formato inválido. Use 'mp3' ou 'mp4'.")

    return opts


def main():
    parser = argparse.ArgumentParser(
        description="Baixa vídeos/áudios do YouTube e gera MP3 ou MP4 (yt-dlp + FFmpeg)."
    )
    parser.add_argument("url", help="URL do vídeo (ou playlist) do YouTube")
    parser.add_argument("--formato", "-f", default="mp3", choices=["mp3", "mp4"],
                        help="Formato de saída (padrão: mp3)")
    parser.add_argument("--saida", "-o", default="saida",
                        help="Pasta onde salvar os arquivos (padrão: ./saida)")
    parser.add_argument("--bitrate", "-b", default="192",
                        help="Bitrate do MP3 (ex.: 128, 192, 256, 320). Padrão: 192")

    args = parser.parse_args()
    url = args.url
    formato = args.formato.lower()
    saida = Path(args.saida).expanduser().resolve()
    bitrate = args.bitrate

    try:
        ydl_opts = make_opts(formato, saida, bitrate)
    except ValueError as e:
        print(f"Erro: {e}", file=sys.stderr)
        sys.exit(2)

    print(f"Destino: {saida}")
    print(f"Formato: {formato.upper()}")
    if formato == "mp3":
        print(f"Bitrate: {bitrate} kbps\n")

    erros = []
    log_file = Path("erros.log")

    # Passo 1: descobrir quantos vídeos há
    try:
        with yt_dlp.YoutubeDL({"quiet": True}) as ydl:
            info = ydl.extract_info(url, download=False, process=False)
            if "entries" in info:
                entries = info["entries"]
            else:
                entries = [info]
    except Exception as e:
        print(f"Erro ao obter informações: {e}", file=sys.stderr)
        sys.exit(1)

    total = len(entries)

    # Passo 2: baixar cada vídeo com barra de progresso geral
    with tqdm(total=total, desc="Progresso geral", unit="vídeo") as pbar:
        for entry in entries:
            video_url = entry.get("webpage_url")
            titulo = entry.get("title", "sem título")
            try:
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    ydl.download([video_url])
            except Exception as e:
                msg = f"{datetime.now()} - ERRO: {titulo} | {video_url} | {e}"
                print(f"\n  ❌ Falha: {titulo}")
                erros.append(msg)
            finally:
                pbar.update(1)

    # Passo 3: salvar log de erros
    if erros:
        with open(log_file, "a", encoding="utf-8") as f:
            f.write("\n".join(erros) + "\n")
        print(f"\n⚠️ Alguns vídeos falharam. Veja detalhes em {log_file}")
    else:
        print("\n🎉 Todos os vídeos foram baixados com sucesso!")


if __name__ == "__main__":
    main()
