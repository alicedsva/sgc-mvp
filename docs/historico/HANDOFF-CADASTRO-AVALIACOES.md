# Handoff — Cadastro de Avaliação (wizard de 5 ou 6 etapas, conforme o caminho)

> **Atualização (2026-08-24):** o caminho "Por Jornada" continua com 5 etapas, sem alteração. O caminho "Por Público-alvo" ganhou uma 6ª etapa própria ("Colaboradores") e deixou de exigir seleção de participantes para avançar — ver seção "b. Estrutura das etapas" (reescrita) e "g. Validações" (atualizada). Também foi adicionado um select de Carreira (filtra Jornada) na Etapa Identificação do caminho "Por Jornada", e a checagem de duplicidade do caminho "Por Público-alvo" passou a comparar participantes reais em vez do texto exibido. Nenhuma mudança no caminho "Por Jornada" além do select de Carreira.
>
> **Atualização 2 (2026-08-24, mesmo dia):** o campo "Prazo (dias)" da Etapa Prazo virou **"Prazo de resposta (em dias)"** (label e todos os textos de apoio da etapa) — ver seção "Etapa 4 — Prazo" e "d. Card de dica". O aviso de conflito Término/Prazo de resposta foi reescrito em linguagem mais direta (e passou a incluir o N de dias configurado) — ver "Etapa 4 — Prazo". O card "Público-alvo" da Etapa Revisão agora mostra Carreira+Jornada em linhas separadas no caminho "Por Jornada" (antes era uma linha única "Jornada: {nome}"), e o link "Ver colaboradores" passou a existir nos **dois** caminhos (antes só existia dentro da Etapa Identificação, caminho Jornada) — ver "Etapa 5 — Revisão" e "f. Modais". O modal antes chamado `ColaboradoresJornadaModal` foi generalizado e renomeado para `ColaboradoresListaModal`, para atender os dois caminhos com o mesmo componente. Nova função compartilhada `getCarreiraEJornadaNomes` em `utils/avaliacoes.ts` (cruza `jornadaId` → `carreiraId` → nomes), reaproveitada também pelo header de `AvaliacaoDetalhePage.tsx` (fora do escopo deste wizard, ver nota no fim da seção "i").

> **⚠️ AVISO — leia antes de implementar**
>
> Este fluxo já foi implementado antes de forma diferente da especificação abaixo. A versão anterior usava um **seletor de 3 modos de prazo** (Período fixo / Início agendado / Ativação manual) — isso foi **REMOVIDO** e substituído pelo modelo de campos livres descrito na seção "Regras de negócio do prazo". **Não reintroduza o seletor de modos.** Sempre siga a especificação atual deste documento, mesmo que ela pareça menos comum ou mais simples do que a implementação anterior.
>
> A versão anterior também teve o stepper reconstruído várias vezes (solto acima do container → dentro do container; formato "progress bar com label" → círculos numerados) e o card de dica reestruturado várias vezes (ícone Lightbulb com wrapper colorido → emoji solto; bolinha numerada → número como prefixo de texto). As seções "Stepper" e "Card de dica" abaixo descrevem o estado FINAL e definitivo — não é um meio-termo entre versões.

Documento escrito lendo diretamente o código em:
- `src/app/components/avaliacoes/FormularioAvaliacao.tsx` (componente principal, ~1350 linhas)
- `src/app/pages/CriarAvaliacaoPage.tsx`
- `src/app/pages/EditarAvaliacaoRascunhoPage.tsx`
- `src/app/components/avaliacoes/ModalResumoAvaliacao.tsx`
- `src/app/components/templates/HabilidadesMasterDetail.tsx`
- `src/app/components/templates/SeletorGerenciaGranular.tsx`
- `src/app/components/ui/SearchableSelect.tsx`
- `src/app/components/templates/ConfirmationModal.tsx`
- `src/app/utils/avaliacoes.ts`
- `src/data/schema.ts`

---

## a. Visão geral

O Cadastro de Avaliação é o wizard (5 etapas no caminho "Por Jornada", 6 no caminho "Por Público-alvo" — ver seção b) usado para **criar uma nova Avaliação** ou **editar um Rascunho existente** (uma Avaliação com `status: 'Rascunho'` e nenhum participante ainda). É uma tela exclusiva de **Admin/RH** — nunca acessada por Colaborador.

O wizard em si é um único componente, `FormularioAvaliacao.tsx`, reaproveitado por dois pontos de entrada (duas rotas/páginas distintas):

| Página | Rota | Quando é usada |
|---|---|---|
| `CriarAvaliacaoPage.tsx` | `/avaliacoes/nova` | Criação do zero. Pode chegar com uma jornada pré-selecionada (`jornadaPreSelecionada`, via `location.state`), vinda do botão "Criar avaliação para esta matriz" em `JornadaDetalhePage.tsx`. |
| `EditarAvaliacaoRascunhoPage.tsx` | `/avaliacoes/:id/editar` | Edição de um Rascunho já existente (`avaliacaoExistente`). Só acessível se `avaliacao.participantes.length === 0` — se a avaliação já tem participantes (foi materializada), a página redireciona de volta para `/avaliacoes` com um toast de erro; prorrogação de prazo de avaliação já materializada é outra tela (`EditarAvaliacaoModal.tsx`), fora do escopo deste documento. |

Cada página só é responsável por: buscar os dados de contexto (`habilidades`, `avaliações existentes`), implementar os dois handlers de conclusão (`onSalvarRascunho`, `onAtivar` — que montam o objeto `Avaliacao` final e gravam no Context), e renderizar o `ModalResumoAvaliacao` quando o wizard termina. Toda a lógica de estado do formulário, validação, navegação entre etapas e UI vive dentro de `FormularioAvaliacao.tsx`.

O componente é 100% controlado por estado local (`useState<NovaAvaliacaoFormData>`), sem persistência intermediária — só grava de fato quando o Admin clica "Salvar rascunho" ou no botão final de ativação.

---

## b. Estrutura das etapas

A quantidade e a ordem das etapas dependem do caminho escolhido na Etapa 1 (`formData.caminho`). Isso é o que mudou nesta rodada — antes as duas variantes tinham sempre 5 etapas e a mesma ordem.

**Caminho "Por Jornada" — 5 etapas, sem alteração** (participantes vêm da matriz da jornada, não há etapa própria de seleção de colaboradores):

| # | key | Label do stepper |
|---|---|---|
| 1 | `publico` | Público |
| 2 | `identificacao` | Identificação |
| 3 | `habilidades` | Habilidades |
| 4 | `prazo` | Prazo |
| 5 | `revisao` | Revisão |

