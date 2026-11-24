# Contributing to `yt_downloader` (SDK, CLI & Reference Studio)

Thank you for your interest in contributing to **`yt_downloader`**! This project provides a hardened TypeScript & Python Developer SDK, CLI (`yt-dl` / `yt-dl-py`), reusable GitHub Action, and a Next.js 15 Reference Architecture for zero-shell-injection media extraction.

---

## 🛠️ Development Setup

### Prerequisites
- **Node.js:** v20+ or v22+
- **Python:** v3.10+ (with `yt-dlp` installed)
- **FFmpeg:** Installed and available in system `PATH`

### Local Installation
```bash
git clone https://github.com/migu3lls/yt_downloader.git
cd yt_downloader
npm install
```

### Running Tests & Quality Checks
Before submitting a Pull Request, verify that both the TypeScript and Python suites pass:

```bash
# 1. Run Biome Linter & Formatter check
npm run lint

# 2. Run Vitest Security & CLI unit tests
npm test

# 3. Run Python SDK validator unit tests
python -m unittest discover -s tests -p "test_*.py" -v
```

---

## 🔒 Security-First Contribution Rules

Because media extraction tools interact with child processes (`yt-dlp` and `ffmpeg`), **all contributions must strictly adhere to our Zero-Shell-Injection policy**:
1. **Never use `child_process.exec` or `subprocess.Popen(..., shell=True)`** with user-supplied input.
2. Always pass arguments as structured arrays to `spawn` / `execFile` / `subprocess.run(..., shell=False)`.
3. Any changes to `src/lib/security/validator.ts` or `python/yt_downloader/validator.py` must include corresponding unit tests covering command injection, flag tampering (`--exec`, `--output`), and SSRF vectors.

---

## 📬 Pull Request Process

1. Fork the repository and create your feature branch (`git checkout -b feat/amazing-feature`).
2. Ensure all tests and linters pass (`npm run lint && npm test`).
3. Commit your changes using clear, conventional commit messages (`feat:`, `fix:`, `security:`, `docs:`).
4. Open a Pull Request referencing the relevant Issue.
