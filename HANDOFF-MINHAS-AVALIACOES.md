# Minhas Avaliações & Responder Avaliação — documentação de handoff

> Gerado a partir de leitura direta do código-fonte em 2026-07-27. Todo trecho
> de código citado abaixo foi conferido contra o arquivo real no momento da
> escrita — nada aqui foi descrito de memória. Se o código mudar depois desta
> data, este documento pode ficar desatualizado; confira sempre contra a fonte.
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
  (listagem), `src/app/components/RespostaAvaliacao.tsx` (formulário de
  resposta), `src/app/utils/avaliacoes.ts` (funções compartilhadas de
  cálculo/formatação), `src/app/context/AvaliacoesContext.tsx` (fonte de
  dado + mutações).
- **Rotas** (`src/app/routes.ts:46-49`):
  ```ts
  { path: "meu-perfil", Component: MeuPerfilPage },
  { path: "minhas-avaliacoes", Component: MinhasAvaliacoesPage },
  { path: "minhas-avaliacoes/responder/:avaliacaoId", Component: RespostaAvaliacaoPage },
  { path: "minhas-avaliacoes/resultado/:avaliacaoId", Component: ResultadoAvaliacaoPage },
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
(`AvaliacoesContext.tsx:26`, hoje `'2026-07-23-4'`) — sempre que a estrutura
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
(`utils/avaliacoes.ts:66-68`), reusada por `MinhasAvaliacoes.tsx` (linhas
132-147) e por `getProximaAvaliacaoInfo`. Uma avaliação "Não iniciada"/"Em
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

(`MinhasAvaliacoes.tsx:96-100`). O badge desaparece quando o que acontecer
primeiro: o colaborador clica em "Iniciar avaliação"/"Continuar avaliação"
(`marcarComoVisualizada` grava `visualizada: true` — `AvaliacoesContext.tsx:91-101`,
chamado em `handleResponderClick`), ou os 5 dias expiram (cálculo automático,
sem gravação). Avaliações com badge "Nova" ativo aparecem **sempre primeiro**
na lista (`.sort((a, b) => Number(bNova) - Number(aNova))`,
`MinhasAvaliacoes.tsx:164-168`).

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

**Atenção — dois conjuntos de cor distintos para a mesma banda**, ambos
derivados do mesmo limiar mas com tokens diferentes:
- Card-resumo "Próxima avaliação encerra em" (`corUrgenciaDias`,
  `MinhasAvaliacoes.tsx:43-48`): `text-red-400` (vermelho) / `text-yellow-500`
  (amarelo) / `text-[var(--brand-600)]` (neutro).
- Badge de contagem regressiva por card (`badgeUrgenciaCard`,
  `MinhasAvaliacoes.tsx:54-62`): `border-red-300 text-red-700` (vermelho) /
  `border-yellow-400 text-yellow-800` (amarelo).

O filtro "Urgente"/"Sem urgência" usa `dias <= 10` (`MinhasAvaliacoes.tsx:160`),
coerente com o corte "sem badge" acima de 10 dias.

### 2.6 Tipo de avaliação (Técnica/Comportamental)

Não existe campo de "tipo" na entidade `Avaliacao` — o tipo é **derivado**
das habilidades que ela contém (`tiposDaAvaliacao`, `MinhasAvaliacoes.tsx:75-82`,
duplicada de forma equivalente dentro de `RespostaAvaliacao.tsx` via badge por
habilidade, ver 4.4). Cada habilidade é `Técnica` ou `Comportamental` em
`habilidadesData`; uma avaliação pode exibir os dois badges de tipo
simultaneamente se misturar habilidades dos dois tipos.

### 2.7 Terminologia

Sentence case em todos os textos de interface (nunca Title Case ou CAIXA ALTA
fora de cabeçalho de tabela). Na prática, o texto voltado ao colaborador evita
"autoavaliação" na maior parte da tela (prazo, botões, cards usam
"avaliação") — **exceto** o heading interno do container de Instruções em
Responder Avaliação, que usa literalmente "Como funciona a **autoavaliação**:"
(`RespostaAvaliacao.tsx:139`). Não é um texto solto por engano — é o único
lugar da tela onde a palavra aparece; qualquer novo texto deve seguir o
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
seus resultados" (`MinhasAvaliacoes.tsx:272-277`).

### 3.2 Cards de métrica (topo, nesta ordem)

1. **Avaliações em aberto** — `naoIniciadas.length + emAndamento.length`,
   ícone `Clock` neutro.
2. **Próxima avaliação encerra em** — dias + nome da avaliação
   correspondente (texto secundário, `line-clamp-1`), cor do texto/ícone
   conforme a faixa de urgência (regra 2.5, via `corUrgenciaDias`). Fonte:
   `getProximaAvaliacaoInfo` (`utils/avaliacoes.ts:75-94`) — mesma função
   usada por `ColaboradorView.tsx` (Meu Perfil), para as duas telas nunca
   divergirem.
3. **Avaliações concluídas** — `concluidas.length`, ícone `CheckCircle2`
   neutro.

### 3.3 Seção "Avaliações em aberto"

- Título solto na página (`<h2>`, sem container envolvendo a seção inteira).
- Container único de filtros (`MinhasAvaliacoes.tsx:314-351`):
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

**Cada card contém** (`MinhasAvaliacoes.tsx:371-440`):
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
  (`MinhasAvaliacoes.tsx:450-452`).
- `ListingPage` (mesmo componente usado pelo Admin) com busca por nome +
  chips de status ("Todas"/"Concluída"/"Expirada").
- Colunas (`historicoColumns`, linhas 226-252): **Avaliação realizada**
  (nome) · **Conclusão** (`ultimaDataResposta`, nunca `periodoFim`; "—"
  quando `Expirada` sem resposta) · **Habilidades** (quantidade) · **Status**
  (badge `Concluída` verde / `Expirada` cinza).
- Ação: ícone `Eye` ("Visualizar" via tooltip), só aparece quando
  `temResultado` (i.e., `status === 'Concluída'`) — navega para
  `/minhas-avaliacoes/resultado/:id`.

## 4. Tela: Responder Avaliação

### 4.1 Cabeçalho

- Botão voltar ("← Minhas Avaliações", `ArrowLeft` + `gap-1.5` + `mb-6`).
- Nome da avaliação (`<h1>`).
- "Prazo: DD/MM/AAAA" — só a data de encerramento (`formatData(periodoFim)`);
  não exibe mais o período completo nem "Tipo: Autoavaliação".

### 4.2 Container de instruções

- Componente expansível (accordion próprio, `useState` local), fechado por
  padrão.
- Trigger: ícone `Lightbulb` + texto "Instruções" (`text-base font-semibold`),
  cor `var(--brand-600)`, borda `var(--brand-600)`, fundo branco.
- Conteúdo (ao expandir), heading "Como funciona a autoavaliação:" + bullets
  (`RespostaAvaliacao.tsx:139-144`):
  1. Para cada habilidade, escolha o nível que melhor representa seu
     conhecimento atual, com base nos critérios de cada opção.
  2. Não teve contato com a habilidade ou não sabe avaliar seu nível?
     Marque "Sem conhecimento" em vez de chutar uma resposta.
  3. Sua resposta é comparada ao nível esperado para o seu cargo atual e
     ajuda a identificar oportunidades de desenvolvimento. Ela não garante
     promoção nem muda seu cargo automaticamente.
  4. Você pode salvar como rascunho e continuar depois, ou enviar quando
     finalizar todas as habilidades.

### 4.3 Blocos por competência

- Cada competência é um accordion próprio: título (`text-base font-medium`)
  + contador "X de N habilidades avaliadas" (`text-sm text-gray-500`).
- Container `bg-white rounded-lg border border-gray-200`.

### 4.4 Bloco por habilidade

- Nome da habilidade (`text-sm font-semibold`) + descrição
  (`text-sm text-gray-600`), com **badge de tipo à direita** do bloco
  (Técnica: `bg-[var(--brand-100)] text-[var(--brand-800)]`; Comportamental:
  `bg-purple-100 text-purple-800` — `RespostaAvaliacao.tsx:198-206`, não
  mencionado no rascunho original).
- Grid de cards de nível, todos no **mesmo formato/tamanho** (`p-3 rounded-lg
  border-2 flex flex-col items-start` — o `flex flex-col` é necessário para
  o conteúdo alinhar no topo mesmo quando um card vizinho tem mais linhas de
  texto; sem isso o texto ficava centralizado verticalmente):
  - **"Sem conhecimento"** é sempre o primeiro card do grid. Descrição:
    "Ainda não teve contato ou não sabe avaliar seu nível atual."
  - Demais cards: um por nível aplicável daquela habilidade específica
    (`habilidade.niveis`, nunca `niveisDefaultData` inteiro — que mistura as
    duas escalas do sistema, Básico/Avançado e Iniciante/Aprendiz).
  - Card selecionado: borda/texto na cor do nível (`getCorFromPeso`); "Sem
    conhecimento" selecionado usa cor neutra (`border-gray-400 bg-gray-100`),
    nunca derivada de peso.
- Não há mais o label "Selecione seu nível:" acima do grid (removido).

### 4.5 Rodapé (fixo)

- Contador: "X de Y habilidades avaliadas (Z%)".
- Botões: "Salvar rascunho" (secundário, `handleSalvarRascunho`) e "Enviar
  avaliação" (primário, `handleEnviar`).
- **O envio é validado**: o botão fica `disabled` enquanto
  `respondidas < totalHabilidades` (`RespostaAvaliacao.tsx:288`), e
  `handleEnviar` também bloqueia com `toast.error('Por favor, avalie todas
  as habilidades antes de enviar.')` caso seja chamado sem 100% de
  completude (linhas 90-94) — **não** é permitido enviar parcialmente.
- **Nota técnica sobre "fixo"**: o rodapé é um irmão do conteúdo scrollável
  dentro de um `<main>` `flex flex-col h-[calc(100vh-4rem)]`
  (`RespostaAvaliacaoPage.tsx`), com o conteúdo em
  `flex-1 overflow-y-auto scrollbar-thin` — nunca `position: sticky`/`fixed`
  com hack de margem negativa (abordagem antiga, que só "grudava" durante o
  scroll e não fixava quando o conteúdo era curto). Esse padrão replica o já
  usado em `CriarJornadaPage.tsx`/`EditarJornadaPage.tsx`/
  `JornadaDetalhePage.tsx`. Depende de `Layout.tsx` ter `flow-root` no
  container raiz (`<div className="min-h-screen flow-root">`) — sem isso, o
  `margin-top` do `<main>` "vaza" por margin-collapse e cria um segundo
  scroll fantasma de 64px no nível do documento (bug real encontrado e
  corrigido nesta base de código).

### 4.6 Efeito no envio

Ao enviar, a resposta é gravada via `responderAvaliacao()` no
`AvaliacoesContext` (efeito imediato, sem reload):
- status do participante muda para `Concluída`;
- os cards de métrica de "Meu Perfil" e a listagem de "Minhas Avaliações"
  refletem a mudança porque leem do mesmo Context.

### 4.7 Comportamento não coberto por tratamento de erro (edge case real)

`avaliacao = avaliacoes.find(a => a.id === avaliacaoId)!` e
`participanteAtual = avaliacao.participantes.find(p => p.colaboradorId ===
JOAO_ID)!` usam non-null assertion em ambas as telas (`RespostaAvaliacao.tsx:22-23`,
`ResultadoAvaliacao.tsx` equivalente). Não há fallback visual (mensagem de
"avaliação não encontrada", redirecionamento, etc.) — um `avaliacaoId`
inválido na URL ou um colaborador sem participação nessa avaliação quebra a
tela. Comportamento real hoje, não documentado no rascunho original; registrar
como limitação conhecida, não como bug a corrigir silenciosamente aqui.

## 5. Pendências conhecidas

- **Avaliação desconectada da matriz do cargo**: hoje o RH escolhe
  habilidades livremente ao criar uma avaliação, sem vínculo automático com
  a matriz de cargos do público-alvo. Decisão em aberto: toda habilidade
  avaliável deveria pertencer a alguma jornada/matriz — ainda não
  implementado no fluxo de criação (Admin).
- Tela de **Resultado da Avaliação** (pós-resposta): fora do escopo deste
  documento.

## Apêndice — Correções em relação ao rascunho

| # | Seção do rascunho | Divergência | Correção aplicada |
|---|---|---|---|
| 1 | 2.5 (urgência) | Tabela dizia "6-10 dias = âmbar / 2-5 dias = vermelho" | Real: `>=5 dias` já é âmbar, só `<5` é vermelho. Corrigido para "5-10 âmbar / 0-4 vermelho", e documentados os dois conjuntos de tokens de cor distintos (card-resumo vs badge por card) |
| 2 | 2.7 (terminologia) | Afirmava que "autoavaliação" nunca aparece na UI | O próprio rascunho cita "Como funciona a autoavaliação:" na seção 4.2 — regra reescrita para tratar isso como exceção documentada, não como violação a esconder |
| 3 | 4.5 (rodapé) | Dizia que "Enviar avaliação" não valida completude | Código valida: botão `disabled` + `toast.error` bloqueiam envio parcial — corrigido |
| 4 | 4.4 (bloco por habilidade) | Não mencionava a badge de tipo (Técnica/Comportamental) ao lado do nome | Adicionada à descrição da seção |
| 5 | 4.5 (rodapé) | Não explicava a arquitetura do "fixo" | Adicionada nota técnica sobre `flex flex-col h-[calc(100vh-4rem)]` + `flow-root` em `Layout.tsx` (correção de bug real de scroll duplo) |
| 6 | — | Nenhuma menção a comportamento sem tratamento de erro | Adicionada seção 4.7 sobre `avaliacaoId`/participante inválido |

Nenhum código morto foi encontrado nos arquivos revisados.
