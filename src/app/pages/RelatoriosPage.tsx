import { useState, useRef, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { Download, ChevronDown, X } from 'lucide-react';

interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}

const GERENCIAS = [
  'Tecnologia', 'Recursos Humanos', 'Financeiro', 'Marketing',
  'Vendas', 'Operações', 'Produto', 'Design',
];

const CARGOS = ['Júnior', 'Pleno', 'Sênior', 'Especialista', 'Gestor'];

const JORNADAS = [
  'Desenvolvedor', 'Analista de Dados', 'Analista de RH',
  'Engenheiro de Software', 'Gestor de Projetos',
];

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

const GAPS_DATA: {
  habilidade: string;
  competencia: string;
  colaboradoresComGap: number;
  nivelEsperado: string;
  nivelAtual: string;
  gerencias: string[];
  cargo: string;
  jornada: string;
}[] = [
  { habilidade: 'Node.js', competencia: 'Desenvolvimento Backend', colaboradoresComGap: 18, nivelEsperado: 'Intermediário', nivelAtual: 'Básico', gerencias: ['Tecnologia', 'Produto'], cargo: 'Pleno', jornada: 'Desenvolvedor' },
  { habilidade: 'PostgreSQL', competencia: 'Desenvolvimento Backend', colaboradoresComGap: 15, nivelEsperado: 'Intermediário', nivelAtual: 'Básico', gerencias: ['Tecnologia'], cargo: 'Pleno', jornada: 'Desenvolvedor' },
  { habilidade: 'Liderança Situacional', competencia: 'Liderança', colaboradoresComGap: 12, nivelEsperado: 'Intermediário', nivelAtual: 'Básico', gerencias: ['Recursos Humanos', 'Vendas', 'Financeiro'], cargo: 'Sênior', jornada: 'Gestor de Projetos' },
  { habilidade: 'Kanban', competencia: 'Metodologias Ágeis', colaboradoresComGap: 10, nivelEsperado: 'Intermediário', nivelAtual: 'Básico', gerencias: ['Tecnologia', 'Operações', 'Produto'], cargo: 'Pleno', jornada: 'Analista de Dados' },
  { habilidade: 'Feedback Construtivo', competencia: 'Liderança', colaboradoresComGap: 9, nivelEsperado: 'Intermediário', nivelAtual: 'Básico', gerencias: ['Recursos Humanos', 'Marketing'], cargo: 'Sênior', jornada: 'Gestor de Projetos' },
  { habilidade: 'Pensamento Crítico', competencia: 'Resolução de Problemas', colaboradoresComGap: 8, nivelEsperado: 'Avançado', nivelAtual: 'Intermediário', gerencias: ['Tecnologia', 'Produto', 'Financeiro'], cargo: 'Sênior', jornada: 'Analista de Dados' },
  { habilidade: 'Scrum', competencia: 'Metodologias Ágeis', colaboradoresComGap: 7, nivelEsperado: 'Intermediário', nivelAtual: 'Básico', gerencias: ['Tecnologia', 'Produto'], cargo: 'Pleno', jornada: 'Desenvolvedor' },
  { habilidade: 'Comunicação Clara', competencia: 'Comunicação Corporativa', colaboradoresComGap: 6, nivelEsperado: 'Avançado', nivelAtual: 'Intermediário', gerencias: ['Vendas', 'Marketing', 'Design'], cargo: 'Pleno', jornada: 'Analista de RH' },
  { habilidade: 'TypeScript', competencia: 'Desenvolvimento Frontend', colaboradoresComGap: 5, nivelEsperado: 'Avançado', nivelAtual: 'Intermediário', gerencias: ['Tecnologia', 'Design'], cargo: 'Sênior', jornada: 'Desenvolvedor' },
  { habilidade: 'Gestão de Conflitos', competencia: 'Liderança', colaboradoresComGap: 4, nivelEsperado: 'Intermediário', nivelAtual: 'Básico', gerencias: ['Recursos Humanos', 'Operações'], cargo: 'Sênior', jornada: 'Gestor de Projetos' },
];

const MEDIA_POR_GERENCIA: {
  gerencia: string;
  totalColaboradores: number;
  mediaCobertura: number;
  habilidadesCriticas: number;
}[] = [
  { gerencia: 'Operações', totalColaboradores: 9, mediaCobertura: 51, habilidadesCriticas: 6 },
  { gerencia: 'Marketing', totalColaboradores: 11, mediaCobertura: 57, habilidadesCriticas: 5 },
  { gerencia: 'Vendas', totalColaboradores: 22, mediaCobertura: 61, habilidadesCriticas: 4 },
  { gerencia: 'Design', totalColaboradores: 8, mediaCobertura: 63, habilidadesCriticas: 3 },
  { gerencia: 'Financeiro', totalColaboradores: 8, mediaCobertura: 68, habilidadesCriticas: 2 },
  { gerencia: 'Produto', totalColaboradores: 14, mediaCobertura: 70, habilidadesCriticas: 3 },
  { gerencia: 'Tecnologia', totalColaboradores: 18, mediaCobertura: 72, habilidadesCriticas: 3 },
  { gerencia: 'Recursos Humanos', totalColaboradores: 7, mediaCobertura: 79, habilidadesCriticas: 1 },
];

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
    case 'Básico': return 'bg-gray-100 text-gray-700';
    case 'Intermediário': return 'bg-blue-50 text-blue-700';
    case 'Avançado': return 'bg-purple-50 text-purple-700';
    case 'Especialista': return 'bg-orange-50 text-orange-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

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

  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt]);
  };

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
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px] py-1 max-h-60 overflow-y-auto">
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
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px] py-1">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Exportar como PDF
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Exportar como Excel
          </button>
        </div>
      )}
    </div>
  );
}

