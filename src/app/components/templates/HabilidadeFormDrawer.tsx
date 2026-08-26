import { useEffect, useState, type FormEvent } from 'react';
import { ListChecks } from 'lucide-react';
import { toast } from 'sonner';
import { FormDrawer } from './FormDrawer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { getCorFromPeso } from '../../data/mockData';

export interface HabilidadeFormValues {
  nome: string;
  descricao: string;
  competencia: string;
  competenciaId: string;
  tipo: 'Técnica' | 'Comportamental';
  status: 'Ativa' | 'Desativada';
  niveis: Array<{ nivelId: string; criterio: string }>;
}

export interface NivelFixo {
  id: string;
  nome: string;
  peso: number;
  descricao?: string;
}

const HABILIDADE_FORM_VAZIO: HabilidadeFormValues = {
  nome: '',
  descricao: '',
  competencia: '',
  competenciaId: '',
  tipo: 'Técnica',
  status: 'Ativa',
  niveis: [],
};

interface HabilidadeFormDrawerProps {
  isOpen: boolean;
  // null = criação (formulário em branco); valores preenchidos = edição
  initialValues: HabilidadeFormValues | null;
  competenciasAtivas: { id: string; nome: string }[];
  niveis: NivelFixo[];
  onSave: (values: HabilidadeFormValues) => void;
  onCancel: () => void;
}

type Tab = 'cadastro' | 'criterios';

