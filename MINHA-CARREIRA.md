# Minha Carreira — documentação de handoff

> Gerado a partir de leitura direta do código-fonte em 2026-07-16. Todo trecho de
> código citado abaixo foi colado do arquivo real no momento da escrita —
> nada aqui foi descrito de memória. Se o código mudar depois desta data, este
> documento pode ficar desatualizado; confira sempre contra a fonte.
> Complemento adicionado em 2026-07-17 (seção 6): configuração literal dos
> gráficos recharts e corpo completo das funções de cálculo, a pedido
> explícito para eliminar qualquer paráfrase.

## 1. Visão geral

"Minha Carreira" é uma tela do módulo **Colaborador** do Sistema de Gestão de
Carreiras. Mostra a um colaborador sua trajetória de cargos, o quanto ele
atende às exigências do cargo atual, como isso se compara aos colegas no
mesmo cargo, onde ele tem as maiores lacunas de desenvolvimento, e o detalhe
de cada competência avaliada.

- **Usuário único com dados reais**: **João Silva**, `id = '10'`, cargo atual
  `cargoId = 'c2'` ("Desenvolvedor Pleno"). Confirmado em
  `src/app/data/mockData.ts:680-693` e em `JOAO_ID='10'` /
  `JOAO_CARGO_ATUAL='c2'` (`src/app/pages/minhaCarreiraShared.tsx:19-20`).
  Ver seção 3 sobre até que ponto isso é generalizável para outros
  colaboradores.
- **Arquivo principal**: `src/app/pages/MinhaCarreiraPage.tsx` (rota
  `/minha-carreira`).
- **Página de detalhe de competência**: `src/app/pages/CompetenciaDetalhePage.tsx`
  (rota `/minha-carreira/competencia/:id`).
- **Lógica compartilhada entre as duas páginas**:
  `src/app/pages/minhaCarreiraShared.tsx` — funções de cálculo, tipos, e os
  componentes `AderenciaRing` e `PesoBars`, para que lista e detalhe nunca
  dupliquem a mesma lógica com o risco de divergir (ver histórico da
  unificação de cor no comentário de `getCorAnelLista`, seção 3).
- **Rotas** (`src/app/routes.ts:47-48`):
  ```ts
  { path: "minha-carreira", Component: MinhaCarreiraPage },
  { path: "minha-carreira/competencia/:id", Component: CompetenciaDetalhePage },
  ```
- **Navegação para o detalhe**: cada linha da lista de "Mapeamento de
  competências" tem um botão "Ver detalhes" que chama
  `navigate(\`/minha-carreira/competencia/${comp.competenciaId}\`)`
  (`MinhaCarreiraPage.tsx:896`). O botão "voltar" do detalhe faz
  `navigate('/minha-carreira', { state: { scrollTarget: MAPEAMENTO_COMPETENCIAS_SECTION_ID } })`
  (`CompetenciaDetalhePage.tsx:127`), e `MinhaCarreiraPage` lê esse
  `location.state.scrollTarget` num `useEffect` para reabrir a página já
  rolada até a seção, em vez de subir para o topo (`MinhaCarreiraPage.tsx:223-227`).

## 2. Estrutura da página (5 seções, em ordem)

A página é uma única página com scroll contínuo (não é wizard nem tem tabs).
Estrutura de alto nível (`MinhaCarreiraPage.tsx:387`):
```
<div className="p-4 md:p-8 space-y-10">
  Header
  <div className="space-y-6">      {/* bloco "Jornada + gráficos" */}
    1. Evolução profissional (timeline)
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      2. Aderência ao cargo (gauge)
      3. Contexto na empresa (benchmark de colegas)
    </div>
  </div>
  4. Oportunidades de desenvolvimento (cards de gap)
  5. Mapeamento de competências (filtros + lista → página de detalhe)
</div>
```
As seções 1–3 ficam visualmente mais próximas entre si (`space-y-6`) do que
das seções 4 e 5 (`space-y-10` entre grupos) — decisão de produto explícita
registrada em comentário (`MinhaCarreiraPage.tsx:397-403`).

### 2.1 Evolução profissional (timeline)

- **Propósito**: retrospecto — mostra só os cargos já ocupados por João, do
  primeiro ao atual. Sem cargos futuros, sem aderência calculada nesta seção.
- **Componente**: inline em `MinhaCarreiraPage.tsx:437-525` (IIFE dentro do
  JSX, não é um componente separado).
- **Dados**: `historicoCargosJoaoData` (`mockData.ts:3464-3468`) — array
  fixo por colaborador (só existe para João hoje):
  ```ts
  export const historicoCargosJoaoData: { cargoId: string | null; cargoNome?: string; dataInicio: string }[] = [
    { cargoId: null, cargoNome: 'Estagiário de Desenvolvimento', dataInicio: '2022-01' },
    { cargoId: 'c1', dataInicio: '2023-07' },
    { cargoId: 'c2', dataInicio: '2025-07' },
  ];
  ```
  O nome do cargo, quando `cargoId` existe, é sempre lido de `cargosData`
  (`cargoRM`) em tempo de render (`MinhaCarreiraPage.tsx:232-239`) — nunca
  duplicado no próprio array, para não divergir se o nome do cargo mudar.
  `cargoId: null` marca um cargo anterior à jornada cadastrada (ex: estágio).
