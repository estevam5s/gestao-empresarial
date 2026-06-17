---
title: "BairesDev CRM Landing Page — Design System & Documentação"
description: "Guia completo para recriar o design da landing page bairesdev.com/solutions/crm/"
date: "2026-06-16"
---

# BairesDev CRM — Design System Completo

> Documentação gerada por engenharia reversa da página:
> `https://www.bairesdev.com/solutions/crm/`
> Stack detectada: **Next.js + Tailwind CSS** com tokens customizados (`site-*`)

---

## 1. Design System

### Paleta de Cores

O site usa um sistema de tokens Tailwind customizados prefixados com `site-`.
A escala de neutros vai de `neutrals-0` (branco) a `neutrals-900` (quase-preto).

#### Escala de Neutros

| Token                   | Valor RGB                   | HEX aproximado |
|-------------------------|-----------------------------|----------------|
| `site-neutrals-0`       | `rgb(255, 255, 255)`        | `#FFFFFF`      |
| `site-neutrals-25`      | `rgb(246, 247, 248)`        | `#F6F7F8`      |
| `site-neutrals-50`      | `rgb(217, 220, 223)`        | `#D9DCDF`      |
| `site-neutrals-100`     | `rgb(194, 199, 204)`        | `#C2C7CC`      |
| `site-neutrals-200`     | `rgb(149, 158, 166)`        | `#959EA6`      |
| `site-neutrals-300`     | `rgb(127, 137, 147)`        | `#7F8993`      |
| `site-neutrals-400`     | `rgb(104, 117, 128)`        | `#687580`      |
| `site-neutrals-500`     | `rgb(82, 96, 109)`          | `#52606D`      |
| `site-neutrals-600`     | `rgb(61, 71, 81)`           | `#3D4751`      |
| `site-neutrals-700`     | `rgb(39, 46, 52)`           | `#272E34`      |
| `site-neutrals-800`     | `rgb(27, 31, 34)`           | `#1B1F22`      |
| `site-neutrals-900`     | `rgb(17, 17, 17)`           | `#111111`      |

#### Escala de Primário (Laranja)

| Token                   | Valor RGB                   | HEX aproximado |
|-------------------------|-----------------------------|----------------|
| `site-primary-50`       | `rgb(253, 220, 211)`        | `#FDDCD3`      |
| `site-primary-100`      | `rgb(252, 200, 184)`        | `#FCC8B8`      |
| `site-primary-200`      | `rgb(251, 179, 158)`        | `#FBB39E`      |
| `site-primary-400`      | `rgb(248, 138, 106)`        | `#F88A6A`      |
| `site-primary-600`      | `rgb(246, 97, 53)`          | `#F66135` ← **COR PRIMÁRIA** |

#### Papéis Semânticos

| Papel            | Token                  | Valor                        |
|------------------|------------------------|------------------------------|
| **Background**   | `site-neutrals-0`      | `#FFFFFF`                    |
| **Surface Alt**  | `site-neutrals-25`     | `#F6F7F8` (fundo seções claras) |
| **Text Primary** | `site-neutrals-900`    | `#111111`                    |
| **Text Muted**   | `site-neutrals-600`    | `#3D4751`                    |
| **Text Subtle**  | `site-neutrals-400`    | `#687580`                    |
| **Brand/CTA**    | `site-primary-600`     | `#F66135`                    |
| **Dark Sections**| `site-neutrals-900`    | `#111111`                    |

#### Gradientes

```css
/* Hero Section — gradiente horizontal em desktop, vertical em mobile */
/* Mobile (padrão): de cima para baixo */
background: linear-gradient(to bottom, #F6F7F8, #D9DCDF);

/* Desktop (mdL: ≥ 960px): da esquerda para direita */
background: linear-gradient(to right, #F6F7F8, #D9DCDF);

/* Tailwind classes: */
/* from-site-neutrals-25 to-site-neutrals-50 bg-gradient-to-b mdL:bg-gradient-to-r */
```

