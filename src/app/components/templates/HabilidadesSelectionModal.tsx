import { useState, useMemo, useEffect, useRef } from 'react';
import { X, Search, Check } from 'lucide-react';
import { getCompetenciaNome } from '../../data/mockData';

export interface HabilidadeItem {
  id: string;
  nome: string;
  tipo: 'Técnica' | 'Comportamental';
  competencia: string;
  competenciaId: string;
}

interface HabilidadesSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  habilidades: HabilidadeItem[];
  habilidadesAdicionadas?: string[];
  onConfirm: (toAdd: string[], toRemove: string[]) => void;
}

export function HabilidadesSelectionModal({
  isOpen,
  onClose,
  habilidades,
  habilidadesAdicionadas = [],
  onConfirm,
}: HabilidadesSelectionModalProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<'todas' | 'Técnica' | 'Comportamental'>('todas');
  const [competenciaSelecionada, setCompetenciaSelecionada] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const isModosBusca = searchTerm.trim().length > 0;

  useEffect(() => {
    if (isOpen) {
      setChecked(new Set(habilidadesAdicionadas));
      setSearchTerm('');
      setTipoFiltro('todas');
      setCompetenciaSelecionada('');
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Deriva a competência efetiva sem precisar de useEffect extra
  const competenciaEfetiva = useMemo(
    () =>
      competenciasFiltradas.includes(competenciaSelecionada)
        ? competenciaSelecionada
        : (competenciasFiltradas[0] ?? ''),
    [competenciasFiltradas, competenciaSelecionada]
  );

  const habilidadesCompetenciaAtiva = useMemo(() => {
    const habs = habilidadesPorCompetencia[competenciaEfetiva] || [];
    return tipoFiltro === 'todas' ? habs : habs.filter((h) => h.tipo === tipoFiltro);
  }, [habilidadesPorCompetencia, competenciaEfetiva, tipoFiltro]);

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
    return grupos;
  }, [habilidades, searchTerm, tipoFiltro, isModosBusca]);

  const competenciasComBusca = useMemo(() => Object.keys(resultadosBusca).sort(), [resultadosBusca]);

  const toggle = (id: string) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setChecked(next);
  };

  const toggleGrupoAtivo = () => {
    const todasMarcadas = habilidadesCompetenciaAtiva.every((h) => checked.has(h.id));
    const next = new Set(checked);
    habilidadesCompetenciaAtiva.forEach((h) => {
      if (todasMarcadas) next.delete(h.id);
      else next.add(h.id);
    });
    setChecked(next);
  };

  const toAdd = useMemo(
    () => Array.from(checked).filter((id) => !habilidadesAdicionadas.includes(id)),
    [checked, habilidadesAdicionadas]
  );
  const toRemove = useMemo(
    () => habilidadesAdicionadas.filter((id) => !checked.has(id)),
    [checked, habilidadesAdicionadas]
  );

  const hasChanges = toAdd.length > 0 || toRemove.length > 0;

  const handleConfirm = () => {
    onConfirm(toAdd, toRemove);
    onClose();
  };

  const handleSelectCompetencia = (comp: string) => {
    setSearchTerm('');
    setCompetenciaSelecionada(comp);
  };

  const renderHabilidade = (hab: HabilidadeItem) => {
    const isChecked = checked.has(hab.id);
    const eraAdicionada = habilidadesAdicionadas.includes(hab.id);
    const marcadaParaRemover = eraAdicionada && !isChecked;

    return (
      <div
        key={hab.id}
        onClick={() => toggle(hab.id)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
          marcadaParaRemover
            ? 'bg-red-50 hover:bg-red-100'
            : isChecked
            ? 'bg-blue-50 hover:bg-blue-100'
            : 'hover:bg-gray-50'
        }`}
      >
        <div
          className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
            marcadaParaRemover
              ? 'border-red-300 bg-white'
              : isChecked
              ? 'bg-[var(--brand-600)] border-[var(--brand-600)]'
              : 'border-gray-300 bg-white'
          }`}
        >
          {isChecked && <Check className="w-3 h-3 text-white" />}
        </div>
        <span className={`flex-1 text-sm ${marcadaParaRemover ? 'text-red-500 line-through' : 'text-gray-900'}`}>
          {hab.nome}
        </span>
        {marcadaParaRemover && (
          <span className="text-xs font-medium text-red-400 flex-shrink-0">Será removida</span>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  const todasMarcadasNaCompAtiva =
    habilidadesCompetenciaAtiva.length > 0 &&
    habilidadesCompetenciaAtiva.every((h) => checked.has(h.id));

  const competenciasEsquerda = isModosBusca ? competenciasComBusca : competenciasFiltradas;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/35" onClick={onClose} />
      <div
        className="relative bg-white rounded-lg shadow-2xl flex flex-col w-full max-w-3xl h-[80vh] max-h-[720px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Gerenciar habilidades</h2>
            <p className="text-sm text-gray-500 mt-0.5">Marque as habilidades que devem estar na matriz</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Busca + Segmented control */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-200">
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
                  tipoFiltro === tipo
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tipo === 'todas' ? 'Todas' : tipo}
              </button>
            ))}
          </div>
        </div>

        {/* Corpo — duas colunas */}
        <div className="flex flex-1 overflow-hidden">
          {/* Coluna esquerda */}
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
                    <span className="flex-1 truncate">{getCompetenciaNome(comp)}</span>
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

          {/* Coluna direita */}
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
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">{getCompetenciaNome(comp)}</p>
                      <div className="space-y-0.5">
                        {resultadosBusca[comp].map(renderHabilidade)}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : competenciaEfetiva ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {getCompetenciaNome(competenciaEfetiva)}
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
                <div className="space-y-0.5">
                  {habilidadesCompetenciaAtiva.map(renderHabilidade)}
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            {checked.size === 0
              ? 'Nenhuma habilidade selecionada'
              : checked.size === 1
              ? '1 habilidade selecionada'
              : `${checked.size} habilidades selecionadas`}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!hasChanges}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                !hasChanges
                  ? 'bg-[var(--brand-600)] text-white opacity-50 cursor-not-allowed'
                  : 'bg-[var(--brand-600)] text-white hover:bg-[var(--brand-700)]'
              }`}
            >
              {toAdd.length > 0 && toRemove.length === 0 ? 'Adicionar habilidades' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
