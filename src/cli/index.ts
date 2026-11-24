import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { validateYouTubeUrl } from "../lib/security/validator";

export interface CliOptions {
  url?: string;
  format: "mp3" | "mp4";
  quality: string;
  outputDir: string;
  infoOnly: boolean;
  json: boolean;
  playlist: boolean;
  help: boolean;
  version: boolean;
}

export function parseCliArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    format: "mp4",
    quality: "1080p",
    outputDir: process.cwd(),
    infoOnly: false,
    json: false,
    playlist: false,
    help: false,
    version: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") {
      options.help = true;
    } else if (arg === "-v" || arg === "--version") {
      options.version = true;
    } else if (arg === "-i" || arg === "--info") {
      options.infoOnly = true;
    } else if (arg === "--json") {
      options.json = true;
    } else if (arg === "--playlist") {
      options.playlist = true;
    } else if (arg === "-f" || arg === "--format") {
      const val = argv[++i]?.toLowerCase();
      if (val === "mp3" || val === "mp4") {
        options.format = val;
      } else {
        throw new Error(`Invalid format "${val}". Expected "mp3" or "mp4".`);
      }
    } else if (arg === "-q" || arg === "--quality") {
      const val = argv[++i];
      if (!val) throw new Error("Missing value for --quality.");
      options.quality = val;
    } else if (arg === "-o" || arg === "--output") {
      const val = argv[++i];
      if (!val) throw new Error("Missing value for --output.");
      options.outputDir = path.resolve(val);
    } else if (!arg.startsWith("-")) {
      if (!options.url) {
        options.url = arg;
      }
    } else {
      throw new Error(`Unknown flag "${arg}". Run with --help for usage information.`);
    }
  }

  return options;
}

export function formatHelpText(): string {
  return `
yt-downloader-sdk (v1.1.0) — Hardened YouTube Extraction CLI & Developer SDK

USAGE:
  yt-dl <youtube-url> [options]

OPTIONS:
  -f, --format <mp3|mp4>     Target container format (default: mp4)
  -q, --quality <tier>       Video resolution tier: 2160p, 1080p, 720p, 480p, best (default: 1080p)
  -o, --output <dir>         Destination directory (default: current working directory)
  -i, --info                 Inspect and validate metadata without downloading media
      --playlist             Allow full playlist extraction when URL contains list parameter
      --json                 Emit structured JSON output for CI/CD and script pipelines
  -v, --version              Print CLI version
  -h, --help                 Display this help guide

EXAMPLES:
  yt-dl "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --format mp3
  yt-dl "https://youtu.be/dQw4w9WgXcQ" -f mp4 -q 1080p -o ./downloads
  yt-dl "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --info --json
`.trim();
}

export async function runCli(argv: string[] = process.argv.slice(2)): Promise<number> {
  try {
    const opts = parseCliArgs(argv);

    if (opts.version) {
      console.log("1.1.0");
      return 0;
    }

    if (opts.help || !opts.url) {
      console.log(formatHelpText());
      return opts.help ? 0 : 1;
    }

    const validation = validateYouTubeUrl(opts.url);
    if (!validation.isValid || !validation.cleanUrl) {
      const errPayload = {
        ok: false,
        error: validation.error || "Invalid YouTube URL",
      };
      if (opts.json) {
        console.error(JSON.stringify(errPayload, null, 2));
      } else {
        console.error(`[SECURITY BLOCK] ${errPayload.error}`);
      }
      return 1;
    }

    if (opts.infoOnly) {
      const metadata = await fetchVideoMetadata(validation.cleanUrl);
      if (opts.json) {
        console.log(JSON.stringify({ ok: true, validation, metadata }, null, 2));
      } else {
        console.log(`Title    : ${metadata.title}`);
        console.log(`Channel  : ${metadata.uploader}`);
        console.log(`Duration : ${metadata.duration}s`);
        console.log(`Video ID : ${validation.videoId}`);
        console.log(`Clean URL: ${validation.cleanUrl}`);
      }
      return 0;
    }

    await fs.mkdir(opts.outputDir, { recursive: true });
    const outputTemplate = path.join(opts.outputDir, "%(title).100s.%(ext)s");

    const args = ["-m", "yt_dlp", "--newline", "--no-colors", "--no-warnings"];
    if (!opts.playlist) {
      args.push("--no-playlist");
    }

    if (opts.format === "mp3") {
      args.push(
        "-x",
        "--audio-format",
        "mp3",
        "--audio-quality",
        "0",
        "-o",
        outputTemplate,
        validation.cleanUrl,
      );
    } else {
      let formatSelector = "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/best";
      if (opts.quality !== "best") {
        const height = opts.quality.replace("p", "");
        formatSelector = `bv*[height<=${height}][ext=mp4]+ba[ext=m4a]/b[height<=${height}][ext=mp4]/best[height<=${height}]`;
      }
      args.push(
        "-f",
        formatSelector,
        "--merge-output-format",
        "mp4",
        "-o",
        outputTemplate,
        validation.cleanUrl,
      );
    }

    if (!opts.json) {
      console.log(`[yt-dl] Starting hardened extraction -> ${validation.cleanUrl}`);
    }

    const exitCode = await new Promise<number>((resolve) => {
      const child = spawn("python", args, {
        stdio: opts.json ? "ignore" : "inherit",
      });
      child.on("close", (code) => resolve(code ?? 1));
      child.on("error", () => resolve(1));
    });

    if (opts.json) {
      console.log(
        JSON.stringify(
          {
            ok: exitCode === 0,
            url: validation.cleanUrl,
            format: opts.format,
            quality: opts.quality,
            outputDir: opts.outputDir,
            exitCode,
          },
          null,
          2,
        ),
      );
    }

    return exitCode;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Error: ${message}`);
    return 1;
  }
}

async function fetchVideoMetadata(cleanUrl: string): Promise<{
  id: string;
  title: string;
  uploader: string;
  duration: number;
}> {
  return new Promise((resolve, reject) => {
    const args = [
      "-m",
      "yt_dlp",
      "--dump-json",
      "--no-warnings",
      "--no-playlist",
      "--skip-download",
      cleanUrl,
    ];
    const child = spawn("python", args);
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.on("close", (code) => {
      if (code !== 0 || !stdout.trim()) {
        reject(new Error(stderr.trim() || "Failed to inspect metadata via yt-dlp"));
        return;
      }
      try {
        const parsed = JSON.parse(stdout);
        resolve({
          id: parsed.id,
          title: parsed.title,
          uploader: parsed.uploader || parsed.channel || "Unknown",
          duration: parsed.duration || 0,
        });
      } catch (e) {
        reject(e);
      }
    });
  });
}
