"""
yt_downloader — Hardened Python SDK & CLI for zero-shell-injection YouTube extraction.
"""

from .validator import ValidatedYouTubeUrl, validate_youtube_url

__all__ = ["ValidatedYouTubeUrl", "validate_youtube_url"]
__version__ = "1.1.0"
