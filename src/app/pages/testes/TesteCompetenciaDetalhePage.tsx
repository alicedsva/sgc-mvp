import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Table } from '../../components/ui/Table';
import {
  JOAO_CARGO_ATUAL,
  STATUS_LABEL,
  Status,
  matrizParaCargo,
  enriquecerMatriz,
  AderenciaRing,
  PesoBars,
} from './joaoCarreiraShared';

type OutletContext = { isSidebarCollapsed: boolean; viewMode: 'admin' | 'colaborador' };

// Mesmo tamanho de página já padronizado no sistema (ver JornadaDetalhePage,
// aba Colaboradores: COLABS_PER_PAGE = 10 — 05-telas-admin.md documenta
// "10 itens/página").
const ITEMS_PER_PAGE = 10;

// Badge por status — EXCEÇÃO documentada só nesta página: o resto da tela
// "Mapeamento de competências" usa texto simples (sem badge) para status de
// habilidade; aqui é badge mesmo (confirmado com Alice). Reaproveita classes
// JÁ documentadas em 02-design-system.md (Badges): verde de "Ativa"
// (bg-green-100 text-green-800) para acima/no, vermelho de "Desativada"
// (bg-red-100 text-red-700) para abaixo, cinza de "Encerrada/Arquivado"
// (bg-gray-100 text-gray-700) para não avaliada. Verde para acima E no
// esperado (não só acima) e vermelho — não âmbar — para abaixo: segue a
// mesma cor já documentada em 04-regras-negocio.md ("Indicadores de
// habilidade do colaborador": acima/no = text-green-600, abaixo =
// text-red-500), só convertida de texto para badge nesta página.
const STATUS_BADGE: Record<Status, string> = {
  acima: 'bg-green-100 text-green-800',
  no: 'bg-green-100 text-green-800',
  abaixo: 'bg-red-100 text-red-700',
  sem: 'bg-gray-100 text-gray-700',
};

type FiltroTab = 'todas' | 'abaixo' | 'no' | 'acima' | 'sem';

const TABS: { key: FiltroTab; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'abaixo', label: 'Abaixo do esperado' },
  { key: 'no', label: 'No esperado' },
  { key: 'acima', label: 'Acima' },
  { key: 'sem', label: 'Não avaliadas' },
];

