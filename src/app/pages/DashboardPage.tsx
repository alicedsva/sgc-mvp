import { useState, useRef, useEffect, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import {
  Users, BookOpen, ClipboardList, ClipboardCheck,
  ChevronDown, ChevronRight, X, Download,
} from 'lucide-react';
import {
  avaliacoesData,
  colaboradoresData,
  cargosData,
  habilidadesData,
  habilidadesCargoData,
  competenciasData,
  jornadasData,
  getHabilidadesAvaliadasColaborador,
  getPesoFromNome,
  HOJE_SIMULADO,
} from '../data/mockData';

interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}

// ─── Filtros derivados dos dados reais ───────────────────────────────────────

const GERENCIAS = Array.from(new Set(colaboradoresData.map(c => c.gerencia))).sort();
const JORNADAS  = Array.from(new Set(jornadasData.map(j => j.nome))).sort();

const PERIODOS = ['Últimos 7 dias', 'Últimos 30 dias', 'Últimos 90 dias', 'Este ano'];

// ─── Base de colaboradores avaliados ─────────────────────────────────────────
// Critério: participantes com pelo menos 1 resposta registrada em avaliacoesData.

const AVALIADOS = (() => {
  const avaliados = new Set<string>();
  for (const av of avaliacoesData) {
    for (const p of av.participantes) {
      if (p.respostas.length > 0) avaliados.add(p.colaboradorId);
    }
  }
  const result: Array<{ colaborador: (typeof colaboradoresData)[0]; nivelMap: Map<string, string> }> = [];
  for (const id of avaliados) {
    const colaborador = colaboradoresData.find(c => c.id === id);
    if (!colaborador) continue;
    result.push({ colaborador, nivelMap: getHabilidadesAvaliadasColaborador(id) });
  }
  return result;
})();

const AVALIADOS_COUNT = AVALIADOS.length;

// Lookups rápidos de habilidades
const HAB_TO_COMP_ID   = new Map(habilidadesData.map(h => [h.id, h.competenciaId]));
const HAB_TO_NOME      = new Map(habilidadesData.map(h => [h.id, h.nome]));
const HAB_TO_COMP_NOME = new Map(habilidadesData.map(h => [h.id, h.competencia]));
const COMP_ID_TO_NOME  = new Map(competenciasData.map(c => [c.id, c.nome]));

// ─── Seção 1: Cobertura por competência ──────────────────────────────────────
// Para cada competência × gerência: % de habilidades cobertas (nivelAtual >= nivelEsperado)
// calculado apenas sobre colaboradores avaliados com cargo configurado.

const COBERTURA_BASE = (() => {
  const data = new Map<string, Map<string, { covered: number; total: number }>>();

  for (const { colaborador, nivelMap } of AVALIADOS) {
    const expectedSkills = habilidadesCargoData.filter(h => h.cargoId === colaborador.cargoId);
    if (expectedSkills.length === 0) continue;

    for (const skill of expectedSkills) {
      const compId = HAB_TO_COMP_ID.get(skill.habilidadeId);
      if (!compId) continue;

      // Habilidade sem resposta do colaborador: excluída do cálculo (não entra no denominador)
      const nivelAtual = nivelMap.get(skill.habilidadeId);
      if (!nivelAtual) continue;

      if (!data.has(compId)) data.set(compId, new Map());
      const gerMap = data.get(compId)!;

      const g = colaborador.gerencia;
      if (!gerMap.has(g)) gerMap.set(g, { covered: 0, total: 0 });
      const entry = gerMap.get(g)!;
      entry.total++;

      if (getPesoFromNome(nivelAtual) >= getPesoFromNome(skill.nivelEsperado)) {
        entry.covered++;
      }
    }
  }

  return Array.from(data.entries()).map(([compId, gerMap]) => ({
    competencia: COMP_ID_TO_NOME.get(compId) ?? compId,
    coberturaPorGerencia: Object.fromEntries(
      Array.from(gerMap.entries())
        .filter(([, { total }]) => total > 0)
        .map(([g, { covered, total }]) => [g, Math.round((covered / total) * 100)])
    ),
  }));
})();

// ─── Seção 2: Ranking de GAPs ────────────────────────────────────────────────

