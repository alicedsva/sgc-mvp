import { useEffect, useMemo, useState, Fragment, type ReactNode } from 'react';
import { ArrowLeft, Check, ChevronRight, Eye, GitBranch, Users as UsersIcon, AlertTriangle, Info, X } from 'lucide-react';
import { toast } from 'sonner';
import { colaboradoresData, cargosData, HOJE_SIMULADO, type Avaliacao } from '../../data/mockData';
import { useCarreiras } from '../../context/CarreirasContext';
import { HabilidadesMasterDetail, type HabilidadeItem } from '../templates/HabilidadesMasterDetail';
import { SeletorGerenciaGranular } from '../templates/SeletorGerenciaGranular';
import { SearchableSelect } from '../ui/SearchableSelect';
import { ConfirmationModal } from '../templates/ConfirmationModal';
import QuestionarioPreview from './QuestionarioPreview';
import { calcularPrazoParticipante, formatPeriodoAvaliacao, formatData, getCarreiraEJornadaNomes, getPrazoPartes } from '../../utils/avaliacoes';
import { LinhaMeta } from './LinhaMeta';
import type { ModoPrazoAvaliacao } from '../../../data/schema';

const HOJE_ISO = HOJE_SIMULADO.toISOString().slice(0, 10);

// Gerências reais (derivadas de colaboradoresData) — nunca lista fixa.
// Mesmo padrão usado em DashboardPage.tsx e ContentArea.tsx.
const GERENCIAS = Array.from(new Set(colaboradoresData.map(c => c.gerencia))).sort();

export type CaminhoAvaliacao = 'jornada' | 'publico';

export interface NovaAvaliacaoFormData {
  caminho: CaminhoAvaliacao | null;
  nome: string;
  descricao: string;
  habilidades: string[];
  // Caminho "Por Jornada"
  jornadaId: string;
  // Caminho "Por Público-alvo"
  colaboradoresSelecionados: string[];
  gerenciasComAutoInclusao: string[];
  // Prazo — 3 campos livres, todos opcionais. Fim e Dias são mutuamente
  // exclusivos (ver validarEtapa/montarCamposPrazo). O modoPrazo real do
  // schema é sempre INFERIDO da combinação preenchida, nunca escolhido
  // diretamente pelo Admin — ver montarCamposPrazo.
  dataInicio: string;
  dataFim: string;
  prazoDias: string;
  // Derivados, calculados pelo próprio formulário — a página só monta o
  // objeto Avaliacao final a partir daqui, sem reimplementar a lógica de
  // resolução de público/participantes.
  publicoLabelCalculado: string;
  participantesIds: string[];
}

// Infere o modoPrazo real do schema a partir da combinação preenchida dos 3
// campos livres da Etapa Prazo — nunca um seletor explícito. Regra de
// negócio final (aprovada pelo time — substitui a versão anterior, que
// tratava Término e Prazo como mutuamente exclusivos): os 9 casos abaixo.
//
// | Início | Término | Dias | Resultado |
// |--------|---------|------|-----------|
// | vazio  | vazio   | vazio| indefinido; periodoInicio = dataPublicacao |
// | preenc.(futuro/hoje)| vazio | vazio| indefinido; periodoInicio = a data informada |
// | preenc.| preenc. | vazio| datas_fixas |
// | preenc.| vazio   | preenc.| prazo_em_dias, periodoInicio agendado |
// | vazio  | vazio   | preenc.| prazo_em_dias; periodoInicio = dataPublicacao |
// | vazio  | preenc. | vazio| datas_fixas; periodoInicio = dataPublicacao |
// | vazio  | preenc. | preenc.| datas_fixas_com_prazo; periodoInicio = dataPublicacao |
// | preenc.| preenc. | preenc.| datas_fixas_com_prazo; periodoInicio = a data informada |
//
// Término + Dias juntos (novo — antes bloqueado por validarEtapa) sempre
// vira 'datas_fixas_com_prazo': o prazo individual de cada participante é o
// menor entre dataEntrada+prazoDias e periodoFim (ver calcularPrazoParticipante
// em utils/avaliacoes.ts), e periodoFim tem precedência para expirar a
// avaliação inteira (ver calcularStatusEfetivo).
//
// dataPublicacao ausente = só Salvar Rascunho, sem publicar de fato — os
// ramos que resolveriam periodoInicio para "agora" ficam com '' mesmo
// (mesmo comportamento histórico: periodoInicio vazio enquanto Rascunho).
// dataPublicacao presente = Ativar de verdade (ou o preview "como ficaria
// se ativado agora"), então esses ramos resolvem para a data real.
export function montarCamposPrazo(data: NovaAvaliacaoFormData, dataPublicacao?: string): {
  modoPrazo: ModoPrazoAvaliacao;
  periodoInicio: string;
  periodoFim: string | undefined;
  prazoDias: number | undefined;
} {
  const inicio = data.dataInicio.trim();
  const fim = data.dataFim.trim();
  const dias = data.prazoDias.trim();

  if (!inicio && !fim && !dias) {
    return { modoPrazo: 'indefinido', periodoInicio: dataPublicacao ?? '', periodoFim: undefined, prazoDias: undefined };
  }
  if (fim && dias) {
    // Término + Prazo juntos, com ou sem Início explícito.
    return { modoPrazo: 'datas_fixas_com_prazo', periodoInicio: inicio || dataPublicacao || '', periodoFim: fim, prazoDias: Number(dias) };
  }
  if (inicio && fim) {
    return { modoPrazo: 'datas_fixas', periodoInicio: inicio, periodoFim: fim, prazoDias: undefined };
  }
  if (inicio && dias) {
    return { modoPrazo: 'prazo_em_dias', periodoInicio: inicio, periodoFim: undefined, prazoDias: Number(dias) };
  }
  if (dias) {
    return { modoPrazo: 'prazo_em_dias', periodoInicio: dataPublicacao ?? '', periodoFim: undefined, prazoDias: Number(dias) };
  }
  if (fim) {
    return { modoPrazo: 'datas_fixas', periodoInicio: dataPublicacao ?? '', periodoFim: fim, prazoDias: undefined };
  }
  // Início preenchido sozinho (fim e dias vazios) — tratado como "sem prazo
  // de término, mas agendado para essa data" (nunca como "hoje", já que o
  // Admin escolheu uma data explícita).
  return { modoPrazo: 'indefinido', periodoInicio: inicio, periodoFim: undefined, prazoDias: undefined };
}

function montarFormVazio(jornadaPreSelecionada?: string): NovaAvaliacaoFormData {
  return {
    caminho: jornadaPreSelecionada ? 'jornada' : null,
    nome: '',
    descricao: '',
    habilidades: [],
    jornadaId: jornadaPreSelecionada ?? '',
    colaboradoresSelecionados: [],
    gerenciasComAutoInclusao: [],
    dataInicio: '',
    dataFim: '',
    prazoDias: '',
    publicoLabelCalculado: '',
    participantesIds: [],
  };
}

// Reconstrói o formulário a partir de uma avaliação já existente — usado
// pela edição de Rascunho (EditarAvaliacaoRascunhoPage). Nunca chamado para
// avaliação materializada (essa passa a ser tratada só pelo
// EditarAvaliacaoModal, que cuida exclusivamente de prorrogação de prazo).
export function montarFormDeAvaliacao(avaliacao: Avaliacao): NovaAvaliacaoFormData {
  const caminho: CaminhoAvaliacao = avaliacao.origemJornadaId ? 'jornada' : 'publico';
  const participantesIds = avaliacao.participantes.map(p => p.colaboradorId);
  return {
    caminho,
    nome: avaliacao.nome,
    descricao: avaliacao.descricao ?? '',
    habilidades: avaliacao.habilidades ?? [],
    jornadaId: avaliacao.origemJornadaId ?? '',
    colaboradoresSelecionados: caminho === 'publico' ? participantesIds : [],
    gerenciasComAutoInclusao: avaliacao.gerenciasComAutoInclusao ?? [],
    dataInicio: avaliacao.periodoInicio,
    dataFim: avaliacao.periodoFim ?? '',
    prazoDias: avaliacao.prazoDias != null ? String(avaliacao.prazoDias) : '',
    publicoLabelCalculado: avaliacao.publicoLabel,
    participantesIds,
  };
}

