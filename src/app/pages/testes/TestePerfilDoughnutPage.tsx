import { useOutletContext, useNavigate } from 'react-router';
import { FlaskConical, Clock, CalendarClock, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { colaboradoresData, historicoCargosJoaoData, HOJE_SIMULADO } from '../../data/mockData';
import { useAvaliacoes } from '../../context/AvaliacoesContext';
import { getParticipacoesColaborador } from '../../utils/avaliacoes';
import {
  JOAO_ID,
  JOAO_CARGO_ATUAL,
  MAPEAMENTO_COMPETENCIAS_SECTION_ID,
  matrizParaCargo,
  enriquecerMatriz,
  calcularAderenciaPorTipo,
} from '../minhaCarreiraShared';

// Protótipo de teste — Opção 2 do card "Aderência ao cargo atual" de Meu
// Perfil (ColaboradorView.tsx): doughnut com as 4 fatias de status em vez do
// número isolado. Mesma lógica de cálculo real (matrizParaCargo/
// enriquecerMatriz/calcularAderenciaPorTipo, de minhaCarreiraShared.tsx) —
// nunca reimplementada aqui. Layout e demais cards replicam exatamente
// ColaboradorView.tsx aprovado, para comparação lado a lado sem outras
// variáveis mudando.

type OutletContext = { isSidebarCollapsed: boolean; viewMode: 'admin' | 'colaborador' };

// Mesmo helper de ColaboradorView.tsx — duplicado aqui por ser página de
// teste isolada (padrão já usado pelas outras páginas em pages/testes/).
function formatarTempoDesde(inicioYYYYMM: string, hoje: Date): string {
  const [anoInicio, mesInicio] = inicioYYYYMM.split('-').map(Number);
  const anoHoje = hoje.getUTCFullYear();
  const mesHoje = hoje.getUTCMonth() + 1;
  const totalMeses = Math.max(0, (anoHoje - anoInicio) * 12 + (mesHoje - mesInicio));
  const anos = Math.floor(totalMeses / 12);
  const meses = totalMeses % 12;
  const partes: string[] = [];
  if (anos > 0) partes.push(`${anos} ${anos === 1 ? 'ano' : 'anos'}`);
  if (meses > 0) partes.push(`${meses} ${meses === 1 ? 'mês' : 'meses'}`);
  return partes.length > 0 ? partes.join(' e ') : 'menos de 1 mês';
}

type StatusChave = 'acima' | 'no' | 'abaixo' | 'sem';

// 4 cores distintas (decisão explícita — não reaproveita o trio azul/âmbar/
// cinza de PesoBars). "No esperado" e "Abaixo do esperado" reaproveitam os
// tokens já documentados em 04-regras-negocio.md ("Indicadores de habilidade
// do colaborador": text-green-600 / text-red-500); "Acima" usa o azul da
// marca (mesmo tom de PesoBars/getCorAnelLista para valores positivos);
// "Não avaliada" usa o cinza neutro já usado em PesoBars/getCorFromPeso.
const CORES_STATUS: Record<StatusChave, string> = {
  acima: 'var(--brand-600)',
  no: '#16A34A',
  abaixo: '#EF4444',
  sem: '#D1D5DB',
};

const LABEL_STATUS: Record<StatusChave, string> = {
  acima: 'Acima do esperado',
  no: 'No esperado',
  abaixo: 'Abaixo do esperado',
  sem: 'Não avaliada',
};

const STATUS_ORDEM: StatusChave[] = ['acima', 'no', 'abaixo', 'sem'];

export default function TestePerfilDoughnutPage() {
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  const { avaliacoes } = useAvaliacoes();
  const colaborador = colaboradoresData.find(c => c.id === JOAO_ID)!;

  const tempoDeEmpresa = historicoCargosJoaoData[0]
    ? formatarTempoDesde(historicoCargosJoaoData[0].dataInicio, HOJE_SIMULADO)
    : colaborador.tempoNoCargo;

  const habilidadesCargoAtual = enriquecerMatriz(matrizParaCargo(JOAO_CARGO_ATUAL));
  const habilidadesComGap = habilidadesCargoAtual.filter(h => h.status === 'abaixo').length;

  const aderenciaTecnica = calcularAderenciaPorTipo(habilidadesCargoAtual, 'Técnica');
  const aderenciaComportamental = calcularAderenciaPorTipo(habilidadesCargoAtual, 'Comportamental');
  const aderenciaCargoAtual = Math.round((aderenciaTecnica + aderenciaComportamental) / 2);

  const minhasParticipacoes = getParticipacoesColaborador(avaliacoes, JOAO_ID);
  const emAberto = minhasParticipacoes.filter(
    ({ participante }) => participante.status === 'Não iniciada' || participante.status === 'Em andamento'
  );
  const avaliacoesEmAberto = emAberto.length;
  const avaliacoesConcluidas = minhasParticipacoes.filter(
    ({ participante }) => participante.status === 'Concluída'
  ).length;
  const proximaVencimento = emAberto.length > 0
    ? emAberto.reduce((min, atual) => atual.avaliacao.periodoFim < min.avaliacao.periodoFim ? atual : min)
    : null;
  const diasAteVencimento = proximaVencimento
    ? Math.max(0, Math.ceil((new Date(proximaVencimento.avaliacao.periodoFim).getTime() - HOJE_SIMULADO.getTime()) / (1000 * 60 * 60 * 24)))
    : null;
  const diasLabel = diasAteVencimento !== null
    ? `${diasAteVencimento} ${diasAteVencimento === 1 ? 'dia' : 'dias'}`
    : '—';

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
  const primeiroNome = colaborador.nome.split(' ')[0];

  // Contagem por status para as fatias do doughnut — mesma matriz usada pelo
  // gauge/card real, nunca um dado à parte.
  const contagemPorStatus = STATUS_ORDEM.map(status => ({
    status,
    name: LABEL_STATUS[status],
    value: habilidadesCargoAtual.filter(h => h.status === status).length,
    color: CORES_STATUS[status],
  }));
  const dadosDoughnut = contagemPorStatus.filter(d => d.value > 0);

  return (
    <main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
      <div className="p-4 md:p-8 space-y-6">

        {/* Banner de teste */}
        <div className="flex items-start gap-3 p-4 bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg">
          <FlaskConical className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[var(--brand-800)]">
            <span className="font-medium">Tela de teste.</span> Variação do card "Aderência ao cargo atual" de Meu Perfil em formato doughnut (4 status). Dados de João Silva (id=10). Não utilizar como referência de produto.
          </p>
        </div>

        {/* HEADER — igual ao Meu Perfil aprovado */}
        <div
          className="rounded-xl border border-slate-200 p-6 md:p-8"
          style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}
        >
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              {saudacao}, {primeiroNome}. 👋🏻
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {colaborador.cargo} · {tempoDeEmpresa} de empresa
            </p>
          </div>
        </div>

        {/* Cards de avaliação — iguais ao Meu Perfil aprovado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-semibold text-gray-700">Avaliações em aberto</span>
              <div className="p-2 rounded-lg bg-[var(--brand-100)] flex-shrink-0">
                <Clock className="w-5 h-5 text-[var(--brand-600)]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{avaliacoesEmAberto}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-semibold text-gray-700">Próxima avaliação encerra em</span>
              <div className="p-2 rounded-lg bg-[var(--brand-100)] flex-shrink-0">
                <CalendarClock className="w-5 h-5 text-[var(--brand-600)]" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{diasLabel}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-semibold text-gray-700">Avaliações concluídas</span>
              <div className="p-2 rounded-lg bg-green-100 flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-800" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{avaliacoesConcluidas}</p>
          </div>
        </div>

        {/* Aderência ao cargo atual — VARIAÇÃO EM TESTE: doughnut de 4 status
            em vez do número isolado do card aprovado. */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">Aderência ao cargo atual</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-shrink-0" style={{ width: 180, height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosDoughnut}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={dadosDoughnut.length > 1 ? 2 : 0}
                    isAnimationActive={false}
                  >
                    {dadosDoughnut.map(d => (
                      <Cell key={d.status} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number, name: string) => [`${value} habilidades`, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-gray-900">{aderenciaCargoAtual}%</span>
                <span className="text-[10px] text-gray-500">aderência</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-3 w-full">
              {contagemPorStatus.map(({ status, value }) => (
                <div key={status} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: CORES_STATUS[status] }} />
                  <span className="text-sm text-gray-600">{LABEL_STATUS[status]}</span>
                  <span className="text-sm font-medium text-gray-900 ml-auto">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Habilidades abaixo do esperado + Retrato de competências — iguais
            ao Meu Perfil aprovado. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-semibold text-gray-700">Habilidades abaixo do esperado</span>
              <div className="p-2 rounded-lg bg-amber-100 flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{habilidadesComGap}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Retrato de competências</h2>
              <button
                type="button"
                onClick={() => navigate('/minha-carreira', { state: { scrollTarget: MAPEAMENTO_COMPETENCIAS_SECTION_ID } })}
                className="flex items-center gap-1 text-sm font-medium text-[var(--brand-600)] hover:text-[var(--brand-700)] transition-colors flex-shrink-0"
              >
                Ver detalhes por competência
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-8">
              <div>
                <p className="text-xs md:text-sm text-gray-500">Competências técnicas</p>
                <p className="text-2xl font-bold text-gray-900">{aderenciaTecnica}%</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Competências comportamentais</p>
                <p className="text-2xl font-bold text-gray-900">{aderenciaComportamental}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
