# Handoff completo — Módulo de Carreiras

> Documento novo, escrito em **2026-08-28** por auditoria direta do código atual
> (sem apoio de resumo ou histórico de conversa). Cobre o módulo Carreiras por
> inteiro: as entidades Gerência e Carreira, a regra de "1 Carreira Ativa por
> Gerência", o drawer de criação/edição, o botão "Criar Jornada", o header de
> `JornadaDetalhePage`, o banner de origem no wizard de Avaliações e as
> pendências conhecidas. Siga exatamente o que está aqui, mesmo que pareça mais
> simples ou diferente do que seria natural construir do zero. Não invente
> comportamento, não simplifique regra, não reorganize estrutura.

Todo caminho de arquivo abaixo é relativo à raiz do repositório. Ver também
`docs/DATA_MODEL.md` (entidades Gerência e Carreira) e
`.claude/rules/05-telas-admin.md` (Criar/Editar Jornada, Matriz).

---

## a. Arquitetura e rotas

O módulo Carreiras **não** tem página própria — é uma rota (`/carreiras` →
`CarreirasPage.tsx`, casca fina) que delega para
`src/app/components/ContentArea.tsx` com `selectedItem === 'carreiras'`. Toda a
listagem, filtros, ações e o drawer de criação/edição de Carreira vivem dentro
de `ContentArea.tsx` (bloco `if (selectedItem === 'carreiras')`).

Telas relacionadas, fora de `ContentArea`:

| Rota | Arquivo | O que é |
|---|---|---|
| `/carreiras` | `ContentArea.tsx` | Listagem de Carreiras + drawer |
| `/carreiras/:carreiraId` | `src/app/pages/CarreiraDetalhePage.tsx` | Detalhe de uma Carreira: header + tabela de Jornadas |
| `/carreiras/:carreiraId/jornadas/criar` | `src/app/pages/CriarJornadaPage.tsx` | Criar jornada (scroll contínuo, não wizard) |
| `/carreiras/:carreiraId/jornadas/:jornadaId` | `src/app/pages/JornadaDetalhePage.tsx` | Matriz de habilidades + aba Colaboradores |
| `/carreiras/:carreiraId/jornadas/:jornadaId/editar` | `src/app/pages/EditarJornadaPage.tsx` | Editar jornada |

**Dado vivo:** tudo passa por `src/app/context/CarreirasContext.tsx`
(`useCarreiras()`), que carrega/persiste em `localStorage` (chaves
`carreiras_*`, `MOCK_DATA_VERSION` hoje `'2026-08-28-2'`). Nunca ler
`carreirasData`/`jornadasData`/`cargosData` de `mockData.ts` diretamente numa
tela — sempre via `useCarreiras()`. (Exceção: `gerenciasData` **é** lido direto
do mock — a Gerência não tem Context, é cadastro externo somente-leitura.)

---

## b. Modelo de dados

### Gerência (`interface Gerencia` — `src/data/schema.ts`)

Unidade organizacional vinda do RM (no sistema real, cadastro externo). É a
**fonte única do nome** exibido para a Carreira.

| Campo | Tipo | Observação |
|---|---|---|
| `id` | `string` (`g1`..`g22`) | — |
| `nome` | `string` | ex: "Tecnologia", "Financeiro" |

- **Sem status, sem ciclo de vida.** Uma Gerência sempre "existe". O que pode
  ser ativado/desativado é a Carreira daquela gerência, nunca a gerência.
- **22 registros** em `gerenciasData` (`mockData.ts`) — **lista canônica**.
  Ordem/nomes: `g1` Tecnologia, `g2` Produto, `g3` Infraestrutura,
  `g4` Financeiro, `g5` Desenvolvimento, `g6` Operações, `g7` Inovação,
  `g8` Engenharia, `g9` Segurança, `g10` Design, `g11` Dados,
  `g12` Recursos Humanos, `g13` Marketing, `g14` Vendas, `g15` Jurídico,
  `g16` Atendimento ao Cliente, `g17` Qualidade, `g18` Projetos,
  `g19` Logística, `g20` Suprimentos, `g21` Compliance, `g22` Comunicação.

### Carreira (`interface Carreira` — `src/data/schema.ts`)

Uma área profissional ampla, sempre correspondente a uma Gerência. Nível mais
alto da hierarquia de carreira.

