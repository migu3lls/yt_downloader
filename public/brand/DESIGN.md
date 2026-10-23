# 10ATIVAS — Design System V2

**Direção:** tecnologia, precisão, movimento e simplicidade.  
**Edição:** V2 — Sora + Geist Mono

---

## 1. Brand Direction

A **10ATIVAS V2** mantém o símbolo atual como núcleo da identidade e amplia a marca por meio de uma linguagem visual própria.

### 1.1 Personalidade
- Tecnológica
- Profissional
- Precisa
- Contemporânea
- Confiante
- Minimalista

### 1.2 Princípio Visual
A marca deve comunicar tecnologia avançada sem recorrer a estética cyberpunk, excesso de neon, glassmorphism ou excesso de efeitos.

**Regra:** simplicidade estrutural + contraste forte + verde usado como sinal de ação.

### 1.3 Arquitetura da Identidade

```text
LOGO
  ↓
LINGUAGEM VISUAL
  ↓
INTERFACE
  ↓
COMUNICAÇÃO
  ↓
APLICAÇÕES
```

O logotipo é o núcleo; o pattern, a tipografia, o movimento e os componentes expandem a identidade.

---

## 2. Logo System

### 2.1 Assinaturas Oficiais

- **Principal:** `[ símbolo ] 10Ativas`
  - **Uso:** website, apresentações, propostas, documentos e materiais institucionais.
  - **Arquivos (`public/brand/`):**
    - Fundo claro: `logo-principal.svg`, `logo-principal.png` (`logo_e_texto.svg`, `logo_e_texto.png`)
    - Fundo escuro: `logo-principal-dark.svg`, `logo-principal-dark.png` (`logo_e_texto_branco.svg`, `logo_e_texto_branco.png`)
- **Compacta:** `[ símbolo ] 10A`
  - **Uso:** aplicações com pouco espaço horizontal, cabeçalhos compactos e contextos digitais.
  - **Arquivos (`public/brand/`):**
    - Fundo claro: `logo-compacta.svg`, `logo-compacta.png`
    - Fundo escuro: `logo-compacta-dark.svg`, `logo-compacta-dark.png`
- **Ícone:** `[ símbolo ]`
  - **Uso:** favicon, avatar, app icon, loading, watermark e elementos decorativos.
  - **Arquivos (`public/brand/`):** `logo.svg`, `logo-icone.svg`, `logo-icone.png`, `logo_pgn.png`
- **Verde 10Ativas:** Versão onde **tanto o símbolo quanto o texto** utilizam o Verde oficial (`#18E299`) sobre fundo transparente.
  - **Uso:** telas escuras, splash screens, aplicações de alto impacto tecnológico e assinaturas luminosas.
  - **Arquivos (`public/brand/`):**
    - Principal: `logo-verde.svg`, `logo-verde.png`
    - Compacta: `logo-compacta-verde.svg`, `logo-compacta-verde.png`
- **Monocromática:** Versão 100% preta (`#0D0D0D`) ou 100% branca (`#FFFFFF`).
  - **Uso:** aplicações com restrição de cor, fundos fotográficos e materiais corporativos.
  - **Arquivos (`public/brand/`):**
    - Preta: `logo-mono-preto.svg`, `logo-mono-preto.png`, `logo-compacta-mono-preto.svg`, `logo-compacta-mono-preto.png`, `logo-icone-preto.svg`, `logo-icone-preto.png`
    - Branca: `logo-mono-branco.svg`, `logo-mono-branco.png`, `logo-compacta-mono-branco.svg`, `logo-compacta-mono-branco.png`, `logo-icone-branco.svg`, `logo-icone-branco.png`, `logo_branco.png`

### 2.2 Área de Proteção
Manter ao redor da marca um espaço livre equivalente, no mínimo, à altura do símbolo (`10A` / `1x`).

### 2.3 Usos Incorretos
Não:
- distorcer ou inclinar a marca;
- alterar as cores oficiais;
- adicionar sombras, brilhos ou efeitos diretamente ao logotipo;
- alterar proporções entre símbolo e wordmark;
- aplicar sobre fundos com baixo contraste.

