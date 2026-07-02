import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router';
import { Info, FlaskConical, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  habilidadesData,
  getHabilidadesAvaliadasColaborador,
  niveisDefaultData,
  joaoHabilidadesCargoMatriz,
  benchmarkCargosData,
  habilidadesCargoDataBenchmark,
} from '../../data/mockData';

const JOAO_ID = '10';

type OutletContext = { isSidebarCollapsed: boolean; viewMode: 'admin' | 'colaborador' };
type StatusDist = 'acima' | 'no' | 'abaixo' | 'sem';

function pesoNivel(nome: string): number {
  return niveisDefaultData.find(n => n.nome === nome)?.peso ?? 0;
}

interface HabilidadeReport {
  habilidadeId: string;
  nome: string;
  competencia: string;
  tipo: string;
  nivelAtual: string | null;
  nivelEsperado: string;
  pesoAtual: number;
  pesoEsperado: number;
  status: StatusDist;
  gap: number;
}

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

const STATUS_LABEL: Record<StatusDist, string> = {
  acima:  'Acima',
  no:     'No esperado',
  abaixo: 'Abaixo',
  sem:    'Sem avaliação',
};

const STATUS_COLORS: Record<StatusDist, { bg: string; text: string; bar: string }> = {
  acima:  { bg: 'bg-green-100',  text: 'text-green-700',  bar: 'bg-green-500' },
  no:     { bg: 'bg-blue-100',   text: 'text-blue-700',   bar: 'bg-[var(--brand-500)]' },
  abaixo: { bg: 'bg-red-100',    text: 'text-red-700',    bar: 'bg-red-400' },
  sem:    { bg: 'bg-gray-100',   text: 'text-gray-500',   bar: 'bg-gray-300' },
};

