"use client";

import {
  getOrCreateEphemeralSessionToken,
  registerSessionPurgeHandlers,
} from "@/lib/session/ephemeral";
import { useEffect } from "react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize or verify ephemeral session token in sessionStorage
    getOrCreateEphemeralSessionToken();

    // Attach beforeunload and pagehide cleanup listeners
    const cleanup = registerSessionPurgeHandlers();
    return () => cleanup();
  }, []);

  return <>{children}</>;
}
