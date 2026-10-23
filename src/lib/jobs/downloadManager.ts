import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

export interface DownloadJob {
  id: string;
  url: string;
  format: "mp3" | "mp4";
  quality: string;
  downloadPlaylist: boolean;
  status: "starting" | "downloading" | "converting" | "ready" | "error";
  progressPercent: number;
  speed: string;
  eta: string;
  title: string;
  filePath?: string;
  fileName?: string;
  errorMessage?: string;
  createdAt: number;
}

const activeJobs = new Map<string, DownloadJob>();

export function getJob(jobId: string): DownloadJob | undefined {
  return activeJobs.get(jobId);
}

export async function createDownloadJob(params: {
  url: string;
  format: "mp3" | "mp4";
  quality: string;
  downloadPlaylist: boolean;
  title?: string;
}): Promise<string> {
  const jobId = crypto.randomUUID();
  const tempDir = path.join(os.tmpdir(), "10ativas_downloads", jobId);
  await fs.mkdir(tempDir, { recursive: true });

  const job: DownloadJob = {
    id: jobId,
    url: params.url,
    format: params.format,
    quality: params.quality,
    downloadPlaylist: params.downloadPlaylist,
    status: "starting",
    progressPercent: 5,
    speed: "Iniciando...",
    eta: "--",
    title: params.title || "Mídia",
    createdAt: Date.now(),
  };

  activeJobs.set(jobId, job);

  // Run in background
  executeDownload(job, tempDir);

  return jobId;
}

function executeDownload(job: DownloadJob, tempDir: string) {
  const outputTemplate = path.join(tempDir, "%(title).100s.%(ext)s");

  const args = ["-m", "yt_dlp", "--newline", "--no-colors", "--no-warnings"];

  if (!job.downloadPlaylist) {
    args.push("--no-playlist");
  }

  if (job.format === "mp3") {
    args.push("-x", "--audio-format", "mp3", "--audio-quality", "0", "-o", outputTemplate, job.url);
  } else {
    // MP4 Video
    let formatSelector = "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/best";
    if (job.quality !== "best") {
      const height = job.quality.replace("p", "");
      formatSelector = `bv*[height<=${height}][ext=mp4]+ba[ext=m4a]/b[height<=${height}][ext=mp4]/best[height<=${height}]`;
    }

    args.push("-f", formatSelector, "--merge-output-format", "mp4", "-o", outputTemplate, job.url);
  }

  const child = spawn("python", args);

  child.stdout?.on("data", (chunk: Buffer) => {
    const text = chunk.toString();
    const lines = text.split("\n");

    for (const line of lines) {
      // Parse progress: [download]  45.2% of 12.34MiB at 3.45MiB/s ETA 00:03
      if (line.includes("[download]") && line.includes("%")) {
        job.status = "downloading";
        const percentMatch = line.match(/(\d+\.?\d*)%/);
        if (percentMatch) {
          job.progressPercent = Math.min(98, Number.parseFloat(percentMatch[1]));
        }

        const speedMatch = line.match(/at\s+([~0-9.]+[a-zA-Z]+\/s)/);
        if (speedMatch) {
          job.speed = speedMatch[1];
        }

        const etaMatch = line.match(/ETA\s+(\S+)/);
        if (etaMatch) {
          job.eta = etaMatch[1];
        }
      } else if (line.includes("[ExtractAudio]") || line.includes("[Merger]")) {
        job.status = "converting";
        job.progressPercent = 95;
        job.speed = "FFmpeg";
        job.eta = "Finalizando";
      }
    }
  });

  child.stderr?.on("data", (chunk: Buffer) => {
    const errText = chunk.toString();
    // yt-dlp outputs progress sometimes on stderr
    if (errText.includes("ERROR:")) {
      job.errorMessage = errText.split("ERROR:")[1]?.trim() || "Erro desconhecido.";
    }
  });

  child.on("close", async (code) => {
    if (code === 0) {
      try {
        const files = await fs.readdir(tempDir);
        const targetFile =
          files.find(
            (f) => f.endsWith(`.${job.format}`) || (job.format === "mp4" && f.endsWith(".mp4")),
          ) || files[0];

        if (targetFile) {
          job.filePath = path.join(tempDir, targetFile);
          job.fileName = targetFile;
          job.status = "ready";
          job.progressPercent = 100;
          job.speed = "Concluído";
          job.eta = "0s";
          return;
        }
      } catch (err) {
        console.error("Erro ao localizar arquivo baixado:", err);
      }
    }

    job.status = "error";
    if (!job.errorMessage) {
      job.errorMessage = "Falha durante o download ou conversão do vídeo.";
    }
  });

  // Auto-cleanup job after 20 minutes
  setTimeout(
    async () => {
      activeJobs.delete(job.id);
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup error
      }
    },
    20 * 60 * 1000,
  );
}

export async function cleanupJob(jobId: string): Promise<void> {
  const job = activeJobs.get(jobId);
  if (job?.filePath) {
    const dir = path.dirname(job.filePath);
    try {
      await fs.rm(dir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error
    }
  }
  activeJobs.delete(jobId);
}
