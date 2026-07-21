import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { habilidadesData, niveisDefaultData, getCorFromPeso, HOJE_SIMULADO } from '../data/mockData';
import type { NivelNome } from '../../data/schema';
import { useAvaliacoes } from '../context/AvaliacoesContext';
import { JOAO_ID } from '../pages/minhaCarreiraShared';
import { formatPeriodo } from '../utils/avaliacoes';
import { toast } from 'sonner';

interface RespostaAvaliacaoProps {
  avaliacaoId: string;
  onVoltar: () => void;
}

interface CompetenciaGrupo {
  id: string;
  nome: string;
  habilidades: typeof habilidadesData;
}

export function RespostaAvaliacao({ avaliacaoId, onVoltar }: RespostaAvaliacaoProps) {
  const { avaliacoes, responderAvaliacao } = useAvaliacoes();
  const avaliacao = avaliacoes.find(a => a.id === avaliacaoId)!;
  const participanteAtual = avaliacao.participantes.find(p => p.colaboradorId === JOAO_ID)!;

  // Habilidades reais desta avaliação (avaliacao.habilidades) — enunciado vem
  // de habilidadesData[id].descricao, nunca duplicado/inventado aqui.
  const habilidadesAvaliacao = (avaliacao.habilidades ?? [])
    .map(id => habilidadesData.find(h => h.id === id))
    .filter((h): h is (typeof habilidadesData)[number] => h != null);

  const competencias: CompetenciaGrupo[] = Array.from(
    habilidadesAvaliacao
      .reduce((mapa, hab) => {
        if (!mapa.has(hab.competenciaId)) {
          mapa.set(hab.competenciaId, { id: hab.competenciaId, nome: hab.competencia, habilidades: [] as typeof habilidadesData });
        }
        mapa.get(hab.competenciaId)!.habilidades.push(hab);
        return mapa;
      }, new Map<string, CompetenciaGrupo>())
      .values()
  );

  // Retoma respostas já salvas (rascunho 'Em andamento') na primeira renderização.
  const [respostas, setRespostas] = useState<Record<string, string>>(() => {
    const inicial: Record<string, string> = {};
    participanteAtual.respostas.forEach(r => { inicial[r.habilidadeId] = r.nivelRespondido; });
    return inicial;
  });
  const [competenciaExpandida, setCompetenciaExpandida] = useState<string[]>(
    competencias.length > 0 ? [competencias[0].id] : []
  );

  const toggleCompetencia = (competenciaId: string) => {
    setCompetenciaExpandida(prev =>
      prev.includes(competenciaId)
        ? prev.filter(id => id !== competenciaId)
        : [...prev, competenciaId]
    );
  };

  const handleNivelChange = (habilidadeId: string, nivelNome: string) => {
    setRespostas(prev => ({ ...prev, [habilidadeId]: nivelNome }));
  };

  const totalHabilidades = habilidadesAvaliacao.length;
  const respondidas = Object.keys(respostas).length;
  const progresso = totalHabilidades > 0 ? Math.round((respondidas / totalHabilidades) * 100) : 0;

  // dataResposta sempre HOJE_SIMULADO — nunca new Date() (determinismo, ver
  // convenção já usada em DashboardPage.tsx / ColaboradorView.tsx).
  const hojeISO = HOJE_SIMULADO.toISOString().slice(0, 10);

  function respostasParaEnvio() {
    // Os botões de seleção só oferecem nomes vindos de niveisDefaultData (o
    // conjunto fechado de níveis conhecidos), nunca texto livre do colaborador
    // — por isso é seguro estreitar aqui para NivelNome.
    return Object.entries(respostas).map(([habilidadeId, nivelRespondido]) => ({
      habilidadeId,
      nivelRespondido: nivelRespondido as NivelNome,
      dataResposta: hojeISO,
    }));
  }

  const handleSalvarRascunho = () => {
    responderAvaliacao(avaliacaoId, JOAO_ID, respostasParaEnvio(), false);
    toast.success('Respostas salvas! Você pode continuar depois.');
  };

  const handleEnviar = () => {
    if (respondidas < totalHabilidades) {
      toast.error('Por favor, avalie todas as habilidades antes de enviar.');
      return;
    }
    responderAvaliacao(avaliacaoId, JOAO_ID, respostasParaEnvio(), true);
    toast.success('Avaliação enviada com sucesso!');
    setTimeout(() => {
      onVoltar();
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header com botão voltar */}
      <div>
        <button
          onClick={onVoltar}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Minhas Avaliações
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">{avaliacao.nome}</h1>
        <p className="text-sm text-gray-600 mt-1">
          Período: {formatPeriodo(avaliacao.periodoInicio, avaliacao.periodoFim)} • Tipo: {avaliacao.tipo}
        </p>
      </div>

      {/* Instruções */}
      <div className="bg-slate-100 border border-slate-300 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-slate-700">
          <span className="font-medium text-slate-800">Instruções: </span>
          Avalie seu nível de proficiência em cada habilidade listada. Seja honesto e considere sua experiência prática e conhecimento teórico. Você pode salvar como rascunho e continuar depois.
        </p>
      </div>

      {/* Lista de competências e habilidades */}
      <div className="space-y-4">
        {competencias.map((competencia) => {
          const isExpanded = competenciaExpandida.includes(competencia.id);
          const habilidadesRespondidas = competencia.habilidades.filter(h => respostas[h.id]).length;

          return (
            <div key={competencia.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Header da competência */}
              <button
                onClick={() => toggleCompetencia(competencia.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="text-left">
                  <h3 className="text-base font-medium text-gray-900">{competencia.nome}</h3>
                  <p className="text-sm text-gray-500">
                    {habilidadesRespondidas} de {competencia.habilidades.length} habilidades avaliadas
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Lista de habilidades */}
              {isExpanded && (
                <div className="border-t border-gray-200 divide-y divide-gray-200">
                  {competencia.habilidades.map((habilidade) => {
                    // Escala de níveis ESPECÍFICA desta habilidade
                    // (habilidadesData[id].niveis) — nunca niveisDefaultData
                    // inteiro, que mistura as duas escalas do sistema
                    // (Básico/Avançado E Iniciante/Aprendiz).
                    const niveisHabilidade = habilidade.niveis
                      .map(n => {
                        const nivel = niveisDefaultData.find(nd => nd.id === n.nivelId);
                        return nivel ? { ...nivel, criterio: n.criterio } : null;
                      })
                      .filter((n): n is (typeof niveisDefaultData)[number] & { criterio: string } => n != null);

                    return (
                      <div key={habilidade.id} className="p-5 bg-gray-50">
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">{habilidade.nome}</h4>
                          <p className="text-xs text-gray-600">{habilidade.descricao}</p>
                        </div>

                        {/* Seletor de nível */}
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-gray-700 mb-2">Selecione seu nível:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                            {niveisHabilidade.map((nivel) => {
                              const isSelected = respostas[habilidade.id] === nivel.nome;
                              return (
                                <button
                                  key={nivel.id}
                                  onClick={() => handleNivelChange(habilidade.id, nivel.nome)}
                                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                                    isSelected ? '' : 'border-gray-200 hover:border-gray-300 bg-white'
                                  }`}
                                  style={isSelected ? {
                                    borderColor: getCorFromPeso(nivel.peso),
                                    backgroundColor: getCorFromPeso(nivel.peso) + '1A',
                                  } : {}}
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <span
                                      className="text-sm font-medium"
                                      style={isSelected ? { color: getCorFromPeso(nivel.peso) } : { color: '#374151' }}
                                    >
                                      {nivel.nome}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600">{nivel.criterio}</p>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Ações fixas */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 md:-mx-8 flex items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          {respondidas} de {totalHabilidades} habilidades avaliadas ({progresso}%)
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSalvarRascunho}
            className="px-4 py-2 border border-[var(--brand-600)] text-[var(--brand-600)] text-sm font-medium rounded-lg hover:bg-[var(--brand-50)] transition-colors"
          >
            Salvar rascunho
          </button>
          <button
            onClick={handleEnviar}
            disabled={respondidas < totalHabilidades}
            className="px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar avaliação
          </button>
        </div>
      </div>
    </div>
  );
}