export default function RelatoriosPage() {
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();

  const [filtroGerencias, setFiltroGerencias] = useState<string[]>([]);
  const [filtroCargos, setFiltroCargos] = useState<string[]>([]);
  const [filtroJornadas, setFiltroJornadas] = useState<string[]>([]);

  const hasFilters = filtroGerencias.length > 0 || filtroCargos.length > 0 || filtroJornadas.length > 0;

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

  const gapsFiltrados = useMemo(() => {
    return GAPS_DATA.filter(row => {
      const gerenciaOk = filtroGerencias.length === 0 || row.gerencias.some(g => filtroGerencias.includes(g));
      const cargoOk = filtroCargos.length === 0 || filtroCargos.includes(row.cargo);
      const jornadaOk = filtroJornadas.length === 0 || filtroJornadas.includes(row.jornada);
      return gerenciaOk && cargoOk && jornadaOk;
    });
  }, [filtroGerencias, filtroCargos, filtroJornadas]);

  const gerenciasFiltradas = useMemo(() => {
    if (filtroGerencias.length === 0) return MEDIA_POR_GERENCIA;
    return MEDIA_POR_GERENCIA.filter(row => filtroGerencias.includes(row.gerencia));
  }, [filtroGerencias]);

  const chartHeight = Math.max(280, coberturaFiltrada.length * 52);

  return (
    <main
      className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}
    >
      <div className="p-4 md:p-8 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1>
            <p className="text-sm text-gray-600 mt-2">
              Acompanhe a evolução de competências e identifique GAPs na organização
            </p>
          </div>
          <ExportDropdown />
        </div>

        {/* Filtros globais */}
        <div className="flex flex-wrap items-center gap-3 p-3 md:p-4 bg-white border border-gray-200 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
          <MultiSelect
            options={GERENCIAS}
            value={filtroGerencias}
            onChange={setFiltroGerencias}
            placeholder="Gerência"
          />
          <MultiSelect
            options={CARGOS}
            value={filtroCargos}
            onChange={setFiltroCargos}
            placeholder="Cargo"
          />
          <MultiSelect
            options={JORNADAS}
            value={filtroJornadas}
            onChange={setFiltroJornadas}
            placeholder="Jornada"
          />
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setFiltroGerencias([]);
                setFiltroCargos([]);
                setFiltroJornadas([]);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Limpar filtros
            </button>
          )}
        </div>

        {/* Seção 1: Cobertura por competência */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-900">Cobertura por Competência</h2>
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

        {/* Seção 2: Ranking de GAPs */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-900">Ranking de GAPs Mais Frequentes</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Habilidades com maior número de colaboradores abaixo do nível esperado
            </p>
          </div>

          {gapsFiltrados.length === 0 ? (
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
                    <th className="pb-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider pr-6">Colaboradores c/ GAP</th>
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider pr-4">Nível esperado</th>
                    <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nível atual mais comum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {gapsFiltrados.map((row, idx) => (
                    <tr key={row.habilidade} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 text-gray-400 text-xs font-medium">{idx + 1}</td>
                      <td className="py-3.5 pr-4 font-medium text-gray-900">{row.habilidade}</td>
                      <td className="py-3.5 pr-4 text-gray-600">{row.competencia}</td>
                      <td className="py-3.5 pr-6 text-right">
                        <span className="font-semibold text-gray-900">{row.colaboradoresComGap}</span>
                        <span className="text-gray-400 ml-1">colab.</span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getNivelBadgeClass(row.nivelEsperado)}`}>
                          {row.nivelEsperado}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getNivelBadgeClass(row.nivelAtual)}`}>
                          {row.nivelAtual}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Seção 3: Média por gerência */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-900">Média de Habilidades por Área</h2>
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
                    <th className="pb-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider pr-4">Total de colaboradores</th>
                    <th className="pb-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider pr-4">Média de cobertura (%)</th>
                    <th className="pb-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Habilidades críticas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {gerenciasFiltradas.map(row => (
                    <tr key={row.gerencia} className="hover:bg-gray-50 transition-colors">
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

      </div>
    </main>
  );
}
