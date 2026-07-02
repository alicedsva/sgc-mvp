import { useState, useMemo, useEffect, useCallback, type ReactElement } from 'react';
import { useOutletContext } from 'react-router';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Info, Target } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  habilidadesData,
  getHabilidadesAvaliadasColaborador,
  niveisDefaultData,
  benchmarkCargosData,
  habilidadesCargoDataBenchmark,
  joaoHabilidadesCargoMatriz,
} from '../../data/mockData';

const JOAO_ID = '10';
const MAX_PESO = Math.max(...niveisDefaultData.map(n => n.peso));
const MAX_SELECIONADAS = 10;
const COR_TECNICA        = 'var(--brand-600)';
const COR_COMPORTAMENTAL = '#9333ea';
const COR_REFERENCIA     = '#94a3b8';

type TipoFiltro = 'Técnica' | 'Comportamental';
type OutletContext = { isSidebarCollapsed: boolean; viewMode: 'admin' | 'colaborador' };

type CompetenciaItem = {
  nome: string;
  pesoJoao: number | null;
  pesoCargo: number;
  gap: number | null;
};

function pesoNivel(nome: string): number {
  return niveisDefaultData.find(n => n.nome === nome)?.peso ?? 0;
}

function truncar(nome: string): string {
  return nome.length > 22 ? `${nome.slice(0, 20)}…` : nome;
}

type MatrizEntry = { habilidadeId: string; nivelEsperado: string };
type RadarEntry  = Record<string, string | number>;

