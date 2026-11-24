"""
Command-line interface for yt-downloader-cli (`yt-dl-py`).
"""

import argparse
import json
from pathlib import Path
import subprocess
import sys
from typing import List, Optional

from .validator import validate_youtube_url


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="yt-dl-py",
        description="Hardened Python CLI & SDK for zero-shell-injection YouTube extraction.",
    )
    parser.add_argument("url", help="YouTube video, Shorts, or playlist URL")
    parser.add_argument(
        "-f",
        "--format",
        choices=["mp3", "mp4"],
        default="mp4",
        help="Target container format (default: mp4)",
    )
    parser.add_argument(
        "-q",
        "--quality",
        default="1080p",
        help="Video quality tier: 2160p, 1080p, 720p, 480p, best (default: 1080p)",
    )
    parser.add_argument(
        "-o",
        "--output",
        default=".",
        help="Output directory (default: current directory)",
    )
    parser.add_argument(
        "-i",
        "--info",
        action="store_true",
        help="Validate and inspect metadata without downloading media",
    )
    parser.add_argument(
        "--playlist",
        action="store_true",
        help="Allow downloading entire playlist when list parameter is present",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output structured JSON for CI/CD and automation pipelines",
    )
    return parser


def main(argv: Optional[List[str]] = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    validation = validate_youtube_url(args.url)
    if not validation.is_valid or not validation.clean_url:
        if args.json:
            print(json.dumps({"ok": False, "error": validation.error}, indent=2), file=sys.stderr)
        else:
            print(f"[SECURITY BLOCK] {validation.error}", file=sys.stderr)
        return 1

    if args.info:
        print(
            json.dumps(
                {
                    "ok": True,
                    "clean_url": validation.clean_url,
                    "video_id": validation.video_id,
                    "is_playlist": validation.is_playlist,
                    "playlist_id": validation.playlist_id,
                },
                indent=2,
            )
        )
        return 0

    out_dir = Path(args.output).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    template = str(out_dir / "%(title).100s.%(ext)s")

    cmd = [sys.executable, "-m", "yt_dlp", "--newline", "--no-colors", "--no-warnings"]
    if not args.playlist:
        cmd.append("--no-playlist")

    if args.format == "mp3":
        cmd.extend(["-x", "--audio-format", "mp3", "--audio-quality", "0", "-o", template, validation.clean_url])
    else:
        height = args.quality.rstrip("p")
        selector = (
            "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/best"
            if args.quality == "best"
            else f"bv*[height<={height}][ext=mp4]+ba[ext=m4a]/b[height<={height}][ext=mp4]/best[height<={height}]"
        )
        cmd.extend(["-f", selector, "--merge-output-format", "mp4", "-o", template, validation.clean_url])

    proc = subprocess.run(cmd, check=False)
    return proc.returncode


if __name__ == "__main__":
    sys.exit(main())
