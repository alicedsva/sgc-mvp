import { useState, useMemo, Fragment } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { getCompetenciaNome } from '../../data/mockData';

const GERENCIAS = [
  'Tecnologia', 'Recursos Humanos', 'Financeiro', 'Marketing',
  'Vendas', 'Operações', 'Produto', 'Design',
];

const ETAPAS = [
  { numero: 1, label: 'Identificação' },
  { numero: 2, label: 'Escopo' },
  { numero: 3, label: 'Configuração' },
  { numero: 4, label: 'Revisão' },
];

export interface NovaAvaliacaoFormData {
  nome: string;
  descricao: string;
  competencias: string[];
  habilidades: string[];
  gerencias: string[];
  dataInicio: string;
  dataFim: string;
}

interface NovaAvaliacaoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSalvarRascunho: (data: NovaAvaliacaoFormData) => void;
  onAtivar: (data: NovaAvaliacaoFormData) => void;
  competencias: { id: string; nome: string; status: string }[];
  habilidades: { id: string; nome: string; competencia: string; competenciaId?: string; status?: string }[];
}

const EMPTY_FORM: NovaAvaliacaoFormData = {
  nome: '', descricao: '', competencias: [], habilidades: [], gerencias: [], dataInicio: '', dataFim: '',
};

export function NovaAvaliacaoDrawer({
  isOpen, onClose, onSalvarRascunho, onAtivar, competencias, habilidades,
}: NovaAvaliacaoDrawerProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [buscaCompetencia, setBuscaCompetencia] = useState('');
  const [buscaHabilidade, setBuscaHabilidade] = useState('');
  const [formData, setFormData] = useState<NovaAvaliacaoFormData>(EMPTY_FORM);

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

  const handleContinuar = () => {
    if (currentStep === 1 && !formData.nome.trim()) {
      toast.error('Preencha o nome da avaliação');
      return;
    }
    if (currentStep === 3) {
      if (!formData.dataInicio) { toast.error('Selecione a data de início'); return; }
      if (!formData.dataFim) { toast.error('Selecione a data de término'); return; }
    }
    setCurrentStep(prev => prev + 1);
  };

  const resetAndClose = () => {
    setCurrentStep(1);
    setFormData(EMPTY_FORM);
    setBuscaCompetencia('');
    setBuscaHabilidade('');
    onClose();
  };

  const handleSalvarRascunho = () => {
    if (!formData.nome.trim()) { toast.error('Preencha o nome da avaliação'); return; }
    onSalvarRascunho(formData);
    resetAndClose();
  };

  const handleAtivar = () => {
    if (!formData.nome.trim()) { toast.error('Preencha o nome da avaliação'); return; }
    if (!formData.dataInicio) { toast.error('Selecione a data de início'); return; }
    if (!formData.dataFim) { toast.error('Selecione a data de término'); return; }
    onAtivar(formData);
    resetAndClose();
  };

  const formatDate = (d: string) =>
    d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : '—';

  return (
    <>
      <div className="fixed inset-0 bg-black/35 z-[200]" onClick={resetAndClose} />

      <div className="fixed inset-0 flex items-center justify-center z-[210] p-4 pointer-events-none">
        <div className="bg-white rounded-xl shadow-2xl w-[672px] h-[720px] flex flex-col pointer-events-auto">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">Nova Avaliação</h2>
            <button
              onClick={resetAndClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step indicator */}
          <div className="flex items-start justify-between px-6 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
            {ETAPAS.map((etapa, idx) => (
              <Fragment key={etapa.numero}>
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    etapa.numero < currentStep
                      ? 'bg-[var(--brand-600)] text-white'
                      : etapa.numero === currentStep
                      ? 'bg-[var(--brand-600)] text-white ring-2 ring-offset-1 ring-[var(--brand-300)]'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}>
                    {etapa.numero < currentStep ? '✓' : etapa.numero}
                  </div>
                  <span className={`mt-1 text-[10px] font-medium text-center whitespace-nowrap ${
                    etapa.numero === currentStep
                      ? 'text-[var(--brand-600)]'
                      : etapa.numero < currentStep
                      ? 'text-gray-500'
                      : 'text-gray-400'
                  }`}>
                    {etapa.label}
                  </span>
                </div>
                {idx < ETAPAS.length - 1 && (
                  <div className={`flex-1 h-px mt-3.5 mx-1.5 transition-colors ${
                    etapa.numero < currentStep ? 'bg-[var(--brand-600)]' : 'bg-gray-200'
                  }`} />
                )}
              </Fragment>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {/* Etapa 1 — Identificação */}
            {currentStep === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nome da Avaliação <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Avaliação de Competências Técnicas Q1 2026"
                    value={formData.nome}
                    onChange={e => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Descrição
                  </label>
                  <textarea
                    placeholder="Descreva o objetivo da avaliação"
                    value={formData.descricao}
                    onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent resize-none"
                  />
                </div>
              </>
            )}

            {/* Etapa 2 — Escopo */}
            {currentStep === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Competências
                  </label>
                  <input
                    type="text"
                    placeholder="Buscar competência..."
                    value={buscaCompetencia}
                    onChange={e => setBuscaCompetencia(e.target.value)}
                    className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                  />
                  <div className="max-h-44 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                    {competenciasVisiveis.length === 0 ? (
                      <p className="px-3 py-4 text-sm text-gray-400 text-center">
                        Nenhuma competência encontrada
                      </p>
                    ) : (
                      competenciasVisiveis.map(c => (
                        <label
                          key={c.id}
                          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50"
                        >
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
                      {formData.competencias.length} {formData.competencias.length === 1 ? 'competência selecionada' : 'competências selecionadas'}
                    </p>
                  )}
                </div>

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
                      <p className="px-3 py-4 text-sm text-gray-400 text-center">
                        Nenhuma habilidade encontrada
                      </p>
                    ) : (
                      habilidadesVisiveis.map(h => (
                        <label
                          key={h.id}
                          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-gray-50"
                        >
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
                      {formData.habilidades.length} {formData.habilidades.length === 1 ? 'habilidade selecionada' : 'habilidades selecionadas'}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Etapa 3 — Configuração */}
            {currentStep === 3 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Público-alvo
                  </label>
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
                      <label
                        key={g}
                        className="flex items-center gap-3 pl-8 pr-3 py-2.5 cursor-pointer hover:bg-gray-50"
                      >
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
              </>
            )}

            {/* Etapa 4 — Revisão */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Nome
                    </p>
                    <p className="text-sm text-gray-900 font-medium">{formData.nome || '—'}</p>
                  </div>
                  {formData.descricao && (
                    <div>
                      <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Descrição
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">{formData.descricao}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Tipo
                    </p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Autoavaliação
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                      Competências
                    </p>
                    {formData.competencias.length === 0 ? (
                      <p className="text-sm text-gray-400">Nenhuma selecionada</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {formData.competencias.map(c => (
                          <span
                            key={c}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-pink-700 border border-pink-100"
                          >
                            {getCompetenciaNome(c) || c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Habilidades
                    </p>
                    <p className="text-sm text-gray-700">
                      {formData.habilidades.length === 0
                        ? 'Nenhuma selecionada'
                        : `${formData.habilidades.length} ${formData.habilidades.length === 1 ? 'habilidade selecionada' : 'habilidades selecionadas'}`}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                      Público-alvo
                    </p>
                    {formData.gerencias.length === 0 ? (
                      <p className="text-sm text-gray-400">Nenhuma gerência selecionada</p>
                    ) : formData.gerencias.length === GERENCIAS.length ? (
                      <p className="text-sm text-gray-700">Todas as gerências</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {formData.gerencias.map(g => (
                          <span
                            key={g}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Período
                    </p>
                    <p className="text-sm text-gray-700">
                      {formData.dataInicio && formData.dataFim
                        ? `${formatDate(formData.dataInicio)} – ${formatDate(formData.dataFim)}`
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0 rounded-b-xl">
            <div>
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-white transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSalvarRascunho}
                className="px-4 py-2 text-sm font-medium text-[var(--brand-600)] border border-[var(--brand-600)] rounded-lg hover:bg-[var(--brand-50)] transition-colors"
              >
                Salvar rascunho
              </button>
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleContinuar}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[var(--brand-600)] rounded-lg hover:bg-[var(--brand-700)] transition-colors"
                >
                  Continuar
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAtivar}
                  className="px-4 py-2 text-sm font-medium text-white bg-[var(--brand-600)] rounded-lg hover:bg-[var(--brand-700)] transition-colors"
                >
                  Ativar avaliação
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
