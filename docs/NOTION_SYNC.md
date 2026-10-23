# 📘 KIT DE DOCUMENTAÇÃO E SINCRONIZAÇÃO NOTION

Este documento contém os blocos formatados prontos para você copiar e colar diretamente nas páginas do seu Notion para este projeto (**10Ativas Media Studio / YouTube Downloader Web**).

---

## 📌 PARTE 1: ESTRUTURA INTERNA DO PROJETO

### 1.1 Briefing Executivo
* **Nome do Projeto:** 10Ativas Media Studio (Web YouTube Downloader)
* **Objetivo:** Transformar a aplicação desktop Python (`migu3lls/yt_downloader`) em uma aplicação web soberba, segura, responsiva e performática.
* **Stack Principal:** Next.js 15 (React 19, TypeScript), Tailwind CSS (10ATIVAS V2), Supabase BaaS (Database, Realtime, Storage, Vault), Python/FastAPI Worker com `yt-dlp` e FFmpeg.
* **Design System:** 10ATIVAS V2 (Sora + Geist Mono, `#18E299`, `#0D0D0D`, raios `9999px` e `16px/24px`, 84 ícones vetorizados).
* **Links Úteis:**
  * Repositório GitHub Original: `https://github.com/migu3lls/yt_downloader`
  * Novo Repositório Web: Em configuração (`c:\blz\yt`)
  * Kit de Marca: `c:\blz\antidoto\brand-new`

### 1.2 Backlog de Tarefas Vinculadas (To-Do Board)

| ID | Tarefa | Fase | Prioridade | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TASK-01** | Setup do Repositório, Regras de IA e Governança | Fase 0 | Crítica | Concluído ✅ |
| **TASK-02** | Scaffolding Next.js 15 + Design System 10Ativas V2 | Fase 1 | Alta | Em Andamento ⏳ |
| **TASK-03** | Validador Seguro de URL e Extração de Metadados | Fase 1 | Alta | A Fazer 📋 |
| **TASK-04** | Interface do Studio (Atmospheric Hero, Input Pill, Media Card) | Fase 1 | Alta | A Fazer 📋 |
| **TASK-05** | Configuração Supabase (DDL, RLS, Realtime Channel) | Fase 2 | Alta | A Fazer 📋 |
| **TASK-06** | Engine Worker de Processamento (`yt-dlp` + FFmpeg streaming) | Fase 2 | Crítica | A Fazer 📋 |
| **TASK-07** | Barra de Progresso Realtime (Velocidade MB/s, % e ETA em Geist Mono) | Fase 2 | Alta | A Fazer 📋 |
| **TASK-08** | Gestão de Sessão Efêmera (`sessionStorage` + `beforeunload`) | Fase 3 | Crítica | A Fazer 📋 |
| **TASK-09** | Rate Limiting e Sanitização contra Injeções | Fase 3 | Crítica | A Fazer 📋 |
| **TASK-10** | Banner de Cookies, Termos de Uso e Política de Privacidade | Fase 3 | Média | A Fazer 📋 |
| **TASK-11** | Testes Unitários e E2E (Vitest e Playwright) | Fase 4 | Alta | A Fazer 📋 |

---

## 🧠 PARTE 2: DEVLOG DE APRENDIZADO & ARQUITETURA (USO INTERNO)

### Entrada 01 — 23/10/2026: Por que separar o Worker do isolamento de Edge Functions?
* **Desafio:** Como executar `yt-dlp` e `ffmpeg` em um ambiente moderno serverless de forma confiável e escalável?
* **Análise Técnica:** As Edge Functions do Supabase rodam em Deno dentro de V8 isolates. V8 isolates são ultra-leves e seguras, porém não possuem kernel Linux completo e não permitem a execução direta de binários compilados pesados como `ffmpeg` ou a execução de subprocessos arbitrários em Python.
* **Solução Implementada:** Arquitetura desacoplada. O Next.js e Supabase gerenciam o ciclo de vida da requisição, autenticação anônima efêmera, auditoria e canal Realtime via WebSockets. A extração pesada e conversão de áudio/vídeo é atribuída a um worker especializado (FastAPI/Python) que roda nativamente o `yt-dlp` e se conecta ao Supabase via Service Role e webhook seguro.
* **Snippet de Conceito:**
  ```python
  # O worker reporta progresso diretamente ao canal Realtime do Supabase
  def progress_hook(d):
      if d['status'] == 'downloading':
          percent = (d.get('downloaded_bytes', 0) / (d.get('total_bytes') or 1)) * 100
          supabase.table("download_jobs").update({
              "progress_percent": round(percent, 2),
              "speed_mbps": format_speed(d.get('speed', 0)),
              "eta_seconds": str(d.get('eta', 0))
          }).eq("id", job_id).execute()
  ```

### Entrada 02 — 23/10/2026: Privacidade Zero-Persistence e Sanitização de Sessão
* **Desafio:** Eliminar riscos de persistência de tokens sensíveis ou rastreamento perene em navegadores compartilhados.
* **Solução:** O SDK do Supabase no cliente foi configurado para usar estritamente `window.sessionStorage` em vez de `localStorage`. Além disso, um hook global escuta o evento `beforeunload` e `pagehide` para disparar um ping de expurgo (Beacon API) e limpar cookies de sessão efêmera.

---

## 🌐 PARTE 3: PORTAL DO CLIENTE (VISÃO EXECUTIVA)

### Resumo Executivo
* **Produto:** 10Ativas Media Studio
* **Status Atual:** **Sprint 1 — Fundação & Interface (Em Andamento)**
* **Próxima Entrega:** Studio Web interativo com input inteligente de URLs e pré-visualização de metadados em alta definição.

### Entregáveis da Sprint:
1. **Identidade Visual Impecável:** Aplicação integral do design 10ATIVAS V2 com a paleta oficial (`#18E299`, `#0D0D0D`), tipografia moderna (Sora e Geist Mono) e ícones vetorizados transparentes.
2. **Experiência Sem Atrito:** Nenhuma exigência de login obrigatório para downloads pontuais; interface limpa, sem anúncios ou redirecionamentos maliciosos.
3. **Velocidade & Transparência:** Métricas claras de progresso durante o download, com download direto de áudio (MP3) e vídeo (MP4 até 1080p).
