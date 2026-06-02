import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { RefreshCw, Users, Circle, Search, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Perfil {
  id: string;
  nome: string;
  cargo: string;
  gerencia: string;
  ultimoAcesso: string;
  status: 'Ativo' | 'Desativado';
  atualizacaoDisponivel: boolean;
}

interface PerfisProps {
  profilesData: Perfil[];
  onUpdateProfiles: (profiles: Perfil[]) => void;
}

type SortField = 'nome' | 'cargo' | 'gerencia' | 'ultimoAcesso' | 'status' | null;
type SortDirection = 'asc' | 'desc';

const mesesPt: Record<string, number> = {
  janeiro: 0, fevereiro: 1, março: 2, abril: 3, maio: 4, junho: 5,
  julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11,
};

function parsePtDate(str: string): number {
  const parts = str.toLowerCase().split(' de ');
  if (parts.length !== 3) return 0;
  return new Date(parseInt(parts[2]), mesesPt[parts[1]] ?? 0, parseInt(parts[0])).getTime();
}

export function Perfis({ profilesData, onUpdateProfiles }: PerfisProps) {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [statusFilter, setStatusFilter] = useState('ativa');
  const [gerenciaFilter, setGerenciaFilter] = useState('todas');
  const [cargoFilter, setCargoFilter] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Reset paginação quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [busca, statusFilter, gerenciaFilter, cargoFilter]);

  // Extrair gerências únicas
  const gerenciasUnicas = useMemo(() => {
    const gerencias = [...new Set(profilesData.map(p => p.gerencia))];
    return gerencias.sort();
  }, [profilesData]);

  // Extrair cargos únicos
  const cargosUnicos = useMemo(() => {
    const cargos = [...new Set(profilesData.map(p => p.cargo))];
    return cargos.sort();
  }, [profilesData]);

  // Função de ordenação
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtrar e ordenar perfis
  const perfisFiltrados = useMemo(() => {
    let filtered = profilesData.filter((perfil) => {
      const matchBusca =
        busca === '' ||
        perfil.nome.toLowerCase().includes(busca.toLowerCase()) ||
        perfil.cargo.toLowerCase().includes(busca.toLowerCase()) ||
        perfil.gerencia.toLowerCase().includes(busca.toLowerCase());

      let matchStatus = true;
      if (statusFilter === 'ativa') {
        matchStatus = perfil.status === 'Ativo';
      } else if (statusFilter === 'desativada') {
        matchStatus = perfil.status === 'Desativado';
      }

      const matchGerencia = gerenciaFilter === 'todas' || perfil.gerencia === gerenciaFilter;
      const matchCargo = cargoFilter === 'todos' || perfil.cargo === cargoFilter;

      return matchBusca && matchStatus && matchGerencia && matchCargo;
    });

    if (sortField) {
      filtered.sort((a, b) => {
        const dir = sortDirection === 'asc' ? 1 : -1;
        if (sortField === 'ultimoAcesso') {
          return (parsePtDate(a.ultimoAcesso) - parsePtDate(b.ultimoAcesso)) * dir;
        }
        const aValue = (a[sortField] as string).toLowerCase();
        const bValue = (b[sortField] as string).toLowerCase();
        if (aValue < bValue) return -1 * dir;
        if (aValue > bValue) return 1 * dir;
        return 0;
      });
    }

    return filtered;
  }, [profilesData, busca, statusFilter, gerenciaFilter, cargoFilter, sortField, sortDirection]);

  // Paginação
  const totalItems = perfisFiltrados.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const perfisPaginados = perfisFiltrados.slice(startIndex, endIndex);

  const hasData = perfisFiltrados.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Perfis</h1>
        <p className="text-sm text-gray-600 mt-2 text-[15px]">
          Visualize os perfis dos colaboradores sincronizados do sistema RM
        </p>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          {/* Campo de busca */}
          <div className="w-80 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, cargo ou gerência..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
            />
          </div>

          {/* Controle Segmentado de Status */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setStatusFilter('ativa')}
              className={`px-3 py-2 text-sm font-normal rounded-md transition-all ${
                statusFilter === 'ativa'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ativos
            </button>
            <button
              onClick={() => setStatusFilter('desativada')}
              className={`px-3 py-2 text-sm font-normal rounded-md transition-all ${
                statusFilter === 'desativada'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Desativados
            </button>
            <button
              onClick={() => setStatusFilter('todas')}
              className={`px-3 py-2 text-sm font-normal rounded-md transition-all ${
                statusFilter === 'todas'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Todos
            </button>
          </div>

          {/* Filtro de Gerência */}
          <Select value={gerenciaFilter} onValueChange={setGerenciaFilter}>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Todas as gerências" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as gerências</SelectItem>
              {gerenciasUnicas.map((gerencia) => (
                <SelectItem key={gerencia} value={gerencia}>
                  {gerencia}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filtro de Cargo */}
          <Select value={cargoFilter} onValueChange={setCargoFilter}>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Todos os cargos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os cargos</SelectItem>
              {cargosUnicos.map((cargo) => (
                <SelectItem key={cargo} value={cargo}>
                  {cargo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Espaçador flexível */}
          <div className="flex-1"></div>

          {/* Botão Sincronizar Todos */}
          <button
            onClick={() => {
              toast.success('Sincronização iniciada com sucesso!');
              onUpdateProfiles(profilesData.map((p) => ({ ...p, atualizacaoDisponivel: false })));
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Sincronizar Todos
          </button>
        </div>
      </div>

      {/* Table or Empty State */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <Users className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {busca ? 'Nenhum resultado encontrado' : 'Nenhum perfil encontrado'}
            </h3>
            <p className="text-sm text-gray-600 text-center max-w-md">
              {busca
                ? `Não encontramos resultados para "${busca}". Tente ajustar sua busca.`
                : 'Os perfis são sincronizados automaticamente do sistema RM.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider w-12"></th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort('nome')}
                        className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
                      >
                        Nome
                        {sortField === 'nome' ? (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        ) : (
                          <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort('cargo')}
                        className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
                      >
                        Cargo
                        {sortField === 'cargo' ? (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        ) : (
                          <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort('gerencia')}
                        className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
                      >
                        Gerência
                        {sortField === 'gerencia' ? (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        ) : (
                          <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort('ultimoAcesso')}
                        className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
                      >
                        Último Acesso
                        {sortField === 'ultimoAcesso' ? (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        ) : (
                          <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort('status')}
                        className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
                      >
                        Status
                        {sortField === 'status' ? (
                          sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        ) : (
                          <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3 text-right text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {perfisPaginados.map((perfil) => (
                    <tr 
                      key={perfil.id} 
                      className="transition-colors hover:bg-[rgba(0,159,194,0.06)] cursor-pointer"
                      onClick={(e) => {
                        // Não navegar se clicar em botões de ação
                        if (!(e.target as HTMLElement).closest('button')) {
                          navigate(`/perfis/${perfil.id}`);
                        }
                      }}
                    >
                      <td className="px-6 py-4 text-sm">
                        <div className="relative group">
                          <Circle
                            className={`w-2 h-2 ${
                              perfil.atualizacaoDisponivel
                                ? 'fill-red-500 text-red-500'
                                : 'fill-green-500 text-green-500'
                            }`}
                          />
                          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-56 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10 whitespace-normal">
                            {perfil.atualizacaoDisponivel
                              ? 'Dados desatualizados no RM. Recarregue para sincronizar'
                              : 'Dados sincronizados com o RM'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{perfil.nome}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{perfil.cargo}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{perfil.gerencia}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{perfil.ultimoAcesso}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            perfil.status === 'Ativo'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {perfil.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              toast.success(`Perfil de ${perfil.nome} sincronizado com sucesso!`);
                              onUpdateProfiles(
                                profilesData.map((p) =>
                                  p.id === perfil.id ? { ...p, atualizacaoDisponivel: false } : p
                                )
                              );
                            }}
                            title="Sincronizar"
                            className="p-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-100"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer de Paginação */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-700">
                Exibindo <span className="font-medium">{startIndex + 1}</span>–
                <span className="font-medium">{Math.min(endIndex, totalItems)}</span> de{' '}
                <span className="font-medium">{totalItems}</span> resultados
              </div>

              <div className="flex items-center gap-1 md:gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 md:px-3 py-1.5 md:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-3 md:w-4 h-3 md:h-4" />
                </button>

                <div className="flex items-center gap-0.5 md:gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`min-w-[32px] md:min-w-[40px] px-2 md:px-3 py-1.5 md:py-2 text-xs font-normal rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-gray-100 text-gray-900 border border-gray-200'
                            : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-2 md:px-3 py-1.5 md:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-3 md:w-4 h-3 md:h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}