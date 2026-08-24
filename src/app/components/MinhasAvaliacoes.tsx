import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Calendar, CalendarClock, CheckCircle2, Clock, ArrowRight, BookOpen, Eye } from 'lucide-react';
import { useAvaliacoes } from '../context/AvaliacoesContext';
import { getParticipacoesColaborador, getProximaAvaliacaoInfo, calcularDiasDesde, participanteVencido, diasAteVencimentoParticipante, formatPrazoParticipante, formatData, getStatusParticipanteBadgeClass, type ParticipacaoColaborador } from '../utils/avaliacoes';
import { JOAO_ID } from '../pages/minhaCarreiraShared';
import { HOJE_SIMULADO, habilidadesData } from '../data/mockData';
import type { Avaliacao, TipoHabilidade } from '../../data/schema';
import { Column, InlineAction } from './ui/Table';
import { ListingPage } from './templates/ListingPage';

/*
 * Estados possíveis de uma avaliação para o colaborador:
 *
 * "Não iniciada" — Admin: Ativa    | Colaborador não começou a responder
 * "Em andamento" — Admin: Ativa    | Colaborador começou mas não concluiu
 * "Concluída"    — Admin: Encerrada | Colaborador respondeu dentro do prazo
 * "Expirada"     — Admin: Encerrada | Colaborador não respondeu (prazo encerrado sem resposta)
 *
 * Avaliações com status Admin "Rascunho" não são exibidas ao colaborador —
 * já filtrado dentro de getParticipacoesColaborador.
 */

// Faixa de urgência única — fonte dos limiares reusados pelo ícone/texto do
// card de resumo, pelo filtro Urgente/Sem urgência e pela badge de contagem
// regressiva de cada card (nunca duplicar o limiar 5/10 dias em mais de um
// lugar). Mais de 10 dias: neutro. De 5 a 10: amarelo. Menos de 5 (0-4):
// vermelho.
type BandaUrgencia = 'neutro' | 'amarelo' | 'vermelho';

function bandaUrgencia(diasAteVencimento: number | null): BandaUrgencia {
  if (diasAteVencimento === null) return 'neutro';
  if (diasAteVencimento > 10) return 'neutro';
  if (diasAteVencimento >= 5) return 'amarelo';
  return 'vermelho';
}

// Cor única de urgência por faixa — mesma tonalidade de vermelho/amarelo
// usada tanto no ícone/valor do card-resumo quanto no texto da badge de
// contagem regressiva por card, para os dois nunca divergirem sobre qual
// "vermelho" ou "amarelo" o sistema usa. Ainda claramente distinto do laranja
// escuro do badge "Não iniciada" (orange-100/orange-800). Sem eval em
// aberto: mantém neutro.
function corUrgencia(banda: BandaUrgencia): string {
  if (banda === 'vermelho') return 'text-red-600';
  if (banda === 'amarelo') return 'text-yellow-600';
  return 'text-[var(--brand-600)]';
}

function corUrgenciaDias(diasAteVencimento: number | null): string {
  return corUrgencia(bandaUrgencia(diasAteVencimento));
}

// Badge de contagem regressiva no card — substitui o antigo contorno
// colorido. Reusa bandaUrgencia (mesmo limiar 5/10) e corUrgencia (mesmo
// tom de texto do card-resumo); só a borda é uma tonalidade mais clara,
// própria de badge outline (mesma família já usada em "Rascunho"/
// "Desativada"). null = sem badge (mais de 10 dias).
function badgeUrgenciaCard(dias: number): { label: string; classes: string } | null {
  const banda = bandaUrgencia(dias);
  if (banda === 'neutro') return null;
  const label = dias === 0 ? 'Vence hoje' : dias === 1 ? 'Vence amanhã' : `Vence em ${dias} dias`;
  const borda = banda === 'vermelho' ? 'border-red-300' : 'border-yellow-400';
  const classes = `border ${borda} ${corUrgencia(banda)} bg-transparent`;
  return { label, classes };
}

