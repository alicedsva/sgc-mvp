import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router';
import { Plus, Edit, Trash2, AlertCircle, ArrowLeft, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { useCarreiras } from '../context/CarreirasContext';
import { Table, Column } from '../components/ui/Table';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmationModal } from '../components/templates/ConfirmationModal';
import { FormDrawer, FormField } from '../components/templates/FormDrawer';
import { ToggleSwitch } from '../components/ui/ToggleSwitch';
import { toast } from 'sonner';

interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}

export default function CarreiraDetalhePage() {
  const { carreiraId } = useParams();
  const navigate = useNavigate();
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();
  const { carreiras, jornadas, cargos, removerJornada, atualizarJornada } = useCarreiras();

  const [buscaJornada, setBuscaJornada] = useState('');
  const [filtroStatusJornada, setFiltroStatusJornada] = useState<'todas' | 'ativa' | 'inativa'>('ativa');
  const [currentPageJornadas, setCurrentPageJornadas] = useState(1);

  useEffect(() => {
    setCurrentPageJornadas(1);
  }, [buscaJornada, filtroStatusJornada]);
  const [jornadaParaExcluir, setJornadaParaExcluir] = useState<string | null>(null);
  const [jornadasSortConfig, setJornadasSortConfig] = useState<{
    column: 'nome' | 'tipo' | 'quantidadeCargos' | 'status' | 'id';
    direction: 'asc' | 'desc';
  }>({ column: 'id', direction: 'desc' });
  const [jornadaParaEditar, setJornadaParaEditar] = useState<any | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ nome: '', tipo: '' });

  // Buscar dados da carreira
  const carreira = carreiras.find(c => c.id === carreiraId);
  const jornadasDaCarreira = jornadas.filter(j => j.carreiraId === carreiraId);

  const jornadasFiltradas = jornadasDaCarreira.filter(j => {
    const matchBusca = buscaJornada === '' || j.nome.toLowerCase().includes(buscaJornada.toLowerCase());
    const matchStatus =
      filtroStatusJornada === 'todas' ||
      (filtroStatusJornada === 'ativa' && j.status === 'Ativa') ||
      (filtroStatusJornada === 'inativa' && j.status === 'Desativada');
    return matchBusca && matchStatus;
  });

  const handleJornadasSort = (column: 'nome' | 'tipo' | 'quantidadeCargos' | 'status') => {
    setJornadasSortConfig(prev =>
      prev.column === column
        ? { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { column, direction: 'asc' }
    );
  };

  const jornadasOrdenadas = [...jornadasFiltradas].sort((a, b) => {
    if (jornadasSortConfig.column === 'id') {
      return (a.id > b.id ? -1 : 1);
    }
    const dir = jornadasSortConfig.direction === 'asc' ? 1 : -1;
    if (jornadasSortConfig.column === 'quantidadeCargos') {
      const countA = cargos.filter(c => c.jornadaId === a.id).length;
      const countB = cargos.filter(c => c.jornadaId === b.id).length;
      return (countA - countB) * dir;
    }
    return ((a as any)[jornadasSortConfig.column] as string).localeCompare((b as any)[jornadasSortConfig.column] as string) * dir;
  });

  if (!carreira) {
    return (
      <main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
        <div className="p-4 md:p-8">
          <div className="max-w-2xl mx-auto mt-16">
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Carreira não encontrada
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Esta carreira não existe ou foi removida.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => navigate('/carreiras')}
                  className="px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors"
                >
                  Voltar para carreiras
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Abrir modal de exclusão
  const handleExcluirClick = (jornadaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setJornadaParaExcluir(jornadaId);
  };

  // Confirmar exclusão
  const handleConfirmarExclusao = () => {
    if (jornadaParaExcluir) {
      const jornada = jornadasDaCarreira.find(j => j.id === jornadaParaExcluir);
      removerJornada(jornadaParaExcluir);
      toast.success(`Jornada "${jornada?.nome}" excluída com sucesso`);
      setJornadaParaExcluir(null);
    }
  };

  // Abrir drawer de edição
  const handleEditarClick = (jornada: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setJornadaParaEditar(jornada);
    setEditFormData({
      nome: jornada.nome,
      tipo: jornada.tipo,
    });
    setIsEditDrawerOpen(true);
  };

  // Salvar edição
  const handleSalvarEdicao = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editFormData.nome.trim()) {
      toast.error('Preencha o nome da jornada');
      return;
    }

    atualizarJornada(jornadaParaEditar.id, {
      ...jornadaParaEditar,
      nome: editFormData.nome,
      tipo: editFormData.tipo,
    });


    toast.success('Jornada atualizada com sucesso');
    setIsEditDrawerOpen(false);
    setJornadaParaEditar(null);
  };

  // Toggle status
  const handleToggleStatus = (jornada: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const novoStatus = jornada.status === 'Ativa' ? 'Desativada' : 'Ativa';
    
    atualizarJornada(jornada.id, {
      ...jornada,
      status: novoStatus,
    });

    toast.success(`Jornada ${novoStatus === 'Ativa' ? 'ativada' : 'desativada'}`);
  };

  const jornadasItemsPerPage = 10;
  const jornadasTotal = jornadasOrdenadas.length;
  const jornadasStart = (currentPageJornadas - 1) * jornadasItemsPerPage;
  const jornadasEnd = jornadasStart + jornadasItemsPerPage;
  const jornadasPaginadas = jornadasOrdenadas.slice(jornadasStart, jornadasEnd);

  // Colunas da tabela de jornadas
  const jornadasColumns: Column[] = [
    {
      key: 'nome',
      label: 'Nome da Jornada',
      width: '30%',
      renderHeader: () => (
        <button
          onClick={() => handleJornadasSort('nome')}
          className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
        >
          Nome da Jornada
          {jornadasSortConfig.column === 'nome' ? (
            jornadasSortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
          ) : (
            <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
          )}
        </button>
      ),
      render: (value) => (
        <span className="text-xs md:text-sm text-gray-900">{value}</span>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      width: '25%',
      renderHeader: () => (
        <button
          onClick={() => handleJornadasSort('tipo')}
          className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
        >
          Tipo
          {jornadasSortConfig.column === 'tipo' ? (
            jornadasSortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
          ) : (
            <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
          )}
        </button>
      ),
      render: (value) => (
        <span className="text-xs md:text-sm text-gray-900">{value}</span>
      ),
    },
    {
      key: 'quantidadeCargos',
      label: 'Cargos',
      width: '15%',
      renderHeader: () => (
        <button
          onClick={() => handleJornadasSort('quantidadeCargos')}
          className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
        >
          Cargos
          {jornadasSortConfig.column === 'quantidadeCargos' ? (
            jornadasSortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
          ) : (
            <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
          )}
        </button>
      ),
      render: (_, row) => {
        const total = cargos.filter(c => c.jornadaId === row.id).length;
        if (total === 0) return <span className="text-sm text-gray-500">—</span>;
        return (
          <span className="text-sm text-gray-900">
            {total} {total === 1 ? 'cargo' : 'cargos'}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      width: '15%',
      renderHeader: () => (
        <button
          onClick={() => handleJornadasSort('status')}
          className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
        >
          Status
          {jornadasSortConfig.column === 'status' ? (
            jornadasSortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
          ) : (
            <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
          )}
        </button>
      ),
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            value === 'Ativa'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: '_actions',
      label: 'Ações',
      width: '15%',
      render: (_, row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => handleToggleStatus(row, e)}
            className="p-1.5 rounded transition-colors"
            title={row.status === 'Ativa' ? 'Desativar' : 'Ativar'}
          >
            <ToggleSwitch
              checked={row.status === 'Ativa'}
              onChange={() => {}}
            />
          </button>
          <button
            onClick={(e) => handleEditarClick(row, e)}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => handleExcluirClick(row.id, e)}
            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Campos do formulário de edição
  const editFields: FormField[] = [
    {
      name: 'nome',
      label: 'Nome da jornada',
      type: 'text',
      placeholder: 'Ex: Desenvolvedor',
      required: true,
      value: editFormData.nome,
      onChange: (value) => setEditFormData({ ...editFormData, nome: value }),
    },
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'select',
      required: true,
      options: [
        { value: 'Contribuidor Individual', label: 'Contribuidor Individual' },
        { value: 'Gestão', label: 'Gestão' },
      ],
      value: editFormData.tipo,
      onChange: (value) => setEditFormData({ ...editFormData, tipo: value }),
    },
  ];

  return (
    <main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
      <div className="p-4 md:p-8">
        <button
          onClick={() => navigate('/carreiras')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Carreiras
        </button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{carreira.nome}</h1>
          <p className="text-sm text-gray-600 mt-2">
            Gerencie as jornadas e trilhas de progressão desta carreira
          </p>
        </div>

        {/* Toolbar de filtros */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 mb-6">
          {/* Mobile */}
          <div className="flex flex-col gap-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar jornada"
                value={buscaJornada}
                onChange={(e) => setBuscaJornada(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
              />
            </div>
            <div className="overflow-x-auto -mx-3 px-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1 min-w-max">
                {(['todas', 'ativa', 'inativa'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setFiltroStatusJornada(v)}
                    className={`px-3 py-2 text-sm font-normal rounded-md transition-all whitespace-nowrap ${
                      filtroStatusJornada === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {v === 'todas' ? 'Todas' : v === 'ativa' ? 'Ativas' : 'Desativadas'}
                  </button>
                ))}
              </div>
            </div>
            <button
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors"
              onClick={() => navigate(`/carreiras/${carreiraId}/jornadas/criar`)}
            >
              <Plus className="w-4 h-4" />
              Criar jornada
            </button>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-72 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar jornada"
                value={buscaJornada}
                onChange={(e) => setBuscaJornada(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
              />
            </div>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {(['todas', 'ativa', 'inativa'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setFiltroStatusJornada(v)}
                  className={`px-3 py-2 text-sm font-normal rounded-md transition-all ${
                    filtroStatusJornada === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {v === 'todas' ? 'Todas' : v === 'ativa' ? 'Ativas' : 'Desativadas'}
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <button
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors"
              onClick={() => navigate(`/carreiras/${carreiraId}/jornadas/criar`)}
            >
              <Plus className="w-4 h-4" />
              Criar jornada
            </button>
          </div>
        </div>

        {/* Tabela de Jornadas */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {jornadasDaCarreira.length === 0 ? (
            <div className="p-12 text-center">
              <EmptyState
                icon={<Plus className="w-8 h-8" />}
                title="Nenhuma jornada cadastrada"
                description="Comece criando a primeira jornada para estruturar os cargos e competências."
              />
            </div>
          ) : jornadasOrdenadas.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm text-gray-500">Nenhuma jornada encontrada para os filtros selecionados.</p>
            </div>
          ) : (
            <Table
              columns={jornadasColumns}
              data={jornadasPaginadas}
              onRowClick={(row) => navigate(`/carreiras/${carreiraId}/jornadas/${row.id}`)}
              pagination={{
                currentPage: currentPageJornadas,
                itemsPerPage: jornadasItemsPerPage,
                totalItems: jornadasTotal,
                onPageChange: setCurrentPageJornadas,
                onItemsPerPageChange: () => {},
              }}
            />
          )}
        </div>
      </div>

      {/* Modal de confirmação de exclusão */}
      <ConfirmationModal
        isOpen={!!jornadaParaExcluir}
        onClose={() => setJornadaParaExcluir(null)}
        onConfirm={handleConfirmarExclusao}
        title="Excluir jornada?"
        message="Esta ação não pode ser desfeita. Todos os cargos e configurações associados serão removidos."
        confirmLabel="Excluir"
        variant="danger"
      />

      {/* Drawer de edição */}
      <FormDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => {
          setIsEditDrawerOpen(false);
          setJornadaParaEditar(null);
        }}
        title="Editar jornada"
        fields={editFields}
        onSubmit={handleSalvarEdicao}
        submitLabel="Salvar alterações"
      />
    </main>
  );
}