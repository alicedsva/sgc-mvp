# Resposta ao Handoff — Cadastro de Avaliação (rodada 2)

> Respondido lendo o código atual diretamente (não de memória, não do handoff/resposta da rodada 1). Arquivos e linhas citados em cada seção. Onde a resposta depende de uma escolha da Alice e não é derivável do código, está marcado **PRECISA DECISÃO DA ALICE**.

Arquivos consultados:
- `src/app/components/avaliacoes/FormularioAvaliacao.tsx`
- `src/data/schema.ts`
- `src/app/components/ContentArea.tsx` (seção `selectedItem === 'avaliacoes'`)
- `src/app/utils/avaliacoes.ts`
- `docs/HANDOFF-CADASTRO-AVALIACOES.md` e `docs/RESPOSTA-HANDOFF-CADASTRO-AVALIACOES.md` (rodada 1, só para comparação no item 4c)
- `git log` / `git diff` de `ContentArea.tsx`

---

## 1. Etapa Prazo

### 1a. Estado atual completo

A regra nova de prazo (campos livres, `montarCamposPrazo`, ver `FormularioAvaliacao.tsx:73-106`) já está implementada e é a única versão em produção — não há vestígio do antigo seletor de 3 modos em lugar nenhum do arquivo.

**Campos:** 3 inputs lado a lado em grid de 3 colunas (`FormularioAvaliacao.tsx:960-990`):
- **Data de Início** — `<input type="date">` (`:964-970`)
- **Data de Término** — `<input type="date">` (`:973-979`)
- **Prazo (dias)** — `<input type="number" min={1}>` (`:982-989`)

Todos opcionais, todos independentes — nenhum campo desabilita outro (ver 1b).

**Validações** — ver 1c.

**Textos de apoio:** não há nenhum banner/aviso inline dentro da própria Etapa Prazo (abaixo do grid de campos). A única explicação textual de "o que acontece se eu deixar Início vazio" mora na dica lateral (coluna direita, ver 1d) e na dica da Revisão (`Salvar rascunho` → "Fica invisível para os colaboradores até você ativar depois.", `:580`). Isso é uma mudança em relação ao Handoff da rodada 1 (`docs/HANDOFF-CADASTRO-AVALIACOES.md:110`), que descrevia um "texto de aviso abaixo dos campos" — esse texto não existe mais no código atual como elemento inline da etapa; a informação foi para a dica.

### 1b. UI dos 3 campos

Confirmado: **sempre habilitados**, nenhum `disabled` condicional. Os três `<input>` (linhas 964-989) não têm atributo `disabled` em nenhuma circunstância — nenhum onChange de um campo mexe no valor ou no estado de outro. Preencher Término não desabilita Prazo (dias) e vice-versa — a coexistência dos dois é tratada só na inferência (`montarCamposPrazo`), nunca bloqueada na UI.

**Texto de apoio relacionado, hoje:**
- Nenhum texto de apoio (`hint`) abaixo de cada campo individual — só o `<label>` de cada um (`Data de Início` / `Data de Término` / `Prazo (dias)`).
- Explicações de cada campo existem apenas na dica lateral da etapa (ver 1d) — nunca junto ao campo em si.

### 1c. Validações existentes hoje (`validarEtapa`, etapa `'prazo'`, `FormularioAvaliacao.tsx:614-634`)

| # | Validação | Linha | Mensagem |
|---|---|---|---|
| 1 | Início no passado (`inicio < HOJE_ISO`) | `:620-622` | "A Data de Início não pode ser no passado" |
| 2 | Término antes da referência de início (Início preenchido, ou hoje se Início vazio) | `:625-628` | "A Data de Término não pode ser antes da Data de Início" |
| 3 | Dias preenchido e `<= 0` | `:631-633` | "Informe um prazo em dias válido" |

Não há uma quarta validação bloqueando Término + Dias juntos — o comentário em `:617-618` confirma explicitamente que essa combinação passou a ser válida.

