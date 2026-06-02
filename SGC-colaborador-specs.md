# SGC — Especificações da Visão do Colaborador

> Documento de referência para o desenvolvedor front-end.  
> Gerado em 01/06/2026. Reflete o estado atual do protótipo (mock data).

---

## 1. Visão geral

### Propósito

A visão do Colaborador é a interface do usuário final do sistema. Ela permite que um colaborador:

- Consulte seu cargo atual, nível e progresso de habilidades (`/meu-perfil`)
- Responda autoavaliações, acompanhe o progresso e veja resultados (`/minhas-avaliacoes`)
- Visualize sua jornada de carreira e as habilidades em gap para o próximo cargo (`/minha-carreira`)

É uma visão **somente-leitura de dados organizacionais** (cargos, jornadas, matrizes) e **de escrita para avaliações** (respostas de autoavaliação).

### Perfis de usuário e acesso

No protótipo atual, a alternância entre Admin e Colaborador é feita via `viewMode: 'admin' | 'colaborador'` no componente `Layout.tsx`. O estado é inicializado em `'admin'` e alterado pelo `Header` via `handleViewModeChange`.

Quando `viewMode === 'colaborador'`, a `Sidebar` exibe os três itens da visão do Colaborador (definidos em `menuItemsColaborador` em `Sidebar.tsx`, linhas 44–48). Não há autenticação real nem controle de acesso por papel no protótipo.

O colaborador representado nos mocks é **João Silva** (em `ColaboradorView.tsx`) e **Ana Silva** (`colaboradorId: '1'` em `mockData.ts`). São personas distintas — inconsistência conhecida (ver Seção 8).

### Rotas

Definidas em `src/app/routes.ts`:

| Rota | Page Component | Componente de conteúdo |
|------|---------------|------------------------|
| `/meu-perfil` | `MeuPerfilPage` | `ColaboradorView` |
| `/minhas-avaliacoes` | `MinhasAvaliacoesPage` | `MinhasAvaliacoes` |
| `/minha-carreira` | `MinhaCarreiraPage` | `MinhaCarreira` |

Todas as páginas usam `useOutletContext` para receber `{ isSidebarCollapsed, viewMode }` do `Layout` e os repassam ao `ContentArea` via props. O `ContentArea` (`src/app/components/ContentArea.tsx`, linhas 545–554) faz o dispatch para o componente de conteúdo baseado em `selectedItem`.

O `Layout` deriva `selectedItem` de `location.pathname` via `getSelectedItemFromPath` (linhas 15–24 de `Layout.tsx`). As abas internas de `MinhaCarreira` são gerenciadas por `useState` — a rota permanece `/minha-carreira` independentemente da aba ativa.

---

## 2. Estrutura de componentes

### 2.1 `ColaboradorView`

**Arquivo:** `src/app/components/ColaboradorView.tsx`

**Responsabilidade:** Página "Meu Perfil". Exibe o cargo atual do colaborador, cards de métricas de avaliação e uma tabela paginada de habilidades com filtros. É a tela de entrada da visão do Colaborador.

**Props:** Nenhuma. Dados totalmente internos (mock).

**Estado interno:**

| Estado | Tipo | Valor inicial | Uso |
|--------|------|--------------|-----|
| `buscaHabilidade` | `string` | `''` | Filtro de texto livre na tabela |
| `filtroCompetencia` | `string` | `'all'` | Filtro por competência (Radix Select) |
| `filtroTipo` | `string` | `'all'` | Filtro por tipo Técnica/Comportamental (Radix Select) |
| `filtroStatus` | `string` | `'Todos'` | Filtro por status relativo ao cargo (pill toggle) |
| `paginaAtual` | `number` | `1` | Página atual da tabela |

**Componentes filhos:** Nenhum componente filho próprio — usa `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectValue` de `./ui/select`.

**Estrutura de layout (3 seções):**
1. Header com gradiente — saudação dinâmica por hora do dia + nome + cargo
2. Grid 2×2 → 4 cards de métricas (avaliações em aberto, próxima avaliação encerra em X dias, habilidades abaixo do esperado, avaliações concluídas)
3. Seção "Detalhamento de Habilidades" — toolbar (busca + 2 Radix Selects + pill toggle de status) + tabela + paginação

---

### 2.2 `MinhasAvaliacoes`

**Arquivo:** `src/app/components/MinhasAvaliacoes.tsx`

