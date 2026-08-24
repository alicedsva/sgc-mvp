# Handoff — Listagem de Avaliações (Admin)

> Documento novo (2026-08-24), sugestão do dev na rodada 2 de perguntas sobre o Cadastro de Avaliação (item 4 daquela rodada: "listagem sem handoff próprio"). Escrito lendo diretamente `src/app/components/ContentArea.tsx` (bloco `selectedItem === 'avaliacoes'`) e `src/app/components/ui/Table.tsx`. Este documento cobre só a **listagem** (tabela + filtros + ações da linha) — o wizard de criação/edição é `docs/HANDOFF-CADASTRO-AVALIACOES.md`.

---

## a. Visão geral

A listagem de Avaliações é uma tela padrão de `ListingPage`/`Table.tsx` (mesmo template usado por Competências, Habilidades, Carreiras, Perfis), renderizada dentro de `ContentArea.tsx` quando `selectedItem === 'avaliacoes'`. Dados vêm de `avaliacoesData` (`AvaliacoesContext`, nunca um array local).

Toolbar: busca por nome/tipo (`buscaAvaliacao`), filtro de status (pills/dropdown conforme `ListingPage`), botão primário "+ Criar avaliação" (navega para `/avaliacoes/nova`).

---

## b. Colunas da tabela, na ordem exata

`avaliacoesColumns` (`ContentArea.tsx:1752-1932`):

| # | key | Label | width | O que mostra |
|---|---|---|---|---|
| 1 | `nome` | Nome da Avaliação | 17% | Nome, ordenável (`ArrowUp`/`ArrowDown` no header). |
| 2 | `descricao` | Descrição | 20% | Texto com `line-clamp-2 break-words`; tooltip via atributo `title` **nativo** do HTML (não a bolha `HelpCircle` usada em outras telas — ver nota abaixo); `"-"` (hífen simples) quando a avaliação não tem descrição. |
| 3 | `origem` | Origem | 9% | `"Jornada de Carreira"` se `origemJornadaId` estiver definido, senão `"Público-alvo"`. Não ordenável. |
| 4 | `periodo` (sort continua por essa key) | Início | 8% | `periodoInicio` formatado (`formatData`), ordenável; `"-"` quando ainda não definido (Rascunho ainda não tem essa data). |
| 5 | `termino` | Término | 8% | `periodoFim` formatado; `"-"` quando não definido. Não ordenável. |
| 6 | `prazo` | Prazo | 7% | `"{N} dia(s)"` a partir de `prazoDias`; `"-"` quando não definido. Não ordenável. |
| 7 | `participantes` | Participantes | 12% | Ver seção c abaixo. Não ordenável. |
| 8 | `status` | Status | 9% | Badge do status **calculado** (`calcularStatusEfetivo`), ordenável — mas o sort compara o campo bruto `status`, não o calculado (ver nota). |
| — | (sem key própria) | Ações | `w-20 md:w-24` (fixo, definido no próprio `Table.tsx`, não em `avaliacoesColumns`) | Menu de ações — ver seção e. |

**Nota — tooltip da Descrição:** o padrão de bolha (`group`/`HelpCircle`, `position: absolute`) usado em `CriarJornadaPage.tsx`/`EditarJornadaPage.tsx`/`DesignSystemPage.tsx` foi **deliberadamente evitado** aqui: essa bolha ficaria cortada pelo `overflow-hidden` do container do `ListingPage` e pelo `overflow-x-auto` do próprio `Table.tsx`, em linhas perto da borda da tabela. `title` nativo nunca é cortado por overflow de ancestral — é o mesmo mecanismo já usado nesta mesma tabela para o `title={label}` dos ícones de ação em `Table.tsx`.

**Nota — "-" nunca travessão nem "Não definido":** as três colunas Início/Término/Prazo mostram sempre hífen simples (`-`) quando o campo não está definido — nunca travessão/en dash, nunca o texto por extenso "Não definido" que existia numa versão anterior. Ver também `docs/HANDOFF-CADASTRO-AVALIACOES.md` seção "j. Regra de texto".

**Nota — sort de Status:** o clique no header de Status ordena pelo campo bruto `item.status` (string: `'Rascunho'`/`'Ativa'`/`'Encerrada'`), não pelo status calculado que a própria coluna exibe (`calcularStatusEfetivo`) — uma avaliação `'Ativa'` bruta mas com `calcularStatusEfetivo` retornando `'Pendente'` (agendada, ainda não chegou a data de início) ordena junto com as `'Ativa'` de verdade, não junto com as agendadas. Isso é o comportamento atual do código, não necessariamente a intenção final — reportar se for relevante para a reimplementação.