**Validação de "Término anterior a Início + Prazo" (ex: Início = hoje, Prazo = 30 dias, Término = amanhã):** **não existe hoje**. A validação #2 acima só compara Término contra Início bruto (ou hoje), nunca contra `Início + Prazo dias`. Ou seja, é possível hoje configurar uma combinação onde o Término corta a avaliação antes mesmo do prazo individual de qualquer participante começar a fazer sentido (ex: Prazo de 30 dias mas Término em 2 dias) — o sistema aceita essa combinação sem aviso algum, e o comportamento em runtime já está coberto pela regra de precedência do Término (`calcularStatusEfetivo`/`calcularPrazoParticipante`, `schema.ts:206`/`267` da doc da rodada 1): o menor dos dois sempre vence, então tecnicamente não quebra nada, só pode gerar uma configuração "sem sentido prático" (prazo de 30 dias que na prática nunca chega a valer mais que poucos dias). Não implementei nenhuma validação nova aqui, só reportando o que existe — **PRECISA DECISÃO DA ALICE** se isso deveria virar um aviso (bloqueante ou não).

### 1d. Texto exato do item 5 (dica da Etapa Prazo)

A dica da Etapa Prazo (`FormularioAvaliacao.tsx:566-574`) tem **4 itens**, não 5 — mesma contagem já corrigida na resposta da rodada 1 (`docs/RESPOSTA-HANDOFF-CADASTRO-AVALIACOES.md:41`). Não existe um "item 5". Os 4 itens, transcritos exatamente do código atual:

1. **Início** — "Controla a partir de quando a avaliação fica disponível para os participantes."
2. **Término** — "Sempre corta tudo: quando chega, a avaliação some para todo mundo, mesmo que o **Prazo** individual de alguém ainda não tenha vencido." (a palavra "Prazo" em `font-medium`, via `<Campo>`)
3. **Prazo (dias)** — "É o mesmo número de dias para todos, mas a data-limite de cada participante varia — é contada a partir da data em que ele entrou na avaliação."
4. **Sem Data de Início** — "A avaliação some para rascunho, invisível para os colaboradores, até você publicá-la."

Se "item 5" se referia ao último item da lista (índice 4 de uma contagem 1-based que confundiu com a Revisão), é o item 4 acima ("Sem Data de Início"). Transcrito diretamente de `FormularioAvaliacao.tsx:572`.

### 1e. Aviso "Rascunho, usuário avisado"

Não existe um texto literal "Rascunho, usuário avisado" em nenhum lugar do código — essa frase é linguagem de documentação (usada na tabela de `montarCamposPrazo` da rodada 1 para indicar "essa combinação sem `dataPublicacao` produz um Rascunho, e o usuário já foi informado disso em algum lugar da UI"), não um texto renderizado.

O aviso real, na UI, é **só informativo, nunca bloqueante**, e aparece em dois lugares:
1. Dica da Etapa Prazo, item 4 — "Sem Data de Início" → "A avaliação some para rascunho, invisível para os colaboradores, até você publicá-la." (`:572`)
2. Dica da Etapa Revisão, item 1 — "Salvar rascunho" → "Fica invisível para os colaboradores até você ativar depois." (`:580`)

Nenhum dos dois impede o clique em "Salvar rascunho" (`handleSalvarRascunho`, `:654-657`) — a única validação nesse botão é nome preenchido.

### 1f. (sem resposta própria — coberto pela pergunta 4a, ver abaixo)

---

## 2. `montarPublicoLabelGranular` — todos os casos (`FormularioAvaliacao.tsx:164-195`)