#### Opacidades e Variações

```css
/* Overlay escuro sobre hero (mobile menu) */
background: rgba(18, 18, 18, 0.4);

/* Card form com fundo semi-transparente no scroll */
background: rgba(255, 255, 255, 0.85);
background: rgba(255, 255, 255, 0.80);
```

---

## 2. Tipografia

### Fonte Utilizada

```css
font-family: 'Outfit', sans-serif;
```

A fonte **Outfit** é carregada via Google Fonts. É a única família tipográfica utilizada em todo o site. Pesos utilizados: `300`, `400`, `500`, `600`, `700`, `900`.

### Escala Tipográfica Completa

O site define uma escala de display customizada (`site-display-*`) e utility classes de parágrafo (`site-paragraph-*`).

#### Display / Headings

| Classe              | Font Size | Font Weight | Line Height | Letter Spacing | Uso                           |
|---------------------|-----------|-------------|-------------|----------------|-------------------------------|
| `site-display-xl`   | `60px`    | `700`       | `72px`      | `normal`       | H1 Hero principal             |
| `site-display-l`    | `48px`    | `400–500`   | `60px`      | `normal`       | Títulos de seção grandes      |
| `site-display-m`    | `36px`    | `400–500`   | `44px`      | `normal`       | Títulos de seção médios       |
| `site-display-s`    | `30px`    | `500–700`   | `38px`      | `normal`       | Subtítulos e cards            |
| `site-display-xs`   | `24px`    | `400–500`   | `32px`      | `normal`       | Card titles, nomes de seção   |

#### Overlines (rótulos maiúsculos)

| Classe              | Font Size | Font Weight | Letter Spacing | Uso                              |
|---------------------|-----------|-------------|----------------|----------------------------------|
| `site-overline-m`   | `14px`    | `700`       | `2px`          | Rótulos de seção em maiúsculas   |
| `site-overline-s`   | `12px`    | `600–700`   | `2px`          | Labels menores                   |
| `(hero overline)`   | `16px`    | `500`       | `6px`          | "CRM DEVELOPMENT SERVICES"       |
| `(grande stat)`     | `112px`   | `500`       | `normal`       | Números decorativos (4.9/5)      |

#### Parágrafos

| Classe                | Font Size | Font Weight | Line Height | Uso                     |
|-----------------------|-----------|-------------|-------------|-------------------------|
| `site-paragraph-xl`   | `20px`    | `400`       | `30px`      | Corpo hero              |
| `site-paragraph-l`    | `18px`    | `400`       | `28px`      | Descrições longas       |
| `site-paragraph-m`    | `16px`    | `400`       | `24px`      | Corpo padrão            |
| `site-paragraph-s`    | `14px`    | `400`       | `20px`      | Labels, nav, captions   |

```css
/* Exemplo de configuração Tailwind customizado */
/* tailwind.config.js */
theme: {
  extend: {
    fontSize: {
      'display-xl': ['60px', { lineHeight: '72px', fontWeight: '700' }],
      'display-l':  ['48px', { lineHeight: '60px', fontWeight: '400' }],
      'display-m':  ['36px', { lineHeight: '44px', fontWeight: '400' }],
      'display-s':  ['30px', { lineHeight: '38px', fontWeight: '500' }],
      'display-xs': ['24px', { lineHeight: '32px', fontWeight: '400' }],
      'paragraph-xl': ['20px', { lineHeight: '30px' }],
      'paragraph-l':  ['18px', { lineHeight: '28px' }],
      'paragraph-m':  ['16px', { lineHeight: '24px' }],
      'paragraph-s':  ['14px', { lineHeight: '20px' }],
      'overline-m': ['14px', { lineHeight: '20px', letterSpacing: '2px', fontWeight: '700' }],
    },
    fontFamily: {
      sans: ['Outfit', 'sans-serif'],
    }
  }
}
```