// Badge de tipo de habilidade — mesmos tokens já usados em ContentArea.tsx
// (coluna "Tipo" de Habilidades): Técnica reaproveita o teal/cyan da marca
// (não é um verde literal), Comportamental usa roxo/lilás.
function classesBadgeTipo(tipo: TipoHabilidade): string {
  return tipo === 'Técnica'
    ? 'bg-[var(--brand-100)] text-[var(--brand-800)]'
    : 'bg-purple-100 text-purple-800';
}

// Tipo(s) presentes numa avaliação, derivados das habilidades reais que a
// compõem — nunca um campo próprio duplicado em Avaliacao.
function tiposDaAvaliacao(avaliacao: Avaliacao): TipoHabilidade[] {
  const tipos = new Set(
    (avaliacao.habilidades ?? [])
      .map(id => habilidadesData.find(h => h.id === id)?.tipo)
      .filter((t): t is TipoHabilidade => t != null)
  );
  return Array.from(tipos);
}

interface HistoricoRow {
  id: string;
  nome: string;
  conclusaoData: string | null;
  totalHabilidades: number;
  status: 'Concluída' | 'Expirada';
  temResultado: boolean;
}

// Badge "🟢 Nova" — some quando o colaborador visualiza (clica em Iniciar/
// Continuar) OU quando os 5 dias desde a criação expiram, o que vier
// primeiro. Nunca marcar como "vista" só por renderizar o card.
const DIAS_LIMITE_NOVA = 5;

function isAvaliacaoNova(participante: { visualizada: boolean }, periodoInicio: string, hoje: Date): boolean {
  return !participante.visualizada && calcularDiasDesde(periodoInicio, hoje) < DIAS_LIMITE_NOVA;
}

// Última resposta de um participante — fonte única da "data de conclusão",
// reusada pelo Histórico (toHistoricoRow) e pela métrica "% dentro do prazo"
// do card de resumo, nunca duplicar essa conta.
function ultimaDataResposta(respostas: { dataResposta: string }[]): string | null {
  if (respostas.length === 0) return null;
  return respostas.map(r => r.dataResposta).reduce((maisRecente, atual) => (atual > maisRecente ? atual : maisRecente));
}

