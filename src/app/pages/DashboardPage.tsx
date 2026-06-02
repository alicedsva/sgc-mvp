import { useState, useRef, useEffect, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router';
import * as amplitude from '@amplitude/unified';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import {
  Users, BookOpen, ClipboardList, ClipboardCheck,
  ChevronDown, ChevronRight, X, Download,
} from 'lucide-react';

interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}

const GERENCIAS = [
  'Tecnologia', 'Recursos Humanos', 'Financeiro', 'Marketing',
  'Vendas', 'Operações', 'Produto', 'Design',
];

const JORNADAS = [
  'Desenvolvedor', 'Analista de Dados', 'Analista de RH',
  'Engenheiro de Software', 'Gestor de Projetos',
];

const PERIODOS = ['Últimos 7 dias', 'Últimos 30 dias', 'Últimos 90 dias', 'Este ano'];

// ─── Mock data — Seção 1: Cobertura por competência ──────────────────────────

const COBERTURA_BASE: {
  competencia: string;
  coberturaPorGerencia: Record<string, number>;
}[] = [
  {
    competencia: 'Resolução de Problemas',
    coberturaPorGerencia: {
      Tecnologia: 80, Produto: 75, Financeiro: 72, 'Recursos Humanos': 65,
      Marketing: 60, Vendas: 65, Operações: 68, Design: 62,
    },
  },
  {
    competencia: 'Comunicação Corporativa',
    coberturaPorGerencia: {
      Tecnologia: 70, Produto: 78, 'Recursos Humanos': 92, Financeiro: 85,
      Marketing: 90, Vendas: 88, Operações: 72, Design: 82,
    },
  },
  {
    competencia: 'Inteligência Emocional',
    coberturaPorGerencia: {
      Tecnologia: 60, Produto: 65, 'Recursos Humanos': 80, Financeiro: 65,
      Marketing: 72, Vendas: 68, Operações: 55, Design: 75,
    },
  },
  {
    competencia: 'Metodologias Ágeis',
    coberturaPorGerencia: {
      Tecnologia: 73, Produto: 68, 'Recursos Humanos': 40, Financeiro: 35,
      Marketing: 50, Vendas: 42, Operações: 55, Design: 60,
    },
  },
  {
    competencia: 'Desenvolvimento Frontend',
    coberturaPorGerencia: {
      Tecnologia: 78, Produto: 68, Marketing: 45, Design: 62,
    },
  },
  {
    competencia: 'Desenvolvimento Backend',
    coberturaPorGerencia: {
      Tecnologia: 71, Produto: 55, Operações: 40,
    },
  },
  {
    competencia: 'Liderança',
    coberturaPorGerencia: {
      Tecnologia: 52, Produto: 55, 'Recursos Humanos': 60, Financeiro: 48,
      Marketing: 45, Vendas: 50, Operações: 38, Design: 30,
    },
  },
];

// ─── Mock data — Seção 2: Ranking de gaps ────────────────────────────────────

