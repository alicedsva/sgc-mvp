---

## Changelog

### 2026-08-28 — auditoria (módulo Carreiras + drawers)

- **Dropdowns**: `SearchableSelect` (`ui/SearchableSelect.tsx`) registrado como
  **variante aprovada** do Radix Select para listas longas (ver "Filtros e
  Pills").
- **Drawers**: largura padrão passou a ser **fixa** — `w-full` no mobile,
  `md:w-[560px]` no desktop (antes `md:w-[35%] md:max-w-xl md:min-w-[400px]`,
  relativa à viewport). Motivo técnico: uma largura relativa recalculava o
  layout quando o scroll-lock do Radix (menus/selects internos) somia/somava a
  barra de rolagem da página, causando um "pulo" horizontal do drawer.
- **Botão "Continuar"**: registrado como convenção de navegação entre
  abas/etapas fora do wizard de Avaliações (ver "Botões" > "Continuar").
- Variante C (aviso de estado, amarelo, sem título, `AlertTriangle`): sem
  alteração — já estava registrada.

---

# Design System — regras visuais obrigatórias

## Cores

Sempre use tokens CSS para cores da marca:
- `var(--brand-500)` — foco de input, sidebar item ativo
- `var(--brand-600)` — botão primário, ícone ativo, link
- `var(--brand-700)` — hover do botão primário
- `var(--brand-50)` — fundo sutil
- `var(--brand-100)` — borda sutil

Para neutros, use classes Tailwind diretamente (gray-X).
Nunca use hex fixo. Nunca use classes `blue-X` para elementos da marca.

### Neutros — uso semântico
| Token    | Uso                                    |
|----------|----------------------------------------|
| gray-50  | fundo da página, header do thead       |
| gray-100 | pills inativas, badges de status       |
| gray-200 | bordas de cards e tabelas              |
| gray-300 | bordas de inputs                       |
| gray-400 | ícones inativos, placeholder           |
| gray-500 | texto secundário                       |
| gray-600 | texto de filtro inativo                |
| gray-700 | labels de campo                        |
| gray-900 | texto primário, títulos                |

## Tipografia

- Título de página: `text-2xl font-semibold text-gray-900`
- Subtítulo de página: `text-sm text-gray-500 mt-1` — padrão oficial desde
  2026-09-17 (decisão da Alice). É o que está de fato em produção no bloco
  de título de 4 das 5 listagens principais (Perfis, Habilidades, Carreiras,
  Avaliações, em `ContentArea.tsx`). `ListingPage.tsx` ainda tem um caminho
  interno com `text-sm text-gray-600 mt-2` (usado só quando uma tela passa
  `title`/`subtitle` como prop pro componente — nenhuma das 5 listagens
  principais faz isso hoje) — não seguir esse valor em telas novas.
- Label de campo: `text-xs md:text-sm font-medium text-gray-700`
- Cabeçalho de tabela: `text-[10px] font-semibold text-gray-500 uppercase tracking-wider` — fixo, sem bump em telas grandes (ver nota abaixo)
- Conteúdo de célula: `text-xs text-gray-900` — fixo, sem bump em telas grandes (ver nota abaixo)
- Informação complementar: `text-xs md:text-sm text-gray-500`
- Link: `text-xs md:text-sm font-medium text-[var(--brand-600)]`
- Erro de campo: `text-sm text-red-600`
- `font-bold` reservado apenas para valores numéricos em cards de métricas
- Regra: sempre usar prefixo `md:` quando tamanho muda entre breakpoints — **exceção permanente**: cabeçalho e conteúdo de célula de tabela (linhas acima) não crescem em telas grandes; badges dentro de célula (Status, Tipo) continuam responsivas normalmente, ver "Badges" abaixo — essa decisão nunca incluiu badges

### Tipografia de tabela — decisão 2026-09-15 (era experimento, virou padrão)

Origem: testado nas rotas `/testes/habilidades-chip` e `/testes/avaliacoes-chip`
antes de virar padrão. Centralizado em `ui/Table.tsx` — automático em toda
tabela do sistema que usa o componente (`Table`/`ListingPage`), não precisa
de nenhuma prop pra ligar. Não existe mais variante "tipografia normal" de
tabela — os valores antigos (`text-[10px] md:text-xs font-medium` no
cabeçalho, `text-xs md:text-sm` na célula) foram substituídos, não
coexistem como opção.

### Contagem "número + palavra" — componente `ui/QuantityLabel.tsx`

Padrão para exibir uma contagem seguida da unidade (ex: "2 habilidades",
"11 habilidades", "5 níveis"): número em destaque, palavra/unidade ao lado
em peso normal e cor mais fraca.

```
<QuantityLabel value={n} singular="habilidade" plural="habilidades" />
```

Renderiza `font-semibold text-gray-900` no número + `font-normal
text-gray-500` na palavra (singular quando `value === 1`, plural caso
contrário). Sem tamanho de fonte próprio — herda o da célula/contêiner onde
for usado.

Decisão — 2026-09-16: antes desse componente, o padrão era escrito à mão em
cada tela, com variações reais entre elas (pesos/cores diferentes em
`ContentArea.tsx` "Habilidades Vinculadas" de Competências vs.
`NiveisProficiencia.tsx`, e a coluna "Níveis" de Habilidades não tinha
nenhum destaque). `QuantityLabel` centraliza o padrão — **sempre usar esse
componente para número + unidade, nunca escrever os dois `<span>` à mão de
novo.**

Exceção: `DashboardPage.tsx` (coluna de GAPs, Seção 2) fica de fora — usa
`font-semibold` + `text-gray-400` com abreviação ("colab."), arquitetura de
tabela própria do Dashboard, não migrada.

### Exceção documentada — rótulo da etapa Revisão (wizard de Avaliações)

Decisão — 2026-08-25, revisada 7x no mesmo dia (ajustes finos sucessivos a
pedido da Alice): a etapa "Revisão" do wizard de Avaliações
(`FormularioAvaliacao.tsx`) **não** usa o padrão de "Cabeçalho de tabela"
(caixa alta + `text-[10px]`) para seus rótulos de campo (Nome, Descrição,
Carreira, Jornada, Público, Colaboradores, Habilidades, Prazo) — nem os
tamanhos/pesos das rodadas anteriores (já superados por esta versão).

Padrão atual, específico desta etapa:
- Rótulo de campo: `text-xs font-semibold text-gray-900` (12px) — sentence
  case, nunca caixa alta; é ele que carrega o destaque visual, não o valor.
- Valor abaixo do rótulo: `text-sm font-normal text-gray-700` (14px) — peso
  normal, cor mais neutra que o rótulo.
- Título de seção (nome do container): `text-sm font-semibold text-gray-900`
  (14px) — precisa ser o nome EXATO da etapa correspondente no stepper
  daquele caminho (`ETAPAS_CRIACAO_JORNADA`/`ETAPAS_CRIACAO_PUBLICO`,
  `FormularioAvaliacao.tsx`), nunca um rótulo genérico ou inventado. "Público-
  alvo" nunca é um título válido — não existe etapa com esse nome em nenhum
  dos dois caminhos. O card que resume quem vai participar (variável de
  código `containerPublicoAlvo`, nome só interno) mostra "Público" no
  caminho "Por Jornada" (nome exato da etapa 1, key `'publico'`) e
  "Colaboradores" no caminho "Por Público-alvo" (nome exato da etapa key
  `'colaboradores'`) — título condicional a `formData.caminho`, corrigido em
  2026-08-25 depois de um título "Público-alvo" residual que não batia com
  nenhuma etapa real.
- Cada etapa do wizard vira seu próprio container (`bg-white border
  border-gray-200 rounded-lg`, mesmo card padrão do resto do sistema), com
  cabeçalho em linha única (`flex items-center justify-between`): título à
  esquerda, botão de editar (ícone `Pencil`, mesmo padrão de "Ação em
  tabela (ícone)" — `p-1.5 md:p-2 rounded-lg text-gray-500 hover:bg-gray-100
  hover:text-gray-700`) à direita, navegando de volta pra etapa
  correspondente via `setCurrentStepKey` (mesmo mecanismo do stepper —
  nunca uma navegação paralela).
- O cabeçalho tem `border-b border-gray-200` **de ponta a ponta** (ocupa a
  largura toda do card) — e é a ÚNICA divisória do container. Nunca existe
  linha ENTRE campos dentro do mesmo container (Identificação:
  Nome/Descrição; card "Público" no caminho "Por Jornada": Carreira/Jornada)
  — uma versão anterior desta exceção tinha uma `<div className="mx-5
  border-t border-gray-200" />` ali, removida a pedido da Alice. A separação
  entre blocos de label+valor dentro do mesmo container é só espaçamento
  vertical (`space-y-5` no wrapper que os agrupa), nunca borda.
- Card "Público" (caminho "Por Jornada"): Carreira e Jornada viram dois
  campos label+valor nesse mesmo padrão (antes eram uma linha só "Carreira:
  X"/"Jornada: Y"); a linha "N participantes · Ver colaboradores" nunca vira
  um terceiro campo com label — continua texto simples logo abaixo do valor
  de Jornada, sem divisória acima dela.
- Card "Prazo": o texto de `getPrazoPartes` (Inicia em/Termina em/Prazo de
  resposta) usa peso `font-normal` só aqui, via o 3º parâmetro
  `getPrazoPartes(avaliacao, agendada, 'normal')` — nunca duplicar a
  montagem desse texto; `getPrazoPartes` (`utils/avaliacoes.tsx`) aceita
  esse parâmetro de peso desde 2026-08-25, default `'semibold'` (o
  `<strong>` continua semibold em todo o resto do sistema — AvaliacaoDetalhePage.tsx
  não passa esse parâmetro, mantém o padrão).

Vale só para essa etapa — nunca usar esses tamanhos/pesos, essa inversão
label/valor ou esse padrão de cabeçalho como novo padrão de "Cabeçalho de
tabela"/label pequeno em outra tela do sistema por causa desta exceção.

## Espaçamento

Escala Tailwind obrigatória — nunca `style={{ margin: 'Xpx' }}`

- `space-y-6` — entre seções da página
- `space-y-4 md:space-y-5` — entre campos de formulário
- Margin negativa proibida exceto `-mx-4 md:mx-0` nas tabs
- Cards de métrica: `p-5` — nunca `p-6` ou maior
- Cards de conteúdo: `p-4 md:p-5` ou `p-5`

## Ícones

Biblioteca: lucide-react v0.487.0 — exclusiva.

### Tamanhos por contexto
- `w-4 h-4` — badges, texto inline, mensagens de orientação
- `w-5 h-5` — USO PRINCIPAL: cards, botões, toolbar
- `w-6 h-6` — sidebar, ações em tabela
- `w-8 h-8` — estados vazios, headers de seção

### Cores por contexto
- `text-[var(--brand-600)]` — cards de métricas, ativo na sidebar, links
- `text-gray-500` — toolbar, ações secundárias
- `text-gray-400` — decorativos, placeholders
- `text-gray-700` — ações em tabelas
- `text-green-500` — estados vazios positivos, sucesso
- `text-red-500` — erros, alertas críticos
- `text-slate-400` — ícone Info no banner de instrução de formulário

### Regras
- Sempre via `className` — nunca `style={{ width, height }}`
- Em botões: sempre à esquerda do texto, `gap-2`
- Em cards de métricas: sempre à **direita**, `w-5 h-5 flex-shrink-0`, sem wrapper
- Nunca SVG inline não documentado

### Indicador de sincronização (Perfis) — exceção documentada

Único indicador do sistema que não é badge nem ícone de ação — é um ponto
(`Circle` preenchido, `w-2 h-2`) embutido ao lado do nome, na coluna Nome da
tabela de Perfis, com `Tooltip` explicando o significado. Representa
sincronização de dados com o sistema RM — **não é o Status Ativo/Desativado
do registro**, é um metadado independente (`atualizacaoDisponivel`).

```
Sincronizado:   fill-green-500 text-green-500
Desatualizado:  fill-red-500 text-red-500
```

Verde/vermelho aqui seguem o significado geral já documentado (verde =
positivo, vermelho = alerta), mas a paleta em si — pontos preenchidos de
`w-2 h-2`, sem badge, sem fundo — é específica desse indicador. Não reutilizar
esse padrão (ponto colorido solto) para nenhum outro tipo de status; status de
registro sempre usa a Badge documentada abaixo.

## Badges

Classe base responsiva para status:
`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full`

Status de registro:
- Ativa: `bg-green-100 text-green-800`
- Desativada: `bg-red-100 text-red-700` — todos os registros, sem exceção
- Rascunho: `bg-yellow-100 text-yellow-800`
- Encerrada / Arquivado: `bg-gray-100 text-gray-700`

Estado do colaborador na avaliação:
- Não iniciada: `bg-orange-100 text-orange-800`
- Em andamento: `bg-blue-100 text-blue-800`
- Concluída: `bg-green-100 text-green-800`
- Expirada: `bg-gray-100 text-gray-700`

Habilidade tipo:
- Técnica: `bg-[var(--brand-100)] text-[var(--brand-800)]`
- Comportamental: `bg-purple-100 text-purple-800`

Variação percentual (Dashboard):
- Positivo: `inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700`
- Negativo: `inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700`

Nível: sempre usar `getCorFromPeso(nivel.peso)` — nunca cor fixa.

### Regras
- Nunca `onClick` em badge
- Verde = positivo/ativo; Vermelho = alerta/erro; Amarelo = atenção/rascunho; Cinza = inativo/neutro

## Botões

Primário:
`inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors`

Secundário (outline brand):
`inline-flex items-center gap-2 px-4 py-2 border border-[var(--brand-600)] text-[var(--brand-600)] text-sm font-medium rounded-lg hover:bg-[var(--brand-50)] transition-colors`

Terciário:
`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors`

Destrutivo:
`inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors`

Cancelar:
`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors`

Ação em tabela (ícone):
`p-1.5 md:p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors`

### Estados
- Desabilitado: `opacity-50 cursor-not-allowed` + atributo `disabled`
- Carregando: `opacity-75 cursor-not-allowed` + `animate-spin` no ícone

### Continuar (navegação entre abas/etapas)

`inline-flex items-center gap-1.5 px-3 md:px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-colors border border-[var(--brand-600)] text-[var(--brand-600)] hover:bg-[var(--brand-50)]` + ícone `ChevronRight w-4 h-4` **à direita** do texto.

Convenção do sistema (não exclusiva do wizard de Avaliações): quando um
formulário/tela tem etapas ou abas sequenciais, o botão que avança para a
próxima chama-se **"Continuar"**. **Não é submit** — não valida, não salva,
não fecha. Só troca a etapa/aba ativa (mesma ação que clicar no toggle/stepper,
que continua disponível). Aparece no lugar do botão de submit apenas nas
etapas que não são a última.

Exemplos: wizard de Avaliações (`FormularioAvaliacao.tsx`); toggle
Cadastro → Níveis de Habilidades do `HabilidadeFormDrawer` (via `submitSlot`
do `FormDrawer`).

### Regras
- Máximo 1 botão primário por contexto visível
- Nunca `font-bold` — sempre `font-medium`
- Nunca `<button>` sem `type` explícito em formulários
- Cancelar nunca em vermelho
- Ações destrutivas sempre com modal de confirmação antes

## Tabelas

### Anatomia completa
```
Container: bg-white rounded-lg border border-gray-200 overflow-hidden   (overflow-hidden obrigatório)
Toolbar:   p-3 md:p-4 border-b border-gray-200
Thead row: bg-gray-50 border-b border-gray-200
           uppercase tracking-wider text-gray-500 — texto NUNCA bold
           Exceção — Dashboard: os theads das tabelas internas
           das seções S2, S3, S4 e S5 não usam bg-gray-50 —
           fundo branco para integrar visualmente com o card.
Tbody:     divide-y divide-gray-200
Paginação: border-t border-gray-200 bg-gray-50
```

Exceção documentada — padding das 4 tabelas internas do Dashboard (mesmas
S2/S3/S4/S5 da exceção de cor acima): cabeçalho usa `pb-3` e corpo usa
`py-3.5`, com espaçamento horizontal só via `pr-*` por coluna (sem `px-*`
nas duas pontas, sem bump `md:`) — diferente do padrão responsivo
`px-3 md:px-6 py-3 md:py-4` do resto do sistema. Motivo: são tabelas
hand-built, sem a anatomia de container/borda de `ui/Table.tsx`, embutidas
direto no card do Dashboard.

Linha clicável: `hover:bg-[rgba(0,159,194,0.06)] cursor-pointer transition-colors`
Linha não clicável: `transition-colors` (sem hover, sem cursor-pointer)

### Regras
- `overflow-hidden` obrigatório no container
- Ações em linha: ícones soltos até 3 ações — a partir de 4, vira menu de contexto (`MoreVertical`), ver "Menu de ações" abaixo
- Estado vazio com filtro ativo: mostrar botão "Limpar filtros"
- Estado vazio sem dados: sem botão de limpar

### Cabeçalho ordenável (`renderHeader`) — `text-left` explícito obrigatório

O `<th>` do `ui/Table.tsx` já traz `text-left`, mas quando o cabeçalho é
ordenável ele renderiza um `<button>` dentro do `<th>`, e o `<button>`
**herda `text-align: center` do user-agent** (o Preflight do Tailwind v4 não
reseta `text-align` em botões). Enquanto o rótulo cabe em 1 linha isso é
invisível; quando ele quebra em 2 linhas numa coluna estreita (ex: "Nome da
Habilidade" a 16%, "Nome da Avaliação" a 17%), as linhas aparecem
centralizadas — inconsistente com as colunas de texto puro ao lado.

Regra: **todo botão de cabeçalho ordenável leva `text-left` explícito na
className.** Padrão canônico do botão (atualizado — ver "Tipografia de
tabela" acima, cabeçalho não tem mais bump em `md:` desde 2026-09-15):

```
inline-flex items-center gap-1 group text-[10px] font-semibold
text-gray-500 uppercase tracking-wider text-left hover:text-gray-700 transition-colors
```

Aplicado em 2026-09-10 em todas as ocorrências (ContentArea.tsx —
Habilidades/Competências/Carreiras/Avaliações; Perfis.tsx;
CarreiraDetalhePage.tsx; AvaliacaoDetalhePage.tsx;
ParticipanteResultadoPage.tsx); atualizado para `font-semibold` sem `md:`
em 2026-09-15 junto da mudança de tipografia de tabela. O padrão continua
copiado por tela (não há `<SortableHeader>` compartilhado ainda) — ao
copiar de novo, manter o `text-left`.

#### Cabeçalho nunca trunca — decisão 2026-09-16

Cabeçalho de coluna com texto de duas palavras ou mais **quebra em duas
linhas** quando a tela aperta — **nunca** corta com reticências/`truncate`
nem força uma linha só com `whitespace-nowrap` (isso faz o texto
transbordar da coluna em vez de quebrar). Vale só para cabeçalho — dado de
linha (célula) pode truncar normalmente, ver "Truncamento de texto e
tooltip" acima; a diferença de tratamento entre os dois é intencional, não
uma inconsistência a resolver.

Isso já é o comportamento padrão do `<th>`/botão de `renderHeader` (nenhuma
das duas classes acima), então normalmente não precisa de nada extra — só
não adicionar `whitespace-nowrap`/`truncate` num cabeçalho novo "pra
arrumar" uma quebra de linha que pareça estranha; a quebra é o
comportamento correto. Achado e corrigido em 2026-09-16: a coluna
"Habilidades Vinculadas" (Competências, `ContentArea.tsx`) tinha
`whitespace-nowrap` no botão do cabeçalho — o texto transbordava da coluna
em vez de quebrar. Removido.

**Exceção documentada — cabeçalho de cargo na Matriz de Habilidades**
(`JornadaDetalhePage.tsx`, aba Matriz): o nome do cargo no `<th>` de cada
coluna dinâmica usa `truncate` (1 linha) + Tooltip com o nome completo, ao
invés de quebrar em 2 linhas. Motivo (confirmado por Alice, 2026-09-17):
não é um cabeçalho de listagem comum — é o cabeçalho de uma matriz com
número variável de colunas dinâmicas (uma por cargo da jornada), cada uma
já estreita (`min-w-[160px] max-w-[240px]`) e compartilhando espaço com a
barra de progresso e o menu de ações do cargo; permitir quebra em 2 linhas
aqui desalinharia a barra de progresso entre colunas vizinhas. Vale só para
este cabeçalho específico — não usar como precedente para truncar outro
cabeçalho de listagem comum.

### Largura de coluna e `table-layout` — exceção documentada

Padrão do sistema: as tabelas definem `width` (em %) em **todas** as colunas,
então `Table.tsx` liga `table-layout: fixed` — o navegador trava a largura de
cada coluna e o texto que não cabe quebra para baixo.

Exceção consciente — **`CompetenciaDetalhePage.tsx`** (tabela de habilidades
por competência do Colaborador): as colunas **não** definem `width`, então a
tabela roda em `table-layout: auto`. Motivo: são só 5 colunas curtas (nível,
peso, badge de status) sem nenhum campo de texto corrido longo — nesse caso o
`auto` deixa a coluna "Habilidade" crescer conforme o conteúdo, evitando o
esmagamento em várias linhas que as tabelas `table-fixed` sofrem em telas de
notebook (1280–1440px). Não adicionar `width` nessas colunas para
"padronizar" — isso religaria o `table-fixed` e traria o esmagamento de
volta. Vale só para essa tela; qualquer tabela nova com coluna de texto longo
(Descrição, Critério) continua no padrão `table-fixed` + `line-clamp`.

### Menu de ações (exceção documentada a partir de 3 ações)

Decisão — 2026-08-24, revisada 2026-09-15: `MoreVertical` era proibido em
qualquer circunstância; passou a ser permitido quando uma linha de tabela
tem **3 ou mais ações configuradas** (limiar original de 2026-08-24 era 4;
baixado para 3 em 2026-09-15 — nunca tratar o "4" como referência histórica
válida, o limiar vigente é 3). Abaixo de 3, ícones soltos continuam sendo o
padrão — nunca trocar por menu só porque "parece mais limpo"; a troca é
definida pela contagem, não por gosto.

A decisão de qual modo renderizar é pelo tamanho do array de ações
**configurado para a tabela** (o total, incluindo as condicionais), nunca
pela contagem de ações visíveis linha a linha. Uma ação condicional (ex:
"Encerrar" só em `Ativa`) não muda o modo por linha — isso criaria duas
linhas da mesma coluna renderizando modos diferentes (uma com ícones, outra
com menu), inconsistência visual dentro da mesma coluna. Implementado de
forma genérica em `ui/Table.tsx` (`InlineAction[]`): `actions.length < 3` →
ícones soltos (comportamento antigo, inalterado); `actions.length >= 3` →
menu. Qualquer tabela que já usa `Table.tsx`/`ListingPage.tsx` (padrão do
projeto — ver 01-verificacao.md) ganha o comportamento automaticamente ao
crescer para 3 ações, sem precisar reimplementar nada por tela.

Anatomia (referência: coluna Ações da tabela de Avaliações):
```
Trigger:  mesmo botão de "Ação em tabela (ícone)" já documentado acima —
          p-1.5 md:p-2 rounded-lg text-gray-500 hover:bg-gray-100
          hover:text-gray-700 transition-colors
          ícone: MoreVertical w-4 h-4
Content:  Radix DropdownMenu (ui/dropdown-menu.tsx) — bg-white, border
          border-gray-200, rounded-md, shadow-md, align="end" (abre
          alinhado à direita, sob a coluna Ações)
Item:     ícone (w-4 h-4) + label, gap-2, text-sm
          Neutro:     text-gray-900, focus:bg-gray-100
          Destrutivo: text-red-600 (ícone E texto), focus:bg-red-50 —
          mesmo tom já usado pela variant="danger" das ações em linha
          (ícones soltos) em ui/Table.tsx; nunca uma cor destrutiva nova
Ordem:    mesma ordem em que as ações apareciam como ícones — ações que
          já existiam antes primeiro, ações novas no fim
```

Regras:
- Nunca mais de uma ação destrutiva em vermelho por menu — se houver mais de
  uma ação sensível, só a mais irreversível (ex: excluir) fica vermelha
- Item desabilitado: mesmo tratamento geral de estado desabilitado (`opacity-50 cursor-not-allowed`, via `disabled`)
- `DropdownMenuContent`/cada clique precisam de `stopPropagation` quando a
  tabela tiver `onRowClick` — o menu é renderizado via Portal fora da `<tr>`,
  mas o clique ainda propaga para o `onRowClick` da linha pela árvore React
  (delegação de evento de Portal); sem isso, escolher uma ação também
  disparava a navegação da linha
- `bg-popover`/`text-popover-foreground`/`text-destructive` (tokens padrão
  do shadcn) nunca devem ser usados neste projeto — não geram CSS aqui
  (`theme.css` não registra esses tokens num bloco `@theme` do Tailwind v4).
  Usar sempre cores concretas (`bg-white`, `text-gray-900`, `text-red-600`),
  como em todo o resto do design system

### Mecanismo de menu à parte — Matriz de Habilidades (registrado, não migrar)

A Matriz de Habilidades (`JornadaDetalhePage.tsx`) tem DOIS menus de contexto
próprios — no cabeçalho de cada coluna de cargo (editar/remover cargo) e na
coluna fixa de habilidade (remover habilidade) — implementados como `<div>`
posicionado (`absolute`, `z-[200]`) controlado por estado local
(`openCargoMenu`/`openHabilidadeMenu`), não pelo Radix `DropdownMenu` nem
pelo `InlineAction[]`/`actions` do `ui/Table.tsx`. Isso é intencional, não
um desvio a corrigir: a Matriz é uma tabela hand-built (fora de
`ui/Table.tsx`) com anatomia própria (coluna fixa `w-[220px]`, cabeçalhos
dinâmicos por cargo, células de `MatrizCell`), então os dois modos do
`Table.tsx` (ícones soltos / `DropdownMenu`) não se aplicam da mesma forma
— o menu por cargo fica dentro do próprio `<th>`, não numa coluna de Ações
dedicada. Mantém-se como está; só registrado aqui para não ser confundido
com um mecanismo esquecido a unificar.

## Truncamento de texto e tooltip

### Componente único

`src/app/components/ui/tooltip.tsx` — wrapper de `@radix-ui/react-tooltip`
(`Tooltip` / `TooltipProvider` / `TooltipTrigger` / `TooltipContent`).
Renderizado via **Portal** (não é cortado pelo `overflow-hidden` do container
da tabela), `delayDuration={0}`, balão `bg-gray-900 text-white rounded-md
px-3 py-1.5 text-xs max-w-56` com `Arrow`.

**Nunca** usar o atributo `title` nativo, nem uma "bolha" `HelpCircle`/`group`
feita à mão, nem qualquer outro tooltip — só este componente compartilhado.

### Regra de truncamento em célula de tabela

- **Texto longo** (Descrição, Critério, qualquer campo de texto corrido):
  truncar em **2 linhas** com `line-clamp-2` + `break-words`, dentro de
  `<TooltipTrigger asChild>`; o texto completo vai no `<TooltipContent>`.
  `break-words` é obrigatório junto do `line-clamp` — sem ele, um token único
  muito longo estoura a largura fixa da coluna mesmo com `table-layout: fixed`.
- **Nome curto** (Nome da avaliação, Nome da habilidade, etc.): truncar em
  **1 linha** com `truncate` + `<Tooltip>` com o valor completo, quando o
  nome puder passar da largura da coluna.
- Placeholder de célula vazia é sempre `-` (hífen simples), nunca `—`
  (travessão) — ver "Regra permanente de texto" (nenhum travessão em
  interface).

### Exceções sem truncamento algum (decisões conscientes)

- **`NiveisProficiencia.tsx`** — tabela de consulta com 5 linhas fixas; a
  coluna Descrição mostra o texto inteiro (`block max-w-md`), sem
  `line-clamp` nem Tooltip. Decisão explícita (confirmada por Alice,
  2026-09-17): os 5 níveis são conteúdo fixo do sistema (não texto variável
  digitado por usuário como Descrição de Habilidade/Critério), então não há
  risco de um texto inesperadamente longo — o padrão de clamp+Tooltip existe
  para proteger contra texto de tamanho imprevisível, o que não se aplica
  aqui. Padding da célula continua o padrão responsivo (`px-3 md:px-6 py-3
  md:py-4`) — só o clamp/Tooltip da Descrição fica de fora.
- **`MatrizCell.tsx`** — o critério do nível na célula da Matriz usa
  `line-clamp-3` sem Tooltip (decisão de produto documentada em
  `04-regras-negocio.md` > "Conteúdo da célula preenchida").

## Filtros e Pills

### Chip — padrão vigente das listagens principais (decisão 2026-09-16)

As 5 listagens principais do Admin — **Habilidades, Avaliações, Carreiras,
Competências e Perfis** — usam o filtro de status em **chip**
(`ui/ChipFiltro.tsx`). Competências, Carreiras e Avaliações via
`<ListingPage statusFilterVariant="chip">`. **Habilidades e Perfis usam
toolbar manual dentro de `ContentArea.tsx` (`Table` bruto, sem
`ListingPage`)** — exceção sancionada, mesmo caminho para as duas: sempre
que a tela precisa de mais de 1 filtro extra além de busca+status,
`ListingPage` não tem slot pra isso, então a tela monta a própria toolbar
com `ChipFiltro`s lado a lado. Habilidades: Competência (searchable) + Tipo
+ Status. Perfis: Status + Gerência (searchable) + Cargo (searchable). Não
é um desvio acidental do padrão `ListingPage` — é a mesma exceção aplicada
duas vezes pelo mesmo motivo; qualquer tela nova com 2+ filtros além de
status segue este caminho, não tenta forçar `ListingPage`.

Substituiu o segmented control (pills) nessas 5 telas depois de testado nas
rotas `/testes/habilidades-chip` e `/testes/avaliacoes-chip` (removidas —
produção já faz a mesma coisa).

Botão fechado mostrando "Label: valor atual" + chevron; ao clicar, abre um
popover com as opções (escolha única). Mesma lógica de filtragem de antes —
só o controle visual mudou.

**Exceção que continua em pills** — não faz parte da migração:
- **Pills-no-cartão em telas de detalhe**: `CompetenciaDetalhePage.tsx` e
  `ParticipanteResultadoPage.tsx` são telas de detalhe, não listagens
  principais — mantêm o segmented control pills.

### Classes — Pills (ainda vigente nas exceções acima)
```
Container:    flex items-center bg-gray-100 rounded-lg p-1
Item ativo:   px-3 py-2 text-sm font-normal rounded-md bg-white text-gray-900 shadow-sm whitespace-nowrap
Item inativo: px-3 py-2 text-sm font-normal rounded-md text-gray-600 hover:text-gray-900 whitespace-nowrap
Campo busca:  pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm
              focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent
```

### Opções de filtro por contexto
- Competências / Habilidades / Carreiras / Jornadas → Todos / Ativas / Desativadas
- Níveis → (sem filtros — tela somente consulta)
- Perfis → Todas / Ativas / Desativadas
- Avaliações Admin → Todas / Ativas / Rascunho / Agendadas / Encerradas
- Avaliações Colaborador → Todos / Não iniciada / Em andamento / Concluída / Expirada

### Regras
- Aba padrão: sempre "Ativos/Ativas" — nunca "Todos"
- Dropdowns: Radix Select — nunca `<select>` nativo. Para listas longas
  (ex: as 22 gerências no cadastro de Carreira, competências no drawer de
  Habilidade), usar `SearchableSelect` (`ui/SearchableSelect.tsx`) — variante
  aprovada que envolve o Radix Select com um campo de busca interno; mesma
  aparência de trigger, `placeholder`/`searchPlaceholder`/`emptyMessage`/
  `disabled` como props. Também disponível via `FormDrawer` com
  `type: 'searchable-select'`.
- Filtros com seleção: contador no botão ("Gerência (2)") — nunca tags separadas
- Ao aplicar filtro ou busca: resetar para página 1

## Cards

- Sempre `bg-white border border-gray-200 rounded-lg` — nunca shadow
- Padding padrão: `p-5` — nunca `p-6` ou maior
- Card de identificação: exceção — `rounded-xl` + gradiente slate
- Card de cargo atual: `bg-[var(--brand-50)]` apenas quando cargo atual
- Ícone em card de métrica: sempre à direita, `w-5 h-5 flex-shrink-0`, nunca wrapper colorido
  Exceção — Colaborador: ver "Cards de métrica" abaixo.
- Ação inline "Ver todos →": `text-[var(--brand-600)]`, nunca botão com fundo

### Cards de métrica
`bg-white border border-gray-200 rounded-lg p-5`
- Label: `text-base font-semibold text-gray-700`
- Valor: `text-3xl font-bold text-gray-900`
- Ícone: `w-5 h-5 text-[var(--brand-600)] flex-shrink-0` — sempre à direita, sem wrapper
- Nunca shadow — apenas border

Exceção documentada — Colaborador: cards de métrica em telas do Colaborador
(ex: `ColaboradorView.tsx`) podem usar wrapper colorido no ícone —
`bg-[var(--brand-100)]` de fundo, ícone `w-5 h-5 text-[var(--brand-600)]`.
Cards de métrica do Admin continuam sem wrapper, conforme regra geral acima.

Dentro dessa exceção, o tom do wrapper é neutro (brand) por padrão, EXCETO
nos cards com significado de status definido:
- Aderência ao cargo, Avaliações em aberto, Próxima avaliação: neutro —
  `bg-[var(--brand-100)]` / `text-[var(--brand-600)]`.
- Avaliações concluídas: `bg-green-100` / `text-green-800` — reaproveita
  direto o token já usado nos badges de status `Concluída`
  (Estado do colaborador na avaliação) e `Ativa` (Status de registro),
  sem criar cor nova.
- Habilidades abaixo do esperado: `bg-amber-100` / `text-amber-600` — novo
  padrão, registrado aqui pela primeira vez, específico para wrapper de
  ícone em card de métrica.

  Nota — coexistência com o indicador de texto: em "Indicadores de
  habilidade do colaborador" (04-regras-negocio.md) já existe
  `Abaixo do esperado: text-xs text-red-500`, mas isso é um rótulo de
  texto INLINE dentro de uma lista de habilidades (ex: ao lado do nome de
  cada habilidade), contexto diferente deste wrapper de ÍCONE em card de
  métrica agregado. As duas cores para "abaixo do esperado" (vermelho no
  texto inline, âmbar no wrapper do card) coexistem por serem usos
  diferentes — não é inconsistência a "corrigir", não alinhar as duas.

## Drawers

### Anatomia completa
```
Largura:  w-full (mobile) · md:w-[560px] (desktop) — FIXA, nunca relativa à
          viewport. Vale para os 3 painéis laterais: FormDrawer,
          SelectionDrawer, ConfigurarHabilidadesCargo.
          Motivo: largura relativa (%/vw) recalculava o layout quando o
          scroll-lock do Radix aparecia/somia a barra de rolagem da página,
          fazendo o drawer "pular" na horizontal.
Header:   px-4 md:px-6 py-3 md:py-4 border-b border-gray-200
          título: text-base md:text-lg lg:text-xl font-semibold text-gray-900
          X:      p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg
Campos:   flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-5
Footer:   border-t border-gray-200 bg-gray-50 px-4 md:px-6 py-3 md:py-4
          Cancelar: border border-gray-300 text-gray-700 hover:bg-gray-50
          Salvar:   border border-[var(--brand-600)] text-[var(--brand-600)] hover:bg-[var(--brand-50)]
```

### Regras
- Somente leitura: apenas botão "Fechar" (outline neutro)
- Edição: Cancelar + Salvar
- Criação: Cancelar + Criar/Salvar
- Campos obrigatórios: `<span className="text-red-500">*</span>`
- Nunca dois drawers simultaneamente
- Footer sempre fixo, nunca dentro do scroll
- Campos com `flex-1 overflow-y-auto` para respeitar footer fixo

## Modais

### Variantes
- Destrutiva: ícone `bg-red-100 text-red-600`, botão `bg-red-600 hover:bg-red-700`
- Atenção: ícone `bg-yellow-100 text-yellow-600`, botão `bg-yellow-600 hover:bg-yellow-700`
- Neutra: ícone `bg-[var(--brand-100)] text-[var(--brand-600)]`, botão `bg-[var(--brand-600)] hover:bg-[var(--brand-700)]`

### Anatomia
```
Overlay:   fixed inset-0 bg-black/35 z-50 flex items-center justify-center p-4
Container: bg-white rounded-lg shadow-xl max-w-md w-full
Ícone:     w-12 h-12 rounded-full flex items-center justify-center
Conteúdo:  text-center mb-6
           título: text-lg font-semibold text-gray-900 mb-2
           descrição: text-sm text-gray-600
Ações:     flex items-center gap-3 — ambos com flex-1
```

### Regras
- Sem botão X — fechar só pelo Cancelar ou clique no overlay
- Descrição deve mencionar o impacto da ação
- Título sempre menciona o nome do item afetado
- Nunca empilhar dois modais
- Nunca usar modal para formulários com mais de 2 campos

## Formulários

### Classes
```
Label:          text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2 block
Input normal:   w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent
Input erro:     substituir border-gray-300 por border-red-300 + focus:ring-red-500
Textarea:       resize-none rows=4
Contador chars: text-xs text-gray-400 mt-1 text-right
Msg de erro:    text-sm text-red-600 mt-1
Hint text:      text-xs text-gray-500 mt-1
Desabilitado:   bg-gray-50 opacity-50 cursor-not-allowed
```

### Regras
- Ordem: label → input → hint text → mensagem de erro
- Nunca autofocus em campos de drawer
- Datas: `input type="date"` — sem date picker customizado
- Label sempre acima — nunca placeholder substituindo label
- Nunca `border-red` no label — apenas no input

## Estados vazios

### A — EmptyState (ui/EmptyState.tsx) — listas admin
Usar sempre o componente — nunca duplicar inline.
```
container:     flex flex-col items-center justify-center py-12 px-4
ícone wrapper: w-12 md:w-16 h-12 md:h-16 bg-gray-100 rounded-full
               flex items-center justify-center mb-4 text-gray-400
ícone:         w-8 h-8 (via prop)
título:        text-sm md:text-base lg:text-lg font-medium text-gray-900 mb-2
descrição:     text-xs md:text-sm text-gray-500 text-center max-w-md mb-6
ação:          bg-[var(--brand-600)] text-white (opcional)
```

### B — Orientativo — contexto colaborador
```
container: bg-white border border-gray-200 rounded-lg p-8 text-center
ícone:     w-8 h-8 text-gray-300 mx-auto mb-3 (sem wrapper)
título:    text-sm font-medium text-gray-700 mb-1
descrição: text-sm text-gray-500
```

### C — Painel compacto — dentro de drawers
```
container: text-center py-8 bg-gray-50 rounded-lg border border-gray-200
título:    text-sm text-gray-500
detalhe:   text-xs text-gray-400 mt-1
```

### D — Inline mínimo — dentro de td ou listas
```
em td: px-3 md:px-6 py-8 text-center text-sm text-gray-500
em p:  text-xs text-gray-500 text-center py-4
```

## Paginação

### Algoritmo de janela
- `totalPages ≤ 5` → todas as páginas
- `currentPage ≤ 3` → 1 2 3 4 … N
- `currentPage ≥ N−2` → 1 … N−3 N−2 N−1 N
- demais → 1 … p−1 p p+1 … N

### Classes
- "Exibindo" só no desktop: `hidden md:inline`
- Reticências: `<span>` não `<button>`
- Página ativa: `bg-gray-100 text-gray-900 border border-gray-200`
- Página inativa: `text-gray-600 bg-white border border-gray-300 hover:bg-gray-50`
- Ao aplicar filtro ou busca: resetar para página 1

## Mensagens de orientação

### A — Informativo contextual (brand)
```
bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3
ícone: Info w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5
texto: text-sm text-gray-700
```

### B — Instrução de formulário (slate)
```
bg-slate-100 border border-slate-300 rounded-lg p-4 flex items-start gap-3
ícone: Info w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5
label "Instruções:": font-medium text-slate-800
```

### C — Aviso de estado (yellow)
```
bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 flex items-start gap-2
ícone: AlertTriangle w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5
texto: text-sm text-yellow-800 (texto corrido — sem título/label separado)
```
Quando usar: indica o estado atual da tela ou o resultado de uma ação recente
que o usuário deve saber antes de prosseguir — nunca bloqueia.
Ex.: duplicidade de nome / "sem colaboradores selecionados" em
`FormularioAvaliacao.tsx`; "gerência com carreira anterior" no drawer de
Criar Carreira (`ContentArea.tsx`, via `customContent` do `FormDrawer`).

### Regras
- Sempre `items-start` — nunca `items-center`
- Sempre `mt-0.5` e `flex-shrink-0` no ícone
- Nunca usar para erros de campo

## Wizard stepper

- Completo: `bg-[var(--brand-600)] text-white`; label `text-gray-500`; linha `bg-[var(--brand-600)]`; exibe ✓
- Ativo: `bg-[var(--brand-600)] text-white ring-2 ring-offset-1 ring-[var(--brand-300)]`; label `text-[var(--brand-600)] font-medium`
- Inativo: `bg-gray-100 text-gray-400 border border-gray-200`; label `text-gray-400`; linha `bg-gray-200`

---