- **Sem gráfico/biblioteca externa** — é HTML/CSS puro (divs posicionados),
  não usa recharts.
- **Cor**: token único `var(--brand-600)` para trilho e pontos dos cargos já
  ocupados; o ponto do cargo atual é o mesmo tamanho, só com preenchimento
  sólido em vez de vazio. Essa cor **não** faz parte do sistema de 3 cores de
  aderência (seção 3) — é puramente "marca/trajetória".

### 2.2 Aderência ao cargo (gauge)

- **Propósito**: mostra a média de quanto João atende às habilidades
  técnicas e comportamentais exigidas pelo seu cargo atual.
- **Componente**: inline em `MinhaCarreiraPage.tsx:552-624`.
- **Dados**: `habilidadesCargoAtualGauge = enriquecerMatriz(matrizParaCargo(JOAO_CARGO_ATUAL))`
  (`MinhaCarreiraPage.tsx:243-246`) — sempre a matriz do cargo atual de
  João, independente de qualquer seleção de cargo em outro lugar da tela
  (não existe seletor de cargo nesta página).
- **Fórmula exata** (`MinhaCarreiraPage.tsx:36-41` e `:255-258`):
  ```ts
  function calcularAderenciaPorTipo(lista: HabilidadeEnriquecida[], tipo: string): number {
    const avaliadas = lista.filter(h => h.tipo === tipo && h.status !== 'sem');
    if (avaliadas.length === 0) return 0;
    const atendidas = avaliadas.filter(h => h.status === 'acima' || h.status === 'no').length;
    return Math.round((atendidas / avaliadas.length) * 100);
  }
  // ...
  const aderenciaMedia = Math.round((aderenciaTecnica + aderenciaComportamental) / 2);
  ```
  Isto é: habilidade **não avaliada é excluída do numerador e do
  denominador** (nunca conta como "zero"/gap). O valor central do gauge é a
  **média simples** entre aderência Técnica e Comportamental — não é
  ponderada pela quantidade de habilidades de cada tipo. Isso é uma decisão
  explícita registrada em comentário, não um detalhe implícito.
- **Gráfico/biblioteca**: `recharts`, `RadialBarChart` com `innerRadius=110`
  / `outerRadius=135` em pixels fixos (não percentual — comentário explica
  que percentual causou bug de tamanho antes).
- **Cor**: gradiente fixo `var(--brand-500)` → `var(--brand-400)`
  (`MinhaCarreiraPage.tsx:576-579`), **sempre azul, independente do
  percentual**. Isso é diferente do anel de "Mapeamento de competências"
  (seção 3), que muda de cor por faixa — vale destacar para quem for
  reimplementar, pois é fácil assumir por engano que todo anel de % da tela
  segue a mesma regra de cor.

### 2.3 Contexto na empresa (benchmark de colegas)

- **Propósito**: mostra em qual das 4 faixas de aderência (0-25% / 25-50% /
  50-75% / 75-100%) João está, comparado à distribuição de todos os colegas
  no mesmo cargo.
- **Componente**: inline em `MinhaCarreiraPage.tsx:637-681`, mais os
  componentes auxiliares `FaixaTick`, `VoceBubble`, `ContextoTooltip`
  (`MinhaCarreiraPage.tsx:64-127`).
- **Dados/fórmula** (`MinhaCarreiraPage.tsx:268-292`):
  ```ts
  const contagemPorFaixa = useMemo(() => {
    const matriz = matrizParaCargo(JOAO_CARGO_ATUAL);
    const contagem = [0, 0, 0, 0];
    colaboradoresData
      .filter(c => c.cargoId === JOAO_CARGO_ATUAL)
      .forEach(c => {
        const habilidades = enriquecerMatriz(matriz, c.id);
        const tecnica = calcularAderenciaPorTipo(habilidades, 'Técnica');
        const comportamental = calcularAderenciaPorTipo(habilidades, 'Comportamental');
        const media = Math.round((tecnica + comportamental) / 2);
        contagem[Math.min(Math.floor(media / 25), 3)] += 1;
      });
    return contagem;
  }, []);
  ```
  27 colaboradores em `mockData.ts` têm `cargoId: 'c2'` (contado via grep).
  Todos entram nesse cálculo — **não há filtro de amostra mínima** (ver
  seção 3, esse item está marcado como não encontrado no código).
- **Achado não óbvio (documentar para quem for reimplementar)**:
  `matrizParaCargo(JOAO_CARGO_ATUAL)` é chamado UMA vez, fora do loop, e
  como `JOAO_CARGO_ATUAL === 'c2'`, ele **sempre** retorna
  `joaoHabilidadesCargoMatriz` — a matriz de 34 habilidades **enriquecida
  especificamente para João** (ver seção 3), não a matriz padrão de 13
  habilidades do cargo c2 (`habilidadesCargoData`). Ou seja: a aderência de
  **todos os 27 colegas** é calculada contra a matriz estendida de João, não
  contra a matriz oficial do cargo. Isso não quebra o cálculo hoje porque os
  colegas simplesmente não têm `avaliacoesColaboradoresData` para as ~21
  habilidades extras (viram `status: 'sem'` e são excluídas), mas é um
  acoplamento implícito: se algum colega ganhar avaliações para essas
  habilidades extras no futuro, o resultado passa a incluir habilidades que
  não fazem parte da matriz oficial do cargo para ele.
