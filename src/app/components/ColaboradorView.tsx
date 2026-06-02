import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CalendarClock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { calcularCobertura, HabilidadeColaborador, MatrizCargo } from '../utils/cobertura';
import { getCorFromPeso, niveisDefaultData, nivelToNumber } from '../data/mockData';

function getPesoFromNome(nome: string): number {
  const nivel = niveisDefaultData.find(n => n.nome === nome);
  return nivel?.peso ?? 0;
}

interface Competencia {
  id: string;
  nome: string;
  tipo: 'Técnica' | 'Comportamental';
  habilidades: Habilidade[];
}

interface Habilidade {
  id: string;
  nome: string;
  nivel: string;
  status: 'Em desenvolvimento' | 'Consolidada';
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

  // Dados mockados
  const colaborador = {
    nome: 'João Silva',
    cargo: 'Desenvolvedor Frontend',
    senioridade: 'Pleno',
    tempoNoCargo: '1 ano e 3 meses',
    jornada: 'Engenharia de Software',
  };

  const competencias: Competencia[] = [
    {
      id: '1',
      nome: 'Frontend',
      tipo: 'Técnica',
      habilidades: [
        { id: '1', nome: 'React', nivel: 'Avançado', status: 'Consolidada' },
        { id: '2', nome: 'TypeScript', nivel: 'Avançado', status: 'Consolidada' },
        { id: '3', nome: 'CSS/Tailwind', nivel: 'Intermediário', status: 'Em desenvolvimento' },
        { id: '4', nome: 'Testes Automatizados', nivel: 'Intermediário', status: 'Em desenvolvimento' },
      ],
    },
    {
      id: '2',
      nome: 'Backend',
      tipo: 'Técnica',
      habilidades: [
        { id: '5', nome: 'Node.js', nivel: 'Intermediário', status: 'Em desenvolvimento' },
        { id: '6', nome: 'APIs REST', nivel: 'Intermediário', status: 'Consolidada' },
        { id: '7', nome: 'Banco de Dados', nivel: 'Básico', status: 'Em desenvolvimento' },
      ],
    },
    {
      id: '3',
      nome: 'Soft Skills',
      tipo: 'Comportamental',
      habilidades: [
        { id: '8', nome: 'Comunicação', nivel: 'Avançado', status: 'Consolidada' },
        { id: '9', nome: 'Trabalho em Equipe', nivel: 'Avançado', status: 'Consolidada' },
        { id: '10', nome: 'Liderança Técnica', nivel: 'Intermediário', status: 'Em desenvolvimento' },
      ],
    },
    {
      id: '4',
      nome: 'DevOps',
      tipo: 'Técnica',
      habilidades: [
        { id: '11', nome: 'Docker', nivel: 'Básico', status: 'Em desenvolvimento' },
        { id: '12', nome: 'CI/CD', nivel: 'Intermediário', status: 'Em desenvolvimento' },
      ],
    },
    {
      id: '5',
      nome: 'Design',
      tipo: 'Técnica',
      habilidades: [
        { id: '13', nome: 'UX/UI', nivel: 'Intermediário', status: 'Consolidada' },
        { id: '14', nome: 'Prototipagem', nivel: 'Intermediário', status: 'Em desenvolvimento' },
      ],
    },
    {
      id: '6',
      nome: 'Ágeis',
      tipo: 'Técnica',
      habilidades: [
        { id: '15', nome: 'Scrum', nivel: 'Avançado', status: 'Consolidada' },
        { id: '16', nome: 'Kanban', nivel: 'Avançado', status: 'Consolidada' },
      ],
    },
  ];

  const habilidadesColaborador: HabilidadeColaborador[] = competencias.flatMap(c =>
    c.habilidades.map(h => ({ habilidadeId: h.id, nivelAtual: h.nivel }))
  );

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
  const todasHabilidades = competencias.flatMap(comp =>
    comp.habilidades.map(h => {
      const nivelEsperado = nivelEsperadoMap.get(h.id);
      const nivelAtualNum = nivelToNumber[h.nivel] ?? 0;
      const nivelEsperadoNum = nivelEsperado != null ? (nivelToNumber[nivelEsperado] ?? 0) : null;

      let statusIndicador: 'Acima do esperado' | 'No esperado' | 'Abaixo do esperado' | null = null;
      if (nivelEsperadoNum !== null) {
        if (nivelAtualNum > nivelEsperadoNum) statusIndicador = 'Acima do esperado';
        else if (nivelAtualNum === nivelEsperadoNum) statusIndicador = 'No esperado';
        else statusIndicador = 'Abaixo do esperado';
      }

      return { id: h.id, nome: h.nome, nivel: h.nivel, competenciaId: comp.id, competenciaNome: comp.nome, tipo: comp.tipo, statusIndicador };
    })
  );

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
                {competencias.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
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
          </div>

          {/* Tabela */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Habilidade</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Competência</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Nível Atual</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {habilidadesPagina.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 md:px-6 py-8 text-center text-sm text-gray-500">
                    Nenhuma habilidade encontrada para os filtros aplicados.
                  </td>
                </tr>
              ) : (
                habilidadesPagina.map(h => (
                  <tr key={h.id}>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900">{h.nome}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-500">{h.competenciaNome}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{
                          backgroundColor: getPesoFromNome(h.nivel) > 0
                            ? getCorFromPeso(getPesoFromNome(h.nivel))
                            : '#9CA3AF',
                        }}
                      >
                        {h.nivel}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      {h.statusIndicador ? (
                        <span className={h.statusIndicador === 'Abaixo do esperado' ? 'text-xs text-red-500' : 'text-xs text-green-600'}>
                          {h.statusIndicador}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="px-3 md:px-6 py-3 md:py-4 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs md:text-sm text-gray-700">
                {habilidadesFiltradas.length} {habilidadesFiltradas.length === 1 ? 'habilidade' : 'habilidades'}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                  disabled={paginaAtual === 1}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-500" />
                </button>
                <span className="text-xs font-normal text-gray-500 px-2">
                  {paginaAtual} / {totalPaginas}
                </span>
                <button
                  onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                  disabled={paginaAtual === totalPaginas}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
