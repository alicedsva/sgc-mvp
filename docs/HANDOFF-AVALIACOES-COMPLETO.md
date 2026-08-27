# Handoff completo — Fluxo de Avaliações

> Este fluxo já foi implementado de forma diferente da especificação abaixo pelo menos uma vez. Siga exatamente o que está aqui, mesmo que pareça mais simples, mais específico, ou diferente do que pareceria natural construir do zero. Não invente comportamento, não simplifique regra, não reorganize estrutura por conta própria.

Este documento substitui, de forma consolidada e atualizada, o conteúdo de `docs/HANDOFF-CADASTRO-AVALIACOES.md`, `docs/HANDOFF-LISTAGEM-AVALIACOES.md`, `docs/AVALIACOES-INFO-CARDS-MODAIS-ALERTAS.md` e as rodadas de resposta (`docs/RESPOSTA-HANDOFF-CADASTRO-AVALIACOES.md`, `docs/RESPOSTA-HANDOFF-CADASTRO-AVALIACOES-RODADA-2.md`). Foi reescrito lendo o código real em **2026-08-27** (auditoria direta, sem apoio de resumo/histórico), depois de: o redesign da etapa Revisão (múltiplos containers, tipografia própria); a chegada do botão "Visualizar questionário" + abas Habilidades/Colaboradores na tela de detalhe de avaliação materializada; e o modelo de prazo final (Término + Prazo em dias podendo coexistir). Onde o código antigo, ou qualquer versão anterior deste handoff, divergir deste documento, **este documento vale**.

Todo caminho de arquivo abaixo é relativo à raiz do repositório.

---

## 0. O que mudou desde a versão de 2026-08-26 (changelog de auditoria)

Todos os itens abaixo foram **conferidos no código atual** — estão implementados e em produção, não são "aprovado, pendente de implementação".

1. **Tela de detalhe — avaliação materializada (`AvaliacaoDetalheView`)**: ganhou um botão **"Visualizar questionário"** (ícone `Eye`, botão secundário/outline brand) no canto superior direito do header, e as tabelas de Participantes foram substituídas por **duas abas** ("Habilidades" / "Colaboradores", aba default **`colaboradores`**), no mesmo padrão de abas que a `AvaliacaoRascunhoView` já tinha (só que lá a default é `habilidades`). Ver seção **g**.
2. **Modelo de prazo — combinações**: a tabela real é de **8 combinações** (3 campos binários = 2³). O comentário de código que dizia "9 casos" já foi corrigido para "8 casos" (`FormularioAvaliacao.tsx`, linha 50). O modo `datas_fixas_com_prazo` (Término + Prazo em dias juntos) **está implementado** em `montarCamposPrazo`, `calcularStatusEfetivo`, `calcularPrazoParticipante` e `formatPeriodoAvaliacao`. Ver seção **d**.
3. **Listagem**: menu de ações com **4 entradas** (`Visualizar` / `Editar` / `Encerrar` / `Duplicar`) — pela regra `actions.length >= 4` de `02-design-system.md`, renderiza como menu de contexto (`MoreVertical` + `DropdownMenu`), não mais ícones soltos. Ver seção **f**.
4. **Etapa Revisão do wizard**: containers separados por etapa real do caminho, ordem/títulos condicionais a `formData.caminho`, participantes agrupados pela **gerência real** de cada colaborador, tipografia própria (exceção documentada em `02-design-system.md`). Ver seção **e**.

---

## a. Visão geral

O fluxo de Avaliações tem três áreas:

1. **Admin — Cadastro**: wizard de criação/edição de avaliação.
   - `src/app/pages/CriarAvaliacaoPage.tsx` — criação (rota `/avaliacoes/nova`).
   - `src/app/pages/EditarAvaliacaoRascunhoPage.tsx` — edição de um Rascunho sem participantes (rota `/avaliacoes/:id/editar`).
   - Ambas só renderizam `src/app/components/avaliacoes/FormularioAvaliacao.tsx` (o wizard em si) com handlers diferentes — nenhuma tem UI própria de formulário.
2. **Admin — Listagem e Detalhe**:
   - `src/app/pages/AvaliacoesPage.tsx` — casca fina que delega para `src/app/components/ContentArea.tsx` (`selectedItem === 'avaliacoes'`), que contém a tabela, filtros, ações e os dois modais de listagem (prorrogação, encerramento).
   - `src/app/pages/AvaliacaoDetalhePage.tsx` — detalhe de uma avaliação (rota `/avaliacoes/:id`), com duas views internas conforme o status bruto (`Rascunho` vs. qualquer outro).
   - `src/app/pages/ParticipanteResultadoPage.tsx` — resposta de UM participante específico, vista pelo Admin (rota `/avaliacoes/:id/participantes/:colaboradorId`), acessada só pelo ícone Eye da tabela de participantes em `AvaliacaoDetalhePage.tsx`.
3. **Colaborador — Responder e Ver resultado**:
   - `src/app/pages/MinhasAvaliacoesPage.tsx` — casca fina que delega para `ContentArea.tsx` (`selectedItem === 'minhas-avaliacoes'`), que renderiza `src/app/components/MinhasAvaliacoes.tsx`.
   - `src/app/pages/RespostaAvaliacaoPage.tsx` — tela fullscreen de resposta (rota `/minhas-avaliacoes/responder/:avaliacaoId`), fora da árvore de `Layout.tsx` (sem Sidebar/Header do sistema).
   - `src/app/pages/ResultadoAvaliacaoPage.tsx` — casca fina que renderiza `src/app/components/ResultadoAvaliacao.tsx` (rota `/minhas-avaliacoes/resultado/:avaliacaoId`).

Dado real: tudo passa por `src/app/context/AvaliacoesContext.tsx` (`useAvaliacoes()`), que carrega/persiste em `localStorage` (chave `carreiras_avaliacoes`, versão de mock em `MOCK_DATA_VERSION`, hoje `'2026-08-25-7'`). Nunca ler `avaliacoesData` de `mockData.ts` diretamente numa tela — sempre via `useAvaliacoes().avaliacoes`.

Lógica compartilhada entre praticamente todas as telas vive em `src/app/utils/avaliacoes.tsx` — ver seção **k**.

---

## c. Cadastro (wizard)

Arquivo: `src/app/components/avaliacoes/FormularioAvaliacao.tsx` (1647 linhas). Um único componente `FormularioAvaliacao` cobre criação e edição de Rascunho; a diferença de modo é a prop `avaliacaoExistente` (presente = edição).

### Caminhos e etapas exatas

Duas constantes de etapas (`interface Etapa { key; label }`), lidas literalmente do código:

**`ETAPAS_CRIACAO_JORNADA`** (Caminho "Por Jornada de Carreira", 5 etapas):
1. `publico` → label **"Público"**
2. `identificacao` → label **"Identificação"**
3. `habilidades` → label **"Habilidades"**
4. `prazo` → label **"Prazo"**
5. `revisao` → label **"Revisão"**

**`ETAPAS_CRIACAO_PUBLICO`** (Caminho "Por Público-alvo", 6 etapas):
1. `publico` → **"Público"**
2. `identificacao` → **"Identificação"**
3. `habilidades` → **"Habilidades"**
4. `prazo` → **"Prazo"**
5. `colaboradores` → **"Colaboradores"**
6. `revisao` → **"Revisão"**

Note a ordem: no caminho "Por Público-alvo" a seleção de participantes (`colaboradores`) vem **depois** de Prazo, não logo após a escolha do caminho. Isso é decisão de produto documentada no código (2026-08-24): o Admin pode montar toda a avaliação e decidir o público por último; a etapa deixou de ser obrigatória para avançar (um Rascunho pode existir sem nenhum participante — só não pode ser ativado/publicado assim).

Em **modo edição** (Rascunho sem participantes), a etapa `publico` some — o caminho já foi escolhido na criação e não pode ser trocado:
- `ETAPAS_EDICAO_JORNADA = ETAPAS_CRIACAO_JORNADA.filter(e => e.key !== 'publico')` (4 etapas)
- `ETAPAS_EDICAO_PUBLICO = ETAPAS_CRIACAO_PUBLICO.filter(e => e.key !== 'publico')` (5 etapas)