| # | Caso | Texto exato produzido |
|---|---|---|
| 1 | 1 gerência inteira (ex: Comercial completa) | `"Comercial"` |
| 2 | 2 gerências inteiras (ex: Comercial + TI completas) | `"Comercial e TI"` |
| 3 | 3+ gerências inteiras (ex: Comercial, Financeiro, TI completas) | `"Comercial, Financeiro e TI"` (vírgula entre todas menos a última, "e" antes da última) |
| 4 | Gerência(s) inteira(s) + avulsos de fora delas (ex: Comercial completa + 3 avulsos de TI) | `"Comercial + 3 colaboradores selecionados"` |
| 5 | Só avulsos, sem nenhuma gerência fechada (ex: 5 de 12 do Comercial, nenhuma gerência 100%) | `"5 colaboradores selecionados"` |
| 6 | Todas as gerências existentes marcadas | `"Todos os colaboradores"` |
| 7 | Exatamente 1 avulso, sem gerência fechada (singular) | `"1 colaborador selecionado"` (sem "es", sem "s") |
| 8 | Exatamente 1 gerência inteira + 1 avulso (singular) | `"{nome da gerência} + 1 colaborador selecionado"` (mesmo singular do caso 7 no lado do avulso) |

Notas sobre a lógica (`:174-194`):
- `gerenciasInteiras` = gerências onde `marcados === total` e `total > 0`.
- Caso 1-3 e 6 só acontecem quando **toda** a seleção é coberta por gerências inteiras (`totalViaInteiras === selecionados.size`) — se sobrar 1 avulso que seja, cai no caso 4/8 (misto) ou 5/7 (só avulsos).
- Caso "todas as gerências + avulsos" é logicamente inalcançável: se todas as gerências existentes estão 100% marcadas, todo colaborador do sistema já está incluído, então não sobra ninguém para ser "avulso" — a função já cai no caso 6 antes de chegar no branch misto.
- A junção de nomes de gerências (casos 2 e 3) usa a lista `GERENCIAS` (`:18`, `Array.from(new Set(colaboradoresData.map(c => c.gerencia))).sort()`), sempre em ordem alfabética fixa — não depende da ordem de clique do Admin.

---

## 3. Duplicidade de nome + público-alvo — comparação por participantes, não por texto

> **Status: aprovado pela Alice e já implementado (2026-08-24).** Era uma proposta em aberto nesta rodada (a checagem de duplicidade comparava `formData.nome` + `formData.publicoLabelCalculado`, string exibida — risco de falso positivo/negativo já sinalizado na rodada 1, seção 3, "Ponto crítico para a detecção de duplicidade"). Deixou de ser proposta: está implementada em `FormularioAvaliacao.tsx` e documentada em detalhe em `docs/HANDOFF-CADASTRO-AVALIACOES.md` (seção "g. Validações").

**Implementação real:**
- `duplicidadeDetectada` (`FormularioAvaliacao.tsx:412-430`) continua comparando `formData.nome` (`.trim().toLowerCase()`, ignorando a própria avaliação em modo edição) contra o `nome` de cada item de `avaliacoesExistentes` — isso não mudou.
- O que mudou é a comparação do "público": em vez de comparar a string `publicoLabelCalculado`, agora compara os **participantes reais**:
  - Caminho `jornada`: mesmo `jornadaId` (`a.jornadaId === formData.jornadaId`).
  - Caminho `publico`: mesmo **conjunto** de IDs de colaboradores selecionados (`Set` — compara tamanho igual e todo ID de um lado presente no outro; ordem de seleção não importa).
- `avaliacoesExistentes` (prop de `FormularioAvaliacao`) passou a incluir `jornadaId` e `participantesIds` de cada avaliação existente — dado derivado de `Avaliacao.origemJornadaId`/`Avaliacao.participantes` (`schema.ts`), nenhum campo novo precisou ser adicionado ao schema.
- `publicoLabelCalculado` **continua existindo e sendo exibido normalmente na tela** — nada muda visualmente para o Admin. Só a comparação por baixo dos panos deixou de usar essa string como fonte de verdade.
- Efeito prático: o falso positivo relatado na rodada 1 (duas seleções de gerência+avulsos completamente diferentes, mas de mesma contagem total, gerando o mesmo texto genérico "N colaboradores selecionados" e por isso sendo tratadas como "o mesmo público") não ocorre mais — a comparação por IDs distingue os dois casos corretamente.
- **Mudança de posição, consequência direta:** no caminho "Por Público-alvo", a checagem só pode rodar depois que os participantes forem conhecidos — e a seleção de colaboradores deixou de acontecer na Etapa Identificação (virou etapa própria, "Colaboradores", reposicionada entre Prazo e Revisão). Por isso, nesse caminho, o aviso de duplicidade migrou da Etapa Identificação para a etapa Colaboradores (no caminho Jornada, permanece na Identificação, onde `jornadaId` já é conhecido). Ver `docs/HANDOFF-CADASTRO-AVALIACOES.md` para a estrutura completa das etapas por caminho.