### 2.4 Animação Oficial da Marca (Motion System V2)
A marca 10Ativas conta com uma revelação animada paramétrica de alta precisão (implementada no componente `src/components/ui/AnimatedLogoReveal.tsx`):
1. **Fase 1 — Traçado Vetorial (0.0s – 1.4s):** Os 4 filamentos poligonais entrelaçados são desenhados em tempo real através de `stroke-dasharray` em curvas de Bézier com traço luminoso `#18E299`.
2. **Fase 2 — Preenchimento Volumétrico & Pulso Esmeralda (0.6s – 1.8s):** As facetas se preenchem suavemente com os gradientes oficiais (`#18E299` e `#0FA76E`) enquanto ondas de choque radiais esmeralda se expandem a partir do núcleo central.
3. **Fase 3 — Revelação Tipográfica Sora (1.1s – 2.4s):** O wordmark `10Ativas` ou `10A` surge por deslizamento horizontal milimétrico com ancoragem de opacidade total.

### 2.5 Iconografia Oficial da Marca (84 Ícones com Fundo Transparente)
Biblioteca com 84 ícones vetorizados e recortados com fundo 100% transparente para uso em interfaces, apresentações e sistemas:
- **Localização:** `public/brand/icons/` e `public/icons/` (catálogo estruturado em `catalog.json`).
- **Variações de Cor:**
  - Verde 10Ativas (`#18E299`): `public/brand/icons/green/<nome>.png`
  - Branco Puro (`#FFFFFF`): `public/brand/icons/white/<nome>.png`
  - Obsidian Dark (`#0D0D0D`): `public/brand/icons/<nome>.png`
- **Formatos:** PNG em alta resolução (256×256 px) e vetor SVG limpo (`<nome>.svg`).
- **Interface Viva:** Componente de busca e download interativo disponível em `src/components/brand/IconLibrary.tsx`.

---

## 3. Color System

### 3.1 Primárias

| Nome | Hex | Papel |
| :--- | :--- | :--- |
| **Verde 10Ativas** | `#18E299` | Identidade, CTA, estados ativos e destaque |
| **Verde Profundo** | `#0FA76E` | Hover, estados ativos e textos em superfícies claras |
| **Verde Suave** | `#E8FFF5` | Superfícies e fundos de apoio |
| **Obsidian** | `#0D0D0D` | Textos, fundos escuros e CTAs |
| **Branco** | `#FFFFFF` | Fundo principal e superfícies |

### 3.2 Neutros

| Nome | Hex | Papel |
| :--- | :--- | :--- |
| **Gray 700** | `#333333` | Texto secundário |
| **Gray 500** | `#666666` | Texto terciário |
| **Gray 400** | `#888888` | Placeholders e estados desabilitados |
| **Gray 200** | `#E5E5E5` | Bordas e divisores |
| **Gray 100** | `#F5F5F5` | Superfícies discretas |
| **Gray 50** | `#FAFAFA` | Superfície quase branca |

### 3.3 Semânticas
- **Informação:** `#3772CF`
- **Atenção:** `#C37D0D`
- **Erro:** `#D45656`
- **Sucesso:** `#15A34A`

### 3.4 Uso da Cor
O verde é um sinal, não o preenchimento dominante da interface.

**Prioridade:**
```text
Branco / Obsidian
        ↓
Neutros
        ↓
Verde 10Ativas
        ↓
Verde elétrico apenas em destaques especiais
```

---

## 4. Typography

A V2 substitui a combinação anterior baseada em Inter por **Sora + Geist Mono**, preservando a lógica de uma única família principal e uma família técnica.

### 4.1 Sora
**Uso:** headlines, navegação, UI, cards, chamadas e conteúdo institucional.