| Campo | Tipo | Observação |
|---|---|---|
| `id` | `string` | novas via `generateId('carreira')` → `carreira-<n>` |
| `gerenciaId` | `string` (**FK real → `Gerencia.id`**) | a Carreira **não tem nome próprio** |
| `jornadas` | `number` | denormalizado — **nunca exibir/ordenar por este campo**; sempre `jornadasDoContexto.filter(j => j.carreiraId === c.id).length`. Novas Carreiras nascem com `jornadas: 0` por convenção |
| `status` | `'Ativa' | 'Desativada'` | — |

**Nome de exibição** — sempre, em toda tela:
```ts
gerenciasData.find(g => g.id === carreira.gerenciaId)?.nome ?? ''
```
Implementado em: `ContentArea` (`carreirasComNome`), `CarreiraDetalhePage`
(`carreiraNome`), `CriarJornadaPage`/`EditarJornadaPage` (`carreiraNome`),
`PerfilColaboradorPage` (`carreiraNome`), `getCarreiraEJornadaNomes`
(`utils/avaliacoes.tsx`, usada por `AvaliacaoDetalhePage` e
`FormularioAvaliacao`).

**Mock (`carreirasData`, 17 registros):** 17 gerências têm Carreira; **5 não
têm** — `g13` Marketing, `g14` Vendas, `g15` Jurídico, `g16` Atendimento ao
Cliente, `g17` Qualidade (criadas de propósito para testar o fluxo de Criar
Carreira do zero — ver Pendências). Duas Carreiras nascem `Desativada`
(`gerenciaId: 'g18'` Projetos e `gerenciaId: 'g19'` Logística), para exercitar
o caminho "aviso, não bloqueio".

### Regra de negócio central — 1 Carreira Ativa por Gerência

Uma Gerência pode ter **várias Carreiras ao longo do tempo** (histórico), mas
**no máximo 1 com status `Ativa` por vez**. Helpers no `CarreirasContext`:

```ts
getCarreirasDaGerencia(gerenciaId)      // todas (qualquer status)
getCarreiraAtivaDaGerencia(gerenciaId)  // a Ativa, se existir (undefined se não)
```

O drawer de criação usa os dois para decidir entre **bloqueio** e **aviso** —
ver seção **c**.

---

## c. Drawer "Nova / Editar Carreira" (`ContentArea.tsx`, via `FormDrawer`)

Aberto por "+ Criar carreira" (primária da toolbar) ou pela ação **Editar** da
linha. `title`: `selectedRow ? 'Editar Carreira' : 'Nova Carreira'`.
`submitLabel`: `selectedRow ? 'Salvar alterações' : 'Salvar'`.

`carreiraFormData` = `{ gerenciaId: string; status: 'Ativa' | 'Desativada' }`.

### Campo único — Gerência (`searchable-select`)

```ts
{
  name: 'gerenciaId',
  label: 'Gerência',
  type: 'searchable-select',
  placeholder: 'Selecione uma gerência',
  searchPlaceholder: 'Buscar gerência...',
  emptyMessage: 'Nenhuma gerência encontrada',
  required: true,
  disabled: !!selectedRow,                       // TRAVADO na edição
  error: carreiraAtivaDaGerenciaSelecionada ? 'Esta gerência já tem uma carreira ativa.' : undefined,
  options: gerenciasData.map(g => ({ value: g.id, label: g.nome })),   // todas as 22
  ...
}
```

- **Criação**: campo editável, `SearchableSelect` com busca (22 opções).
- **Edição**: campo **preenchido mas travado** (`disabled: true` → visual
  `bg-gray-50 opacity-50 cursor-not-allowed`). Trocar a Gerência de uma
  Carreira existente **não é possível** — só o fluxo de criação foi definido; o
  submit de edição só grava `status`
  (`atualizarCarreira(selectedRow.id, { status })`).
- Não há campo "Status" no formulário de criação — `status` nasce sempre
  `'Ativa'` (`handleOpenCreateDrawer` reseta `{ gerenciaId: '', status: 'Ativa' }`).
  O status só muda depois, pela ação toggle da linha (Ativar/Desativar).

### Bloqueio vs. aviso (copy literal)

Depois de escolher a Gerência (só no modo **criação** — `!selectedRow`):

