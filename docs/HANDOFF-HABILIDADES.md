# Handoff completo — Módulo de Habilidades

> Documento novo, escrito em **2026-08-27** por auditoria direta do código atual (sem apoio de resumo ou histórico de conversa). Cobre o módulo Habilidades por inteiro: as 3 abas (Competências, Níveis de Habilidades, Habilidades), o drawer de criação/edição de habilidade, a tela de detalhe e a persistência. Siga exatamente o que está aqui, mesmo que pareça mais simples ou diferente do que seria natural construir do zero. Não invente comportamento, não simplifique regra, não reorganize estrutura.

Todo caminho de arquivo abaixo é relativo à raiz do repositório.

---

## a. Visão geral e arquitetura

O módulo Habilidades é **uma única rota** (`/habilidades` → `HabilidadesPage.tsx`, casca fina) que delega para `src/app/components/ContentArea.tsx` com `selectedItem === 'habilidades'`. Toda a UI das 3 abas vive dentro de `ContentArea.tsx` (função `renderTabContent()`), não em componentes/páginas separados.

Telas relacionadas fora de `ContentArea`:
- `src/app/pages/HabilidadeDetalhePage.tsx` — detalhe somente-leitura de uma habilidade (rota `/habilidades/:id`), acessada pelo ícone `Eye` da tabela.
- `src/app/pages/CompetenciaDetalhePage.tsx` — detalhe de uma competência (fora do escopo deste handoff; citado só para contexto).

### Abas (`tabs` em `ContentArea.tsx`)

Barra de tabs: `border-b border-gray-200 mb-6 md:mb-8 -mx-4 md:mx-0`, cada botão `pb-3 text-sm font-medium border-b-2`, ativo `border-[var(--brand-600)] text-[var(--brand-600)]`, inativo `border-transparent text-gray-600 hover:text-gray-900`. Auto-scroll horizontal para a tab ativa no mobile (`tabsContainerRef`).

| `id` | label | badge (contador) |
|---|---|---|
| `competencias` | **"Competências"** | `competencias.length` |
| `niveis` | **"Níveis de Habilidades"** | — (sem badge) |
| `habilidades-list` | **"Habilidades"** | `habilidadesData.length` (do Context) |

Badge: `inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 text-[10px] font-medium rounded-full`; ativo `bg-[var(--brand-100)] text-[var(--brand-700)]`, inativo `bg-gray-100 text-gray-600`.

Aba inicial: `(location.state as any)?.tab ?? 'competencias'` — abrir com `navigate('/habilidades', { state: { tab: 'habilidades-list' } })` cai direto na aba Habilidades (é o que o botão "voltar" de `HabilidadeDetalhePage` faz).

Título de página (acima das tabs): H1 **"Habilidades"** (`text-2xl font-semibold text-gray-900`) + subtítulo **"Gerencie competências, níveis e habilidades da organização"** (`text-sm text-gray-500 mt-1`).

---

## b. Modelo de dados

Fonte de tipos: `src/data/schema.ts`. Dado vivo: `HabilidadesContext` / `CompetenciasContext` (ver seção **g**). Níveis: array estático `niveisDefaultData` de `src/app/data/mockData.ts` (sem Context — são fixos).

### Competência (`interface Competencia`)

| Campo | Tipo | Fixo/editável |
|---|---|---|
| `id` | `string` (`comp{Date.now()}` para novas) | gerado |
| `nome` | `string` | editável |
| `descricao` | `string` | editável |
| `status` | `'Ativa' | 'Desativada'` | editável (via ação Ativar/Desativar) |

**Relações:** agrupa N Habilidades via `Habilidade.competenciaId`. A contagem de habilidades vinculadas **nunca** é campo armazenado — é sempre `habilidadesData.filter(h => h.competenciaId === c.id).length` (calculada em `competenciasComCount` no render).

### Habilidade (`interface Habilidade` — schema.ts e `HabilidadesContext.tsx`)

| Campo | Tipo | Fixo/editável |
|---|---|---|
| `id` | `string` (`String(Date.now())` para novas) | gerado |
| `nome` | `string` | editável |
| `descricao` | `string` | editável (pode ser vazio) |
| `competencia` | `string` | **denormalizado** de `Competencia.nome` — nunca é a fonte; gravado junto ao `competenciaId` no submit do drawer |
| `competenciaId` | `string` (FK → Competência) | editável (Select) |
| `tipo` | `'Técnica' | 'Comportamental'` | editável |
| `status` | `'Ativa' | 'Desativada'` (schema declara `StatusHabilidade = 'Ativa'`, mas o drawer e a ação de toggle gravam `'Desativada'` de fato) | editável |
| `niveis` | `Array<{ nivelId: string; criterio: string }>` | editável — subconjunto livre dos 5 níveis, cada um com um critério de texto próprio. Não precisa ser 5, não precisa ser contíguo. |

**Relações:** pertence a 1 Competência (`competenciaId`); referencia N Níveis (`niveis[].nivelId` → `Nivel.id`). Na Matriz de Habilidades por cargo, o nível esperado do cargo é escolhido **dentre os `niveis` já aplicáveis desta habilidade** — nunca um nível fora dessa lista.

### Nível (`interface Nivel`) — os 5 registros fixos

Fonte única: `niveisDefaultData` em `mockData.ts`. **Sem CRUD, sem ciclo de vida, sem status.** Escala única (as duas escalas antigas — Básico/Avançado e Iniciante/Aprendiz — foram consolidadas).

