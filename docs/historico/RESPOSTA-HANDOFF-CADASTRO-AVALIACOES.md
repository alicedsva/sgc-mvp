# Resposta à auditoria do Handoff — Cadastro de Avaliação

> Respondido lendo o código do protótipo diretamente (não de memória). Arquivos e linhas citados em cada seção. Onde a resposta depende de uma escolha da Alice e não está resolvida no código, está marcado **PRECISA DECISÃO DA ALICE**.

Arquivos principais consultados:
- `src/app/components/avaliacoes/FormularioAvaliacao.tsx`
- `src/app/components/templates/SeletorGerenciaGranular.tsx`
- `src/app/components/templates/HabilidadesMasterDetail.tsx`
- `src/app/components/avaliacoes/QuestionarioPreview.tsx`
- `src/app/context/CarreirasContext.tsx`

---

## 1. Notebook 1366×768 sem scroll

### a) O protótipo cabe nesse orçamento hoje?

**Não, não cabe hoje — e o motivo principal não é geral, é um componente específico.**

O shell (`FormularioAvaliacao.tsx:601-602`) já é feito para não gerar scroll de página: `main` tem `mt-16 h-[calc(100vh-4rem)]` (topbar = 64px, confirma o número do handoff) e o card do formulário tem `overflow-y-auto` interno (`FormularioAvaliacao.tsx:656`) — ou seja, a intenção de "conteúdo rola por dentro do card, página nunca rola" já existe no código. O problema é que **duas etapas não respeitam essa intenção**:

- **Etapa Habilidades** (`HabilidadesMasterDetail`) é responsiva de verdade: recebe `className="flex-1 min-h-0"` (`FormularioAvaliacao.tsx:849`), sem altura fixa — ocupa o espaço disponível e encolhe/cresce com a viewport. Essa etapa está OK para 1366×768.
- **Etapa Identificação, caminho Público-alvo** (`SeletorGerenciaGranular`) recebe `className="h-96"` (`FormularioAvaliacao.tsx:799`) — **384px fixos, hardcoded, que não encolhem em viewport baixa**. Somando isso com o resto da etapa (header da etapa, label "Público-alvo" + contador, campo Nome, campo Descrição, padding do card, rodapé), o conteúdo dessa etapa passa facilmente de 900px de altura — muito acima da sobra de ~510-570px medida para 768px de altura de tela. Nessa etapa, o card interno **vai precisar rolar** para o Admin ver o campo Nome/Descrição depois de mexer no seletor de gerência.

Ou seja: a resposta não é uniforme entre as 5 etapas. Habilidades foi feita para caber; Identificação (caminho Público-alvo) tem uma altura fixa que provavelmente estoura o orçamento.

**Achado técnico extra, fora do que foi perguntado, mas relevante para "sem scroll":** o card de dica da coluna direita (`FormularioAvaliacao.tsx:979-999`) **não tem altura própria** — não usa `h-full` nem `flex-1`, só cresce pelo conteúdo (comentário no próprio código, linha 969: *"altura natural (hugging content, não força mais h-full)"*). Nem ele nem o container que o envolve (`hidden lg:flex lg:flex-col min-h-0`, sem `overflow`) têm um teto de altura imposto pelo grid. Na prática isso significa que, se o texto da dica for alto o suficiente, **o `overflow-y-auto` do card não tem efeito nenhum** (não há altura para conter) e o card pode ultrapassar visualmente o limite do `main` de altura fixa — o que geraria scroll de página de verdade, não scroll interno controlado. Isso não foi testado num browser real (é leitura de CSS/Tailwind, não medição) — vale confirmar visualmente, mas é um ponto de atenção estrutural, não só de conteúdo longo.

### b) O que deve ceder