const GAPS_DATA: {
  habilidade: string;
  competencia: string;
  colaboradoresComGap: number;
  nivelEsperado: string;
  nivelAtual: string;
  gerencias: string[];
  jornada: string;
}[] = [
  { habilidade: 'Node.js',               competencia: 'Desenvolvimento Backend',  colaboradoresComGap: 18, nivelEsperado: 'Intermediário', nivelAtual: 'Básico',        gerencias: ['Tecnologia', 'Produto'],                       jornada: 'Desenvolvedor'      },
  { habilidade: 'PostgreSQL',             competencia: 'Desenvolvimento Backend',  colaboradoresComGap: 15, nivelEsperado: 'Intermediário', nivelAtual: 'Básico',        gerencias: ['Tecnologia'],                                  jornada: 'Desenvolvedor'      },
  { habilidade: 'Liderança Situacional',  competencia: 'Liderança',               colaboradoresComGap: 12, nivelEsperado: 'Intermediário', nivelAtual: 'Básico',        gerencias: ['Recursos Humanos', 'Vendas', 'Financeiro'],     jornada: 'Gestor de Projetos' },
  { habilidade: 'Kanban',                 competencia: 'Metodologias Ágeis',      colaboradoresComGap: 10, nivelEsperado: 'Intermediário', nivelAtual: 'Básico',        gerencias: ['Tecnologia', 'Operações', 'Produto'],           jornada: 'Analista de Dados'  },
  { habilidade: 'Feedback Construtivo',   competencia: 'Liderança',               colaboradoresComGap:  9, nivelEsperado: 'Intermediário', nivelAtual: 'Básico',        gerencias: ['Recursos Humanos', 'Marketing'],                jornada: 'Gestor de Projetos' },
  { habilidade: 'Pensamento Crítico',     competencia: 'Resolução de Problemas',  colaboradoresComGap:  8, nivelEsperado: 'Avançado',      nivelAtual: 'Intermediário', gerencias: ['Tecnologia', 'Produto', 'Financeiro'],          jornada: 'Analista de Dados'  },
  { habilidade: 'Scrum',                  competencia: 'Metodologias Ágeis',      colaboradoresComGap:  7, nivelEsperado: 'Intermediário', nivelAtual: 'Básico',        gerencias: ['Tecnologia', 'Produto'],                       jornada: 'Desenvolvedor'      },
  { habilidade: 'Comunicação Clara',      competencia: 'Comunicação Corporativa', colaboradoresComGap:  6, nivelEsperado: 'Avançado',      nivelAtual: 'Intermediário', gerencias: ['Vendas', 'Marketing', 'Design'],                jornada: 'Analista de RH'     },
  { habilidade: 'TypeScript',             competencia: 'Desenvolvimento Frontend', colaboradoresComGap: 5, nivelEsperado: 'Avançado',      nivelAtual: 'Intermediário', gerencias: ['Tecnologia', 'Design'],                         jornada: 'Desenvolvedor'      },
  { habilidade: 'Gestão de Conflitos',    competencia: 'Liderança',               colaboradoresComGap:  4, nivelEsperado: 'Intermediário', nivelAtual: 'Básico',        gerencias: ['Recursos Humanos', 'Operações'],                jornada: 'Gestor de Projetos' },
];

// ─── Mock data — Seção 3: Média por gerência ─────────────────────────────────

const MEDIA_POR_GERENCIA: {
  gerencia: string;
  totalColaboradores: number;
  mediaCobertura: number;
  habilidadesCriticas: number;
}[] = [
  { gerencia: 'Operações',        totalColaboradores:  9, mediaCobertura: 51, habilidadesCriticas: 6 },
  { gerencia: 'Marketing',        totalColaboradores: 11, mediaCobertura: 57, habilidadesCriticas: 5 },
  { gerencia: 'Vendas',           totalColaboradores: 22, mediaCobertura: 61, habilidadesCriticas: 4 },
  { gerencia: 'Design',           totalColaboradores:  8, mediaCobertura: 63, habilidadesCriticas: 3 },
  { gerencia: 'Financeiro',       totalColaboradores:  8, mediaCobertura: 68, habilidadesCriticas: 2 },
  { gerencia: 'Produto',          totalColaboradores: 14, mediaCobertura: 70, habilidadesCriticas: 3 },
  { gerencia: 'Tecnologia',       totalColaboradores: 18, mediaCobertura: 72, habilidadesCriticas: 3 },
  { gerencia: 'Recursos Humanos', totalColaboradores:  7, mediaCobertura: 79, habilidadesCriticas: 1 },
];

// ─── Mock data — Seção 4: Avaliações ativas ──────────────────────────────────

