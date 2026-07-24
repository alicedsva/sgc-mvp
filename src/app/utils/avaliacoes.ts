import { Avaliacao, ParticipanteAvaliacao } from '../data/mockData';

export interface ParticipacaoColaborador {
  avaliacao: Avaliacao;
  participante: ParticipanteAvaliacao;
}

// Formatação de período/data compartilhada entre MinhasAvaliacoes.tsx,
// RespostaAvaliacao.tsx e ResultadoAvaliacao.tsx — evita reimplementar em
// cada tela (mesmo padrão de formatPeriodo já usado em DashboardPage.tsx,
// mas exportado aqui para reuso entre telas do Colaborador).
export function formatPeriodo(inicio: string, fim: string): string {
  const [yi, mi, di] = inicio.split('-');
  const [yf, mf, df] = fim.split('-');
  if (yi === yf) return `${di}/${mi} – ${df}/${mf}/${yf}`;
  return `${di}/${mi}/${yi} – ${df}/${mf}/${yf}`;
}

export function formatData(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

// Participações de um colaborador em avaliações reais — nunca inclui
// Rascunho (regra: avaliação Rascunho nunca é visível ao colaborador,
// ver 04-regras-negocio.md). Fonte única usada por ColaboradorView.tsx e
// MinhasAvaliacoes.tsx, para as duas nunca divergirem.
export function getParticipacoesColaborador(
  avaliacoes: Avaliacao[],
  colaboradorId: string
): ParticipacaoColaborador[] {
  return avaliacoes
    .filter(av => av.status !== 'Rascunho')
    .flatMap(av => {
      const participante = av.participantes.find(p => p.colaboradorId === colaboradorId);
      return participante ? [{ avaliacao: av, participante }] : [];
    });
}

export interface ProximaAvaliacaoInfo {
  diasAteVencimento: number | null;
  diasLabel: string;
  avaliacaoId: string | null;
}

// Dias até um periodoFim — fonte única do cálculo de dias restantes, usada
// tanto pelo card de resumo (getProximaAvaliacaoInfo) quanto por qualquer
// tela que precise da urgência de UMA avaliação específica (ex.: contorno
// por card em MinhasAvaliacoes.tsx). Nunca duplicar essa conta.
export function calcularDiasAteVencimento(periodoFim: string, hoje: Date): number {
  return Math.max(0, Math.ceil((new Date(periodoFim).getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)));
}

// Dias decorridos desde uma data (ex.: periodoInicio) — usado pelo badge
// "Nova" em MinhasAvaliacoes.tsx. Mesma unidade de cálculo de
// calcularDiasAteVencimento, só invertendo a direção.
export function calcularDiasDesde(data: string, hoje: Date): number {
  return Math.max(0, Math.floor((hoje.getTime() - new Date(data).getTime()) / (1000 * 60 * 60 * 24)));
}

// Uma avaliação "Não iniciada"/"Em andamento" cujo prazo já passou deve virar
// Expirada dinamicamente — nunca depender de um campo status gravado à mão
// (ver 06-integridade-de-dados.md). Fonte única reusada por
// getProximaAvaliacaoInfo, MinhasAvaliacoes.tsx e ColaboradorView.tsx, para
// as três nunca divergirem sobre o que conta como "em aberto".
export function estaVencida(periodoFim: string, hoje: Date): boolean {
  return new Date(periodoFim).getTime() < hoje.getTime();
}

// Cálculo do "próxima avaliação encerra em" — fonte única usada por
// ColaboradorView.tsx (Meu Perfil) e MinhasAvaliacoes.tsx, mesmo espírito de
// calcularAderenciaPorTipo em minhaCarreiraShared.tsx: nunca duplicar a
// conta em cada tela. avaliacaoId identifica qual avaliação em aberto é essa
// "próxima", para telas destacarem a linha correspondente sem recalcular.
export function getProximaAvaliacaoInfo(
  participacoes: ParticipacaoColaborador[],
  hoje: Date
): ProximaAvaliacaoInfo {
  const emAberto = participacoes.filter(
    ({ participante, avaliacao }) =>
      (participante.status === 'Não iniciada' || participante.status === 'Em andamento') &&
      !estaVencida(avaliacao.periodoFim, hoje)
  );
  const proximaVencimento = emAberto.length > 0
    ? emAberto.reduce((min, atual) => atual.avaliacao.periodoFim < min.avaliacao.periodoFim ? atual : min)
    : null;
  const diasAteVencimento = proximaVencimento
    ? calcularDiasAteVencimento(proximaVencimento.avaliacao.periodoFim, hoje)
    : null;
  const diasLabel = diasAteVencimento !== null
    ? `${diasAteVencimento} ${diasAteVencimento === 1 ? 'dia' : 'dias'}`
    : '—';
  return { diasAteVencimento, diasLabel, avaliacaoId: proximaVencimento?.avaliacao.id ?? null };
}