---

## 4. Listagem de Avaliações (`ContentArea.tsx`, `selectedItem === 'avaliacoes'`)

> **Nota (2026-08-24):** esta seção documentou a listagem no momento da rodada 2, mas a listagem mudou bastante desde então — coluna "Origem" (já mencionada abaixo como pendente, hoje comitada), colunas Término/Prazo separadas do antigo "Período", e principalmente o **menu de ações** (`MoreVertical`, a partir de 4 ações configuradas) substituindo os 3 ícones soltos descritos no item 4b abaixo, incluindo a ação nova **Duplicar**. Existe agora um handoff dedicado e atualizado só para a listagem: **`docs/HANDOFF-LISTAGEM-AVALIACOES.md`** (criado nesta rodada). A partir de agora, use aquele documento como fonte para a listagem — esta seção fica como registro histórico do estado da rodada 2, não vale mais tentar mantê-la sincronizada com o código.

### 3a. Filtro "Agendadas" — status gravado ou derivado?

**Derivado, nunca o campo bruto.** `ContentArea.tsx:1701-1707`:

```ts
const statusEfetivoItem = () => calcularStatusEfetivo(item, HOJE_SIMULADO);
const matchStatus = statusFilterAvaliacoes === 'todas'
  || (statusFilterAvaliacoes === 'agendada'
    ? statusEfetivoItem() === 'Pendente'
    : statusFilterAvaliacoes === 'ativa'
    ? statusEfetivoItem() === 'Ativa'
    : item.status.toLowerCase() === statusFilterAvaliacoes.toLowerCase());
```

"Agendadas" e "Ativas" comparam contra `calcularStatusEfetivo(item, HOJE_SIMULADO)` (que pode devolver `'Pendente'` mesmo com `item.status === 'Ativa'` gravado, se a data de início ainda não chegou). "Rascunho" e "Encerrada" continuam comparando o campo bruto `item.status` — o comentário no código (`:1697-1700`) explica por quê: `calcularStatusEfetivo` só recalcula a partir de `'Ativa'` bruto (podendo virar `'Pendente'`/`'Expirada'`/`'Ativa'` calculado); Rascunho/Encerrada são sempre repassados direto pela função, sem alteração, então comparar bruto ou calculado dá o mesmo resultado para esses dois.

O badge de status da linha (`:1842-1856`) usa a mesma fonte (`calcularStatusEfetivo` + `getStatusAvaliacaoBadgeClass`/`getStatusAvaliacaoLabel`, ambas de `utils/avaliacoes.ts`), garantindo que o filtro nunca diverge do que a linha mostra.

### 3b. Ícones/ações por linha (`avaliacoesActions`, `ContentArea.tsx:1861-1890`)

| Ícone | Label | Ação | Condição de exibição |
|---|---|---|---|
| `Eye` | Visualizar | `navigate(/avaliacoes/{id})` — abre o detalhe | Sempre |
| `Edit` | Editar | Se `participantes.length === 0` (rascunho não materializado): `navigate(/avaliacoes/{id}/editar)` (página completa do wizard). Se já tem participantes: abre `EditarAvaliacaoModal` (drawer enxuto, só prorrogação de prazo) | Sempre visível, mas o destino muda por dado real (não por status) |
| `StopCircle` | Encerrar | Abre `ConfirmationModal` de confirmação; ao confirmar, `atualizarAvaliacao(id, { status: 'Encerrada' })` | Só quando `row.status === 'Ativa'` (`show: (row) => row.status === 'Ativa'`, `:1884`) — some para Rascunho/Encerrada/qualquer outro status bruto |