**Caminho "Por Público-alvo" — 6 etapas.** A etapa "Colaboradores" (seleção granular de gerência/colaboradores) foi **reposicionada**: antes era a primeira coisa depois de escolher o caminho (ficava dentro da própria Identificação); agora é sua própria etapa, e fica **entre Prazo e Revisão** — quase no fim do wizard, não mais logo no início:

| # | key | Label do stepper |
|---|---|---|
| 1 | `publico` | Público |
| 2 | `identificacao` | Identificação |
| 3 | `habilidades` | Habilidades |
| 4 | `prazo` | Prazo |
| 5 | `colaboradores` | Colaboradores |
| 6 | `revisao` | Revisão |

**Motivação da mudança (decisão de produto — Alice, 2026-08-24):** o Admin pode montar toda a avaliação (nome, habilidades, prazo) e só decidir o público por último — inclusive deixando para depois. Um rascunho sem nenhum participante passou a ser permitido (ver próxima seção); só a ativação exige participantes.

**Regra importante, sem alteração:** em modo de **edição** de Rascunho, a etapa "Público" **não existe** — o caminho já foi escolhido na criação e não pode ser trocado depois. A lista de etapas em modo edição é a mesma lista de criação menos a etapa `publico` (4 etapas no caminho Jornada; 5 etapas no caminho Público-alvo, mantendo "Colaboradores" na mesma posição relativa — entre Prazo e Revisão).

### Etapa "Colaboradores" (só caminho "Por Público-alvo", nova posição)

- **H1:** "Quem vai participar desta avaliação?"
- **Apoio:** "Escolha por gerência, por colaboradores específicos, ou os dois"
- Conteúdo: só o componente `SeletorGerenciaGranular` (a mesma seleção granular de gerência/colaboradores que antes vivia dentro da Identificação) — sem nome nem descrição, que agora são exclusivos da etapa Identificação.
- Label "Público-alvo" e o contador de selecionados na mesma linha, contador à direita — mesmo formato de antes.
- **Não bloqueia mais o avanço** (ver "Colaboradores deixou de ser obrigatório" abaixo) — é aqui que a checagem de duplicidade nome+público do caminho "Por Público-alvo" roda agora (ver seção de Validações).

### Colaboradores deixou de ser obrigatório para avançar

Antes, o caminho "Por Público-alvo" exigia ao menos 1 colaborador/gerência selecionado para sair da (então) etapa de seleção. Essa validação foi **removida** — a navegação entre etapas nunca mais bloqueia por falta de participantes.

O que continua sendo obrigatório é ter ao menos 1 participante para **ativar/publicar** a avaliação:

- **Salvar Rascunho** funciona com 0 participantes selecionados — o rascunho é salvo normalmente, só com `participantesIds: []`.
- Na Etapa Revisão, se não houver nenhum colaborador selecionado (`semColaboradoresSelecionados`), aparece um aviso amarelo (`bg-yellow-50 border-yellow-200`, ícone `AlertTriangle`): "Sem colaboradores selecionados, esta avaliação só pode ser salva como rascunho: a publicação fica indisponível até você selecionar ao menos um participante na etapa Colaboradores."
- O botão final de ativação ("Publicar agora" / "Agendar avaliação") fica **desabilitado** (`opacity-50 cursor-not-allowed`, atributo `disabled`) enquanto `semColaboradoresSelecionados` for verdadeiro — só nesse caso; nas demais etapas o botão "Continuar" nunca é afetado por essa condição.
- Essa regra só existe no caminho "Por Público-alvo" — no caminho "Por Jornada" os participantes vêm sempre da matriz da jornada (nunca zero, a menos que a própria jornada não tenha colaboradores vinculados, o que não é tratado como um caso especial aqui).

> A numeração `Etapa 1`...`Etapa 5` abaixo segue a ordem do caminho **"Por Jornada"** (a que não mudou). No caminho **"Por Público-alvo"**, a partir de Habilidades os números do stepper são +1 (Habilidades = 3, Prazo = 4), a etapa Colaboradores documentada acima entra como a 5ª, e Revisão vira a 6ª — sem mudança de conteúdo em Habilidades/Prazo/Revisão, só de posição no stepper.

### Etapa 1 — Público (só em criação)

- **H1:** "Como você quer definir o público desta avaliação?"
- **Texto de apoio:** nenhum.
- **Decisão da etapa:** dois cards clicáveis, lado a lado (grid de 2 colunas), definindo `formData.caminho`:
  - **"Por Jornada de Carreira"** (ícone `GitBranch`) — "Habilidades e participantes vêm da matriz da jornada escolhida."
  - **"Por Público-alvo"** (ícone `Users`) — "Escolha gerências, colaboradores e habilidades livremente."
- Card selecionado: `border-[var(--brand-600)] bg-[var(--brand-50)]` e ícone `text-[var(--brand-600)]`. Não selecionado: `border-gray-200 hover:bg-gray-50` e ícone `text-gray-400`.
- Validação para avançar: `formData.caminho` não pode ser `null` (toast: "Escolha como definir o público desta avaliação").

### Etapa 2 — Identificação

O conteúdo muda inteiramente conforme `formData.caminho`:

**Caminho "Por Jornada":**
- **H1:** "Qual jornada de carreira será avaliada?"
- **Apoio:** "As habilidades avaliadas virão da matriz dessa jornada"
- Em **criação**: **campo novo — Carreira**, acima do select de Jornada, obrigatório (`<span className="text-red-500">*</span>`). Não é campo do schema/`Avaliacao` — é só um recorte de UI para reduzir a lista de jornadas (a jornada continua sendo o dado real gravado, via `jornadaId`). Selecionar uma Carreira filtra o select de Jornada para mostrar só as jornadas dessa carreira (`jornadasFiltradasPorCarreira`, `carreirasAtivas` = carreiras com `status === 'Ativa'`); o select de Jornada fica **desabilitado** até uma Carreira ser escolhida (placeholder "Selecione uma carreira primeiro"). Trocar a Carreira reseta a Jornada e tudo que dependia dela (habilidades, participantes, `publicoLabelCalculado`) — uma jornada de outra carreira nunca é uma opção válida. Se a página já chega com uma jornada pré-selecionada (botão "Criar avaliação para esta matriz"), o campo Carreira já nasce pré-carregado com a carreira dessa jornada.
- Os dois selects (Carreira e Jornada) usam o componente novo **`SearchableSelect`** (`src/app/components/ui/SearchableSelect.tsx`) — um select com busca embutida (campo de texto que filtra as opções em tempo real), no lugar do `Select` Radix simples usado antes. Mesmo componente nos dois campos; cada um recebe seu próprio `options`, `placeholder` e `searchPlaceholder` ("Buscar carreira..." / "Buscar jornada..."), além de `emptyMessage` para quando a busca não encontra nada.
- Ao selecionar uma jornada (`handleSelecionarJornada`):
  - `formData.habilidades` é populado com **todas** as habilidades agregadas de todos os cargos da jornada (`getHabilidadesAgregadasDaJornada`, via `useCarreiras()`).
  - `formData.participantesIds` é populado com todos os colaboradores vinculados à jornada (`getColaboradoresPorJornada`).
  - `formData.publicoLabelCalculado` vira `"Jornada: {nome da jornada}"`.
  - Essa mesma população roda automaticamente no `mount` do componente se a página já chegou com `jornadaPreSelecionada` (o `Select` não dispara `onValueChange` quando o valor já nasce setado, então isso precisa de um `useEffect` explícito — sem ele a etapa mostraria "0 habilidades · 0 participantes" mesmo com a jornada certa selecionada).
  - Abaixo do Select, texto: `"{N} habilidade(s) pré-marcada(s) da matriz · {N} participante(s)"`, seguido de `" · "` e um botão-link "Ver colaboradores" (só aparece se `participantesIds.length > 0`) que abre um modal somente-leitura (`ColaboradoresListaModal`, definido dentro do próprio arquivo — ver seção "f. Modais") listando nome + cargo de cada participante.