### Cabeçalho (H1 + apoio) por etapa

Lido de uma função IIFE dentro do render (`cabecalho`), texto literal:

| Etapa | Título (H1) | Apoio |
|---|---|---|
| `publico` | "Como você quer definir o público desta avaliação?" | (nenhum) |
| `colaboradores` | "Quem vai participar desta avaliação?" | "Escolha por gerência, por colaboradores específicos, ou os dois" |
| `identificacao` (caminho jornada) | "Qual jornada de carreira será avaliada?" | "As habilidades avaliadas virão da matriz dessa jornada" |
| `identificacao` (caminho público) | "Como esta avaliação vai se chamar?" | "Dê um nome e, se quiser, uma descrição para o objetivo desta avaliação" |
| `habilidades` | "Quais habilidades serão avaliadas?" | jornada: nenhum · público: "Escolha livremente as habilidades que farão parte desta avaliação" |
| `prazo` | "Qual será o prazo desta avaliação?" | "Escolha o modelo que melhor se encaixa no seu processo" |
| `revisao` | "Está tudo certo antes de ativar?" | "Confira os detalhes e visualize o questionário antes de publicar" |

Na etapa `revisao`, o botão "Visualizar questionário" (ícone `Eye`, botão secundário/outline) entra na mesma linha do H1, alinhado à direita.

### Etapa Público (só criação)

Dois cards lado a lado (grid 2 colunas), cada um `text-left p-4 rounded-lg border`:
- **"Por Jornada de Carreira"** (ícone `GitBranch`) — "Habilidades e participantes vêm da matriz da jornada escolhida."
- **"Por Público-alvo"** (ícone `UsersIcon`) — "Escolha gerências, colaboradores e habilidades livremente."

Selecionado: `border-[var(--brand-600)] bg-[var(--brand-50)]` e ícone `text-[var(--brand-600)]`. Não selecionado: `border-gray-200 hover:bg-gray-50`, ícone `text-gray-400`.

### Etapa Identificação

**Caminho "Por Jornada", criação**: dois `SearchableSelect` em cascata:
1. **Carreira** (`carreiraFiltroId`, filtro de UI, não é campo do schema/Avaliacao — só recorta a lista de jornadas) — opções: `carreirasAtivas` (`status === 'Ativa'`).
2. **Jornada de Carreira** (`formData.jornadaId`) — opções: `jornadasFiltradasPorCarreira` (jornadas ativas cuja `carreiraId` bate com a carreira escolhida). `disabled` até a Carreira ser escolhida; placeholder muda para "Selecione uma carreira primeiro" nesse caso.

Ao selecionar a jornada (`handleSelecionarJornada`), pré-marca **todas** as habilidades da matriz agregada (`getHabilidadesAgregadasDaJornada`) e fixa `participantesIds = getColaboradoresPorJornada(jornadaId)` — participantes não são selecionáveis manualmente neste caminho. Trocar a Carreira reseta jornada/habilidades/participantes.

Se `jornadaPreSelecionada` for passada via `location.state` (botão "Criar avaliação para esta matriz" de `JornadaDetalhePage`), a mesma população roda uma vez no mount (`useEffect` vazio) — o Select nunca dispara `onValueChange` nesse caso porque o valor já nasce setado.

Abaixo do select de Jornada, quando `jornadaSelecionada` existe: `"{N} habilidade(s) pré-marcada(s) da matriz · {N} participante(s)"` + link "Ver colaboradores" (abre `ColaboradoresListaModal`) quando há participantes.

**Caminho "Por Jornada", edição**: campo travado (`bg-gray-50`, não editável), texto "Vínculo fixo, não pode ser trocado" à direita, + `"{N} participante(s) nesta jornada agora"` abaixo (recalculado ao vivo via `getColaboradoresPorJornada`, nunca a lista congelada da criação).

**Caminho "Por Público-alvo"**: esta etapa NÃO mostra seleção de jornada nem de colaboradores — só Nome/Descrição (a seleção de participantes já é etapa própria, `colaboradores`, mais adiante).

**Campos comuns aos dois caminhos**:
- **Nome da Avaliação** (`<span className="text-red-500">*</span>` obrigatório) — `input type="text"`, placeholder "Ex: Avaliação de Competências Técnicas Q1 2026". Se `duplicidadeDetectada && formData.caminho === 'jornada'`, mensagem de erro abaixo (`text-sm text-red-600`) com o texto de `mensagemDuplicidade` (ver seção duplicidade). No caminho público, essa mesma checagem só aparece mais adiante (etapa Colaboradores), porque só ali a seleção de participantes existe.
- **Descrição** (opcional) — `textarea rows={3}`, placeholder "Descreva o objetivo da avaliação".

### Etapa Habilidades

Componente `HabilidadesMasterDetail` (`src/app/components/templates/HabilidadesMasterDetail.tsx`), reaproveitado sem alteração. Label "Habilidades" + contador `"{N} selecionada(s)"` acima. `prioridade={habilidadesDaMatriz}` (caminho jornada: Set das habilidades da matriz da jornada atual, fixadas no topo da lista; caminho público: Set vazio).

### Etapa Colaboradores (só caminho "Por Público-alvo")

**Não é um modal** — é o componente `SeletorGerenciaGranular` (`src/app/components/templates/SeletorGerenciaGranular.tsx`) embutido direto na etapa do wizard, com duas colunas:
- **Esquerda (`w-56`)**: lista de gerências (`GERENCIAS`, derivada de `colaboradoresData`, nunca lista fixa), cada linha com um checkbox **tri-state** (via `ref` + `el.indeterminate`) que seleciona a gerência inteira, e um contador `"{marcados}/{total}"` (ou só `{total}` se ninguém marcado).
- **Direita (`flex-1`)**: colaboradores da gerência ativa (clique no nome da linha à esquerda troca a gerência ativa), com campo de busca local (`"Buscar colaboradores..."`, filtra só dentro da gerência ativa) e link "Selecionar todos"/"Limpar seleção" que atua só sobre a gerência ativa.

Quando a gerência ativa está **inteiramente** selecionada, aparece um banner (`bg-[var(--brand-50)]`) com o toggle **"Incluir automaticamente novos colaboradores desta gerência"** (`ToggleSwitch tone="neutral"`), que grava o nome da gerência em `Avaliacao.gerenciasComAutoInclusao`. **Isto é só protótipo**: nenhum mecanismo do sistema hoje reage a esse campo (não há fluxo de criar/editar colaborador que dispare a inclusão automática) — o campo registra apenas a intenção. Comentário idêntico em `schema.ts` (campo `gerenciasComAutoInclusao`) e em `SeletorGerenciaGranular.tsx`.

Acima do componente, label "Público-alvo" + contador `"{N} colaborador(es) selecionado(s)"`. Se `duplicidadeDetectada`, banner amarelo (`AlertTriangle`) com `mensagemDuplicidade`.

### Etapa Prazo

Ver seção **d** completa.

### Duplicidade — `duplicidadeDetectada`

Aviso não-bloqueante (nunca impede salvar/ativar). Compara **nome** (trim + case-insensitive) **e** o **público real** (nunca o texto `publicoLabelCalculado`, que pode colidir entre seleções diferentes — ver comentário de `montarPublicoLabelGranular` no código, bug real corrigido em 2026-08-20):

- Caminho `jornada`: mesmo `jornadaId`.
- Caminho `publico`: mesmo **conjunto** de `colaboradoresSelecionados` (tamanho igual E todo id presente — comparação de conjunto, ordem não importa).

Exclusão de autocomparação — dois mecanismos, um por modo:
- **Modo edição**: `nomeIgual` já filtra a própria avaliação (`a.nome !== avaliacaoExistente.nome`).
- **Modo criação**: `avaliacaoRecemCriadaId` (estado local, setado pelo retorno de `onSalvarRascunho`/`onAtivar`) filtra `avaliacoesExistentes` por `a.id !== avaliacaoRecemCriadaId` — necessário porque, em criação, o formulário continua montado por trás do `ModalResumoAvaliacao` até o Admin fechá-lo, e a página-pai já inseriu a nova avaliação no Context; sem esse filtro, o registro recém-criado colidiria consigo mesmo no próximo render.

