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
  /**
   * 'nao_sei' — sentinela para "não sei / não tenho conhecimento", escolhido
   * pelo próprio colaborador ao responder (mesmo princípio de
   * HabilidadeCargo.nivelEsperado | 'not_required'). Conceitualmente
   * diferente de 'not_required' (RH decide que o cargo não exige a
   * habilidade) e de Status 'sem' em minhaCarreiraShared.tsx (colaborador
   * nunca respondeu essa habilidade em nenhuma avaliação) — os 3 permanecem
   * semânticas separadas. 'nao_sei' É uma resposta real: getPesoFromNome
   * retorna 0 para ela, então sempre vira gap ('abaixo') em getStatus, nunca
   * 'sem'.
   */
  nivelRespondido: NivelNome | 'nao_sei';
  /** 'YYYY-MM-DD' — quando essa resposta específica foi registrada. Único critério de recência válido (nunca periodoFim da avaliação). */
  dataResposta: string;
}

export type StatusParticipacaoAvaliacao = 'Não iniciada' | 'Em andamento' | 'Concluída' | 'Expirada';

export interface ParticipanteAvaliacao {
  colaboradorId: string;
  status: StatusParticipacaoAvaliacao;
  respostas: RespostaAvaliacao[];
  /** Se o colaborador já abriu esta avaliação (clicou em "Iniciar avaliação"/"Continuar avaliação") ao menos uma vez. Controla o badge "Nova" — nunca reconstruir esse estado a partir de outro campo. */
  visualizada: boolean;
  /** 'YYYY-MM-DD' — data em que este participante foi materializado na avaliação (ativação, ou entrada tardia por edição de público-alvo). Base do prazo individual no modoPrazo 'prazo_em_dias'; sem efeito em 'indefinido' (sem prazo individual) — ver calcularPrazoParticipante em utils/avaliacoes.ts. */
  dataEntrada: string;
}

export type TipoAvaliacao = 'Autoavaliação';
/**
 * 'Pendente' e 'Expirada' nunca são gravados por ação direta do Admin — são
 * produzidos por calcularStatusEfetivo (utils/avaliacoes.ts) a partir de
 * periodoInicio/periodoFim comparados a HOJE_SIMULADO. O campo Avaliacao.status
 * grava apenas o que é decisão explícita ('Rascunho', 'Ativa' ao ativar,
 * 'Encerrada' ao encerrar manualmente) — mas o union inclui os 5 valores porque
 * telas que exibem status devem sempre usar calcularStatusEfetivo, nunca o
 * campo bruto, e o tipo de retorno dessa função é este mesmo union.
 */
export type StatusAvaliacao = 'Rascunho' | 'Ativa' | 'Encerrada' | 'Pendente' | 'Expirada';

/**
 * Como o prazo de resposta da avaliação é definido — ver
 * calcularStatusEfetivo/calcularPrazoParticipante em utils/avaliacoes.ts.
 * 'indefinido' — sem periodoFim nem prazoDias; a avaliação fica disponível
 * até ser Encerrada manualmente pelo Admin (mesmo comportamento de
 * "nunca expira sozinha" de 'prazo_em_dias', mas sem nenhum prazo por
 * participante — calcularPrazoParticipante retorna undefined nesse modo).
 */
export type ModoPrazoAvaliacao = 'datas_fixas' | 'prazo_em_dias' | 'indefinido';

export interface Avaliacao {
  id: string;
  nome: string;
  tipo: TipoAvaliacao;
  status: StatusAvaliacao;
  modoPrazo: ModoPrazoAvaliacao;
  /** 'YYYY-MM-DD'. Pode ser futura (avaliação nasce 'Pendente' até essa data). Vazia enquanto a avaliação está em 'Rascunho' — só é gravada no momento da ativação (data real de publicação, inclusive no modo 'indefinido', que nunca fica vazio depois de Ativa). */
  periodoInicio: string;
  /** 'YYYY-MM-DD'. Só usado quando modoPrazo === 'datas_fixas' — nesse modo é o prazo de todos os participantes. Ausente quando modoPrazo === 'prazo_em_dias' ou 'indefinido'. */
  periodoFim?: string;
  /** Só usado quando modoPrazo === 'prazo_em_dias' — dias corridos a partir de ParticipanteAvaliacao.dataEntrada para aquele participante vencer. Ausente quando modoPrazo === 'datas_fixas' ou 'indefinido'. */
  prazoDias?: number;
  /** Texto livre descrevendo o público-alvo — NÃO é FK. */
  publicoLabel: string;
  descricao?: string;
  /** FK -> Habilidade.id */
  habilidades?: string[];
  participantes: ParticipanteAvaliacao[];
  /** FK -> Jornada.id. Presente quando a avaliação nasceu do Caminho 1 ("Por Jornada") do wizard — mantém o vínculo para a edição não abrir como público-alvo livre. Ausente quando criada por "Por Público-alvo" ou por rascunho antigo pré-Fase 2. */
  origemJornadaId?: string;
  /**
   * Texto livre (nome de gerência, mesmo valor de Colaborador.gerencia) — só
   * populado no Caminho "Por Público-alvo", quando uma gerência é marcada
   * INTEIRA e o Admin ativa "incluir automaticamente novos colaboradores desta
   * gerência". Registra a INTENÇÃO apenas — nenhum mecanismo no sistema reage
   * a este campo hoje (não há fluxo de criar/editar colaborador para disparar
   * a inclusão); o efeito real depende de integração futura com o RM.
   */
  gerenciasComAutoInclusao?: string[];
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
  /**
   * Subconjunto livre de níveis escolhido pelo RH ao criar a habilidade (não
   * precisa ser 5, não precisa ser de uma escala só). Cada nível escolhido
   * recebe um critério de texto próprio. Ao montar a Matriz de Habilidades
   * por cargo, o RH escolhe o nível esperado dentre os níveis já aplicáveis
   * desta habilidade — nunca um nível novo fora dessa lista.
   */
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

/** Histórico de progressão de cargos de João Silva — conceito não existe hoje para nenhum outro colaborador. */
export interface HistoricoCargoJoao {
  /** null = cargo anterior à jornada cadastrada (ex: estágio), não corresponde a nenhuma linha de Cargo. */
  cargoId: string | null;
  /** Presente somente quando cargoId é null. Quando cargoId existe, o nome deve ser lido de Cargo.cargoRM — nunca duplicado aqui. */
  cargoNome?: string;
  /** 'YYYY-MM' */
  dataInicio: string;
}
