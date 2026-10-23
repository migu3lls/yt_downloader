"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Download, Loader2, X } from "lucide-react";
import React, { useEffect } from "react";

export interface ProgressState {
  isOpen: boolean;
  status: "idle" | "starting" | "downloading" | "converting" | "ready" | "error";
  progressPercent: number;
  speed: string;
  eta: string;
  title: string;
  format: string;
  downloadUrl?: string;
  errorMessage?: string;
}

interface DownloadProgressModalProps {
  state: ProgressState;
  onClose: () => void;
}

export function DownloadProgressModal({ state, onClose }: DownloadProgressModalProps) {
  useEffect(() => {
    if (state.status === "ready") {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#18E299", "#0FA76E", "#FFFFFF"],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [state.status]);

  if (!state.isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full max-w-lg rounded-featured bg-[#141414] border border-white/10 p-6 shadow-ambient-dark relative"
        >
          {/* Botão Fechar */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-brand-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Cabeçalho do Modal */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-brand-green/10 border border-brand-green/30 flex items-center justify-center">
              {state.status === "ready" ? (
                <CheckCircle2 className="w-5 h-5 text-brand-green" />
              ) : state.status === "error" ? (
                <AlertCircle className="w-5 h-5 text-brand-error" />
              ) : (
                <Loader2 className="w-5 h-5 text-brand-green animate-spin" />
              )}
            </div>

            <div>
              <h3 className="text-white font-semibold text-base sm:text-lg">
                {state.status === "ready"
                  ? "Download Concluído!"
                  : state.status === "error"
                    ? "Falha no Processamento"
                    : state.status === "converting"
                      ? "Convertendo com FFmpeg..."
                      : "Extraindo Mídia..."}
              </h3>
              <p className="text-brand-gray-400 text-xs font-mono line-clamp-1">
                {state.title || "Processando solicitação..."}
              </p>
            </div>
          </div>

          {/* Barra de Progresso */}
          {state.status !== "error" && (
            <div className="my-6">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-brand-gray-400">Progresso</span>
                <span className="text-brand-green font-bold text-sm">
                  {state.progressPercent.toFixed(1)}%
                </span>
              </div>

              <div className="w-full h-3 rounded-full bg-brand-obsidian border border-white/10 overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-green-deep to-brand-green relative"
                  style={{ width: `${Math.max(5, state.progressPercent)}%` }}
                  transition={{ ease: "easeOut", duration: 0.2 }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>

              {/* Métricas Técnicas em Geist Mono */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-mono text-brand-gray-400 bg-brand-obsidian/80 p-3 rounded-control border border-white/5">
                <div>
                  <span className="block text-[10px] text-brand-gray-500 uppercase">
                    Velocidade
                  </span>
                  <span className="text-white font-medium">{state.speed || "-- MB/s"}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-brand-gray-500 uppercase">
                    Tempo Estimado (ETA)
                  </span>
                  <span className="text-white font-medium">{state.eta || "-- seg"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Mensagem de Erro */}
          {state.status === "error" && (
            <div className="my-6 p-4 rounded-card bg-brand-error/10 border border-brand-error/30 text-xs text-brand-error font-mono">
              {state.errorMessage || "Ocorreu um erro durante a conversão do vídeo."}
            </div>
          )}

          {/* Ações */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/5">
            {state.status === "ready" && state.downloadUrl && (
              <a
                href={state.downloadUrl}
                download
                className="flex-1 py-2.5 px-4 rounded-pill bg-brand-green hover:bg-brand-green-deep text-brand-obsidian font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(24,226,153,0.3)] cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Salvar Arquivo ({state.format.toUpperCase()})</span>
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-pill bg-white/5 hover:bg-white/10 text-brand-gray-300 hover:text-white text-xs font-medium transition-colors"
            >
              {state.status === "ready" ? "Concluir" : "Fechar"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
