# Visão do Colaborador — auditoria de handoff

> Gerado a partir de leitura direta do código-fonte em 2026-07-17. Regra
> absoluta seguida neste documento: nada foi descrito de memória ou por
> "padrão comum". Toda afirmação sobre fórmula, tipo, condição ou constante
> vem acompanhada de citação `arquivo:linha` e, quando relevante, do trecho
> de código colado literalmente (não parafraseado). Onde não foi possível
> confirmar algo por leitura de código, está escrito explicitamente
> `NÃO ENCONTRADO NO CÓDIGO` ou `NÃO VERIFICADO — [motivo]`. Divergências
> entre comportamento esperado/nome da tela e o que o código realmente faz
> estão marcadas como `DIVERGÊNCIA`, nunca corrigidas ou ignoradas
> silenciosamente.
>
> Complementa `MINHA-CARREIRA.md` (mesma metodologia, já entregue
> separadamente).

---

## Sumário das 6 telas + menu de conta

| Tela | Rota | Arquivo | Status |
|---|---|---|---|
| Meu Perfil | `/meu-perfil` | `ColaboradorView.tsx` (via `MeuPerfilPage.tsx`→`ContentArea.tsx`) | Funcional, com placeholder interno declarado |
| Minhas Avaliações | `/minhas-avaliacoes` | `MinhasAvaliacoes.tsx` (via `MinhasAvaliacoesPage.tsx`→`ContentArea.tsx`) | Funcional sobre dado 100% mock local, desconectado de `mockData.ts` |
| Radar de Competências | `/testes/radar` | `TesteRadarPage.tsx` | Tela de teste/exploração (rota fora do fluxo oficial do Colaborador) |
| Barras por Habilidade | `/testes/barras` | `TesteBarrasPage.tsx` | Tela de teste/exploração — tem banner "Tela de teste" explícito |
| Screening Report | `/testes/screening` | `TesteScreeningPage.tsx` | Tela de teste/exploração — tem banner "Tela de teste" explícito |
| Benchmark Mode | `/testes/benchmark` | `TesterBenchmarkPage.tsx` | Tela de teste/exploração — tem banner "Tela de teste" explícito |

Rotas confirmadas em `src/app/routes.ts:45,46,50-53`:
```ts
{ path: "meu-perfil", Component: MeuPerfilPage },
{ path: "minhas-avaliacoes", Component: MinhasAvaliacoesPage },
...
{ path: "testes/radar",     Component: TesteRadarPage },
{ path: "testes/barras",    Component: TesteBarrasPage },
{ path: "testes/screening", Component: TesteScreeningPage },
{ path: "testes/benchmark", Component: TesterBenchmarkPage },
```

`DIVERGÊNCIA` a registrar antes de entrar em cada tela: as 4 telas de
"testes" (Radar/Barras/Screening/Benchmark) estão sob rota `/testes/*`, no
grupo `menuItemsTestes` da sidebar (`src/app/components/Sidebar.tsx:59-64`),
dentro de um grupo colapsável rotulado **"Testes"**, visualmente distinto
dos 3 itens reais do Colaborador (Meu Perfil / Minhas Avaliações / Minha
Carreira, `Sidebar.tsx:53-57`). Apenas `TesteBarrasPage.tsx`,
`TesteScreeningPage.tsx` e `TesterBenchmarkPage.tsx` têm o banner de aviso
"Tela de teste. Visualização experimental... Não utilizar como referência de
produto" no próprio JSX. **`TesteRadarPage.tsx` não tem esse banner** —
confirmado por leitura completa do arquivo, nenhuma ocorrência de
`FlaskConical` nem de texto "Tela de teste". Isso é uma inconsistência entre
as 4 telas de teste, não um comportamento intencional documentado em
comentário.

---

## 1. Meu Perfil (`/meu-perfil`)

### 1.1 Visão geral
- **Propósito**: dashboard pessoal do colaborador — saudação, 4 cards de
  métrica, e uma seção de detalhamento de habilidades (hoje um placeholder
  "Em construção").
- **Arquivo real**: `src/app/components/ColaboradorView.tsx`. `MeuPerfilPage.tsx`
  é um wrapper de 19 linhas que só repassa `viewMode`/`isSidebarCollapsed`
  para `ContentArea` com `selectedItem="meu-perfil"`
  (`src/app/pages/MeuPerfilPage.tsx:9-19`); `ContentArea.tsx:248` renderiza
  `<ColaboradorView />` quando `viewMode === 'colaborador'` e
  `selectedItem === 'meu-perfil'`.
- **Rota**: `/meu-perfil` (`routes.ts:45`).

### 1.2 Estrutura da página

Container raiz, `ColaboradorView.tsx:163-227`:
```tsx
return (
  <div className="space-y-6">
    {/* HEADER - Full Width */}
    <div
      className="rounded-xl border border-slate-200 p-6 md:p-8"
      style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}
    >
      ...
    </div>

    {/* Cards de Resumo */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      ...4 cards...
    </div>

    {/* Detalhamento de Habilidades — placeholder... */}
    <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
      <Construction className="w-8 h-8 text-gray-300 mx-auto mb-3" />
      <p className="text-sm font-medium text-gray-700 mb-1">Em construção</p>
      <p className="text-sm text-gray-500">
        Esta seção ainda está em definição — não deve ser usada como referência para o desenvolvimento.
      </p>
    </div>
  </div>
);
```
3 blocos, nesta ordem: **Header** (saudação) → **4 cards de métrica** →
**placeholder "Em construção"**. Não há tabs, não há mais nenhuma seção.

#### Header
```tsx
// ColaboradorView.tsx:159-177
const hora = new Date().getHours();
const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
const primeiroNome = colaborador.nome.split(' ')[0];
...
<h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
  {saudacao}, {primeiroNome}. 👋🏻
</h1>
<p className="text-sm text-gray-600 mt-1">
  {colaborador.cargo} · {colaborador.senioridade} · {colaborador.tempoNoCargo} no cargo
</p>
```
`colaborador` é um objeto **hardcoded** dentro do componente
(`ColaboradorView.tsx:21-27`):
```ts
const colaborador = {
  nome: 'João Silva',
  cargo: 'Desenvolvedor Frontend',
  senioridade: 'Pleno',
  tempoNoCargo: '1 ano e 3 meses',
  jornada: 'Engenharia de Software',
};
```
`DIVERGÊNCIA`: este objeto **não vem de `mockData.ts`** — é uma cópia
manual, desconectada de `colaboradoresData` (onde João Silva tem
`cargo: 'Desenvolvedor Pleno'`, não `'Desenvolvedor Frontend'` —
`mockData.ts:683`). Os dois arquivos descrevem o mesmo colaborador com
cargo/senioridade diferentes. Isso viola diretamente a regra do projeto em
`06-integridade-de-dados.md` ("nunca dado duplicado à mão"), mas é o estado
real do código hoje.

#### 4 cards de métrica
Todos no mesmo padrão visual (`bg-white border border-gray-200 rounded-lg p-5`),
`ColaboradorView.tsx:180-212`:

| # | Label exato | Ícone | Fonte do valor |
|---|---|---|---|
| 1 | "Avaliações em aberto" | `Clock` | `avaliacoesEmAberto` |
| 2 | "Próxima avaliação encerra em" | `CalendarClock` | `diasLabel` |
| 3 | "Habilidades abaixo do esperado" | `AlertCircle` | `habilidadesComGap` |
| 4 | "Avaliações concluídas" | `CheckCircle2` | `avaliacoesConcluidas` |

O 4º card, citado como "cortado na captura" no pedido — confirmado por
leitura direta do JSX (`ColaboradorView.tsx:206-212`):
```tsx
<div className="bg-white border border-gray-200 rounded-lg p-5">
  <div className="flex items-center justify-between mb-3">
    <span className="text-base font-semibold text-gray-700">Avaliações concluídas</span>
    <CheckCircle2 className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
  </div>
  <p className="text-3xl font-bold text-gray-900">{avaliacoesConcluidas}</p>
</div>
```
Rótulo completo: **"Avaliações concluídas"**. Ícone: `CheckCircle2`
(lucide-react). Significado: contagem de avaliações com `status === 'Concluída'`
no array local `avaliacoesColaborador` (ver 1.3).

### 1.3 Regras de cálculo e cores

Todos os dados dos cards vêm de arrays **hardcoded dentro do próprio
componente**, não de `mockData.ts` — colados por inteiro abaixo.

