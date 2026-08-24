import { CheckCircle2 } from 'lucide-react';
import { HOJE_SIMULADO, type Avaliacao } from '../../data/mockData';
import { formatPeriodoAvaliacao } from '../../utils/avaliacoes';

interface ModalResumoAvaliacaoProps {
  onClose: () => void;
  avaliacao: Avaliacao;
}

// Resumo pós-conclusão do wizard — mesma anatomia visual de ConfirmationModal
// (overlay, container max-w-md, ícone circular, título+mensagem centralizados,
// sem botão X), mas com ícone de sucesso e um único botão (leva de volta para
// a listagem, nunca Cancelar/Confirmar). Aparece em toda conclusão do
// cadastro — Rascunho, Agendar ou Publicar agora — texto varia conforme a
// ação, reaproveitando formatPeriodoAvaliacao (utils/avaliacoes.ts) para o
// prazo em vez de remontar esse texto aqui.
export function ModalResumoAvaliacao({ onClose, avaliacao }: ModalResumoAvaliacaoProps) {
  const hojeISO = HOJE_SIMULADO.toISOString().slice(0, 10);
  const isRascunho = avaliacao.status === 'Rascunho';
  const isAgendada = !isRascunho && avaliacao.periodoInicio > hojeISO;

  const titulo = isRascunho
    ? 'Avaliação salva como rascunho'
    : isAgendada
    ? 'Avaliação agendada'
    : 'Avaliação publicada';

  const corpo = isRascunho
    ? 'Fica invisível para os colaboradores até você ativá-la, na tela de detalhe da avaliação.'
    : isAgendada
    ? `Será publicada automaticamente para os participantes. ${formatPeriodoAvaliacao(avaliacao)}`
    : `Já está disponível para os participantes responderem. ${formatPeriodoAvaliacao(avaliacao)}`;

  return (
    <div
      className="fixed inset-0 bg-black/35 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{titulo}</h3>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">{avaliacao.nome}</span>: {corpo}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors"
          >
            Voltar para Avaliações
          </button>
        </div>
      </div>
    </div>
  );
}
