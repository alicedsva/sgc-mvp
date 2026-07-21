import { useState, useMemo } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router';
import { ArrowLeft, AlertCircle, Eye, X, Users, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Table, Column } from '../components/ui/Table';
import {
  Avaliacao,
  colaboradoresData,
  cargosData,
  habilidadesData,
  competenciasData,
} from '../data/mockData';
import { useAvaliacoes } from '../context/AvaliacoesContext';

interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}

// ─── Display types (derived from Avaliacao at render time) ────────────────────

interface RespostaDisplay {
  habilidadeId: string;
  habilidade: string;
  competenciaId: string;
  competencia: string;
  nota: number;
}

interface ParticipanteDisplay {
  id: string;
  nome: string;
  cargo: string;
  gerencia: string;
  status: 'Não iniciada' | 'Em andamento' | 'Concluída' | 'Expirada';
  respostas: RespostaDisplay[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const nivelToNota: Record<string, number> = {
  'Básico': 1,
  'Intermediário': 2,
  'Avançado': 3,
  'Especialista': 4,
  'Referência': 5,
};

function formatPeriodo(inicio: string, fim: string): string {
  const [yi, mi, di] = inicio.split('-');
  const [yf, mf, df] = fim.split('-');
  if (yi === yf) return `${di}/${mi} - ${df}/${mf}/${yf}`;
  return `${di}/${mi}/${yi} - ${df}/${mf}/${yf}`;
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

// ─── Rascunho view (prévia somente-leitura) ───────────────────────────────────

function AvaliacaoRascunhoView({ avaliacao }: { avaliacao: Avaliacao }) {
  const periodo = formatPeriodo(avaliacao.periodoInicio, avaliacao.periodoFim);

  const grupos = useMemo(() => {
    if (!avaliacao.habilidades?.length) return [];
    const map = new Map<string, { competencia: string; habilidades: string[] }>();
    avaliacao.habilidades.forEach((hId) => {
      const h = habilidadesData.find((x) => x.id === hId);
      if (!h) return;
      if (!map.has(h.competenciaId)) {
        const comp = competenciasData.find((c) => c.id === h.competenciaId);
        map.set(h.competenciaId, { competencia: comp?.nome ?? h.competenciaId, habilidades: [] });
      }
      map.get(h.competenciaId)!.habilidades.push(h.nome);
    });
    return Array.from(map.values());
  }, [avaliacao.habilidades]);

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-2xl font-semibold text-gray-900">{avaliacao.nome}</h1>
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            Rascunho
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
          <span>{avaliacao.tipo}</span>
          <span className="text-gray-300">·</span>
          <span>{periodo}</span>
          <span className="text-gray-300">·</span>
          <span>{avaliacao.publicoLabel}</span>
        </div>
      </div>

      {/* Banner de prévia */}
      <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mb-6">
        <Eye className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-yellow-800">
          <span className="font-semibold">Prévia</span> — esta avaliação ainda não foi ativada. Você está visualizando como ela será apresentada aos colaboradores.
        </p>
      </div>

      {/* Habilidades agrupadas por competência */}
      {grupos.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {grupos.map((g) => (
            <div key={g.competencia} className="p-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {g.competencia}
              </p>
              <div className="space-y-4">
                {g.habilidades.map((hab) => (
                  <div key={hab} className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-800">{hab}</span>
                    <EscalaLeitura />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-500">Nenhuma habilidade configurada para esta avaliação.</p>
        </div>
      )}
    </>
  );
}

// ─── Escala 1–5 somente-leitura ───────────────────────────────────────────────

function EscalaLeitura() {
  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-xs font-medium text-gray-400 select-none"
        >
          {n}
        </div>
      ))}
    </div>
  );
}

// ─── Detalhe completo ─────────────────────────────────────────────────────────

function AvaliacaoDetalheView({ avaliacao }: { avaliacao: Avaliacao }) {
  const [drawerParticipante, setDrawerParticipante] = useState<ParticipanteDisplay | null>(null);
  const [currentPageParticipantes, setCurrentPageParticipantes] = useState(1);

  const periodo = formatPeriodo(avaliacao.periodoInicio, avaliacao.periodoFim);

  const participantesDisplay = useMemo((): ParticipanteDisplay[] => {
    return avaliacao.participantes.map((p) => {
      const colaborador = colaboradoresData.find((c) => c.id === p.colaboradorId);
      const respostas: RespostaDisplay[] = p.respostas.map((r) => {
        const hab = habilidadesData.find((h) => h.id === r.habilidadeId);
        const comp = hab ? competenciasData.find((c) => c.id === hab.competenciaId) : undefined;
        return {
          habilidadeId: r.habilidadeId,
          habilidade: hab?.nome ?? r.habilidadeId,
          competenciaId: hab?.competenciaId ?? '',
          competencia: comp?.nome ?? '',
          nota: nivelToNota[r.nivelRespondido] ?? 1,
        };
      });
      return {
        id: p.colaboradorId,
        nome: colaborador?.nome ?? p.colaboradorId,
        cargo: cargosData.find(cg => cg.id === colaborador?.cargoId)?.cargoRM ?? colaborador?.cargo ?? '',
        gerencia: colaborador?.gerencia ?? '',
        status: p.status,
        respostas,
      };
    });
  }, [avaliacao]);

  const total = participantesDisplay.length;
  const responderam = participantesDisplay.filter((p) => p.status === 'Concluída').length;
  const pendentes = total - responderam;
  const percentual = total > 0 ? Math.round((responderam / total) * 100) : 0;

  const participantesItemsPerPage = 10;
  const participantesStart = (currentPageParticipantes - 1) * participantesItemsPerPage;
  const participantesPaginados = participantesDisplay.slice(
    participantesStart,
    participantesStart + participantesItemsPerPage
  );

  const statusBadgeClass: Record<string, string> = {
    'Não iniciada': 'bg-orange-100 text-orange-800',
    'Em andamento': 'bg-blue-100 text-blue-800',
    'Concluída': 'bg-green-100 text-green-800',
    'Expirada': 'bg-gray-100 text-gray-700',
  };

  const participantesColumns: Column[] = [
    {
      key: 'nome',
      label: 'Nome',
      render: (value) => <span className="font-medium text-gray-900">{value}</span>,
    },
    {
      key: 'cargo',
      label: 'Cargo',
      render: (value) => <span className="text-gray-600">{value}</span>,
    },
    {
      key: 'gerencia',
      label: 'Gerência',
      render: (value) => <span className="text-gray-600">{value}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full ${
          statusBadgeClass[value as string] ?? 'bg-gray-100 text-gray-700'
        }`}>
          {value as string}
        </span>
      ),
    },
    {
      key: '_actions',
      label: 'Ações',
      render: (_, row) => (
        row.status === 'Concluída' ? (
          <div className="flex justify-end">
            <button
              onClick={() => setDrawerParticipante(row as unknown as ParticipanteDisplay)}
              title="Visualizar respostas"
              className="p-1.5 md:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <span className="inline-block w-8" />
        )
      ),
    },
  ];

  const statusClass =
    avaliacao.status === 'Ativa' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700';

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-2xl font-semibold text-gray-900">{avaliacao.nome}</h1>
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusClass}`}>
            {avaliacao.status}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
          <span>{avaliacao.tipo}</span>
          <span className="text-gray-300">·</span>
          <span>{periodo}</span>
          <span className="text-gray-300">·</span>
          <span>{avaliacao.publicoLabel}</span>
        </div>
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
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Participantes</h2>
        </div>
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
      </div>

      {/* Drawer de respostas */}
      {drawerParticipante && (
        <RespostasDrawer
          participante={drawerParticipante}
          onClose={() => setDrawerParticipante(null)}
        />
      )}
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

// ─── Drawer de respostas ──────────────────────────────────────────────────────

function RespostasDrawer({
  participante,
  onClose,
}: {
  participante: ParticipanteDisplay;
  onClose: () => void;
}) {
  const porCompetencia = useMemo(() => {
    const groups: Record<string, RespostaDisplay[]> = {};
    participante.respostas.forEach((r) => {
      if (!groups[r.competenciaId]) groups[r.competenciaId] = [];
      groups[r.competenciaId].push(r);
    });
    return groups;
  }, [participante]);

  const competenciaIds = Object.keys(porCompetencia);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 ml-0 md:ml-20 lg:ml-64 mt-16 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Painel */}
      <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-full md:w-[35%] md:max-w-xl md:min-w-[400px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-white">
          <div>
            <h2 className="text-base md:text-lg font-semibold text-gray-900">{participante.nome}</h2>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              {participante.cargo} · {participante.gerencia}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-5">
          {competenciaIds.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Nenhuma resposta registrada.</p>
          ) : (
            competenciaIds.map((compId) => (
              <div key={compId}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {porCompetencia[compId][0].competencia}
                </p>
                <div className="space-y-3">
                  {porCompetencia[compId].map((r) => (
                    <div
                      key={r.habilidadeId}
                      className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                    >
                      <span className="text-sm text-gray-800">{r.habilidade}</span>
                      <NotaVisual nota={r.nota} />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

// ─── Nota visual (dots 1–5) ───────────────────────────────────────────────────

function NotaVisual({ nota }: { nota: number }) {
  const notaColor =
    nota >= 4 ? 'text-green-700 bg-green-100' :
    nota === 3 ? 'text-yellow-700 bg-yellow-100' :
    'text-red-700 bg-red-100';

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              n <= nota ? 'bg-[var(--brand-500)]' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold tabular-nums ${notaColor}`}>
        {nota}
      </span>
    </div>
  );
}
