import { useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router';
import { Search, AlertCircle, Plus, ArrowLeft, ChevronRight, HelpCircle, Check } from 'lucide-react';
import * as amplitude from '@amplitude/unified';
import { carreirasData } from '../data/mockData';
import { useCarreiras, generateId } from '../context/CarreirasContext';
import { cargosDisponiveisRM } from '@/app/data/cargosRM';
import { toast } from 'sonner';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableCargo } from '@/app/components/ui/DraggableCargo';

interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}

interface CargoDisponivel {
  id: string;
  nome: string;
  categoria: string;
}

interface CargoSelecionadoItem {
  id: string;
  nome: string;
  categoria: string;
  ordem: number;
}

function CriarJornadaPageContent() {
  const { carreiraId } = useParams();
  const navigate = useNavigate();
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();
  const { adicionarJornada, atualizarCargosJornada } = useCarreiras();

  const carreira = carreirasData.find(c => c.id === carreiraId);

  const [nomeJornada, setNomeJornada] = useState('');
  const [tipoJornada, setTipoJornada] = useState<'Contribuidor Individual' | 'Gestão'>('Contribuidor Individual');
  const [buscaCargo, setBuscaCargo] = useState('');
  const [cargosSelecionados, setCargosSelecionados] = useState<CargoSelecionadoItem[]>([]);

  const cargosFiltrados = cargosDisponiveisRM.filter(cargo =>
    cargo.nome.toLowerCase().includes(buscaCargo.toLowerCase())
  );
  const cargosSelecionadosIds = cargosSelecionados.map(c => c.id);
  const cargosDisponiveis = cargosFiltrados.filter(cargo => !cargosSelecionadosIds.includes(cargo.id));

  const handleAdicionarCargo = (cargo: CargoDisponivel) => {
    setCargosSelecionados(prev => {
      const updated = [...prev, { ...cargo, ordem: prev.length }];
      amplitude.track('Cargo Added To Jornada', {
        cargo_nome: cargo.nome,
        cargo_categoria: cargo.categoria,
        carreira_nome: carreira?.nome,
        total_cargos: updated.length,
      });
      return updated;
    });
  };

  const handleRemoverCargo = (cargoId: string) => {
    setCargosSelecionados(prev => prev.filter(c => c.id !== cargoId));
  };

  const moveCargo = (fromIndex: number, toIndex: number) => {
    const newList = [...cargosSelecionados];
    const [moved] = newList.splice(fromIndex, 1);
    newList.splice(toIndex, 0, moved);
    setCargosSelecionados(newList);
  };

  const handleCriar = () => {
    if (!nomeJornada.trim()) { toast.error('Preencha o nome da jornada'); return; }
    if (cargosSelecionados.length === 0) { toast.error('Selecione pelo menos um cargo'); return; }

    const novaJornada = {
      id: generateId('jornada'),
      carreiraId: carreiraId!,
      nome: nomeJornada,
      carreira: carreira?.nome || '',
      tipo: tipoJornada,
      quantidadeCargos: cargosSelecionados.length,
      status: 'Ativa',
    };

    adicionarJornada(novaJornada);

    const novosCargos = cargosSelecionados.map((cargo, index) => ({
      id: generateId('cargo'),
      jornadaId: novaJornada.id,
      cargoRM: cargo.nome,
      ordem: String(index + 1),
      habilidadesConfiguradas: 0,
      status: 'Pendente',
    }));

    atualizarCargosJornada(novaJornada.id, novosCargos);

    amplitude.track('Jornada Created', {
      jornada_nome: nomeJornada,
      jornada_tipo: tipoJornada,
      carreira_nome: carreira?.nome,
      total_cargos: cargosSelecionados.length,
    });

    toast.success('Jornada criada com sucesso!');
    navigate(`/carreiras/${carreiraId}/jornadas/${novaJornada.id}`);
  };

  const handleCancelar = () => navigate(`/carreiras/${carreiraId}`);

  if (!carreira) {
    return (
      <main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
        <div className="p-4 md:p-8 max-w-2xl mx-auto mt-16">
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Carreira não encontrada</h2>
            <button onClick={() => navigate('/carreiras')} className="px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors">
              Voltar para carreiras
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={`mt-16 flex flex-col bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''} h-[calc(100vh-4rem)]`}>
      <div className="flex-1 overflow-y-auto px-4 md:px-8 pt-4 md:pt-8 pb-8 md:pb-12">
        <button
          onClick={() => navigate(`/carreiras/${carreiraId}`)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {carreira.nome}
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Criar jornada de carreira</h1>
          <p className="text-sm text-gray-600 mt-2">
            Defina como será a evolução profissional dentro de {carreira.nome}
          </p>
        </div>

        <div className="space-y-6">
          {/* Bloco 1: Modelo de evolução */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-base font-medium text-gray-900 mb-1">Modelo de evolução</h2>
            <p className="text-sm text-gray-500 mb-6">Defina o nome da jornada e seu modelo de evolução</p>

            <div className="space-y-5">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                  Nome da jornada
                </label>
                <input
                  type="text"
                  value={nomeJornada}
                  onChange={(e) => setNomeJornada(e.target.value)}
                  placeholder="Ex: Desenvolvedor"
                  className="w-full max-w-md px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[var(--brand-500)] focus:border-[var(--brand-500)] outline-none"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <label className="text-xs md:text-sm font-medium text-gray-700">Modelo de evolução</label>
                  <div className="relative group/tip">
                    <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-default" />
                    <div className="absolute left-5 top-0 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 hidden group-hover/tip:block z-10 shadow-lg">
                      O modelo define a natureza da progressão: técnica, de liderança ou especialização estratégica.
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {[
                    { value: 'Contribuidor Individual', desc: 'Atuação técnica com foco em especialização' },
                    { value: 'Gestão', desc: 'Liderança de pessoas e desenvolvimento de times' },
                  ].map(({ value, desc }) => (
                    <label
                      key={value}
                      className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all flex-1 max-w-xs ${
                        tipoJornada === value
                          ? 'border-[var(--brand-500)] bg-[var(--brand-50)]'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="tipoJornada"
                        value={value}
                        checked={tipoJornada === value}
                        onChange={(e) => setTipoJornada(e.target.value as 'Contribuidor Individual' | 'Gestão')}
                        className="w-4 h-4 mt-0.5 text-[var(--brand-600)] focus:ring-2 focus:ring-[var(--brand-500)]"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{value}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bloco 2: Seleção de cargos */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-base font-medium text-gray-900 mb-1">Seleção de cargos</h2>
            <p className="text-sm text-gray-500 mb-6">Selecione os cargos e defina a ordem de progressão de carreira</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cargos disponíveis */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Cargos disponíveis</h3>
                  <span className="text-xs text-gray-400 tabular-nums">
                    {cargosDisponiveis.length} {cargosDisponiveis.length === 1 ? 'cargo' : 'cargos'}
                  </span>
                </div>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={buscaCargo}
                    onChange={(e) => setBuscaCargo(e.target.value)}
                    placeholder="Buscar cargo…"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[var(--brand-500)] focus:border-[var(--brand-500)] outline-none"
                  />
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="max-h-80 overflow-y-auto">
                    {cargosFiltrados.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {cargosFiltrados.map((cargo) => {
                          const jaSelecionado = cargosSelecionadosIds.includes(cargo.id);
                          return (
                            <button
                              key={cargo.id}
                              onClick={() => !jaSelecionado && handleAdicionarCargo(cargo)}
                              disabled={jaSelecionado}
                              className={`w-full flex items-center justify-between px-4 py-3 transition-colors text-left group ${
                                jaSelecionado
                                  ? 'bg-gray-50 cursor-default'
                                  : 'hover:bg-green-50 cursor-pointer'
                              }`}
                            >
                              <div className="flex-1 min-w-0">
                                <div className={`text-sm truncate ${jaSelecionado ? 'text-gray-400' : 'text-gray-900'}`}>
                                  {cargo.nome}
                                </div>
                                <div className="text-xs text-gray-400">{cargo.categoria}</div>
                              </div>
                              {jaSelecionado
                                ? <Check className="w-4 h-4 text-[var(--brand-500)] flex-shrink-0 ml-2" />
                                : <Plus className="w-4 h-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                              }
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-sm text-gray-400">
                        Nenhum cargo encontrado
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Cargos selecionados */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Cargos selecionados</h3>
                  {cargosSelecionados.length > 0 && (
                    <>
                      <span className="text-xs font-medium text-[var(--brand-700)] bg-[var(--brand-50)] px-2 py-0.5 rounded tabular-nums">
                        {cargosSelecionados.length} {cargosSelecionados.length === 1 ? 'cargo' : 'cargos'}
                      </span>
                      <span className="text-xs text-gray-400">· Arraste para reordenar</span>
                    </>
                  )}
                </div>
                <div className="border border-gray-200 rounded-lg bg-gray-50 min-h-[320px]">
                  {cargosSelecionados.length > 0 ? (
                    <div className="p-3 space-y-2">
                      {cargosSelecionados.map((cargo, index) => (
                        <DraggableCargo
                          key={cargo.id}
                          cargo={cargo}
                          index={index}
                          moveCargo={moveCargo}
                          onRemove={handleRemoverCargo}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="h-full min-h-[320px] flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                        <Plus className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Nenhum cargo selecionado</p>
                      <p className="text-xs text-gray-400">Clique nos cargos ao lado para montar a progressão</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bloco 3: Visualização da progressão */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-base font-medium text-gray-900 mb-1">Progressão da jornada</h2>
            <p className="text-sm text-gray-500 mb-6">Como a trilha ficará visível para os colaboradores</p>

            {cargosSelecionados.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-10 text-center">
                <p className="text-sm text-gray-400">Selecione cargos para visualizar a progressão</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="flex items-start gap-0 pb-2 min-w-max">
                  {cargosSelecionados.map((cargo, index) => {
                    const isFirst = index === 0;
                    const isLast = index === cargosSelecionados.length - 1;
                    return (
                      <div key={cargo.id} className="flex items-start">
                        {/* Nó */}
                        <div className="flex flex-col items-center w-28">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                            isFirst
                              ? 'bg-[var(--brand-600)] border-[var(--brand-600)] text-white'
                              : isLast
                              ? 'bg-white border-[var(--brand-600)] text-[var(--brand-600)]'
                              : 'bg-white border-gray-300 text-gray-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="mt-2 text-center px-1">
                            <div className="text-xs font-medium text-gray-900 leading-tight">{cargo.nome}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">{cargo.categoria}</div>
                          </div>
                          {isFirst && (
                            <span className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--brand-100)] text-[var(--brand-700)]">
                              Início
                            </span>
                          )}
                          {isLast && cargosSelecionados.length > 1 && (
                            <span className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">
                              Topo
                            </span>
                          )}
                        </div>

                        {/* Conector */}
                        {!isLast && (
                          <div className="flex items-center mt-4 flex-shrink-0">
                            <div className="w-6 h-px bg-gray-300" />
                            <ChevronRight className="w-3 h-3 text-gray-300 -ml-1" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rodapé — aparece ao selecionar pelo menos 1 cargo */}
      <div className={`bg-white border-t border-gray-200 px-4 md:px-8 overflow-hidden transition-all duration-300 ${cargosSelecionados.length > 0 ? 'max-h-24 py-4' : 'max-h-0 py-0'}`}>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleCancelar}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleCriar}
            className="px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors"
          >
            Criar jornada
          </button>
        </div>
      </div>
    </main>
  );
}

export default function CriarJornadaPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <CriarJornadaPageContent />
    </DndProvider>
  );
}