| Papel | Tamanho | Peso | Line Height |
| :--- | :--- | :--- | :--- |
| **Display / H1** | `64px` | `700` | `1.10` |
| **H2** | `40px` | `600` | `1.15` |
| **H3** | `32px` | `600` | `1.20` |
| **H4 / Card title** | `24px` | `600` | `1.25` |
| **H5** | `20px` | `600` | `1.30` |
| **Body** | `16px` | `400` | `1.50` |
| **Body Medium** | `16px` | `500` | `1.50` |
| **Small** | `14px` | `400` | `1.50` |
| **Button** | `15px` | `500` | `1.50` |
| **Caption** | `12px` | `500` | `1.50` |

### 4.2 Tracking
- **Display:** `-1.2px` aproximadamente
- **H2:** `-0.7px`
- **H3:** `-0.4px`
- **UI / Body:** `normal`

### 4.3 Geist Mono
**Uso exclusivo para:**
- labels técnicos;
- status;
- pequenos indicadores;
- códigos;
- metadados;
- elementos com linguagem de sistema.

**Características:**
- `12–13px`;
- peso `500–600`;
- `uppercase` quando usado como label;
- `letter-spacing: 0.5px` a `0.6px`.

---

## 5. Visual Language

### 5.1 Espaço em Branco
A 10Ativas deve respirar.
- **Base:** `8px`
- **Componentes:** `8 / 16 / 24 / 32px`
- **Seções:** `64–96px`
- **Mobile:** `40–64px`

### 5.2 Grid
- **Container máximo:** `~1200px`
- **Padding desktop:** `32px`
- **Padding mobile:** `20–24px`
- **Grid de cards:** `3 → 2 → 1` colunas

### 5.3 Bordas
```css
border: 1px solid rgba(0, 0, 0, 0.05);
```
Elementos interativos podem usar até `8%` de opacidade.

### 5.4 Radius
```text
4px    → tags pequenas
8px    → controles compactos
16px   → cards
24px   → cards/containers destacados
9999px → pills, CTAs e inputs
```

### 5.5 Sombras
Sombras devem ser leves e ambientais.
```css
box-shadow: rgba(0, 0, 0, 0.03) 0 2px 4px;
```
Evitar sombras fortes e múltiplas camadas de profundidade.

---

## 6. Atmospheric Hero

O hero é um dos elementos mais importantes da V2.

### Estrutura
```text
[ navegação ]

[ label técnico ]

Tecnologia que
move negócios.

Descrição curta.

[ CTA principal ] [ CTA secundário ]

[ métricas / prova social ]

[ símbolo 10Ativas / composição visual ]
```

### Tratamento Visual
- Fundo claro ou Obsidian (`#0D0D0D`).
- Gradiente atmosférico verde muito sutil.
- Grande área de respiro.
- Símbolo ampliado como elemento visual.
- Linhas e geometrias derivadas do símbolo em baixa opacidade.

### Headline de Referência
**Tecnologia que move negócios.**

Uso de cor recomendado:
- `Tecnologia que` → Obsidian (`#0D0D0D`) em fundo claro / Branco (`#FFFFFF`) em fundo escuro
- `move negócios.` → `negócios.` (ou linha de ação) em Verde 10Ativas (`#18E299`)

---

## 7. Visual Patterns

Os padrões da V2 são derivados diretamente da geometria do símbolo da 10Ativas.

### 7.1 Pattern Principal
Geometria do símbolo repetida em baixa opacidade, formando uma malha modular.
- **Uso:** hero, backgrounds, apresentações, banners, capas, wallpapers e materiais institucionais.

### 7.2 Pattern de Linhas
Linhas finas conectando os módulos do símbolo.
- **Opacidade recomendada:**
  - fundo claro: `4–8%`
  - fundo escuro: `8–14%`

### 7.3 Pattern Luminoso
Aplicação restrita a peças digitais e campanhas especiais.
- Verde 10Ativas (`#18E299`)
- Glow extremamente controlado
- Baixa saturação fora do elemento focal

**Regra:** O pattern nunca deve competir com texto ou logo.

---

## 8. Motion System — V2

