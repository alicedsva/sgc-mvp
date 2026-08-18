import { useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Eye, ListChecks, X } from 'lucide-react';
import { habilidadesData } from '../../data/mockData';
import { NiveisHabilidadeCards } from './NiveisHabilidadeCards';
import { PainelLateralCompetencias } from './PainelLateralCompetencias';

interface CompetenciaGrupo {
  id: string;
  nome: string;
  habilidades: typeof habilidadesData;
}

interface QuestionarioPreviewProps {
  nome: string;
  tipo: string;
  habilidadesIds: string[];
  prazoLabel: string;
  onClose: () => void;
}

// Preview do questionário — reusa a MESMA estrutura visual de
// RespostaAvaliacaoPage.tsx (Instruções → navegação por habilidade → painel
// lateral → níveis com critérios reais), via NiveisHabilidadeCards.tsx e
// PainelLateralCompetencias.tsx (mesmos componentes do fluxo real), mas
// nunca escreve no AvaliacoesContext — a avaliação ainda nem existe de
// verdade neste ponto do cadastro (Etapa Revisão), é só uma prévia do que
// SERIA criado. Overlay sobre a própria página do formulário (nunca uma
// rota), então fechar não perde nada do que já foi preenchido.
export default function QuestionarioPreview({ nome, tipo, habilidadesIds, prazoLabel, onClose }: QuestionarioPreviewProps) {
  const habilidadesPreview = habilidadesIds
    .map(id => habilidadesData.find(h => h.id === id))
    .filter((h): h is (typeof habilidadesData)[number] => h != null);

  const competencias: CompetenciaGrupo[] = Array.from(
    habilidadesPreview
      .reduce((mapa, hab) => {
        if (!mapa.has(hab.competenciaId)) {
          mapa.set(hab.competenciaId, { id: hab.competenciaId, nome: hab.competencia, habilidades: [] as typeof habilidadesData });
        }
        mapa.get(hab.competenciaId)!.habilidades.push(hab);
        return mapa;
      }, new Map<string, CompetenciaGrupo>())
      .values()
  );

  const ordemHabilidades = competencias.flatMap(c => c.habilidades);

  const [passo, setPasso] = useState<'instrucoes' | 'perguntas'>('instrucoes');
  const [habilidadeAtualId, setHabilidadeAtualId] = useState<string | undefined>(ordemHabilidades[0]?.id);

  const indiceAtual = ordemHabilidades.findIndex(h => h.id === habilidadeAtualId);
  const habilidadeAtual = indiceAtual >= 0 ? ordemHabilidades[indiceAtual] : undefined;
  const competenciaAtual = habilidadeAtual
    ? competencias.find(c => c.id === habilidadeAtual.competenciaId)
    : undefined;
  const eUltimaHabilidade = indiceAtual === ordemHabilidades.length - 1;

  const handleAnterior = () => {
    if (indiceAtual > 0) setHabilidadeAtualId(ordemHabilidades[indiceAtual - 1].id);
  };
  const handleProxima = () => {
    if (indiceAtual < ordemHabilidades.length - 1) setHabilidadeAtualId(ordemHabilidades[indiceAtual + 1].id);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-gray-50 flex flex-col">
      {/* Barra de aviso — sempre visível, em qualquer etapa do preview. */}
      <div className="flex-shrink-0 bg-yellow-50 border-b border-yellow-200 px-4 md:px-8 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-yellow-600 flex-shrink-0" />
          <p className="text-sm font-medium text-yellow-800">Modo de visualização. Nenhuma resposta será salva.</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-yellow-800 hover:bg-yellow-100 rounded-lg transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
          Fechar
        </button>
      </div>

      {passo === 'instrucoes' ? (
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-xl bg-white border border-gray-200 rounded-lg p-6 md:p-8 flex flex-col">
            <span className="inline-flex self-start px-2 py-1 text-[10px] md:text-xs font-medium uppercase tracking-wider rounded-full bg-[var(--brand-100)] text-[var(--brand-800)] mb-3">
              {tipo}
            </span>
            <h1 className="text-lg font-semibold text-gray-900 mb-2">{nome || 'Nova Avaliação'}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                <ListChecks className="w-4 h-4 text-gray-400" />
                {ordemHabilidades.length} habilidades
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                <Calendar className="w-4 h-4 text-gray-400" />
                Prazo de entrega: {prazoLabel}
              </span>
            </div>

            <p className="text-sm font-medium text-gray-800 mb-3">Como funciona a autoavaliação:</p>
            <ol className="space-y-3">
              {[
                'Para cada habilidade, o colaborador escolhe a descrição que melhor representa seu conhecimento atual.',
                'Não conhece a habilidade? O colaborador marca "Sem conhecimento" em vez de chutar uma resposta.',
                'A resposta é comparada ao nível esperado do cargo atual e ajuda a identificar oportunidades de desenvolvimento. Não garante promoção.',
                'O colaborador pode sair a qualquer momento. As respostas ficam salvas.',
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
                disabled={ordemHabilidades.length === 0}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Começar
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      ) : habilidadeAtual && competenciaAtual ? (
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto space-y-6 w-full">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-stretch lg:h-[calc(100vh-9rem)]">
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

                {/* Sem onSelecionar: cards não respondem a clique, sem hover
                    de seleção (mesmo componente do fluxo real, modo leitura). */}
                <NiveisHabilidadeCards habilidade={habilidadeAtual} />

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
                  {!eUltimaHabilidade && (
                    <button
                      type="button"
                      onClick={handleProxima}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors"
                    >
                      Próxima habilidade
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Sem respostas/restringirOrdem: toda habilidade é acessível,
                  não há progresso real a proteger no preview. */}
              <PainelLateralCompetencias
                competencias={competencias}
                habilidadeAtualId={habilidadeAtual.id}
                onSelecionar={setHabilidadeAtualId}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