| Situação | Detecção | Feedback | Cor / variante |
|---|---|---|---|
| Gerência **já tem Carreira `Ativa`** | `getCarreiraAtivaDaGerencia(id)` retorna algo | **Bloqueio.** Erro de campo abaixo do select: **"Esta gerência já tem uma carreira ativa."** Além disso, `criarCarreira()` aborta com `toast.error('Esta gerência já tem uma carreira ativa.')` (dupla proteção). O botão "Criar Jornada" some (ver **d**). | Erro de campo — `border-red-300 focus:ring-red-500` + `<p className="mt-1 text-sm text-red-600">` |
| Gerência **só tem Carreira(s) `Desativada`** | `!carreiraAtiva && getCarreirasDaGerencia(id).length > 0` | **Aviso, não bloqueia.** Renderizado **abaixo do campo** via `customContent`: **"Esta gerência já teve uma carreira anterior, que está desativada. Uma nova carreira será criada — os dados da carreira anterior permanecem preservados e não serão substituídos."** | Variante C / "Aviso de estado" (amarelo, **sem título**) — `bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2`, ícone `AlertTriangle w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5`, texto `text-sm text-yellow-800` |
| Gerência sem nenhuma Carreira | — | nenhum feedback | — |

### Outros elementos do drawer

- **`headerContent`** (aparece nos 2 modos, no topo) — card conceitual,
  **Variante B / slate**, título **"Como funciona"**, corpo: *"Cada carreira
  representa uma gerência real da empresa. Ao escolher a gerência, você define a
  trajetória profissional (as jornadas de carreira) para os colaboradores dessa
  área."*
- **`alertBanner`** ("Carreira vinculada", `variant: 'info'` / brand) — só na
  **edição**, quando a Carreira tem ≥ 1 jornada: *"Esta carreira está vinculada
  a N jornada(s). Alterações no nome serão refletidas automaticamente
  nessa(s) jornada(s)."*
- Regra de layout: o **estado da entidade em edição** vai pelo `alertBanner`
  (topo); o **resultado de uma ação no formulário** (aviso de gerência) vai por
  `customContent` (abaixo do campo). Nunca inverter.

---

## d. Botões do footer — "Criar Jornada" ao lado de "Salvar"

No **modo criação** e enquanto a Gerência selecionada **não** tem Carreira
Ativa, o footer do drawer tem **3 botões**, nesta ordem (esquerda → direita):

| Ordem | Botão | Estilo | Ação |
|---|---|---|---|
| 1 | **Cancelar** | `border border-gray-300 text-gray-700 hover:bg-gray-50` | fecha o drawer, reseta `carreiraFormData` |
| 2 | **Criar Jornada** | `secondaryAction` com `variant: 'secondary'` → **outline brand** (`border border-[var(--brand-600)] text-[var(--brand-600)] hover:bg-[var(--brand-50)]`) | `handleCriarCarreiraEJornada` |
| 3 | **Salvar** | submit padrão — como há `secondaryAction.variant === 'secondary'`, o submit vira o **preenchido/principal** (`bg-[var(--brand-600)] text-white hover:bg-[var(--brand-700)]`) | `handleCarreiraFormSubmit` |

> `FormDrawer` inverte o preenchimento: normalmente o submit é outline e o
> `secondaryAction` primary; com `variant: 'secondary'` no `secondaryAction`, o
> submit passa a ser o preenchido e a ação secundária o outline. É o caso aqui:
> **"Salvar" é o botão cheio, "Criar Jornada" o outline.**

**O que cada um faz** (ambos chamam `criarCarreira()` primeiro — cria a
Carreira via `adicionarCarreira`, insere no início do array, `toast.success('Carreira criada com sucesso!')`; retorna `null` e aborta se gerência vazia ou já com Carreira Ativa):

- **Salvar** (`handleCarreiraFormSubmit`): em edição → só `atualizarCarreira(id, { status })` + toast + fecha. Em criação → `criarCarreira()`, toast, fecha o drawer, **fica na listagem de Carreiras**.
- **Criar Jornada** (`handleCriarCarreiraEJornada`): `criarCarreira()`, toast, fecha o drawer e **navega direto** para `/carreiras/<novaCarreiraId>/jornadas/criar` (a rota já lê `:carreiraId`, sem state novo).

