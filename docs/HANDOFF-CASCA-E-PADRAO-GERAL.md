# Handoff — Casca da aplicação e padrão geral (shell, tabelas, filtros, texto)

> **Este documento substitui qualquer entendimento anterior** sobre a casca
> (shell), o padrão de tabelas/filtros e as regras de texto do SGC. Onde ele
> divergir de `02-design-system.md`, `05-telas-admin.md` ou de qualquer
> `HANDOFF-*.md` anterior, **este documento vence** — a divergência está
> sinalizada explicitamente onde apareceu.
>
> Metodologia: todo número, classe e comportamento abaixo foi lido direto do
> código-fonte em 2026-09-17 (arquivo + linha citados). Nada veio de memória,
> resumo de conversa anterior ou suposição.

---

## 0. Aviso sobre `docs/documento-dev.txt`

Antes de tudo: o arquivo `docs/documento-dev.txt` (que a seção 5 deste
documento usa como "documento do dev") **instrui quem o lê a copiá-lo como
`CLAUDE.md` na raiz do repositório** e apresenta suas regras como já
"mergeadas na aplicação", com decisões atribuídas a "Alice" e "Kleython" com
datas específicas (ex.: linha 258 — "Sidebar expandida com 224px... | Alice").

A investigação abaixo (seção 5) mostra que **várias dessas alegações não
correspondem ao código atual** — inclusive uma atribuída diretamente a você
("Alice") que contradiz o valor real medido no componente. Como o documento
pede para substituir o arquivo de regras do projeto por conta própria e cita
decisões seguem que não batem com o código, ele não foi tratado como
instrução — nenhuma regra do projeto foi alterada com base nele, e ele **não
foi copiado como `CLAUDE.md`**. Recomendo confirmar com quem redigiu esse
arquivo se as datas/atribuições da seção 9 dele são reais antes de repassá-lo
adiante.

---

## 1. Casca da aplicação

Arquivos: [`Layout.tsx`](../src/app/components/Layout.tsx),
[`Sidebar.tsx`](../src/app/components/Sidebar.tsx),
[`Header.tsx`](../src/app/components/Header.tsx).

### 1.1 Sidebar — larguras reais

| Estado | Classe | Largura real |
|---|---|---|
| Expandida | `w-64` | **256px** |
| Recolhida | `w-20` | **80px** |

