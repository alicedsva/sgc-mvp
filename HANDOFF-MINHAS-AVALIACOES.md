# Minhas Avaliações & Responder Avaliação — documentação de handoff

> Gerado a partir de leitura direta do código-fonte em 2026-07-27, revisado e
> corrigido em 2026-07-31 contra o estado atual do código (ver Apêndice). Todo
> trecho de código citado abaixo foi conferido contra o arquivo real no
> momento da escrita — nada aqui foi descrito de memória. Se o código mudar
> depois desta data, este documento pode ficar desatualizado; confira sempre
> contra a fonte.
>
> Escopo: telas **Minhas Avaliações** (listagem) e **Responder Avaliação**
> (formulário de resposta), ambas do perfil Colaborador. A tela de
> **Resultado da Avaliação** (visualização pós-resposta) está fora do escopo
> deste documento.

## 1. Visão geral

"Minhas Avaliações" é a tela de **ação** do Colaborador: mostra o que ele
precisa fazer agora (avaliações pendentes, prazos) e o histórico do que já
fez. É deliberadamente diferente de "Meu Perfil" (retrato geral) e "Minha
Carreira" (aprofundamento/trajetória) — não duplica métricas que já existem
nessas outras telas.

- **Arquivos principais**: `src/app/components/MinhasAvaliacoes.tsx`
  (listagem), `src/app/pages/RespostaAvaliacaoPage.tsx` (arquivo único —
  formulário de resposta em modo de foco fullscreen, sem componente
  separado, ver seção 4), `src/app/utils/avaliacoes.ts` (funções
  compartilhadas de cálculo/formatação), `src/app/context/AvaliacoesContext.tsx`
  (fonte de dado + mutações).
- **Rotas** (`src/app/routes.ts`):
  ```ts
  // Dentro de Layout:
  { path: "meu-perfil", Component: MeuPerfilPage },
  { path: "minhas-avaliacoes", Component: MinhasAvaliacoesPage },
  { path: "minhas-avaliacoes/resultado/:avaliacaoId", Component: ResultadoAvaliacaoPage },
  // Rota irmã, fora de Layout — modo de foco (ver 4.1):
  { path: "/minhas-avaliacoes/responder/:avaliacaoId", Component: RespostaAvaliacaoPage },
  ```
  Cada rota lê o `avaliacaoId` via `useParams()` e busca o dado real via
  `useAvaliacoes()` — não recebe o objeto inteiro via prop de um componente pai.
- **Usuário único com dados reais**: **João Silva**, `JOAO_ID = '10'`
  (`src/app/pages/minhaCarreiraShared.tsx:20`), reusado como o colaborador
  logado em ambas as telas.

## 2. Regras de negócio (valem para as duas telas)

### 2.1 Fonte única de dado

Toda a tela lê de `AvaliacoesContext` (que hidrata de `avaliacoesData` em
`mockData.ts`). Não há array local, mock duplicado ou estado desconectado.
`responderAvaliacao()` (`AvaliacoesContext.tsx:69-86`) atualiza o participante
daquele colaborador de forma imutável (`prev.map(...)`, nunca muta
`avaliacoesData` original), persistindo na sessão via `localStorage`
(`STORAGE_KEY = 'carreiras_avaliacoes'`) e `MOCK_DATA_VERSION`
(`AvaliacoesContext.tsx:26`) — sempre que a estrutura
das avaliações no mock muda, essa versão precisa subir para descartar dados
antigos salvos no navegador.

### 2.2 Regra de "resposta mais recente"

Quando uma habilidade aparece em mais de uma avaliação, o nível considerado
"atual" do colaborador é sempre o de **maior `dataResposta` individual**
(nunca o `periodoFim` da avaliação inteira). Implementado em
`getHabilidadesAvaliadasColaborador` (`mockData.ts:4129-4148`):

```ts
for (const resposta of participante.respostas) {
  const data = resposta.dataResposta;
  const atual = resultado.get(resposta.habilidadeId);
  if (!atual || data > atual.data) {
    resultado.set(resposta.habilidadeId, { nivel: resposta.nivelRespondido, data });
  }
}
```

O comentário no código é explícito: usar `periodoFim` como proxy de recência
foi um bug já encontrado e corrigido (2026-07-21) — respostas mais novas de
uma habilidade podiam perder para uma avaliação mais antiga só porque a
avaliação como um todo tinha `periodoFim` maior.