const GAPS_DATA = (() => {
  const gapMap = new Map<string, {
    count: number;
    nivelEsperadoMax: string;
    gerencias: Set<string>;
    jornadas: Set<string>;
    nivelAtualCounts: Map<string, number>;
  }>();

  for (const { colaborador, nivelMap } of AVALIADOS) {
    const expectedSkills = habilidadesCargoData.filter(h => h.cargoId === colaborador.cargoId);
    const jornadaNome = jornadasData.find(j => j.id === colaborador.jornadaId)?.nome ?? '';

    for (const skill of expectedSkills) {
      // Habilidade sem resposta do colaborador: excluída do cálculo (não conta como gap)
      const nivelAtual = nivelMap.get(skill.habilidadeId);
      if (!nivelAtual) continue;

      const pesoAtual    = getPesoFromNome(nivelAtual);
      const pesoEsperado = getPesoFromNome(skill.nivelEsperado);

      if (pesoAtual < pesoEsperado) {
        if (!gapMap.has(skill.habilidadeId)) {
          gapMap.set(skill.habilidadeId, {
            count: 0,
            nivelEsperadoMax: skill.nivelEsperado,
            gerencias: new Set(),
            jornadas: new Set(),
            nivelAtualCounts: new Map(),
          });
        }
        const entry = gapMap.get(skill.habilidadeId)!;
        entry.count++;
        entry.gerencias.add(colaborador.gerencia);
        if (jornadaNome) entry.jornadas.add(jornadaNome);
        if (getPesoFromNome(skill.nivelEsperado) > getPesoFromNome(entry.nivelEsperadoMax)) {
          entry.nivelEsperadoMax = skill.nivelEsperado;
        }
        entry.nivelAtualCounts.set(nivelAtual, (entry.nivelAtualCounts.get(nivelAtual) ?? 0) + 1);
      }
    }
  }

  return Array.from(gapMap.entries())
    .map(([habId, data]) => {
      let nivelAtualMaisComum = 'Não avaliado';
      let maxCount = 0;
      for (const [nivel, count] of data.nivelAtualCounts) {
        if (count > maxCount) { maxCount = count; nivelAtualMaisComum = nivel; }
      }
      return {
        habilidade: HAB_TO_NOME.get(habId) ?? habId,
        competencia: HAB_TO_COMP_NOME.get(habId) ?? '',
        colaboradoresComGap: data.count,
        nivelEsperado: data.nivelEsperadoMax,
        nivelAtual: nivelAtualMaisComum,
        gerencias: Array.from(data.gerencias),
        jornadas: Array.from(data.jornadas),
      };
    })
    .sort((a, b) => b.colaboradoresComGap - a.colaboradoresComGap)
    .slice(0, 10);
})();

// ─── Seção 3: Média por gerência ─────────────────────────────────────────────
// null = sem colaboradores avaliados com cargo configurado nessa gerência.

const MEDIA_POR_GERENCIA = (() => {
  const gerData = new Map<string, { totalCobertos: number; totalEsperados: number; habilidadesComGap: Set<string> }>();

  for (const { colaborador, nivelMap } of AVALIADOS) {
    const expectedSkills = habilidadesCargoData.filter(h => h.cargoId === colaborador.cargoId);
    const g = colaborador.gerencia;
    if (!gerData.has(g)) gerData.set(g, { totalCobertos: 0, totalEsperados: 0, habilidadesComGap: new Set() });
    const entry = gerData.get(g)!;

    for (const skill of expectedSkills) {
      entry.totalEsperados++;
      const nivelAtual = nivelMap.get(skill.habilidadeId);
      if (nivelAtual && getPesoFromNome(nivelAtual) >= getPesoFromNome(skill.nivelEsperado)) {
        entry.totalCobertos++;
      } else if (skill.obrigatoria) {
        entry.habilidadesComGap.add(skill.habilidadeId);
      }
    }
  }

  return GERENCIAS.map(g => {
    const totalColaboradores = colaboradoresData.filter(c => c.gerencia === g).length;
    const entry = gerData.get(g);
    const mediaCobertura = entry && entry.totalEsperados > 0
      ? Math.round((entry.totalCobertos / entry.totalEsperados) * 100)
      : null;
    return {
      gerencia: g,
      totalColaboradores,
      mediaCobertura,
      habilidadesCriticas: entry?.habilidadesComGap.size ?? 0,
    };
  }).sort((a, b) => {
    if (a.mediaCobertura !== null && b.mediaCobertura !== null) return a.mediaCobertura - b.mediaCobertura;
    if (a.mediaCobertura !== null) return -1;
    return 1;
  });
})();

// ─── Seção 4: Avaliações ativas — calculada via useMemo no componente ────────
// (usa avaliacoesData de mockData.ts)

