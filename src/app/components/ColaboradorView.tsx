import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CalendarClock,
  AlertCircle,
  CheckCircle2,
  List,
  BarChart2,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { calcularCobertura, HabilidadeColaborador, MatrizCargo } from '../utils/cobertura';
import { getCorFromPeso, niveisDefaultData, getPesoFromNome, habilidadesData, getCompetenciaNome } from '../data/mockData';
import { Table, Column, PaginationConfig } from './ui/Table';

const PESO_MAX = Math.max(...niveisDefaultData.map(n => n.peso));

function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const pages: (number | string)[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (currentPage <= 3) {
    for (let i = 1; i <= 4; i++) pages.push(i);
    pages.push('...'); pages.push(totalPages);
  } else if (currentPage >= totalPages - 2) {
    pages.push(1); pages.push('...');
    for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1); pages.push('...');
    pages.push(currentPage - 1); pages.push(currentPage); pages.push(currentPage + 1);
    pages.push('...'); pages.push(totalPages);
  }
  return pages;
}

interface Cargo {
  id: string;
  nome: string;
  senioridade: string;
  matrizCargo: MatrizCargo[];
  habilidadesEmDesenvolvimento: number;
  atual: boolean;
}

const ITENS_POR_PAGINA = 10;

export function ColaboradorView() {
  const [buscaHabilidade, setBuscaHabilidade] = useState('');
  const [filtroCompetencia, setFiltroCompetencia] = useState('all');
  const [filtroTipo, setFiltroTipo] = useState('all');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [visualizacao, setVisualizacao] = useState<'tabela' | 'barras'>('tabela');

  // Dados mockados
  const colaborador = {
    nome: 'João Silva',
    cargo: 'Desenvolvedor Frontend',
    senioridade: 'Pleno',
    tempoNoCargo: '1 ano e 3 meses',
    jornada: 'Engenharia de Software',
  };

  const habilidadesNiveis: { id: string; nivel: string }[] = [
    { id: '1',  nivel: 'Avançado' },
    { id: '2',  nivel: 'Avançado' },
    { id: '3',  nivel: 'Intermediário' },
    { id: '4',  nivel: 'Intermediário' },
    { id: '5',  nivel: 'Intermediário' },
    { id: '6',  nivel: 'Intermediário' },
    { id: '7',  nivel: 'Básico' },
    { id: '8',  nivel: 'Avançado' },
    { id: '9',  nivel: 'Avançado' },
    { id: '10', nivel: 'Intermediário' },
    { id: '11', nivel: 'Básico' },
    { id: '12', nivel: 'Intermediário' },
    { id: '13', nivel: 'Intermediário' },
    { id: '14', nivel: 'Intermediário' },
    { id: '15', nivel: 'Avançado' },
    { id: '16', nivel: 'Avançado' },
  ];

  const habilidadesColaborador: HabilidadeColaborador[] = habilidadesNiveis.map(h => ({
    habilidadeId: h.id, nivelAtual: h.nivel,
  }));

  const cargos: Cargo[] = [
    {
      id: '2',
      nome: 'Desenvolvedor Frontend',
      senioridade: 'Pleno',
      matrizCargo: [
        { habilidadeId: '1',  nivelEsperado: 'Intermediário' }, // React
        { habilidadeId: '2',  nivelEsperado: 'Intermediário' }, // TypeScript
        { habilidadeId: '3',  nivelEsperado: 'Intermediário' }, // CSS/Tailwind
        { habilidadeId: '4',  nivelEsperado: 'Básico' },        // Testes Automatizados
        { habilidadeId: '5',  nivelEsperado: 'Básico' },        // Node.js
        { habilidadeId: '6',  nivelEsperado: 'Básico' },        // APIs REST
        { habilidadeId: '8',  nivelEsperado: 'Intermediário' }, // Comunicação
        { habilidadeId: '9',  nivelEsperado: 'Intermediário' }, // Trabalho em Equipe
        { habilidadeId: '15', nivelEsperado: 'Básico' },        // Scrum
        { habilidadeId: '16', nivelEsperado: 'Básico' },        // Kanban
      ],
      habilidadesEmDesenvolvimento: 4,
      atual: true,
    },
    {
      id: '3',
      nome: 'Desenvolvedor Frontend',
      senioridade: 'Sênior',
      matrizCargo: [
        { habilidadeId: '1',  nivelEsperado: 'Avançado' },      // React
        { habilidadeId: '2',  nivelEsperado: 'Avançado' },      // TypeScript
        { habilidadeId: '3',  nivelEsperado: 'Avançado' },      // CSS/Tailwind
        { habilidadeId: '4',  nivelEsperado: 'Avançado' },      // Testes Automatizados
        { habilidadeId: '5',  nivelEsperado: 'Intermediário' }, // Node.js
        { habilidadeId: '6',  nivelEsperado: 'Intermediário' }, // APIs REST
        { habilidadeId: '7',  nivelEsperado: 'Intermediário' }, // Banco de Dados
        { habilidadeId: '8',  nivelEsperado: 'Avançado' },      // Comunicação
        { habilidadeId: '9',  nivelEsperado: 'Avançado' },      // Trabalho em Equipe
        { habilidadeId: '10', nivelEsperado: 'Intermediário' }, // Liderança Técnica
        { habilidadeId: '11', nivelEsperado: 'Intermediário' }, // Docker
        { habilidadeId: '12', nivelEsperado: 'Intermediário' }, // CI/CD
        { habilidadeId: '15', nivelEsperado: 'Avançado' },      // Scrum
        { habilidadeId: '16', nivelEsperado: 'Intermediário' }, // Kanban
      ],
      habilidadesEmDesenvolvimento: 8,
      atual: false,
    },
    {
      id: '4',
      nome: 'Tech Lead Frontend',
      senioridade: '',
      matrizCargo: [
        { habilidadeId: '1',  nivelEsperado: 'Avançado' },      // React
        { habilidadeId: '2',  nivelEsperado: 'Avançado' },      // TypeScript
        { habilidadeId: '3',  nivelEsperado: 'Avançado' },      // CSS/Tailwind
        { habilidadeId: '4',  nivelEsperado: 'Avançado' },      // Testes Automatizados
        { habilidadeId: '5',  nivelEsperado: 'Avançado' },      // Node.js
        { habilidadeId: '6',  nivelEsperado: 'Avançado' },      // APIs REST
        { habilidadeId: '7',  nivelEsperado: 'Intermediário' }, // Banco de Dados
        { habilidadeId: '8',  nivelEsperado: 'Avançado' },      // Comunicação
        { habilidadeId: '9',  nivelEsperado: 'Avançado' },      // Trabalho em Equipe
        { habilidadeId: '10', nivelEsperado: 'Avançado' },      // Liderança Técnica
        { habilidadeId: '11', nivelEsperado: 'Avançado' },      // Docker
        { habilidadeId: '12', nivelEsperado: 'Avançado' },      // CI/CD
        { habilidadeId: '13', nivelEsperado: 'Intermediário' }, // UX/UI
        { habilidadeId: '15', nivelEsperado: 'Especialista' },  // Scrum
        { habilidadeId: '16', nivelEsperado: 'Avançado' },      // Kanban
      ],
      habilidadesEmDesenvolvimento: 12,
      atual: false,
    },
  ];

  const avaliacoesColaborador: { id: string; status: string; dataLimite?: Date }[] = [
    { id: '1', status: 'Não iniciada', dataLimite: new Date(2026, 5, 20) },
    { id: '4', status: 'Em andamento', dataLimite: new Date(2026, 6, 5) },
    { id: '2', status: 'Concluída' },
    { id: '5', status: 'Concluída' },
    { id: '6', status: 'Expirada' },
  ];

  const avaliacoesEmAberto = avaliacoesColaborador.filter(
    a => a.status === 'Não iniciada' || a.status === 'Em andamento'
  ).length;

  const avaliacoesConcluidas = avaliacoesColaborador.filter(
    a => a.status === 'Concluída'
  ).length;

  const emAbertoComPrazo = avaliacoesColaborador.filter(
    a => (a.status === 'Não iniciada' || a.status === 'Em andamento') && a.dataLimite
  );
  const proximaVencimento = emAbertoComPrazo.length > 0
    ? emAbertoComPrazo.reduce((min, a) => a.dataLimite! < min.dataLimite! ? a : min)
    : null;
  const hoje = new Date();
  const diasAteVencimento = proximaVencimento
    ? Math.max(0, Math.ceil((proximaVencimento.dataLimite!.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)))
    : null;
  const diasLabel = diasAteVencimento !== null
    ? `${diasAteVencimento} ${diasAteVencimento === 1 ? 'dia' : 'dias'}`
    : '—';

  const nivelPeso: Record<string, number> = { 'Básico': 1, 'Intermediário': 2, 'Avançado': 3, 'Especialista': 4 };
  const cargoAtual = cargos.find(c => c.atual)!;
  const mapaColaborador = new Map(habilidadesColaborador.map(h => [h.habilidadeId, h.nivelAtual]));
  const nivelEsperadoMap = new Map(cargoAtual.matrizCargo.map(m => [m.habilidadeId, m.nivelEsperado]));
  const habilidadesComGap = cargoAtual.matrizCargo.filter(req => {
    const nivelAtual = mapaColaborador.get(req.habilidadeId) ?? '';
    return !calcularCobertura(nivelPeso[nivelAtual] ?? 0, nivelPeso[req.nivelEsperado] ?? 0);
  }).length;

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
  const primeiroNome = colaborador.nome.split(' ')[0];

  // Lista plana de habilidades com status calculado
  const todasHabilidades = habilidadesNiveis.map(item => {
    const hab = habilidadesData.find(h => h.id === item.id);
    const nivelEsperado = nivelEsperadoMap.get(item.id);
    const nivelAtualNum = getPesoFromNome(item.nivel);
    const nivelEsperadoNum = nivelEsperado != null ? getPesoFromNome(nivelEsperado) : null;

    let statusIndicador: 'Acima do esperado' | 'No esperado' | 'Abaixo do esperado' | null = null;
    if (nivelEsperadoNum !== null) {
      if (nivelAtualNum > nivelEsperadoNum) statusIndicador = 'Acima do esperado';
      else if (nivelAtualNum === nivelEsperadoNum) statusIndicador = 'No esperado';
      else statusIndicador = 'Abaixo do esperado';
    }

    return {
      id: item.id,
      nome: hab?.nome ?? item.id,
      nivel: item.nivel,
      competenciaId: hab?.competenciaId ?? '',
      competenciaNome: getCompetenciaNome(hab?.competenciaId ?? ''),
      tipo: (hab?.tipo ?? 'Técnica') as 'Técnica' | 'Comportamental',
      statusIndicador,
      pesoAtual: nivelAtualNum,
      pesoEsperado: nivelEsperadoNum,
      nivelEsperadoNome: nivelEsperado ?? null,
    };
  });

  const competenciasNoView = Array.from(
    new Set(todasHabilidades.map(h => h.competenciaId).filter(Boolean))
  ).sort((a, b) => getCompetenciaNome(a).localeCompare(getCompetenciaNome(b)));

  // Filtragem combinada
  const habilidadesFiltradas = todasHabilidades.filter(h => {
    if (buscaHabilidade && !h.nome.toLowerCase().includes(buscaHabilidade.toLowerCase())) return false;
    if (filtroCompetencia !== 'all' && h.competenciaId !== filtroCompetencia) return false;
    if (filtroTipo !== 'all' && h.tipo !== filtroTipo) return false;
    if (filtroStatus !== 'Todos' && h.statusIndicador !== filtroStatus) return false;
    return true;
  });

  const totalPaginas = Math.max(1, Math.ceil(habilidadesFiltradas.length / ITENS_POR_PAGINA));
  const habilidadesPagina = habilidadesFiltradas.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA
  );
  const paginacaoInicioItem = habilidadesFiltradas.length === 0 ? 0 : (paginaAtual - 1) * ITENS_POR_PAGINA + 1;
  const paginacaoFimItem = Math.min(paginaAtual * ITENS_POR_PAGINA, habilidadesFiltradas.length);

  const columns: Column[] = [
    { key: 'nome', label: 'Habilidade' },
    {
      key: 'competenciaNome',
      label: 'Competência',
      render: (value: any) => <span className="text-gray-500">{value}</span>,
    },
    {
      key: 'nivel',
      label: 'Nível Atual',
      render: (_: any, row: any) => (
        <span
          className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white"
          style={{
            backgroundColor: getPesoFromNome(row.nivel) > 0
              ? getCorFromPeso(getPesoFromNome(row.nivel))
              : '#9CA3AF',
          }}
        >
          {row.nivel}
        </span>
      ),
    },
    {
      key: 'statusIndicador',
      label: 'Status',
      render: (_: any, row: any) =>
        row.statusIndicador ? (
          <span className={row.statusIndicador === 'Abaixo do esperado' ? 'text-xs text-red-500' : 'text-xs text-green-600'}>
            {row.statusIndicador}
          </span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        ),
    },
  ];

  const paginationConfig: PaginationConfig = {
    currentPage: paginaAtual,
    itemsPerPage: ITENS_POR_PAGINA,
    totalItems: habilidadesFiltradas.length,
    onPageChange: (page) => setPaginaAtual(page),
    onItemsPerPageChange: () => {},
  };

  return (
    <div className="space-y-6">
      {/* HEADER - Full Width */}
      <div
        className="rounded-xl border border-slate-200 p-6 md:p-8"
        style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            {saudacao}, {primeiroNome}. 👋🏻
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {colaborador.cargo} · {colaborador.senioridade} · {colaborador.tempoNoCargo} no cargo
          </p>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">Avaliações em aberto</span>
            <Clock className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{avaliacoesEmAberto}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">Próxima avaliação encerra em</span>
            <CalendarClock className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{diasLabel}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">Habilidades abaixo do esperado</span>
            <AlertCircle className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{habilidadesComGap}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">Avaliações concluídas</span>
            <CheckCircle2 className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{avaliacoesConcluidas}</p>
        </div>
      </div>

      {/* DETALHAMENTO DE HABILIDADES */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Detalhamento de Habilidades</h2>
          <p className="text-sm text-gray-600 mt-1">
            Suas habilidades mapeadas e posição no cargo atual
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Toolbar de filtros */}
          <div className="p-3 md:p-4 flex flex-wrap items-center gap-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Buscar habilidade..."
              value={buscaHabilidade}
              onChange={e => { setBuscaHabilidade(e.target.value); setPaginaAtual(1); }}
              className="w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
            />
            <Select value={filtroCompetencia} onValueChange={v => { setFiltroCompetencia(v); setPaginaAtual(1); }}>
              <SelectTrigger className="w-auto">
                <SelectValue placeholder="Todas as competências" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as competências</SelectItem>
                {competenciasNoView.map(id => (
                  <SelectItem key={id} value={id}>{getCompetenciaNome(id)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filtroTipo} onValueChange={v => { setFiltroTipo(v); setPaginaAtual(1); }}>
              <SelectTrigger className="w-auto">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="Técnica">Técnica</SelectItem>
                <SelectItem value="Comportamental">Comportamental</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {(['Todos', 'Acima do esperado', 'No esperado', 'Abaixo do esperado'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => { setFiltroStatus(s); setPaginaAtual(1); }}
                  className={`px-3 py-2 text-sm font-normal rounded-md transition-all whitespace-nowrap ${
                    filtroStatus === s
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={() => { setVisualizacao('tabela'); setPaginaAtual(1); }}
                title="Visualização em tabela"
                className={`p-2 rounded-md transition-colors ${
                  visualizacao === 'tabela'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setVisualizacao('barras'); setPaginaAtual(1); }}
                title="Visualização em barras"
                className={`p-2 rounded-md transition-colors ${
                  visualizacao === 'barras'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tabela */}
          {visualizacao === 'tabela' && (
            habilidadesPagina.length === 0 ? (
              <div className="px-3 md:px-6 py-8 text-center text-sm text-gray-500">
                Nenhuma habilidade encontrada para os filtros aplicados.
              </div>
            ) : (
              <Table columns={columns} data={habilidadesPagina} pagination={paginationConfig} />
            )
          )}

          {/* Visualização em barras */}
          {visualizacao === 'barras' && (
            <div>
              <div className="px-4 md:px-6 py-2 flex justify-end items-center gap-4 border-b border-gray-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[var(--brand-600)]" />
                  <span className="text-xs text-gray-500">Nível atual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <span className="text-xs text-gray-500">Nível esperado</span>
                </div>
              </div>
              <div className="px-4 md:px-6">
                {habilidadesPagina.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-500">
                    Nenhuma habilidade encontrada para os filtros aplicados.
                  </p>
                ) : (
                  habilidadesPagina.map(h => {
                    const naoAvaliado = h.pesoAtual === 0;
                    const semEsperado = h.nivelEsperadoNome === null;
                    const larguraAtual = naoAvaliado ? 0 : Math.round((h.pesoAtual / PESO_MAX) * 100);
                    const larguraEsperado = semEsperado ? 0 : Math.round((h.pesoEsperado! / PESO_MAX) * 100);

                    return (
                      <div key={h.id} className="py-4 border-b border-gray-100 flex items-start gap-4">
                        <div className="w-40 flex-shrink-0">
                          <p className="text-sm font-medium text-gray-900">{h.nome}</p>
                          <p className="text-xs text-gray-500">{h.competenciaNome}</p>
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                          {naoAvaliado ? (
                            <div className="flex items-center gap-2">
                              <span className="w-14 text-xs text-gray-400 shrink-0">Atual</span>
                              <span className="text-xs italic text-gray-400">Não avaliado</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="w-14 text-xs text-gray-400 shrink-0">Atual</span>
                              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-[var(--brand-600)] transition-all duration-300"
                                  style={{ width: `${larguraAtual}%` }}
                                />
                              </div>
                              <span className="w-24 text-xs font-medium text-gray-700 shrink-0">{h.nivel}</span>
                            </div>
                          )}
                          {!semEsperado && (
                            <div className="flex items-center gap-2">
                              <span className="w-14 text-xs text-gray-400 shrink-0">Esperado</span>
                              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-slate-300 transition-all duration-300"
                                  style={{ width: `${larguraEsperado}%` }}
                                />
                              </div>
                              <span className="w-24 text-xs font-medium text-gray-700 shrink-0">{h.nivelEsperadoNome}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {/* Paginação */}
              <div className="flex flex-col md:flex-row items-center justify-between px-3 md:px-6 py-3 md:py-4 border-t border-gray-200 bg-gray-50 gap-3 md:gap-0">
                <div className="text-xs md:text-sm text-gray-700">
                  <span className="hidden md:inline">Exibindo </span>
                  <span className="font-medium">{paginacaoInicioItem}</span>–
                  <span className="font-medium">{paginacaoFimItem}</span> de{' '}
                  <span className="font-medium">{habilidadesFiltradas.length}</span>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                    disabled={paginaAtual === 1}
                    className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-3 md:w-4 h-3 md:h-4" />
                  </button>
                  <div className="flex items-center gap-0.5 md:gap-1">
                    {getPageNumbers(paginaAtual, totalPaginas).map((page, index) =>
                      typeof page === 'number' ? (
                        <button
                          key={index}
                          onClick={() => setPaginaAtual(page)}
                          className={`min-w-[32px] md:min-w-[40px] px-2 md:px-3 py-1.5 md:py-2 text-xs font-normal rounded-lg transition-colors ${
                            paginaAtual === page
                              ? 'bg-gray-100 text-gray-900 border border-gray-200'
                              : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ) : (
                        <span key={index} className="px-1 md:px-2 text-xs text-gray-400">
                          {page}
                        </span>
                      )
                    )}
                  </div>
                  <button
                    onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                    disabled={paginaAtual === totalPaginas}
                    className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-3 md:w-4 h-3 md:h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
