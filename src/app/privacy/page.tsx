"use client";

import { ArrowLeft, CheckCircle2, Lock, Shield, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function PrivacyPage() {
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
          <Shield className="w-6 h-6 text-brand-green" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Política de Privacidade e Proteção de Dados
          </h1>
          <p className="text-xs font-mono text-brand-gray-400">
            Última atualização: 23 de Outubro de 2026 • 10ATIVAS Media Studio
          </p>
        </div>
      </div>

      <div className="space-y-8 text-sm leading-relaxed border-t border-subtle pt-8">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-green" />
            1. Princípio da Efemeridade e Não-Persistência
          </h2>
          <p>
            O 10Ativas Media Studio opera sob uma arquitetura de privacidade estrita
            (Zero-Persistence). Ao contrário de conversores convencionais, não armazenamos dados de
            navegação, endereços IP completos ou tokens permanentes no seu navegador. Não utilizamos{" "}
            <code>localStorage</code> para persistência perpétua.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-brand-green" />
            2. Limpeza de Arquivos e TTL (Time-To-Live)
          </h2>
          <p>
            Arquivos convertidos (MP3 ou MP4) permanecem em armazenamento transitório apenas durante
            o tempo estritamente necessário para que o usuário finalize a transferência. Após o
            download ou no prazo máximo de 15 minutos, qualquer arquivo é automaticamente e
            irreversivelmente excluído do servidor e do storage temporário.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-green" />
            3. Cookies e Sessão
          </h2>
          <p>
            Utilizamos apenas cookies essenciais de sessão (armazenados em{" "}
            <code>sessionStorage</code>), que deixam de existir imediatamente assim que a aba ou
            janela do navegador é encerrada. Nenhum cookie de rastreamento de terceiros, publicidade
            comportamental ou analytics invasivo está presente nesta plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">4. Segurança de Infraestrutura</h2>
          <p>
            Todas as comunicações entre o cliente e os servidores são protegidas por criptografia
            TLS (HTTPS). Nossos canais de dados utilizam o ecossistema Supabase com regras estritas
            de Row Level Security (RLS) e segredos gerenciados via Vault, prevenindo injeções de
            código ou acesso não autorizado a streams de processamento.
          </p>
        </section>
      </div>
    </div>
  );
}
