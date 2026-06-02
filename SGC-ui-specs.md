# SGC — Especificação Técnica de UI — Todas as Rotas

Gerado em 2026-06-02. Baseado no código-fonte real — sem informações inventadas.

---

## Convenções globais

### Layout base (todas as rotas admin)
```tsx
<main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${
  !isSidebarCollapsed ? 'lg:ml-64' : ''
}`}>
  <div className="p-4 md:p-8">…</div>
</main>
```

### Botão voltar (breadcrumb link)
```tsx
<button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6">
  <ArrowLeft className="w-4 h-4" /> Label
</button>
```

### Botões
| Variante | Classes |
|---|---|
| Primário | `px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors` |
| Secundário | `px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors` |
| Perigo (ícone) | `p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors` |
| Ghost brand | `text-sm font-medium text-[var(--brand-600)] hover:text-[var(--brand-700)] transition-colors` |

### Abas (underline pattern)
```tsx
// Ativa:   border-b-2 border-[var(--brand-600)] text-[var(--brand-600)]
// Inativa: border-b-2 border-transparent text-gray-600 hover:text-gray-900
```

### Badges de status
| Status | Classes |
|---|---|
| Ativa | `bg-green-100 text-green-800` |
| Inativa / Encerrada | `bg-gray-100 text-gray-800` |
| Rascunho | `bg-yellow-100 text-yellow-800` |
| Não iniciada | `bg-orange-100 text-orange-800` |
| Em andamento | `bg-blue-100 text-blue-800` |
| Concluída | `bg-green-100 text-green-800` |
| Expirada | `bg-gray-100 text-gray-700` |
| Configurado | `bg-green-100 text-green-800` |
| Pendente | `bg-yellow-100 text-yellow-800` |

### Badges de nível (cor via getCorFromPeso)
| Nível | Hex | Classes diretas (alternativa) |
|---|---|---|
| Básico (peso 1) | `#60A5FA` | `bg-blue-400 text-white` |
| Intermediário (peso 2) | `#2563EB` | `bg-blue-600 text-white` |
| Avançado (peso 4) | `#4338CA` | `bg-indigo-700 text-white` |
| Especialista (peso 5) | `#5B21B6` | `bg-violet-800 text-white` |

### Cards KPI
```tsx
<div className="bg-white border border-gray-200 rounded-lg p-5">
  <div className="flex items-center justify-between mb-3">
    <span className="text-base font-semibold text-gray-700">Label</span>
    <Icon className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
  </div>
  <p className="text-3xl font-bold text-gray-900">{valor}</p>
  {/* opcional: */}
  <p className="text-xs text-gray-400 mt-2">Subtexto</p>
</div>
```

### Tabelas
```tsx
<div className="bg-white rounded-lg border border-gray-200">
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100 bg-gray-50">
          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">…</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        <tr className="hover:bg-gray-50 transition-colors">
          <td className="px-6 py-4">…</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### Empty state genérico
```tsx
<div className="flex items-center justify-center h-32 text-sm text-gray-400">
  Nenhum item encontrado
</div>
```

### Not found (erro 404 inline)
```tsx
<div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
    <AlertCircle className="w-8 h-8 text-red-600" />
  </div>
  <h2 className="text-lg font-semibold text-gray-900 mb-2">Não encontrado</h2>
  <p className="text-sm text-gray-600 mb-6">Mensagem.</p>
  <button className="px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)]">
    Voltar
  </button>