Mensagem (`mensagemDuplicidade`), condicional ao caminho:
- Jornada: **"Já existe uma avaliação com esse nome para essa jornada."**
- Público: **"Já existe uma avaliação com esse nome para esse público-alvo."**

### Validações — `validarEtapa(etapa)`

Roda no `handleContinuar` (bloqueia avanço se `false`) e também é chamada por `handleAtivar` para `'identificacao'` e `'prazo'` antes de publicar:

- `'publico'`: se `!formData.caminho` → toast erro **"Escolha como definir o público desta avaliação"**.
- `'identificacao'`: se nome vazio → **"Preencha o nome da avaliação"**; se caminho jornada e sem `jornadaId` → **"Selecione uma jornada de carreira"**.
- `'prazo'`: se Início preenchido e no passado (`< HOJE_ISO`) → **"A Data de Início não pode ser no passado"**; se Término preenchido e menor que (Início ou hoje, o que estiver definido) → **"A Data de Término não pode ser antes da Data de Início"**; se Dias preenchido e `<= 0` → **"Informe um prazo em dias válido"**. Término + Dias juntos **não** é mais bloqueado (comentário no código confirma que essa combinação passou a ser válida).

`handleSalvarRascunho` (botão "Salvar rascunho", disponível em toda etapa) só exige nome preenchido — nenhuma outra validação. `handleAtivar` (botão final) primeiro checa `semColaboradoresSelecionados` (retorna sem toast — o próprio botão já fica `disabled`), depois roda `validarEtapa('identificacao')` e `validarEtapa('prazo')`.

---

## d. Modelo de prazo

Campos de UI (Etapa Prazo, 3 inputs lado a lado, `grid grid-cols-3 gap-4`), rótulos exatos:
- **"Data de Início"** — `input type="date"`.
- **"Data de Término"** — `input type="date"`.
- **"Prazo de resposta (em dias)"** — `input type="number" min={1}`.

Os três são **livres, opcionais e independentes** — Término e Dias podem coexistir (regra de negócio final; a versão anterior os tratava como mutuamente exclusivos). O `modoPrazo` real do schema (`ModoPrazoAvaliacao = 'datas_fixas' | 'prazo_em_dias' | 'datas_fixas_com_prazo' | 'indefinido'`) é **sempre inferido** dessa combinação pela função `montarCamposPrazo(data, dataPublicacao?)`, nunca escolhido diretamente pelo Admin.

### Combinações reais (lidas direto da implementação)

O comentário no código (linhas 47-73 de `FormularioAvaliacao.tsx`) descreve uma tabela anunciada como **"os 9 casos abaixo"**, mas a tabela documentada e a implementação real (`if`/`else` em cascata) só cobrem as **8 combinações possíveis** de 3 campos binários (preenchido/vazio) — não existe um 9º caso. **PRECISA CONFIRMAR COM ALICE:** o comentário do código está desatualizado/impreciso ("9 casos" vs. 8 combinações reais) — não corrigimos o comentário nesta limpeza por estar fora do escopo (não é dead code, é comentário impreciso), mas o texto abaixo reflete o comportamento REAL da função, testado combinação a combinação:

| Início | Término | Dias | `modoPrazo` resultante | `periodoInicio` |
|---|---|---|---|---|
| vazio | vazio | vazio | `indefinido` | `dataPublicacao ?? ''` |
| preenchido | vazio | vazio | `indefinido` | a própria data informada |
| vazio | preenchido | vazio | `datas_fixas` | `dataPublicacao ?? ''` |
| vazio | vazio | preenchido | `prazo_em_dias` | `dataPublicacao ?? ''` |
| preenchido | preenchido | vazio | `datas_fixas` | a data informada |
| preenchido | vazio | preenchido | `prazo_em_dias` | a data informada |
| vazio | preenchido | preenchido | `datas_fixas_com_prazo` | `dataPublicacao ?? ''` |
| preenchido | preenchido | preenchido | `datas_fixas_com_prazo` | a data informada |

Quando **Término + Dias** coexistem (`datas_fixas_com_prazo`), o prazo individual de cada participante é o **menor** entre `dataEntrada + prazoDias` e `periodoFim` (ver `calcularPrazoParticipante`), e `periodoFim` sempre tem precedência para expirar a avaliação **inteira** (ver `calcularStatusEfetivo`).

`dataPublicacao` ausente (chamada de `handleSalvarRascunho`) = ainda não é publicação de fato — os ramos que resolveriam `periodoInicio` para "agora" ficam com `''`. `dataPublicacao` presente (`HOJE_SIMULADO`, chamada de `handleAtivar`/preview) = resolve para a data real.

### Botão de ativação — texto dinâmico

`dataInicioFutura = formData.dataInicio.trim() !== '' && formData.dataInicio.trim() > HOJE_ISO`.
- Futura → label **"Agendar avaliação"**, publica direto (chama `onAtivar` sem confirmação).
- Vazia ou hoje → label **"Publicar agora"**, abre `ConfirmationModal` (`confirmPublicarAberto`) antes de publicar de fato — só esta situação passa por confirmação, porque é irreversível na hora.

### Dica lateral da Etapa Prazo (itens, título + texto exato)

Título: **"Como o prazo funciona"**. 4 itens:
1. **Início** — "Controla a partir de quando a avaliação fica disponível para os participantes."
2. **Término** — "Sempre corta tudo: quando chega, a avaliação some para todo mundo, mesmo que o **Prazo de resposta** individual de alguém ainda não tenha vencido."
3. **Prazo de resposta** — "É o mesmo número de dias para todos, mas a data-limite de cada participante varia: é contada a partir da data em que ele entrou na avaliação."
4. **Sem Data de Início** — "A avaliação some para rascunho, invisível para os colaboradores, até você publicá-la."

### Aviso não-bloqueante — Término corta antes do Prazo em dias

`prazoTerminoCortaAntesDoPrazoDias`: quando os 3 campos estão preenchidos e Término < Início + Dias, aparece um banner informativo (estilo "Informativo contextual" do design system, `bg-[var(--brand-50)]`) com o texto:

> "A Data de Término chega antes do Prazo de resposta terminar. Como o Término sempre prevalece, nenhum participante terá os {N} dia(s) completo(s) de prazo."

### `getPrazoPartes` (`src/app/utils/avaliacoes.tsx`)

```ts
export function getPrazoPartes(
  avaliacao: Pick<Avaliacao, 'periodoInicio' | 'periodoFim' | 'prazoDias'>,
  agendada = false,
  peso: 'semibold' | 'normal' = 'semibold'
): ReactNode[]
```

Monta até 3 partes (`<strong>`), uma por campo presente, para uso dentro de `LinhaMeta`:
- **"Inicia em: {data}"** — se `agendada`, ganha o ícone `AvisoAtivacaoAgendada` ao lado (tooltip "Esta avaliação se tornará ativa no dia {data}.").
- **"Termina em: {data}"**.
- **"Prazo de resposta: {N} dia(s)"** — sempre com um ícone `Info` + tooltip: "É o mesmo número de dias para todos, mas a data-limite de cada participante varia: é contada a partir da data em que ele entrou na avaliação."

Se nenhum campo estiver presente, retorna `['A definir']`.

O parâmetro **`peso`** (`'semibold'` default) controla `font-semibold` vs. `font-normal` no `<strong>`. **`AvaliacaoDetalhePage.tsx` nunca passa esse parâmetro** (fica no padrão semibold, nas duas views). **Só `FormularioAvaliacao.tsx` passa `'normal'`**, e só no `containerPrazo` da etapa Revisão (exceção documentada em `02-design-system.md`).

### Textos do `ModalResumoAvaliacao` (pós-conclusão do wizard)

