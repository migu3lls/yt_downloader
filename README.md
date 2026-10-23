# 10Ativas Media Studio (YouTube Downloader Web)

> **Interface web soberba, segura e performática para extração e conversão de áudio (MP3 320kbps) e vídeo (MP4 até 1080p).**  
> Desenvolvida sob o padrão **10ATIVAS Design System V2** e arquitetura BaaS com **Supabase**.

---

## ⚡ Destaques do Projeto

* **Zero Instalação:** O usuário não precisa configurar Python, Git, VS C++ Build Tools ou FFmpeg localmente.
* **Design System 10ATIVAS V2:**
  * Tipografia oficial: **Sora** (headlines, interface, navegação) e **Geist Mono** (labels técnicos, status, métricas e ETA).
  * Paleta oficial: **Obsidian** (`#0D0D0D`), **Verde 10Ativas** (`#18E299`), **Verde Profundo** (`#0FA76E`) e superfícies limpas.
  * Motion System V2: Animação vetorial paramétrica com curvas de Bézier e revelação esmeralda (`AnimatedLogoReveal.tsx`).
  * Biblioteca oficial de ícones com fundo 100% transparente em `public/brand/icons/`.
* **Segurança e Privacidade Efêmera (Zero-Persistence):**
  * Proibição expressa de tokens perenes em `localStorage`. Todas as sessões operam via `sessionStorage` e expurgo automático nos eventos `beforeunload` e `pagehide`.
  * Nenhum arquivo `.env` com segredos estáticos locais em produção. Chaves dinâmicas gerenciadas via Supabase Vault.
  * Rate limiting em memória e nas rotas de API para prevenção de abusos e ataques DDoS.
  * Sanitização rigorosa contra **Command Injection**, **SQL Injection** e **Prompt Injection**.
  * Arquivos em disco com TTL (Time-To-Live) de expurgo automático após download.
* **Qualidade e Governança:**
  * Linter & Formatter: **Biome**.
  * Testes Unitários: **Vitest** cobrindo validadores de URL e vetores de injeção.
  * Sincronização e Devlog no Notion (`docs/NOTION_SYNC.md`).
  * Diretrizes de IA documentadas em `AI_INSTRUCTIONS.md`.

---

## 🏗️ Arquitetura do Sistema

```text
┌────────────────────────────────────────────────────────┐
│               FRONTEND: Next.js 15 (App Router)        │
│    React 19 + TypeScript + Tailwind CSS (10ATIVAS V2)  │
│      Framer Motion (Kowalski Principles) + Sonner      │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS / WSS
                           ▼
┌────────────────────────────────────────────────────────┐
│               BaaS & GATEWAY: Supabase                 │
│  - Supabase Auth (Ephemeral Session / Guest Token)    │
│  - Supabase Postgres (Jobs, Metadados & RLS Estrito)   │
│  - Supabase Realtime (Canais de Progresso em WSS)      │
│  - Supabase Storage (Bucket efêmero / TTL 15 min)      │
│  - Supabase Vault (Gestão segura de segredos/chaves)   │
└──────────────────────────┬─────────────────────────────┘
                           │ Processamento Nativo
                           ▼
┌────────────────────────────────────────────────────────┐
│         ENGINE DE EXTRAÇÃO: yt-dlp + FFmpeg            │
│       Python 3.12+ (Nativo ou Container Docker)        │
│       Rate Limiting + Isolamento de Execução           │
└────────────────────────────────────────────────────────┘
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* **Node.js:** v20+ ou v24+
* **Python:** 3.10+ com `yt-dlp` (`pip install yt-dlp`)
* **FFmpeg:** Instalado e disponível no PATH do sistema operacional.

### 1. Clonar e Instalar Dependências
```bash
git clone https://github.com/migu3lls/yt_downloader.git
cd yt
npm install
```

### 2. Rodar Testes e Linter
```bash
npm test        # Executa suite de testes do Vitest
npm run lint    # Executa verificação do Biome
```

### 3. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
Acesse a aplicação no seu navegador: **`http://localhost:3000`**

### 4. Build de Produção
```bash
npm run build
npm run start
```

---

## 📁 Estrutura do Repositório

```text
yt/
├── AI_INSTRUCTIONS.md           # Instrução Mestra e regras obrigatórias de engenharia
├── README.md                    # Documentação principal
├── package.json                 # Dependências e scripts
├── tsconfig.json                # Configuração TypeScript estrita
├── tailwind.config.ts           # Configuração de tokens do 10ATIVAS V2
├── biome.json                   # Configuração de formatação e linting Biome
├── docs/
│   └── NOTION_SYNC.md           # Templates prontos para colar no Notion (Briefing, Devlog, Portal)
├── public/
│   ├── favicon.svg              # Símbolo oficial 10Ativas
│   ├── icon.svg                 # Símbolo oficial 10Ativas
│   └── brand/                   # SVGs, PNGs e 84 ícones vetorizados transparentes
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Injeção de fontes Sora, Geist Mono, Toaster e Providers
│   │   ├── page.tsx             # Atmospheric Hero, Input Pill, Media Card e Bento Grid
│   │   ├── privacy/page.tsx     # Política de Privacidade & Proteção de Dados
│   │   ├── terms/page.tsx       # Termos de Uso Responsável (Fair Use)
│   │   └── api/
│   │       ├── info/route.ts            # Inspeção segura de metadados
│   │       ├── download/start/route.ts  # Inicialização de job de download
│   │       ├── download/status/route.ts # Polling de status com % e ETA
│   │       ├── download/file/route.ts   # Stream de entrega e purga do arquivo
│   │       └── session/purge/route.ts   # Endpoint de descarte no beforeunload
│   ├── components/
│   │   ├── brand/               # AnimatedLogoReveal, BrandHeader, BrandFooter
│   │   ├── studio/              # UrlInputPill, MediaCard, DownloadProgressModal
│   │   ├── session/             # SessionProvider (beforeunload/sessionStorage)
│   │   └── ui/                  # CookieBanner
│   └── lib/
│       ├── jobs/                # Gerenciador de jobs de download com yt-dlp
│       ├── security/            # Validador de URL e Rate Limiting
│       ├── session/             # Gerenciador de sessão efêmera
│       ├── supabase/            # Cliente Supabase com storage volátil
│       └── utils.ts             # Formatadores (bytes, duration, speed)
└── tests/
    └── validator.test.ts        # Testes de segurança e anti-injection
```

---

## 📄 Termo de Uso e Responsabilidade
Este software deve ser utilizado exclusivamente para download de conteúdos de autoria própria, sob licença Creative Commons ou com expressa permissão do titular dos direitos.
