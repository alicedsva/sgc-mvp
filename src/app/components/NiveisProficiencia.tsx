import { useState } from 'react';
import { Search, Plus, Edit, Archive, X, RotateCcw, Pencil, ArrowUp, ArrowDown } from 'lucide-react';
import { ToggleSwitch } from './ui/ToggleSwitch';
import { ConfirmationModal } from './templates/ConfirmationModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { getCorFromPeso } from '../data/mockData';

const DESCRICOES_POR_PESO: Record<number, string> = {
  1: 'Conhecimento inicial. Realiza atividades simples com supervisão constante.',
  2: 'Executa tarefas com autonomia em situações conhecidas. Busca suporte em contextos novos.',
  3: 'Aplica conhecimento de forma consistente. Resolve problemas com pouca supervisão.',
  4: 'Atua com autonomia em situações complexas e orienta outros profissionais.',
  5: 'Referência na área. Define padrões, resolve problemas críticos e forma outros profissionais.',
};

interface Nivel {
  id: string;
  nome: string;
  descricao: string;
  peso: number;
  status: string;
  emUso?: number;
  arquivado?: boolean;
}

interface NiveisProficienciaProps {
  niveisData: Nivel[];
  onUpdateNiveis: (niveis: Nivel[]) => void;
}

export function NiveisProficiencia({ niveisData, onUpdateNiveis }: NiveisProficienciaProps) {
  const [busca, setBusca] = useState('');
  const [statusFilter, setStatusFilter] = useState('ativos');
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [nivelEditando, setNivelEditando] = useState<Nivel | null>(null);
  const [niveis, setNiveis] = useState<Nivel[]>(niveisData);
  const [modalArquivamentoAberto, setModalArquivamentoAberto] = useState(false);
  const [nivelParaArquivar, setNivelParaArquivar] = useState<Nivel | null>(null);
  const [modalDesativacaoAberto, setModalDesativacaoAberto] = useState(false);
  const [nivelParaDesativar, setNivelParaDesativar] = useState<Nivel | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    peso: 1,
    status: 'Ativo',
  });

  const [erros, setErros] = useState<Record<string, string>>({});
  const [descricaoEmEdicao, setDescricaoEmEdicao] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ column: 'nome' | 'peso'; direction: 'asc' | 'desc' }>({
    column: 'peso',
    direction: 'asc',
  });

  const handleSort = (column: 'nome' | 'peso') => {
    setSortConfig(prev =>
      prev.column === column
        ? { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { column, direction: 'asc' }
    );
  };

  // Filtrar níveis por status
  const niveisFiltrados = niveis.filter((nivel) => {
    const matchBusca =
      busca === '' ||
      nivel.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (nivel.descricao && nivel.descricao.toLowerCase().includes(busca.toLowerCase()));

    let matchStatus = true;
    if (statusFilter === 'ativos') {
      matchStatus = nivel.status === 'Ativo' && !nivel.arquivado;
    } else if (statusFilter === 'desativados') {
      matchStatus = nivel.status === 'Desativado' && !nivel.arquivado;
    } else if (statusFilter === 'arquivados') {
      matchStatus = nivel.arquivado === true;
    } else if (statusFilter === 'todos') {
      matchStatus = !nivel.arquivado;
    }

    return matchBusca && matchStatus;
  });

  const niveisOrdenados = [...niveisFiltrados].sort((a, b) => {
    const dir = sortConfig.direction === 'asc' ? 1 : -1;
    if (sortConfig.column === 'peso') {
      if (a.peso !== b.peso) return (a.peso - b.peso) * dir;
      return a.nome.localeCompare(b.nome);
    }
    return a.nome.localeCompare(b.nome) * dir;
  });

  const abrirDrawerNovo = () => {
    setNivelEditando(null);
    setFormData({ nome: '', descricao: '', peso: 0, status: '' });
    setErros({});
    setDescricaoEmEdicao(false);
    setDrawerAberto(true);
  };

  const abrirDrawerEdicao = (nivel: Nivel) => {
    setNivelEditando(nivel);
    setFormData({ nome: nivel.nome, descricao: nivel.descricao, peso: nivel.peso, status: nivel.status });
    setErros({});
    setDescricaoEmEdicao(false);
    setDrawerAberto(true);
  };

  const fecharDrawer = () => {
    setDrawerAberto(false);
    setTimeout(() => {
      setNivelEditando(null);
      setFormData({ nome: '', descricao: '', peso: 0, status: '' });
      setErros({});
    }, 300);
  };

  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};
    if (!formData.nome.trim()) novosErros.nome = 'Nome do nível é obrigatório';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const salvarNivel = () => {
    if (!validarFormulario()) return;

    if (nivelEditando) {
      const niveisAtualizados = niveis.map((n) =>
        n.id === nivelEditando.id ? { ...n, ...formData } : n
      );
      setNiveis(niveisAtualizados);
      onUpdateNiveis(niveisAtualizados);
    } else {
      const novoNivel: Nivel = {
        id: Date.now().toString(),
        nome: formData.nome,
        descricao: formData.descricao,
        peso: formData.peso,
        status: formData.status,
        emUso: 0,
        arquivado: false,
      };
      const niveisAtualizados = [...niveis, novoNivel];
      setNiveis(niveisAtualizados);
      onUpdateNiveis(niveisAtualizados);
    }

    fecharDrawer();
  };

  const abrirModalArquivamento = (id: string) => {
    const nivel = niveis.find((n) => n.id === id);
    if (!nivel) return;
    setNivelParaArquivar(nivel);
    setModalArquivamentoAberto(true);
  };

  const confirmarArquivamento = () => {
    if (!nivelParaArquivar) return;

    const niveisAtualizados = niveis.map((n) =>
      n.id === nivelParaArquivar.id ? { ...n, arquivado: true } : n
    );
    setNiveis(niveisAtualizados);
    onUpdateNiveis(niveisAtualizados);

    setModalArquivamentoAberto(false);
    setNivelParaArquivar(null);
  };

  const fecharModalArquivamento = () => {
    setModalArquivamentoAberto(false);
    setNivelParaArquivar(null);
  };

  const handleToggleStatus = (id: string) => {
    const nivel = niveis.find((n) => n.id === id);
    if (!nivel) return;

    if (nivel.status === 'Ativo') {
      setNivelParaDesativar(nivel);
      setModalDesativacaoAberto(true);
    } else {
      const niveisAtualizados = niveis.map((n) =>
        n.id === id ? { ...n, status: 'Ativo' } : n
      );
      setNiveis(niveisAtualizados);
      onUpdateNiveis(niveisAtualizados);
    }
  };

  const confirmarDesativacao = () => {
    if (!nivelParaDesativar) return;

    const niveisAtualizados = niveis.map((n) =>
      n.id === nivelParaDesativar.id ? { ...n, status: 'Desativado' } : n
    );
    setNiveis(niveisAtualizados);
    onUpdateNiveis(niveisAtualizados);

    setModalDesativacaoAberto(false);
    setNivelParaDesativar(null);
  };

  const fecharModalDesativacao = () => {
    setModalDesativacaoAberto(false);
    setNivelParaDesativar(null);
  };

  const restaurarNivel = (id: string) => {
    const niveisAtualizados = niveis.map((n) =>
      n.id === id ? { ...n, arquivado: false, status: 'Desativado' } : n
    );
    setNiveis(niveisAtualizados);
    onUpdateNiveis(niveisAtualizados);
  };

  return (
    <>
      <div className="space-y-6 relative">
        {/* Barra de busca, filtros e ações */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
          {/* Mobile: Layout vertical */}
          <div className="flex flex-col gap-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar nível"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
              />
            </div>

            <div className="overflow-x-auto -mx-3 px-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1 min-w-max">
                {['todos', 'ativos', 'desativados', 'arquivados'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-3 py-2 text-sm font-normal rounded-md transition-all whitespace-nowrap ${
                      statusFilter === f
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop: Layout horizontal */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-80 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar nível"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
              />
            </div>

            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {['todos', 'ativos', 'desativados', 'arquivados'].map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-2 text-sm font-normal rounded-md transition-all ${
                    statusFilter === f
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex-1" />

            <button
              onClick={abrirDrawerNovo}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors"
            >
              + Criar nível
            </button>
          </div>
        </div>

        {/* Tabela de níveis */}
        {niveisFiltrados.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-sm md:text-base lg:text-lg font-medium text-gray-900 mb-2">
                {statusFilter === 'arquivados' ? 'Nenhum nível arquivado' : 'Nenhum nível encontrado'}
              </h3>
              <p className="text-xs md:text-sm lg:text-base text-gray-500 max-w-md">
                {busca || statusFilter !== 'todos'
                  ? 'Tente ajustar sua busca ou limpar os filtros.'
                  : 'Comece criando um novo nível de proficiência.'}
              </p>
            </div>
          </div>
        ) : statusFilter === 'arquivados' ? (
          // Lista de arquivados
          <div className="space-y-2">
            {niveisFiltrados.map((nivel) => (
              <div key={nivel.id} className="bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4 p-4">
                  <div className="flex-1 flex items-center gap-3">
                    <div
                      className="px-2.5 py-1 rounded-full text-xs font-medium opacity-60"
                      style={{ backgroundColor: getCorFromPeso(nivel.peso), color: '#FFFFFF' }}
                    >
                      {nivel.nome}
                    </div>
                    <span className="text-sm text-gray-400 line-clamp-1">{nivel.descricao}</span>
                  </div>

                  <div className="w-20 text-center">
                    <span className="text-sm font-semibold text-gray-400">{nivel.peso}</span>
                    <p className="text-xs text-gray-400">Peso</p>
                  </div>

                  <div className="w-40 text-right pr-2">
                    {nivel.emUso && nivel.emUso > 0 ? (
                      <span className="text-xs text-gray-400">
                        {nivel.emUso} {nivel.emUso === 1 ? 'habilidade' : 'habilidades'}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>

                  <div className="w-24">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                      Arquivado
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => restaurarNivel(nivel.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Restaurar nível"
                    >
                      <RotateCcw className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Tabela normal
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                    <button
                      onClick={() => handleSort('nome')}
                      className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
                    >
                      Nome do Nível
                      {sortConfig.column === 'nome' ? (
                        sortConfig.direction === 'asc'
                          ? <ArrowUp className="w-3 h-3" />
                          : <ArrowDown className="w-3 h-3" />
                      ) : (
                        <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                      )}
                    </button>
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    <button
                      onClick={() => handleSort('peso')}
                      className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
                    >
                      Progressão
                      {sortConfig.column === 'peso' ? (
                        sortConfig.direction === 'asc'
                          ? <ArrowUp className="w-3 h-3" />
                          : <ArrowDown className="w-3 h-3" />
                      ) : (
                        <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                      )}
                    </button>
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap w-40 md:w-48">
                    Habilidades Vinculadas
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                    Status
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-right text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider w-20 md:w-32">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {niveisOrdenados.map((nivel) => (
                  <tr key={nivel.id}>
                    {/* Nome do nível */}
                    <td className="px-6 py-4">
                      <div
                        className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                        style={{ backgroundColor: getCorFromPeso(nivel.peso), color: '#FFFFFF' }}
                      >
                        {nivel.nome}
                      </div>
                    </td>

                    {/* Descrição */}
                    <td className="px-6 py-4">
                      <div className="relative group max-w-md">
                        <span className="text-sm text-gray-700 block truncate">
                          {nivel.descricao || <span className="text-gray-400">—</span>}
                        </span>
                        {nivel.descricao && (
                          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-80 p-3 bg-gray-900 text-white text-xs rounded shadow-lg z-10 whitespace-normal">
                            {nivel.descricao}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Progressão */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{nivel.peso}</span>
                    </td>

                    {/* Habilidades vinculadas */}
                    <td className="px-6 py-4">
                      {nivel.emUso && nivel.emUso > 0 ? (
                        <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                          <span className="font-medium">{nivel.emUso}</span>
                          <span className="text-gray-500">
                            {nivel.emUso === 1 ? 'habilidade' : 'habilidades'}
                          </span>
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          nivel.status === 'Ativo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {nivel.status === 'Ativo' ? 'Ativo' : 'Desativado'}
                      </span>
                    </td>

                    {/* Ações */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => abrirDrawerEdicao(nivel)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Editar nível"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <div className="flex items-center">
                          <ToggleSwitch
                            checked={nivel.status === 'Ativo'}
                            onChange={() => handleToggleStatus(nivel.id)}
                          />
                        </div>
                        {nivel.status === 'Desativado' && (
                          <button
                            onClick={() => abrirModalArquivamento(nivel.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Arquivar nível"
                          >
                            <Archive className="w-4 h-4 text-gray-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer de formulário */}
      {drawerAberto && (
        <>
          <div
            className="fixed inset-0 ml-64 mt-16 bg-black/20 z-40 transition-opacity duration-200 ease-out"
            onClick={fecharDrawer}
          />

          <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-[35%] max-w-xl min-w-[400px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
            <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900">
                  {nivelEditando ? 'Editar Nível' : 'Novo Nível'}
                </h2>
                <button
                  onClick={fecharDrawer}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-5">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Básico, Intermediário, Avançado"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] ${
                      erros.nome ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {erros.nome && <p className="text-xs text-red-600 mt-1">{erros.nome}</p>}
                </div>

                {/* Ordem de progressão */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordem de progressão *
                  </label>
                  <Select
                    value={formData.peso ? String(formData.peso) : ''}
                    onValueChange={(v) => {
                      const peso = Number(v);
                      setFormData({ ...formData, peso, descricao: DESCRICOES_POR_PESO[peso] });
                      setDescricaoEmEdicao(false);
                    }}
                  >
                    <SelectTrigger className="w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]">
                      <SelectValue placeholder="Selecione a ordem" />
                    </SelectTrigger>
                    <SelectContent>
                      {([1, 2, 3, 4, 5] as const).map((p, i) => (
                        <SelectItem key={p} value={String(p)}>
                          {p} – {['Mínimo', 'Baixo', 'Médio', 'Alto', 'Máximo'][i]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Níveis com ordem maior exigem maior especialização
                  </p>
                </div>

                {/* Descrição */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Descrição geral do nível *
                    </label>
                    <span className="text-xs text-gray-400">{formData.descricao.length}/100</span>
                  </div>
                  {!descricaoEmEdicao && formData.descricao ? (
                    <div className="relative w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[96px] bg-white">
                      <p className="text-gray-700 pr-7 leading-relaxed">{formData.descricao}</p>
                      <button
                        type="button"
                        onClick={() => setDescricaoEmEdicao(true)}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Editar descrição"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <textarea
                      value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value.slice(0, 100) })}
                      placeholder="Descreva o comportamento esperado para este nível, independente da habilidade"
                      rows={4}
                      autoFocus={descricaoEmEdicao}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] resize-none"
                    />
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Na habilidade, você poderá complementar com uma descrição específica
                  </p>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pré-visualização
                  </label>
                  <div className="border border-gray-200 rounded-lg px-4 py-3 bg-white">
                    {formData.nome ? (
                      <div
                        className="inline-flex px-3 py-1.5 rounded-full text-sm font-medium"
                        style={{ backgroundColor: getCorFromPeso(formData.peso), color: '#FFFFFF' }}
                      >
                        {formData.nome}
                      </div>
                    ) : (
                      <div className="inline-flex px-3 py-1.5 rounded-full text-sm font-medium bg-gray-200 text-gray-400">
                        Nome do nível
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    A cor da badge é definida automaticamente pela ordem de progressão
                  </p>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <Select
                    value={formData.status || ''}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)]">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Desativado">Desativado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={fecharDrawer}
                  type="button"
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarNivel}
                  type="button"
                  className="px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal de confirmação de arquivamento */}
      {modalArquivamentoAberto && nivelParaArquivar && (
        <ConfirmationModal
          isOpen={modalArquivamentoAberto}
          onClose={fecharModalArquivamento}
          onConfirm={confirmarArquivamento}
          title="Arquivar nível de proficiência"
          message={`Ao arquivar o nível "${nivelParaArquivar.nome}", ele será movido para a aba Arquivados e não poderá ser vinculado a novas habilidades.\n\n${
            nivelParaArquivar.emUso && nivelParaArquivar.emUso > 0
              ? `Este nível está vinculado a ${nivelParaArquivar.emUso} ${nivelParaArquivar.emUso === 1 ? 'habilidade' : 'habilidades'}. Os vínculos existentes e o histórico de avaliações serão preservados.`
              : 'Este nível não possui habilidades vinculadas.'
          }`}
          confirmLabel="Arquivar nível"
          cancelLabel="Cancelar"
          variant="warning"
        />
      )}

      {/* Modal de confirmação de desativação */}
      {modalDesativacaoAberto && nivelParaDesativar && (
        <ConfirmationModal
          isOpen={modalDesativacaoAberto}
          onClose={fecharModalDesativacao}
          onConfirm={confirmarDesativacao}
          title="Desativar nível de proficiência"
          message={`Ao desativar o nível "${nivelParaDesativar.nome}", ele ficará bloqueado para novos vínculos.\n\n${
            nivelParaDesativar.emUso && nivelParaDesativar.emUso > 0
              ? `Este nível está vinculado a ${nivelParaDesativar.emUso} ${nivelParaDesativar.emUso === 1 ? 'habilidade' : 'habilidades'}. Os vínculos existentes serão mantidos.`
              : 'Este nível não possui habilidades vinculadas.'
          }`}
          confirmLabel="Desativar nível"
          cancelLabel="Cancelar"
          variant="warning"
        />
      )}

      {/* FAB - Floating Action Button (apenas mobile) */}
      <button
        onClick={abrirDrawerNovo}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-[var(--brand-600)] text-white rounded-full shadow-lg hover:bg-[var(--brand-700)] active:scale-95 transition-all flex items-center justify-center z-40"
        aria-label="Criar nível"
      >
        <Plus className="w-6 h-6" />
      </button>
    </>
  );
}
