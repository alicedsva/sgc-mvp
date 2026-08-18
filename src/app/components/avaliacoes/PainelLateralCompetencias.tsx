import { Check } from 'lucide-react';

interface HabilidadeLike {
  id: string;
  nome: string;
}

interface CompetenciaGrupoLike {
  id: string;
  nome: string;
  habilidades: HabilidadeLike[];
}

interface PainelLateralCompetenciasProps {
  competencias: CompetenciaGrupoLike[];
  habilidadeAtualId?: string;
  onSelecionar: (habilidadeId: string) => void;
  /** Ausente = nenhuma habilidade marcada como respondida (preview, sem estado de progresso real). */
  respostas?: Record<string, string>;
  /** true = só permite acessar habilidades já respondidas ou a próxima da fila (fluxo real, protege progresso). false = navegação livre, usado pelo preview (não há progresso real a proteger). */
  restringirOrdem?: boolean;
  /** Necessário só quando restringirOrdem é true, para calcular a "próxima" da fila. */
  ordemHabilidades?: HabilidadeLike[];
}

// Navegação lateral por competência — extraído de RespostaAvaliacaoPage.tsx
// para ser reusado também pelo preview do questionário
// (QuestionarioPreview.tsx). No fluxo real, restringirOrdem=true trava
// habilidades futuras (nunca pular a fila); no preview não há progresso
// real a proteger, então toda habilidade é acessível.
export function PainelLateralCompetencias({
  competencias, habilidadeAtualId, onSelecionar, respostas, restringirOrdem = false, ordemHabilidades = [],
}: PainelLateralCompetenciasProps) {
  const primeiroNaoRespondidoIndex = restringirOrdem
    ? ordemHabilidades.findIndex(h => !respostas?.[h.id])
    : -1;

  return (
    <div className="w-full lg:w-72 flex-shrink-0 lg:h-full bg-white border border-gray-200 rounded-lg p-4 lg:overflow-y-auto scrollbar-thin">
      <div className="space-y-4">
        {competencias.map((competencia) => (
          <div key={competencia.id}>
            <p className="text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
              {competencia.nome}
            </p>
            <div className="space-y-0.5">
              {competencia.habilidades.map((habilidade) => {
                const respondida = !!respostas?.[habilidade.id];
                const isAtual = habilidade.id === habilidadeAtualId;
                const indice = ordemHabilidades.findIndex(h => h.id === habilidade.id);
                const podeAcessar = !restringirOrdem || respondida || indice === primeiroNaoRespondidoIndex;
                return (
                  <button
                    key={habilidade.id}
                    type="button"
                    onClick={() => podeAcessar && onSelecionar(habilidade.id)}
                    disabled={!podeAcessar}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                      isAtual ? 'bg-[var(--brand-50)]' : podeAcessar ? 'hover:bg-gray-50' : 'cursor-not-allowed'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border-2 ${
                        respondida ? 'border-[var(--brand-400)] bg-[var(--brand-400)]' : 'border-gray-300'
                      }`}
                    >
                      {respondida && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                    </span>
                    <span
                      className={`text-xs truncate ${
                        isAtual ? 'text-[var(--brand-700)] font-medium' : podeAcessar ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      {habilidade.nome}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
