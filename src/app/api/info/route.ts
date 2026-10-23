import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { checkRateLimit } from "@/lib/security/rateLimit";
import { validateYouTubeUrl } from "@/lib/security/validator";
import { type NextRequest, NextResponse } from "next/server";

const execFileAsync = promisify(execFile);

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const sessionToken = req.headers.get("x-session-token") || ip;

    // Rate limiting: 30 requests per minute
    const rateCheck = checkRateLimit(`info_${sessionToken}`, 30, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Limite de requisições excedido. Aguarde ${rateCheck.resetInSec} segundos.` },
        { status: 429 },
      );
    }

    const body = await req.json();
    const rawUrl = body?.url;

    const validation = validateYouTubeUrl(rawUrl);
    if (!validation.isValid || !validation.cleanUrl) {
      return NextResponse.json(
        { error: validation.error || "URL do YouTube inválida." },
        { status: 400 },
      );
    }

    // Execute yt-dlp safely using execFile (zero shell injection vector)
    const args = [
      "-m",
      "yt_dlp",
      "--dump-json",
      "--no-warnings",
      "--no-playlist",
      "--skip-download",
      validation.cleanUrl,
    ];

    const { stdout } = await execFileAsync("python", args, {
      timeout: 15000,
      maxBuffer: 10 * 1024 * 1024,
    });

    if (!stdout.trim()) {
      return NextResponse.json(
        { error: "Não foi possível obter informações deste vídeo." },
        { status: 502 },
      );
    }

    const data = JSON.parse(stdout);

    const metadata = {
      videoId: data.id || validation.videoId,
      url: validation.cleanUrl,
      title: data.title || "Vídeo sem título",
      author: data.uploader || data.channel || "Autor desconhecido",
      duration: data.duration || 0,
      thumbnailUrl:
        data.thumbnail ||
        (validation.videoId
          ? `https://img.youtube.com/vi/${validation.videoId}/hqdefault.jpg`
          : "/brand/logo-compacta-dark.svg"),
      isPlaylist: validation.isPlaylist,
      viewCount: data.view_count,
    };

    return NextResponse.json(metadata);
  } catch (error: unknown) {
    console.error("Erro na rota /api/info:", error);
    const msg = error instanceof Error ? error.message : "Falha ao processar metadados do vídeo.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