// ─── Seção 5: Colaboradores com GAPs críticos ────────────────────────────────

const GAPS_CRITICOS = (() =>
  AVALIADOS
    .map(({ colaborador, nivelMap }) => {
      const expectedObrig = habilidadesCargoData.filter(
        h => h.cargoId === colaborador.cargoId && h.obrigatoria,
      );
      const gaps = expectedObrig.filter(skill => {
        // Habilidade sem resposta do colaborador: excluída do cálculo (não conta como gap)
        const nivelAtual = nivelMap.get(skill.habilidadeId);
        if (!nivelAtual) return false;
        return getPesoFromNome(nivelAtual) < getPesoFromNome(skill.nivelEsperado);
      }).length;
      return {
        id: colaborador.id,
        nome: colaborador.nome,
        cargo: cargosData.find(cg => cg.id === colaborador.cargoId)?.cargoRM ?? colaborador.cargo,
        gerencia: colaborador.gerencia,
        jornada: jornadasData.find(j => j.id === colaborador.jornadaId)?.nome ?? '',
        gaps,
      };
    })
    .filter(x => x.gaps > 0)
    .sort((a, b) => b.gaps - a.gaps)
)();

// ─── Avaliações respondidas hoje/ontem ───────────────────────────────────────
// "Respondida em <data>" = participante com respostas registradas cuja
// dataResposta (compartilhada por todas as respostas de um mesmo envio) é
// igual à data-alvo. Comparado sempre contra HOJE_SIMULADO — nunca a data
// real do navegador — para manter o cálculo determinístico.

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function contarAvaliacoesRespondidasEm(dataAlvo: string): number {
  let count = 0;
  for (const av of avaliacoesData) {
    for (const p of av.participantes) {
      if (p.respostas.length > 0 && p.respostas[0].dataResposta === dataAlvo) {
        count++;
      }
    }
  }
  return count;
}

const ONTEM_SIMULADO = new Date(HOJE_SIMULADO);
ONTEM_SIMULADO.setUTCDate(ONTEM_SIMULADO.getUTCDate() - 1);

const AVALIACOES_HOJE = contarAvaliacoesRespondidasEm(toISODate(HOJE_SIMULADO));
const AVALIACOES_ONTEM = contarAvaliacoesRespondidasEm(toISODate(ONTEM_SIMULADO));