- Em **edição**: a jornada não é mais selecionável (o vínculo é fixo) — mostra um bloco somente-leitura (`bg-gray-50` com borda) com o nome da jornada e o texto "Vínculo fixo, não pode ser trocado", mais o contador de participantes recalculado **ao vivo** (nunca a lista congelada de quando a avaliação foi criada — mesmo princípio de `getColaboradoresPorJornada` usado no resto do sistema).

**Caminho "Por Público-alvo":**
- **H1:** "Como esta avaliação vai se chamar?"
- **Apoio:** "Dê um nome e, se quiser, uma descrição para o objetivo desta avaliação"
- **A seleção de gerência/colaboradores não acontece mais aqui** — ela virou a etapa própria "Colaboradores", mais adiante no wizard (entre Prazo e Revisão, ver seção b acima). Esta etapa, neste caminho, só tem os dois campos comuns abaixo.

**Campos comuns às duas variantes (sempre visíveis, abaixo do bloco específico de cada caminho):**
- **Nome da Avaliação** (obrigatório, `<input type="text">`, placeholder "Ex: Avaliação de Competências Técnicas Q1 2026"). No caminho "Por Jornada", mostra a mensagem de duplicidade em tempo real (ver seção Validações) logo abaixo, se aplicável — no caminho "Por Público-alvo" esse aviso **não aparece mais aqui**, porque a duplicidade desse caminho só pode ser calculada depois que os participantes forem escolhidos, na etapa Colaboradores (ver Validações).
- **Descrição** (opcional, `<textarea rows={3}>`, placeholder "Descreva o objetivo da avaliação").

Validação para avançar: nome preenchido; se caminho `jornada`, uma Carreira e uma Jornada selecionadas. **Se caminho `publico`, não há mais validação de colaborador/gerência nesta etapa** — colaboradores deixou de ser obrigatório (ver seção b).

### Etapa 3 — Habilidades

- **H1:** "Quais habilidades serão avaliadas?"
- **Apoio:** só aparece no caminho "Por Público-alvo" — "Escolha livremente as habilidades que farão parte desta avaliação". No caminho "Por Jornada", sem apoio.
- Label "Habilidades" e o contador de selecionadas na mesma linha (`{N} selecionada` / `{N} selecionadas`).
- Componente `HabilidadesMasterDetail` (busca + segmented control Todas/Técnica/Comportamental + duas colunas: competências à esquerda com contador `marcadas/total` por competência, habilidades da competência ativa à direita com checkbox). Só considera habilidades com `status === 'Ativa'` (ou sem `status` definido).
- **A área do master-detail ocupa a altura disponível do container, responsivamente** (`flex-1 min-h-0`, não altura fixa) — o wrapper da etapa é `flex-1 min-h-0 flex flex-col`, com a linha do label fixa (`flex-shrink-0`) e o `HabilidadesMasterDetail` recebendo `className="flex-1 min-h-0"` em vez de uma altura fixa em `rem`/`px`. O scroll interno de cada coluna (competências / habilidades) continua isolado — não é a página inteira que rola.
- No caminho "Por Jornada", as habilidades da matriz da jornada aparecem sempre no **topo** de cada lista de competência (prop `prioridade`, um `Set` das habilidades agregadas da jornada — ordem fixa pela origem do dado, não reordena a cada clique).

Sem validação bloqueante nesta etapa (pode avançar com 0 habilidades selecionadas).

### Etapa 4 — Prazo

- **H1:** "Qual será o prazo desta avaliação?"
- **Apoio:** "Escolha o modelo que melhor se encaixa no seu processo"
- Três campos livres, **todos opcionais e independentes entre si**, lado a lado (grid de 3 colunas):
  - **Data de Início** (`type="date"`)
  - **Data de Término** (`type="date"`)
  - **Prazo de resposta (em dias)** (`type="number"`, `min={1}` — label renomeado nesta rodada, era "Prazo (dias)")
- Término e Prazo de resposta **podem coexistir** (regra de negócio final, ver seção "Regras de negócio do prazo" — substitui a versão anterior, que os tratava como mutuamente exclusivos e desabilitava um campo ao preencher o outro).
- Se **Data de Início** estiver vazia, um texto de aviso aparece abaixo dos campos: "Sem Data de Início, a avaliação fica salva como rascunho — invisível para os colaboradores até você publicá-la."
- **Aviso de conflito Término/Prazo de resposta** (`bg-[var(--brand-50)] border-[var(--brand-100)]`, ícone `Info`) — aparece quando os 3 campos estão preenchidos e a Data de Término calculada chega antes do que o Prazo de resposta resultaria a partir da Data de Início (`prazoTerminoCortaAntesDoPrazoDias`). Não bloqueia o avanço, só avisa que o Prazo de resposta configurado nunca chega a valer de fato (o Término sempre corta antes). **Texto reescrito nesta rodada** — antes: *"A Data de Término é anterior ao que o Prazo de resposta resultaria a partir da Data de Início. Nesse caso o Término sempre corta a avaliação primeiro. O Prazo de resposta configurado não chega a valer para nenhum participante."* Agora: *"A Data de Término chega antes do Prazo de resposta terminar. Como o Término sempre prevalece, nenhum participante terá os {N} dias completos de prazo."* — com `{N}` preenchido com o valor real de `formData.prazoDias` (pluralizado: "1 dia completo" / "N dias completos").

