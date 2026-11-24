"""
Strict security validator for YouTube URLs to prevent command injection,
flag tampering, and SSRF / phishing domain redirection.
"""

from dataclasses import dataclass
import re
from typing import Optional
from urllib.parse import parse_qs, urlparse

YOUTUBE_HOSTS = {
    "youtube.com",
    "www.youtube.com",
    "m.youtube.com",
    "music.youtube.com",
    "youtu.be",
}

SHELL_METACHAR_RE = re.compile(r"[;|`$<>^\"'\s]")
VIDEO_ID_RE = re.compile(r"^[a-zA-Z0-9_-]{11}$")
PLAYLIST_ID_RE = re.compile(r"^[a-zA-Z0-9_-]+$")


@dataclass(frozen=True)
class ValidatedYouTubeUrl:
    is_valid: bool
    clean_url: Optional[str] = None
    video_id: Optional[str] = None
    is_playlist: bool = False
    playlist_id: Optional[str] = None
    error: Optional[str] = None


def validate_youtube_url(raw_input: str) -> ValidatedYouTubeUrl:
    if not raw_input or not isinstance(raw_input, str):
        return ValidatedYouTubeUrl(is_valid=False, error="Empty or non-string URL input.")

    trimmed = raw_input.strip()
    if (trimmed.startswith('"') and trimmed.endswith('"')) or (
        trimmed.startswith("'") and trimmed.endswith("'")
    ):
        trimmed = trimmed[1:-1].strip()

    if trimmed.startswith("-") or SHELL_METACHAR_RE.search(trimmed):
        return ValidatedYouTubeUrl(
            is_valid=False,
            error="URL contains prohibited shell metacharacters or CLI flag injection.",
        )

    candidate = trimmed if trimmed.startswith(("http://", "https://")) else f"https://{trimmed}"
    try:
        parsed = urlparse(candidate)
    except Exception:
        return ValidatedYouTubeUrl(is_valid=False, error="Malformed URL syntax.")

    hostname = (parsed.hostname or "").lower()
    if hostname not in YOUTUBE_HOSTS:
        return ValidatedYouTubeUrl(
            is_valid=False,
            error="Hostname does not belong to an official YouTube domain.",
        )

    video_id: Optional[str] = None
    is_playlist = False
    playlist_id: Optional[str] = None

    if hostname == "youtu.be":
        parts = parsed.path.lstrip("/").split("/")
        video_id = parts[0] if parts and parts[0] else None
    elif parsed.path == "/watch":
        qs = parse_qs(parsed.query)
        video_id = qs.get("v", [None])[0]
    elif parsed.path.startswith("/shorts/"):
        parts = parsed.path.split("/shorts/")
        video_id = parts[1].split("/")[0] if len(parts) > 1 else None
    elif parsed.path.startswith("/embed/"):
        parts = parsed.path.split("/embed/")
        video_id = parts[1].split("/")[0] if len(parts) > 1 else None

    qs = parse_qs(parsed.query)
    list_param = qs.get("list", [None])[0]
    if list_param and PLAYLIST_ID_RE.match(list_param):
        is_playlist = True
        playlist_id = list_param

    if video_id and not VIDEO_ID_RE.match(video_id):
        return ValidatedYouTubeUrl(is_valid=False, error="Invalid 11-character YouTube video ID.")

    if not video_id and not playlist_id:
        return ValidatedYouTubeUrl(
            is_valid=False,
            error="No identifiable YouTube video or playlist ID found.",
        )

    if video_id:
        suffix = f"&list={playlist_id}" if is_playlist and playlist_id else ""
        clean_url = f"https://www.youtube.com/watch?v={video_id}{suffix}"
    else:
        clean_url = f"https://www.youtube.com/playlist?list={playlist_id}"

    return ValidatedYouTubeUrl(
        is_valid=True,
        clean_url=clean_url,
        video_id=video_id,
        is_playlist=is_playlist,
        playlist_id=playlist_id,
    )