export default function TesteCompetenciaDetalhePage() {
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState<FiltroTab>('todas');
  const [paginaAtual, setPaginaAtual] = useState(1);

  // Mesma matriz/enriquecimento usados em TesteCarreiraPage — cargo ATUAL de
  // João (c2), única fonte real (mockData.ts), nunca dado duplicado à mão.
  const habilidadesCargoAtual = useMemo(
    () => enriquecerMatriz(matrizParaCargo(JOAO_CARGO_ATUAL)),
    []
  );

  const habilidadesCompetencia = useMemo(
    () => habilidadesCargoAtual.filter(h => h.competenciaId === id),
    [habilidadesCargoAtual, id]
  );

  const competenciaNome = habilidadesCompetencia[0]?.competenciaNome ?? 'Competência';

  // Visão geral: MESMO cálculo do card correspondente no grid de "Mapeamento
  // de competências" (regra do Dashboard — não avaliada excluída do
  // numerador e do denominador).
  const avaliadas = useMemo(() => habilidadesCompetencia.filter(h => h.status !== 'sem'), [habilidadesCompetencia]);
  const atendidas = useMemo(
    () => avaliadas.filter(h => h.status === 'no' || h.status === 'acima').length,
    [avaliadas]
  );
  const percentual = avaliadas.length > 0 ? Math.round((atendidas / avaliadas.length) * 100) : 0;

  const contagens = useMemo(
    () => ({
      todas: habilidadesCompetencia.length,
      abaixo: habilidadesCompetencia.filter(h => h.status === 'abaixo').length,
      no: habilidadesCompetencia.filter(h => h.status === 'no').length,
      acima: habilidadesCompetencia.filter(h => h.status === 'acima').length,
      sem: habilidadesCompetencia.filter(h => h.status === 'sem').length,
    }),
    [habilidadesCompetencia]
  );

  const habilidadesFiltradas = useMemo(() => {
    if (filtro === 'todas') return habilidadesCompetencia;
    return habilidadesCompetencia.filter(h => h.status === filtro);
  }, [habilidadesCompetencia, filtro]);

  // Resetar para página 1 ao trocar de aba — mesma regra já documentada em
  // 02-design-system.md ("Ao aplicar filtro ou busca: resetar para página 1").
  useEffect(() => {
    setPaginaAtual(1);
  }, [filtro]);

  const habilidadesPaginadas = useMemo(
    () => habilidadesFiltradas.slice((paginaAtual - 1) * ITEMS_PER_PAGE, paginaAtual * ITEMS_PER_PAGE),
    [habilidadesFiltradas, paginaAtual]
  );

  return (
    <main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
      <div className="p-4 md:p-8 space-y-6">
        <button
          onClick={() => navigate('/testes/carreira')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Mapeamento de competências
        </button>

        {habilidadesCompetencia.length === 0 ? (
          <p className="text-sm text-gray-500">Competência não encontrada.</p>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-gray-900">{competenciaNome}</h1>

            {/* Card de visão geral — anel reaproveitado do grid (AderenciaRing,
                maior aqui) + contagem. Sem frase de tendência/progresso: não
                existe dado de estado anterior para comparar (pedido explícito). */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-5 flex items-center gap-5">
              <AderenciaRing percentual={percentual} size={96} textClassName="text-xl font-bold text-gray-900" />
              <p className="text-lg font-semibold text-gray-900">
                {atendidas} de {avaliadas.length} habilidades no nível esperado
              </p>
            </div>

            {/* Container padrão de tabela com toolbar — mesma anatomia já
                documentada (bg-white rounded-lg border border-gray-200
                overflow-hidden; toolbar p-3 md:p-4 border-b border-gray-200),
                reaproveitada de JornadaDetalhePage. As pills funcionam como
                toolbar/cabeçalho da tabela, não soltas na página. */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-3 md:p-4 border-b border-gray-200">
                <div className="flex items-center bg-gray-100 rounded-lg p-1 w-fit flex-wrap">
                  {TABS.map(tab => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setFiltro(tab.key)}
                      className={`px-3 py-2 text-sm font-normal rounded-md transition-all whitespace-nowrap ${
                        filtro === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.label} ({contagens[tab.key]})
                    </button>
                  ))}
                </div>
              </div>

              <Table
                columns={[
                  { key: 'nome', label: 'Habilidade' },
                  {
                    key: 'nivelAtual',
                    label: 'Seu nível',
                    render: (_value, row: (typeof habilidadesFiltradas)[number]) =>
                      row.nivelAtual ? (
                        <span className="text-gray-900">{row.nivelAtual}</span>
                      ) : (
                        <span className="text-gray-500">Não avaliada</span>
                      ),
                  },
                  {
                    key: 'nivelEsperado',
                    label: 'Esperado',
                    render: (_value, row: (typeof habilidadesFiltradas)[number]) =>
                      // Habilidade não avaliada não exibe o nível esperado — evita
                      // revelar o "gabarito" antes da autoavaliação (mesma regra já
                      // aplicada na antiga tabela "Cobertura por competência" desta
                      // tela, decisão de produto de Alice).
                      row.status === 'sem' ? <span className="text-gray-400">—</span> : row.nivelEsperado,
                  },
                  {
                    key: 'peso',
                    label: 'Peso',
                    render: (_value, row: (typeof habilidadesFiltradas)[number]) =>
                      row.status === 'sem' ? (
                        <span className="text-gray-400">—</span>
                      ) : (
                        <PesoBars pesoAtual={row.pesoAtual} pesoEsperado={row.pesoEsperado} />
                      ),
                  },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (_value, row: (typeof habilidadesFiltradas)[number]) => (
                      <span className={`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full ${STATUS_BADGE[row.status]}`}>
                        {STATUS_LABEL[row.status]}
                      </span>
                    ),
                  },
                ]}
                data={habilidadesPaginadas.map(h => ({ ...h, id: h.habilidadeId }))}
                pagination={{
                  currentPage: paginaAtual,
                  itemsPerPage: ITEMS_PER_PAGE,
                  totalItems: habilidadesFiltradas.length,
                  onPageChange: setPaginaAtual,
                  onItemsPerPageChange: () => {},
                }}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