**Responsabilidade:** Lista de avaliações do colaborador, agrupadas em "Avaliações em aberto" e "Histórico de Avaliações". Gerencia navegação interna para os sub-componentes `RespostaAvaliacao` e `ResultadoAvaliacao`.

**Props:** Nenhuma.

**Estado interno:**

| Estado | Tipo | Valor inicial | Uso |
|--------|------|--------------|-----|
| `viewMode` | `'lista' \| 'responder' \| 'resultado'` | `'lista'` | Controla qual subview renderizar |
| `selectedAvaliacao` | `any \| null` | `null` | Avaliação selecionada para responder ou ver resultado |

**Componentes filhos:**
- `RespostaAvaliacao` — renderizado quando `viewMode === 'responder'`
- `ResultadoAvaliacao` — renderizado quando `viewMode === 'resultado'`

**Estrutura de layout:**
1. Header (título + subtítulo)
2. Grid 3 cards de métricas: avaliações em aberto, avaliações concluídas, última média obtida
3. Bloco "Avaliações em aberto" (lista `naoIniciadas + emAndamento`) — condicional
4. Bloco "Histórico de Avaliações" (`concluidas + expiradas`) — condicional

---

### 2.3 `RespostaAvaliacao`

**Arquivo:** `src/app/components/RespostaAvaliacao.tsx`

**Responsabilidade:** Formulário de resposta de avaliação. Lista competências em accordions colapsáveis, com seletor de nível para cada habilidade. Gerencia progresso e envio/rascunho.

**Props:**

| Prop | Tipo | Descrição |
|------|------|-----------|
| `avaliacao` | `any` | Objeto da avaliação selecionada (id, titulo, periodo, tipo, etc.) |
| `onVoltar` | `() => void` | Callback para retornar à lista |

**Estado interno:**

| Estado | Tipo | Valor inicial | Uso |
|--------|------|--------------|-----|
| `respostas` | `Record<string, string>` | `{}` | Map de `habilidadeId → nivelId` selecionado |
| `competenciaExpandida` | `string[]` | `['1']` | IDs das competências com accordion aberto |

**Componentes filhos:** Nenhum componente externo próprio. Usa `niveisDefaultData` para renderizar os botões de seleção de nível.

**Integrações externas:** `@amplitude/unified` (tracking) e `sonner` (toast de feedback).

**Estrutura de layout:**
1. Botão voltar + header da avaliação
2. Banner de instruções (padrão `bg-slate-100 border-slate-300`)
3. Lista de competências com accordion (expand/collapse)
   - Cada habilidade: nome + descrição + grid 4 colunas de botões de nível
4. Barra de ações sticky no rodapé (progresso textual + "Salvar rascunho" + "Enviar avaliação")

---

### 2.4 `ResultadoAvaliacao`

**Arquivo:** `src/app/components/ResultadoAvaliacao.tsx`

**Responsabilidade:** Exibe o resultado detalhado de uma avaliação concluída. Sem estado interno — puramente apresentacional.

**Props:**

| Prop | Tipo | Descrição |
|------|------|-----------|
| `avaliacao` | `any` | Objeto da avaliação com `resultado.media`, `resultado.distribuicao`, `habilidades`, `competencias` |
| `onVoltar` | `() => void` | Callback para retornar à lista |

**Estado interno:** Nenhum.

**Componentes filhos:** Nenhum.

**Estrutura de layout:**
1. Botão voltar + header
2. Grid 3 cards: nível médio geral, habilidades avaliadas, competências avaliadas
3. Banner de contexto (padrão `bg-[var(--brand-50)] border-[var(--brand-100)]`)
4. Card "Minha distribuição nesta avaliação" — grid 2×2 → 4 colunas de quantidade por nível
5. Seção "Resultados por Competência" — cards por competência com header (nome + média) e lista de habilidades com badges de nível coloridos

---

### 2.5 `MinhaCarreira`

**Arquivo:** `src/app/components/MinhaCarreira.tsx`

**Responsabilidade:** Página "Minha Carreira". Apresenta a jornada do colaborador em 2 abas:
- **Minha Jornada:** situação atual e cobertura de habilidades por nível de cargo na jornada
- **Próximo passo:** habilidades em gap em relação ao próximo cargo fixo (Desenvolvedor Sênior, c3)

**Props:** Nenhuma.

**Estado interno:**

| Estado | Tipo | Valor inicial | Uso |
|--------|------|--------------|-----|
| `activeTab` | `'minha-jornada' \| 'proximo-passo'` | `'minha-jornada'` | Aba ativa |