| `id` | `nome` | `peso` | `descricao` (orientadora, copy literal) |
|---|---|---|---|
| `'1'` | **Aprendiz** | 1 | "Primeiro contato com a habilidade. Realiza tarefas simples com supervisão constante enquanto constrói o conhecimento básico." |
| `'2'` | **Iniciante** | 2 | "Consegue executar tarefas básicas com apoio pontual. Já tem alguma familiaridade com a habilidade, mas ainda depende de orientação em situações novas." |
| `'5'` | **Intermediário** | 3 | "Executa tarefas com autonomia em situações conhecidas. Busca suporte em contextos mais complexos ou não familiares." |
| `'3'` | **Avançado** | 4 | "Atua com autonomia em situações complexas e começa a orientar outros profissionais." |
| `'4'` | **Especialista** | 5 | "Referência na área. Define padrões, resolve problemas críticos e forma outros profissionais." |

> **Divergência corrigida vs. `docs/DATA_MODEL.md`:** DATA_MODEL diz "ids `'1'`–`'5'`", o que sugere que id e peso andam juntos. **Não andam:** Intermediário é `id: '5'` / `peso: 3`; Avançado é `id: '3'` / `peso: 4`; Especialista é `id: '4'` / `peso: 5`. **Sempre comparar/ordenar níveis por `peso`, nunca por `id` nem por nome** (`getPesoFromNome`, `mockData.ts`, é a fonte para comparar por peso; `'nao_sei'` → 0).

| Campo | Significado |
|---|---|
| `id` | `string` — não sequencial (ver acima) |
| `nome` | `string` (texto livre no tipo; na prática, um dos 5 acima) |
| `descricao` | `string` — orientadora, aparece como "Referência do nível" no drawer e na tela de detalhe |
| `peso` | `1`–`5` |
| `emUso` | `number` — **valor bruto no mock é decorativo** (45/38/0/22/12). Toda exibição recalcula em runtime: `habilidadesData.filter(h => h.niveis.some(n => n.nivelId === nivel.id)).length` (`niveisComContagem` em `ContentArea.tsx`). Nunca ler o campo bruto. |

Cor por peso: `getCorFromPeso(peso)` (`mockData.ts`), hex fixo, texto sempre branco:
`1 → #60A5FA`, `2 → #2563EB`, `3 → #4338CA`, `4 → #5B21B6`, `5 → #581C87`.

---

## c. Aba "Competências"

Renderizada via `ListingPage` (`src/app/components/templates/ListingPage.tsx`).

### Colunas (`competenciasColumns`)

| # | key | label | width | Ordenável | Conteúdo |
|---|---|---|---|---|---|
| 1 | `nome` | "Nome" | 25% | Sim | texto |
| 2 | `descricao` | "Descrição" | 40% | Não | `p` com `text-sm text-gray-700 line-clamp-2 break-words` dentro de `Tooltip`/`TooltipTrigger asChild`/`TooltipContent` (texto completo). `"-"` (`text-sm text-gray-500`) se vazio |
| 3 | `habilidades` | "Habilidades Vinculadas" | 15% | Sim (por contagem) | `{N}` em `font-medium` + `"habilidade"`/`"habilidades"` (`text-gray-500`). Calculado, nunca armazenado |
| 4 | `status` | "Status" | 15% | Sim | badge `inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full`; `Ativa` → `bg-green-100 text-green-800`, senão `bg-red-100 text-red-700` |

Headers ordenáveis: `<button>` com `text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider` + ícone `ArrowUp`/`ArrowDown` `w-3 h-3` (seta fantasma `opacity-0 group-hover:opacity-40` quando não é a coluna ativa). Sort inicial `{ column: 'id', direction: 'desc' }` = ordem do array (novas competências entram no início). Ao criar/filtrar: `setCurrentPage(1)` e sort volta para `id`.

### Filtros / busca

- Pills (`statusFilter`): **Todas** (`todas`) / **Ativas** (`ativa`, default) / **Desativadas** (`desativada`).
- Busca (`buscaCompetencia`): por `nome` OU `descricao`, `includes` case-insensitive.
- `useEffect` reseta `currentPage` para 1 quando `buscaCompetencia` ou `statusFilterCompetencias` mudam.
- Paginação: 10 itens/página (`itemsPerPage`).

### Ações de linha (`competenciasActions`) — 2 ações → ícones soltos

1. **"Editar"** (ícone `Edit w-4 h-4`) — preenche `competenciaFormData` a partir da linha e abre `FormDrawer` (`isDrawerOpen`).
2. **Ativar/Desativar** (`variant: 'toggle'`, ícone é um `<ToggleSwitch>` renderizado inline) — label `row.status === 'Ativa' ? 'Desativar' : 'Ativar'`. Se `Ativa` → abre `ConfirmationModal` (`isModalOpen`). Se `Desativada` → reativa direto (`updateCompetencia(id, { status: 'Ativa' })`) + `toast.success('Competência "{nome}" reativada com sucesso!')`.

> Nota: Competências **mantêm** o toggle inline (`ToggleSwitch`) — só Habilidades migrou a ação de status para itens de menu (ver seção **f**).

### Drawer "Nova / Editar Competência" (`FormDrawer`, campos declarativos)

`title`: `selectedRow ? 'Editar Competência' : 'Nova Competência'`. `submitLabel`: `selectedRow ? 'Salvar alterações' : 'Salvar'`. Botão primário de criação: **"+ Criar competência"**.