export function HabilidadeFormDrawer({
  isOpen,
  initialValues,
  competenciasAtivas,
  niveis,
  onSave,
  onCancel,
}: HabilidadeFormDrawerProps) {
  const [formData, setFormData] = useState<HabilidadeFormValues>(HABILIDADE_FORM_VAZIO);
  const [activeTab, setActiveTab] = useState<Tab>('cadastro');
  const [errors, setErrors] = useState<{ nome?: string; competenciaId?: string }>({});

  const isEdicao = initialValues !== null;

  // Reseta o formulário toda vez que o drawer é (re)aberto — mesmo momento
  // em que ContentArea.tsx/HabilidadeDetalhePage.tsx já preenchiam o state
  // antes de abrir (linha reta em branco para criar, valores da linha para
  // editar). Sem isso, reabrir para criar logo depois de editar herdaria
  // os valores da edição anterior.
  useEffect(() => {
    if (isOpen) {
      setFormData(initialValues ?? HABILIDADE_FORM_VAZIO);
      setActiveTab('cadastro');
      setErrors({});
    }
  }, [isOpen, initialValues]);

  const niveisOrdenados = [...niveis].sort((a, b) => a.peso - b.peso);
  const selectedIds = new Set(formData.niveis.map((n) => n.nivelId));

  const toggleNivel = (nivelId: string) => {
    setFormData((prev) =>
      selectedIds.has(nivelId)
        ? { ...prev, niveis: prev.niveis.filter((n) => n.nivelId !== nivelId) }
        : { ...prev, niveis: [...prev.niveis, { nivelId, criterio: '' }] }
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validação manual (não HTML5 nativo): com o formulário dividido em
    // abas, um campo obrigatório fora da aba ativa não está montado no
    // DOM no momento do submit, então a validação `required` nativa do
    // browser não teria como disparar nele. Por isso nome/competência são
    // checados aqui e, se falharem, a aba muda para "Cadastro" para que o
    // erro fique visível — nunca falha "escondida" numa aba que não é a
    // que está sendo mostrada.
    const novosErros: { nome?: string; competenciaId?: string } = {};
    if (!formData.nome.trim()) novosErros.nome = 'Informe o nome da habilidade.';
    if (!formData.competenciaId) novosErros.competenciaId = 'Selecione uma competência.';

    if (Object.keys(novosErros).length > 0) {
      setErrors(novosErros);
      setActiveTab('cadastro');
      return;
    }

    if (formData.niveis.length === 0) {
      toast.error('Selecione ao menos um nível aplicável para esta habilidade.');
      setActiveTab('cadastro');
      return;
    }

    setErrors({});
    onSave(formData);
  };

  return (
    <FormDrawer
      isOpen={isOpen}
      onClose={onCancel}
      title={isEdicao ? 'Editar Habilidade' : 'Nova Habilidade'}
      fields={[]}
      onSubmit={handleSubmit}
      submitLabel={isEdicao ? 'Salvar alterações' : 'Salvar'}
      customContent={
        <div className="space-y-4 md:space-y-5">
          {/* Toggle de abas — mesmo padrão do segmented control de
              Todas/Técnica/Comportamental (ContentArea.tsx, filtro de
              Habilidades) */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setActiveTab('cadastro')}
              className={`px-3 py-2 text-sm font-normal rounded-md transition-all whitespace-nowrap ${
                activeTab === 'cadastro'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cadastro
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('criterios')}
              className={`px-3 py-2 text-sm font-normal rounded-md transition-all whitespace-nowrap ${
                activeTab === 'criterios'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Critérios
            </button>
          </div>

          {activeTab === 'cadastro' ? (
            <div className="space-y-4 md:space-y-5">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                  Nome da Habilidade <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: React"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent ${
                    errors.nome ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Descreva esta habilidade..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                  Competência <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.competenciaId}
                  onValueChange={(value) => {
                    const comp = competenciasAtivas.find((c) => c.id === value);
                    setFormData((prev) => ({ ...prev, competenciaId: value, competencia: comp?.nome ?? '' }));
                  }}
                >
                  <SelectTrigger
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent ${
                      errors.competenciaId ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  >
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {competenciasAtivas.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.competenciaId && <p className="mt-1 text-sm text-red-600">{errors.competenciaId}</p>}
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                  Tipo <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, tipo: value as HabilidadeFormValues['tipo'] }))}
                >
                  <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Técnica">Técnica</SelectItem>
                    <SelectItem value="Comportamental">Comportamental</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as HabilidadeFormValues['status'] }))}
                >
                  <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativa">Ativa</SelectItem>
                    <SelectItem value="Desativada">Desativada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-1 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Níveis Aplicáveis <span className="text-red-500">*</span>
                  </label>
                  {formData.niveis.length > 0 && (
                    <span className="text-xs text-gray-500">
                      {formData.niveis.length} selecionado{formData.niveis.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {niveisOrdenados.map((nivel) => {
                    const isSelected = selectedIds.has(nivel.id);
                    return (
                      <button
                        key={nivel.id}
                        type="button"
                        onClick={() => toggleNivel(nivel.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          isSelected
                            ? 'border-transparent text-white'
                            : 'border-gray-300 text-gray-600 bg-white hover:border-gray-400'
                        }`}
                        style={isSelected ? { backgroundColor: getCorFromPeso(nivel.peso) } : {}}
                      >
                        {nivel.nome}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.niveis.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <ListChecks className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    Selecione ao menos um nível na aba "Cadastro" para definir os critérios aqui.
                  </p>
                </div>
              ) : (
                niveisOrdenados
                  .filter((nivel) => selectedIds.has(nivel.id))
                  .map((nivel) => {
                    const nivelEntry = formData.niveis.find((n) => n.nivelId === nivel.id);
                    return (
                      <div key={nivel.id} className="space-y-2">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: getCorFromPeso(nivel.peso) }}
                        >
                          {nivel.nome}
                        </span>
                        <textarea
                          value={nivelEntry?.criterio ?? ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              niveis: prev.niveis.map((n) =>
                                n.nivelId === nivel.id ? { ...n, criterio: val } : n
                              ),
                            }));
                          }}
                          placeholder="O que se espera de um colaborador neste nível para esta habilidade?"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent resize-none text-gray-700 placeholder-gray-400"
                        />
                        {nivel.descricao && (
                          <p className="text-xs text-gray-400 leading-relaxed">
                            <span className="font-medium">Referência do nível:</span> {nivel.descricao}
                          </p>
                        )}
                      </div>
                    );
                  })
              )}
            </div>
          )}
        </div>
      }
    />
  );
}