function RadarSection({
  data,
  comCargo,
  joaoCor,
  tooltipContent,
}: {
  data: RadarEntry[];
  comCargo: boolean;
  joaoCor: string;
  tooltipContent: (props: any) => ReactElement | null;
}) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-32">
        <Target className="w-8 h-8 text-gray-300" />
        <p className="text-sm text-gray-500">Selecione competências no painel ao lado para visualizar seu radar</p>
      </div>
    );
  }
  return (
    <div>
      <ResponsiveContainer width="100%" height={340}>
        <RadarChart data={data}>
          <PolarGrid gridType="polygon" />
          <PolarAngleAxis dataKey="competencia" tick={{ fontSize: 10, fill: '#6b7280' }} />
          <PolarRadiusAxis domain={[0, MAX_PESO]} tick={false} axisLine={false} />
          <Tooltip content={tooltipContent} />
          <Radar
            name="João"
            dataKey="João"
            fill={joaoCor}
            fillOpacity={0.15}
            stroke={joaoCor}
            strokeWidth={2}
          />
          {comCargo && (
            <Radar
              name="Cargo"
              dataKey="Cargo"
              fill={COR_REFERENCIA}
              fillOpacity={0.1}
              stroke={COR_REFERENCIA}
              strokeWidth={1.5}
              strokeDasharray="4 2"
            />
          )}
        </RadarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: joaoCor }}
          />
          <span className="text-xs text-gray-600 font-normal">João</span>
        </div>
        {comCargo && (
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: COR_REFERENCIA }}
            />
            <span className="text-xs text-gray-600 font-normal">Cargo de referência</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TesteRadarPage() {
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>('Técnica');

  const [selectedArea,        setSelectedArea]        = useState('Tecnologia');
  const [selectedCargoBase,   setSelectedCargoBase]   = useState('Desenvolvedor');
  const [selectedSenioridade, setSelectedSenioridade] = useState('Pleno');
  const [competenciasSelecionadas, setCompetenciasSelecionadas] = useState<Set<string>>(new Set());

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

  const activeMatrix = useMemo<MatrizEntry[]>(
    () => {
      if (!cargoId) return [];
      if (cargoId === 'CARGO_ATUAL') return joaoHabilidadesCargoMatriz;
      return habilidadesCargoDataBenchmark.filter(h => h.cargoId === cargoId);
    },
    [cargoId],
  );

  const comCargo = !!cargoId;

  // Cálculo central: mapas de João, cargo e dados para tooltip
  const computedMaps = useMemo(() => {
    const mapCargoAll   = new Map<string, { soma: number; count: number }>();
    const mapJoaoAll    = new Map<string, { soma: number; count: number }>();
    const tooltipAbaixo = new Map<string, number>();

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

    return { mapCargoAll, mapJoaoAll, tooltipAbaixo };
  }, [mapaJoao, activeMatrix, tipoFiltro]);

  // Lista de competências ordenada por gap para o painel lateral
  const listaCompetencias = useMemo<CompetenciaItem[]>(() => {
    const { mapCargoAll, mapJoaoAll } = computedMaps;
    const todasComps = new Set([...mapCargoAll.keys(), ...mapJoaoAll.keys()]);

    const items: CompetenciaItem[] = Array.from(todasComps).map(nome => {
      const joaoEntry  = mapJoaoAll.get(nome);
      const cargoEntry = mapCargoAll.get(nome);
      const pesoJoao   = joaoEntry  ? joaoEntry.soma  / joaoEntry.count  : null;
      const pesoCargo  = cargoEntry ? cargoEntry.soma / cargoEntry.count : 0;
      const gap        = pesoJoao !== null ? pesoCargo - pesoJoao : null;
      return { nome, pesoJoao, pesoCargo, gap };
    });

    return items.sort((a, b) => {
      const aPos = a.gap !== null && a.gap > 0;
      const bPos = b.gap !== null && b.gap > 0;
      const aNeg = a.gap !== null && a.gap <= 0;
      const bNeg = b.gap !== null && b.gap <= 0;
      if (aPos && bPos) return b.gap! - a.gap!;
      if (aPos) return -1;
      if (bPos) return 1;
      if (aNeg && bNeg) return a.nome.localeCompare(b.nome);
      if (aNeg) return -1;
      if (bNeg) return 1;
      return a.nome.localeCompare(b.nome);
    });
  }, [computedMaps]);

  // Reset automático ao trocar cargo ou tipo: seleciona as 10 de maior gap
  useEffect(() => {
    setCompetenciasSelecionadas(
      new Set(listaCompetencias.slice(0, MAX_SELECIONADAS).map(c => c.nome)),
    );
  }, [listaCompetencias]);

  // Dados do radar filtrados pelas competências selecionadas
  const radarData = useMemo<RadarEntry[]>(() => {
    const { mapCargoAll, mapJoaoAll } = computedMaps;
    return Array.from(competenciasSelecionadas)
      .map(nome => {
        const joaoEntry  = mapJoaoAll.get(nome);
        const cargoEntry = mapCargoAll.get(nome);
        const entry: RadarEntry = {
          competencia: truncar(nome),
          fullName: nome,
          'João': joaoEntry ? joaoEntry.soma / joaoEntry.count : 0,
        };
        if (comCargo) {
          entry['Cargo'] = cargoEntry ? cargoEntry.soma / cargoEntry.count : 0;
        }
        return entry;
      })
      .sort((a, b) => String(a.competencia).localeCompare(String(b.competencia)));
  }, [computedMaps, competenciasSelecionadas, comCargo]);

  // Tooltip via closure sobre computedMaps — renderTooltip passado como prop para RadarSection
  const renderTooltip = useCallback((props: any) => {
    const { active, payload } = props;
    if (!active || !payload?.length) return null;
    const fullName = payload[0]?.payload?.fullName as string | undefined;
    if (!fullName) return null;
    const naoAvaliado = !computedMaps.mapJoaoAll.has(fullName);
    const count = computedMaps.tooltipAbaixo.get(fullName) ?? 0;
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2">
        <p className="text-xs font-medium text-gray-900">{fullName}</p>
        {naoAvaliado ? (
          <p className="text-xs text-gray-500 mt-0.5">Não avaliado nesta competência</p>
        ) : (
          <p className="text-xs text-gray-500 mt-0.5">
            {count === 0
              ? 'Nenhuma habilidade abaixo do esperado'
              : `${count} habilidade${count > 1 ? 's' : ''} abaixo do esperado`}
          </p>
        )}
      </div>
    );
  }, [computedMaps]);

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

  const joaoCor = tipoFiltro === 'Técnica' ? COR_TECNICA : COR_COMPORTAMENTAL;

  return (
    <main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
      <div className="p-4 md:p-8 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Radar de Competências</h1>
          <p className="text-sm text-gray-500 mt-1">
            Acompanhe sua evolução e o que precisa desenvolver para chegar onde quer
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">

          {/* Tipo */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Tipo:</span>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {(['Técnica', 'Comportamental'] as TipoFiltro[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTipoFiltro(t)}
                  className={`px-3 py-2 text-sm font-normal rounded-md transition-all whitespace-nowrap ${
                    tipoFiltro === t
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Dropdown Gerência */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Gerência:</span>
            <Select value={selectedArea} onValueChange={handleSelectArea}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Selecionar gerência" />
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

        {/* Nota informativa */}
        {comCargo && (
          <div className="flex items-start gap-3 p-4 bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg">
            <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700">
              O radar mostra seu nível médio por competência. Selecione um cargo de referência para comparar seu perfil e identificar onde estão seus maiores gaps de desenvolvimento.
            </p>
          </div>
        )}

        {/* Radar + Painel lateral */}
        <div className="flex gap-6 items-stretch">

          {/* Radar card */}
          <div className="w-[60%] flex-shrink-0 h-[480px] overflow-hidden flex flex-col justify-center bg-white border border-gray-200 rounded-lg p-6">
            <RadarSection
              data={radarData}
              comCargo={comCargo}
              joaoCor={joaoCor}
              tooltipContent={renderTooltip}
            />
          </div>

          {/* Painel lateral de competências */}
          <div className="w-[40%] flex-shrink-0 h-[480px] flex flex-col bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Competências</p>
                <button
                  type="button"
                  onClick={() => setCompetenciasSelecionadas(new Set())}
                  className="text-xs text-[var(--brand-600)] hover:underline"
                >
                  Limpar seleção
                </button>
              </div>
              <p className="text-xs mt-0.5 text-gray-500">
                {competenciasSelecionadas.size} / {MAX_SELECIONADAS} selecionadas
              </p>
            </div>

            <div className="mt-3 space-y-1 flex-1 overflow-y-auto">
              {listaCompetencias.map(item => {
                const marcado  = competenciasSelecionadas.has(item.nome);
                const limitado = !marcado && competenciasSelecionadas.size >= MAX_SELECIONADAS;
                return (
                  <button
                    key={item.nome}
                    type="button"
                    onClick={() => handleToggleCompetencia(item.nome)}
                    disabled={limitado}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                      marcado
                        ? 'bg-[var(--brand-50)]'
                        : limitado
                        ? 'opacity-40 cursor-not-allowed'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Checkbox */}
                    <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                      marcado
                        ? 'border-[var(--brand-600)] bg-[var(--brand-600)]'
                        : limitado
                        ? 'border-gray-200 bg-gray-100'
                        : 'border-gray-300'
                    }`}>
                      {marcado && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                          <path
                            d="M1.5 5L4 7.5L8.5 2.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className="flex items-center justify-between flex-1 min-w-0 gap-2">
                      <span className={`text-xs font-medium truncate ${
                        marcado ? 'text-gray-900' : limitado ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {item.nome}
                      </span>
                      <span className={`text-xs shrink-0 ${
                        item.gap === null ? 'text-slate-400'
                        : item.gap > 0    ? 'text-red-500'
                        : 'text-green-600'
                      }`}>
                        {item.gap === null ? 'Não mapeado'
                          : item.gap > 0  ? 'Abaixo do esperado'
                          : item.gap < 0  ? 'Acima do esperado'
                          : 'No esperado'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>


      </div>
    </main>
  );
}