**RESOLVIDO — por implementação, não por escolha entre as 3 opções do time.** `SeletorGerenciaGranular` (etapa Colaboradores, caminho Público-alvo) e `HabilidadesMasterDetail` (etapa Habilidades) passaram de altura fixa (`h-96`) para altura flexível: `className="flex-1 min-h-0"` nos dois (`FormularioAvaliacao.tsx:825` e `FormularioAvaliacao.tsx:932`), dentro de um wrapper de etapa `flex-1 min-h-[280px] flex flex-col` (`FormularioAvaliacao.tsx:815` e `FormularioAvaliacao.tsx:924`) — a altura real vem do espaço disponível no card da etapa, que por sua vez é limitado pela altura real da tela (cadeia `h-[calc(100vh-4rem)]` no `<main>`). Os dois componentes encolhem/crescem junto com a viewport, com piso mínimo de `min-h-[280px]` abaixo do qual não encolhem mais (ver item c). Se mesmo assim não couber (telas muito baixas), quem rola é a área de conteúdo da etapa, como último recurso — não existe mais altura fixa arbitrária brigando pelo espaço.

### c) Altura mínima utilizável do master-detail / seletor de gerência

**DECIDIDO — 280px** (`min-h-[280px]`, `FormularioAvaliacao.tsx:815` e `:924`), testado e aprovado visualmente antes de ir pra produção.

### d) O card de dica rola em 1366×768?

Dois pontos:

1. **Contagem de itens real, corrigindo o enunciado da pergunta:** a dica da Etapa Prazo tem **4 itens** (Início, Término, Prazo (dias), Sem Data de Início — `FormularioAvaliacao.tsx:487-496`), não 5. A dica da Revisão tem 2, como o handoff já dizia.
2. Cada item da dica tem um mini-título (`text-sm font-semibold`) + parágrafo (`text-sm text-gray-700 mt-2`), com `space-y-4` entre itens (`FormularioAvaliacao.tsx:988-995`). Somando cabeçalho da dica (emoji + título, `mb-6`) com 4 itens de ~2 linhas de texto cada, a altura de conteúdo da dica de Prazo fica em torno de 340-380px — dentro do orçamento total de ~510-570px, mas dependendo de quanto as outras seções (breadcrumb, stepper) já consumiram daquela sobra, pode ficar apertado.

**CORRIGIDO.** O card não tinha altura própria (`overflow-y-auto` sem teto real) e podia empurrar a página inteira, como descrito em (a). Recebeu a mesma técnica de altura flexível com teto real: `overflow-hidden` no wrapper do grid (`FormularioAvaliacao.tsx:1072`) + `flex-1 min-h-0 overflow-y-auto` no card em si (`FormularioAvaliacao.tsx:1074`) — mesmo padrão já usado no `SeletorGerenciaGranular`/`HabilidadesMasterDetail` (item b). Agora a dica rola só internamente, nunca estica o rodapé pra fora da tela, mesmo na dica mais longa do fluxo (Prazo, 4 itens — ver contagem corrigida acima).

---

## 2. Colaborador — quais campos a UI mostra

### a) `SeletorGerenciaGranular`, coluna da direita

Cada linha mostra **só o nome** (`c.nome`) — nenhum outro campo (`SeletorGerenciaGranular.tsx:225`: `<span className="flex-1 text-sm text-gray-900">{c.nome}</span>`). Sem cargo, sem matrícula, sem avatar, sem e-mail.

Ordenação: **nenhuma** — a lista é renderizada na ordem em que os colaboradores aparecem no array `colaboradores` recebido via prop, filtrado pela gerência ativa (`colaboradoresPorGerencia`, `SeletorGerenciaGranular.tsx:44-51`). Não há `.sort()` em nenhum ponto do componente.

### b) `ColaboradoresJornadaModal`

Confirma: só nome + cargo (`FormularioAvaliacao.tsx:214-217`), cargo lido de `cargosData.cargoRM` (nunca do campo denormalizado `Colaborador.cargo` — comentário explícito em `FormularioAvaliacao.tsx:419-421`).
- **Ordenação:** nenhuma — segue a ordem de `formData.participantesIds`, que vem de `getColaboradoresPorJornada` (ver item 2d abaixo), sem `.sort()`.
- **Busca:** não existe. O modal (`FormularioAvaliacao.tsx:180-233`) não tem nenhum `<input>` — é uma lista estática, somente leitura.

### c) Coluna da esquerda (gerências) — contador