Validação para avançar (`etapa === 'prazo'`, roda também antes de ativar):
- Início no passado (`< HOJE`) → bloqueado ("A Data de Início não pode ser no passado").
- Término antes da referência de início (Início preenchido, ou hoje se Início vazio) → bloqueado ("A Data de Término não pode ser antes da Data de Início").
- Dias preenchido e `<= 0` → bloqueado ("Informe um prazo em dias válido").
- **Não há mais bloqueio de Término + Dias preenchidos juntos** — essa combinação é válida (ver tabela de 9 combinações abaixo).

### Etapa 5 — Revisão

- **H1:** "Está tudo certo antes de ativar?"
- **Apoio:** "Confira os detalhes e visualize o questionário antes de publicar"
- Nesta etapa (e só nela), o cabeçalho ganha um botão extra na mesma linha do H1: **"Visualizar questionário"** (ícone `Eye`, estilo botão secundário/outline), que abre um overlay fullscreen (`QuestionarioPreview.tsx`) simulando exatamente como o colaborador veria a autoavaliação (tela de Instruções → navegação por habilidade com os mesmos componentes do fluxo real de resposta, `NiveisHabilidadeCards`/`PainelLateralCompetencias`) — **nunca escreve no Context**, é só uma prévia; fechar não perde nada do formulário.
- Conteúdo: três blocos `bg-gray-50 rounded-lg p-4`:
  1. **Identificação** — Nome, Descrição (se houver), Tipo ("Autoavaliação", fixo).
  2. **Público e habilidades** — bloco "Público-alvo" **reescrito nesta rodada**:
     - Caminho **Jornada**: se `carreiraEJornada` resolve (via `getCarreiraEJornadaNomes`, mesma função compartilhada com `AvaliacaoDetalhePage.tsx`), duas linhas — "Carreira: {nome}" e "Jornada: {nome}" — no lugar da antiga linha única `publicoLabelCalculado` ("Jornada: {nome}"). Se a função não resolver (FK órfã), cai de volta em `publicoLabelCalculado`.
     - Caminho **Público-alvo**: continua mostrando `publicoLabelCalculado` (label granular de gerência/colaboradores), sem alteração.
     - Nos **dois** caminhos: logo abaixo, `"{N} participante(s)"` seguido de `" · "` e o link **"Ver colaboradores"** (só quando há ao menos 1 participante) — **novo nos dois caminhos** (antes só existia dentro da Etapa Identificação, e só no caminho Jornada). Abre o mesmo `ColaboradoresListaModal` (ver "f. Modais"), populado com `colaboradoresDaJornadaModal` (caminho Jornada) ou `colaboradoresSelecionadosModal` (caminho Público-alvo, novo memo — resolve nome/cargo direto de `formData.colaboradoresSelecionados`, sem depender de `jornadaId`).
     - Depois disso, contador de habilidades selecionadas + badges de cada habilidade (cor por tipo: técnica = `bg-[var(--brand-100)] text-[var(--brand-800)]`, comportamental = `bg-purple-100 text-purple-800`) — sem alteração.
  3. **Prazo** — texto único vindo de `formatPeriodoAvaliacao` (ver seção de regras do prazo), calculado em modo "preview como se fosse ativado hoje" (`montarCamposPrazo(formData, HOJE_ISO)`). **Nota:** este texto único é diferente do formato de 3 partes condicionais com tooltip que `AvaliacaoDetalhePage.tsx` usa para avaliações já reais — não foi unificado nesta rodada, ver `docs/AVALIACOES-INFO-CARDS-MODAIS-ALERTAS.md` ("Divergências encontradas").
- Se duplicidade de nome+público for detectada (ver Validações), aparece um aviso amarelo (`bg-yellow-50 border-yellow-200`, ícone `AlertTriangle`) reafirmando a mensagem, mesmo que o Admin já tenha visto o aviso na etapa onde ela é calculada (Identificação no caminho Jornada; Colaboradores no caminho Público-alvo — ver Validações).
- Se o caminho for "Por Público-alvo" e nenhum colaborador tiver sido selecionado (`semColaboradoresSelecionados`), aparece um segundo aviso amarelo, independente do de duplicidade: "Sem colaboradores selecionados, esta avaliação só pode ser salva como rascunho: a publicação fica indisponível até você selecionar ao menos um participante na etapa Colaboradores." O botão de ativação fica desabilitado enquanto essa condição for verdadeira.

---

## c. Stepper — especificação visual completa

O stepper fica **dentro** do card branco do formulário (não mais solto acima dele), como a primeira coisa dentro do card, separado do conteúdo por uma linha divisória horizontal.

```
<div className="min-w-0 bg-white rounded-lg border border-gray-200 flex flex-col overflow-hidden">
  {/* Stepper */}
  <div className="px-4 pt-4 pb-3 border-b border-gray-200 flex-shrink-0 flex items-center">
    {/* [círculo+label] [conector flex-1] [círculo+label] [conector flex-1] ... */}
  </div>

  {/* Conteúdo da etapa */}
  <div className="flex-1 min-h-0 overflow-y-auto px-8 pt-6 pb-8 flex flex-col">
    ...
  </div>
</div>
```

**Wrapper do stepper:** `px-4 pt-4 pb-3 border-b border-gray-200 flex-shrink-0 flex items-center` — ocupa toda a largura do card.

**Cada etapa é um grupo `círculo + label`:**
```
<div className="flex items-center gap-1.5 flex-shrink-0">
  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 transition-all {estado}">
    {concluída ? <Check className="w-3 h-3" strokeWidth={3} /> : número da etapa (1-indexed)}
  </div>
  <span className="text-xs whitespace-nowrap {estado da label}">{label da etapa}</span>
</div>
```

Estados do círculo (comparando `idx` da etapa contra `currentIndex`):
| Estado | Classe |
|---|---|
| Concluída (`idx < currentIndex`) | `bg-[var(--brand-600)] text-white` + ícone `Check` no lugar do número |
| Atual (`idx === currentIndex`) | `bg-[var(--brand-600)] text-white` + número |
| Pendente (`idx > currentIndex`) | `bg-white text-gray-400 border border-gray-300` + número |

Estado da label: etapa atual = `font-semibold text-gray-900`; qualquer outra = `font-normal text-gray-500`.

**Conector entre dois círculos** (não existe depois do último):
```
<div className="flex-1 h-px mx-3 transition-colors {bg-[var(--brand-600)] se idx < currentIndex, senão bg-gray-200}" />
```
`flex-1` é essencial — os conectores esticam para preencher toda a largura disponível do card, responsivamente. **Nunca usar uma largura fixa (`w-10` ou equivalente) aqui** — essa foi justamente uma versão anterior que foi substituída.

A renderização é via `.map` sobre a lista de etapas ativa (`etapas` — 5 em criação, 4 em edição), usando `Fragment` para não introduzir wrapper extra entre círculo e conector.

---

## d. Card de dica — especificação visual completa