- **Gráfico/biblioteca**: `recharts`, `BarChart` com `Tooltip` nativo
  (`ContextoTooltip`) e gradientes por faixa (`GRADIENTES_FAIXA`,
  `MinhaCarreiraPage.tsx:54-60`) — tons de `brand-100`→`brand-600`, cor
  própria, também fora do sistema de 3 cores da seção 3.

### 2.4 Oportunidades de desenvolvimento (cards de gap)

- **Propósito**: mostra as habilidades do cargo atual com maior distância
  entre nível atual e nível esperado.
- **Componente**: inline em `MinhaCarreiraPage.tsx:691-757`, com o
  subcomponente `OportunidadeBarraNivel` (`MinhaCarreiraPage.tsx:161-210`).
- **Critério de "Top 8" — fórmula exata** (`MinhaCarreiraPage.tsx:359-365`):
  ```ts
  const oportunidades = useMemo(() => {
    return habilidadesCargoAtualGauge
      .filter(h => h.status === 'abaixo')
      .map(h => ({ ...h, gap: h.pesoEsperado - (h.pesoAtual ?? 0) }))
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 8);
  }, [habilidadesCargoAtualGauge]);
  ```
  Confirmado: **apenas habilidades avaliadas E abaixo do esperado**
  (`status === 'abaixo'` só é atribuído quando existe `nivelAtual` — ver
  `getStatus` na seção 3), ordenadas por maior gap de peso, cortadas nas 8
  primeiras.
- **Estados vazios** têm 2 casos distintos, com prioridade explícita
  (`MinhaCarreiraPage.tsx:697-719`): se existem habilidades do cargo ainda
  **não avaliadas** (`pendentesAvaliar > 0`), mostra "responda as
  autoavaliações" (Caso B) — isso tem prioridade sobre mostrar "você atingiu
  tudo" (Caso A), mesmo que zero gaps tenham sido encontrados entre as
  habilidades já avaliadas.
- **Cor**: `OportunidadeBarraNivel` usa blocos segmentados — azul sólido
  (`var(--brand-600)`) até o nível atual, cinza (`#E5E7EB`/`gray-200`) para
  o resto, e um contorno tracejado azul (sem preenchimento) marcando a
  posição do nível esperado. **Confirmado: não usa âmbar** — o comentário no
  código (`MinhaCarreiraPage.tsx:151-152`) registra que um destaque âmbar
  para o nível "Alvo" existia antes e foi removido a pedido.

### 2.5 Mapeamento de competências (lista + página de detalhe)

- **Propósito**: lista todas as competências do cargo atual com pelo menos
  uma habilidade avaliada, com filtros de status/tipo; cada linha abre a
  página de detalhe com a lista completa de habilidades daquela competência.
- **Componente da lista**: inline em `MinhaCarreiraPage.tsx:759-909`.
- **Componente de detalhe**: `CompetenciaDetalhePage.tsx` inteiro.
- **Cálculo por competência** (`MinhaCarreiraPage.tsx:307-330`):
  ```ts
  const avaliadas = g.habilidades.filter(h => h.status !== 'sem');
  const atendidas = avaliadas.filter(h => h.status === 'no' || h.status === 'acima').length;
  // y = avaliadas.length ; x = atendidas ; percentual = round(atendidas/avaliadas*100)
  ```
  Competências sem NENHUMA habilidade avaliada (`avaliadas.length === 0`)
  ficam **fora da lista inteira** (`.filter(g => g.habilidades.some(h => h.status !== 'sem'))`)
  até a primeira autoavaliação — decisão confirmada com Alice, documentada em
  comentário.
- **Filtros**: status (Todas / Abaixo do esperado / No caminho certo — por
  `percentual < 100` vs `=== 100`) e tipo (Todas / Técnicas / Comportamentais
  — competência com habilidades dos dois tipos aparece nos dois filtros; o
  `x`/`y`/`percentual` exibidos **nunca** são recalculados por tipo, sempre
  somam todas as habilidades avaliadas da competência, mesmo com filtro de
  tipo aplicado).
- **Página de detalhe** (`CompetenciaDetalhePage.tsx`): reusa `enriquecerMatriz(matrizParaCargo(JOAO_CARGO_ATUAL))`
  e filtra por `competenciaId === id` da URL. Mostra um card de visão geral
  (mesmo `AderenciaRing`, maior) + tabela paginada (10 itens/página, mesmo
  padrão de `JornadaDetalhePage`) com abas Todas/Abaixo/No esperado/Acima/Não
  avaliadas. Tem uma exceção documentada de badge (verde/vermelho/cinza) só
  nesta página — o resto da tela usa texto simples sem badge para status de
  habilidade.
- **Biblioteca de gráfico**: `AderenciaRing` (anel de %, `recharts`
  `RadialBarChart`) e `PesoBars` (barrinhas HTML puras, sem recharts) — os
  dois definidos em `minhaCarreiraShared.tsx` e reusados nas duas páginas.

## 3. Regras de cálculo e cores — status verificado

> Cada item abaixo foi checado direto no código nesta sessão. Onde a regra
> pedida para documentar não bateu com o que o código realmente faz, isso
> está sinalizado explicitamente — não presumi nada.