O movimento passa a fazer parte oficialmente da identidade.

### 8.1 Princípios
- Sutil antes de chamativo.
- Movimento deve reforçar profundidade e tecnologia.
- Nunca prejudicar leitura.
- Preferir loops contínuos e sem cortes visíveis.
- Respeitar `prefers-reduced-motion` em interfaces.

### 8.2 Hero Motion
O hero utiliza uma animação ambiente com:
- aproximação muito lenta;
- deslocamento horizontal/vertical mínimo;
- movimento atmosférico do símbolo;
- brilho verde discreto;
- loop contínuo.
- **Sensação:** profundidade, estabilidade e evolução.
- **Arquivo de referência:** `10ativas_hero_loop.mp4`
- **Formatos recomendados para web:** WebM como primeira opção; MP4 como fallback; GIF apenas para prévias ou canais que não suportem vídeo.

### 8.3 Pattern Motion
Os padrões usam:
- scale extremamente lento;
- deslocamento/paralaxe suave;
- variação de posição dos módulos;
- brilho localizado apenas em momentos pontuais.
- **Arquivo de referência:** `10ativas_padroes_loop.mp4`

### 8.4 Timing

| Interação | Duração |
| :--- | :--- |
| **Hover simples** | `160–220ms` |
| **Entrada de componente** | `300–450ms` |
| **Transição de página** | `400–650ms` |
| **Movimento atmosférico** | `6–14s` |
| **Loop de hero** | `8–16s` |

**Curvas recomendadas:**
```css
cubic-bezier(0.22, 1, 0.36, 1)
```
Para movimentos ambientais, usar easing suave e contínuo.

### 8.5 Acessibilidade
Quando `prefers-reduced-motion: reduce` estiver ativo:
- desabilitar zoom;
- remover parallax;
- manter somente transições essenciais;
- garantir legibilidade e navegação normal.

---

## 9. Components

### 9.1 Buttons
- **Primary:**
  - Background: `#18E299`
  - Text: `#0D0D0D`
  - Radius: `9999px`
  - Padding: `8px 24px`
  - Weight: `500`
- **Secondary:**
  - Background: `transparent` ou `#FFFFFF`
  - Border: `1px solid rgba(0,0,0,.08)`
  - Text: `#0D0D0D`
  - Radius: `9999px`
- **Dark:**
  - Background: `#0D0D0D`
  - Text: `#FFFFFF`
  - Radius: `9999px`

### 9.2 Cards
- Background: `#FFFFFF`
- Border: `5%` preto (`rgba(0,0,0,0.05)`)
- Radius: `16px`
- Padding: `24px`
- Shadow: extremamente sutil (`rgba(0,0,0,0.03) 0 2px 4px`)

### 9.3 Inputs
- Radius: `9999px`
- Border: `8%` preto (`rgba(0,0,0,0.08)`)
- Focus ring: `#18E299`

### 9.4 Badges
Formato pill. Exemplos:
- `● ATIVO`
- `● EM ANDAMENTO`
- `● ATENÇÃO`
- `● ERRO`

---

## 10. Dark Mode

### Cores
- **Background:** `#0D0D0D`
- **Surface:** `#141414`
- **Primary text:** `#EDEDED`
- **Secondary text:** `#A0A0A0`
- **Border:** `rgba(255,255,255,.08)`
- **Brand Green:** `#18E299`

### Comportamento
O verde permanece estável entre modos claro e escuro. O dark mode deve priorizar:
- conteúdo;
- contraste;
- imagem de produto;
- marca;
- componentes técnicos.

---

## 11. Image Direction

### Estilo
- arquitetura;
- infraestrutura;
- tecnologia aplicada;
- telas e dashboards;
- ambientes corporativos;
- detalhes de hardware;
- fotografia limpa e contrastada.

### Tratamento
- contraste alto;
- greens muito discretos;
- pretos profundos;
- recortes geométricos;
- overlays leves.

Evitar banco de imagens com aparência genérica ou excesso de pessoas posando para a câmera.

---