Coluna direita do grid (`lg:grid-cols-[minmax(0,1fr)_300px]`), só visível em `lg:` para cima (`hidden lg:flex lg:flex-col`). Renderizado condicionalmente (`{dica && (...)}`) — na prática as 5 etapas sempre retornam uma dica não-nula hoje, o guard é defensivo.

```
<div className="w-full bg-gray-50 rounded-lg border border-gray-200 overflow-y-auto p-5">
  {/* Cabeçalho */}
  <div className="flex flex-col mb-6">
    <span className="text-[24px]">🧭</span>
    <p className="text-base font-bold text-gray-900 mt-3">{título da dica}</p>
  </div>

  {/* Corpo — texto corrido OU lista */}
  {texto simples && <p className="text-sm text-gray-700">{texto}</p>}
  {lista && (
    <ol className="space-y-4">
      <li>
        <p className="text-sm font-semibold text-gray-900">{N}. {mini-título do item}</p>
        <p className="text-sm text-gray-700 mt-2">{texto do item}</p>
      </li>
      ...
    </ol>
  )}
</div>
```

Pontos que **não podem regredir** para versões anteriores já testadas e descartadas:
- O emoji `🧭` fica **solto no texto**, sem `<span>`/`<div>` wrapper com fundo (`bg-[...]`), sem borda, sem padding — só controla o tamanho via `text-[24px]`. (Uma versão intermediária usava o ícone `Lightbulb` da lucide-react dentro de um container `w-8 h-8 rounded-lg bg-[var(--brand-100)]` — isso foi removido.)
- O emoji fica **empilhado acima** do título (`flex flex-col`), não lado a lado — `mt-3` entre emoji e título.
- Os itens da lista **não têm bolinha numerada** (nenhum `<span>` circular). O número é **prefixo de texto dentro do próprio mini-título**: `{i + 1}. {item.titulo}` — mesma fonte/peso/cor do resto do título (`text-sm font-semibold text-gray-900`), nunca um elemento separado.
- `mt-2` entre mini-título e descrição de cada item; `space-y-4` entre um item e o próximo (não `space-y-3`).
- Container: `bg-gray-50` (nunca branco), `border border-gray-200`, `rounded-lg`, `p-5` (não `p-4`).

### Conteúdo de texto de cada dica (fonte: `FormularioAvaliacao.tsx`, função que monta `dica` a partir de `currentStepKey`/`formData.caminho`)

**Etapa Público** — título "Escolha o ponto de partida":
1. **Por Jornada de Carreira** — "Habilidades e participantes vêm automaticamente da matriz da jornada escolhida."
2. **Por Público-alvo** — "Você monta manualmente, escolhendo gerências e colaboradores específicos."

**Etapa Identificação, caminho Jornada** — título "O que essa jornada já define":
1. **Habilidades e participantes** — "Vêm da matriz de competências da jornada selecionada."
2. **Próxima etapa** — "Você poderá revisar e ajustar as habilidades na próxima etapa."

**Etapa Identificação, caminho Público-alvo** — dica de texto corrido (não é lista), título "Nomeando a avaliação": "O nome deve ser único para o público escolhido. Nomes repetidos são permitidos apenas se o público-alvo for diferente."

**Etapa Habilidades, caminho Jornada** — título "Habilidades pré-selecionadas":
1. **Pré-seleção automática** — "Vêm marcadas a partir da matriz da jornada."
2. **Liberdade de ajuste** — "Você pode desmarcar qualquer uma ou adicionar outras livremente."

**Etapa Habilidades, caminho Público-alvo** — dica de texto corrido, título "Monte a lista livremente": "Escolha todas as habilidades que farão parte desta avaliação, técnicas, comportamentais, ou as duas."

**Etapa Prazo** — título "Como o prazo funciona" (mesma para os dois caminhos, linguagem simples — não reproduz a tabela de combinações, explica as regras):
1. **Início** — "Controla a partir de quando a avaliação fica disponível para os participantes."
2. **Término** — "Sempre corta tudo: quando chega, a avaliação some para todo mundo, mesmo que o **Prazo de resposta** individual de alguém ainda não tenha vencido." (a expressão "Prazo de resposta" fica com `font-medium`, destacada dentro da frase — componente auxiliar `<Campo>`, `<strong className="font-medium">`; era só "Prazo" antes desta rodada)
3. **Prazo de resposta** (título do item renomeado nesta rodada, era "Prazo (dias)") — "É o mesmo número de dias para todos, mas a data-limite de cada participante varia: é contada a partir da data em que ele entrou na avaliação."
4. **Sem Data de Início** — "A avaliação some para rascunho, invisível para os colaboradores, até você publicá-la."

**Etapa Revisão** — título "Antes de concluir":
1. **Salvar rascunho** — "Fica invisível para os colaboradores até você ativar depois."
2. **Se `dataInicioFutura`:** "Agendar avaliação" — "Será publicada automaticamente em **{data formatada}**." (data em `font-medium`, via `<Campo>`) — **senão:** "Publicar agora" — "Fica disponível imediatamente para os participantes."

---

## e. Regras de negócio do prazo

**⚠️ Este é o modelo que substituiu o antigo seletor de 3 modos — não reintroduza o seletor.**

> **Histórico de correção (2026-08-19):** a versão anterior deste documento tratava Data de Término e Prazo (dias) como **mutuamente exclusivos** (preencher um desabilitava o outro na UI, e a combinação era bloqueada por `validarEtapa`). Essa regra estava **errada** e foi revertida — a regra de negócio final, aprovada pelo time, é: Início controla disponibilidade, Término sempre tem precedência (corta tudo, mesmo com prazo individual não vencido), e Prazo em dias é o mesmo número para todos mas gera uma data-limite diferente por participante (a partir da entrada de cada um). Término e Prazo **podem coexistir** — nesse caso o prazo de cada participante é o que vencer primeiro entre os dois. A tabela abaixo é a versão final; a tabela antiga de 6 combinações (sem a linha de Término+Prazo juntos) não vale mais.

3 campos livres na Etapa Prazo, todos opcionais e **independentes entre si**: **Início**, **Término**, **Prazo em dias**. O `modoPrazo` real gravado no schema (`'datas_fixas' | 'prazo_em_dias' | 'datas_fixas_com_prazo' | 'indefinido'`) é **sempre inferido** da combinação preenchida — nunca escolhido diretamente pelo Admin. Função única responsável por essa inferência: `montarCamposPrazo(data, dataPublicacao?)`, em `FormularioAvaliacao.tsx`.

