import { useState } from 'react';
import { Calendar, Award, CheckCircle2, Clock, ArrowRight, ChevronRight } from 'lucide-react';
import { RespostaAvaliacao } from './RespostaAvaliacao';
import { ResultadoAvaliacao } from './ResultadoAvaliacao';
import { useAvaliacoes } from '../context/AvaliacoesContext';
import { getParticipacoesColaborador, ParticipacaoColaborador, formatPeriodo, formatData } from '../utils/avaliacoes';
import { JOAO_ID } from '../pages/minhaCarreiraShared';
import { getPesoFromNome } from '../data/mockData';

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

function mediaParticipante(participante: ParticipacaoColaborador['participante']): number | null {
  if (participante.respostas.length === 0) return null;
  const soma = participante.respostas.reduce((acc, r) => acc + getPesoFromNome(r.nivelRespondido), 0);
  return Math.round((soma / participante.respostas.length) * 10) / 10;
}

export function MinhasAvaliacoes() {
  const { avaliacoes } = useAvaliacoes();
  const [viewMode, setViewMode] = useState<'lista' | 'responder' | 'resultado'>('lista');
  const [avaliacaoSelecionadaId, setAvaliacaoSelecionadaId] = useState<string | null>(null);

  // Mesmo helper usado por ColaboradorView.tsx — única fonte do filtro
  // "participações do colaborador, nunca Rascunho".
  const participacoes = getParticipacoesColaborador(avaliacoes, JOAO_ID);

  const handleResponderClick = (avaliacaoId: string) => {
    setAvaliacaoSelecionadaId(avaliacaoId);
    setViewMode('responder');
  };

  const handleVerResultadoClick = (avaliacaoId: string) => {
    setAvaliacaoSelecionadaId(avaliacaoId);
    setViewMode('resultado');
  };

  const handleVoltar = () => {
    setViewMode('lista');
    setAvaliacaoSelecionadaId(null);
  };

  if (viewMode === 'responder' && avaliacaoSelecionadaId) {
    return <RespostaAvaliacao avaliacaoId={avaliacaoSelecionadaId} onVoltar={handleVoltar} />;
  }

  if (viewMode === 'resultado' && avaliacaoSelecionadaId) {
    return <ResultadoAvaliacao avaliacaoId={avaliacaoSelecionadaId} onVoltar={handleVoltar} />;
  }

  const naoIniciadas = participacoes.filter(p => p.participante.status === 'Não iniciada');
  const emAndamento = participacoes.filter(p => p.participante.status === 'Em andamento');
  const concluidas = participacoes.filter(p => p.participante.status === 'Concluída');
  const expiradas = participacoes.filter(p => p.participante.status === 'Expirada');

  // "Última média obtida" — Concluída mais recente (maior periodoFim), média
  // real calculada a partir do peso de cada nível respondido (escala 1-5).
  const ultimaConcluida = concluidas.length > 0
    ? concluidas.reduce((mais, atual) => atual.avaliacao.periodoFim > mais.avaliacao.periodoFim ? atual : mais)
    : null;
  const ultimaMedia = ultimaConcluida ? mediaParticipante(ultimaConcluida.participante) : null;

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
            <span className="text-base font-semibold text-gray-700">Avaliações concluídas</span>
            <CheckCircle2 className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{concluidas.length}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">Última média obtida</span>
            <Award className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{ultimaMedia ?? '-'}</p>
          <p className="text-xs text-gray-400">escala de 1 a 5</p>
        </div>
      </div>

      {/* Avaliações Pendentes */}
      {(naoIniciadas.length > 0 || emAndamento.length > 0) && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Avaliações em aberto</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {[...naoIniciadas, ...emAndamento].map(({ avaliacao, participante }) => {
              const totalHabilidades = avaliacao.habilidades?.length ?? 0;
              const progresso = totalHabilidades > 0
                ? Math.round((participante.respostas.length / totalHabilidades) * 100)
                : 0;
              return (
                <div key={avaliacao.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-medium text-gray-900">
                          {avaliacao.nome}
                        </h3>
                        <span className={`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full ${
                          participante.status === 'Não iniciada'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {participante.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formatPeriodo(avaliacao.periodoInicio, avaliacao.periodoFim)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-400">•</span>
                          <span>{avaliacao.tipo}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-400">•</span>
                          <span>{totalHabilidades} habilidades</span>
                        </div>
                      </div>

                      {progresso > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Progresso</span>
                            <span>{progresso}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[var(--brand-600)] h-2 rounded-full transition-all"
                              style={{ width: `${progresso}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <p className="text-sm text-gray-500">
                        Prazo: {formatData(avaliacao.periodoFim)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleResponderClick(avaliacao.id)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        progresso > 0
                          ? 'border border-[var(--brand-600)] text-[var(--brand-600)] hover:bg-[var(--brand-50)]'
                          : 'text-white bg-[var(--brand-600)] hover:bg-[var(--brand-700)]'
                      }`}
                    >
                      {progresso > 0 ? 'Continuar' : 'Responder'}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Histórico de Avaliações (Concluídas + Expiradas) */}
      {(concluidas.length > 0 || expiradas.length > 0) && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">Histórico de Avaliações</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {[...concluidas, ...expiradas].map(({ avaliacao, participante }) => {
              const media = mediaParticipante(participante);
              return (
                <div key={avaliacao.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-medium text-gray-900">
                          {avaliacao.nome}
                        </h3>
                        <span className={`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full ${
                          participante.status === 'Concluída'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {participante.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formatPeriodo(avaliacao.periodoInicio, avaliacao.periodoFim)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-400">•</span>
                          <span>{avaliacao.tipo}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-gray-400">•</span>
                          <span>{avaliacao.habilidades?.length ?? 0} habilidades</span>
                        </div>
                      </div>

                      {participante.status === 'Expirada' && (
                        <span className="text-xs text-gray-400">Não respondida</span>
                      )}

                      {participante.status === 'Concluída' && media !== null && (
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-[var(--brand-600)]" />
                            <div>
                              <span className="text-sm text-gray-700">
                                Nível médio: <strong>{media}</strong>
                              </span>
                              <p className="text-xs text-gray-400">escala de 1 a 5</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {participante.status === 'Concluída' && (
                      <button
                        onClick={() => handleVerResultadoClick(avaliacao.id)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--brand-600)] hover:bg-[var(--brand-50)] rounded-lg transition-colors"
                      >
                        Ver resultado
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