---

## 3. Layout

### Container e Largura Máxima

O site não usa um único container fixo — em vez disso, combina breakpoints responsivos para controlar a largura:

```css
/* Container padrão de seções de conteúdo */
.section-container {
  /* Mobile */
  margin-left: 1rem;       /* mx-4 */
  margin-right: 1rem;

  /* Tablet (mdS: ≥ 768px) */
  margin-left: 1.5rem;     /* mdS:mx-6 */
  margin-right: 1.5rem;

  /* Large (lgS: ≥ 1024px) */
  margin-left: auto;       /* lgS:mx-auto */
  max-width: 76rem;        /* lgS:max-w-[76rem] = 1216px */
}

/* Tailwind: mdS:mx-6 lgS:mx-auto lgS:max-w-[76rem] mx-4 */

/* Navbar inner container */
/* px-8 xl:mx-auto — padding lateral de 32px, centralizado acima de xl */
```

### Grid e Flexbox

O layout é predominantemente baseado em **CSS Grid** com breakpoints responsivos:

```css
/* Hero section — muda de flex para grid em desktop */
.hero-inner {
  display: flex;
  justify-content: space-between;
  /* Tailwind: flex justify-between */
}

/* Grids de features (3 colunas) */
.feature-grid {
  display: grid;
  grid-template-columns: 1fr;        /* Mobile */
  gap: 1rem;
}
@media (min-width: 768px) {          /* mdS */
  .feature-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    align-items: stretch;
  }
}
@media (min-width: 960px) {          /* mdL */
  .feature-grid {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2rem;
  }
}
/* Tailwind: grid grid-cols-1 gap-4 mdS:grid-cols-2 mdS:auto-rows-fr mdS:gap-6 mdL:grid-cols-3 lgS:gap-8 */

/* Case study card (grid com imagem lateral) */
.case-study-card {
  display: grid;
  grid-template-columns: 1fr 25.5rem;  /* mdL:grid-cols-[1fr,_25.5rem] */
}
```

### Padding e Margens Padrão das Seções

```css
/* Seções padrão */
.section-py-standard { padding-top: 5rem; padding-bottom: 5rem; }   /* py-20 = 80px */
.section-py-large    { padding-top: 8rem; padding-bottom: 8rem; }   /* py-32 = 128px */

/* Hero section */
.hero-section {
  padding-bottom: 6rem;        /* pb-24 = 96px (mobile) */
  margin-top: -2.5rem;         /* -mt-10 = sobreposição com navbar */
}
@media (min-width: 960px) {
  .hero-section { padding-bottom: 2.5rem; }  /* mdL:pb-10 */
}

/* Padding lateral das seções de conteúdo */
.hero-content-left {
  padding: 2rem 4rem;          /* py-8 lg:px-16 */
  padding-left: calc((100vw - 110rem) / 2); /* 2xl:pl-[calc(...)] — centrado em telas muito largas */
}
```

### Breakpoints Responsivos

O site usa breakpoints customizados do Tailwind (além dos padrões):

| Prefixo  | Largura mínima | Equivalente padrão Tailwind |
|----------|----------------|-----------------------------|
| `mdS:`   | `≥ 768px`      | `md:`                       |
| `mdL:`   | `≥ 960px`      | entre `md:` e `lg:`         |
| `lgS:`   | `≥ 1024px`     | `lg:`                       |
| `lg:`    | `≥ 1024px`     | `lg:`                       |
| `xl:`    | `≥ 1280px`     | `xl:`                       |
| `2xl:`   | `≥ 1536px`     | `2xl:`                      |

```js
// tailwind.config.js — screens customizados
screens: {
  'mdS': '768px',
  'mdL': '960px',
  'lgS': '1024px',
  'lg':  '1024px',
  'xl':  '1280px',
  '2xl': '1536px',
}
```

---

## 4. Componentes

