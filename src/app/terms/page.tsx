"use client";

import { AlertTriangle, ArrowLeft, FileText, Scale } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-brand-gray-300">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-mono text-brand-green hover:underline mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar ao Studio</span>
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-card bg-brand-green/10 flex items-center justify-center">
          <FileText className="w-6 h-6 text-brand-green" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Termos de Uso Responsável (Fair Use)
          </h1>
          <p className="text-xs font-mono text-brand-gray-400">
            Última atualização: 23 de Outubro de 2026 • 10ATIVAS Media Studio
          </p>
        </div>
      </div>

      <div className="space-y-8 text-sm leading-relaxed border-t border-subtle pt-8">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Scale className="w-4 h-4 text-brand-green" />
            1. Finalidade do Software
          </h2>
          <p>
            O 10Ativas Media Studio é uma ferramenta de tecnologia desenvolvida com o objetivo de
            auxiliar criadores de conteúdo, educadores, pesquisadores e usuários em geral no
            download e conversão de conteúdos que estejam sob licença de domínio público, Creative
            Commons ou para os quais o usuário possua autorização expressa do detentor dos direitos
            autorais.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-brand-warning" />
            2. Responsabilidade do Usuário
          </h2>
          <p>
            É estritamente vedada a utilização desta plataforma para fins de pirataria,
            redistribuição comercial não autorizada ou violação dos direitos de propriedade
            intelectual de terceiros. O usuário é o único e exclusivo responsável pelo uso que fizer
            dos arquivos baixados.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">
            3. Limitação de Taxa (Rate Limit)
          </h2>
          <p>
            Para garantir a estabilidade do serviço para todos os usuários e prevenir abusos ou
            ataques de negação de serviço (DDoS), a plataforma implementa limitadores de taxa
            automáticos. Tentativas de contornar esses limites resultarão no bloqueio temporário ou
            definitivo da sessão.
          </p>
        </section>
      </div>
    </div>
  );
}