| Início | Término | Prazo | Resultado |
|---|---|---|---|
| Vazio | Vazio | Vazio | Rascunho (usuário avisado). Se publicar agora: `modoPrazo: 'indefinido'`; `periodoInicio = dataPublicacao`, sem data de término, disponível indefinidamente. |
| Preenchido (futuro) | Vazio | Vazio | `modoPrazo: 'indefinido'`; `periodoInicio` = a própria data de Início informada — agendada até essa data, depois disponível indefinidamente (**não** é ignorada; tratada como "sem prazo de término, mas agendada para essa data"). |
| Preenchido (hoje) | Vazio | Vazio | Mesmo resultado da linha acima — `modoPrazo: 'indefinido'`, `periodoInicio` = Início, disponível imediatamente e indefinidamente. |
| Preenchido | Preenchido | Vazio | `modoPrazo: 'datas_fixas'`; `periodoInicio` = Início, `periodoFim` = Término — igual para todos. |
| Preenchido | Vazio | Preenchido | `modoPrazo: 'prazo_em_dias'`; `periodoInicio` = Início (agendado), `prazoDias` = Prazo — mesmo número de dias para todos, data-limite individual = entrada + Prazo. |
| Vazio | Preenchido | Vazio | Rascunho (usuário avisado). Se publicar agora: `modoPrazo: 'datas_fixas'`; `periodoInicio = dataPublicacao`, `periodoFim` = Término. |
| Vazio | Vazio | Preenchido | Rascunho (usuário avisado). Se publicar agora: `modoPrazo: 'prazo_em_dias'`; `periodoInicio = dataPublicacao`, `prazoDias` = Prazo. |
| Vazio | Preenchido | Preenchido | Rascunho (usuário avisado). Se publicar agora: `modoPrazo: 'datas_fixas_com_prazo'`; `periodoInicio = dataPublicacao`, `periodoFim` = Término, `prazoDias` = Prazo — data-limite individual = menor entre (entrada + Prazo) e Término. |
| Preenchido | Preenchido | Preenchido | `modoPrazo: 'datas_fixas_com_prazo'`; `periodoInicio` = Início, `periodoFim` = Término, `prazoDias` = Prazo — mesma regra de menor-dos-dois acima. |

**Não há mais combinação inválida/bloqueada** — Término e Prazo preenchidos juntos (linhas 8 e 9) são um caso válido, tratado por `montarCamposPrazo` (nunca bloqueado por `validarEtapa`).

`dataPublicacao` é um parâmetro opcional passado só quando a ação é uma publicação de fato (Ativar) ou um preview "como ficaria se ativado agora" (Revisão, `HOJE_ISO`). Quando ausente (Salvar Rascunho), os ramos que resolveriam `periodoInicio` para "agora" ficam com `''` — mesmo comportamento histórico: `periodoInicio` vazio enquanto `status === 'Rascunho'`.

**Precedência do Término** — `calcularStatusEfetivo` (em `utils/avaliacoes.ts`) sempre expira a avaliação INTEIRA quando `periodoFim` já passou, tanto em `'datas_fixas'` quanto em `'datas_fixas_com_prazo'` — independentemente de haver participantes com prazo individual (`dataEntrada + prazoDias`) ainda não vencido. `calcularPrazoParticipante`, para `'datas_fixas_com_prazo'`, retorna o menor entre `dataEntrada + prazoDias` e `periodoFim` — o que vencer primeiro, por participante.

**Formatação de exibição** — função única `formatPeriodoAvaliacao` em `src/app/utils/avaliacoes.ts` (reaproveitada por `ContentArea.tsx`, `AvaliacaoDetalhePage.tsx`, `DashboardPage.tsx` e pelo próprio wizard — **confirmado: não há segunda implementação paralela**, foi unificada):
- Sem `periodoInicio` → `"A definir"`.
- `datas_fixas` com `periodoFim` → período formatado (`DD/MM – DD/MM/AAAA`, ou `DD/MM/AAAA – DD/MM/AAAA` se anos diferentes); sem `periodoFim` → só a data de início formatada.
- `indefinido` → `"A partir de {data} · sem término"`.
- `prazo_em_dias` → `"A partir de {data} · {N} dia(s) de prazo"` (ou `"prazo a definir"` se `prazoDias` ausente).
- `datas_fixas_com_prazo` → `"A partir de {data} · até {término} · {N} dia(s) de prazo individual (o que vencer primeiro)"`.

---

## f. Modais

### 1. Confirmação antes de publicação imediata (`ConfirmationModal`, variante `warning`)

- **Quando aparece:** só ao clicar no botão final de ativação (`handleAtivar`) **quando a publicação é imediata** — ou seja, `dataInicioFutura` é `false` (Início vazio ou `<= hoje`). Se `dataInicioFutura` for `true` (agendamento para o futuro), a avaliação é ativada **direto**, sem esse modal — só a publicação imediata é considerada irreversível o bastante para pedir confirmação.
- **Título:** `Publicar "{nome da avaliação}" agora?`
- **Mensagem:** se `modoPrazo === 'indefinido'` → "A avaliação ficará disponível imediatamente para os participantes, sem prazo de término definido. Continua ativa até você encerrá-la manualmente." — se `modoPrazo === 'datas_fixas_com_prazo'` → menciona explicitamente que a avaliação fica disponível até o Término mesmo que o Prazo individual de alguém ainda não tenha vencido, seguido de `{prazoTextoUnificado}` — senão → `"A avaliação ficará disponível imediatamente para os participantes. {prazoTextoUnificado}"`.
- **Botões:** Cancelar (fecha o modal, não faz nada) / "Publicar agora" (confirma — chama `onAtivar(dadosParaSubmissao())` de fato).
- Componente genérico `ConfirmationModal.tsx` (props: `isOpen`, `onClose`, `onConfirm`, `title`, `message`, `confirmLabel`, `cancelLabel`, `variant`) — não é exclusivo deste fluxo.

### 2. Resumo pós-conclusão (`ModalResumoAvaliacao`)

- **Quando aparece:** sempre que o wizard termina de verdade (Rascunho salvo, avaliação agendada, ou avaliação publicada) — controlado pela página (`CriarAvaliacaoPage`/`EditarAvaliacaoRascunhoPage`), não pelo `FormularioAvaliacao` em si. A página guarda a avaliação recém-criada/atualizada em estado local e renderiza este modal condicionalmente.
- Mesma anatomia visual do `ConfirmationModal` (overlay, container `max-w-md`, ícone circular, título+mensagem centralizados), mas com ícone de sucesso (`CheckCircle2`, `bg-green-100 text-green-600`) e **um único botão** ("Voltar para Avaliações" — sempre navega para `/avaliacoes`, nunca Cancelar/Confirmar). Sem botão X.
- Conteúdo varia por 3 casos (calculados dentro do próprio modal a partir da `Avaliacao` final):
  - **Rascunho** (`status === 'Rascunho'`) — título "Avaliação salva como rascunho"; corpo "Fica invisível para os colaboradores até você ativá-la, na tela de detalhe da avaliação."
  - **Agendada** (não é Rascunho e `periodoInicio > hoje`) — título "Avaliação agendada"; corpo `"Será publicada automaticamente para os participantes. {formatPeriodoAvaliacao(avaliacao)}"`.
  - **Publicada** (senão) — título "Avaliação publicada"; corpo `"Já está disponível para os participantes responderem. {formatPeriodoAvaliacao(avaliacao)}"`.
