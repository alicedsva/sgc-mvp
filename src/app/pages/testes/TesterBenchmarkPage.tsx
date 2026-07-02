import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Info, FlaskConical } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import {
  habilidadesData,
  getHabilidadesAvaliadasColaborador,
  niveisDefaultData,
  benchmarkCargosData,
  habilidadesCargoDataBenchmark,
} from '../../data/mockData';

const JOAO_ID = '10';
const MAX_PESO = Math.max(...niveisDefaultData.map(n => n.peso));

type OutletContext = { isSidebarCollapsed: boolean; viewMode: 'admin' | 'colaborador' };
type StatusDist = 'acima' | 'no' | 'abaixo' | 'sem';

function pesoNivel(nome: string): number {
  return niveisDefaultData.find(n => n.nome === nome)?.peso ?? 0;
}

const STATUS_LABEL: Record<StatusDist, string> = {
  acima:  'Acima do esperado',
  no:     'No esperado',
  abaixo: 'Abaixo do esperado',
  sem:    'Sem avaliação',
};

const STATUS_BADGE: Record<StatusDist, string> = {
  acima:  'bg-green-100 text-green-700 border-green-200',
  no:     'bg-blue-100 text-blue-700 border-blue-200',
  abaixo: 'bg-red-100 text-red-700 border-red-200',
  sem:    'bg-gray-100 text-gray-500 border-gray-200',
};

