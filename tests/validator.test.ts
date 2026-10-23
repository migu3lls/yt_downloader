import { describe, it, expect } from "vitest";
import { validateYouTubeUrl } from "../src/lib/security/validator";

describe("YouTube URL Security Validator", () => {
  it("aceita link padrão do YouTube watch", () => {
    const res = validateYouTubeUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(res.isValid).toBe(true);
    expect(res.videoId).toBe("dQw4w9WgXcQ");
    expect(res.cleanUrl).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  });

  it("aceita link encurtado youtu.be", () => {
    const res = validateYouTubeUrl("https://youtu.be/dQw4w9WgXcQ");
    expect(res.isValid).toBe(true);
    expect(res.videoId).toBe("dQw4w9WgXcQ");
    expect(res.cleanUrl).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  });

  it("aceita link do YouTube Shorts", () => {
    const res = validateYouTubeUrl("https://www.youtube.com/shorts/dQw4w9WgXcQ");
    expect(res.isValid).toBe(true);
    expect(res.videoId).toBe("dQw4w9WgXcQ");
  });

  it("rejeita tentativas de command injection com ponto e vírgula ou pipe", () => {
    const res1 = validateYouTubeUrl("https://youtube.com/watch?v=dQw4w9WgXcQ; rm -rf /");
    expect(res1.isValid).toBe(false);

    const res2 = validateYouTubeUrl("https://youtube.com/watch?v=dQw4w9WgXcQ | cat /etc/passwd");
    expect(res2.isValid).toBe(false);
  });

  it("rejeita injeção de flags do yt-dlp", () => {
    const res = validateYouTubeUrl("--output /tmp/malicious");
    expect(res.isValid).toBe(false);
  });

  it("rejeita domínios de phishing e não-YouTube", () => {
    const res = validateYouTubeUrl("https://fake-youtube.com/watch?v=dQw4w9WgXcQ");
    expect(res.isValid).toBe(false);
  });
});