</div>
```

### Contexto de rota (OutletContext — compartilhado por todas as páginas)
```ts
interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}
// Leitura: const { isSidebarCollapsed, viewMode } = useOutletContext<OutletContext>();
```

---

## 1. `/dashboard`

**Arquivo:** `src/app/pages/DashboardPage.tsx`  
**Acesso:** somente admin (`viewMode === 'admin'`)

### Tipos locais
```ts
interface CoberturaBase { competencia: string; coberturaPorGerencia: Record<string, number> }
interface GapData {
  habilidade: string; competencia: string; colaboradoresComGap: number;
  nivelEsperado: string; nivelAtual: string; gerencias: string[]; jornada: string;
}
interface MediaGerencia {
  gerencia: string; totalColaboradores: number; mediaCobertura: number; habilidadesCriticas: number;
}
interface AvaliacaoAtiva {
  id: string; nome: string; periodo: string; respondidos: number; total: number;
  gerencias: string[]; jornadas: string[];
}
interface GapCritico { id: string; nome: string; cargo: string; gerencia: string; gaps: number; jornada: string }
```

### Estado
```ts
const [filtroGerencias, setFiltroGerencias] = useState<string[]>([]);
const [filtroJornadas,  setFiltroJornadas]  = useState<string[]>([]);
const [filtroPeriodo,   setFiltroPeriodo]   = useState('Este ano');
```

### Estrutura JSX
```tsx
// DashboardPage.tsx
export default function DashboardPage() {
  return (
    <main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${
      !isSidebarCollapsed ? 'lg:ml-64' : ''
    }`}>
      <div className="p-4 md:p-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-2">Visão geral do sistema e métricas principais</p>
          </div>
          <ExportDropdown /> {/* dropdown com "Exportar como PDF" e "Exportar como Excel" */}
        </div>

        {/* Filtros globais */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
          <MultiSelect options={GERENCIAS} value={filtroGerencias} onChange={…} placeholder="Gerência" />
          <MultiSelect options={JORNADAS}  value={filtroJornadas}  onChange={…} placeholder="Jornada" />
          <PeriodoSelect value={filtroPeriodo} onChange={…} />
          {/* Limpar filtros — desabilitado quando !hasFilters */}
          <button
            disabled={!hasFilters}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors ${
              hasFilters
                ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                : 'text-gray-300 cursor-not-allowed'
            }`}
          >
            <X className="w-4 h-4" /> Limpar filtros
          </button>
        </div>

        {/* 4 KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Colaboradores ativos | Habilidades cadastradas | Avaliações ativas | Avaliações respondidas */}
          {/* Variação: badge verde ↑ / vermelho ↓ via: */}
          {variacao > 0
            ? <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">↑ {variacao}%</span>
            : variacao < 0
            ? <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">↓ {Math.abs(variacao)}%</span>
            : null
          }
        </div>

        {/* Seção 1 — Cobertura por competência (BarChart horizontal) */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-base font-semibold text-gray-900">Cobertura por competência</h2>
          <p className="text-sm text-gray-500 mt-0.5">Percentual médio de cobertura…</p>
          {/* Empty: */}
          <div className="flex items-center justify-center h-40 text-sm text-gray-400">
            Nenhuma competência disponível para os filtros selecionados
          </div>
          {/* Preenchido: Recharts BarChart layout="vertical" */}
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={coberturaFiltrada} layout="vertical" margin={{ top:0, right:56, left:8, bottom:0 }}>
              <XAxis type="number" domain={[0,100]} tickFormatter={v => `${v}%`}
                tick={{ fontSize:12, fill:'#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="competencia" width={210}
                tick={{ fontSize:13, fill:'#374151' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill:'#f9fafb' }}
                contentStyle={{ border:'1px solid #e5e7eb', borderRadius:'8px', fontSize:'13px' }} />
              <Bar dataKey="mediaCobertura" radius={[0,4,4,0]} maxBarSize={30}>
                {/* Cell fill via getBarColor: ≥70→#009FC2, ≥50→#33BFDF, <50→#99DFEF */}
                <LabelList dataKey="mediaCobertura" position="right"
                  formatter={v => `${v}%`} style={{ fontSize:'12px', fill:'#6b7280', fontWeight:500 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Legenda de cores */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[#009FC2]" /><span className="text-xs text-gray-500">≥ 70% — Boa cobertura</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[#33BFDF]" /><span className="text-xs text-gray-500">50–69% — Cobertura parcial</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[#99DFEF]" /><span className="text-xs text-gray-500">&lt; 50% — Baixa cobertura</span></div>
          </div>
        </div>

        {/* Seção 2 — Ranking de GAPs (tabela) */}
        <div ref={gapsSectionRef} className="bg-white border border-gray-200 rounded-lg p-6">
          {/* Cabeçalho cinza (bg-gray-50 -mx-6 -mt-6 px-6 py-3 mb-6 rounded-t-lg) */}
          {/* Colunas: # | Habilidade | Competência | Colaboradores c/ GAP | Nível esperado | Nível atual mais comum */}
          {/* Níveis renderizados como círculo colorido w-7 h-7 rounded-full text-white text-xs font-bold */}
        </div>

        {/* Seção 3 — Média por gerência (tabela + progress bar inline) */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {/* Progress bar inline: w-28 bg-gray-100 rounded-full h-1.5 */}
          {/* Habilidades críticas: badge rounded-full — ≥5→red-50/red-700, ≥3→yellow-50/yellow-700, <3→green-50/green-700 */}
        </div>

        {/* Seção 4 — Avaliações ativas (tabela + progress bar + link "Ver todas" → /avaliacoes) */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {/* pct ≥75→green-700, ≥40→brand-600, else→gray-600 */}
        </div>

        {/* Seção 5 — Colaboradores com GAPs críticos (tabela + link "Ver todos" → /perfis) */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {/* gaps ≥4→bg-red-100/text-red-700, ≥2→orange-100/orange-700, else→yellow-100/yellow-700 */}
        </div>

      </div>
    </main>
  );
}
```

### Sub-componentes locais
| Componente | Props | Comportamento |
|---|---|---|
| `MultiSelect` | `options, value, onChange, placeholder` | Dropdown checkbox com `useRef` para fechar ao clicar fora. Trigger ativo: `border-[var(--brand-500)] text-[var(--brand-600)]` |
| `PeriodoSelect` | `value, onChange` | Dropdown single-select. Item ativo: `font-medium text-[var(--brand-600)]` |
| `ExportDropdown` | — | Dropdown com "Exportar como PDF / Excel". Dispara `amplitude.track('Dashboard Exported')` |

### Interações / estados
- **Filtros ativos:** `hasFilters = filtroGerencias.length > 0 || filtroJornadas.length > 0` — habilita botão "Limpar"
- **Cobertura empty:** quando nenhuma gerência do filtro tem dados para a competência
- **GAPs empty:** quando nenhuma linha passa nos filtros de gerência + jornada
- **IntersectionObserver na Seção 2:** dispara `amplitude.track('Gap Analysis Viewed')` ao entrar na viewport (threshold 0.3), apenas uma vez

---

## 2. `/habilidades`

**Arquivo:** `src/app/pages/HabilidadesPage.tsx` (19 linhas) → delega para `ContentArea`  
**ContentArea** renderiza o módulo de habilidades internamente (gerenciado por `HabilidadesContext`).

```tsx
// HabilidadesPage.tsx
export default function HabilidadesPage() {
  const { isSidebarCollapsed, viewMode } = useOutletContext<OutletContext>();
  return (
    <ContentArea
      selectedItem="habilidades"
      viewMode={viewMode}
      isSidebarCollapsed={isSidebarCollapsed}
    />
  );
}
```

**Nota:** a UI real de listagem de habilidades está dentro de `ContentArea` (componente `Habilidades`/`ListingPage`), não neste arquivo. Ver `SGC-colaborador-specs.md` §2 para detalhes do `ContentArea`.

---

## 3. `/habilidades/:id`

**Arquivo:** `src/app/pages/HabilidadeDetalhePage.tsx`  
**Contexto de dados:** `useHabilidades()` (HabilidadesContext)

### Tipos
```ts
// Da HabilidadesContext
interface Habilidade {
  id: string;
  nome: string;
  descricao: string;
  competencia: string;
  tipo: 'Técnica' | 'Comportamental';
  status: 'Ativa' | 'Desativada';
  niveis: Array<{ nivelId: string; criterio: string }>;
}

// FormDrawer
interface FormField {
  name: string; label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder?: string; rows?: number; required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options?: Array<{ value: string; label: string }>;
}

// Estado local do drawer
interface FormData {
  nome: string; descricao: string; competencia: string;
  tipo: string; status: string;
  niveis: Array<{ nivelId: string; criterio: string }>;
}
```

### Estado
```ts
const [isDrawerOpen, setIsDrawerOpen] = useState(false);
const [formData,     setFormData]     = useState<FormData>({
  nome:'', descricao:'', competencia:'', tipo:'Técnica', status:'Ativa', niveis:[]
});
```

### Estrutura JSX
```tsx
// HabilidadeDetalhePage.tsx
export default function HabilidadeDetalhePage() {
  // Not found state
  if (!habilidade) return (
    <div className="flex items-center justify-center h-64 text-gray-500">
      Habilidade não encontrada.
    </div>
  );

  return (
    <main className={`mt-16 min-h-screen bg-gray-50 … ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
      <div className="p-4 md:p-8">
        {/* Back link */}
        <button onClick={() => navigate('/habilidades', { state: { tab: 'habilidades-list' } })}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Habilidades
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              {/* Linha com: nome (h1) + badge status + badge tipo + competencia (text-sm text-gray-500) */}
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-semibold text-gray-900">{habilidade.nome}</h1>
                {/* Status: Ativa → bg-green-100/text-green-700 | Desativada → bg-gray-100/text-gray-600 */}
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                  habilidade.status === 'Ativa' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${habilidade.status === 'Ativa' ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {habilidade.status}
                </span>
                {/* Tipo: Técnica → brand-100/brand-800 | Comportamental → purple-100/purple-800 */}
                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                  habilidade.tipo === 'Técnica' ? 'bg-[var(--brand-100)] text-[var(--brand-800)]' : 'bg-purple-100 text-purple-800'
                }`}>{habilidade.tipo}</span>
                <span className="text-sm text-gray-500">{habilidade.competencia}</span>
              </div>
              {habilidade.descricao && <p className="text-sm text-gray-600 mt-1">{habilidade.descricao}</p>}
            </div>
            <button onClick={handleOpenEditDrawer}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors">
              <Edit className="w-4 h-4" /> Editar
            </button>
          </div>

          {/* Critérios por nível */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Critérios por nível</h2>

            {/* Empty */}
            {niveisVinculados.length === 0 && (
              <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center">
                <p className="text-sm text-gray-400">Nenhum nível vinculado a esta habilidade.</p>
              </div>
            )}

            {/* Lista de níveis */}
            {niveisVinculados.map(({ nivelId, criterio, nivel }) => (
              <div key={nivelId} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                {/* Badge de nível (cor via getCorFromPeso(nivel.peso)) */}
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white"
                  style={{ backgroundColor: getCorFromPeso(nivel.peso) }}>
                  {nivel.nome}
                </span>
                {criterio.trim()
                  ? <p className="text-sm text-gray-700">{criterio}</p>
                  : <p className="text-sm text-gray-400">Nenhum critério definido para este nível</p>}
                {nivel.descricao && (
                  <p className="text-xs text-gray-400 leading-relaxed">
                    <span className="font-medium">Referência do nível:</span> {nivel.descricao}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Drawer de edição (FormDrawer + customContent) */}
          <FormDrawer
            isOpen={isDrawerOpen} onClose={…}
            title="Editar Habilidade"
            fields={formFields}    {/* nome, descricao, competencia, tipo, status */}
            onSubmit={handleFormSubmit}
            submitLabel="Salvar alterações"
            customContent={drawerCustomContent}
          />
          {/* drawerCustomContent: seleção de níveis (pills coloridas) + textarea de critério por nível */}
          {/* Pill nível selecionado: border-transparent text-white + backgroundColor via getCorFromPeso */}
          {/* Pill nível não selecionado: border-gray-300 text-gray-600 bg-white hover:border-gray-400 */}
        </div>
      </div>
    </main>
  );
}
```

### Interações / estados
- **Not found:** renderiza `<div className="flex items-center justify-center h-64 text-gray-500">` inline
- **Critério vazio:** `text-sm text-gray-400` com mensagem "Nenhum critério definido"
- **Drawer submit com niveis=[]:** `toast.error('Selecione ao menos um nível…')`
- **Submit com sucesso:** `toast.success('Habilidade atualizada com sucesso!')`
- **Amplitude:** `track('Habilidade Detail Viewed', {nome, competencia, tipo, status})` no mount

### Componentes reutilizados
- `FormDrawer` (`src/app/components/templates/FormDrawer.tsx`)

---

## 4. `/perfis`

**Arquivo:** `src/app/pages/PerfisListPage.tsx` (19 linhas) → delega para `ContentArea`

```tsx
export default function PerfisListPage() {
  const { isSidebarCollapsed, viewMode } = useOutletContext<OutletContext>();
  return <ContentArea selectedItem="perfis" viewMode={viewMode} isSidebarCollapsed={isSidebarCollapsed} />;
}
```

**UI real:** componente `Perfis` em `src/app/components/Perfis.tsx` — tabela de colaboradores com busca e filtros, clique em linha navega para `/perfis/:colaboradorId`.

---

## 5. `/perfis/:colaboradorId`

**Arquivo:** `src/app/pages/PerfilColaboradorPage.tsx`  
**Dados:** `colaboradoresData`, `habilidadesCargoData`, `avaliacoesColaboradoresData`, `habilidadesData`, `jornadasData`, `carreirasData`, `cargosData`, `historicoAvaliacoesData`, `niveisDefaultData` — todos de `mockData`

### Tipos locais (computados)
```ts
interface HabilidadeComGap {
  habilidadeId: string; nome: string; competencia: string; tipo: string;
  nivelAtual: string;   // 'Não avaliado' se sem avaliação
  nivelEsperado: string;
  gap: number;          // nivelAtualNum - nivelEsperadoNum (pode ser negativo)
  obrigatoria: boolean;
}
interface CompetenciaMedia {
  competencia: string; mediaAtual: number; mediaEsperado: number; percentualAderencia: number;
}
```

### Estado
```ts
const [activeTab, setActiveTab] = useState('visao-geral');
// tabs: ['visao-geral', 'habilidades', 'carreira', 'avaliacoes']
```

### Estrutura JSX
```tsx
// PerfilColaboradorPage.tsx
export default function PerfilColaboradorPage() {
  // Not found
  if (!colaborador) return (
    <main className={`mt-16 min-h-screen bg-gray-50 … ${…}`}>
      <div className="p-4 md:p-8"><p>Colaborador não encontrado</p></div>
    </main>
  );

  return (
    <main className={`mt-16 min-h-screen bg-gray-50 … ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
      <div className="p-4 md:p-8">
        {/* Back link → /perfis */}

        {/* Hero card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-[var(--brand-100)] flex items-center justify-center">
              <User className="w-8 h-8 text-[var(--brand-600)]" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">{colaborador.nome}</h1>
              {/* Grid 3 cols: cargo atual | jornada | carreira */}
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <div><span className="text-gray-600">Cargo atual: </span><span className="font-medium text-gray-900">{cargo?.cargoRM}</span></div>
                <div><span className="text-gray-600">Jornada: </span><span className="font-medium text-gray-900">{jornada?.nome}</span></div>
                <div><span className="text-gray-600">Carreira: </span><span className="font-medium text-gray-900">{carreira?.nome}</span></div>
              </div>
              {/* Grid 3 cols: tempo no cargo | última avaliação | vazio */}
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">…</div>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-4 overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[var(--brand-600)] text-[var(--brand-600)]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}>
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Aba: Visão Geral */}
        {activeTab === 'visao-geral' && (
          <div className="space-y-6">
            {/* Cobertura (círculo percentual + texto classificação) */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Cobertura de habilidades do cargo</h2>
              <div className="flex items-center gap-4">
                {/* Círculo: ≥91→green, ≥71→blue, ≥41→yellow, <41→red */}
                <div className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold ${…}`}>
                  {percentualCobertura}%
                </div>
                <div className="flex-1">
                  <div className={`text-2xl font-semibold mb-1 ${…}`}>{classificacaoCobertura}</div>
                  <p className="text-sm text-gray-700 mb-2">{mensagemCobertura}</p>
                  <p className="text-xs text-gray-500">({habilidadesAtendidas} de {totalHabilidades}…)</p>
                </div>
              </div>
            </div>
            {/* Competências por categoria (progress bars) */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {competenciasComMedia.map(comp => (
                <div key={comp.competencia}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{comp.competencia}</span>
                    {/* ≥80→green-600, ≥60→yellow-600, <60→red-600 */}
                    <span className={`text-sm font-semibold ${…}`}>{comp.percentualAderencia}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${…}`} style={{ width:`${Math.min(comp.percentualAderencia,100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Aba: Habilidades */}
        {activeTab === 'habilidades' && (
          <div className="space-y-6">
            {/* Legenda: * = obrigatória, Crítica = obrigatória + abaixo do esperado */}
            {Object.entries(habilidadesPorCategoria).map(([categoria, habilidades]) => (
              <div key={categoria} className="bg-white rounded-lg border border-gray-200">
                {/* Header categoria: bg-gray-50 border-b */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        {/* Habilidade | Nível atual | Nível esperado | GAP */}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {habilidades.map((hab, idx) => (
                        {/* Row crítica: bg-red-50 */}
                        <tr key={idx} className={hab.gap < 0 && hab.obrigatoria ? 'bg-red-50' : ''}>
                          <td>
                            {hab.nome}
                            {hab.obrigatoria && <span className="text-xs text-red-600 font-bold">*</span>}
                            {hab.gap < 0 && hab.obrigatoria && (
                              <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-red-600 text-white">Crítica</span>
                            )}
                          </td>
                          {/* Badges nível: inline-flex px-2 py-1 text-xs font-medium rounded-full text-white
                              cor via nivelNomeParaCor[nome] = NIVEL_CORES[clamp(peso, 1, 5)] */}
                          <td><span style={{ backgroundColor: nivelNomeParaCor[hab.nivelAtual] }}>…</span></td>
                          <td><span style={{ backgroundColor: nivelNomeParaCor[hab.nivelEsperado] }}>…</span></td>
                          <td>
                            {/* gap<0: bg-red-100/text-red-800 "{gap} níveis"
                                gap=0: bg-green-100/text-green-800 "No esperado"
                                gap>0: bg-blue-100/text-blue-800 "+{gap} níveis" */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Aba: Carreira */}
        {activeTab === 'carreira' && (
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Progressão linear: stepper com círculos numerados */}
            {cargosJornada.map((cargoItem, index) => {
              const isCurrent = cargoItem.id === colaborador.cargoId;
              const isPast    = index < cargoAtualIndex;
              return (
                <div key={cargoItem.id} className="flex items-center gap-4">
                  {/* Círculo: atual→brand-600/branco, passado→green-600/branco, futuro→gray-100/gray-300 */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isCurrent ? 'bg-[var(--brand-600)] border-[var(--brand-600)] text-white' :
                    isPast    ? 'bg-green-600 border-green-600 text-white' :
                                'bg-gray-100 border-gray-300 text-gray-600'
                  }`}>{index + 1}</div>
                  <div className="flex-1">
                    {/* Nome + badge: Atual→brand-100/brand-800, Concluído→green-100/green-800, Próximo→gray-100/gray-600 */}
                    {/* Para cargo atual: progress bar + disclaimer */}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Aba: Avaliações */}
        {activeTab === 'avaliacoes' && (
          <div className="bg-white rounded-lg border border-gray-200">
            <table className="w-full">
              {/* Nome da Avaliação | Data | Status */}
              {/* Status sempre "Concluída": bg-green-100/text-green-800 */}
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
```

### Tabs
| id | label | Ícone |
|---|---|---|
| `visao-geral` | Visão Geral | `TrendingUp` |
| `habilidades` | Habilidades | `Award` |
| `carreira` | Carreira | `Briefcase` |
| `avaliacoes` | Avaliações | `ClipboardCheck` |

### Interações
- **Amplitude:** `track('Colaborador Profile Viewed', {cargo, gerencia, jornada})` no mount
- **Linhas críticas:** `bg-red-50` quando `gap < 0 && obrigatoria`

---

## 6. `/carreiras`

**Arquivo:** `src/app/pages/CarreirasListPage.tsx` (19 linhas) → delega para `ContentArea`

```tsx
export default function CarreirasListPage() {
  const { isSidebarCollapsed, viewMode } = useOutletContext<OutletContext>();
  return <ContentArea selectedItem="carreiras" viewMode={viewMode} isSidebarCollapsed={isSidebarCollapsed} />;
}
```

**UI real:** componente `Carreiras` em ContentArea — lista de carreiras com botão "Nova carreira" e tabela. Clicar em linha navega para `/carreiras/:carreiraId`.

---

## 7. `/carreiras/:carreiraId`

**Arquivo:** `src/app/pages/CarreiraDetalhePage.tsx`  
**Dados:** `CarreirasContext` (jornadas, removerJornada, atualizarJornada)

### Tipos
```ts
// CarreirasContext
interface Jornada {
  id: string; carreiraId: string; nome: string; carreira: string;
  tipo: string; quantidadeCargos: number; status: 'Ativa' | 'Inativa';
}

// Estado do sort
interface SortConfig {
  column: 'nome' | 'tipo' | 'quantidadeCargos' | 'status' | 'id';
  direction: 'asc' | 'desc';
}

// FormDrawer edição
interface EditFormData { nome: string; tipo: string }
```

### Estado
```ts
const [buscaJornada, setBuscaJornada] = useState('');
const [filtroStatusJornada, setFiltroStatusJornada] = useState<'todas' | 'ativa' | 'inativa'>('ativa');
const [jornadaParaExcluir,  setJornadaParaExcluir]  = useState<string | null>(null);
const [jornadasSortConfig,  setJornadasSortConfig]  = useState<SortConfig>({ column:'id', direction:'desc' });
const [jornadaParaEditar,   setJornadaParaEditar]   = useState<any | null>(null);
const [isEditDrawerOpen,    setIsEditDrawerOpen]    = useState(false);
const [editFormData,        setEditFormData]        = useState({ nome:'', tipo:'' });
```

### Estrutura JSX
```tsx
// CarreiraDetalhePage.tsx
export default function CarreiraDetalhePage() {
  // Not found: painel centralizado com AlertCircle
  if (!carreira) return (
    <main …>
      <div className="max-w-2xl mx-auto mt-16">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          {/* AlertCircle w-16/h-16 bg-red-100 rounded-full */}
          <h2>Carreira não encontrada</h2>
          <button …>Voltar para carreiras</button>
        </div>
      </div>
    </main>
  );

  return (
    <main className={`mt-16 min-h-screen bg-gray-50 … ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
      <div className="p-4 md:p-8">
        {/* Back link → /carreiras */}

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{carreira.nome}</h1>
          <p className="text-sm text-gray-600 mt-2">Gerencie as jornadas…</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 mb-6">
          {/* Mobile */}
          <div className="flex flex-col gap-3 md:hidden">
            {/* Input busca (full width) */}
            {/* Filtro status (overflow-x-auto pill group) */}
            {/* Botão "Criar jornada" (full width) */}
          </div>
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* Input busca w-72 */}
            {/* Pill group: Todas | Ativas | Desativadas */}
            {/* bg-gray-100 rounded-lg p-1 → ativo: bg-white text-gray-900 shadow-sm */}
            <div className="flex-1" />
            {/* Botão "Criar jornada" → /carreiras/:id/jornadas/criar */}
          </div>
        </div>

        {/* Tabela de jornadas */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Jornadas da carreira = 0: EmptyState */}
          {jornadasDaCarreira.length === 0
            ? <div className="p-12 text-center"><EmptyState … /></div>
            : jornadasOrdenadas.length === 0
            ? <p className="text-sm text-gray-500">Nenhuma jornada encontrada…</p>
            : <Table
                columns={jornadasColumns}
                data={jornadasOrdenadas}
                onRowClick={(row) => navigate(`/carreiras/${carreiraId}/jornadas/${row.id}`)}
              />
          }
        </div>
      </div>

      {/* Modal de exclusão */}
      <ConfirmationModal isOpen={!!jornadaParaExcluir} onClose={…} onConfirm={…}
        title="Excluir jornada?" message="Esta ação não pode ser desfeita…"
        confirmLabel="Excluir" variant="danger" />

      {/* Drawer edição */}
      <FormDrawer isOpen={isEditDrawerOpen} onClose={…}
        title="Editar jornada" fields={editFields} onSubmit={…} submitLabel="Salvar alterações" />
    </main>
  );
}
```

### Colunas da tabela (Column[])
| key | label | Sortable | Render especial |
|---|---|---|---|
| `nome` | Nome da Jornada | Sim | `text-xs md:text-sm text-gray-900` |
| `tipo` | Tipo | Sim | `text-xs md:text-sm text-gray-900` |
| `quantidadeCargos` | Cargos | Sim | `{n} cargos` ou `—` |
| `status` | Status | Sim | Badge `bg-green-100/text-green-800` ou `bg-gray-100/text-gray-800` |
| `_actions` | Ações | Não | `ToggleSwitch` + `Edit` + `Trash2` |

### Interações
- **Sort:** seta `ArrowUp/ArrowDown` visível na coluna ativa; hover mostra seta `opacity-40`
- **Toggle status:** `toast.success('Jornada ativada/desativada')`
- **Excluir:** abre `ConfirmationModal`, confirma com `removerJornada()` + `toast.success`
- **Editar:** abre `FormDrawer` (campos: nome, tipo select)
- **Row click:** navega para `/carreiras/:carreiraId/jornadas/:jornadaId`

### Componentes reutilizados
`Table`, `EmptyState`, `ConfirmationModal`, `FormDrawer`, `ToggleSwitch`

---

## 8. `/carreiras/:carreiraId/jornadas/criar`

**Arquivo:** `src/app/pages/CriarJornadaPage.tsx`  
**Providers:** `DndProvider` (react-dnd, HTML5Backend)

### Tipos
```ts
interface CargoDisponivel  { id: string; nome: string; categoria: string }
interface CargoSelecionadoItem { id: string; nome: string; categoria: string; ordem: number }
```

### Estado
```ts
const [nomeJornada,       setNomeJornada]       = useState('');
const [tipoJornada,       setTipoJornada]       = useState<'Contribuidor Individual'|'Gestão'>('Contribuidor Individual');
const [buscaCargo,        setBuscaCargo]        = useState('');
const [cargosSelecionados,setCargosSelecionados]= useState<CargoSelecionadoItem[]>([]);
```

### Estrutura JSX
```tsx
// CriarJornadaPage (conteúdo interno)
<main className={`mt-16 flex flex-col bg-gray-50 … h-[calc(100vh-4rem)]`}>
  <div className="flex-1 overflow-y-auto px-4 md:px-8 pt-4 md:pt-8 pb-8 md:pb-12">
    {/* Back link → /carreiras/:carreiraId */}

    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-gray-900">Criar jornada de carreira</h1>
      <p className="text-sm text-gray-600 mt-2">Defina como será a evolução…</p>
    </div>

    <div className="space-y-6">

      {/* Bloco 1: Modelo de evolução */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-base font-medium text-gray-900 mb-1">Modelo de evolução</h2>

        {/* Campo nome */}
        <input type="text" className="w-full max-w-md px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white
          focus:ring-2 focus:ring-[var(--brand-500)] focus:border-[var(--brand-500)] outline-none" />

        {/* Seleção tipo (radio cards) */}
        {/* Selecionado: border-2 border-[var(--brand-500)] bg-[var(--brand-50)] */}
        {/* Não selecionado: border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 */}
        {/* Tooltip HelpCircle: absolute left-5 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 hidden group-hover/tip:block */}
      </div>

      {/* Bloco 2: Seleção de cargos (2 colunas) */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Coluna esquerda: cargos disponíveis */}
          {/* Já selecionado: bg-gray-50 cursor-default, texto gray-400, ícone Check brand-500 */}
          {/* Disponível: hover:bg-green-50 cursor-pointer, ícone Plus green-600 opacity-0 group-hover:opacity-100 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
              {cargosFiltrados.map(cargo => {
                const jaSelecionado = cargosSelecionadosIds.includes(cargo.id);
                return (
                  <button disabled={jaSelecionado}
                    className={`w-full flex items-center justify-between px-4 py-3 transition-colors text-left group ${
                      jaSelecionado ? 'bg-gray-50 cursor-default' : 'hover:bg-green-50 cursor-pointer'
                    }`}>
                    …
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coluna direita: cargos selecionados (drag & drop) */}
          {/* Empty: w-10 h-10 rounded-full bg-gray-200 + texto orientativo */}
          {/* Preenchido: lista de DraggableCargo com GripVertical + #index badge */}
          {/* DraggableCargo arrastando: opacity-40 */}
        </div>
      </div>

      {/* Bloco 3: Visualização da progressão (nós lineares) */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Empty: border-2 border-dashed border-gray-200 rounded-lg p-10 text-center */}
        {/* Preenchido: flex items-start gap-0 pb-2 min-w-max */}
        {/* Nó: w-9 h-9 rounded-full border-2
            isFirst → bg-brand-600/border-brand-600 text-white
            isLast  → bg-white border-brand-600 text-brand-600
            outros  → bg-white border-gray-300 text-gray-500 */}
        {/* Conector: w-6 h-px bg-gray-300 + ChevronRight w-3 h-3 text-gray-300 */}
        {/* Badge início: bg-[var(--brand-100)] text-[var(--brand-700)] | topo: bg-gray-100 text-gray-500 */}
      </div>
    </div>
  </div>

  {/* Rodapé sticky (aparece quando cargosSelecionados.length > 0) */}
  {/* max-h-24 py-4 quando visível, max-h-0 py-0 quando oculto — transition-all duration-300 */}
  <div className={`bg-white border-t border-gray-200 px-4 md:px-8 overflow-hidden transition-all duration-300 ${
    cargosSelecionados.length > 0 ? 'max-h-24 py-4' : 'max-h-0 py-0'
  }`}>
    <div className="flex items-center justify-end gap-3">
      <button className="… border border-gray-300 …">Cancelar</button>
      <button className="… bg-[var(--brand-600)] text-white …">Criar jornada</button>
    </div>
  </div>
</main>
```

### Interações
- **Criar sem nome:** `toast.error('Preencha o nome da jornada')`
- **Criar sem cargos:** `toast.error('Selecione pelo menos um cargo')`
- **Sucesso:** `toast.success('Jornada criada com sucesso!')` → navega para `/carreiras/:id/jornadas/:novoId`
- **Amplitude:** `track('Cargo Added To Jornada', {…})` ao adicionar cargo; `track('Jornada Created', {…})` ao criar
- **Rodapé:** animação height com `max-h-0/max-h-24 overflow-hidden transition-all`

---

## 9. `/carreiras/:carreiraId/jornadas/:jornadaId`

**Arquivo:** `src/app/pages/JornadaDetalhePage.tsx`  
**Providers:** `DndProvider` (HTML5Backend)  
**Componentes próprios:** `DraggableCargoItem`, `JornadaDetalheContent`

### Tipos locais
```ts
interface Cargo {
  id: string; jornadaId: string; cargoRM: string;
  ordem: string; habilidadesConfiguradas: number; status: string;
}
interface HabilidadeCargo {
  id: string; habilidadeId: string; habilidadeNome: string;
  categoria: string; nivelEsperado: string;
}
// Matriz de níveis: Record<habilidadeId, Record<cargoId, string | null>>
```

### Estado
```ts
const [cargos,                       setCargos]                       = useState<Cargo[]>(…);
const [cargoExpandido,               setCargoExpandido]               = useState<string | null>(null);
const [isAddCargoDrawerOpen,         setIsAddCargoDrawerOpen]         = useState(false);
const [isAddHabilidadeDrawerOpen,    setIsAddHabilidadeDrawerOpen]    = useState(false);
const [cargoSelecionadoParaHabilidades] = useState<string | null>(null);
const [nivelPadraoHabilidade,        setNivelPadraoHabilidade]        = useState('Básico');
const [isEditCargoDrawerOpen,        setIsEditCargoDrawerOpen]        = useState(false);
const [cargoParaEditar,              setCargoParaEditar]              = useState<Cargo | null>(null);
const [cargoParaExcluir,             setCargoParaExcluir]            = useState<Cargo | null>(null);
const [jornadaParaExcluir,           setJornadaParaExcluir]          = useState(false);
const [isHabilidadesMatrizDrawerOpen,setIsHabilidadesMatrizDrawerOpen]= useState(false);
const [isMenuOpen,                   setIsMenuOpen]                  = useState(false);
const [openCargoMenu,                setOpenCargoMenu]               = useState<string | null>(null);
const [openHabilidadeMenu,           setOpenHabilidadeMenu]          = useState<string | null>(null);
const [habilidadeParaRemover,        setHabilidadeParaRemover]       = useState<{id:string;nome:string}|null>(null);
const [modoCompletude,               setModoCompletude]              = useState(false);
const [searchText,                   setSearchText]                  = useState('');
const [hasUnsavedChanges,            setHasUnsavedChanges]           = useState(false);
const [habilidadesNaMatriz,          setHabilidadesNaMatriz]         = useState<…[]>([]);
const [matrizNiveis,                 setMatrizNiveis]                = useState<Record<string, Record<string, string|null>>>({});
```

### Estrutura JSX
```tsx
// JornadaDetalheContent
<main className={`mt-16 flex flex-col bg-gray-50 … h-[calc(100vh-4rem)]`}>
  <div className="flex-1 overflow-y-auto p-4 md:p-8">

    {/* Back link → /carreiras/:carreiraId */}

    {/* Header */}
    <div className="flex items-start justify-between mb-6">
      <div>
        {/* Nome + tipo (text-sm text-gray-400) + badge status */}
        {/* Status: Ativa → bg-green-100/green-700 + dot bg-green-500, Inativa → bg-gray-100/gray-600 + dot bg-gray-400 */}
        <p className="text-sm text-gray-600 mt-2">Defina o nível esperado…</p>
      </div>
      {/* Botão MoreVertical (menu dropdown) */}
      <div className="relative" ref={menuRef}>
        <button className="p-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
          <MoreVertical className="w-4 h-4" />
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            {/* Editar jornada */}
            {/* Ativar/Desativar jornada */}
            {/* --- divider --- */}
            {/* Excluir jornada (text-red-600 hover:bg-red-50) */}
          </div>
        )}
      </div>
    </div>

    {/* Matriz de configuração */}
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden relative">

      {/* Toolbar da matriz */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
        {/* Busca filtro habilidades (w-56) */}
        {/* Botão modo completude */}
        {/* modoCompletude ativo: bg-[var(--brand-50)] border-[var(--brand-200)] text-[var(--brand-700)] */}
        {/* EyeOff quando ativo, Eye quando inativo */}
        {/* Badge com total de habilidades incompletas */}
        <div className="flex-1" />
        <button …>
          <Plus className="w-4 h-4" /> Gerenciar habilidades
        </button>
      </div>

      {/* Tabela da matriz */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-20">
            <tr>
              {/* Col habilidade: sticky left-0 bg-gray-50 z-30 w-[220px] */}
              {/* Col por cargo: min-w-[160px] max-w-[240px] */}
              {/* Cabeçalho cargo: nome + barra de progresso + contador "X/Y" */}
              {/* Barra progresso: 100%→#16A34A, >0→#F59E0B, 0→#E5E7EB */}
              {/* Botão MoreVertical (opção "Remover cargo") */}
            </tr>
          </thead>
          <tbody>
            {/* Vazio sem cargos: td colSpan=1 text-center */}
            {/* Vazio sem habilidades: td colSpan={cargos.length+1} text-center */}
            {/* Grupo de competência: bg-[#F3F4F6] px-4 py-2, text-xs uppercase tracking-wider */}
            {/* Linha habilidade: alternada bg-white / bg-[#F9FAFB] */}
            {/* Col habilidade: sticky left-0 z-10 */}
            {/* Botão MoreVertical da habilidade: opacity-0 group-hover:opacity-100 */}
            {/* Cell no modo completude:
                isDefined → bg-green-50 group-hover:bg-green-100
                pending   → bg-amber-50 group-hover:bg-amber-100
                normal    → group-hover:bg-gray-50 */}
            {/* Cada célula: <MatrizCell nivel={…} onChange={…} niveisAplicaveis={…} /> */}
          </tbody>
        </table>
      </div>

      {/* Fade horizontal direito */}
      <div className="absolute top-0 right-0 bottom-0 w-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
    </div>

  </div>

  {/* Drawers e modais */}
  {/* SelectionDrawer: adicionar cargos */}
  {/* HabilidadesDrawer: adicionar habilidades ao cargo (com seletor nível padrão 2x2 grid) */}
  {/* HabilidadesSelectionModal: gerenciar habilidades da matriz */}
  {/* FormDrawer: editar cargo */}
  {/* 3x ConfirmationModal: excluir cargo | remover habilidade matriz | excluir jornada */}

  {/* Barra de salvar (fora do scroll) */}
  {/* Aparece quando hasUnsavedChanges: max-h-20 py-3, some: max-h-0 py-0 */}
  <div className={`bg-white border-t border-gray-200 overflow-hidden transition-all duration-300 ${
    hasUnsavedChanges ? 'max-h-20 py-3' : 'max-h-0 py-0'
  }`}>
    <div className="flex items-center justify-between px-4 md:px-8">
      <span className="text-sm text-gray-500">Alterações não salvas</span>
      <button className="… bg-[var(--brand-600)] text-white …">Salvar alterações</button>
    </div>
  </div>
</main>
```

### Interações / estados
- **Modo completude:** toggle visual das células (verde/âmbar); contador de habilidades incompletas no botão
- **Barra salvar:** animada por `max-h`; desaparece após `toast.success('Alterações salvas')`
- **Drag cargo (accordion):** `useDrag/useDrop`, `opacity-50` durante arrastar
- **Menu jornada:** `useRef` + `mousedown` fora fecha; divide em Editar/Toggle/Excluir
- **Menu cargo/habilidade:** fecha ao click em qualquer lugar do doc
- **Nível select inline:** `<select>` nativo + badge colorida ao lado

### Componentes reutilizados
`AccordionItem`, `MatrizProgressao`, `MatrizCell`, `HabilidadesDrawer`, `SelectionDrawer`, `HabilidadesSelectionModal`, `FormDrawer`, `ConfirmationModal`

---

## 10. `/carreiras/:carreiraId/jornadas/:jornadaId/editar`

**Arquivo:** `src/app/pages/EditarJornadaPage.tsx`  
**Idêntico em estrutura a `/jornadas/criar`**, com diferenças:
- Título: "Editar jornada de carreira"
- Subtitle: "Altere como será a evolução…"
- Cargos pré-populados com `cargosExistentes` (do contexto)
- Rodapé sempre visível (não condicional)
- Botão: "Salvar alterações" (em vez de "Criar jornada")
- Sucesso: `toast.success('Jornada atualizada com sucesso!')` → navega para `/jornadas/:jornadaId`

```tsx
{/* Rodapé: sempre visível */}
<div className="bg-white border-t border-gray-200 px-4 md:px-8 py-4">
  <div className="flex items-center justify-end gap-3">
    <button className="… border border-gray-300 …">Cancelar</button>
    <button className="… bg-[var(--brand-600)] text-white …">Salvar alterações</button>
  </div>
</div>
```

**Estrutura JSX:** idêntica ao Criar (Bloco 1 modelo, Bloco 2 seleção cargos, Bloco 3 progressão).

---

## 11. `/carreiras/:carreiraId/jornadas/:jornadaId/cargos/:cargoId`

**Arquivo:** `src/app/pages/ConfigurarCargoPage.tsx` (20 linhas)  
**Comportamento:** redirect imediato para a jornada pai.

```tsx
export default function ConfigurarCargoPage() {
  const { carreiraId, jornadaId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/carreiras/${carreiraId}/jornadas/${jornadaId}`, { replace: true });
  }, []);
  return null;
}
```

**Não renderiza UI.** Rota mantida por compatibilidade, redireciona para `JornadaDetalhePage`.

---

## 12. `/avaliacoes`

**Arquivo:** `src/app/pages/AvaliacoesPage.tsx` (19 linhas) → delega para `ContentArea`

```tsx
export default function AvaliacoesPage() {
  const { isSidebarCollapsed, viewMode } = useOutletContext<OutletContext>();
  return <ContentArea selectedItem="avaliacoes" viewMode={viewMode} isSidebarCollapsed={isSidebarCollapsed} />;
}
```

**UI real:** componente `Avaliacoes` em ContentArea — tabela de avaliações com filtros, botão "Nova avaliação" (abre `NovaAvaliacaoDrawer`), botão editar (abre `EditarAvaliacaoModal`). Clicar em linha navega para `/avaliacoes/:id`.

---

## 13. `/avaliacoes/:id`

**Arquivo:** `src/app/pages/AvaliacaoDetalhePage.tsx`

### Tipos
```ts
type AvaliacaoStatus = 'Rascunho' | 'Ativa' | 'Encerrada';

interface RespostaHabilidade { competencia: string; habilidade: string; nota: number }
interface Participante {
  id: string; nome: string; cargo: string; gerencia: string;
  status: 'Respondeu' | 'Pendente'; respostas: RespostaHabilidade[];
}
interface AvaliacaoMock {
  id: string; nome: string; status: AvaliacaoStatus;
  periodo: string; tipo: string; publicoLabel: string;
  descricao?: string;
  habilidadesPorCompetencia?: Record<string, string[]>; // só em Rascunho
  participantes: Participante[];
}
```

### Estado (AvaliacaoDetalheView)
```ts
const [drawerParticipante, setDrawerParticipante] = useState<Participante | null>(null);
```

### Estrutura JSX
```tsx
// AvaliacaoDetalhePage
export default function AvaliacaoDetalhePage() {
  return (
    <main className={`mt-16 min-h-screen bg-gray-50 … ${…}`}>
      <div className="p-4 md:p-8">
        {/* Back link → /avaliacoes */}

        {avaliacao.status === 'Rascunho'
          ? <AvaliacaoRascunhoView avaliacao={avaliacao} />
          : <AvaliacaoDetalheView  avaliacao={avaliacao} />
        }
      </div>
    </main>
  );
}

// AvaliacaoRascunhoView — somente leitura
function AvaliacaoRascunhoView({ avaliacao }) {
  return (
    <>
      {/* Header: nome + badge "Rascunho" (bg-yellow-100/text-yellow-800) */}
      {/* Subtítulo: tipo · periodo · publicoLabel (text-sm text-gray-500) */}

      {/* Banner de prévia */}
      <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-6">
        <Eye className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-yellow-800">
          <span className="font-semibold">Prévia</span> — esta avaliação ainda não foi ativada…
        </p>
      </div>

      {/* Habilidades agrupadas por competência */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
        {competencias.map(comp => (
          <div key={comp} className="p-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{comp}</p>
            <div className="space-y-4">
              {habilidadesPorCompetencia[comp].map(hab => (
                <div key={hab} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-800">{hab}</span>
                  <EscalaLeitura /> {/* 5 círculos w-8 h-8 rounded-full border border-gray-200 bg-gray-50 text-gray-400 */}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// AvaliacaoDetalheView — Ativa ou Encerrada
function AvaliacaoDetalheView({ avaliacao }) {
  return (
    <>
      {/* Header: nome + badge (Ativa→green-100/green-800 | Encerrada→gray-100/gray-700) */}

      {/* 4 KPI cards (2 col mobile, 4 col lg) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* SummaryCard: bg-white rounded-lg border border-gray-200 p-5 */}
        {/* ícone em div w-9 h-9 rounded-lg + bg colorido */}
        {/* Total participantes: bg-[var(--brand-50)] */}
        {/* Responderam: bg-green-50 */}
        {/* Pendentes: bg-yellow-50 */}
        {/* Conclusão %: ≥80→text-green-700, ≥50→text-yellow-700, <50→text-red-700 */}
      </div>

      {/* Tabela de participantes */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Participantes</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {/* Nome | Cargo | Gerência | Status | Ações */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {participantes.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                {/* Status: Respondeu→green-100/green-800 | Pendente→yellow-100/yellow-800 */}
                <td>
                  {/* Botão Eye só aparece se status='Respondeu' */}
                  {p.status === 'Respondeu'
                    ? <button className="p-1.5 md:p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Eye className="w-4 h-4" />
                      </button>
                    : <span className="inline-block w-8" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RespostasDrawer (inline, não portal) */}
      {drawerParticipante && <RespostasDrawer participante={drawerParticipante} onClose={…} />}
    </>
  );
}

// RespostasDrawer
function RespostasDrawer({ participante, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 ml-0 md:ml-20 lg:ml-64 mt-16 bg-black/20 z-40" onClick={onClose} />
      {/* Painel */}
      <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-full md:w-[35%] md:max-w-xl md:min-w-[400px]
        bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
        {/* Header: nome + cargo/gerencia + botão X */}
        {/* Conteúdo: grupos por competência */}
        {/* Nota visual: 5 dots w-2.5 h-2.5 rounded-full (preenchidos→brand-500, vazios→gray-200)
            + badge ≥4→green-100/green-700, =3→yellow-100/yellow-700, <3→red-100/red-700 */}
      </div>
    </>
  );
}
```

### Interações
- **Amplitude:** `track('Avaliacao Viewed', {nome, status, tipo, total_participantes})` no mount
- **Ver respostas:** `track('Avaliacao Responses Viewed', {nome, cargo, gerencia, total_respostas})`
- **Drawer backdrop click:** fecha o drawer

---

## 14. `/meu-perfil` — visão colaborador

**Arquivo:** `src/app/pages/MeuPerfilPage.tsx` → `ContentArea` (selectedItem="meu-perfil") → `<ColaboradorView />`

### MeuPerfil (`src/app/components/MeuPerfil.tsx`)

```tsx
export function MeuPerfil() {
  const [tipoCompetencia, setTipoCompetencia] = useState<'tecnicas'|'comportamentais'>('tecnicas');
  const [competenciaExpandida, setCompetenciaExpandida] = useState<number | null>(null);

  return (
    <div className="space-y-6">

      {/* 1. Hero */}
      <div className="bg-gradient-to-br from-[var(--brand-50)] to-[var(--brand-100)] rounded-lg border border-[var(--brand-200)] p-8">
        <div className="flex items-start gap-6 mb-6">
          {/* Avatar: w-20 h-20 bg-[var(--brand-600)] rounded-full */}
          <div className="w-20 h-20 bg-[var(--brand-600)] rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">Olá, {nome} 👋</h1>
            {/* Badge cargo + senioridade */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-300 rounded-full mb-3">
              <span className="text-base font-medium text-gray-800">{cargo}</span>
              <span className="text-gray-400">•</span>
              <span className="text-base font-medium text-[var(--brand-600)]">{senioridade}</span>
            </div>
            <p className="text-base text-gray-700">Aqui você acompanha…</p>
          </div>
        </div>
        {/* Footer hero: área + tempo empresa + última avaliação */}
        <div className="flex items-center gap-6 pt-5 border-t border-[var(--brand-200)]">
          {[Briefcase, Calendar, Clock].map((Icon, i) => (
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{infos[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Ações importantes (condicional) */}
      {(avaliacoesPendentes > 0 || proximoUmPraUm) && (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          {/* Avaliações pendentes: bg-amber-50 border-amber-200 + botão gray-900 */}
          {/* Próximo 1:1: bg-[var(--brand-50)] border-[var(--brand-200)] */}
        </div>
      )}

      {/* 3. 4 indicadores rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Avaliações respondidas: bg-[var(--brand-100)] icon brand-600 */}
        {/* Habilidades avaliadas: bg-purple-100 icon purple-600 */}
        {/* Competências mapeadas: bg-green-100 icon green-600 */}
        {/* Última avaliação (text-sm): bg-gray-100 icon gray-600 */}
      </div>

      {/* 4–5. Radar + análise automática (grid 1 col + 3 cols no lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Radar chart (lg:col-span-2) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          {/* Toggle Técnicas / Comportamentais */}
          {/* Ativo: bg-[var(--brand-600)] text-white */}
          {/* Inativo: bg-gray-100 text-gray-700 hover:bg-gray-200 */}
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={competenciasRadar}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="competencia" tick={{ fill:'#6b7280', fontSize:12 }} />
              <Radar name="Você"        dataKey="voce"        stroke="#009FC2" fill="#009FC2" fillOpacity={0.3} strokeWidth={2} />
              <Radar name="Média da Área"    dataKey="mediaArea"  stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} strokeWidth={2} />
              <Radar name="Média da Empresa" dataKey="mediaEmpresa" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.1} strokeWidth={2} />
              <Legend iconType="circle" />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Análise do perfil (col 1) */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Texto narrativo fixo + lista de recomendações */}
          {/* Rodapé: bg-gray-50 rounded-lg p-3 text-xs text-gray-600 */}
        </div>
      </div>

      {/* 6. Detalhamento por competência (accordion) */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {competenciasDetalhadas.map(comp => (
          <div key={comp.id} className="rounded-lg overflow-hidden">
            {/* Trigger: w-full bg-gray-50 hover:bg-gray-100 px-4 py-4 */}
            {/* ChevronDown quando expandido, ChevronRight quando fechado */}
            <button onClick={() => toggleCompetencia(comp.id)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg">
              {/* Label + count + média */}
            </button>
            {/* Conteúdo expandido: progress bar por habilidade (h-2 bg-gray-200 → h-full bg-[var(--brand-600)]) */}
            {competenciaExpandida === comp.id && (
              <div className="px-4 pb-4 pt-2 bg-gray-50 rounded-b-lg">
                {comp.habilidades.map((hab, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-2">{hab.nome}</p>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--brand-600)] rounded-full"
                          style={{ width:`${(hab.nivel / 5) * 100}%` }} />
                      </div>
                    </div>
                    <p className="ml-6 text-sm font-semibold text-gray-900">{hab.nivel}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 7. Evolução de carreira */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          {/* Ícone TrendingUp: w-12 h-12 bg-green-100 rounded-lg */}
          <div className="flex-1">
            {/* Grid 2 cols: Função Atual (bg-gray-50) | Próxima Função (bg-[var(--brand-50)]) */}
            {/* Habilidades em desenvolvimento: pills px-3 py-1.5 bg-white border border-gray-200 rounded-full */}
            {/* Banner informativo: bg-green-50 border-green-200 rounded-lg p-4 text-green-900 */}
          </div>
        </div>
      </div>

    </div>
  );
}
```

---

## 15. `/minhas-avaliacoes` — visão colaborador

**Arquivo:** `src/app/pages/MinhasAvaliacoesPage.tsx` → `ContentArea` → `<MinhasAvaliacoes />`

### MinhasAvaliacoes (`src/app/components/MinhasAvaliacoes.tsx`)

```tsx
export function MinhasAvaliacoes() {
  const [viewMode, setViewMode] = useState<'lista'|'responder'|'resultado'>('lista');
  const [selectedAvaliacao, setSelectedAvaliacao] = useState<any>(null);

  // Modos alternativos
  if (viewMode === 'responder') return <RespostaAvaliacao avaliacao={selectedAvaliacao} onVoltar={handleVoltar} />;
  if (viewMode === 'resultado') return <ResultadoAvaliacao avaliacao={selectedAvaliacao} onVoltar={handleVoltar} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Minhas Avaliações</h1>
        <p className="text-sm text-gray-600 mt-2">Responda suas avaliações…</p>
      </div>

      {/* 3 KPI cards (grid-cols-1 md:grid-cols-3) */}
      {/* Avaliações em aberto | Concluídas | Última média (escala 1 a 5) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Estrutura idêntica ao KPI card global */}
      </div>

      {/* Avaliações em aberto (condicional) */}
      {(naoIniciadas.length > 0 || emAndamento.length > 0) && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Avaliações em aberto</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {[...naoIniciadas, ...emAndamento].map(av => (
              <div key={av.id} className="p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-medium text-gray-900">{av.titulo}</h3>
                      {/* Badge: Não iniciada→orange-100/orange-800 | Em andamento→blue-100/blue-800 */}
                      <span className={`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full ${
                        av.status === 'Não iniciada' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                      }`}>{av.status}</span>
                    </div>
                    {/* Meta: período · tipo · N habilidades (Calendar + dots) */}
                    {/* Progress bar (condicional, só quando progresso > 0) */}
                    {/* Prazo */}
                  </div>
                  {/* Botão principal */}
                  <button onClick={() => handleResponderClick(av)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)] rounded-lg transition-colors">
                    {av.progresso > 0 ? 'Continuar' : 'Responder'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Histórico (concluídas + expiradas) */}
      {(concluidas.length > 0 || expiradas.length > 0) && (
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Mesma estrutura que "em aberto" mas:
              Concluída → green-100/green-800 + botão "Ver resultado" text-brand-600 hover:bg-brand-50
              Expirada  → gray-100/gray-700  + "Não respondida" text-xs text-gray-400
              Concluída mostra: Award icon + "Nível médio: X" (escala 1 a 5) */}
        </div>
      )}
    </div>
  );
}
```

### Dados mockados de avaliações do colaborador
```ts
// status do colaborador (diferente do status admin)
type StatusColaborador = 'Não iniciada' | 'Em andamento' | 'Concluída' | 'Expirada';
// Avaliações com status admin "Rascunho" NÃO são exibidas aqui.
```

---

## 16. `/minha-carreira` — visão colaborador

**Arquivo:** `src/app/pages/MinhaCarreiraPage.tsx` → `ContentArea` → `<MinhaCarreira />`  
**Amplitude:** `track('Career Path Viewed', { view_mode })` no mount

### MinhaCarreira (`src/app/components/MinhaCarreira.tsx`)

```tsx
export function MinhaCarreira() {
  const [activeTab, setActiveTab] = useState<'minha-jornada'|'proximo-passo'>('minha-jornada');

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Minha Carreira</h1>
        <p className="text-sm text-gray-600 mt-2">Acompanhe sua jornada…</p>
      </div>

      <div>
        {/* Tab bar */}
        <div className="border-b border-gray-200 mb-6 md:mb-8 -mx-4 md:mx-0">
          <div className="flex gap-3 md:gap-8 overflow-x-auto lg:overflow-x-visible scrollbar-hide px-4 md:px-0">
            {(['minha-jornada', 'proximo-passo'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap flex-shrink-0 inline-flex items-center gap-2 ${
                  activeTab === tab
                    ? 'border-[var(--brand-600)] text-[var(--brand-600)]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}>
                {tab === 'minha-jornada' && 'Minha Jornada'}
                {tab === 'proximo-passo' && 'Próximo passo'}
              </button>
            ))}
          </div>
        </div>

        {/* Aba 1 — Minha Jornada */}
        {activeTab === 'minha-jornada' && (
          <div className="space-y-6">

            {/* Card "onde estou agora" */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <p className="text-sm text-gray-500">Cargo atual</p>
              <p className="text-lg font-semibold text-gray-900">{cargoAtual} — {senioridade}</p>
              <p className="text-sm text-gray-500 mt-1">
                Jornada: {jornada} · {tempoNoCargo} no cargo · Última avaliação: {ultimaAvaliacao}
              </p>
            </div>

            {/* Jornada de Carreira */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Jornada de Carreira</h2>
              <p className="text-sm text-gray-600 mb-4">Indicadores de cobertura por nível</p>

              {/* Banner informativo */}
              <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3 mb-5">
                <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">O progresso é calculado…</p>
              </div>

              {/* Cards de cargo (calculados via calcularCoberturaCargo) */}
              <div className="space-y-4">
                {cargosJornada.map(cargo => {
                  const cobertura = calcularCoberturaCargo(habilidadesColaboradorJornada, cargo.matrizCargo);
                  // cobertura: { percentual, label, cor, bgCor }
                  // cor: 'text-green-600' | 'text-yellow-600' | 'text-red-600'
                  // bgCor: 'bg-green-500' | 'bg-yellow-500' | 'bg-red-500'
                  return (
                    <div key={cargo.id}
                      className={`rounded-lg border p-4 transition-all ${
                        cargo.atual
                          ? 'bg-[var(--brand-50)] border-[var(--brand-200)]'
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {cargo.nome}{cargo.senioridade && ` - ${cargo.senioridade}`}
                          </h3>
                          {/* Badge: atual→bg-brand-600 text-white | referência→bg-gray-200 text-gray-700 */}
                          <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full mt-1 ${
                            cargo.atual ? 'bg-[var(--brand-600)] text-white' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {cargo.atual ? 'Cargo atual' : 'Referência para desenvolvimento'}
                          </span>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <p className="text-xs text-gray-600 mb-1.5">
                        <span className={cobertura.cor}>{cobertura.label}</span>
                        {' — '}{cobertura.percentual}% das habilidades mapeadas atendidas
                      </p>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className={`${cobertura.bgCor} h-1.5 rounded-full transition-all`}
                          style={{ width:`${cobertura.percentual}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Aba 2 — Próximo passo */}
        {activeTab === 'proximo-passo' && (
          <div>
            {/* Card referência */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
              <p className="text-sm text-gray-500">Comparando com</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{proximoCargo.nome}</p>
              <p className="text-sm text-gray-500 mt-1">Próximo cargo na jornada {colaborador.jornada}</p>
            </div>

            {/* Banner */}
            <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3 mb-6">
              <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">O comparativo é baseado nas habilidades…</p>
            </div>

            {/* Tabela de habilidades com gap */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Habilidades com gap</h2>
              <p className="text-sm text-gray-500 mb-4">Habilidades onde seu nível está abaixo…</p>

              {/* Empty (zero gaps) */}
              {habilidadesComGapProximo.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  Você atende a todos os requisitos do cargo selecionado.
                </div>
              )}

              {/* Tabela */}
              {habilidadesComGapProximo.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        {/* Habilidade | Competência | Meu nível | Necessário */}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {habilidadesComGapProximo.map(h => (
                        <tr key={h.habilidadeId}>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900">{h.habilidade}</td>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-500">{h.competencia}</td>
                          <td className="px-3 md:px-6 py-3 md:py-4">
                            {h.nivelAtualNome
                              /* Badge colorida via getCorFromPeso(h.nivelAtual) */
                              ? <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white"
                                  style={{ backgroundColor: getCorFromPeso(h.nivelAtual) }}>
                                  {h.nivelAtualNome}
                                </span>
                              /* Não avaliada */
                              : <span className="text-xs text-gray-400 italic">Não avaliada</span>
                            }
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4">
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: getCorFromPeso(h.nivelExigido) }}>
                              {h.nivelExigidoNome}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Lógica de cobertura (calcularCoberturaCargo)
```ts
// src/app/utils/cobertura.ts
// Thresholds:
//   percentual ≥ 80 → label:'Boa cobertura',     cor:'text-green-600',  bgCor:'bg-green-500'
//   percentual ≥ 50 → label:'Cobertura parcial',  cor:'text-yellow-600', bgCor:'bg-yellow-500'
//   percentual < 50 → label:'Baixa cobertura',    cor:'text-red-600',    bgCor:'bg-red-500'
```

### Lógica de gap (Aba 2)
```ts
// habilidadesComGapProximo = chartDataProximo.filter(h => h.nivelAtual < h.nivelExigido)
// Sort: não avaliadas (nivelAtual=0) vão para o final; demais ordenadas por (nivelExigido - nivelAtual) desc
```

---

## Mapa de componentes reutilizados

| Componente | Rotas que usam |
|---|---|
| `FormDrawer` | `/habilidades/:id`, `/carreiras/:id`, `/jornadas/:id` |
| `ConfirmationModal` | `/carreiras/:id`, `/jornadas/:id` |
| `SelectionDrawer` | `/jornadas/:id` |
| `HabilidadesDrawer` | `/jornadas/:id` |
| `HabilidadesSelectionModal` | `/jornadas/:id` |
| `Table` | `/carreiras/:id` |
| `EmptyState` | `/carreiras/:id` |
| `ToggleSwitch` | `/carreiras/:id` |
| `AccordionItem` | `/jornadas/:id` |
| `MatrizCell` | `/jornadas/:id` |
| `MatrizProgressao` | `/jornadas/:id` (importado mas não renderizado nesta versão) |
| `RespostaAvaliacao` | `/minhas-avaliacoes` (sub-view) |
| `ResultadoAvaliacao` | `/minhas-avaliacoes` (sub-view) |
| `MultiSelect` (local) | `/dashboard` |
| `DraggableCargo` (local) | `/jornadas/criar`, `/jornadas/:id/editar` |
| `DraggableCargoItem` (local) | `/jornadas/:id` |

## Padrão de navegação (back links)

| Rota | Back link destino |
|---|---|
| `/habilidades/:id` | `/habilidades` (com `state: { tab: 'habilidades-list' }`) |
| `/perfis/:id` | `/perfis` |
| `/carreiras/:id` | `/carreiras` |
| `/carreiras/:id/jornadas/:id` | `/carreiras/:carreiraId` |
| `/jornadas/criar` | `/carreiras/:carreiraId` |
| `/jornadas/:id/editar` | `/jornadas/:jornadaId` |
| `/avaliacoes/:id` | `/avaliacoes` |
