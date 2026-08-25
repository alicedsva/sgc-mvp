import { useState, useMemo } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router';
import { ArrowLeft, AlertCircle, Eye, Users, CheckCircle, Clock, TrendingUp, ArrowUp, ArrowDown, ListChecks } from 'lucide-react';
import { Table, Column, InlineAction } from '../components/ui/Table';
import {
  Avaliacao,
  colaboradoresData,
  cargosData,
  habilidadesData,
  jornadasData,
  carreirasData,
  HOJE_SIMULADO,
} from '../data/mockData';
import { useAvaliacoes } from '../context/AvaliacoesContext';
import {
  calcularStatusEfetivo,
  getCarreiraEJornadaNomes,
  getPrazoPartes,
  getStatusAvaliacaoLabel,
  getStatusAvaliacaoBadgeClass,
  getStatusParticipanteBadgeClass,
} from '../utils/avaliacoes';
import { LinhaMeta } from '../components/avaliacoes/LinhaMeta';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/ui/EmptyState';

interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}

// ─── Display types (derived from Avaliacao at render time) ────────────────────

interface ParticipanteDisplay {
  id: string;
  nome: string;
  cargo: string;
  gerencia: string;
  status: 'Não iniciada' | 'Em andamento' | 'Concluída' | 'Expirada';
}

interface HabilidadeAvaliacaoDisplay {
  id: string;
  nome: string;
  competencia: string;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AvaliacaoDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();
  const { avaliacoes } = useAvaliacoes();

  const avaliacao = avaliacoes.find((a) => a.id === id);

  const mainClass = `mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${
    !isSidebarCollapsed ? 'lg:ml-64' : ''
  }`;

