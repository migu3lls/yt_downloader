# Security Policy

## Architectural Security Commitments

`yt_downloader` (`yt-downloader-sdk` / `yt-downloader-cli`) is engineered as a reference implementation for **safe media subprocess orchestration**:

1. **Zero Shell Execution (`CWE-78` Mitigation):**
   - Subprocesses are invoked exclusively via `child_process.execFile` / `child_process.spawn` (Node.js) and `subprocess.run(..., shell=False)` (Python) without invoking `/bin/sh` or `cmd.exe`.
2. **Strict Parameter & Flag Injection Prevention (`CWE-88` Mitigation):**
   - User input is validated against strict domain allowlists (`youtube.com`, `youtu.be`), 11-character video ID regex patterns, and shell/flag metacharacter rejection (`-`, `;`, `|`, `` ` ``, `$`, `<`, `>`).
3. **Ephemeral Zero-Persistence Storage:**
   - No persistent credentials or session tokens are stored in `localStorage`. Temporary extraction artifacts are isolated per UUID job directory and automatically purged via TTL and `beforeunload` hooks.
4. **Edge-Compatible Token-Bucket Rate Limiting:**
   - All API endpoints enforce strict per-session and per-IP quotas.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a command injection bypass, SSRF vector, or rate-limit evasion vulnerability:
- **Do not open a public issue.**
- Please report it privately via GitHub Security Advisories (`Security -> Report a vulnerability`) or email `miguelldsilva@outlook.com`.
- We aim to acknowledge reports within 48 hours and release a patched version within 7 days.