Sim, tem contador, no lado direito de cada linha de gerência (`SeletorGerenciaGranular.tsx:158-165`):
- Se houver ao menos 1 colaborador marcado: `"{marcados}/{total}"` (ex: `"3/8"`), cor de marca + `font-medium`.
- Se nenhum marcado: só `"{total}"` sozinho (ex: `"8"`), sem a barra, `text-gray-400`.
- Nunca aparece `"0/8"`.

### d) O que liga um colaborador a uma jornada no protótipo

**Vínculo direto, não é via cargo.** Existe uma entidade própria `Vinculo` (`CarreirasContext.tsx:25`, array `vinculos`, persistido em `localStorage` sob a chave `carreiras_vinculos`), com (no mínimo) os campos `jornadaId` e `colaboradorId`. A função usada em todo o sistema para "quem são os participantes desta jornada" é:

```ts
const getColaboradoresPorJornada = (jornadaId: string): string[] =>
  vinculos.filter(v => v.jornadaId === jornadaId).map(v => v.colaboradorId);
```
(`CarreirasContext.tsx:254-255`)

Ou seja: **não** é "o cargo do colaborador pertence à jornada" — é um vínculo explícito colaborador↔jornada, independente do cargo dele. Isso é o que vocês precisam pedir ao Enio: um endpoint que resolva "quais colaboradores estão vinculados a esta jornada" como relação própria, não derivada da tabela de cargos.

---

## 3. Formato exato de `publicoLabelCalculado` — caminho Público-alvo

Função responsável: `montarPublicoLabelGranular` (`FormularioAvaliacao.tsx:151-171`).

**Regra completa:**
1. Agrupa todos os colaboradores por gerência, usando a lista fixa e alfabética `GERENCIAS` (`Array.from(new Set(colaboradoresData.map(c => c.gerencia))).sort()`, `FormularioAvaliacao.tsx:18`).
2. Calcula quais gerências estão **inteiramente** selecionadas (`marcados === total`, e `total > 0`).
3. Se a soma de selecionados dessas gerências inteiras **bate exatamente** com o total de selecionados (ou seja: não sobra nenhum colaborador avulso fora de uma gerência completa) **e** há pelo menos uma gerência inteira:
   - Todas as gerências existentes selecionadas → `"Todos os colaboradores"`
   - 1 gerência → nome da gerência sozinho, ex: `"Comercial"`
   - 2 gerências → `"Comercial e TI"`
   - 3+ gerências → `"Comercial, Financeiro e TI"` (junção por vírgula, "e" antes do último)
4. **Em qualquer outro caso** (inclui gerência parcial sozinha, e a mistura "gerência inteira + avulsos de outra"), a string vira sempre o contador genérico: `"{N} colaborador selecionado"` / `"{N} colaboradores selecionados"`.

**Exemplos concretos:**
| Cenário | `publicoLabelCalculado` |
|---|---|
| 1 gerência inteira (Comercial, 12/12) | `"Comercial"` |
| 2 gerências inteiras (Comercial + TI, ambas completas) | `"Comercial e TI"` |
| 1 gerência parcial (5 de 12 do Comercial) | `"5 colaboradores selecionados"` |
| Gerência inteira (Comercial, 12/12) + 2 avulsos de TI (não a TI inteira) | `"14 colaboradores selecionados"` — **a informação "Comercial inteira" se perde**, vira só contagem |
| Todas as gerências | `"Todos os colaboradores"` |

**Ponto crítico para a detecção de duplicidade:** no cenário de mistura (linha 4 da tabela), a string final não guarda nenhum traço de qual gerência estava envolvida — dois públicos completamente diferentes que resultem no mesmo número total de selecionados (ex: 14 pessoas de um jeito, 14 pessoas de outro jeito) gerariam a **mesma string** e, portanto, o mesmo `publicoLabel` — o que faria a checagem de duplicidade (que compara strings, não os IDs reais — ver `FormularioAvaliacao.tsx:334-341`) disparar um falso positivo, ou dois públicos genuinamente diferentes seriam tratados como "o mesmo público" para fins de aviso de duplicidade. Isso é comportamento real do protótipo hoje, não uma interpretação — vale saber antes de reimplementar a comparação.