**Componentes filhos:** Nenhum componente externo próprio.

**Dados module-level (constantes fora do componente):**

| Constante | Tipo | Descrição |
|-----------|------|-----------|
| `colaborador` | objeto literal | Dados de exibição: cargoAtual, senioridade, jornada, tempoNoCargo, ultimaAvaliacao |
| `proximoCargo` | `{ id: string; nome: string }` | Cargo fixo da aba 2: `{ id: 'c3', nome: 'Desenvolvedor Sênior' }` |
| `habilidadesColaboradorJornada` | `HabilidadeColaborador[]` | 16 entradas com IDs '1'–'16' — modelo local para cálculo de cobertura na aba 1 |
| `cargosJornada` | `CargoJornada[]` | 3 cargos da jornada (Pleno/atual, Sênior, Tech Lead) com `matrizCargo` própria |

**Dados computados no corpo do componente (aba 2):**

| Variável | Derivada de | Uso |
|----------|------------|-----|
| `matrizProximoCargo` | `habilidadesCargoData` filtrado por `proximoCargo.id` | Requisitos do cargo c3 |
| `chartDataProximo` | `matrizProximoCargo` + `avaliacoesColaboradoresData` (colaboradorId='1') | Comparativo nível atual × exigido |
| `habilidadesComGapProximo` | `chartDataProximo` filtrado onde `nivelAtual < nivelExigido` | Linhas da tabela de gap |

**Estrutura de layout:**
1. Header (h1 + subtítulo)
2. Tab bar com padrão `border-b-2` underline (Admin pattern)
3. **Aba "Minha Jornada":**
   - Card "Onde estou agora" (cargo + senioridade + jornada + tempo + última avaliação)
   - Card "Jornada de Carreira": banner informativo + lista de 3 cargos com barra de progresso de cobertura
4. **Aba "Próximo passo":**
   - Card de referência (nome do próximo cargo)
   - Banner informativo
   - Tabela de habilidades com gap (4 colunas: Habilidade, Competência, Meu nível, Necessário)

---

## 3. Modelo de dados

### 3.1 Avaliação (em `MinhasAvaliacoes`)

Definida localmente em `src/app/components/MinhasAvaliacoes.tsx` como array `avaliacoesMock` (linhas 18–92). Não há interface TypeScript declarada — o tipo é inferido.

```ts
{
  id: string;                // ex.: '1', '4', '2'
  titulo: string;            // nome da avaliação
  periodo: string;           // ex.: '01/03 - 31/03/2026'
  status: 'Não iniciada' | 'Em andamento' | 'Concluída' | 'Expirada';
  tipo: string;              // ex.: 'Autoavaliação'
  competencias: number;      // quantidade de competências
  habilidades: number;       // quantidade de habilidades
  progresso: number;         // 0–100 (percentual respondido)
  dataLimite: string;        // ex.: '31 de março de 2026'
  resultado?: {              // presente apenas se status === 'Concluída'
    media: number;           // ex.: 3.8 (escala 1–5)
    distribuicao: { nivel: string; quantidade: number }[];
  };
}
```

### 3.2 Habilidade do colaborador

Definida em `src/app/utils/cobertura.ts`:

```ts
export interface HabilidadeColaborador {
  habilidadeId: string;   // ID da habilidade
  nivelAtual: string;     // 'Básico' | 'Intermediário' | 'Avançado' | 'Especialista'
}
```

Usado em dois contextos distintos com IDs diferentes:

- **`ColaboradorView`** (linhas 121–123): IDs locais '1'–'16', derivados do array `competencias` via `flatMap`
- **`MinhaCarreira` aba 1** (`habilidadesColaboradorJornada`, linhas 43–60): IDs locais '1'–'16', hardcoded como constante module-level
- **`MinhaCarreira` aba 2** (`avaliacoesColaboradoresData`): IDs do `mockData.ts` — '1', '2', '3', '4', '9', '10', '11', '12', '14', '18', '21', '22', '23'

### 3.3 Matriz de cargo

Definida em `src/app/utils/cobertura.ts`:

```ts
export interface MatrizCargo {
  habilidadeId: string;
  nivelEsperado: string;  // 'Básico' | 'Intermediário' | 'Avançado' | 'Especialista'
}
```

### 3.4 Cargo na jornada (local a `MinhaCarreira`)