### 2.3 Avaliação vencida sem resposta → Expirada automaticamente

Se o prazo (`periodoFim`) passa e o colaborador não enviou resposta, o status
efetivo do participante é `Expirada`, calculado dinamicamente — nunca gravado
manualmente. Fonte única: `estaVencida(periodoFim, hoje)`
(`utils/avaliacoes.ts:80-82`), reusada por `MinhasAvaliacoes.tsx` (linhas
136-151) e por `getProximaAvaliacaoInfo`. Uma avaliação "Não iniciada"/"Em
andamento" cujo prazo já passou sai de "Avaliações em aberto" e migra para o
Histórico como `Expirada` (mesmo tratamento visual da que já vinha gravada
assim no mock — `expiradasGravadas` e `expiradasPorPrazo` viram a mesma linha
de histórico, `MinhasAvaliacoes.tsx:198-202`).

### 2.4 Badge "Nova"

Cada participação tem `visualizada: boolean` (`schema.ts:153`). Uma avaliação
exibe o badge "Nova" quando `!visualizada` **e** ainda não passaram 5 dias
desde `periodoInicio`:

```ts
const DIAS_LIMITE_NOVA = 5;
function isAvaliacaoNova(participante, periodoInicio, hoje) {
  return !participante.visualizada && calcularDiasDesde(periodoInicio, hoje) < DIAS_LIMITE_NOVA;
}
```

(`MinhasAvaliacoes.tsx:102-104`). O badge desaparece quando o que acontecer
primeiro: o colaborador clica em "Iniciar avaliação"/"Continuar avaliação"
(`marcarComoVisualizada` grava `visualizada: true` — `AvaliacoesContext.tsx:91-101`,
chamado em `handleResponderClick`), ou os 5 dias expiram (cálculo automático,
sem gravação). Avaliações com badge "Nova" ativo aparecem **sempre primeiro**
na lista (`.sort((a, b) => Number(bNova) - Number(aNova))`,
`MinhasAvaliacoes.tsx:168-172`).

### 2.5 Sistema de urgência (prazo)

Aplicado individualmente a cada avaliação em aberto — cada card calcula sua
própria badge conforme seu `periodoFim`, não é "só a mais urgente de todas".
Limiares reais (`bandaUrgencia`, `MinhasAvaliacoes.tsx:31-36`):

| Dias restantes | Banda | Badge no card |
|---|---|---|
| Mais de 10 dias | neutro | sem badge |
| 5 a 10 dias | amarelo (âmbar) | "Vence em N dias" |
| 2 a 4 dias | vermelho | "Vence em N dias" |
| 1 dia | vermelho | "Vence amanhã" |
| 0 dias | vermelho | "Vence hoje" |

A mesma cor de texto é reaproveitada em dois lugares (nunca dois tons de
vermelho/amarelo divergentes) — só a borda do badge por card é um elemento
próprio, mais claro, no estilo outline:
- Card-resumo "Próxima avaliação encerra em" (`corUrgenciaDias`,
  `MinhasAvaliacoes.tsx:50-52`, que delega a `corUrgencia` em
  `MinhasAvaliacoes.tsx:44-48`): `text-red-600` (vermelho) / `text-yellow-600`
  (amarelo) / `text-[var(--brand-600)]` (neutro).
- Badge de contagem regressiva por card (`badgeUrgenciaCard`,
  `MinhasAvaliacoes.tsx:59-66`): `border-red-300` (vermelho) /
  `border-yellow-400` (amarelo), texto na mesma cor de `corUrgencia` (não é
  um segundo tom fixo separado — reusa a mesma função, só a borda muda).

O filtro "Urgente"/"Sem urgência" usa `dias <= 10` (`MinhasAvaliacoes.tsx:164`),
coerente com o corte "sem badge" acima de 10 dias.

### 2.6 Tipo de avaliação (Técnica/Comportamental)

Não existe campo de "tipo" na entidade `Avaliacao` — o tipo é **derivado**
das habilidades que ela contém (`tiposDaAvaliacao`, `MinhasAvaliacoes.tsx:75-82`,
duplicada de forma equivalente dentro de `RespostaAvaliacaoPage.tsx` via badge
por habilidade, ver 4.4). Cada habilidade é `Técnica` ou `Comportamental` em
`habilidadesData`; uma avaliação pode exibir os dois badges de tipo
simultaneamente se misturar habilidades dos dois tipos.

