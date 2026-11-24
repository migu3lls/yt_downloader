from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "python"))

from yt_downloader.validator import validate_youtube_url


class TestPythonYouTubeValidator(unittest.TestCase):
    def test_accepts_standard_watch_url(self) -> None:
        res = validate_youtube_url("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
        self.assertTrue(res.is_valid)
        self.assertEqual(res.video_id, "dQw4w9WgXcQ")
        self.assertEqual(res.clean_url, "https://www.youtube.com/watch?v=dQw4w9WgXcQ")

    def test_accepts_shortened_youtu_be_url(self) -> None:
        res = validate_youtube_url("https://youtu.be/dQw4w9WgXcQ")
        self.assertTrue(res.is_valid)
        self.assertEqual(res.video_id, "dQw4w9WgXcQ")

    def test_accepts_playlist_parameters(self) -> None:
        res = validate_youtube_url(
            "https://www.youtube.com/watch?v=IBbAn4jUAVM&list=RDIBbAn4jUAVM"
        )
        self.assertTrue(res.is_valid)
        self.assertTrue(res.is_playlist)
        self.assertEqual(res.playlist_id, "RDIBbAn4jUAVM")

    def test_rejects_command_injection_vectors(self) -> None:
        res1 = validate_youtube_url("https://youtube.com/watch?v=dQw4w9WgXcQ; rm -rf /")
        self.assertFalse(res1.is_valid)

        res2 = validate_youtube_url("--exec 'cat /etc/passwd'")
        self.assertFalse(res2.is_valid)

    def test_rejects_non_youtube_domains(self) -> None:
        res = validate_youtube_url("https://evil-youtube.com/watch?v=dQw4w9WgXcQ")
        self.assertFalse(res.is_valid)


if __name__ == "__main__":
    unittest.main()