### Navbar

A navbar é **sticky** (permanece no topo durante o scroll).

```html
<!-- Estrutura da Navbar -->
<header class="mb-10 h-20 z-40 text-sm sticky top-0 transform duration-300 bg-site-neutrals-0">
  <div class="relative box-content flex h-full items-center justify-between px-8 xl:mx-auto">
    <!-- Logo -->
    <a href="/">
      <!-- SVG Logo BairesDev (flame icon + wordmark) -->
    </a>

    <!-- Nav links -->
    <nav class="flex h-full items-center">
      <!-- Links com dropdown -->
      <a class="...">Services ▾</a>
      <a class="...">Technologies ▾</a>
      <a class="...">Industries ▾</a>
      <a class="...">About ▾</a>
      <a class="...">Our Work</a>
      <a class="...">Blog</a>
    </nav>

    <!-- CTA button -->
    <button class="bg-site-neutrals-900 text-site-neutrals-0 rounded-lg px-4 py-2.5 font-medium">
      Schedule a Call
    </button>
  </div>
</header>
```

**Propriedades visuais:**

| Propriedade          | Valor                                     |
|----------------------|-------------------------------------------|
| Altura               | `80px` (`h-20`)                           |
| Fundo                | `#FFFFFF` (`bg-site-neutrals-0`)          |
| Posição              | `sticky top-0`                            |
| z-index              | `z-40`                                    |
| Box Shadow no scroll | Nenhuma sombra visível por padrão (transition ativa) |
| Padding lateral      | `32px` (`px-8`)                           |
| Font size links      | `14px`                                    |
| Font weight links    | `400`                                     |
| Espaçamento itens    | via `flex gap-*` no container de nav      |
| CTA Button           | Dark (`#111111`), `border-radius: 8px`    |
| Transição            | `transform duration-300` (para mudança no scroll) |

**Nota:** A navbar possui `mb-10` (40px margin-bottom), criando espaço abaixo dela que é compensado pelo `-mt-10` da hero section.

---

### Hero Section

Layout de **duas colunas** (flex row em desktop):
- **Coluna esquerda:** Conteúdo textual (overline + H1 + descrição + card de engenheiro + logos AI)
- **Coluna direita:** Card branco flutuante com formulário de contato

```html
<!-- Hero Section -->
<section class="from-site-neutrals-25 to-site-neutrals-50 relative -mt-10 bg-gradient-to-b pb-24 mdL:bg-gradient-to-r mdL:pb-10 lgS:pb-16">
  
  <!-- Breadcrumb -->
  <nav class="site-paragraph-s relative flex items-center flex-wrap text-site-neutrals-700 mdS:pt-4 mdL:pt-8 lgS:pt-7">
    🏠 / Solutions / CRM
  </nav>

  <!-- Two-column flex wrapper -->
  <div class="flex justify-between">
    
    <!-- LEFT: Content -->
    <div class="mdL:px-6 lgS:px-8 py-8 lg:px-16 bg-site-neutrals-25 lgS:pl-8 lgS:pr-16 lg:pl-36">
      
      <!-- Overline label -->
      <h2 class="text-site-neutrals-600 site-overline-m">
        CRM DEVELOPMENT SERVICES
      </h2>

      <!-- Main H1 -->
      <h1 class="site-display-xl text-site-neutrals-900 mdL:text-left text-center">
        Build custom CRM solutions with experts trusted by
        <strong class="text-site-primary-600">1500+</strong> companies.
      </h1>

      <!-- Body text -->
      <p class="site-paragraph-xl text-site-neutrals-700">
        We build custom CRM platforms...
      </p>

      <!-- Engineer card slider -->
      <!-- AI tools logos -->
    </div>

    <!-- RIGHT: Form Card -->
    <div class="mdL:block mdL:mt-10 hidden">
      <div class="bg-site-neutrals-0 w-[21.4375rem] rounded-3xl p-6 shadow-2xl">
        <!-- Form -->
      </div>
    </div>

  </div>
</section>
```

