import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router';
import { AlertCircle, ArrowLeft, ArrowDown, ArrowUp, CheckCircle2, Info, TrendingUp } from 'lucide-react';
import {
  colaboradoresData,
  cargosData,
  habilidadesData,
  getPesoFromNome,
} from '../data/mockData';
import { useAvaliacoes } from '../context/AvaliacoesContext';
import { getStatus, Status, STATUS_LABEL, PesoBars } from './minhaCarreiraShared';
import { getNivelEsperadoPorColaborador, formatData, NivelEsperadoInfo } from '../utils/avaliacoes';
import { Table } from '../components/ui/Table';
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip';
import { LinhaMeta } from '../components/avaliacoes/LinhaMeta';

type OutletContext = { isSidebarCollapsed: boolean; viewMode: 'admin' | 'colaborador' };

// Mesmo tamanho de página já padronizado no sistema — ver CompetenciaDetalhePage.tsx.
const ITEMS_PER_PAGE = 10;

// Mesma paleta já documentada em 02-design-system.md/04-regras-negocio.md e
// reaproveitada tal qual em CompetenciaDetalhePage.tsx (verde para acima E no
// esperado, vermelho para abaixo, cinza para "sem" comparação possível).
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

interface LinhaTabela {
  habilidadeId: string;
  habilidadeNome: string;
  competenciaNome: string;
  info: NivelEsperadoInfo;
  nivelVoceLabel: string;
  pesoAtual: number;
  nivelEsperadoLabel: string | null;
  pesoEsperado: number | null;
  status: Status;
}