## 12. Website Direction

### Header
- Logo à esquerda
- Navegação central/direita (`Soluções`, `Sobre`, `Cases`, `Contato`)
- CTA em pill (`Falar com a equipe →`)
- Sticky
- Backdrop blur discreto
- Borda inferior sutil

### Hero
Headline grande + subtítulo curto + dois CTAs + métricas de autoridade + composição visual do símbolo 10Ativas.

### Sections
Cada seção funciona como um capítulo:
```text
LABEL
HEADING
DESCRIPTION
CONTENT
```

### CTA Footer
Fundo Obsidian (`#0D0D0D`) ou composição verde/escura, com headline grande e CTA de alto contraste.

---

## 13. Brand Applications

A identidade deve manter consistência em:
- website;
- favicon;
- assinatura de e-mail;
- cartão de visita;
- propostas comerciais;
- apresentações;
- documentos;
- banners;
- redes sociais;
- wallpapers;
- dashboards e produtos internos.

---

## 14. Voice & Copy Direction

### Tom
- direto;
- técnico sem ser excessivamente complexo;
- seguro;
- objetivo;
- moderno.

### Evitar
Frases genéricas de marketing como:
> “Somos uma empresa inovadora que oferece soluções completas.”

### Preferir
> “Infraestrutura, desenvolvimento e automação para operações que precisam continuar funcionando.”

### Headline Style
Poucas palavras. Alta clareza. Forte contraste.

**Exemplos:**
- Tecnologia que move negócios.
- Infraestrutura que não atrasa sua operação.
- Software pensado para a sua operação.
- Menos complexidade. Mais controle.

---

## 15. Accessibility & UX

- Contraste adequado entre texto e fundo.
- Nunca usar verde como único indicador de estado.
- Estados devem possuir texto, ícone ou mudança estrutural adicional.
- Foco visível em todos os controles interativos.
- Alvos de toque confortáveis em mobile.
- Respeitar `prefers-reduced-motion`.

---

## 16. Quick Reference

### Brand
```text
Primary Font    → Sora
Technical Font  → Geist Mono
Primary Green   → #18E299
Deep Green      → #0FA76E
Light Green     → #E8FFF5
Black           → #0D0D0D
White           → #FFFFFF
```

### UI
```text
Base spacing    → 8px
Card radius     → 16px
Large radius    → 24px
Pill            → 9999px
Container       → ~1200px
Section spacing → 64–96px
```

### Motion
```text
Hover           → 160–220ms
UI entrance     → 300–450ms
Page transition → 400–650ms
Ambient motion  → 6–14s
Hero loop       → 8–16s
```

---

## 17. Implementation Tokens

```css
:root {
  --brand: #18E299;
  --brand-deep: #0FA76E;
  --brand-soft: #E8FFF5;

  --black: #0D0D0D;
  --white: #FFFFFF;

  --gray-700: #333333;
  --gray-500: #666666;
  --gray-400: #888888;
  --gray-200: #E5E5E5;
  --gray-100: #F5F5F5;
  --gray-50: #FAFAFA;

  --info: #3772CF;
  --warning: #C37D0D;
  --error: #D45656;
  --success: #15A34A;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-card: 16px;
  --radius-lg: 24px;
  --radius-pill: 9999px;

  --shadow-card: rgba(0, 0, 0, 0.03) 0 2px 4px;
  --shadow-button: rgba(0, 0, 0, 0.06) 0 1px 2px;

  --ease-standard: cubic-bezier(0.22, 1, 0.36, 1);
}
```

---

## 18. V2 Summary

A **10Ativas V2** não depende apenas do logotipo. Ela é composta por:

`LOGO` + `SORA` + `GEIST MONO` + `VERDE 10ATIVAS` + `ESPAÇO` + `GEOMETRIA` + `MOTION` + `CONSISTÊNCIA`

A combinação desses elementos produz uma marca tecnológica, profissional e contemporânea, com uma linguagem visual reconhecível mesmo quando o logotipo não estiver presente.
