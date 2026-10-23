# ==============================================================================
# 10ATIVAS Media Studio - Production Dockerfile
# Suporta Next.js 15 Standalone + Python 3 + yt-dlp + FFmpeg nativo
# ==============================================================================

# 1. Base com Node 22 e utilitários de sistema
FROM node:22-bookworm-slim AS base
ENV DEBIAN_FRONTEND=noninteractive

# Instala dependências de mídia e runtime Python
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    ffmpeg \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Instala yt-dlp globalmente
RUN python3 -m pip install --no-cache-dir --break-system-packages yt-dlp

# 2. Dependências do Node.js
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# 3. Build do Next.js
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# 4. Imagem Final de Produção (Runner)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Cria usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Cria diretório temporário para downloads com permissão
RUN mkdir -p /tmp/10ativas_downloads && chown -R nextjs:nodejs /tmp/10ativas_downloads

# Copia arquivos públicos e build standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