### [CONFIRMADO] Cálculo de aderência ao cargo (média Técnica + Comportamental)
Média **simples** (não ponderada) entre `aderenciaTecnica` e
`aderenciaComportamental`, cada uma calculada excluindo habilidades não
avaliadas do numerador e denominador. Ver fórmula exata na seção 2.2.

### [NÃO ENCONTRADO NO CÓDIGO] Regra de amostra mínima do benchmark (cargo com 2+ pessoas)
Busquei por qualquer verificação de tamanho mínimo de amostra em
"Contexto na empresa" (`MinhaCarreiraPage.tsx`) e em todo o restante do
projeto (`amostra`, `mínimo`, `minimo`) — **não existe nenhuma regra desse
tipo implementada hoje**. `contagemPorFaixa` soma todos os colaboradores com
`cargoId === JOAO_CARGO_ATUAL`, sem checar se há pelo menos 2. Na prática,
como há 27 colaboradores com `cargoId: 'c2'` no mock atual, isso nunca gera
uma amostra vazia/de 1 pessoa — mas se a regra é uma decisão de produto
pretendida, ela **não está codificada** e precisa ser implementada do zero
por quem for reconstruir a tela, não apenas copiada de algum lugar existente.

### [DIVERGÊNCIA DO PEDIDO — verificar com Alice] Denominador do cálculo de cobertura em Minha Carreira
A descrição original deste item presumia que habilidades não avaliadas
seriam **somadas ao denominador** (diferente do Dashboard, que exclui). O
código real faz o **oposto**: em toda a tela "Minha Carreira" (gauge de
Aderência, Contexto na empresa, Mapeamento de competências, Oportunidades),
habilidade com `status === 'sem'` é **excluída tanto do numerador quanto do
denominador** — exatamente a mesma regra do Dashboard
(`04-regras-negocio.md`), não uma regra diferente. Isso está confirmado em
múltiplos pontos do código com comentários explícitos ("regra do Dashboard —
habilidade não avaliada EXCLUÍDA do numerador e do denominador"), tanto em
`calcularAderenciaPorTipo` quanto no cálculo de `competenciasAderencia`.
**Não deve ser documentado como \[PENDENTE\] com o comportamento oposto** —
o comportamento atual do código é o mesmo do Dashboard, ponto final. Se a
intenção de produto for realmente diferente disso, é uma mudança ainda não
implementada, não um estado atual a documentar como está.

### Sistema de cor — não existe UM sistema unificado de 3 cores na página inteira
O pedido original presumia um "sistema de cor unificado (azul = no esperado,
âmbar = abaixo do esperado, cinza = não avaliado)" com exceções pontuais.
Ao verificar cada componente da tela, **não há essa regra única** — existem
várias paletas diferentes, cada uma própria do seu contexto:

| Onde | Paleta real | Thresholds |
|---|---|---|
| Anel de % — Mapeamento de competências + card de visão geral do detalhe (`getCorAnelLista`, `minhaCarreiraShared.tsx:121-125`) | azul `var(--brand-500)` / âmbar `#F59E0B` / vermelho `#EF4444` | `≥80` / `≥50` / `<50` |
| Badge Completo/Parcial da lista (`MinhaCarreiraPage.tsx:887-893`) | verde `bg-green-100 text-green-800` / amarelo `bg-yellow-100 text-yellow-800` | `percentual===100` / `<100` |
| Badge de status na tabela do detalhe (`CompetenciaDetalhePage.tsx:34-39`) | verde (acima/no) / vermelho (abaixo) / cinza (sem) — **sem âmbar** | por `status` |
| `PesoBars` — barrinhas de peso na tabela do detalhe (`minhaCarreiraShared.tsx:178-194`) | azul (até nível atual) / âmbar `#F59E0B` (entre atual e esperado, só se atual < esperado) / cinza `#D1D5DB` | por posição do segmento |
| `OportunidadeBarraNivel` — cards de Oportunidades (`MinhaCarreiraPage.tsx:161-210`) | azul `var(--brand-600)` / cinza `#E5E7EB` — **sem âmbar** (removido a pedido, ver comentário) | por posição do segmento |
| Gauge "Aderência ao cargo" (`MinhaCarreiraPage.tsx:576-579`) | azul fixo (gradiente `brand-500`→`brand-400`), **nunca muda por percentual** | nenhum |
| Timeline "Evolução profissional" | azul fixo `var(--brand-600)`, token único | nenhum |
| "Contexto na empresa" (barras) | gradiente próprio `brand-100`→`brand-600` por faixa | nenhum |

