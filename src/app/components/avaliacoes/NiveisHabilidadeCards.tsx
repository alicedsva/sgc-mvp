import { getCorFromPeso } from '../../data/mockData';
import { getNiveisHabilidade } from '../../utils/avaliacoes';
import type { Habilidade } from '../../../data/schema';

const SEM_CONHECIMENTO = 'nao_sei';

interface NiveisHabilidadeCardsProps {
  habilidade: Habilidade;
  respostaAtual?: string;
  /** Ausente = somente leitura: cards não respondem a clique, sem estado de hover de seleção. Usado pelo preview do questionário (FormularioAvaliacao). */
  onSelecionar?: (nivelNome: string) => void;
}

// Lista de níveis (+ "Sem conhecimento") de uma habilidade — extraído de
// RespostaAvaliacaoPage.tsx para ser reusado também pelo preview do
// questionário (QuestionarioPreview.tsx), sem duplicar a estrutura visual.
// Nome do nível propositalmente omitido nas opções — só o critério é
// mostrado, mesma regra do fluxo real (nunca revelar o rótulo do nível).
export function NiveisHabilidadeCards({ habilidade, respostaAtual, onSelecionar }: NiveisHabilidadeCardsProps) {
  const somenteLeitura = !onSelecionar;
  const niveis = [...getNiveisHabilidade(habilidade)].sort((a, b) => a.peso - b.peso);
  const cursor = somenteLeitura ? 'cursor-default' : 'cursor-pointer';

  return (
    <div role="radiogroup" aria-label={`Nível para ${habilidade.nome}`} className="space-y-2 flex-1 min-h-0 overflow-y-auto scrollbar-thin pr-1">
      <div
        className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-colors ${
          respostaAtual === SEM_CONHECIMENTO
            ? 'border-gray-400 bg-gray-100'
            : `border-gray-200 ${somenteLeitura ? '' : 'hover:border-gray-300'}`
        }`}
      >
        <button
          type="button"
          role="radio"
          aria-checked={respostaAtual === SEM_CONHECIMENTO}
          disabled={somenteLeitura}
          onClick={() => onSelecionar?.(SEM_CONHECIMENTO)}
          className={`w-4 h-4 mt-0.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${cursor} ${
            respostaAtual === SEM_CONHECIMENTO ? 'border-gray-500' : 'border-gray-300'
          }`}
        >
          {respostaAtual === SEM_CONHECIMENTO && <span className="w-2 h-2 rounded-full bg-gray-500" />}
        </button>
        <button
          type="button"
          disabled={somenteLeitura}
          onClick={() => onSelecionar?.(SEM_CONHECIMENTO)}
          className={`text-left flex-1 ${cursor}`}
        >
          <p className={`text-sm ${respostaAtual === SEM_CONHECIMENTO ? 'text-gray-900 font-medium' : 'text-gray-700 font-medium'}`}>
            Sem conhecimento
          </p>
          <p className="text-xs text-gray-500 mt-0.5">Ainda não teve contato ou não sabe avaliar seu nível atual.</p>
        </button>
      </div>

      {niveis.map((nivel) => {
        const isSelected = respostaAtual === nivel.nome;
        const cor = getCorFromPeso(nivel.peso);
        return (
          <div
            key={nivel.id}
            className="flex items-start gap-3 p-3 rounded-lg border-2 transition-colors"
            style={{ borderColor: isSelected ? cor : '#e5e7eb', backgroundColor: isSelected ? cor + '0D' : 'transparent' }}
          >
            <button
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={somenteLeitura}
              onClick={() => onSelecionar?.(nivel.nome)}
              className={`w-4 h-4 mt-0.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${cursor}`}
              style={{ borderColor: isSelected ? cor : '#d1d5db' }}
            >
              {isSelected && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cor }} />}
            </button>
            <button
              type="button"
              disabled={somenteLeitura}
              onClick={() => onSelecionar?.(nivel.nome)}
              className={`text-left flex-1 ${cursor}`}
            >
              <p className="text-sm" style={{ color: isSelected ? cor : '#374151' }}>{nivel.criterio}</p>
            </button>
          </div>
        );
      })}
    </div>
  );
}