Título/corpo variam por `isRascunho`/`isAgendada` (computados a partir do `status`/`periodoInicio` da avaliação recém-criada):
- Rascunho → título **"Avaliação salva como rascunho"**, corpo **"Fica invisível para os colaboradores até você ativá-la, na tela de detalhe da avaliação."**
- Agendada (`!isRascunho && periodoInicio > hojeISO`) → título **"Avaliação agendada"**, corpo **"Será publicada automaticamente para os participantes. {formatPeriodoAvaliacao(avaliacao)}"**.
- Publicada (senão) → título **"Avaliação publicada"**, corpo **"Já está disponível para os participantes responderem. {formatPeriodoAvaliacao(avaliacao)}"**.

Corpo completo sempre prefixado por `"{nome da avaliação}: "`.

### Mensagem do `ConfirmationModal` de publicação imediata

Título: `` `Publicar "${formData.nome}" agora?` ``. Mensagem, por `prazoPreview.modoPrazo`:
- `indefinido`: "A avaliação ficará disponível imediatamente para os participantes, sem prazo de término definido. Continua ativa até você encerrá-la manualmente."
- `datas_fixas_com_prazo`: `` `A avaliação ficará disponível imediatamente para os participantes até ${data término}, mesmo que o prazo individual de algum participante ainda não tenha vencido. ${prazoTextoUnificado}` ``
- demais: `` `A avaliação ficará disponível imediatamente para os participantes. ${prazoTextoUnificado}` ``

`confirmLabel`: **"Publicar agora"**. `cancelLabel`: **"Cancelar"**. `variant="warning"`.

---

## e. Etapa Revisão — especificação detalhada

Redesenhada em 2026-08-25 (7 rodadas de ajuste fino a pedido da Alice). Esta é a área mais recentemente alterada — siga a estrutura abaixo literalmente, ela é a única fonte de verdade (nenhum documento antigo reflete este design).

### Estrutura geral

A etapa renderiza uma sequência de **containers separados**, um por etapa real do caminho ativo (nunca um card único). Cada container é uma constante própria, definida antes do `return` principal do componente:

- `containerIdentificacao`
- `containerPublicoAlvo` (nome de variável interno — o TÍTULO exibido é condicional, ver abaixo)
- `containerHabilidades`
- `containerPrazo`

**Ordem de renderização — condicional a `formData.caminho`:**

- **Caminho "Por Jornada"** (etapas reais: Público → Identificação → Habilidades → Prazo → Revisão):
  1. `containerPublicoAlvo` (título "Público")
  2. `containerIdentificacao`
  3. `containerHabilidades`
  4. `containerPrazo`
- **Caminho "Por Público-alvo"** (etapas reais: Público → Identificação → Habilidades → Prazo → Colaboradores → Revisão):
  1. `containerIdentificacao`
  2. `containerHabilidades`
  3. `containerPrazo`
  4. `containerPublicoAlvo` (título "Colaboradores", por último — bate com a posição real da etapa "Colaboradores" no stepper desse caminho)

Depois dos containers: banner amarelo se `semColaboradoresSelecionados` ("Sem colaboradores selecionados, esta avaliação só pode ser salva como rascunho: a publicação fica indisponível até você selecionar ao menos um participante na etapa Colaboradores.") e banner amarelo se `duplicidadeDetectada` (`mensagemDuplicidade`).

### Anatomia de cada container

```
bg-white border border-gray-200 rounded-lg
```

**Cabeçalho** — linha única (`flex items-center justify-between`), `border-b border-gray-200` de **ponta a ponta** (largura total do card) — é a **única** divisória do container. Nunca reintroduzir uma linha entre campos dentro do mesmo container (ex.: entre Nome e Descrição em Identificação; entre Carreira e Jornada no card "Público" do caminho jornada) — uma versão anterior tinha `<div className="mx-5 border-t border-gray-200" />` ali, removida a pedido da Alice.
- Título à esquerda: `text-sm font-semibold text-gray-900` (14px), texto = nome exato da etapa no stepper daquele caminho.
- Botão de editar à direita: ícone `Pencil` (`w-4 h-4`), mesmo padrão de "Ação em tabela (ícone)" do design system (`p-1.5 md:p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors`). `onClick` chama `setCurrentStepKey(...)` — o **mesmo** mecanismo de navegação do stepper, nunca uma navegação paralela.

**Mapeamento container → etapa de destino do botão editar:**

| Container | Título exibido | `setCurrentStepKey(...)` |
|---|---|---|
| `containerIdentificacao` | "Identificação" | `'identificacao'` |
| `containerPublicoAlvo`, caminho jornada | **"Público"** (nunca "Público-alvo" — esse nome não existe em nenhuma etapa real) | `'identificacao'` (é lá que a Jornada é escolhida — a etapa `'publico'` em si só define o caminho) |
| `containerPublicoAlvo`, caminho público | **"Colaboradores"** (nome exato da etapa `key: 'colaboradores'`) | `'colaboradores'` |
| `containerHabilidades` | "Habilidades" | `'habilidades'` |
| `containerPrazo` | "Prazo" | `'prazo'` |

**Corpo** — `px-5 py-4`, campos empilhados com `space-y-5` (ou `space-y-4 md:space-y-5` no container "Público"/"Colaboradores"). **Nunca** `<hr>`/borda entre campos dentro do mesmo corpo — só espaçamento vertical.

### Tipografia — exceção documentada

**Diferente do padrão geral de "Cabeçalho de tabela"** (`text-[10px] md:text-xs uppercase tracking-wider text-gray-500`, documentado em `02-design-system.md`), que **não** se aplica aqui:
- Label de campo: **`text-xs font-semibold text-gray-900`** (12px, sentence case, nunca caixa alta) — carrega o destaque visual.
- Valor abaixo do label: **`text-sm font-normal text-gray-700`** (14px, peso normal, cor mais neutra).
- Título de seção (nome do container, no cabeçalho): **`text-sm font-semibold text-gray-900`** (14px).

Containers com um único campo (Habilidades, Prazo) não repetem o nome do campo como label interno — o título do próprio container já cumpre esse papel.

### Conteúdo de cada container

**`containerIdentificacao`**:
- Label "Nome" / valor `formData.nome || 'Não preenchido'`.
- Label "Descrição" / valor `formData.descricao || 'Sem descrição'` (`leading-relaxed`).

**`containerPublicoAlvo`**, caminho **jornada** (`carreiraEJornada` resolvido via `getCarreiraEJornadaNomes`):
- Label "Carreira" / valor `carreiraEJornada.carreira`.
- Label "Jornada" / valor `carreiraEJornada.jornada`, seguido (sem label próprio, sem divisória acima) por `linhaParticipantes`: `"{N} participante(s)"` + link "Ver colaboradores" (quando `N > 0`) abrindo `ColaboradoresListaModal`.

**`containerPublicoAlvo`**, caminho **público** (via `participantesPorGerencia`, agrupamento REAL pela gerência atual de cada colaborador em `colaboradoresData` — nunca pelo texto de `montarPublicoLabelGranular`, que só descreve COMO a seleção foi montada):
- Se vazio: `"Não definido"`.
- Por gerência (ordem alfabética, via `GERENCIAS`): nome da gerência (`text-sm font-normal text-gray-700`) + `"{N} participante(s) · Ver colaboradores"` (link abre `ColaboradoresListaModal` filtrado só pelos colaboradores daquela gerência).

**`containerHabilidades`**:
- Se vazio: `"Nenhuma selecionada"`.
- Senão: `"{N} habilidade(s) selecionada(s)"` + lista de badges (`bg-[var(--brand-100)] text-[var(--brand-800)]` para Técnica, `bg-purple-100 text-purple-800` para Comportamental), `max-h-40 overflow-y-auto`.

**`containerPrazo`**:
- `<LinhaMeta className="text-sm font-normal text-gray-700" partes={getPrazoPartes(prazoPreview, dataInicioFutura, 'normal')} />` — o **único** lugar do sistema que passa `'normal'` como 3º argumento de `getPrazoPartes` (exceção visual documentada).

O campo "Tipo"/"Autoavaliação" **não** aparece nesta etapa (removido numa rodada anterior — informação não foi removida do sistema, só não é exibida aqui).

---

## f. Listagem Admin (`ContentArea.tsx`, `selectedItem === 'avaliacoes'`)