```ts
// ColaboradorView.tsx:29-46 — 16 entradas fixas
const habilidadesNiveis: { id: string; nivel: string }[] = [
  { id: '1',  nivel: 'Avançado' },      { id: '2',  nivel: 'Avançado' },
  { id: '3',  nivel: 'Intermediário' }, { id: '4',  nivel: 'Intermediário' },
  { id: '5',  nivel: 'Intermediário' }, { id: '6',  nivel: 'Intermediário' },
  { id: '7',  nivel: 'Básico' },        { id: '8',  nivel: 'Avançado' },
  { id: '9',  nivel: 'Avançado' },      { id: '10', nivel: 'Intermediário' },
  { id: '11', nivel: 'Básico' },        { id: '12', nivel: 'Intermediário' },
  { id: '13', nivel: 'Intermediário' }, { id: '14', nivel: 'Intermediário' },
  { id: '15', nivel: 'Avançado' },      { id: '16', nivel: 'Avançado' },
];
```
```ts
// ColaboradorView.tsx:121-127
const avaliacoesColaborador: { id: string; status: string; dataLimite?: Date }[] = [
  { id: '1', status: 'Não iniciada', dataLimite: new Date(2026, 5, 20) },
  { id: '4', status: 'Em andamento', dataLimite: new Date(2026, 6, 5) },
  { id: '2', status: 'Concluída' },
  { id: '5', status: 'Concluída' },
  { id: '6', status: 'Expirada' },
];
```
`DIVERGÊNCIA`: `avaliacoesColaborador` aqui **não é o mesmo array** que
`avaliacoesMock` em `MinhasAvaliacoes.tsx` (seção 2) — os dois têm IDs e
status parcialmente coincidentes mas são declarações totalmente separadas,
sem nenhuma importação cruzada. Se o número de "Avaliações em aberto" em
Meu Perfil bater ou não com "Minhas Avaliações" é coincidência de dado
mockado, não uma relação garantida por código.

Fórmulas exatas dos 4 cards:
```ts
// ColaboradorView.tsx:129-135
const avaliacoesEmAberto = avaliacoesColaborador.filter(
  a => a.status === 'Não iniciada' || a.status === 'Em andamento'
).length;

const avaliacoesConcluidas = avaliacoesColaborador.filter(
  a => a.status === 'Concluída'
).length;
```
```ts
// ColaboradorView.tsx:137-149 — "Próxima avaliação encerra em"
const emAbertoComPrazo = avaliacoesColaborador.filter(
  a => (a.status === 'Não iniciada' || a.status === 'Em andamento') && a.dataLimite
);
const proximaVencimento = emAbertoComPrazo.length > 0
  ? emAbertoComPrazo.reduce((min, a) => a.dataLimite! < min.dataLimite! ? a : min)
  : null;
const hoje = new Date();
const diasAteVencimento = proximaVencimento
  ? Math.max(0, Math.ceil((proximaVencimento.dataLimite!.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)))
  : null;
const diasLabel = diasAteVencimento !== null
  ? `${diasAteVencimento} ${diasAteVencimento === 1 ? 'dia' : 'dias'}`
  : '—';
```
```ts
// ColaboradorView.tsx:151-157 — "Habilidades abaixo do esperado"
const nivelPeso: Record<string, number> = { 'Básico': 1, 'Intermediário': 2, 'Avançado': 3, 'Especialista': 4 };
const cargoAtual = cargos.find(c => c.atual)!;
const mapaColaborador = new Map(habilidadesColaborador.map(h => [h.habilidadeId, h.nivelAtual]));
const habilidadesComGap = cargoAtual.matrizCargo.filter(req => {
  const nivelAtual = mapaColaborador.get(req.habilidadeId) ?? '';
  return !calcularCobertura(nivelPeso[nivelAtual] ?? 0, nivelPeso[req.nivelEsperado] ?? 0);
}).length;
```
`DIVERGÊNCIA`: o mapa `nivelPeso` local (`Básico=1, Intermediário=2,
Avançado=3, Especialista=4`) **é diferente** do `niveisDefaultData` de
`mockData.ts` (`Básico=1, Intermediário=2, Avançado=4, Especialista=5,
Proficiente=3` — `mockData.ts:3336-3341`). O peso de "Avançado" e
"Especialista" diverge entre este card e o resto do sistema (inclusive de
"Minha Carreira", que usa `getPesoFromNome` de `mockData.ts`). Isso é uma
segunda escala de peso paralela, específica deste componente, não
documentada em `04-regras-negocio.md`.

`calcularCobertura` vem de `src/app/utils/cobertura.ts` — importado, não
redefinido aqui (`ColaboradorView.tsx:8`: `import { calcularCobertura, ... } from '../utils/cobertura';`).
Não copiei o corpo de `calcularCobertura` porque está fora do escopo desta
tela (é um util compartilhado); confirme o arquivo `cobertura.ts` separadamente
se for reimplementar essa fórmula.

`cargos` (array de 3 entradas com `matrizCargo` por cargo, incluindo o cargo
atual `atual: true`) também é **hardcoded dentro do componente**
(`ColaboradorView.tsx:52-119`), com sua própria matriz de habilidades por
cargo — uma terceira fonte de dado de matriz de cargo dentro do sistema
(além de `habilidadesCargoData` do admin e `joaoHabilidadesCargoMatriz` de
"Minha Carreira"), sem nenhuma relação entre as três.

### 1.4 "Detalhamento de Habilidades" — status real

`ColaboradorView.tsx:215-225`:
```tsx
{/* Detalhamento de Habilidades — placeholder sem caráter oficial de
    produto removido a pedido; substituído por aviso "Em construção"
    (Estados vazios — B — Orientativo, 02-design-system.md) para não
    servir de referência de desenvolvimento. */}
<div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
  <Construction className="w-8 h-8 text-gray-300 mx-auto mb-3" />
  <p className="text-sm font-medium text-gray-700 mb-1">Em construção</p>
  <p className="text-sm text-gray-500">
    Esta seção ainda está em definição — não deve ser usada como referência para o desenvolvimento.
  </p>
</div>
```
Confirmado: **hoje é só um placeholder estático**, sem filtro, sem tabela,
sem toggle, sem paginação — todos esses elementos existiram numa versão
anterior deste componente e foram removidos nesta mesma sessão de trabalho
(sessão anterior a esta auditoria). Não há "colunas", "filtros" ou
"alternâncias" para documentar aqui porque nenhum desses elementos existe
no código atual. Se o pedido original presumia que essa tabela ainda
existisse, isso é uma `DIVERGÊNCIA` com o estado real do código — a tabela
foi removida deliberadamente.

### 1.5 Componentes e padrões visuais reutilizados
- Cards de métrica: `bg-white border border-gray-200 rounded-lg p-5`,
  label `text-base font-semibold text-gray-700`, valor
  `text-3xl font-bold text-gray-900`, ícone `w-5 h-5 text-[var(--brand-600)]
  flex-shrink-0` à direita — mesmo padrão documentado em
  `02-design-system.md` ("Cards de métrica").
- Estado "Em construção": mesma classe da variante B (Orientativo) de
  Estados vazios (`02-design-system.md`) — `bg-white border border-gray-200
  rounded-lg p-8 text-center`, ícone `w-8 h-8 text-gray-300 mx-auto mb-3`
  sem wrapper.
- Header com gradiente slate (`from #f8fafc to #e2e8f0`) — não documentado
  em `02-design-system.md` como padrão geral; é específico deste card
  (comparável ao "Card de identificação" citado nas regras do DS como
  exceção com gradiente, mas não é o mesmo componente).

### 1.6 Limitações conhecidas / dívida técnica
- Todo o dado da tela (colaborador, habilidades, cargos, avaliações) é
  **hardcoded dentro do componente**, não lido de `mockData.ts` — três
  arrays/objetos que duplicam parcialmente dados que já existem na fonte
  única do sistema, com valores divergentes (cargo do colaborador, escala
  de peso de nível).
- `nivelPeso` usa uma escala de peso diferente da usada no resto do sistema
  (`getPesoFromNome`/`niveisDefaultData`).
- "Detalhamento de Habilidades" é oficialmente um placeholder — qualquer
  reimplementação precisa de definição de produto nova, não há nada para
  copiar aqui.
- `NÃO VERIFICADO — sem ferramenta de captura de tela nesta sessão`: não é
  possível confirmar visualmente o resultado renderizado do header com
  gradiente ou dos cards em modo claro/escuro.

---

## 2. Minhas Avaliações (`/minhas-avaliacoes`)

### 2.1 Visão geral
- **Propósito**: listar avaliações do colaborador (em aberto e histórico),
  permitir responder uma avaliação em aberto e ver o resultado de uma
  avaliação concluída.
- **Arquivo real**: `src/app/components/MinhasAvaliacoes.tsx`. Mesmo padrão
  de wrapper de `MinhasAvaliacoesPage.tsx:9-19` → `ContentArea.tsx` →
  `<MinhasAvaliacoes />`. Confirmado em `ContentArea.tsx:248-249`:
  ```tsx
  {selectedItem === 'meu-perfil' && <ColaboradorView />}
  {selectedItem === 'minhas-avaliacoes' && <MinhasAvaliacoes />}
  ```
- **Rota**: `/minhas-avaliacoes` (`routes.ts:46`).
- Este componente controla **3 sub-visualizações internas** via
  `useState<'lista' | 'responder' | 'resultado'>` (`MinhasAvaliacoes.tsx:95`)
  — não são rotas separadas, é troca de conteúdo dentro do mesmo componente:
  - `'lista'` → a própria tela de "Minhas Avaliações".
  - `'responder'` → renderiza `<RespostaAvaliacao avaliacao={...} onVoltar={...} />`
    (`src/app/components/RespostaAvaliacao.tsx`).
  - `'resultado'` → renderiza `<ResultadoAvaliacao avaliacao={...} onVoltar={...} />`
    (`src/app/components/ResultadoAvaliacao.tsx`).