**Propriedades visuais do Hero:**

| Propriedade              | Valor                                                   |
|--------------------------|---------------------------------------------------------|
| Background mobile        | `linear-gradient(to bottom, #F6F7F8, #D9DCDF)`         |
| Background desktop       | `linear-gradient(to right, #F6F7F8, #D9DCDF)`          |
| Overline font-size       | `14px`, `font-weight: 700`, `letter-spacing: 2px`      |
| H1 font-size             | `60px`, `font-weight: 700`, `line-height: 72px`        |
| H1 cor de destaque       | `rgb(246, 97, 53)` via `[&>strong]:text-site-primary-600` |
| Body font-size           | `20px`, `font-weight: 400`, `line-height: 30px`        |
| Padding da coluna left   | `py-8 lg:px-16 lgS:pl-8 lgS:pr-16 lg:pl-36`           |
| Alinhamento mobile       | `text-center`                                           |
| Alinhamento desktop      | `text-left` (`mdL:text-left`)                          |

---

### Form Card (Hero)

O card de formulário flutua à direita do hero em desktop e é ocultado no mobile.

```html
<div class="bg-site-neutrals-0 mdL:relative mdL:z-10 w-[21.4375rem] rounded-3xl p-6 shadow-2xl">
  
  <h3 class="text-site-neutrals-900 font-medium text-xl text-center">
    Get expert help for your CRM project.
  </h3>

  <form>
    <input type="text" placeholder="Full name" class="..." />
    <input type="email" placeholder="name@company.com" class="..." />
    <textarea placeholder="Tell us about your needs." class="..."></textarea>

    <button type="submit" class="w-full bg-site-primary-600 text-white rounded-lg px-4 py-3 text-xl font-medium">
      Jump-start Your Project
    </button>
  </form>
</div>
```

| Propriedade         | Valor                                               |
|---------------------|-----------------------------------------------------|
| Largura             | `343px` (`w-[21.4375rem]`)                         |
| Background          | `#FFFFFF`                                           |
| Border radius       | `24px` (`rounded-3xl`)                             |
| Padding             | `24px` em todos os lados (`p-6`)                   |
| Box shadow          | `rgba(0,0,0,0.25) 0px 25px 50px -12px` (`shadow-2xl`) |
| z-index (desktop)   | `z-10` (`mdL:z-10`)                                |

---

### Seções Intermediárias

#### Seção de Serviços (Accordion + Texto)

Layout de **duas colunas** em desktop: texto à esquerda, accordion à direita.

```html
<section class="py-20">
  <div class="...container...">
    <!-- Left: overline + h2 + paragraph + logos -->
    <!-- Right: accordion list -->
    <div class="border-b border-site-neutrals-100">
      <button class="flex w-full items-center justify-between py-4 text-base font-bold text-site-neutrals-800">
        Custom CRM Software Development
        <span class="text-site-primary-600">+</span>
      </button>
    </div>
  </div>
</section>
```

#### Grid de Features ("How We Work")

```html
<div class="grid grid-cols-1 gap-4 mdS:grid-cols-2 mdS:auto-rows-fr mdS:gap-6 mdL:grid-cols-3 lgS:gap-8">
  <div class="bg-site-neutrals-25 rounded-lg p-3 md:p-6 mdS:h-full mdS:p-4">
    <!-- Icon + Title + Description -->
  </div>
</div>
```

| Propriedade do Feature Card | Valor                          |
|-----------------------------|--------------------------------|
| Background                  | `#F6F7F8` (`site-neutrals-25`) |
| Border radius               | `8px` (`rounded-lg`)           |
| Padding (desktop)           | `24px` (`p-6`)                 |
| Grid (mobile)               | `1 coluna`, `gap: 16px`        |
| Grid (tablet)               | `2 colunas`, `gap: 24px`       |
| Grid (desktop)              | `3 colunas`, `gap: 32px`       |
| Box shadow                  | nenhuma                        |

