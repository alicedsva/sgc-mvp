import { useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router';
import { ArrowLeft, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { useHabilidades } from '../context/HabilidadesContext';
import { useCompetencias } from '../context/CompetenciasContext';
import { niveisDefaultData, getCorFromPeso, getCompetenciaNome } from '../data/mockData';
import { HabilidadeFormDrawer, type HabilidadeFormValues } from '../components/templates/HabilidadeFormDrawer';
import { StatusBadge } from '../components/ui/StatusBadge';

interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}

export default function HabilidadeDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();
  const { habilidades, updateHabilidade } = useHabilidades();
  const { competencias } = useCompetencias();

  const habilidade = habilidades.find((h) => h.id === id);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const handleSaveHabilidade = (values: HabilidadeFormValues) => {
    updateHabilidade(habilidade.id, {
      nome: values.nome,
      descricao: values.descricao,
      competencia: values.competencia,
      competenciaId: values.competenciaId,
      tipo: values.tipo,
      status: values.status,
      niveis: values.niveis,
    });
    toast.success('Habilidade atualizada com sucesso!');
    setIsDrawerOpen(false);
  };

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
            <StatusBadge
              label={habilidade.status}
              colorClass={habilidade.status === 'Ativa' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}
            />
            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
              habilidade.tipo === 'Técnica'
                ? 'bg-[var(--brand-100)] text-[var(--brand-800)]'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {habilidade.tipo}
            </span>
            <span className="text-sm text-gray-500">{getCompetenciaNome(habilidade.competenciaId ?? '', competencias)}</span>
          </div>
          {habilidade.descricao && (
            <p className="text-sm text-gray-600 mt-1">{habilidade.descricao}</p>
          )}
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
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
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-8 text-center">
            <p className="text-sm text-gray-400">Nenhum nível vinculado a esta habilidade.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {niveisVinculados.map(({ nivelId, criterio, nivel }) => (
              <div key={nivelId} className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
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
      <HabilidadeFormDrawer
        isOpen={isDrawerOpen}
        initialValues={{
          nome: habilidade.nome,
          descricao: habilidade.descricao,
          competencia: habilidade.competencia,
          competenciaId: habilidade.competenciaId ?? '',
          tipo: habilidade.tipo,
          status: habilidade.status,
          niveis: [...habilidade.niveis],
        }}
        competenciasAtivas={competencias
          .filter((c) => c.status === 'Ativa')
          .map((c) => ({ id: c.id, nome: c.nome }))}
        niveis={niveisDefaultData}
        onSave={handleSaveHabilidade}
        onCancel={() => setIsDrawerOpen(false)}
      />
      </div>
    </div>
    </main>
  );
}
