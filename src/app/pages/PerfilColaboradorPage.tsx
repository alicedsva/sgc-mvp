import { useState, useEffect } from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router';
import { User, Briefcase, TrendingUp, Award, ClipboardCheck, ArrowLeft } from 'lucide-react';
import { colaboradoresData, habilidadesCargoData, getHabilidadesAvaliadasColaborador, habilidadesData, jornadasData, carreirasData, cargosData, getPesoFromNome, historicoAvaliacoesData, niveisDefaultData, getCompetenciaNome } from '../data/mockData';
import { EmptyState } from '../components/ui/EmptyState';
import { Table, Column } from '../components/ui/Table';

interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}

export default function PerfilColaboradorPage() {
  const { colaboradorId } = useParams();
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('visao-geral');
  const [currentPageAvaliacoes, setCurrentPageAvaliacoes] = useState(1);

  const colaborador = colaboradoresData.find(c => c.id === colaboradorId);

  useEffect(() => {
    setCurrentPageAvaliacoes(1);
  }, [activeTab]);

  if (!colaborador) {
    return (
      <main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
        <div className="p-4 md:p-8">
          <EmptyState
            icon={<User className="w-8 h-8" />}
            title="Colaborador não encontrado"
            description="Este colaborador não existe ou foi removido."
            action={{ label: 'Voltar para perfis', onClick: () => navigate('/perfis') }}
          />
        </div>
      </main>
    );
  }

  const cargo = cargosData.find(c => c.id === colaborador.cargoId);
  const jornada = jornadasData.find(j => j.id === colaborador.jornadaId);
  const carreira = carreirasData.find(c => c.id === colaborador.carreiraId);

  const habilidadesEsperadas = habilidadesCargoData.filter(hc => hc.cargoId === colaborador.cargoId);
  const habilidadesAvaliadas = getHabilidadesAvaliadasColaborador(colaborador.id);

  const habilidadesComGap = habilidadesEsperadas.map(he => {
    const habilidade = habilidadesData.find(h => h.id === he.habilidadeId);
    const nivelAtual = habilidadesAvaliadas.get(he.habilidadeId) ?? null;

    const nivelAtualNum = nivelAtual ? (nivelAtual === 'Não avaliado' ? 0 : getPesoFromNome(nivelAtual)) : 0;
    const nivelEsperadoNum = he.nivelEsperado === 'Não avaliado' ? 0 : getPesoFromNome(he.nivelEsperado);
    const gap = nivelAtualNum - nivelEsperadoNum;

    return {
      habilidadeId: he.habilidadeId,
      nome: habilidade?.nome || '',
      competencia: habilidade?.competencia || '',
      competenciaId: habilidade?.competenciaId ?? '',
      tipo: habilidade?.tipo || '',
      nivelAtual: nivelAtual ?? 'Não avaliado',
      nivelEsperado: he.nivelEsperado,
      gap,
      obrigatoria: he.obrigatoria,
    };
  });

  const competenciasMap = new Map<string, { atual: number, esperado: number, count: number }>();
  habilidadesComGap.forEach(h => {
    const key = h.competenciaId || h.competencia;
    const current = competenciasMap.get(key) || { atual: 0, esperado: 0, count: 0 };
    competenciasMap.set(key, {
      atual: current.atual + (h.nivelAtual === 'Não avaliado' ? 0 : getPesoFromNome(h.nivelAtual)),
      esperado: current.esperado + (h.nivelEsperado === 'Não avaliado' ? 0 : getPesoFromNome(h.nivelEsperado)),
      count: current.count + 1,
    });
  });

  const competenciasComMedia = Array.from(competenciasMap.entries()).map(([id, data]) => ({
    competencia: getCompetenciaNome(id) || id,
    mediaAtual: data.atual / data.count,
    mediaEsperado: data.esperado / data.count,
    percentualAderencia: Math.round((data.atual / data.esperado) * 100),
  }));

  const totalAtual = habilidadesComGap.reduce((sum, h) => sum + (h.nivelAtual === 'Não avaliado' ? 0 : getPesoFromNome(h.nivelAtual)), 0);
  const totalEsperado = habilidadesComGap.reduce((sum, h) => sum + (h.nivelEsperado === 'Não avaliado' ? 0 : getPesoFromNome(h.nivelEsperado)), 0);
  const aderenciaGeral = totalEsperado > 0 ? Math.round((totalAtual / totalEsperado) * 100) : 0;

  // Calcular cobertura de habilidades
  const habilidadesAtendidas = habilidadesComGap.filter(h => h.gap >= 0).length;
  const totalHabilidades = habilidadesComGap.length;
  const percentualCobertura = totalHabilidades > 0 ? Math.round((habilidadesAtendidas / totalHabilidades) * 100) : 0;

  // Classificação qualitativa de cobertura
  let classificacaoCobertura = '';
  let mensagemCobertura = '';
  if (percentualCobertura >= 91) {
    classificacaoCobertura = 'Alta cobertura';
    mensagemCobertura = 'O colaborador atende todas as habilidades esperadas para este cargo.';
  } else if (percentualCobertura >= 71) {
    classificacaoCobertura = 'Boa cobertura';
    mensagemCobertura = 'O colaborador atende a maior parte das habilidades esperadas para este cargo.';
  } else if (percentualCobertura >= 41) {
    classificacaoCobertura = 'Em desenvolvimento';
    mensagemCobertura = 'O colaborador está desenvolvendo as habilidades esperadas para este cargo.';
  } else {
    classificacaoCobertura = 'Baixa cobertura';
    mensagemCobertura = 'Ainda há muitas habilidades a desenvolver para este cargo.';
  }

  // Identificar habilidades críticas (gaps negativos)
  const habilidadesCriticas = habilidadesComGap.filter(h => h.gap < 0 && h.obrigatoria);
  const habilidadesComGapNegativo = habilidadesComGap.filter(h => h.gap < 0);
  
  let mensagemCriticidade = '';
  if (habilidadesCriticas.length > 0) {
    mensagemCriticidade = 'Existem habilidades críticas abaixo do esperado para este colaborador.';
  } else if (habilidadesComGapNegativo.length > 0) {
    mensagemCriticidade = 'Algumas habilidades ainda são importantes para a evolução deste colaborador.';
  }

  // Agrupar habilidades por categoria
  const habilidadesPorCategoria = habilidadesComGap.reduce((acc, hab) => {
    const key = hab.competenciaId || hab.competencia;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(hab);
    return acc;
  }, {} as Record<string, typeof habilidadesComGap>);

  // Ordenar por criticidade (gaps negativos primeiro)
  Object.keys(habilidadesPorCategoria).forEach(categoria => {
    habilidadesPorCategoria[categoria].sort((a, b) => a.gap - b.gap);
  });

  const cargosJornada = cargosData.filter(c => c.jornadaId === colaborador.jornadaId);
  const cargoAtualIndex = cargosJornada.findIndex(c => c.id === colaborador.cargoId);

  const historicoAvaliacoes = historicoAvaliacoesData.filter(av => av.colaboradorId === colaborador.id);

  const avaliacoesColumns: Column[] = [
    {
      key: 'nome',
      label: 'Nome da Avaliação',
      render: (value) => <span className="text-xs md:text-sm font-medium text-gray-900">{value}</span>,
    },
    {
      key: 'data',
      label: 'Data',
      render: (value) => <span className="text-xs md:text-sm text-gray-700">{value}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className="inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full bg-green-100 text-green-800">
          {value}
        </span>
      ),
    },
  ];

  const avaliacoesItemsPerPage = 10;
  const avaliacoesTotal = historicoAvaliacoes.length;
  const avaliacoesStart = (currentPageAvaliacoes - 1) * avaliacoesItemsPerPage;
  const avaliacoesEnd = avaliacoesStart + avaliacoesItemsPerPage;
  const avaliacoesPaginadas = historicoAvaliacoes.slice(avaliacoesStart, avaliacoesEnd);

  const tabs = [
    { id: 'visao-geral', label: 'Visão Geral', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'habilidades', label: 'Habilidades', icon: <Award className="w-4 h-4" /> },
    { id: 'carreira', label: 'Carreira', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'avaliacoes', label: 'Avaliações', icon: <ClipboardCheck className="w-4 h-4" /> },
  ];

  const NIVEL_CORES: Record<number, string> = {
    1: '#60A5FA',
    2: '#2563EB',
    3: '#4338CA',
    4: '#5B21B6',
    5: '#581C87',
  };
  const nivelNomeParaCor = Object.fromEntries(
    niveisDefaultData.map(n => [n.nome, NIVEL_CORES[Math.max(1, Math.min(5, n.peso))] ?? '#6B7280'])
  );

  return (
    <main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
      <div className="p-4 md:p-8">
        <button
          onClick={() => navigate('/perfis')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Perfis
        </button>

        <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-[var(--brand-100)] flex items-center justify-center">
              <User className="w-8 h-8 text-[var(--brand-600)]" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">{colaborador.nome}</h1>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Cargo atual: </span>
                  <span className="font-medium text-gray-900">{cargo?.cargoRM}</span>
                </div>
                <div>
                  <span className="text-gray-600">Jornada: </span>
                  <span className="font-medium text-gray-900">{jornada?.nome}</span>
                </div>
                <div>
                  <span className="text-gray-600">Carreira: </span>
                  <span className="font-medium text-gray-900">{carreira?.nome}</span>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Tempo no cargo: </span>
                  <span className="font-medium text-gray-900">{colaborador.tempoNoCargo}</span>
                </div>
                <div>
                  <span className="text-gray-600">Última avaliação: </span>
                  <span className="font-medium text-gray-900">{colaborador.ultimaAvaliacao}</span>
                </div>
                <div />
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-4 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[var(--brand-600)] text-[var(--brand-600)]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'visao-geral' && (
          <div className="space-y-6">
            {/* Bloco 2: Cobertura de habilidades */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Cobertura de habilidades do cargo</h2>
              <p className="text-sm text-gray-600 mb-6">
                Este indicador considera apenas as habilidades mapeadas no sistema. Outros fatores como desempenho, contexto e avaliação da liderança também são considerados na evolução de carreira.
              </p>
              
              <div className="flex items-center gap-4">
                <div className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold ${
                  percentualCobertura >= 91 ? 'bg-green-100 text-green-700' :
                  percentualCobertura >= 71 ? 'bg-blue-100 text-blue-700' :
                  percentualCobertura >= 41 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {percentualCobertura}%
                </div>

                <div className="flex-1">
                  <div className={`text-2xl font-semibold mb-1 ${
                    percentualCobertura >= 91 ? 'text-green-700' :
                    percentualCobertura >= 71 ? 'text-blue-700' :
                    percentualCobertura >= 41 ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    {classificacaoCobertura}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{mensagemCobertura}</p>
                  <p className="text-xs text-gray-500">
                    ({habilidadesAtendidas} de {totalHabilidades} habilidades mapeadas)
                  </p>
                </div>
              </div>
            </div>

            {/* Competências por categoria */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Competências por categoria</h2>
              <div className="space-y-4">
                {competenciasComMedia.map((comp, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{comp.competencia}</span>
                      <span className={`text-sm font-semibold ${comp.percentualAderencia >= 80 ? 'text-green-600' : comp.percentualAderencia >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {comp.percentualAderencia}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${comp.percentualAderencia >= 80 ? 'bg-green-600' : comp.percentualAderencia >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}
                        style={{ width: `${Math.min(comp.percentualAderencia, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'habilidades' && (
          <div className="space-y-6">
            <div className="text-xs text-gray-500 space-y-0.5">
              <p><span className="font-semibold">*</span> Habilidades obrigatórias para o cargo</p>
              <p>Habilidades críticas são obrigatórias e estão abaixo do nível esperado</p>
            </div>
            {Object.entries(habilidadesPorCategoria).map(([categoria, habilidades]) => (
              <div key={categoria} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-base font-semibold text-gray-900">{getCompetenciaNome(categoria) || categoria}</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {habilidades.length} habilidade(s) mapeada(s)
                  </p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-3 md:px-6 py-3 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Habilidade</th>
                        <th className="px-3 md:px-6 py-3 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Nível atual</th>
                        <th className="px-3 md:px-6 py-3 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">Nível esperado</th>
                        <th className="px-3 md:px-6 py-3 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">GAP</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {habilidades.map((hab, index) => (
                        <tr 
                          key={index} 
                          className={hab.gap < 0 && hab.obrigatoria ? 'bg-red-50' : ''}
                        >
                          <td className="px-3 md:px-6 py-3 text-xs md:text-sm text-gray-900">
                            <div className="flex items-center gap-2">
                              {hab.nome}
                              {hab.obrigatoria && (
                                <span className="text-xs text-red-600 font-bold">*</span>
                              )}
                              {hab.gap < 0 && hab.obrigatoria && (
                                <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
                                  Crítica
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 md:px-6 py-3 text-xs md:text-sm">
                            <span
                              className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-white"
                              style={{ backgroundColor: nivelNomeParaCor[hab.nivelAtual] ?? '#6B7280' }}
                            >
                              {hab.nivelAtual}
                            </span>
                          </td>
                          <td className="px-3 md:px-6 py-3 text-xs md:text-sm">
                            <span
                              className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-white"
                              style={{ backgroundColor: nivelNomeParaCor[hab.nivelEsperado] ?? '#6B7280' }}
                            >
                              {hab.nivelEsperado}
                            </span>
                          </td>
                          <td className="px-3 md:px-6 py-3 text-xs md:text-sm">
                            {hab.gap < 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                                {hab.gap} {Math.abs(hab.gap) === 1 ? 'nível' : 'níveis'}
                              </span>
                            ) : hab.gap === 0 ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                No esperado
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                +{hab.gap} {hab.gap === 1 ? 'nível' : 'níveis'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            
          </div>
        )}

        {activeTab === 'carreira' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Progressão de Carreira</h2>
              <p className="text-sm text-gray-600 mt-1">
                Jornada: {jornada?.nome} • Carreira: {carreira?.nome}
              </p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {cargosJornada.map((cargoItem, index) => {
                  const isCurrent = cargoItem.id === colaborador.cargoId;
                  const isPast = index < cargoAtualIndex;
                  const isFuture = index > cargoAtualIndex;
                  
                  return (
                    <div key={cargoItem.id} className="flex items-center gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        isCurrent ? 'bg-[var(--brand-600)] border-[var(--brand-600)] text-white' :
                        isPast ? 'bg-green-600 border-green-600 text-white' :
                        'bg-gray-100 border-gray-300 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-gray-900">{cargoItem.cargoRM}</h3>
                          {isCurrent && (
                            <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-[var(--brand-100)] text-[var(--brand-800)]">
                              Atual
                            </span>
                          )}
                          {isPast && (
                            <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              Concluído
                            </span>
                          )}
                          {isFuture && (
                            <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                              Próximo
                            </span>
                          )}
                        </div>
                        {isCurrent && (
                          <div className="mt-3 space-y-3">
                            <div>
                              <div className="text-xs text-gray-600">
                                {percentualCobertura}% das habilidades atendidas
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                  className="h-2 rounded-full bg-[var(--brand-600)]"
                                  style={{ width: `${Math.min(percentualCobertura, 100)}%` }}
                                />
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 italic">
                              Este indicador considera apenas as habilidades mapeadas no sistema. Outros fatores também são considerados na evolução de carreira.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'avaliacoes' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Histórico de Avaliações</h2>
              <p className="text-sm text-gray-600 mt-1">
                Registro de avaliações realizadas
              </p>
            </div>
            <Table
              columns={avaliacoesColumns}
              data={avaliacoesPaginadas}
              pagination={{
                currentPage: currentPageAvaliacoes,
                itemsPerPage: avaliacoesItemsPerPage,
                totalItems: avaliacoesTotal,
                onPageChange: setCurrentPageAvaliacoes,
                onItemsPerPageChange: () => {},
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}