#### Seção Escura (Dark Section / CTA Intermediário)

```html
<section class="bg-site-neutrals-900 px-4 py-16 mdS:py-20">
  <div class="...">
    <h2 class="text-site-neutrals-0 site-display-m font-medium">
      Onboard a CRM team in weeks, not months.
    </h2>
    <a href="#" class="bg-site-primary-600 text-white rounded-lg px-4 py-3">
      Talk to an expert
    </a>
  </div>
</section>
```

| Propriedade       | Valor                     |
|-------------------|---------------------------|
| Background        | `#111111`                 |
| Texto             | `#FFFFFF`                 |
| Padding vertical  | `py-16` mobile, `py-20` tablet+ |

#### Cards de Case Study

```html
<div class="bg-site-neutrals-900 text-site-neutrals-0 mdL:grid-cols-[1fr,_25.5rem] mdL:rounded-2xl grid transition-[grid-template-columns] duration-1000">
  <!-- Left: text content -->
  <!-- Right: image -->
</div>
```

| Propriedade         | Valor                                 |
|---------------------|---------------------------------------|
| Background          | `#111111`                             |
| Border radius       | `16px` (`rounded-2xl`) em desktop     |
| Layout              | `grid` com coluna de imagem `25.5rem` |
| Transition          | `grid-template-columns` `1000ms`      |

---

### Overline Label (Rótulo de Seção)

Elemento recorrente antes dos títulos de seção, com marcador quadrado laranja:

```html
<p class="text-site-neutrals-400 site-overline-m before:bg-site-primary-600 font-bold before:mb-[1px] before:mr-2 before:inline-block before:h-2 before:w-2 before:rounded-sm before:content-['']">
  CUSTOM CRM DEVELOPMENT SERVICES
</p>
```

```css
/* CSS equivalente */
.overline-label {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgb(104, 117, 128); /* neutrals-400 */
}
.overline-label::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 2px;        /* rounded-sm */
  background-color: rgb(246, 97, 53); /* primary-600 */
  margin-right: 8px;
  margin-bottom: 1px;
}
```

---

### Botões

O site tem um sistema de variantes de botão bem definido:

#### Botão Primário (Laranja — CTA Principal)

```html
<button class="flex items-center justify-center gap-2 px-4 rounded-lg bg-site-primary-600 hover:bg-site-primary-700 text-site-neutrals-0 focus:text-site-neutrals-0 active:bg-site-primary-800 py-3 text-xl font-medium">
  Jump-start Your Project
</button>
```

| Propriedade      | Normal                    | Hover                     | Active                    |
|------------------|---------------------------|---------------------------|---------------------------|
| Background       | `rgb(246, 97, 53)`        | `rgb(248, 138, 106)`      | mais escuro               |
| Texto            | `#FFFFFF`                 | `#FFFFFF`                 | `#FFFFFF`                 |
| Font size        | `20px`                    | —                         | —                         |
| Font weight      | `500`                     | —                         | —                         |
| Padding          | `12px 16px`               | —                         | —                         |
| Border radius    | `8px` (`rounded-lg`)      | —                         | —                         |
| Shadow           | nenhuma (`active:shadow-none`) | —                    | —                         |

#### Botão Escuro (Dark — "Schedule a Call")

```html
<button class="bg-site-neutrals-900 text-site-neutrals-0 hover:bg-site-neutrals-700 rounded-lg px-4 py-2.5 font-medium site-paragraph-m">
  Schedule a Call
</button>
```

| Propriedade   | Valor                          |
|---------------|--------------------------------|
| Background    | `#111111`                      |
| Hover bg      | `rgb(39, 46, 52)` (`neutrals-700`) |
| Texto         | `#FFFFFF`                      |
| Font size     | `16px`                         |
| Padding       | `10px 16px`                    |
| Border radius | `8px`                          |

