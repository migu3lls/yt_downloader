"use client";

import { motion } from "framer-motion";
import React from "react";

interface AnimatedLogoRevealProps {
  variant?: "full" | "compact" | "icon";
  className?: string;
  autoPlay?: boolean;
}

export function AnimatedLogoReveal({ variant = "full", className = "" }: AnimatedLogoRevealProps) {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Símbolo Paramétrico Oficial 10ATIVAS */}
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* Pulso Esmeralda Radial (Fase 2) */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.4, 1], opacity: [0, 0.4, 0] }}
          transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-brand-green/30 blur-md pointer-events-none"
        />

        {/* Traçado Vetorial com Animação Bézier (Fase 1 e 2) */}
        <svg
          role="img"
          aria-label="10Ativas Símbolo Oficial"
          viewBox="0 0 100 100"
          className="w-10 h-10 drop-shadow-[0_0_10px_rgba(24,226,153,0.3)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>10Ativas Símbolo Oficial</title>
          {/* Filamentos Poligonais Entrelaçados */}
          <motion.path
            d="M 50 10 L 85 30 L 85 70 L 50 90 L 15 70 L 15 30 Z"
            stroke="#18E299"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.path
            d="M 50 25 L 75 40 L 75 60 L 50 75 L 25 60 L 25 40 Z"
            stroke="#0FA76E"
            strokeWidth="3"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
          />

          <motion.circle
            cx="50"
            cy="50"
            r="8"
            fill="#18E299"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6, type: "spring", stiffness: 260 }}
          />
        </svg>
      </div>

      {/* Revelação Tipográfica Sora (Fase 3) */}
      {variant !== "icon" && (
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col"
        >
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-white text-xl">
            <span>10Ativas</span>
            <span className="text-brand-green text-xs font-mono font-medium tracking-widest px-1.5 py-0.5 rounded bg-brand-green/10 border border-brand-green/30">
              STUDIO
            </span>
          </div>
          <span className="text-[10px] text-brand-gray-400 font-mono tracking-wider uppercase -mt-0.5">
            Media Converter
          </span>
        </motion.div>
      )}
    </div>
  );
}
