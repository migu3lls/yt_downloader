import { getJob } from "@/lib/jobs/downloadManager";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json({ error: "jobId não informado." }, { status: 400 });
  }

  const job = getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: "Download não encontrado ou expirado." }, { status: 404 });
  }

  return NextResponse.json({
    jobId: job.id,
    status: job.status,
    progressPercent: job.progressPercent,
    speed: job.speed,
    eta: job.eta,
    title: job.title,
    format: job.format,
    fileName: job.fileName,
    errorMessage: job.errorMessage,
    downloadUrl: job.status === "ready" ? `/api/download/file?jobId=${job.id}` : undefined,
  });
}