```ts
interface CargoJornada {
  id: string;
  nome: string;
  senioridade: string;
  matrizCargo: MatrizCargo[];
  atual: boolean;
}
```

Os 3 cargos em `cargosJornada` (`MinhaCarreira.tsx`, linhas 70–134):

| id | nome | senioridade | atual |
|----|------|-------------|-------|
| '2' | Desenvolvedor Frontend | Pleno | true |
| '3' | Desenvolvedor Frontend | Sênior | false |
| '4' | Tech Lead Frontend | (vazio) | false |

### 3.5 Nível de habilidade

Definido em `src/app/data/mockData.ts` (`niveisDefaultData`, linhas 289–294):

```ts
{
  id: string;        // '1' | '2' | '3' | '4'
  nome: string;      // 'Básico' | 'Intermediário' | 'Avançado' | 'Especialista'
  descricao: string; // texto para exibição no formulário de avaliação
  peso: number;      // 1 | 2 | 4 | 5  (nota: não é escala linear 1–4)
  status: string;    // 'Ativo'
  emUso: number;     // quantidade de habilidades que usam este nível
}
```

**Atenção:** o peso do nível Avançado é **4** (não 3), e do Especialista é **5**. Isso impacta qualquer comparação numérica entre níveis.

### 3.6 Estados de avaliação — condições e mapeamento

Documentado no cabeçalho de `MinhasAvaliacoes.tsx` (linhas 6–15):

| Status do colaborador | Status Admin | Condição |
|-----------------------|-------------|----------|
| `'Não iniciada'` | Ativa | Colaborador não começou a responder (`progresso === 0`) |
| `'Em andamento'` | Ativa | Colaborador começou mas não concluiu (`0 < progresso < 100`) |
| `'Concluída'` | Encerrada | Colaborador respondeu dentro do prazo |
| `'Expirada'` | Encerrada | Colaborador não respondeu; prazo encerrado sem resposta |

Avaliações com status Admin `'Rascunho'` **não são exibidas** ao colaborador.

---

## 4. Regras de negócio implementadas

### 4.1 Cobertura de habilidades (`calcularCoberturaCargo`)

**Arquivo:** `src/app/utils/cobertura.ts`

```ts
export function calcularCoberturaCargo(
  habilidadesColaborador: HabilidadeColaborador[],
  matrizCargo: MatrizCargo[],
): ResultadoCobertura
```

**Algoritmo:**
1. Converte `nivelAtual` de cada habilidade do colaborador em peso numérico via `niveisDefaultData`
2. Para cada requisito da `matrizCargo`, verifica se `pesoAtual >= pesoEsperado`
3. Calcula `percentual = round((atendidas / total) * 100)`
4. Classifica por threshold:

| Percentual | label | cor (Tailwind) | bgCor |
|-----------|-------|---------------|-------|
| ≥ 80% | `'Boa cobertura'` | `'text-green-600'` | `'bg-green-500'` |
| 50–79% | `'Cobertura parcial'` | `'text-yellow-600'` | `'bg-yellow-500'` |
| < 50% | `'Baixa cobertura'` | `'text-red-600'` | `'bg-red-500'` |

Caso `matrizCargo.length === 0`: retorna `{ percentual: 0, label: 'Sem dados', cor: 'text-gray-500', bgCor: 'bg-gray-400' }`.

A função auxiliar `calcularCobertura(nivelAtual: number, nivelEsperado: number): boolean` retorna `nivelAtual >= nivelEsperado` e é usada em `ColaboradorView` para o cálculo de "habilidades abaixo do esperado".

### 4.2 Cores dos níveis (`getCorFromPeso`)

**Arquivo:** `src/app/data/mockData.ts`, linhas 276–286

```ts
const ESCALA_CORES_NIVEL: Record<number, string> = {
  1: '#60A5FA',  // Básico        — azul claro
  2: '#2563EB',  // Intermediário — azul médio
  3: '#4338CA',  // (não usado diretamente, peso 3 não existe nos níveis padrão)
  4: '#5B21B6',  // Avançado      — violeta
  5: '#581C87',  // Especialista  — roxo escuro
};

export function getCorFromPeso(peso: number): string {
  return ESCALA_CORES_NIVEL[Math.max(1, Math.min(5, peso))];
}
```

Sempre retorna cor para texto branco (`text-white`). Usada em badges de nível em `ColaboradorView`, `ResultadoAvaliacao`, `MinhaCarreira` (aba 2), e botões de seleção de nível em `RespostaAvaliacao`.