**Sensível à ordem de seleção?** **Não.** `GERENCIAS` é calculado uma única vez no carregamento do módulo, em ordem alfabética fixa, e a lista de "gerências inteiras" é sempre filtrada nessa mesma ordem fixa — não importa a ordem em que o Admin clicou. Selecionar Comercial-depois-TI ou TI-depois-Comercial produz sempre `"Comercial e TI"`.

---

## 4. `SeletorGerenciaGranular` — comportamento fino

### a) Tri-state — representação visual

Checkbox nativo (`<input type="checkbox">`), não ícone customizado. O estado "parcial" usa a propriedade DOM nativa `indeterminate`, setada via `ref` + `useEffect` a cada render (`SeletorGerenciaGranular.tsx:101-107`):
```ts
useEffect(() => {
  gerencias.forEach((g) => {
    const el = checkboxRefs.current[g];
    if (el) el.indeterminate = estadoGerencia(g) === 'parcial';
  });
});
```
`checked` só é `true` quando o estado é `'toda'`. É o traço nativo do navegador para checkbox indeterminado (traço horizontal), não um ícone/SVG próprio do design system.

### b) Toggle "Incluir automaticamente novos colaboradores"

- **Onde aparece:** não fica dentro da linha da gerência (coluna esquerda) nem "abaixo da lista" — aparece **no topo da coluna direita** (painel de detalhe), acima da lista de colaboradores, como um bloco próprio: `bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-3 mb-3` (`SeletorGerenciaGranular.tsx:186-198`).
- **Condição de exibição:** só quando a gerência ativa (a que está selecionada na coluna esquerda, exibida na direita) está com estado `'toda'`.
- **Texto de apoio:** título "Incluir automaticamente novos colaboradores desta gerência" (`text-sm text-gray-800`) + descrição "Colaboradores que entrarem nesta gerência depois da criação da avaliação também serão incluídos automaticamente como participantes." (`text-xs text-gray-500 mt-0.5`).
- **Componente:** `ToggleSwitch` (`tone="neutral"`) à direita do texto.
- **Comportamento ao sumir:** é renderização condicional pura (`{gerenciaAtivaEstado === 'toda' && (...)}`) — **sem transição/animação**, aparece e desaparece instantaneamente junto com o clique que desmarca a gerência.

### c) Escopo da busca

Só dentro da gerência ativa — `colaboradoresFiltrados` filtra `colaboradoresGerenciaAtiva` (`SeletorGerenciaGranular.tsx:54-58`), nunca busca entre todas as gerências. Confirma o handoff.

### d) Estados vazios

Ambos os casos (`SeletorGerenciaGranular.tsx:200-205`) usam o mesmo bloco visual simples, sem ícone/ilustração:
```
<div className="flex flex-col items-center justify-center py-8 text-center">
  <p className="text-sm text-gray-400">{texto}</p>
</div>
```
- Gerência sem colaboradores (sem busca ativa): "Nenhum colaborador nesta gerência"
- Busca sem resultado: "Nenhum colaborador encontrado"

Nota: esse padrão não corresponde exatamente a nenhum dos 4 padrões de estado vazio documentados em `02-design-system.md` (mais perto do padrão D "inline mínimo", mas com `text-gray-400` em vez de `text-gray-500` e `py-8` em vez de `py-4`) — vale alinhar ao padrão oficial na reimplementação em vez de replicar essa pequena divergência.

### e) "Selecionar todos" / "Limpar seleção"

Agem só sobre a **gerência ativa**, nunca sobre tudo — o botão chama `toggleGerenciaInteira(gerenciaAtiva)` (`SeletorGerenciaGranular.tsx:179-183`), que só mexe nos colaboradores daquela gerência específica.

---

## 5. `HabilidadesMasterDetail` — dois detalhes visuais

### a) Contador `marcadas/total` por competência

- **Posição:** mesma linha do nome da competência, alinhado à direita (`flex items-center justify-between`, `HabilidadesMasterDetail.tsx:196-215`).
- **Formato:** `"{marcadas}/{total}"` (ex: `"3/8"`) quando há alguma marcada; só `"{total}"` sozinho quando nenhuma marcada — **igual ao padrão do `SeletorGerenciaGranular`** (mesmo formato, não "3 de 8").
- **Estilo:** `text-xs tabular-nums`, cor de marca + `font-medium` quando `marcadasNoGrupo > 0`, `text-gray-400` quando zero.