#### Botão Ghost / Underline

```html
<button class="border-b-2 pr-8 bg-transparent border-current text-site-neutrals-900 hover:text-site-neutrals-700 hover:px-4 transform duration-200">
  Talk to an expert →
</button>
```

| Propriedade   | Valor                                          |
|---------------|------------------------------------------------|
| Background    | `transparent`                                  |
| Border        | `border-bottom: 2px solid currentColor`        |
| Padding right | `32px`                                         |
| Hover effect  | `hover:px-4` (adiciona padding-left no hover)  |
| Transição     | `transform duration-200`                       |

---

### Inputs e Formulários

```html
<!-- Input de texto -->
<input
  type="text"
  placeholder="Full name"
  class="w-full rounded-lg border border-site-neutrals-100 px-4 py-3 text-base text-site-neutrals-900 placeholder:text-site-neutrals-300 focus:outline-none focus:ring-2 focus:ring-site-primary-600 focus:border-transparent"
/>

<!-- Textarea -->
<textarea
  placeholder="Tell us about your needs."
  class="w-full rounded-lg border border-site-neutrals-100 px-4 py-3 text-base resize-none min-h-[5rem]"
></textarea>
```

| Propriedade         | Valor                                          |
|---------------------|------------------------------------------------|
| Background          | `#FFFFFF`                                      |
| Border              | `1px solid rgb(194, 199, 204)` (`neutrals-100`) |
| Border radius       | `8px` (`rounded-lg`)                           |
| Padding             | `12px 16px` (`py-3 px-4`)                     |
| Font size           | `16px`                                         |
| Cor do placeholder  | `rgb(127, 137, 147)` (`neutrals-300`)          |
| Focus state         | `ring-2 ring-site-primary-600` (anel laranja)  |
| Focus border        | `border-transparent`                           |

---

## 5. CSS / Tailwind Equivalente

### Reproduzindo o Header/Navbar

```html
<header class="sticky top-0 z-40 h-20 mb-10 bg-white text-sm transition-transform duration-300">
  <div class="flex h-full items-center justify-between px-8 xl:mx-auto box-content relative">
    <!-- Logo -->
    <a href="/">
      <img src="/logo.svg" alt="BairesDev" class="h-8" />
    </a>
    <!-- Nav -->
    <nav class="flex h-full items-center gap-6">
      <a href="#" class="text-gray-900 hover:text-orange-500 font-normal text-sm">Services</a>
      <!-- ... -->
    </nav>
    <!-- CTA -->
    <button class="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700">
      Schedule a Call
    </button>
  </div>
</header>
```

### Reproduzindo a Hero Section

```html
<section class="relative -mt-10 bg-gradient-to-b from-[#F6F7F8] to-[#D9DCDF] pb-24 md:bg-gradient-to-r md:pb-10">
  <div class="mx-4 mdS:mx-6 lgS:mx-auto lgS:max-w-[76rem]">
    
    <!-- Breadcrumb -->
    <nav class="flex items-center flex-wrap gap-2 pt-4 text-sm text-gray-700 lg:pt-8">
      <a href="/">🏠</a> / <a href="/solutions">Solutions</a> / <span>CRM</span>
    </nav>

    <div class="flex justify-between items-start">
      <!-- Left -->
      <div class="py-8 lg:px-16">
        <p class="text-sm font-bold tracking-[2px] uppercase text-gray-500 mb-4">
          CRM Development Services
        </p>
        <h1 class="text-[60px] font-bold leading-[72px] text-[#111111] text-center lg:text-left">
          Build custom CRM solutions with experts trusted by
          <strong class="text-[#F66135]">1500+</strong> companies.
        </h1>
        <p class="mt-6 text-xl leading-[30px] text-gray-700 max-w-[38rem]">
          We build custom CRM platforms...
        </p>
      </div>

      <!-- Right: Form Card (hidden on mobile) -->
      <div class="hidden lg:block mt-10">
        <div class="w-[343px] rounded-3xl bg-white p-6 shadow-2xl">
          <!-- form -->
        </div>
      </div>
    </div>
  </div>
</section>
```