**A única afirmação do pedido original que se confirma tal como descrita**:
"Oportunidades de desenvolvimento usa só azul+cinza (sem âmbar)" —
`[CONFIRMADO]`. As demais generalizações ("sistema unificado", "azul = no
esperado") não correspondem à implementação real e não devem ser assumidas
por quem for reconstruir a tela.

### [CONFIRMADO] Unificação de cor entre lista e detalhe de Mapeamento de competências
`getCorAnelLista` foi movida para `minhaCarreiraShared.tsx` e é a única fonte
da cor do anel de percentual, importada tanto pela lista
(`MinhaCarreiraPage.tsx`) quanto pelo card de visão geral do detalhe
(`CompetenciaDetalhePage.tsx`, via `AderenciaRing` sem nenhum override de
cor). A divergência que existia antes (a página de detalhe caindo num
fallback de cores verde/âmbar/vermelho diferente) foi eliminada nesta
sessão — confirmado lendo o código atual de `AderenciaRing`
(`minhaCarreiraShared.tsx:135-144`): não existe mais nenhuma prop de
override de cor, a função é chamada sempre internamente.

### [CONFIRMADO] Critério de "Top 8" em Oportunidades de desenvolvimento
Maior gap de peso primeiro, apenas habilidades avaliadas e com
`status === 'abaixo'`. Ver fórmula exata na seção 2.4.

### [CONFIRMADO, com número corrigido] João Silva é o único colaborador com dados enriquecidos o suficiente
`joaoHabilidadesCargoMatriz` (`mockData.ts:3409-3452`) tem **34 habilidades**
(contado via grep, não são 30) — contra as 13 habilidades da matriz padrão
do cargo c2 (`habilidadesCargoData`). O comentário no próprio array
("Distribuição João vs esta matriz: 5 ACIMA \| 8 NO \| 6 ABAIXO \| 4 SEM",
total 23) está **desatualizado** — foi escrito antes das extensões
posteriores (habilidades 147–153 e o grupo de "gap alto" 61/64/70) que
elevaram o total para 34; não confere com o array atual e não deve ser usado
como referência de distribuição real.
Essa matriz de 34 habilidades, e as respostas de avaliação associadas a
`colaboradorId: '10'` em `avaliacoesColaboradoresData`, existem **apenas
para João**. Nenhum outro colaborador tem esse nível de enriquecimento —
replicar esta tela para outro colaborador exigiria popular o mesmo volume de
dados (matriz estendida + respostas de avaliação + histórico de cargos em
`historicoCargosJoaoData`, que também é hoje um array exclusivo de João, sem
generalização por `colaboradorId`).

## 4. Componentes e padrões visuais reutilizados

Referência completa em `02-design-system.md` (regras do projeto). Nesta
tela, os padrões efetivamente usados são:

- **Cards de conteúdo**: `bg-white border border-gray-200 rounded-lg`,
  padding `p-4 md:p-5` — usado em Evolução profissional, Aderência ao cargo,
  Contexto na empresa, cada card de Oportunidades, e o card de visão geral
  do detalhe de competência.
- **Filtros/pills**: `bg-gray-100 rounded-lg p-1` com item ativo
  `bg-white text-gray-900 shadow-sm` — usado nos dois filtros de
  Mapeamento de competências (status e tipo) e nas abas de
  `CompetenciaDetalhePage`. Mesmo padrão documentado para
  `HabilidadesSelectionModal.tsx`.
- **Bloco de filtros em card separado da lista** — padrão já usado em
  `Perfis.tsx`/`ListingPage.tsx` (toolbar e conteúdo em cards distintos).
- **Badges de status** (`02-design-system.md`, seção Badges): reaproveitados
  em `CompetenciaDetalhePage` (verde/vermelho/cinza) e no badge
  Completo/Parcial da lista (verde/amarelo).
- **Mensagens de orientação — variante B (slate)**: usada duas vezes na
  tela — no rodapé do card "Aderência ao cargo" ("Atingir a porcentagem
  máxima...") e no card informativo ao final de "Oportunidades de
  desenvolvimento". Ambas usam `bg-slate-100 border border-slate-300`,
  ícone `Info` `text-slate-500`. Explicitamente **não** é a variante brand —
  decisão registrada em comentário para não virar padrão assumido em outros
  cards informativos do sistema.
- **Estados vazios — variante B (Orientativo)**: usada em Oportunidades de
  desenvolvimento (2 casos: "faltam avaliações" com ícone `ClipboardList`, e
  "atingiu tudo" com ícone `CheckCircle2`) — `bg-white border border-gray-200
  rounded-lg p-8 text-center`, ícone `w-8 h-8 text-gray-300` sem wrapper.
- **Tabela padrão** (`ui/Table.tsx` + `PaginationConfig`): usada na tabela de
  habilidades do detalhe de competência — mesma anatomia documentada
  (container/toolbar/thead/tbody/paginação), 10 itens por página.
- **Ao aplicar filtro, resetar para página 1**: aplicado em
  `CompetenciaDetalhePage` (`useEffect` que reseta `paginaAtual` ao trocar
  `filtro`) — regra já documentada em `02-design-system.md`.

## 5. Limitações conhecidas / dívida técnica

- **Dado 100% mock, sem backend real.** Toda a tela lê de arrays estáticos
  em `mockData.ts`. Não há chamada de API, não há persistência de estado
  entre sessões (filtros voltam ao padrão a cada reload).
- **João Silva é hardcoded como o único colaborador funcional desta tela**
  (`JOAO_ID = '10'`, `JOAO_CARGO_ATUAL = 'c2'` fixos em
  `minhaCarreiraShared.tsx`). Não há lógica de "colaborador logado" — a tela
  sempre mostra os dados de João, independentemente de quem está navegando.
  Isso é adequado para o protótipo atual, mas não deve ser interpretado como
  arquitetura pronta para multi-usuário.
- **Histórico de cargos (`historicoCargosJoaoData`) e a matriz de
  habilidades estendida (`joaoHabilidadesCargoMatriz`) são exclusivos de
  João** — não existe hoje um mecanismo genérico de "histórico de cargos por
  colaborador" ou de enriquecimento de matriz por colaborador no resto do
  sistema. Ver comentário em `mockData.ts:3454-3463` confirmando que isso é
  um dado simulado isolado, a generalizar se virar feature real.
- **Acoplamento implícito entre "Contexto na empresa" e a matriz estendida
  de João** — detalhado na seção 2.3. Quem for reconstruir essa seção deve
  decidir conscientemente se quer manter esse comportamento (colegas
  avaliados contra a matriz de João) ou trocar para a matriz oficial do
  cargo (`habilidadesCargoData`), o que mudaria os números da distribuição
  por faixa se algum colega ganhar avaliações para as habilidades extras.
- **Nenhuma regra de amostra mínima no benchmark** (seção 3) — se isso for
  requisito de produto, precisa ser implementado, não está no código hoje.
- **Regras de negócio do módulo Colaborador ainda não são todas fechadas.**
  Por instrução do projeto (`04-regras-negocio.md`): "Não assumir que
  nenhuma regra de negócio está definida para o Colaborador sem confirmação
  explícita". As fórmulas documentadas aqui são o que o código faz
  *hoje*, não necessariamente decisões de produto finais e imutáveis.
- **Sem ferramenta de automação de navegador validando isso nesta sessão** —
  toda a verificação de comportamento foi feita por leitura direta de
  código-fonte (e, em sessões anteriores, por inspeção do bundle servido
  pelo Vite via `curl` e simulação de roteamento via `matchRoutes`), não por
  teste real de UI em navegador. Testes manuais em navegador ainda são
  recomendados antes de considerar esta tela validada ponta a ponta.
- **Bundle único, sem code-splitting** — `npm run build` emite um aviso de
  chunk >500kB (`dist/assets/index-*.js`, ~1.78MB). Não é específico desta
  tela, mas afeta o tempo de carregamento de toda a aplicação, incluindo
  esta rota.

## 6. Complemento — configuração literal dos gráficos e funções de cálculo

> Adicionado a pedido explícito, com a mesma regra: nada abaixo foi
> parafraseado. Todo bloco é colado exatamente como está no arquivo, com
> `arquivo:linha` de início. Onde algo não pôde ser confirmado por leitura de
> código (ex: aparência visual renderizada), está marcado como
> `NÃO VERIFICADO` explicitamente, sem tentativa de descrever de memória.

### 6.1 Gauge "Aderência ao cargo" — RadialBarChart completo

Fonte: `src/app/pages/MinhaCarreiraPage.tsx:563-600` (JSX literal, incluindo o
wrapper de posicionamento do texto central, que faz parte do mesmo bloco
visual):

```tsx
<div className="relative w-[280px] h-[150px] overflow-hidden mx-auto">
  <div className="absolute top-0 left-0 w-[280px] h-[280px]">
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius={110}
        outerRadius={135}
        data={[{ value: aderenciaMedia }]}
        startAngle={180}
        endAngle={0}
      >
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--brand-500)" />
            <stop offset="100%" stopColor="var(--brand-400)" />
          </linearGradient>
        </defs>
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar
          dataKey="value"
          cornerRadius={12}
          fill="url(#gaugeGradient)"
          background={{ fill: '#E5E7EB' }}
          isAnimationActive={false}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  </div>
  <div className="absolute left-1/2 bottom-0 -translate-x-1/2 flex flex-col items-center pb-1">
    <span className="text-3xl font-bold text-gray-900">{aderenciaMedia}%</span>
    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Média no cargo</span>
  </div>
</div>
```

Pontos que não estão implícitos na leitura superficial do JSX, mas que
afetam a reconstrução:
- `data={[{ value: aderenciaMedia }]}` — um único ponto de dado, não uma
  série. `aderenciaMedia` é a média simples calculada em `MinhaCarreiraPage.tsx:258`
  (ver seção 6.2).
- `innerRadius`/`outerRadius` são **pixels absolutos** (110/135), não
  percentuais — o comentário do arquivo (`:536-539`) registra que percentual
  já causou bug de tamanho antes; não converter para `%` numa reimplementação
  sem testar.
- `startAngle={180}` / `endAngle={0}` — meio círculo (180°→0°, sentido
  horário), não um círculo completo. Compare com `AderenciaRing` (seção
  2.5/2.3 deste documento e `minhaCarreiraShared.tsx:154-159`), que usa
  `startAngle={90}` / `endAngle={-270}` (círculo completo) — são
  configurações **diferentes**, não reaproveitar uma pela outra.
- `isAnimationActive={false}` em todo `RadialBar`/`Bar` desta tela — nenhum
  gráfico tem animação de entrada.
- Não há `Tooltip` nem `Legend` neste componente — só o `RadialBar` e o
  texto central sobreposto via `position: absolute` do CSS, não via API do
  recharts.
- `<div className="relative w-[280px] h-[150px] overflow-hidden ...">` com
  o `ResponsiveContainer` interno fixado em `w-[280px] h-[280px]` (o dobro da
  altura visível) é a técnica usada para cortar o círculo completo pela
  metade — comentário `:536-537` confirma que é proposital ("círculo-base de
  280x280 cortado pela metade via overflow-hidden").

### 6.2 Gráfico "Contexto na empresa" — BarChart completo

Fonte: `src/app/pages/MinhaCarreiraPage.tsx:641-676`:

```tsx
<div className="flex-1 min-h-[220px] mt-4">
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={dadosContextoEmpresa} margin={{ top: 40, right: 8, left: 8, bottom: 0 }} barCategoryGap="15%">
      <defs>
        {GRADIENTES_FAIXA.map(([top, bottom], i) => (
          <linearGradient key={i} id={`faixaGradient${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={top} />
            <stop offset="100%" stopColor={bottom} />
          </linearGradient>
        ))}
        <linearGradient id="faixaGradientVoce" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GRADIENTE_VOCE[0]} />
          <stop offset="100%" stopColor={GRADIENTE_VOCE[1]} />
        </linearGradient>
      </defs>
      <XAxis
        dataKey="faixa"
        axisLine={false}
        tickLine={false}
        interval={0}
        tick={<FaixaTick faixaAtualIndex={faixaAtualIndex} />}
      />
      <YAxis hide />
      <Tooltip content={<ContextoTooltip />} cursor={{ fill: 'rgba(17, 24, 39, 0.04)' }} />
      <Bar dataKey="quantidade" radius={[6, 6, 0, 0]} isAnimationActive={false}>
        {dadosContextoEmpresa.map((_, i) => (
          <Cell key={i} fill={i === faixaAtualIndex ? 'url(#faixaGradientVoce)' : `url(#faixaGradient${i})`} />
        ))}
        <LabelList
          dataKey="quantidade"
          content={(props: object) => <VoceBubble {...props} faixaAtualIndex={faixaAtualIndex} />}
        />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>
