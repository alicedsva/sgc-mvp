import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AlertCircle, ArrowLeft, ArrowRight, Calendar, ListChecks, Save } from 'lucide-react';
import { habilidadesData, HOJE_SIMULADO } from '../data/mockData';
import { formatPrazoParticipante } from '../utils/avaliacoes';
import { JOAO_ID } from './minhaCarreiraShared';
import { useAvaliacoes } from '../context/AvaliacoesContext';
import { NiveisHabilidadeCards } from '../components/avaliacoes/NiveisHabilidadeCards';
import { PainelLateralCompetencias } from '../components/avaliacoes/PainelLateralCompetencias';
import { LinhaMeta } from '../components/avaliacoes/LinhaMeta';
import { ModalConclusaoAvaliacao } from '../components/avaliacoes/ModalConclusaoAvaliacao';
import type { NivelNome } from '../../data/schema';
import { toast } from 'sonner';

// Responder Avaliação — modo de foco (fullscreen, sem Sidebar/Header do
// sistema), rota irmã fora da árvore de Layout.tsx (ver routes.ts). Promovido
// a partir do protótipo /testes/resposta-sem-nome (vencedor da exploração de
// wizard) — fluxo em 2 passos: Instruções como tela própria (só o card
// único, sem revelar competências/habilidades da avaliação antes de
// começar), depois o wizard (uma habilidade por vez + navegação lateral por
// competência). Nas opções de nível, o NOME do nível nunca aparece — só a
// descrição/critério, em ordem de peso crescente, forçando a escolha pelo
// conteúdo em vez do rótulo. "Sem conhecimento" continua com nome visível —
// não é um nível na escala, é uma categoria à parte.
// Cada seleção de nível chama responderAvaliacao(..., enviar: false)
// imediatamente (persistência real, via AvaliacoesContext/localStorage) —
// por isso lê de useAvaliacoes().avaliacoes, nunca do avaliacoesData
// estático, senão uma resposta já salva não apareceria ao reabrir a rota.
// O botão único "Salvar e sair" no header reafirma esse estado (mesmo toast
// de handleSalvarRascunho no formato antigo) e sai direto, sem indicador
// automático permanente na tela nem diálogo de confirmação separado.

interface CompetenciaGrupo {
  id: string;
  nome: string;
  habilidades: typeof habilidadesData;
}