### Colunas, na ordem exata (`avaliacoesColumns`)

| # | key | label | width | Ordenável | Conteúdo |
|---|---|---|---|---|---|
| 1 | `nome` | "Nome da Avaliação" | 17% | Sim | Nome |
| 2 | `descricao` | "Descrição" | 20% | Não | `line-clamp-2 break-words`, tooltip via `title` nativo (nunca a bolha `HelpCircle`/`group` — cortaria por `overflow-hidden` da tabela); `"-"` se vazio |
| 3 | `origem` | "Origem" | 9% | Não | `"Jornada"` se `origemJornadaId` presente, senão `"Público"` |
| 4 | `periodo` (rótulo "Início") | "Início" | 8% | Sim (compara `periodoInicio`) | Data formatada ou `"-"`; ícone de urgência (ver abaixo) |
| 5 | `termino` | "Término" | 8% | Não | Data formatada ou `"-"` |
| 6 | `prazo` | "Prazo" | 7% | Não | `"{N} dia(s)"` ou `"-"` |
| 7 | `participantes` | "Participantes" | 12% | Não | `"-"` se Rascunho; senão `"{concluídas}/{total}"` + barra de progresso |
| 8 | `status` | "Status" | 9% | Sim | Badge com `getStatusAvaliacaoLabel(calcularStatusEfetivo(...))` |

Larguras somam 90% (não 100%) — `table-layout: fixed` se aplica de qualquer forma, porque a condição em `Table.tsx` é `columns.length > 0 && columns.every(column => !!column.width)` — **todas** as 8 colunas definem `width`, então o modo fixo é ativado independente da soma.

### Ícone de urgência de ativação agendada

Componente `AvisoAtivacaoAgendada` (`utils/avaliacoes.tsx`), reaproveitado aqui com props diferentes do padrão. Condição de exibição na coluna "Início" (`agendadaUrgente`):

```ts
calcularStatusEfetivo(row, HOJE_SIMULADO) === 'Pendente' && diasAteAtivar <= 5
```

onde `diasAteAtivar = calcularDiasAteVencimento(periodoInicio, HOJE_SIMULADO)`. Quando visível: `corIcone="text-red-500"` (diferente do cinza padrão usado em `getPrazoPartes`/`AvaliacaoDetalhePage.tsx`), `texto` sobrescrito para contador regressivo: `"Vai ficar ativa hoje."` / `"Vai ficar ativa amanhã."` / `` `Vai ficar ativa em ${N} dias.` ``.

### Menu de ações — 4 ações, atingiu o limiar do menu

`avaliacoesActions` tem **4 entradas configuradas** (`Visualizar`, `Editar`, `Encerrar`, `Duplicar`) — pela regra "Menu de ações" de `02-design-system.md` (`actions.length >= 4` → `MoreVertical`/`DropdownMenu`), esta tabela **já usa o menu de contexto**, não mais ícones soltos.

| Ação | Ícone | Condição de exibição/estado | `onClick` |
|---|---|---|---|
| Visualizar | `Eye` | sempre | `navigate('/avaliacoes/{id}')` |
| Editar | `Edit` | sempre | se `participantes.length === 0` → `navigate('/avaliacoes/{id}/editar')` (página completa); senão → abre `EditarAvaliacaoModal` (só prorrogação) |
| Encerrar | `StopCircle` | `show: row.status === 'Ativa'` (campo bruto, não calculado); `variant: 'danger'` | abre `ConfirmationModal` de encerramento |
| Duplicar | `Copy` | sempre | `handleDuplicarAvaliacao` |

### Ação "Duplicar" — lógica completa (`handleDuplicarAvaliacao`)

1. **Nome da cópia** (`gerarNomeDuplicado`): sempre `` `${nomeOriginal} (${N})` ``, `N` começa em 2 e incrementa até não colidir com **nenhum** nome já existente em `avaliacoesData` (nunca tenta detectar/colapsar um sufixo `(N)` que o nome original já tivesse — sempre soma mais um).
2. **Copiado**: nome (com sufixo), `tipo`, `publicoLabel` (só se `origemJornadaId` presente — senão `''`), `descricao`, `habilidades` (array clonado), `origemJornadaId`.
3. **Não copiado**: `periodoInicio`/`periodoFim`/`prazoDias` (ficam todos vazios/undefined — `modoPrazo: 'indefinido'`, mesmo estado inicial de uma avaliação nova), `participantes` (sempre `[]`), `gerenciasComAutoInclusao` (sempre `undefined`).
4. Nova avaliação nasce sempre `status: 'Rascunho'`.
5. `adicionarAvaliacao(novaAvaliacao)`, `toast.success('Avaliação duplicada como rascunho: "{nome}"')`, e navega direto para `` `/avaliacoes/${id}/editar` `` — o Admin nunca fica só na listagem, cai direto na edição do rascunho novo para revisar/completar.

### Filtros/pills — ordem exata

`statusFilter.options`: **Todas** (`todas`) → **Ativas** (`ativa`) → **Rascunho** (`rascunho`) → **Agendadas** (`agendada`) → **Encerradas** (`encerrada`).

"Ativas" e "Agendadas" comparam o status **calculado** (`calcularStatusEfetivo`), nunca o campo bruto — senão uma avaliação agendada apareceria nos dois filtros ao mesmo tempo (uma vez que o campo bruto continua `'Ativa'` até a data de início chegar). "Rascunho"/"Encerrada" comparam o campo bruto direto (esses dois nunca são recalculados por `calcularStatusEfetivo` para outra coisa).

Busca (`buscaAvaliacao`): por `nome` OU `tipo`, case-insensitive `includes`.

---

## g. Detalhe da avaliação (`AvaliacaoDetalhePage.tsx`)

### Views por status

A escolha de view é pelo **campo bruto** `avaliacao.status`, não pelo status calculado:

```ts
avaliacao.status === 'Rascunho' ? <AvaliacaoRascunhoView /> : <AvaliacaoDetalheView />
```

Ou seja, só existem **2 variações visuais** (`AvaliacaoRascunhoView` e `AvaliacaoDetalheView`) — Ativa/Pendente/Encerrada/Expirada compartilham a mesma `AvaliacaoDetalheView`, diferenciadas apenas pelo badge de status (`getStatusAvaliacaoLabel(calcularStatusEfetivo(...))`) e pelas cores do card "Conclusão".

### SummaryCards — 4 cards, iguais nas duas views

1. "Total de participantes" (ícone `Users`, brand)
2. "Responderam" (ícone `CheckCircle`, verde)
3. "Pendentes" (ícone `Clock`, amarelo)
4. "Conclusão" (ícone `TrendingUp`, brand) — valor `"{percentual}%"`.

Em `AvaliacaoRascunhoView`: `participantes` é sempre `[]` (a seleção do wizard não persiste até a ativação), então Total/Responderam/Pendentes/Conclusão são sempre `0/0/0/0%`, com `highlight="text-red-700"` fixo no card de Conclusão (nunca calculado, porque é sempre 0). Em `AvaliacaoDetalheView`, o `highlight` do card de Conclusão é dinâmico: `>= 80%` verde, `>= 50%` amarelo, senão vermelho.

### `LinhaMeta` e regra de composição

```tsx
<LinhaMeta partes={[...getPrazoPartes(avaliacao, agendada?), getMetaOrigem(avaliacao)]} />
```

`agendada` só é passado em `AvaliacaoDetalheView` (`statusEfetivo === 'Pendente'`) — nunca em `AvaliacaoRascunhoView` (Rascunho nunca tem status calculado `'Pendente'`, `calcularStatusEfetivo` devolve `'Rascunho'` direto sem checar `periodoInicio`, mesmo que a Data de Início já esteja preenchida no wizard).

`getMetaOrigem(avaliacao)` (função local desta página): cruza `origemJornadaId` → `jornadasData`/`carreirasData` (FK real, nunca `Jornada.carreira` denormalizado) e retorna `` `Carreira: {carreira} · Jornada: {jornada}` `` quando resolve. Se não resolver (FK órfã ou caminho público): retorna `avaliacao.publicoLabel` **somente se** ele começar com `"Jornada:"`; caso contrário retorna `null` (é filtrado por `LinhaMeta`, que já descarta partes falsy). Ou seja: **no caminho "Por Público-alvo", `getMetaOrigem` nunca adiciona nada à LinhaMeta** — a linha mostra só as partes de prazo.

