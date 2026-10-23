"use client";

import { validateYouTubeUrl } from "@/lib/security/validator";
import { ArrowRight, CheckCircle2, ClipboardPaste, Link2, Loader2, X } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UrlInputPillProps {
  onAnalyze: (url: string) => Promise<void>;
  isLoading: boolean;
}

export function UrlInputPill({ onAnalyze, isLoading }: UrlInputPillProps) {
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!url.trim()) {
      setIsValid(null);
      return;
    }
    const result = validateYouTubeUrl(url);
    setIsValid(result.isValid);
  }, [url]);

  const handlePaste = async () => {
    try {
      if (!navigator.clipboard?.readText) {
        toast.info("Cole o link utilizando Ctrl+V / Cmd+V.");
        return;
      }
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        const result = validateYouTubeUrl(text);
        if (result.isValid && result.cleanUrl) {
          toast.success("Link do YouTube reconhecido!");
          onAnalyze(result.cleanUrl);
        } else {
          toast.error("O texto da área de transferência não é um link válido do YouTube.");
        }
      }
    } catch {
      toast.info("Permissão de colagem bloqueada. Use Ctrl+V.");
    }
  };

  const handleClear = () => {
    setUrl("");
    setIsValid(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Cole um link do YouTube para começar.");
      return;
    }

    const validation = validateYouTubeUrl(url);
    if (!validation.isValid || !validation.cleanUrl) {
      toast.error(validation.error || "Link inválido.");
      return;
    }

    onAnalyze(validation.cleanUrl);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto relative group transition-all"
    >
      <div
        className={`relative flex items-center w-full px-4 py-2.5 sm:py-3 rounded-pill bg-[#141414] border transition-all duration-300 shadow-ambient ${
          isValid === true
            ? "border-brand-green/60 shadow-[0_0_20px_rgba(24,226,153,0.15)]"
            : isValid === false
              ? "border-brand-error/60 shadow-[0_0_20px_rgba(212,86,86,0.15)]"
              : "border-white/10 focus-within:border-brand-green/50 focus-within:shadow-[0_0_20px_rgba(24,226,153,0.1)]"
        }`}
      >
        <div className="shrink-0 text-brand-gray-400 group-focus-within:text-brand-green transition-colors mr-3">
          <Link2 className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Cole aqui o link do vídeo, shorts ou playlist do YouTube..."
          disabled={isLoading}
          className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-brand-gray-500 focus:outline-none disabled:opacity-50"
        />

        <div className="flex items-center gap-2 shrink-0 ml-2">
          {url ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-full text-brand-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Limpar campo"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePaste}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-pill bg-white/5 hover:bg-white/10 text-xs text-brand-gray-300 hover:text-white border border-white/5 transition-all cursor-pointer"
              title="Colar da área de transferência"
            >
              <ClipboardPaste className="w-3.5 h-3.5 text-brand-green" />
              <span>Colar</span>
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-pill bg-brand-green hover:bg-brand-green-deep text-brand-obsidian font-semibold text-xs sm:text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_12px_rgba(24,226,153,0.3)] hover:shadow-[0_0_16px_rgba(24,226,153,0.5)] cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Analisando...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Analisar</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {isValid === true && (
        <div className="flex items-center gap-1.5 mt-2 ml-4 text-[11px] font-mono text-brand-green/90 animate-fadeIn">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Link verificado e seguro para extração</span>
        </div>
      )}
    </form>
  );
}