### 4.3 Status do colaborador na avaliação

Em `RespostaAvaliacao`, o progresso é calculado em tempo real:

```ts
const totalHabilidades = competenciasMock.reduce((acc, comp) => acc + comp.habilidades.length, 0);
const respondidas = Object.keys(respostas).length;
const progresso = Math.round((respondidas / totalHabilidades) * 100);
```

O botão "Enviar avaliação" fica `disabled` enquanto `respondidas < totalHabilidades`. O botão "Salvar rascunho" está sempre ativo.

### 4.4 Lógica "próxima avaliação encerra em X dias"

**Arquivo:** `ColaboradorView.tsx`, linhas 210–222

```ts
const emAbertoComPrazo = avaliacoesColaborador.filter(
  a => (a.status === 'Não iniciada' || a.status === 'Em andamento') && a.dataLimite
);
const proximaVencimento = emAbertoComPrazo.length > 0
  ? emAbertoComPrazo.reduce((min, a) => a.dataLimite! < min.dataLimite! ? a : min)
  : null;
const diasAteVencimento = proximaVencimento
  ? Math.max(0, Math.ceil((proximaVencimento.dataLimite!.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)))
  : null;
const diasLabel = diasAteVencimento !== null
  ? `${diasAteVencimento} ${diasAteVencimento === 1 ? 'dia' : 'dias'}`
  : '—';
```

Seleciona a avaliação em aberto com `dataLimite` mais próxima. Exibe `'—'` se não houver.

### 4.5 Lógica "habilidades abaixo do esperado"

**Arquivo:** `ColaboradorView.tsx`, linhas 224–231

```ts
const nivelPeso: Record<string, number> = { 'Básico': 1, 'Intermediário': 2, 'Avançado': 3, 'Especialista': 4 };
const cargoAtual = cargos.find(c => c.atual)!;
const mapaColaborador = new Map(habilidadesColaborador.map(h => [h.habilidadeId, h.nivelAtual]));
const nivelEsperadoMap = new Map(cargoAtual.matrizCargo.map(m => [m.habilidadeId, m.nivelEsperado]));
const habilidadesComGap = cargoAtual.matrizCargo.filter(req => {
  const nivelAtual = mapaColaborador.get(req.habilidadeId) ?? '';
  return !calcularCobertura(nivelPeso[nivelAtual] ?? 0, nivelPeso[req.nivelEsperado] ?? 0);
}).length;
```

**Atenção:** `nivelPeso` local em `ColaboradorView` usa escala `1–4` (Avançado=3, Especialista=4), diferente de `niveisDefaultData` onde Avançado tem peso=4 e Especialista=5. Inconsistência conhecida (ver Seção 8).

### 4.6 Ordenação da tabela de gap (aba "Próximo passo")

**Arquivo:** `MinhaCarreira.tsx`, linhas 42–48 (após reescrita)

```ts
const habilidadesComGapProximo = chartDataProximo
  .filter(h => h.nivelAtual < h.nivelExigido)
  .sort((a, b) => {
    if (a.nivelAtual === 0 && b.nivelAtual !== 0) return 1;   // não avaliadas por último
    if (a.nivelAtual !== 0 && b.nivelAtual === 0) return -1;
    return b.nivelExigido - b.nivelAtual - (a.nivelExigido - a.nivelAtual);  // maior gap primeiro
  });
```

---

## 5. Fonte de dados atual (mock)

### 5.1 `ColaboradorView`

| Dado | Localização | Deve vir da API |
|------|------------|-----------------|
| `colaborador` (nome, cargo, senioridade, tempoNoCargo, jornada) | objeto literal interno, linhas 52–58 | Endpoint do perfil do usuário autenticado |
| `competencias` (array com habilidades e níveis) | array hardcoded, linhas 60–119 | Endpoint de habilidades mapeadas do colaborador |
| `cargos` (matrizes Pleno/Sênior/Tech Lead) | array hardcoded, linhas 125–192 | Endpoint de cargos da jornada do colaborador |
| `avaliacoesColaborador` (ids, status, dataLimite) | array hardcoded, linhas 194–200 | Endpoint de avaliações do colaborador |

### 5.2 `MinhasAvaliacoes`

| Dado | Localização | Deve vir da API |
|------|------------|-----------------|
| `avaliacoesMock` (lista completa de avaliações) | `avaliacoesMock`, linhas 18–92 do arquivo | Endpoint de avaliações do colaborador autenticado |
| `resultado.media` e `resultado.distribuicao` | embutidos em `avaliacoesMock` | Endpoint de resultado de avaliação por ID |