### Abas de conteúdo — as duas views têm, com defaults diferentes

Tanto `AvaliacaoRascunhoView` quanto `AvaliacaoDetalheView` renderizam, no lugar de uma tabela única, **uma barra de abas** ("Tabs de conteúdo" de `03-navegacao.md`: `border-b border-gray-200 mb-6`; item ativo `border-b-2 border-[var(--brand-600)] text-[var(--brand-600)]`, inativo `border-b-2 border-transparent text-gray-600 hover:text-gray-900`; cada botão `px-4 py-3 text-sm font-medium whitespace-nowrap`) com duas abas: **"Habilidades"** e **"Colaboradores"**.

| | `AvaliacaoRascunhoView` | `AvaliacaoDetalheView` (Ativa / Agendada / Encerrada / Expirada) |
|---|---|---|
| `abaAtiva` default | **`'habilidades'`** | **`'colaboradores'`** (sempre há participantes reais; abrir na tabela deles preserva o que já se via) |
| Paginação | `currentPageHabilidades` e `currentPageParticipantes` — **estados separados**, nunca compartilhados | idem |
| `avaliacao.participantes` | sempre `[]` (a seleção do wizard não persiste até a ativação) | lista real |

**Aba Habilidades** (idêntica nas duas views): container `bg-white rounded-lg border border-gray-200 overflow-hidden`; `Table` com colunas **Nome** (`font-medium text-gray-900`) e **Competência** (`text-gray-600`), **sem ordenação**, 10 itens/página. `competencia` lida direto de `habilidadesData` (denormalizada, mesmo padrão da listagem oficial). Fonte: `avaliacao.habilidades ?? []` → `habilidadesData.find`.
Empty state (`EmptyState`, ícone `ListChecks w-8 h-8`), título **"Nenhuma habilidade selecionada"** nas duas; descrição:
- Rascunho: **"Esta avaliação ainda está em rascunho e não tem habilidades definidas. Edite o rascunho para escolher as habilidades na etapa Habilidades."**
- Materializada: **"Esta avaliação não tem habilidades vinculadas."**

**Aba Colaboradores**:
- Rascunho: colunas **Nome** e **Cargo** apenas (sem Gerência/Status — seria "Não iniciada" para todo mundo), ordenáveis por Nome/Cargo, sem `actions`. Empty state (ícone `Users w-8 h-8`): título **"Nenhum colaborador selecionado"**, descrição **"Esta avaliação ainda está em rascunho e não tem participantes definidos. Edite o rascunho para escolher o público-alvo na etapa Colaboradores."**
- Materializada: é a tabela de participantes descrita abaixo (com a ação Eye).

### Banner de prévia (só `AvaliacaoRascunhoView`)

Banner amarelo fixo acima dos cards (`flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-6`, ícone `Eye w-4 h-4 text-yellow-600 mt-0.5`): **"Prévia:"** (em `font-semibold`) seguido de **" esta avaliação ainda não foi ativada. Você está visualizando como ela será apresentada aos colaboradores."**

### Botão "Visualizar questionário" (só `AvaliacaoDetalheView`, ou seja Ativa / Agendada / Encerrada / Expirada)

No header, à direita do bloco H1/badge/`LinhaMeta` (o wrapper do header vira `flex items-start justify-between gap-4`):

```
inline-flex items-center gap-2 px-4 py-2
border border-[var(--brand-600)] text-[var(--brand-600)] text-sm font-medium
rounded-lg hover:bg-[var(--brand-50)] transition-colors flex-shrink-0
ícone: Eye w-4 h-4   ·   texto: "Visualizar questionário"
```

`onClick` → `setPreviewAberto(true)`, que monta `QuestionarioPreview` (`src/app/components/avaliacoes/QuestionarioPreview.tsx`, o **mesmo componente** usado pela etapa Revisão do wizard). Props:

| Prop | Valor em `AvaliacaoDetalheView` | Valor na etapa Revisão do wizard |
|---|---|---|
| `nome` | `avaliacao.nome` | `formData.nome` (`|| 'Nova Avaliação'` no preview) |
| `tipo` | `"Autoavaliação"` (literal fixo) | `"Autoavaliação"` |
| `habilidadesIds` | `avaliacao.habilidades ?? []` | `formData.habilidades` |
| `prazoLabel` | data-limite formatada (ver abaixo) | data-limite **simulada** |
| `prazoSimulado` | **nunca passado** (`undefined`) → sem ícone de "simulação" | `true` quando o prazo foi calculado com data de entrada hipotética (`HOJE_ISO`), por não haver Data de Início nem colaborador real ainda |
| `onClose` | `() => setPreviewAberto(false)` | fecha o overlay, não perde nada do formulário |

**Cálculo de `prazoLabel` na tela de detalhe** (difere do wizard):
```ts
const prazoQuestionarioParticipante = calcularPrazoParticipante(avaliacao, {
  dataEntrada: avaliacao.periodoInicio,   // base real: quem entra no lançamento tem dataEntrada = periodoInicio
});
const prazoQuestionarioLabel = prazoQuestionarioParticipante != null
  ? formatData(prazoQuestionarioParticipante)   // "DD/MM/AAAA"
  : 'Sem prazo definido';                        // modoPrazo 'indefinido'
```
Usa `calcularPrazoParticipante` + `formatData` (ambos `utils/avaliacoes.tsx`) — a **data-limite única** que o preview espera como string, nunca `getPrazoPartes` (que devolve `ReactNode[]`, a linha "Inicia em / Termina em" do Admin). Como a avaliação já existe e tem `periodoInicio` real, `prazoSimulado` **não** é passado; o wizard passa `true` porque simula a data com `dataEntrada = HOJE_ISO`, e aí o preview mostra um ícone `Info` com tooltip: "Simulação considerando que o colaborador entraria hoje. A data real vai variar conforme a data de entrada de cada participante."

`QuestionarioPreview` é um **overlay fullscreen** (`fixed inset-0 z-[300] bg-gray-50 flex flex-col`), com barra de aviso amarela fixa no topo (**"Modo de visualização. Nenhuma resposta será salva."**, ícone `Eye`, botão **"Fechar"** com ícone `X`; `Esc` também fecha), passo `'instrucoes'` (card `max-w-xl bg-white border border-gray-200 rounded-lg`, badge do tipo, título, `{N} habilidades`, `Prazo de resposta: {prazoLabel}`, texto **"Como funciona a autoavaliação:"** + lista ordenada de 4 itens, botões **"Começar"** / **"Fechar"**) e passo `'perguntas'` (uma habilidade por vez via `NiveisHabilidadeCards` em modo leitura — sem `onSelecionar`, sem seleção — + `PainelLateralCompetencias` sem `restringirOrdem`, toda habilidade acessível). **Nunca escreve no `AvaliacoesContext`.** Os 4 itens da lista de instruções (copy literal):
1. "Para cada habilidade, o colaborador escolhe a descrição que melhor representa seu conhecimento atual."
2. "Não conhece a habilidade? O colaborador marca \"Sem conhecimento\" em vez de chutar uma resposta."
3. "A resposta é comparada ao nível esperado do cargo atual e ajuda a identificar oportunidades de desenvolvimento. Não garante promoção."
4. "O colaborador pode sair a qualquer momento. As respostas ficam salvas."

### Tabela de participantes (`AvaliacaoDetalheView`, aba Colaboradores)

Colunas: Nome, Cargo, Gerência (as três ordenáveis), Status (badge, não ordenável).

**Exceção documentada** à regra geral do sistema ("nunca desabilitar ação de linha, sempre esconder via `show`"): a ação **Eye** ("Visualizar respostas") fica **visível porém desabilitada** quando `participante.status !== 'Concluída'` (ver resultado de quem não respondeu não faz sentido, mas esconder o ícone silenciosamente confundiria o Admin, que vê `Eye` em toda tabela do sistema). Usa o mecanismo nativo `disabled` de `InlineAction` (`Table.tsx`), com `label` como função — vira o `title` (tooltip) do botão:
- Habilitado: `"Visualizar respostas"`.
- Desabilitado: `"Disponível após o participante responder"`.

