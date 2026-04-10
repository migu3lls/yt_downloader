# YouTube Downloader (Python)

Aplicação simples com interface gráfica para colar um link do YouTube e baixar em **MP3** ou **MP4**.

> Use apenas para conteúdos próprios ou com permissão.

## Requisitos

- Python 3.10+
- `ffmpeg` instalado no Windows e disponível no `PATH`

## Instalação

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Executar

```powershell
.\.venv\Scripts\python.exe main.py
```

## Funções incluídas

- colar URL do YouTube
- escolher `MP3` ou `MP4`
- definir qualidade do vídeo (`best`, `1080p`, `720p`, `480p`, `360p`)
- baixar vídeo único ou playlist completa
- selecionar pasta de destino
- barra de progresso com percentagem, velocidade e ETA quando disponível
- mensagens de erro e sucesso
