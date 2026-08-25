import { CheckCircle2 } from 'lucide-react';

interface ModalConclusaoAvaliacaoProps {
  nomeAvaliacao: string;
  onVerResultado: () => void;
  onFinalizar: () => void;
}

// Confirmação pós-envio da autoavaliação (RespostaAvaliacaoPage.tsx) — mesma
// anatomia visual de ModalResumoAvaliacao.tsx (overlay, container max-w-md,
// ícone circular de sucesso, título+mensagem centralizados, sem botão X),
// mas com dois botões em vez de um: aqui não há uma única ação "voltar",
// existem dois destinos igualmente válidos (ver resultado agora ou só
// encerrar). Nunca fecha sozinho (sem onClick no overlay, ao contrário de
// ModalResumoAvaliacao) — só por uma dessas duas ações explícitas, pois a
// navegação real (para o resultado ou para a listagem) é responsabilidade
// de quem abriu o modal, nunca um onClose genérico aqui.
export function ModalConclusaoAvaliacao({ nomeAvaliacao, onVerResultado, onFinalizar }: ModalConclusaoAvaliacaoProps) {
  return (
    <div className="fixed inset-0 bg-black/35 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Avaliação concluída</h3>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">{nomeAvaliacao}</span>: suas respostas foram enviadas com sucesso.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onFinalizar}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Finalizar
            </button>
            <button
              type="button"
              onClick={onVerResultado}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors"
            >
              Ver resultado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
