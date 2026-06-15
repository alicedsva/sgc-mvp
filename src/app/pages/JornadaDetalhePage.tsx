import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router';
import { Plus, Edit, Trash2, AlertCircle, X, Search, MoreVertical, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { carreirasData, habilidadesData, niveisDefaultData, getCorFromPeso } from '../data/mockData';
import { useCarreiras, generateId } from '../context/CarreirasContext';
import { SelectionDrawer, SelectionItem } from '../components/templates/SelectionDrawer';
import { FormDrawer, FormField } from '../components/templates/FormDrawer';
import { ConfirmationModal } from '../components/templates/ConfirmationModal';
import { MatrizCell } from '../components/carreiras/MatrizCell';
import { HabilidadesSelectionModal, HabilidadeItem } from '../components/templates/HabilidadesSelectionModal';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast } from 'sonner';

interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}

interface Cargo {
  id: string;
  jornadaId: string;
  cargoRM: string;
  ordem: string;
  habilidadesConfiguradas: number;
  status: string;
}

interface CargoDisponivel {
  id: string;
  nome: string;
  categoria: string;
}

interface HabilidadeCargo {
  id: string;
  habilidadeId: string;
  habilidadeNome: string;
  categoria: string;
  nivelEsperado: string;
}

// Lista mockada de cargos disponíveis
const cargosDisponiveisRM: CargoDisponivel[] = [
  { id: 'rm1', nome: 'Desenvolvedor Junior', categoria: 'Tecnologia' },
  { id: 'rm2', nome: 'Desenvolvedor Pleno', categoria: 'Tecnologia' },
  { id: 'rm3', nome: 'Desenvolvedor Sênior', categoria: 'Tecnologia' },
  { id: 'rm4', nome: 'Tech Lead', categoria: 'Tecnologia' },
  { id: 'rm5', nome: 'Arquiteto de Software', categoria: 'Tecnologia' },
  { id: 'rm6', nome: 'Analista de Infraestrutura Junior', categoria: 'Tecnologia' },
  { id: 'rm7', nome: 'Analista de Infraestrutura Pleno', categoria: 'Tecnologia' },
  { id: 'rm8', nome: 'Analista de Infraestrutura Sênior', categoria: 'Tecnologia' },
  { id: 'rm9', nome: 'Analista de Dados Junior', categoria: 'Tecnologia' },
  { id: 'rm10', nome: 'Analista de Dados Pleno', categoria: 'Tecnologia' },
  { id: 'rm11', nome: 'Analista de Dados Sênior', categoria: 'Tecnologia' },
  { id: 'rm12', nome: 'Product Manager Junior', categoria: 'Produto' },
  { id: 'rm13', nome: 'Product Manager Pleno', categoria: 'Produto' },
  { id: 'rm14', nome: 'Product Manager Sênior', categoria: 'Produto' },
];


