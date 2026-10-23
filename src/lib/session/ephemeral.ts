/**
 * Ephemeral session manager:
 * - Persists tokens strictly in sessionStorage (cleared on tab close).
 * - Implements beforeunload and pagehide cleanup hooks.
 * - Forbids permanent localStorage auth token persistence.
 */

const SESSION_TOKEN_KEY = "10ativas_ephemeral_token";
const COOKIE_CONSENT_KEY = "10ativas_cookie_consent";

export function getOrCreateEphemeralSessionToken(): string {
  if (typeof window === "undefined") {
    return "";
  }

  let token = window.sessionStorage.getItem(SESSION_TOKEN_KEY);
  if (!token) {
    token = `anon_${crypto.randomUUID()}`;
    window.sessionStorage.setItem(SESSION_TOKEN_KEY, token);
  }

  return token;
}

export function clearEphemeralSession(): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(SESSION_TOKEN_KEY);
    // Ensure any sensitive session keys are purged
    for (let i = window.sessionStorage.length - 1; i >= 0; i--) {
      const key = window.sessionStorage.key(i);
      if (key && (key.includes("token") || key.includes("supabase") || key.includes("auth"))) {
        window.sessionStorage.removeItem(key);
      }
    }
  } catch (err) {
    console.error("Erro ao expurgar sessão efêmera:", err);
  }
}

export function registerSessionPurgeHandlers(): () => void {
  if (typeof window === "undefined") return () => {};

  const handleUnload = () => {
    // Optionally fire beacon to notify backend session termination
    const token = window.sessionStorage.getItem(SESSION_TOKEN_KEY);
    if (token && navigator.sendBeacon) {
      navigator.sendBeacon("/api/session/purge", JSON.stringify({ token }));
    }
    clearEphemeralSession();
  };

  window.addEventListener("beforeunload", handleUnload);
  window.addEventListener("pagehide", handleUnload);

  return () => {
    window.removeEventListener("beforeunload", handleUnload);
    window.removeEventListener("pagehide", handleUnload);
  };
}

export function getCookieConsent(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
}

export function setCookieConsent(accepted: boolean): void {
  if (typeof window === "undefined") return;
  if (accepted) {
    window.sessionStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
  } else {
    window.sessionStorage.removeItem(COOKIE_CONSENT_KEY);
  }
}