export function MinhasAvaliacoes() {
  const navigate = useNavigate();
  const { avaliacoes, marcarComoVisualizada } = useAvaliacoes();

  // Mesmo helper usado por ColaboradorView.tsx — única fonte do filtro
  // "participações do colaborador, nunca Rascunho".
  const participacoes = getParticipacoesColaborador(avaliacoes, JOAO_ID);

  const handleResponderClick = (avaliacaoId: string) => {
    marcarComoVisualizada(avaliacaoId, JOAO_ID);
    navigate(`/minhas-avaliacoes/responder/${avaliacaoId}`);
  };

  const handleVerResultadoClick = (avaliacaoId: string) => {
    navigate(`/minhas-avaliacoes/resultado/${avaliacaoId}`);
  };

  // "Aberta" (Não iniciada/Em andamento) só conta se o prazo ainda não
  // passou — uma avaliação vencida sem resposta vira Expirada dinamicamente
  // e migra para o Histórico, nunca depende de um status gravado à mão
  // (mesma regra de estaVencida usada por getProximaAvaliacaoInfo e
  // ColaboradorView.tsx).
  const naoIniciadas = participacoes.filter(
    p => p.participante.status === 'Não iniciada' && !participanteVencido(p.avaliacao, p.participante, HOJE_SIMULADO)
  );
  const emAndamento = participacoes.filter(
    p => p.participante.status === 'Em andamento' && !participanteVencido(p.avaliacao, p.participante, HOJE_SIMULADO)
  );
  const concluidas = participacoes.filter(p => p.participante.status === 'Concluída');
  // Expiradas: tanto as já gravadas como tal no mock quanto as que só agora,
  // por prazo vencido, deixam de contar como abertas — as duas se comportam
  // igual no Histórico. Participante em modoPrazo 'indefinido' nunca entra
  // aqui (participanteVencido é sempre false sem prazo definido).
  const expiradasGravadas = participacoes.filter(p => p.participante.status === 'Expirada');
  const expiradasPorPrazo = participacoes.filter(
    p =>
      (p.participante.status === 'Não iniciada' || p.participante.status === 'Em andamento') &&
      participanteVencido(p.avaliacao, p.participante, HOJE_SIMULADO)
  );

  // Filtro de tipo + urgência do grid "Avaliações em aberto" — os dois grupos
  // combinam em AND. "Urgente" agrupa vermelho+amarelo (prazo ≤ 10 dias),
  // mesmo limiar já usado por bandaUrgencia. Aplica-se só a este grid, nunca
  // ao Histórico (que já tem busca/filtro próprios via ListingPage).
  const [filtroTipo, setFiltroTipo] = useState<'todas' | TipoHabilidade>('todas');
  const [filtroUrgencia, setFiltroUrgencia] = useState<'todas' | 'urgente' | 'sem-urgencia'>('todas');

  const avaliacoesAbertasFiltradas = [...naoIniciadas, ...emAndamento]
    .filter(({ avaliacao, participante }) => {
      const matchTipo = filtroTipo === 'todas' || tiposDaAvaliacao(avaliacao).includes(filtroTipo);
      const dias = diasAteVencimentoParticipante(avaliacao, participante, HOJE_SIMULADO);
      // Sem prazo definido (modoPrazo 'indefinido') nunca é "urgente".
      const urgente = dias !== null && dias <= 10;
      const matchUrgencia = filtroUrgencia === 'todas' || (filtroUrgencia === 'urgente' ? urgente : !urgente);
      return matchTipo && matchUrgencia;
    })
    .sort((a, b) => {
      const aNova = isAvaliacaoNova(a.participante, a.avaliacao.periodoInicio, HOJE_SIMULADO);
      const bNova = isAvaliacaoNova(b.participante, b.avaliacao.periodoInicio, HOJE_SIMULADO);
      return Number(bNova) - Number(aNova);
    });

  // "Próxima avaliação encerra em" — mesma fonte usada por ColaboradorView.tsx
  // (Meu Perfil), para os dois nunca divergirem.
  const { diasAteVencimento, diasLabel, avaliacaoId: proximaAvaliacaoId } = getProximaAvaliacaoInfo(participacoes, HOJE_SIMULADO);
  const corDiasLabel = corUrgenciaDias(diasAteVencimento);
  // Nome da avaliação mais próxima — mesmo id já calculado acima, só uma
  // busca no array de participações já carregado (nenhum cálculo novo).
  const proximaAvaliacaoNome = participacoes.find(p => p.avaliacao.id === proximaAvaliacaoId)?.avaliacao.nome ?? null;

  // Histórico (Concluídas + Expiradas) — Conclusão é sempre a dataResposta
  // mais recente do participante, nunca periodoFim da avaliação. Expirada
  // nunca tem resposta (respostas sempre []), então fica "—". Status
  // "Expirada" aqui é sempre o status EFETIVO (calculado), não o campo bruto
  // — cobre tanto o gravado no mock quanto o vencido por prazo.
  function toHistoricoRow(
    { avaliacao, participante }: ParticipacaoColaborador,
    statusEfetivo: 'Concluída' | 'Expirada'
  ): HistoricoRow {
    const conclusaoData = ultimaDataResposta(participante.respostas);
    return {
      id: avaliacao.id,
      nome: avaliacao.nome,
      conclusaoData,
      totalHabilidades: avaliacao.habilidades?.length ?? 0,
      status: statusEfetivo,
      temResultado: statusEfetivo === 'Concluída',
    };
  }

  const historicoRows: HistoricoRow[] = [
    ...concluidas.map(p => toHistoricoRow(p, 'Concluída')),
    ...expiradasGravadas.map(p => toHistoricoRow(p, 'Expirada')),
    ...expiradasPorPrazo.map(p => toHistoricoRow(p, 'Expirada')),
  ];

  // Filtro/busca do Histórico — mesmo padrão de ListingPage/ContentArea.tsx
  // (busca + statusFilter, paginação resetada para página 1 quando um dos
  // dois muda).
  const [buscaHistorico, setBuscaHistorico] = useState('');
  const [statusFilterHistorico, setStatusFilterHistorico] = useState('todas');
  const [historicoPage, setHistoricoPage] = useState(1);
  const [historicoItemsPerPage, setHistoricoItemsPerPage] = useState(10);

  useEffect(() => {
    setHistoricoPage(1);
  }, [buscaHistorico, statusFilterHistorico]);

  const historicoFiltrado = historicoRows.filter(row => {
    const matchBusca = row.nome.toLowerCase().includes(buscaHistorico.toLowerCase());
    const matchStatus = statusFilterHistorico === 'todas' || row.status.toLowerCase() === statusFilterHistorico.toLowerCase();
    return matchBusca && matchStatus;
  });
  const historicoPaginado = historicoFiltrado.slice(
    (historicoPage - 1) * historicoItemsPerPage,
    historicoPage * historicoItemsPerPage
  );

  const historicoColumns: Column[] = [
    { key: 'nome', label: 'Avaliação realizada', width: '35%' },
    {
      key: 'conclusaoData',
      label: 'Conclusão',
      width: '15%',
      render: (value: string | null) => <span>{value ? formatData(value) : '—'}</span>,
    },
    {
      key: 'totalHabilidades',
      label: 'Habilidades',
      width: '15%',
      render: (value: number) => <span>{value} habilidades</span>,
    },
    {
      key: 'status',
      label: 'Status',
      width: '15%',
      render: (value: 'Concluída' | 'Expirada') => (
        <span className={`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full ${getStatusParticipanteBadgeClass(value)}`}>
          {value}
        </span>
      ),
    },
  ];

  // Ícone sozinho (Eye), mesmo padrão de habilidadesActions/avaliacoesActions
  // em ContentArea.tsx — "Visualizar" vira tooltip via title, não texto
  // visível. Só aparece quando há resultado (Concluída) — Expirada sem
  // resposta fica sem ação, mesmo padrão já usado nas tabelas do sistema
  // (ex.: ação "Encerrar" em ContentArea.tsx, ocultada via show, nunca
  // desabilitada).
  const historicoActions: InlineAction[] = [
    {
      label: 'Visualizar',
      icon: <Eye className="w-4 h-4" />,
      show: (row: HistoricoRow) => row.temResultado,
      onClick: (row: HistoricoRow) => handleVerResultadoClick(row.id),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Minhas Avaliações</h1>
        <p className="text-sm text-gray-600 mt-2">
          Responda suas avaliações e acompanhe seus resultados
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">Avaliações em aberto</span>
            <Clock className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{naoIniciadas.length + emAndamento.length}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">Próxima avaliação encerra em</span>
            <CalendarClock className={`w-5 h-5 flex-shrink-0 ${corDiasLabel}`} />
          </div>
          <p className={`text-3xl font-bold ${corDiasLabel}`}>{diasLabel}</p>
          {proximaAvaliacaoNome && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-1">{proximaAvaliacaoNome}</p>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">Avaliações concluídas</span>
            <CheckCircle2 className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{concluidas.length}</p>
        </div>
      </div>

      {/* Avaliações Pendentes — título solto + grid de cards, sem container/card ao redor */}
      {(naoIniciadas.length > 0 || emAndamento.length > 0) && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Avaliações em aberto</h2>

          <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {([
                { value: 'todas', label: 'Todas' },
                { value: 'Técnica', label: 'Técnica' },
                { value: 'Comportamental', label: 'Comportamental' },
              ] as const).map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFiltroTipo(opt.value)}
                  className={`px-3 py-2 text-sm font-normal rounded-md transition-all whitespace-nowrap ${
                    filtroTipo === opt.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {([
                { value: 'todas', label: 'Todas' },
                { value: 'urgente', label: 'Urgente' },
                { value: 'sem-urgencia', label: 'Sem urgência' },
              ] as const).map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFiltroUrgencia(opt.value)}
                  className={`px-3 py-2 text-sm font-normal rounded-md transition-all whitespace-nowrap ${
                    filtroUrgencia === opt.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {avaliacoesAbertasFiltradas.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-500">Nenhuma avaliação encontrada com esse filtro.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {avaliacoesAbertasFiltradas.map(({ avaliacao, participante }) => {
              const totalHabilidades = avaliacao.habilidades?.length ?? 0;
              const progresso = totalHabilidades > 0
                ? Math.round((participante.respostas.length / totalHabilidades) * 100)
                : 0;
              const tipos = tiposDaAvaliacao(avaliacao);
              // Urgência do PRÓPRIO prazo desta avaliação — cada card calcula
              // a sua badge conforme o seu periodoFim, não mais só a mais
              // urgente de todas.
              const diasCard = diasAteVencimentoParticipante(avaliacao, participante, HOJE_SIMULADO);
              const badgeUrgencia = diasCard !== null ? badgeUrgenciaCard(diasCard) : null;
              const isNova = isAvaliacaoNova(participante, avaliacao.periodoInicio, HOJE_SIMULADO);
              return (
                <div
                  key={avaliacao.id}
                  className="flex flex-col h-full rounded-lg p-5 bg-white border border-gray-200 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex flex-wrap gap-1.5">
                      {tipos.map(tipo => (
                        <span
                          key={tipo}
                          className={`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full ${classesBadgeTipo(tipo)}`}
                        >
                          {tipo}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                      {isNova && (
                        <span className="inline-flex items-center gap-1.5 px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full border border-green-300 text-green-800 bg-transparent whitespace-nowrap flex-shrink-0">
                          <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                          Nova
                        </span>
                      )}
                      {badgeUrgencia && (
                        <span className={`inline-flex items-center gap-1 px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full whitespace-nowrap flex-shrink-0 ${badgeUrgencia.classes}`}>
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          {badgeUrgencia.label}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-medium text-gray-900 line-clamp-2 mb-3">
                    {avaliacao.nome}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <span>{totalHabilidades} habilidades</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Prazo: {formatPrazoParticipante(avaliacao, participante)}</span>
                    </div>
                  </div>

                  <div className="my-4 flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[var(--brand-600)] h-2 rounded-full transition-all"
                        style={{ width: `${progresso}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 flex-shrink-0">{progresso}%</span>
                  </div>

                  <button
                    onClick={() => handleResponderClick(avaliacao.id)}
                    className={`mt-auto w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      progresso > 0
                        ? 'border border-[var(--brand-600)] text-[var(--brand-600)] hover:bg-[var(--brand-50)]'
                        : 'text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)]'
                    }`}
                  >
                    {progresso > 0 ? 'Continuar avaliação' : 'Iniciar avaliação'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
          )}
        </div>
      )}

      {/* Histórico de Avaliações — título fora do container de filtro, que
          por sua vez fica separado da tabela (mesmo padrão de ListingPage.tsx
          usado pelo Admin em Competências/Habilidades/Carreiras/Avaliações). */}
      {historicoRows.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Histórico de avaliações</h2>

          <ListingPage
            columns={historicoColumns}
            data={historicoPaginado}
            actions={historicoActions}
            searchPlaceholder="Buscar avaliação"
            onSearch={setBuscaHistorico}
            statusFilter={{
              value: statusFilterHistorico,
              onChange: setStatusFilterHistorico,
              options: [
                { value: 'todas', label: 'Todas' },
                { value: 'concluída', label: 'Concluída' },
                { value: 'expirada', label: 'Expirada' },
              ],
            }}
            emptyState={{
              icon: <CheckCircle2 className="w-8 h-8" />,
              title: 'Nenhuma avaliação no histórico',
              description: 'Avaliações concluídas ou expiradas aparecerão aqui.',
            }}
            pagination={{
              currentPage: historicoPage,
              itemsPerPage: historicoItemsPerPage,
              totalItems: historicoFiltrado.length,
              onPageChange: setHistoricoPage,
              onItemsPerPageChange: (itemsPerPage) => {
                setHistoricoItemsPerPage(itemsPerPage);
                setHistoricoPage(1);
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