Campos (`competenciasFormFields`):
| name | label | tipo | placeholder | obrigatório |
|---|---|---|---|---|
| `nome` | "Nome da Competência" | text | "Ex: Design de Produto" | sim |
| `descricao` | "Descrição" | textarea (`rows: 4`) | "Descreva brevemente esta competência..." | não |
| `status` | "Status" | select (`Ativa` / `Desativada`) | — | sim |

**Banner de alerta (`alertBanner`, `variant: 'info'`)** — só aparece na edição quando `selectedRow.habilidades > 0`:
- `title`: **"Competência vinculada"**
- `description`: `` `Esta competência está vinculada a ${N} ${N === 1 ? 'habilidade' : 'habilidades'}. Alterações no nome ou descrição serão refletidas automaticamente ${N === 1 ? 'nessa habilidade' : 'nessas habilidades'} e no mapa de habilidades.` ``

### Modal de confirmação (`ConfirmationModal`, `variant: 'warning'`)

- `title`: **"Desativar Competência"**
- `message`: `` `Ao desativar a competência "${nome}", ela não será mais exibida nas listas ativas, mas o histórico será mantido. Você poderá reativá-la posteriormente se necessário.` ``
- `confirmLabel`: **"Desativar"** · `cancelLabel`: **"Cancelar"**

### Empty state

`icon: <Layers className="w-8 h-8" />`, title **"Nenhuma competência cadastrada"**, description **"Comece criando a primeira competência para organizar as habilidades da sua organização."**

---

## d. Aba "Níveis de Habilidades" (`NiveisProficiencia.tsx`)

**Consulta pura.** Sem busca, filtros, criação, edição, ações de linha, paginação. Props: `{ niveisData: Nivel[] }` — recebe `niveisComContagem` (os 5 fixos com `emUso` recalculado).

### Banner informativo (Variante A / brand — copy literal)

```
bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3
ícone: Info w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5
texto (text-sm text-gray-700):
"Esta tabela é somente para consulta dos 5 níveis fixos do sistema. Critérios
 específicos de cada habilidade são definidos ao criar ou editar a habilidade."
```

### Tabela

Container `bg-white rounded-lg border border-gray-200 overflow-hidden`; `<table className="w-full">`; `thead` `bg-gray-50 border-b border-gray-200`; `tbody` `bg-white divide-y divide-gray-200`. **Ordem sempre fixa por `peso` ascendente** (`[...niveisData].sort((a, b) => a.peso - b.peso)`) — nenhuma coluna é clicável para ordenar.

| Coluna (`th`) | width | Conteúdo da célula |
|---|---|---|
| **"Nome do Nível"** | `w-64` | pill `inline-flex px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap`, `backgroundColor: getCorFromPeso(peso)`, `color: #FFFFFF` |
| **"Descrição"** | — | `span text-sm text-gray-700 block max-w-md` com o texto completo (sem truncamento — tabela tem 5 linhas fixas). `-` (`text-gray-400`) se vazio |
| **"Peso do nível"** | `w-36`, `whitespace-nowrap` | `span text-sm text-gray-700` com o número `{peso}` |
| **"Habilidades Vinculadas"** | `w-40 md:w-48`, `whitespace-nowrap` | `{emUso}` em `font-medium` + `"habilidade"`/`"habilidades"` (`text-gray-500`); `-` (`text-sm text-gray-400`) quando `emUso` é `0`/falsy |

> **Mudanças recentes (auditadas — arquivo tem alterações não commitadas):**
> 1. A coluna hoje chamada **"Peso do nível"** era **"Progressão"** (com `w-24`). Renomeada; conteúdo continua sendo o número do peso.
> 2. **Removida toda a ordenação clicável.** Antes as colunas "Nome do Nível" e "Progressão" eram `<button>` com `handleSort`/`sortConfig` (default `peso asc`). Agora os `th` são texto puro e a ordem é sempre `peso` ascendente, fixa. `useState`/`ArrowUp`/`ArrowDown` foram removidos do arquivo.
> 3. Cabeçalho de tabela segue o padrão `02-design-system.md` (`text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider`), agora sem o `<button>` interno.

---

## e. Aba "Habilidades" — tabela e toolbar

Renderizada com toolbar customizada + `<Table>` direto (não `ListingPage`), porque a toolbar tem 2 dropdowns/segmented controls além da busca.

### Toolbar

Desktop (`hidden md:flex items-center gap-3`), nesta ordem:
1. Campo de busca `w-80`, ícone `Search w-5 h-5 text-gray-400`, placeholder **"Buscar habilidade"** (`buscaHabilidade`). Filtra por `nome` OU `descricao`.
2. `Select` (Radix) **"Todas as competências"** (`filtroCompetencia`) — opção `todas` + uma por competência **Ativa** (`competencias.filter(c => c.status === 'Ativa')`).
3. Segmented control de **Tipo** (`filtroTipo`): **Todas** / **Técnica** / **Comportamental** (`bg-gray-100 rounded-lg p-1`, item ativo `bg-white text-gray-900 shadow-sm`).
4. Segmented control de **Status** (`filtroStatus`): **Todas** / **Ativas** (default) / **Desativadas**.
5. Espaçador `flex-1`, então botão primário **"+ Criar habilidade"** (`bg-[var(--brand-600)] text-white ... hover:bg-[var(--brand-700)]`).