  if (!avaliacao) {
    return (
      <main className={mainClass}>
        <div className="p-4 md:p-8">
          <div className="max-w-2xl mx-auto mt-16">
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Avaliação não encontrada</h2>
              <p className="text-sm text-gray-600 mb-6">Esta avaliação não existe ou foi removida.</p>
              <button
                onClick={() => navigate('/avaliacoes')}
                className="px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors"
              >
                Voltar para avaliações
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={mainClass}>
      <div className="p-4 md:p-8">
        <button
          onClick={() => navigate('/avaliacoes')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Avaliações
        </button>

        {avaliacao.status === 'Rascunho' ? (
          <AvaliacaoRascunhoView avaliacao={avaliacao} />
        ) : (
          <AvaliacaoDetalheView avaliacao={avaliacao} />
        )}
      </div>
    </main>
  );
}

// ─── Meta de origem (Carreira · Jornada) — só para esta página de detalhe ─────
//
// avaliacao.publicoLabel ("Jornada: {nome}") é gerado no wizard
// (FormularioAvaliacao.tsx) e usado como está em outras telas (listagem,
// etapa Revisão) — não mexer nele. Aqui, especificamente no header desta
// página, quando a avaliação vem do Caminho "Por Jornada"
// (origemJornadaId preenchido), cruzamos jornadasData → carreirasData pela
// FK real (nunca Jornada.carreira denormalizado, ver schema.ts) para exibir
// também o nome da Carreira. Se a jornada ou a carreira referenciada não
// existir mais nos dados (FK órfã), cai de volta no publicoLabel original
// em vez de quebrar a tela.
function getMetaOrigem(avaliacao: Avaliacao): string | null {
  const nomes = getCarreiraEJornadaNomes(avaliacao.origemJornadaId, jornadasData, carreirasData);
  if (nomes) {
    return `Carreira: ${nomes.carreira} · Jornada: ${nomes.jornada}`;
  }
  return avaliacao.publicoLabel?.startsWith('Jornada:') ? avaliacao.publicoLabel : null;
}

// ─── Rascunho view (prévia somente-leitura) ───────────────────────────────────

function AvaliacaoRascunhoView({ avaliacao }: { avaliacao: Avaliacao }) {
  // Duas abas (Habilidades/Colaboradores) no lugar da tabela única — padrão
  // "Tabs de conteúdo" de 03-navegacao.md, mesma estrutura das abas do
  // Perfil individual (PerfilColaboradorPage.tsx). Cada aba tem sua própria
  // paginação — nunca compartilhar currentPage entre as duas, senão trocar
  // de aba com a página 2 selecionada quebraria a paginação da outra aba.
  const [abaAtiva, setAbaAtiva] = useState<'habilidades' | 'colaboradores'>('habilidades');
  const [currentPageHabilidades, setCurrentPageHabilidades] = useState(1);
  const [currentPageParticipantes, setCurrentPageParticipantes] = useState(1);
  const [participantesSortConfig, setParticipantesSortConfig] = useState<{
    column: 'nome' | 'cargo' | 'id';
    direction: 'asc' | 'desc';
  }>({ column: 'id', direction: 'desc' });

  // avaliacao.participantes é sempre [] em Rascunho — a seleção feita na
  // etapa Colaboradores do wizard não é persistida até a ativação (ver
  // CriarAvaliacaoPage/EditarAvaliacaoRascunhoPage: handleSalvarRascunho
  // sempre grava participantes: []). Total/Pendentes refletem isso — nunca
  // um número inventado — e Responderam/Conclusão são sempre 0 porque
  // Rascunho nunca é visível a colaborador nenhum (04-regras-negocio.md).
  // Fonte única dos 4 SummaryCards do topo — nunca lida a partir da aba
  // ativa, sempre do total real de avaliacao.participantes, então o card
  // "Total de participantes" continua correto independente de qual aba
  // (Habilidades ou Colaboradores) está selecionada no momento.
  const participantesDisplay = useMemo((): ParticipanteDisplay[] => {
    return avaliacao.participantes.map((p) => {
      const colaborador = colaboradoresData.find((c) => c.id === p.colaboradorId);
      return {
        id: p.colaboradorId,
        nome: colaborador?.nome ?? p.colaboradorId,
        cargo: cargosData.find(cg => cg.id === colaborador?.cargoId)?.cargoRM ?? colaborador?.cargo ?? '',
        gerencia: colaborador?.gerencia ?? '',
        status: 'Não iniciada',
      };
    });
  }, [avaliacao]);

  // Habilidades selecionadas — .competencia lido direto (denormalizado, mas
  // já é o padrão usado pela listagem oficial de Habilidades em
  // ContentArea.tsx: nunca recalculado via competenciasData ali também).
  const habilidadesDisplay = useMemo((): HabilidadeAvaliacaoDisplay[] => {
    return (avaliacao.habilidades ?? [])
      .map((id) => habilidadesData.find((h) => h.id === id))
      .filter((h): h is (typeof habilidadesData)[number] => h != null)
      .map((h) => ({ id: h.id, nome: h.nome, competencia: h.competencia }));
  }, [avaliacao]);

  const total = participantesDisplay.length;
  const totalHabilidades = habilidadesDisplay.length;
  const responderam = 0;
  const pendentes = total;
  const percentual = 0;

  const handleParticipantesSort = (column: 'nome' | 'cargo') => {
    setParticipantesSortConfig(prev =>
      prev.column === column
        ? { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { column, direction: 'asc' }
    );
    setCurrentPageParticipantes(1);
  };

  const participantesOrdenados = [...participantesDisplay].sort((a, b) => {
    if (participantesSortConfig.column === 'id') return 0;
    const dir = participantesSortConfig.direction === 'asc' ? 1 : -1;
    return a[participantesSortConfig.column].localeCompare(b[participantesSortConfig.column]) * dir;
  });

  const participantesItemsPerPage = 10;
  const participantesStart = (currentPageParticipantes - 1) * participantesItemsPerPage;
  const participantesPaginados = participantesOrdenados.slice(
    participantesStart,
    participantesStart + participantesItemsPerPage
  );

  const habilidadesItemsPerPage = 10;
  const habilidadesStart = (currentPageHabilidades - 1) * habilidadesItemsPerPage;
  const habilidadesPaginadas = habilidadesDisplay.slice(
    habilidadesStart,
    habilidadesStart + habilidadesItemsPerPage
  );

  const sortHeader = (label: string, column: 'nome' | 'cargo') => (
    <button
      onClick={() => handleParticipantesSort(column)}
      className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
    >
      {label}
      {participantesSortConfig.column === column ? (
        participantesSortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
      ) : (
        <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
      )}
    </button>
  );

  // Só Nome e Cargo — Gerência e Status saíram desta aba (o status aqui
  // sempre seria "Não iniciada" pra todo mundo, ver comentário acima; a
  // visão completa com Gerência/Status continua em AvaliacaoDetalheView,
  // depois de ativada).
  const participantesColumns: Column[] = [
    {
      key: 'nome',
      label: 'Nome',
      renderHeader: () => sortHeader('Nome', 'nome'),
      render: (value) => <span className="font-medium text-gray-900">{value}</span>,
    },
    {
      key: 'cargo',
      label: 'Cargo',
      renderHeader: () => sortHeader('Cargo', 'cargo'),
      render: (value) => <span className="text-gray-600">{value}</span>,
    },
  ];

  const habilidadesColumns: Column[] = [
    {
      key: 'nome',
      label: 'Nome',
      render: (value) => <span className="font-medium text-gray-900">{value}</span>,
    },
    {
      key: 'competencia',
      label: 'Competência',
      render: (value) => <span className="text-gray-600">{value}</span>,
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-2xl font-semibold text-gray-900">{avaliacao.nome}</h1>
          <span className="text-sm text-gray-400 font-normal">{avaliacao.tipo}</span>
          <StatusBadge label={getStatusAvaliacaoLabel('Rascunho')} colorClass={getStatusAvaliacaoBadgeClass('Rascunho')} />
        </div>
        <LinhaMeta partes={[...getPrazoPartes(avaliacao), getMetaOrigem(avaliacao)]} />
      </div>

      {/* Banner de prévia */}
      <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-6">
        <Eye className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-yellow-800">
          <span className="font-semibold">Prévia:</span> esta avaliação ainda não foi ativada. Você está visualizando como ela será apresentada aos colaboradores.
        </p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          icon={<Users className="w-5 h-5 text-[var(--brand-600)]" />}
          label="Total de participantes"
          value={total}
        />
        <SummaryCard
          icon={<CheckCircle className="w-5 h-5 text-green-600" />}
          label="Responderam"
          value={responderam}
        />
        <SummaryCard
          icon={<Clock className="w-5 h-5 text-yellow-600" />}
          label="Pendentes"
          value={pendentes}
        />
        <SummaryCard
          icon={<TrendingUp className="w-5 h-5 text-[var(--brand-600)]" />}
          label="Conclusão"
          value={`${percentual}%`}
          highlight="text-red-700"
        />
      </div>

      {/* Tabs de conteúdo Habilidades/Colaboradores — mesma estrutura das
          abas do Perfil individual (PerfilColaboradorPage.tsx) e padrão
          "Tabs de conteúdo" de 03-navegacao.md: barra própria acima do card,
          ativa com border-b-2 brand, inativa transparente. Nunca pills de
          filtro aqui — pills filtram linhas de uma mesma tabela; estas abas
          trocam o conteúdo inteiro (colunas + fonte de dado). */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-4 overflow-x-auto">
          {([
            { id: 'habilidades' as const, label: 'Habilidades' },
            { id: 'colaboradores' as const, label: 'Colaboradores' },
          ]).map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setAbaAtiva(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                abaAtiva === tab.id
                  ? 'border-[var(--brand-600)] text-[var(--brand-600)]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {abaAtiva === 'habilidades' ? (
          totalHabilidades === 0 ? (
            <EmptyState
              icon={<ListChecks className="w-8 h-8" />}
              title="Nenhuma habilidade selecionada"
              description="Esta avaliação ainda está em rascunho e não tem habilidades definidas. Edite o rascunho para escolher as habilidades na etapa Habilidades."
            />
          ) : (
            <Table
              columns={habilidadesColumns}
              data={habilidadesPaginadas}
              pagination={{
                currentPage: currentPageHabilidades,
                itemsPerPage: habilidadesItemsPerPage,
                totalItems: totalHabilidades,
                onPageChange: setCurrentPageHabilidades,
                onItemsPerPageChange: () => {},
              }}
            />
          )
        ) : total === 0 ? (
          <EmptyState
            icon={<Users className="w-8 h-8" />}
            title="Nenhum colaborador selecionado"
            description="Esta avaliação ainda está em rascunho e não tem participantes definidos. Edite o rascunho para escolher o público-alvo na etapa Colaboradores."
          />
        ) : (
          <Table
            columns={participantesColumns}
            data={participantesPaginados}
            pagination={{
              currentPage: currentPageParticipantes,
              itemsPerPage: participantesItemsPerPage,
              totalItems: total,
              onPageChange: setCurrentPageParticipantes,
              onItemsPerPageChange: () => {},
            }}
          />
        )}
      </div>
    </>
  );
}

// ─── Detalhe completo ─────────────────────────────────────────────────────────

function AvaliacaoDetalheView({ avaliacao }: { avaliacao: Avaliacao }) {
  const navigate = useNavigate();
  const [currentPageParticipantes, setCurrentPageParticipantes] = useState(1);
  const [participantesSortConfig, setParticipantesSortConfig] = useState<{
    column: 'nome' | 'cargo' | 'gerencia' | 'id';
    direction: 'asc' | 'desc';
  }>({ column: 'id', direction: 'desc' });

  const participantesDisplay = useMemo((): ParticipanteDisplay[] => {
    return avaliacao.participantes.map((p) => {
      const colaborador = colaboradoresData.find((c) => c.id === p.colaboradorId);
      return {
        id: p.colaboradorId,
        nome: colaborador?.nome ?? p.colaboradorId,
        cargo: cargosData.find(cg => cg.id === colaborador?.cargoId)?.cargoRM ?? colaborador?.cargo ?? '',
        gerencia: colaborador?.gerencia ?? '',
        status: p.status,
      };
    });
  }, [avaliacao]);

  const total = participantesDisplay.length;
  const responderam = participantesDisplay.filter((p) => p.status === 'Concluída').length;
  const pendentes = total - responderam;
  const percentual = total > 0 ? Math.round((responderam / total) * 100) : 0;

  // Ordenação manual — mesmo padrão já usado 4x em ContentArea.tsx (sort
  // config + handleSort que alterna asc/desc e reseta página, .sort() antes
  // da paginação). Status não é ordenável, mesmo critério já usado na
  // listagem Admin (Participantes/progresso também não é ordenável lá).
  const handleParticipantesSort = (column: 'nome' | 'cargo' | 'gerencia') => {
    setParticipantesSortConfig(prev =>
      prev.column === column
        ? { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { column, direction: 'asc' }
    );
    setCurrentPageParticipantes(1);
  };

  const participantesOrdenados = [...participantesDisplay].sort((a, b) => {
    if (participantesSortConfig.column === 'id') return 0; // ordem original
    const dir = participantesSortConfig.direction === 'asc' ? 1 : -1;
    return a[participantesSortConfig.column].localeCompare(b[participantesSortConfig.column]) * dir;
  });

  const participantesItemsPerPage = 10;
  const participantesStart = (currentPageParticipantes - 1) * participantesItemsPerPage;
  const participantesPaginados = participantesOrdenados.slice(
    participantesStart,
    participantesStart + participantesItemsPerPage
  );

  const sortHeader = (label: string, column: 'nome' | 'cargo' | 'gerencia') => (
    <button
      onClick={() => handleParticipantesSort(column)}
      className="inline-flex items-center gap-1 group text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
    >
      {label}
      {participantesSortConfig.column === column ? (
        participantesSortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
      ) : (
        <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
      )}
    </button>
  );

  const participantesColumns: Column[] = [
    {
      key: 'nome',
      label: 'Nome',
      renderHeader: () => sortHeader('Nome', 'nome'),
      render: (value) => <span className="font-medium text-gray-900">{value}</span>,
    },
    {
      key: 'cargo',
      label: 'Cargo',
      renderHeader: () => sortHeader('Cargo', 'cargo'),
      render: (value) => <span className="text-gray-600">{value}</span>,
    },
    {
      key: 'gerencia',
      label: 'Gerência',
      renderHeader: () => sortHeader('Gerência', 'gerencia'),
      render: (value) => <span className="text-gray-600">{value}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full ${
          getStatusParticipanteBadgeClass(value as ParticipanteDisplay['status'])
        }`}>
          {value as string}
        </span>
      ),
    },
  ];

  // Exceção deliberada à regra geral do sistema ("nunca desabilitar ação de
  // linha, sempre esconder via show"): ver resultado de um participante que
  // ainda não respondeu não faz sentido nenhum (não há resposta pra ver),
  // mas esconder o ícone silenciosamente confundiria o Admin, que vê o
  // ícone Eye em todas as outras linhas/tabelas do sistema e esperaria o
  // mesmo aqui. Por isso o ícone fica visível porém desabilitado, com
  // tooltip explicando o motivo — usa o mecanismo nativo `disabled` do
  // InlineAction (Table.tsx), cujo `label` já vira `title` (tooltip) no
  // botão; passar `label` como função permite um texto diferente conforme
  // o estado, o que dá o "disabled + tooltip" pedido sem precisar de
  // Column manual nem de um Tooltip novo.
  const participantesActions: InlineAction[] = [
    {
      label: (row) =>
        (row as ParticipanteDisplay).status === 'Concluída'
          ? 'Visualizar respostas'
          : 'Disponível após o participante responder',
      icon: <Eye className="w-4 h-4" />,
      disabled: (row) => (row as ParticipanteDisplay).status !== 'Concluída',
      onClick: (row) => navigate(`/avaliacoes/${avaliacao.id}/participantes/${(row as ParticipanteDisplay).id}`),
    },
  ];

  // Status EFETIVO (calculado), nunca avaliacao.status bruto — com
  // modoPrazo/periodoInicio agendável, 'Ativa' gravado pode já estar
  // 'Pendente' ou 'Expirada' na prática (ver calcularStatusEfetivo).
  const statusEfetivo = calcularStatusEfetivo(avaliacao, HOJE_SIMULADO);

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-2xl font-semibold text-gray-900">{avaliacao.nome}</h1>
          <span className="text-sm text-gray-400 font-normal">{avaliacao.tipo}</span>
          <StatusBadge label={getStatusAvaliacaoLabel(statusEfetivo)} colorClass={getStatusAvaliacaoBadgeClass(statusEfetivo)} />
        </div>
        <LinhaMeta partes={[...getPrazoPartes(avaliacao, statusEfetivo === 'Pendente'), getMetaOrigem(avaliacao)]} />
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          icon={<Users className="w-5 h-5 text-[var(--brand-600)]" />}
          label="Total de participantes"
          value={total}
        />
        <SummaryCard
          icon={<CheckCircle className="w-5 h-5 text-green-600" />}
          label="Responderam"
          value={responderam}
        />
        <SummaryCard
          icon={<Clock className="w-5 h-5 text-yellow-600" />}
          label="Pendentes"
          value={pendentes}
        />
        <SummaryCard
          icon={<TrendingUp className="w-5 h-5 text-[var(--brand-600)]" />}
          label="Conclusão"
          value={`${percentual}%`}
          highlight={
            percentual >= 80
              ? 'text-green-700'
              : percentual >= 50
              ? 'text-yellow-700'
              : 'text-red-700'
          }
        />
      </div>

      {/* Tabela de participantes */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table
          columns={participantesColumns}
          data={participantesPaginados}
          actions={participantesActions}
          pagination={{
            currentPage: currentPageParticipantes,
            itemsPerPage: participantesItemsPerPage,
            totalItems: total,
            onPageChange: setCurrentPageParticipantes,
            onItemsPerPageChange: () => {},
          }}
        />
      </div>
    </>
  );
}

// ─── Summary card ─────────────────────────────────────────────────────────────

function SummaryCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  highlight?: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-3xl font-bold ${highlight ?? 'text-gray-900'}`}>{value}</p>
          <p className="text-base font-semibold text-gray-700 mt-0.5">{label}</p>
        </div>
        <span className="flex-shrink-0">{icon}</span>
      </div>
    </div>
  );
}

