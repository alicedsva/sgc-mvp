import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router';
import { ArrowLeft, Edit } from 'lucide-react';
import * as amplitude from '@amplitude/unified';
import { toast } from 'sonner';
import { useHabilidades } from '../context/HabilidadesContext';
import { niveisDefaultData, getCorFromPeso } from '../data/mockData';
import { FormDrawer, FormField } from '../components/templates/FormDrawer';

interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}

export default function HabilidadeDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();
  const { habilidades, updateHabilidade } = useHabilidades();

  const habilidade = habilidades.find((h) => h.id === id);

  useEffect(() => {
    if (habilidade) {
      amplitude.track('Habilidade Detail Viewed', {
        habilidade_nome: habilidade.nome,
        habilidade_competencia: habilidade.competencia,
        habilidade_tipo: habilidade.tipo,
        habilidade_status: habilidade.status,
      });
    }
  }, [id]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    competencia: '',
    tipo: 'Técnica',
    status: 'Ativa',
    niveis: [] as Array<{ nivelId: string; criterio: string }>,
  });

  if (!habilidade) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Habilidade não encontrada.
      </div>
    );
  }

  const niveisMap = Object.fromEntries(niveisDefaultData.map((n) => [n.id, n]));
  const niveisVinculados = habilidade.niveis
    .map((n) => ({ ...n, nivel: niveisMap[n.nivelId] }))
    .filter((n) => n.nivel)
    .sort((a, b) => a.nivel.peso - b.nivel.peso);

  const competenciasUnicas = Array.from(new Set(habilidades.map((h) => h.competencia))).sort();

  const niveisAtivos = niveisDefaultData
    .filter((n) => n.status === 'Ativo')
    .sort((a, b) => a.peso - b.peso);

  const selectedIds = new Set(formData.niveis.map((n) => n.nivelId));

  const toggleNivel = (nivelId: string) => {
    if (selectedIds.has(nivelId)) {
      setFormData((prev) => ({
        ...prev,
        niveis: prev.niveis.filter((n) => n.nivelId !== nivelId),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        niveis: [...prev.niveis, { nivelId, criterio: '' }],
      }));
    }
  };

  const handleOpenEditDrawer = () => {
    setFormData({
      nome: habilidade.nome,
      descricao: habilidade.descricao,
      competencia: habilidade.competencia,
      tipo: habilidade.tipo,
      status: habilidade.status,
      niveis: [...habilidade.niveis],
    });
    setIsDrawerOpen(true);
  };

  const formFields: FormField[] = [
    {
      name: 'nome',
      label: 'Nome da Habilidade',
      type: 'text',
      placeholder: 'Ex: React',
      required: true,
      value: formData.nome,
      onChange: (value) => setFormData((prev) => ({ ...prev, nome: value })),
    },
    {
      name: 'descricao',
      label: 'Descrição',
      type: 'textarea',
      placeholder: 'Descreva esta habilidade...',
      rows: 3,
      value: formData.descricao,
      onChange: (value) => setFormData((prev) => ({ ...prev, descricao: value })),
    },
    {
      name: 'competencia',
      label: 'Competência',
      type: 'select',
      required: true,
      value: formData.competencia,
      onChange: (value) => setFormData((prev) => ({ ...prev, competencia: value })),
      options: competenciasUnicas.map((comp) => ({ value: comp, label: comp })),
    },
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'select',
      required: true,
      value: formData.tipo,
      onChange: (value) => setFormData((prev) => ({ ...prev, tipo: value })),
      options: [
        { value: 'Técnica', label: 'Técnica' },
        { value: 'Comportamental', label: 'Comportamental' },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      value: formData.status,
      onChange: (value) => setFormData((prev) => ({ ...prev, status: value })),
      options: [
        { value: 'Ativa', label: 'Ativa' },
        { value: 'Desativada', label: 'Desativada' },
      ],
    },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.niveis.length === 0) {
      toast.error('Selecione ao menos um nível aplicável para esta habilidade.');
      return;
    }
    updateHabilidade(habilidade.id, {
      nome: formData.nome,
      descricao: formData.descricao,
      competencia: formData.competencia,
      tipo: formData.tipo as 'Técnica' | 'Comportamental',
      status: formData.status as 'Ativa' | 'Desativada',
      niveis: formData.niveis,
    });
    toast.success('Habilidade atualizada com sucesso!');
    setIsDrawerOpen(false);
  };

  const drawerCustomContent = (
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
        {niveisAtivos.map((nivel) => {
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

      {formData.niveis.length > 0 && (
        <div className="border-t border-gray-100 pt-4 space-y-4">
          <label className="text-sm font-medium text-gray-700">Critérios por nível</label>
          {niveisAtivos
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] resize-none text-gray-700 placeholder-gray-400"
                  />
                  {nivel.descricao && (
                    <p className="text-xs text-gray-400 leading-relaxed">
                      <span className="font-medium">Referência do nível:</span> {nivel.descricao}
                    </p>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );

  return (
    <main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
    <div className="p-4 md:p-8">
      <button
        onClick={() => navigate('/habilidades', { state: { tab: 'habilidades-list' } })}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Habilidades
      </button>
      <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl font-semibold text-gray-900">{habilidade.nome}</h1>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
              habilidade.status === 'Ativa'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${habilidade.status === 'Ativa' ? 'bg-green-500' : 'bg-gray-400'}`} />
              {habilidade.status}
            </span>
            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
              habilidade.tipo === 'Técnica'
                ? 'bg-[var(--brand-100)] text-[var(--brand-800)]'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {habilidade.tipo}
            </span>
            <span className="text-sm text-gray-500">{habilidade.competencia}</span>
          </div>
          {habilidade.descricao && (
            <p className="text-sm text-gray-600 mt-1">{habilidade.descricao}</p>
          )}
        </div>
        <button
          onClick={handleOpenEditDrawer}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors"
        >
          <Edit className="w-4 h-4" />
          Editar
        </button>
      </div>

      {/* Critérios por nível */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Critérios por nível</h2>

        {niveisVinculados.length === 0 ? (
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center">
            <p className="text-sm text-gray-400">Nenhum nível vinculado a esta habilidade.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {niveisVinculados.map(({ nivelId, criterio, nivel }) => (
              <div key={nivelId} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: getCorFromPeso(nivel.peso) }}
                  >
                    {nivel.nome}
                  </span>
                  <span className="text-sm text-gray-500">{nivel.peso}</span>
                </div>

                {criterio.trim() ? (
                  <p className="text-sm text-gray-700">{criterio}</p>
                ) : (
                  <p className="text-sm text-gray-400">Nenhum critério definido para este nível</p>
                )}

                {nivel.descricao && (
                  <p className="text-xs text-gray-400 leading-relaxed">
                    <span className="font-medium">Referência do nível:</span> {nivel.descricao}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drawer de edição */}
      <FormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Editar Habilidade"
        fields={formFields}
        onSubmit={handleFormSubmit}
        submitLabel="Salvar alterações"
        customContent={drawerCustomContent}
      />
      </div>
    </div>
    </main>
  );
}
