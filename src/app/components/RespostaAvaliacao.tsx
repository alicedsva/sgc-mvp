import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { habilidadesData, niveisDefaultData, getCorFromPeso, HOJE_SIMULADO } from '../data/mockData';
import type { NivelNome } from '../../data/schema';
import { useAvaliacoes } from '../context/AvaliacoesContext';
import { JOAO_ID } from '../pages/minhaCarreiraShared';
import { formatData } from '../utils/avaliacoes';
import { toast } from 'sonner';

interface CompetenciaGrupo {
  id: string;
  nome: string;
  habilidades: typeof habilidadesData;
}

export function RespostaAvaliacao() {
  const { avaliacaoId } = useParams<{ avaliacaoId: string }>();
  const navigate = useNavigate();
  const onVoltar = () => navigate('/minhas-avaliacoes');
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
  const [instrucoesAbertas, setInstrucoesAbertas] = useState(false);

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
    // Os botões de seleção só oferecem nomes vindos de niveisDefaultData ou o
    // sentinela 'nao_sei' (conjunto fechado de opções, nunca texto livre do
    // colaborador) — por isso é seguro estreitar aqui para NivelNome | 'nao_sei'.
    return Object.entries(respostas).map(([habilidadeId, nivelRespondido]) => ({
      habilidadeId,
      nivelRespondido: nivelRespondido as NivelNome | 'nao_sei',
      dataResposta: hojeISO,
    }));
  }

  const handleSalvarRascunho = () => {
    responderAvaliacao(avaliacao.id, JOAO_ID, respostasParaEnvio(), false);
    toast.success('Respostas salvas! Você pode continuar depois.');
  };

  const handleEnviar = () => {
    if (respondidas < totalHabilidades) {
      toast.error('Por favor, avalie todas as habilidades antes de enviar.');
      return;
    }
    responderAvaliacao(avaliacao.id, JOAO_ID, respostasParaEnvio(), true);
    toast.success('Avaliação enviada com sucesso!');
    setTimeout(() => {
      onVoltar();
    }, 1500);
  };

  return (
    <>
    <div className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-8 space-y-6">
      {/* Header com botão voltar */}
      <div>
        <button
          onClick={onVoltar}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Minhas Avaliações
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">{avaliacao.nome}</h1>
        <p className="text-sm text-gray-600 mt-1">
          Prazo: {formatData(avaliacao.periodoFim)}
        </p>
      </div>

      {/* Instruções — container expansível, mesmo padrão de toggle das
          competências abaixo (useState + Chevron + render condicional). */}
      <div className="bg-white border border-[var(--brand-600)] rounded-lg overflow-hidden">
        <button
          onClick={() => setInstrucoesAbertas(prev => !prev)}
          className="w-full p-4 flex items-center justify-between hover:bg-[var(--brand-50)] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0" />
            <span className="text-base font-semibold text-[var(--brand-600)]">Instruções</span>
          </div>
          {instrucoesAbertas ? (
            <ChevronUp className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
          )}
        </button>
        {instrucoesAbertas && (
          <div className="border-t border-gray-200 px-4 pb-4 pt-3">
            <p className="text-sm font-medium text-gray-800 mb-2">Como funciona a autoavaliação:</p>
            <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
              <li>Para cada habilidade, escolha o nível que melhor representa seu conhecimento atual, com base nos critérios de cada opção.</li>
              <li>Não teve contato com a habilidade ou não sabe avaliar seu nível? Marque "Sem conhecimento" em vez de chutar uma resposta.</li>
              <li>Sua resposta é comparada ao nível esperado para o seu cargo atual e ajuda a identificar oportunidades de desenvolvimento. Ela não garante promoção nem muda seu cargo automaticamente.</li>
              <li>Você pode salvar como rascunho e continuar depois, ou enviar quando finalizar todas as habilidades.</li>
            </ul>
          </div>
        )}
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
                      <div key={habilidade.id} className="p-5 bg-white">
                        <div className="mb-5 flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">{habilidade.nome}</h4>
                            <p className="text-sm text-gray-600">{habilidade.descricao}</p>
                          </div>
                          <span
                            className={`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full flex-shrink-0 ${
                              habilidade.tipo === 'Técnica'
                                ? 'bg-[var(--brand-100)] text-[var(--brand-800)]'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {habilidade.tipo}
                          </span>
                        </div>

                        {/* Seletor de nível */}
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                            {/* Opção "não sei" — sentinela 'nao_sei', sempre primeiro
                                item do grid, mesma célula/formato dos cards de nível
                                (borda sólida, mesmo padding), só a cor de seleção é
                                neutra (nunca derivada de peso) para não ser confundida
                                com um nível de fato respondido. */}
                            <button
                              onClick={() => handleNivelChange(habilidade.id, 'nao_sei')}
                              className={`p-3 rounded-lg border-2 flex flex-col items-start text-left transition-all ${
                                respostas[habilidade.id] === 'nao_sei'
                                  ? 'border-gray-400 bg-gray-100'
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-600">Sem conhecimento</span>
                              </div>
                              <p className="text-xs text-gray-600">Ainda não teve contato ou não sabe avaliar seu nível atual.</p>
                            </button>

                            {niveisHabilidade.map((nivel) => {
                              const isSelected = respostas[habilidade.id] === nivel.nome;
                              return (
                                <button
                                  key={nivel.id}
                                  onClick={() => handleNivelChange(habilidade.id, nivel.nome)}
                                  className={`p-3 rounded-lg border-2 flex flex-col items-start text-left transition-all ${
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
    </div>

    {/* Ações fixas — fora da área scrollável, mesmo padrão de rodapé fixo
        já usado em CriarJornadaPage/EditarJornadaPage/JornadaDetalhePage
        (flex-1 overflow-y-auto no conteúdo + rodapé como irmão dentro do
        <main> flex flex-col h-[calc(100vh-4rem)] — nunca sticky/-mx hack,
        que só gruda durante o scroll e não fixa quando o conteúdo é curto). */}
    <div className="bg-white border-t border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between gap-4">
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
    </>
  );
}
