import { Avaliacao, ParticipanteAvaliacao, niveisDefaultData } from '../data/mockData';
import type { Habilidade, StatusAvaliacao } from '../../data/schema';

export interface ParticipacaoColaborador {
  avaliacao: Avaliacao;
  participante: ParticipanteAvaliacao;
}

// Formatação de período/data compartilhada entre MinhasAvaliacoes.tsx,
// RespostaAvaliacaoPage.tsx e ResultadoAvaliacao.tsx — evita reimplementar em
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

// 'YYYY-MM-DD' + N dias corridos, em aritmética de data pura (UTC) — nunca
// via Date local (setDate) para não deslocar por fuso horário. Único usado
// por calcularPrazoParticipante para o modo 'prazo_em_dias'.
function adicionarDias(dataISO: string, dias: number): string {
  const [y, m, d] = dataISO.split('-').map(Number);
  const data = new Date(Date.UTC(y, m - 1, d));
  data.setUTCDate(data.getUTCDate() + dias);
  return data.toISOString().slice(0, 10);
}

// Status efetivo de uma avaliação — fonte única de verdade para "o que essa
// avaliação é AGORA", nunca ler avaliacao.status diretamente em tela nenhuma
// (ver 06-integridade-de-dados.md: status gravado só registra decisão manual
// do Admin — Rascunho/Ativa ao ativar/Encerrada ao encerrar; Pendente e
// Expirada são sempre calculados, nunca gravados).
export function calcularStatusEfetivo(avaliacao: Avaliacao, hoje: Date): StatusAvaliacao {
  if (avaliacao.status === 'Encerrada') return 'Encerrada';
  // Só ativa por ação manual do Admin — nunca vira Pendente/Ativa sozinha
  // por data.
  if (avaliacao.status === 'Rascunho') return 'Rascunho';
  if (new Date(avaliacao.periodoInicio).getTime() > hoje.getTime()) return 'Pendente';
  // modoPrazo 'prazo_em_dias' e 'indefinido': a avaliação como um todo nunca
  // expira sozinha — em 'prazo_em_dias' só participantes individuais vencem
  // (ver calcularPrazoParticipante); em 'indefinido' ninguém vence, nunca há
  // prazo — por isso só 'datas_fixas' pode levar a avaliação inteira a
  // 'Expirada'.
  if (
    avaliacao.modoPrazo === 'datas_fixas' &&
    avaliacao.periodoFim &&
    new Date(avaliacao.periodoFim).getTime() < hoje.getTime()
  ) {
    return 'Expirada';
  }
  return 'Ativa';
}

// Texto de exibição do status calculado de uma Avaliação — única função que
// traduz StatusAvaliacao para o que o usuário vê. O valor interno
// 'Pendente' NUNCA muda (calcularStatusEfetivo, comparações e filtros
// continuam usando esse literal) — só a palavra mostrada na tela vira
// "Agendada". Fonte única reusada por AvaliacaoDetalhePage.tsx e
// ContentArea.tsx (listagem Admin), para as duas nunca divergirem.
export function getStatusAvaliacaoLabel(status: StatusAvaliacao): string {
  return status === 'Pendente' ? 'Agendada' : status;
}

// Prazo efetivo de UM participante — fonte única, nunca ler
// avaliacao.periodoFim diretamente para decidir vencimento/urgência
// individual (no modo 'prazo_em_dias' cada participante tem um prazo
// diferente, contado a partir de quando ele entrou na avaliação). Retorna
// undefined no modo 'indefinido' — participante sem data-limite nenhuma.
// Nunca chamar estaVencida/calcularDiasAteVencimento/formatData direto com
// esse retorno sem checar undefined primeiro — use os wrappers abaixo
// (participanteVencido/diasAteVencimentoParticipante/formatPrazoParticipante).
export function calcularPrazoParticipante(avaliacao: Avaliacao, participante: ParticipanteAvaliacao): string | undefined {
  if (avaliacao.modoPrazo === 'datas_fixas') {
    return avaliacao.periodoFim!;
  }
  if (avaliacao.modoPrazo === 'indefinido') {
    return undefined;
  }
  return adicionarDias(participante.dataEntrada, avaliacao.prazoDias!);
}

