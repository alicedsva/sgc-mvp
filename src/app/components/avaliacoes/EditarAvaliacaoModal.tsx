import { useState, useMemo, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { getCompetenciaNome, colaboradoresData } from '../../data/mockData';

// Gerências reais (derivadas de colaboradoresData) — nunca lista fixa.
// Mesmo padrão usado em DashboardPage.tsx e ContentArea.tsx.
const GERENCIAS = Array.from(new Set(colaboradoresData.map(c => c.gerencia))).sort();

export interface EditarAvaliacaoFormData {
  nome: string;
  descricao: string;
  competencias: string[];
  habilidades: string[];
  gerencias: string[];
  dataInicio: string;
  dataFim: string;
}

interface EditarAvaliacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSalvarRascunho: (data: EditarAvaliacaoFormData) => void;
  onAtivar: (data: EditarAvaliacaoFormData) => void;
  initialData: EditarAvaliacaoFormData;
  competencias: { id: string; nome: string; status: string }[];
  habilidades: { id: string; nome: string; competencia: string; competenciaId?: string; status?: string }[];
}

export function EditarAvaliacaoModal({
  isOpen, onClose, onSalvarRascunho, onAtivar, initialData, competencias, habilidades,
}: EditarAvaliacaoModalProps) {
  const [formData, setFormData] = useState<EditarAvaliacaoFormData>(initialData);
  const [buscaCompetencia, setBuscaCompetencia] = useState('');
  const [buscaHabilidade, setBuscaHabilidade] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setBuscaCompetencia('');
      setBuscaHabilidade('');
    }
  }, [isOpen]);

  const competenciasAtivas = useMemo(
    () => competencias.filter(c => c.status === 'Ativa'),
    [competencias],
  );

  const competenciasVisiveis = useMemo(() => {
    if (!buscaCompetencia.trim()) return competenciasAtivas;
    const q = buscaCompetencia.toLowerCase();
    return competenciasAtivas.filter(c => c.nome.toLowerCase().includes(q));
  }, [competenciasAtivas, buscaCompetencia]);

  const habilidadesVisiveis = useMemo(() => {
    const base = formData.competencias.length === 0
      ? habilidades.filter(h => !h.status || h.status === 'Ativa')
      : habilidades.filter(h => (!h.status || h.status === 'Ativa') && formData.competencias.includes(h.competenciaId ?? ''));
    if (!buscaHabilidade.trim()) return base;
    const q = buscaHabilidade.toLowerCase();
    return base.filter(h => h.nome.toLowerCase().includes(q));
  }, [habilidades, formData.competencias, buscaHabilidade]);

  if (!isOpen) return null;

  const handleToggleCompetencia = (idComp: string) => {
    const isRemoving = formData.competencias.includes(idComp);
    const novasCompetencias = isRemoving
      ? formData.competencias.filter(c => c !== idComp)
      : [...formData.competencias, idComp];

    let novasHabilidades = formData.habilidades;
    if (isRemoving) {
      const ids = new Set(habilidades.filter(h => h.competenciaId === idComp).map(h => h.id));
      novasHabilidades = formData.habilidades.filter(id => !ids.has(id));
    }

    setFormData({ ...formData, competencias: novasCompetencias, habilidades: novasHabilidades });
  };

  const handleToggleHabilidade = (id: string) => {
    setFormData({
      ...formData,
      habilidades: formData.habilidades.includes(id)
        ? formData.habilidades.filter(h => h !== id)
        : [...formData.habilidades, id],
    });
  };

  const handleToggleGerencia = (nome: string) => {
    if (nome === '__todas__') {
      setFormData({
        ...formData,
        gerencias: formData.gerencias.length === GERENCIAS.length ? [] : [...GERENCIAS],
      });
      return;
    }
    setFormData({
      ...formData,
      gerencias: formData.gerencias.includes(nome)
        ? formData.gerencias.filter(g => g !== nome)
        : [...formData.gerencias, nome],
    });
  };

  const validate = () => {
    if (!formData.nome.trim()) { toast.error('Preencha o nome da avaliação'); return false; }
    return true;
  };

  const validateFull = () => {
    if (!validate()) return false;
    if (!formData.dataInicio) { toast.error('Selecione a data de início'); return false; }
    if (!formData.dataFim) { toast.error('Selecione a data de término'); return false; }
    return true;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/35 z-[200]" onClick={onClose} />

      <div className="fixed inset-0 flex items-center justify-center z-[210] p-4 pointer-events-none">
        <div className="bg-white rounded-xl shadow-2xl w-[672px] h-[720px] flex flex-col pointer-events-auto">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">Editar Avaliação</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* Tipo badge */}
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
              <span className="text-xs text-gray-500">Tipo de avaliação:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Autoavaliação
              </span>
            </div>

            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nome da Avaliação <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={e => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent resize-none"
              />
            </div>

            {/* Competências */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Competências</label>
              <input
                type="text"
                placeholder="Buscar competência..."
                value={buscaCompetencia}
                onChange={e => setBuscaCompetencia(e.target.value)}
                className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
              />
              <div className="max-h-44 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                {competenciasVisiveis.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-gray-400 text-center">Nenhuma competência encontrada</p>
                ) : (
                  competenciasVisiveis.map(c => (
                    <label key={c.id} className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.competencias.includes(c.id)}
                        onChange={() => handleToggleCompetencia(c.id)}
                        className="w-4 h-4 text-[var(--brand-600)] border-gray-300 rounded focus:ring-2 focus:ring-[var(--brand-500)] flex-shrink-0"
                      />
                      <span className="text-sm text-gray-800">{c.nome}</span>
                    </label>
                  ))
                )}
              </div>
              {formData.competencias.length > 0 && (
                <p className="mt-1.5 text-xs text-gray-500">
                  {formData.competencias.length} competência(s) selecionada(s)
                </p>
              )}
            </div>

            {/* Habilidades */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Habilidades
                <span className="ml-2 text-xs text-gray-400 font-normal">
                  {formData.competencias.length > 0
                    ? 'Filtradas pelas competências selecionadas'
                    : 'Todas as habilidades'}
                </span>
              </label>
              <input
                type="text"
                placeholder="Buscar habilidade..."
                value={buscaHabilidade}
                onChange={e => setBuscaHabilidade(e.target.value)}
                className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
              />
              <div className="max-h-44 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                {habilidadesVisiveis.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-gray-400 text-center">Nenhuma habilidade encontrada</p>
                ) : (
                  habilidadesVisiveis.map(h => (
                    <label key={h.id} className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.habilidades.includes(h.id)}
                        onChange={() => handleToggleHabilidade(h.id)}
                        className="w-4 h-4 text-[var(--brand-600)] border-gray-300 rounded focus:ring-2 focus:ring-[var(--brand-500)] flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-sm text-gray-800">{h.nome}</span>
                        <span className="ml-2 text-xs text-gray-400">{h.competenciaId ? getCompetenciaNome(h.competenciaId) : h.competencia}</span>
                      </div>
                    </label>
                  ))
                )}
              </div>
              {formData.habilidades.length > 0 && (
                <p className="mt-1.5 text-xs text-gray-500">
                  {formData.habilidades.length} habilidade(s) selecionada(s)
                </p>
              )}
            </div>

            {/* Público-alvo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Público-alvo</label>
              <div className="max-h-52 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                <label className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50 bg-gray-50 sticky top-0 z-10">
                  <input
                    type="checkbox"
                    checked={formData.gerencias.length === GERENCIAS.length}
                    onChange={() => handleToggleGerencia('__todas__')}
                    className="w-4 h-4 text-[var(--brand-600)] border-gray-300 rounded focus:ring-2 focus:ring-[var(--brand-500)]"
                  />
                  <span className="text-sm font-medium text-gray-800">Todas as gerências</span>
                </label>
                {GERENCIAS.map(g => (
                  <label key={g} className="flex items-center gap-3 pl-8 pr-3 py-2.5 cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.gerencias.includes(g)}
                      onChange={() => handleToggleGerencia(g)}
                      className="w-4 h-4 text-[var(--brand-600)] border-gray-300 rounded focus:ring-2 focus:ring-[var(--brand-500)]"
                    />
                    <span className="text-sm text-gray-700">{g}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Datas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Data de Início <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dataInicio}
                  onChange={e => setFormData({ ...formData, dataInicio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Data de Término <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dataFim}
                  onChange={e => setFormData({ ...formData, dataFim: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                />
              </div>
            </div>
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
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { if (validate()) onSalvarRascunho(formData); }}
                className="px-4 py-2 text-sm font-medium text-[var(--brand-600)] border border-[var(--brand-600)] rounded-lg hover:bg-[var(--brand-50)] transition-colors"
              >
                Salvar rascunho
              </button>
              <button
                type="button"
                onClick={() => { if (validateFull()) onAtivar(formData); }}
                className="px-4 py-2 text-sm font-medium text-white bg-[var(--brand-600)] rounded-lg hover:bg-[var(--brand-700)] transition-colors"
              >
                Ativar avaliação
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
