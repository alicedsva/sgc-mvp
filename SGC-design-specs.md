# Design Specifications — Sistema de Gestão de Carreiras

> Fonte da verdade: `src/styles/theme.css`, `src/styles/fonts.css`, `src/styles/dark-mode.css`  
> Stack: React 18 + TypeScript + Vite 6 + Tailwind CSS v4

---

## 1. Tipografia

### Fonte base

| Propriedade | Valor |
|---|---|
| Família | DM Sans (Google Fonts) |
| Fallbacks | -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif |
| Tamanho base (`html`) | `16px` (`--font-size: 16px`) |
| Line-height padrão | `1.5` |

### Pesos disponíveis (tokens)

| Token | Valor | Uso |
|---|---|---|
| `--font-weight-normal` | `400` | Texto corrido, inputs |
| `--font-weight-medium` | `500` | Títulos, labels, botões |

> Tailwind `font-semibold` (600) é usado em títulos de página e cabeçalhos de drawer — não mapeado em token, use com atenção.

### Tamanhos por contexto

| Contexto | Classes Tailwind | px equivalente | Peso | Cor |
|---|---|---|---|---|
| Título de página (h1) | `text-2xl font-semibold text-gray-900` | 24px | 600 | `#111827` |
| Subtítulo de página | `text-sm text-gray-600 mt-2` | 14px | 400 | `#4b5563` |
| Título de drawer | `text-base md:text-lg lg:text-xl font-semibold text-gray-900` | 16–20px | 600 | `#111827` |
| Label de campo (form) | `text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2` | 12–14px | 500 | `#374151` |
| Cabeçalho de coluna (table) | `text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider` | 10–12px | 500 | `#6b7280` |
| Conteúdo de célula (table) | `text-xs md:text-sm text-gray-900` | 12–14px | 400 | `#111827` |
| Texto secundário / meta | `text-xs md:text-sm text-gray-500` | 12–14px | 400 | `#6b7280` |
| Botão primário / secundário | `text-xs md:text-sm font-medium` | 12–14px | 500 | variável |
| Filtro de status (pill) | `text-xs font-medium` (mobile) / `text-sm font-normal` (desktop) | 12–14px | 400–500 | `#4b5563` / `#111827` |
| Paginação — contagem | `text-xs md:text-sm text-gray-700` | 12–14px | 400 | `#374151` |
| Paginação — botões | `text-xs font-normal` | 12px | 400 | `#4b5563` |
| Mensagem de erro (campo) | `text-sm text-red-600` | 14px | 400 | `#dc2626` |
| Alert banner — título | `text-sm font-medium` | 14px | 500 | variável por variante |
| Alert banner — corpo | `text-sm leading-relaxed` | 14px | 400 | variável por variante |
| Ação inline (text variant) | `text-xs md:text-sm font-medium text-[var(--brand-600)]` | 12–14px | 500 | `#0083A1` |

---

## 2. Espaçamentos

### Header de página

```
space-y-6        — gap vertical entre seções (24px)
mt-2             — margem do subtítulo em relação ao título
```

### Toolbar de filtros (`ListingPage`)

```
p-3 md:p-4       — padding da toolbar (12px mobile / 16px desktop)
gap-3            — espaço entre elementos internos
```

### Tabela (`Table.tsx`)

| Área | Classes | Valor |
|---|---|---|
| Células (header e data) | `px-3 md:px-6 py-3 md:py-4` | H: 12–24px / V: 12–16px |
| Linha de cabeçalho | `border-b border-gray-200 bg-gray-50` | — |
| Separador de linhas | `divide-y divide-gray-200` | — |
| Footer de paginação | `px-3 md:px-6 py-3 md:py-4` | H: 12–24px / V: 12–16px |

### Drawer (`FormDrawer.tsx`)

| Área | Classes | Valor |
|---|---|---|
| Header | `px-4 md:px-6 py-3 md:py-4` | H: 16–24px / V: 12–16px |
| Campos (scroll area) | `px-4 md:px-6 py-4 md:py-6` | H: 16–24px / V: 16–24px |
| Gap entre campos | `space-y-4 md:space-y-5` | 16–20px |
| Footer | `px-4 md:px-6 py-3 md:py-4` | H: 16–24px / V: 12–16px |
| Gap entre botões | `gap-2 md:gap-3` | 8–12px |
| Label → input | `mb-1.5 md:mb-2` | 6–8px |

### Campos de input