`onClick` navega para `` `/avaliacoes/${avaliacao.id}/participantes/${colaboradorId}` `` → `ParticipanteResultadoPage.tsx`.

---

## h. Status e ciclo de vida

### `StatusAvaliacao` (5 valores, `schema.ts`)

`'Rascunho' | 'Ativa' | 'Encerrada' | 'Pendente' | 'Expirada'`

Apenas 3 são **gravados** por ação direta do Admin: `'Rascunho'` (criação/edição sem ativar), `'Ativa'` (ao ativar/publicar), `'Encerrada'` (ao encerrar manualmente). `'Pendente'` e `'Expirada'` **nunca** são gravados — são sempre produzidos por `calcularStatusEfetivo(avaliacao, hoje)`:

```
Encerrada (gravado)                         → Encerrada
Rascunho (gravado)                          → Rascunho
periodoInicio > hoje                        → Pendente
modoPrazo in (datas_fixas, datas_fixas_com_prazo)
  e periodoFim já passou                    → Expirada
senão                                        → Ativa
```

`'prazo_em_dias'` puro e `'indefinido'`: a avaliação como um todo **nunca** expira sozinha (só participantes individuais vencem, em `prazo_em_dias`; em `indefinido` ninguém vence).

**Toda tela deve usar `calcularStatusEfetivo`, nunca `avaliacao.status` bruto**, exceto a escolha de view em `AvaliacaoDetalhePage.tsx` (Rascunho vs. resto) e a condição `show` da ação "Encerrar" (`row.status === 'Ativa'`) — ambos comparam o campo bruto deliberadamente.

Label de exibição: `getStatusAvaliacaoLabel(status)` — o único valor que muda de palavra é `'Pendente'` → **"Agendada"** (o literal interno `'Pendente'` nunca muda).

### `StatusParticipacaoAvaliacao` (4 valores)

`'Não iniciada' | 'Em andamento' | 'Concluída' | 'Expirada'`. Mapeamento para o status da avaliação (Admin):

| Estado colaborador | Status Admin |
|---|---|
| Não iniciada / Em andamento | Ativa |
| Concluída | Encerrada (respondeu dentro do prazo) |
| Expirada | Encerrada (não respondeu, prazo encerrado) |

`'Expirada'` de um participante também pode ser calculada dinamicamente (nunca só lida do campo gravado) via `participanteVencido`/`estaVencida` — um "Não iniciada"/"Em andamento" cujo prazo individual já passou é tratado como Expirada em `MinhasAvaliacoes.tsx`, mesmo que o campo gravado ainda diga outra coisa.

---

## i. Fluxo do Colaborador

### `MinhasAvaliacoes.tsx`

3 cards de resumo ("Avaliações em aberto", "Próxima avaliação encerra em", "Avaliações concluídas") + grid de cards "Avaliações em aberto" (filtros Técnica/Comportamental e Urgente/Sem urgência, pills) + `ListingPage` "Histórico de avaliações" (Concluídas + Expiradas, com busca/filtro/paginação).

### `RespostaAvaliacaoPage.tsx` — 2 passos

1. **Instruções** (`passo === 'instrucoes'`): card único, sem revelar competências/habilidades antes de começar. Lista numerada de 4 regras (texto idêntico em `QuestionarioPreview.tsx`, com pequenas variações de pessoa gramatical: "você"/"o colaborador").
2. **Perguntas** (`passo === 'perguntas'`): uma habilidade por vez, painel lateral por competência (`PainelLateralCompetencias`, `restringirOrdem` trava navegação para além da próxima não respondida), opções via `NiveisHabilidadeCards` (nome do nível nunca exibido, só o critério, em ordem de peso crescente; "Sem conhecimento" sempre com nome visível). Cada seleção chama `responderAvaliacao(..., enviar: false)` imediatamente (persistência real).

Botão único do header: **"Salvar e sair"** (ou só **"Sair"** se nada respondido ainda) — reafirma o estado já persistido e sai, com `toast.success('Respostas salvas! Você pode continuar depois.')`.

Envio final (`handleEnviar`, só habilitado com 100% respondido): bloqueia com `toast.error('Por favor, avalie todas as habilidades antes de enviar.')` se incompleto; senão chama `responderAvaliacao(..., enviar: true)` e abre `ModalConclusaoAvaliacao` — **não há mais toast + redirect automático** para o envio final (só para "Salvar e sair", que é uma ação diferente).

### `ModalConclusaoAvaliacao`

Confirma: **2 botões**, sempre os dois — **"Finalizar"** (outline neutro, `onFinalizar` → navega para `/minhas-avaliacoes`) e **"Ver resultado"** (primário, `onVerResultado` → navega para `/minhas-avaliacoes/resultado/{id}`). Nunca fecha sozinho (sem `onClick` no overlay, ao contrário de `ModalResumoAvaliacao`) — substituiu um toast/redirect automático antigo (não sobrou nenhum resquício de código desse toast — busca confirmada, ver seção de limpeza).

### `ResultadoAvaliacaoPage.tsx` / `ResultadoAvaliacao.tsx`

3 cards de resumo (Habilidades avaliadas / No esperado ou acima / Abaixo do esperado, este com wrapper âmbar de ícone — exceção documentada de cards de métrica do Colaborador) + banner informativo + `Accordion` por competência, cada item com a régua de nível (`NivelRegua`) comparando resposta vs. nível esperado do cargo atual (via `joaoHabilidadesCargoMatriz`, nunca `habilidadesCargoData` genérico — este componente é específico do fluxo de João).

---

## j. Todos os modais

| Modal | Onde aparece | Quando | O que faz |
|---|---|---|---|
| `ConfirmationModal` (variant `warning`) | `FormularioAvaliacao.tsx` | Ao clicar "Publicar agora" (Início vazio/hoje) | Confirma publicação imediata; mensagem varia por `modoPrazo` (ver seção d) |
| `ModalResumoAvaliacao` | `CriarAvaliacaoPage.tsx` / `EditarAvaliacaoRascunhoPage.tsx` | Depois de Salvar rascunho / Ativar (qualquer resultado) | Resumo pós-conclusão do wizard, 1 botão "Voltar para Avaliações" |
| `ColaboradoresListaModal` (interno a `FormularioAvaliacao.tsx`, não exportado) | Etapa Identificação (link "Ver colaboradores", caminho jornada) e Etapa/Revisão (mesmo link, e por gerência no card "Colaboradores") | Sob demanda | Lista somente-leitura nome+cargo; 2 instâncias montadas (`modalColaboradoresAberto` e `gerenciaModalAberta`) |
| `QuestionarioPreview` | Etapa Revisão (botão "Visualizar questionário") | Sob demanda | Overlay fullscreen (`z-[300]`) simulando a experiência de resposta, nunca escreve no Context |
| `EditarAvaliacaoModal` | `ContentArea.tsx` (ação "Editar" de avaliação já materializada) | Ação "Editar" quando `participantes.length > 0` | Modal (não drawer, apesar do nome de estado `isDrawerOpen` — é `fixed ... items-center justify-center`, `w-[480px]`) só de prorrogação: Término e/ou Prazo (dias), campos independentes |
| `ConfirmationModal` (variant `warning`, título "Encerrar Avaliação") | `ContentArea.tsx` (ação "Encerrar") | Ação "Encerrar" | Confirma encerramento manual |
| `ModalConclusaoAvaliacao` | `RespostaAvaliacaoPage.tsx` | Envio final da autoavaliação | 2 botões — Finalizar / Ver resultado (ver seção i) |

**Nota sobre `EditarAvaliacaoModal`**: apesar do estado se chamar `isDrawerOpen`/`setIsDrawerOpen` em `ContentArea.tsx`, o componente renderizado é um **modal centralizado** (overlay + container `w-[480px]` centralizado), não segue a anatomia de "Drawers" (`w-full md:w-[35%]`) do design system. Isso é o comportamento real do código — não é um bug a corrigir nesta limpeza (fora de escopo), só um fato a documentar para quem for reconstruir.

