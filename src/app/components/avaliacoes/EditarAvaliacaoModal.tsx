import { useState, useEffect } from 'react';
import { X, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { HOJE_SIMULADO, type Avaliacao } from '../../data/mockData';
import { calcularPrazoParticipante } from '../../utils/avaliacoes';

interface EditarAvaliacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Prorrogação de uma avaliação já materializada: periodoFim (datas_fixas), prazoDias (prazo_em_dias), ou periodoFim+modoPrazo:'datas_fixas' (indefinido definindo um término pela primeira vez). Avaliação Rascunho não passa por aqui — vai para avaliacoes/:id/editar (EditarAvaliacaoRascunhoPage). */
  onProrrogar: (updates: Partial<Avaliacao>) => void;
  avaliacao: Avaliacao | null;
}

export function EditarAvaliacaoModal({ isOpen, onClose, onProrrogar, avaliacao }: EditarAvaliacaoModalProps) {
  const [novoPeriodoFim, setNovoPeriodoFim] = useState('');
  const [novoPrazoDias, setNovoPrazoDias] = useState('');

  useEffect(() => {
    if (isOpen && avaliacao) {
      setNovoPeriodoFim(avaliacao.periodoFim ?? '');
      setNovoPrazoDias(avaliacao.prazoDias != null ? String(avaliacao.prazoDias) : '');
    }
  }, [isOpen, avaliacao]);

  if (!isOpen || !avaliacao) return null;

  // Validação de prorrogação (e também da 1ª definição de término em
  // 'indefinido'): novo prazo precisa deixar o participante mais próximo do
  // vencimento com pelo menos D+1 em relação a HOJE_SIMULADO — nunca
  // prorrogar "para trás" ou para hoje mesmo.
  const validarProrrogacao = (): boolean => {
    const amanha = new Date(HOJE_SIMULADO);
    amanha.setUTCDate(amanha.getUTCDate() + 1);

    if (avaliacao.modoPrazo === 'datas_fixas' || avaliacao.modoPrazo === 'indefinido') {
      // 'indefinido': periodoFim ainda não existe, todo participante vence
      // junto na nova data — mesma checagem simples de 'datas_fixas'.
      if (!novoPeriodoFim) { toast.error('Selecione a data de término'); return false; }
      if (new Date(novoPeriodoFim).getTime() < amanha.getTime()) {
        toast.error('A nova data precisa ser pelo menos amanhã');
        return false;
      }
      return true;
    }
    // prazo_em_dias — o participante mais próximo do vencimento é o que
    // entrou primeiro (dataEntrada mais antiga); confere o prazo dele com o
    // prazoDias novo.
    const dias = Number(novoPrazoDias);
    if (!novoPrazoDias || dias <= 0) { toast.error('Informe um prazo em dias válido'); return false; }
    const avaliacaoSimulada: Avaliacao = { ...avaliacao, prazoDias: dias };
    const prazosEfetivos = avaliacao.participantes.map(p => calcularPrazoParticipante(avaliacaoSimulada, p)!);
    const prazoMaisProximo = prazosEfetivos.reduce((min, atual) => (atual < min ? atual : min));
    if (new Date(prazoMaisProximo).getTime() < amanha.getTime()) {
      toast.error('Esse prazo deixaria participantes com vencimento antes de amanhã');
      return false;
    }
    return true;
  };

  const handleSalvarProrrogacao = () => {
    if (!validarProrrogacao()) return;
    if (avaliacao.modoPrazo === 'indefinido') {
      // Definindo um término pela 1ª vez — converte para 'datas_fixas'.
      onProrrogar({ periodoFim: novoPeriodoFim, modoPrazo: 'datas_fixas' });
    } else if (avaliacao.modoPrazo === 'datas_fixas') {
      onProrrogar({ periodoFim: novoPeriodoFim });
    } else {
      onProrrogar({ prazoDias: Number(novoPrazoDias) });
    }
    toast.success('Prazo atualizado com sucesso!');
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/35 z-[200]" onClick={onClose} />

      <div className="fixed inset-0 flex items-center justify-center z-[210] p-4 pointer-events-none">
        <div className="bg-white rounded-xl shadow-2xl w-[480px] flex flex-col pointer-events-auto">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">
              {avaliacao.modoPrazo === 'indefinido' ? 'Definir Prazo de Término' : 'Prorrogar Avaliação'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conteúdo — só prorrogação, tudo mais congelado */}
          <div className="px-6 py-5 space-y-5">
            <div className="flex items-start gap-3 bg-slate-100 border border-slate-300 rounded-lg p-4">
              <Lock className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700">
                {avaliacao.modoPrazo === 'indefinido'
                  ? 'Esta avaliação já tem participantes — nome, habilidades e público-alvo não podem mais ser alterados. Você pode definir uma data de término; a avaliação passa a ter prazo fixo a partir disso.'
                  : 'Esta avaliação já tem participantes — nome, habilidades e público-alvo não podem mais ser alterados. Só é possível prorrogar o prazo.'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Nome</p>
                <p className="text-sm text-gray-900 font-medium">{avaliacao.nome}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Público-alvo</p>
                <p className="text-sm text-gray-700">{avaliacao.publicoLabel}</p>
              </div>
            </div>

            {avaliacao.modoPrazo === 'datas_fixas' || avaliacao.modoPrazo === 'indefinido' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {avaliacao.modoPrazo === 'indefinido' ? 'Data de término' : 'Nova data de término'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={novoPeriodoFim}
                  onChange={e => setNovoPeriodoFim(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Precisa ser pelo menos amanhã.</p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Novo prazo (dias) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={novoPrazoDias}
                  onChange={e => setNovoPrazoDias(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Contado a partir da data de entrada de cada participante — precisa deixar todo mundo com vencimento a partir de amanhã.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSalvarProrrogacao}
              className="px-4 py-2 text-sm font-medium text-white bg-[var(--brand-600)] rounded-lg hover:bg-[var(--brand-700)] transition-colors"
            >
              {avaliacao.modoPrazo === 'indefinido' ? 'Definir prazo' : 'Salvar prorrogação'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
