"use client";

import { formatDuration } from "@/lib/utils";
import { motion } from "framer-motion";
import { Clock, Download, FileAudio, ListMusic, Music, Sparkles, User, Video } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useState } from "react";

export interface MediaMetadata {
  url: string;
  videoId: string;
  title: string;
  author: string;
  duration?: number;
  thumbnailUrl: string;
  isPlaylist?: boolean;
  playlistCount?: number;
}

interface MediaCardProps {
  media: MediaMetadata;
  onDownload: (options: {
    format: "mp3" | "mp4";
    quality: string;
    downloadPlaylist: boolean;
  }) => void;
  isProcessing: boolean;
}

const VIDEO_QUALITIES = [
  { id: "best", label: "Melhor Disponível (Original)" },
  { id: "1080p", label: "Full HD 1080p" },
  { id: "720p", label: "HD 720p" },
  { id: "480p", label: "SD 480p" },
  { id: "360p", label: "Econômico 360p" },
];

export function MediaCard({ media, onDownload, isProcessing }: MediaCardProps) {
  const [format, setFormat] = useState<"mp3" | "mp4">("mp3");
  const [quality, setQuality] = useState<string>("best");
  const [downloadPlaylist, setDownloadPlaylist] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDownload({
      format,
      quality,
      downloadPlaylist,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-2xl mx-auto rounded-card bg-[#141414] border border-white/10 overflow-hidden shadow-ambient-dark"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Preview da Thumbnail */}
        <div className="relative sm:w-60 h-44 sm:h-auto shrink-0 bg-brand-obsidian overflow-hidden">
          <img
            src={media.thumbnailUrl || "/brand/logo-compacta-dark.svg"}
            alt={media.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {media.duration ? (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[11px] font-mono text-white flex items-center gap-1 border border-white/10">
              <Clock className="w-3 h-3 text-brand-green" />
              <span>{formatDuration(media.duration)}</span>
            </div>
          ) : null}

          {media.isPlaylist && (
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-brand-obsidian/90 text-[10px] font-mono text-brand-green flex items-center gap-1 border border-brand-green/30">
              <ListMusic className="w-3 h-3" />
              <span>PLAYLIST</span>
            </div>
          )}
        </div>

        {/* Informações e Seletor */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg line-clamp-2 leading-snug mb-1">
              {media.title}
            </h3>
            <p className="text-brand-gray-400 text-xs flex items-center gap-1.5 mb-4 font-mono">
              <User className="w-3.5 h-3.5 text-brand-green" />
              <span>{media.author || "YouTube"}</span>
            </p>

            {/* Alternador de Formato (Tabs) */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-control bg-brand-obsidian border border-white/5 mb-4">
              <button
                type="button"
                onClick={() => setFormat("mp3")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded text-xs font-semibold transition-all cursor-pointer ${
                  format === "mp3"
                    ? "bg-brand-green text-brand-obsidian shadow-[0_0_12px_rgba(24,226,153,0.2)]"
                    : "text-brand-gray-400 hover:text-white"
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>MP3 (Áudio)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat("mp4")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded text-xs font-semibold transition-all cursor-pointer ${
                  format === "mp4"
                    ? "bg-brand-green text-brand-obsidian shadow-[0_0_12px_rgba(24,226,153,0.2)]"
                    : "text-brand-gray-400 hover:text-white"
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>MP4 (Vídeo)</span>
              </button>
            </div>

            {/* Opções de Resolução para MP4 */}
            {format === "mp4" ? (
              <div className="mb-4">
                <label
                  htmlFor="video-quality-select"
                  className="block text-[11px] font-mono text-brand-gray-400 uppercase mb-1.5"
                >
                  Qualidade do Vídeo
                </label>
                <select
                  id="video-quality-select"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full px-3 py-2 rounded-control bg-brand-obsidian border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-brand-green transition-colors"
                >
                  {VIDEO_QUALITIES.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="mb-4 px-3 py-2 rounded-control bg-brand-obsidian/60 border border-white/5 flex items-center justify-between text-xs font-mono text-brand-gray-400">
                <span className="flex items-center gap-1.5">
                  <FileAudio className="w-3.5 h-3.5 text-brand-green" />
                  Taxa de Bits
                </span>
                <span className="text-brand-green font-semibold">320 kbps (HQ)</span>
              </div>
            )}

            {/* Playlist Checkbox */}
            {media.isPlaylist && (
              <label className="flex items-center gap-2 mb-4 text-xs text-brand-gray-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={downloadPlaylist}
                  onChange={(e) => setDownloadPlaylist(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-green bg-brand-obsidian border-white/20 focus:ring-brand-green"
                />
                <span>Baixar playlist completa</span>
              </label>
            )}
          </div>

          {/* Botão de Download */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full py-2.5 px-4 rounded-pill bg-brand-green hover:bg-brand-green-deep text-brand-obsidian font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(24,226,153,0.3)] hover:shadow-[0_0_20px_rgba(24,226,153,0.5)] cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isProcessing ? "Processando..." : `Baixar ${format.toUpperCase()}`}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