// Rótulo de público-alvo para seleção granular de gerência/colaboradores —
// mesmo espírito de formatPublicoLabel (ContentArea.tsx), generalizado para
// o caso "algumas gerências inteiras + colaboradores avulsos".
//
// Caminho misto (gerência(s) inteira(s) + avulsos de fora delas) precisa
// nomear as gerências inteiras explicitamente — bug real encontrado e
// corrigido em 2026-08-20: antes, esse caso caía direto no fallback
// genérico "N colaboradores selecionados", uma string que só carrega a
// CONTAGEM total, sem indicar quem foi selecionado. Isso colide de verdade
// com qualquer outra seleção — de gerência(s) diferente(s), ou até de
// indivíduos completamente diferentes — que resulte na mesma contagem total
// (ex: "Tecnologia inteira (17) + 2 avulsos de Design" = 19 vira
// "19 colaboradores selecionados", indistinguível de 19 pessoas escolhidas
// de qualquer outra combinação). Como duplicidadeDetectada (mais abaixo)
// compara nome + publicoLabelCalculado como string, essa colisão podia
// mascarar públicos-alvo genuinamente diferentes como se fossem iguais.
function montarPublicoLabelGranular(selecionados: Set<string>): string {
  if (selecionados.size === 0) return '';
  const colaboradores = colaboradoresData as unknown as { id: string; gerencia: string }[];
  const porGerencia: Record<string, { total: number; marcados: number }> = {};
  GERENCIAS.forEach(g => { porGerencia[g] = { total: 0, marcados: 0 }; });
  colaboradores.forEach(c => {
    if (!porGerencia[c.gerencia]) porGerencia[c.gerencia] = { total: 0, marcados: 0 };
    porGerencia[c.gerencia].total++;
    if (selecionados.has(c.id)) porGerencia[c.gerencia].marcados++;
  });
  const gerenciasInteiras = GERENCIAS.filter(g => porGerencia[g].total > 0 && porGerencia[g].marcados === porGerencia[g].total);
  const totalViaInteiras = gerenciasInteiras.reduce((soma, g) => soma + porGerencia[g].marcados, 0);

  const labelGerenciasInteiras = (): string => {
    if (gerenciasInteiras.length >= GERENCIAS.length) return 'Todos os colaboradores';
    if (gerenciasInteiras.length === 1) return gerenciasInteiras[0];
    if (gerenciasInteiras.length === 2) return `${gerenciasInteiras[0]} e ${gerenciasInteiras[1]}`;
    return `${gerenciasInteiras.slice(0, -1).join(', ')} e ${gerenciasInteiras[gerenciasInteiras.length - 1]}`;
  };

  if (totalViaInteiras === selecionados.size && gerenciasInteiras.length > 0) {
    return labelGerenciasInteiras();
  }

  // Misto: uma ou mais gerências inteiras + avulsos de fora delas.
  if (gerenciasInteiras.length > 0) {
    const avulsos = selecionados.size - totalViaInteiras;
    return `${labelGerenciasInteiras()} + ${avulsos} colaborador${avulsos === 1 ? '' : 'es'} selecionado${avulsos === 1 ? '' : 's'}`;
  }

  return `${selecionados.size} colaborador${selecionados.size === 1 ? '' : 'es'} selecionado${selecionados.size === 1 ? '' : 's'}`;
}