export default function ParticipanteResultadoPage() {
  const { id, colaboradorId } = useParams<{ id: string; colaboradorId: string }>();
  const navigate = useNavigate();
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();
  const { avaliacoes } = useAvaliacoes();

  const [filtro, setFiltro] = useState<FiltroTab>('todas');
  const [paginaAtual, setPaginaAtual] = useState(1);
  // Ordenação manual — mesmo padrão já usado 4x em ContentArea.tsx.
  // Respondido/Esperado/Peso/Status não são ordenáveis (valores calculados,
  // ordenar por eles não agrega tanto quanto por nome/competência).
  const [sortConfig, setSortConfig] = useState<{
    column: 'habilidadeNome' | 'competenciaNome' | 'id';
    direction: 'asc' | 'desc';
  }>({ column: 'id', direction: 'desc' });

  useEffect(() => {
    setPaginaAtual(1);
  }, [filtro]);

  const handleSort = (column: 'habilidadeNome' | 'competenciaNome') => {
    setSortConfig(prev =>
      prev.column === column
        ? { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { column, direction: 'asc' }
    );
    setPaginaAtual(1);
  };

  const sortHeader = (label: string, column: 'habilidadeNome' | 'competenciaNome') => (
    <button
      onClick={() => handleSort(column)}
      className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
    >
      {label}
      {sortConfig.column === column ? (
        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
      ) : (
        <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
      )}
    </button>
  );

  const mainClass = `mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${
    !isSidebarCollapsed ? 'lg:ml-64' : ''
  }`;

  const avaliacao = avaliacoes.find(a => a.id === id);
  const participante = avaliacao?.participantes.find(p => p.colaboradorId === colaboradorId);
  const colaborador = colaboradoresData.find(c => c.id === colaboradorId);

  if (!avaliacao || !participante || !colaborador) {
    return (
      <main className={mainClass}>
        <div className="p-4 md:p-8">
          <div className="max-w-2xl mx-auto mt-16">
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {!avaliacao ? 'Avaliação não encontrada' : 'Participante não encontrado'}
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                {!avaliacao
                  ? 'Esta avaliação não existe ou foi removida.'
                  : 'Este colaborador não está entre os participantes desta avaliação.'}
              </p>
              <button
                onClick={() => navigate(avaliacao ? `/avaliacoes/${avaliacao.id}` : '/avaliacoes')}
                className="px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const cargoNome = cargosData.find(cg => cg.id === colaborador.cargoId)?.cargoRM ?? colaborador.cargo;

  // Respostas reais do participante nesta avaliação — cruzadas com
  // habilidadesData para saber nome/competência (por id, nunca por string).
  const respostasComHabilidade = participante.respostas
    .map(r => {
      const habilidade = habilidadesData.find(h => h.id === r.habilidadeId);
      return habilidade ? { resposta: r, habilidade } : null;
    })
    .filter((x): x is { resposta: typeof participante.respostas[number]; habilidade: (typeof habilidadesData)[number] } => x != null);

  const dataRespondida = respostasComHabilidade.length > 0
    ? respostasComHabilidade.reduce((max, { resposta }) => (resposta.dataResposta > max ? resposta.dataResposta : max), respostasComHabilidade[0].resposta.dataResposta)
    : null;

  // Nível esperado do cargo ATUAL do colaborador — sempre via
  // getNivelEsperadoPorColaborador (habilidadesCargoData, fonte real), nunca
  // via joaoHabilidadesCargoMatriz (mock exclusivo de João).
  const nivelEsperadoMap = getNivelEsperadoPorColaborador(colaboradorId!);

  // Linhas na MESMA ordem que já vinha sendo usada (agrupada por
  // competência, na ordem de primeira aparição das respostas) — nunca
  // reordenar aleatoriamente ao achatar em tabela única.
  const competenciaOrdem: string[] = [];
  respostasComHabilidade.forEach(({ habilidade }) => {
    if (!competenciaOrdem.includes(habilidade.competenciaId)) competenciaOrdem.push(habilidade.competenciaId);
  });

  const linhas: LinhaTabela[] = competenciaOrdem.flatMap(compId =>
    respostasComHabilidade
      .filter(({ habilidade }) => habilidade.competenciaId === compId)
      .map(({ resposta, habilidade }) => {
        const info = nivelEsperadoMap.get(resposta.habilidadeId) ?? { tipo: 'nao_configurado' as const };
        const status: Status = info.tipo === 'configurado' ? getStatus(resposta.nivelRespondido, info.nivel) : 'sem';
        return {
          habilidadeId: habilidade.id,
          habilidadeNome: habilidade.nome,
          competenciaNome: habilidade.competencia,
          info,
          nivelVoceLabel: resposta.nivelRespondido === 'nao_sei' ? 'Sem conhecimento' : resposta.nivelRespondido,
          pesoAtual: getPesoFromNome(resposta.nivelRespondido),
          nivelEsperadoLabel: info.tipo === 'configurado' ? info.nivel : null,
          pesoEsperado: info.tipo === 'configurado' ? getPesoFromNome(info.nivel) : null,
          status,
        };
      })
  );

  const totalAvaliadas = linhas.length;
  const noOuAcima = linhas.filter(l => l.status === 'no' || l.status === 'acima').length;
  const abaixoDoEsperado = linhas.filter(l => l.status === 'abaixo').length;

  const contagens = {
    todas: linhas.length,
    abaixo: linhas.filter(l => l.status === 'abaixo').length,
    no: linhas.filter(l => l.status === 'no').length,
    acima: linhas.filter(l => l.status === 'acima').length,
    sem: linhas.filter(l => l.status === 'sem').length,
  };

  const linhasFiltradas = filtro === 'todas' ? linhas : linhas.filter(l => l.status === filtro);
  const linhasOrdenadas = [...linhasFiltradas].sort((a, b) => {
    if (sortConfig.column === 'id') return 0; // ordem original (agrupada por competência)
    const dir = sortConfig.direction === 'asc' ? 1 : -1;
    return a[sortConfig.column].localeCompare(b[sortConfig.column]) * dir;
  });
  const linhasPaginadas = linhasOrdenadas.slice((paginaAtual - 1) * ITEMS_PER_PAGE, paginaAtual * ITEMS_PER_PAGE);

  return (
    <main className={mainClass}>
      <div className="p-4 md:p-8">
        <div className="space-y-6">
          {/* Header com botão voltar */}
          <div>
            <button
              onClick={() => navigate(`/avaliacoes/${avaliacao.id}`)}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {avaliacao.nome}
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">{colaborador.nome}</h1>
            <LinhaMeta
              className="text-sm text-gray-600 mt-1"
              partes={[
                cargoNome,
                colaborador.gerencia,
                dataRespondida ? <strong className="font-semibold">{`Respondida em ${formatData(dataRespondida)}`}</strong> : null,
              ]}
            />
          </div>

          {/* Cards de resumo — Admin: sem wrapper colorido no ícone (exceção
              de wrapper é só para telas do Colaborador, ver
              04-regras-negocio.md). */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{totalAvaliadas}</p>
                  <p className="text-base font-semibold text-gray-700 mt-0.5">Habilidades avaliadas</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{noOuAcima}</p>
                  <p className="text-base font-semibold text-gray-700 mt-0.5">No esperado ou acima</p>
                </div>
                <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{abaixoDoEsperado}</p>
                  <p className="text-base font-semibold text-gray-700 mt-0.5">Abaixo do esperado</p>
                </div>
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Tabela única — mesma anatomia de container+toolbar+pills já
              usada em CompetenciaDetalhePage.tsx. */}
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

            {linhas.length === 0 ? (
              <p className="px-3 md:px-6 py-8 text-center text-sm text-gray-500">Nenhuma resposta registrada.</p>
            ) : (
              <Table
                columns={[
                  {
                    key: 'habilidadeNome',
                    label: 'Habilidade',
                    renderHeader: () => sortHeader('Habilidade', 'habilidadeNome'),
                  },
                  {
                    key: 'competenciaNome',
                    label: 'Competência',
                    renderHeader: () => sortHeader('Competência', 'competenciaNome'),
                    render: (_value, row: LinhaTabela) => <span className="text-gray-600">{row.competenciaNome}</span>,
                  },
                  {
                    key: 'nivelVoceLabel',
                    label: 'Respondido',
                    render: (_value, row: LinhaTabela) =>
                      row.nivelVoceLabel === 'Sem conhecimento' ? (
                        <span className="text-gray-500">{row.nivelVoceLabel}</span>
                      ) : (
                        <span className="text-gray-900">{row.nivelVoceLabel}</span>
                      ),
                  },
                  {
                    key: 'nivelEsperadoLabel',
                    label: 'Esperado',
                    render: (_value, row: LinhaTabela) =>
                      row.info.tipo === 'configurado' ? (
                        row.nivelEsperadoLabel
                      ) : (
                        <span className="text-gray-500 flex items-center gap-1">
                          <span>-</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            </TooltipTrigger>
                            <TooltipContent>
                              {row.info.tipo === 'nao_configurado'
                                ? 'Esta habilidade foi avaliada, mas não faz parte da matriz de habilidades esperadas para o cargo atual deste colaborador. Por isso, não há um nível esperado para comparação.'
                                : 'O RH definiu explicitamente que esta habilidade não é exigida para o cargo atual deste colaborador. Por isso, não há um nível esperado para comparação.'}
                            </TooltipContent>
                          </Tooltip>
                        </span>
                      ),
                  },
                  {
                    key: 'peso',
                    label: 'Peso',
                    render: (_value, row: LinhaTabela) =>
                      row.info.tipo === 'configurado' ? (
                        <PesoBars pesoAtual={row.pesoAtual} pesoEsperado={row.pesoEsperado!} />
                      ) : (
                        <span className="text-gray-400">-</span>
                      ),
                  },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (_value, row: LinhaTabela) => (
                      <span className={`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full ${STATUS_BADGE[row.status]}`}>
                        {row.info.tipo === 'nao_exigido'
                          ? 'Não exigido'
                          : row.info.tipo === 'nao_configurado'
                          ? 'Sem referência'
                          : STATUS_LABEL[row.status]}
                      </span>
                    ),
                  },
                ]}
                data={linhasPaginadas.map(l => ({ ...l, id: l.habilidadeId }))}
                pagination={{
                  currentPage: paginaAtual,
                  itemsPerPage: ITEMS_PER_PAGE,
                  totalItems: linhasFiltradas.length,
                  onPageChange: setPaginaAtual,
                  onItemsPerPageChange: () => {},
                }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