### b) Marcador visual para `prioridade`

**Nenhum.** O comentário no próprio código confirma a intenção: *"Coloca as habilidades de prioridade no topo de cada lista... ordem estável"* (`HabilidadesMasterDetail.tsx:75-77`). A função `ordenarComPrioridade` só reordena o array (as habilidades da prioridade vão para o topo, `Number(prioridade.has(b.id)) - Number(prioridade.has(a.id))`) — a renderização usa a mesma função `renderHabilidade` para todas, sem badge, ícone, separador ou cor diferente. Uma habilidade da matriz da jornada aparece no topo da lista, mas visualmente idêntica às outras.

---

## 6. `QuestionarioPreview` — spec da tela

### a) Header e botão de fechar

Não há um "header" tradicional com nome/contador da avaliação — o que existe é uma **barra de aviso fixa no topo**, presente em toda a tela do preview (instruções e perguntas): `bg-yellow-50 border-b border-yellow-200`, ícone `Eye` + texto "Modo de visualização. Nenhuma resposta será salva." à esquerda, e o botão de fechar (`X` + texto "Fechar", não só ícone) no canto direito dessa mesma barra (`QuestionarioPreview.tsx:66-81`).

Na tela de Instruções também existe um botão "Fechar" adicional, dentro do card central, ao lado do "Começar" (`QuestionarioPreview.tsx:128-134`) — ou seja, há dois pontos para fechar nessa tela específica.

**Esc não funciona hoje** — não há nenhum listener de teclado (`keydown`/`Escape`) no componente. Se isso for esperado na reimplementação, é uma adição nova, não uma paridade com o protótipo.

### b) Tela inicial

Começa em **Instruções** (`useState<'instrucoes' | 'perguntas'>('instrucoes')`, `QuestionarioPreview.tsx:48`), nunca direto na primeira habilidade.

### c) Navegação

Dá para navegar por **todas** as habilidades selecionadas, não é amostra — botões "Anterior"/"Próxima habilidade" percorrem `ordemHabilidades` (todas as habilidades do formulário, agrupadas por competência) e o `PainelLateralCompetencias` lateral permite pular direto para qualquer uma via clique (`onSelecionar={setHabilidadeAtualId}`, sem restrição de ordem — comentário explícito: *"toda habilidade é acessível, não há progresso real a proteger"*, `QuestionarioPreview.tsx:188-189`).

### d) Marcação de "isto é uma prévia"

Sim — a mesma barra amarela do item (a), sempre visível, em ambas as telas do preview, deixa isso explícito.

### e) 0 habilidades selecionadas

A tela de Instruções abre normalmente (mostra "0 habilidades" no contador), mas o botão "Começar" fica desabilitado: `disabled={ordemHabilidades.length === 0}`, com `opacity-50 cursor-not-allowed` (`QuestionarioPreview.tsx:118-127`). O Admin não consegue avançar para a tela de perguntas; só pode fechar.

---

## 7. Etapa Público — dimensões dos dois cards

Trecho: `FormularioAvaliacao.tsx:705-736`.

- **Grid:** `grid grid-cols-2 gap-3` — 2 colunas, `gap-3` (12px) entre os cards.
- **Padding do card:** `p-4` (16px em todos os lados).
- **Altura:** não é fixa — o card cresce pelo conteúdo (ícone + título + descrição empilhados), sem `h-` explícito.
- **Ícone:** `w-5 h-5` (20px), com `mb-2` (8px) de margem abaixo — **ícone acima do texto**, não ao lado (`text-left` no botão, mas o ícone é um bloco próprio antes do `<p>` do título, não `flex` lado a lado).
- **Cor do ícone:** `text-[var(--brand-600)]` quando selecionado, `text-gray-400` quando não.
- **Borda do card:** `border-[var(--brand-600)] bg-[var(--brand-50)]` selecionado; `border-gray-200 hover:bg-gray-50` não selecionado — mesma classe base `rounded-lg border`.

---

## Divergências com o design system do SGC