```
px-3 py-2        — padding interno (12px H / 8px V)
rounded-lg       — border-radius (8px, via --radius: 0.625rem)
border border-gray-300
focus:ring-2 focus:ring-[var(--brand-500)]
```

### Botões de ação inline (ícone)

```
p-1.5 md:p-2     — padding (6–8px)
rounded-lg
```

---

## 3. Cores — Tokens CSS

Todos os tokens estão em `src/styles/theme.css` dentro de `:root` (light) e `.dark`.

### Paleta de marca

| Token | Light | Dark |
|---|---|---|
| `--brand-50` | `#E6F7FB` | ← (sem alteração) |
| `--brand-100` | `#CCEFF7` | |
| `--brand-200` | `#99DFEF` | |
| `--brand-300` | `#66CFE7` | |
| `--brand-400` | `#33BFDF` | |
| `--brand-500` | `#009FC2` | |
| `--brand-600` | `#0083A1` | |
| `--brand-700` | `#006780` | |
| `--brand-800` | `#004B5F` | |
| `--brand-900` | `#002F3E` | |
| `--brand-950` | `#001E28` | |

> **Uso principal:** `--brand-500` para focus rings e ícones ativos; `--brand-600` para botões primários; `--brand-700` para hover de botões.

### Texto

| Token | Light | Dark |
|---|---|---|
| `--text-primary` | `#111827` | `#f9fafb` |
| `--text-secondary` | `#6b7280` | `#9ca3af` |
| `--text-tertiary` | `#9ca3af` | `#6b7280` |
| `--text-disabled` | `#d1d5db` | `#4b5563` |

### Backgrounds e superfícies

| Token | Light | Dark |
|---|---|---|
| `--background` | `#ffffff` | `#0f1114` |
| `--surface` | `#ffffff` | `#1a1d21` |
| `--surface-hover` | `#f9fafb` | `#22262b` |

### Bordas

| Token | Light | Dark |
|---|---|---|
| `--border-primary` | `#e5e7eb` | `#2d3238` |
| `--border-secondary` | `#f3f4f6` | `#22262b` |

### Inputs

| Token | Light | Dark |
|---|---|---|
| `--input-background` | `#ffffff` | `#1a1d21` |
| `--input-border` | `#d1d5db` | `#2d3238` |
| `--input-border-hover` | `#9ca3af` | `#3f4651` |
| `--input-border-focus` | `var(--brand-500)` | `var(--brand-400)` |

### Tabelas

| Token | Light | Dark |
|---|---|---|
| `--table-header-bg` | `#f9fafb` | `#1a1d21` |
| `--table-header-text` | `#6b7280` | `#9ca3af` |
| `--table-row-hover` | `#f9fafb` | `#22262b` |
| `--table-border` | `#e5e7eb` | `#2d3238` |

### Status

| Token | Light | Dark |
|---|---|---|
| `--status-active-bg` | `#dcfce7` | `#064e3b` |
| `--status-active-text` | `#166534` | `#6ee7b7` |
| `--status-inactive-bg` | `#fee2e2` | `#7f1d1d` |
| `--status-inactive-text` | `#991b1b` | `#fca5a5` |

### Sombras

| Token | Valor (Light) |
|---|---|
| `--shadow-sm` | `0px 1px 2px 0px rgba(0,0,0,0.05)` |
| `--shadow-md` | `0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.1)` |
| `--shadow-lg` | `0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)` |

---

## 4. Componentes — Padrões de classe

### Página de listagem (`ListingPage`)

```html
<!-- Cabeçalho -->
<h1 class="text-2xl font-semibold text-gray-900">Título</h1>
<p class="text-sm text-gray-600 mt-2">Subtítulo</p>

<!-- Toolbar -->
<div class="bg-white rounded-lg border border-gray-200 p-3 md:p-4">

<!-- Container da tabela -->
<div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
```

### Tabela (`Table.tsx`)

```html
<thead>
  <tr class="border-b border-gray-200 bg-gray-50">
    <th class="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">
</thead>
<tbody class="bg-white divide-y divide-gray-200">
  <td class="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900">
```

### Drawer de formulário (`FormDrawer`)

**Largura:** `w-full md:w-[35%] md:max-w-xl md:min-w-[400px]`

