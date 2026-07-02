import { useState, useMemo, useEffect } from 'react';
import { X, Check, Users, Search } from 'lucide-react';
import { colaboradoresData } from '../../data/mockData';

interface Cargo {
  id: string;
  nome: string;
}

interface Colaborador {
  id: string;
  nome: string;
  cargoId: string;
  gerencia: string;
}

interface ColaboradoresSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  cargosJornada: Cargo[];
  colaboradoresDisponiveis: Colaborador[];
  colaboradoresVinculados: string[];
  onConfirm: (colaboradoresSelecionados: string[]) => void;
}

export function ColaboradoresSelectionModal({
  isOpen,
  onClose,
  cargosJornada,
  colaboradoresDisponiveis,
  colaboradoresVinculados,
  onConfirm,
}: ColaboradoresSelectionModalProps) {
  const [cargoSelecionado, setCargoSelecionado] = useState('');
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCargoSelecionado(cargosJornada[0]?.id ?? '');
      setSelecionados(new Set(colaboradoresVinculados));
      setSearchTerm('');
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Dados completos dos colaboradores já vinculados (via lookup no mock)
  const colaboradoresVinculadosComDados = useMemo(() => {
    return colaboradoresVinculados
      .map((id) => (colaboradoresData as any[]).find((c: any) => c.id === id))
      .filter((c): c is any => Boolean(c) && Boolean(c.cargoId))
      .map((c: any) => ({ id: c.id, nome: c.nome, cargoId: c.cargoId, gerencia: c.gerencia }));
  }, [colaboradoresVinculados]);

  // Todos os colaboradores do cargo ativo (vinculados primeiro, depois disponíveis)
  const todosColaboradoresDoCargo = useMemo(() => {
    const vinculadosNoCargo = colaboradoresVinculadosComDados.filter(
      (c) => c.cargoId === cargoSelecionado
    );
    const disponiveisNoCargo = colaboradoresDisponiveis.filter(
      (c) => c.cargoId === cargoSelecionado
    );
    return [...vinculadosNoCargo, ...disponiveisNoCargo];
  }, [colaboradoresVinculadosComDados, colaboradoresDisponiveis, cargoSelecionado]);

  const todosColaboradoresFiltrados = useMemo(() => {
    if (!searchTerm.trim()) return todosColaboradoresDoCargo;
    const termo = searchTerm.toLowerCase();
    return todosColaboradoresDoCargo.filter((c) => c.nome.toLowerCase().includes(termo));
  }, [todosColaboradoresDoCargo, searchTerm]);

  // Apenas os disponíveis (não vinculados) visíveis — para toggleTodos e todosMarcados
  const disponiveisFiltrados = useMemo(
    () => todosColaboradoresFiltrados.filter((c) => !colaboradoresVinculados.includes(c.id)),
    [todosColaboradoresFiltrados, colaboradoresVinculados]
  );

  // IDs novos selecionados (exclui os já vinculados) — para onConfirm e disabled do botão
  const novosSelecionados = useMemo(
    () => Array.from(selecionados).filter((id) => !colaboradoresVinculados.includes(id)),
    [selecionados, colaboradoresVinculados]
  );

  const toggle = (id: string) => {
    if (colaboradoresVinculados.includes(id)) return;
    const next = new Set(selecionados);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelecionados(next);
  };

  const toggleTodos = () => {
    const ids = disponiveisFiltrados.map((c) => c.id);
    const todosMarcados = ids.length > 0 && ids.every((id) => selecionados.has(id));
    const next = new Set(selecionados);
    ids.forEach((id) => {
      if (todosMarcados) next.delete(id);
      else next.add(id);
    });
    setSelecionados(next);
  };

  const handleConfirm = () => {
    onConfirm(novosSelecionados);
    onClose();
  };

  if (!isOpen) return null;

  const isBusca = searchTerm.trim().length > 0;
  const totalSelecionados = selecionados.size;
  const todosMarcadosDisponiveis =
    disponiveisFiltrados.length > 0 &&
    disponiveisFiltrados.every((c) => selecionados.has(c.id));
  const cargoAtivo = cargosJornada.find((c) => c.id === cargoSelecionado);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/35" onClick={onClose} />
      <div
        className="relative bg-white rounded-lg shadow-2xl flex flex-col w-full max-w-3xl h-[80vh] max-h-[720px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Adicionar colaboradores</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Busca */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-200">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar colaboradores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent outline-none bg-white"
            />
          </div>
        </div>

        {/* Corpo — duas colunas */}
        <div className="flex flex-1 overflow-hidden">
          {/* Coluna esquerda — cargos */}
          <div className="w-56 flex-shrink-0 border-r border-gray-200 overflow-y-auto">
            {cargosJornada.length === 0 ? (
              <p className="text-sm text-gray-500 p-4 text-center">Nenhum cargo configurado</p>
            ) : (
              cargosJornada.map((cargo) => {
                const totalNoCargo =
                  colaboradoresDisponiveis.filter((c) => c.cargoId === cargo.id).length +
                  colaboradoresVinculadosComDados.filter((c) => c.cargoId === cargo.id).length;
                const isActive = cargo.id === cargoSelecionado;
                return (
                  <div
                    key={cargo.id}
                    onClick={() => {
                      setCargoSelecionado(cargo.id);
                      setSearchTerm('');
                    }}
                    className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer border-l-2 transition-colors ${
                      isActive
                        ? 'bg-[var(--brand-50)] text-[var(--brand-700)] border-[var(--brand-600)] font-medium'
                        : 'text-gray-700 hover:bg-gray-50 border-transparent'
                    }`}
                  >
                    <span className="flex-1 truncate">{cargo.nome}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2 tabular-nums">
                      {totalNoCargo}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Coluna direita — colaboradores */}
          <div className="flex-1 overflow-y-auto p-4">
            {cargosJornada.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Users className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700">Nenhum cargo configurado</p>
                <p className="text-sm text-gray-400 mt-1">
                  Adicione cargos à jornada antes de vincular colaboradores
                </p>
              </div>
            ) : todosColaboradoresDoCargo.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Users className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700">Nenhum colaborador cadastrado</p>
                <p className="text-sm text-gray-400 mt-1">
                  Não há colaboradores cadastrados para este cargo
                </p>
              </div>
            ) : isBusca && todosColaboradoresFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700">Nenhum colaborador encontrado</p>
                <p className="text-sm text-gray-400 mt-1">Tente outros termos</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {cargoAtivo?.nome}
                  </p>
                  {disponiveisFiltrados.length > 0 && (
                    <button
                      type="button"
                      onClick={toggleTodos}
                      className="text-xs font-medium text-[var(--brand-600)] hover:text-[var(--brand-700)]"
                    >
                      {todosMarcadosDisponiveis ? 'Limpar seleção' : 'Selecionar todos'}
                    </button>
                  )}
                </div>
                <div className="space-y-0.5">
                  {todosColaboradoresFiltrados.map((colab) => {
                    const isVinculado = colaboradoresVinculados.includes(colab.id);
                    const isSelecionado = selecionados.has(colab.id);
                    return (
                      <div
                        key={colab.id}
                        onClick={() => toggle(colab.id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                          isVinculado
                            ? 'cursor-not-allowed'
                            : isSelecionado
                            ? 'bg-blue-50 hover:bg-blue-100 cursor-pointer'
                            : 'hover:bg-gray-50 cursor-pointer'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                            isSelecionado
                              ? 'bg-[var(--brand-600)] border-[var(--brand-600)]'
                              : 'border-gray-300 bg-white'
                          } ${isVinculado ? 'opacity-60' : ''}`}
                        >
                          {isSelecionado && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div
                          className={`flex-1 min-w-0 flex items-center justify-between gap-3 ${
                            isVinculado ? 'opacity-60' : ''
                          }`}
                        >
                          <span className="text-sm text-gray-900 truncate">{colab.nome}</span>
                          <span className="text-xs text-gray-500 flex-shrink-0">{colab.gerencia}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <span className="text-sm text-gray-500">
            {totalSelecionados === 0
              ? 'Nenhum colaborador selecionado'
              : `${totalSelecionados} colaborador${totalSelecionados !== 1 ? 'es' : ''} selecionado${totalSelecionados !== 1 ? 's' : ''}`}
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
              disabled={novosSelecionados.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--brand-600)] rounded-lg hover:bg-[var(--brand-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Adicionar colaboradores
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
