import { useState, useMemo, useEffect, useRef } from 'react';
import { X, Search, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export interface HabilidadeItem {
  id: string;
  nome: string;
  tipo: 'Técnica' | 'Comportamental';
  competencia: string;
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
  // checked = todas que devem estar na matriz após salvar
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<'todas' | 'Técnica' | 'Comportamental'>('todas');
  const [competenciaFiltro, setCompetenciaFiltro] = useState('todas');
  const searchRef = useRef<HTMLInputElement>(null);

  // Inicializa com as já adicionadas marcadas
  useEffect(() => {
    if (isOpen) {
      setChecked(new Set(habilidadesAdicionadas));
      setSearchTerm('');
      setTipoFiltro('todas');
      setCompetenciaFiltro('todas');
      setCollapsedGroups(new Set());
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Agrupar por competência
  const habilidadesPorCompetencia = useMemo(() => {
    const grupos: Record<string, HabilidadeItem[]> = {};
    habilidades.forEach((hab) => {
      if (!grupos[hab.competencia]) grupos[hab.competencia] = [];
      grupos[hab.competencia].push(hab);
    });
    return grupos;
  }, [habilidades]);

  // Lista de competências para o dropdown (todas, sem filtro)
  const todasCompetencias = useMemo(() => {
    const cats = new Set(habilidades.map((h) => h.competencia));
    return Array.from(cats).sort();
  }, [habilidades]);

  // Filtrar pelos três critérios em conjunto
  const gruposFiltrados = useMemo(() => {
    const filtrados: Record<string, HabilidadeItem[]> = {};
    Object.entries(habilidadesPorCompetencia).forEach(([comp, habs]) => {
      if (competenciaFiltro !== 'todas' && comp !== competenciaFiltro) return;
      let resultado = habs;
      if (searchTerm.trim()) {
        const termo = searchTerm.toLowerCase();
        resultado = resultado.filter((h) => h.nome.toLowerCase().includes(termo));
      }
      if (tipoFiltro !== 'todas') {
        resultado = resultado.filter((h) => h.tipo === tipoFiltro);
      }
      if (resultado.length > 0) filtrados[comp] = resultado;
    });
    return filtrados;
  }, [habilidadesPorCompetencia, searchTerm, tipoFiltro, competenciaFiltro]);

  const competencias = Object.keys(gruposFiltrados).sort();

  const toggle = (id: string) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setChecked(next);
  };

  const toggleGrupo = (comp: string) => {
    const habs = gruposFiltrados[comp] || [];
    const todasMarcadas = habs.every((h) => checked.has(h.id));
    const next = new Set(checked);
    habs.forEach((h) => {
      if (todasMarcadas) next.delete(h.id);
      else next.add(h.id);
    });
    setChecked(next);
  };

  const toggleCollapse = (comp: string) => {
    const next = new Set(collapsedGroups);
    if (next.has(comp)) next.delete(comp);
    else next.add(comp);
    setCollapsedGroups(next);
  };

  // Calcular diff
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

  // Label do botão de confirmar
  const confirmLabel = () => {
    if (!hasChanges) return 'Salvar';
    const parts: string[] = [];
    if (toAdd.length > 0) parts.push(`Adicionar ${toAdd.length}`);
    if (toRemove.length > 0) parts.push(`Remover ${toRemove.length}`);
    return parts.join(' · ');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className="relative bg-white rounded-xl shadow-2xl flex flex-col"
        style={{ width: '640px', height: '80vh', maxHeight: '720px' }}
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

        {/* Busca e filtros */}
        <div className="px-6 pt-3 pb-3 border-b border-gray-100 flex flex-col gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Buscar habilidades…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-500)] focus:border-[var(--brand-500)] outline-none bg-gray-50"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Segmented control — tipo */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1 flex-shrink-0">
              {(['todas', 'Técnica', 'Comportamental'] as const).map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setTipoFiltro(tipo)}
                  className={`px-3 py-2 text-sm font-normal rounded-md transition-all whitespace-nowrap ${
                    tipoFiltro === tipo
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tipo === 'todas' ? 'Todas' : tipo}
                </button>
              ))}
            </div>

            {/* Dropdown — competência */}
            <Select value={competenciaFiltro} onValueChange={setCompetenciaFiltro}>
              <SelectTrigger className="flex-1 min-w-0">
                <SelectValue placeholder="Todas as competências" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as competências</SelectItem>
                {todasCompetencias.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto">
          {competencias.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <Search className="w-8 h-8 text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-700">Nenhuma habilidade encontrada</p>
              <p className="text-sm text-gray-400 mt-1">Tente ajustar os filtros aplicados</p>
            </div>
          ) : (
            competencias.map((comp) => {
              const habs = gruposFiltrados[comp];
              const todasMarcadas = habs.every((h) => checked.has(h.id));
              const isCollapsed = collapsedGroups.has(comp);
              const marcadasNoGrupo = habs.filter((h) => checked.has(h.id)).length;

              return (
                <div key={comp} className="border-b border-gray-100 last:border-0">
                  {/* Cabeçalho do grupo */}
                  <div className="flex items-center px-5 py-2.5 bg-gray-50 sticky top-0 z-10">
                    <button
                      onClick={() => toggleCollapse(comp)}
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      {isCollapsed
                        ? <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        : <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      }
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {comp}
                      </span>
                      <span className={`text-xs ml-1 tabular-nums ${marcadasNoGrupo > 0 ? 'text-[var(--brand-600)] font-medium' : 'text-gray-400'}`}>
                        {marcadasNoGrupo > 0 ? `${marcadasNoGrupo}/${habs.length}` : habs.length}
                      </span>
                    </button>

                    <button
                      onClick={() => toggleGrupo(comp)}
                      className="text-xs font-medium text-[var(--brand-600)] hover:text-[var(--brand-700)] transition-colors ml-4 flex-shrink-0"
                    >
                      {todasMarcadas ? 'Desmarcar todas' : 'Selecionar todas'}
                    </button>
                  </div>

                  {/* Habilidades */}
                  {!isCollapsed && (
                    <div>
                      {habs.map((hab) => {
                        const isChecked = checked.has(hab.id);
                        const eraAdicionada = habilidadesAdicionadas.includes(hab.id);
                        const marcadaParaRemover = eraAdicionada && !isChecked;

                        return (
                          <div
                            key={hab.id}
                            onClick={() => toggle(hab.id)}
                            className={`flex items-center gap-3 px-5 py-3 border-b border-gray-50 last:border-0 cursor-pointer transition-colors ${
                              marcadaParaRemover
                                ? 'bg-red-50 hover:bg-red-100'
                                : isChecked
                                ? 'bg-blue-50 hover:bg-blue-100'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            {/* Checkbox */}
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

                            {/* Nome */}
                            <span className={`flex-1 text-sm ${marcadaParaRemover ? 'text-red-500 line-through' : 'text-gray-900'}`}>
                              {hab.nome}
                            </span>

                            {/* Badge */}
                            {marcadaParaRemover ? (
                              <span className="text-xs font-medium text-red-400 flex-shrink-0">
                                Será removida
                              </span>
                            ) : (
                              <span
                                className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${
                                  hab.tipo === 'Técnica'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-purple-100 text-purple-800'
                                }`}
                              >
                                {hab.tipo}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <span className="text-sm text-gray-500">
            {!hasChanges
              ? `${checked.size} ${checked.size === 1 ? 'habilidade na matriz' : 'habilidades na matriz'}`
              : [
                  toAdd.length > 0 && `+${toAdd.length} a adicionar`,
                  toRemove.length > 0 && `-${toRemove.length} a remover`,
                ].filter(Boolean).join(' · ')
            }
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!hasChanges}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                !hasChanges
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : toRemove.length > 0 && toAdd.length === 0
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-[var(--brand-600)] text-white hover:bg-[var(--brand-700)]'
              }`}
            >
              {confirmLabel()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
