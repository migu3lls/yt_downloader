/**
 * Strict security validator for YouTube URLs to prevent command injection,
 * parameter tampering and malicious redirection.
 */

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
]);

export interface ValidatedYouTubeUrl {
  isValid: boolean;
  cleanUrl?: string;
  videoId?: string;
  isPlaylist?: boolean;
  playlistId?: string;
  error?: string;
}

export function validateYouTubeUrl(rawInput: string): ValidatedYouTubeUrl {
  if (!rawInput || typeof rawInput !== "string") {
    return { isValid: false, error: "Informe um link do YouTube válido." };
  }

  let trimmed = rawInput.trim();

  // Strip accidental wrapping quotes if copied from terminal/json
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    trimmed = trimmed.slice(1, -1).trim();
  }

  // Block flag injection attempts or dangerous shell metacharacters
  // Note: '&' and '?' are essential URL query string delimiters and must be permitted.
  if (trimmed.startsWith("-") || /\s/.test(trimmed) || /[;|`$<>^"']/.test(trimmed)) {
    return { isValid: false, error: "Link contém caracteres inválidos ou suspeitos." };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
  } catch {
    return { isValid: false, error: "Formato de URL inválido." };
  }

  const hostname = parsed.hostname.toLowerCase();
  if (!YOUTUBE_HOSTS.has(hostname)) {
    return {
      isValid: false,
      error: "O link informado não pertence aos domínios oficiais do YouTube.",
    };
  }

  let videoId: string | undefined;
  let isPlaylist = false;
  let playlistId: string | undefined;

  if (hostname === "youtu.be") {
    videoId = parsed.pathname.slice(1).split("/")[0];
  } else if (parsed.pathname === "/watch") {
    videoId = parsed.searchParams.get("v") || undefined;
  } else if (parsed.pathname.startsWith("/shorts/")) {
    videoId = parsed.pathname.split("/shorts/")[1]?.split("/")[0];
  } else if (parsed.pathname.startsWith("/embed/")) {
    videoId = parsed.pathname.split("/embed/")[1]?.split("/")[0];
  }

  const listParam = parsed.searchParams.get("list");
  if (listParam && /^[a-zA-Z0-9_-]+$/.test(listParam)) {
    isPlaylist = true;
    playlistId = listParam;
  }

  if (videoId && !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return { isValid: false, error: "Identificador de vídeo do YouTube inválido." };
  }

  if (!videoId && !playlistId) {
    return {
      isValid: false,
      error: "Nenhum vídeo ou playlist identificável encontrado no link.",
    };
  }

  // Generate canonical sanitized URL
  const cleanUrl = videoId
    ? `https://www.youtube.com/watch?v=${videoId}${isPlaylist ? `&list=${playlistId}` : ""}`
    : `https://www.youtube.com/playlist?list=${playlistId}`;

  return {
    isValid: true,
    cleanUrl,
    videoId,
    isPlaylist,
    playlistId,
  };
}