Máximo de 3 ícones, sem `MoreVertical` — de acordo com a regra do design system (`.claude/rules/02-design-system.md`, seção Tabelas).

### 3c. O que mudou desde a documentação anterior

A rodada 1 (handoff + resposta) documentou só o **wizard** (`FormularioAvaliacao.tsx`) — nenhum dos dois arquivos descreve a tela de listagem em si, então não há uma "versão anterior da listagem" documentada para comparar ponto a ponto. A única menção à listagem em documentação anterior está em `docs/DATA_MODEL.md:152`:

> "A tela de listagem de Avaliações do Admin (via `ContentArea`) hoje **não** usa esta fonte [`calcularStatusEfetivo`] — ver divergência crítica #1 no diagnóstico."

**Essa nota está desatualizada e contradiz o código atual.** Confirmado por `git log`/`git show`: o commit `737af20` ("cadastro de avaliacoes") já reescreveu o filtro de status e o badge da listagem para usar `calcularStatusEfetivo` (era comparação direta de `item.status` antes desse commit). A nota em `DATA_MODEL.md:152` descreve o estado **pré**-`737af20`, não o atual — vale atualizar aquele arquivo numa próxima passada (não fiz a edição agora, é fora do escopo pedido nesta rodada, só reportando).

**Mudanças concretas identificadas (via `git log`/`git diff` de `ContentArea.tsx`):**

1. **Coluna "Origem" — adicionada e ainda não commitada** (`git diff HEAD` mostra a coluna como mudança pendente no working tree, não em nenhum commit). Insere `{(row as Avaliacao).origemJornadaId ? 'Jornada de Carreira' : 'Público-alvo'}` entre Nome e Período (`ContentArea.tsx:1770-1779`). Junto com essa adição, a largura da coluna Nome caiu de `35%` para `25%` para abrir espaço (`Origem` ganhou `15%`).
2. **Formato do Período** — commit `737af20` trocou uma formatação local ad-hoc (`formatDataCurta(periodoInicio) - formatDataLonga(periodoFim)`, definida dentro do próprio `ContentArea.tsx`) por `formatPeriodoAvaliacao(row as Avaliacao)`, a mesma função central usada pelo wizard/Dashboard/`AvaliacaoDetalhePage` (documentada na rodada 1). Antes dessa troca, a listagem tinha sua própria lógica de formatação de data, divergente das outras telas.
3. **Badge de Status** — duas mudanças em sequência:
   - `737af20`: trocou de um `switch` que só cobria `Ativa`/`Encerrada`/fallback-amarelo (baseado no campo bruto `value`) para um cálculo via `calcularStatusEfetivo` com um mapeamento de cor inline cobrindo os 5 estados (`Ativa`/`Pendente`/`Rascunho`/demais).
   - Mudança pendente (não commitada): esse mapeamento de cor inline foi substituído por `getStatusAvaliacaoBadgeClass(statusEfetivo)`, a mesma função central hoje reusada por `AvaliacaoDetalhePage.tsx`/`DesignSystemPage.tsx` (`utils/avaliacoes.ts:81-86`) — eliminando a última cópia local de mapeamento de cor de status.
4. **Estado vazio e paginação** — nenhuma mudança identificada em `git log`/`git diff` para esses dois pontos: continuam via `EmptyState`/`ListingPage` com os mesmos textos e o mesmo componente `Table`/`PaginationConfig` de sempre (`ContentArea.tsx:1946-1959`).

---

## Resumo de itens que precisam decisão da Alice

- **1c** — se a ausência de validação "Término anterior a Início + Prazo" deveria virar um aviso (bloqueante ou não). Comportamento em runtime já é seguro (o menor dos dois sempre vence), mas a combinação pode ser configurada sem nenhum aviso ao Admin hoje.

Nenhum outro ponto ficou ambíguo o suficiente para exigir decisão — o restante foi respondido lendo o código atual diretamente.
