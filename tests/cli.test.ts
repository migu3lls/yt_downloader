import { describe, expect, it } from "vitest";
import { formatHelpText, parseCliArgs } from "../src/cli/index";
import { checkRateLimit } from "../src/lib/security/rateLimit";

describe("Developer CLI Argument Parser (yt-dl)", () => {
  it("parses URL, format, quality, output directory and flags properly", () => {
    const opts = parseCliArgs([
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "--format",
      "mp3",
      "-q",
      "720p",
      "-o",
      "./custom-dir",
      "--info",
      "--json",
      "--playlist",
    ]);

    expect(opts.url).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(opts.format).toBe("mp3");
    expect(opts.quality).toBe("720p");
    expect(opts.infoOnly).toBe(true);
    expect(opts.json).toBe(true);
    expect(opts.playlist).toBe(true);
    expect(opts.outputDir).toContain("custom-dir");
  });

  it("supports short flags (-h, -v, -i, -f)", () => {
    const opts = parseCliArgs(["-h", "-v", "-i", "-f", "mp4"]);
    expect(opts.help).toBe(true);
    expect(opts.version).toBe(true);
    expect(opts.infoOnly).toBe(true);
    expect(opts.format).toBe("mp4");
  });

  it("throws descriptive error on unsupported container format", () => {
    expect(() => parseCliArgs(["-f", "avi"])).toThrow(/Invalid format/);
  });

  it("throws descriptive error on unknown CLI flag", () => {
    expect(() => parseCliArgs(["--malicious-flag"])).toThrow(/Unknown flag/);
  });

  it("renders developer usage help text", () => {
    const help = formatHelpText();
    expect(help).toContain("yt-downloader-sdk");
    expect(help).toContain("USAGE:");
    expect(help).toContain("--format <mp3|mp4>");
  });
});

describe("Token-Bucket Rate Limiter (SDK)", () => {
  it("allows requests within quota and blocks once threshold is reached", () => {
    const clientKey = `test_client_${Date.now()}`;
    const r1 = checkRateLimit(clientKey, 2, 60_000);
    const r2 = checkRateLimit(clientKey, 2, 60_000);
    const r3 = checkRateLimit(clientKey, 2, 60_000);

    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(1);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(0);
    expect(r3.allowed).toBe(false);
    expect(r3.remaining).toBe(0);
  });
});
