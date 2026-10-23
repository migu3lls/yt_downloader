"use client";

import {
  DownloadProgressModal,
  type ProgressState,
} from "@/components/studio/DownloadProgressModal";
import { MediaCard, type MediaMetadata } from "@/components/studio/MediaCard";
import { UrlInputPill } from "@/components/studio/UrlInputPill";
import { motion } from "framer-motion";
import { ArrowDown, Check, Music, Shield, Sparkles, Zap } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

export default function HomePage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [media, setMedia] = useState<MediaMetadata | null>(null);

  const [progressState, setProgressState] = useState<ProgressState>({
    isOpen: false,
    status: "idle",
    progressPercent: 0,
    speed: "",
    eta: "",
    title: "",
    format: "mp3",
  });

  const handleAnalyzeUrl = async (cleanUrl: string) => {
    setAnalyzing(true);
    setMedia(null);

    try {
      const res = await fetch("/api/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Falha ao obter metadados do vídeo.");
      }

      setMedia(data);
      toast.success("Vídeo identificado com sucesso!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Não foi possível analisar o link.";
      toast.error(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStartDownload = async (options: {
    format: "mp3" | "mp4";
    quality: string;
    downloadPlaylist: boolean;
  }) => {
    if (!media) return;

    setProgressState({
      isOpen: true,
      status: "starting",
      progressPercent: 5,
      speed: "Preparando...",
      eta: "--",
      title: media.title,
      format: options.format,
    });

    try {
      const res = await fetch("/api/download/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: media.url,
          format: options.format,
          quality: options.quality,
          downloadPlaylist: options.downloadPlaylist,
          title: media.title,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Não foi possível iniciar o download.");
      }

      const jobId = data.jobId;
      pollJobStatus(jobId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro inesperado ao iniciar processamento.";
      setProgressState((prev) => ({
        ...prev,
        status: "error",
        errorMessage: msg,
      }));
    }
  };

  const pollJobStatus = (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/download/status?jobId=${jobId}`);
        const data = await res.json();

        if (!res.ok) {
          clearInterval(interval);
          setProgressState((prev) => ({
            ...prev,
            status: "error",
            errorMessage: data.error || "Falha ao monitorar progresso.",
          }));
          return;
        }

        setProgressState((prev) => ({
          ...prev,
          status: data.status,
          progressPercent: data.progressPercent || prev.progressPercent,
          speed: data.speed || prev.speed,
          eta: data.eta || prev.eta,
          downloadUrl: data.downloadUrl,
          errorMessage: data.errorMessage,
        }));

        if (data.status === "ready" || data.status === "error") {
          clearInterval(interval);
          if (data.status === "ready" && data.downloadUrl) {
            toast.success("Conversão finalizada! O download está disponível.");
          }
        }
      } catch (_err: unknown) {
        clearInterval(interval);
        setProgressState((prev) => ({
          ...prev,
          status: "error",
          errorMessage: "Erro de conexão ao verificar status.",
        }));
      }
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start pt-12 sm:pt-20 px-4 sm:px-6 relative">
      {/* Background Glows de Apoio (Atmospheric) */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-green/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Atmospheric Hero */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-white/5 border border-white/10 text-xs font-mono text-brand-gray-300 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          <span>ESTÚDIO DE MÍDIA 10ATIVAS • V2</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.15] mb-4"
        >
          Extração de Mídia de{" "}
          <span className="text-brand-green drop-shadow-[0_0_25px_rgba(24,226,153,0.3)]">
            Alta Fidelidade
          </span>
          .
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-brand-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
        >
          Converta vídeos e playlists do YouTube para MP3 de alta pureza sonora ou MP4 em até 1080p,
          com processamento na nuvem, sem anúncios e com privacidade efêmera estrita.
        </motion.p>
      </div>

      {/* Input Pill Central */}
      <div className="w-full mb-10">
        <UrlInputPill onAnalyze={handleAnalyzeUrl} isLoading={analyzing} />
      </div>

      {/* Card da Mídia Analisada */}
      {media && (
        <div className="w-full mb-16">
          <MediaCard
            media={media}
            onDownload={handleStartDownload}
            isProcessing={progressState.isOpen && progressState.status !== "ready"}
          />
        </div>
      )}

      {/* Grade de Pilares de Qualidade (Bento / Cards) */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="p-6 rounded-card bg-[#141414] border border-white/5 flex flex-col justify-between hover:border-brand-green/30 transition-all duration-300">
          <div>
            <div className="w-10 h-10 rounded-control bg-brand-green/10 flex items-center justify-center mb-4">
              <Music className="w-5 h-5 text-brand-green" />
            </div>
            <h4 className="text-white font-semibold text-base mb-1.5">Áudio Cristalino 320 kbps</h4>
            <p className="text-brand-gray-400 text-xs leading-relaxed">
              Extração direta dos streams de áudio do YouTube com conversão via FFmpeg em taxa de
              amostragem total e sem cortes de faixa.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 font-mono text-[11px] text-brand-green flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>MP3 High Quality</span>
          </div>
        </div>

        <div className="p-6 rounded-card bg-[#141414] border border-white/5 flex flex-col justify-between hover:border-brand-green/30 transition-all duration-300">
          <div>
            <div className="w-10 h-10 rounded-control bg-brand-green/10 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-brand-green" />
            </div>
            <h4 className="text-white font-semibold text-base mb-1.5">Vídeo MP4 até 1080p</h4>
            <p className="text-brand-gray-400 text-xs leading-relaxed">
              Seleção cirúrgica de streams de vídeo e áudio combinados (DASH) para garantir máxima
              resolução sem compressão excessiva.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 font-mono text-[11px] text-brand-green flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>1080p • 720p • 480p</span>
          </div>
        </div>

        <div className="p-6 rounded-card bg-[#141414] border border-white/5 flex flex-col justify-between hover:border-brand-green/30 transition-all duration-300">
          <div>
            <div className="w-10 h-10 rounded-control bg-brand-green/10 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-brand-green" />
            </div>
            <h4 className="text-white font-semibold text-base mb-1.5">Privacidade Efêmera</h4>
            <p className="text-brand-gray-400 text-xs leading-relaxed">
              Zero cookies persistentes em localStorage. A sessão é purgada ao fechar a aba e os
              arquivos são limpos após o download.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 font-mono text-[11px] text-brand-green flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>Supabase Ephemeral</span>
          </div>
        </div>
      </div>

      {/* Modal de Progresso Realtime */}
      <DownloadProgressModal
        state={progressState}
        onClose={() => setProgressState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