### Reproduzindo o Feature Card Grid

```html
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
  <div class="rounded-lg bg-[#F6F7F8] p-6">
    <div class="mb-3 text-[#F66135]">
      <!-- ícone SVG -->
    </div>
    <h3 class="text-lg font-semibold text-[#111111] mb-2">Vetted Senior Talent</h3>
    <p class="text-sm text-[#3D4751] leading-6">
      We hire the top 1% of over two million applicants...
    </p>
  </div>
  <!-- repetir para outros cards -->
</div>
```

### Reproduzindo o Overline Label

```html
<!-- Usando before: pseudo-elemento no Tailwind -->
<p class="text-sm font-bold tracking-[2px] uppercase text-[#687580]
          before:content-[''] before:inline-block before:w-2 before:h-2
          before:rounded-sm before:bg-[#F66135] before:mr-2 before:mb-[1px]">
  Custom CRM Development Services
</p>
```

### Reproduzindo o Botão CTA Laranja

```html
<button class="flex items-center justify-center gap-2 rounded-lg
               bg-[#F66135] px-4 py-3
               text-xl font-medium text-white
               hover:bg-[#F88A6A]
               active:shadow-none
               disabled:bg-gray-200 disabled:text-gray-400
               transition-colors duration-150">
  Jump-start Your Project
</button>
```

---

## 6. Tokens de Design

```css
:root {
  /* === BRAND COLORS === */
  --primary:           #F66135;   /* rgb(246, 97, 53)  — laranja principal */
  --primary-light:     #FBB39E;   /* rgb(251, 179, 158) — laranja claro */
  --primary-lighter:   #FDDCD3;   /* rgb(253, 220, 211) — laranja muito claro */
  --primary-hover:     #F88A6A;   /* rgb(248, 138, 106) — hover do botão */

  /* === NEUTRAL SCALE === */
  --neutral-0:         #FFFFFF;   /* rgb(255, 255, 255) — branco puro */
  --neutral-25:        #F6F7F8;   /* rgb(246, 247, 248) — background surface */
  --neutral-50:        #D9DCDF;   /* rgb(217, 220, 223) — divisores/borders light */
  --neutral-100:       #C2C7CC;   /* rgb(194, 199, 204) — borders padrão */
  --neutral-200:       #959EA6;   /* rgb(149, 158, 166) — texto desativado */
  --neutral-300:       #7F8993;   /* rgb(127, 137, 147) — placeholder text */
  --neutral-400:       #687580;   /* rgb(104, 117, 128) — texto sutil / overlines */
  --neutral-500:       #52606D;   /* rgb(82,  96, 109)  — texto médio */
  --neutral-600:       #3D4751;   /* rgb(61,  71,  81)  — texto secundário */
  --neutral-700:       #272E34;   /* rgb(39,  46,  52)  — hover de dark button */
  --neutral-800:       #1B1F22;   /* rgb(27,  31,  34)  — texto body escuro */
  --neutral-900:       #111111;   /* rgb(17,  17,  17)  — quase-preto / dark sections */

  /* === SEMANTIC ROLES === */
  --background:        var(--neutral-0);
  --background-alt:    var(--neutral-25);
  --surface:           var(--neutral-0);
  --text:              var(--neutral-900);
  --text-muted:        var(--neutral-600);
  --text-subtle:       var(--neutral-400);
  --border:            var(--neutral-100);
  --border-light:      var(--neutral-50);

  /* === TYPOGRAPHY === */
  --font-family:       'Outfit', sans-serif;

  --text-display-xl:   60px;
  --lh-display-xl:     72