---

## c. Coluna Participantes — detalhe

`ContentArea.tsx:1876-1898`. Se `row.status === 'Rascunho'`, mostra só `"-"` (rascunho nunca tem participantes contabilizáveis ainda, mesmo que `participantes` já tenha itens pré-carregados de alguma duplicação — ver seção f). Senão:
- `"{concluídas}/{total}"` — `total = participantes.length`, `concluídas = participantes.filter(p => p.status === 'Concluída').length`.
- Barra de progresso abaixo do número: `bg-gray-200 rounded-full h-1.5`, preenchimento `bg-[var(--brand-600)] h-1.5 rounded-full`, largura = `{progresso}%` (`Math.round(concluidas/total*100)`, ou `0` se `total === 0`).

---

## d. `table-layout: fixed` — comportamento do `Table.tsx` (compartilhado, não exclusivo desta tabela)

`Table.tsx:81-98`. A tabela só recebe `table-fixed` quando **todas** as colunas do array `columns` passado têm `width` definido (`columns.every(column => !!column.width)`) — a tabela de Avaliações se qualifica hoje porque as 8 colunas de `avaliacoesColumns` têm `width` em porcentagem.

Por que é condicional (não sempre `table-fixed`, nem sempre `table-layout: auto`):
- Sem `table-fixed` (`table-layout: auto`, o padrão do HTML), um `width` em `%` é só um "palpite inicial" — o navegador ainda deixa uma célula com conteúdo grande (ex: uma Descrição longa) forçar a coluna a crescer além do previsto, o que gerava scroll horizontal para a tabela inteira mesmo que só uma coluna precisasse de mais espaço.
- Com `table-fixed`, o navegador decide a largura de cada coluna só pelas células do `thead` e **para de considerar o conteúdo** — uma coluna sem `width` nesse modo não "encolhe pro conteúdo" como no modo `auto`, ela soma no rateio igual entre as colunas sem `width`, o que deformaria qualquer tabela que não foi desenhada com todas as larguras pensadas de propósito.
- A regra `columns.every(...)` existe para que aplicar `table-fixed` numa tabela não mude silenciosamente o layout de nenhuma outra tabela do sistema que ainda não definiu `width` em toda coluna — cada tabela migra para `table-fixed` só quando alguém explicitamente dá `width` a todas as suas colunas.

Esse comportamento é de `Table.tsx` (usado por toda tabela do Admin) — não é uma regra especial só da tela de Avaliações; qualquer tabela nova que declare `width` em 100% das colunas ganha `table-fixed` automaticamente, sem precisar de nenhuma prop extra.

---

## e. Menu de ações — MoreVertical + DropdownMenu

### Quando isso passou a acontecer

Regra do design system (`.claude/rules/02-design-system.md` → Tabelas → "Menu de ações"): a partir de **4 ações configuradas** para a tabela (o array `actions` inteiro, incluindo ações condicionais — nunca a contagem de ações visíveis linha a linha), a coluna de Ações vira um menu de contexto (`MoreVertical` + `DropdownMenu`) em vez de ícones soltos. Abaixo de 4, continuam ícones soltos.

A tabela de Avaliações tem hoje **4 ações configuradas** em `avaliacoesActions` (`ContentArea.tsx:1990-2025`) — por isso já renderiza como menu, não como ícones soltos. Implementado de forma genérica em `Table.tsx:149,205` (`actions.length < 4` → ícones; `actions.length >= 4` → menu) — nenhum código específico desta tela decide isso, qualquer tabela do sistema que cresça para 4 ações ganha o menu automaticamente.

### Anatomia (`Table.tsx:205-251`)

- **Trigger:** mesmo botão de "ação em tabela (ícone)" do resto do sistema — `p-1.5 md:p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700`, ícone `MoreVertical w-4 h-4`.
- **Content:** `DropdownMenu` do Radix (`ui/dropdown-menu.tsx`), `align="end"` (abre alinhado à direita, sob a coluna Ações), com `onClick={e => e.stopPropagation()}` no `DropdownMenuContent` — necessário porque o menu é renderizado via Portal fora da `<tr>`, mas o clique ainda propaga para o `onRowClick` da linha pela árvore React (delegação de evento de Portal); sem isso, escolher qualquer ação também disparava navegação de linha (esta tabela não usa `onRowClick`, mas a proteção é do componente compartilhado, vale para qualquer tabela que use).
- **Item:** ícone (`w-4 h-4`) + label, `gap-2`, `text-sm`. Ação destrutiva (`variant: 'danger'` em `InlineAction` → `variant="destructive"` no `DropdownMenuItem`): `text-red-600` no ícone e no texto, `focus:bg-red-50` — mesmo tom já usado pelas ações destrutivas em ícones soltos, nunca uma cor nova.
- **Ordem:** mesma ordem em que as ações apareciam como ícones antes da migração para menu — ações antigas primeiro, novas no fim.

