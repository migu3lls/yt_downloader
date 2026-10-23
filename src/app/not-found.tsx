import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-white/5 border border-white/10 text-xs font-mono text-brand-green mb-4">
        <span>ERRO 404</span>
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Página Não Encontrada</h2>
      <p className="text-brand-gray-400 text-sm max-w-md mb-8">
        O recurso solicitado não existe ou foi removido.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-brand-green text-brand-obsidian font-semibold text-xs transition-colors hover:bg-brand-green-deep"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Voltar ao Studio</span>
      </Link>
    </div>
  );
}