### 5.3 `RespostaAvaliacao`

| Dado | Localização | Deve vir da API |
|------|------------|-----------------|
| `competenciasMock` (competências e habilidades para o formulário) | array hardcoded, linhas 13–41 | Endpoint de competências/habilidades da avaliação |
| `niveisDefaultData` | `src/app/data/mockData.ts`, linhas 289–294 | Pode vir da API (configurável por Admin) ou ser constante |
| Persistência de respostas | estado local `respostas` — **perdido ao navegar** | Endpoint de salvar rascunho + endpoint de submissão |

### 5.4 `ResultadoAvaliacao`

| Dado | Localização | Deve vir da API |
|------|------------|-----------------|
| `resultadoDetalhado` (competências com habilidades e médias) | objeto hardcoded, linhas 15–38 | Endpoint de resultado detalhado por avaliação ID |
| Dados do header (`avaliacao.titulo`, `avaliacao.resultado.media`, etc.) | prop `avaliacao` — vem do mock de `MinhasAvaliacoes` | Mesmo endpoint de resultado |

### 5.5 `MinhaCarreira`

| Dado | Localização | Deve vir da API |
|------|------------|-----------------|
| `colaborador` (cargoAtual, senioridade, jornada, etc.) | constante module-level, linhas 12–18 | Endpoint do perfil do usuário |
| `proximoCargo` | constante hardcoded `{ id: 'c3' }`, linha 21 | Calculado pela API com base na jornada do colaborador |
| `habilidadesColaboradorJornada` | array hardcoded (IDs '1'–'16'), linhas 43–60 | Endpoint de habilidades do colaborador (mesmo da avaliação) |
| `cargosJornada` (matrizes de cobertura) | array hardcoded, linhas 70–134 | Endpoint de cargos da jornada com matrizes |
| `habilidadesCargoData` | `src/app/data/mockData.ts`, linhas 61–98 | Endpoint de matriz de habilidades por cargo |
| `avaliacoesColaboradoresData` | `src/app/data/mockData.ts`, linhas 132–147 | Endpoint de níveis atuais do colaborador |
| `habilidadesData` | `src/app/data/mockData.ts`, linhas 193–258 | Endpoint de catálogo de habilidades |

---

## 6. Integrações pendentes

### 6.1 Hooks Admin reutilizáveis

Atualmente o Admin usa dois contextos principais:

- `useHabilidades()` → `src/app/context/HabilidadesContext.tsx` — gerencia competências, habilidades e níveis. Pode ser reutilizado pelo Colaborador para consumir o catálogo de habilidades e níveis.
- `useCarreiras()` → `src/app/context/CarreirasContext.tsx` — gerencia carreiras, jornadas e cargos. Pode ser reutilizado para obter a jornada do colaborador e seus cargos com matrizes.

Ambos os contextos estão disponíveis globalmente via `CarreirasProvider` e `HabilidadesProvider` em `App.tsx`.

### 6.2 Novos endpoints necessários

| Endpoint | Consumido por | Descrição |
|----------|--------------|-----------|
| `GET /colaborador/me` | `ColaboradorView`, `MinhaCarreira` | Perfil do colaborador autenticado (nome, cargo, jornada, senioridade, tempoNoCargo) |
| `GET /colaborador/me/habilidades` | `ColaboradorView`, `MinhaCarreira` | Níveis atuais do colaborador por habilidade |
| `GET /colaborador/me/avaliacoes` | `MinhasAvaliacoes` | Lista de avaliações com status e metadados |
| `GET /avaliacoes/:id/formulario` | `RespostaAvaliacao` | Competências e habilidades do formulário |
| `POST /avaliacoes/:id/rascunho` | `RespostaAvaliacao` | Salvar respostas parciais |
| `POST /avaliacoes/:id/submeter` | `RespostaAvaliacao` | Enviar avaliação finalizada |
| `GET /avaliacoes/:id/resultado` | `ResultadoAvaliacao` | Resultado detalhado por competência |
| `GET /colaborador/me/jornada` | `MinhaCarreira` | Cargos da jornada com matrizes e cargo atual |

### 6.3 Contextos a criar ou estender