Na **edição**, e quando a gerência selecionada já tem Carreira Ativa,
`secondaryAction` é `undefined` → só Cancelar + Salvar.

---

## e. Listagem de Carreiras (`ContentArea.tsx`)

- Título: **"Carreiras"** + subtítulo *"Cada carreira agrupa jornadas de
  progressão de uma área funcional"*.
- Renderizada via `ListingPage`. `onRowClick` → `navigate('/carreiras/<id>')`
  (linha clicável — destino editável).
- **Colunas** (`carreirasColumns`): `Nome da Carreira` (45%, ordenável, nome
  resolvido via Gerência), `Jornadas` (25%, ordenável por contagem — mostra
  `"N jornada(s)"` ou `"Nenhuma jornada"`, sempre `jornadasDoContexto.filter`),
  `Status` (20%, ordenável, badge `Ativa` verde / `Desativada` vermelho).
- **Pills** (`statusFilterCarreiras`): Todas / **Ativas** (default) / Desativadas.
  Busca por `nome`. `useEffect` reseta página 1 ao mudar busca/filtro.
  Paginação 10/página.
- **Ações de linha** (`carreirasActions`, 2 → ícones soltos):
  1. **Editar** (`Edit w-4 h-4`) — abre o drawer com `carreiraFormData`
     preenchido (Gerência travada).
  2. **Ativar/Desativar** (`variant: 'toggle'`, `<ToggleSwitch>` inline) —
     `Ativa` → abre `ConfirmationModal` (`variant: 'warning'`, título
     **"Desativar Carreira"**, mensagem menciona nº de jornadas quando > 0);
     `Desativada` → reativa direto + `toast.success('Carreira "<nome>" reativada com sucesso!')`.
- Empty state: ícone `Briefcase w-8 h-8`; sem dados → *"Comece criando a
  primeira carreira para estruturar as jornadas da organização."*; com filtro
  sem resultado → *"Não encontramos carreiras que correspondam aos filtros
  selecionados. Tente ajustar os critérios de busca."*

---

## f. Header de `JornadaDetalhePage.tsx`

Header (`flex items-start justify-between mb-6`). Esquerda: `<h1>` com
`jornada.nome` + `jornada.tipo` (`text-sm text-gray-400`) + `StatusBadge` +
subtítulo *"Defina o nível esperado de cada habilidade por cargo."*.

Direita — `flex items-center gap-2`, nesta ordem. Os 3 primeiros são
**icon-buttons com contorno** (`p-1.5 md:p-2 bg-white border rounded-lg`), que
antes eram itens de um menu `MoreVertical`:

| Ordem | Botão | Ícone | Classe | Condição | Ação |
|---|---|---|---|---|---|
| 1 | Editar jornada | `Edit w-4 h-4` | `border-gray-300 text-gray-700 hover:bg-gray-50` | sempre | `navigate('/carreiras/<carreiraId>/jornadas/<jornadaId>/editar')` |
| 2 | Ativar / Desativar jornada | `Power w-4 h-4` | `border-gray-300 text-gray-700 hover:bg-gray-50` | sempre (`title` alterna) | `handleToggleStatus` (abre modal de confirmação) |
| 3 | Excluir jornada | `Trash2 w-4 h-4` | `border-red-300 text-red-600 hover:bg-red-50` | sempre | `handleExcluirJornada` (abre modal destrutivo) |
| 4 | **Criar avaliação** | `ClipboardCheck w-4 h-4` | **botão outline-brand** (`inline-flex items-center gap-2 px-4 py-2 border border-[var(--brand-600)] text-[var(--brand-600)] text-sm font-medium rounded-lg hover:bg-[var(--brand-50)] flex-shrink-0`) | sempre | `navigate('/avaliacoes/nova', { state: { jornadaPreSelecionada: jornadaId } })` |

> **Divergência vs. o pedido de handoff:** o pedido fala em "os 4 itens que
> saíram do menu MoreVertical". No código atual são **3** icon-buttons
> (Editar / Ativar-Desativar / Excluir) + o botão "Criar avaliação". Não há um
> 4º icon-button. O `MoreVertical` **ainda existe** em `JornadaDetalhePage`,
> mas nos menus **por cargo** e **por habilidade** dentro da tabela da Matriz —
> não no header.