export default function TesterBenchmarkPage() {
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();

  // Dropdowns encadeados
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedCargoBase, setSelectedCargoBase] = useState('');
  const [selectedSenioridade, setSelectedSenioridade] = useState('');

  const areasDisponiveis = useMemo(
    () => [...new Set(benchmarkCargosData.map(c => c.area))],
    [],
  );
  const cargosParaArea = useMemo(
    () => selectedArea ? [...new Set(benchmarkCargosData.filter(c => c.area === selectedArea).map(c => c.cargoBase))] : [],
    [selectedArea],
  );
  const niveisParaCargo = useMemo(
    () => selectedCargoBase
      ? benchmarkCargosData.filter(c => c.area === selectedArea && c.cargoBase === selectedCargoBase).map(c => c.senioridade)
      : [],
    [selectedArea, selectedCargoBase],
  );
  const cargoId = useMemo(
    () => selectedSenioridade
      ? (benchmarkCargosData.find(c => c.area === selectedArea && c.cargoBase === selectedCargoBase && c.senioridade === selectedSenioridade)?.id ?? '')
      : '',
    [selectedArea, selectedCargoBase, selectedSenioridade],
  );

  function handleSelectArea(area: string) {
    setSelectedArea(area);
    setSelectedCargoBase('');
    setSelectedSenioridade('');
  }
  function handleSelectCargoBase(cargoBase: string) {
    setSelectedCargoBase(cargoBase);
    setSelectedSenioridade('');
  }

  const mapaJoao = useMemo(
    () => getHabilidadesAvaliadasColaborador(JOAO_ID),
    [],
  );

  const cargoSelecionado = useMemo(
    () => cargoId ? benchmarkCargosData.find(c => c.id === cargoId) ?? null : null,
    [cargoId],
  );

  const matrizCargo = useMemo(
    () => cargoId ? habilidadesCargoDataBenchmark.filter(h => h.cargoId === cargoId) : [],
    [cargoId],
  );

  // Habilidades com status
  const habilidadesReport = useMemo(() => {
    return matrizCargo.map(req => {
      const hab = habilidadesData.find(h => h.id === req.habilidadeId);
      const nivelAtual = mapaJoao.get(req.habilidadeId) ?? null;
      const pesoAtual = nivelAtual ? pesoNivel(nivelAtual) : 0;
      const pesoEsperado = pesoNivel(req.nivelEsperado);
      let status: StatusDist;
      if (!nivelAtual) status = 'sem';
      else if (pesoAtual > pesoEsperado) status = 'acima';
      else if (pesoAtual === pesoEsperado) status = 'no';
      else status = 'abaixo';

      const isNova = parseInt(req.habilidadeId) >= 50 && !nivelAtual;

      return {
        habilidadeId: req.habilidadeId,
        nome: hab?.nome ?? req.habilidadeId,
        competencia: hab?.competencia ?? 'Outras',
        nivelAtual,
        nivelEsperado: req.nivelEsperado,
        pesoAtual,
        pesoEsperado,
        status,
        gap: pesoEsperado - pesoAtual,
        isNova,
      };
    });
  }, [matrizCargo, mapaJoao]);

  // Cobertura %
  const total = habilidadesReport.length;
  const cobertura = useMemo(() => {
    if (total === 0) return 0;
    const cobertas = habilidadesReport.filter(r => r.status === 'acima' || r.status === 'no').length;
    return Math.round((cobertas / total) * 100);
  }, [habilidadesReport, total]);

  const coberturaLabel = cobertura >= 80 ? 'Boa cobertura' : cobertura >= 50 ? 'Cobertura parcial' : 'Baixa cobertura';
  const coberturaColor = cobertura >= 80 ? 'text-green-600' : cobertura >= 50 ? 'text-yellow-600' : 'text-red-600';
  const coberturaBar = cobertura >= 80 ? 'bg-green-500' : cobertura >= 50 ? 'bg-yellow-500' : 'bg-red-500';

  // Radar data por competência
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

  // Top 5 gaps
  const top5Gaps = useMemo(
    () => [...habilidadesReport].filter(r => r.gap > 0).sort((a, b) => b.gap - a.gap).slice(0, 5),
    [habilidadesReport],
  );

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
          <h1 className="text-2xl font-semibold text-gray-900">Benchmark Mode</h1>
          <p className="text-sm text-gray-500 mt-1">
            Compare o perfil de João Silva com os requisitos de diferentes cargos de referência do mercado.
            Útil para explorar possíveis trilhas de carreira além da jornada atual.
          </p>
        </div>

        {/* Seletor encadeado */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
          {/* Dropdown Área */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Área:</span>
            <Select value={selectedArea} onValueChange={handleSelectArea}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Selecionar área" />
              </SelectTrigger>
              <SelectContent>
                {areasDisponiveis.map(area => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dropdown Cargo */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Cargo:</span>
            <Select value={selectedCargoBase} onValueChange={handleSelectCargoBase} disabled={!selectedArea}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Selecionar cargo" />
              </SelectTrigger>
              <SelectContent>
                {cargosParaArea.map(cargo => (
                  <SelectItem key={cargo} value={cargo}>{cargo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dropdown Nível */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Nível:</span>
            <Select value={selectedSenioridade} onValueChange={setSelectedSenioridade} disabled={!selectedCargoBase}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Selecionar nível" />
              </SelectTrigger>
              <SelectContent>
                {niveisParaCargo.map(nivel => (
                  <SelectItem key={nivel} value={nivel}>{nivel}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Limpar */}
          {selectedArea && (
            <button
              type="button"
              onClick={() => { setSelectedArea(''); setSelectedCargoBase(''); setSelectedSenioridade(''); }}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Limpar
            </button>
          )}
        </div>

        {!cargoId ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Use os filtros acima para selecionar um cargo benchmark
            </p>
            <p className="text-sm text-gray-500">
              {benchmarkCargosData.length} cargos disponíveis em {areasDisponiveis.length} áreas.
              Áreas com múltiplos níveis: Dados e Analytics, Infraestrutura e Cloud, Segurança da Informação.
            </p>
          </div>
        ) : (
          <>
            {/* Cobertura + Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* Cobertura */}
              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-5 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Aderência ao cargo
                  </p>
                  <div className={`text-5xl font-bold ${coberturaColor} mb-1`}>{cobertura}%</div>
                  <div className={`text-sm font-medium ${coberturaColor} mb-3`}>{coberturaLabel}</div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-5">
                    <div className={`h-full rounded-full ${coberturaBar}`} style={{ width: `${cobertura}%` }} />
                  </div>
                </div>

                <div className="space-y-2">
                  {(['acima', 'no', 'abaixo', 'sem'] as StatusDist[]).map(s => {
                    const count = habilidadesReport.filter(r => r.status === s).length;
                    return (
                      <div key={s} className="flex items-center justify-between text-sm">
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${STATUS_BADGE[s]}`}>
                          {STATUS_LABEL[s]}
                        </span>
                        <span className="font-semibold text-gray-700">{count}</span>
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-gray-400 mt-4">
                  {total} habilidades na matriz — {cargoSelecionado?.area}
                </p>
              </div>

              {/* Radar */}
              <div className="lg:col-span-3 bg-white border border-gray-200 rounded-lg p-5">
                <p className="text-sm font-semibold text-gray-700 mb-0.5">
                  João vs. {cargoSelecionado?.nome}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  % de habilidades por competência cobertas (Cargo = 100%)
                </p>
                {radarData.length > 0 ? (
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
                ) : (
                  <div className="h-48 flex items-center justify-center text-sm text-gray-400">
                    Dados insuficientes para o radar
                  </div>
                )}
              </div>
            </div>

            {/* Top 5 Gaps */}
            {top5Gaps.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <p className="text-base font-semibold text-gray-900 mb-1">
                  Top {top5Gaps.length} maiores gaps
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Habilidades com maior esforço de desenvolvimento para chegar ao cargo benchmark.
                </p>
                <div className="space-y-3">
                  {top5Gaps.map((r, idx) => (
                    <div key={r.habilidadeId} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-gray-800">{r.nome}</p>
                          {r.isNova && (
                            <Badge className="bg-purple-100 text-purple-700 border border-purple-200 text-xs font-medium hover:bg-purple-100">
                              Habilidade nova
                            </Badge>
                          )}
                        </div>
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

            {/* Todas as habilidades */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <p className="text-base font-semibold text-gray-900 mb-4">
                Todas as habilidades — {cargoSelecionado?.nome}
              </p>
              <div className="space-y-2">
                {habilidadesReport.map(r => (
                  <div
                    key={r.habilidadeId}
                    className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-800 font-medium">{r.nome}</span>
                        {r.isNova && (
                          <Badge className="bg-purple-100 text-purple-700 border border-purple-200 text-xs font-medium hover:bg-purple-100">
                            Habilidade nova
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{r.competencia}</span>
                    </div>
                    <div className="text-xs text-gray-500 shrink-0 text-right w-36">
                      <span>{r.nivelAtual ?? '—'}</span>
                      <span className="text-gray-300 mx-1">→</span>
                      <span className="font-medium text-gray-700">{r.nivelEsperado}</span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border shrink-0 ${STATUS_BADGE[r.status]}`}>
                      {STATUS_LABEL[r.status]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="flex items-start gap-3 p-4 bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg">
              <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                O Benchmark Mode compara o perfil de João com cargos de referência fora da sua
                jornada atual. O badge{' '}
                <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                  Habilidade nova
                </span>{' '}
                indica habilidades exigidas pelo cargo que ainda não existiam no sistema quando João
                foi avaliado — temporário até a próxima avaliação.
              </p>
            </div>
          </>
        )}

      </div>
    </main>
  );
}