- **`ColaboradorContext`** — contexto dedicado ao colaborador autenticado. Deve expor: perfil, habilidades atuais, avaliações, jornada e cargo próximo. Evita prop drilling entre `ContentArea` → componentes.
- Alternativa mais simples: um hook `useColaborador()` que encapsula fetches e expõe os dados necessários para os 3 componentes de conteúdo.

---

## 7. Padrões visuais obrigatórios

> Para tokens de cor, tipografia e espaçamento gerais, consulte `SGC-design-specs.md` na raiz do projeto.

### 7.1 Cards de métricas (KPI cards)

Padrão usado em `ColaboradorView`, `MinhasAvaliacoes` e `ResultadoAvaliacao`:

```html
<div class="bg-white border border-gray-200 rounded-lg p-5">
  <div class="flex items-center justify-between mb-3">
    <span class="text-base font-semibold text-gray-700">{título}</span>
    <Icon class="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
  </div>
  <p class="text-3xl font-bold text-gray-900">{valor}</p>
  <!-- subtexto opcional: -->
  <p class="text-xs text-gray-400">{subtexto}</p>
</div>
```

Grid: `grid-cols-2 md:grid-cols-4` em `ColaboradorView`; `grid-cols-1 md:grid-cols-3` em `MinhasAvaliacoes` e `ResultadoAvaliacao`.

### 7.2 Badges de nível (getCorFromPeso)

Usados em tabelas de habilidades e resultados de avaliação:

```html
<span
  class="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white"
  style="background-color: {getCorFromPeso(peso)}"
>
  {nivelNome}
</span>
```

Sempre `text-white`. Cor de fundo via `getCorFromPeso(peso)` — jamais hardcoded.

### 7.3 Badges de estado de avaliação

Dois grupos distintos com classes diferentes:

**Avaliações em aberto** (em `MinhasAvaliacoes`):
```html
<!-- Não iniciada -->
<span class="inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full bg-orange-100 text-orange-800">
  Não iniciada
</span>

<!-- Em andamento -->
<span class="inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full bg-blue-100 text-blue-800">
  Em andamento
</span>
```

**Histórico** (em `MinhasAvaliacoes`):
```html
<!-- Concluída -->
<span class="inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full bg-green-100 text-green-800">
  Concluída
</span>

<!-- Expirada -->
<span class="inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full bg-gray-100 text-gray-700">
  Expirada
</span>
```

### 7.4 Banners de orientação (brand)

Usado em `MinhaCarreira` (jornada e aba "Próximo passo") e `ResultadoAvaliacao`:

```html
<div class="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3">
  <Info class="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
  <p class="text-sm text-gray-700">{mensagem}</p>
</div>
```

### 7.5 Banners de instrução (slate)

Usado exclusivamente em `RespostaAvaliacao`:

```html
<div class="bg-slate-100 border border-slate-300 rounded-lg p-4 flex items-start gap-3">
  <Info class="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
  <p class="text-sm text-slate-700">
    <span class="font-medium text-slate-800">Instruções: </span>
    {texto}
  </p>
</div>
```

### 7.6 Padrão de tabelas

Usado em `ColaboradorView` (detalhamento de habilidades) e `MinhaCarreira` (tabela de gap):

```html
<div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
  <table class="w-full">
    <thead>
      <tr class="border-b border-gray-200 bg-gray-50">
        <th class="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">
          {coluna}
        </th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <tr>  <!-- sem hover nem transition -->
        <td class="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900">{valor}</td>
      </tr>
    </tbody>
  </table>
</div>
```

`<tr>` de dados **não recebe** `hover:bg-gray-50` nem `transition-colors` — apenas linhas clicáveis (listas de avaliações em `MinhasAvaliacoes`) usam hover.

### 7.7 Pills de filtro (toggle segmentado)

Usado em `ColaboradorView` (filtro de status):

```html
<div class="flex items-center bg-gray-100 rounded-lg p-1">
  {opções.map(opcao => (
    <button
      class="px-3 py-2 text-sm font-normal rounded-md transition-all whitespace-nowrap
             {ativo ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
    >
      {opcao}
    </button>
  ))}
</div>
```

### 7.8 Padrão de abas (tab bar)

Usado em `MinhaCarreira` — baseado no padrão do Admin em `ContentArea.tsx`:

```html
<!-- Container externo: sem margin horizontal no md+, com negative margin para mobile -->
<div class="border-b border-gray-200 mb-6 md:mb-8 -mx-4 md:mx-0">
  <div class="flex gap-3 md:gap-8 overflow-x-auto lg:overflow-x-visible scrollbar-hide px-4 md:px-0">
    <button
      class="pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap flex-shrink-0
             inline-flex items-center gap-2
             {ativo ? 'border-[var(--brand-600)] text-[var(--brand-600)]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'}"
    >
      {label}
    </button>
  </div>
</div>
```