```

`GRADIENTES_FAIXA`, `GRADIENTE_VOCE`, `FaixaTick`, `VoceBubble` e
`ContextoTooltip` — todos definidos em `MinhaCarreiraPage.tsx:54-127`, colados
por inteiro abaixo porque são parte inseparável da configuração do gráfico
(sem eles o `BarChart` acima não compila):

```tsx
// MinhaCarreiraPage.tsx:54-60
const GRADIENTES_FAIXA: [string, string][] = [
  ['var(--brand-100)', 'var(--brand-200)'],
  ['var(--brand-200)', 'var(--brand-300)'],
  ['var(--brand-300)', 'var(--brand-400)'],
  ['var(--brand-400)', 'var(--brand-500)'],
];
const GRADIENTE_VOCE: [string, string] = ['var(--brand-500)', 'var(--brand-600)'];

// MinhaCarreiraPage.tsx:64-80
function FaixaTick(props: { x?: number; y?: number; payload?: { value: string }; faixaAtualIndex: number }) {
  const { x = 0, y = 0, payload, faixaAtualIndex } = props;
  const index = FAIXAS_CONTEXTO.indexOf(payload?.value ?? '');
  const isVoce = index === faixaAtualIndex;
  return (
    <text
      x={x}
      y={y + 12}
      textAnchor="middle"
      fontSize={12}
      fontWeight={isVoce ? 600 : 400}
      fill={isVoce ? 'var(--brand-600)' : '#6B7280'}
    >
      {payload?.value}
    </text>
  );
}