```html
<!-- Label -->
<label class="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">

<!-- Input / Select -->
<input class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent">

<!-- Textarea -->
<textarea rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                          focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent resize-none">

<!-- Footer -->
<div class="flex items-center justify-end gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 border-t border-gray-200 bg-gray-50">

<!-- Botão cancelar -->
<button class="px-3 md:px-4 py-2 border border-gray-300 text-gray-700 text-xs md:text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">

<!-- Botão salvar (outline brand) -->
<button class="px-3 md:px-4 py-2 border border-[var(--brand-600)] text-[var(--brand-600)] text-xs md:text-sm font-medium rounded-lg hover:bg-[var(--brand-50)] transition-colors">

<!-- Botão ação primária (filled brand) -->
<button class="px-3 md:px-4 py-2 bg-[var(--brand-600)] text-white text-xs md:text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors">
```

### Filtro de status (pill segmentado)

```html
<!-- Container -->
<div class="flex items-center bg-gray-100 rounded-lg p-1">
  <!-- Item ativo -->
  <button class="px-3 py-2 text-sm font-normal rounded-md bg-white text-gray-900 shadow-sm transition-all">
  <!-- Item inativo -->
  <button class="px-3 py-2 text-sm font-normal rounded-md text-gray-600 hover:text-gray-900 transition-all">
```

### Botão de ação primária (toolbar)

```html
<button class="inline-flex items-center gap-2 px-4 py-2
               bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg
               hover:bg-[var(--brand-700)] transition-colors">
```

### FAB (mobile)

```html
<button class="md:hidden fixed bottom-6 right-6 w-14 h-14
               bg-[var(--brand-600)] text-white rounded-full shadow-lg
               hover:bg-[var(--brand-700)] active:scale-95 transition-all
               flex items-center justify-center z-40">
```

### Ícones de navegação (Sidebar)

Biblioteca: `lucide-react` (única biblioteca de ícones no projeto)

| Contexto | Item de menu | Ícone |
|---|---|---|
| Admin — sidebar | Dashboard | `LayoutDashboard` |
| Admin — sidebar | Perfis | `Users` |
| Admin — sidebar | Habilidades | `Award` |
| Admin — sidebar | Carreiras | `Briefcase` |
| Admin — sidebar | Avaliações | `ClipboardCheck` |
| Colaborador — sidebar | Meu Perfil | `UserCircle` |
| Colaborador — sidebar | Minhas Avaliações | `ClipboardCheck` |
| Colaborador — sidebar | Minha Carreira | `TrendingUp` |

> O ícone `Layers` é usado no logo da sidebar — não é item de navegação.

### Badges de status de registro

| Label | Classes de cor | Uso |
|---|---|---|
| `Ativa` | `bg-green-100 text-green-800` | Competências, Habilidades, Carreiras, Jornadas, Avaliações ativas |
| `Desativada` | `bg-red-100 text-red-700` | Registros desativados |
| `Rascunho` | `bg-yellow-100 text-yellow-800` | Avaliações não publicadas |
| `Encerrada` | `bg-gray-100 text-gray-700` | Avaliações com período encerrado |
| `Arquivado` | `bg-gray-100 text-gray-700` | Níveis arquivados |

---

## 5. Breakpoints

| Breakpoint | Prefixo Tailwind | Largura |
|---|---|---|
| Mobile (padrão) | — | `< 768px` |
| Desktop | `md:` | `≥ 768px` |
| Large desktop | `lg:` | `≥ 1024px` |

> O sistema é **mobile-first**. Todas as regras sem prefixo se aplicam ao mobile; `md:` sobrescreve para desktop.

---

## 6. Classes de utilidade (dark-mode.css)

Mapeiam tokens CSS para classes reutilizáveis:

| Classe | Token | Uso |
|---|---|---|
| `.bg-surface` | `--surface` | Fundo de cards e painéis |
| `.bg-surface-hover` | `--surface-hover` | Hover de linhas e itens |
| `.hover:bg-surface-hover` | `--surface-hover` | Hover state |
| `.text-primary` | `--text-primary` | Texto principal |
| `.text-secondary` | `--text-secondary` | Texto de apoio |
| `.text-tertiary` | `--text-tertiary` | Texto terciário |
| `.text-disabled` | `--text-disabled` | Texto desabilitado |
| `.border-primary` | `--border-primary` | Bordas principais |
| `.border-secondary` | `--border-secondary` | Bordas secundárias |
| `.icon-primary` | `--icon-primary` | Ícones padrão |
| `.icon-secondary` | `--icon-secondary` | Ícones secundários |
| `.icon-active` | `--icon-active` | Ícones ativos/selecionados |

---

## 7. Border Radius

| Token | Valor |
|---|---|
| `--radius` | `0.625rem` (10px) |

Tailwind `rounded-lg` (8px) é o padrão aplicado na maioria dos elementos. `rounded-full` é reservado para FABs e avatares.