Mobile (`flex flex-col gap-3 md:hidden`): busca full-width, dropdown de competência full-width, os dois segmented controls em scroll horizontal, e um **FAB** (`md:hidden fixed bottom-6 right-6 w-14 h-14 bg-[var(--brand-600)] rounded-lg`, ícone `Plus w-6 h-6`, `aria-label="Criar habilidade"`) no lugar do botão de criar.

`useEffect` reseta `currentPageHabilidades` para 1 quando qualquer um de `buscaHabilidade`/`filtroCompetencia`/`filtroTipo`/`filtroStatus` muda. Paginação: 10/página. Sort inicial `{ column: 'id', direction: 'desc' }` — nesse modo ordena por `Number(b.id) - Number(a.id)` (id é `String(Date.now())`, então "mais recente primeiro").

### Colunas (`habilidadesColumns`) — na ordem exata

| # | key | label | width | Ordenável | Conteúdo |
|---|---|---|---|---|---|
| 1 | `nome` | "Nome da Habilidade" | 16% | Sim | `span text-sm text-gray-900` |
| 2 | `descricao` | **"Descrição"** | 25% | Não | `p text-sm text-gray-700 line-clamp-2 break-words` dentro de `Tooltip` (texto completo no `TooltipContent`). **`-` (`text-gray-400 text-sm`) se vazio** — padronizado com Competências em 2026-08-27 (antes era `—`). Coluna nova — não existia em handoffs anteriores |
| 3 | `competencia` | "Competência" | 15% | Sim | texto (denormalizado) |
| 4 | `niveis` | "Níveis" | 22% | Não | nomes dos níveis vinculados, ordenados na ordem do array, `.join(', ')`; resolvidos via `niveisDefaultData`. `—` se nenhum |
| 5 | `tipo` | "Tipo" | 12% | Não | badge; `Técnica` → `bg-[var(--brand-100)] text-[var(--brand-800)]`, `Comportamental` → `bg-purple-100 text-purple-800` |
| 6 | `status` | "Status" | 10% | Sim | badge; `Ativa` → `bg-green-100 text-green-800`, senão `bg-red-100 text-red-700` |

Larguras somam 100%.

### Empty state

`icon: <Award className="w-8 h-8" />`.
- Sem nenhuma habilidade: title **"Nenhuma habilidade cadastrada"**, description **"Comece criando a primeira habilidade para estruturar o sistema de gestão de competências."**
- Com filtro sem resultado: title **"Nenhum resultado encontrado"**, description **"Não encontramos habilidades que correspondam aos filtros selecionados. Tente ajustar os critérios de busca."**

---

## f. Aba "Habilidades" — menu de ações e duplicação

### Menu de ações (`habilidadesActions`) — 5 entradas configuradas → menu de contexto

`habilidadesActions` tem **5 entradas** (`Visualizar`, `Editar`, `Duplicar`, `Desativar`, `Ativar`). Pela regra "Menu de ações" de `02-design-system.md` (`actions.length >= 4` → `MoreVertical` + `DropdownMenu`, decisão em `Table.tsx`), esta tabela usa **menu de contexto**, não ícones soltos. (Antes da chegada de Duplicar + o desmembramento do toggle, eram poucas ações com ícones soltos.)

| Ação | Ícone | Condição (`show`) | Efeito |
|---|---|---|---|
| Visualizar | `Eye w-4 h-4` | sempre | `navigate('/habilidades/{id}')` |
| Editar | `Edit w-4 h-4` | sempre | `setSelectedRow(row)` + `setIsDrawerOpen(true)` — abre `HabilidadeFormDrawer` (não há rota `/habilidades/:id/editar`) |
| Duplicar | `Copy w-4 h-4` | sempre | `handleDuplicarHabilidade` (ver abaixo) |
| **Desativar** | `Power w-4 h-4` | `show: row.status === 'Ativa'` · `variant: 'danger'` | abre `ConfirmationModal` (`isModalOpen`) |
| **Ativar** | `Power w-4 h-4` | `show: row.status !== 'Ativa'` · sem variant (neutro) | `updateHabilidade(id, { status: 'Ativa' })` + `toast.success('Habilidade "{nome}" reativada com sucesso!')` |

> **Confirmado por auditoria:** a ação de status **é dois itens mutuamente exclusivos** (`Desativar` e `Ativar`), cada um com seu próprio `show`, **não** um único item com `variant`/label condicional. Espelha a ação "Encerrar" de Avaliações: o item destrutivo (Desativar) só aparece quando faz sentido e é o único em vermelho; reativar é neutro. Isto substituiu o antigo `variant: 'toggle'` + `<ToggleSwitch>` inline que Habilidades usava (Competências ainda usa o toggle).

No `DropdownMenu` de `Table.tsx`: item destrutivo usa `variant={action.variant === 'danger' ? 'destructive' : 'default'}`; `DropdownMenuContent` tem `stopPropagation` (o menu é renderizado via Portal, mas o clique ainda propagaria para `onRowClick` — aqui a tabela de Habilidades não tem `onRowClick`, mas o padrão é mantido).

### Modal de confirmação — Desativar Habilidade (`ConfirmationModal`, `variant: 'warning'`)

- `title`: **"Desativar Habilidade"**
- `message`: `` `Ao desativar a habilidade "${nome}", ela não será mais exibida nas listas ativas, mas o histórico de avaliações será mantido. Você poderá reativá-la posteriormente se necessário.` ``
- `confirmLabel`: **"Desativar"** · `cancelLabel`: **"Cancelar"**
- `onConfirm` → `updateHabilidade(id, { status: 'Desativada' })` + `toast.success('Habilidade "{nome}" desativada com sucesso!')`