// Texto de período para exibição — única fonte que sabe formatar os 3 modos
// de prazo (datas_fixas / prazo_em_dias / indefinido) e o caso "ainda não
// ativada, sem data nenhuma" (Rascunho). Reusada por qualquer tela que
// mostra o período de uma Avaliacao real (ContentArea.tsx,
// AvaliacaoDetalhePage.tsx, DashboardPage.tsx) e também pelo wizard
// (FormularioAvaliacao.tsx), que simula uma Avaliacao com os campos já
// inferidos para mostrar o mesmo texto em preview, antes de a avaliação
// existir de fato — por isso o parâmetro aceita só os 4 campos de prazo
// (Pick), não a Avaliacao inteira.
export function formatPeriodoAvaliacao(
  avaliacao: Pick<Avaliacao, 'modoPrazo' | 'periodoInicio' | 'periodoFim' | 'prazoDias'>
): string {
  if (!avaliacao.periodoInicio) return 'A definir';
  if (avaliacao.modoPrazo === 'datas_fixas') {
    return avaliacao.periodoFim
      ? formatPeriodo(avaliacao.periodoInicio, avaliacao.periodoFim)
      : formatData(avaliacao.periodoInicio);
  }
  if (avaliacao.modoPrazo === 'indefinido') {
    return `A partir de ${formatData(avaliacao.periodoInicio)} · sem término`;
  }
  const dias = avaliacao.prazoDias;
  return `A partir de ${formatData(avaliacao.periodoInicio)} · ${dias != null ? `${dias} ${dias === 1 ? 'dia' : 'dias'} de prazo` : 'prazo a definir'}`;
}

// Wrappers null-safe de calcularPrazoParticipante — fonte única para toda
// tela que hoje decide vencimento/urgência/exibição de UM participante.
// Nunca repetir "calcularPrazoParticipante(...) != null &&" em cada tela;
// sempre passar por um destes 3.
export function participanteVencido(avaliacao: Avaliacao, participante: ParticipanteAvaliacao, hoje: Date): boolean {
  const prazo = calcularPrazoParticipante(avaliacao, participante);
  return prazo != null && estaVencida(prazo, hoje);
}

export function diasAteVencimentoParticipante(avaliacao: Avaliacao, participante: ParticipanteAvaliacao, hoje: Date): number | null {
  const prazo = calcularPrazoParticipante(avaliacao, participante);
  return prazo != null ? calcularDiasAteVencimento(prazo, hoje) : null;
}

export function formatPrazoParticipante(avaliacao: Avaliacao, participante: ParticipanteAvaliacao): string {
  const prazo = calcularPrazoParticipante(avaliacao, participante);
  return prazo != null ? formatData(prazo) : 'Sem prazo definido';
}

// Escala de níveis ESPECÍFICA de uma habilidade (habilidade.niveis) — nunca
// niveisDefaultData inteiro, que mistura as duas escalas do sistema
// (Básico/Avançado E Iniciante/Aprendiz). Fonte única usada por
// RespostaAvaliacaoPage.tsx, para nunca divergir na junção nível+critério.
export function getNiveisHabilidade(habilidade: Habilidade) {
  return habilidade.niveis
    .map(n => {
      const nivel = niveisDefaultData.find(nd => nd.id === n.nivelId);
      return nivel ? { ...nivel, criterio: n.criterio } : null;
    })
    .filter((n): n is (typeof niveisDefaultData)[number] & { criterio: string } => n != null);
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
  const prazoDe = ({ avaliacao, participante }: ParticipacaoColaborador) =>
    calcularPrazoParticipante(avaliacao, participante);
  // "Em aberto" inclui participantes em modoPrazo 'indefinido' (nunca
  // vencem), mas esses ficam de fora do reduce de "próximo a vencer" logo
  // abaixo — sem prazo, não fazem sentido como candidato a "próxima
  // avaliação encerra em X dias". Se só houver participações 'indefinido'
  // em aberto, diasAteVencimento fica null (exibido como "—").
  const emAberto = participacoes.filter(
    (pc) =>
      (pc.participante.status === 'Não iniciada' || pc.participante.status === 'Em andamento') &&
      !participanteVencido(pc.avaliacao, pc.participante, hoje)
  );
  const emAbertoComPrazo = emAberto.filter((pc) => prazoDe(pc) != null);
  const proximaVencimento = emAbertoComPrazo.length > 0
    ? emAbertoComPrazo.reduce((min, atual) => prazoDe(atual)! < prazoDe(min)! ? atual : min)
    : null;
  const diasAteVencimento = proximaVencimento
    ? calcularDiasAteVencimento(prazoDe(proximaVencimento)!, hoje)
    : null;
  const diasLabel = diasAteVencimento !== null
    ? `${diasAteVencimento} ${diasAteVencimento === 1 ? 'dia' : 'dias'}`
    : '—';
  return { diasAteVencimento, diasLabel, avaliacaoId: proximaVencimento?.avaliacao.id ?? null };
}
