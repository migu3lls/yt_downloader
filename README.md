# 🎵 YouTube Downloader (MP3 / MP4)

Este é um script em **Python 3** que baixa vídeos do **YouTube** em formato **MP3 (áudio)** ou **MP4 (vídeo)** utilizando [yt-dlp](https://github.com/yt-dlp/yt-dlp) + [FFmpeg](https://ffmpeg.org/).

✅ Suporta **vídeos e playlists**  
✅ Permite escolher **MP3 (bitrate configurável)** ou **MP4**  
✅ Mostra progresso do download em tempo real  
✅ Fácil de usar via **linha de comando**  

---

## ⚙️ Requisitos

- Python **3.8+**
- [FFmpeg](https://ffmpeg.org/download.html) instalado e disponível no `PATH`
- Bibliotecas Python listadas em [`requirements.txt`](requirements.txt)

---

## 📥 Instalação

Clone este repositório:

```bash
git clone https://github.com/migu3lls/yt_downloader.git
cd yt_downloader
```
---

▶️ Uso

🎧 Baixar como MP3 (áudio)
```bash
python yt_downloader.py "URL_DO_VIDEO" --formato mp3 --saida downloads/
python yt_downloader.py "https://www.youtube.com/watch?v=dQw4w9WgXcQ" -f mp3 -o musica/
```

🎬 Baixar como MP4 (vídeo)
```bash
python yt_downloader.py "URL_DO_VIDEO" --formato mp4 --saida downloads/
python yt_downloader.py "https://www.youtube.com/watch?v=dQw4w9WgXcQ" -f mp4 -o videos/
```