export default function RespostaAvaliacaoPage() {
  const { avaliacaoId } = useParams<{ avaliacaoId: string }>();
  const navigate = useNavigate();
  const handleVoltar = () => navigate('/minhas-avaliacoes');
  const { avaliacoes, responderAvaliacao } = useAvaliacoes();

  // Sem "!" — avaliacaoId inválido na URL ou colaborador fora dos
  // participantes não pode quebrar a tela (ver estado de erro depois de
  // todos os hooks, logo abaixo).
  const avaliacao = avaliacoes.find(a => a.id === avaliacaoId);
  const participanteAtual = avaliacao?.participantes.find(p => p.colaboradorId === JOAO_ID);

  const habilidadesAvaliacao = (avaliacao?.habilidades ?? [])
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

  // Ordem sequencial "Anterior"/"Próxima" — mesma ordem da lista lateral
  // (agrupada por competência), nunca uma ordem separada que poderia
  // divergir do que o colaborador vê no painel direito.
  const ordemHabilidades = competencias.flatMap(c => c.habilidades);

  const [respostas, setRespostas] = useState<Record<string, string>>(() => {
    const inicial: Record<string, string> = {};
    participanteAtual?.respostas.forEach(r => { inicial[r.habilidadeId] = r.nivelRespondido; });
    return inicial;
  });
  const [passo, setPasso] = useState<'instrucoes' | 'perguntas'>('instrucoes');
  const [habilidadeAtualId, setHabilidadeAtualId] = useState<string | undefined>(ordemHabilidades[0]?.id);
  // Controla o ModalConclusaoAvaliacao — aberto só pelo envio final
  // (handleEnviar), nunca fecha sozinho (sem onClose/timeout), só pelas duas
  // ações do próprio modal (Ver resultado / Finalizar), cada uma navegando
  // para um destino diferente.
  const [modalConclusaoAberto, setModalConclusaoAberto] = useState(false);

  const totalHabilidades = habilidadesAvaliacao.length;
  const respondidas = Object.keys(respostas).length;
  const progresso = totalHabilidades > 0 ? Math.round((respondidas / totalHabilidades) * 100) : 0;
  const corProgresso = progresso === 100 ? '#16A34A' : progresso > 0 ? '#F59E0B' : '#E5E7EB';

  const indiceAtual = ordemHabilidades.findIndex(h => h.id === habilidadeAtualId);
  const habilidadeAtual = indiceAtual >= 0 ? ordemHabilidades[indiceAtual] : undefined;
  const competenciaAtual = habilidadeAtual
    ? competencias.find(c => c.id === habilidadeAtual.competenciaId)
    : undefined;
  const eUltimaHabilidade = indiceAtual === ordemHabilidades.length - 1;

  // Estado de erro — avaliacaoId inválido na URL ou colaborador fora dos
  // participantes desta avaliação. Depois de todos os hooks (nunca antes —
  // regra dos hooks), renderizado dentro do próprio shell fullscreen (sem
  // Layout/Sidebar em volta).
  if (!avaliacao || !participanteAtual) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {!avaliacao ? 'Avaliação não encontrada' : 'Você não tem acesso a esta avaliação'}
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {!avaliacao
              ? 'Esta avaliação não existe ou foi removida.'
              : 'Você não está entre os participantes desta avaliação.'}
          </p>
          <button
            onClick={handleVoltar}
            className="px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors"
          >
            Voltar para Minhas Avaliações
          </button>
        </div>
      </div>
    );
  }

  // Monta a lista completa no formato do Context a partir do dicionário de
  // respostas em memória — reusado pela persistência por seleção, pelo botão
  // "Salvar e sair" e pelo envio final.
  const respostasParaEnvio = (dict: Record<string, string>) => {
    const hojeISO = HOJE_SIMULADO.toISOString().slice(0, 10);
    return Object.entries(dict).map(([hId, nivel]) => ({
      habilidadeId: hId,
      nivelRespondido: nivel as NivelNome | 'nao_sei',
      dataResposta: hojeISO,
    }));
  };

  // Persistência a cada seleção — chama responderAvaliacao(enviar: false)
  // imediatamente com a lista COMPLETA de respostas (o Context substitui o
  // array inteiro, nunca faz merge), então sempre parte do objeto já
  // mesclado, não do estado antigo por closure.
  const handleNivelChange = (habilidadeId: string, nivelNome: string) => {
    const novasRespostas = { ...respostas, [habilidadeId]: nivelNome };
    setRespostas(novasRespostas);
    responderAvaliacao(avaliacao.id, JOAO_ID, respostasParaEnvio(novasRespostas), false);
  };

  const irPara = (habilidadeId: string) => {
    setHabilidadeAtualId(habilidadeId);
  };

  const handleAnterior = () => {
    if (indiceAtual > 0) setHabilidadeAtualId(ordemHabilidades[indiceAtual - 1].id);
  };

  const handleProxima = () => {
    if (indiceAtual < ordemHabilidades.length - 1) setHabilidadeAtualId(ordemHabilidades[indiceAtual + 1].id);
  };

  // Ação única do header: as respostas já estão persistidas a cada seleção,
  // então isso só reafirma o estado atual (mesmo toast do antigo
  // handleSalvarRascunho) e sai direto — sem diálogo de confirmação de "não
  // salvo", pois não há nada que dependa de precisão de estado aqui.
  const handleSalvarESair = () => {
    responderAvaliacao(avaliacao.id, JOAO_ID, respostasParaEnvio(respostas), false);
    toast.success('Respostas salvas! Você pode continuar depois.');
    navigate('/minhas-avaliacoes');
  };

  // Envio final: bloqueia com toast.error se houver habilidade sem resposta
  // — nunca permite envio parcial. Só chama responderAvaliacao(enviar: true)
  // — que marca o participante como 'Concluída' no Context — quando 100%
  // das habilidades foram respondidas. Em vez de toast + redirect automático,
  // abre o ModalConclusaoAvaliacao (mesma anatomia visual de
  // ModalResumoAvaliacao.tsx) — a navegação some daqui e vira responsabilidade
  // exclusiva das duas ações do modal.
  const handleEnviar = () => {
    if (respondidas < totalHabilidades) {
      toast.error('Por favor, avalie todas as habilidades antes de enviar.');
      return;
    }
    responderAvaliacao(avaliacao.id, JOAO_ID, respostasParaEnvio(respostas), true);
    setModalConclusaoAberto(true);
  };

  const handleVerResultado = () => {
    navigate(`/minhas-avaliacoes/resultado/${avaliacao.id}`);
  };

  const handleFinalizarConclusao = () => {
    navigate('/minhas-avaliacoes');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Barra superior mínima — sem Sidebar/Header do sistema. Só aparece
          durante as perguntas: na etapa de Instruções o próprio card já
          mostra nome/prazo, então uma segunda barra repetiria a mesma
          informação. */}
      {passo === 'perguntas' && (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          {/* Título (nome da avaliação) fica fora do LinhaMeta — não é uma
              "parte" de metadado, é o identificador principal da tela nesse
              modo fullscreen (equivalente ao H1 que não existe aqui), por
              isso mantém truncate + peso próprio em vez de entrar no texto
              corrido do subtítulo. */}
          <div className="min-w-0 flex items-baseline gap-2">
            <p className="text-sm font-semibold text-gray-900 truncate">{avaliacao.nome}</p>
            <LinhaMeta
              className="text-sm text-gray-600 flex-shrink-0"
              partes={[`Prazo: ${formatPrazoParticipante(avaliacao, participanteAtual)}`]}
            />
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleSalvarESair}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              {respondidas > 0 ? 'Salvar e sair' : 'Sair'}
            </button>
          </div>
        </div>
      )}

      {passo === 'instrucoes' ? (
        /* flex-1 + items-center/justify-center: centraliza o card no espaço
           restante da viewport (min-h-screen no container raiz, sem altura
           fixa/margin-top) — nunca corta em telas menores, porque o próprio
           flex container cresce com o conteúdo (flex-grow) quando o card é
           mais alto que a viewport, deixando a página rolar normalmente em
           vez de cortar o topo. Header não existe nesta etapa (só em
           'perguntas'), então o espaço disponível é a viewport inteira. */
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          {/* Só o card único — sem painel lateral de competências, para não
              revelar quais competências/habilidades serão avaliadas antes de
              o colaborador começar. */}
          <div className="w-full max-w-xl bg-white border border-gray-200 rounded-lg p-6 md:p-8 flex flex-col">
            <span className="inline-flex self-start px-2 py-1 text-[10px] md:text-xs font-medium uppercase tracking-wider rounded-full bg-[var(--brand-100)] text-[var(--brand-800)] mb-3">
              {avaliacao.tipo}
            </span>
            <h1 className="text-lg font-semibold text-gray-900 mb-2">{avaliacao.nome}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                <ListChecks className="w-4 h-4 text-gray-400" />
                {totalHabilidades} habilidades
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                <Calendar className="w-4 h-4 text-gray-400" />
                Prazo de resposta: {formatPrazoParticipante(avaliacao, participanteAtual)}
              </span>
            </div>

            <p className="text-sm font-medium text-gray-800 mb-3">Como funciona a autoavaliação:</p>
            <ol className="space-y-3">
              {[
                'Para cada habilidade, escolha a descrição que melhor representa seu conhecimento atual.',
                'Não conhece a habilidade? Marque "Sem conhecimento" em vez de chutar uma resposta.',
                'Sua resposta é comparada ao nível esperado do seu cargo atual e ajuda a identificar oportunidades de desenvolvimento. Não garante promoção.',
                'Você pode sair a qualquer momento — suas respostas ficam salvas.',
              ].map((texto, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-medium flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-700 pt-0.5">{texto}</p>
                </li>
              ))}
            </ol>

            <div className="flex items-center gap-3 mt-8">
              <button
                type="button"
                onClick={() => setPasso('perguntas')}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors"
              >
                Começar
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleVoltar}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      ) : habilidadeAtual && competenciaAtual ? (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 w-full">
            {/* Progresso */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">Progresso da Autoavaliação</p>
                <p className="text-sm text-gray-500">{respondidas} de {totalHabilidades} habilidades respondidas ({progresso}%)</p>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${progresso}%`, backgroundColor: corProgresso }}
                />
              </div>
            </div>

            {/* Wizard: painel principal + painel lateral — altura igual entre
                os dois, calculada uma única vez neste wrapper (nunca cada
                painel calculando a própria altura de forma independente). */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-stretch lg:h-[calc(100vh-16rem)]">

              {/* Painel principal — h-full herda a altura do wrapper acima;
                  bloco de opções abaixo cresce via flex-1 para preencher o
                  espaço restante, empurrando a navegação para a base. */}
              <div className="w-full lg:flex-1 lg:h-full bg-white border border-gray-200 rounded-lg p-5 md:p-6 flex flex-col">
                <div className="mb-5">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{competenciaAtual.nome}</p>
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">{habilidadeAtual.nome}</h2>
                    <span
                      className={`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full flex-shrink-0 ${
                        habilidadeAtual.tipo === 'Técnica'
                          ? 'bg-[var(--brand-100)] text-[var(--brand-800)]'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {habilidadeAtual.tipo}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{habilidadeAtual.descricao}</p>
                </div>

                {/* Lista de níveis — extraída para NiveisHabilidadeCards.tsx,
                    reusada também pelo preview do questionário (Etapa
                    Revisão do cadastro de avaliação). flex-1 + overflow-y-auto
                    do componente preenche o espaço restante do painel. */}
                <NiveisHabilidadeCards
                  habilidade={habilidadeAtual}
                  respostaAtual={respostas[habilidadeAtual.id]}
                  onSelecionar={(nivel) => handleNivelChange(habilidadeAtual.id, nivel)}
                />

                {/* Navegação sequencial */}
                <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleAnterior}
                    disabled={indiceAtual <= 0}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Anterior
                  </button>
                  <p className="text-xs text-gray-400">{indiceAtual + 1} de {ordemHabilidades.length}</p>
                  {eUltimaHabilidade ? (
                    <button
                      type="button"
                      onClick={handleEnviar}
                      disabled={respondidas < totalHabilidades}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Enviar avaliação
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleProxima}
                      disabled={!respostas[habilidadeAtual.id]}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Próxima habilidade
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Painel lateral — extraído para PainelLateralCompetencias.tsx,
                  reusado também pelo preview do questionário. lg:h-full
                  (nunca max-h independente) garante a MESMA altura do painel
                  principal, ambos lidos do wrapper acima. restringirOrdem
                  trava habilidades futuras aqui (fluxo real, progresso de
                  verdade a proteger) — o preview não passa essa prop. */}
              <PainelLateralCompetencias
                competencias={competencias}
                habilidadeAtualId={habilidadeAtual.id}
                onSelecionar={irPara}
                respostas={respostas}
                restringirOrdem
                ordemHabilidades={ordemHabilidades}
              />
            </div>
        </div>
      ) : null}

      {modalConclusaoAberto && (
        <ModalConclusaoAvaliacao
          nomeAvaliacao={avaliacao.nome}
          onVerResultado={handleVerResultado}
          onFinalizar={handleFinalizarConclusao}
        />
      )}
    </div>
  );
}