### Duplicar (`handleDuplicarHabilidade`)

1. **Nome da cópia** (`gerarNomeDuplicadoHabilidade`): sempre `` `${nomeOriginal} (${N})` ``, `N` começa em `2` e incrementa até não colidir com **nenhum nome existente**. A checagem é contra a **lista viva do Context** (`habilidadesData` de `useHabilidades()`), não contra um array estático — cópias feitas na mesma sessão também contam. Nunca tenta detectar/colapsar um sufixo `(N)` que o nome original já tivesse — sempre soma mais um.
2. **Copiado**: `nome` (com sufixo), `descricao`, `competencia`, `competenciaId`, `tipo`, e `niveis` (cada `{ nivelId, criterio }` **clonado** com `n => ({ ...n })`, nunca a mesma referência).
3. **Status da cópia**: sempre **`'Ativa'`** (igual à original nos dados atuais, mas fixado literalmente no código).
4. `const novoId = addHabilidade(dadosCopia)` → `toast.success('Habilidade duplicada: "{nome}"')`.
5. **Abre o drawer de edição automaticamente** já preenchido com os dados da cópia: `setSelectedRow({ id: novoId, ...dadosCopia })` + `setIsDrawerOpen(true)`. Como não há rota de edição, é `setSelectedRow` + `setIsDrawerOpen`, nunca `navigate` (mesmo espírito de "nunca fica só na listagem" de Avaliações, adaptado à ausência de rota).

---

## g. `HabilidadeFormDrawer.tsx` — criação/edição de Habilidade

Arquivo: `src/app/components/templates/HabilidadeFormDrawer.tsx`. Usado por `ContentArea.tsx` (aba Habilidades) e `HabilidadeDetalhePage.tsx`.

### Props

```ts
interface HabilidadeFormDrawerProps {
  isOpen: boolean;
  initialValues: HabilidadeFormValues | null;   // null = criação (form em branco); objeto = edição
  competenciasAtivas: { id: string; nome: string }[];   // competencias.filter(c => c.status === 'Ativa')
  niveis: NivelFixo[];                            // niveisDefaultData
  onSave: (values: HabilidadeFormValues) => void;
  onCancel: () => void;
}

interface HabilidadeFormValues {
  nome: string; descricao: string;
  competencia: string; competenciaId: string;
  tipo: 'Técnica' | 'Comportamental';
  status: 'Ativa' | 'Desativada';
  niveis: Array<{ nivelId: string; criterio: string }>;
}
interface NivelFixo { id: string; nome: string; peso: number; descricao?: string }
```

O drawer é montado sobre o `FormDrawer` genérico com `fields={[]}` e todo o conteúdo em `customContent` (o `FormDrawer` só provê a casca: header `title`, footer com Cancelar + submit).
- `title`: `isEdicao ? 'Editar Habilidade' : 'Nova Habilidade'`
- `submitLabel`: `isEdicao ? 'Salvar alterações' : 'Salvar'`

### Reset ao (re)abrir — `useEffect([isOpen, initialValues, niveis])`

Quando `isOpen` vira `true`: `setFormData(initialValues ?? HABILIDADE_FORM_VAZIO)` (form vazio = `tipo: 'Técnica'`, `status: 'Ativa'`, `niveis: []`), `setActiveTab('cadastro')`, `setErrors({})`, e abre no Accordion **o nível de menor peso entre os já selecionados** (`[...niveis].sort(peso).find(n => valoresIniciais.niveis.some(sel => sel.nivelId === n.id))`) — ou nenhum, se `niveis` está vazio. Sem esse reset, reabrir para criar logo após editar herdaria os valores antigos.

### Toggle de abas (full-width)

```
container: flex items-center bg-gray-100 rounded-lg p-1
cada botão: flex-1 px-3 py-2 text-sm font-normal rounded-md transition-all whitespace-nowrap
ativo:   bg-white text-gray-900 shadow-sm
inativo: text-gray-600 hover:text-gray-900
```

`flex-1` nos dois botões = **cada aba ocupa metade da largura** (full-width). Padrão do segmented control de Todas/Técnica/Comportamental, mas esticado.

| `Tab` (interno) | Label desktop | Label mobile (`md:hidden`) |
|---|---|---|
| `'cadastro'` | **"Cadastro"** | "Cadastro" |
| `'niveis'` | **"Níveis de Habilidades"** | "Níveis" |

> **Mudança recente (auditada):** a segunda aba era `'criterios'` com label **"Critérios"**. Renomeada para `'niveis'` / **"Níveis de Habilidades"** (mobile: "Níveis"). O toggle também passou a ser full-width (`flex-1`) — antes os botões eram do tamanho do texto.

### Aba "Cadastro"

`div className="space-y-4 md:space-y-5"`. Campos, nesta ordem (todos `label block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2`):

| Campo | Controle | Placeholder / opções | Obrigatório | Erro |
|---|---|---|---|---|
| **"Nome da Habilidade"** `*` | `input type="text"` | "Ex: React" | sim | `errors.nome` → borda `border-red-300 focus:ring-red-500` + `<p className="mt-1 text-sm text-red-600">` |
| **"Descrição"** | `textarea rows={3}` `resize-none` | "Descreva esta habilidade..." | não | — |
| **"Competência"** `*` | `Select` (Radix) | "Selecione..." + uma opção por `competenciasAtivas` | sim | `errors.competenciaId` → mesma borda vermelha + `<p>` |
| **"Tipo"** `*` | `Select` | `Técnica` / `Comportamental` | sim (default `Técnica`) | — |
| **"Status"** `*` | `Select` | `Ativa` / `Desativada` | sim (default `Ativa`) | — |

