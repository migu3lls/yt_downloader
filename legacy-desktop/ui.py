from __future__ import annotations

import threading
import tkinter as tk
from pathlib import Path
from tkinter import filedialog, messagebox, ttk

from downloader import DownloadError, download_youtube

DEFAULT_OUTPUT = Path.home() / "Downloads" / "Youtube"
VIDEO_QUALITIES = ["best", "1080p", "720p", "480p", "360p"]


class YoutubeDownloaderApp(tk.Tk):
    def __init__(self) -> None:
        super().__init__()
        self.title("YouTube Downloader")
        self.geometry("700x360")
        self.resizable(False, False)
        self.configure(padx=16, pady=16)

        self.url_var = tk.StringVar()
        self.format_var = tk.StringVar(value="mp3")
        self.quality_var = tk.StringVar(value="best")
        self.playlist_var = tk.BooleanVar(value=False)
        self.output_var = tk.StringVar(value=str(DEFAULT_OUTPUT))
        self.status_var = tk.StringVar(value="Cole um link do YouTube para começar.")
        self.progress_var = tk.DoubleVar(value=0.0)

        self._build_layout()
        self._toggle_quality_state()

    def _build_layout(self) -> None:
        ttk.Label(self, text="Link do YouTube:").grid(row=0, column=0, sticky="w")
        url_entry = ttk.Entry(self, textvariable=self.url_var, width=80)
        url_entry.grid(row=1, column=0, columnspan=3, sticky="ew", pady=(4, 12))
        url_entry.focus()

        ttk.Label(self, text="Formato e opções:").grid(row=2, column=0, sticky="w")
        format_frame = ttk.Frame(self)
        format_frame.grid(row=3, column=0, columnspan=3, sticky="ew", pady=(4, 12))

        ttk.Radiobutton(
            format_frame, text="MP3", value="mp3", variable=self.format_var, command=self._toggle_quality_state
        ).pack(side="left", padx=(0, 12))
        ttk.Radiobutton(
            format_frame, text="MP4", value="mp4", variable=self.format_var, command=self._toggle_quality_state
        ).pack(side="left", padx=(0, 16))

        ttk.Label(format_frame, text="Qualidade do vídeo:").pack(side="left")
        self.quality_combo = ttk.Combobox(
            format_frame,
            textvariable=self.quality_var,
            values=VIDEO_QUALITIES,
            state="readonly",
            width=10,
        )
        self.quality_combo.pack(side="left", padx=(8, 16))

        ttk.Checkbutton(format_frame, text="Baixar playlist completa", variable=self.playlist_var).pack(side="left")

        ttk.Label(self, text="Pasta de destino:").grid(row=4, column=0, sticky="w")
        output_entry = ttk.Entry(self, textvariable=self.output_var, width=60)
        output_entry.grid(row=5, column=0, columnspan=2, sticky="ew", pady=(4, 12))

        browse_button = ttk.Button(self, text="Escolher pasta", command=self._choose_folder)
        browse_button.grid(row=5, column=2, sticky="ew", padx=(8, 0))

        self.download_button = ttk.Button(self, text="Baixar", command=self._start_download)
        self.download_button.grid(row=6, column=0, columnspan=3, sticky="ew", pady=(8, 10))

        self.progress = ttk.Progressbar(self, variable=self.progress_var, maximum=100, mode="determinate")
        self.progress.grid(row=7, column=0, columnspan=3, sticky="ew", pady=(0, 10))

        status_frame = ttk.LabelFrame(self, text="Estado")
        status_frame.grid(row=8, column=0, columnspan=3, sticky="nsew")
        ttk.Label(status_frame, textvariable=self.status_var, wraplength=640, justify="left").grid(
            row=0, column=0, sticky="w", padx=10, pady=10
        )

        self.columnconfigure(0, weight=1)
        self.columnconfigure(1, weight=1)
        self.columnconfigure(2, weight=0)

    def _toggle_quality_state(self) -> None:
        state = "readonly" if self.format_var.get() == "mp4" else "disabled"
        self.quality_combo.config(state=state)
        if self.format_var.get() == "mp3":
            self.quality_var.set("best")

    def _choose_folder(self) -> None:
        selected = filedialog.askdirectory(initialdir=self.output_var.get() or str(DEFAULT_OUTPUT))
        if selected:
            self.output_var.set(selected)

    def _start_download(self) -> None:
        url = self.url_var.get().strip()
        output_dir = self.output_var.get().strip()
        format_choice = self.format_var.get()
        video_quality = self.quality_var.get()
        download_playlist = self.playlist_var.get()

        if not url:
            messagebox.showwarning("Campo obrigatório", "Cole um link do YouTube antes de continuar.")
            return

        if not output_dir:
            messagebox.showwarning("Campo obrigatório", "Escolha uma pasta de destino.")
            return

        self.download_button.config(state="disabled")
        self._update_progress("A iniciar download...", 0.0)

        worker = threading.Thread(
            target=self._download_worker,
            args=(url, format_choice, output_dir, video_quality, download_playlist),
            daemon=True,
        )
        worker.start()

    def _download_worker(
        self,
        url: str,
        format_choice: str,
        output_dir: str,
        video_quality: str,
        download_playlist: bool,
    ) -> None:
        try:
            final_path = download_youtube(
                url,
                format_choice,
                output_dir,
                progress_callback=self._update_progress,
                video_quality=video_quality,
                download_playlist=download_playlist,
            )
        except DownloadError as exc:
            self.after(0, lambda: messagebox.showerror("Erro no download", str(exc)))
            self._update_progress(f"Falhou: {exc}", 0.0)
        except Exception as exc:  # pragma: no cover - defensive guard
            self.after(0, lambda: messagebox.showerror("Erro inesperado", str(exc)))
            self._update_progress(f"Erro inesperado: {exc}", 0.0)
        else:
            success_message = (
                f"Playlist guardada em:\n{final_path}"
                if download_playlist
                else f"Ficheiro guardado em:\n{final_path}"
            )
            self.after(0, lambda: messagebox.showinfo("Sucesso", success_message))
            self._update_progress(f"Sucesso! Guardado em: {final_path}", 100.0)
        finally:
            self.after(0, lambda: self.download_button.config(state="normal"))

    def _update_progress(self, message: str, percent: float | None = None) -> None:
        def apply_update() -> None:
            self.status_var.set(message)
            if percent is None:
                if str(self.progress.cget("mode")) != "indeterminate":
                    self.progress.config(mode="indeterminate")
                    self.progress.start(12)
                return

            self.progress.stop()
            if str(self.progress.cget("mode")) != "determinate":
                self.progress.config(mode="determinate")
            self.progress_var.set(max(0.0, min(100.0, percent)))

        self.after(0, apply_update)


def create_app() -> YoutubeDownloaderApp:
    DEFAULT_OUTPUT.mkdir(parents=True, exist_ok=True)
    return YoutubeDownloaderApp()