const AVALIACOES_ATIVAS = [
  {
    id: '1',
    nome: 'Autoavaliação Q1 2026',
    periodo: '15/01 – 15/02/2026',
    respondidos: 18, total: 42,
    gerencias: ['Tecnologia', 'Produto'],
    jornadas: ['Desenvolvedor', 'Analista de Dados'],
  },
  {
    id: '2',
    nome: 'Avaliação 360º — Liderança',
    periodo: '01/01 – 28/02/2026',
    respondidos: 8, total: 15,
    gerencias: ['Recursos Humanos', 'Vendas', 'Financeiro'],
    jornadas: ['Gestor de Projetos'],
  },
  {
    id: '3',
    nome: 'Competências Técnicas 2026',
    periodo: '10/01 – 10/03/2026',
    respondidos: 31, total: 55,
    gerencias: ['Tecnologia', 'Produto', 'Design'],
    jornadas: ['Desenvolvedor', 'Engenheiro de Software'],
  },
  {
    id: '4',
    nome: 'Avaliação de Desenvolvimento',
    periodo: '01/02 – 01/04/2026',
    respondidos: 5, total: 28,
    gerencias: ['Operações', 'Marketing'],
    jornadas: ['Analista de Dados'],
  },
  {
    id: '5',
    nome: 'Avaliação Comportamental',
    periodo: '15/02 – 15/04/2026',
    respondidos: 2, total: 20,
    gerencias: ['Recursos Humanos', 'Marketing'],
    jornadas: ['Analista de RH'],
  },
];

// ─── Mock data — Seção 5: Colaboradores com GAPs críticos ────────────────────

const GAPS_CRITICOS = [
  { id: '1', nome: 'Marcos Oliveira', cargo: 'Desenvolvedor Sênior', gerencia: 'Tecnologia',      gaps: 5, jornada: 'Desenvolvedor'      },
  { id: '2', nome: 'Fernanda Costa',  cargo: 'Analista de Dados',    gerencia: 'Produto',          gaps: 4, jornada: 'Analista de Dados'  },
  { id: '3', nome: 'Ricardo Lima',    cargo: 'Gestor de Projetos',   gerencia: 'Operações',        gaps: 3, jornada: 'Gestor de Projetos' },
  { id: '4', nome: 'Ana Silva',       cargo: 'Desenvolvedor Pleno',  gerencia: 'Tecnologia',       gaps: 2, jornada: 'Desenvolvedor'      },
  { id: '5', nome: 'Juliana Torres',  cargo: 'Analista de RH',       gerencia: 'Recursos Humanos', gaps: 2, jornada: 'Analista de RH'    },
];

const AVALIACOES_HOJE = 12;
const AVALIACOES_ONTEM = 10;
const HABILIDADES_VARIACAO_30D = 4;
const AVALIACOES_VARIACAO_30D = -8;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getBarColor(cobertura: number): string {
  if (cobertura >= 70) return '#009FC2';
  if (cobertura >= 50) return '#33BFDF';
  return '#99DFEF';
}

function getCoberturaTextColor(cobertura: number): string {
  if (cobertura >= 70) return 'text-green-700';
  if (cobertura >= 50) return 'text-yellow-700';
  return 'text-red-700';
}

function getNivelBadgeClass(nivel: string): string {
  switch (nivel) {
    case 'Básico':        return 'bg-blue-400 text-white';
    case 'Intermediário': return 'bg-blue-600 text-white';
    case 'Avançado':      return 'bg-indigo-700 text-white';
    case 'Especialista':  return 'bg-violet-800 text-white';
    default:              return 'bg-gray-400 text-white';
  }
}

function getNivelCircleColor(nivel: string): string {
  switch (nivel) {
    case 'Básico':        return '#60A5FA';
    case 'Intermediário': return '#2563EB';
    case 'Avançado':      return '#4338CA';
    case 'Especialista':  return '#5B21B6';
    default:              return '#9CA3AF';
  }
}

function getNivelProgressao(nivel: string): number {
  switch (nivel) {
    case 'Básico':        return 1;
    case 'Intermediário': return 2;
    case 'Avançado':      return 3;
    case 'Especialista':  return 4;
    default:              return 0;
  }
}