// Lacuna: variação de 30 dias ainda não existe em mockData.ts — seria proveniente
// de um backend com histórico de eventos. Mantida estática (fora de escopo).
const HABILIDADES_VARIACAO_30D = 4;
const AVALIACOES_VARIACAO_30D = -8;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPeriodo(inicio: string, fim: string): string {
  const [yi, mi, di] = inicio.split('-');
  const [yf, mf, df] = fim.split('-');
  if (yi === yf) return `${di}/${mi} – ${df}/${mf}/${yf}`;
  return `${di}/${mi}/${yi} – ${df}/${mf}/${yf}`;
}

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

  // Exportação real ainda não implementada neste protótipo — parâmetro
  // mantido na assinatura para os dois botões (PDF/Excel) já chamarem com o
  // formato correto quando a geração for implementada.
  const handleExport = (_format: 'pdf' | 'excel') => {
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
  };

  const handleFiltroJornadas = (v: string[]) => {
    setFiltroJornadas(v);
  };

  const handleFiltroPeriodo = (v: string) => {
    setFiltroPeriodo(v);
  };


  const hasFilters = filtroGerencias.length > 0 || filtroJornadas.length > 0;

  const coberturaFiltrada = useMemo(() => {
    return COBERTURA_BASE
      .map(row => {
        const gerenciasAtivas = filtroGerencias.length === 0 ? GERENCIAS : filtroGerencias;
        const valores = gerenciasAtivas
          .map(g => row.coberturaPorGerencia[g])
          .filter((v): v is number => v !== undefined);
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
      const jorOk = filtroJornadas.length === 0 || row.jornadas.some(j => filtroJornadas.includes(j));
      return gerOk && jorOk;
    }),
    [filtroGerencias, filtroJornadas],
  );

  const gerenciasFiltradas = useMemo(() => {
    if (filtroGerencias.length === 0) return MEDIA_POR_GERENCIA;
    return MEDIA_POR_GERENCIA.filter(row => filtroGerencias.includes(row.gerencia));
  }, [filtroGerencias]);

  // Seção 4: calculada a partir de avaliacoesData — avaliacoesData não tem campos
  // gerencias/jornadas, então filtroGerencias e filtroJornadas não afetam esta seção.
  const avaliacoesAtivas = useMemo(() =>
    avaliacoesData
      .filter(a => a.status === 'Ativa')
      .map(a => ({
        id: a.id,
        nome: a.nome,
        periodo: formatPeriodo(a.periodoInicio, a.periodoFim),
        respondidos: a.participantes.filter(p => p.status === 'Concluída').length,
        total: a.participantes.length,
      })),
    [],
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

  const colaboradoresAtivos = useMemo(() => {
    const ativos = colaboradoresData.filter(c => c.status === 'Ativo');
    if (filtroGerencias.length === 0) return ativos.length;
    return ativos.filter(c => filtroGerencias.includes(c.gerencia)).length;
  }, [filtroGerencias]);

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
            <p className="text-3xl font-bold text-gray-900">{habilidadesData.length}</p>
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
            <p className="text-3xl font-bold text-gray-900">{avaliacoesAtivas.length}</p>
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
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-900">Cobertura por competência</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Percentual médio de cobertura das competências na organização — baseado em {AVALIADOS_COUNT} de {colaboradoresData.length} colaboradores com avaliações registradas
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
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="bg-gray-50 -mx-5 -mt-5 px-5 py-3 mb-6 rounded-t-lg">
            <h2 className="text-base font-semibold text-gray-900">Ranking de GAPs mais frequentes</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Habilidades com maior número de colaboradores abaixo do nível esperado — {AVALIADOS_COUNT} de {colaboradoresData.length} colaboradores avaliados
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
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">#</th>
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider pr-4">Habilidade</th>
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider pr-4">Competência</th>
                    <th className="pb-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider pr-10 whitespace-nowrap">Colaboradores c/ GAP</th>
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider pr-4 whitespace-nowrap">Nível esperado</th>
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Nível atual mais comum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
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
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="bg-gray-50 -mx-5 -mt-5 px-5 py-3 mb-6 rounded-t-lg">
            <h2 className="text-base font-semibold text-gray-900">Média de habilidades por gerência</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Cobertura média de habilidades por gerência, da menor para a maior — "Sem dados" indica gerências sem avaliações registradas ou cargo não configurado
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
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider pr-4">Gerência</th>
                    <th className="pb-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider pr-4 whitespace-nowrap">Total de colaboradores</th>
                    <th className="pb-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider pr-4 whitespace-nowrap">Média de cobertura (%)</th>
                    <th className="pb-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Habilidades críticas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {gerenciasFiltradas.map(row => (
                    <tr key={row.gerencia}>
                      <td className="py-3.5 pr-4 font-medium text-gray-900">{row.gerencia}</td>
                      <td className="py-3.5 pr-4 text-right text-gray-600">{row.totalColaboradores}</td>
                      <td className="py-3.5 pr-4">
                        {row.mediaCobertura !== null ? (
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
                        ) : (
                          <span className="block text-right text-sm text-gray-400">Sem dados</span>
                        )}
                      </td>
                      <td className="py-3.5 text-right">
                        {row.mediaCobertura !== null ? (
                          <span className={`inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-full text-xs font-medium ${
                            row.habilidadesCriticas >= 5 ? 'bg-red-50 text-red-700' :
                            row.habilidadesCriticas >= 3 ? 'bg-yellow-50 text-yellow-700' :
                            'bg-green-50 text-green-700'
                          }`}>
                            {row.habilidadesCriticas}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Seção 4 — Avaliações ativas */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="bg-gray-50 -mx-5 -mt-5 px-5 py-3 mb-5 rounded-t-lg flex items-center justify-between gap-4">
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

          {avaliacoesAtivas.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">
              Nenhuma avaliação ativa no momento
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
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
                <tbody className="divide-y divide-gray-200">
                  {avaliacoesAtivas.slice(0, 5).map(av => {
                    const pct = av.total > 0 ? Math.round((av.respondidos / av.total) * 100) : 0;
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
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="bg-gray-50 -mx-5 -mt-5 px-5 py-3 mb-5 rounded-t-lg flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Colaboradores com GAPs críticos</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Habilidades obrigatórias abaixo do nível esperado — {AVALIADOS_COUNT} de {colaboradoresData.length} colaboradores avaliados
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
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider pr-6">Nome</th>
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider pr-6">Cargo</th>
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider pr-4">Gerência</th>
                    <th className="pb-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      GAPs críticos
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
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