O botão "Criar avaliação" carrega `jornadaId` via **state do React Router**
(`state: { jornadaPreSelecionada }`). `CriarAvaliacaoPage.tsx` lê
`(location.state as {...})?.jornadaPreSelecionada` e repassa como prop
`jornadaPreSelecionada` para `FormularioAvaliacao`.

---

## g. Banner de origem no wizard de Avaliações

Quando `FormularioAvaliacao` recebe `jornadaPreSelecionada` (modo criação
apenas), o form nasce com `caminho: 'jornada'`, `jornadaId` já setado, e o
filtro de carreira já resolvido pela `carreiraId` da jornada. Um `useEffect` de
mount roda `handleSelecionarJornada(jornadaPreSelecionada)` para popular
habilidades/participantes (o Select nunca dispara `onValueChange` quando o
valor já nasce setado).

**Banner** — na **Etapa Escopo** (seleção de caminho), logo **abaixo dos dois
radio-cards** ("Por Jornada" / "Por Público-alvo"), condicionado a
`jornadaPreSelecionada`:

```
Variante A / "Informativo contextual (brand)":
bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3
ícone: Info w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5
texto (p text-sm text-gray-700):
  "Esta avaliação está sendo criada a partir da jornada "<nome da jornada>". O
   caminho e a jornada já vêm pré-selecionados nas próximas etapas."
```

`<nome da jornada>` = `jornadaSelecionada?.nome`. O banner só aparece nesse
fluxo — criar avaliação pela rota normal (`/avaliacoes/nova` sem state) não o
mostra.

---

## h. Pendências conhecidas (auditadas no código atual — 2026-08-28)

1. **5 gerências sem Carreira** — `g13` Marketing, `g14` Vendas, `g15`
   Jurídico, `g16` Atendimento ao Cliente, `g17` Qualidade. **Intencional:**
   servem para testar o fluxo de "Criar Carreira do zero" (gerência limpa, sem
   histórico, sem aviso). Não criar Carreira para elas "para completar".
2. **3 lugares ainda derivam "gerência" de `colaboradoresData`, não da
   entidade `Gerencia`** — decisão consciente de escopo, **não** lacuna:
   - `DashboardPage.tsx:32` — `const GERENCIAS = Array.from(new Set(colaboradoresData.map(c => c.gerencia))).sort()` (filtro do Dashboard).
   - `Perfis.tsx:54` — `gerenciasUnicas` = `[...new Set(profilesData.map(p => p.gerencia))].sort()` (dropdown de filtro).
   - `FormularioAvaliacao.tsx:19` — `const GERENCIAS = Array.from(new Set(colaboradoresData.map(c => c.gerencia))).sort()`, passado para `SeletorGerenciaGranular` (público-alvo "Por Público-alvo").
   Motivo: esses três usam gerência como **rótulo de agrupamento de
   colaboradores** (12 valores reais em uso), não como entidade cadastrável. A
   entidade `Gerencia` (22, com `id`) só é necessária no cadastro de Carreira,
   onde o RH precisa poder escolher uma gerência que **ainda não tem
   colaborador nem carreira**. Unificar as duas noções (dar `gerenciaId` ao
   Colaborador) é trabalho de integração com o RM, adiado de propósito. Ver
   `docs/DATA_MODEL.md` > Colaborador > "Atenção".
3. **`Carreira.gerenciaId` não pode ser editado** — o campo Gerência é travado
   no modo edição do drawer. Trocar a gerência de uma Carreira existente é uma
   pergunta de produto em aberto; só o fluxo de criação foi definido.
4. **`Carreira.jornadas` (denormalizado)** — pode ficar defasado; toda leitura
   na interface **já** calcula via `jornadasDoContexto.filter`. Manter assim
   (regra `06-integridade-de-dados.md`).
5. **`Jornada.carreira` (denormalizado)** — gravado no submit de
   `CriarJornadaPage` a partir de `carreiraNome` (resolvido via Gerência). Se o
   nome da gerência mudar no RM, jornadas antigas ficam com o nome velho nesse
   campo até serem re-salvas. Telas devem resolver o nome via
   `carreiraId → gerenciaId → gerenciasData`, nunca ler `jornada.carreira`.
6. **Persistência é `localStorage`** (`CarreirasContext`). Bump de
   `MOCK_DATA_VERSION` descarta Carreiras/Jornadas criadas no navegador.