Ao escolher a competência, grava **os dois** campos: `competenciaId: value` e `competencia: comp?.nome ?? ''`.

Input base: `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent` + `border-gray-300` (ou vermelho em erro).

### Aba "Níveis de Habilidades"

`div className="space-y-6"`. Três blocos:

**1. Banner de orientação (Variante A / brand com título — copy literal)**
```
bg-slate-100 border border-slate-300 rounded-lg p-4 flex items-start gap-3
ícone: Info w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0
título (text-sm font-semibold text-slate-700): "Como preencher os níveis"
corpo (text-sm text-slate-700 mt-1):
  "Selecione quais níveis serão avaliados nesta habilidade e defina o
   critério esperado para cada um."
```

> Observação de auditoria: o banner usa a paleta **slate** (`bg-slate-100 / border-slate-300 / text-slate-500 / text-slate-700`), que em `02-design-system.md` corresponde à **Variante B — "Instrução de formulário"** (não à Variante A/brand). O texto do pedido de handoff descreve "Variante A/brand"; o código atual é slate. Documentado aqui como está no código.

**2. "Níveis Aplicáveis" `*`** — linha com o label (`text-sm font-medium text-gray-700`) e, à direita, contador `"{N} selecionado(s)"` (`text-xs text-gray-500`) quando `formData.niveis.length > 0`. Abaixo, os 5 níveis como **pills toggláveis** (`flex flex-wrap gap-2`), ordenados por peso:
```
cada pill: inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
selecionado:   border-transparent text-white  +  style={{ backgroundColor: getCorFromPeso(peso) }}
não selecionado: border-gray-300 text-gray-600 bg-white hover:border-gray-400
```
Clicar (`toggleNivel`): adiciona `{ nivelId, criterio: '' }` ou remove. Ao **adicionar** e nenhum item do Accordion estava aberto ainda, abre o de menor peso entre os selecionados. Ao **remover**, tira o item do `Set` de abertos junto (evita `AccordionItem` órfão).

**3. "Critérios"** (`label block text-sm font-medium text-gray-700`):
- Se `formData.niveis.length === 0`: painel vazio (`text-center py-8 bg-gray-50 rounded-lg border border-gray-200`, ícone `ListChecks w-8 h-8 text-gray-300`), texto **"Selecione ao menos um nível acima para definir os critérios aqui."**
- Senão: `<Accordion>` (`src/app/components/ui/Accordion.tsx`), um `AccordionItem` por nível selecionado, **ordenados por peso crescente**.

#### Comportamento do Accordion

- **Controlado** — `isOpen={niveisAbertos.has(nivel.id)}`, `onToggle={toggleNivelAberto}` (adiciona/remove do `Set<string> niveisAbertos`). **Múltiplos itens podem ficar abertos ao mesmo tempo** (é um `Set`, não um único id).
- **Aberto por padrão**: só o nível de **menor peso** entre os selecionados (definido no `useEffect` de reset e re-checado ao adicionar o primeiro nível).
- `AccordionItem` — trigger `p-4 hover:bg-gray-50`, chevron `ChevronDown w-5 h-5 text-gray-400` que gira `rotate-180` quando aberto; content aparece em `border-t border-gray-200 bg-gray-50`. Trigger é `div role="button" tabIndex={0}` (não `<button>`, para não aninhar botão dentro de botão) — Enter/Espaço também alternam.
- Trigger de cada item: pill do nível (`getCorFromPeso(peso)`, texto branco) + `"Nível {peso}"` (`text-xs text-gray-500`).
- Content de cada item (`p-4 space-y-2`): `textarea rows={3}` (`resize-none`, `text-gray-700 placeholder-gray-400`), placeholder **"O que se espera de um colaborador neste nível para esta habilidade?"**, ligado a `formData.niveis[i].criterio`. Abaixo, se `nivel.descricao`: `<p className="text-xs text-gray-400 leading-relaxed"><span className="font-medium">Referência do nível:</span> {descricao}</p>`.

### Validação e navegação automática entre abas (`handleSubmit`)

Validação **manual** (não `required` nativo — campos de aba inativa não estão montados no DOM):
1. `!formData.nome.trim()` → `errors.nome = 'Informe o nome da habilidade.'`
2. `!formData.competenciaId` → `errors.competenciaId = 'Selecione uma competência.'`
3. Se houver qualquer erro em (1)/(2): `setErrors(...)` + **`setActiveTab('cadastro')`** (leva o usuário à aba onde o erro está visível) + `return`.
4. Senão, se `formData.niveis.length === 0`: `toast.error('Selecione ao menos um nível aplicável para esta habilidade.')` + **`setActiveTab('niveis')`** + `return`.
5. Passou tudo: `setErrors({})` + `onSave(formData)`.

> **Mudança recente (auditada):** o passo (4) fazia `setActiveTab('cadastro')` — agora é `setActiveTab('niveis')`, coerente com a seleção de níveis ter migrado para a segunda aba.

### `onSave` (em `ContentArea.tsx`, `handleSaveHabilidade`)

