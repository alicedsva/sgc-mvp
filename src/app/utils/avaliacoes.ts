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