function getNivelBadgeOutlinedClass(nivel: string): string {
  switch (nivel) {
    case 'Básico':        return 'border border-blue-400 text-blue-400 bg-transparent';
    case 'Intermediário': return 'border border-blue-600 text-blue-600 bg-transparent';
    case 'Avançado':      return 'border border-indigo-700 text-indigo-700 bg-transparent';
    case 'Especialista':  return 'border border-violet-800 text-violet-800 bg-transparent';
    default:              return 'border border-gray-400 text-gray-400 bg-transparent';
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (opt: string) =>
    onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg bg-white hover:bg-gray-50 transition-colors ${
          value.length > 0
            ? 'border-[var(--brand-500)] text-[var(--brand-600)]'
            : 'border-gray-300 text-gray-700'
        }`}
      >
        <span>{value.length === 0 ? placeholder : `${placeholder} (${value.length})`}</span>
        <ChevronDown className="w-4 h-4 flex-shrink-0" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[180px] py-1 max-h-60 overflow-y-auto">
          {options.map(opt => (
            <label key={opt} className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={value.includes(opt)}
                onChange={() => toggle(opt)}
                className="w-4 h-4 text-[var(--brand-600)] border-gray-300 rounded focus:ring-2 focus:ring-[var(--brand-500)]"
              />
              <span className="text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function PeriodoSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors text-gray-700"
      >
        <span>{value}</span>
        <ChevronDown className="w-4 h-4 flex-shrink-0" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[180px] py-1">
          {PERIODOS.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => { onChange(p); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                value === p ? 'font-medium text-[var(--brand-600)]' : 'text-gray-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ExportDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleExport = (format: 'pdf' | 'excel') => {
    amplitude.track('Dashboard Exported', { export_format: format });
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--brand-600)] rounded-lg hover:bg-[var(--brand-700)] transition-colors"
      >
        <Download className="w-4 h-4" />
        Exportar
        <ChevronDown className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[180px] py-1">
          <button
            type="button"
            onClick={() => handleExport('pdf')}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Exportar como PDF
          </button>
          <button
            type="button"
            onClick={() => handleExport('excel')}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Exportar como Excel
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();
  const navigate = useNavigate();

  const [filtroGerencias, setFiltroGerencias] = useState<string[]>([]);
  const [filtroJornadas, setFiltroJornadas] = useState<string[]>([]);
  const [filtroPeriodo, setFiltroPeriodo] = useState('Este ano');

  const handleFiltroGerencias = (v: string[]) => {
    setFiltroGerencias(v);
    amplitude.track('Dashboard Filtered', { filter_type: 'gerencia', filter_values: v });
  };

  const handleFiltroJornadas = (v: string[]) => {
    setFiltroJornadas(v);
    amplitude.track('Dashboard Filtered', { filter_type: 'jornada', filter_values: v });
  };

  const handleFiltroPeriodo = (v: string) => {
    setFiltroPeriodo(v);
    amplitude.track('Dashboard Filtered', { filter_type: 'periodo', filter_value: v });
  };

  const gapsSectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = gapsSectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          amplitude.track('Gap Analysis Viewed');
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hasFilters = filtroGerencias.length > 0 || filtroJornadas.length > 0;

  const coberturaFiltrada = useMemo(() => {
    return COBERTURA_BASE
      .map(row => {
        const gerenciasAtivas = filtroGerencias.length === 0 ? GERENCIAS : filtroGerencias;
        const valores = gerenciasAtivas
          .map(g => row.coberturaPorGerencia[g])
          .filter((v): v is number => v !== undefined && v > 0);
        if (valores.length === 0) return null;
        const media = Math.round(valores.reduce((a, b) => a + b, 0) / valores.length);
        return { competencia: row.competencia, mediaCobertura: media };
      })
      .filter((item): item is { competencia: string; mediaCobertura: number } => item !== null)
      .sort((a, b) => b.mediaCobertura - a.mediaCobertura);
  }, [filtroGerencias]);

  const gapsRankingFiltrados = useMemo(() =>
    GAPS_DATA.filter(row => {
      const gerOk = filtroGerencias.length === 0 || row.gerencias.some(g => filtroGerencias.includes(g));
      const jorOk = filtroJornadas.length === 0 || filtroJornadas.includes(row.jornada);
      return gerOk && jorOk;
    }),
    [filtroGerencias, filtroJornadas],
  );

  const gerenciasFiltradas = useMemo(() => {
    if (filtroGerencias.length === 0) return MEDIA_POR_GERENCIA;
    return MEDIA_POR_GERENCIA.filter(row => filtroGerencias.includes(row.gerencia));
  }, [filtroGerencias]);

  const avaliacoesFiltradas = useMemo(() =>
    AVALIACOES_ATIVAS.filter(row => {
      const gerOk = filtroGerencias.length === 0 || row.gerencias.some(g => filtroGerencias.includes(g));
      const jorOk = filtroJornadas.length === 0 || row.jornadas.some(j => filtroJornadas.includes(j));
      return gerOk && jorOk;
    }),
    [filtroGerencias, filtroJornadas],
  );

  const gapsCriticosFiltrados = useMemo(() =>
    GAPS_CRITICOS
      .filter(row => {
        const gerOk = filtroGerencias.length === 0 || filtroGerencias.includes(row.gerencia);
        const jorOk = filtroJornadas.length === 0 || filtroJornadas.includes(row.jornada);
        return gerOk && jorOk;
      })
      .sort((a, b) => b.gaps - a.gaps),
    [filtroGerencias, filtroJornadas],
  );

  const colaboradoresAtivos = hasFilters
    ? Math.round(97 * (gerenciasFiltradas.length / GERENCIAS.length))
    : 97;

  const variacaoHoje = AVALIACOES_ONTEM === 0
    ? 0
    : Math.round(((AVALIACOES_HOJE - AVALIACOES_ONTEM) / AVALIACOES_ONTEM) * 100);

  const chartHeight = Math.max(280, coberturaFiltrada.length * 52);

  return (
    <main
      className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${
        !isSidebarCollapsed ? 'lg:ml-64' : ''
      }`}
    >
      <div className="p-4 md:p-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-2">Visão geral do sistema e métricas principais</p>
          </div>
          <ExportDropdown />
        </div>

        {/* Filtros globais */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
          <MultiSelect
            options={GERENCIAS}
            value={filtroGerencias}
            onChange={handleFiltroGerencias}
            placeholder="Gerência"
          />
          <MultiSelect
            options={JORNADAS}
            value={filtroJornadas}
            onChange={handleFiltroJornadas}
            placeholder="Jornada"
          />
          <PeriodoSelect value={filtroPeriodo} onChange={handleFiltroPeriodo} />
          <button
            type="button"
            onClick={() => { setFiltroGerencias([]); setFiltroJornadas([]); }}
            disabled={!hasFilters}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors ${
              hasFilters
                ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                : 'text-gray-300 cursor-not-allowed'
            }`}
          >
            <X className="w-4 h-4" />
            Limpar filtros
          </button>
        </div>

        {/* Cards de métricas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Colaboradores ativos */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-semibold text-gray-700">Colaboradores ativos</span>
              <Users className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{colaboradoresAtivos}</p>
            <p className="text-xs text-gray-400 mt-2">Sincronizados do RM</p>
          </div>

          {/* Habilidades cadastradas */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-semibold text-gray-700">Habilidades cadastradas</span>
              <BookOpen className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
            </div>
            <p className="text-3xl font-bold text-gray-900">28</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-400">Últimos 30 dias</span>
              {HABILIDADES_VARIACAO_30D > 0 ? (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                  ↑ {HABILIDADES_VARIACAO_30D}%
                </span>
              ) : HABILIDADES_VARIACAO_30D < 0 ? (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                  ↓ {Math.abs(HABILIDADES_VARIACAO_30D)}%
                </span>
              ) : null}
            </div>
          </div>

          {/* Avaliações ativas */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-semibold text-gray-700">Avaliações ativas</span>
              <ClipboardList className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{avaliacoesFiltradas.length}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-400">Últimos 30 dias</span>
              {AVALIACOES_VARIACAO_30D > 0 ? (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                  ↑ {AVALIACOES_VARIACAO_30D}%
                </span>
              ) : AVALIACOES_VARIACAO_30D < 0 ? (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                  ↓ {Math.abs(AVALIACOES_VARIACAO_30D)}%
                </span>
              ) : null}
            </div>
          </div>

          {/* Avaliações respondidas */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-semibold text-gray-700">Avaliações respondidas</span>
              <ClipboardCheck className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{AVALIACOES_HOJE}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-400">Hoje vs. ontem</span>
              {variacaoHoje > 0 ? (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                  ↑ {variacaoHoje}%
                </span>
              ) : variacaoHoje < 0 ? (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                  ↓ {Math.abs(variacaoHoje)}%
                </span>
              ) : null}
            </div>
          </div>

        </div>

        {/* Seção 1 — Cobertura por competência */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-900">Cobertura por competência</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Percentual médio de cobertura das competências na organização
            </p>
          </div>

          {coberturaFiltrada.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-gray-400">
              Nenhuma competência disponível para os filtros selecionados
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart
                data={coberturaFiltrada}
                layout="vertical"
                margin={{ top: 0, right: 56, left: 8, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tickFormatter={(v: number) => `${v}%`}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="competencia"
                  width={210}
                  tick={{ fontSize: 13, fill: '#374151' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: '#f9fafb' }}
                  formatter={(value: number) => [`${value}%`, 'Cobertura média']}
                  contentStyle={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,.1)',
                  }}
                />
                <Bar dataKey="mediaCobertura" radius={[0, 4, 4, 0]} maxBarSize={30}>
                  {coberturaFiltrada.map((entry, i) => (
                    <Cell key={i} fill={getBarColor(entry.mediaCobertura)} />
                  ))}
                  <LabelList
                    dataKey="mediaCobertura"
                    position="right"
                    formatter={(v: number) => `${v}%`}
                    style={{ fontSize: '12px', fill: '#6b7280', fontWeight: 500 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#009FC2]" />
              <span className="text-xs text-gray-500">≥ 70% — Boa cobertura</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#33BFDF]" />
              <span className="text-xs text-gray-500">50–69% — Cobertura parcial</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#99DFEF]" />
              <span className="text-xs text-gray-500">&lt; 50% — Baixa cobertura</span>
            </div>
          </div>
        </div>

        {/* Seção 2 — Ranking de GAPs mais frequentes */}
        <div ref={gapsSectionRef} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="bg-gray-50 -mx-6 -mt-6 px-6 py-3 mb-6 rounded-t-lg">
            <h2 className="text-base font-semibold text-gray-900">Ranking de GAPs mais frequentes</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Habilidades com maior número de colaboradores abaixo do nível esperado
            </p>
          </div>

          {gapsRankingFiltrados.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">
              Nenhum GAP encontrado para os filtros selecionados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">#</th>
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider pr-4">Habilidade</th>
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider pr-4">Competência</th>
                    <th className="pb-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider pr-10 whitespace-nowrap">Colaboradores c/ GAP</th>
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider pr-4 whitespace-nowrap">Nível esperado</th>
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Nível atual mais comum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {gapsRankingFiltrados.map((row, idx) => (
                    <tr key={row.habilidade}>
                      <td className="py-3.5 text-gray-400 text-xs font-medium">{idx + 1}</td>
                      <td className="py-3.5 pr-4 font-medium text-gray-900">{row.habilidade}</td>
                      <td className="py-3.5 pr-4 text-gray-600">{row.competencia}</td>
                      <td className="py-3.5 pr-10 text-right">
                        <span className="font-semibold text-gray-900">{row.colaboradoresComGap}</span>
                        <span className="text-gray-400 ml-1">colab.</span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: getNivelCircleColor(row.nivelEsperado) }}
                        >
                          {getNivelProgressao(row.nivelEsperado)}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: getNivelCircleColor(row.nivelAtual) }}
                        >
                          {getNivelProgressao(row.nivelAtual)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Seção 3 — Média de habilidades por gerência */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="bg-gray-50 -mx-6 -mt-6 px-6 py-3 mb-6 rounded-t-lg">
            <h2 className="text-base font-semibold text-gray-900">Média de habilidades por gerência</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Cobertura média de habilidades por gerência, da menor para a maior
            </p>
          </div>

          {gerenciasFiltradas.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">
              Nenhuma gerência encontrada para os filtros selecionados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider pr-4">Gerência</th>
                    <th className="pb-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider pr-4 whitespace-nowrap">Total de colaboradores</th>
                    <th className="pb-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider pr-4 whitespace-nowrap">Média de cobertura (%)</th>
                    <th className="pb-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Habilidades críticas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {gerenciasFiltradas.map(row => (
                    <tr key={row.gerencia}>
                      <td className="py-3.5 pr-4 font-medium text-gray-900">{row.gerencia}</td>
                      <td className="py-3.5 pr-4 text-right text-gray-600">{row.totalColaboradores}</td>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center justify-end gap-3">
                          <div className="w-28 bg-gray-100 rounded-full h-1.5 flex-shrink-0">
                            <div
                              className="h-1.5 rounded-full transition-all duration-300"
                              style={{
                                width: `${row.mediaCobertura}%`,
                                backgroundColor: getBarColor(row.mediaCobertura),
                              }}
                            />
                          </div>
                          <span className={`font-semibold tabular-nums w-10 text-right ${getCoberturaTextColor(row.mediaCobertura)}`}>
                            {row.mediaCobertura}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 text-right">
                        <span className={`inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-full text-xs font-medium ${
                          row.habilidadesCriticas >= 5 ? 'bg-red-50 text-red-700' :
                          row.habilidadesCriticas >= 3 ? 'bg-yellow-50 text-yellow-700' :
                          'bg-green-50 text-green-700'
                        }`}>
                          {row.habilidadesCriticas}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Seção 4 — Avaliações ativas */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="bg-gray-50 -mx-6 -mt-6 px-6 py-3 mb-5 rounded-t-lg flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Avaliações ativas</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Progresso de participação nas avaliações em andamento
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/avaliacoes')}
              className="flex items-center gap-1 text-sm font-medium text-[var(--brand-600)] hover:text-[var(--brand-700)] transition-colors flex-shrink-0"
            >
              Ver todas
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {avaliacoesFiltradas.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">
              Nenhuma avaliação ativa para os filtros selecionados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider pr-6">
                      Nome da avaliação
                    </th>
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider pr-6 whitespace-nowrap">
                      Período
                    </th>
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider pr-4 whitespace-nowrap">
                      Progresso de participantes
                    </th>
                    <th className="pb-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      % concluído
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {avaliacoesFiltradas.slice(0, 5).map(av => {
                    const pct = Math.round((av.respondidos / av.total) * 100);
                    return (
                      <tr key={av.id}>
                        <td className="py-3.5 pr-6 font-medium text-gray-900">{av.nome}</td>
                        <td className="py-3.5 pr-6 text-gray-500 whitespace-nowrap">{av.periodo}</td>
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                              <div
                                className="h-full rounded-full bg-[var(--brand-600)]"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {av.respondidos} de {av.total}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 text-right">
                          <span className={`text-sm font-semibold ${
                            pct >= 75 ? 'text-green-700' :
                            pct >= 40 ? 'text-[var(--brand-600)]' :
                            'text-gray-600'
                          }`}>
                            {pct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Seção 5 — Colaboradores com GAPs críticos */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="bg-gray-50 -mx-6 -mt-6 px-6 py-3 mb-5 rounded-t-lg flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Colaboradores com GAPs críticos</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Habilidades obrigatórias abaixo do nível esperado, ordenado por número de GAPs
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/perfis')}
              className="flex items-center gap-1 text-sm font-medium text-[var(--brand-600)] hover:text-[var(--brand-700)] transition-colors flex-shrink-0"
            >
              Ver todos
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {gapsCriticosFiltrados.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">
              Nenhum colaborador com GAPs críticos para os filtros selecionados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider pr-6">Nome</th>
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider pr-6">Cargo</th>
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider pr-4">Gerência</th>
                    <th className="pb-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      GAPs críticos
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {gapsCriticosFiltrados.slice(0, 5).map(col => (
                    <tr key={col.id}>
                      <td className="py-3.5 pr-6 font-medium text-gray-900">{col.nome}</td>
                      <td className="py-3.5 pr-6 text-gray-600">{col.cargo}</td>
                      <td className="py-3.5 pr-4 text-gray-600">{col.gerencia}</td>
                      <td className="py-3.5 text-right">
                        <span className={`inline-flex items-center justify-center min-w-[1.75rem] px-2 py-0.5 rounded-full text-xs font-semibold ${
                          col.gaps >= 4 ? 'bg-red-100 text-red-700' :
                          col.gaps >= 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {col.gaps}
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
    </main>
  );
}