### As 4 ações de `avaliacoesActions`, em ordem, com condição de exibição

| # | Label | Ícone | Condição (`show`) | O que faz |
|---|---|---|---|---|
| 1 | Visualizar | `Eye` | Sempre | `navigate('/avaliacoes/{id}')` — abre o detalhe. |
| 2 | Editar | `Edit` | Sempre | Se `participantes.length === 0` (rascunho não materializado): `navigate('/avaliacoes/{id}/editar')` (wizard completo). Se já tem participantes (avaliação materializada): abre `EditarAvaliacaoModal` (drawer enxuto, só prorrogação de prazo). O destino muda por **dado real** (tem ou não participantes), não pelo `status` bruto. |
| 3 | Encerrar | `StopCircle` | Só `row.status === 'Ativa'` — some para Rascunho/Encerrada/Agendada | Abre `ConfirmationModal`; ao confirmar, `atualizarAvaliacao(id, { status: 'Encerrada' })`. Ação destrutiva (`variant: 'danger'`) — vermelho no menu. |
| 4 | Duplicar | `Copy` | Sempre disponível, sem condição | `handleDuplicarAvaliacao` — ver seção f abaixo. |

**Nunca mais de uma ação destrutiva vermelha por menu** (regra geral do design system) — hoje só "Encerrar" é destrutiva; "Duplicar" é neutra mesmo criando um registro novo, porque não é uma ação irreversível sobre a linha original.

---

## f. Ação Duplicar — lógica completa (`handleDuplicarAvaliacao`, `ContentArea.tsx:1963-1984`)

### Nome da cópia (`gerarNomeDuplicado`, `ContentArea.tsx:1941-1950`)

Sempre `"{nome original} ({N})"`, `N` começando em `2` e incrementando até não colidir com nenhum nome já existente em `avaliacoesData` — ex: se `"Avaliação X (2)"` já existir, a próxima duplicata de `"Avaliação X"` vira `"Avaliação X (3)"`. Compara contra o nome **literal** de cada avaliação; não tenta detectar/colapsar um sufixo `"(N)"` que o nome original já tivesse — duplicar uma cópia sempre soma mais um sufixo em cima do nome atual (nunca reescreve o nome-base para tentar "renumerar do zero").

### O que é copiado

- **Nome** — com o sufixo incremental acima, nunca o nome literal da origem.
- **Descrição** — cópia exata (`row.descricao`).
- **Habilidades** — cópia exata do array (`row.habilidades ? [...row.habilidades] : undefined`).
- **Caminho de origem** — `origemJornadaId` é copiado tal como está (se a origem era "Por Jornada", a cópia nasce vinculada à mesma jornada; se era "Por Público-alvo", `origemJornadaId` fica `undefined` na cópia também). `tipo` (sempre "Autoavaliação" no MVP) também é copiado.
- **`publicoLabel`** — só copiado se a origem for caminho Jornada (`row.origemJornadaId ? row.publicoLabel : ''`); no caminho Público-alvo, a cópia nasce com `publicoLabel: ''` porque não há participantes ainda (ver próximo item).

### O que **não** é copiado

- **Participantes** — a cópia sempre nasce com `participantes: []`, independentemente do caminho de origem. No caminho "Por Jornada", isso significa que a cópia referencia a mesma jornada mas não herda a lista de participantes daquele momento — quem edita a cópia depois vê os participantes **recalculados ao vivo** da jornada (mesmo princípio de `getColaboradoresPorJornada` usado no resto do sistema, documentado em `docs/HANDOFF-CADASTRO-AVALIACOES.md`). No caminho "Por Público-alvo", a cópia nasce sem nenhum colaborador/gerência selecionado — um público novo a escolher do zero na etapa Colaboradores.
- **`gerenciasComAutoInclusao`** — sempre `undefined` na cópia, mesmo que a origem tivesse gerências com auto-inclusão configuradas.
- **Datas de prazo** — `periodoInicio: ''`, `periodoFim: undefined`, `prazoDias: undefined`, `modoPrazo: 'indefinido'` — sempre, independente do que a avaliação original tinha configurado. Datas de uma avaliação antiga não fazem sentido temporal num rascunho novo; a cópia fica no mesmo estado "em branco" que uma avaliação nova criada do zero.
- **Status** — a cópia sempre nasce `status: 'Rascunho'`, mesmo duplicando uma avaliação `'Ativa'` ou `'Encerrada'`.