- Título da avaliação sempre aparece em destaque antes do corpo: `"{nome} — {corpo}"`.

### (Fora do escopo dos "dois modais" pedidos, mas parte do fluxo — vale registrar)

- **`ColaboradoresListaModal`** (definido dentro do próprio `FormularioAvaliacao.tsx`; **renomeado e generalizado nesta rodada** — antes era `ColaboradoresJornadaModal`, exclusivo do caminho Jornada) — modal somente-leitura acionado pelo link "Ver colaboradores", em dois pontos: Etapa Identificação (só caminho Jornada, criação) e o card "Público-alvo" da Etapa Revisão (os dois caminhos). Overlay + container `max-w-md`, header com título + botão X, footer só com "Fechar". Props generalizadas: `titulo: string` + `subtitulo?: string` (antes era `jornadaNome: string` obrigatório) — caminho Jornada usa título "Colaboradores da jornada" com subtítulo (nome da jornada); caminho Público-alvo usa título "Colaboradores selecionados", sem subtítulo. A lista de colaboradores também muda por caminho: `colaboradoresDaJornadaModal` (resolvido a partir de `formData.participantesIds`) vs. `colaboradoresSelecionadosModal` (novo memo, resolvido direto de `formData.colaboradoresSelecionados` — sem depender de `jornadaId`). Um único estado (`modalColaboradoresAberto`) controla os dois casos; o componente decide qual conjunto de props passar com base em `formData.caminho` no ponto de render.
- **`QuestionarioPreview`** — não é um modal (overlay fullscreen `fixed inset-0 z-[300]`, não um card centralizado), acionado pelo botão "Visualizar questionário" só na Etapa Revisão. Ver seção "Estrutura das 5 etapas" acima.

---

## g. Validações

Função central: `validarEtapa(etapa)`, chamada ao clicar "Continuar" (`handleContinuar`) e também explicitamente para `'identificacao'` + `'prazo'` dentro de `handleAtivar` (mesmo que o Admin já tenha passado por essas etapas antes — revalida no momento de ativar, caso algo tenha sido alterado depois).

**Etapa `publico`:** `formData.caminho` não pode ser `null` → toast "Escolha como definir o público desta avaliação".

**Etapa `identificacao`:**
- Nome vazio (`.trim()`) → toast "Preencha o nome da avaliação".
- Caminho `jornada` sem `jornadaId` → toast "Selecione uma jornada de carreira".
- Caminho `publico`: **não há mais validação de colaborador/gerência aqui** — colaboradores deixou de ser obrigatório para avançar (ver seção b, "Colaboradores deixou de ser obrigatório").

**Etapa `colaboradores`:** sem validação bloqueante — o Admin pode continuar sem selecionar nenhum participante (essa condição só passa a bloquear no botão final de ativação, nunca na navegação entre etapas).

**Etapa `prazo`:** ver as 4 regras já listadas na seção "Estrutura das etapas" (Término+Dias juntos; Início no passado; Término antes do Início; Dias `<= 0`).

**Habilidades:** sem validação bloqueante.

**Duplicidade de nome + público-alvo (tempo real, não bloqueante — é aviso):**

> **Mudança nesta rodada:** a checagem deixou de comparar `publicoLabelCalculado` (texto exibido) e passou a comparar os **participantes reais** — `jornadaId` no caminho Jornada, conjunto de IDs de colaboradores no caminho Público-alvo. O texto que o usuário vê na tela continua sendo `publicoLabelCalculado` normalmente (nada muda visualmente) — só a comparação por baixo dos panos mudou de fonte.

- Calculada em `duplicidadeDetectada` (`useMemo`). Compara sempre `formData.nome` (`.trim().toLowerCase()`, ignorando a própria avaliação em modo edição) contra o `nome` de cada item de `avaliacoesExistentes` — igual a antes.
- **O que muda é a comparação do "público":**
  - Caminho `jornada`: mesmo `jornadaId` (`a.jornadaId === formData.jornadaId`).
  - Caminho `publico`: mesmo **conjunto** de IDs de colaboradores selecionados — compara por tamanho igual e todo ID de um lado presente no outro (comparação de conjunto, ordem de seleção não importa).
- Motivo da mudança: `publicoLabelCalculado` pode colidir por texto sem os públicos serem os mesmos (ex: o fallback genérico "N colaboradores selecionados" — duas seleções completamente diferentes de mesma contagem geram a mesma string). Comparar pelos IDs/jornadaId elimina esse falso positivo.
- **Em qual etapa a checagem passa a rodar, por caminho:**
  - Caminho `jornada`: continua na Etapa Identificação — `jornadaId` já é conhecido ali.
  - Caminho `publico`: **passou da Identificação para a etapa Colaboradores** — só ali os participantes são conhecidos, já que a seleção de gerência/colaboradores saiu da Identificação (ver seção b).
- **Mensagem exata, varia por caminho (sem alteração):**
  - Caminho `jornada`: "Já existe uma avaliação com esse nome para essa jornada."
  - Caminho `publico`: "Já existe uma avaliação com esse nome para esse público-alvo."
- Exibida em três lugares: logo abaixo do campo Nome na Etapa Identificação (`text-sm text-red-600`, só caminho `jornada`), como aviso amarelo (`AlertTriangle`) na própria etapa Colaboradores (só caminho `publico`), e como aviso amarelo na Etapa Revisão (ambos os caminhos) — **nunca bloqueia** o avanço nem a ativação.

**Sem colaboradores selecionados (só caminho `publico`, não é duplicidade):** não bloqueia navegação nem "Salvar rascunho" — só desabilita o botão final de ativação. Ver seção b, "Colaboradores deixou de ser obrigatório".

**Salvar Rascunho** (`handleSalvarRascunho`, botão sempre visível no rodapé): só valida que o nome não está vazio — nenhuma outra validação de etapa é aplicada (permite salvar rascunho incompleto).

---

## h. Botão de ativação — lógica do texto dinâmico

Variável `dataInicioFutura`: `formData.dataInicio.trim() !== '' && formData.dataInicio.trim() > HOJE_ISO` (comparação de string ISO `YYYY-MM-DD`, funciona por ordenação lexicográfica).

