import { promises as fs } from "node:fs";
import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import { cleanupJob, getJob } from "@/lib/jobs/downloadManager";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return new NextResponse("jobId ausente", { status: 400 });
  }

  const job = getJob(jobId);
  if (!job || !job.filePath || job.status !== "ready") {
    return new NextResponse("Arquivo não encontrado, ainda em processamento ou expirado.", {
      status: 404,
    });
  }

  try {
    const stat = await fs.stat(job.filePath);
    const nodeStream = createReadStream(job.filePath);
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;

    const contentType = job.format === "mp3" ? "audio/mpeg" : "video/mp4";
    // Encode filename safely for Content-Disposition header
    const safeFilename = encodeURIComponent(job.fileName || `media.${job.format}`).replace(
      /%20/g,
      " ",
    );

    // Schedule cleanup shortly after download starts to enforce ephemeral privacy
    setTimeout(() => {
      cleanupJob(jobId);
    }, 15000);

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": stat.size.toString(),
        "Content-Disposition": `attachment; filename="${safeFilename}"; filename*=UTF-8''${safeFilename}`,
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (err: unknown) {
    console.error("Erro ao servir arquivo:", err);
    return new NextResponse("Erro ao ler arquivo no servidor.", { status: 500 });
  }
}