function JornadaDetalheContent() {
  const { carreiraId, jornadaId } = useParams();
  const navigate = useNavigate();
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();
  const {
    jornadas,
    cargos: todosOsCargos,
    habilidadesCargo: todasHabilidadesCargo,
    atualizarCargosJornada,
    atualizarJornada,
    removerJornada,
    adicionarCargo,
    atualizarCargo,
    removerCargo,
    atualizarHabilidadesCargo,
  } = useCarreiras();

  // Buscar dados
  const carreira = carreirasData.find(c => c.id === carreiraId);
  const jornada = jornadas.find(j => j.id === jornadaId);
  const cargosDaJornadaIniciais = todosOsCargos.filter(c => c.jornadaId === jornadaId);

  const [cargos, setCargos] = useState<Cargo[]>(cargosDaJornadaIniciais);
  const [cargoExpandido, setCargoExpandido] = useState<string | null>(null);
  const [isAddCargoDrawerOpen, setIsAddCargoDrawerOpen] = useState(false);
  const [isEditCargoDrawerOpen, setIsEditCargoDrawerOpen] = useState(false);
  const [cargoParaEditar, setCargoParaEditar] = useState<Cargo | null>(null);
  const [cargoParaExcluir, setCargoParaExcluir] = useState<Cargo | null>(null);
  const [jornadaParaExcluir, setJornadaParaExcluir] = useState<boolean>(false);
  const [editCargoFormData, setEditCargoFormData] = useState({ nome: '' });

  // Estado do drawer de habilidades da matriz
  const [isHabilidadesMatrizDrawerOpen, setIsHabilidadesMatrizDrawerOpen] = useState(false);

  // Estado do menu dropdown de ações
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Estado do menu de ações por coluna de cargo
  const [openCargoMenu, setOpenCargoMenu] = useState<string | null>(null);

  // Estado do menu de contexto por linha de habilidade na matriz
  const [openHabilidadeMenu, setOpenHabilidadeMenu] = useState<string | null>(null);

  // Estado de confirmação de remoção de habilidade da matriz
  const [habilidadeParaRemover, setHabilidadeParaRemover] = useState<{ id: string; nome: string } | null>(null);

  // Estado do modo completude (overlay visual de células definidas vs pendentes)
  const [modoCompletude, setModoCompletude] = useState(false);

  // Estado da busca de habilidades
  const [searchText, setSearchText] = useState('');

  // Estado de alterações não salvas na matriz
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [habilidadesNaMatriz, setHabilidadesNaMatriz] = useState<Array<{
    id: string;
    nome: string;
    tipo: 'Técnica' | 'Comportamental';
    competencia: string;
    niveis: Array<{ nivelId: string; criterio: string }>;
  }>>([]);

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Fechar menu de cargo ao clicar fora
  useEffect(() => {
    if (!openCargoMenu) return;
    function handleClick() { setOpenCargoMenu(null); }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [openCargoMenu]);

  // Fechar menu de habilidade ao clicar fora
  useEffect(() => {
    if (!openHabilidadeMenu) return;
    function handleClick() { setOpenHabilidadeMenu(null); }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [openHabilidadeMenu]);

  // Estado da matriz de níveis — chaveado por [habilidadeId][cargoId]
  const [matrizNiveis, setMatrizNiveis] = useState<Record<string, Record<string, string | null>>>({});

  const handleCellChange = (habilidadeId: string, cargo: string, nivel: string | null) => {
    setMatrizNiveis(prev => ({
      ...prev,
      [habilidadeId]: {
        ...prev[habilidadeId],
        [cargo]: nivel,
      },
    }));
    setHasUnsavedChanges(true);
  };

  // Salvar alterações da matriz explicitamente
  const handleSalvarMatriz = () => {
    if (!hasUnsavedChanges) return;

    cargos.forEach(cargo => {
      const habilidadesDocargo: { id: string; cargoId: string; habilidadeId: string; nivelEsperado: string }[] = [];

      habilidadesNaMatriz.forEach(hab => {
        const nivel = matrizNiveis[hab.id]?.[cargo.id];
        if (nivel === null || nivel === undefined) return;
        habilidadesDocargo.push({
          id: generateId('hc'),
          cargoId: cargo.id,
          habilidadeId: hab.id,
          nivelEsperado: nivel,
        });
      });

      atualizarHabilidadesCargo(cargo.id, habilidadesDocargo);
    });

    setHasUnsavedChanges(false);
    toast.success('Alterações salvas com sucesso');
  };

  // Calcular progresso por cargo
  const calcularProgresso = (cargoKey: string) => {
    const total = habilidadesNaMatriz.length;
    const configuradas = habilidadesNaMatriz.filter(hab => {
      const nivel = matrizNiveis[hab.id]?.[cargoKey];
      // Considera configurada se tem um nível OU se está marcada como "não exigido"
      return nivel !== null && nivel !== undefined;
    }).length;
    return { configuradas, total, percentual: total > 0 ? (configuradas / total) * 100 : 0 };
  };

  const moveCargo = useCallback((dragIndex: number, hoverIndex: number) => {
    setCargos((prevCargos) => {
      const newCargos = [...prevCargos];
      const [removed] = newCargos.splice(dragIndex, 1);
      newCargos.splice(hoverIndex, 0, removed);
      
      atualizarCargosJornada(jornadaId!, newCargos);
      
      return newCargos;
    });
  }, [jornadaId, atualizarCargosJornada]);

  // Cargos já adicionados na jornada
  const cargosJaAdicionadosNomes = cargos.map(c => c.cargoRM);

  // Itens disponíveis para adicionar
  const cargosDisponiveis: SelectionItem[] = cargosDisponiveisRM
    .filter(cargo => !cargosJaAdicionadosNomes.includes(cargo.nome))
    .map(cargo => ({
      id: cargo.id,
      label: cargo.nome,
      sublabel: cargo.categoria,
    }));

  // Adicionar cargos
  const handleAdicionarCargos = (selectedIds: string[]) => {
    const novosCargos: Cargo[] = selectedIds.map((cargoRmId) => {
      const cargoRM = cargosDisponiveisRM.find(c => c.id === cargoRmId);
      return {
        id: generateId('cargo'),
        jornadaId: jornadaId!,
        cargoRM: cargoRM?.nome || '',
        ordem: 'Júnior',
        habilidadesConfiguradas: 0,
        status: 'Pendente',
      };
    });

    novosCargos.forEach(cargo => adicionarCargo(cargo));
    setCargos([...cargos, ...novosCargos]);
    
    toast.success(`${novosCargos.length} ${novosCargos.length === 1 ? 'cargo adicionado' : 'cargos adicionados'}`);
  };

  // Editar cargo
  const handleEditarCargo = (cargo: Cargo) => {
    setCargoParaEditar(cargo);
    setEditCargoFormData({ nome: cargo.cargoRM });
    setIsEditCargoDrawerOpen(true);
  };

  const handleSalvarEdicaoCargo = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editCargoFormData.nome.trim()) {
      toast.error('Preencha o nome do cargo');
      return;
    }

    atualizarCargo(cargoParaEditar!.id, {
      cargoRM: editCargoFormData.nome,
    });

    setCargos(cargos.map(c => 
      c.id === cargoParaEditar!.id ? { ...c, cargoRM: editCargoFormData.nome } : c
    ));

    toast.success('Cargo atualizado');
    setIsEditCargoDrawerOpen(false);
    setCargoParaEditar(null);
  };

  // Excluir cargo
  const handleExcluirCargo = (cargo: Cargo) => {
    setCargoParaExcluir(cargo);
  };

  const handleConfirmarExclusaoCargo = () => {
    if (cargoParaExcluir) {
      removerCargo(cargoParaExcluir.id);
      setCargos(cargos.filter(c => c.id !== cargoParaExcluir.id));
      
      // Fechar accordion se estiver aberto
      if (cargoExpandido === cargoParaExcluir.id) {
        setCargoExpandido(null);
      }
      
      toast.success('Cargo removido da jornada');
      setCargoParaExcluir(null);
    }
  };

  // Remover habilidade
  const handleRemoverHabilidade = (cargoId: string, habilidadeCargoId: string) => {
    const habilidadesAtualizadas = todasHabilidadesCargo
      .filter(h => h.cargoId === cargoId && h.id !== habilidadeCargoId)
      .map(h => ({
        id: h.id,
        cargoId: h.cargoId,
        habilidadeId: h.habilidadeId,
        nivelEsperado: h.nivelEsperado,
      }));

    atualizarHabilidadesCargo(cargoId, habilidadesAtualizadas);
    toast.success('Habilidade removida');
  };

  // Alterar nível de habilidade
  const handleAlterarNivel = (cargoId: string, habilidadeCargoId: string, novoNivel: string) => {
    const habilidadesAtualizadas = todasHabilidadesCargo
      .filter(h => h.cargoId === cargoId)
      .map(h => ({
        id: h.id,
        cargoId: h.cargoId,
        habilidadeId: h.habilidadeId,
        nivelEsperado: h.id === habilidadeCargoId ? novoNivel : h.nivelEsperado,
      }));

    atualizarHabilidadesCargo(cargoId, habilidadesAtualizadas);
  };

  // Editar jornada
  const handleEditarJornada = () => {
    navigate(`/carreiras/${carreiraId}/jornadas/${jornadaId}/editar`);
  };

  // Excluir jornada
  const handleExcluirJornada = () => {
    setJornadaParaExcluir(true);
  };

  const handleConfirmarExclusaoJornada = () => {
    removerJornada(jornadaId!);
    toast.success('Jornada excluída');
    navigate(`/carreiras/${carreiraId}`);
  };

  // Toggle status da jornada
  const handleToggleStatus = () => {
    const novoStatus = jornada!.status === 'Ativa' ? 'Inativa' : 'Ativa';
    atualizarJornada(jornadaId!, { status: novoStatus });
    toast.success(`Jornada ${novoStatus === 'Ativa' ? 'ativada' : 'desativada'}`);
  };

  // Remover habilidade da matriz
  const handleRemoverHabilidadeMatriz = (habId: string) => {
    setHabilidadesNaMatriz(prev => prev.filter(h => h.id !== habId));
    setMatrizNiveis(prev => {
      const next = { ...prev };
      delete next[habId];
      return next;
    });
    setHasUnsavedChanges(true);
    toast.success('Habilidade removida da matriz');
  };

  // Adicionar/remover habilidades da matriz via modal
  const handleAdicionarHabilidadesMatriz = (toAdd: string[], toRemove: string[]) => {
    const novas = toAdd
      .filter(id => !habilidadesNaMatriz.some(h => h.id === id))
      .map(id => {
        const hab = habilidadesData.find(h => h.id === id)!;
        return {
          id: hab.id,
          nome: hab.nome,
          tipo: hab.tipo as 'Técnica' | 'Comportamental',
          competencia: hab.competencia,
          niveis: hab.niveis || [],
        };
      });

    if (novas.length > 0 || toRemove.length > 0) {
      setHabilidadesNaMatriz(prev => [
        ...prev.filter(h => !toRemove.includes(h.id)),
        ...novas,
      ]);
      if (toRemove.length > 0) {
        setMatrizNiveis(prev => {
          const next = { ...prev };
          toRemove.forEach(id => delete next[id]);
          return next;
        });
      }
      setHasUnsavedChanges(true);
      const parts: string[] = [];
      if (novas.length > 0) parts.push(`${novas.length} ${novas.length === 1 ? 'habilidade adicionada' : 'habilidades adicionadas'}`);
      if (toRemove.length > 0) parts.push(`${toRemove.length} ${toRemove.length === 1 ? 'habilidade removida' : 'habilidades removidas'}`);
      toast.success(parts.join(' · '));
    }
  };

  // Preparar dados de habilidades para o drawer
  const habilidadesDisponiveisParaMatriz = useMemo(() => {
    return habilidadesData.map(h => ({
      id: h.id,
      nome: h.nome,
      tipo: h.tipo as 'Técnica' | 'Comportamental',
      competencia: h.competencia,
    }));
  }, []);

  const habilidadesJaAdicionadasNaMatriz = habilidadesNaMatriz.map(h => h.id);

  // Habilidades filtradas para exibição na matriz
  const habilidadesFiltradas = useMemo(() => {
    let result = habilidadesNaMatriz;

    // Busca por texto
    if (searchText.trim()) {
      const query = searchText.toLowerCase();
      result = result.filter(hab =>
        hab.nome.toLowerCase().includes(query) ||
        hab.competencia.toLowerCase().includes(query)
      );
    }

    return result;
  }, [searchText, habilidadesNaMatriz, cargos, matrizNiveis]);

  // Enriquece os niveis de cada habilidade com nome, peso e critério — para passar ao MatrizCell
  const niveisEnriquecidosPorHabilidade = useMemo(() => {
    const niveisMap = Object.fromEntries(niveisDefaultData.map((n) => [n.id, n]));
    return Object.fromEntries(
      habilidadesNaMatriz.map((hab) => [
        hab.id,
        hab.niveis
          .map(({ nivelId, criterio }) => {
            const n = niveisMap[nivelId];
            return n ? { id: nivelId, nome: n.nome, peso: n.peso, criterio } : null;
          })
          .filter((n): n is { id: string; nome: string; peso: number; criterio: string } => n !== null),
      ])
    );
  }, [habilidadesNaMatriz]);

  // Total de habilidades com ao menos 1 cargo sem definição
  const totalHabilidadesIncompletas = useMemo(
    () =>
      habilidadesNaMatriz.filter((hab) =>
        cargos.some((cargo) => {
          const nivel = matrizNiveis[hab.id]?.[cargo.id];
          return nivel === null || nivel === undefined;
        })
      ).length,
    [habilidadesNaMatriz, cargos, matrizNiveis]
  );

  if (!carreira || !jornada) {
    return (
      <main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
        <div className="p-4 md:p-8">
          <div className="max-w-2xl mx-auto mt-16">
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {!carreira ? 'Carreira não encontrada' : 'Jornada não encontrada'}
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                {!carreira
                  ? 'Esta carreira não existe ou foi removida.'
                  : 'Esta jornada não existe ou foi removida.'}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => navigate('/carreiras')}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Voltar para carreiras
                </button>
                {carreira && (
                  <button
                    onClick={() => navigate(`/carreiras/${carreiraId}/jornadas/criar`)}
                    className="px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors"
                  >
                    Criar nova jornada
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Campos do formulário de edição de cargo
  const editCargoFields: FormField[] = [
    {
      name: 'nome',
      label: 'Nome do cargo',
      type: 'text',
      placeholder: 'Ex: Desenvolvedor Pleno',
      required: true,
      value: editCargoFormData.nome,
      onChange: (value) => setEditCargoFormData({ nome: value }),
    },
  ];

  return (
    <main className={`mt-16 flex flex-col bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''} h-[calc(100vh-4rem)]`}>
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <button
          onClick={() => navigate(`/carreiras/${carreiraId}`)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {carreira.nome}
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-semibold text-gray-900">{jornada.nome}</h1>
              <span className="text-sm text-gray-400 font-normal">{jornada.tipo}</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                jornada.status === 'Ativa'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${jornada.status === 'Ativa' ? 'bg-green-500' : 'bg-gray-400'}`} />
                {jornada.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Defina o nível esperado de cada habilidade por cargo.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                title="Mais opções"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => { setIsMenuOpen(false); handleEditarJornada(); }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Editar jornada
                  </button>
                  <button
                    onClick={() => { setIsMenuOpen(false); handleToggleStatus(); }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    {jornada.status === 'Ativa' ? (
                      <>
                        <X className="w-4 h-4" />
                        Desativar jornada
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Ativar jornada
                      </>
                    )}
                  </button>
                  <div className="my-1 border-t border-gray-100" />
                  <button
                    onClick={() => { setIsMenuOpen(false); handleExcluirJornada(); }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir jornada
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Matriz de Configuração */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden relative">
          {/* Linha de busca, filtros e ação */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
            <div className="w-56 flex-shrink-0 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Filtrar habilidades…"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-500)] focus:border-[var(--brand-500)] outline-none"
              />
            </div>

            {/* Modo completude */}
            <button
              onClick={() => setModoCompletude(!modoCompletude)}
              className={`flex-shrink-0 inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                modoCompletude
                  ? 'bg-[var(--brand-50)] border-[var(--brand-200)] text-[var(--brand-700)]'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              title="Destacar habilidades com cargos sem definição"
            >
              {modoCompletude ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              Habilidades incompletas
              {totalHabilidadesIncompletas > 0 && (
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold ${
                  modoCompletude ? 'bg-[var(--brand-100)] text-[var(--brand-700)]' : 'bg-gray-100 text-gray-600'
                }`}>
                  {totalHabilidadesIncompletas}
                </span>
              )}
            </button>

            <div className="flex-1" />
            <button onClick={() => setIsHabilidadesMatrizDrawerOpen(true)} className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <Plus className="w-4 h-4" />
              Gerenciar habilidades
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Cabeçalho */}
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-20">
                <tr>
                  <th className="sticky left-0 bg-gray-50 z-30 w-[220px] px-4 py-3 text-left">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Habilidade</span>
                  </th>
                  {cargos.map((cargo) => {
                    const { configuradas, total, percentual } = calcularProgresso(cargo.id);
                    const barColor = percentual === 100 ? '#16A34A' : percentual > 0 ? '#F59E0B' : '#E5E7EB';
                    const textColor = percentual === 100 ? '#16A34A' : '#6B7280';

                    return (
                      <th key={cargo.id} className="px-4 py-3 text-center min-w-[160px] max-w-[240px] group/col relative">
                        <div className="flex flex-col items-center">
                          {/* Nome + botão de ações */}
                          <div className="flex items-center justify-center gap-0.5 w-full">
                            {/* overflow-hidden só aqui, para não clipar o dropdown absoluto */}
                            <div className="flex-1 min-w-0 overflow-hidden">
                              <span
                                className="block text-sm font-medium text-gray-900 truncate"
                                title={cargo.cargoRM}
                              >
                                {cargo.cargoRM}
                              </span>
                            </div>
                            <div className="relative flex-shrink-0 w-5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenCargoMenu(openCargoMenu === cargo.id ? null : cargo.id);
                                }}
                                className="p-0.5 text-gray-300 hover:text-gray-600 rounded transition-colors"
                                title="Opções do cargo"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>
                              {openCargoMenu === cargo.id && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[200]">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenCargoMenu(null);
                                      handleExcluirCargo(cargo);
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 whitespace-nowrap"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Remover cargo
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Barra de progresso com contador — C */}
                          <div
                            className="w-full mt-2 flex items-center gap-1.5"
                            title={`${configuradas} de ${total} habilidades definidas${percentual === 100 ? ' — completo' : ''}`}
                          >
                            <div className="flex-1 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{ width: `${percentual}%`, backgroundColor: barColor }}
                              />
                            </div>
                            <span className="text-[10px] font-medium flex-shrink-0" style={{ color: textColor }}>
                              {configuradas}/{total}
                            </span>
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {cargos.length === 0 ? (
                  <tr>
                    <td className="px-4 py-12 text-center text-sm text-gray-500">
                      Nenhum cargo adicionado. Use o botão "Adicionar cargo" para começar.
                    </td>
                  </tr>
                ) : habilidadesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={cargos.length + 1} className="px-4 py-12 text-center text-sm text-gray-500">
                      Nenhuma habilidade adicionada à matriz.
                    </td>
                  </tr>
                ) : (
                  (() => {
                    const renderedCompetencias = new Set<string>();
                    return habilidadesFiltradas.flatMap((hab, habIndex) => {
                      const isFirstInGroup = !renderedCompetencias.has(hab.competencia);
                      if (isFirstInGroup) renderedCompetencias.add(hab.competencia);
                      const bgClass = habIndex % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]';
                      const rows = [];

                      if (isFirstInGroup) {
                        rows.push(
                          <tr key={`group-${hab.competencia}`}>
                            <td colSpan={cargos.length + 1} className="bg-[#F3F4F6] px-4 py-2">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{hab.competencia}</span>
                            </td>
                          </tr>
                        );
                      }

                      rows.push(
                        <tr key={hab.id} className={`${bgClass} group`}>
                          <td className={`sticky left-0 ${bgClass} group-hover:bg-gray-50 px-4 py-3 z-10`}>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-900 flex-1">{hab.nome}</span>
                              <div className="relative flex-shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenHabilidadeMenu(openHabilidadeMenu === hab.id ? null : hab.id);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-300 hover:text-gray-600 rounded transition-all"
                                  title="Opções da habilidade"
                                >
                                  <MoreVertical className="w-3.5 h-3.5" />
                                </button>
                                {openHabilidadeMenu === hab.id && (
                                  <div className="absolute left-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[200]">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenHabilidadeMenu(null);
                                        setHabilidadeParaRemover({ id: hab.id, nome: hab.nome });
                                      }}
                                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 whitespace-nowrap"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      Remover habilidade
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          {cargos.map((cargo) => {
                            const cellNivel = matrizNiveis[hab.id]?.[cargo.id];
                            const isDefined = cellNivel !== null && cellNivel !== undefined;
                            // A — modo completude: verde se definida, âmbar se pendente
                            const completudeBg = modoCompletude
                              ? isDefined
                                ? 'bg-green-50 group-hover:bg-green-100'
                                : 'bg-amber-50 group-hover:bg-amber-100'
                              : 'group-hover:bg-gray-50';
                            return (
                              <td key={cargo.id} className={`px-4 py-3 text-center transition-colors ${completudeBg}`}>
                                <MatrizCell
                                  nivel={cellNivel || null}
                                  onChange={(nivel) => handleCellChange(hab.id, cargo.id, nivel)}
                                  niveisAplicaveis={niveisEnriquecidosPorHabilidade[hab.id]}
                                />
                              </td>
                            );
                          })}
                        </tr>
                      );

                      return rows;
                    });
                  })()
                )}
              </tbody>
            </table>
          </div>
          
          {/* Fade horizontal */}
          <div className="absolute top-0 right-0 bottom-0 w-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
        </div>

      </div>

      {/* Drawer de adicionar cargos */}
      <SelectionDrawer
        isOpen={isAddCargoDrawerOpen}
        onClose={() => setIsAddCargoDrawerOpen(false)}
        title="Adicionar cargos"
        description="Selecione os cargos que deseja adicionar à jornada"
        items={cargosDisponiveis}
        onConfirm={handleAdicionarCargos}
        searchPlaceholder="Buscar cargo..."
        emptyMessage="Todos os cargos já foram adicionados"
        confirmLabel="Adicionar selecionados"
      />

      {/* Drawer de habilidades da matriz */}
      <HabilidadesSelectionModal
        isOpen={isHabilidadesMatrizDrawerOpen}
        onClose={() => setIsHabilidadesMatrizDrawerOpen(false)}
        habilidades={habilidadesDisponiveisParaMatriz}
        habilidadesAdicionadas={habilidadesJaAdicionadasNaMatriz}
        onConfirm={handleAdicionarHabilidadesMatriz}
      />

      {/* Drawer de editar cargo */}
      <FormDrawer
        isOpen={isEditCargoDrawerOpen}
        onClose={() => {
          setIsEditCargoDrawerOpen(false);
          setCargoParaEditar(null);
        }}
        title="Editar cargo"
        fields={editCargoFields}
        onSubmit={handleSalvarEdicaoCargo}
        submitLabel="Salvar alterações"
      />

      {/* Modal de confirmação de exclusão de cargo */}
      <ConfirmationModal
        isOpen={!!cargoParaExcluir}
        onClose={() => setCargoParaExcluir(null)}
        onConfirm={handleConfirmarExclusaoCargo}
        title="Remover cargo?"
        message="Esta ação irá remover o cargo da jornada. Todas as habilidades configuradas serão perdidas."
        confirmLabel="Remover"
        variant="danger"
      />

      {/* Modal de confirmação de remoção de habilidade da matriz */}
      <ConfirmationModal
        isOpen={!!habilidadeParaRemover}
        onClose={() => setHabilidadeParaRemover(null)}
        onConfirm={() => {
          if (habilidadeParaRemover) {
            handleRemoverHabilidadeMatriz(habilidadeParaRemover.id);
            setHabilidadeParaRemover(null);
          }
        }}
        title={`Remover ${habilidadeParaRemover?.nome ?? 'habilidade'} desta jornada?`}
        message="Os níveis configurados para esta habilidade serão perdidos."
        confirmLabel="Remover"
        variant="danger"
      />

      {/* Modal de confirmação de exclusão de jornada */}
      <ConfirmationModal
        isOpen={jornadaParaExcluir}
        onClose={() => setJornadaParaExcluir(false)}
        onConfirm={handleConfirmarExclusaoJornada}
        title="Excluir jornada?"
        message="Esta ação não pode ser desfeita. Todos os cargos e habilidades configurados serão removidos."
        confirmLabel="Excluir"
        variant="danger"
      />

      {/* Barra de salvar — aparece quando há alterações não salvas, fora da área de scroll */}
      <div className={`bg-white border-t border-gray-200 overflow-hidden transition-all duration-300 ${hasUnsavedChanges ? 'max-h-20 py-3' : 'max-h-0 py-0'}`}>
        <div className="flex items-center justify-between px-4 md:px-8">
          <span className="text-sm text-gray-500">Alterações não salvas</span>
          <button
            onClick={handleSalvarMatriz}
            className="px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors"
          >
            Salvar alterações
          </button>
        </div>
      </div>
    </main>
  );
}

export default function JornadaDetalhePage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <JornadaDetalheContent />
    </DndProvider>
  );
}