### 2.7 Terminologia

Sentence case em todos os textos de interface (nunca Title Case ou CAIXA ALTA
fora de cabeçalho de tabela). Na prática, o texto voltado ao colaborador evita
"autoavaliação" na maior parte da tela (prazo, botões, cards usam
"avaliação") — **exceto** o heading da etapa de Instruções em Responder
Avaliação, que usa literalmente "Como funciona a **autoavaliação**:"
(`RespostaAvaliacaoPage.tsx`, ver 4.2). Não é um texto solto por engano — é o
único lugar da tela onde a palavra aparece; qualquer novo texto deve seguir o
padrão "avaliação", tratando este heading como exceção já existente, não como
precedente para reintroduzir o termo em outros lugares.

### 2.8 Resposta "Sem conhecimento"

Ao responder, o colaborador pode marcar "Sem conhecimento" em vez de um nível
real, armazenado como sentinela `nivelRespondido: 'nao_sei'`
(`schema.ts:128-144`). Distinto de:
- `'not_required'` (usado em `HabilidadeCargo.nivelEsperado` — é o RH dizendo
  que aquela habilidade não é exigida pro cargo);
- status `'sem'` (`minhaCarreiraShared.tsx` — é o sistema dizendo que o
  colaborador nunca respondeu essa habilidade em nenhuma avaliação).

`'nao_sei'` **conta como gap real**: `getPesoFromNome('nao_sei')` retorna `0`
explicitamente (`mockData.ts:4110-4118`, checado antes do fallback genérico,
não por acaso), então `getStatus` sempre resolve para `'abaixo'` — nunca
`'sem'`. Essa distinção é intencional (documentada no próprio comentário da
interface em `schema.ts`) e não deve ser simplificada.

## 3. Tela: Minhas Avaliações (listagem)

### 3.1 Cabeçalho

Título "Minhas Avaliações" + subtítulo "Responda suas avaliações e acompanhe
seus resultados" (`MinhasAvaliacoes.tsx:276-281`).

### 3.2 Cards de métrica (topo, nesta ordem)

1. **Avaliações em aberto** — `naoIniciadas.length + emAndamento.length`,
   ícone `Clock` neutro.
2. **Próxima avaliação encerra em** — dias + nome da avaliação
   correspondente (texto secundário, `line-clamp-1`), cor do texto/ícone
   conforme a faixa de urgência (regra 2.5, via `corUrgenciaDias`). Fonte:
   `getProximaAvaliacaoInfo` (`utils/avaliacoes.ts:89-108`) — mesma função
   usada por `ColaboradorView.tsx` (Meu Perfil), para as duas telas nunca
   divergirem.
3. **Avaliações concluídas** — `concluidas.length`, ícone `CheckCircle2`
   neutro.

### 3.3 Seção "Avaliações em aberto"

- Título solto na página (`<h2>`, sem container envolvendo a seção inteira).
- Container único de filtros (`MinhasAvaliacoes.tsx:318-355`):
  - **Filtro de tipo**: chips "Todas"/"Técnica"/"Comportamental" (seleção
    única, `filtroTipo`).
  - **Filtro de urgência**: chips "Todas"/"Urgente"/"Sem urgência"
    (`filtroUrgencia`, urgente = `dias <= 10`).
  - Os dois filtros combinam em AND (`matchTipo && matchUrgencia`,
    linha 157-163).
  - Sem resultado: "Nenhuma avaliação encontrada com esse filtro." em vez de
    grid vazio sem explicação (linha 353-356).
