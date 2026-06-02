import { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';

interface Habilidade {
  id: string;
  nome: string;
  tipo: 'Técnica' | 'Comportamental';
  competencia: string;
}

interface HabilidadesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  habilidadesDisponiveis: Habilidade[];
  habilidadesAdicionadas: string[]; // IDs das habilidades já na jornada
  onConfirm: (selectedIds: string[]) => void;
}

export function HabilidadesDrawer({
  isOpen,
  onClose,
  habilidadesDisponiveis = [],
  habilidadesAdicionadas = [],
  onConfirm,
}: HabilidadesDrawerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filtrar habilidades pela busca
  const habilidadesFiltradas = useMemo(() => {
    if (!habilidadesDisponiveis || habilidadesDisponiveis.length === 0) return [];
    
    return habilidadesDisponiveis.filter(hab =>
      hab.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hab.competencia.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [habilidadesDisponiveis, searchTerm]);

  // Agrupar por competência
  const habilidadesPorCompetencia = useMemo(() => {
    const grupos: Record<string, Habilidade[]> = {};
    
    habilidadesFiltradas.forEach(hab => {
      if (!grupos[hab.competencia]) {
        grupos[hab.competencia] = [];
      }
      grupos[hab.competencia].push(hab);
    });

    return grupos;
  }, [habilidadesFiltradas]);

  // Toggle seleção
  const handleToggleSelection = (id: string) => {
    if (habilidadesAdicionadas.includes(id)) return; // Já adicionada, não pode selecionar
    
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // Confirmar seleção
  const handleConfirm = () => {
    onConfirm(selectedIds);
    setSelectedIds([]);
    setSearchTerm('');
    onClose();
  };

  // Cancelar
  const handleCancel = () => {
    setSelectedIds([]);
    setSearchTerm('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
        onClick={handleCancel}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-[480px] bg-white z-50 shadow-xl flex flex-col animate-slide-in-right"
        style={{
          animation: 'slideInRight 0.3s ease-out',
        }}
      >
        {/* Cabeçalho */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-lg font-semibold text-[#111827]">Adicionar habilidades</h2>
            <button
              onClick={handleCancel}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[13px] text-[#6B7280]">
            Selecione as habilidades que farão parte desta jornada. Os níveis serão definidos na matriz.
          </p>
        </div>

        {/* Campo de busca */}
        <div className="px-6 pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar habilidade…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-500)] focus:border-[var(--brand-500)] outline-none"
            />
          </div>
        </div>

        {/* Lista de habilidades */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {Object.keys(habilidadesPorCompetencia).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">Nenhuma habilidade encontrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(habilidadesPorCompetencia).map(([competencia, habilidades]) => (
                <div key={competencia}>
                  {/* Cabeçalho da seção */}
                  <div className="bg-[#F9FAFB] -mx-6 px-6 py-2 mb-2">
                    <span className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">
                      {competencia}
                    </span>
                  </div>

                  {/* Lista de habilidades */}
                  <div className="space-y-0">
                    {habilidades.map((habilidade, index) => {
                      const jaAdicionada = habilidadesAdicionadas.includes(habilidade.id);
                      const selecionada = selectedIds.includes(habilidade.id);

                      return (
                        <div key={habilidade.id}>
                          <label
                            className={`flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-50 -mx-6 px-6 transition-colors ${
                              jaAdicionada ? 'cursor-not-allowed opacity-60' : ''
                            }`}
                          >
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              checked={jaAdicionada || selecionada}
                              disabled={jaAdicionada}
                              onChange={() => handleToggleSelection(habilidade.id)}
                              className="w-4 h-4 text-[var(--brand-600)] border-gray-300 rounded focus:ring-2 focus:ring-[var(--brand-500)] disabled:opacity-50 disabled:cursor-not-allowed"
                            />

                            {/* Nome */}
                            <span
                              className={`flex-1 text-sm ${
                                jaAdicionada ? 'text-gray-400' : 'text-gray-900'
                              }`}
                            >
                              {habilidade.nome}
                            </span>

                            {/* Badge de tipo ou status */}
                            {jaAdicionada ? (
                              <span className="text-[11px] text-[#16A34A] font-medium">
                                Já adicionada
                              </span>
                            ) : (
                              <span
                                className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full ${
                                  habilidade.tipo === 'Técnica'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-purple-100 text-purple-800'
                                }`}
                              >
                                {habilidade.tipo}
                              </span>
                            )}
                          </label>
                          {index < habilidades.length - 1 && (
                            <div className="h-px bg-[#F3F4F6] -mx-6" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedIds.length === 0}
              className="px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedIds.length > 0
                ? `Adicionar ${selectedIds.length} ${selectedIds.length === 1 ? 'habilidade' : 'habilidades'}`
                : 'Adicionar habilidades'}
            </button>
          </div>
        </div>
      </div>

      {/* Animação */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}