// Lista somente-leitura de colaboradores — reaproveitada pelos dois
// caminhos do wizard (Etapa Identificação e card "Público-alvo" da Revisão,
// caminho "Por Jornada"; card da Revisão, caminho "Por Público-alvo"):
// deliberadamente não reaproveita ColaboradoresSelectionModal: aquele modal
// é construído em torno de seleção por checkbox agrupada por cargo (estado
// de seleção, "Selecionar todos", footer com ação de confirmação); adaptar
// isso para uma listagem somente-leitura exigiria simular props de
// seleção/vínculo que não existem neste contexto. Modal novo, mesma
// anatomia visual (overlay, header com X, footer com Cancelar).
// `subtitulo` é opcional — presente só quando faz sentido nomear a origem
// (nome da jornada, no Caminho "Por Jornada"); ausente no Caminho
// "Por Público-alvo", onde não há uma única entidade de origem a nomear.
function ColaboradoresListaModal({
  isOpen, onClose, titulo, subtitulo, colaboradores,
}: {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  subtitulo?: string;
  colaboradores: { id: string; nome: string; cargo: string }[];
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/35" onClick={onClose} />
      <div
        className="relative bg-white rounded-lg shadow-2xl flex flex-col w-full max-w-md max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{titulo}</h2>
            {subtitulo && <p className="text-xs text-gray-500 mt-0.5">{subtitulo}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {colaboradores.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Nenhum colaborador vinculado</p>
          ) : (
            <div className="space-y-0.5">
              {colaboradores.map(c => (
                <div key={c.id} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-sm text-gray-900 truncate">{c.nome}</span>
                  <span className="text-xs text-gray-500 flex-shrink-0">{c.cargo}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// Destaque inline do nome de um campo do formulário (Início/Término/Prazo)
// dentro de um item de dica — font-medium só na palavra, resto da frase em
// peso normal. Usado apenas nos itens da dica da Etapa Prazo.
function Campo({ children }: { children: ReactNode }) {
  return <strong className="font-medium">{children}</strong>;
}

interface Etapa {
  key: 'publico' | 'colaboradores' | 'identificacao' | 'habilidades' | 'prazo' | 'revisao';
  label: string;
}

// Caminho "Por Jornada" — 5 etapas, sem alteração: participantes vêm da
// matriz da jornada, não há etapa própria de seleção de colaboradores.
const ETAPAS_CRIACAO_JORNADA: Etapa[] = [
  { key: 'publico', label: 'Público' },
  { key: 'identificacao', label: 'Identificação' },
  { key: 'habilidades', label: 'Habilidades' },
  { key: 'prazo', label: 'Prazo' },
  { key: 'revisao', label: 'Revisão' },
];

// Caminho "Por Público-alvo" — 6 etapas: a seleção de colaboradores/gerências
// (SeletorGerenciaGranular) tem etapa própria, separada da Identificação (que
// só cuida de Nome + Descrição). "Colaboradores" fica perto do fim (depois de
// Prazo, antes de Revisão) — deixou de ser obrigatória para avançar (decisão
// de produto — Alice, 2026-08-24): o Admin pode montar toda a avaliação e só
// decidir o público por último, inclusive deixando pra depois (rascunho sem
// participante nenhum é permitido, só não pode ser ativada assim).
const ETAPAS_CRIACAO_PUBLICO: Etapa[] = [
  { key: 'publico', label: 'Público' },
  { key: 'identificacao', label: 'Identificação' },
  { key: 'habilidades', label: 'Habilidades' },
  { key: 'prazo', label: 'Prazo' },
  { key: 'colaboradores', label: 'Colaboradores' },
  { key: 'revisao', label: 'Revisão' },
];

// Edição de Rascunho não repete a escolha de caminho — ela já foi feita na
// criação e não pode ser trocada (mesma regra fechada que já valia no
// EditarAvaliacaoModal antes desta migração).
const ETAPAS_EDICAO_JORNADA: Etapa[] = ETAPAS_CRIACAO_JORNADA.filter(e => e.key !== 'publico');
const ETAPAS_EDICAO_PUBLICO: Etapa[] = ETAPAS_CRIACAO_PUBLICO.filter(e => e.key !== 'publico');

interface FormularioAvaliacaoProps {
  /** Presente = modo edição de Rascunho. Ausente = modo criação. */
  avaliacaoExistente?: Avaliacao;
  /** Pré-seleciona o Caminho "Por Jornada" com esta jornada — vindo do botão "Criar avaliação para esta matriz" (JornadaDetalhePage). Só relevante em modo criação. */
  jornadaPreSelecionada?: string;
  habilidades: { id: string; nome: string; competencia: string; competenciaId?: string; tipo?: 'Técnica' | 'Comportamental'; status?: string }[];
  // jornadaId/participantesIds vêm de Avaliacao.origemJornadaId/participantes (schema.ts) —
  // nenhum campo novo precisou ser adicionado ao schema, os dois já existiam.
  avaliacoesExistentes: { nome: string; publicoLabel: string; jornadaId?: string; participantesIds: string[] }[];
  onSalvarRascunho: (data: NovaAvaliacaoFormData) => void;
  onAtivar: (data: NovaAvaliacaoFormData) => void;
  isSidebarCollapsed: boolean;
  breadcrumbLabel: string;
  onCancelar: () => void;
}

export function FormularioAvaliacao({
  avaliacaoExistente, jornadaPreSelecionada, habilidades, avaliacoesExistentes,
  onSalvarRascunho, onAtivar, isSidebarCollapsed, breadcrumbLabel, onCancelar,
}: FormularioAvaliacaoProps) {
  const modoEdicao = !!avaliacaoExistente;

  const { jornadas, carreiras, getHabilidadesAgregadasDaJornada, getColaboradoresPorJornada } = useCarreiras();
  const jornadasAtivas = useMemo(() => jornadas.filter(j => j.status === 'Ativa'), [jornadas]);
  const carreirasAtivas = useMemo(() => carreiras.filter(c => c.status === 'Ativa'), [carreiras]);

  const [formData, setFormData] = useState<NovaAvaliacaoFormData>(() =>
    avaliacaoExistente ? montarFormDeAvaliacao(avaliacaoExistente) : montarFormVazio(jornadaPreSelecionada)
  );

  // Filtro de Carreira acima do select de Jornada (Caminho "Por Jornada",
  // criação) — não é campo do schema/Avaliacao, só um recorte de UI para
  // reduzir a lista de ~27 jornadas de 18 carreiras misturadas. Pré-carregado
  // com a carreira da jornada, quando ela já chega pronta (botão "Criar
  // avaliação para esta matriz").
  const [carreiraFiltroId, setCarreiraFiltroId] = useState<string>(() =>
    jornadaPreSelecionada ? jornadas.find(j => j.id === jornadaPreSelecionada)?.carreiraId ?? '' : ''
  );
  const jornadasFiltradasPorCarreira = useMemo(
    () => (carreiraFiltroId ? jornadasAtivas.filter(j => j.carreiraId === carreiraFiltroId) : []),
    [jornadasAtivas, carreiraFiltroId],
  );

  // Quantidade e ordem de etapas dependem do caminho escolhido — Por
  // Jornada continua com 5, Por Público-alvo ganhou a etapa "Colaboradores"
  // e passou a 6. O stepper (renderizado a partir desta lista) reflete isso
  // automaticamente. Enquanto o caminho ainda não foi escolhido (etapa
  // "Público", caminho null), usa a variante de 5 etapas como base — o
  // primeiro item ('publico') é igual nas duas, então isso não afeta a
  // etapa atual, só a contagem do stepper até a escolha ser feita.
  const etapas = useMemo(() => {
    if (modoEdicao) {
      return formData.caminho === 'publico' ? ETAPAS_EDICAO_PUBLICO : ETAPAS_EDICAO_JORNADA;
    }
    return formData.caminho === 'publico' ? ETAPAS_CRIACAO_PUBLICO : ETAPAS_CRIACAO_JORNADA;
  }, [modoEdicao, formData.caminho]);

  const [currentStepKey, setCurrentStepKey] = useState<Etapa['key']>(etapas[0].key);
  // Preview do questionário — overlay sobre a própria página, nunca uma
  // rota, então fechar preserva o formData exatamente como estava.
  const [previewAberto, setPreviewAberto] = useState(false);
  // Lista somente-leitura dos colaboradores da jornada (Caminho "Por Jornada", criação).
  const [modalColaboradoresAberto, setModalColaboradoresAberto] = useState(false);
  // Confirmação antes de publicar imediatamente (Início vazio ou hoje) — só
  // para essa situação; agendar para o futuro nunca passa por aqui.
  const [confirmPublicarAberto, setConfirmPublicarAberto] = useState(false);

  const currentIndex = etapas.findIndex(e => e.key === currentStepKey);

  const habilidadesItems: HabilidadeItem[] = useMemo(
    () =>
      habilidades
        .filter(h => !h.status || h.status === 'Ativa')
        .map(h => ({
          id: h.id,
          nome: h.nome,
          tipo: h.tipo ?? 'Técnica',
          competencia: h.competencia,
          competenciaId: h.competenciaId ?? '',
        })),
    [habilidades],
  );

  const colaboradoresItems = useMemo(
    () => (colaboradoresData as unknown as { id: string; nome: string; gerencia: string }[]),
    [],
  );

  const jornadaSelecionada = jornadas.find(j => j.id === formData.jornadaId);

  // Participantes do Caminho "Por Jornada" são sempre recalculados ao vivo em
  // modo edição (nunca a lista congelada de quando a avaliação foi criada) —
  // mesmo princípio de getColaboradoresPorJornada já usado no restante do
  // sistema. Em modo criação, participantesIds já reflete a jornada
  // selecionada (setado em handleSelecionarJornada).
  const participantesAtuais = modoEdicao && formData.caminho === 'jornada'
    ? getColaboradoresPorJornada(formData.jornadaId)
    : formData.participantesIds;

  // Duplicidade nome + público-alvo — aviso, nunca bloqueio (regra fechada).
  // Compara formData.nome (trim + case-insensitive) contra avaliacoesExistentes[].nome
  // — igual a antes — mas o "público" agora é comparado pelos participantes reais,
  // nunca mais pelo texto de publicoLabelCalculado (que pode colidir: duas seleções
  // diferentes podem gerar o mesmo texto, ex: fallback genérico "N colaboradores
  // selecionados" — ver comentário de montarPublicoLabelGranular acima).
  // Caminho Jornada: mesmo jornadaId. Caminho Público-alvo: mesmo conjunto de IDs de
  // colaboradores selecionados (comparação de conjunto — ordem não importa).
  // publicoLabelCalculado continua sendo só o texto exibido na tela, não entra mais
  // nesta comparação.
  const duplicidadeDetectada = useMemo(() => {
    if (!formData.nome.trim() || !formData.caminho) return false;
    const nomeIgual = (a: { nome: string }) =>
      a.nome.trim().toLowerCase() === formData.nome.trim().toLowerCase()
      && (!avaliacaoExistente || a.nome !== avaliacaoExistente.nome);

    if (formData.caminho === 'jornada') {
      if (!formData.jornadaId) return false;
      return avaliacoesExistentes.some(a => nomeIgual(a) && a.jornadaId === formData.jornadaId);
    }

    const selecionados = new Set(formData.colaboradoresSelecionados);
    if (selecionados.size === 0) return false;
    return avaliacoesExistentes.some(a => {
      if (!nomeIgual(a)) return false;
      if (a.participantesIds.length !== selecionados.size) return false;
      return a.participantesIds.every(id => selecionados.has(id));
    });
  }, [avaliacoesExistentes, formData.nome, formData.caminho, formData.jornadaId, formData.colaboradoresSelecionados, avaliacaoExistente]);

  // Redação contextual ao caminho escolhido — mesmo vocabulário já usado na
  // etapa (jornada vs. público-alvo). Fonte única para as duas exibições
  // (campo Nome na Identificação e resumo na Revisão) nunca duplicar a string.
  const mensagemDuplicidade = formData.caminho === 'jornada'
    ? 'Já existe uma avaliação com esse nome para essa jornada.'
    : 'Já existe uma avaliação com esse nome para esse público-alvo.';

  // Ao trocar a jornada no Caminho "Por Jornada" (só acontece em modo
  // criação — em edição o vínculo já está fixo): pré-marca TODAS as
  // habilidades da matriz agregada (todos os cargos), participantes viram
  // getColaboradoresPorJornada — Admin ainda pode desmarcar/adicionar
  // habilidades na Etapa seguinte, mas participantes não são selecionáveis
  // manualmente neste caminho (regra fechada com a Alice).
  const handleSelecionarJornada = (jornadaId: string) => {
    const jornada = jornadas.find(j => j.id === jornadaId);
    const habilidadesAgregadas = getHabilidadesAgregadasDaJornada(jornadaId);
    const participantes = getColaboradoresPorJornada(jornadaId);
    setFormData({
      ...formData,
      jornadaId,
      habilidades: habilidadesAgregadas,
      participantesIds: participantes,
      publicoLabelCalculado: jornada ? `Jornada: ${jornada.nome}` : '',
    });
  };

  // A mesma população de handleSelecionarJornada precisa rodar também quando
  // a jornada já chega pronta no carregamento (botão "Criar avaliação para
  // esta matriz", via jornadaPreSelecionada) — o Select nunca dispara
  // onValueChange nesse caso, porque o valor já nasce setado; sem isso a
  // Etapa Identificação mostrava "0 habilidades · 0 participantes" mesmo
  // com a jornada certa selecionada. Roda uma única vez, no mount.
  useEffect(() => {
    if (!modoEdicao && jornadaPreSelecionada) {
      handleSelecionarJornada(jornadaPreSelecionada);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trocar a Carreira reseta a Jornada (e tudo que dependia dela) — uma
  // jornada de outra carreira não é uma opção válida de qualquer forma, já
  // que o select de Jornada só lista jornadasFiltradasPorCarreira.
  const handleSelecionarCarreira = (carreiraId: string) => {
    setCarreiraFiltroId(carreiraId);
    setFormData(prev => ({
      ...prev,
      jornadaId: '',
      habilidades: [],
      participantesIds: [],
      publicoLabelCalculado: '',
    }));
  };

  const handleSelecionarCaminho = (caminho: CaminhoAvaliacao) => {
    setFormData({ ...formData, caminho });
  };

  const colaboradoresSelecionadosSet = new Set(formData.colaboradoresSelecionados);
  const gerenciasAutoInclusaoSet = new Set(formData.gerenciasComAutoInclusao);

  // Colaboradores deixou de ser obrigatório para avançar (item 2 — Alice,
  // 2026-08-24): um rascunho pode existir sem nenhum participante. Mas
  // ativar/publicar sem ninguém não faz sentido — trava só o botão final,
  // nunca a navegação entre etapas.
  const semColaboradoresSelecionados = formData.caminho === 'publico' && formData.colaboradoresSelecionados.length === 0;

  const handleChangeColaboradoresSelecionados = (next: Set<string>) => {
    const ids = Array.from(next);
    setFormData({
      ...formData,
      colaboradoresSelecionados: ids,
      participantesIds: ids,
      publicoLabelCalculado: montarPublicoLabelGranular(next),
    });
  };

  const handleChangeAutoInclusao = (next: Set<string>) => {
    setFormData({ ...formData, gerenciasComAutoInclusao: Array.from(next) });
  };

  const habilidadesSelecionadasSet = new Set(formData.habilidades);
  const handleChangeHabilidades = (next: Set<string>) => {
    setFormData({ ...formData, habilidades: Array.from(next) });
  };

  // Habilidades da matriz da jornada atual (Caminho 1) — usado para fixar
  // essas habilidades no topo da lista na Etapa Habilidades. Recalculado ao
  // vivo a partir da jornada selecionada, tanto em criação quanto em edição.
  const habilidadesDaMatriz = useMemo(() => {
    if (formData.caminho !== 'jornada' || !formData.jornadaId) return new Set<string>();
    return new Set(getHabilidadesAgregadasDaJornada(formData.jornadaId));
  }, [formData.caminho, formData.jornadaId, getHabilidadesAgregadasDaJornada]);

  // Nomes das habilidades selecionadas, para a lista completa na Revisão.
  const habilidadesSelecionadasDetalhe = habilidadesItems.filter(h => habilidadesSelecionadasSet.has(h.id));

  // Colaboradores da jornada (Caminho "Por Jornada", criação) com nome/cargo
  // resolvidos, para o modal "Ver colaboradores" — cargo sempre lido de
  // cargosData (cargoRM), nunca do campo denormalizado Colaborador.cargo.
  const colaboradoresDaJornadaModal = useMemo(
    () =>
      formData.participantesIds
        .map(id => colaboradoresData.find(c => c.id === id))
        .filter((c): c is NonNullable<typeof c> => Boolean(c))
        .map(c => ({ id: c.id, nome: c.nome, cargo: cargosData.find(cg => cg.id === c.cargoId)?.cargoRM ?? c.cargo })),
    [formData.participantesIds],
  );

  // Mesma resolução id → nome/cargo acima, mas para o Caminho "Por
  // Público-alvo" — a lista já está disponível direto no estado do
  // formulário (colaboradoresSelecionados), sem depender de jornadaId.
  // Reaproveitada pelo mesmo ColaboradoresListaModal do Caminho "Por Jornada".
  const colaboradoresSelecionadosModal = useMemo(
    () =>
      formData.colaboradoresSelecionados
        .map(id => colaboradoresData.find(c => c.id === id))
        .filter((c): c is NonNullable<typeof c> => Boolean(c))
        .map(c => ({ id: c.id, nome: c.nome, cargo: cargosData.find(cg => cg.id === c.cargoId)?.cargoRM ?? c.cargo })),
    [formData.colaboradoresSelecionados],
  );

  // Carreira + Jornada do Caminho "Por Jornada" — mesma função compartilhada
  // usada pelo header de AvaliacaoDetalhePage.tsx (getMetaOrigem), aqui
  // alimentada pelos arrays ao vivo de useCarreiras() (não jornadasData/
  // carreirasData de mockData) para refletir qualquer edição feita no
  // Context. Usado só pelo card "Público-alvo" da Etapa Revisão.
  const carreiraEJornada = useMemo(
    () => getCarreiraEJornadaNomes(formData.jornadaId, jornadas, carreiras),
    [formData.jornadaId, jornadas, carreiras],
  );

  // Botão de ativação — texto e comportamento dependem só da Data de Início
  // bruta (não do modo inferido): futura = agendamento (sem confirmação
  // imediata); vazia ou hoje = publicação imediata (com confirmação).
  // Calculado aqui (antes da dica) porque a dica da Revisão reaproveita
  // labelBotaoAtivar/dataInicioFutura para decidir seu item 2 — nunca duplicar
  // essa condição.
  const dataInicioFutura = formData.dataInicio.trim() !== '' && formData.dataInicio.trim() > HOJE_ISO;
  const labelBotaoAtivar = dataInicioFutura ? 'Agendar avaliação' : 'Publicar agora';

  // Dica lateral — muda por etapa e, em Identificação e Habilidades, pelo
  // caminho escolhido. Título curto e específico por etapa (nunca o genérico
  // "Como funciona esta etapa?"); texto corrido para dica simples, itens
  // para dica com múltiplas regras (Prazo e Revisão) — renderizado como
  // lista numerada, mesmo estilo de RespostaAvaliacaoPage.tsx (tela de
  // Instruções da autoavaliação), nunca um estilo de lista novo. Cada item
  // agora tem 2 níveis: um mini-título curto (font-semibold) extraído do
  // início da frase original, seguido do texto completo como parágrafo
  // abaixo — nenhum texto novo foi inventado, só reparticionado.
  const dica: { titulo: string; texto?: string; itens?: { titulo: string; texto: ReactNode }[] } | null = (() => {
    if (currentStepKey === 'publico') {
      return {
        titulo: 'Escolha o ponto de partida',
        itens: [
          { titulo: 'Por Jornada de Carreira', texto: 'Habilidades e participantes vêm automaticamente da matriz da jornada escolhida.' },
          { titulo: 'Por Público-alvo', texto: 'Você monta manualmente, escolhendo gerências e colaboradores específicos.' },
        ],
      };
    }
    if (currentStepKey === 'colaboradores') {
      return {
        titulo: 'Escolhendo os participantes',
        texto: 'Selecione gerências inteiras, colaboradores específicos, ou os dois. Dá pra marcar uma gerência completa e ainda adicionar colaboradores avulsos de outras áreas.',
      };
    }
    if (currentStepKey === 'identificacao') {
      return formData.caminho === 'jornada'
        ? {
            titulo: 'O que essa jornada já define',
            itens: [
              { titulo: 'Habilidades e participantes', texto: 'Vêm da matriz de competências da jornada selecionada.' },
              { titulo: 'Próxima etapa', texto: 'Você poderá revisar e ajustar as habilidades na próxima etapa.' },
            ],
          }
        : {
            titulo: 'Nomeando a avaliação',
            texto: 'O nome deve ser único para o público escolhido. Nomes repetidos são permitidos apenas se o público-alvo for diferente.',
          };
    }
    if (currentStepKey === 'habilidades') {
      return formData.caminho === 'jornada'
        ? {
            titulo: 'Habilidades pré-selecionadas',
            itens: [
              { titulo: 'Pré-seleção automática', texto: 'Vêm marcadas a partir da matriz da jornada.' },
              { titulo: 'Liberdade de ajuste', texto: 'Você pode desmarcar qualquer uma ou adicionar outras livremente.' },
            ],
          }
        : {
            titulo: 'Monte a lista livremente',
            texto: 'Escolha todas as habilidades que farão parte desta avaliação, técnicas, comportamentais, ou as duas.',
          };
    }
    if (currentStepKey === 'prazo') {
      return {
        titulo: 'Como o prazo funciona',
        itens: [
          { titulo: 'Início', texto: <>Controla a partir de quando a avaliação fica disponível para os participantes.</> },
          { titulo: 'Término', texto: <>Sempre corta tudo: quando chega, a avaliação some para todo mundo, mesmo que o <Campo>Prazo de resposta</Campo> individual de alguém ainda não tenha vencido.</> },
          { titulo: 'Prazo de resposta', texto: <>É o mesmo número de dias para todos, mas a data-limite de cada participante varia: é contada a partir da data em que ele entrou na avaliação.</> },
          { titulo: 'Sem Data de Início', texto: <>A avaliação some para rascunho, invisível para os colaboradores, até você publicá-la.</> },
        ],
      };
    }
    if (currentStepKey === 'revisao') {
      return {
        titulo: 'Antes de concluir',
        itens: [
          { titulo: 'Salvar rascunho', texto: 'Fica invisível para os colaboradores até você ativar depois.' },
          dataInicioFutura
            ? { titulo: 'Agendar avaliação', texto: <>Será publicada automaticamente em <Campo>{formatData(formData.dataInicio.trim())}</Campo>.</> }
            : { titulo: 'Publicar agora', texto: 'Fica disponível imediatamente para os participantes.' },
        ],
      };
    }
    return null;
  })();

  // Preview "como ficaria se ativado agora" — mesma inferência usada de fato
  // na hora de ativar (montarCamposPrazo), só que sempre com dataPublicacao
  // preenchida (hoje), para os campos em branco já mostrarem o resultado
  // real. Fonte única de texto de prazo do card de Revisão e do aviso do
  // modal de confirmação — reaproveita formatPeriodoAvaliacao
  // (utils/avaliacoes.ts), a mesma função usada por
  // ContentArea.tsx/AvaliacaoDetalhePage.tsx/DashboardPage.tsx para
  // avaliações já reais.
  const prazoPreview = montarCamposPrazo(formData, HOJE_ISO);
  const prazoTextoUnificado = formatPeriodoAvaliacao(prazoPreview);

  // Prazo de resposta exibido no preview do QUESTIONÁRIO (visão do
  // colaborador) — sempre uma DATA-LIMITE (ou "-"/"Sem prazo definido"),
  // nunca a regra por extenso acima (essa é só para o Admin no card de
  // Revisão). Reaproveita calcularPrazoParticipante (utils/avaliacoes.ts),
  // a MESMA função que calcula o prazo individual real do colaborador em
  // RespostaAvaliacaoPage.tsx — nunca reimplementar essa fórmula aqui.
  const nenhumCampoDePrazoPreenchido =
    !formData.dataInicio.trim() && !formData.dataFim.trim() && !formData.prazoDias.trim();
  // dataEntrada do participante hipotético do preview: a própria Data de
  // Início quando preenchida (base REAL — um colaborador presente no
  // lançamento tem dataEntrada = periodoInicio), senão hoje — hipotético,
  // só para existir uma data-base a simular (ver prazoQuestionarioSimulado
  // logo abaixo, que sinaliza esse caso na tela).
  const dataEntradaSimuladaQuestionario = formData.dataInicio.trim() || HOJE_ISO;
  const prazoQuestionarioCalculado = nenhumCampoDePrazoPreenchido
    ? undefined
    : calcularPrazoParticipante(prazoPreview, { dataEntrada: dataEntradaSimuladaQuestionario });
  const prazoQuestionarioLabel = nenhumCampoDePrazoPreenchido
    ? '-'
    : prazoQuestionarioCalculado != null
      ? formatData(prazoQuestionarioCalculado)
      : 'Sem prazo definido';
  // Ícone de simulação: só quando o resultado depende de uma data de
  // ENTRADA hipotética — Prazo em dias preenchido sem Data de Início ainda
  // (a data-limite real só é conhecida quando um colaborador de verdade
  // entrar). Em 'datas_fixas' puro (só Término, sem Dias) o prazo é sempre
  // a própria Data de Término — real e igual para todos, independente de
  // quando cada um entra — por isso não simula nada mesmo sem Início.
  const prazoQuestionarioSimulado =
    !nenhumCampoDePrazoPreenchido && !formData.dataInicio.trim() && Boolean(formData.prazoDias.trim());

  // Aviso não-bloqueante (item 6): quando os 3 campos de prazo estão
  // preenchidos e o Término cai antes de Início + Prazo(dias), o Término
  // sempre tem precedência (ver calcularPrazoParticipante/modoPrazo
  // 'datas_fixas_com_prazo' em schema.ts) — o Prazo em dias nunca chega a
  // valer de fato para nenhum participante, porque mesmo o caso mais
  // favorável (quem entra no primeiro dia) já é cortado pelo Término antes
  // de completar os dias configurados.
  const prazoTerminoCortaAntesDoPrazoDias = useMemo(() => {
    const inicio = formData.dataInicio.trim();
    const fim = formData.dataFim.trim();
    const dias = formData.prazoDias.trim();
    if (!inicio || !fim || !dias || Number(dias) <= 0) return false;
    const dataLimitePorDias = new Date(inicio);
    dataLimitePorDias.setUTCDate(dataLimitePorDias.getUTCDate() + Number(dias));
    return new Date(fim).getTime() < dataLimitePorDias.getTime();
  }, [formData.dataInicio, formData.dataFim, formData.prazoDias]);

  const validarEtapa = (etapa: Etapa['key']): boolean => {
    if (etapa === 'publico' && !formData.caminho) {
      toast.error('Escolha como definir o público desta avaliação');
      return false;
    }
    if (etapa === 'identificacao') {
      if (!formData.nome.trim()) { toast.error('Preencha o nome da avaliação'); return false; }
      if (formData.caminho === 'jornada' && !formData.jornadaId) { toast.error('Selecione uma jornada de carreira'); return false; }
    }
    if (etapa === 'prazo') {
      const inicio = formData.dataInicio.trim();
      const fim = formData.dataFim.trim();
      const dias = formData.prazoDias.trim();
      // Término + Prazo juntos agora é uma combinação válida (ver
      // montarCamposPrazo) — não bloquear mais.
      if (inicio && inicio < HOJE_ISO) {
        toast.error('A Data de Início não pode ser no passado');
        return false;
      }
      if (fim) {
        const referenciaInicio = inicio || HOJE_ISO;
        if (fim < referenciaInicio) {
          toast.error('A Data de Término não pode ser antes da Data de Início');
          return false;
        }
      }
      if (dias && Number(dias) <= 0) {
        toast.error('Informe um prazo em dias válido');
        return false;
      }
    }
    return true;
  };

  const handleContinuar = () => {
    if (!validarEtapa(currentStepKey)) return;
    setCurrentStepKey(etapas[currentIndex + 1].key);
  };

  const handleVoltar = () => setCurrentStepKey(etapas[currentIndex - 1].key);

  const dadosParaSubmissao = (): NovaAvaliacaoFormData => ({
    ...formData,
    participantesIds: participantesAtuais,
    publicoLabelCalculado: formData.caminho === 'jornada' && jornadaSelecionada
      ? `Jornada: ${jornadaSelecionada.nome}`
      : formData.publicoLabelCalculado,
  });

  const handleSalvarRascunho = () => {
    if (!formData.nome.trim()) { toast.error('Preencha o nome da avaliação'); return; }
    onSalvarRascunho(dadosParaSubmissao());
  };

  // Agendamento (Início futuro) publica direto, sem confirmação — só a
  // publicação IMEDIATA (hoje/sem Início) passa pelo ConfirmationModal
  // (confirmarPublicacaoImediata), porque é irreversível na hora.
  const handleAtivar = () => {
    if (semColaboradoresSelecionados) return;
    if (!validarEtapa('identificacao')) return;
    if (!validarEtapa('prazo')) return;
    if (dataInicioFutura) {
      onAtivar(dadosParaSubmissao());
    } else {
      setConfirmPublicarAberto(true);
    }
  };

  const confirmarPublicacaoImediata = () => {
    setConfirmPublicarAberto(false);
    onAtivar(dadosParaSubmissao());
  };

  return (
    <>
    <main className={`mt-16 flex flex-col bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''} h-[calc(100vh-4rem)]`}>
      <div className="flex-1 min-h-0 flex flex-col px-4 md:px-8 pt-4 md:pt-8 pb-4 md:pb-6">
        <button
          onClick={onCancelar}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-6 flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          {breadcrumbLabel}
        </button>

        {/* Container do formulário — grid de 2 colunas (conteúdo + dica), cada
            uma seu próprio card (bg-white rounded-lg border border-gray-200,
            mesmo padrão de card do resto do sistema). Mesma divisão em todas
            as etapas, inclusive na Revisão (coluna direita fica vazia, mas a
            largura da esquerda não muda). Gap-6 entre as colunas — mesmo
            espaçamento já usado entre cards lado a lado em
            EditarJornadaPage.tsx/CriarJornadaPage.tsx. */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6">
          <div className="min-w-0 bg-white rounded-lg border border-gray-200 flex flex-col overflow-hidden">
            {/* Stepper — círculos pequenos (w-5 h-5, 20px) com o número dentro
                e o label ao lado, dentro do card branco, no topo, separado do
                conteúdo por border-b. Conectores flex-1 (não mais largura
                fixa) para ocupar toda a largura disponível responsivamente.
                Concluída = preenchida bg-[var(--brand-600)] com ✓; atual =
                mesmo preenchimento sólido, número em branco; pendente = borda
                cinza, fundo branco, número cinza. Linha entre duas etapas já
                concluídas = cor de marca; senão cinza claro. */}
            <div className="px-4 pt-4 pb-3 border-b border-gray-200 flex-shrink-0 flex items-center">
              {etapas.map((etapa, idx) => (
                <Fragment key={etapa.key}>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 transition-all ${
                      idx < currentIndex
                        ? 'bg-[var(--brand-600)] text-white'
                        : idx === currentIndex
                        ? 'bg-[var(--brand-600)] text-white'
                        : 'bg-white text-gray-400 border border-gray-300'
                    }`}>
                      {idx < currentIndex ? <Check className="w-3 h-3" strokeWidth={3} /> : idx + 1}
                    </div>
                    <span className={`text-xs whitespace-nowrap ${
                      idx === currentIndex ? 'font-semibold text-gray-900' : 'font-normal text-gray-500'
                    }`}>
                      {etapa.label}
                    </span>
                  </div>
                  {idx < etapas.length - 1 && (
                    <div className={`flex-1 h-px mx-3 transition-colors ${
                      idx < currentIndex ? 'bg-[var(--brand-600)]' : 'bg-gray-200'
                    }`} />
                  )}
                </Fragment>
              ))}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-8 pt-6 pb-8 flex flex-col">
              {/* Cabeçalho por etapa — H1 + apoio, específico da etapa ativa. Nunca
                  mexer no título/subtítulo fixos (props titulo/subtitulo), que ficam
                  acima do stepper — este é um segundo nível, abaixo do stepper. Na
                  Revisão, o botão "Visualizar questionário" entra na mesma linha do H1. */}
              {(() => {
                const cabecalho = (() => {
                  if (currentStepKey === 'publico') {
                    return { titulo: 'Como você quer definir o público desta avaliação?', apoio: null as string | null };
                  }
                  if (currentStepKey === 'colaboradores') {
                    return { titulo: 'Quem vai participar desta avaliação?', apoio: 'Escolha por gerência, por colaboradores específicos, ou os dois' };
                  }
                  if (currentStepKey === 'identificacao') {
                    return formData.caminho === 'jornada'
                      ? { titulo: 'Qual jornada de carreira será avaliada?', apoio: 'As habilidades avaliadas virão da matriz dessa jornada' }
                      : { titulo: 'Como esta avaliação vai se chamar?', apoio: 'Dê um nome e, se quiser, uma descrição para o objetivo desta avaliação' };
                  }
                  if (currentStepKey === 'habilidades') {
                    return {
                      titulo: 'Quais habilidades serão avaliadas?',
                      apoio: formData.caminho === 'jornada'
                        ? null
                        : 'Escolha livremente as habilidades que farão parte desta avaliação',
                    };
                  }
                  if (currentStepKey === 'prazo') {
                    return { titulo: 'Qual será o prazo desta avaliação?', apoio: 'Escolha o modelo que melhor se encaixa no seu processo' };
                  }
                  return { titulo: 'Está tudo certo antes de ativar?', apoio: 'Confira os detalhes e visualize o questionário antes de publicar' };
                })();
                return (
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900">{cabecalho.titulo}</h1>
                      {cabecalho.apoio && <p className="text-sm text-gray-600 mt-1">{cabecalho.apoio}</p>}
                    </div>
                    {currentStepKey === 'revisao' && (
                      <button
                        type="button"
                        onClick={() => setPreviewAberto(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--brand-600)] text-[var(--brand-600)] text-sm font-medium rounded-lg hover:bg-[var(--brand-50)] transition-colors flex-shrink-0"
                      >
                        <Eye className="w-4 h-4" />
                        Visualizar questionário
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Etapa — Caminho (só em criação) */}
              {currentStepKey === 'publico' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSelecionarCaminho('jornada')}
                      className={`text-left p-4 rounded-lg border transition-colors ${
                        formData.caminho === 'jornada'
                          ? 'border-[var(--brand-600)] bg-[var(--brand-50)]'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <GitBranch className={`w-5 h-5 mb-2 ${formData.caminho === 'jornada' ? 'text-[var(--brand-600)]' : 'text-gray-400'}`} />
                      <p className="text-sm font-medium text-gray-900">Por Jornada de Carreira</p>
                      <p className="text-xs text-gray-500 mt-1">Habilidades e participantes vêm da matriz da jornada escolhida.</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelecionarCaminho('publico')}
                      className={`text-left p-4 rounded-lg border transition-colors ${
                        formData.caminho === 'publico'
                          ? 'border-[var(--brand-600)] bg-[var(--brand-50)]'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <UsersIcon className={`w-5 h-5 mb-2 ${formData.caminho === 'publico' ? 'text-[var(--brand-600)]' : 'text-gray-400'}`} />
                      <p className="text-sm font-medium text-gray-900">Por Público-alvo</p>
                      <p className="text-xs text-gray-500 mt-1">Escolha gerências, colaboradores e habilidades livremente.</p>
                    </button>
                  </div>
                </div>
              )}

              {/* Etapa — Colaboradores (só Caminho "Por Público-alvo") — só a
                  seleção granular de gerência/colaboradores, sem nome nem
                  descrição (isso agora é etapa própria, "Identificação").
                  Altura flexível — mesmo padrão da Etapa Habilidades logo
                  abaixo: o wrapper cresce via flex-1 até o espaço disponível
                  no card (que por sua vez é limitado pela altura real da
                  tela, via a cadeia h-[calc(100vh-4rem)] no <main>), com um
                  piso de min-h-[280px] para nunca ficar pequeno demais — se
                  a tela for baixa demais até pro piso, quem rola é a área de
                  conteúdo da etapa (overflow-y-auto no container pai), não o
                  componente. As duas colunas internas (gerências à esquerda,
                  colaboradores à direita) mantêm cada uma seu próprio scroll,
                  já implementado dentro de SeletorGerenciaGranular.tsx. */}
              {currentStepKey === 'colaboradores' && (
                <div className="flex-1 min-h-[280px] flex flex-col">
                  <div className="flex items-center justify-between mb-2 flex-shrink-0">
                    <label className="block text-sm font-medium text-gray-700">
                      Público-alvo
                    </label>
                    <span className="text-xs text-gray-500">
                      {colaboradoresSelecionadosSet.size} {colaboradoresSelecionadosSet.size === 1 ? 'colaborador selecionado' : 'colaboradores selecionados'}
                    </span>
                  </div>
                  <SeletorGerenciaGranular
                    className="flex-1 min-h-0"
                    gerencias={GERENCIAS}
                    colaboradores={colaboradoresItems}
                    selecionados={colaboradoresSelecionadosSet}
                    onChangeSelecionados={handleChangeColaboradoresSelecionados}
                    autoInclusao={gerenciasAutoInclusaoSet}
                    onChangeAutoInclusao={handleChangeAutoInclusao}
                  />
                  {duplicidadeDetectada && (
                    <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 mt-3 flex-shrink-0">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-yellow-800">{mensagemDuplicidade}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Etapa — Identificação. Caminho "Por Jornada": seleção da
                  jornada + nome/descrição. Caminho "Por Público-alvo": só
                  nome/descrição — a seleção de colaboradores já aconteceu na
                  etapa anterior ("Colaboradores"). */}
              {currentStepKey === 'identificacao' && (
                <div className="space-y-5">
                  {formData.caminho === 'jornada' && (
                    modoEdicao ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Jornada de Carreira</label>
                        <div className="flex items-center justify-between px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">{jornadaSelecionada?.nome ?? 'Não definida'}</span>
                          <span className="text-xs text-gray-400">Vínculo fixo, não pode ser trocado</span>
                        </div>
                        <p className="mt-1.5 text-xs text-gray-500">
                          {participantesAtuais.length} {participantesAtuais.length === 1 ? 'participante' : 'participantes'} nesta jornada agora
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Carreira <span className="text-red-500">*</span>
                          </label>
                          <SearchableSelect
                            className="w-full"
                            value={carreiraFiltroId}
                            onValueChange={handleSelecionarCarreira}
                            options={carreirasAtivas.map(c => ({ value: c.id, label: c.nome }))}
                            placeholder="Selecione uma carreira"
                            searchPlaceholder="Buscar carreira..."
                            emptyMessage="Nenhuma carreira encontrada"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Jornada de Carreira <span className="text-red-500">*</span>
                          </label>
                          <SearchableSelect
                            className="w-full"
                            value={formData.jornadaId}
                            onValueChange={handleSelecionarJornada}
                            options={jornadasFiltradasPorCarreira.map(j => ({ value: j.id, label: j.nome }))}
                            placeholder={carreiraFiltroId ? 'Selecione uma jornada' : 'Selecione uma carreira primeiro'}
                            searchPlaceholder="Buscar jornada..."
                            emptyMessage="Nenhuma jornada encontrada"
                            disabled={!carreiraFiltroId}
                          />
                        </div>
                        {jornadaSelecionada && (
                          <p className="mt-1.5 text-xs text-gray-500">
                            {formData.habilidades.length} {formData.habilidades.length === 1 ? 'habilidade pré-marcada' : 'habilidades pré-marcadas'} da matriz ·{' '}
                            {formData.participantesIds.length} {formData.participantesIds.length === 1 ? 'participante' : 'participantes'}
                            {formData.participantesIds.length > 0 && (
                              <>
                                {' · '}
                                <button
                                  type="button"
                                  onClick={() => setModalColaboradoresAberto(true)}
                                  className="text-xs font-medium text-[var(--brand-600)] hover:underline"
                                >
                                  Ver colaboradores
                                </button>
                              </>
                            )}
                          </p>
                        )}
                      </div>
                    )
                  )}

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
                    />
                    {/* Só compara duplicidade aqui pelo Caminho "Por Jornada"
                        (jornadaId já é conhecido nesta etapa) — pelo Caminho
                        "Por Público-alvo" a seleção de colaboradores só
                        acontece na etapa "Colaboradores", mais adiante, e é
                        lá que a duplicidade daquele caminho é checada. */}
                    {duplicidadeDetectada && formData.caminho === 'jornada' && (
                      <p className="text-sm text-red-600 mt-1">{mensagemDuplicidade}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição</label>
                    <textarea
                      placeholder="Descreva o objetivo da avaliação"
                      value={formData.descricao}
                      onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Etapa — Habilidades (master-detail). Mesma altura flexível
                  com piso de min-h-[280px] descrita na Etapa Colaboradores
                  acima. */}
              {currentStepKey === 'habilidades' && (
                <div className="flex-1 min-h-[280px] flex flex-col">
                  <div className="flex items-center justify-between mb-2 flex-shrink-0">
                    <label className="block text-sm font-medium text-gray-700">Habilidades</label>
                    <span className="text-xs text-gray-500">
                      {formData.habilidades.length} {formData.habilidades.length === 1 ? 'selecionada' : 'selecionadas'}
                    </span>
                  </div>
                  <HabilidadesMasterDetail
                    className="flex-1 min-h-0"
                    habilidades={habilidadesItems}
                    checked={habilidadesSelecionadasSet}
                    onChange={handleChangeHabilidades}
                    prioridade={habilidadesDaMatriz}
                  />
                </div>
              )}

              {/* Etapa — Prazo — 3 campos livres, todos opcionais e
                  independentes entre si (Término e Prazo podem coexistir —
                  regra de negócio final, ver montarCamposPrazo). O modoPrazo
                  real é sempre inferido dessa combinação. */}
              {currentStepKey === 'prazo' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Data de Início</label>
                      <input
                        type="date"
                        value={formData.dataInicio}
                        onChange={e => setFormData({ ...formData, dataInicio: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Data de Término</label>
                      <input
                        type="date"
                        value={formData.dataFim}
                        onChange={e => setFormData({ ...formData, dataFim: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Prazo de resposta (em dias)</label>
                      <input
                        type="number"
                        min={1}
                        value={formData.prazoDias}
                        onChange={e => setFormData({ ...formData, prazoDias: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
                      />
                    </div>
                  </div>
                  {prazoTerminoCortaAntesDoPrazoDias && (
                    <div className="flex items-start gap-3 bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4">
                      <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">
                        A Data de Término chega antes do Prazo de resposta terminar. Como o Término sempre prevalece, nenhum participante terá os {formData.prazoDias.trim()} {Number(formData.prazoDias.trim()) === 1 ? 'dia completo' : 'dias completos'} de prazo.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Etapa — Revisão */}
              {currentStepKey === 'revisao' && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Nome</p>
                      <p className="text-sm text-gray-900 font-medium">{formData.nome || 'Não preenchido'}</p>
                    </div>
                    {formData.descricao && (
                      <div>
                        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Descrição</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{formData.descricao}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Tipo</p>
                      <p className="text-sm text-gray-900 font-medium">Autoavaliação</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Público-alvo</p>
                      {formData.caminho === 'jornada' && carreiraEJornada ? (
                        <>
                          <p className="text-sm text-gray-700">Carreira: {carreiraEJornada.carreira}</p>
                          <p className="text-sm text-gray-700">Jornada: {carreiraEJornada.jornada}</p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-700">{formData.publicoLabelCalculado || 'Não definido'}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-0.5">
                        {participantesAtuais.length} {participantesAtuais.length === 1 ? 'participante' : 'participantes'}
                        {participantesAtuais.length > 0 && (
                          <>
                            {' · '}
                            <button
                              type="button"
                              onClick={() => setModalColaboradoresAberto(true)}
                              className="text-xs font-medium text-[var(--brand-600)] hover:underline"
                            >
                              Ver colaboradores
                            </button>
                          </>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Habilidades</p>
                      {formData.habilidades.length === 0 ? (
                        <p className="text-sm text-gray-700">Nenhuma selecionada</p>
                      ) : (
                        <>
                          <p className="text-sm text-gray-700 mb-2">
                            {formData.habilidades.length} {formData.habilidades.length === 1 ? 'habilidade selecionada' : 'habilidades selecionadas'}
                          </p>
                          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                            {habilidadesSelecionadasDetalhe.map(h => (
                              <span
                                key={h.id}
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  h.tipo === 'Técnica' ? 'bg-[var(--brand-100)] text-[var(--brand-800)]' : 'bg-purple-100 text-purple-800'
                                }`}
                              >
                                {h.nome}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Prazo</p>
                      <LinhaMeta className="text-sm text-gray-700" partes={getPrazoPartes(prazoPreview)} />
                    </div>
                  </div>

                  {semColaboradoresSelecionados && (
                    <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-yellow-800">
                        Sem colaboradores selecionados, esta avaliação só pode ser salva como rascunho: a publicação fica indisponível até você selecionar ao menos um participante na etapa Colaboradores.
                      </p>
                    </div>
                  )}

                  {duplicidadeDetectada && (
                    <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-yellow-800">{mensagemDuplicidade}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Coluna direita — dica, fundo bg-gray-50. Na prática todas as 5
              etapas retornam um objeto dica não-nulo hoje (Revisão inclusive,
              desde que ganhou dica própria) — o guard `dica &&` abaixo é
              defensivo, não existe etapa "sem dica" atualmente. Cabeçalho:
              emoji 🧭 solto (sem wrapper/container, sem bg) empilhado acima
              do título — mesmo padrão validado na página de teste
              TesteStepperPage.tsx. Lista sem bolinha numerada — o número é
              prefixo de texto no próprio mini-título ("1. Texto"), nunca um
              elemento separado.
              Altura máxima real (não empurra o rodapé, mesmo com a dica mais
              longa do fluxo — Prazo, 5 itens): mesmo padrão de
              overflow-hidden no wrapper + flex-1 min-h-0 overflow-y-auto no
              card já usado na coluna esquerda (card do stepper/conteúdo) e
              em SeletorGerenciaGranular/HabilidadesMasterDetail — o wrapper
              (item do grid, altura já dada pelo stretch da grid) ganha
              overflow-hidden pra nunca deixar o conteúdo do card "vazar" e
              esticar a linha do grid além do espaço real disponível; o card
              em si vira flex-1 min-h-0 (preenche essa altura já contida) com
              overflow-y-auto, então uma dica maior que o espaço rola só
              dentro do card. */}
          <div className="hidden lg:flex lg:flex-col min-h-0 overflow-hidden">
            {dica && (
              <div className="w-full flex-1 min-h-0 bg-gray-50 rounded-lg border border-gray-200 overflow-y-auto p-5">
                <div className="flex flex-col mb-6">
                  <span className="text-[24px]">🧭</span>
                  <p className="text-base font-semibold text-gray-900 mt-3">{dica.titulo}</p>
                </div>
                {dica.texto && <p className="text-sm text-gray-700">{dica.texto}</p>}
                {dica.itens && (
                  <ol className="space-y-4">
                    {dica.itens.map((item, i) => (
                      <li key={i}>
                        <p className="text-sm font-semibold text-gray-900">{i + 1}. {item.titulo}</p>
                        <p className="text-sm text-gray-700 mt-2">{item.texto}</p>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rodapé — fixo, com gap visível acima em relação ao container do formulário */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 md:px-8 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            {currentIndex > 0 ? (
              <button
                type="button"
                onClick={handleVoltar}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancelar}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
            {currentIndex < etapas.length - 1 ? (
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
                disabled={semColaboradoresSelecionados}
                className={`px-4 py-2 text-sm font-medium text-white bg-[var(--brand-600)] rounded-lg transition-colors ${
                  semColaboradoresSelecionados ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[var(--brand-700)]'
                }`}
              >
                {labelBotaoAtivar}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>

    {previewAberto && (
      <QuestionarioPreview
        nome={formData.nome}
        tipo="Autoavaliação"
        habilidadesIds={formData.habilidades}
        prazoLabel={prazoQuestionarioLabel}
        prazoSimulado={prazoQuestionarioSimulado}
        onClose={() => setPreviewAberto(false)}
      />
    )}

    <ColaboradoresListaModal
      isOpen={modalColaboradoresAberto}
      onClose={() => setModalColaboradoresAberto(false)}
      titulo={formData.caminho === 'jornada' ? 'Colaboradores da jornada' : 'Colaboradores selecionados'}
      subtitulo={formData.caminho === 'jornada' ? jornadaSelecionada?.nome : undefined}
      colaboradores={formData.caminho === 'jornada' ? colaboradoresDaJornadaModal : colaboradoresSelecionadosModal}
    />

    <ConfirmationModal
      isOpen={confirmPublicarAberto}
      onClose={() => setConfirmPublicarAberto(false)}
      onConfirm={confirmarPublicacaoImediata}
      variant="warning"
      title={`Publicar "${formData.nome}" agora?`}
      message={
        prazoPreview.modoPrazo === 'indefinido'
          ? 'A avaliação ficará disponível imediatamente para os participantes, sem prazo de término definido. Continua ativa até você encerrá-la manualmente.'
          : prazoPreview.modoPrazo === 'datas_fixas_com_prazo'
          ? `A avaliação ficará disponível imediatamente para os participantes até ${formatData(prazoPreview.periodoFim!)}, mesmo que o prazo individual de algum participante ainda não tenha vencido. ${prazoTextoUnificado}`
          : `A avaliação ficará disponível imediatamente para os participantes. ${prazoTextoUnificado}`
      }
      confirmLabel="Publicar agora"
      cancelLabel="Cancelar"
    />
    </>
  );
}