---

## 8. Pendências e débitos técnicos

### 8.1 Funcionalidades não implementadas no protótipo

- **Envio real de avaliação:** `handleEnviar` em `RespostaAvaliacao` dispara `toast.success` e redireciona após 1,5s, mas não persiste dados. `handleSalvarRascunho` idem — apenas tracking Amplitude + toast.
- **Progresso real de avaliações:** o campo `progresso` em `avaliacoesMock` é hardcoded. Não reflete `respostas` do estado de `RespostaAvaliacao`.
- **Resultado detalhado real:** `resultadoDetalhado` em `ResultadoAvaliacao` (linhas 15–38) é fixo e não relacionado à avaliação recebida via prop — exibe sempre as mesmas competências independentemente da avaliação selecionada.
- **Autenticação:** não há autenticação real. O colaborador representado varia entre componentes (João Silva em `ColaboradorView`, Ana Silva em `mockData.ts`).
- **Saudação dinâmica por hora:** funcional em `ColaboradorView` mas retorna hora do cliente — em produção, usar UTC-3 ou hora do servidor.

### 8.2 Inconsistências conhecidas

- **Persona duplicada:** `ColaboradorView` usa "João Silva" como colaborador (linha 53); `mockData.ts` (`colaboradoresData`) registra "Ana Silva" como `colaboradorId: '1'`. `MinhaCarreira` usa `colaboradorId: '1'` para buscar avaliações, mas exibe "Desenvolvedor Frontend / Pleno" (não o cargo de Ana Silva).
- **Escala de peso inconsistente:** `ColaboradorView` define `nivelPeso` local com Avançado=3, Especialista=4 (linha 224). `niveisDefaultData` tem Avançado=4, Especialista=5. O cálculo de "habilidades abaixo do esperado" usa a escala local; `calcularCoberturaCargo` em `cobertura.ts` usa `niveisDefaultData`. Os resultados podem divergir para os mesmos dados.
- **IDs de habilidades desconexos:** `habilidadesColaboradorJornada` em `MinhaCarreira` usa IDs '1'–'16' que pertencem ao modelo local de `ColaboradorView` (competencias interno). Esses IDs **não correspondem** às habilidades do `habilidadesData` de `mockData.ts` (que tem IDs como '1', '2', '3', '4', '9', '10', '11', '12', '14', '18', '21', '22', '23'). O cálculo de cobertura da aba 1 é isolado e não reflete as avaliações reais de `avaliacoesColaboradoresData`.
- **`competenciasMock` em `RespostaAvaliacao`:** lista habilidades com IDs '1', '2', '3', '4', '6', '8', '15', '19', '20' — alguns desses IDs ('6', '8', '19', '20') não existem em `habilidadesData`. O formulário de avaliação não reflete as habilidades reais do cargo do colaborador.

### 8.3 Decisões de produto em aberto

- **"Próximo cargo" fixo:** em `MinhaCarreira`, `proximoCargo` está hardcoded como `{ id: 'c3', nome: 'Desenvolvedor Sênior' }`. A lógica de qual é o próximo cargo deve ser definida pelo produto — ordem na jornada? Escolha do gestor? Aspiração do colaborador?
- **Cobertura vs. promoção:** o banner informativo da jornada diz "Atingir 100% das habilidades não garante promoção". A integração com critérios de promoção não está definida.
- **Visibilidade de avaliações de gestor:** atualmente o colaborador só vê autoavaliações. Avaliações feitas pelo gestor (`tipo: 'Gestor'`) existem em `historicoAvaliacoesData` mas não são exibidas.

### 8.4 Integrações futuras planejadas (não implementadas)

- **Plataforma de cursos:** exibir cursos recomendados para fechar gaps de habilidades (referenciado em contexto de produto, sem código no protótipo)
- **Feedz (plataforma de feedback):** integração para trazer feedbacks recebidos para o contexto de carreira
- **Certificações:** exibir certificados relevantes por habilidade no perfil do colaborador
- **Histórico de evolução:** gráfico de evolução de nível por habilidade ao longo do tempo (requer múltiplas avaliações com timestamp)
- **Notificações:** alertas de prazo de avaliação se aproximando
