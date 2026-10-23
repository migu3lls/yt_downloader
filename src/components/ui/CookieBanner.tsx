"use client";

import { getCookieConsent, setCookieConsent } from "@/lib/session/ephemeral";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Cookie, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) {
      // Delay slightly for smooth page entrance
      const timer = setTimeout(() => setShow(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setCookieConsent(true);
    setShow(false);
  };

  const handleDecline = () => {
    setCookieConsent(false);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-4 rounded-card bg-brand-obsidian/95 border border-subtle shadow-ambient-dark backdrop-blur-md"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0 mt-0.5">
              <Cookie className="w-4 h-4 text-brand-green" />
            </div>

            <div className="flex-1 text-xs">
              <h4 className="text-white font-medium mb-1 flex items-center gap-1.5">
                Privacidade & Armazenamento Efêmero
              </h4>
              <p className="text-brand-gray-400 leading-relaxed mb-3">
                Utilizamos armazenamento temporário exclusivamente em memória de sessão (
                <span className="text-brand-green font-mono">sessionStorage</span>) para viabilizar
                seus downloads. Todos os dados são expurgados ao fechar esta aba.
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAccept}
                  className="px-3 py-1.5 rounded-pill bg-brand-green hover:bg-brand-green-deep text-brand-obsidian font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Compreendido</span>
                </button>

                <Link
                  href="/privacy"
                  className="px-3 py-1.5 rounded-pill text-brand-gray-400 hover:text-white text-xs transition-colors"
                >
                  Saiba mais
                </Link>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDecline}
              className="text-brand-gray-500 hover:text-white p-1 rounded-control transition-colors"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