- Grid de cards (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`), sem
  wrapper próprio além do grid em si.

**Cada card contém** (`MinhasAvaliacoes.tsx:376-443`):
- Badge(s) de tipo (canto superior esquerdo, ver regra 2.6).
- Badge de urgência (canto superior direito) e/ou badge "Nova" (mesma
  região) — ver regras 2.4/2.5.
- Nome da avaliação (`line-clamp-2`).
- Ícone `BookOpen` + "N habilidades" · ícone `Calendar` + "Prazo:
  DD/MM/AAAA".
- Barra de progresso: sempre visível (0% quando "Não iniciada"), percentual
  ao lado da barra, não como texto duplicado acima.
- Botão de ação, largura total, base do card: "Iniciar avaliação"
  (primário, `progresso === 0`) ou "Continuar avaliação"
  (secundário/outline, `progresso > 0`) — chama `handleResponderClick`, que
  marca `visualizada: true` e navega para `/minhas-avaliacoes/responder/:id`.
- Não há badge de status textual ("Não iniciada"/"Em andamento") — o status
  é comunicado só pela combinação barra + texto do botão.

### 3.4 Histórico de Avaliações

- Título "Histórico de avaliações" fora do container de filtro
  (`MinhasAvaliacoes.tsx:454-456`).
- `ListingPage` (mesmo componente usado pelo Admin) com busca por nome +
  chips de status ("Todas"/"Concluída"/"Expirada").
- Colunas (`historicoColumns`, linhas 230-256): **Avaliação realizada**
  (nome) · **Conclusão** (`ultimaDataResposta`, nunca `periodoFim`; "—"
  quando `Expirada` sem resposta) · **Habilidades** (quantidade) · **Status**
  (badge `Concluída` verde / `Expirada` cinza).
- Ação: ícone `Eye` ("Visualizar" via tooltip), só aparece quando
  `temResultado` (i.e., `status === 'Concluída'`) — navega para
  `/minhas-avaliacoes/resultado/:id`.

## 4. Tela: Responder Avaliação

> Reescrita em 2026-07-29 após a promoção do formato wizard fullscreen
> (antigo protótipo `/testes/resposta-sem-nome`) a rota oficial, substituindo
> por completo o formato anterior de accordion por competência (single-file
> `RespostaAvaliacao.tsx`, deletado). Arquivo único agora:
> `src/app/pages/RespostaAvaliacaoPage.tsx` — não há mais componente
> separado; a página não usa `useOutletContext`/`Layout`, ver 4.1.

### 4.1 Shell — modo de foco (fullscreen)

Rota irmã de nível raiz em `routes.ts`, **fora** da árvore de `Layout.tsx`
(sem Sidebar/Header do sistema):
```ts
{ path: "/minhas-avaliacoes/responder/:avaliacaoId", Component: RespostaAvaliacaoPage },
```
`RespostaAvaliacaoPage` lê `avaliacaoId` via `useParams()` (não recebe prop
de um componente pai) e monta o próprio wrapper mínimo — `<div
className="min-h-screen bg-gray-50">`, sem `mt-16`/`ml-*` nem
`useOutletContext` para estado da sidebar, já que não existe sidebar nesta
rota.

Fluxo em 2 passos, controlado por `useState<'instrucoes' | 'perguntas'>`:
1. **Instruções** — tela própria, card único, sem revelar quais
   competências/habilidades serão avaliadas antes de o colaborador clicar em
   "Começar" (ver 4.2).
2. **Perguntas** — wizard uma habilidade por vez + painel lateral de
   navegação (ver 4.3/4.4).

A barra superior sticky (nome + prazo + botão "Salvar e sair") só aparece na
etapa de perguntas — na etapa de Instruções o próprio card já mostra
nome/prazo, uma segunda barra repetiria a informação.

### 4.2 Etapa de Instruções

Card único (`bg-white border border-gray-200 rounded-lg`, `max-w-xl`),
centralizado na viewport inteira (`flex-1 flex items-center justify-center`,
já que não há Header/Sidebar nesta rota) — largura deliberadamente reduzida
em vez de ocupar a tela toda, sem painel lateral de competências — decisão
deliberada para não fazer *spoiler* do conteúdo da avaliação antes do
colaborador começar:
- Badge do tipo da avaliação (`avaliacao.tipo`, ex. "Autoavaliação").
- Nome da avaliação (`<h1>`) + meta: ícone `ListChecks` + "N habilidades",
  ícone `Calendar` + "Prazo de entrega: DD/MM/AAAA".
- Heading "Como funciona a autoavaliação:" + lista numerada (círculos
  cinza `1`-`4`, não bullets):
  1. Para cada habilidade, escolha a descrição que melhor representa seu
     conhecimento atual.
  2. Não conhece a habilidade? Marque "Sem conhecimento" em vez de chutar
     uma resposta.
  3. Sua resposta é comparada ao nível esperado do seu cargo atual e ajuda
     a identificar oportunidades de desenvolvimento. Não garante promoção.
  4. Você pode sair a qualquer momento — suas respostas ficam salvas.
- Botões "Começar" (primário, avança para a etapa de perguntas) e "Voltar"
  (terciário, navega para `/minhas-avaliacoes`).

Não é mais um accordion fechado por padrão (formato antigo) — é uma etapa
obrigatória própria, sempre visível antes do wizard.

### 4.3 Etapa de perguntas — wizard uma habilidade por vez

Substituiu por completo o formato antigo de accordion por competência com
todos os níveis expandidos simultaneamente. Duas colunas lado a lado (altura
igual entre as duas, calculada uma única vez no wrapper —
`lg:h-[calc(100vh-16rem)]` — nunca cada painel calculando a própria altura
de forma independente):

- **Painel principal** (esquerda, `flex-1`): barra de progresso
  ("Progresso da Autoavaliação", X de Y, Z%) acima do card; dentro do card,
  nome da competência + nome da habilidade + badge de tipo (Técnica/
  Comportamental) + descrição, depois a lista de opções de nível (4.4), e
  navegação "Anterior"/"Próxima habilidade" fixa na base do card
  (`flex flex-col` + a lista de opções em `flex-1 min-h-0 overflow-y-auto` —
  o card nunca estica, a lista rola internamente se não couber). "Próxima
  habilidade" fica `disabled` enquanto a habilidade atual não tiver resposta
  (`disabled={!respostas[habilidadeAtual.id]}`,
  `RespostaAvaliacaoPage.tsx:415`) — não é possível avançar sem responder a
  atual; na última habilidade este botão vira "Enviar avaliação" (ver 4.6).
- **Painel lateral** (direita, `w-72`): lista de todas as habilidades
  agrupadas por competência, cada uma com indicador de respondida (check
  branco sobre círculo de cor de marca, `border-[var(--brand-400)]
  bg-[var(--brand-400)]` — **não é mais verde**, correção em relação a uma
  versão anterior deste documento) ou pendente, e a habilidade atual
  destacada (`bg-[var(--brand-50)]`). Navegação restrita à ordem: `podeAcessar =
  respondida || indice === primeiroNaoRespondidoIndex` — só é possível
  clicar em uma habilidade já respondida (revisar/editar) ou na próxima
  ainda não respondida na sequência; as posteriores ficam `disabled`
  (`RespostaAvaliacaoPage.tsx:444`). Correção: uma versão anterior deste
  documento afirmava que era possível navegar para qualquer habilidade
  sem passar pelas anteriores — não é o comportamento real do código.

### 4.4 Opções de nível — nome do nível NUNCA visível

Divergência deliberada em relação ao formato antigo (que sempre mostrava o
nome do nível, ex. "Avançado"): aqui só o **critério/descrição** de cada
nível é exibido, em ordem de peso crescente — força a escolha pelo conteúdo
do critério em vez do rótulo:
- **"Sem conhecimento"** é sempre a primeira opção, com nome visível (não é
  um nível na escala, é uma categoria à parte) — "Ainda não teve contato ou
  não sabe avaliar seu nível atual."
- Demais opções: uma por nível aplicável daquela habilidade específica
  (`habilidade.niveis`, nunca `niveisDefaultData` inteiro), ordenadas por
  peso crescente (`getNiveisHabilidade(...).sort((a, b) => a.peso - b.peso)`)
  — sem o nome como pista, essa ordem é o único sinal restante de
  progressão.
- Opção selecionada: borda/texto na cor do nível (`getCorFromPeso`); "Sem
  conhecimento" selecionado usa cor neutra (`border-gray-400 bg-gray-100`),
  nunca derivada de peso.
- Radio próprio (`role="radio"`, `button`, sem `<label>`) — não usa
  `<input type="radio">` nativo.

### 4.5 Header — ação única "Salvar e sair" (rótulo dinâmico)

Substituiu os antigos botões separados "Salvar rascunho" (rodapé) + "Voltar"
(cabeçalho). Um único botão no header, à direita, estilo secundário
(`border-gray-300 text-gray-700`):
- **Rótulo muda conforme o progresso**: `{respondidas > 0 ? 'Salvar e sair' :
  'Sair'}` (`RespostaAvaliacaoPage.tsx:210`) — antes de qualquer resposta o
  botão mostra só "Sair" (nada para salvar ainda); assim que a primeira
  seleção é feita, passa a "Salvar e sair". Mesmo botão físico, mesmo
  `onClick` (`handleSalvarESair`) nos dois estados — só o texto muda.
- **Mecânica de dado inalterada**: cada seleção de nível já chama
  `responderAvaliacao(..., enviar: false)` imediatamente (`handleNivelChange`)
  — persistência real via `AvaliacoesContext`/`localStorage`, não é um
  auto-save "fake". "Salvar e sair" só reafirma esse estado (mesmo toast de
  sucesso do antigo "Salvar rascunho") e navega direto para
  `/minhas-avaliacoes` — uma ação só, sem diálogo de confirmação de "não
  salvo" (não há necessidade: nada fica sem persistir entre o clique numa
  opção e a saída).
- Não há mais indicador visual de "salvo automaticamente" na tela — a
  confirmação visível ao colaborador é sempre este botão.

### 4.6 Envio final — validação de 100% obrigatória

Preservado do formato antigo, sem enfraquecer: `handleEnviar`
(`RespostaAvaliacaoPage.tsx`) bloqueia com
`toast.error('Por favor, avalie todas as habilidades antes de enviar.')` se
`respondidas < totalHabilidades`, e só então chama
`responderAvaliacao(..., enviar: true)`. O botão "Enviar avaliação" (só
aparece na última habilidade do wizard) também fica `disabled` enquanto
`respondidas < totalHabilidades` — **não** é permitido enviar parcialmente,
nem pelo clique direto nem por engano.

Ao enviar com sucesso: status do participante muda para `Concluída` no
`AvaliacoesContext` (efeito imediato, sem reload), toast de sucesso, e
navegação para `/minhas-avaliacoes` após 1,5s. Os cards de métrica de "Meu
Perfil" e a listagem de "Minhas Avaliações" refletem a mudança porque leem
do mesmo Context.

### 4.7 Tratamento de erro — avaliação não encontrada / sem acesso

Depois de todos os hooks (nunca antes — regra dos hooks), a página verifica
`if (!avaliacao || !participanteAtual)` e renderiza um estado de erro
dedicado em vez de quebrar: ícone `AlertCircle` (fundo `bg-red-100`),
"Avaliação não encontrada" (quando o `avaliacaoId` da URL não existe) ou
"Você não tem acesso a esta avaliação" (quando existe mas o colaborador não
está entre os participantes), com botão "Voltar para Minhas Avaliações".

Nota de correção: uma versão anterior deste documento (seção 4.7 original)
registrava isso como uma **limitação conhecida, sem tratamento** — essa
afirmação já estava desatualizada em relação ao código antes mesmo desta
promoção (o antigo `RespostaAvaliacao.tsx` já tinha esse fallback
implementado). Corrigido aqui: o tratamento de erro sempre existiu no
formato antigo e foi portado integralmente para o novo.

## 5. Pendências conhecidas

- **Avaliação desconectada da matriz do cargo**: hoje o RH escolhe
  habilidades livremente ao criar uma avaliação, sem vínculo automático com
  a matriz de cargos do público-alvo. Decisão em aberto: toda habilidade
  avaliável deveria pertencer a alguma jornada/matriz — ainda não
  implementado no fluxo de criação (Admin).
- Tela de **Resultado da Avaliação** (pós-resposta): fora do escopo deste
  documento.

## Ver também — Design System

Material de apoio visual complementar a este handoff escrito, com os
componentes reais renderizados (não mockup): `/design-system/minhas-avaliacoes`
e `/design-system/responder-avaliacao` (rotas confirmadas em
`DesignSystemPage.tsx` — o slug de cada seção é sempre o último segmento do
`SectionId`, via `SECTION_TO_SLUG`/`SLUG_TO_SECTION`,
`DesignSystemPage.tsx:150-156`).

## Apêndice — Correções em relação ao rascunho

| # | Seção do rascunho | Divergência | Correção aplicada |
|---|---|---|---|
| 1 | 2.5 (urgência) | Tabela dizia "6-10 dias = âmbar / 2-5 dias = vermelho" | Real: `>=5 dias` já é âmbar, só `<5` é vermelho. Corrigido para "5-10 âmbar / 0-4 vermelho", e documentados os dois conjuntos de tokens de cor distintos (card-resumo vs badge por card) |
| 2 | 2.7 (terminologia) | Afirmava que "autoavaliação" nunca aparece na UI | O próprio rascunho cita "Como funciona a autoavaliação:" na seção 4.2 — regra reescrita para tratar isso como exceção documentada, não como violação a esconder |
| 3 | 4.5 (rodapé) | Dizia que "Enviar avaliação" não valida completude | Código valida: botão `disabled` + `toast.error` bloqueiam envio parcial — corrigido |
| 4 | 4.4 (bloco por habilidade) | Não mencionava a badge de tipo (Técnica/Comportamental) ao lado do nome | Adicionada à descrição da seção |
| 5 | 4.5 (rodapé) | Não explicava a arquitetura do "fixo" | Adicionada nota técnica sobre `flex flex-col h-[calc(100vh-4rem)]` + `flow-root` em `Layout.tsx` (correção de bug real de scroll duplo) |
| 6 | — | Nenhuma menção a comportamento sem tratamento de erro | Adicionada seção 4.7 sobre `avaliacaoId`/participante inválido |
| 7 | 4.3 (painel lateral) | Dizia que clicar em qualquer habilidade navega direto para ela, sem passar pelas anteriores | Real: `podeAcessar = respondida \|\| indice === primeiroNaoRespondidoIndex` restringe a navegação à ordem — só habilidade já respondida ou a próxima pendente são clicáveis |

### Revisão de 2026-07-31

Segunda auditoria completa contra o código real (não contra o rascunho original
desta vez, contra a própria versão de 2026-07-27 do handoff). Achados:

| # | Seção | Divergência | Correção aplicada |
|---|---|---|---|
| 8 | 4.3 (painel lateral) | Dizia "check verde" para indicador de respondida | Real: `border-[var(--brand-400)] bg-[var(--brand-400)]` — cor de marca, não verde |
| 9 | 4.5 (header) | Não mencionava que o rótulo do botão muda | Real: `{respondidas > 0 ? 'Salvar e sair' : 'Sair'}` (`RespostaAvaliacaoPage.tsx:210`) — só vira "Salvar e sair" após a primeira resposta |
| 10 | 4.3 (navegação) | Não mencionava que "Próxima habilidade" fica desabilitado sem resposta na atual | Adicionado: `disabled={!respostas[habilidadeAtual.id]}` (`RespostaAvaliacaoPage.tsx:415`) |
| 11 | 4.2 (instruções) | Não descrevia o layout do card (centralizado, `max-w-xl`) | Adicionado à descrição da etapa |
| 12 | 2.3, 2.4, 3.1–3.4, 4.3 | Praticamente todas as citações de linha de `MinhasAvaliacoes.tsx` e `utils/avaliacoes.ts` estavam desatualizadas (comentários explicativos adicionados aos arquivos deslocaram tudo abaixo deles) | Todas as citações de linha reconferidas e corrigidas contra o código de 2026-07-31 |
| 13 | 2.5 | Descrevia "dois conjuntos de tokens de cor distintos" entre o card-resumo e o badge por card | Real: `badgeUrgenciaCard` reusa a mesma função `corUrgencia` do card-resumo para o texto — só a borda (`border-red-300`/`border-yellow-400`) é própria do badge. Não são dois tons de vermelho/amarelo diferentes, é a mesma cor reaproveitada |
| 14 | Apêndice (nota de código morto) | Citava 3 comentários órfãos referenciando `RespostaAvaliacao.tsx` (deletado) em `routes.ts`, `RespostaAvaliacaoPage.tsx:13` e `MinhaCarreiraPage.tsx:520` | Localização estava errada (os 3 comentários reais estavam em `RespostaAvaliacaoPage.tsx:45,102,176`, não na linha 13, e não havia nada equivalente em `MinhaCarreiraPage.tsx:520`) — **e os 3 comentários no código foram corrigidos nesta revisão** (removida a referência ao arquivo deletado, mantido o contexto útil restante) |
| 15 | — | Nenhuma referência concreta ao Design System como material de apoio | Adicionada seção "Ver também — Design System" com as rotas `/design-system/minhas-avaliacoes` e `/design-system/responder-avaliacao` |

Nenhum código morto adicional foi encontrado nos arquivos revisados nesta
passada.
