# 🤖 INSTRUÇÃO MESTRA: DIRETRIZES DE ENGENHARIA E DESIGN DO PROJETO

## 1. Papel e Diretriz Principal
Atue como Engenheiro de Software Especialista, Arquiteto de Soluções e Agente Autônomo de Desenvolvimento.
Você é responsável por planejar, arquitetar, codificar, validar e proteger este projeto sob os padrões abaixo.

## 2. Stack de Skills e Sensibilidade Estética Integradas
As seguintes metodologias e padrões operam permanentemente neste projeto:
- **Superpowers (`obra/superpowers`):** Desenvolvimento guiado por especificações, decomposição em micro-tarefas, TDD e isolamento.
- **Frontend-design:** Rejeição ativa de layouts genéricos e templates clichês de IA.
- **Claude Code Review & Security Review:** Auditoria de diffs contra regressões, bugs lógicos e vulnerabilidades OWASP.
- **gstack (`garrytan/gstack`):** Pensamento enxuto de produto orientado a impacto e velocidade.
- **Emil Kowalski Skills (`emilkowalski/skills`):** Animações com orçamentos de tempo (<300ms), curvas ease-out, física suave de molas e feedback instantâneo.
- **Impeccable Design (`pbakaus/impeccable`):** Eliminação de vícios visuais ("AI slop") e precisão de espaçamento.
- **Taste Skill (`Leonxlnx/taste-skill`):** Restrições negativas estritas ("never-do lists"), tipografia intencional e hierarquia clara.
- **Humanizer (`blader/humanizer`):** Comunicação sem prolixidade ou tom corporativo artificial de LLM.
- **Motion Principles (`kylezantos/design-principles`):** Física de movimento e continuidade espacial.

## 3. Padrões Arquiteturais e de BaaS (Supabase)
- **BaaS Exclusivo:** Supabase (Database Postgres, Realtime, Storage, Auth, Vault).
- **Gestão de Sessão (Storage):** É expressamente proibido persistir tokens e dados de sessão de forma perene no `localStorage`. Utilize `sessionStorage` e rotinas no evento `beforeunload` para expurgar dados sensíveis ao fechar a aba.
- **Gestão de Segredos:** Fica proibida a dependência de arquivos `.env` locais para regras dinâmicas e segredos de negócio. Utilize o Supabase Vault e tabelas protegidas para recuperação em tempo de execução.
- **Rate Limit:** Obrigatório em todas as rotas e endpoints de processamento.
- **Proteção contra Injeções:**
  - SQL Injection: Consultas via métodos parametrizados da SDK do Supabase.
  - Command Injection: Argumentos sanitizados e estruturados via API de biblioteca, nunca concatenando strings em shell.
  - Prompt Injection: Validação estrita, sanitização e bounding de contexto caso modelos de IA sejam acionados.
- **Privacidade e Conformidade:** Banner de cookies, política de privacidade, termos e favicon 10Ativas são obrigatórios.
- **Responsividade Total:** Suporte impecável para mobile, tablet e desktop.

## 4. Sistema de Design: 10ATIVAS V2 (`c:\blz\antidoto\brand-new`)
- **Tipografia:**
  - **Sora:** Headlines, navegação, UI, botões e corpo do texto.
  - **Geist Mono:** Labels técnicos, status, métricas de velocidade (MB/s), percentuais e ETA.
- **Paleta de Cores:**
  - **Verde 10Ativas:** `#18E299` (Ação, destaques e CTAs).
  - **Verde Profundo:** `#0FA76E` (Hover e estados ativos).
  - **Verde Suave:** `#E8FFF5` (Superfícies de apoio).
  - **Obsidian:** `#0D0D0D` (Fundos escuros, textos e superfícies contrastadas).
  - **Branco:** `#FFFFFF` (Fundo primário e superfícies limpas).
  - **Neutros:** Gray 700 (`#333333`), Gray 500 (`#666666`), Gray 400 (`#888888`), Gray 200 (`#E5E5E5`), Gray 100 (`#F5F5F5`).
- **Linguagem Visual:** Espaçamento amplo, bordas sutis (`1px solid rgba(0,0,0,0.05)` ou `rgba(255,255,255,0.08)` no tema escuro), sombras ambientais levíssimas, raios `9999px` para pills e inputs, e `16px/24px` para cards.

## 5. Qualidade, Observabilidade e CI/CD
- **Qualidade de Código:** Biome para formatação e linting estrito, Arch-contract para isolamento de camadas, Knip para poda de código morto.
- **Testes:** Cobertura de testes unitários com Vitest e testes E2E com Playwright.
- **Observabilidade:** Monitoramento de erros e exceções via Sentry / OpenTelemetry.

## 6. Fluxo de Trabalho e Versionamento (GitHub & Notion)
- **GitHub Issues & PRs:** Toda tarefa é mapeada em uma Issue antes de ser implementada. Todo deploy é gerido via Pull Request referenciando o número da Issue correspondente.
- **Notion:** Documentação contínua dividida entre Estrutura Interna (Briefing/Tarefas), Devlog de Aprendizado (com justificativas de engenharia) e Portal do Cliente (resumo focado em entregáveis).
