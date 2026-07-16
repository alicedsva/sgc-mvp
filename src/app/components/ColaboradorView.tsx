import {
  Clock,
  CalendarClock,
  AlertCircle,
  CheckCircle2,
  Construction,
} from 'lucide-react';
import { calcularCobertura, HabilidadeColaborador, MatrizCargo } from '../utils/cobertura';

interface Cargo {
  id: string;
  nome: string;
  senioridade: string;
  matrizCargo: MatrizCargo[];
  habilidadesEmDesenvolvimento: number;
  atual: boolean;
}

export function ColaboradorView() {
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
  const habilidadesComGap = cargoAtual.matrizCargo.filter(req => {
    const nivelAtual = mapaColaborador.get(req.habilidadeId) ?? '';
    return !calcularCobertura(nivelPeso[nivelAtual] ?? 0, nivelPeso[req.nivelEsperado] ?? 0);
  }).length;

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
  const primeiroNome = colaborador.nome.split(' ')[0];

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

      {/* Detalhamento de Habilidades — placeholder sem caráter oficial de
          produto removido a pedido; substituído por aviso "Em construção"
          (Estados vazios — B — Orientativo, 02-design-system.md) para não
          servir de referência de desenvolvimento. */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <Construction className="w-8 h-8 text-gray-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-700 mb-1">Em construção</p>
        <p className="text-sm text-gray-500">
          Esta seção ainda está em definição — não deve ser usada como referência para o desenvolvimento.
        </p>
      </div>

    </div>
  );
}
