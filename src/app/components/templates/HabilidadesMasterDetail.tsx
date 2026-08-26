import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Check } from 'lucide-react';
import { getCompetenciaNome } from '../../data/mockData';
import { useCompetencias } from '../../context/CompetenciasContext';

export interface HabilidadeItem {
  id: string;
  nome: string;
  tipo: 'Técnica' | 'Comportamental';
  competencia: string;
  competenciaId: string;
}

interface HabilidadesMasterDetailProps {
  habilidades: HabilidadeItem[];
  checked: Set<string>;
  onChange: (next: Set<string>) => void;
  /** Altura da área de busca+colunas — o container pai controla o scroll externo (wizard) ou fornece h-full (modal). */
  className?: string;
  autoFocusBusca?: boolean;
  /** IDs que devem aparecer no topo da lista dentro de cada competência (ex: habilidades vindas da matriz da jornada). Não reordena a cada clique — fixo pela origem do dado, não pelo estado ao vivo de `checked`. */
  prioridade?: Set<string>;
}

// Corpo master-detail (busca + segmented control + duas colunas
// competência/habilidades) — extraído de HabilidadesSelectionModal.tsx para
// ser reembalado em 2 lugares: dentro do próprio modal (chrome de
// header/footer) e dentro da Etapa "Escopo" do wizard de avaliação
// (FormularioAvaliacao), sem chrome nenhum — o
// container pai decide layout/scroll externo.
export function HabilidadesMasterDetail({
  habilidades,
  checked,
  onChange,
  className = '',
  autoFocusBusca = false,
  prioridade,
}: HabilidadesMasterDetailProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<'todas' | 'Técnica' | 'Comportamental'>('todas');
  const [competenciaSelecionada, setCompetenciaSelecionada] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const { competencias } = useCompetencias();

  useEffect(() => {
    if (autoFocusBusca) searchRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isModosBusca = searchTerm.trim().length > 0;

  const habilidadesPorCompetencia = useMemo(() => {
    const grupos: Record<string, HabilidadeItem[]> = {};
    habilidades.forEach((hab) => {
      if (!grupos[hab.competenciaId]) grupos[hab.competenciaId] = [];
      grupos[hab.competenciaId].push(hab);
    });
    return grupos;
  }, [habilidades]);

  const competenciasFiltradas = useMemo(() => {
    const cats = new Set<string>();
    habilidades.forEach((h) => {
      if (tipoFiltro === 'todas' || h.tipo === tipoFiltro) cats.add(h.competenciaId);
    });
    return Array.from(cats).sort();
  }, [habilidades, tipoFiltro]);

  const competenciaEfetiva = useMemo(
    () =>
      competenciasFiltradas.includes(competenciaSelecionada)
        ? competenciaSelecionada
        : (competenciasFiltradas[0] ?? ''),
    [competenciasFiltradas, competenciaSelecionada]
  );

  // Coloca as habilidades de `prioridade` no topo de cada lista (ex: as que
  // vieram pré-marcadas da matriz da jornada) — ordem estável, então quem
  // não está na prioridade mantém a ordem relativa entre si.
  const ordenarComPrioridade = (lista: HabilidadeItem[]): HabilidadeItem[] => {
    if (!prioridade || prioridade.size === 0) return lista;
    return [...lista].sort((a, b) => Number(prioridade.has(b.id)) - Number(prioridade.has(a.id)));
  };

  const habilidadesCompetenciaAtiva = useMemo(() => {
    const habs = habilidadesPorCompetencia[competenciaEfetiva] || [];
    const filtradas = tipoFiltro === 'todas' ? habs : habs.filter((h) => h.tipo === tipoFiltro);
    return ordenarComPrioridade(filtradas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habilidadesPorCompetencia, competenciaEfetiva, tipoFiltro, prioridade]);

  const resultadosBusca = useMemo(() => {
    if (!isModosBusca) return {} as Record<string, HabilidadeItem[]>;
    const termo = searchTerm.toLowerCase();
    const grupos: Record<string, HabilidadeItem[]> = {};
    habilidades.forEach((hab) => {
      if (tipoFiltro !== 'todas' && hab.tipo !== tipoFiltro) return;
      if (!hab.nome.toLowerCase().includes(termo)) return;
      if (!grupos[hab.competenciaId]) grupos[hab.competenciaId] = [];
      grupos[hab.competenciaId].push(hab);
    });
    Object.keys(grupos).forEach((comp) => { grupos[comp] = ordenarComPrioridade(grupos[comp]); });
    return grupos;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habilidades, searchTerm, tipoFiltro, isModosBusca, prioridade]);

  const competenciasComBusca = useMemo(() => Object.keys(resultadosBusca).sort(), [resultadosBusca]);
  const competenciasEsquerda = isModosBusca ? competenciasComBusca : competenciasFiltradas;

  const toggle = (id: string) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(next);
  };

  const toggleGrupoAtivo = () => {
    const todasMarcadas = habilidadesCompetenciaAtiva.every((h) => checked.has(h.id));
    const next = new Set(checked);
    habilidadesCompetenciaAtiva.forEach((h) => {
      if (todasMarcadas) next.delete(h.id);
      else next.add(h.id);
    });
    onChange(next);
  };

  const handleSelectCompetencia = (comp: string) => {
    setSearchTerm('');
    setCompetenciaSelecionada(comp);
  };

  const renderHabilidade = (hab: HabilidadeItem) => {
    const isChecked = checked.has(hab.id);
    return (
      <div
        key={hab.id}
        onClick={() => toggle(hab.id)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
          isChecked ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
        }`}
      >
        <div
          className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
            isChecked ? 'bg-[var(--brand-600)] border-[var(--brand-600)]' : 'border-gray-300 bg-white'
          }`}
        >
          {isChecked && <Check className="w-3 h-3 text-white" />}
        </div>
        <span className="flex-1 text-sm text-gray-900">{hab.nome}</span>
      </div>
    );
  };

  const todasMarcadasNaCompAtiva =
    habilidadesCompetenciaAtiva.length > 0 &&
    habilidadesCompetenciaAtiva.every((h) => checked.has(h.id));

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Busca + Segmented control */}
      <div className="flex items-center gap-3 pb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Buscar habilidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent outline-none bg-white"
          />
        </div>
        <div className="flex-shrink-0 flex items-center bg-gray-100 rounded-lg p-1">
          {(['todas', 'Técnica', 'Comportamental'] as const).map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => setTipoFiltro(tipo)}
              className={`px-3 py-1.5 text-sm font-normal rounded-md transition-all whitespace-nowrap ${
                tipoFiltro === tipo ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tipo === 'todas' ? 'Todas' : tipo}
            </button>
          ))}
        </div>
      </div>

      {/* Corpo — duas colunas */}
      <div className="flex flex-1 min-h-0 border border-gray-200 rounded-lg overflow-hidden">
        <div className="w-56 flex-shrink-0 border-r border-gray-200 overflow-y-auto">
          {competenciasEsquerda.map((comp) => {
            const habsNaComp = (habilidadesPorCompetencia[comp] || []).filter(
              (h) => tipoFiltro === 'todas' || h.tipo === tipoFiltro
            );
            const marcadasNoGrupo = habsNaComp.filter((h) => checked.has(h.id)).length;
            const isActive = !isModosBusca && comp === competenciaEfetiva;
            return (
              <div
                key={comp}
                onClick={() => handleSelectCompetencia(comp)}
                className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer border-l-2 transition-colors ${
                  isActive
                    ? 'bg-[var(--brand-50)] text-[var(--brand-700)] border-[var(--brand-600)] font-medium'
                    : 'text-gray-700 hover:bg-gray-50 border-transparent'
                }`}
              >
                <span className="flex-1 truncate">{getCompetenciaNome(comp, competencias)}</span>
                <span
                  className={`text-xs tabular-nums flex-shrink-0 ml-2 ${
                    marcadasNoGrupo > 0 ? 'text-[var(--brand-600)] font-medium' : 'text-gray-400'
                  }`}
                >
                  {marcadasNoGrupo > 0 ? `${marcadasNoGrupo}/${habsNaComp.length}` : habsNaComp.length}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isModosBusca ? (
            competenciasComBusca.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700">Nenhuma habilidade encontrada</p>
                <p className="text-sm text-gray-400 mt-1">Tente outros termos</p>
              </div>
            ) : (
              <div className="space-y-4">
                {competenciasComBusca.map((comp) => (
                  <div key={comp}>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                      {getCompetenciaNome(comp, competencias)}
                    </p>
                    <div className="space-y-0.5">{resultadosBusca[comp].map(renderHabilidade)}</div>
                  </div>
                ))}
              </div>
            )
          ) : competenciaEfetiva ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {getCompetenciaNome(competenciaEfetiva, competencias)}
                </p>
                {habilidadesCompetenciaAtiva.length > 0 && (
                  <button
                    type="button"
                    onClick={toggleGrupoAtivo}
                    className="text-xs font-medium text-[var(--brand-600)] hover:text-[var(--brand-700)]"
                  >
                    {todasMarcadasNaCompAtiva ? 'Limpar seleção' : 'Selecionar todas'}
                  </button>
                )}
              </div>
              <div className="space-y-0.5">{habilidadesCompetenciaAtiva.map(renderHabilidade)}</div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-sm text-gray-400">Nenhuma habilidade disponível</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
