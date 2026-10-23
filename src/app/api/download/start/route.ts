import { createDownloadJob } from "@/lib/jobs/downloadManager";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { validateYouTubeUrl } from "@/lib/security/validator";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const sessionToken = req.headers.get("x-session-token") || ip;

    // Rate limiting: 10 downloads per hour per session/ip
    const rateCheck = checkRateLimit(`dl_${sessionToken}`, 10, 60 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Limite de downloads por hora atingido. Aguarde ${Math.ceil(
            rateCheck.resetInSec / 60,
          )} minutos.`,
        },
        { status: 429 },
      );
    }

    const body = await req.json();
    const { url, format, quality, downloadPlaylist, title } = body;

    const validation = validateYouTubeUrl(url);
    if (!validation.isValid || !validation.cleanUrl) {
      return NextResponse.json(
        { error: validation.error || "URL do YouTube inválida." },
        { status: 400 },
      );
    }

    if (format !== "mp3" && format !== "mp4") {
      return NextResponse.json({ error: "Formato inválido. Escolha MP3 ou MP4." }, { status: 400 });
    }

    const jobId = await createDownloadJob({
      url: validation.cleanUrl,
      format,
      quality: quality || "best",
      downloadPlaylist: Boolean(downloadPlaylist),
      title: title || "Vídeo",
    });

    return NextResponse.json({ jobId });
  } catch (error: unknown) {
    console.error("Erro ao iniciar download:", error);
    const msg =
      error instanceof Error ? error.message : "Falha ao iniciar o processamento do download.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
