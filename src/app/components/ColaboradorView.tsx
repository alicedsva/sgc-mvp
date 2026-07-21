import { useNavigate } from 'react-router';
import { Clock, CalendarClock, AlertCircle, CheckCircle2, Target, ChevronRight } from 'lucide-react';
import { colaboradoresData, historicoCargosJoaoData, HOJE_SIMULADO } from '../data/mockData';
import { useAvaliacoes } from '../context/AvaliacoesContext';
import { getParticipacoesColaborador } from '../utils/avaliacoes';
import {
  JOAO_ID,
  JOAO_CARGO_ATUAL,
  MAPEAMENTO_COMPETENCIAS_SECTION_ID,
  matrizParaCargo,
  enriquecerMatriz,
  calcularAderenciaPorTipo,
} from '../pages/minhaCarreiraShared';

// "X anos e Y meses" desde uma data 'YYYY-MM' até HOJE_SIMULADO — nunca
// hardcode, sempre calculado (mesmo espírito de nunca usar new Date() real,
// ver DashboardPage.tsx / ColaboradorView.tsx). Mesmo formato de texto já
// usado em colaboradoresData.tempoNoCargo (ex: "2 anos e 5 meses").
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

export function ColaboradorView() {
  const navigate = useNavigate();
  const { avaliacoes } = useAvaliacoes();
  const colaborador = colaboradoresData.find(c => c.id === JOAO_ID)!;

  // Tempo de empresa — calculado a partir do primeiro item do histórico real
  // de cargos (data de admissão implícita), nunca hardcode. Fallback pra
  // tempoNoCargo se não houver histórico (hoje só existe pro João).
  const tempoDeEmpresa = historicoCargosJoaoData[0]
    ? formatarTempoDesde(historicoCargosJoaoData[0].dataInicio, HOJE_SIMULADO)
    : colaborador.tempoNoCargo;

  // Habilidades do cargo ATUAL de João, mesma matriz/fórmula do gauge
  // "Aderência ao cargo" de Minha Carreira (minhaCarreiraShared.tsx) — nunca
  // reimplementar essa lógica aqui.
  const habilidadesCargoAtual = enriquecerMatriz(matrizParaCargo(JOAO_CARGO_ATUAL));

  // "Abaixo do esperado" — escopo cargo atual, habilidades não avaliadas
  // ('sem') excluídas (nunca contam como gap).
  const habilidadesComGap = habilidadesCargoAtual.filter(h => h.status === 'abaixo').length;

  // Aderência ao cargo atual — reusa exatamente calcularAderenciaPorTipo +
  // média simples (Técnica + Comportamental) / 2, mesmo cálculo do gauge de
  // Minha Carreira, para os dois nunca divergirem.
  const aderenciaTecnica = calcularAderenciaPorTipo(habilidadesCargoAtual, 'Técnica');
  const aderenciaComportamental = calcularAderenciaPorTipo(habilidadesCargoAtual, 'Comportamental');
  const aderenciaCargoAtual = Math.round((aderenciaTecnica + aderenciaComportamental) / 2);

  // Avaliações reais do colaborador — lidas do AvaliacoesContext (não do
  // array estático) para refletir respostas dadas na mesma sessão sem
  // recarregar a página. Mesmo helper usado por MinhasAvaliacoes.tsx.
  const minhasParticipacoes = getParticipacoesColaborador(avaliacoes, JOAO_ID);

  const emAberto = minhasParticipacoes.filter(
    ({ participante }) => participante.status === 'Não iniciada' || participante.status === 'Em andamento'
  );
  const avaliacoesEmAberto = emAberto.length;

  const avaliacoesConcluidas = minhasParticipacoes.filter(
    ({ participante }) => participante.status === 'Concluída'
  ).length;

  // Comparado sempre contra HOJE_SIMULADO — nunca a data real do navegador —
  // para manter o cálculo determinístico (mesmo padrão de DashboardPage.tsx).
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
            {colaborador.cargo} · {tempoDeEmpresa} de empresa
          </p>
        </div>
      </div>

      {/* Cards de avaliação */}
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

      {/* Aderência ao cargo atual — destacado, largura total, depois do grid
          de avaliações. Cor neutra (var(--brand-600)), sem variação por
          faixa de percentual — ainda não há limiar definido para este card.
          Ícone com wrapper colorido — exceção documentada em
          02-design-system.md para cards de métrica do Colaborador. */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-base font-semibold text-gray-700">Aderência ao cargo atual</span>
          <div className="p-2 rounded-lg bg-[var(--brand-100)] flex-shrink-0">
            <Target className="w-5 h-5 text-[var(--brand-600)]" />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-900">{aderenciaCargoAtual}%</p>
      </div>

      {/* Seção final — Habilidades abaixo do esperado (card de métrica) ao
          lado de Retrato de competências, lado a lado. */}
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

        {/* Retrato de competências — reusa aderenciaTecnica/aderenciaComportamental
            já calculados acima (mesma fonte do gauge de Minha Carreira), sem
            recalcular nada novo. Botão leva à seção "Mapeamento de competências"
            de Minha Carreira via scrollTarget — mesmo padrão de navegação já
            usado pelo botão "voltar" de CompetenciaDetalhePage.tsx. Classes do
            botão espelham o padrão real de "Ver todos" já usado em
            DashboardPage.tsx (Seção 5 — Colaboradores com GAPs críticos):
            ChevronRight + hover:text-[var(--brand-700)], não a versão com
            "→" em texto do showcase de DesignSystemPage.tsx. */}
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
  );
}
