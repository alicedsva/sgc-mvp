import { useState, useEffect, useRef, useMemo } from 'react';
import { useHabilidades } from '../context/HabilidadesContext';
import { useCompetencias } from '../context/CompetenciasContext';
import { useCarreiras, generateId } from '../context/CarreirasContext';
import { useAvaliacoes } from '../context/AvaliacoesContext';
import { useNavigate, useLocation } from 'react-router';
import { niveisDefaultData, getCorFromPeso, colaboradoresData, cargosData } from '../data/mockData';
import type { Carreira, Avaliacao, ParticipanteAvaliacao } from '../../data/schema';
import { ListingPage } from './templates/ListingPage';
import { FormDrawer, FormField } from './templates/FormDrawer';
import { ConfirmationModal } from './templates/ConfirmationModal';
import { Column, InlineAction, Table } from './ui/Table';
import { ToggleSwitch } from './ui/ToggleSwitch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { EmptyState } from './ui/EmptyState';
import { NiveisProficiencia } from './NiveisProficiencia';
import { ColaboradorView } from './ColaboradorView';
import { MinhasAvaliacoes } from './MinhasAvaliacoes';
import { Perfis } from './Perfis';
import { ComponentShowcase } from './ComponentShowcase';
import { NovaAvaliacaoDrawer, NovaAvaliacaoFormData } from './avaliacoes/NovaAvaliacaoDrawer';
import { EditarAvaliacaoModal } from './avaliacoes/EditarAvaliacaoModal';
import { Edit, Award, Layers, Search, Plus, Briefcase, ClipboardCheck, Eye, ArrowUp, ArrowDown, StopCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ContentAreaProps {
  selectedItem: string;
  viewMode: 'admin' | 'colaborador';
  isSidebarCollapsed: boolean;
}

// Gerências reais (derivadas de colaboradoresData) — nunca lista fixa, para
// que público-alvo de Avaliações sempre reflita as gerências que existem de
// fato no sistema. Mesmo padrão já usado em DashboardPage.tsx.
const GERENCIAS_REAIS = Array.from(new Set(colaboradoresData.map(c => c.gerencia))).sort();

// Formata o rótulo de público-alvo de uma Avaliação a partir das gerências
// selecionadas, seguindo o padrão observado nos dados reais (publicoLabel é
// texto livre, não FK — ver schema.ts).
function formatPublicoLabel(gerencias: string[]): string {
  if (gerencias.length === 0 || gerencias.length >= GERENCIAS_REAIS.length) return 'Todos os colaboradores';
  if (gerencias.length === 1) return `Gerência ${gerencias[0]}`;
  if (gerencias.length === 2) return `Gerências ${gerencias[0]} e ${gerencias[1]}`;
  return `Gerências ${gerencias.slice(0, -1).join(', ')} e ${gerencias[gerencias.length - 1]}`;
}

// Caminho inverso de formatPublicoLabel — usado só para pré-popular o
// formulário de edição a partir do publicoLabel já salvo. É best-effort:
// round-trip perfeito para rótulos gerados por formatPublicoLabel; rótulos
// fora desse padrão (ex: o outlier histórico 'Cargo Desenvolvedor Pleno')
// resultam em nenhuma gerência pré-marcada.
function parsePublicoLabelParaGerencias(label: string): string[] {
  if (label === 'Todos os colaboradores') return [...GERENCIAS_REAIS];
  const semPrefixo = label.replace(/^Gerências?\s+/, '');
  if (semPrefixo === label) return [];
  return semPrefixo
    .split(/,\s*| e /)
    .map(s => s.trim())
    .filter(nome => GERENCIAS_REAIS.includes(nome));
}

// IDs dos colaboradores no público-alvo — usado para montar/recalcular
// Avaliacao.participantes a partir das gerências selecionadas no formulário.
function idsColaboradoresAlvo(gerencias: string[]): string[] {
  const todos = gerencias.length === 0 || gerencias.length >= GERENCIAS_REAIS.length;
  return colaboradoresData
    .filter(c => todos || gerencias.includes(c.gerencia))
    .map(c => c.id);
}

export function ContentArea({ selectedItem, viewMode, isSidebarCollapsed }: ContentAreaProps) {
  // ========== ALL HOOKS MUST BE DECLARED FIRST (before any early returns) ==========
  const navigate = useNavigate();
  const location = useLocation();

  // Estado para controlar qual tab está ativa no módulo Habilidades
  const [activeTab, setActiveTab] = useState<string>((location.state as any)?.tab ?? 'competencias');
  
  // Ref para o container das tabs (para auto-scroll)
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  
  // Estado de paginação para Competências
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Estado de paginação para Habilidades
  const [currentPageHabilidades, setCurrentPageHabilidades] = useState(1);
  const [itemsPerPageHabilidades, setItemsPerPageHabilidades] = useState(10);
  
  // Estados de filtros para Habilidades
  const [filtroCompetencia, setFiltroCompetencia] = useState('todas');
  const [filtroTipo, setFiltroTipo] = useState('todas');
  const [filtroStatus, setFiltroStatus] = useState('ativa');
  const [buscaHabilidade, setBuscaHabilidade] = useState('');
  const [habilidadesSortConfig, setHabilidadesSortConfig] = useState<{
    column: 'nome' | 'competencia' | 'status' | 'id';
    direction: 'asc' | 'desc';
  }>({ column: 'id', direction: 'desc' });
  const [competenciasSortConfig, setCompetenciasSortConfig] = useState<{
    column: 'nome' | 'habilidades' | 'status' | 'id';
    direction: 'asc' | 'desc';
  }>({ column: 'id', direction: 'desc' });
  const [carreirasSortConfig, setCarreirasSortConfig] = useState<{
    column: 'nome' | 'jornadas' | 'status' | 'id';
    direction: 'asc' | 'desc';
  }>({ column: 'id', direction: 'desc' });
  const [avaliacoesSortConfig, setAvaliacoesSortConfig] = useState<{
    column: 'nome' | 'tipo' | 'periodo' | 'status' | 'id';
    direction: 'asc' | 'desc';
  }>({ column: 'id', direction: 'desc' });
  
  // Estados de filtro de status e busca para Competências e Níveis
  const [statusFilterCompetencias, setStatusFilterCompetencias] = useState('ativa');
  const [buscaCompetencia, setBuscaCompetencia] = useState('');
  
  // Estados para Carreiras
  const [statusFilterCarreiras, setStatusFilterCarreiras] = useState('ativa');
  const [buscaCarreira, setBuscaCarreira] = useState('');
  const [currentPageCarreiras, setCurrentPageCarreiras] = useState(1);
  const [itemsPerPageCarreiras, setItemsPerPageCarreiras] = useState(10);
  const [carreiraFormData, setCarreiraFormData] = useState<{ nome: string; status: 'Ativa' | 'Desativada' }>({
    nome: '',
    status: 'Ativa',
  });
  
  // Estados para Avaliações
  const [statusFilterAvaliacoes, setStatusFilterAvaliacoes] = useState('ativa');
  const [buscaAvaliacao, setBuscaAvaliacao] = useState('');
  const [currentPageAvaliacoes, setCurrentPageAvaliacoes] = useState(1);
  const [itemsPerPageAvaliacoes, setItemsPerPageAvaliacoes] = useState(10);
  const [avaliacaoFormData, setAvaliacaoFormData] = useState({
    nome: '',
    descricao: '',
    competencias: [] as string[],
    habilidades: [] as string[],
    gerencias: [] as string[],
    dataInicio: '',
    dataFim: '',
  });
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNovaAvaliacaoOpen, setIsNovaAvaliacaoOpen] = useState(false);

  // Reset da paginação quando filtros de Competências mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [buscaCompetencia, statusFilterCompetencias]);

  // Reset da paginação quando filtros de Habilidades mudarem
  useEffect(() => {
    setCurrentPageHabilidades(1);
  }, [buscaHabilidade, filtroCompetencia, filtroTipo, filtroStatus]);

  // Reset da paginação quando filtros de Carreiras mudarem
  useEffect(() => {
    setCurrentPageCarreiras(1);
  }, [buscaCarreira, statusFilterCarreiras]);

  // Reset da paginação quando filtros de Avaliações mudarem
  useEffect(() => {
    setCurrentPageAvaliacoes(1);
  }, [buscaAvaliacao, statusFilterAvaliacoes]);

  // Auto-scroll para a tab ativa quando mudar (apenas mobile/tablet)
  useEffect(() => {
    if (tabsContainerRef.current && selectedItem === 'habilidades') {
      const container = tabsContainerRef.current;
      const activeButton = container.querySelector(`button[data-tab-id="${activeTab}"]`) as HTMLElement;
      
      if (activeButton) {
        const containerRect = container.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();
        
        // Calcular se o botão está fora da área visível
        const isOutOfView = 
          buttonRect.left < containerRect.left || 
          buttonRect.right > containerRect.right;
        
        // Fazer scroll suave para centralizar a tab ativa
        if (isOutOfView) {
          const scrollPosition = activeButton.offsetLeft - (container.offsetWidth / 2) + (activeButton.offsetWidth / 2);
          container.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [activeTab, selectedItem]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [competenciaFormData, setCompetenciaFormData] = useState({
    nome: '',
    descricao: '',
    status: 'Ativa',
  });

  // Estado e dados para Níveis de Habilidades
  const [niveisData, setNiveisData] = useState(niveisDefaultData);

  // Estado e dados para Habilidades (gerenciados via contexto compartilhado)
  const { habilidades: habilidadesData, addHabilidade, updateHabilidade } = useHabilidades();

  // emUso calculado a partir das habilidades reais (não do campo armazenado em mockData)
  const niveisComContagem = useMemo(() =>
    niveisData.map(nivel => ({
      ...nivel,
      emUso: habilidadesData.filter(h => h.niveis.some(n => n.nivelId === nivel.id)).length,
    })),
    [niveisData, habilidadesData]
  );
  const { competencias, addCompetencia, updateCompetencia } = useCompetencias();
  const {
    carreiras: carreirasData,
    adicionarCarreira,
    atualizarCarreira,
    jornadas: jornadasDoContexto,
  } = useCarreiras();
  const [habilidadeFormData, setHabilidadeFormData] = useState({
    nome: '',
    descricao: '',
    competencia: '',
    competenciaId: '',
    tipo: 'Técnica',
    status: 'Ativa',
    niveis: [] as Array<{ nivelId: string; criterio: string }>,
  });

  // Perfis derivados de colaboradoresData — fonte única de verdade
  const [syncedProfileIds, setSyncedProfileIds] = useState<Set<string>>(new Set());

  const profilesData = useMemo(
    () => colaboradoresData.map(c => ({
      id: c.id,
      nome: c.nome,
      cargo: cargosData.find(cg => cg.id === c.cargoId)?.cargoRM ?? c.cargo,
      gerencia: c.gerencia,
      ultimoAcesso: c.ultimoAcesso ?? '',
      status: c.status,
      atualizacaoDisponivel: c.atualizacaoDisponivel && !syncedProfileIds.has(c.id),
    })),
    [syncedProfileIds]
  );

  // Avaliações — lidas/escritas via AvaliacoesContext (dado real, mesmo
  // tratamento já aplicado a Carreiras).
  const {
    avaliacoes: avaliacoesData,
    adicionarAvaliacao,
    atualizarAvaliacao,
  } = useAvaliacoes();

  // ========== EARLY RETURN FOR COLABORADOR VIEW ==========
  // Renderizar visão do colaborador (AFTER all hooks are declared)
  if (viewMode === 'colaborador') {
    return (
      <main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
        <div className="p-4 md:p-8">
          {selectedItem === 'meu-perfil' && <ColaboradorView />}
          {selectedItem === 'minhas-avaliacoes' && <MinhasAvaliacoes />}

          {/* Fallback - mostra Meu Perfil por padrão. "minha-carreira" não
              passa mais por aqui — MinhaCarreiraPage.tsx virou uma rota
              própria e autossuficiente (fora de ContentArea), igual ao
              antigo TesteCarreiraPage.tsx. */}
          {selectedItem !== 'meu-perfil' &&
           selectedItem !== 'minhas-avaliacoes' && (
            <ColaboradorView />
          )}
        </div>
      </main>
    );
  }

  // Renderizar página de Componentes
  if (selectedItem === 'components') {
    return (
      <main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
        <ComponentShowcase />
      </main>
    );
  }

  // Renderizar template de listagem para algumas páginas
  if (selectedItem === 'perfis') {
    return (
      <main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
        <div className="p-4 md:p-8">
          <Perfis
            profilesData={profilesData}
            onUpdateProfiles={(updated) => {
              const newlySynced = updated.filter(p => !p.atualizacaoDisponivel).map(p => p.id);
              setSyncedProfileIds(prev => new Set([...prev, ...newlySynced]));
            }}
          />
        </div>
      </main>
    );
  }

  // Módulo Habilidades com Tabs
  if (selectedItem === 'habilidades') {
    // Contar totais para as badges
    const totalCompetencias = competencias.length;
    const totalHabilidades = habilidadesData.length;

    const tabs = [
      { id: 'competencias', label: 'Competências', badge: totalCompetencias },
      { id: 'niveis', label: 'Níveis de Habilidades' },
      { id: 'habilidades-list', label: 'Habilidades', badge: totalHabilidades },
    ];

    const handleCompetenciasSort = (column: 'nome' | 'habilidades' | 'status') => {
      setCompetenciasSortConfig(prev =>
        prev.column === column
          ? { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
          : { column, direction: 'asc' }
      );
      setCurrentPage(1);
    };

    // Configurações para o módulo de Competências (reutilizando lógica anterior)
    const competenciasColumns: Column[] = [
      {
        key: 'nome',
        label: 'Nome',
        width: '25%',
        renderHeader: () => (
          <button
            onClick={() => handleCompetenciasSort('nome')}
            className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
          >
            Nome
            {competenciasSortConfig.column === 'nome' ? (
              competenciasSortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
            ) : (
              <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
            )}
          </button>
        ),
      },
      { key: 'descricao', label: 'Descrição', width: '40%' },
      {
        key: 'habilidades',
        label: 'Habilidades Vinculadas',
        width: '15%',
        renderHeader: () => (
          <button
            onClick={() => handleCompetenciasSort('habilidades')}
            className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap hover:text-gray-700 transition-colors"
          >
            Habilidades Vinculadas
            {competenciasSortConfig.column === 'habilidades' ? (
              competenciasSortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
            ) : (
              <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
            )}
          </button>
        ),
        render: (value) => (
          <span className="inline-flex items-center gap-1 text-sm text-gray-900">
            <span className="font-medium">{value}</span>
            <span className="text-gray-500">
              {value === 1 ? 'habilidade' : 'habilidades'}
            </span>
          </span>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        width: '15%',
        renderHeader: () => (
          <button
            onClick={() => handleCompetenciasSort('status')}
            className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
          >
            Status
            {competenciasSortConfig.column === 'status' ? (
              competenciasSortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
            ) : (
              <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
            )}
          </button>
        ),
        render: (value) => (
          <span
            className={`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full ${
              value === 'Ativa'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {value}
          </span>
        ),
      },
    ];

    const competenciasActions: InlineAction[] = [
      {
        label: 'Editar',
        icon: <Edit className="w-4 h-4" />,
        onClick: (row) => {
          setSelectedRow(row);
          setCompetenciaFormData({
            nome: row.nome,
            descricao: row.descricao,
            status: row.status,
          });
          setIsDrawerOpen(true);
        },
      },
      {
        label: row => row.status === 'Ativa' ? 'Desativar' : 'Ativar',
        icon: (row) => (
          <ToggleSwitch
            checked={row.status === 'Ativa'}
            onChange={() => {}}
          />
        ),
        variant: 'toggle',
        onClick: (row) => {
          if (row.status === 'Ativa') {
            setSelectedRow(row);
            setIsModalOpen(true);
          } else {
            updateCompetencia(row.id, { status: 'Ativa' });
            toast.success(`Competência "${row.nome}" reativada com sucesso!`);
          }
        },
      },
    ];

    const handleOpenCreateDrawer = () => {
      setSelectedRow(null);
      setCompetenciaFormData({ nome: '', descricao: '', status: 'Ativa' });
      setIsDrawerOpen(true);
    };

    const competenciasFormFields: FormField[] = [
      {
        name: 'nome',
        label: 'Nome da Competência',
        type: 'text',
        placeholder: 'Ex: Design de Produto',
        required: true,
        value: competenciaFormData.nome,
        onChange: (value) =>
          setCompetenciaFormData({ ...competenciaFormData, nome: value }),
      },
      {
        name: 'descricao',
        label: 'Descrição',
        type: 'textarea',
        placeholder: 'Descreva brevemente esta competência...',
        rows: 4,
        value: competenciaFormData.descricao,
        onChange: (value) =>
          setCompetenciaFormData({ ...competenciaFormData, descricao: value }),
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        value: competenciaFormData.status,
        onChange: (value) =>
          setCompetenciaFormData({ ...competenciaFormData, status: value }),
        options: [
          { value: 'Ativa', label: 'Ativa' },
          { value: 'Desativada', label: 'Desativada' },
        ],
      },
    ];

    const handleCompetenciaFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (selectedRow) {
        updateCompetencia(selectedRow.id, {
          nome: competenciaFormData.nome,
          descricao: competenciaFormData.descricao,
          status: competenciaFormData.status as 'Ativa' | 'Desativada',
        });
        toast.success('Competência atualizada com sucesso!');
      } else {
        addCompetencia({
          nome: competenciaFormData.nome,
          descricao: competenciaFormData.descricao,
          status: competenciaFormData.status as 'Ativa' | 'Desativada',
        });
        setCompetenciasSortConfig({ column: 'id', direction: 'desc' });
        setCurrentPage(1);
        toast.success('Competência criada com sucesso!');
      }

      setIsDrawerOpen(false);
      setSelectedRow(null);
      setCompetenciaFormData({ nome: '', descricao: '', status: 'Ativa' });
    };

    const handleDesativar = () => {
      if (selectedRow) {
        updateCompetencia(selectedRow.id, { status: 'Desativada' });
        toast.success(`Competência "${selectedRow.nome}" desativada com sucesso!`);
        setIsModalOpen(false);
        setSelectedRow(null);
      }
    };

    // Renderizar conteúdo baseado na tab ativa
    const renderTabContent = () => {
      if (activeTab === 'competencias') {
        // Derivar contagem de habilidades por competência a partir do Context
        const competenciasComCount = competencias.map(c => ({
          ...c,
          habilidades: habilidadesData.filter(h => h.competenciaId === c.id).length,
        }));

        // Aplicar filtros aos dados
        const dadosFiltrados = competenciasComCount.filter(item => {
          // Filtro de busca (nome e descrição)
          const matchBusca = buscaCompetencia === '' || 
            item.nome.toLowerCase().includes(buscaCompetencia.toLowerCase()) ||
            item.descricao.toLowerCase().includes(buscaCompetencia.toLowerCase());
          
          // Filtro de status
          const matchStatus = statusFilterCompetencias === 'todas' || 
            item.status.toLowerCase() === statusFilterCompetencias.toLowerCase();
          
          return matchBusca && matchStatus;
        });

        const dadosOrdenados = [...dadosFiltrados].sort((a, b) => {
          if (competenciasSortConfig.column === 'id') {
            return 0; // manter ordem do array (novas competências inseridas no início)
          }
          const dir = competenciasSortConfig.direction === 'asc' ? 1 : -1;
          if (competenciasSortConfig.column === 'habilidades') {
            return (a.habilidades - b.habilidades) * dir;
          }
          return (a[competenciasSortConfig.column] as string).localeCompare(b[competenciasSortConfig.column] as string) * dir;
        });

        // Cálculo de paginação com dados ordenados
        const totalItems = dadosOrdenados.length;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = dadosOrdenados.slice(startIndex, endIndex);

        const handlePageChange = (page: number) => {
          setCurrentPage(page);
        };

        const handleItemsPerPageChange = (items: number) => {
          setItemsPerPage(items);
          setCurrentPage(1);
        };

        return (
          <>
            <ListingPage
              primaryAction={{
                label: '+ Criar competência',
                onClick: handleOpenCreateDrawer,
              }}
              columns={competenciasColumns}
              data={paginatedData}
              actions={competenciasActions}
              searchPlaceholder="Buscar competência"
              onSearch={setBuscaCompetencia}
              statusFilter={{
                value: statusFilterCompetencias,
                onChange: setStatusFilterCompetencias,
                options: [
                  { value: 'todas', label: 'Todas' },
                  { value: 'ativa', label: 'Ativas' },
                  { value: 'desativada', label: 'Desativadas' },
                ],
              }}
              emptyState={{
                icon: <Layers className="w-8 h-8" />,
                title: 'Nenhuma competência cadastrada',
                description:
                  'Comece criando a primeira competência para organizar as habilidades da sua organização.',
              }}
              pagination={{
                currentPage,
                itemsPerPage,
                totalItems,
                onPageChange: handlePageChange,
                onItemsPerPageChange: handleItemsPerPageChange,
              }}
            />

            <FormDrawer
              isOpen={isDrawerOpen}
              onClose={() => {
                setIsDrawerOpen(false);
                setSelectedRow(null);
                setCompetenciaFormData({ nome: '', descricao: '', status: 'Ativa' });
              }}
              title={selectedRow ? 'Editar Competência' : 'Nova Competência'}
              fields={competenciasFormFields}
              onSubmit={handleCompetenciaFormSubmit}
              submitLabel={selectedRow ? 'Salvar alterações' : 'Salvar'}
              alertBanner={
                selectedRow && selectedRow.habilidades > 0
                  ? {
                      title: 'Competência vinculada',
                      description: `Esta competência está vinculada a ${selectedRow.habilidades} ${
                        selectedRow.habilidades === 1 ? 'habilidade' : 'habilidades'
                      }. Alterações no nome ou descrição serão refletidas automaticamente ${
                        selectedRow.habilidades === 1 ? 'nessa habilidade' : 'nessas habilidades'
                      } e no mapa de habilidades.`,
                      variant: 'info',
                    }
                  : undefined
              }
            />

            <ConfirmationModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedRow(null);
              }}
              onConfirm={handleDesativar}
              title="Desativar Competência"
              message={`Ao desativar a competência "${selectedRow?.nome}", ela não será mais exibida nas listas ativas, mas o histórico será mantido. Você poderá reativá-la posteriormente se necessário.`}
              confirmLabel="Desativar"
              cancelLabel="Cancelar"
              variant="warning"
            />
          </>
        );
      }

      if (activeTab === 'niveis') {
        return (
          <NiveisProficiencia
            niveisData={niveisComContagem}
            onUpdateNiveis={setNiveisData}
          />
        );
      }

      if (activeTab === 'habilidades-list') {
        // Aplicar filtros aos dados
        const dadosFiltrados = habilidadesData.filter(item => {
          // Filtro de busca (nome e descrição)
          const matchBusca = buscaHabilidade === '' ||
            item.nome.toLowerCase().includes(buscaHabilidade.toLowerCase()) ||
            item.descricao.toLowerCase().includes(buscaHabilidade.toLowerCase());

          // Filtro de competência
          const matchCompetencia = filtroCompetencia === 'todas' ||
            item.competenciaId === filtroCompetencia;
          
          // Filtro de tipo
          const matchTipo = filtroTipo === 'todas' || 
            item.tipo.toLowerCase() === filtroTipo.toLowerCase();
          
          // Filtro de status
          const matchStatus = filtroStatus === 'todas' || 
            item.status.toLowerCase() === filtroStatus.toLowerCase();
          
          return matchBusca && matchCompetencia && matchTipo && matchStatus;
        });

        const handleHabilidadesSort = (column: 'nome' | 'competencia' | 'status') => {
          setHabilidadesSortConfig(prev =>
            prev.column === column
              ? { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
              : { column, direction: 'asc' }
          );
          setCurrentPageHabilidades(1);
        };

        const dadosOrdenados = [...dadosFiltrados].sort((a, b) => {
          if (habilidadesSortConfig.column === 'id') {
            return Number(b.id) - Number(a.id);
          }
          const dir = habilidadesSortConfig.direction === 'asc' ? 1 : -1;
          return a[habilidadesSortConfig.column].localeCompare(b[habilidadesSortConfig.column]) * dir;
        });

        const totalItemsHabilidades = dadosOrdenados.length;
        const startIndexHabilidades = (currentPageHabilidades - 1) * itemsPerPageHabilidades;
        const endIndexHabilidades = startIndexHabilidades + itemsPerPageHabilidades;
        const paginatedDataHabilidades = dadosOrdenados.slice(startIndexHabilidades, endIndexHabilidades);

        const habilidadesColumns: Column[] = [
          {
            key: 'nome',
            label: 'Nome da Habilidade',
            width: '20%',
            render: (value) => (
              <span className="text-sm text-gray-900">{value}</span>
            ),
            renderHeader: () => (
              <button
                onClick={() => handleHabilidadesSort('nome')}
                className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
              >
                Nome da Habilidade
                {habilidadesSortConfig.column === 'nome' ? (
                  habilidadesSortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                ) : (
                  <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                )}
              </button>
            ),
          },
          {
            key: 'competencia',
            label: 'Competência',
            width: '18%',
            renderHeader: () => (
              <button
                onClick={() => handleHabilidadesSort('competencia')}
                className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
              >
                Competência
                {habilidadesSortConfig.column === 'competencia' ? (
                  habilidadesSortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                ) : (
                  <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                )}
              </button>
            ),
          },
          {
            key: 'niveis',
            label: 'Níveis',
            width: '25%',
            render: (value) => {
              const niveis = value as Array<{ nivelId: string; criterio: string }> | undefined;
              if (!niveis || niveis.length === 0) return <span className="text-gray-400 text-sm">—</span>;
              const niveisMap = Object.fromEntries(niveisData.map((n) => [n.id, n]));
              const nomes = niveis.map(({ nivelId }) => niveisMap[nivelId]?.nome).filter(Boolean).join(', ');
              return <span className="text-sm text-gray-700">{nomes || <span className="text-gray-400">—</span>}</span>;
            },
          },
          {
            key: 'tipo',
            label: 'Tipo',
            width: '12%',
            render: (value) => (
              <span
                className={`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full ${
                  value === 'Técnica'
                    ? 'bg-[var(--brand-100)] text-[var(--brand-800)]'
                    : 'bg-purple-100 text-purple-800'
                }`}
              >
                {value}
              </span>
            ),
          },
          {
            key: 'status',
            label: 'Status',
            width: '12%',
            renderHeader: () => (
              <button
                onClick={() => handleHabilidadesSort('status')}
                className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
              >
                Status
                {habilidadesSortConfig.column === 'status' ? (
                  habilidadesSortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                ) : (
                  <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                )}
              </button>
            ),
            render: (value) => (
              <span
                className={`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full ${
                  value === 'Ativa'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {value}
              </span>
            ),
          },
        ];

        const habilidadesActions: InlineAction[] = [
          {
            label: 'Visualizar',
            icon: <Eye className="w-4 h-4" />,
            onClick: (row) => navigate(`/habilidades/${row.id}`),
          },
          {
            label: 'Editar',
            icon: <Edit className="w-4 h-4" />,
            onClick: (row) => {
              setSelectedRow(row);
              setHabilidadeFormData({
                nome: row.nome,
                descricao: row.descricao,
                competencia: row.competencia,
                competenciaId: row.competenciaId ?? '',
                tipo: row.tipo,
                status: row.status,
                niveis: row.niveis || [],
              });
              setIsDrawerOpen(true);
            },
          },
          {
            label: row => row.status === 'Ativa' ? 'Desativar' : 'Ativar',
            icon: (row) => (
              <ToggleSwitch
                checked={row.status === 'Ativa'}
                onChange={() => {}}
              />
            ),
            variant: 'toggle',
            onClick: (row) => {
              if (row.status === 'Ativa') {
                setSelectedRow(row);
                setIsModalOpen(true);
              } else {
                updateHabilidade(row.id, { status: 'Ativa' });
                toast.success(`Habilidade "${row.nome}" reativada com sucesso!`);
              }
            },
          },
        ];

        const handleOpenCreateHabilidadeDrawer = () => {
          setSelectedRow(null);
          setHabilidadeFormData({ nome: '', descricao: '', competencia: '', competenciaId: '', tipo: 'Técnica', status: 'Ativa', niveis: [] });
          setIsDrawerOpen(true);
        };

        const habilidadesFormFields: FormField[] = [
          {
            name: 'nome',
            label: 'Nome da Habilidade',
            type: 'text',
            placeholder: 'Ex: React',
            required: true,
            value: habilidadeFormData.nome,
            onChange: (value) =>
              setHabilidadeFormData({ ...habilidadeFormData, nome: value }),
          },
          {
            name: 'descricao',
            label: 'Descrição',
            type: 'textarea',
            placeholder: 'Descreva esta habilidade...',
            rows: 3,
            value: habilidadeFormData.descricao,
            onChange: (value) =>
              setHabilidadeFormData({ ...habilidadeFormData, descricao: value }),
          },
          {
            name: 'competenciaId',
            label: 'Competência',
            type: 'select',
            required: true,
            value: habilidadeFormData.competenciaId,
            onChange: (value) => {
              const comp = competencias.find((c) => c.id === value);
              setHabilidadeFormData({ ...habilidadeFormData, competenciaId: value, competencia: comp?.nome ?? '' });
            },
            options: competencias
              .filter((c) => c.status === 'Ativa')
              .map((c) => ({ value: c.id, label: c.nome })),
          },
          {
            name: 'tipo',
            label: 'Tipo',
            type: 'select',
            required: true,
            value: habilidadeFormData.tipo,
            onChange: (value) =>
              setHabilidadeFormData({ ...habilidadeFormData, tipo: value }),
            options: [
              { value: 'Técnica', label: 'Técnica' },
              { value: 'Comportamental', label: 'Comportamental' },
            ],
          },
          {
            name: 'status',
            label: 'Status',
            type: 'select',
            required: true,
            value: habilidadeFormData.status,
            onChange: (value) =>
              setHabilidadeFormData({ ...habilidadeFormData, status: value }),
            options: [
              { value: 'Ativa', label: 'Ativa' },
              { value: 'Desativada', label: 'Desativada' },
            ],
          },
        ];

        const handleHabilidadeFormSubmit = (e: React.FormEvent) => {
          e.preventDefault();

          if (habilidadeFormData.niveis.length === 0) {
            toast.error('Selecione ao menos um nível aplicável para esta habilidade.');
            return;
          }

          if (selectedRow) {
            updateHabilidade(selectedRow.id, {
              nome: habilidadeFormData.nome,
              descricao: habilidadeFormData.descricao,
              competencia: habilidadeFormData.competencia,
              competenciaId: habilidadeFormData.competenciaId,
              tipo: habilidadeFormData.tipo as 'Técnica' | 'Comportamental',
              status: habilidadeFormData.status as 'Ativa' | 'Desativada',
              niveis: habilidadeFormData.niveis,
            });
            toast.success('Habilidade atualizada com sucesso!');
            setIsDrawerOpen(false);
            setSelectedRow(null);
            setHabilidadeFormData({ nome: '', descricao: '', competencia: '', competenciaId: '', tipo: 'Técnica', status: 'Ativa', niveis: [] });
          } else {
            addHabilidade({
              nome: habilidadeFormData.nome,
              descricao: habilidadeFormData.descricao,
              competencia: habilidadeFormData.competencia,
              competenciaId: habilidadeFormData.competenciaId,
              tipo: habilidadeFormData.tipo as 'Técnica' | 'Comportamental',
              status: habilidadeFormData.status as 'Ativa' | 'Desativada',
              niveis: habilidadeFormData.niveis,
            });
            toast.success('Habilidade criada com sucesso!');
            setIsDrawerOpen(false);
            setSelectedRow(null);
            setHabilidadeFormData({ nome: '', descricao: '', competencia: '', competenciaId: '', tipo: 'Técnica', status: 'Ativa', niveis: [] });
            setHabilidadesSortConfig({ column: 'id', direction: 'desc' });
            setCurrentPageHabilidades(1);
          }
        };

        const handleDesativarHabilidade = () => {
          if (selectedRow) {
            updateHabilidade(selectedRow.id, { status: 'Desativada' });
            toast.success(`Habilidade "${selectedRow.nome}" desativada com sucesso!`);
            setIsModalOpen(false);
            setSelectedRow(null);
          }
        };

        const handlePageChangeHabilidades = (page: number) => {
          setCurrentPageHabilidades(page);
        };

        const handleItemsPerPageChangeHabilidades = (items: number) => {
          setItemsPerPageHabilidades(items);
          setCurrentPageHabilidades(1);
        };

        return (
          <>
            <div className="space-y-6 relative">
              {/* Toolbar unificada */}
              <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
                {/* Mobile: Layout vertical */}
                <div className="flex flex-col gap-3 md:hidden">
                  {/* Campo de busca - largura total */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar habilidade"
                      value={buscaHabilidade}
                      onChange={(e) => setBuscaHabilidade(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                    />
                  </div>

                  {/* Dropdown de Competência - largura total */}
                  <Select value={filtroCompetencia} onValueChange={setFiltroCompetencia}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todas as competências" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as competências</SelectItem>
                      {competencias.filter(c => c.status === 'Ativa').map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Filtros de Tipo - scroll horizontal */}
                  <div className="overflow-x-auto -mx-3 px-3">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1 min-w-max">
                      <button
                        onClick={() => setFiltroTipo('todas')}
                        className={`px-3 py-2 text-sm font-normal rounded-md transition-all whitespace-nowrap ${
                          filtroTipo === 'todas'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Todas
                      </button>
                      <button
                        onClick={() => setFiltroTipo('técnica')}
                        className={`px-3 py-2 text-sm font-normal rounded-md transition-all whitespace-nowrap ${
                          filtroTipo === 'técnica'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Técnica
                      </button>
                      <button
                        onClick={() => setFiltroTipo('comportamental')}
                        className={`px-3 py-2 text-sm font-normal rounded-md transition-all whitespace-nowrap ${
                          filtroTipo === 'comportamental'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Comportamental
                      </button>
                    </div>
                  </div>

                  {/* Filtros de Status - scroll horizontal */}
                  <div className="overflow-x-auto -mx-3 px-3">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1 min-w-max">
                      <button
                        onClick={() => setFiltroStatus('todas')}
                        className={`px-3 py-2 text-sm font-normal rounded-md transition-all whitespace-nowrap ${
                          filtroStatus === 'todas'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Todas
                      </button>
                      <button
                        onClick={() => setFiltroStatus('ativa')}
                        className={`px-3 py-2 text-sm font-normal rounded-md transition-all whitespace-nowrap ${
                          filtroStatus === 'ativa'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Ativas
                      </button>
                      <button
                        onClick={() => setFiltroStatus('desativada')}
                        className={`px-3 py-2 text-sm font-normal rounded-md transition-all whitespace-nowrap ${
                          filtroStatus === 'desativada'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        Desativadas
                      </button>
                    </div>
                  </div>
                </div>

                {/* Desktop: Layout horizontal original */}
                <div className="hidden md:flex items-center gap-3">
                  {/* Campo de busca */}
                  <div className="w-80 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar habilidade"
                      value={buscaHabilidade}
                      onChange={(e) => setBuscaHabilidade(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                    />
                  </div>

                  {/* Dropdown de Competência */}
                  <Select value={filtroCompetencia} onValueChange={setFiltroCompetencia}>
                    <SelectTrigger className="w-auto">
                      <SelectValue placeholder="Todas as competências" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as competências</SelectItem>
                      {competencias.filter(c => c.status === 'Ativa').map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Pills de Tipo */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setFiltroTipo('todas')}
                      className={`px-3 py-2 text-sm font-normal rounded-md transition-all ${
                        filtroTipo === 'todas'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Todas
                    </button>
                    <button
                      onClick={() => setFiltroTipo('técnica')}
                      className={`px-3 py-2 text-sm font-normal rounded-md transition-all ${
                        filtroTipo === 'técnica'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Técnica
                    </button>
                    <button
                      onClick={() => setFiltroTipo('comportamental')}
                      className={`px-3 py-2 text-sm font-normal rounded-md transition-all ${
                        filtroTipo === 'comportamental'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Comportamental
                    </button>
                  </div>

                  {/* Pills de Status */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setFiltroStatus('todas')}
                      className={`px-3 py-2 text-sm font-normal rounded-md transition-all ${
                        filtroStatus === 'todas'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Todas
                    </button>
                    <button
                      onClick={() => setFiltroStatus('ativa')}
                      className={`px-3 py-2 text-sm font-normal rounded-md transition-all ${
                        filtroStatus === 'ativa'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Ativas
                    </button>
                    <button
                      onClick={() => setFiltroStatus('desativada')}
                      className={`px-3 py-2 text-sm font-normal rounded-md transition-all ${
                        filtroStatus === 'desativada'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Desativadas
                    </button>
                  </div>

                  {/* Espaçador flexível */}
                  <div className="flex-1"></div>

                  {/* Botão de ação primária - apenas desktop */}
                  <button
                    onClick={handleOpenCreateHabilidadeDrawer}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors"
                  >
                    + Criar habilidade
                  </button>
                </div>
              </div>

              {/* Tabela */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {totalItemsHabilidades === 0 ? (
                  <EmptyState
                    icon={<Award className="w-8 h-8" />}
                    title={habilidadesData.length === 0 ? 'Nenhuma habilidade cadastrada' : 'Nenhum resultado encontrado'}
                    description={habilidadesData.length === 0
                      ? 'Comece criando a primeira habilidade para estruturar o sistema de gestão de competências.'
                      : 'Não encontramos habilidades que correspondam aos filtros selecionados. Tente ajustar os critérios de busca.'
                    }
                  />
                ) : (
                  <Table
                    columns={habilidadesColumns}
                    data={paginatedDataHabilidades}
                    actions={habilidadesActions}
                    pagination={{
                      currentPage: currentPageHabilidades,
                      itemsPerPage: itemsPerPageHabilidades,
                      totalItems: totalItemsHabilidades,
                      onPageChange: handlePageChangeHabilidades,
                      onItemsPerPageChange: handleItemsPerPageChangeHabilidades,
                    }}
                  />
                )}
              </div>
            </div>

            <FormDrawer
              isOpen={isDrawerOpen}
              onClose={() => {
                setIsDrawerOpen(false);
                setSelectedRow(null);
                setHabilidadeFormData({ nome: '', descricao: '', competencia: '', competenciaId: '', tipo: 'Técnica', status: 'Ativa', niveis: [] });
              }}
              title={selectedRow ? 'Editar Habilidade' : 'Nova Habilidade'}
              fields={habilidadesFormFields}
              onSubmit={handleHabilidadeFormSubmit}
              submitLabel={selectedRow ? 'Salvar alterações' : 'Salvar'}
              customContent={(() => {
                const niveisAtivos = niveisData
                  .filter((n) => n.status === 'Ativo' && !('arquivado' in n && n.arquivado))
                  .sort((a, b) => a.peso - b.peso);

                const selectedIds = new Set(habilidadeFormData.niveis.map((n) => n.nivelId));

                const toggleNivel = (nivelId: string) => {
                  if (selectedIds.has(nivelId)) {
                    setHabilidadeFormData((prev) => ({
                      ...prev,
                      niveis: prev.niveis.filter((n) => n.nivelId !== nivelId),
                    }));
                  } else {
                    setHabilidadeFormData((prev) => ({
                      ...prev,
                      niveis: [...prev.niveis, { nivelId, criterio: '' }],
                    }));
                  }
                };

                return (
                  <div className="border-t border-gray-200 pt-4 mt-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Níveis Aplicáveis <span className="text-red-500">*</span>
                      </label>
                      {habilidadeFormData.niveis.length > 0 && (
                        <span className="text-xs text-gray-500">{habilidadeFormData.niveis.length} selecionado{habilidadeFormData.niveis.length > 1 ? 's' : ''}</span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {niveisAtivos.map((nivel) => {
                        const isSelected = selectedIds.has(nivel.id);
                        return (
                          <button
                            key={nivel.id}
                            type="button"
                            onClick={() => toggleNivel(nivel.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                              isSelected
                                ? 'border-transparent text-white'
                                : 'border-gray-300 text-gray-600 bg-white hover:border-gray-400'
                            }`}
                            style={isSelected ? { backgroundColor: getCorFromPeso(nivel.peso) } : {}}
                          >
                            {nivel.nome}
                          </button>
                        );
                      })}
                    </div>

                    {habilidadeFormData.niveis.length > 0 && (
                      <div className="border-t border-gray-100 pt-4 space-y-4">
                        <label className="text-sm font-medium text-gray-700">Critérios por nível</label>
                        {niveisAtivos
                          .filter((nivel) => selectedIds.has(nivel.id))
                          .map((nivel) => {
                            const nivelEntry = habilidadeFormData.niveis.find((n) => n.nivelId === nivel.id);
                            return (
                              <div key={nivel.id} className="space-y-2">
                                <span
                                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white"
                                  style={{ backgroundColor: getCorFromPeso(nivel.peso) }}
                                >
                                  {nivel.nome}
                                </span>
                                <textarea
                                  value={nivelEntry?.criterio ?? ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setHabilidadeFormData((prev) => ({
                                      ...prev,
                                      niveis: prev.niveis.map((n) =>
                                        n.nivelId === nivel.id ? { ...n, criterio: val } : n
                                      ),
                                    }));
                                  }}
                                  placeholder="O que se espera de um colaborador neste nível para esta habilidade?"
                                  rows={3}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent resize-none text-gray-700 placeholder-gray-400"
                                />
                                {nivel.descricao && (
                                  <p className="text-xs text-gray-400 leading-relaxed">
                                    <span className="font-medium">Referência do nível:</span> {nivel.descricao}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              })()}
            />

            <ConfirmationModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelectedRow(null);
              }}
              onConfirm={handleDesativarHabilidade}
              title="Desativar Habilidade"
              message={`Ao desativar a habilidade "${selectedRow?.nome}", ela não será mais exibida nas listas ativas, mas o histórico de avaliações será mantido. Você poderá reativá-la posteriormente se necessário.`}
              confirmLabel="Desativar"
              cancelLabel="Cancelar"
              variant="warning"
            />

            {/* FAB - Floating Action Button (apenas mobile) */}
            <button
              onClick={handleOpenCreateHabilidadeDrawer}
              className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-[var(--brand-600)] text-white rounded-lg hover:bg-[var(--brand-700)] active:scale-95 transition-all flex items-center justify-center z-40"
              aria-label="Criar habilidade"
            >
              <Plus className="w-6 h-6" />
            </button>
          </>
        );
      }

      return null;
    };

    return (
      <main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
        <div className="p-4 md:p-8">
          {/* Título da Página */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Habilidades</h1>
            <p className="text-sm text-gray-500 mt-1">Gerencie competências, níveis e habilidades da organização</p>
          </div>

          {/* Tabs de Navegação */}
          <div className="border-b border-gray-200 mb-6 md:mb-8 -mx-4 md:mx-0">
            <div ref={tabsContainerRef} className="flex gap-3 md:gap-8 overflow-x-auto lg:overflow-x-visible scrollbar-hide px-4 md:px-0">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    data-tab-id={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap flex-shrink-0 inline-flex items-center gap-2 ${
                      isActive
                        ? 'border-[var(--brand-600)] text-[var(--brand-600)]'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                    {tab.badge !== undefined && (
                      <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 text-[10px] font-medium rounded-full ${
                        isActive
                          ? 'bg-[var(--brand-100)] text-[var(--brand-700)]'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conteúdo da tab ativa */}
          {renderTabContent()}
        </div>
      </main>
    );
  }

  // Módulo Carreiras
  if (selectedItem === 'carreiras') {
    // Filtrar dados baseado no filtro de status
    const getFilteredCarreiras = () => {
      return carreirasData.filter(item => {
        // Filtro de busca (nome)
        const matchBusca = buscaCarreira === '' || 
          item.nome.toLowerCase().includes(buscaCarreira.toLowerCase());
        
        // Filtro de status
        const matchStatus = statusFilterCarreiras === 'todas' || 
          item.status.toLowerCase() === statusFilterCarreiras.toLowerCase();
        
        return matchBusca && matchStatus;
      });
    };

    const dadosFiltrados = getFilteredCarreiras();

    const handleCarreirasSort = (column: 'nome' | 'jornadas' | 'status') => {
      setCarreirasSortConfig(prev =>
        prev.column === column
          ? { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
          : { column, direction: 'asc' }
      );
      setCurrentPageCarreiras(1);
    };

    const dadosOrdenados = [...dadosFiltrados].sort((a, b) => {
      if (carreirasSortConfig.column === 'id') {
        return 0; // manter ordem do array (novas carreiras inseridas no início)
      }
      const dir = carreirasSortConfig.direction === 'asc' ? 1 : -1;
      if (carreirasSortConfig.column === 'jornadas') {
        const countA = jornadasDoContexto.filter(j => j.carreiraId === a.id).length;
        const countB = jornadasDoContexto.filter(j => j.carreiraId === b.id).length;
        return (countA - countB) * dir;
      }
      return (a[carreirasSortConfig.column] as string).localeCompare(b[carreirasSortConfig.column] as string) * dir;
    });

    // Paginação
    const totalItems = dadosOrdenados.length;
    const startIndex = (currentPageCarreiras - 1) * itemsPerPageCarreiras;
    const endIndex = startIndex + itemsPerPageCarreiras;
    const paginatedData = dadosOrdenados.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
      setCurrentPageCarreiras(page);
    };

    const handleItemsPerPageChange = (items: number) => {
      setItemsPerPageCarreiras(items);
      setCurrentPageCarreiras(1);
    };

    // Colunas da tabela
    const carreirasColumns: Column[] = [
      {
        key: 'nome',
        label: 'Nome da Carreira',
        width: '45%',
        renderHeader: () => (
          <button
            onClick={() => handleCarreirasSort('nome')}
            className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
          >
            Nome da Carreira
            {carreirasSortConfig.column === 'nome' ? (
              carreirasSortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
            ) : (
              <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
            )}
          </button>
        ),
        render: (value) => (
          <span className="text-sm text-gray-900">{value}</span>
        ),
      },
      {
        key: 'jornadas',
        label: 'Jornadas',
        width: '25%',
        renderHeader: () => (
          <button
            onClick={() => handleCarreirasSort('jornadas')}
            className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
          >
            Jornadas
            {carreirasSortConfig.column === 'jornadas' ? (
              carreirasSortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
            ) : (
              <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
            )}
          </button>
        ),
        render: (_value, row) => {
          const total = jornadasDoContexto.filter(j => j.carreiraId === row.id).length;
          if (total === 0) return <span className="text-sm text-gray-500">Nenhuma jornada</span>;
          return (
            <span className="text-sm text-gray-900">
              {total} {total === 1 ? 'jornada' : 'jornadas'}
            </span>
          );
        },
      },
      {
        key: 'status',
        label: 'Status',
        width: '20%',
        renderHeader: () => (
          <button
            onClick={() => handleCarreirasSort('status')}
            className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
          >
            Status
            {carreirasSortConfig.column === 'status' ? (
              carreirasSortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
            ) : (
              <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
            )}
          </button>
        ),
        render: (value) => (
          <span
            className={`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full ${
              value === 'Ativa'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {value}
          </span>
        ),
      },
    ];

    // Handler para navegar para detalhamento da carreira
    // Ações da tabela
    const carreirasActions: InlineAction[] = [
      {
        label: 'Editar',
        icon: <Edit className="w-4 h-4" />,
        onClick: (row) => {
          setSelectedRow(row);
          setCarreiraFormData({
            nome: row.nome,
            status: row.status,
          });
          setIsDrawerOpen(true);
        },
      },
      {
        label: row => row.status === 'Ativa' ? 'Desativar' : 'Ativar',
        icon: (row) => (
          <ToggleSwitch
            checked={row.status === 'Ativa'}
            onChange={() => {}}
          />
        ),
        variant: 'toggle',
        onClick: (row) => {
          if (row.status === 'Ativa') {
            setSelectedRow(row);
            setIsModalOpen(true);
          } else {
            atualizarCarreira(row.id, { status: 'Ativa' });
            toast.success(`Carreira "${row.nome}" reativada com sucesso!`);
          }
        },
      },
    ];

    // Abrir drawer de criação
    const handleOpenCreateDrawer = () => {
      setSelectedRow(null);
      setCarreiraFormData({ nome: '', status: 'Ativa' });
      setIsDrawerOpen(true);
    };

    // Campos do formulário
    const carreirasFormFields: FormField[] = [
      {
        name: 'nome',
        label: 'Nome da Carreira',
        type: 'text',
        placeholder: 'Ex: Tecnologia da Informação',
        required: true,
        value: carreiraFormData.nome,
        onChange: (value) =>
          setCarreiraFormData({ ...carreiraFormData, nome: value }),
      },
    ];

    // Submeter formulário
    const handleCarreiraFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (selectedRow) {
        // Editar carreira existente
        atualizarCarreira(selectedRow.id, {
          nome: carreiraFormData.nome,
          status: carreiraFormData.status,
        });
        toast.success('Carreira atualizada com sucesso!');
      } else {
        // Criar nova carreira — jornadas nunca é lido diretamente na
        // exibição (sempre calculado via jornadasDoContexto.filter), então
        // começa em 0 por convenção, igual às outras carreiras existentes.
        const newCarreira: Carreira = {
          id: generateId('carreira'),
          nome: carreiraFormData.nome,
          status: carreiraFormData.status,
          jornadas: 0,
        };
        setCarreirasSortConfig({ column: 'id', direction: 'desc' });
        setCurrentPageCarreiras(1);
        adicionarCarreira(newCarreira);
        toast.success('Carreira criada com sucesso!');
      }

      setIsDrawerOpen(false);
      setSelectedRow(null);
      setCarreiraFormData({ nome: '', status: 'Ativa' });
    };

    // Desativar carreira
    const handleDesativarCarreira = () => {
      if (selectedRow) {
        atualizarCarreira(selectedRow.id, { status: 'Desativada' });
        toast.success(`Carreira "${selectedRow.nome}" desativada com sucesso!`);
        setIsModalOpen(false);
        setSelectedRow(null);
      }
    };

    const totalJornadasSelecionada = selectedRow
      ? jornadasDoContexto.filter(j => j.carreiraId === selectedRow.id).length
      : 0;

    return (
      <main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
        <div className="p-4 md:p-8">
          {/* Título da Página */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Carreiras</h1>
            <p className="text-sm text-gray-500 mt-1">Cada carreira agrupa jornadas de progressão de uma área funcional</p>
          </div>

          {/* Conteúdo */}
          <ListingPage
            primaryAction={{
              label: '+ Criar carreira',
              onClick: handleOpenCreateDrawer,
            }}
            columns={carreirasColumns}
            data={paginatedData}
            actions={carreirasActions}
            searchPlaceholder="Buscar carreira"
            onSearch={setBuscaCarreira}
            statusFilter={{
              value: statusFilterCarreiras,
              onChange: setStatusFilterCarreiras,
              options: [
                { value: 'todas', label: 'Todas' },
                { value: 'ativa', label: 'Ativas' },
                { value: 'desativada', label: 'Desativadas' },
              ],
            }}
            emptyState={{
              icon: <Briefcase className="w-8 h-8" />,
              title: carreirasData.length === 0 ? 'Nenhuma carreira cadastrada' : 'Nenhum resultado encontrado',
              description: carreirasData.length === 0 
                ? 'Comece criando a primeira carreira para estruturar as jornadas da organização.'
                : 'Não encontramos carreiras que correspondam aos filtros selecionados. Tente ajustar os critérios de busca.',
            }}
            pagination={{
              currentPage: currentPageCarreiras,
              itemsPerPage: itemsPerPageCarreiras,
              totalItems,
              onPageChange: handlePageChange,
              onItemsPerPageChange: handleItemsPerPageChange,
            }}
            onRowClick={(row) => navigate(`/carreiras/${row.id}`)}
          />

          <FormDrawer
            isOpen={isDrawerOpen}
            onClose={() => {
              setIsDrawerOpen(false);
              setSelectedRow(null);
              setCarreiraFormData({ nome: '', status: 'Ativa' });
            }}
            title={selectedRow ? 'Editar Carreira' : 'Nova Carreira'}
            fields={carreirasFormFields}
            onSubmit={handleCarreiraFormSubmit}
            submitLabel={selectedRow ? 'Salvar alterações' : 'Salvar'}
            alertBanner={
              selectedRow && totalJornadasSelecionada > 0
                ? {
                    title: 'Carreira vinculada',
                    description: `Esta carreira está vinculada a ${totalJornadasSelecionada} ${
                      totalJornadasSelecionada === 1 ? 'jornada' : 'jornadas'
                    }. Alterações no nome serão refletidas automaticamente ${
                      totalJornadasSelecionada === 1 ? 'nessa jornada' : 'nessas jornadas'
                    }.`,
                    variant: 'info',
                  }
                : undefined
            }
          />

          <ConfirmationModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedRow(null);
            }}
            onConfirm={handleDesativarCarreira}
            title="Desativar Carreira"
            message={
              selectedRow && totalJornadasSelecionada > 0
                ? `Esta carreira está vinculada a ${totalJornadasSelecionada} ${
                    totalJornadasSelecionada === 1 ? 'jornada' : 'jornadas'
                  }. Ao desativá-la, ela não poderá ser utilizada em novas estruturas de carreira.`
                : `Ao desativar a carreira "${selectedRow?.nome}", ela não será mais exibida nas listas ativas. Você poderá reativá-la posteriormente se necessário.`
            }
            confirmLabel="Desativar"
            cancelLabel="Cancelar"
            variant="warning"
          />
        </div>
      </main>
    );
  }

  // Módulo Avaliações
  if (selectedItem === 'avaliacoes') {
    // Filtrar dados baseado no filtro de status
    const getFilteredAvaliacoes = () => {
      return avaliacoesData.filter(item => {
        // Filtro de busca (nome, tipo)
        const matchBusca = buscaAvaliacao === '' || 
          item.nome.toLowerCase().includes(buscaAvaliacao.toLowerCase()) ||
          item.tipo.toLowerCase().includes(buscaAvaliacao.toLowerCase());
        
        // Filtro de status
        const matchStatus = statusFilterAvaliacoes === 'todas' || 
          item.status.toLowerCase() === statusFilterAvaliacoes.toLowerCase();
        
        return matchBusca && matchStatus;
      });
    };

    const dadosFiltrados = getFilteredAvaliacoes();

    const handleAvaliacoesSort = (column: 'nome' | 'tipo' | 'periodo' | 'status') => {
      setAvaliacoesSortConfig(prev =>
        prev.column === column
          ? { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
          : { column, direction: 'asc' }
      );
      setCurrentPageAvaliacoes(1);
    };

    const dadosOrdenados = [...dadosFiltrados].sort((a, b) => {
      if (avaliacoesSortConfig.column === 'id') {
        return 0; // manter ordem do array (novas avaliações inseridas no início)
      }
      const dir = avaliacoesSortConfig.direction === 'asc' ? 1 : -1;
      if (avaliacoesSortConfig.column === 'periodo') {
        return a.periodoInicio.localeCompare(b.periodoInicio) * dir;
      }
      return (a[avaliacoesSortConfig.column] as string).localeCompare(b[avaliacoesSortConfig.column] as string) * dir;
    });

    // Paginação
    const totalItems = dadosOrdenados.length;
    const startIndex = (currentPageAvaliacoes - 1) * itemsPerPageAvaliacoes;
    const endIndex = startIndex + itemsPerPageAvaliacoes;
    const paginatedData = dadosOrdenados.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
      setCurrentPageAvaliacoes(page);
    };

    const handleItemsPerPageChange = (items: number) => {
      setItemsPerPageAvaliacoes(items);
      setCurrentPageAvaliacoes(1);
    };

    // Colunas da tabela
    const avaliacoesColumns: Column[] = [
      {
        key: 'nome',
        label: 'Nome da Avaliação',
        width: '35%',
        renderHeader: () => (
          <button
            onClick={() => handleAvaliacoesSort('nome')}
            className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
          >
            Nome da Avaliação
            {avaliacoesSortConfig.column === 'nome' ? (
              avaliacoesSortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
            ) : (
              <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
            )}
          </button>
        ),
      },
      {
        key: 'periodo',
        label: 'Período',
        width: '15%',
        renderHeader: () => (
          <button
            onClick={() => handleAvaliacoesSort('periodo')}
            className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
          >
            Período
            {avaliacoesSortConfig.column === 'periodo' ? (
              avaliacoesSortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
            ) : (
              <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
            )}
          </button>
        ),
        render: (_value, row) => (
          <span className="text-sm text-gray-700">{formatDataCurta(row.periodoInicio)} - {formatDataLonga(row.periodoFim)}</span>
        ),
      },
      {
        key: 'participantes',
        label: 'Participantes',
        width: '15%',
        render: (_value, row) => {
          if (row.status === 'Rascunho') {
            return <span className="text-sm text-gray-500">-</span>;
          }
          const total: number = row.participantes.length;
          const concluidas: number = row.participantes.filter((p: ParticipanteAvaliacao) => p.status === 'Concluída').length;
          const progresso = total > 0 ? Math.round((concluidas / total) * 100) : 0;
          return (
            <div className="space-y-1">
              <div className="text-sm text-gray-700">{concluidas}/{total}</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-[var(--brand-600)] h-1.5 rounded-full transition-all"
                  style={{ width: `${progresso}%` }}
                />
              </div>
            </div>
          );
        },
      },
      {
        key: 'status',
        label: 'Status',
        width: '12%',
        renderHeader: () => (
          <button
            onClick={() => handleAvaliacoesSort('status')}
            className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
          >
            Status
            {avaliacoesSortConfig.column === 'status' ? (
              avaliacoesSortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
            ) : (
              <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
            )}
          </button>
        ),
        render: (value) => (
          <span
            className={`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full ${
              value === 'Ativa'
                ? 'bg-green-100 text-green-800'
                : value === 'Encerrada'
                ? 'bg-gray-100 text-gray-700'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {value}
          </span>
        ),
      },
    ];

    // Ações da tabela
    const avaliacoesActions: InlineAction[] = [
      {
        label: 'Visualizar',
        icon: <Eye className="w-4 h-4" />,
        onClick: (row) => navigate(`/avaliacoes/${row.id}`),
      },
      {
        label: 'Editar',
        icon: <Edit className="w-4 h-4" />,
        onClick: (row) => {
          setSelectedRow(row);
          const habilidadesSelecionadas: string[] = row.habilidades || [];
          const competenciasDerivadas = Array.from(new Set(
            habilidadesSelecionadas
              .map((hId: string) => habilidadesData.find((h) => h.id === hId)?.competenciaId)
              .filter((cId): cId is string => !!cId)
          ));
          setAvaliacaoFormData({
            nome: row.nome,
            descricao: row.descricao || '',
            competencias: competenciasDerivadas,
            habilidades: habilidadesSelecionadas,
            gerencias: parsePublicoLabelParaGerencias(row.publicoLabel),
            dataInicio: row.periodoInicio || '',
            dataFim: row.periodoFim || '',
          });
          setIsDrawerOpen(true);
        },
      },
      {
        label: 'Encerrar',
        icon: <StopCircle className="w-4 h-4" />,
        show: (row) => row.status === 'Ativa',
        onClick: (row) => {
          setSelectedRow(row);
          setIsModalOpen(true);
        },
      },
    ];

    // Abrir drawer de criação (novo fluxo multi-etapas)
    const handleOpenCreateDrawer = () => {
      setIsNovaAvaliacaoOpen(true);
    };

    // Callbacks do NovaAvaliacaoDrawer
    const formatDataCurta = (d: string) =>
      d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '';
    const formatDataLonga = (d: string) =>
      d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

    const handleNovaAvaliacaoRascunho = (data: NovaAvaliacaoFormData) => {
      const newAvaliacao: Avaliacao = {
        id: generateId('avaliacao'),
        nome: data.nome,
        tipo: 'Autoavaliação',
        status: 'Rascunho',
        periodoInicio: data.dataInicio,
        periodoFim: data.dataFim,
        publicoLabel: formatPublicoLabel(data.gerencias),
        descricao: data.descricao,
        habilidades: data.habilidades,
        participantes: [],
      };
      setAvaliacoesSortConfig({ column: 'id', direction: 'desc' });
      setCurrentPageAvaliacoes(1);
      adicionarAvaliacao(newAvaliacao);
      toast.success('Avaliação criada como rascunho!');
    };

    const handleNovaAvaliacaoAtivar = (data: NovaAvaliacaoFormData) => {
      const newAvaliacao: Avaliacao = {
        id: generateId('avaliacao'),
        nome: data.nome,
        tipo: 'Autoavaliação',
        status: 'Ativa',
        periodoInicio: data.dataInicio,
        periodoFim: data.dataFim,
        publicoLabel: formatPublicoLabel(data.gerencias),
        descricao: data.descricao,
        habilidades: data.habilidades,
        participantes: idsColaboradoresAlvo(data.gerencias).map((colaboradorId) => ({
          colaboradorId,
          status: 'Não iniciada' as const,
          respostas: [],
        })),
      };
      setAvaliacoesSortConfig({ column: 'id', direction: 'desc' });
      setCurrentPageAvaliacoes(1);
      adicionarAvaliacao(newAvaliacao);
      toast.success('Avaliação criada e ativada com sucesso!');
    };

    // Callbacks do modal de edição
    const handleEditRascunho = (data: typeof avaliacaoFormData) => {
      if (!selectedRow) return;
      atualizarAvaliacao(selectedRow.id, {
        nome: data.nome,
        descricao: data.descricao,
        periodoInicio: data.dataInicio,
        periodoFim: data.dataFim,
        publicoLabel: formatPublicoLabel(data.gerencias),
        habilidades: data.habilidades,
        status: 'Rascunho',
        participantes: [],
      });
      toast.success('Avaliação salva como rascunho!');
      setIsDrawerOpen(false);
      setSelectedRow(null);
    };

    const handleEditAtivar = (data: typeof avaliacaoFormData) => {
      if (!selectedRow) return;
      // Preserva participantes existentes (com respostas/status) que continuam
      // no público-alvo; remove quem saiu; adiciona quem entrou como novo
      // participante 'Não iniciada' — nunca descarta respostas já registradas.
      const idsAlvo = new Set(idsColaboradoresAlvo(data.gerencias));
      const participantesExistentes: ParticipanteAvaliacao[] = selectedRow.participantes ?? [];
      const preservados = participantesExistentes.filter((p) => idsAlvo.has(p.colaboradorId));
      const idsPreservados = new Set(preservados.map((p) => p.colaboradorId));
      const novos: ParticipanteAvaliacao[] = Array.from(idsAlvo)
        .filter((id) => !idsPreservados.has(id))
        .map((colaboradorId) => ({ colaboradorId, status: 'Não iniciada' as const, respostas: [] }));

      atualizarAvaliacao(selectedRow.id, {
        nome: data.nome,
        descricao: data.descricao,
        periodoInicio: data.dataInicio,
        periodoFim: data.dataFim,
        publicoLabel: formatPublicoLabel(data.gerencias),
        habilidades: data.habilidades,
        status: 'Ativa',
        participantes: [...preservados, ...novos],
      });
      toast.success('Avaliação ativada com sucesso!');
      setIsDrawerOpen(false);
      setSelectedRow(null);
    };

    // Encerrar avaliação
    const handleEncerrarAvaliacao = () => {
      if (selectedRow) {
        atualizarAvaliacao(selectedRow.id, { status: 'Encerrada' });
        toast.success(`Avaliação "${selectedRow.nome}" encerrada com sucesso!`);
        setIsModalOpen(false);
        setSelectedRow(null);
      }
    };

    return (
      <main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
        <div className="p-4 md:p-8">
          {/* Título da Página */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Avaliações</h1>
            <p className="text-sm text-gray-500 mt-1">Gerencie ciclos de avaliação de competências e desempenho</p>
          </div>

          {/* Conteúdo */}
          <ListingPage
            primaryAction={{
              label: '+ Criar avaliação',
              onClick: handleOpenCreateDrawer,
            }}
            columns={avaliacoesColumns}
            data={paginatedData}
            actions={avaliacoesActions}
            searchPlaceholder="Buscar avaliação"
            onSearch={setBuscaAvaliacao}
            statusFilter={{
              value: statusFilterAvaliacoes,
              onChange: setStatusFilterAvaliacoes,
              options: [
                { value: 'todas', label: 'Todas' },
                { value: 'rascunho', label: 'Rascunho' },
                { value: 'ativa', label: 'Ativas' },
                { value: 'encerrada', label: 'Encerradas' },
              ],
            }}
            emptyState={{
              icon: <ClipboardCheck className="w-8 h-8" />,
              title: avaliacoesData.length === 0 ? 'Nenhuma avaliação cadastrada' : 'Nenhum resultado encontrado',
              description: avaliacoesData.length === 0 
                ? 'Comece criando a primeira avaliação para iniciar o ciclo de desenvolvimento.'
                : 'Não encontramos avaliações que correspondam aos filtros selecionados. Tente ajustar os critérios de busca.',
            }}
            pagination={{
              currentPage: currentPageAvaliacoes,
              itemsPerPage: itemsPerPageAvaliacoes,
              totalItems,
              onPageChange: handlePageChange,
              onItemsPerPageChange: handleItemsPerPageChange,
            }}
          />

          <EditarAvaliacaoModal
            isOpen={isDrawerOpen}
            onClose={() => {
              setIsDrawerOpen(false);
              setSelectedRow(null);
            }}
            onSalvarRascunho={handleEditRascunho}
            onAtivar={handleEditAtivar}
            initialData={avaliacaoFormData}
            competencias={competencias}
            habilidades={habilidadesData}
          />

          <NovaAvaliacaoDrawer
            isOpen={isNovaAvaliacaoOpen}
            onClose={() => setIsNovaAvaliacaoOpen(false)}
            onSalvarRascunho={handleNovaAvaliacaoRascunho}
            onAtivar={handleNovaAvaliacaoAtivar}
            competencias={competencias}
            habilidades={habilidadesData}
          />

          <ConfirmationModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedRow(null);
            }}
            onConfirm={handleEncerrarAvaliacao}
            title="Encerrar Avaliação"
            message={
              selectedRow && selectedRow.status === 'Ativa'
                ? `Ao encerrar a avaliação "${selectedRow.nome}", os colaboradores não poderão mais responder. Os dados já coletados serão preservados.`
                : `Ao encerrar a avaliação "${selectedRow?.nome}", ela não estará disponível para os colaboradores.`
            }
            confirmLabel="Encerrar"
            cancelLabel="Cancelar"
            variant="warning"
          />
        </div>
      </main>
    );
  }

  // Renderizar página padrão para outras seções
  const getTitle = () => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      habilidades: 'Habilidades',
      competencias: 'Competências',
      niveis: 'Níveis de Habilidades',
      'habilidades-list': 'Habilidades',
      carreiras: 'Carreiras',
      avaliacoes: 'Avaliações',
      relatorios: 'Relatórios',
      configuracoes: 'Configurações',
    };
    return titles[selectedItem] || 'Dashboard';
  };

  const getDescription = () => {
    const descriptions: Record<string, string> = {
      dashboard: 'Visão geral do sistema e métricas principais',
      habilidades: 'Gestão de habilidades e competências',
      competencias: 'Defina e gerencie competências organizacionais',
      niveis: 'Configure os níveis de proficiência para avaliação',
      'habilidades-list': 'Catálogo de habilidades técnicas e comportamentais',
      carreiras: 'Planos de carreira e trilhas de desenvolvimento',
      avaliacoes: 'Gestão de avaliações de desempenho e competências',
      relatorios: 'Relatórios analíticos e indicadores',
      configuracoes: 'Configurações gerais do sistema',
    };
    return descriptions[selectedItem] || '';
  };

  return (
    <main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
      <div className="p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {getTitle()}
          </h1>
          <p className="text-sm text-gray-600 mt-2">{getDescription()}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <Award className="w-12 h-12 mx-auto mb-4" />
              <div className="text-base md:text-lg lg:text-xl mb-2">Área de Conteúdo</div>
              <div className="text-xs md:text-sm lg:text-base">
                O conteúdo de <span className="font-medium">{getTitle()}</span>{' '}
                será exibido aqui
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}