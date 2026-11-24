# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-11-24

### Added
- **Developer TypeScript SDK (`yt-downloader-sdk`)**: Programmatic exports (`src/index.ts`) for `validateYouTubeUrl`, `checkRateLimit`, `createDownloadJob`, `getJob`, `cleanupJob`, and `parseCliArgs`.
- **Cross-Platform Node.js CLI (`yt-dl`)**: Standalone executable (`bin/yt-dl.mjs`) with `--info`, `--json`, `--format`, `--quality`, and `--playlist` support for CI/CD automation pipelines.
- **Python Package & CLI (`yt-downloader-cli` / `yt-dl-py`)**: PEP 621 `pyproject.toml` package under `python/yt_downloader/` with zero-shell-injection URL validation and CLI runner.
- **Composite GitHub Action (`action.yml`)**: Reusable GitHub Action enabling third-party workflows to validate and extract YouTube media safely.
- **Automated CI Pipeline (`.github/workflows/ci.yml`)**: GitHub Actions matrix testing Node.js 22 (Biome, Vitest, Next.js 15 build) and Python 3.12 (`unittest`).
- **Open-Source Governance**: Added MIT `LICENSE`, `SECURITY.md`, `CONTRIBUTING.md`, and `CODE_OF_CONDUCT.md`.

## [1.0.0] - 2026-10-23

### Added
- **Next.js 15 & React 19 Reference Architecture**: Full-stack App Router web studio under 10ATIVAS Design System V2.
- **Hardened Security Layer**: Zero-shell-injection `yt-dlp` subprocess orchestration, token-bucket rate limiter, and ephemeral `sessionStorage` lifecycle with automatic `beforeunload` purge.
- **Docker Production Container**: Multi-stage `Dockerfile` and `docker-compose.yml` bundling Node 22, Python 3, `yt-dlp`, and `FFmpeg`.
