# 🎵 YouTube Downloader (MP3 / MP4)

Este é um script em **Python 3** que baixa vídeos e playlists do **YouTube** em formato **MP3 (áudio)** ou **MP4 (vídeo)** utilizando as bibliotecas `yt-dlp` e `FFmpeg`.

✅ Suporta **vídeos e playlists** </br>
✅ Permite escolher **MP3 (bitrate configurável)** ou **MP4** </br>
✅ Mostra o progresso do download em tempo real  </br>
✅ Fácil de usar via **linha de comando** ---

## ⚙️ Requisitos

- Python **3.8+**
- [FFmpeg](https://ffmpeg.org/download.html) instalado e disponível no `PATH`
- Bibliotecas Python listadas em `requirements.txt`

---

## 🛠️ Guia de Instalação e Uso

Siga este passo a passo para configurar o ambiente e executar o script.

### 1. Pré-requisitos

* **Python:** Tenha o Python 3.8+ instalado no seu sistema. Você pode baixá-lo em [https://www.python.org/downloads/windows/](https://www.python.org/downloads/windows/). Lembre-se de marcar a opção **"Add Python to PATH"** durante a instalação.
* **Git:** Tenha o Git instalado. Você pode baixá-lo em [https://git-scm.com/download/win](https://git-scm.com/download/win).

### 2. Baixar o Projeto

Clone este repositório para o seu computador usando o comando:
```bash
git clone https://github.com/migu3lls/yt_downloader.git
cd yt_downloader
```

### 3. Criar e Ativar o Ambiente Virtual

Crie um ambiente virtual para isolar as dependências do projeto:
 ```bash 
  python -m venv .venv
 ```

Em seguida, ative o ambiente virtual:

Windows:
  ```bash 
  .venv\Scripts\activate
  ```

macOS/Linux:
 ```bash 
 source .venv/bin/activate
 ```

### 4. Instalar as Dependências

Este projeto requer o FFmpeg para conversão e mesclagem de arquivos, além das bibliotecas Python.

Instale o FFmpeg:
Escolha o comando para o seu sistema operacional:

Windows:
```bash 
winget install --id Gyan.FFmpeg -e
```

macOS (Homebrew):

```bash 
brew install ffmpeg
```

Linux (Debian/Ubuntu):
```bash 
sudo apt update && sudo apt install -y ffmpeg
```    

Verifique a instalação do FFmpeg:
```bash 
ffmpeg -version
``` 

Instale as bibliotecas Python e tqdm:
Com o ambiente virtual ativado, instale as dependências listadas no arquivo requirements.txt:
```bash 
pip install -r requirements.txt
pip install tqdm
```
 
hr

▶️ Uso

Após a configuração, você pode executar o script para baixar vídeos ou playlists.

🎧 Baixar como MP3 (áudio)

```bash 
python yt_downloader.py "URL_DO_VIDEO" --formato mp3 --saida nome_da_pasta
``` 

Exemplo:
```bash 
python yt_downloader.py "[https://www.youtube.com/watch?v=lDK9QqIzhwk&list=PLVQ7g3e6O27cH8KG9mktLWH8zcqiwTntP&ab_channel=BonJoviVEVO](https://www.youtube.com/watch?v=lDK9QqIzhwk&list=PLVQ7g3e6O27cH8KG9mktLWH8zcqiwTntP&ab_channel=BonJoviVEVO)" -f mp3 -o musics
``` 


🎬 Baixar como MP4 (vídeo)

```bash 
python yt_downloader.py "URL_DO_VIDEO" --formato mp4 --saida nome_da_pasta
``` 

Exemplo:
```bash 
python yt_downloader.py "[https://www.youtube.com/watch?v=lDK9QqIzhwk&list=PLVQ7g3e6O27cH8KG9mktLWH8zcqiwTntP&ab_channel=BonJoviVEVO](https://www.youtube.com/watch?v=lDK9QqIzhwk&list=PLVQ7g3e6O27cH8KG9mktLWH8zcqiwTntP&ab_channel=BonJoviVEVO)" -f mp4 -o videos
``` 

Dica: Você pode mudar o bitrate do MP3 com --bitrate 320. O script também funciona com URLs de playlists.

⚠️ Problemas Comuns

    'ffmpeg não encontrado': Certifique-se de que o FFmpeg está instalado e que o comando ffmpeg -version funciona no seu terminal.

    'ERROR: This video is DRM protected': Não é possível baixar conteúdo protegido por DRM (Digital Rights Management).

    'HTTP Error 410/403': O vídeo pode estar indisponível, ser privado ou ter restrições regionais.

⚖️ Aviso Legal

Baixe/converta apenas conteúdos para os quais você possui direitos ou permissão para tal. Respeite os Termos de Serviço do YouTube e as leis de direitos autorais aplicáveis.

