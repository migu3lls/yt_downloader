PASSO A PASSO (YouTube -> MP3/MP4 com Python)
============================================

1) Tenha o Python 3.8+ instalado (verifique com: python --version).

2) Clone o repositorio: 

3) Crie e ative um ambiente virtual:
       python -m venv .venv
       # Windows: .venv\Scripts\activate
       # macOS/Linux: source .venv/bin/activate

4) Instale as Dependencias para rodar o projeto (necessário para converter/mesclar arquivos):

- Instale:

   FFmpeg    
      - Windows (opções):
         * winget install --id Gyan.FFmpeg -e
        * ou choco install ffmpeg
      - macOS (Homebrew): brew install ffmpeg
      - Linux (Debian/Ubuntu): sudo apt update && sudo apt install -y ffmpeg
      Verifique: ffmpeg -version

   tqdm
      - pip install tqdm
   
   pip install -r requirements.txt

5) Execute o script:
   - Para MP3 (áudio):
       python yt_downloader.py "URL_DO_VIDEO" --formato mp3 --saida saida/
       # exemplo: python yt_downloader.py "https://www.youtube.com/watch?v=lDK9QqIzhwk&list=PLVQ7g3e6O27cH8KG9mktLWH8zcqiwTntP&ab_channel=BonJoviVEVO" -f mp3 -o musics
   - Para MP4 (vídeo):
       python yt_downloader.py "URL_DO_VIDEO" --formato mp4 --saida saida/

   * Também funciona com playlists: passe a URL da playlist.
   * Dica: mude o bitrate do MP3 com --bitrate 320

6) Problemas comuns:
   - 'ffmpeg não encontrado': instale o FFmpeg e garanta que o comando 'ffmpeg' funciona no terminal.
   - 'ERROR: This video is DRM protected': não é possível baixar conteúdos protegidos por DRM.
   - 'HTTP Error 410/403': o vídeo pode estar indisponível, privado ou com restrições regionais.

Aviso legal: Baixe/converta apenas conteúdos que você possui direitos ou permissão para tal. Respeite os Termos de Serviço do YouTube e as leis aplicáveis.

