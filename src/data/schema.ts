// Fonte única de verdade — definições de tipo de todas as entidades do SGC.
//
// Regra do projeto (.claude/rules/06-integridade-de-dados.md): nenhuma tela ou
// componente pode redefinir inline uma estrutura que já existe aqui. Campo novo
// entra primeiro neste arquivo (com a entrada correspondente em
// docs/DATA_MODEL.md), só depois é usado em qualquer tela.
//
// src/app/data/mockData.ts tipa seus arrays exportados com estas interfaces —
// o build quebra se um dado não corresponder ao formato definido aqui.

// ─── Carreira ─────────────────────────────────────────────────────────────

export type StatusRegistro = 'Ativa' | 'Desativada';

export interface Carreira {
  id: string;
  nome: string;
  /** Denormalizado — sempre ler via cálculo (jornadas.filter), nunca exibir este campo diretamente. */
  jornadas: number;
  status: StatusRegistro;
}

// ─── Jornada ──────────────────────────────────────────────────────────────

export type TipoJornada = 'Contribuidor Individual' | 'Gestão';

export interface Jornada {
  id: string;
  carreiraId: string;
  nome: string;
  /** Denormalizado de Carreira.nome — nunca a fonte, sempre exibir a partir de carreirasData. */
  carreira: string;
  tipo: TipoJornada;
  /**
   * Denormalizado — exceção documentada em 06-integridade-de-dados.md: campo
   * armazenado é aceitável para escrita, mas toda LEITURA na interface deve
   * calcular via cargosData.filter(c => c.jornadaId === jornada.id).length.
   */
  quantidadeCargos: number;
  status: StatusRegistro;
}

// ─── Cargo ────────────────────────────────────────────────────────────────

/**
 * 'Pendente' nunca aparece no mock estático (ver docs/DATA_MODEL.md), mas é
 * produzido de fato por CriarJornadaPage/EditarJornadaPage/CarreirasContext
 * ao criar um cargo sem nenhuma habilidade configurada ainda — precisa estar
 * no tipo mesmo sem exemplo nos dados.
 */
export type StatusCargo = 'Configurado' | 'Pendente';

export interface Cargo {
  id: string;
  jornadaId: string;
  cargoRM: string;
  /** Posição ordinal do cargo dentro da jornada — string numérica, ex: '1', '2'. */
  ordem: string;
  /** Denormalizado — exceção documentada, sincronizado por atualizarHabilidadesCargo no CarreirasContext. */
  habilidadesConfiguradas: number;
  /** Denormalizado — mesma exceção acima. Hoje sempre igual a habilidadesConfiguradas. */
  totalHabilidades: number;
  status: StatusCargo;
}

// ─── HabilidadeCargo (relação cargo ↔ habilidade, usada na Matriz) ────────

/**
 * Nomes válidos de nível de proficiência. Duas escalas coexistem por decisão
 * de produto (RH pode nomear níveis livremente por jornada) — ver Nivel abaixo
 * e docs/DATA_MODEL.md. Nunca comparar por string diretamente entre escalas;
 * usar getPesoFromNome para comparar por peso numérico.
 */
export type NivelNome =
  | 'Básico'
  | 'Intermediário'
  | 'Avançado'
  | 'Especialista'
  | 'Proficiente'
  | 'Iniciante'
  | 'Aprendiz'
  | 'Praticante'
  | 'Experiente'
  | 'Referência';

export interface HabilidadeCargo {
  cargoId: string;
  habilidadeId: string;
  /**
   * 'not_required' nunca aparece no mock estático, mas é um valor de primeira
   * classe alcançável de fato pela UI da Matriz (MatrizCell.tsx) — distinção
   * obrigatória entre "Não configurado" (célula nula, sem linha aqui) e "Não
   * exigido" (esta linha existe com este valor explícito), ver
   * .claude/rules/04-regras-negocio.md.
   */
  nivelEsperado: NivelNome | 'not_required';
  obrigatoria: boolean;
}

// ─── Colaborador ────────────────────────────────────────────────────────────

export type StatusColaborador = 'Ativo';

export interface Colaborador {
  id: string;
  nome: string;
  /** Denormalizado de Cargo.cargoRM — nunca a fonte, sempre exibir a partir de cargosData. */
  cargo: string;
  cargoId: string;
  /** Redundante com cargoId->jornadaId (não derivado automaticamente hoje). */
  jornadaId: string;
  /** Redundante com cargoId->jornadaId->carreiraId (não derivado automaticamente hoje). */
  carreiraId: string;
  /** Texto livre — NÃO é FK para nenhuma entidade. Não confundir com carreira/jornada. */
  gerencia: string;
  /** Texto livre pt-BR, ex: '02 de fevereiro de 2026'. */
  ultimoAcesso: string;
  status: StatusColaborador;
  atualizacaoDisponivel: boolean;
  /** Texto livre, ex: '1 ano e 6 meses'. */
  tempoNoCargo: string;
  /** Texto livre pt-BR ou '' ou undefined — sem formato garantido. */
  ultimaAvaliacao?: string;
}

// ─── Avaliação / Participante / Resposta ──────────────────────────────────

export interface RespostaAvaliacao {
  habilidadeId: string;
  nivelRespondido: NivelNome;
  /** 'YYYY-MM-DD' — quando essa resposta específica foi registrada. Único critério de recência válido (nunca periodoFim da avaliação). */
  dataResposta: string;
}

export type StatusParticipacaoAvaliacao = 'Não iniciada' | 'Em andamento' | 'Concluída' | 'Expirada';

export interface ParticipanteAvaliacao {
  colaboradorId: string;
  status: StatusParticipacaoAvaliacao;
  respostas: RespostaAvaliacao[];
}