`DIVERGÊNCIA` com o padrão de navegação documentado em `03-navegacao.md`
("navegação do Colaborador usa rotas separadas no React Router — nunca
`viewMode` condicional na mesma rota"): aqui a troca entre lista/responder/
resultado **não usa rota nenhuma** — é `useState` local trocando qual
componente é renderizado, a URL continua `/minhas-avaliacoes` o tempo todo.
Isso é o mesmo padrão que a regra do projeto explicitamente proíbe para
Colaborador (a regra cita `viewMode`, aqui é uma variável de nome diferente
mas o mecanismo — estado local trocando componente sem mudar rota — é
idêntico).

### 2.2 Estrutura da página (visão 'lista')

`MinhasAvaliacoes.tsx:126-315`:
```tsx
return (
  <div className="space-y-6">
    {/* Header */}
    <div>...</div>

    {/* Cards de resumo */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">...</div>

    {/* Avaliações Pendentes */}
    {(naoIniciadas.length > 0 || emAndamento.length > 0) && (
      <div className="bg-white rounded-lg border border-gray-200">...</div>
    )}

    {/* Histórico de Avaliações (Concluídas + Expiradas) */}
    {(concluidas.length > 0 || expiradas.length > 0) && (
      <div className="bg-white rounded-lg border border-gray-200">...</div>
    )}
  </div>
);
```
4 blocos: Header → 3 cards de resumo → lista "Avaliações em aberto" (só
aparece se houver alguma) → lista "Histórico de Avaliações" (só aparece se
houver alguma).

### 2.3 Regras de cálculo e cores

**Fonte de dado — 100% local, array hardcoded no topo do arquivo**
(`MinhasAvaliacoes.tsx:18-92`, 6 entradas), não importado de `mockData.ts`.
Estrutura de uma entrada (a única com `resultado` completo, colada por
inteiro):
```ts
{
  id: '2',
  titulo: 'Avaliação de Liderança 2026',
  periodo: '15/02 - 28/02/2026',
  status: 'Concluída',
  tipo: 'Autoavaliação',
  competencias: 2,
  habilidades: 10,
  progresso: 100,
  dataLimite: '28 de fevereiro de 2026',
  resultado: {
    media: 3.8,
    distribuicao: [
      { nivel: 'Básico', quantidade: 1 },
      { nivel: 'Intermediário', quantidade: 3 },
      { nivel: 'Avançado', quantidade: 5 },
      { nivel: 'Especialista', quantidade: 1 },
    ],
  },
},
```
Comentário de topo do arquivo (`MinhasAvaliacoes.tsx:6-15`) documenta a
correspondência de status Colaborador↔Admin, colado por inteiro:
```
/*
 * Estados possíveis de uma avaliação para o colaborador:
 *
 * "Não iniciada" — Admin: Ativa    | Colaborador não começou a responder
 * "Em andamento" — Admin: Ativa    | Colaborador começou mas não concluiu
 * "Concluída"    — Admin: Encerrada | Colaborador respondeu dentro do prazo
 * "Expirada"     — Admin: Encerrada | Colaborador não respondeu (prazo encerrado sem resposta)
 *
 * Avaliações com status Admin "Rascunho" não são exibidas ao colaborador.
 */
```
Isso bate com a regra documentada em `04-regras-negocio.md` ("Rascunho
nunca visível ao colaborador"), mas **é aplicado só por convenção do dado
mockado** (nenhuma avaliação no array tem status "Rascunho") — não há
nenhum filtro de código que ative essa regra ativamente; se um item com
status inválido fosse adicionado ao array, nada o impediria de aparecer.

Cálculo dos 3 cards de resumo (`MinhasAvaliacoes.tsx:121-163`):
```ts
const naoIniciadas = avaliacoesMock.filter(a => a.status === 'Não iniciada');
const emAndamento = avaliacoesMock.filter(a => a.status === 'Em andamento');
const concluidas = avaliacoesMock.filter(a => a.status === 'Concluída');
const expiradas = avaliacoesMock.filter(a => a.status === 'Expirada');
```
```tsx
<p className="text-3xl font-bold text-gray-900">{naoIniciadas.length + emAndamento.length}</p>
// ...
<p className="text-3xl font-bold text-gray-900">{concluidas.length}</p>
// ...
<p className="text-3xl font-bold text-gray-900">
  {concluidas.length > 0 ? concluidas[0].resultado?.media : '-'}
</p>
```
`DIVERGÊNCIA`: o card "Última média obtida" usa `concluidas[0]` — **o
primeiro item do array `avaliacoesMock` cujo status é "Concluída", na ordem
em que está declarado no array**, não necessariamente a avaliação mais
recente por data. A ordem declarada no array é: id 1, 4, 2, 5, 6 — os dois
itens "Concluída" são id 2 (fev/2026) e id 5 (jan/2026), nessa ordem. Como
id 2 aparece primeiro no array, `concluidas[0]` é sempre a Avaliação de
Liderança 2026 (média 3.8), mesmo que exista uma avaliação concluída mais
recente. Não há nenhuma ordenação por `dataLimite` ou `periodo` aplicada
antes desse `[0]`.

Cores de badge de status (`MinhasAvaliacoes.tsx:182-188` e `:256-260`):
```tsx
className={`... ${
  avaliacao.status === 'Não iniciada'
    ? 'bg-orange-100 text-orange-800'
    : 'bg-blue-100 text-blue-800'
}`}
// ...
className={`... ${
  avaliacao.status === 'Concluída'
    ? 'bg-green-100 text-green-800'
    : 'bg-gray-100 text-gray-700'
}`}
```
Isto é: laranja = Não iniciada, azul = Em andamento (implícito, é o `else`
do primeiro bloco, só chamado dentro do `.map` de `[...naoIniciadas, ...emAndamento]`
onde só essas duas opções existem), verde = Concluída, cinza = Expirada
(implícito, `else` do segundo bloco). Bate exatamente com a tabela "Estados
de avaliação — Colaborador (derivados)" de `04-regras-negocio.md`.

### 2.4 `RespostaAvaliacao.tsx` — visão 'responder'

`DIVERGÊNCIA` importante: este componente usa um **array de competências
totalmente diferente e desconectado** — `competenciasMock`
(`RespostaAvaliacao.tsx:12-40`, 3 competências fixas: "Desenvolvimento
Frontend", "Desenvolvimento Backend", "DevOps e Infraestrutura"), **sempre
o mesmo conteúdo independentemente de qual avaliação foi clicada**. A prop
`avaliacao: any` (`:6-9`) só é usada para exibir `avaliacao.titulo`/`periodo`/`tipo`
no header — o conteúdo de competências/habilidades respondível **nunca
muda** conforme a avaliação selecionada.

Seletor de nível — mostra **todos os 10 níveis de `niveisDefaultData`** para
toda habilidade, sem filtrar por escala (`RespostaAvaliacao.tsx:143`):
```tsx
{niveisDefaultData.map((nivel) => {
  const isSelected = respostas[habilidade.id] === nivel.id;
  return (
    <button
      key={nivel.id}
      onClick={() => handleNivelChange(habilidade.id, nivel.id)}
      ...
```
Como `niveisDefaultData` tem 10 entradas (as duas escalas — Básico/
Intermediário/Avançado/Especialista/Proficiente **e**
Iniciante/Aprendiz/Praticante/Experiente/Referência — juntas,
`mockData.ts:3336-3346`), o seletor renderiza **as 10 opções misturadas**
para toda habilidade, independente de qual escala essa habilidade
realmente usa. `04-regras-negocio.md`/`06-integridade-de-dados.md` exigem
cruzar por peso/escala corretos — este componente não faz nenhum filtro
desse tipo.

Envio (`RespostaAvaliacao.tsx:66-75`):
```ts
const handleEnviar = () => {
  if (respondidas < totalHabilidades) {
    toast.error('Por favor, avalie todas as habilidades antes de enviar.');
    return;
  }
  toast.success('Avaliação enviada com sucesso!');
  setTimeout(() => {
    onVoltar();
  }, 1500);
};
```
Confirmado: **não há persistência real** — nem em `mockData.ts`, nem em
`localStorage`, nem em nenhum estado elevado a um componente pai. Um toast
de sucesso aparece e a tela volta para a lista após 1.5s; as respostas
dadas são perdidas assim que o componente desmonta. `handleSalvarRascunho`
(`:62-64`) também só dispara um `toast.success`, sem persistir nada.

### 2.5 `ResultadoAvaliacao.tsx` — visão 'resultado'

`DIVERGÊNCIA` mais severa desta tela: a seção "Resultados por Competência"
usa um objeto **hardcoded e fixo**, `resultadoDetalhado`
(`ResultadoAvaliacao.tsx:10-33`), com as mesmas 2 competências
("Desenvolvimento Frontend", "Desenvolvimento Backend") sempre, **para
qualquer avaliação clicada**. A prop `avaliacao` só alimenta os 3 cards de
resumo do topo (`avaliacao.resultado?.media`, `avaliacao.habilidades`,
`avaliacao.competencias`) e o banner de distribuição
(`avaliacao.resultado?.distribuicao`) — a lista detalhada de
habilidades/níveis por competência **nunca reflete a avaliação real
selecionada**. Isso é verificável comparando: clicar em "Ver resultado" na
Avaliação de Liderança 2026 (id 2) ou em Competências Analíticas (id 5)
produz exatamente a mesma seção "Resultados por Competência" (mesmas
habilidades React/TypeScript/Figma/Node.js/PostgreSQL/Python, mesmos
níveis), porque `resultadoDetalhado` é uma constante do módulo, não
derivada de `avaliacao`.

### 2.6 Componentes e padrões visuais reutilizados
- Mesmo padrão de card de métrica (`bg-white border border-gray-200
  rounded-lg p-5`) usado em Meu Perfil e no resto do sistema.
- Badges de status: cores confirmadas na seção 2.3, batem com
  `04-regras-negocio.md`.
- Barra de progresso simples (`bg-gray-200 rounded-full h-2` com preenchimento
  `bg-[var(--brand-600)]`) — não documentada explicitamente em
  `02-design-system.md` como um padrão nomeado; é específica desta lista.
- Mensagem de orientação — variante B (slate) usada no topo de
  `RespostaAvaliacao.tsx` ("Instruções:") — bate com o padrão documentado.
- Banner de contexto — variante A (brand) usada no topo de
  `ResultadoAvaliacao.tsx` — é a mesma instância citada (antes da correção
  desta sessão) na tabela "Onde é usado" de `DesignSystemPage.tsx`
  (`ResultadoAvaliacao.tsx:85` — ver `MINHA-CARREIRA.md`, achados do Passo 1
  da tarefa anterior).

### 2.7 Limitações conhecidas / dívida técnica
- Toda a tela roda sobre 3 conjuntos de dados **mockados, hardcoded e
  mutuamente desconectados** (`avaliacoesMock` em `MinhasAvaliacoes.tsx`,
  `competenciasMock` em `RespostaAvaliacao.tsx`, `resultadoDetalhado` em
  `ResultadoAvaliacao.tsx`) — nenhum vem de `mockData.ts`.
- O fluxo "responder avaliação" não persiste nada — é inteiramente
  cosmético (toast + navegação de volta).
- O fluxo "ver resultado" mostra sempre o mesmo detalhamento por
  competência, independentemente da avaliação selecionada — um bug de
  produto real caso a intenção seja mostrar dados por avaliação.
- Navegação lista/responder/resultado não usa rotas — viola o padrão
  documentado em `03-navegacao.md` para o módulo Colaborador.
- `NÃO VERIFICADO — sem ferramenta de captura de tela nesta sessão`: layout
  responsivo e aparência em modo escuro não confirmados visualmente.

---

## 3. Radar de Competências (`/testes/radar`)

### 3.1 Visão geral
- **Propósito**: radar comparando o perfil de habilidades de João (por
  competência, tipo Técnica/Comportamental) contra um cargo de referência
  escolhido via 3 dropdowns encadeados (Gerência → Cargo → Nível).
- **Arquivo**: `src/app/pages/testes/TesteRadarPage.tsx` (528 linhas).
- **Rota**: `/testes/radar` (`routes.ts:50`).
- **Status**: tela de teste/exploração — está fora da hierarquia oficial
  do Colaborador documentada em `03-navegacao.md` (que lista só Meu Perfil /
  Minhas Avaliações / Minha Carreira). Vive dentro do grupo colapsável
  "Testes" da sidebar.

### 3.2 Estrutura da página

`TesteRadarPage.tsx:326-527`:
```
Header ("Radar de Competências")
Filtros (card único): Tipo (pill Técnica/Comportamental) + 3 dropdowns encadeados + "Limpar"
Nota informativa (só aparece se um cargo estiver selecionado)
Radar + Painel lateral (flex, 60%/40%):
  - Radar card: <RadarSection> (RadarChart do recharts)
  - Painel lateral: lista de competências com checkbox, ordenada por gap
```

### 3.3 Regras de cálculo e cores

**Cadeia de dropdowns** — Gerência (`selectedArea`) → Cargo
(`selectedCargoBase`) → Nível (`selectedSenioridade`) → resolve um `cargoId`
único (`TesteRadarPage.tsx:136-163`):
```ts
const areasDisponiveis = useMemo(
  () => [...new Set(benchmarkCargosData.map(c => c.area))],
  [],
);
const cargosParaArea = useMemo(
  () => selectedArea
    ? [...new Set(benchmarkCargosData.filter(c => c.area === selectedArea).map(c => c.cargoBase))]
    : [],
  [selectedArea],
);
const niveisParaCargo = useMemo(
  () => selectedCargoBase
    ? benchmarkCargosData
        .filter(c => c.area === selectedArea && c.cargoBase === selectedCargoBase)
        .map(c => c.senioridade)
    : [],
  [selectedArea, selectedCargoBase],
);
const cargoId = useMemo(
  () => selectedSenioridade
    ? (benchmarkCargosData.find(
        c => c.area === selectedArea
          && c.cargoBase === selectedCargoBase
          && c.senioridade === selectedSenioridade,
      )?.id ?? '')
    : '',
  [selectedArea, selectedCargoBase, selectedSenioridade],
);
```
`benchmarkCargosData` tem **17 cargos** (contado por leitura direta do
array, `mockData.ts:3471-3489`: 1 `CARGO_ATUAL` + 16 `cb*`) em **7 áreas**
(Tecnologia, Dados e Analytics, Infraestrutura e Cloud, Arquitetura,
Segurança da Informação, Liderança Técnica, Produto). A área "Tecnologia"
contém **só** o cargo `CARGO_ATUAL` (o próprio cargo atual de João —
`nome: 'Desenvolvedor Pleno'`).

Matriz ativa por cargo selecionado (`:180-187`):
```ts
const activeMatrix = useMemo<MatrizEntry[]>(
  () => {
    if (!cargoId) return [];
    if (cargoId === 'CARGO_ATUAL') return joaoHabilidadesCargoMatriz;
    return habilidadesCargoDataBenchmark.filter(h => h.cargoId === cargoId);
  },
  [cargoId],
);
```
Selecionar "Tecnologia → Desenvolvedor → Pleno" resolve para `CARGO_ATUAL`,
que retorna `joaoHabilidadesCargoMatriz` (a mesma matriz de 34 habilidades
enriquecida especificamente para João, documentada em `MINHA-CARREIRA.md`
seção 3) — ou seja, um dos "cargos de benchmark" disponíveis é, na prática,
o próprio perfil de João comparado contra si mesmo.

Peso médio por competência — João (`:192-207`) e Cargo (`:209-227`), ambos
dentro do mesmo `useMemo` `computedMaps`:
```ts
// Pass 1: todas as avaliações de João (tipo filtrado)
for (const [habilidadeId, nivelAtual] of mapaJoao) {
  const hab = habilidadesData.find(h => h.id === habilidadeId);
  if (!hab || hab.tipo !== tipoFiltro) continue;
  const peso = pesoNivel(nivelAtual);
  if (peso === 0) continue;
  const comp = hab.competencia;
  if (!mapJoaoAll.has(comp)) mapJoaoAll.set(comp, { soma: 0, count: 0 });
  mapJoaoAll.get(comp)!.soma += peso;
  mapJoaoAll.get(comp)!.count++;
}

// Pass 2: matriz do cargo (referência + tooltip)
for (const req of activeMatrix) {
  const hab = habilidadesData.find(h => h.id === req.habilidadeId);
  if (!hab || hab.tipo !== tipoFiltro) continue;
  const comp = hab.competencia;
  const pesoEsperado = pesoNivel(req.nivelEsperado);

  if (!mapCargoAll.has(comp)) mapCargoAll.set(comp, { soma: 0, count: 0 });
  mapCargoAll.get(comp)!.soma += pesoEsperado;
  mapCargoAll.get(comp)!.count++;

  const nivelAtual = mapaJoao.get(req.habilidadeId);
  if (nivelAtual) {
    const peso = pesoNivel(nivelAtual);
    if (peso > 0 && peso < pesoEsperado) {
      tooltipAbaixo.set(comp, (tooltipAbaixo.get(comp) ?? 0) + 1);
    }
  }
}
```
Cada eixo do radar = **peso médio** (`soma / count`) das habilidades daquela
competência, do tipo filtrado (`tipoFiltro`), não a mesma fórmula de
"% no esperado" usada em "Minha Carreira" — é uma métrica diferente (peso
médio absoluto na escala 1–5, não percentual de aderência).

`getHabilidadesAvaliadasColaborador` (usada para `mapaJoao`) vem de
`mockData.ts:3382-3402` — **não** é `getNivelAtualColaboradorTeste` usada em
"Minha Carreira"/`minhaCarreiraShared.tsx`. São duas funções diferentes que
resolvem "nível atual do colaborador" a partir de fontes diferentes:
`getHabilidadesAvaliadasColaborador` lê de `avaliacoesData` (avaliações
formais, participantes/respostas), enquanto `getNivelAtualColaboradorTeste`
lê de `avaliacoesColaboradoresData` (array plano de respostas). Isso
significa que **o "nível atual" de João pode ser diferente entre "Minha
Carreira" e "Radar de Competências"**, dependendo de qual dessas duas
fontes tem dado para cada habilidade — não confirmei se os dois conjuntos
de dados estão sincronizados entre si (fora do escopo desta auditoria
pontual, mas é um risco relevante a registrar).

**Seleção máxima de 10 competências no radar**
(`TesteRadarPage.tsx:31,262-266,312-322`):
```ts
const MAX_SELECIONADAS = 10;
...
useEffect(() => {
  setCompetenciasSelecionadas(
    new Set(listaCompetencias.slice(0, MAX_SELECIONADAS).map(c => c.nome)),
  );
}, [listaCompetencias]);
...
function handleToggleCompetencia(nome: string) {
  setCompetenciasSelecionadas(prev => {
    const next = new Set(prev);
    if (next.has(nome)) {
      next.delete(nome);
    } else if (next.size < MAX_SELECIONADAS) {
      next.add(nome);
    }
    return next;
  });
}
```
Ao trocar cargo/tipo, a seleção **é resetada automaticamente** para as 10
competências de maior gap (não preserva a seleção manual do usuário entre
trocas de filtro).

**Cores fixas** (`:32-34`):
```ts
const COR_TECNICA        = 'var(--brand-600)';
const COR_COMPORTAMENTAL = '#9333ea';
const COR_REFERENCIA     = '#94a3b8';
```
Azul da marca para João quando `tipoFiltro === 'Técnica'`, roxo
(`#9333ea`, não documentado em `02-design-system.md`) quando
`'Comportamental'`; cinza-azulado (`#94a3b8`) sempre para a série "Cargo"
de referência. Painel lateral (gap por competência,
`:501-515`): texto vermelho `text-red-500` "Abaixo do esperado" quando
`gap > 0`, verde `text-green-600` "Acima do esperado" quando `gap < 0`,
mesmo verde "No esperado" quando `gap === 0`, cinza `text-slate-400` "Não
mapeado" quando `gap === null` (habilidade sem avaliação de João nessa
competência). Este é mais um sistema de cor **independente** dos
documentados em `MINHA-CARREIRA.md`.

### 3.4 Componentes e padrões visuais reutilizados
- `RadarChart`/`PolarGrid`/`PolarAngleAxis`/`PolarRadiusAxis`/`Radar`/`Tooltip`
  do recharts — biblioteca já usada em outras telas de teste (Benchmark
  Mode, seção 6) mas com configuração de eixos diferente lá.
- Pills de tipo (`bg-gray-100 rounded-lg p-1`, item ativo `bg-white
  text-gray-900 shadow-sm`) — mesmo padrão documentado em
  `02-design-system.md`.
- `Select`/`SelectContent`/`SelectItem`/`SelectTrigger`/`SelectValue` de
  `ui/select.tsx` — componente Radix compartilhado, mesmo usado em telas
  admin.
- Checkbox customizado (SVG inline de check, não o componente `ui/checkbox.tsx`)
  no painel lateral de competências — **não reaproveita** nenhum componente
  de checkbox existente no sistema, é markup próprio desta tela.

### 3.5 Limitações conhecidas / dívida técnica
- Sem banner "Tela de teste" (única entre as 4, ver Sumário) — inconsistência
  a corrigir se as 4 telas forem tratadas como um grupo coeso.
- Duas fontes de "nível atual do colaborador" potencialmente dessincronizadas
  entre esta tela e "Minha Carreira" (ver acima).
- `NÃO VERIFICADO — sem ferramenta de captura de tela`: aparência real do
  radar renderizado, comportamento em modo escuro.

---

## 4. Barras por Habilidade (`/testes/barras`)

### 4.1 Visão geral
- **Propósito**: lista todas as habilidades de João agrupadas por
  competência, com barra comparando nível atual vs. nível exigido por um
  cargo de referência (dropdowns encadeados iguais ao Radar), com busca e
  colapso por competência.
- **Arquivo**: `src/app/pages/testes/TesteBarrasPage.tsx` (401 linhas).
- **Rota**: `/testes/barras` (`routes.ts:51`).
- **Status**: tela de teste — **tem** o banner "Tela de teste"
  (`TesteBarrasPage.tsx:148-153`).

### 4.2 Estrutura da página

`TesteBarrasPage.tsx:143-399`:
```
Banner de teste (FlaskConical)
Header ("Barras por Habilidade")
Filtros: Tipo (Ambas/Técnica/Comportamental, pill) + busca (input) + 3 dropdowns encadeados + "Limpar"
Legenda de status (4 badges + "Habilidade nova")
Conteúdo por competência: cards colapsáveis, um por competência, cada um com N linhas de habilidade
Legenda de escala (rodapé, 1 linha por nível de niveisDefaultData)
```

### 4.3 Regras de cálculo e cores

Sem cargo selecionado, a matriz ativa é sempre a de João
(`TesteBarrasPage.tsx:103-106`):
```ts
const activeMatrix = useMemo(() => {
  if (!cargoId) return joaoHabilidadesCargoMatriz;
  return habilidadesCargoDataBenchmark.filter(h => h.cargoId === cargoId);
}, [cargoId]);
```
Note a diferença desta tela para o Radar (seção 3.3): aqui,
**sem seleção de cargo o padrão já é `joaoHabilidadesCargoMatriz`**
(não array vazio); no Radar, sem cargo selecionado `activeMatrix` é `[]`.
Comportamento de estado inicial diferente entre as duas telas.

`getStatus` **redefinida localmente** nesta página
(`TesteBarrasPage.tsx:26-33`) — não importa de `minhaCarreiraShared.tsx`:
```ts
function getStatus(nivelAtual: string | null, nivelEsperado: string): Status {
  if (!nivelAtual) return 'sem';
  const pa = pesoNivel(nivelAtual);
  const pe = pesoNivel(nivelEsperado);
  if (pa > pe) return 'acima';
  if (pa === pe) return 'no';
  return 'abaixo';
}
```
É logicamente idêntica à `getStatus` de `minhaCarreiraShared.tsx` (mesma
sequência de comparações), mas é uma **cópia independente**, não uma
importação — se a regra de status mudar num lugar, não muda automaticamente
no outro.

Badge/cor de status (`:42-53`):
```ts
const STATUS_BADGE: Record<Status, string> = {
  acima:  'bg-green-100 text-green-700 border-green-200',
  no:     'bg-blue-100 text-blue-700 border-blue-200',
  abaixo: 'bg-red-100 text-red-700 border-red-200',
  sem:    'bg-gray-100 text-gray-500 border-gray-200',
};
const STATUS_BAR: Record<Status, string> = {
  acima:  'bg-green-500',
  no:     'bg-[var(--brand-500)]',
  abaixo: 'bg-red-400',
  sem:    'bg-gray-200',
};
```
Este é o **único lugar em toda a Visão do Colaborador** onde "No esperado"
usa **azul** (`bg-blue-100 text-blue-700` no badge, `bg-[var(--brand-500)]`
na barra) — em `CompetenciaDetalhePage.tsx` (Minha Carreira) "No esperado"
usa **verde**. Mais uma paleta de cor independente das já catalogadas em
`MINHA-CARREIRA.md`.

**Badge "Habilidade nova"** (`:314`):
```ts
const isNova = parseInt(hab.id) >= 50 && habilidadesNaMatriz.has(hab.id) && !nivelAtual;
```
Regra literal: ID numérico da habilidade `>= 50`, presente na matriz ativa,
e sem avaliação de João. `id >= 50` como critério de "habilidade nova"
depende inteiramente da convenção de numeração usada ao popular
`mockData.ts` (habilidades de extensão começam em id 50, confirmado na
seção 3 de `MINHA-CARREIRA.md`) — não é um campo explícito tipo `criadaEm`
ou `nova: true`, é inferido do valor do ID.

**Cálculo de largura da barra** (`:308-311`):
```ts
const pesoAtual = nivelAtual ? pesoNivel(nivelAtual) : 0;
const pesoEsperado = nivelEsperado ? pesoNivel(nivelEsperado) : 0;
const pctAtual = Math.round((pesoAtual / MAX_PESO) * 100);
const pctEsperado = nivelEsperado ? Math.round((pesoEsperado / MAX_PESO) * 100) : 0;
```
`MAX_PESO = Math.max(...niveisDefaultData.map(n => n.peso))` (`:16`) = 5
(mesmo valor de `MAX_PESO` em `minhaCarreiraShared.tsx`, mas recalculado
localmente, não importado).

### 4.4 Componentes e padrões visuais reutilizados
- Banner "Tela de teste" (`bg-[var(--brand-50)] border border-[var(--brand-100)]`,
  ícone `FlaskConical`) — mesmo padrão nas 3 telas que o têm.
- `Badge` de `ui/badge.tsx` (componente Radix/shadcn) — usado só para o
  badge "Habilidade nova" (`TesteBarrasPage.tsx:327-329`); os demais badges
  de status são `<span>` com classes manuais, não o componente `Badge`.
- Pills de tipo com 3 opções em formato "cápsula" (`rounded-full`, não
  `rounded-md` como no resto do sistema) — `:173`:
  `px-3 py-1.5 text-sm rounded-full font-medium` — **visualmente diferente**
  do padrão de pills documentado em `02-design-system.md`
  (`rounded-md` dentro de um container `rounded-lg p-1`); aqui não há
  container externo, cada botão é uma cápsula individual com `bg-gray-100`/`bg-[var(--brand-600)]`.

### 4.5 Limitações conhecidas / dívida técnica
- `getStatus` duplicada (cópia, não import) em relação a
  `minhaCarreiraShared.tsx` — risco de dessincronia futura.
- Padrão de pill "cápsula" diverge do padrão de segmented control
  documentado no DS — se esta tela virar produto, precisa de decisão
  explícita sobre qual padrão manter.
- "Habilidade nova" inferida por convenção de ID, não por campo explícito.
- `NÃO VERIFICADO — sem ferramenta de captura de tela`: aparência renderizada,
  comportamento em modo escuro.

---

## 5. Screening Report (`/testes/screening`)

### 5.1 Visão geral
- **Propósito**: relatório de cobertura de João contra um único cargo de
  referência (seletor simples, não encadeado), com % de cobertura geral,
  posicionamento numa escala de 3 zonas, distribuição por status, cobertura
  por competência e Top 5 gaps.
- **Arquivo**: `src/app/pages/testes/TesteScreeningPage.tsx` (338 linhas).
- **Rota**: `/testes/screening` (`routes.ts:52`).
- **Status**: tela de teste — **tem** banner "Tela de teste"
  (`TesteScreeningPage.tsx:147-152`).

### 5.2 Estrutura da página

`TesteScreeningPage.tsx:142-337`:
```
Banner de teste
Header ("Screening Report")
Seletor de cargo (dropdown único, não encadeado — "atual" ou um benchmarkCargosData.id)
Se total === 0: estado vazio "Selecione um cargo para ver o relatório."
Senão:
  Card "Cobertura geral": % grande + label + barra + escala de 3 zonas com marcador + distribuição em 4 quadrantes
  Card "Cobertura por competência": barra por competência, ordenada da menor para a maior
  Card "Top 5 maiores gaps" (só se houver algum gap > 0)
  Aviso "Nota sobre promoção" (amber)
  Info "Cobertura = ..." (brand)
```

### 5.3 Regras de cálculo e cores

Seletor de cargo — **não encadeado** (diferente de Radar/Barras/Benchmark):
um único `<Select>` com opção fixa `"atual"` + todos os 17 cargos de
`benchmarkCargosData` num só dropdown (`TesteScreeningPage.tsx:165-177`):
```tsx
<SelectItem value="atual">Cargo atual — Desenvolvedor Pleno</SelectItem>
{benchmarkCargosData.map(c => (
  <SelectItem key={c.id} value={c.id}>
    {c.nome} — {c.area}
  </SelectItem>
))}
```

**Fórmula de status por habilidade** (`calcularReport`, `:36-63`, corpo
completo):
```ts
function calcularReport(
  mapaAv: Map<string, string>,
  matriz: { habilidadeId: string; nivelEsperado: string }[],
): HabilidadeReport[] {
  return matriz.map(req => {
    const hab = habilidadesData.find(h => h.id === req.habilidadeId);
    const nivelAtual = mapaAv.get(req.habilidadeId) ?? null;
    const pesoAtual = nivelAtual ? pesoNivel(nivelAtual) : 0;
    const pesoEsperado = pesoNivel(req.nivelEsperado);
    let status: StatusDist;
    if (!nivelAtual) status = 'sem';
    else if (pesoAtual > pesoEsperado) status = 'acima';
    else if (pesoAtual === pesoEsperado) status = 'no';
    else status = 'abaixo';
    return {
      habilidadeId: req.habilidadeId,
      nome: hab?.nome ?? req.habilidadeId,
      competencia: hab?.competencia ?? 'Outras',
      tipo: hab?.tipo ?? '',
      nivelAtual,
      nivelEsperado: req.nivelEsperado,
      pesoAtual,
      pesoEsperado,
      status,
      gap: pesoEsperado - pesoAtual,
    };
  });
}
```
Terceira reimplementação independente da mesma lógica de status (compare
com `getStatus` de `minhaCarreiraShared.tsx` e de `TesteBarrasPage.tsx`) —
aqui inline dentro de `calcularReport`, não uma função `getStatus` separada.

**Fórmula de cobertura geral** (`:102-110`):
```ts
const cobertura = useMemo(() => {
  if (total === 0) return 0;
  const cobertas = report.filter(r => r.status === 'acima' || r.status === 'no').length;
  return Math.round((cobertas / total) * 100);
}, [report, total]);

const coberturaLabel = cobertura >= 80 ? 'Boa cobertura' : cobertura >= 50 ? 'Cobertura parcial' : 'Baixa cobertura';
const coberturaColor = cobertura >= 80 ? 'text-green-600' : cobertura >= 50 ? 'text-yellow-600' : 'text-red-600';
const coberturaBar = cobertura >= 80 ? 'bg-green-500' : cobertura >= 50 ? 'bg-yellow-500' : 'bg-red-500';
```
`DIVERGÊNCIA` importante em relação à regra de "Minha Carreira": aqui o
**denominador é `total = report.length`, que é o tamanho total da matriz do
cargo (todas as habilidades exigidas, avaliadas ou não)** — habilidades
`status === 'sem'` **contam no denominador mas não no numerador**, ou seja,
habilidade não avaliada **reduz** a cobertura (conta como não coberta).
Confirmado explicitamente no próprio texto da tela
(`TesteScreeningPage.tsx:328`): *"Cobertura = habilidades avaliadas com
nível ≥ ao exigido / total de habilidades na matriz do cargo. **Habilidades
sem avaliação contam como não cobertas.**"* — isto é o **oposto exato** da
regra usada em "Minha Carreira"/Dashboard (não avaliada é EXCLUÍDA do
numerador E do denominador, nunca conta como zero/gap). Threshold 80/50 é o
mesmo (`04-regras-negocio.md`), mas o tratamento de "não avaliada" diverge
entre esta tela e "Minha Carreira".

Isto é relevante especificamente porque o pedido original desta tarefa
presumia que essa regra de "somar não avaliadas ao denominador" existisse
em "Minha Carreira" — não existe lá (ver `MINHA-CARREIRA.md`, seção 3), mas
**existe aqui, no Screening Report**, tela de teste separada.

Zonas da escala visual (`:200-219`, valores fixos, não dependem do
threshold 80/50 usado para `coberturaColor` — são 3 faixas de largura fixa
somando 100%):
```tsx
<div style={{ width: '50%' }}><span className="text-xs text-red-500">Baixa cobertura</span></div>
<div style={{ width: '30%' }}><span className="text-xs text-yellow-600">Cobertura parcial</span></div>
<div style={{ width: '20%' }}><span className="text-xs text-green-600">Boa cobertura</span></div>
```
`DIVERGÊNCIA` interna nesta própria tela: as zonas visuais são
0–50% / 50–80% / 80–100% (larguras 50/30/20), mas os LABELS de cor/texto
(`coberturaLabel`/`coberturaColor`) usam threshold 50/80 (`< 50` = baixa,
`50–79` = parcial, `≥ 80` = boa) — batem entre si matematicamente (50% e
80% são os mesmos pontos de corte), mas a barra desenha as zonas por
`width` fixo em vez de computar a partir das mesmas constantes 50/80 usadas
no cálculo de `coberturaLabel` — dois lugares com o mesmo número mágico
(50, 80) escritos separadamente, sem uma constante compartilhada.

**Top 5 gaps** (`:129-136`):
```ts
const top5Gaps = useMemo(
  () =>
    [...report]
      .filter(r => r.gap > 0)
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 5),
  [report],
);
```
Mesma lógica de "Oportunidades de desenvolvimento" de Minha Carreira (maior
gap primeiro), mas corta em **5**, não 8, e usa `r.gap > 0` (que inclui
habilidades com `status === 'sem'`, já que `pesoAtual = 0` nesse caso e
`gap = pesoEsperado - 0 > 0` sempre que `pesoEsperado > 0`) — ou seja,
**diferente de "Oportunidades de desenvolvimento"**, aqui uma habilidade
nunca avaliada TAMBÉM pode aparecer no Top 5 gaps (lá, só entra quem tem
`status === 'abaixo'`, que exige avaliação existente).

### 5.4 Componentes e padrões visuais reutilizados
- Cores de cobertura (verde/amarelo/vermelho, threshold 80/50) — mesmas
  cores e mesmos limiares do padrão geral documentado em
  `04-regras-negocio.md` ("Cobertura de habilidades"), mas aplicadas com
  denominador diferente (ver acima).
- Aviso âmbar (`bg-amber-50 border-amber-200`, ícone `AlertTriangle`) — não
  é exatamente a variante "C — Aviso de estado (yellow)" documentada em
  `02-design-system.md` (que usa `bg-yellow-50 border-yellow-200` e ícone
  `Eye`); aqui é `amber`, não `yellow`, e o ícone é `AlertTriangle`, não
  `Eye` — cores/ícone próximos mas não idênticos ao padrão nomeado do DS.
- Banner informativo brand (`Info`, `bg-[var(--brand-50)]`) — mesmo padrão
  Variante A documentado.

### 5.5 Limitações conhecidas / dívida técnica
- Regra de cobertura diverge da regra usada em Minha Carreira/Dashboard
  (não avaliada conta como não-coberta aqui, é excluída lá) — se as duas
  telas forem unificadas num produto único, é preciso decidir qual regra
  vale.
- Terceira implementação independente de lógica de status
  (`acima`/`no`/`abaixo`/`sem`), sem reaproveitar `getStatus` de
  `minhaCarreiraShared.tsx`.
- Zonas visuais da escala com número mágico duplicado (50/80) sem constante
  compartilhada com o cálculo de `coberturaLabel`.
- `NÃO VERIFICADO — sem ferramenta de captura de tela`: aparência
  renderizada, comportamento em modo escuro.

---

## 6. Benchmark Mode (`/testes/benchmark`)

### 6.1 Visão geral
- **Propósito**: comparar o perfil de João com cargos de referência de
  **fora da sua jornada atual** ("explorar possíveis trilhas de carreira"),
  via dropdowns encadeados iguais a Radar/Barras — cobertura + radar +
  Top 5 gaps + lista completa de habilidades do cargo escolhido.
- **Arquivo**: `src/app/pages/testes/TesterBenchmarkPage.tsx` (429 linhas;
  note o nome do arquivo — `TesterBenchmarkPage`, com "Tester", não
  "Teste" como as outras três — confirmado em `routes.ts:24`:
  `import TesterBenchmarkPage from "./pages/testes/TesterBenchmarkPage";`).
- **Rota**: `/testes/benchmark` (`routes.ts:53`).
- **Status**: tela de teste — **tem** banner "Tela de teste"
  (`TesterBenchmarkPage.tsx:174-180`).

### 6.2 Estrutura da página

`TesterBenchmarkPage.tsx:170-427`:
```
Banner de teste
Header ("Benchmark Mode")
Seletor encadeado (Área → Cargo → Nível) + "Limpar"
Se !cargoId: estado vazio "Use os filtros acima para selecionar um cargo benchmark" + contagem de cargos/áreas
Senão:
  Grid 5 colunas: "Aderência ao cargo" (2 col) + Radar "João vs. {cargo}" (3 col)
  Card "Top 5 maiores gaps" (só se houver)
  Card "Todas as habilidades — {cargo}" (lista completa, sem paginação)
  Info sobre o badge "Habilidade nova"
```
Diferente do Radar (seção 3), aqui **não há a opção "Tecnologia" apontando
para `CARGO_ATUAL`** disponível para seleção — confirmado por leitura: o
`Select` de Área usa `areasDisponiveis = [...new Set(benchmarkCargosData.map(c => c.area))]`
(`:54-57`), que **inclui** "Tecnologia" (já que `CARGO_ATUAL` está em
`benchmarkCargosData`), mas `matrizCargo` (`:95-98`) usa
`habilidadesCargoDataBenchmark.filter(h => h.cargoId === cargoId)` — **não**
tem o fallback para `joaoHabilidadesCargoMatriz` que existe no Radar e no
Barras. Selecionar "Tecnologia → Desenvolvedor → Pleno" aqui resolve
`cargoId = 'CARGO_ATUAL'`, mas `habilidadesCargoDataBenchmark` não tem
nenhuma entrada com `cargoId: 'CARGO_ATUAL'` (essa matriz só existe em
`joaoHabilidadesCargoMatriz`, referenciada por nome direto, não por
`cargoId` dentro de `habilidadesCargoDataBenchmark`) — então `matrizCargo`
resolve para um array vazio, e a tela mostra "Dados insuficientes para o
radar" e cobertura 0%. `DIVERGÊNCIA` confirmada por leitura de código: a
opção "Tecnologia" (cargo atual) aparece no dropdown mas produz uma tela
efetivamente vazia neste componente especificamente — diferente do Radar e
do Barras, que tratam esse caso corretamente com fallback explícito.

**Radar por competência** (`:143-162`, corpo completo):
```ts
const radarData = useMemo(() => {
  const map = new Map<string, { total: number; cobertas: number }>();
  for (const req of matrizCargo) {
    const hab = habilidadesData.find(h => h.id === req.habilidadeId);
    if (!hab) continue;
    const comp = hab.competencia;
    if (!map.has(comp)) map.set(comp, { total: 0, cobertas: 0 });
    const e = map.get(comp)!;
    e.total++;
    const nivelAtual = mapaJoao.get(req.habilidadeId);
    if (nivelAtual && pesoNivel(nivelAtual) >= pesoNivel(req.nivelEsperado)) e.cobertas++;
  }
  return Array.from(map.entries())
    .map(([competencia, { total: t, cobertas }]) => ({
      competencia: competencia.length > 20 ? `${competencia.slice(0, 18)}…` : competencia,
      'João': t > 0 ? Math.round((cobertas / t) * 100) : 0,
      'Cargo': 100,
    }))
    .sort((a, b) => String(a.competencia).localeCompare(String(b.competencia)));
}, [matrizCargo, mapaJoao]);
```
Métrica do radar aqui é **% de habilidades cobertas por competência**
(0–100%, série "Cargo" sempre fixa em 100 como linha de referência) — uma
terceira métrica de radar diferente da usada em "Radar de Competências"
(seção 3, que usa peso médio absoluto 1–5, não percentual).

Configuração literal do `RadarChart` (`:305-327`):
```tsx
<ResponsiveContainer width="100%" height={260}>
  <RadarChart data={radarData}>
    <PolarGrid gridType="polygon" />
    <PolarAngleAxis dataKey="competencia" tick={{ fontSize: 10, fill: '#6b7280' }} />
    <Radar
      name="João"
      dataKey="João"
      fill="var(--brand-500)"
      fillOpacity={0.3}
      stroke="var(--brand-500)"
      strokeWidth={2}
    />
    <Radar
      name="Cargo"
      dataKey="Cargo"
      fill="transparent"
      stroke="#d1d5db"
      strokeWidth={2}
      strokeDasharray="4 4"
    />
    <Legend />
  </RadarChart>
</ResponsiveContainer>
```
Diferenças em relação ao `RadarChart` do Radar de Competências (seção 3):
usa `<Legend />` nativo do recharts (Radar de Competências usa uma legenda
HTML manual, não `<Legend>`); não usa `PolarRadiusAxis` (Radar de
Competências usa `domain={[0, MAX_PESO]}` explícito); não tem `<Tooltip>`
customizado.

**Badge "Habilidade nova"** (`:113`, regra ligeiramente diferente da de
Barras por Habilidade):
```ts
const isNova = parseInt(req.habilidadeId) >= 50 && !nivelAtual;
```
Aqui **não** checa `habilidadesNaMatriz.has(...)` (porque já está iterando
só sobre `matrizCargo`, então essa checagem seria redundante aqui, mas é
uma reimplementação separada da mesma regra, não uma função compartilhada).

**Cobertura geral** (`:132-140`) — mesma fórmula do Screening Report
(cobertas = `acima`+`no` / `total`, sem excluir `sem` do denominador),
mesmos thresholds 80/50 e mesmas classes de cor — mas **status calculado
inline** dentro de `habilidadesReport` (`:107-111`), não via
`calcularReport` compartilhada com Screening — quarta reimplementação
independente da mesma lógica `acima`/`no`/`abaixo`/`sem`.

### 6.3 Componentes e padrões visuais reutilizados
- Mesmo banner de teste, mesmas cores de cobertura 80/50 (verde/amarelo/
  vermelho) do Screening Report.
- `Badge` de `ui/badge.tsx` para "Habilidade nova" — mesmo componente usado
  em Barras por Habilidade.
- Grid `lg:grid-cols-5` com card de 2 colunas + card de 3 colunas — layout
  específico desta tela, não documentado como padrão no DS.

### 6.4 Limitações conhecidas / dívida técnica
- Opção "Tecnologia" no dropdown de Área produz radar/cobertura vazios
  nesta tela especificamente (ver 6.2) — inconsistente com o mesmo cenário
  no Radar de Competências e no Barras por Habilidade, que tratam
  `CARGO_ATUAL` corretamente.
- Quarta reimplementação independente da lógica de status
  `acima`/`no`/`abaixo`/`sem` no conjunto das 6 telas auditadas
  (`minhaCarreiraShared.tsx`, `TesteBarrasPage.tsx`, `TesteScreeningPage.tsx`,
  aqui) — nenhuma delas importa de uma fonte comum.
- Nome do arquivo (`TesterBenchmarkPage`) inconsistente com o padrão das
  outras 3 (`TesteRadarPage`, `TesteBarrasPage`, `TesteScreeningPage`) —
  "Tester" em vez de "Teste", provavelmente um typo histórico nunca
  corrigido.
- `NÃO VERIFICADO — sem ferramenta de captura de tela`: aparência
  renderizada, comportamento em modo escuro.

---

## 7. Menu de conta (Header — presente em todas as telas)

### 7.1 Visão geral
- **Arquivo**: `src/app/components/Header.tsx` — renderizado uma única vez
  por `Layout.tsx:153-158`, fora do `<Outlet>`, portanto o **mesmo
  componente aparece em toda rota** (admin e colaborador) — **não é
  duplicado entre as duas visões**, é o mesmo `<Header>` recebendo
  `viewMode` como prop.
- Dropdown do menu de conta é estado local do próprio `Header`
  (`menuAberto`, `Header.tsx:18`), fechado ao clicar fora
  (`Header.tsx:24-33`, listener de `mousedown` no documento).

### 7.2 "Visão do Administrador" / "Visão do Colaborador"

Botões do dropdown (`Header.tsx:84-118`) chamam `onChangeViewMode(mode)`,
prop recebida de `Layout.tsx:155` (`onChangeViewMode={handleViewModeChange}`).
`handleViewModeChange`, corpo completo (`Layout.tsx:108-116`):
```ts
const handleViewModeChange = (mode: 'admin' | 'colaborador') => {
  setViewMode(mode);
  if (mode === 'colaborador') {
    // Navegar para visão do colaborador (simulação MVP)
    navigate('/habilidades');
  } else {
    navigate('/habilidades');
  }
};
```
`DIVERGÊNCIA` confirmada por leitura literal: **os dois branches do `if`
navegam para a mesma rota, `/habilidades`** — o comentário ("Navegar para
visão do colaborador") sugere uma intenção de rota diferente por modo, mas
o código não implementa isso; `else` faz exatamente a mesma navegação do
`if`. Isso é consistente com a nota já registrada em sessão anterior deste
projeto (identificada como "quirk", fora do escopo de correção até então).

**Isso muda estado, não só navegação**: `setViewMode(mode)` atualiza o
`useState` de `Layout.tsx:32-34`, que é passado tanto para `<Sidebar
viewMode={viewMode}>` (`Layout.tsx:146`) quanto para
`<Outlet context={{ isSidebarCollapsed, viewMode }}>` (`Layout.tsx:161`) —
ou seja, toda página que lê `viewMode` via `useOutletContext` (todas as
páginas documentadas neste arquivo e em `MINHA-CARREIRA.md`) recebe o novo
valor imediatamente, independente da navegação. Confirmado também que
`Layout.tsx:43-46` tem um `useEffect` que resincroniza `viewMode` a partir
da URL sempre que `location.pathname` muda — então, mesmo com o bug de
navegação sempre para `/habilidades`, entrar depois manualmente numa rota
como `/meu-perfil` corrige o `viewMode` de volta para `'colaborador'` via
esse efeito (`getViewModeFromPath`, `Layout.tsx:19-23`).

### 7.3 Modo Escuro

Mecanismo exato, `src/app/contexts/ThemeContext.tsx` (corpo completo já
citado, repetido aqui por serem os trechos relevantes):
```tsx
// ThemeContext.tsx:12-29
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Carregar tema salvo do localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };
  ...
```
- **Mecanismo**: React Context (`ThemeContext`, criado com `createContext`)
  + classe CSS `dark` no elemento `<html>` (`document.documentElement.classList.toggle('dark', ...)`)
  + `localStorage` (chave `'theme'`, valores `'light'`/`'dark'`).
- **Persiste entre sessões**: sim — `localStorage.setItem('theme', newTheme)`
  a cada toggle, e lido de volta no mount do `ThemeProvider`
  (`useEffect(() => {...}, [])`, roda uma vez ao carregar o app).
- **Provider montado no root do app**, `App.tsx:10`: `<ThemeProvider>`
  envolve toda a árvore (`CompetenciasProvider`/`HabilidadesProvider`/
  `RouterProvider`) — estado de tema é global, não por rota.
- O botão do menu (`ThemeToggle.tsx`) só chama `toggleTheme()` e troca o
  label/ícone (`Moon`/"Modo Escuro" quando claro, `Sun`/"Modo Claro" quando
  escuro) — não tem lógica própria além de refletir `theme` do contexto.

`DIVERGÊNCIA`/achado relevante: a classe `.dark` no `<html>` só tem efeito
visual em elementos que usam variáveis CSS específicas de tema
(`--surface`, `--text-primary`, etc., definidas em `src/styles/theme.css:135-164`
dentro do seletor `.dark { ... }`) via as classes utilitárias de
`src/styles/dark-mode.css` (`.bg-surface`, `.text-primary`, etc.) **ou** via
variantes Tailwind `dark:*`. Busquei essas duas formas de uso em todos os
componentes das 7 telas documentadas neste arquivo e em `MinhaCarreiraPage.tsx`/
`minhaCarreiraShared.tsx`/`ColaboradorView.tsx` — **nenhuma ocorrência**.
As únicas 14 ocorrências de variantes `dark:` no projeto inteiro estão em
primitivas genéricas `ui/*.tsx` (`badge.tsx`, `button.tsx`, `chart.tsx`,
`checkbox.tsx`, `context-menu.tsx`, `dropdown-menu.tsx`, `input-otp.tsx`,
`input.tsx`, `menubar.tsx`, `radio-group.tsx`, `switch.tsx`, `tabs.tsx`,
`textarea.tsx`, `toggle.tsx`) — **nenhuma delas é usada pelas telas
auditadas neste documento ou em `MINHA-CARREIRA.md`**. Conclusão verificável
por código: **o mecanismo de alternância de tema é real e funcional
(persiste, atualiza a classe do `<html>`), mas não produz nenhuma mudança
visual em nenhuma das 7 telas do Colaborador nem no Header/Sidebar** —
todas usam classes Tailwind estáticas (`bg-white`, `text-gray-900`, etc.),
que não respondem à classe `.dark`.
`NÃO VERIFICADO — sem ferramenta de captura de tela`: não é possível
confirmar visualmente essa conclusão por screenshot; a conclusão acima é
inferida por ausência de qualquer seletor `dark:`/classe de tema no código
dessas telas, não por observação visual direta.

### 7.4 Design System

- **Rota exata**: `/design-system` (`routes.ts:49`, `Component: DesignSystemPage`).
- **Navegação**: `navigate('/design-system')` direto (`Header.tsx:140`) —
  não passa por `handleViewModeChange`, não muda `viewMode`.
- **Conteúdo**: `src/app/pages/DesignSystemPage.tsx` é um arquivo único e
  extenso (mais de 6000 linhas) contendo dezenas de funções `SecaoXXX()`
  (ex: `SecaoCores`, `SecaoTipografia`, `SecaoBadges`, `SecaoEstadosVazios`,
  `SecaoMensagensOrientacao`, `SecaoMinhaCarreira`, `SecaoCriarEditarJornada`,
  etc. — listagem completa não reproduzida aqui por ser extensa demais para
  o escopo desta auditoria do menu de conta; ver `MINHA-CARREIRA.md` para
  os trechos específicos já auditados desta página nesta mesma sessão de
  trabalho). É a documentação viva/style-guide interna do sistema, renderizada
  como uma SPA própria dentro da mesma aplicação (`Layout.tsx:142`:
  `{!isDesignSystem && <Sidebar .../>}` — a sidebar padrão é **ocultada**
  nesta rota, ela tem navegação interna própria).
- `isDesignSystem` (`Header.tsx:17`: `location.pathname.startsWith('/design-system')`)
  também altera o próprio Header: esconde o botão hamburger mobile, mostra
  o texto "Design System" no lugar, e os itens "Visão do Administrador"/
  "Visão do Colaborador" do dropdown não mostram o indicador de seleção
  ativa enquanto nessa rota (`Header.tsx:90,108`: condição
  `viewMode === 'admin' && !isDesignSystem`).

### 7.5 "Sair"

Corpo completo do handler (`Header.tsx:158-168`):
```tsx
<button
  onClick={() => {
    // Lógica de logout
    console.log('Logout');
    setMenuAberto(false);
  }}
  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
>
  <LogOut className="w-4 h-4" />
  <span>Sair</span>
</button>
```
Confirmado: **não é logout real** — não há chamada de API, não há remoção
de token/sessão, não há `navigate()` para uma tela de login (não existe
tela de login neste projeto, confirmado por não haver rota `/login` em
`routes.ts`). O clique só imprime `"Logout"` no console e fecha o dropdown.
É um placeholder de UI, não uma funcionalidade implementada.

### 7.6 Componente compartilhado ou duplicado entre as visões?

**Compartilhado — uma única instância**, não duplicado. `Header.tsx` é
importado e renderizado uma única vez em `Layout.tsx:5,153-158`; `Layout`
por sua vez é o componente raiz de rota único em `routes.ts:37`
(`{ path: "/", Component: Layout, children: [...] }`), envolvendo **todas**
as rotas do app, admin e colaborador. A diferença de conteúdo entre "modo
admin" e "modo colaborador" no Header é inteiramente dirigida pela prop
`viewMode` (ex: qual dos dois itens do dropdown mostra o indicador de
seleção ativa) — não existe um `HeaderAdmin.tsx`/`HeaderColaborador.tsx`
separados. Mesma conclusão vale para `Sidebar.tsx` (mesma instância,
`menuItems = viewMode === 'admin' ? menuItemsAdmin : menuItemsColaborador`,
`Sidebar.tsx:66`).

### 7.7 Limitações conhecidas / dívida técnica
- Alternar entre "Visão do Administrador"/"Visão do Colaborador" sempre
  navega para `/habilidades` — bug de navegação confirmado por leitura de
  código, presente nos dois branches do `if`.
- "Sair" é 100% placeholder (`console.log`), sem lógica de logout real.
- Modo escuro é funcional no mecanismo (Context + `localStorage` + classe
  `.dark`) mas não tem efeito visual observável em nenhuma tela do
  Colaborador nem no Header/Sidebar, por ausência de classes `dark:`/tema
  nesses componentes.
- `console.log` de debug ainda presente em produção
  (`Header.tsx:21`: `console.log('🎯 Header renderizado:', { viewMode, menuAberto });`,
  roda em **todo render** do Header) — não é um placeholder de feature,
  é um log de debug esquecido no código, dispara continuamente enquanto o
  app está aberto.
- `NÃO VERIFICADO — sem ferramenta de captura de tela`: aparência do
  dropdown aberto, comportamento visual do toggle de tema.

---

## Metodologia desta auditoria

Todas as afirmações acima vieram de leitura direta dos arquivos listados,
nesta sessão de trabalho (2026-07-17), usando as ferramentas de leitura de
arquivo e busca por padrão (`grep`) do ambiente — sem execução do app em
navegador (`NÃO VERIFICADO` está declarado explicitamente em cada seção
onde isso limita a confirmação). Onde o comportamento de duas telas foi
comparado (ex: fórmulas de cobertura, cores de status, regras de
"habilidade nova"), a comparação foi feita lendo o código-fonte de ambas,
não por suposição de que seguiriam o mesmo padrão.