---

## k. Componentes reaproveitados

Reconstrua equivalentes destes — nunca improvise um substituto com comportamento diferente:

- **`SearchableSelect`** (`src/app/components/ui/SearchableSelect.tsx`) — Select com busca embutida (Popover + Command/cmdk sobre a base visual do Radix Select). Props: `value`, `onValueChange`, `options: {value,label}[]`, `placeholder`, `searchPlaceholder`, `emptyMessage`, `disabled`, `className`. Único componente do sistema autorizado a fugir da regra "Dropdowns: Radix Select — nunca `<select>` nativo" para casos que precisam de filtro por texto.
- **`StatusBadge`** (`src/app/components/ui/StatusBadge.tsx`) — badge padrão ao lado de um H1 (`{label, colorClass}`), `inline-flex px-2 py-1 text-xs font-medium rounded-full`, sem dot. A cor nunca é decidida dentro do componente — sempre vem de uma função externa por entidade.
- **`LinhaMeta`** (`src/app/components/avaliacoes/LinhaMeta.tsx`) — subtítulo de página em texto corrido, partes separadas por `" · "` (caractere no fluxo do texto, nunca `<span>`/flex com gap). Props: `partes: ReactNode[]`, `className` (default `'text-sm text-gray-600'`). Partes falsy (`null`/`undefined`/`false`/`''`) são filtradas antes de juntar.
- **`getPrazoPartes`** (`src/app/utils/avaliacoes.tsx`) — ver assinatura completa e comportamento na seção d.
- **`calcularStatusEfetivo(avaliacao, hoje)`** — fonte única do status real de uma Avaliação (ver seção h). Nunca ler `avaliacao.status` bruto para exibir na tela.
- **`calcularPrazoParticipante(avaliacao, participante)`** — fonte única do prazo efetivo de UM participante (`Pick` dos campos de prazo — aceita objetos simulados, ex.: preview do wizard antes da avaliação existir). Retorna `undefined` em `'indefinido'`. Existem 3 wrappers null-safe que **sempre** devem ser usados em vez de checar `!= null` na mão: `participanteVencido`, `diasAteVencimentoParticipante`, `formatPrazoParticipante`.
- **`formatPeriodoAvaliacao(avaliacao)`** — texto único de período para exibição (Rascunho sem data → `"A definir"`; formata os 4 modos de prazo).

---

## l. Regra permanente de texto

**Nunca usar travessão (—) em nenhum texto de interface.** Usar vírgula, ponto, ou reformular a frase.

---

## m. Pendências conhecidas (auditadas no código atual — 2026-08-27)

Limitações/decisões conscientes que o dev deve conhecer antes de reconstruir com backend real:

1. **`gerenciasComAutoInclusao` é decorativo.** O toggle "Incluir automaticamente novos colaboradores desta gerência" (etapa Colaboradores) grava o nome da gerência no campo, mas **nenhum mecanismo do sistema reage a ele** — não há fluxo de criar/editar colaborador que dispare inclusão automática. Registra intenção; o efeito real depende de integração futura com o RM. Comentário idêntico em `schema.ts` e `SeletorGerenciaGranular.tsx`.
2. **`EditarAvaliacaoModal` é um modal centralizado, não um drawer.** O estado que o controla se chama `isDrawerOpen`/`setIsDrawerOpen` em `ContentArea.tsx` (compartilhado com 3 seções que usam `FormDrawer` de verdade), mas o componente renderizado para Avaliações é `fixed ... items-center justify-center` com container `w-[480px]` — não segue a anatomia de "Drawers" (`w-full md:w-[35%]`) do design system. Comportamento real, não bug a corrigir aqui.
3. **`avaliacao.status` bruto vs. calculado.** Só 3 valores são gravados (`Rascunho`/`Ativa`/`Encerrada`). `Pendente` ("Agendada") e `Expirada` **nunca** são gravados — sempre derivados por `calcularStatusEfetivo`. Ao migrar para backend, a coluna de status persistida deve continuar guardando só os 3; o backend (ou o front) recalcula os outros 2 a partir de `periodoInicio`/`periodoFim`/`modoPrazo` × data atual. Exceções que leem o bruto de propósito: escolha de view em `AvaliacaoDetalhePage` (Rascunho vs. resto) e condição `show` da ação "Encerrar" (`row.status === 'Ativa'`).
4. **Ativação/expiração "automática" é só cálculo, não job.** Não há cron/worker: uma avaliação Agendada "vira" Ativa porque `calcularStatusEfetivo` passa a devolver `Ativa` quando a data chega, no próximo render. Idem expiração. Com backend real, decidir se isso vira job agendado ou continua cálculo em leitura.
5. **`HOJE_SIMULADO` / `HOJE_ISO`.** Toda a lógica de datas compara contra uma data simulada fixa exportada de `mockData.ts`, não contra `new Date()` real. Trocar por data do servidor na reconstrução.
6. **Imutabilidade de avaliação Ativa.** Uma avaliação materializada (`participantes.length > 0`) só pode ser editada via `EditarAvaliacaoModal` (prorrogação: Término e/ou Prazo em dias). Nome, descrição, habilidades, público — nada disso é editável depois de ativada. A página de edição completa (`/avaliacoes/:id/editar` → wizard) só é alcançável para Rascunho sem participantes.
7. **Persistência é `localStorage`.** `AvaliacoesContext` (chave `carreiras_avaliacoes`, versão `MOCK_DATA_VERSION`). Bump da versão descarta o que estiver salvo no navegador. Sem sincronização entre abas/dispositivos.

---

## Pontos revisados (antes marcados "PRECISA CONFIRMAR COM ALICE")

1. **Seção d (Modelo de prazo)** — resolvido. Eram 8 combinações desde sempre (3 campos binários = 2³ = 8); nunca existiu um 9º caso, faltando ou não. O comentário de `montarCamposPrazo` (`FormularioAvaliacao.tsx`, linha 50) tinha só um erro de contagem na frase ("os 9 casos abaixo"), já corrigido para "os 8 casos abaixo". A tabela da seção d e a implementação sempre estiveram corretas e batendo uma com a outra.
2. **`utils/avaliacoes.tsx`, comentário de `formatPeriodoAvaliacao`** — resolvido. O comentário dizia "os 3 modos de prazo (datas_fixas / prazo_em_dias / indefinido)", desatualizado porque faltava `datas_fixas_com_prazo` na lista. Corrigido para "os 4 modos de prazo (indefinido / datas_fixas / prazo_em_dias / datas_fixas_com_prazo)" — a implementação da função já tratava os 4 corretamente, era só o comentário que estava incompleto.
3. **Estado de abertura do modal de prorrogação** — resolvido, com uma correção de local: o estado não vive em `EditarAvaliacaoModal.tsx` (que só recebe a prop `isOpen`, já com nome neutro e correto). Ele vive em `ContentArea.tsx` e é **compartilhado por 4 seções diferentes** do Admin (Competências, Habilidades e Carreiras, que usam `FormDrawer` de verdade, e Avaliações, que usa `EditarAvaliacaoModal`). Por ser genuinamente compartilhado entre drawers reais e um modal centralizado, o nome `isDrawerOpen`/`setIsDrawerOpen` foi mantido — ele já é genérico o bastante para cobrir os 4 casos (nenhum deles é "Editar Prazo" especificamente), e um rename para algo como `isModalOpen` seria incorreto para as 3 seções que usam drawer de verdade. Nenhuma mudança de código foi feita aqui.
4. **`gerenciasComAutoInclusao`** — não é mais tratado como pendência. É comportamento definido: o toggle "Incluir automaticamente novos colaboradores desta gerência" (Etapa Colaboradores) grava só a intenção no campo (`Avaliacao.gerenciasComAutoInclusao`); nenhum mecanismo do sistema reage a ele hoje, e isso é proposital, não uma lacuna a preencher. Ver detalhe na seção c.
