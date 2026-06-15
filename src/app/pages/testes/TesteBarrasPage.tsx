import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router';
import { ChevronDown, ChevronRight, FlaskConical, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import {
  habilidadesData,
  avaliacoesColaboradoresData,
  niveisDefaultData,
  joaoHabilidadesCargoMatriz,
  benchmarkCargosData,
  habilidadesCargoDataBenchmark,
} from '../../data/mockData';

const JOAO_ID = '10';
const MAX_PESO = Math.max(...niveisDefaultData.map(n => n.peso));

type TipoFiltro = 'Técnica' | 'Comportamental' | 'Ambas';
type Status = 'acima' | 'no' | 'abaixo' | 'sem';
type OutletContext = { isSidebarCollapsed: boolean; viewMode: 'admin' | 'colaborador' };

function pesoNivel(nome: string): number {
  return niveisDefaultData.find(n => n.nome === nome)?.peso ?? 0;
}

function getStatus(nivelAtual: string | null, nivelEsperado: string): Status {
  if (!nivelAtual) return 'sem';
  const pa = pesoNivel(nivelAtual);
  const pe = pesoNivel(nivelEsperado);
  if (pa > pe) return 'acima';
  if (pa === pe) return 'no';
  return 'abaixo';
}

const STATUS_LABEL: Record<Status, string> = {
  acima: 'Acima do esperado',
  no: 'No esperado',
  abaixo: 'Abaixo do esperado',
  sem: 'Sem avaliação',
};

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

export default function TesteBarrasPage() {
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();
  const [tipoFiltro, setTipoFiltro] = useState<TipoFiltro>('Ambas');
  const [busca, setBusca] = useState('');
  const [colapsados, setColapsados] = useState<Set<string>>(new Set());

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

  const joaoAvs = useMemo(
    () => avaliacoesColaboradoresData.filter(a => a.colaboradorId === JOAO_ID),
    [],
  );
  const mapaJoao = useMemo(() => new Map(joaoAvs.map(a => [a.habilidadeId, a.nivelAtual])), [joaoAvs]);

  const activeMatrix = useMemo(() => {
    if (!cargoId) return joaoHabilidadesCargoMatriz;
    return habilidadesCargoDataBenchmark.filter(h => h.cargoId === cargoId);
  }, [cargoId]);

  const habilidadesNaMatriz = useMemo(() => new Set(activeMatrix.map(m => m.habilidadeId)), [activeMatrix]);

  const universo = useMemo(() => {
    const ids = new Set([
      ...activeMatrix.map(m => m.habilidadeId),
      ...joaoAvs.map(a => a.habilidadeId),
    ]);
    return habilidadesData
      .filter(h => ids.has(h.id))
      .filter(h => tipoFiltro === 'Ambas' || h.tipo === tipoFiltro)
      .filter(h => !busca || h.nome.toLowerCase().includes(busca.toLowerCase()));
  }, [activeMatrix, joaoAvs, tipoFiltro, busca]);

  const porCompetencia = useMemo(() => {
    const map = new Map<string, typeof universo>();
    for (const h of universo) {
      if (!map.has(h.competencia)) map.set(h.competencia, []);
      map.get(h.competencia)!.push(h);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [universo]);

  function toggleColapso(comp: string) {
    setColapsados(prev => {
      const next = new Set(prev);
      if (next.has(comp)) next.delete(comp); else next.add(comp);
      return next;
    });
  }

  const cargoNome = useMemo(() => {
    if (!cargoId) return 'Cargo atual (padrão)';
    return benchmarkCargosData.find(c => c.id === cargoId)?.nome ?? '';
  }, [cargoId]);

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
          <h1 className="text-2xl font-semibold text-gray-900">Barras por Habilidade</h1>
          <p className="text-sm text-gray-500 mt-1">
            João Silva — nível atual vs. exigido por competência
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
          {/* Tipo */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Tipo:</span>
            {(['Ambas', 'Técnica', 'Comportamental'] as TipoFiltro[]).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTipoFiltro(t)}
                className={`px-3 py-1.5 text-sm rounded-full font-medium transition-colors ${
                  tipoFiltro === t
                    ? 'bg-[var(--brand-600)] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar habilidade..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-300)] w-52"
            />
          </div>

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

        {/* Legenda */}
        <div className="flex flex-wrap gap-3">
          {(['acima', 'no', 'abaixo', 'sem'] as Status[]).map(s => (
            <span
              key={s}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${STATUS_BADGE[s]}`}
            >
              {STATUS_LABEL[s]}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border bg-purple-100 text-purple-700 border-purple-200">
            Habilidade nova
          </span>
        </div>

        {/* Conteúdo por competência */}
        {porCompetencia.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-sm text-gray-500">
            Nenhuma habilidade encontrada para os filtros selecionados.
          </div>
        ) : (
          <div className="space-y-3">
            {porCompetencia.map(([competencia, habs]) => {
              const isColapsado = colapsados.has(competencia);
              return (
                <div key={competencia} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  {/* Header da competência */}
                  <button
                    type="button"
                    onClick={() => toggleColapso(competencia)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {isColapsado
                        ? <ChevronRight className="w-4 h-4 text-gray-400" />
                        : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      <span className="text-sm font-semibold text-gray-900">{competencia}</span>
                      <span className="text-xs text-gray-400 font-normal">({habs.length})</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {habs[0]?.tipo}
                    </span>
                  </button>

                  {/* Linhas de habilidade */}
                  {!isColapsado && (
                    <div className="divide-y divide-gray-100 border-t border-gray-100">
                      {habs.map(hab => {
                        const nivelAtual = mapaJoao.get(hab.id) ?? null;
                        const matrizEntry = activeMatrix.find(m => m.habilidadeId === hab.id);
                        const nivelEsperado = matrizEntry?.nivelEsperado ?? null;
                        const status: Status = nivelEsperado
                          ? getStatus(nivelAtual, nivelEsperado)
                          : nivelAtual ? 'no' : 'sem';

                        const pesoAtual = nivelAtual ? pesoNivel(nivelAtual) : 0;
                        const pesoEsperado = nivelEsperado ? pesoNivel(nivelEsperado) : 0;
                        const pctAtual = Math.round((pesoAtual / MAX_PESO) * 100);
                        const pctEsperado = nivelEsperado ? Math.round((pesoEsperado / MAX_PESO) * 100) : 0;

                        // Badge "Habilidade nova": ID >= 50 E na matriz E sem avaliação
                        const isNova = parseInt(hab.id) >= 50 && habilidadesNaMatriz.has(hab.id) && !nivelAtual;

                        return (
                          <div key={hab.id} className="px-4 py-3">
                            {/* Nome + badges */}
                            <div className="flex items-center flex-wrap gap-2 mb-2">
                              <span className="text-sm text-gray-800 font-medium">{hab.nome}</span>
                              {nivelEsperado && (
                                <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${STATUS_BADGE[status]}`}>
                                  {STATUS_LABEL[status]}
                                </span>
                              )}
                              {isNova && (
                                <Badge className="bg-purple-100 text-purple-700 border border-purple-200 text-xs font-medium hover:bg-purple-100">
                                  Habilidade nova
                                </Badge>
                              )}
                            </div>

                            {/* Barras */}
                            <div className="space-y-1.5">
                              {/* Barra João — label direito = nome do nível */}
                              <div className="flex items-center gap-2">
                                <span className="w-28 text-xs text-gray-500 shrink-0">
                                  {nivelAtual ?? 'Sem avaliação'}
                                </span>
                                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all ${STATUS_BAR[status]}`}
                                    style={{ width: `${pctAtual}%` }}
                                  />
                                </div>
                                <span className={`w-24 text-xs text-right shrink-0 ${nivelAtual ? 'font-medium text-gray-700' : 'text-gray-400'}`}>
                                  {nivelAtual ?? '—'}
                                </span>
                              </div>

                              {/* Barra cargo (só se houver referência) */}
                              {nivelEsperado && (
                                <div className="flex items-center gap-2">
                                  <span className="w-28 text-xs text-gray-400 shrink-0">
                                    {nivelEsperado} <span className="text-gray-300">(ref.)</span>
                                  </span>
                                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-gray-300 border-r-2 border-gray-400"
                                      style={{ width: `${pctEsperado}%` }}
                                    />
                                  </div>
                                  <span className="w-24 text-xs text-gray-400 text-right shrink-0">
                                    {nivelEsperado}
                                  </span>
                                </div>
                              )}

                              {/* Cargo sem esta habilidade na matriz */}
                              {cargoId && !nivelEsperado && (
                                <p className="text-xs text-gray-400 italic">
                                  Não exigida pelo cargo — habilidade extra de João
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Legenda de escala */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-wrap gap-4 text-xs text-gray-500">
          <span className="font-medium text-gray-700">Escala de barras:</span>
          {niveisDefaultData.map(n => (
            <span key={n.id}>
              {n.nome} = {Math.round((n.peso / MAX_PESO) * 100)}%
            </span>
          ))}
          <span className="ml-auto text-gray-400">Referência: {cargoNome}</span>
        </div>

      </div>
    </main>
  );
}