| Condição | Label do botão | Comportamento ao clicar |
|---|---|---|
| `dataInicioFutura === true` | **"Agendar avaliação"** | Ativa direto, **sem** passar pelo `ConfirmationModal` (agendamento para o futuro não é considerado ação imediata/irreversível o bastante para pedir confirmação) |
| `dataInicioFutura === false` (Início vazio ou hoje/passado — passado já é bloqueado pela validação de prazo) | **"Publicar agora"** | Abre o `ConfirmationModal` de confirmação antes de ativar de fato |

O botão só aparece assim (label dinâmico) na **última etapa** (`currentIndex === etapas.length - 1`, ou seja, Revisão). Nas etapas anteriores, o botão da direita é sempre "Continuar" (com ícone `ChevronRight`).

Este label/condição é calculado **antes** da dica (na ordem do código), porque a dica da Revisão reaproveita as mesmas duas variáveis (`labelBotaoAtivar`/`dataInicioFutura`) para decidir seu segundo item — nunca duplicar essa condição em dois lugares.

---

## i. Componentes reaproveitados do design system

O desenvolvedor reconstruindo esta tela em outra stack deve implementar **equivalentes** destes padrões — não inventar componentes novos com comportamento diferente:

| Componente/padrão | Onde é definido | Papel no cadastro de avaliação |
|---|---|---|
| `ConfirmationModal` | `src/app/components/templates/ConfirmationModal.tsx` | Modal de confirmação genérico (overlay + ícone + título + mensagem + Cancelar/Confirmar), 3 variantes de cor (`danger`/`warning`/`info`). Usado para a confirmação de publicação imediata. |
| `HabilidadesMasterDetail` | `src/app/components/templates/HabilidadesMasterDetail.tsx` | Busca + segmented control + duas colunas competência/habilidades com checkbox — reaproveitado também por `HabilidadesSelectionModal.tsx` (matriz de habilidades do Admin). |
| `SeletorGerenciaGranular` | `src/app/components/templates/SeletorGerenciaGranular.tsx` | Duas colunas gerência (tri-state)/colaborador, exclusivo deste wizard hoje (não usado em nenhuma outra tela). |
| `SearchableSelect` | `src/app/components/ui/SearchableSelect.tsx` | Select com busca embutida — usado nos dois selects da Etapa Identificação do caminho "Por Jornada" (Carreira e Jornada). Substituiu o `Select` Radix simples nesses dois campos especificamente. |
| `Select`/`SelectContent`/`SelectItem`/`SelectTrigger`/`SelectValue` | `src/app/components/ui/select.tsx` (Radix) | Ainda usado em outras telas do sistema (fora deste wizard) — nunca `<select>` nativo, regra geral do design system. |
| `ToggleSwitch` | `src/app/components/ui/ToggleSwitch.tsx` | Toggle de "auto-inclusão de novos colaboradores" dentro do `SeletorGerenciaGranular`. **PENDÊNCIA:** hoje é só protótipo — grava a intenção em `Avaliacao.gerenciasComAutoInclusao`, mas nenhum mecanismo do sistema atua sobre esse campo (não existe fluxo de criar/editar colaborador nesta versão que dispare a inclusão automática de alguém que "entrou depois" numa gerência marcada). Reimplementar de verdade exige um mecanismo real — ex.: hook de mudança de gerência do colaborador → adicionar como `ParticipanteAvaliacao` em toda avaliação Ativa com essa gerência marcada — não basta copiar o visual do toggle. |
| `toast` (sonner) | biblioteca externa `sonner` | Todas as mensagens de erro de validação (`toast.error(...)`) — nunca um componente de erro inline customizado para essas mensagens de bloqueio de etapa. |
| `formatPeriodoAvaliacao`, `formatData`, `formatPeriodo` | `src/app/utils/avaliacoes.ts` | Fonte única de formatação de texto de prazo/data — reaproveitada por várias telas de Avaliações (Admin e Colaborador), nunca reimplementar localmente. |
| `getCarreiraEJornadaNomes` | `src/app/utils/avaliacoes.ts` (novo nesta rodada) | Cruza `jornadaId` → `carreiraId` → nomes de Carreira e Jornada pela FK real. Recebe as listas de jornadas/carreiras como parâmetro (não importa `mockData` direto) — o wizard passa os arrays ao vivo de `useCarreiras()` (`jornadas`/`carreiras`), `AvaliacaoDetalhePage.tsx` passa `jornadasData`/`carreirasData` do mock. Usada no card "Público-alvo" da Etapa Revisão (caminho Jornada) e no header de `AvaliacaoDetalhePage.tsx` — fonte única, nunca duplicar esse cruzamento numa tela nova. |
| `useCarreiras()` (`getHabilidadesAgregadasDaJornada`, `getColaboradoresPorJornada`) | `src/app/context/CarreirasContext.tsx` | Fonte única de "quais habilidades/colaboradores pertencem a esta jornada" — usada tanto na criação quanto recalculada ao vivo na edição. |
| `NiveisHabilidadeCards`, `PainelLateralCompetencias` | `src/app/components/avaliacoes/` | Reaproveitados pelo preview do questionário (Etapa Revisão) — os **mesmos** componentes usados no fluxo real de resposta da autoavaliação (fora do escopo deste documento), garantindo que o preview seja fiel. |

Padrões de design system gerais que também se aplicam aqui (documentados em `.claude/rules/02-design-system.md`, não repetidos em detalhe): botões primário/secundário/terciário/cancelar, cards (`bg-white border border-gray-200 rounded-lg`, nunca shadow), drawers/modais sem botão X exceto quando explicitamente listado, `space-y-4`/`space-y-5` entre campos de formulário, badges de tipo de habilidade (`Técnica`/`Comportamental`).

---

## j. Regra de texto — nunca travessão/en dash em texto exibido ao usuário

Auditada e corrigida nesta rodada (2026-08-24): qualquer valor "sem dado" exibido na UI usa **hífen simples** (`-`), nunca travessão (`—`) nem en dash (`–`), e nunca um texto por extenso como "Não definido"/"Não preenchido" para esse caso específico de campo vazio numa célula de tabela. Já aplicado nas colunas Início/Término/Prazo da listagem de Avaliações (ver `docs/HANDOFF-LISTAGEM-AVALIACOES.md`) e vale como padrão para qualquer campo novo deste wizard que precise representar "sem valor" em texto renderizado ao Admin — não usar `—`/`–`, nem prosa substituindo o hífen. Isso não se aplica a comentários de código (`// texto — explicação`), só a texto que o usuário vê na tela.

---

## Pontos marcados como "PRECISA CONFIRMAR COM ALICE"

Nenhum ponto documentado acima ficou ambíguo o suficiente para exigir confirmação — todo o comportamento descrito foi lido diretamente do código atual (`FormularioAvaliacao.tsx` e arquivos relacionados), sem inferência sobre intenção não explícita no código.
