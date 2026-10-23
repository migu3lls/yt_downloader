"use client";

import { FileText, Lock, Shield } from "lucide-react";
import Link from "next/link";
import React from "react";

export function BrandFooter() {
  return (
    <footer className="w-full border-t border-subtle bg-brand-obsidian py-10 mt-20 text-brand-gray-400 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2 text-white font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
            <span>10Ativas Media Studio</span>
            <span className="text-[10px] text-brand-gray-500 font-mono">v1.0.0</span>
          </div>
          <p className="text-center md:text-left text-brand-gray-500">
            Conversão e extração de mídia com privacidade efêmera e zero persistência de dados.
          </p>
        </div>

        <div className="flex items-center flex-wrap justify-center gap-6 font-mono text-[11px]">
          <Link
            href="/privacy"
            className="flex items-center gap-1.5 hover:text-brand-green transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Privacidade & Cookies</span>
          </Link>

          <Link
            href="/terms"
            className="flex items-center gap-1.5 hover:text-brand-green transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Termos de Uso Responsável</span>
          </Link>

          <div className="flex items-center gap-1.5 text-brand-gray-500">
            <Lock className="w-3.5 h-3.5 text-brand-green" />
            <span>Supabase Ephemeral Storage</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 pt-6 border-t border-white/5 text-center text-brand-gray-500 text-[11px]">
        Desenvolvido sob o 10Ativas Design System V2. Use apenas para conteúdos próprios ou com
        expressa permissão do autor.
      </div>
    </footer>
  );
}