Edição: `updateHabilidade(selectedRow.id, {...values})` + `toast.success('Habilidade atualizada com sucesso!')`. Criação: `addHabilidade({...values})` + `toast.success('Habilidade criada com sucesso!')` + reset do sort para `id`/`desc` e página 1. Fecha o drawer e limpa `selectedRow` nos dois casos.

---

## h. `HabilidadeDetalhePage.tsx` — detalhe somente-leitura

Rota `/habilidades/:id`, acessada pelo ícone `Eye`. Botão voltar: `ArrowLeft` + "Habilidades", `navigate('/habilidades', { state: { tab: 'habilidades-list' } })`.

- **Header** (`flex items-start justify-between`): H1 `text-2xl font-semibold text-gray-900` com o nome + `StatusBadge` (`label={habilidade.status}`, `Ativa` → `bg-green-100 text-green-800`, senão `bg-red-100 text-red-700`) + badge de tipo (`bg-[var(--brand-100)] text-[var(--brand-800)]` Técnica / `bg-purple-100 text-purple-800` Comportamental) + nome da competência (`text-sm text-gray-500`, via `getCompetenciaNome(competenciaId, competencias)`) — tudo na mesma linha. Descrição abaixo (`text-sm text-gray-600 mt-1`), só se preenchida.
- Botão **"Editar"** à direita (primário, ícone `Edit w-4 h-4`) → abre o `HabilidadeFormDrawer` (`initialValues` preenchido, `niveis={[...habilidade.niveis]}` clonado).
- **"Critérios por nível"** (`h2 text-base font-semibold text-gray-900`): níveis vinculados ordenados por `peso`, cada um em card `bg-white rounded-lg border border-gray-200 p-5 space-y-3` — pill do nível (`getCorFromPeso`) + `{peso}`; o `criterio` (`text-sm text-gray-700`) ou **"Nenhum critério definido para este nível"** (`text-sm text-gray-400`); e `Referência do nível: {nivel.descricao}` (`text-xs text-gray-400`). Se nenhum nível: `bg-gray-50 border border-dashed border-gray-200 rounded-lg p-8 text-center`, **"Nenhum nível vinculado a esta habilidade."**
- `onSave` do drawer aqui: `updateHabilidade(habilidade.id, {...})` + `toast.success('Habilidade atualizada com sucesso!')`.

---

## i. Padrão de tooltip / truncamento

As colunas "Descrição" (Competências e Habilidades) usam truncamento com tooltip do texto completo. **Componente único: `src/app/components/ui/tooltip.tsx`** (wrapper de `@radix-ui/react-tooltip` — `Tooltip` / `TooltipProvider` / `TooltipTrigger` / `TooltipContent`; conteúdo `bg-gray-900 text-white rounded-md px-3 py-1.5 text-xs max-w-56`, com `Arrow`, renderizado via `Portal`, `delayDuration={0}`).

Regra resumida (o padrão detalhado deveria estar em `02-design-system.md`; ver divergência abaixo):
- **Texto longo (descrição):** `p ... line-clamp-2 break-words` (2 linhas) dentro de `<TooltipTrigger asChild>`, texto completo no `<TooltipContent>`. `break-words` é obrigatório junto do `line-clamp` — sem ele, um token único muito longo estoura a largura fixa da coluna mesmo com `table-layout: fixed`.
- **Nome curto:** 1 linha + tooltip quando o nome puder passar da largura da coluna (mesmo componente).
- Nunca usar a "bolha" `HelpCircle`/`group` dentro de célula de tabela — o `overflow-hidden` do container da tabela corta o balão. Usar sempre `ui/tooltip.tsx` (Portal).

> **Histórico:** até 2026-08-27 essa regra existia só no código. Foi promovida para `02-design-system.md` > seção **"Truncamento de texto e tooltip"** — essa é agora a fonte de verdade canônica; este handoff só resume.

---

## j. Correção de bug documentada — banner "info" do `FormDrawer.tsx`

**Contexto (bug pré-existente, desde ~julho/2026):** o `alertBanner` com `variant: 'info'` do `FormDrawer.tsx` (compartilhado — aparece em "Editar Competência" quando a competência tem habilidades vinculadas, e em "Editar Carreira" quando a carreira tem jornadas vinculadas) tinha uma **mistura de cores inconsistente**: o container/ícone já eram brand (`bg-[var(--brand-50)]` / `border-[var(--brand-100)]` / ícone `text-[var(--brand-600)]`), mas o **texto** continuava azul genérico (`text-blue-900` no título, `text-blue-700` no corpo) — nunca alinhado quando o container virou brand.

**Estado atual (auditado — já corrigido no código):** para `variant: 'info'`, `FormDrawer.tsx` usa:
- container: `bg-[var(--brand-50)] border-[var(--brand-100)]`
- ícone `Info`: `text-[var(--brand-600)]`
- título (`h3 text-sm font-medium mb-1`): **`text-[var(--brand-700)]`**
- corpo (`p text-sm leading-relaxed`): **`text-gray-700`**

Consistente com a **Variante A — "Informativo contextual (brand)"** de `02-design-system.md`. **Isto é correção de um bug de cor pré-existente, não uma mudança de comportamento nova** — o banner aparece nas mesmas condições, com o mesmo texto; só a paleta do texto foi alinhada. (As demais variantes — `warning` amarelo, `success` verde — não foram tocadas.)

---

## k. Persistência (localStorage)

Dois Contexts, mesmo padrão de `AvaliacoesContext` (inicializa de `mockData.ts`, persiste no `localStorage`, versiona para invalidar dados antigos). **Níveis não têm Context** — são o array estático `niveisDefaultData`.