// MinhaCarreiraPage.tsx:86-105
function VoceBubble(props: { x?: number; y?: number; width?: number; index?: number; faixaAtualIndex: number }) {
  const { x = 0, y = 0, width = 0, index, faixaAtualIndex } = props;
  if (index !== faixaAtualIndex) return null;
  const cx = x + width / 2;
  const boxWidth = 54;
  const boxHeight = 26;
  const boxY = y - boxHeight - 10;
  return (
    <g>
      <rect x={cx - boxWidth / 2} y={boxY} width={boxWidth} height={boxHeight} rx={13} fill="var(--brand-600)" />
      <polygon
        points={`${cx - 5},${boxY + boxHeight} ${cx + 5},${boxY + boxHeight} ${cx},${boxY + boxHeight + 6}`}
        fill="var(--brand-600)"
      />
      <text x={cx} y={boxY + boxHeight / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={600} fill="#ffffff">
        Você
      </text>
    </g>
  );
}

// MinhaCarreiraPage.tsx:115-127
function ContextoTooltip({ active, payload }: {
  active?: boolean;
  payload?: { payload: { faixa: string; percentual: number } }[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const { faixa, percentual } = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2">
      <p className="text-xs font-semibold text-gray-900">{faixa}</p>
      <p className="text-xs text-gray-500 mt-0.5">{`${percentual}% dos colaboradores estão nesta faixa`}</p>
    </div>
  );
}
```

`dadosContextoEmpresa` — a fonte de `data` do `BarChart` — vem de
`MinhaCarreiraPage.tsx:288-292`:
```tsx
const dadosContextoEmpresa = FAIXAS_CONTEXTO.map((faixa, i) => ({
  faixa,
  quantidade: contagemPorFaixa[i],
  percentual: totalColaboradoresCargo === 0 ? 0 : Math.round((contagemPorFaixa[i] / totalColaboradoresCargo) * 100),
}));
```
`FAIXAS_CONTEXTO = ['0-25%', '25-50%', '50-75%', '75-100%']` (`:47`).
`contagemPorFaixa` está documentado por inteiro na seção 2.3 deste
documento.

Pontos não óbvios do JSX puro:
- `barCategoryGap="15%"` é a única prop controlando a largura das barras —
  não há `barSize`/`maxBarSize` fixo (comentário `:633-636` confirma que é
  proposital, para as barras ocuparem proporcionalmente o espaço disponível).
- O rótulo fixo "Você" acima da barra de destaque (`VoceBubble`) é
  **sempre visível**, renderizado via `<LabelList content={...}>` — não é o
  mesmo mecanismo do `<Tooltip>` (que só aparece no hover, via `ContextoTooltip`,
  e funciona em qualquer uma das 4 barras).
- `margin={{ top: 40, ... }}` no `BarChart` reserva espaço vertical acima das
  barras especificamente para o `VoceBubble` não cortar.

### 6.3 Tipos e funções — corpo completo, sem omissões

Todos os quatro blocos abaixo estão colados por inteiro de
`src/app/pages/minhaCarreiraShared.tsx`, nenhuma linha resumida:

```ts
// minhaCarreiraShared.tsx:37-48
export type HabilidadeEnriquecida = {
  habilidadeId: string;
  nome: string;
  tipo: string;
  competenciaId: string;
  competenciaNome: string;
  nivelEsperado: string;
  pesoEsperado: number;
  nivelAtual: string | null;
  pesoAtual: number | null;
  status: Status;
};

// minhaCarreiraShared.tsx:50-57
export function getStatus(nivelAtual: string | null, nivelEsperado: string): Status {
  if (!nivelAtual) return 'sem';
  const pa = getPesoFromNome(nivelAtual);
  const pe = getPesoFromNome(nivelEsperado);
  if (pa > pe) return 'acima';
  if (pa === pe) return 'no';
  return 'abaixo';
}

// minhaCarreiraShared.tsx:78-83
export function matrizParaCargo(cargoId: string): { habilidadeId: string; nivelEsperado: string }[] {
  if (cargoId === JOAO_CARGO_ATUAL) return joaoHabilidadesCargoMatriz;
  return habilidadesCargoData
    .filter(h => h.cargoId === cargoId)
    .map(h => ({ habilidadeId: h.habilidadeId, nivelEsperado: h.nivelEsperado }));
}

// minhaCarreiraShared.tsx:85-108
export function enriquecerMatriz(
  matriz: { habilidadeId: string; nivelEsperado: string }[],
  colaboradorId: string = JOAO_ID
): HabilidadeEnriquecida[] {
  return matriz
    .map(entry => {
      const hab = habilidadesData.find(h => h.id === entry.habilidadeId);
      if (!hab) return null;
      const nivelAtual = getNivelAtualColaboradorTeste(colaboradorId, entry.habilidadeId);
      return {
        habilidadeId: entry.habilidadeId,
        nome: hab.nome,
        tipo: hab.tipo,
        competenciaId: hab.competenciaId,
        competenciaNome: hab.competencia,
        nivelEsperado: entry.nivelEsperado,
        pesoEsperado: getPesoFromNome(entry.nivelEsperado),
        nivelAtual,
        pesoAtual: nivelAtual ? getPesoFromNome(nivelAtual) : null,
        status: getStatus(nivelAtual, entry.nivelEsperado),
      };
    })
    .filter((h): h is HabilidadeEnriquecida => h !== null);
}
```

`calcularAderenciaPorTipo` — por inteiro, de `src/app/pages/MinhaCarreiraPage.tsx:36-41`
(o trecho já colado na seção 2.2 já era o corpo completo da função; repetido
aqui para não haver ambiguidade de que algo foi cortado):
```ts
function calcularAderenciaPorTipo(lista: HabilidadeEnriquecida[], tipo: string): number {
  const avaliadas = lista.filter(h => h.tipo === tipo && h.status !== 'sem');
  if (avaliadas.length === 0) return 0;
  const atendidas = avaliadas.filter(h => h.status === 'acima' || h.status === 'no').length;
  return Math.round((atendidas / avaliadas.length) * 100);
}
```
Não há nenhum tratamento de borda além do `if (avaliadas.length === 0) return 0`
visível acima — não existe try/catch, não existe clamping de valor (ex: não
há `Math.min(100, ...)` — mas como `atendidas <= avaliadas.length` sempre, o
resultado nunca excede 100 por construção do próprio filtro).

### 6.4 Screenshots

`NÃO VERIFICADO — sem ferramenta de captura de tela/navegador nesta sessão.`
Não há Playwright, Puppeteer, ou qualquer mecanismo de renderização visual
disponível neste ambiente (confirmado via busca de ferramentas na sessão).
Não é possível anexar screenshot do gauge "Aderência ao cargo" nem do
gráfico "Contexto na empresa", em modo claro ou escuro, nem confirmar se o
modo escuro produz alguma diferença visual nestes dois componentes — ver
seção 3 do documento `VISAO-COLABORADOR.md` (menu de conta) para o que foi
verificado por código sobre o mecanismo de modo escuro, incluindo a
constatação de que nenhuma classe `dark:` ou variável de tema é usada em
nenhum componente desta tela ("Minha Carreira"), o que sugere fortemente
(mas não confirma visualmente, por falta de ferramenta) que o modo escuro
não produz nenhuma alteração visível aqui.