export default function TesteScreeningPage() {
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();
  const [cargoRef, setCargoRef] = useState<string>('atual');

  const mapaJoao = useMemo(
    () => getHabilidadesAvaliadasColaborador(JOAO_ID),
    [],
  );

  const activeMatrix = useMemo(() => {
    if (!cargoRef || cargoRef === 'atual') return joaoHabilidadesCargoMatriz;
    return habilidadesCargoDataBenchmark.filter(h => h.cargoId === cargoRef);
  }, [cargoRef]);

  const report = useMemo(() => calcularReport(mapaJoao, activeMatrix), [mapaJoao, activeMatrix]);

  const dist = useMemo(() => {
    const d: Record<StatusDist, number> = { acima: 0, no: 0, abaixo: 0, sem: 0 };
    for (const r of report) d[r.status]++;
    return d;
  }, [report]);

  const total = report.length;
  const cobertura = useMemo(() => {
    if (total === 0) return 0;
    const cobertas = report.filter(r => r.status === 'acima' || r.status === 'no').length;
    return Math.round((cobertas / total) * 100);
  }, [report, total]);

  const coberturaLabel = cobertura >= 80 ? 'Boa cobertura' : cobertura >= 50 ? 'Cobertura parcial' : 'Baixa cobertura';
  const coberturaColor = cobertura >= 80 ? 'text-green-600' : cobertura >= 50 ? 'text-yellow-600' : 'text-red-600';
  const coberturaBar = cobertura >= 80 ? 'bg-green-500' : cobertura >= 50 ? 'bg-yellow-500' : 'bg-red-500';

  // Competências agrupadas, ordenadas por cobertura (menor primeiro)
  const porCompetencia = useMemo(() => {
    const map = new Map<string, HabilidadeReport[]>();
    for (const r of report) {
      if (!map.has(r.competencia)) map.set(r.competencia, []);
      map.get(r.competencia)!.push(r);
    }
    return Array.from(map.entries())
      .map(([comp, habs]) => {
        const cobertas = habs.filter(h => h.status === 'acima' || h.status === 'no').length;
        const pct = Math.round((cobertas / habs.length) * 100);
        return { comp, habs, pct };
      })
      .sort((a, b) => a.pct - b.pct);
  }, [report]);

  // Top 5 gaps
  const top5Gaps = useMemo(
    () =>
      [...report]
        .filter(r => r.gap > 0)
        .sort((a, b) => b.gap - a.gap)
        .slice(0, 5),
    [report],
  );

  const cargoNome = cargoRef === 'atual'
    ? 'Desenvolvedor Pleno (cargo atual)'
    : benchmarkCargosData.find(c => c.id === cargoRef)?.nome ?? 'Cargo';

  return (
    <main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
      <div className="p-4 md:p-8 space-y-6">

        {/* Banner de teste */}
        <div className="flex items-start gap-3 p-4 bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg">
          <FlaskConical className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[var(--brand-800)]">
            <span className="font-medium">Tela de teste.</span> Visualização experimental para validação de design. Dados de João Silva (id=10). Não utilizar como referência de produto.
          </p>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Screening Report</h1>
          <p className="text-sm text-gray-500 mt-1">
            João Silva — análise de aderência ao cargo selecionado
          </p>
        </div>

        {/* Seletor de cargo */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Cargo de referência:</span>
          <Select value={cargoRef} onValueChange={setCargoRef}>
            <SelectTrigger className="w-72">
              <SelectValue placeholder="Selecionar cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="atual">Cargo atual — Desenvolvedor Pleno</SelectItem>
              {benchmarkCargosData.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nome} — {c.area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-gray-400">{total} habilidades na matriz</span>
        </div>

        {total === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-sm text-gray-500">
            Selecione um cargo para ver o relatório.
          </div>
        ) : (
          <>
            {/* Cobertura geral */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-end gap-4 mb-4">
                <span className={`text-5xl font-bold ${coberturaColor}`}>{cobertura}%</span>
                <span className={`text-base font-medium ${coberturaColor} mb-1`}>{coberturaLabel}</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div className={`h-full rounded-full transition-all ${coberturaBar}`} style={{ width: `${cobertura}%` }} />
              </div>

              {/* Posicionamento na escala */}
              <div className="w-full mt-2 mb-6">
                {/* Labels das zonas — acima da barra */}
                <div className="flex mb-1.5">
                  <div style={{ width: '50%' }} className="text-center">
                    <span className="text-xs text-red-500">Baixa cobertura</span>
                  </div>
                  <div style={{ width: '30%' }} className="text-center">
                    <span className="text-xs text-yellow-600">Cobertura parcial</span>
                  </div>
                  <div style={{ width: '20%' }} className="text-center">
                    <span className="text-xs text-green-600">Boa cobertura</span>
                  </div>
                </div>

                {/* Barra com marcador */}
                <div className="relative pb-8">
                  {/* Zonas coloridas */}
                  <div className="h-4 rounded-full overflow-hidden flex">
                    <div className="bg-red-200"    style={{ width: '50%' }} />
                    <div className="bg-yellow-200" style={{ width: '30%' }} />
                    <div className="bg-green-200"  style={{ width: '20%' }} />
                  </div>

                  {/* Marcador absoluto: linha + ponto + label */}
                  <div
                    className="absolute top-0 flex flex-col items-center"
                    style={{ left: `${cobertura}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="w-0.5 h-4 bg-gray-700" />
                    <div className="w-3 h-3 bg-gray-700 rounded-full mt-1" />
                    <span className="text-xs font-medium text-gray-700 whitespace-nowrap mt-1">
                      Você ({cobertura}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Distribuição */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['acima', 'no', 'abaixo', 'sem'] as StatusDist[]).map(s => (
                  <div
                    key={s}
                    className={`rounded-lg p-3 text-center ${STATUS_COLORS[s].bg}`}
                  >
                    <div className={`text-2xl font-bold ${STATUS_COLORS[s].text}`}>{dist[s]}</div>
                    <div className={`text-xs font-medium mt-0.5 ${STATUS_COLORS[s].text}`}>
                      {STATUS_LABEL[s]}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {total > 0 ? Math.round((dist[s] / total) * 100) : 0}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competências por cobertura */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <p className="text-base font-semibold text-gray-900 mb-1">Cobertura por competência</p>
              <p className="text-xs text-gray-500 mb-4">Ordenado da menor para a maior cobertura — priorize as primeiras.</p>
              <div className="space-y-3">
                {porCompetencia.map(({ comp, habs, pct }) => {
                  const barColor = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-400';
                  return (
                    <div key={comp}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">{comp}</span>
                        <span className={`font-semibold ${pct >= 80 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {pct}%
                          <span className="text-gray-400 font-normal ml-1 text-xs">
                            ({habs.filter(h => h.status === 'acima' || h.status === 'no').length}/{habs.length})
                          </span>
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top 5 Gaps */}
            {top5Gaps.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <p className="text-base font-semibold text-gray-900 mb-1">Top {top5Gaps.length} maiores gaps</p>
                <p className="text-xs text-gray-500 mb-4">Habilidades com maior distância entre nível atual e exigido.</p>
                <div className="space-y-3">
                  {top5Gaps.map((r, idx) => (
                    <div key={r.habilidadeId} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{r.nome}</p>
                        <p className="text-xs text-gray-500">{r.competencia}</p>
                      </div>
                      <div className="text-right text-xs shrink-0">
                        <span className="text-gray-500">
                          {r.nivelAtual ?? 'Sem avaliação'}
                        </span>
                        <span className="text-gray-300 mx-1">→</span>
                        <span className="font-medium text-gray-800">{r.nivelEsperado}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nota obrigatória sobre promoção */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Nota sobre promoção</p>
                <p>
                  A cobertura de habilidades é um insumo para a decisão de promoção, não o único critério.
                  Fatores como tempo no cargo, avaliação de desempenho, maturidade comportamental e
                  disponibilidade de vaga devem ser considerados em conjunto com este relatório.
                  O resultado aqui não substitui a análise do gestor e do RH.
                </p>
              </div>
            </div>

            {/* Info */}
            <div className="flex items-start gap-3 p-4 bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg">
              <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                Cobertura = habilidades avaliadas com nível ≥ ao exigido / total de habilidades na matriz do cargo.
                Habilidades sem avaliação contam como não cobertas.
                Referência atual: <span className="font-medium">{cargoNome}</span>.
              </p>
            </div>
          </>
        )}

      </div>
    </main>
  );
}
