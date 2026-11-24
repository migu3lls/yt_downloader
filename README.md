# `yt_downloader` — Hardened Developer SDK, CLI & Next.js 15 Reference Studio

[![License: MIT](https://img.shields.io/badge/License-MIT-18E299.svg)](https://opensource.org/licenses/MIT)
[![CI Pipeline](https://github.com/migu3lls/yt_downloader/actions/workflows/ci.yml/badge.svg)](https://github.com/migu3lls/yt_downloader/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.0-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python-%3E%3D3.10-3776AB?logo=python&logoColor=white)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Code Style: Biome](https://img.shields.io/badge/Code_Style-Biome-60A5FA?logo=biome&logoColor=white)](https://biomejs.dev/)

> **Hardened TypeScript & Python Developer SDK, Cross-Platform CLI (`yt-dl`), Composite GitHub Action, and Next.js 15 Reference Architecture for zero-shell-injection YouTube media extraction via `yt-dlp`, `FFmpeg`, and `Supabase`.**

---

## 🎯 Why `yt_downloader`? (For Developers & Platform Engineers)

Most wrappers around `yt-dlp` and `FFmpeg` concatenate raw user strings into shell commands (`child_process.exec` or `subprocess.Popen(shell=True)`), exposing applications to **Remote Command Execution (`CWE-78`)**, **Argument/Flag Injection (`CWE-88`, e.g., `--exec`, `--output`)**, and **SSRF**.

`yt_downloader` solves this by providing a **multi-layered developer toolkit**:
1. **📦 TypeScript / Node.js SDK (`yt-downloader-sdk`)**: Drop-in programmatic modules for strict URL sanitization, token-bucket rate limiting, and non-blocking job orchestration (`src/index.ts`).
2. **🐍 Python Package & SDK (`yt-downloader-cli`)**: PEP 621 compliant package (`pyproject.toml`) with frozen dataclasses and zero-shell subprocess invocation (`python/yt_downloader/`).
3. **💻 Dual Automation CLIs (`yt-dl` & `yt-dl-py`)**: Headless CLI tools with `--json` and `--info` modes tailored for CI/CD pipelines, AI agents, and batch media workflows.
4. **⚙️ Reusable GitHub Action (`action.yml`)**: Composite action to validate and extract YouTube media directly inside third-party GitHub workflows.
5. **🌐 Next.js 15 + React 19 + Supabase Reference Studio**: Full-stack production template featuring ephemeral `sessionStorage` lifecycles, automatic `beforeunload` purge, and multi-stage Docker containerization.

---

## 📦 1. Using as a TypeScript / Node.js SDK

Import the security validator, rate limiter, or job manager directly in any Node.js, Next.js, or Edge server application:

```typescript
import {
  validateYouTubeUrl,
  checkRateLimit,
  createDownloadJob,
  getJob,
} from "yt-downloader-sdk";

// 1. Strict Zero-Shell-Injection URL Validation (blocks CWE-78 & CWE-88 flag tampering)
const result = validateYouTubeUrl("https://youtu.be/dQw4w9WgXcQ?list=RDdQw4w9WgXcQ");

if (!result.isValid) {
  throw new Error(result.error);
}
// result.cleanUrl   -> "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ"
// result.videoId    -> "dQw4w9WgXcQ"
// result.isPlaylist -> true

// 2. Token-Bucket Rate Limiting (Edge & Node compatible)
const quota = checkRateLimit("client_ip_or_token", 30, 60_000);
if (!quota.allowed) {
  throw new Error(`Rate limit exceeded. Retry in ${quota.resetInSec}s`);
}

// 3. Non-Blocking Extraction Job Orchestration
const jobId = await createDownloadJob({
  url: result.cleanUrl!,
  format: "mp3",
  quality: "best",
  downloadPlaylist: false,
});

const status = await getJob(jobId);
console.log(status?.progressPercent, status?.status);
```

---

## 💻 2. Using the Developer CLI (`yt-dl` & `yt-dl-py`)

### Node.js CLI (`yt-dl`)
```bash
# Inspect and sanitize metadata in structured JSON mode (ideal for CI & scripts)
npx yt-dl "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --info --json

# Extract 320kbps MP3 audio
npx yt-dl "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --format mp3 --output ./downloads

# Extract 1080p MP4 video
npx yt-dl "https://youtu.be/dQw4w9WgXcQ" -f mp4 -q 1080p -o ./downloads
```

### Python SDK & CLI (`yt-dl-py`)
```bash
# Install locally in editable mode
pip install -e .

# Run CLI in JSON inspection mode
yt-dl-py "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --info --json
```

```python
from yt_downloader import validate_youtube_url

res = validate_youtube_url("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
assert res.is_valid is True
print(res.clean_url, res.video_id)
```

---

## ⚙️ 3. Using as a GitHub Action in CI/CD Workflows

Embed `migu3lls/yt_downloader` in your own `.github/workflows/` pipelines:

```yaml
steps:
  - name: Validate & Inspect YouTube Source
    id: yt
    uses: migu3lls/yt_downloader@main
    with:
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      info-only: "true"

  - name: Print Sanitized Canonical URL
    run: echo "Verified Video ID: ${{ steps.yt.outputs.video-id }}"
```

---

## 🏗️ 4. System Architecture (Reference Web Studio & BaaS)

```text
┌────────────────────────────────────────────────────────────────┐
│        DEVELOPER CONSUMERS: CLI (yt-dl) / SDK / CI Action      │
│     Programmatic TS & Python APIs • JSON Automation Output     │
└──────────────────────────────┬─────────────────────────────────┘
                               │
┌──────────────────────────────▼─────────────────────────────────┐
│             WEB STUDIO: Next.js 15 (App Router)                │
│      React 19 + TypeScript + Tailwind CSS (10ATIVAS V2)        │
│            Framer Motion + Ephemeral Session Hooks             │
└──────────────────────────────┬─────────────────────────────────┘
                               │ HTTPS / WSS
                               ▼
┌────────────────────────────────────────────────────────────────┐
│             SECURITY & BaaS GATEWAY: Supabase                  │
│  - Zero-Shell Validator (CWE-78 / CWE-88 Flag Sanitization)    │
│  - Token-Bucket Rate Limiter (Per-IP & Ephemeral Session)      │
│  - Supabase Auth / Postgres RLS / Realtime WSS / Vault         │
└──────────────────────────────┬─────────────────────────────────┘
                               │ Isolated Subprocess (execFile/spawn)
                               ▼
┌────────────────────────────────────────────────────────────────┐
│           EXTRACTION ENGINE: yt-dlp + FFmpeg                   │
│         Python 3.12+ & Node 22 (Native or Docker Slim)         │
│         UUID Directory Isolation + 20-Min Auto-TTL Purge       │
└────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start (Local Development & Docker)

### Option A: Docker Compose (Zero Local Setup)
```bash
git clone https://github.com/migu3lls/yt_downloader.git
cd yt_downloader
docker compose up --build
```

### Option B: Local Node.js + Python Runtime
```bash
git clone https://github.com/migu3lls/yt_downloader.git
cd yt_downloader
npm install

# Run Linter & Unit Tests (TypeScript + Python)
npm run lint
npm test
python -m unittest discover -s tests -p "test_*.py" -v

# Start Next.js 15 Dev Server
npm run dev
```

---

## 📁 Repository Structure

```text
yt_downloader/
├── .github/workflows/ci.yml     # Automated Node 22 & Python 3.12 CI pipeline
├── action.yml                   # Reusable Composite GitHub Action
├── bin/yt-dl.mjs                # Standalone cross-platform Node.js CLI binary
├── python/yt_downloader/        # Python SDK & CLI package (yt-downloader-cli)
│   ├── __init__.py
│   ├── validator.py             # Python zero-shell URL validator
│   └── cli.py                   # Python CLI entrypoint (yt-dl-py)
├── src/
│   ├── index.ts                 # Main TypeScript SDK programmatic entrypoint
│   ├── cli/                     # TypeScript CLI parser and runner
│   ├── app/                     # Next.js 15 App Router UI & REST API routes
│   ├── components/              # 10ATIVAS V2 React 19 UI components
│   └── lib/
│       ├── jobs/                # Non-blocking yt-dlp subprocess manager
│       ├── security/            # URL sanitizer (CWE-78/88) & Token-Bucket Rate Limiter
│       ├── session/             # Ephemeral sessionStorage lifecycle
│       └── supabase/            # Volatile Supabase client integration
├── tests/
│   ├── validator.test.ts        # Vitest security & anti-injection test suite
│   ├── cli.test.ts              # Vitest CLI & rate-limiter unit tests
│   └── test_python_validator.py # Python unittest security suite
├── Dockerfile                   # Multi-stage Node 22 + Python 3 + FFmpeg production image
├── docker-compose.yml           # One-command container orchestration
├── pyproject.toml               # PEP 621 Python package configuration
├── package.json                 # npm SDK, CLI & Next.js configuration
├── LICENSE                      # MIT License
├── SECURITY.md                  # Vulnerability disclosure & CWE mitigation policy
├── CONTRIBUTING.md              # Developer contribution guide
└── CHANGELOG.md                 # Semantic versioning history
```

---

## 🛡️ Security & Open-Source Governance

- **License:** Distributed under the [MIT License](LICENSE).
- **Security Policy:** See [SECURITY.md](SECURITY.md) for CWE-78/CWE-88 mitigation architecture and responsible disclosure.
- **Contributing:** See [CONTRIBUTING.md](CONTRIBUTING.md) for test suite requirements and PR guidelines.