| Context | Arquivo | `STORAGE_KEY` | `VERSION_KEY` | `MOCK_DATA_VERSION` (hoje) | Fonte inicial |
|---|---|---|---|---|---|
| `HabilidadesContext` | `src/app/context/HabilidadesContext.tsx` | `habilidades_habilidades` | `habilidades_habilidades_mock_version` | `'2026-08-26-1'` | `habilidadesData` |
| `CompetenciasContext` | `src/app/context/CompetenciasContext.tsx` | `habilidades_competencias` | `habilidades_competencias_mock_version` | `'2026-08-26-1'` | `competenciasData` |

- `loadFromStorage()`: se `localStorage[VERSION_KEY] !== MOCK_DATA_VERSION` → `removeItem(STORAGE_KEY)`, grava a versão nova, retorna o array do mock. Senão, tenta `JSON.parse(localStorage[STORAGE_KEY])`; qualquer erro cai no mock. **Sempre que `mockData.ts` mudar estruturalmente `habilidadesData`/`competenciasData`, incremente a versão.**
- `useEffect([habilidades])` / `useEffect([competencias])`: grava `JSON.stringify` no `STORAGE_KEY` a cada mudança.
- `addHabilidade(data)`: `id = String(Date.now())`, insere **no fim** do array, retorna o id.
- `addCompetencia(data)`: `id = 'comp' + Date.now()`, insere **no início** do array, retorna o id.
- `updateHabilidade(id, patch)` / `updateCompetencia(id, patch)`: merge raso por id.
- Hooks: `useHabilidades()` / `useCompetencias()` — lançam erro se usados fora do Provider.
- Sem sincronização entre abas/dispositivos; sem histórico de versões.

---

## l. Pendências conhecidas (auditadas no código atual — 2026-08-27)

1. **Dashboard não reflete Competência nem Habilidade criada em runtime.** `DashboardPage.tsx` importa `habilidadesData` e `competenciasData` **estáticos de `mockData.ts`** (`HAB_TO_COMP_ID`, `COMP_ID_TO_NOME`, `habilidadesData.length` no card de métrica), **não** os Contexts. Uma habilidade/competência criada pela tela de Habilidades existe no `localStorage`/Context e aparece nas listagens e na Matriz, mas o Dashboard continua contando só o mock original. Decisão consciente até haver backend — não "corrigir" trocando por Context sem alinhar o resto do Dashboard.
2. **`Nivel.emUso` é decorativo.** O valor gravado em `niveisDefaultData` (45/38/0/22/12) está fora da realidade. Toda exibição recalcula em runtime (`niveisComContagem`). Nunca ler o campo bruto; ao migrar para backend, ou o servidor calcula, ou o front continua derivando de `habilidades`.
3. **Níveis são um array estático, sem CRUD.** A aba "Níveis de Habilidades" é consulta pura. Não há criação/edição/desativação de nível pela UI. O `schema.ts` deixa `Nivel.nome` como texto livre "porque o RH poderia criar nomes arbitrários", mas **não existe tela para isso hoje** — são sempre os 5 fixos.
4. **`id` de Nível ≠ `peso`.** Ver seção **b**. Qualquer código que assuma `id === String(peso)` está errado para Intermediário/Avançado/Especialista. Comparar sempre por `peso`.
5. **`Habilidade.status` no schema.** `schema.ts` declara `StatusHabilidade = 'Ativa'` (só um valor), mas o drawer e a ação de toggle gravam `'Desativada'` de fato, e as telas tratam os dois. Ao formalizar o tipo no backend, incluir `'Desativada'`. `HabilidadesContext.tsx` já tipa `status: 'Ativa' | 'Desativada'` localmente.
6. **`Habilidade.competencia` (denormalizado) pode ficar defasado.** É gravado no submit do drawer a partir do `competenciaId` escolhido. Se o nome da competência for editado depois, as habilidades já existentes continuam com o nome antigo em `habilidade.competencia` até serem re-salvas. Telas de exibição devem resolver o nome via `competenciaId` + Context (`getCompetenciaNome`), não ler `habilidade.competencia`. O banner "Competência vinculada" promete propagação automática — isso vale para telas que resolvem por id, não para o campo denormalizado.
7. ~~Tooltip/truncamento não está em `02-design-system.md`.~~ **Resolvido em 2026-08-27** — promovido para `02-design-system.md` > "Truncamento de texto e tooltip". Ver seção **i**.
8. **Persistência é `localStorage`.** Ver seção **k**. Bump de versão descarta o que o usuário criou no navegador.
9. **Contadores de "Habilidades Vinculadas" (Competências) e "Habilidades Vinculadas" (Níveis) são sempre calculados** — nunca campos armazenados. Manter assim (regra `06-integridade-de-dados.md`).

---

## m. Regra permanente de texto

**Nunca usar travessão (—) em texto de interface.** Usar vírgula, ponto, ou reformular. Placeholder de célula vazia é **sempre `-` (hífen simples)** em todas as tabelas do sistema — a padronização de 2026-08-27 eliminou todos os `—` que ainda existiam como placeholder (Habilidades: Descrição e Níveis; `NiveisProficiencia`; `MinhasAvaliacoes` histórico; `MatrizProgressao`; `CompetenciaDetalhePage`; `CarreiraDetalhePage`; `DashboardPage`; `ParticipanteResultadoPage`; `JornadaDetalhePage`; `getProximaAvaliacaoInfo`).
