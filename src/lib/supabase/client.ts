import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client adhering strictly to ephemeral storage rules:
 * - Uses sessionStorage instead of localStorage so no tokens persist after tab close.
 * - Detects missing env vars gracefully and supports dynamic injection.
 */

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Custom sessionStorage adapter for Supabase Auth
const sessionStorageAdapter = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    return window.sessionStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(key, value);
  },
  removeItem: (key: string): void => {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: sessionStorageAdapter,
    autoRefreshToken: true,
    persistSession: true, // stored only in sessionStorage
    detectSessionInUrl: false,
  },
});