### Para onde redireciona depois

`adicionarAvaliacao(novaAvaliacao)` grava a cópia no Context, um toast de sucesso aparece (`Avaliação duplicada como rascunho: "{nome}"`), e o Admin é redirecionado **direto para a edição do rascunho novo** (`navigate('/avaliacoes/{novaAvaliacao.id}/editar')`, `EditarAvaliacaoRascunhoPage`) — nunca fica só na listagem. A intenção é que o Admin revise/complete a cópia (público, prazo) antes de considerá-la pronta.

---

## g. Filtro de status "Agendadas" — derivado, nunca gravado

O filtro de status da toolbar tem 5 opções: Todas / Rascunho / **Agendadas** / Ativas / Encerradas. "Agendadas" **não é** um valor do campo `status` do schema (`Avaliacao.status` só tem `'Rascunho' | 'Ativa' | 'Encerrada'`) — é inteiramente derivado, na hora, por `calcularStatusEfetivo(item, HOJE_SIMULADO)` (`src/app/utils/avaliacoes.ts`), que pode devolver `'Pendente'` para uma avaliação com `status: 'Ativa'` gravado quando a data de início (`periodoInicio`) ainda não chegou.

```ts
const statusEfetivoItem = () => calcularStatusEfetivo(item, HOJE_SIMULADO);
const matchStatus = statusFilterAvaliacoes === 'todas'
  || (statusFilterAvaliacoes === 'agendada'
    ? statusEfetivoItem() === 'Pendente'
    : statusFilterAvaliacoes === 'ativa'
    ? statusEfetivoItem() === 'Ativa'
    : item.status.toLowerCase() === statusFilterAvaliacoes.toLowerCase());
```

- "Agendadas" e "Ativas" comparam contra o status **calculado** (`'Pendente'`/`'Ativa'`) — nunca o campo bruto — porque o campo bruto fica `'Ativa'` tanto para uma avaliação já disponível quanto para uma agendada que ainda não chegou na data; comparar bruto faria as duas listas se sobreporem (uma avaliação agendada apareceria também em "Ativas").
- "Rascunho" e "Encerrada" continuam comparando o campo bruto `item.status` — sem problema, porque `calcularStatusEfetivo` sempre repassa esses dois direto (só `'Ativa'` bruto pode virar `'Pendente'`/`'Ativa'`/`'Expirada'` calculado).
- O badge de Status da linha usa a mesma fonte (`calcularStatusEfetivo` + `getStatusAvaliacaoBadgeClass`/`getStatusAvaliacaoLabel`) — o filtro nunca diverge visualmente do que a linha mostra.

---

## Componentes reaproveitados

| Componente/função | Onde é definido | Papel |
|---|---|---|
| `ListingPage` | `src/app/components/templates/ListingPage.tsx` | Shell padrão de listagem (toolbar, busca, filtro de status, empty state, paginação) — mesmo usado por Competências/Habilidades/Carreiras/Perfis. |
| `Table` | `src/app/components/ui/Table.tsx` | Renderização da tabela em si, incluindo a lógica de `table-fixed` condicional e o menu de ações a partir de 4 itens (seções d e e acima). |
| `calcularStatusEfetivo`, `getStatusAvaliacaoLabel`, `getStatusAvaliacaoBadgeClass`, `formatData` | `src/app/utils/avaliacoes.ts` | Fonte única de status calculado e formatação de data — reaproveitada também por `AvaliacaoDetalhePage.tsx`/`DashboardPage.tsx`, nunca reimplementada localmente. |
| `EditarAvaliacaoModal` | `src/app/components/avaliacoes/EditarAvaliacaoModal.tsx` | Drawer de prorrogação de prazo, acionado pela ação "Editar" quando a avaliação já tem participantes. |
| `ConfirmationModal` | `src/app/components/templates/ConfirmationModal.tsx` | Confirmação antes de "Encerrar". |