export type TipoAvaliacao = 'Autoavaliação';
export type StatusAvaliacao = 'Rascunho' | 'Ativa' | 'Encerrada';

export interface Avaliacao {
  id: string;
  nome: string;
  tipo: TipoAvaliacao;
  status: StatusAvaliacao;
  /** 'YYYY-MM-DD' */
  periodoInicio: string;
  /** 'YYYY-MM-DD' */
  periodoFim: string;
  /** Texto livre descrevendo o público-alvo — NÃO é FK. */
  publicoLabel: string;
  descricao?: string;
  /** FK -> Habilidade.id */
  habilidades?: string[];
  participantes: ParticipanteAvaliacao[];
}

// ─── Histórico de avaliação (registro legado, fora do fluxo de Avaliacao) ──

export type TipoHistoricoAvaliacao = 'Gestor' | 'Autoavaliação';

export interface HistoricoAvaliacao {
  id: string;
  /** FK -> Colaborador.id */
  colaboradorId: string;
  nome: string;
  tipo: TipoHistoricoAvaliacao;
  /** Texto livre pt-BR. */
  data: string;
  status: 'Concluída';
}

// ─── Competência ────────────────────────────────────────────────────────────

export interface Competencia {
  id: string;
  nome: string;
  descricao: string;
  status: StatusRegistro;
}

// ─── Habilidade ─────────────────────────────────────────────────────────────

export type TipoHabilidade = 'Técnica' | 'Comportamental';
export type StatusHabilidade = 'Ativa';

export interface CriterioNivelHabilidade {
  /** FK -> Nivel.id */
  nivelId: string;
  criterio: string;
}

export interface Habilidade {
  id: string;
  nome: string;
  descricao: string;
  /** Denormalizado de Competencia.nome — nunca a fonte, sempre exibir a partir de competenciasData. */
  competencia: string;
  competenciaId: string;
  tipo: TipoHabilidade;
  status: StatusHabilidade;
  /** Sempre exatamente 5 entradas, uma por nível da escala usada por esta habilidade. */
  niveis: CriterioNivelHabilidade[];
}

// ─── Nível de proficiência ──────────────────────────────────────────────────

/**
 * 'Desativado' nunca aparece no mock estático, mas é produzido de fato pela
 * tela Habilidades > Níveis de Habilidades (NiveisProficiencia.tsx) via
 * toggle de status — precisa estar no tipo mesmo sem exemplo nos dados.
 */
export type StatusNivel = 'Ativo' | 'Desativado';

export interface Nivel {
  id: string;
  /**
   * Texto livre, não NivelNome — RH pode criar um nível com nome arbitrário
   * pela tela de Níveis (NiveisProficiencia.tsx). NivelNome (usado em
   * HabilidadeCargo.nivelEsperado etc.) representa os nomes já conhecidos e
   * de fato referenciáveis hoje, não todo nome que pode existir aqui.
   */
  nome: string;
  descricao: string;
  /** 1–5. Comparar níveis SEMPRE por peso, nunca por nome — duas escalas coexistem com nomes diferentes para o mesmo peso. */
  peso: number;
  status: StatusNivel;
  /**
   * Contador de uso — hoje divergente da realidade para a "escala B"
   * (Iniciante…Referência) e para "Proficiente": aparecem como 0 mesmo sendo
   * usados de fato em habilidadesCargoData/avaliacoesData. Ver diagnóstico em
   * docs/DATA_MODEL.md. Não usar para decisões de exibição sem recalcular.
   */
  emUso: number;
  /**
   * Presente apenas em memória (useState de ContentArea/NiveisProficiencia,
   * não persistido) — marca um nível desativado que foi movido para a aba
   * "Arquivados". Nunca aparece no mock estático.
   */
  arquivado?: boolean;
}

// ─── Dados exclusivos de telas de teste (/testes/*) ────────────────────────
//
// Protocolo de promoção (rules/06 + instrução do projeto): antes de promover
// qualquer um destes tipos/dados para rota oficial, comparar contra a fonte
// "oficial" acima e resolver divergências naquele momento — nunca promover
// deixando duas fontes coexistindo silenciosamente.

/** Matriz de habilidades exclusiva das telas de teste de João Silva (colaborador id='10'). */
export interface JoaoHabilidadeCargoMatriz {
  habilidadeId: string;
  nivelEsperado: NivelNome;
}

/** Histórico de cargos exclusivo da tela de teste "Minha Carreira" — conceito não existe hoje para nenhum outro colaborador. */
export interface HistoricoCargoJoao {
  /** null = cargo anterior à jornada cadastrada (ex: estágio), não corresponde a nenhuma linha de Cargo. */
  cargoId: string | null;
  /** Presente somente quando cargoId é null. Quando cargoId existe, o nome deve ser lido de Cargo.cargoRM — nunca duplicado aqui. */
  cargoNome?: string;
  /** 'YYYY-MM' */
  dataInicio: string;
}

export type SenioridadeBenchmark = 'Júnior' | 'Pleno' | 'Sênior';

/** Cargo fictício de benchmark — usado apenas pelas telas de teste, nunca pela Matriz oficial. */
export interface BenchmarkCargo {
  id: string;
  nome: string;
  /** Texto livre de agrupamento — NÃO é FK. */
  area: string;
  /** Texto livre de agrupamento — NÃO é FK. */
  cargoBase: string;
  senioridade: SenioridadeBenchmark;
}

/** Matriz de habilidades dos cargos de benchmark — usada apenas pelas telas de teste. */
export interface HabilidadeCargoBenchmark {
  /** FK -> BenchmarkCargo.id */
  cargoId: string;
  habilidadeId: string;
  nivelEsperado: NivelNome;
}
