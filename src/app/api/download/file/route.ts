import { promises as fs } from "node:fs";
import { getJob } from "@/lib/jobs/downloadManager";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return new NextResponse("jobId ausente", { status: 400 });
  }

  const job = await getJob(jobId);
  if (!job || !job.filePath || job.status !== "ready") {
    return new NextResponse("Arquivo não encontrado, ainda em processamento ou expirado.", {
      status: 404,
    });
  }

  try {
    const fileBuffer = await fs.readFile(job.filePath);
    const contentType = job.format === "mp3" ? "audio/mpeg" : "video/mp4";

    // RFC 6266 compliant filename headers:
    // 1. ASCII fallback removing accents, pipe symbols and invalid HTTP header chars
    // 2. UTF-8 encoded version for full international character fidelity
    const rawName = job.fileName || `media.${job.format}`;
    const asciiFallback = rawName
      .replace(/[^\x20-\x7E]/g, "")
      .replace(/[^a-zA-Z0-9._ -]/g, "_")
      .trim();

    const utf8Encoded = encodeURIComponent(rawName);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileBuffer.length.toString(),
        "Content-Disposition": `attachment; filename="${asciiFallback}"; filename*=UTF-8''${utf8Encoded}`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err: unknown) {
    console.error("Erro ao servir arquivo:", err);
    return new NextResponse("Erro ao ler arquivo no servidor.", { status: 500 });
  }
}