### a) `font-bold` no título do card de dica

O protótipo usa `text-base font-bold` de propósito — está documentado no próprio handoff como estado final e definitivo (`FormularioAvaliacao.tsx:984`, e o aviso no topo do handoff original explica que essa área já foi reconstruída várias vezes e essa é a versão fechada). Não há justificativa de negócio no código além de ser a decisão visual já validada para esse componente especificamente — não há um comentário dizendo "por que bold e não semibold".

**DECIDIDO — `font-semibold`, sem exceção.** Confirmado contra `02-design-system.md`: `font-bold` é reservado exclusivamente para valores numéricos de cards de métrica, sem exceção documentada para títulos de card de dica. O handoff original tinha um erro de digitação nesse ponto.

### b) Badge de habilidade comportamental em roxo

Confirmado no código: comportamental usa `bg-purple-100 text-purple-800` em pelo menos 3 lugares do fluxo (Revisão: `FormularioAvaliacao.tsx:939`; preview do questionário: `QuestionarioPreview.tsx:151`). Isso é **anterior** à decisão de 03/08/2026 registrada nas regras do projeto — o protótipo não foi atualizado para usar o componente de badge rosa do SGC depois dessa decisão.

**DECIDIDO — usar o badge do SGC, sem exceção.** A decisão de 03/08/2026 vale também para esta tela. Conferido contra a paleta real documentada em `02-design-system.md` (seção Badges → "Habilidade tipo"): `Técnica: bg-[var(--brand-100)] text-[var(--brand-800)]` / `Comportamental: bg-purple-100 text-purple-800`. Na prática, isso **não muda nenhuma cor no código** — o roxo que o protótipo já usa para Comportamental (`bg-purple-100 text-purple-800`, item (b) acima) é exatamente o valor hoje documentado em `02-design-system.md` para "Habilidade tipo", não um roxo divergente. O apelido "rosa" usado no handoff original não corresponde a nenhum token documentado; o par de cores correto — e já implementado — é o roxo/`purple-100` listado acima.

### c) Dark mode

O protótipo não tem nenhuma classe de dark mode (`dark:`) em `FormularioAvaliacao.tsx`, `SeletorGerenciaGranular.tsx`, `HabilidadesMasterDetail.tsx` ou `QuestionarioPreview.tsx` — confirmado por leitura direta, nenhuma ocorrência.

**DECIDIDO — não, fica só no tema claro por enquanto.** Dark mode ainda não foi preparado no restante do sistema.

---

## Resumo de itens que precisam decisão da Alice

Todos os itens que estavam marcados **PRECISA DECISÃO DA ALICE** (1b, 1c, 7a, 7b, 7c) foram decididos e estão registrados inline nas seções correspondentes acima.

---

## Achados adicionais resolvidos nesta rodada

Fora da numeração original do handoff — não eram perguntas do dev, foram encontrados durante a implementação das decisões acima.

- **Esc agora fecha o `QuestionarioPreview`** (antes só fechava pelo botão — ver item 6a, que registrava isso como lacuna do protótipo).
- **Bug real encontrado e corrigido:** o `publicoLabelCalculado` do caminho "Por Público-alvo" no caso misto (gerência inteira + colaboradores avulsos de outra área) gerava uma string genérica (`"N colaboradores selecionados"`) que podia colidir com qualquer outra seleção de mesmo tamanho total, mascarando a real composição e comprometendo a checagem de duplicidade de nome — exatamente o ponto crítico já sinalizado no item 3 acima. Corrigido: o formato agora nomeia a(s) gerência(s) inteira(s) e soma os avulsos, ex: `"Tecnologia + 2 colaboradores selecionados"` (`montarPublicoLabelGranular`, `FormularioAvaliacao.tsx:164-187`).
- **Auditoria completa:** todos os 30 registros de avaliação em `mockData.ts` foram conferidos contra a composição real de participantes; 15 tinham `publicoLabel` desatualizado e foram corrigidos (incluindo 1 caso misto real, id=14). 2 avaliações em Rascunho (ids 3 e 6, sem participantes materializados ainda) ficaram fora da checagem por não terem base de comparação — comportamento esperado, não é inconsistência.