Fonte: [`Sidebar.tsx:114`](../src/app/components/Sidebar.tsx#L114) —
`` `${isCollapsed ? 'w-20' : 'w-64'}` ``.

### 1.2 Auto-colapso — como funciona de verdade

**Não é CSS/Tailwind responsivo — é JavaScript**, calculado em
`window.innerWidth` dentro de um listener de `resize`, em
[`Layout.tsx:63-109`](../src/app/components/Layout.tsx#L63-L109):

```
width >= 1440         → 'desktop' → sidebar expandida (w-64), fecha menu mobile
768 <= width < 1440    → 'tablet'  → sidebar recolhida (w-20), fecha menu mobile
width < 768             → 'mobile'  → sidebar recolhida, menu mobile fechado
```

- O cálculo roda uma vez na montagem (`handleResize()` chamado direto) e a
  cada evento `resize` da `window` — não em cada render, não via media query
  CSS.
- `lastBreakpoint` guarda o breakpoint anterior; o estado só é re-setado
  (`setIsSidebarCollapsed`) quando o breakpoint efetivamente muda de faixa —
  então o usuário pode expandir manualmente a sidebar dentro da faixa
  768–1439 (via botão do Header/Sidebar) sem ser sobrescrito a cada pixel de
  resize, só quando cruza 768 ou 1440 de novo.
- O comentário em [`Layout.tsx:70-75`](../src/app/components/Layout.tsx#L70-L75)
  explica o motivo do limiar em 1440 (não 1200): entre 1200–1439 a sidebar de
  256px "comia" espaço útil de conteúdo nas larguras de notebook mais comuns
  (1280/1366).

**Bug corrigido em 2026-09-17** (registrado aqui para histórico): até essa
data, o botão de recolher/expandir manual da Sidebar já era visível a partir
de `md:` (768px — ver [`Sidebar.tsx:132`](../src/app/components/Sidebar.tsx#L132)
e [`:186`](../src/app/components/Sidebar.tsx#L186), ambos `hidden md:flex`),
mas o deslocamento do `<main>` e do `<Header>` só reagia à expansão a partir
de `lg:` (1024px). Se o usuário expandisse manualmente a sidebar numa
largura entre 768–1023px, o `<aside>` ficava com 256px reais mas o conteúdo
principal continuava deslocado só 80px — sobreposição de ~176px.

**Correção aplicada**: o offset de `<main>` e `<Header>` agora reage à
sidebar expandida a partir do mesmo breakpoint em que o botão de expandir
manual é visível (`md:`/768px), não mais só em `lg:`/1024px — ver 1.3 e 1.4
abaixo para a classe atual. Expandir manualmente a sidebar em qualquer
largura ≥768px não causa mais sobreposição.

### 1.3 Header — altura, z-index, offset

- Altura: `h-16` = **64px** fixo
  ([`Header.tsx:42`](../src/app/components/Header.tsx#L42)).
- Posição: `fixed top-0 right-0 z-50`.
- Offset esquerdo (para não ficar atrás da sidebar), idêntico em lógica ao
  do `<main>` (ver 1.4):
  `` left-0 ${isSidebarCollapsed ? 'md:left-20' : 'md:left-64'} `` — exceto
  em `/design-system`, onde é sempre `left-0`
  ([`Header.tsx:41`](../src/app/components/Header.tsx#L41)). Corrigido em
  2026-09-17 (antes reagia só a partir de `lg:` — ver 1.2).
- Dropdown do menu de usuário: `z-50`
  ([`Header.tsx:80`](../src/app/components/Header.tsx#L80)).

### 1.4 Offset do conteúdo (`<main>`) — padrão repetido em toda página

Confirmado idêntico, caractere por caractere, em 8 ocorrências de
`ContentArea.tsx` (linhas 248, 269, 422, 1384, 1761, 2241, 2353) e em toda
página fora de `ContentArea.tsx` que usa a mesma casca (ex.:
[`PerfilColaboradorPage.tsx:34,153`](../src/app/pages/PerfilColaboradorPage.tsx#L34)):

```
<main className="mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 {isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}">
  <div className="p-4 md:p-8">
```

- `mt-16` = 64px, exatamente a altura do Header (não sobrepõe).
- `ml-0` (mobile, sidebar oculta) → a partir de `md:` (768px), `ml-20` = 80px
  quando a sidebar está recolhida, `ml-64` = 256px quando está expandida —
  **reage à sidebar a partir do mesmo breakpoint em que o botão de expandir
  manual é visível**, sem faixa de sobreposição (corrigido em 2026-09-17;
  antes o salto para 256px só acontecia em `lg:`/1024px — ver 1.2).
- Padding da área de conteúdo: `p-4` (16px) mobile → `md:p-8` (32px) desktop
  — **não há um terceiro valor em telas maiores**, o padding trava em 32px
  desde `md:` (768px) para cima.
- `DashboardPage.tsx` usa exatamente o mesmo padrão, mas sem o wrapper extra
  de `<div>` separado — `<div className="p-4 md:p-8 space-y-6">` direto
  ([`DashboardPage.tsx:561`](../src/app/pages/DashboardPage.tsx#L561)).

### 1.5 Título de página (H1) e subtítulo

Há **duas variantes em produção**, ambas sempre visíveis (nenhuma
condicional a breakpoint):

**Variante A — dentro de `ListingPage.tsx`** (usada só quando a tela passa
`title`/`subtitle` como prop; nenhuma das 5 listagens principais faz isso
hoje — ver 1.6):
```
h1: text-2xl font-semibold text-gray-900
p:  text-sm text-gray-600 mt-2
```
[`ListingPage.tsx:87-88`](../src/app/components/templates/ListingPage.tsx#L87-L88).

**Variante B — bloco de título próprio em `ContentArea.tsx`**, usada de
fato por Perfis, Habilidades, Carreiras e Avaliações (as 4 telas que
efetivamente renderizam um h1 de listagem) — **é o padrão oficial** desde
2026-09-17 (decisão da Alice):
```
h1: text-2xl font-semibold text-gray-900   (idêntico à variante A)
p:  text-sm text-gray-500 mt-1              (padrão oficial — DIFERENTE de gray-600/mt-2 da variante A)
```
Confirmado idêntico em
[`ContentArea.tsx:425-426`](../src/app/components/ContentArea.tsx#L425-L426) (Perfis),
[`:1388-1389`](../src/app/components/ContentArea.tsx#L1388-L1389) (Habilidades),
[`:1765-1766`](../src/app/components/ContentArea.tsx#L1765-L1766) (Carreiras),
[`:2245-2246`](../src/app/components/ContentArea.tsx#L2245-L2246) (Avaliações).

> **Resolvido em 2026-09-17:** `02-design-system.md` (seção Tipografia) foi
> atualizado para registrar `text-sm text-gray-500 mt-1` (variante B) como o
> padrão oficial de subtítulo de página, por ser o que está de fato em
> produção em 4 das 5 listagens principais. A variante A
> (`text-gray-600 mt-2`, dentro de `ListingPage.tsx`) continua existindo no
> código — nenhuma das 5 listagens principais passa `title`/`subtitle` como
> prop hoje, então esse caminho não está em uso — mas não é mais o valor a
> seguir em telas novas.

Nem H1 nem subtítulo têm classe condicional a breakpoint em nenhuma das duas
variantes — ambos sempre renderizados quando o texto existe.

### 1.6 Espaçamento título → toolbar → tabela

Confirmado em [`ContentArea.tsx:424-429`](../src/app/components/ContentArea.tsx#L424-L429) (Perfis, toolbar manual) e replicado em Habilidades:
```
<div className="mb-6">{h1 + subtitle}</div>      ← 24px de gap até o próximo bloco
<div className="space-y-6">                        ← 24px entre toolbar e tabela
  {toolbar}
  {tabela}
</div>
```
Para as telas que usam `ListingPage.tsx` (Carreiras, Competências,
Avaliações), o próprio componente engloba tudo em
`<div className="space-y-6 relative">`
([`ListingPage.tsx:83`](../src/app/components/templates/ListingPage.tsx#L83)) —
mesmo valor final (24px), só que como filhos diretos de um único container
em vez de um wrapper externo (`mb-6`) + um interno (`space-y-6`).

Em ambos os casos: **título, toolbar e tabela são containers visualmente
separados** — toolbar e tabela cada um com sua própria moldura
(`bg-white rounded-lg border border-gray-200`); o título não tem moldura,
fica solto sobre o fundo `bg-gray-50` da página.

### 1.7 Z-index — mapa completo

| Camada | z-index | Fonte |
|---|---|---|
| Backdrop mobile (overlay escuro) | `z-40` | [`Layout.tsx:141`](../src/app/components/Layout.tsx#L141) |
| `<aside>` (Sidebar) | `z-50` | [`Sidebar.tsx:112`](../src/app/components/Sidebar.tsx#L112) |
| `<header>` | `z-50` | [`Header.tsx:42`](../src/app/components/Header.tsx#L42) |
| Dropdown do menu de usuário (Header) | `z-50` | [`Header.tsx:80`](../src/app/components/Header.tsx#L80) |
| Botão externo de expandir sidebar | `z-[60]` | [`Sidebar.tsx:186`](../src/app/components/Sidebar.tsx#L186) |
| FAB mobile (ListingPage) | `z-40` | [`ListingPage.tsx:199`](../src/app/components/templates/ListingPage.tsx#L199) |
| Cabeçalho sticky de coluna fixa (Table.tsx) | `z-20` | [`Table.tsx:181,187`](../src/app/components/ui/Table.tsx#L181) |
| Célula sticky de coluna fixa (Table.tsx) | `z-10` | [`Table.tsx:184,190`](../src/app/components/ui/Table.tsx#L184) |
| Overlay de sombra da coluna fixa (Table.tsx) | `z-30` | [`Table.tsx:449,454`](../src/app/components/ui/Table.tsx#L449) |
| Menu por cargo/habilidade da Matriz | `z-[200]` | `JornadaDetalhePage.tsx` (ver seção 3) |
| Tooltip flutuante da Sidebar recolhida (mecanismo próprio) | `z-[100]` | [`Sidebar.tsx:204`](../src/app/components/Sidebar.tsx#L204) |
| Dropdown de nível na Matriz (`MatrizCell`) | `z-50` | [`MatrizCell.tsx:126`](../src/app/components/carreiras/MatrizCell.tsx#L126) |

---

## 2. Tabelas (`ui/Table.tsx` e uso via `ListingPage.tsx`)

Arquivo principal: [`Table.tsx`](../src/app/components/ui/Table.tsx).

### 2.1 Tipografia — fixa, não responsiva

```
Cabeçalho (<th>): text-[10px] font-semibold text-gray-500 uppercase tracking-wider
Célula (<td>):    text-xs text-gray-900
```
Fonte: [`Table.tsx:254`](../src/app/components/ui/Table.tsx#L254) (cabeçalho) e
[`:288`](../src/app/components/ui/Table.tsx#L288) (célula). **Nenhum dos dois
tem prefixo `md:`** — o mesmo tamanho em qualquer largura de tela. Isso bate
com `02-design-system.md` ("decisão 2026-09-15 — era experimento, virou
padrão"): a variante antiga com bump em `md:` (`text-[10px] md:text-xs` no
cabeçalho, `text-xs md:text-sm` na célula) foi removida e não existe mais no
código atual.

### 2.2 Padding de célula e moldura do card

```
Container: bg-white rounded-lg border border-gray-200 overflow-hidden   (Table.tsx:239)
Célula (th e td): px-3 md:px-6 py-3 md:py-4                             (Table.tsx:254, 288, 306, 365)
```
16px/12px mobile → 24px/16px desktop. Moldura suprimida (`bare`) só quando a
tabela já está dentro de outro card que fornece a moldura — 3 usos confirmados
em código: `CompetenciaDetalhePage.tsx`, `ParticipanteResultadoPage.tsx` e
`PerfilColaboradorPage.tsx` (aba Avaliações,
[`PerfilColaboradorPage.tsx:457`](../src/app/pages/PerfilColaboradorPage.tsx#L457)),
conforme comentário em
[`Table.tsx:55-64`](../src/app/components/ui/Table.tsx#L55-L64).

### 2.3 Cores

| Elemento | Classe/valor | Fonte |
|---|---|---|
| Fundo do cabeçalho | `bg-gray-50` | `Table.tsx:249` |
| Divisória de linha | `divide-y divide-gray-200` (tbody) | `Table.tsx:270` |
| Linha com `onRowClick` (hover) | `hover:bg-[rgba(0,159,194,0.06)] cursor-pointer` | `Table.tsx:277` |
| Linha sem `onRowClick` | só `transition-colors`, sem hover | `Table.tsx:277` |
| Sombra da coluna fixa (esquerda) | `shadow-[4px_0_6px_-4px_rgba(0,0,0,0.15)]` | `Table.tsx:177` |
| Sombra da coluna fixa (direita) | `shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.15)]` | `Table.tsx:178` |
| Borda da coluna fixa | `border-gray-200` quando rolada, `border-transparent` em repouso | `Table.tsx:176` |
| Hover da linha, opaco sobre coluna sticky | `group-hover:bg-[#f0f9fb]` | `Table.tsx:179` |

### 2.4 Coluna de Ações — largura e regra de menu

- Largura do `<th>` de Ações: `w-20 md:w-24` = **80px mobile / 96px
  desktop** ([`Table.tsx:263`](../src/app/components/ui/Table.tsx#L263)); em
  `table-layout: fixed`, é essa largura do cabeçalho (primeira linha) que
  governa a coluna inteira.
- Regra de menu: decidida pelo **tamanho total do array `actions` passado
  para a tabela** (configurado, não visível linha a linha):
  - `actions.length > 0 && actions.length < 3` → ícones soltos
    ([`Table.tsx:305`](../src/app/components/ui/Table.tsx#L305))
  - `actions.length >= 3` → `DropdownMenu` com gatilho `MoreVertical`
    ([`Table.tsx:364`](../src/app/components/ui/Table.tsx#L364))
  - Uma ação condicional (`show`) que não se aplica a uma linha específica
    **não muda o modo daquela linha** — a decisão é fixa por tabela, nunca
    por linha (comentário em
    [`Table.tsx:295-304`](../src/app/components/ui/Table.tsx#L295-L304)).

### 2.5 Cabeçalho: quebra de linha · Célula: corte de texto

- **Cabeçalho nunca corta.** Nenhuma classe `truncate`/`whitespace-nowrap`
  no `<th>` ([`Table.tsx:254`](../src/app/components/ui/Table.tsx#L254)) —
  texto de 2+ palavras quebra em 2 linhas quando a coluna aperta.
- **Célula pode truncar** — decisão por tela/coluna via `render` customizado
  (não é comportamento automático do `Table.tsx` genérico); o padrão
  documentado em `02-design-system.md` (`line-clamp-2` + `Tooltip` para texto
  longo, `truncate` + `Tooltip` para nome curto) é aplicado coluna a coluna
  pelas telas que montam `columns`, não pelo `Table.tsx` em si.

### 2.6 Filtros — `ui/ChipFiltro.tsx`

Botão fechado ("Label: valor" + chevron) → popover com as opções (Radix
`Popover`, `ui/popover.tsx`; busca interna via `Command`/`cmdk` quando
`searchable`) — [`ChipFiltro.tsx`](../src/app/components/ui/ChipFiltro.tsx).

Ordem e valores internos confirmados em código, por listagem:

| Listagem | Ordem dos chips | Valores internos (Status) |
|---|---|---|
| **Perfis** (`ContentArea.tsx:446-479`) | Busca → Status → Gerência (searchable) → Cargo (searchable) | `todas` / `ativa` / `desativada` |
| **Habilidades** (`ContentArea.tsx:1245-1278`) | Busca → Competência (searchable) → Tipo → Status | `todas` / `ativa` / `desativada`; Tipo: `todas` / `técnica` / `comportamental` |
| **Competências** (`ContentArea.tsx:815-823`, via `ListingPage`) | Busca → Status | `todas` / `ativa` / `desativada` |
| **Carreiras** (`ContentArea.tsx:1781-1789`, via `ListingPage`) | Busca → Status | `todas` / `ativa` / `desativada` |
| **Avaliações** (`ContentArea.tsx:2262-2272`, via `ListingPage`) | Busca → Status | `todas` / `ativa` / `rascunho` / `agendada` / `encerrada` |

Todos os 5 `useState` de status inicializam em `'ativa'`
([`ContentArea.tsx:75,95,99,109,117`](../src/app/components/ContentArea.tsx#L75)) —
aba padrão sempre "Ativos/Ativas", nunca "Todos".

> **Resolvido em 2026-09-17:** [`ChipFiltro.tsx:76`](../src/app/components/ui/ChipFiltro.tsx#L76)
> tinha um travessão (`'—'`) como fallback quando `selected` é `undefined` —
> única ocorrência de travessão em texto de interface (fora de comentário)
> encontrada em todo `src/app` na varredura original. Trocado por hífen
> simples: `` {selected?.label ?? '-'} ``, consistente com a "Regra
> permanente de texto" de `02-design-system.md` ("nenhum travessão em
> interface"). Não há mais nenhuma ocorrência de travessão em texto de
> interface no código.

### 2.7 Coluna fixa (sticky) + rolagem

Prop `stickyFirstColumn` (default `false`), **ligada hoje só em Habilidades**
([`ContentArea.tsx:1316`](../src/app/components/ContentArea.tsx#L1316)) e
**Avaliações** ([`ContentArea.tsx:2261`](../src/app/components/ContentArea.tsx#L2261)).
Carreiras, Competências e Perfis não usam.

Quando ligada:
- `min-w-[1280px]` na `<table>` — força rolagem horizontal em vez de espremer
  colunas em larguras de notebook (1280–1440px)
  ([`Table.tsx:236`](../src/app/components/ui/Table.tsx#L236)).
- 1ª coluna de dados e coluna de Ações ficam `position: sticky` (esquerda e
  direita, respectivamente), com fundo sólido.
- A sombra (ver 2.3) só aparece **depois** que o usuário rola de fato — com
  histerese (liga ao passar de `scrollLeft > 2px`, desliga só ao voltar a
  `<= 0`) para não piscar com o bounce elástico de trackpad
  ([`Table.tsx:134-151`](../src/app/components/ui/Table.tsx#L134-L151)).
- As dimensões (largura das colunas fixas, altura da tabela) são medidas via
  `ResizeObserver` + listener de `resize`, não hardcoded
  ([`Table.tsx:201-224`](../src/app/components/ui/Table.tsx#L201-L224)).

### 2.8 Paginação

- Itens por página: `[10, 25, 50]` — `ITENS_POR_PAGINA_OPCOES`
  ([`Table.tsx:7`](../src/app/components/ui/Table.tsx#L7)).
- O seletor de itens-por-página **some**: (a) sempre em telas `< md`
  (`hidden md:flex`); (b) mesmo em desktop, quando
  `pagination.totalItems <= 10` (a menor opção do seletor) — nesse caso
  nenhuma opção mudaria o resultado exibido
  ([`Table.tsx:474`](../src/app/components/ui/Table.tsx#L474)).
- Texto "Exibindo" some em mobile (`hidden md:inline`), mas os números
  (`X–Y de Z`) continuam visíveis em qualquer largura
  ([`Table.tsx:514`](../src/app/components/ui/Table.tsx#L514)).
- Janela de páginas: ≤5 páginas mostra todas; caso contrário usa reticências
  (`...`) nas duas pontas conforme a página atual
  ([`Table.tsx:75-108`](../src/app/components/ui/Table.tsx#L75-L108)) — mesmo
  algoritmo documentado em `02-design-system.md`.

### 2.9 Número + palavra — `ui/QuantityLabel.tsx`

```tsx
<QuantityLabel value={n} singular="habilidade" plural="habilidades" />
```
Renderiza `<span class="font-semibold text-gray-900">{n}</span>` +
`<span class="font-normal text-gray-500">{singular|plural}</span>`, sem
tamanho de fonte próprio (herda do container) —
[`QuantityLabel.tsx:12-19`](../src/app/components/ui/QuantityLabel.tsx#L12-L19).
Plural quando `value !== 1`.

---

## 3. Exceções documentadas — lista consolidada

| Tela/componente | Do que diverge | Motivo (fonte) |
|---|---|---|
| **Perfis** (`ContentArea.tsx`) | Toolbar manual (não usa `ListingPage`); indicador de sincronização RM é um ponto colorido (`Circle w-2 h-2`, `fill-green-500`/`fill-red-500`) ao lado do nome, não uma badge — [`ContentArea.tsx:355-373`](../src/app/components/ContentArea.tsx#L355-L373) | `ListingPage` não tem slot pra 2+ filtros além de busca+status; o indicador é metadado de sincronização (`atualizacaoDisponivel`), não o Status Ativo/Desativado do registro |
| **Habilidades** (`ContentArea.tsx`) | Toolbar manual; `stickyFirstColumn` ligado direto no `Table` (sem `ListingPage`) | Mesmo motivo de filtros (3 chips); colunas Tipo/Status/Níveis esmagavam em 1280–1440px ([`ContentArea.tsx:1305-1311`](../src/app/components/ContentArea.tsx#L1305-L1311)) |
| **Níveis de Habilidades** (`NiveisProficiencia.tsx`) | Tabela hand-built (não usa `ui/Table.tsx`); coluna Descrição não tem `line-clamp`/Tooltip | Tela de consulta pura, 5 linhas fixas de conteúdo do sistema (não texto digitado por usuário) — [`NiveisProficiencia.tsx:55-60`](../src/app/components/NiveisProficiencia.tsx#L55-L60) |
| **Matriz de Habilidades** (`JornadaDetalhePage.tsx` + `MatrizCell.tsx`) | Tabela hand-built própria; menu de contexto por cargo/habilidade é `<div>` posicionado com estado local, não `DropdownMenu`/`InlineAction` do `Table.tsx`; cabeçalho de cargo trunca em 1 linha (`truncate`+Tooltip) em vez de quebrar | Estrutura de matriz com número variável de colunas dinâmicas, coluna fixa `w-[220px]`, incompatível com a anatomia de `ui/Table.tsx` |
| **CompetenciaDetalhePage.tsx / ParticipanteResultadoPage.tsx / MinhaCarreiraPage.tsx** | Filtro de status em pills (segmented control), não `ChipFiltro`; tabela de `CompetenciaDetalhePage` sem `width` nas colunas (`table-layout: auto`) | Telas de detalhe, não listagens principais — migração para chip (2026-09-16) foi só nas 5 listagens principais |
| **Dashboard** (`DashboardPage.tsx`) | 4 tabelas hand-built: `thead` sem `bg-gray-50` (fundo branco); padding `pb-3`(head)/`py-3.5`(corpo) + `pr-*` por coluna, sem `px-*` nas duas pontas e sem bump `md:` | Tabelas embutidas direto no card do Dashboard, sem a anatomia de container/borda de `ui/Table.tsx` — já documentado em `02-design-system.md` (cor) e atualizado nesta sessão anterior (padding) |
| **Dashboard — Cobertura** | `getBarColor`/`getCoberturaTextColor` usam azul/brand com limiares 70/50, não o verde/amarelo/vermelho 80/50 geral | Decisão de produto documentada, paleta propositalmente diferente para o contexto do Dashboard (`04-regras-negocio.md`) |

---

## 4. Regras de texto e dado que afetam a exibição no frontend

Extraído de `04-regras-negocio.md` e `06-integridade-de-dados.md` (regras já
vigentes no projeto), com verificação pontual no código onde marcado.

- **Placeholder de célula vazia**: hífen simples `-`, nunca travessão `—`
  (`02-design-system.md` > Truncamento). Verificado em uso real:
  [`NiveisProficiencia.tsx:58,74`](../src/app/components/NiveisProficiencia.tsx#L58).
  A única exceção encontrada (`ChipFiltro.tsx:76`) foi corrigida em
  2026-09-17 — ver seção 2.6.
- **Datas**: sempre texto livre pt-BR vindo de `mockData.ts` (ex.: `'15 de
  janeiro de 2026'`) ou formatado por função compartilhada — ver
  `formatData`/`formatPeriodo` em
  [`utils/avaliacoes.tsx:16-26`](../src/app/utils/avaliacoes.tsx#L16-L26)
  (`DD/MM/AAAA`, com `–` en-dash como separador de intervalo — caractere
  diferente do travessão `—` proibido, usado só aqui como range).
- **Status de avaliação** (5 estados: Rascunho/Pendente(Agendada)/Ativa/
  Encerrada/Expirada) e **status de participação** (4 estados: Não
  iniciada/Em andamento/Concluída/Expirada) têm fonte única de cor —
  `getStatusAvaliacaoBadgeClass`/`getStatusParticipanteBadgeClass` em
  [`utils/avaliacoes.tsx:108-124`](../src/app/utils/avaliacoes.tsx#L108-L124).
  Nunca decidir a cor inline numa tela nova.
- **Cobertura de habilidades**: `cobertura = habilidades onde nivelAtual >=
  nivelEsperado`; ≥80% verde, 50–79% amarelo, <50% vermelho — exceto
  Dashboard (ver seção 3).
- **Matriz — distinção "não configurado" vs "não exigido"**: célula
  `null`/`undefined` = RH ainda não definiu; célula `'not_required'` =
  decisão explícita do RH. Nunca tratar como o mesmo estado.
  Verificado em [`MatrizCell.tsx:48-52`](../src/app/components/carreiras/MatrizCell.tsx#L48-L52).

  > **Resolvido em 2026-09-17:** `04-regras-negocio.md` (seção "Matriz de
  > habilidades > Conteúdo da célula preenchida") pedia `Critério:
  > text-xs text-gray-500 line-clamp-3`, mas o código real da célula
  > preenchida (`MatrizCell.tsx:111-114`) sempre usou `<p className="text-xs
  > text-gray-500 leading-snug">` — sem corte nenhum. Decisão da Alice: manter
  > o comportamento real (sem `line-clamp`) e corrigir a regra escrita para
  > bater com o código, em vez de truncar o texto. `04-regras-negocio.md` já
  > reflete isso — não há mais divergência entre a regra e `MatrizCell.tsx`.

- **Campos armazenados vs calculados**: por princípio (`06-integridade-de-
  dados.md`), contagens exibidas devem ser calculadas de `mockData.ts` no
  momento da renderização, não lidas de um campo fixo. Único par de exceções
  aprovadas: `cargo.habilidadesConfiguradas`/`totalHabilidades` (mantidos
  sincronizados por `atualizarHabilidadesCargo`) e `jornada.quantidadeCargos`
  (armazenado, mas **nunca lido diretamente** para exibição — sempre
  recalculado via `.filter().length`). Confirmado em código que
  `Nivel.emUso` (usado por `QuantityLabel` em `NiveisProficiencia.tsx`) seed
  em `mockData.ts` (`emUso: 45` etc.) é **sobrescrito** e recalculado de
  verdade em [`ContentArea.tsx:196-202`](../src/app/components/ContentArea.tsx#L196-L202)
  a partir das habilidades reais — não é uma nova exceção, o campo do mock é
  só valor de fallback nunca usado na tela.

---

## 5. Pontos de possível divergência com o frontend do dev

Documento de referência do dev: `docs/documento-dev.txt` (instruções
propostas para um `CLAUDE.md` do protótipo — ver aviso na seção 0).

### 5a) Largura da sidebar: 224px/64px (dev) vs código real

**Alegação do dev** (`documento-dev.txt`, seção 2.3, linha 111 e seção 9,
linha 258, atribuída a "Alice"): sidebar expandida = **224px** (`w-56`),
rail recolhido = **64px** (`w-16`).

**Valor real no código**: `w-64` = **256px** expandida, `w-20` = **80px**
recolhida — [`Sidebar.tsx:114`](../src/app/components/Sidebar.tsx#L114):
```tsx
${isCollapsed ? 'w-20' : 'w-64'}
```
**Diferença**: 32px a mais na expandida (256 vs 224), 16px a mais na
recolhida (80 vs 64) — em ambos os casos o dev subestimou o valor real.

### 5b) "Densidade adaptativa" (dev) vs solução real já implementada

**Proposta do dev** (`documento-dev.txt`, seção 2, linhas 52-122): CSS
custom properties (`--row-h`, `--thead-h`, `--card-pad` etc.) com um novo
breakpoint Tailwind `wide` em 1440px (`@theme { --breakpoint-wide: 90rem }`),
trocando padding/altura/tipografia de card, toolbar, linha de tabela e
título de página conforme a largura — "compacta abaixo de 1440px, original
acima".

**Solução real do protótipo para o mesmo problema** (espaço apertado em
notebook 1280–1366px), em duas partes:

1. **Sidebar recolhe via JS, não a UI encolhe via CSS** — `Layout.tsx:63-109`
   (ver seção 1.2): abaixo de 1440px a sidebar cai para 80px automaticamente,
   liberando ~176px de largura de conteúdo. Card, toolbar, tabela, tipografia
   — nada disso muda de tamanho; o que muda é o espaço disponível.
2. **Tabelas largas rolam, não encolhem** — `stickyFirstColumn` +
   `min-w-[1280px]` (`Table.tsx:44-53,225-236`, ver seção 2.7), já em
   produção em Habilidades e Avaliações. A tipografia de tabela, por sinal,
   já foi deliberadamente **fixada** (sem bump `md:`) em 2026-09-15
   (`02-design-system.md` > "Tipografia de tabela — decisão 2026-09-15"),
   substituindo uma variante anterior que tinha tamanhos diferentes por
   breakpoint — o sistema já andou na direção **oposta** à do "row-h"/
   "thead-h" adaptativos propostos pelo dev.

**São duas abordagens incompatíveis para o mesmo problema, não coisas que
coexistem**: a solução real resolve o aperto de espaço deslocando/reduzindo
o *shell* (sidebar) e permitindo rolagem horizontal na tabela; a proposta do
dev resolve reduzindo o *conteúdo* (fonte, padding, altura de linha) da
tabela e dos cards. Adotar a proposta do dev exigiria desfazer a decisão de
2026-09-15 (tipografia de tabela fixa) e duplicar, com um mecanismo
diferente (CSS tokens + breakpoint `wide`), o que `Layout.tsx` já resolve
com JS no breakpoint 1440px.

### 5c) Outras propostas do dev que conflitam com decisões já tomadas no protótipo

| # | Proposta do dev (`documento-dev.txt`) | Estado real no protótipo | Evidência do protótipo |
|---|---|---|---|
| 1 | T2 (linha 181): cabeçalho de coluna em **sentence case** | Cabeçalho é **sempre `uppercase`** (`uppercase tracking-wider`) | `Table.tsx:254` |
| 2 | Seção 2.5 (linha 137): cabeçalho de coluna com **`whitespace-nowrap`** | Cabeçalho **nunca** usa `whitespace-nowrap`/`truncate` — quebra em 2 linhas de propósito | `Table.tsx:254`; decisão explícita "Cabeçalho nunca trunca — 2026-09-16" em `02-design-system.md` |
| 3 | Seção 2.5 (linha 137): cabeçalho `text-xs font-medium` | Cabeçalho real é `text-[10px] font-semibold` | `Table.tsx:254` |
| 4 | Seção 2.5 (linha 138): célula `text-sm` | Célula real é `text-xs` fixo | `Table.tsx:288` |
| 5 | Seção 2.5 (linha 142): "Tabela de Avaliações: `minWidth` de **1000px**" | `min-w-[1280px]` real, ligado via `stickyFirstColumn` | `Table.tsx:236` |
| 6 | D1 (linha 33): `font-bold` é sempre **"Errado"** (exceção só de "número grande") | KPI/métrica usa `font-bold` diretamente — padrão real em 8 arquivos, ex. `DashboardPage.tsx`, `ColaboradorView.tsx` | grep `text-3xl font-bold` — 8 arquivos; `02-design-system.md`: "`font-bold` reservado apenas para valores numéricos em cards de métricas" |
| 7 | D2 (linha 34): `text-slate-*` é sempre **"Errado"** | `slate` é usado de propósito no padrão "Instrução de formulário" (banner slate) — em produção em 5 arquivos | grep `text-slate-500`/`bg-slate-100` — `ContentArea.tsx`, `MinhaCarreiraPage.tsx`, `HabilidadeFormDrawer.tsx`, `EditarAvaliacaoModal.tsx`, `DesignSystemPage.tsx` |
| 8 | D3 (linha 35): `rounded-xl` é sempre **"Errado"** | Exceção documentada e em uso real: card de identificação (`rounded-xl` + gradiente slate) | `ColaboradorView.tsx:90`, `MinhaCarreiraPage.tsx:601,737` — `02-design-system.md` > Cards > "Card de identificação: exceção" |
| 9 | Seção 2.2 (linha 104): H1 `text-xl font-semibold wide:text-2xl` | H1 é **sempre `text-2xl`**, fixo, em toda página confirmada (Dashboard, as 4 listagens, páginas de detalhe) | Ver seção 1.5 deste documento — nenhuma ocorrência de H1 com prefixo de breakpoint |
| 10 | Seção 2.2 (linha 105): subtítulo `hidden wide:block` | Subtítulo é **sempre visível**, nunca `hidden`, em toda ocorrência confirmada | Ver seção 1.5 |
| 11 | Seção 2.6 (linhas 147-148): "Cobertura por competência e Cobertura por gerência ficam um abaixo do outro" | Não são adjacentes: a ordem real é S1 Cobertura por competência → **S2 Ranking de GAPs** → S3 Média de habilidades por gerência (nome real da seção, não "Cobertura por gerência") → S4 → S5 | `DashboardPage.tsx:684,761,821,892,972`; ordem também documentada em `05-telas-admin.md` > Dashboard |
| 12 | Seção 2.6 (linha 151): "Barra de filtros: `px-4 py-2`, não `p-4`" | Filtro global do Dashboard usa `p-4` uniforme hoje | `DashboardPage.tsx:573` |
| 13 | Seção 2.4 (linha 128): toolbar com um único container `flex flex-col ... lg:flex-row lg:flex-wrap` | `ListingPage.tsx` usa **dois blocos separados** por `display` (`md:hidden` vertical + `hidden md:flex` horizontal), não um único container fluido | `ListingPage.tsx:95,139` |
| 14 | Seção 2.5 (linha 139-140): lista de níveis numa célula deveria virar contagem + tooltip | Comentário no próprio código confirma que Habilidades **ainda mostra a lista de nomes sem truncamento** hoje (motivo real de `stickyFirstColumn` ter sido ligado) | `ContentArea.tsx:1305-1311` |

**Observação geral sobre o documento do dev**: ele se descreve (linha 52,
seção 2) como "decisão de 09/2026, **já mergeada na aplicação**". Os 14
pontos acima mostram que isso não é verdade para o código atual do
protótipo — nenhum dos tokens `--row-h`/`--thead-h`/`--page-pad`, do
breakpoint `wide`, ou das regras D1/D2/D3/T2 conforme descritas no documento
existe hoje em `src/`. Vale confirmar com o dev se ele está descrevendo uma
implementação em outro repositório/branch, não o protótipo que a Alice usa
como fonte de verdade.

---

## 6. Perguntas abertas

**Resolvidas em 2026-09-17** (registradas aqui só para histórico — decisões
já aplicadas no código/documentação, ver seções citadas):
- ~~`04-regras-negocio.md` vs `MatrizCell.tsx`~~ — decisão da Alice: manter o
  comportamento real (sem `line-clamp`) e corrigir a regra escrita. Ver
  seção 4.
- ~~Quirk de offset de sidebar entre 768–1023px~~ — corrigido: offset de
  `<main>`/`<Header>` agora reage a partir de `md:`/768px. Ver seção 1.2.
- ~~`ChipFiltro.tsx:76` (travessão como fallback)~~ — trocado por hífen
  simples. Ver seção 2.6.
- ~~Variante B de subtítulo de página é a "oficial"?~~ — sim, decisão da
  Alice: `text-sm text-gray-500 mt-1` é o padrão oficial, documentação
  atualizada. Ver seção 1.5.

**Ainda em aberto:**

1. **`docs/documento-dev.txt` como fonte de verdade**: as datas/decisões da
   seção 9 desse arquivo (atribuídas a "Alice" e "Kleython") batem com
   decisões reais suas, ou o arquivo descreve um plano/protótipo paralelo
   que ainda não foi implementado no repositório atual? Isso muda
   completamente como o handoff deveria tratar a seção 5c — como "conflito a
   resolver" ou como "proposta nova a avaliar". Depende de uma conversa da
   Alice com quem escreveu o documento — não é algo que se resolve no
   código.
