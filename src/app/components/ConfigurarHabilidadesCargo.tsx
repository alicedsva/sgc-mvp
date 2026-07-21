import { FormEvent, useState } from 'react';
import { X, Search, Plus, Trash2 } from 'lucide-react';
import { getCompetenciaNome } from '../data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ToggleSwitch } from './ui/ToggleSwitch';
import { Table, Column } from './ui/Table';

interface ConfigurarHabilidadesCargoProps {
  isOpen: boolean;
  onClose: () => void;
  cargo: any;
  jornada: any;
  onSubmit: (e: FormEvent) => void;
  habilidadesData: any[];
  habilidadesCargoData: any[];
  setHabilidadesCargoData: (data: any[]) => void;
  buscaHabilidade: string;
  setBuscaHabilidade: (value: string) => void;
  filtroCategoria: string;
  setFiltroCategoria: (value: string) => void;
  competenciasData: any[];
}

export function ConfigurarHabilidadesCargo({
  isOpen,
  onClose,
  cargo,
  jornada,
  onSubmit,
  habilidadesData,
  habilidadesCargoData,
  setHabilidadesCargoData,
  buscaHabilidade,
  setBuscaHabilidade,
  filtroCategoria,
  setFiltroCategoria,
}: ConfigurarHabilidadesCargoProps) {
  const [showAddHabilidade, setShowAddHabilidade] = useState(false);

  if (!isOpen) return null;

  // Filtrar habilidades vinculadas ao cargo
  const habilidadesVinculadas = habilidadesCargoData
    .filter(hc => hc.cargoId === cargo.id)
    .map(hc => {
      const habilidade = habilidadesData.find(h => h.id === hc.habilidadeId);
      return {
        ...hc,
        nome: habilidade?.nome || 'Desconhecida',
        categoria: habilidade ? (getCompetenciaNome(habilidade.competenciaId ?? '') || habilidade.competencia) : 'Sem categoria',
      };
    });

  // Filtrar habilidades disponíveis (não vinculadas ao cargo)
  const habilidadesDisponiveis = habilidadesData.filter(h => {
    const jaVinculada = habilidadesCargoData.some(
      hc => hc.cargoId === cargo.id && hc.habilidadeId === h.id
    );
    
    if (jaVinculada) return false;

    // Aplicar filtros
    const matchBusca = buscaHabilidade === '' || 
      h.nome.toLowerCase().includes(buscaHabilidade.toLowerCase());
    
    const matchCategoria = filtroCategoria === 'todas' ||
      h.competenciaId === filtroCategoria;
    
    return matchBusca && matchCategoria && h.status === 'Ativa';
  });

  // Handler para adicionar habilidade
  const handleAdicionarHabilidade = (habilidadeId: string) => {
    const novaVinculacao = {
      cargoId: cargo.id,
      habilidadeId,
      nivelEsperado: 'Básico',
      obrigatoria: true,
    };
    setHabilidadesCargoData([...habilidadesCargoData, novaVinculacao]);
    setBuscaHabilidade('');
  };

  // Handler para remover habilidade
  const handleRemoverHabilidade = (habilidadeId: string) => {
    setHabilidadesCargoData(
      habilidadesCargoData.filter(
        hc => !(hc.cargoId === cargo.id && hc.habilidadeId === habilidadeId)
      )
    );
  };

  // Handler para atualizar nível esperado
  const handleAtualizarNivel = (habilidadeId: string, novoNivel: string) => {
    setHabilidadesCargoData(
      habilidadesCargoData.map(hc =>
        hc.cargoId === cargo.id && hc.habilidadeId === habilidadeId
          ? { ...hc, nivelEsperado: novoNivel }
          : hc
      )
    );
  };

  // Handler para toggle obrigatória
  const handleToggleObrigatoria = (habilidadeId: string) => {
    setHabilidadesCargoData(
      habilidadesCargoData.map(hc =>
        hc.cargoId === cargo.id && hc.habilidadeId === habilidadeId
          ? { ...hc, obrigatoria: !hc.obrigatoria }
          : hc
      )
    );
  };

  // Colunas da tabela de habilidades vinculadas
  const habilidadesColumns: Column[] = [
    { key: 'nome', label: 'Habilidade', width: '30%' },
    { key: 'categoria', label: 'Categoria', width: '25%' },
    {
      key: 'nivelEsperado',
      label: 'Nível Esperado',
      width: '20%',
      render: (value, row) => (
        <Select
          value={value}
          onValueChange={(newValue) => handleAtualizarNivel(row.habilidadeId, newValue)}
        >
          <SelectTrigger className="w-full h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Básico">Básico</SelectItem>
            <SelectItem value="Intermediário">Intermediário</SelectItem>
            <SelectItem value="Avançado">Avançado</SelectItem>
            <SelectItem value="Especialista">Especialista</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      key: 'obrigatoria',
      label: 'Obrigatória',
      width: '15%',
      render: (value, row) => (
        <ToggleSwitch
          checked={value}
          onChange={() => handleToggleObrigatoria(row.habilidadeId)}
        />
      ),
    },
    {
      key: 'actions',
      label: '',
      width: '10%',
      render: (_, row) => (
        <button
          onClick={() => handleRemoverHabilidade(row.habilidadeId)}
          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Remover habilidade"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  // Obter categorias únicas para o filtro (por ID)
  const categoriasUnicas = Array.from(
    new Set(habilidadesData.map((h: any) => h.competenciaId).filter(Boolean))
  ).sort() as string[];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 ml-0 md:ml-20 lg:ml-64 mt-16 bg-black/20 z-40 transition-opacity duration-200 ease-out"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-full md:w-[35%] md:max-w-xl md:min-w-[400px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-white">
          <h2 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900">
            Configurar habilidades do cargo
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="flex-1 flex flex-col overflow-hidden">
          {/* Form Fields */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-5">
            {/* Campos readonly */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                Nome do Cargo
              </label>
              <input
                type="text"
                value={cargo.cargoRM}
                readOnly
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                Jornada
              </label>
              <input
                type="text"
                value={jornada?.nome || ''}
                readOnly
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Seção de Habilidades */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  Habilidades do Cargo ({habilidadesVinculadas.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddHabilidade(!showAddHabilidade)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--brand-600)] hover:bg-[var(--brand-50)] rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Adicionar
                </button>
              </div>

              {/* Painel de adicionar habilidade */}
              {showAddHabilidade && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar habilidade..."
                        value={buscaHabilidade}
                        onChange={(e) => setBuscaHabilidade(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                      />
                    </div>
                    <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                      <SelectTrigger className="w-[180px] h-[38px] text-sm">
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas</SelectItem>
                        {categoriasUnicas.map(id => (
                          <SelectItem key={id} value={id}>
                            {getCompetenciaNome(id)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Lista de habilidades disponíveis */}
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {habilidadesDisponiveis.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-4">
                        Nenhuma habilidade disponível
                      </p>
                    ) : (
                      habilidadesDisponiveis.map(h => (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => handleAdicionarHabilidade(h.id)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-white rounded border border-transparent hover:border-gray-200 transition-colors"
                        >
                          <div className="font-medium text-gray-900">{h.nome}</div>
                          <div className="text-xs text-gray-500">{getCompetenciaNome(h.competenciaId ?? '') || h.competencia}</div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Tabela de habilidades vinculadas */}
              {habilidadesVinculadas.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-500">
                    Nenhuma habilidade configurada para este cargo
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Clique em "Adicionar" para vincular habilidades
                  </p>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Table
                    columns={habilidadesColumns}
                    data={habilidadesVinculadas}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-4 md:px-6 py-3 md:py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-500)] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[var(--brand-600)] rounded-lg hover:bg-[var(--brand-700)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-500)] transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
