// Dados mockados compartilhados entre todas as páginas
//
// Tipos de cada entidade vêm de src/data/schema.ts — fonte única de verdade
// mecanicamente reforçada (ver .claude/rules/06-integridade-de-dados.md).
// Nunca redeclarar uma interface aqui ou em qualquer tela; campo novo entra
// primeiro em schema.ts.
import type {
  Carreira,
  Jornada,
  Cargo,
  HabilidadeCargo,
  Colaborador,
  RespostaAvaliacao,
  ParticipanteAvaliacao,
  Avaliacao,
  HistoricoAvaliacao,
  Competencia,
  Habilidade,
  Nivel,
  JoaoHabilidadeCargoMatriz,
  HistoricoCargoJoao,
  BenchmarkCargo,
  HabilidadeCargoBenchmark,
} from '../../data/schema';

export type {
  RespostaAvaliacao,
  ParticipanteAvaliacao,
  Avaliacao,
  Competencia,
};

export const carreirasData: Carreira[] = [
  { id: '1', nome: 'Tecnologia da Informação', jornadas: 8, status: 'Ativa' },
  { id: '2', nome: 'Recursos Humanos', jornadas: 5, status: 'Ativa' },
  { id: '3', nome: 'Financeiro', jornadas: 3, status: 'Ativa' },
  { id: '4', nome: 'Marketing', jornadas: 0, status: 'Ativa' },
  { id: '5', nome: 'Vendas', jornadas: 0, status: 'Ativa' },
  { id: '6', nome: 'Operações', jornadas: 3, status: 'Ativa' },
  { id: '7', nome: 'Jurídico', jornadas: 0, status: 'Ativa' },
  { id: '8', nome: 'Atendimento ao Cliente', jornadas: 0, status: 'Ativa' },
  { id: '9', nome: 'Produto', jornadas: 3, status: 'Ativa' },
  { id: '10', nome: 'Design', jornadas: 2, status: 'Ativa' },
  { id: '11', nome: 'Engenharia', jornadas: 1, status: 'Ativa' },
  { id: '12', nome: 'Qualidade', jornadas: 0, status: 'Ativa' },
  { id: '13', nome: 'Projetos', jornadas: 0, status: 'Desativada' },
  { id: '14', nome: 'Inovação', jornadas: 2, status: 'Ativa' },
  { id: '15', nome: 'Suprimentos', jornadas: 0, status: 'Ativa' },
  { id: '16', nome: 'Logística', jornadas: 0, status: 'Desativada' },
  { id: '17', nome: 'Compliance', jornadas: 0, status: 'Ativa' },
  { id: '18', nome: 'Comunicação', jornadas: 0, status: 'Ativa' },
];

export const jornadasData: Jornada[] = [
  { id: 'j1', carreiraId: '1', nome: 'Desenvolvedor', carreira: 'Tecnologia da Informação', tipo: 'Contribuidor Individual', quantidadeCargos: 4, status: 'Ativa' },
  { id: 'j2', carreiraId: '1', nome: 'Analista de Infraestrutura', carreira: 'Tecnologia da Informação', tipo: 'Contribuidor Individual', quantidadeCargos: 2, status: 'Ativa' },
  { id: 'j3', carreiraId: '1', nome: 'Analista de Dados', carreira: 'Tecnologia da Informação', tipo: 'Contribuidor Individual', quantidadeCargos: 3, status: 'Ativa' },
  { id: 'j4', carreiraId: '1', nome: 'Engenheiro de Software', carreira: 'Tecnologia da Informação', tipo: 'Contribuidor Individual', quantidadeCargos: 3, status: 'Ativa' },
  { id: 'j5', carreiraId: '1', nome: 'Gerente de Tecnologia', carreira: 'Tecnologia da Informação', tipo: 'Gestão', quantidadeCargos: 3, status: 'Ativa' },
  { id: 'j6', carreiraId: '1', nome: 'Product Manager', carreira: 'Tecnologia da Informação', tipo: 'Contribuidor Individual', quantidadeCargos: 2, status: 'Ativa' },
  { id: 'j7', carreiraId: '1', nome: 'Arquiteto de Software', carreira: 'Tecnologia da Informação', tipo: 'Contribuidor Individual', quantidadeCargos: 2, status: 'Ativa' },
  { id: 'j8', carreiraId: '1', nome: 'DevOps', carreira: 'Tecnologia da Informação', tipo: 'Contribuidor Individual', quantidadeCargos: 0, status: 'Desativada' },
  { id: 'j9', carreiraId: '2', nome: 'Analista de RH', carreira: 'Recursos Humanos', tipo: 'Contribuidor Individual', quantidadeCargos: 3, status: 'Ativa' },
  { id: 'j10', carreiraId: '2', nome: 'Recrutador', carreira: 'Recursos Humanos', tipo: 'Contribuidor Individual', quantidadeCargos: 2, status: 'Ativa' },
  { id: 'j11', carreiraId: '2', nome: 'Business Partner', carreira: 'Recursos Humanos', tipo: 'Contribuidor Individual', quantidadeCargos: 3, status: 'Ativa' },
  { id: 'j12', carreiraId: '2', nome: 'Gerente de RH', carreira: 'Recursos Humanos', tipo: 'Gestão', quantidadeCargos: 2, status: 'Ativa' },
  { id: 'j13', carreiraId: '2', nome: 'Analista de Remuneração', carreira: 'Recursos Humanos', tipo: 'Contribuidor Individual', quantidadeCargos: 0, status: 'Desativada' },
  // ─── Financeiro ────────────────────────────────────────────────────────────
  { id: 'j14', carreiraId: '3', nome: 'Analista Financeiro',   carreira: 'Financeiro', tipo: 'Contribuidor Individual', quantidadeCargos: 3, status: 'Ativa' },
  { id: 'j15', carreiraId: '3', nome: 'Controller',            carreira: 'Financeiro', tipo: 'Contribuidor Individual', quantidadeCargos: 2, status: 'Ativa' },
  { id: 'j16', carreiraId: '3', nome: 'Gerente Financeiro',    carreira: 'Financeiro', tipo: 'Gestão',                  quantidadeCargos: 1, status: 'Ativa' },
  // ─── Produto ───────────────────────────────────────────────────────────────
  { id: 'j17', carreiraId: '9', nome: 'Product Designer',      carreira: 'Produto',    tipo: 'Contribuidor Individual', quantidadeCargos: 3, status: 'Ativa' },
  { id: 'j18', carreiraId: '9', nome: 'Product Manager',       carreira: 'Produto',    tipo: 'Contribuidor Individual', quantidadeCargos: 3, status: 'Ativa' },
  { id: 'j19', carreiraId: '9', nome: 'Head de Produto',       carreira: 'Produto',    tipo: 'Gestão',                  quantidadeCargos: 1, status: 'Ativa' },
  // ─── Design ────────────────────────────────────────────────────────────────
  { id: 'j20', carreiraId: '10', nome: 'Designer',             carreira: 'Design',     tipo: 'Contribuidor Individual', quantidadeCargos: 3, status: 'Ativa' },
  { id: 'j21', carreiraId: '10', nome: 'Design Lead',          carreira: 'Design',     tipo: 'Gestão',                  quantidadeCargos: 1, status: 'Ativa' },
  // ─── Engenharia ────────────────────────────────────────────────────────────
  { id: 'j22', carreiraId: '11', nome: 'Engenheiro de Software', carreira: 'Engenharia', tipo: 'Contribuidor Individual', quantidadeCargos: 4, status: 'Ativa' },
  // ─── Operações ─────────────────────────────────────────────────────────────
  { id: 'j23', carreiraId: '6', nome: 'Analista de Operações',       carreira: 'Operações', tipo: 'Contribuidor Individual', quantidadeCargos: 3, status: 'Ativa' },
  { id: 'j24', carreiraId: '6', nome: 'Coordenador de Operações',    carreira: 'Operações', tipo: 'Gestão',                  quantidadeCargos: 1, status: 'Ativa' },
  { id: 'j25', carreiraId: '6', nome: 'Gerente de Operações',        carreira: 'Operações', tipo: 'Gestão',                  quantidadeCargos: 1, status: 'Ativa' },
  // ─── Inovação ──────────────────────────────────────────────────────────────
  { id: 'j26', carreiraId: '14', nome: 'Analista de Inovação',       carreira: 'Inovação',  tipo: 'Contribuidor Individual', quantidadeCargos: 3, status: 'Ativa' },
  { id: 'j27', carreiraId: '14', nome: 'Especialista em Inovação',   carreira: 'Inovação',  tipo: 'Contribuidor Individual', quantidadeCargos: 1, status: 'Ativa' },
];

export const cargosData: Cargo[] = [
  { id: 'c1', jornadaId: 'j1', cargoRM: 'Desenvolvedor Junior', ordem: '1', habilidadesConfiguradas: 15, totalHabilidades: 15, status: 'Configurado' },
  { id: 'c2', jornadaId: 'j1', cargoRM: 'Desenvolvedor Pleno', ordem: '2', habilidadesConfiguradas: 15, totalHabilidades: 15, status: 'Configurado' },
  { id: 'c3', jornadaId: 'j1', cargoRM: 'Desenvolvedor Sênior', ordem: '3', habilidadesConfiguradas: 15, totalHabilidades: 15, status: 'Configurado' },
  { id: 'c4', jornadaId: 'j1', cargoRM: 'Tech Lead', ordem: '4', habilidadesConfiguradas: 16, totalHabilidades: 16, status: 'Configurado' },
  { id: 'c5', jornadaId: 'j2', cargoRM: 'Analista de Infraestrutura Junior', ordem: '1', habilidadesConfiguradas: 5, totalHabilidades: 5, status: 'Configurado' },
  { id: 'c6', jornadaId: 'j2', cargoRM: 'Analista de Infraestrutura Pleno', ordem: '2', habilidadesConfiguradas: 6, totalHabilidades: 6, status: 'Configurado' },
  { id: 'c7', jornadaId: 'j9', cargoRM: 'Analista de RH Pleno', ordem: '2', habilidadesConfiguradas: 5, totalHabilidades: 5, status: 'Configurado' },
  // ─── Financeiro — j14 Analista Financeiro ─────────────────────────────────
  { id: 'c8',  jornadaId: 'j14', cargoRM: 'Analista Financeiro Junior',           ordem: '1', habilidadesConfiguradas: 4, totalHabilidades: 4, status: 'Configurado' },
  { id: 'c9',  jornadaId: 'j14', cargoRM: 'Analista Financeiro Pleno',            ordem: '2', habilidadesConfiguradas: 5, totalHabilidades: 5, status: 'Configurado' },
  { id: 'c10', jornadaId: 'j14', cargoRM: 'Analista Financeiro Sênior',           ordem: '3', habilidadesConfiguradas: 6, totalHabilidades: 6, status: 'Configurado' },
  // ─── Financeiro — j15 Controller ──────────────────────────────────────────
  { id: 'c11', jornadaId: 'j15', cargoRM: 'Controller Junior',                    ordem: '1', habilidadesConfiguradas: 5, totalHabilidades: 5, status: 'Configurado' },
  { id: 'c12', jornadaId: 'j15', cargoRM: 'Controller Pleno',                     ordem: '2', habilidadesConfiguradas: 5, totalHabilidades: 5, status: 'Configurado' },
  // ─── Financeiro — j16 Gerente Financeiro ──────────────────────────────────
  { id: 'c13', jornadaId: 'j16', cargoRM: 'Gerente Financeiro',                   ordem: '1', habilidadesConfiguradas: 6, totalHabilidades: 6, status: 'Configurado' },
  // ─── Produto — j17 Product Designer ───────────────────────────────────────
  { id: 'c14', jornadaId: 'j17', cargoRM: 'Product Designer Junior',              ordem: '1', habilidadesConfiguradas: 5, totalHabilidades: 5, status: 'Configurado' },
  { id: 'c15', jornadaId: 'j17', cargoRM: 'Product Designer Pleno',               ordem: '2', habilidadesConfiguradas: 6, totalHabilidades: 6, status: 'Configurado' },
  { id: 'c16', jornadaId: 'j17', cargoRM: 'Product Designer Sênior',              ordem: '3', habilidadesConfiguradas: 7, totalHabilidades: 7, status: 'Configurado' },
  // ─── Produto — j18 Product Manager ────────────────────────────────────────
  { id: 'c17', jornadaId: 'j18', cargoRM: 'Product Manager Junior',               ordem: '1', habilidadesConfiguradas: 5, totalHabilidades: 5, status: 'Configurado' },
  { id: 'c18', jornadaId: 'j18', cargoRM: 'Product Manager Pleno',                ordem: '2', habilidadesConfiguradas: 5, totalHabilidades: 5, status: 'Configurado' },
  { id: 'c19', jornadaId: 'j18', cargoRM: 'Product Manager Sênior',               ordem: '3', habilidadesConfiguradas: 6, totalHabilidades: 6, status: 'Configurado' },
  // ─── Produto — j19 Head de Produto ────────────────────────────────────────
  { id: 'c20', jornadaId: 'j19', cargoRM: 'Head de Produto',                      ordem: '1', habilidadesConfiguradas: 6, totalHabilidades: 6, status: 'Configurado' },
  // ─── Design — j20 Designer ────────────────────────────────────────────────
  { id: 'c21', jornadaId: 'j20', cargoRM: 'Designer Junior',                      ordem: '1', habilidadesConfiguradas: 5, totalHabilidades: 5, status: 'Configurado' },
  { id: 'c22', jornadaId: 'j20', cargoRM: 'Designer Pleno',                       ordem: '2', habilidadesConfiguradas: 6, totalHabilidades: 6, status: 'Configurado' },
  { id: 'c23', jornadaId: 'j20', cargoRM: 'Designer Sênior',                      ordem: '3', habilidadesConfiguradas: 7, totalHabilidades: 7, status: 'Configurado' },
  // ─── Design — j21 Design Lead ─────────────────────────────────────────────
  { id: 'c24', jornadaId: 'j21', cargoRM: 'Design Lead',                          ordem: '1', habilidadesConfiguradas: 6, totalHabilidades: 6, status: 'Configurado' },
  // ─── Engenharia — j22 Engenheiro de Software ──────────────────────────────
  { id: 'c25', jornadaId: 'j22', cargoRM: 'Engenheiro de Software Junior',        ordem: '1', habilidadesConfiguradas: 5, totalHabilidades: 5, status: 'Configurado' },
  { id: 'c26', jornadaId: 'j22', cargoRM: 'Engenheiro de Software Pleno',         ordem: '2', habilidadesConfiguradas: 6, totalHabilidades: 6, status: 'Configurado' },
  { id: 'c27', jornadaId: 'j22', cargoRM: 'Engenheiro de Software Sênior',        ordem: '3', habilidadesConfiguradas: 6, totalHabilidades: 6, status: 'Configurado' },
  { id: 'c28', jornadaId: 'j22', cargoRM: 'Engenheiro de Software Especialista',  ordem: '4', habilidadesConfiguradas: 7, totalHabilidades: 7, status: 'Configurado' },
  // ─── Operações — j23 Analista de Operações ────────────────────────────────
  { id: 'c29', jornadaId: 'j23', cargoRM: 'Analista de Operações Junior',         ordem: '1', habilidadesConfiguradas: 4, totalHabilidades: 4, status: 'Configurado' },
  { id: 'c30', jornadaId: 'j23', cargoRM: 'Analista de Operações Pleno',          ordem: '2', habilidadesConfiguradas: 5, totalHabilidades: 5, status: 'Configurado' },
  { id: 'c31', jornadaId: 'j23', cargoRM: 'Analista de Operações Sênior',         ordem: '3', habilidadesConfiguradas: 5, totalHabilidades: 5, status: 'Configurado' },
  // ─── Operações — j24 Coordenador de Operações ─────────────────────────────
  { id: 'c32', jornadaId: 'j24', cargoRM: 'Coordenador de Operações',             ordem: '1', habilidadesConfiguradas: 5, totalHabilidades: 5, status: 'Configurado' },
  // ─── Operações — j25 Gerente de Operações ─────────────────────────────────
  { id: 'c33', jornadaId: 'j25', cargoRM: 'Gerente de Operações',                 ordem: '1', habilidadesConfiguradas: 6, totalHabilidades: 6, status: 'Configurado' },
  // ─── Inovação — j26 Analista de Inovação ──────────────────────────────────
  { id: 'c34', jornadaId: 'j26', cargoRM: 'Analista de Inovação Junior',          ordem: '1', habilidadesConfiguradas: 4, totalHabilidades: 4, status: 'Configurado' },
  { id: 'c35', jornadaId: 'j26', cargoRM: 'Analista de Inovação Pleno',           ordem: '2', habilidadesConfiguradas: 5, totalHabilidades: 5, status: 'Configurado' },
  { id: 'c36', jornadaId: 'j26', cargoRM: 'Analista de Inovação Sênior',          ordem: '3', habilidadesConfiguradas: 6, totalHabilidades: 6, status: 'Configurado' },
  // ─── Inovação — j27 Especialista em Inovação ──────────────────────────────
  { id: 'c37', jornadaId: 'j27', cargoRM: 'Especialista em Inovação',             ordem: '1', habilidadesConfiguradas: 7, totalHabilidades: 7, status: 'Configurado' },
  // ─── TI — j3 Analista de Dados ────────────────────────────────────────────
  { id: 'c38', jornadaId: 'j3',  cargoRM: 'Analista de Dados Junior',             ordem: '1', habilidadesConfiguradas: 5, totalHabilidades: 5, status: 'Configurado' },
  { id: 'c39', jornadaId: 'j3',  cargoRM: 'Analista de Dados Pleno',              ordem: '2', habilidadesConfiguradas: 6, totalHabilidades: 6, status: 'Configurado' },
  { id: 'c40', jornadaId: 'j3',  cargoRM: 'Analista de Dados Sênior',             ordem: '3', habilidadesConfiguradas: 7, totalHabilidades: 7, status: 'Configurado' },
  // ─── TI — j5 Gerente de Tecnologia ────────────────────────────────────────
  { id: 'c41', jornadaId: 'j5',  cargoRM: 'Coordenador de Tecnologia',            ordem: '1', habilidadesConfiguradas: 6, totalHabilidades: 6, status: 'Configurado' },
  { id: 'c42', jornadaId: 'j5',  cargoRM: 'Gerente de Tecnologia',                ordem: '2', habilidadesConfiguradas: 7, totalHabilidades: 7, status: 'Configurado' },
  { id: 'c43', jornadaId: 'j5',  cargoRM: 'Head de Tecnologia',                   ordem: '3', habilidadesConfiguradas: 7, totalHabilidades: 7, status: 'Configurado' },
  // ─── TI — j7 Arquiteto de Software ────────────────────────────────────────
  { id: 'c44', jornadaId: 'j7',  cargoRM: 'Arquiteto de Software Pleno',          ordem: '1', habilidadesConfiguradas: 6, totalHabilidades: 6, status: 'Configurado' },
  { id: 'c45', jornadaId: 'j7',  cargoRM: 'Arquiteto de Software Sênior',         ordem: '2', habilidadesConfiguradas: 7, totalHabilidades: 7, status: 'Configurado' },
  // ─── RH — j10 Recrutador ──────────────────────────────────────────────────
  { id: 'c46', jornadaId: 'j10', cargoRM: 'Recrutador Junior',                    ordem: '1', habilidadesConfiguradas: 5, totalHabilidades: 5, status: 'Configurado' },
  { id: 'c47', jornadaId: 'j10', cargoRM: 'Recrutador Pleno',                     ordem: '2', habilidadesConfiguradas: 6, totalHabilidades: 6, status: 'Configurado' },
  // ─── RH — j11 Business Partner ────────────────────────────────────────────
  { id: 'c48', jornadaId: 'j11', cargoRM: 'Business Partner Junior',              ordem: '1', habilidadesConfiguradas: 5, totalHabilidades: 5, status: 'Configurado' },
  { id: 'c49', jornadaId: 'j11', cargoRM: 'Business Partner Pleno',               ordem: '2', habilidadesConfiguradas: 6, totalHabilidades: 6, status: 'Configurado' },
  { id: 'c50', jornadaId: 'j11', cargoRM: 'Business Partner Sênior',              ordem: '3', habilidadesConfiguradas: 7, totalHabilidades: 7, status: 'Configurado' },
  // ─── RH — j12 Gerente de RH ───────────────────────────────────────────────
  { id: 'c51', jornadaId: 'j12', cargoRM: 'Coordenador de RH',                    ordem: '1', habilidadesConfiguradas: 5, totalHabilidades: 5, status: 'Configurado' },
  { id: 'c52', jornadaId: 'j12', cargoRM: 'Gerente de RH',                        ordem: '2', habilidadesConfiguradas: 6, totalHabilidades: 6, status: 'Configurado' },
  // ─── TI — j4 Engenheiro de Software ──────────────────────────────────────
  { id: 'c53', jornadaId: 'j4',  cargoRM: 'Engenheiro de Software Junior',        ordem: '1', habilidadesConfiguradas: 6, totalHabilidades: 6, status: 'Configurado' },
  { id: 'c54', jornadaId: 'j4',  cargoRM: 'Engenheiro de Software Pleno',         ordem: '2', habilidadesConfiguradas: 7, totalHabilidades: 7, status: 'Configurado' },
  { id: 'c55', jornadaId: 'j4',  cargoRM: 'Engenheiro de Software Sênior',        ordem: '3', habilidadesConfiguradas: 7, totalHabilidades: 7, status: 'Configurado' },
  // ─── TI — j6 Product Manager ──────────────────────────────────────────────
  { id: 'c56', jornadaId: 'j6',  cargoRM: 'Product Manager Técnico',              ordem: '1', habilidadesConfiguradas: 6, totalHabilidades: 6, status: 'Configurado' },
  { id: 'c57', jornadaId: 'j6',  cargoRM: 'Product Manager Técnico Sênior',       ordem: '2', habilidadesConfiguradas: 7, totalHabilidades: 7, status: 'Configurado' },
  // ─── RH — j9 Analista de RH (cargos Junior e Sênior faltantes) ───────────
  { id: 'c58', jornadaId: 'j9',  cargoRM: 'Analista de RH Junior',                ordem: '1', habilidadesConfiguradas: 5, totalHabilidades: 5, status: 'Configurado' },
  { id: 'c59', jornadaId: 'j9',  cargoRM: 'Analista de RH Sênior',                ordem: '3', habilidadesConfiguradas: 6, totalHabilidades: 6, status: 'Configurado' },
];

export const habilidadesCargoData: HabilidadeCargo[] = [
  { cargoId: 'c1', habilidadeId: '1', nivelEsperado: 'Básico', obrigatoria: true },
  { cargoId: 'c1', habilidadeId: '2', nivelEsperado: 'Básico', obrigatoria: true },
  { cargoId: 'c1', habilidadeId: '18', nivelEsperado: 'Básico', obrigatoria: true },
  { cargoId: 'c1', habilidadeId: '9', nivelEsperado: 'Básico', obrigatoria: true },
  { cargoId: 'c1', habilidadeId: '10', nivelEsperado: 'Básico', obrigatoria: true },
  { cargoId: 'c1', habilidadeId: '11', nivelEsperado: 'Básico', obrigatoria: false },
  { cargoId: 'c1', habilidadeId: '21', nivelEsperado: 'Básico', obrigatoria: true },
  { cargoId: 'c1', habilidadeId: '22', nivelEsperado: 'Básico', obrigatoria: true },
  { cargoId: 'c1', habilidadeId: '50', nivelEsperado: 'Básico', obrigatoria: false },
  { cargoId: 'c1', habilidadeId: '51', nivelEsperado: 'Básico', obrigatoria: false },
  { cargoId: 'c1', habilidadeId: '74', nivelEsperado: 'Básico', obrigatoria: false },
  { cargoId: 'c1', habilidadeId: '59', nivelEsperado: 'Básico', obrigatoria: false },
  { cargoId: 'c1', habilidadeId: '83', nivelEsperado: 'Básico', obrigatoria: false },
  { cargoId: 'c1', habilidadeId: '95', nivelEsperado: 'Básico', obrigatoria: false },
  { cargoId: 'c1', habilidadeId: '91', nivelEsperado: 'Básico', obrigatoria: false },

  { cargoId: 'c2', habilidadeId: '1', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c2', habilidadeId: '2', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c2', habilidadeId: '3', nivelEsperado: 'Intermediário', obrigatoria: false },
  { cargoId: 'c2', habilidadeId: '4', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c2', habilidadeId: '18', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c2', habilidadeId: '9', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c2', habilidadeId: '10', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c2', habilidadeId: '11', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c2', habilidadeId: '12', nivelEsperado: 'Básico', obrigatoria: false },
  { cargoId: 'c2', habilidadeId: '21', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c2', habilidadeId: '22', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c2', habilidadeId: '23', nivelEsperado: 'Básico', obrigatoria: true },
  { cargoId: 'c2', habilidadeId: '14', nivelEsperado: 'Básico', obrigatoria: true },
  { cargoId: 'c2', habilidadeId: '50', nivelEsperado: 'Intermediário', obrigatoria: false },
  { cargoId: 'c2', habilidadeId: '74', nivelEsperado: 'Intermediário', obrigatoria: false },

  { cargoId: 'c3', habilidadeId: '1', nivelEsperado: 'Avançado', obrigatoria: true },
  { cargoId: 'c3', habilidadeId: '2', nivelEsperado: 'Avançado', obrigatoria: true },
  { cargoId: 'c3', habilidadeId: '3', nivelEsperado: 'Avançado', obrigatoria: true },
  { cargoId: 'c3', habilidadeId: '4', nivelEsperado: 'Avançado', obrigatoria: true },
  { cargoId: 'c3', habilidadeId: '18', nivelEsperado: 'Avançado', obrigatoria: true },
  { cargoId: 'c3', habilidadeId: '9', nivelEsperado: 'Avançado', obrigatoria: true },
  { cargoId: 'c3', habilidadeId: '10', nivelEsperado: 'Avançado', obrigatoria: true },
  { cargoId: 'c3', habilidadeId: '11', nivelEsperado: 'Avançado', obrigatoria: true },
  { cargoId: 'c3', habilidadeId: '12', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c3', habilidadeId: '21', nivelEsperado: 'Avançado', obrigatoria: true },
  { cargoId: 'c3', habilidadeId: '22', nivelEsperado: 'Avançado', obrigatoria: true },
  { cargoId: 'c3', habilidadeId: '23', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c3', habilidadeId: '14', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c3', habilidadeId: '50', nivelEsperado: 'Avançado', obrigatoria: false },
  { cargoId: 'c3', habilidadeId: '74', nivelEsperado: 'Avançado', obrigatoria: false },

  // c4 — Tech Lead (Especialista): níveis mais altos da jornada
  { cargoId: 'c4', habilidadeId: '1',   nivelEsperado: 'Especialista', obrigatoria: true },
  { cargoId: 'c4', habilidadeId: '2',   nivelEsperado: 'Especialista', obrigatoria: true },
  { cargoId: 'c4', habilidadeId: '18',  nivelEsperado: 'Especialista', obrigatoria: true },
  { cargoId: 'c4', habilidadeId: '9',   nivelEsperado: 'Especialista', obrigatoria: true },
  { cargoId: 'c4', habilidadeId: '10',  nivelEsperado: 'Especialista', obrigatoria: true },
  { cargoId: 'c4', habilidadeId: '21',  nivelEsperado: 'Especialista', obrigatoria: true },
  { cargoId: 'c4', habilidadeId: '22',  nivelEsperado: 'Especialista', obrigatoria: true },
  { cargoId: 'c4', habilidadeId: '50',  nivelEsperado: 'Avançado',     obrigatoria: false },
  { cargoId: 'c4', habilidadeId: '74',  nivelEsperado: 'Especialista', obrigatoria: true },
  { cargoId: 'c4', habilidadeId: '86',  nivelEsperado: 'Especialista', obrigatoria: true },
  { cargoId: 'c4', habilidadeId: '87',  nivelEsperado: 'Especialista', obrigatoria: true },
  { cargoId: 'c4', habilidadeId: '88',  nivelEsperado: 'Especialista', obrigatoria: true },
  { cargoId: 'c4', habilidadeId: '59',  nivelEsperado: 'Especialista', obrigatoria: true },
  { cargoId: 'c4', habilidadeId: '60',  nivelEsperado: 'Avançado',     obrigatoria: false },
  { cargoId: 'c4', habilidadeId: '83',  nivelEsperado: 'Avançado',     obrigatoria: true },
  { cargoId: 'c4', habilidadeId: '91',  nivelEsperado: 'Avançado',     obrigatoria: false },

  // c8 — Analista Financeiro Junior
  { cargoId: 'c8', habilidadeId: '110', nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c8', habilidadeId: '111', nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c8', habilidadeId: '112', nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c8', habilidadeId: '117', nivelEsperado: 'Básico',        obrigatoria: true },

  // c11 — Controller Junior
  { cargoId: 'c11', habilidadeId: '110', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c11', habilidadeId: '112', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c11', habilidadeId: '113', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c11', habilidadeId: '114', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c11', habilidadeId: '115', nivelEsperado: 'Intermediário', obrigatoria: true },

  // c14 — Product Designer Junior
  { cargoId: 'c14', habilidadeId: '118', nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c14', habilidadeId: '119', nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c14', habilidadeId: '124', nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c14', habilidadeId: '125', nivelEsperado: 'Intermediário', obrigatoria: false },
  { cargoId: 'c14', habilidadeId: '127', nivelEsperado: 'Básico',        obrigatoria: true },

  // c17 — Product Manager Junior
  { cargoId: 'c17', habilidadeId: '118', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c17', habilidadeId: '119', nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c17', habilidadeId: '120', nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c17', habilidadeId: '121', nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c17', habilidadeId: '122', nivelEsperado: 'Básico',        obrigatoria: true },

  // c21 — Designer Junior
  { cargoId: 'c21', habilidadeId: '124', nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c21', habilidadeId: '125', nivelEsperado: 'Intermediário', obrigatoria: false },
  { cargoId: 'c21', habilidadeId: '126', nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c21', habilidadeId: '128', nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c21', habilidadeId: '129', nivelEsperado: 'Básico',        obrigatoria: true },

  // c25 — Engenheiro de Software Junior (nomenclatura alternativa: Iniciante/Aprendiz)
  { cargoId: 'c25', habilidadeId: '131', nivelEsperado: 'Iniciante',     obrigatoria: true },
  { cargoId: 'c25', habilidadeId: '132', nivelEsperado: 'Iniciante',     obrigatoria: true },
  { cargoId: 'c25', habilidadeId: '133', nivelEsperado: 'Aprendiz',      obrigatoria: true },
  { cargoId: 'c25', habilidadeId: '134', nivelEsperado: 'Iniciante',     obrigatoria: true },
  { cargoId: 'c25', habilidadeId: '135', nivelEsperado: 'Iniciante',     obrigatoria: false },

  // c29 — Analista de Operações Junior
  { cargoId: 'c29', habilidadeId: '137', nivelEsperado: 'Iniciante',     obrigatoria: true },
  { cargoId: 'c29', habilidadeId: '138', nivelEsperado: 'Iniciante',     obrigatoria: true },
  { cargoId: 'c29', habilidadeId: '139', nivelEsperado: 'Iniciante',     obrigatoria: true },
  { cargoId: 'c29', habilidadeId: '141', nivelEsperado: 'Iniciante',     obrigatoria: true },

  // c34 — Analista de Inovação Junior
  { cargoId: 'c34', habilidadeId: '142', nivelEsperado: 'Iniciante',     obrigatoria: true },
  { cargoId: 'c34', habilidadeId: '143', nivelEsperado: 'Iniciante',     obrigatoria: true },
  { cargoId: 'c34', habilidadeId: '144', nivelEsperado: 'Iniciante',     obrigatoria: true },
  { cargoId: 'c34', habilidadeId: '146', nivelEsperado: 'Iniciante',     obrigatoria: true },

  // ─── j14 Analista Financeiro — cargos intermediários e topo ───────────────
  // c9 — Analista Financeiro Pleno (5 habilidades)
  { cargoId: 'c9', habilidadeId: '110', nivelEsperado: 'Intermediário',  obrigatoria: true },
  { cargoId: 'c9', habilidadeId: '111', nivelEsperado: 'Intermediário',  obrigatoria: true },
  { cargoId: 'c9', habilidadeId: '112', nivelEsperado: 'Avançado',       obrigatoria: true },
  { cargoId: 'c9', habilidadeId: '113', nivelEsperado: 'Intermediário',  obrigatoria: true },
  { cargoId: 'c9', habilidadeId: '117', nivelEsperado: 'Intermediário',  obrigatoria: true },

  // c10 — Analista Financeiro Sênior (6 habilidades)
  { cargoId: 'c10', habilidadeId: '110', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c10', habilidadeId: '111', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c10', habilidadeId: '112', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c10', habilidadeId: '113', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c10', habilidadeId: '114', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c10', habilidadeId: '117', nivelEsperado: 'Avançado',      obrigatoria: true },

  // ─── j17 Product Designer — cargos intermediários e topo ──────────────────
  // c15 — Product Designer Pleno (6 habilidades)
  { cargoId: 'c15', habilidadeId: '118', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c15', habilidadeId: '119', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c15', habilidadeId: '124', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c15', habilidadeId: '125', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c15', habilidadeId: '126', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c15', habilidadeId: '127', nivelEsperado: 'Intermediário', obrigatoria: true },

  // c16 — Product Designer Sênior (7 habilidades)
  { cargoId: 'c16', habilidadeId: '118', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c16', habilidadeId: '119', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c16', habilidadeId: '120', nivelEsperado: 'Intermediário', obrigatoria: false },
  { cargoId: 'c16', habilidadeId: '124', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c16', habilidadeId: '125', nivelEsperado: 'Especialista',  obrigatoria: true },
  { cargoId: 'c16', habilidadeId: '126', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c16', habilidadeId: '127', nivelEsperado: 'Avançado',      obrigatoria: true },

  // ─── j20 Designer — cargos intermediários e topo ──────────────────────────
  // c22 — Designer Pleno (6 habilidades; h130 usa nomenclatura alternativa)
  { cargoId: 'c22', habilidadeId: '124', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c22', habilidadeId: '125', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c22', habilidadeId: '126', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c22', habilidadeId: '128', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c22', habilidadeId: '129', nivelEsperado: 'Intermediário', obrigatoria: false },
  { cargoId: 'c22', habilidadeId: '130', nivelEsperado: 'Aprendiz',      obrigatoria: false },

  // c23 — Designer Sênior (7 habilidades; h130 usa nomenclatura alternativa)
  { cargoId: 'c23', habilidadeId: '124', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c23', habilidadeId: '125', nivelEsperado: 'Especialista',  obrigatoria: true },
  { cargoId: 'c23', habilidadeId: '126', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c23', habilidadeId: '127', nivelEsperado: 'Intermediário', obrigatoria: false },
  { cargoId: 'c23', habilidadeId: '128', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c23', habilidadeId: '129', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c23', habilidadeId: '130', nivelEsperado: 'Praticante',    obrigatoria: false },

  // ─── j22 Engenharia — nomenclatura alternativa (Iniciante→Referência) ─────
  // c26 — Engenheiro de Software Pleno (6 habilidades)
  { cargoId: 'c26', habilidadeId: '131', nivelEsperado: 'Aprendiz',      obrigatoria: true },
  { cargoId: 'c26', habilidadeId: '132', nivelEsperado: 'Aprendiz',      obrigatoria: true },
  { cargoId: 'c26', habilidadeId: '133', nivelEsperado: 'Praticante',    obrigatoria: true },
  { cargoId: 'c26', habilidadeId: '134', nivelEsperado: 'Aprendiz',      obrigatoria: true },
  { cargoId: 'c26', habilidadeId: '135', nivelEsperado: 'Aprendiz',      obrigatoria: true },
  { cargoId: 'c26', habilidadeId: '136', nivelEsperado: 'Aprendiz',      obrigatoria: true },

  // c27 — Engenheiro de Software Sênior (6 habilidades)
  { cargoId: 'c27', habilidadeId: '131', nivelEsperado: 'Praticante',    obrigatoria: true },
  { cargoId: 'c27', habilidadeId: '132', nivelEsperado: 'Praticante',    obrigatoria: true },
  { cargoId: 'c27', habilidadeId: '133', nivelEsperado: 'Experiente',    obrigatoria: true },
  { cargoId: 'c27', habilidadeId: '134', nivelEsperado: 'Praticante',    obrigatoria: true },
  { cargoId: 'c27', habilidadeId: '135', nivelEsperado: 'Praticante',    obrigatoria: true },
  { cargoId: 'c27', habilidadeId: '136', nivelEsperado: 'Praticante',    obrigatoria: true },

  // c28 — Engenheiro de Software Especialista (7 habilidades)
  // Nota: "Liderança Técnica" não existe como habilidade isolada — h88 (Tomada de Decisão,
  // competência Liderança Técnica) é a mais próxima e usa nivelId '4' = 'Especialista'.
  { cargoId: 'c28', habilidadeId: '131', nivelEsperado: 'Experiente',    obrigatoria: true },
  { cargoId: 'c28', habilidadeId: '132', nivelEsperado: 'Experiente',    obrigatoria: true },
  { cargoId: 'c28', habilidadeId: '133', nivelEsperado: 'Referência',    obrigatoria: true },
  { cargoId: 'c28', habilidadeId: '134', nivelEsperado: 'Referência',    obrigatoria: true },
  { cargoId: 'c28', habilidadeId: '135', nivelEsperado: 'Experiente',    obrigatoria: true },
  { cargoId: 'c28', habilidadeId: '136', nivelEsperado: 'Experiente',    obrigatoria: true },
  { cargoId: 'c28', habilidadeId: '88',  nivelEsperado: 'Especialista',  obrigatoria: true },

  // ─── j23 Analista de Operações — cargos intermediários e topo ─────────────
  // c30 — Analista de Operações Pleno (5 habilidades)
  { cargoId: 'c30', habilidadeId: '137', nivelEsperado: 'Aprendiz',      obrigatoria: true },
  { cargoId: 'c30', habilidadeId: '138', nivelEsperado: 'Aprendiz',      obrigatoria: true },
  { cargoId: 'c30', habilidadeId: '139', nivelEsperado: 'Experiente',    obrigatoria: true },
  { cargoId: 'c30', habilidadeId: '140', nivelEsperado: 'Aprendiz',      obrigatoria: true },
  { cargoId: 'c30', habilidadeId: '141', nivelEsperado: 'Aprendiz',      obrigatoria: true },

  // c31 — Analista de Operações Sênior (5 habilidades)
  { cargoId: 'c31', habilidadeId: '137', nivelEsperado: 'Experiente',    obrigatoria: true },
  { cargoId: 'c31', habilidadeId: '138', nivelEsperado: 'Experiente',    obrigatoria: true },
  { cargoId: 'c31', habilidadeId: '139', nivelEsperado: 'Experiente',    obrigatoria: true },
  { cargoId: 'c31', habilidadeId: '140', nivelEsperado: 'Experiente',    obrigatoria: true },
  { cargoId: 'c31', habilidadeId: '141', nivelEsperado: 'Experiente',    obrigatoria: true },

  // ─── j2 Analista de Infraestrutura ────────────────────────────────────────
  // c5 — Analista de Infraestrutura Junior (5 habilidades)
  { cargoId: 'c5',  habilidadeId: '80',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c5',  habilidadeId: '53',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c5',  habilidadeId: '56',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c5',  habilidadeId: '9',   nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c5',  habilidadeId: '10',  nivelEsperado: 'Básico',        obrigatoria: true },
  // c6 — Analista de Infraestrutura Pleno (6 habilidades)
  { cargoId: 'c6',  habilidadeId: '80',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c6',  habilidadeId: '81',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c6',  habilidadeId: '53',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c6',  habilidadeId: '56',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c6',  habilidadeId: '55',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c6',  habilidadeId: '9',   nivelEsperado: 'Intermediário', obrigatoria: false },

  // ─── j9 Analista de RH ────────────────────────────────────────────────────
  // c7 — Analista de RH Pleno (5 hab.) — RH sem competência específica; aproximação por Comunicação/Empatia/Liderança
  { cargoId: 'c7',  habilidadeId: '9',   nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c7',  habilidadeId: '10',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c7',  habilidadeId: '22',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c7',  habilidadeId: '14',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c7',  habilidadeId: '91',  nivelEsperado: 'Básico',        obrigatoria: true },

  // ─── j15 Controller — cargo intermediário ─────────────────────────────────
  // c12 — Controller Pleno (5 habilidades)
  { cargoId: 'c12', habilidadeId: '110', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c12', habilidadeId: '112', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c12', habilidadeId: '113', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c12', habilidadeId: '114', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c12', habilidadeId: '115', nivelEsperado: 'Intermediário', obrigatoria: true },

  // ─── j16 Gerente Financeiro ────────────────────────────────────────────────
  // c13 — Gerente Financeiro (6 habilidades)
  { cargoId: 'c13', habilidadeId: '110', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c13', habilidadeId: '111', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c13', habilidadeId: '112', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c13', habilidadeId: '113', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c13', habilidadeId: '89',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c13', habilidadeId: '88',  nivelEsperado: 'Intermediário', obrigatoria: true },

  // ─── j18 Product Manager — Pleno e Sênior ─────────────────────────────────
  // c18 — Product Manager Pleno (5 habilidades)
  { cargoId: 'c18', habilidadeId: '118', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c18', habilidadeId: '119', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c18', habilidadeId: '120', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c18', habilidadeId: '121', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c18', habilidadeId: '122', nivelEsperado: 'Avançado',      obrigatoria: true },
  // c19 — Product Manager Sênior (6 habilidades)
  { cargoId: 'c19', habilidadeId: '118', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c19', habilidadeId: '119', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c19', habilidadeId: '120', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c19', habilidadeId: '121', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c19', habilidadeId: '122', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c19', habilidadeId: '104', nivelEsperado: 'Avançado',      obrigatoria: true },

  // ─── j19 Head de Produto ──────────────────────────────────────────────────
  // c20 — Head de Produto (6 habilidades)
  { cargoId: 'c20', habilidadeId: '118', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c20', habilidadeId: '119', nivelEsperado: 'Especialista',  obrigatoria: true },
  { cargoId: 'c20', habilidadeId: '120', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c20', habilidadeId: '104', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c20', habilidadeId: '89',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c20', habilidadeId: '88',  nivelEsperado: 'Avançado',      obrigatoria: true },

  // ─── j21 Design Lead ──────────────────────────────────────────────────────
  // c24 — Design Lead (6 habilidades)
  { cargoId: 'c24', habilidadeId: '124', nivelEsperado: 'Especialista',  obrigatoria: true },
  { cargoId: 'c24', habilidadeId: '125', nivelEsperado: 'Especialista',  obrigatoria: true },
  { cargoId: 'c24', habilidadeId: '126', nivelEsperado: 'Especialista',  obrigatoria: true },
  { cargoId: 'c24', habilidadeId: '128', nivelEsperado: 'Especialista',  obrigatoria: true },
  { cargoId: 'c24', habilidadeId: '86',  nivelEsperado: 'Básico',        obrigatoria: false },
  { cargoId: 'c24', habilidadeId: '87',  nivelEsperado: 'Básico',        obrigatoria: false },

  // ─── j24 Coordenador de Operações ─────────────────────────────────────────
  // c32 — Coordenador de Operações (5 habilidades)
  { cargoId: 'c32', habilidadeId: '137', nivelEsperado: 'Experiente',    obrigatoria: true },
  { cargoId: 'c32', habilidadeId: '138', nivelEsperado: 'Experiente',    obrigatoria: true },
  { cargoId: 'c32', habilidadeId: '139', nivelEsperado: 'Experiente',    obrigatoria: true },
  { cargoId: 'c32', habilidadeId: '140', nivelEsperado: 'Aprendiz',      obrigatoria: true },
  { cargoId: 'c32', habilidadeId: '141', nivelEsperado: 'Experiente',    obrigatoria: true },

  // ─── j25 Gerente de Operações ─────────────────────────────────────────────
  // c33 — Gerente de Operações (6 habilidades)
  { cargoId: 'c33', habilidadeId: '137', nivelEsperado: 'Referência',    obrigatoria: true },
  { cargoId: 'c33', habilidadeId: '138', nivelEsperado: 'Referência',    obrigatoria: true },
  { cargoId: 'c33', habilidadeId: '139', nivelEsperado: 'Referência',    obrigatoria: true },
  { cargoId: 'c33', habilidadeId: '140', nivelEsperado: 'Experiente',    obrigatoria: true },
  { cargoId: 'c33', habilidadeId: '141', nivelEsperado: 'Referência',    obrigatoria: true },
  { cargoId: 'c33', habilidadeId: '88',  nivelEsperado: 'Avançado',      obrigatoria: true },

  // ─── j26 Analista de Inovação — Pleno e Sênior ───────────────────────────
  // c35 — Analista de Inovação Pleno (5 habilidades)
  { cargoId: 'c35', habilidadeId: '142', nivelEsperado: 'Aprendiz',      obrigatoria: true },
  { cargoId: 'c35', habilidadeId: '143', nivelEsperado: 'Aprendiz',      obrigatoria: true },
  { cargoId: 'c35', habilidadeId: '144', nivelEsperado: 'Aprendiz',      obrigatoria: true },
  { cargoId: 'c35', habilidadeId: '146', nivelEsperado: 'Iniciante',     obrigatoria: false },
  { cargoId: 'c35', habilidadeId: '23',  nivelEsperado: 'Intermediário', obrigatoria: true },
  // c36 — Analista de Inovação Sênior (6 habilidades)
  { cargoId: 'c36', habilidadeId: '142', nivelEsperado: 'Experiente',    obrigatoria: true },
  { cargoId: 'c36', habilidadeId: '143', nivelEsperado: 'Experiente',    obrigatoria: true },
  { cargoId: 'c36', habilidadeId: '144', nivelEsperado: 'Experiente',    obrigatoria: true },
  { cargoId: 'c36', habilidadeId: '145', nivelEsperado: 'Aprendiz',      obrigatoria: true },
  { cargoId: 'c36', habilidadeId: '146', nivelEsperado: 'Aprendiz',      obrigatoria: false },
  { cargoId: 'c36', habilidadeId: '23',  nivelEsperado: 'Avançado',      obrigatoria: true },

  // ─── j27 Especialista em Inovação ─────────────────────────────────────────
  // c37 — Especialista em Inovação (7 habilidades)
  { cargoId: 'c37', habilidadeId: '142', nivelEsperado: 'Referência',    obrigatoria: true },
  { cargoId: 'c37', habilidadeId: '143', nivelEsperado: 'Referência',    obrigatoria: true },
  { cargoId: 'c37', habilidadeId: '144', nivelEsperado: 'Referência',    obrigatoria: true },
  { cargoId: 'c37', habilidadeId: '145', nivelEsperado: 'Experiente',    obrigatoria: true },
  { cargoId: 'c37', habilidadeId: '146', nivelEsperado: 'Experiente',    obrigatoria: false },
  { cargoId: 'c37', habilidadeId: '104', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c37', habilidadeId: '106', nivelEsperado: 'Avançado',      obrigatoria: true },

  // ─── TI — j3 Analista de Dados ───────────────────────────────────────────
  // c38 — Analista de Dados Junior (5 habilidades)
  { cargoId: 'c38', habilidadeId: '65',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c38', habilidadeId: '66',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c38', habilidadeId: '67',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c38', habilidadeId: '9',   nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c38', habilidadeId: '10',  nivelEsperado: 'Básico',        obrigatoria: true },
  // c39 — Analista de Dados Pleno (6 habilidades)
  { cargoId: 'c39', habilidadeId: '65',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c39', habilidadeId: '66',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c39', habilidadeId: '67',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c39', habilidadeId: '64',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c39', habilidadeId: '9',   nivelEsperado: 'Intermediário', obrigatoria: false },
  { cargoId: 'c39', habilidadeId: '23',  nivelEsperado: 'Básico',        obrigatoria: false },
  // c40 — Analista de Dados Sênior (7 habilidades)
  { cargoId: 'c40', habilidadeId: '65',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c40', habilidadeId: '66',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c40', habilidadeId: '67',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c40', habilidadeId: '64',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c40', habilidadeId: '123', nivelEsperado: 'Intermediário', obrigatoria: false },
  { cargoId: 'c40', habilidadeId: '23',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c40', habilidadeId: '83',  nivelEsperado: 'Básico',        obrigatoria: false },

  // ─── TI — j5 Gerente de Tecnologia ──────────────────────────────────────
  // c41 — Coordenador de Tecnologia (6 habilidades)
  { cargoId: 'c41', habilidadeId: '86',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c41', habilidadeId: '87',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c41', habilidadeId: '83',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c41', habilidadeId: '88',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c41', habilidadeId: '9',   nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c41', habilidadeId: '89',  nivelEsperado: 'Básico',        obrigatoria: false },
  // c42 — Gerente de Tecnologia (7 habilidades)
  { cargoId: 'c42', habilidadeId: '86',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c42', habilidadeId: '87',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c42', habilidadeId: '83',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c42', habilidadeId: '88',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c42', habilidadeId: '89',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c42', habilidadeId: '90',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c42', habilidadeId: '104', nivelEsperado: 'Intermediário', obrigatoria: false },
  // c43 — Head de Tecnologia (7 habilidades)
  { cargoId: 'c43', habilidadeId: '86',  nivelEsperado: 'Especialista',  obrigatoria: true },
  { cargoId: 'c43', habilidadeId: '87',  nivelEsperado: 'Especialista',  obrigatoria: true },
  { cargoId: 'c43', habilidadeId: '88',  nivelEsperado: 'Especialista',  obrigatoria: true },
  { cargoId: 'c43', habilidadeId: '89',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c43', habilidadeId: '90',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c43', habilidadeId: '104', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c43', habilidadeId: '107', nivelEsperado: 'Avançado',      obrigatoria: true },

  // ─── TI — j7 Arquiteto de Software ──────────────────────────────────────
  // c44 — Arquiteto de Software Pleno (6 habilidades)
  { cargoId: 'c44', habilidadeId: '59',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c44', habilidadeId: '60',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c44', habilidadeId: '61',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c44', habilidadeId: '56',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c44', habilidadeId: '54',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c44', habilidadeId: '9',   nivelEsperado: 'Avançado',      obrigatoria: false },
  // c45 — Arquiteto de Software Sênior (7 habilidades)
  { cargoId: 'c45', habilidadeId: '59',  nivelEsperado: 'Especialista',  obrigatoria: true },
  { cargoId: 'c45', habilidadeId: '60',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c45', habilidadeId: '61',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c45', habilidadeId: '56',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c45', habilidadeId: '58',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c45', habilidadeId: '83',  nivelEsperado: 'Avançado',      obrigatoria: false },
  { cargoId: 'c45', habilidadeId: '88',  nivelEsperado: 'Avançado',      obrigatoria: true },

  // ─── RH — j10 Recrutador ─────────────────────────────────────────────────
  // c46 — Recrutador Junior (5 habilidades)
  { cargoId: 'c46', habilidadeId: '9',   nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c46', habilidadeId: '10',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c46', habilidadeId: '22',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c46', habilidadeId: '21',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c46', habilidadeId: '91',  nivelEsperado: 'Básico',        obrigatoria: true },
  // c47 — Recrutador Pleno (6 habilidades)
  { cargoId: 'c47', habilidadeId: '9',   nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c47', habilidadeId: '10',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c47', habilidadeId: '22',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c47', habilidadeId: '91',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c47', habilidadeId: '90',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c47', habilidadeId: '23',  nivelEsperado: 'Básico',        obrigatoria: false },

  // ─── RH — j11 Business Partner ───────────────────────────────────────────
  // c48 — Business Partner Junior (5 habilidades)
  { cargoId: 'c48', habilidadeId: '9',   nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c48', habilidadeId: '14',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c48', habilidadeId: '22',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c48', habilidadeId: '91',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c48', habilidadeId: '23',  nivelEsperado: 'Básico',        obrigatoria: false },
  // c49 — Business Partner Pleno (6 habilidades)
  { cargoId: 'c49', habilidadeId: '9',   nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c49', habilidadeId: '14',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c49', habilidadeId: '22',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c49', habilidadeId: '91',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c49', habilidadeId: '90',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c49', habilidadeId: '83',  nivelEsperado: 'Básico',        obrigatoria: false },
  // c50 — Business Partner Sênior (7 habilidades)
  { cargoId: 'c50', habilidadeId: '9',   nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c50', habilidadeId: '14',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c50', habilidadeId: '22',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c50', habilidadeId: '91',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c50', habilidadeId: '90',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c50', habilidadeId: '86',  nivelEsperado: 'Intermediário', obrigatoria: false },
  { cargoId: 'c50', habilidadeId: '104', nivelEsperado: 'Intermediário', obrigatoria: false },

  // ─── RH — j12 Gerente de RH ──────────────────────────────────────────────
  // c51 — Coordenador de RH (5 habilidades)
  { cargoId: 'c51', habilidadeId: '86',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c51', habilidadeId: '87',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c51', habilidadeId: '88',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c51', habilidadeId: '9',   nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c51', habilidadeId: '14',  nivelEsperado: 'Avançado',      obrigatoria: true },
  // c52 — Gerente de RH (6 habilidades)
  { cargoId: 'c52', habilidadeId: '86',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c52', habilidadeId: '87',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c52', habilidadeId: '88',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c52', habilidadeId: '9',   nivelEsperado: 'Especialista',  obrigatoria: true },
  { cargoId: 'c52', habilidadeId: '14',  nivelEsperado: 'Especialista',  obrigatoria: true },
  { cargoId: 'c52', habilidadeId: '104', nivelEsperado: 'Avançado',      obrigatoria: false },

  // ─── TI — j4 Engenheiro de Software ─────────────────────────────────────
  // c53 — Engenheiro de Software Junior (6 habilidades)
  { cargoId: 'c53', habilidadeId: '1',   nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c53', habilidadeId: '3',   nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c53', habilidadeId: '18',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c53', habilidadeId: '4',   nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c53', habilidadeId: '59',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c53', habilidadeId: '9',   nivelEsperado: 'Básico',        obrigatoria: false },
  // c54 — Engenheiro de Software Pleno (7 habilidades)
  { cargoId: 'c54', habilidadeId: '1',   nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c54', habilidadeId: '3',   nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c54', habilidadeId: '18',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c54', habilidadeId: '4',   nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c54', habilidadeId: '59',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c54', habilidadeId: '74',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c54', habilidadeId: '9',   nivelEsperado: 'Intermediário', obrigatoria: false },
  // c55 — Engenheiro de Software Sênior (7 habilidades)
  { cargoId: 'c55', habilidadeId: '3',   nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c55', habilidadeId: '18',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c55', habilidadeId: '4',   nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c55', habilidadeId: '59',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c55', habilidadeId: '60',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c55', habilidadeId: '74',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c55', habilidadeId: '83',  nivelEsperado: 'Básico',        obrigatoria: false },

  // ─── RH — j9 Analista de RH ──────────────────────────────────────────────
  // c58 — Analista de RH Junior (5 hab.) — mesmas habilidades de c7 em nível Básico
  { cargoId: 'c58', habilidadeId: '9',   nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c58', habilidadeId: '10',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c58', habilidadeId: '22',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c58', habilidadeId: '14',  nivelEsperado: 'Básico',        obrigatoria: true },
  { cargoId: 'c58', habilidadeId: '91',  nivelEsperado: 'Básico',        obrigatoria: true },
  // c59 — Analista de RH Sênior (6 hab.) — c7 elevado + h90 novo
  { cargoId: 'c59', habilidadeId: '9',   nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c59', habilidadeId: '10',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c59', habilidadeId: '22',  nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c59', habilidadeId: '14',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c59', habilidadeId: '91',  nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c59', habilidadeId: '90',  nivelEsperado: 'Básico',        obrigatoria: false },

  // ─── TI — j6 Product Manager ─────────────────────────────────────────────
  // c56 — Product Manager Técnico (6 habilidades)
  { cargoId: 'c56', habilidadeId: '118', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c56', habilidadeId: '119', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c56', habilidadeId: '121', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c56', habilidadeId: '122', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c56', habilidadeId: '9',   nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c56', habilidadeId: '11',  nivelEsperado: 'Avançado',      obrigatoria: true },
  // c57 — Product Manager Técnico Sênior (7 habilidades)
  { cargoId: 'c57', habilidadeId: '118', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c57', habilidadeId: '119', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c57', habilidadeId: '120', nivelEsperado: 'Intermediário', obrigatoria: true },
  { cargoId: 'c57', habilidadeId: '121', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c57', habilidadeId: '122', nivelEsperado: 'Avançado',      obrigatoria: true },
  { cargoId: 'c57', habilidadeId: '104', nivelEsperado: 'Intermediário', obrigatoria: false },
  { cargoId: 'c57', habilidadeId: '88',  nivelEsperado: 'Avançado',      obrigatoria: true },
];

export const colaboradoresData: Colaborador[] = [
  {
    id: '1',
    nome: 'Ana Silva',
    cargo: 'Desenvolvedor Pleno',
    cargoId: 'c2',
    jornadaId: 'j1',
    carreiraId: '1',
    gerencia: 'Tecnologia',
    ultimoAcesso: '02 de fevereiro de 2026',
    status: 'Ativo' as const,
    atualizacaoDisponivel: true,
    tempoNoCargo: '1 ano e 6 meses',
    ultimaAvaliacao: '15 de janeiro de 2026',
  },
  {
    id: '2',
    nome: 'Carlos Santos',
    cargo: 'Analista de RH',
    cargoId: 'c7',
    jornadaId: 'j9',
    carreiraId: '2',
    gerencia: 'Recursos Humanos',
    ultimoAcesso: '01 de fevereiro de 2026',
    status: 'Ativo' as const,
    atualizacaoDisponivel: false,
    tempoNoCargo: '2 anos',
    ultimaAvaliacao: '10 de janeiro de 2026',
  },
  {
    id: '10',
    nome: 'João Silva',
    cargo: 'Desenvolvedor Pleno',
    cargoId: 'c2',
    jornadaId: 'j1',
    carreiraId: '1',
    gerencia: 'Tecnologia',
    ultimoAcesso: '10 de junho de 2026',
    status: 'Ativo' as const,
    atualizacaoDisponivel: true,
    tempoNoCargo: '1 ano',
    ultimaAvaliacao: '10 de março de 2026',
  },
  {
    id: '3',
    nome: 'Mariana Costa',
    cargo: 'Desenvolvedor Junior',
    cargoId: 'c1',
    jornadaId: 'j1',
    carreiraId: '1',
    gerencia: 'Tecnologia',
    ultimoAcesso: '13 de junho de 2026',
    status: 'Ativo' as const,
    atualizacaoDisponivel: false,
    tempoNoCargo: '6 meses',
    ultimaAvaliacao: '20 de março de 2026',
  },
  {
    id: '4',
    nome: 'Rafael Mendes',
    cargo: 'Desenvolvedor Junior',
    cargoId: 'c1',
    jornadaId: 'j1',
    carreiraId: '1',
    gerencia: 'Tecnologia',
    ultimoAcesso: '12 de junho de 2026',
    status: 'Ativo' as const,
    atualizacaoDisponivel: true,
    tempoNoCargo: '8 meses',
    ultimaAvaliacao: '15 de fevereiro de 2026',
  },
  {
    id: '5',
    nome: 'Beatriz Lima',
    cargo: 'Desenvolvedor Junior',
    cargoId: 'c1',
    jornadaId: 'j1',
    carreiraId: '1',
    gerencia: 'Desenvolvimento',
    ultimoAcesso: '11 de junho de 2026',
    status: 'Ativo' as const,
    atualizacaoDisponivel: false,
    tempoNoCargo: '3 meses',
    ultimaAvaliacao: '10 de abril de 2026',
  },
  {
    id: '6',
    nome: 'Lucas Ferreira',
    cargo: 'Analista de Infraestrutura Junior',
    cargoId: 'c5',
    jornadaId: 'j2',
    carreiraId: '1',
    gerencia: 'Infraestrutura',
    ultimoAcesso: '10 de junho de 2026',
    status: 'Ativo' as const,
    atualizacaoDisponivel: false,
    tempoNoCargo: '1 ano',
    ultimaAvaliacao: '05 de janeiro de 2026',
  },
  {
    id: '7',
    nome: 'Camila Souza',
    cargo: 'Analista de Infraestrutura Junior',
    cargoId: 'c5',
    jornadaId: 'j2',
    carreiraId: '1',
    gerencia: 'Infraestrutura',
    ultimoAcesso: '09 de junho de 2026',
    status: 'Ativo' as const,
    atualizacaoDisponivel: true,
    tempoNoCargo: '10 meses',
    ultimaAvaliacao: '20 de fevereiro de 2026',
  },
  {
    id: '8',
    nome: 'Thiago Rodrigues',
    cargo: 'Desenvolvedor Sênior',
    cargoId: 'c3',
    jornadaId: 'j1',
    carreiraId: '1',
    gerencia: 'Tecnologia',
    ultimoAcesso: '14 de junho de 2026',
    status: 'Ativo' as const,
    atualizacaoDisponivel: false,
    tempoNoCargo: '2 meses',
    ultimaAvaliacao: '',
  },
  {
    id: '9',
    nome: 'Maurício Prado',
    cargo: 'Analista de Infraestrutura Pleno',
    cargoId: 'c6',
    jornadaId: 'j2',
    carreiraId: '1',
    gerencia: 'Infraestrutura',
    ultimoAcesso: '15 de junho de 2026',
    status: 'Ativo' as const,
    atualizacaoDisponivel: true,
    tempoNoCargo: '1 ano e 4 meses',
    ultimaAvaliacao: undefined,
  },
  {
    id: '11',
    nome: 'Fernanda Alves',
    cargo: 'Desenvolvedor Junior',
    cargoId: 'c1',
    jornadaId: 'j1',
    carreiraId: '1',
    gerencia: 'Tecnologia',
    status: 'Ativo' as const,
    ultimoAcesso: '14 de junho de 2026',
    atualizacaoDisponivel: false,
    tempoNoCargo: '6 meses',
    ultimaAvaliacao: undefined,
  },
  {
    id: '12',
    nome: 'Pedro Henrique',
    cargo: 'Desenvolvedor Junior',
    cargoId: 'c1',
    jornadaId: 'j1',
    carreiraId: '1',
    gerencia: 'Desenvolvimento',
    status: 'Ativo' as const,
    ultimoAcesso: '13 de junho de 2026',
    atualizacaoDisponivel: false,
    tempoNoCargo: '3 meses',
    ultimaAvaliacao: undefined,
  },
  {
    id: '13',
    nome: 'Juliana Martins',
    cargo: 'Desenvolvedor Pleno',
    cargoId: 'c2',
    jornadaId: 'j1',
    carreiraId: '1',
    gerencia: 'Tecnologia',
    status: 'Ativo' as const,
    ultimoAcesso: '12 de junho de 2026',
    atualizacaoDisponivel: false,
    tempoNoCargo: '2 anos',
    ultimaAvaliacao: undefined,
  },
  {
    id: '14',
    nome: 'André Oliveira',
    cargo: 'Analista de Infraestrutura Junior',
    cargoId: 'c5',
    jornadaId: 'j2',
    carreiraId: '1',
    gerencia: 'Infraestrutura',
    status: 'Ativo' as const,
    ultimoAcesso: '11 de junho de 2026',
    atualizacaoDisponivel: false,
    tempoNoCargo: '1 ano',
    ultimaAvaliacao: undefined,
  },
  // c1 — Desenvolvedor Junior
  { id: '15', nome: 'Gabriel Souza', cargo: 'Desenvolvedor Junior', cargoId: 'c1', jornadaId: 'j1', carreiraId: '1', gerencia: 'Desenvolvimento', status: 'Ativo' as const, ultimoAcesso: '10 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '4 meses', ultimaAvaliacao: undefined },
  { id: '16', nome: 'Isabela Rodrigues', cargo: 'Desenvolvedor Junior', cargoId: 'c1', jornadaId: 'j1', carreiraId: '1', gerencia: 'Tecnologia', status: 'Ativo' as const, ultimoAcesso: '09 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '7 meses', ultimaAvaliacao: undefined },
  { id: '17', nome: 'Leonardo Santos', cargo: 'Desenvolvedor Junior', cargoId: 'c1', jornadaId: 'j1', carreiraId: '1', gerencia: 'Desenvolvimento', status: 'Ativo' as const, ultimoAcesso: '08 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '5 meses', ultimaAvaliacao: undefined },
  { id: '18', nome: 'Amanda Ferreira', cargo: 'Desenvolvedor Junior', cargoId: 'c1', jornadaId: 'j1', carreiraId: '1', gerencia: 'Tecnologia', status: 'Ativo' as const, ultimoAcesso: '07 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '2 meses', ultimaAvaliacao: undefined },
  { id: '19', nome: 'Rodrigo Pereira',  cargo: 'Analista Financeiro Junior',      cargoId: 'c8',  jornadaId: 'j14', carreiraId: '3',  gerencia: 'Financeiro',  status: 'Ativo' as const, ultimoAcesso: '06 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '9 meses',  ultimaAvaliacao: undefined },
  { id: '20', nome: 'Natália Ribeiro', cargo: 'Product Designer Junior',         cargoId: 'c14', jornadaId: 'j17', carreiraId: '9',  gerencia: 'Produto',     status: 'Ativo' as const, ultimoAcesso: '05 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '3 meses',  ultimaAvaliacao: undefined },
  { id: '21', nome: 'Felipe Barbosa',  cargo: 'Designer Junior',                 cargoId: 'c21', jornadaId: 'j20', carreiraId: '10', gerencia: 'Design',       status: 'Ativo' as const, ultimoAcesso: '04 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '11 meses', ultimaAvaliacao: undefined },
  { id: '22', nome: 'Priscila Carvalho', cargo: 'Engenheiro de Software Junior', cargoId: 'c25', jornadaId: 'j22', carreiraId: '11', gerencia: 'Engenharia',   status: 'Ativo' as const, ultimoAcesso: '03 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '6 meses',  ultimaAvaliacao: undefined },
  // c2 — Desenvolvedor Pleno
  { id: '23', nome: 'Gustavo Lima', cargo: 'Desenvolvedor Pleno', cargoId: 'c2', jornadaId: 'j1', carreiraId: '1', gerencia: 'Tecnologia', status: 'Ativo' as const, ultimoAcesso: '10 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '2 anos', ultimaAvaliacao: undefined },
  { id: '24', nome: 'Renata Alves', cargo: 'Desenvolvedor Pleno', cargoId: 'c2', jornadaId: 'j1', carreiraId: '1', gerencia: 'Desenvolvimento', status: 'Ativo' as const, ultimoAcesso: '09 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '1 ano e 8 meses', ultimaAvaliacao: undefined },
  { id: '25', nome: 'Bruno Nascimento', cargo: 'Desenvolvedor Pleno', cargoId: 'c2', jornadaId: 'j1', carreiraId: '1', gerencia: 'Dados', status: 'Ativo' as const, ultimoAcesso: '08 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '3 anos', ultimaAvaliacao: undefined },
  { id: '26', nome: 'Letícia Costa', cargo: 'Desenvolvedor Pleno', cargoId: 'c2', jornadaId: 'j1', carreiraId: '1', gerencia: 'Tecnologia', status: 'Ativo' as const, ultimoAcesso: '07 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '1 ano e 3 meses', ultimaAvaliacao: undefined },
  { id: '27', nome: 'Vinícius Gomes', cargo: 'Desenvolvedor Pleno', cargoId: 'c2', jornadaId: 'j1', carreiraId: '1', gerencia: 'Desenvolvimento', status: 'Ativo' as const, ultimoAcesso: '06 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '2 anos e 5 meses', ultimaAvaliacao: undefined },
  { id: '28', nome: 'Fabiana Martins', cargo: 'Desenvolvedor Pleno', cargoId: 'c2', jornadaId: 'j1', carreiraId: '1', gerencia: 'Segurança', status: 'Ativo' as const, ultimoAcesso: '05 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '1 ano', ultimaAvaliacao: undefined },
  { id: '29', nome: 'Diego Araújo', cargo: 'Desenvolvedor Pleno', cargoId: 'c2', jornadaId: 'j1', carreiraId: '1', gerencia: 'Tecnologia', status: 'Ativo' as const, ultimoAcesso: '04 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '4 anos', ultimaAvaliacao: undefined },
  { id: '30', nome: 'Monique Teixeira', cargo: 'Desenvolvedor Pleno', cargoId: 'c2', jornadaId: 'j1', carreiraId: '1', gerencia: 'Dados', status: 'Ativo' as const, ultimoAcesso: '03 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '2 anos e 2 meses', ultimaAvaliacao: undefined },
  // c3 — Desenvolvedor Sênior
  { id: '31', nome: 'Eduardo Correia', cargo: 'Desenvolvedor Sênior', cargoId: 'c3', jornadaId: 'j1', carreiraId: '1', gerencia: 'Tecnologia', status: 'Ativo' as const, ultimoAcesso: '10 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '4 anos', ultimaAvaliacao: undefined },
  { id: '32', nome: 'Aline Moreira', cargo: 'Desenvolvedor Sênior', cargoId: 'c3', jornadaId: 'j1', carreiraId: '1', gerencia: 'Segurança', status: 'Ativo' as const, ultimoAcesso: '09 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '3 anos e 6 meses', ultimaAvaliacao: undefined },
  { id: '33', nome: 'Marcelo Nunes', cargo: 'Desenvolvedor Sênior', cargoId: 'c3', jornadaId: 'j1', carreiraId: '1', gerencia: 'Desenvolvimento', status: 'Ativo' as const, ultimoAcesso: '08 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '5 anos', ultimaAvaliacao: undefined },
  { id: '34', nome: 'Tatiane Pinto', cargo: 'Desenvolvedor Sênior', cargoId: 'c3', jornadaId: 'j1', carreiraId: '1', gerencia: 'Dados', status: 'Ativo' as const, ultimoAcesso: '07 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '2 anos e 8 meses', ultimaAvaliacao: undefined },
  { id: '35', nome: 'Alexandre Dias', cargo: 'Desenvolvedor Sênior', cargoId: 'c3', jornadaId: 'j1', carreiraId: '1', gerencia: 'Tecnologia', status: 'Ativo' as const, ultimoAcesso: '06 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '6 anos', ultimaAvaliacao: undefined },
  { id: '36', nome: 'Carla Freitas', cargo: 'Desenvolvedor Sênior', cargoId: 'c3', jornadaId: 'j1', carreiraId: '1', gerencia: 'Desenvolvimento', status: 'Ativo' as const, ultimoAcesso: '05 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '3 anos', ultimaAvaliacao: undefined },
  { id: '37', nome: 'Roberto Cavalcante', cargo: 'Desenvolvedor Sênior', cargoId: 'c3', jornadaId: 'j1', carreiraId: '1', gerencia: 'Segurança', status: 'Ativo' as const, ultimoAcesso: '04 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '7 anos', ultimaAvaliacao: undefined },
  { id: '38', nome: 'Sandra Rocha', cargo: 'Desenvolvedor Sênior', cargoId: 'c3', jornadaId: 'j1', carreiraId: '1', gerencia: 'Tecnologia', status: 'Ativo' as const, ultimoAcesso: '03 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '4 anos e 3 meses', ultimaAvaliacao: undefined },
  // c4 — Tech Lead
  { id: '39', nome: 'Paulo Mendonça', cargo: 'Tech Lead', cargoId: 'c4', jornadaId: 'j1', carreiraId: '1', gerencia: 'Tecnologia', status: 'Ativo' as const, ultimoAcesso: '10 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '3 anos', ultimaAvaliacao: undefined },
  { id: '40', nome: 'Cristiana Bezerra', cargo: 'Tech Lead', cargoId: 'c4', jornadaId: 'j1', carreiraId: '1', gerencia: 'Desenvolvimento', status: 'Ativo' as const, ultimoAcesso: '08 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '5 anos', ultimaAvaliacao: undefined },
  { id: '41', nome: 'Henrique Azevedo', cargo: 'Tech Lead', cargoId: 'c4', jornadaId: 'j1', carreiraId: '1', gerencia: 'Segurança', status: 'Ativo' as const, ultimoAcesso: '06 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '2 anos e 6 meses', ultimaAvaliacao: undefined },
  { id: '42', nome: 'Luciana Nogueira', cargo: 'Tech Lead', cargoId: 'c4', jornadaId: 'j1', carreiraId: '1', gerencia: 'Tecnologia', status: 'Ativo' as const, ultimoAcesso: '04 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '4 anos', ultimaAvaliacao: undefined },
  // c5 — Analista de Infraestrutura Junior
  { id: '43', nome: 'Tiago Monteiro', cargo: 'Analista de Infraestrutura Junior', cargoId: 'c5', jornadaId: 'j2', carreiraId: '1', gerencia: 'Infraestrutura', status: 'Ativo' as const, ultimoAcesso: '10 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '8 meses', ultimaAvaliacao: undefined },
  { id: '44', nome: 'Eliane Cardoso', cargo: 'Analista de Infraestrutura Junior', cargoId: 'c5', jornadaId: 'j2', carreiraId: '1', gerencia: 'Infraestrutura', status: 'Ativo' as const, ultimoAcesso: '08 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '5 meses', ultimaAvaliacao: undefined },
  { id: '45', nome: 'Wagner Lopes', cargo: 'Analista de Infraestrutura Junior', cargoId: 'c5', jornadaId: 'j2', carreiraId: '1', gerencia: 'Segurança', status: 'Ativo' as const, ultimoAcesso: '06 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '1 ano', ultimaAvaliacao: undefined },
  { id: '46', nome: 'Vanessa Ramos', cargo: 'Analista de Infraestrutura Junior', cargoId: 'c5', jornadaId: 'j2', carreiraId: '1', gerencia: 'Infraestrutura', status: 'Ativo' as const, ultimoAcesso: '04 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '3 meses', ultimaAvaliacao: undefined },
  // c6 — Analista de Infraestrutura Pleno
  { id: '47', nome: 'Evandro Melo', cargo: 'Analista de Infraestrutura Pleno', cargoId: 'c6', jornadaId: 'j2', carreiraId: '1', gerencia: 'Infraestrutura', status: 'Ativo' as const, ultimoAcesso: '10 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '2 anos', ultimaAvaliacao: undefined },
  { id: '48', nome: 'Simone Campos', cargo: 'Analista de Infraestrutura Pleno', cargoId: 'c6', jornadaId: 'j2', carreiraId: '1', gerencia: 'Segurança', status: 'Ativo' as const, ultimoAcesso: '08 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '3 anos e 4 meses', ultimaAvaliacao: undefined },
  { id: '49', nome: 'Cláudio Tavares', cargo: 'Analista de Infraestrutura Pleno', cargoId: 'c6', jornadaId: 'j2', carreiraId: '1', gerencia: 'Infraestrutura', status: 'Ativo' as const, ultimoAcesso: '06 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '1 ano e 7 meses', ultimaAvaliacao: undefined },
  { id: '50', nome: 'Fernanda Siqueira', cargo: 'Analista de Operações Junior', cargoId: 'c29', jornadaId: 'j23', carreiraId: '6', gerencia: 'Operações', status: 'Ativo' as const, ultimoAcesso: '04 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '4 anos', ultimaAvaliacao: undefined },
  // ─── Financeiro — j14 Analista Financeiro ─────────────────────────────────
  { id: '51', nome: 'Clara Vieira',         cargo: 'Analista Financeiro Junior', cargoId: 'c8',  jornadaId: 'j14', carreiraId: '3', gerencia: 'Financeiro', status: 'Ativo' as const, ultimoAcesso: '14 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '7 meses',         ultimaAvaliacao: undefined },
  { id: '52', nome: 'Henrique Castro',      cargo: 'Analista Financeiro Junior', cargoId: 'c8',  jornadaId: 'j14', carreiraId: '3', gerencia: 'Financeiro', status: 'Ativo' as const, ultimoAcesso: '13 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '4 meses',         ultimaAvaliacao: undefined },
  { id: '53', nome: 'Patrícia Torres',      cargo: 'Analista Financeiro Pleno',  cargoId: 'c9',  jornadaId: 'j14', carreiraId: '3', gerencia: 'Financeiro', status: 'Ativo' as const, ultimoAcesso: '12 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '2 anos',          ultimaAvaliacao: undefined },
  { id: '54', nome: 'Rodrigo Figueiredo',   cargo: 'Analista Financeiro Pleno',  cargoId: 'c9',  jornadaId: 'j14', carreiraId: '3', gerencia: 'Financeiro', status: 'Ativo' as const, ultimoAcesso: '11 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '1 ano e 5 meses', ultimaAvaliacao: undefined },
  // ─── Financeiro — j15 Controller ──────────────────────────────────────────
  { id: '55', nome: 'Daniela Andrade',      cargo: 'Controller Junior',          cargoId: 'c11', jornadaId: 'j15', carreiraId: '3', gerencia: 'Financeiro', status: 'Ativo' as const, ultimoAcesso: '10 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '8 meses',         ultimaAvaliacao: undefined },
  { id: '56', nome: 'Caio Pinheiro',        cargo: 'Controller Junior',          cargoId: 'c11', jornadaId: 'j15', carreiraId: '3', gerencia: 'Financeiro', status: 'Ativo' as const, ultimoAcesso: '09 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '5 meses',         ultimaAvaliacao: undefined },
  { id: '57', nome: 'Renata Barbosa',       cargo: 'Controller Pleno',           cargoId: 'c12', jornadaId: 'j15', carreiraId: '3', gerencia: 'Financeiro', status: 'Ativo' as const, ultimoAcesso: '08 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '3 anos',          ultimaAvaliacao: undefined },
  // ─── Financeiro — j16 Gerente Financeiro ──────────────────────────────────
  { id: '58', nome: 'Marcos Guimarães',     cargo: 'Gerente Financeiro',         cargoId: 'c13', jornadaId: 'j16', carreiraId: '3', gerencia: 'Financeiro', status: 'Ativo' as const, ultimoAcesso: '07 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '6 anos',          ultimaAvaliacao: undefined },
  // ─── Produto — j17 Product Designer ───────────────────────────────────────
  { id: '59', nome: 'Larissa Cunha',        cargo: 'Product Designer Junior',    cargoId: 'c14', jornadaId: 'j17', carreiraId: '9', gerencia: 'Produto',    status: 'Ativo' as const, ultimoAcesso: '14 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '6 meses',         ultimaAvaliacao: undefined },
  { id: '60', nome: 'Diego Meireles',       cargo: 'Product Designer Junior',    cargoId: 'c14', jornadaId: 'j17', carreiraId: '9', gerencia: 'Produto',    status: 'Ativo' as const, ultimoAcesso: '13 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '4 meses',         ultimaAvaliacao: undefined },
  { id: '61', nome: 'Fernanda Cruz',        cargo: 'Product Designer Pleno',     cargoId: 'c15', jornadaId: 'j17', carreiraId: '9', gerencia: 'Produto',    status: 'Ativo' as const, ultimoAcesso: '12 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '2 anos e 3 meses',ultimaAvaliacao: undefined },
  // ─── Produto — j18 Product Manager ────────────────────────────────────────
  { id: '62', nome: 'Gabriel Teixeira',     cargo: 'Product Manager Junior',     cargoId: 'c17', jornadaId: 'j18', carreiraId: '9', gerencia: 'Produto',    status: 'Ativo' as const, ultimoAcesso: '11 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '7 meses',         ultimaAvaliacao: undefined },
  { id: '63', nome: 'Juliana Borges',       cargo: 'Product Manager Junior',     cargoId: 'c17', jornadaId: 'j18', carreiraId: '9', gerencia: 'Produto',    status: 'Ativo' as const, ultimoAcesso: '10 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '5 meses',         ultimaAvaliacao: undefined },
  { id: '64', nome: 'Rafael Monteiro',      cargo: 'Product Manager Pleno',      cargoId: 'c18', jornadaId: 'j18', carreiraId: '9', gerencia: 'Produto',    status: 'Ativo' as const, ultimoAcesso: '09 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '1 ano e 8 meses', ultimaAvaliacao: undefined },
  { id: '65', nome: 'Ana Paula Sousa',      cargo: 'Product Manager Pleno',      cargoId: 'c18', jornadaId: 'j18', carreiraId: '9', gerencia: 'Produto',    status: 'Ativo' as const, ultimoAcesso: '08 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '2 anos e 1 mês',  ultimaAvaliacao: undefined },
  // ─── Produto — j19 Head de Produto ────────────────────────────────────────
  { id: '66', nome: 'Cristiano Albuquerque', cargo: 'Head de Produto',           cargoId: 'c20', jornadaId: 'j19', carreiraId: '9', gerencia: 'Produto',    status: 'Ativo' as const, ultimoAcesso: '07 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '4 anos',          ultimaAvaliacao: undefined },
  // ─── Design — j20 Designer ────────────────────────────────────────────────
  { id: '67', nome: 'Beatriz Vasconcelos',  cargo: 'Designer Junior',            cargoId: 'c21', jornadaId: 'j20', carreiraId: '10', gerencia: 'Design',     status: 'Ativo' as const, ultimoAcesso: '14 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '5 meses',         ultimaAvaliacao: undefined },
  { id: '68', nome: 'Thiago Pedrosa',       cargo: 'Designer Junior',            cargoId: 'c21', jornadaId: 'j20', carreiraId: '10', gerencia: 'Design',     status: 'Ativo' as const, ultimoAcesso: '13 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '3 meses',         ultimaAvaliacao: undefined },
  { id: '69', nome: 'Vanessa Lima',         cargo: 'Designer Pleno',             cargoId: 'c22', jornadaId: 'j20', carreiraId: '10', gerencia: 'Design',     status: 'Ativo' as const, ultimoAcesso: '12 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '1 ano e 10 meses',ultimaAvaliacao: undefined },
  { id: '70', nome: 'Leonardo Magalhães',   cargo: 'Designer Pleno',             cargoId: 'c22', jornadaId: 'j20', carreiraId: '10', gerencia: 'Design',     status: 'Ativo' as const, ultimoAcesso: '11 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '2 anos e 4 meses',ultimaAvaliacao: undefined },
  // ─── Design — j21 Design Lead ─────────────────────────────────────────────
  { id: '71', nome: 'Camila Barros',        cargo: 'Design Lead',                cargoId: 'c24', jornadaId: 'j21', carreiraId: '10', gerencia: 'Design',     status: 'Ativo' as const, ultimoAcesso: '10 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '3 anos e 6 meses',ultimaAvaliacao: undefined },
  // ─── Engenharia — j22 Engenheiro de Software ──────────────────────────────
  { id: '72', nome: 'Vitor Souza',          cargo: 'Engenheiro de Software Junior',     cargoId: 'c25', jornadaId: 'j22', carreiraId: '11', gerencia: 'Engenharia', status: 'Ativo' as const, ultimoAcesso: '14 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '8 meses',         ultimaAvaliacao: undefined },
  { id: '73', nome: 'Marina Coelho',        cargo: 'Engenheiro de Software Junior',     cargoId: 'c25', jornadaId: 'j22', carreiraId: '11', gerencia: 'Engenharia', status: 'Ativo' as const, ultimoAcesso: '13 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '4 meses',         ultimaAvaliacao: undefined },
  { id: '74', nome: 'Felipe Santos',        cargo: 'Engenheiro de Software Pleno',      cargoId: 'c26', jornadaId: 'j22', carreiraId: '11', gerencia: 'Engenharia', status: 'Ativo' as const, ultimoAcesso: '12 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '2 anos',          ultimaAvaliacao: undefined },
  { id: '75', nome: 'Isabela Tavares',      cargo: 'Engenheiro de Software Pleno',      cargoId: 'c26', jornadaId: 'j22', carreiraId: '11', gerencia: 'Engenharia', status: 'Ativo' as const, ultimoAcesso: '11 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '1 ano e 7 meses', ultimaAvaliacao: undefined },
  { id: '76', nome: 'Lucas Azevedo',        cargo: 'Engenheiro de Software Sênior',     cargoId: 'c27', jornadaId: 'j22', carreiraId: '11', gerencia: 'Engenharia', status: 'Ativo' as const, ultimoAcesso: '10 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '4 anos e 2 meses',ultimaAvaliacao: undefined },
  // ─── Operações — j23 Analista de Operações ────────────────────────────────
  { id: '77', nome: 'Talita Moura',         cargo: 'Analista de Operações Junior',      cargoId: 'c29', jornadaId: 'j23', carreiraId: '6',  gerencia: 'Operações',   status: 'Ativo' as const, ultimoAcesso: '14 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '6 meses',         ultimaAvaliacao: undefined },
  { id: '78', nome: 'Alexandre Gomes',      cargo: 'Analista de Operações Junior',      cargoId: 'c29', jornadaId: 'j23', carreiraId: '6',  gerencia: 'Operações',   status: 'Ativo' as const, ultimoAcesso: '13 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '3 meses',         ultimaAvaliacao: undefined },
  { id: '79', nome: 'Priscila Queiroz',     cargo: 'Analista de Operações Pleno',       cargoId: 'c30', jornadaId: 'j23', carreiraId: '6',  gerencia: 'Operações',   status: 'Ativo' as const, ultimoAcesso: '12 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '2 anos e 3 meses',ultimaAvaliacao: undefined },
  { id: '80', nome: 'Danilo Machado',       cargo: 'Analista de Operações Pleno',       cargoId: 'c30', jornadaId: 'j23', carreiraId: '6',  gerencia: 'Operações',   status: 'Ativo' as const, ultimoAcesso: '11 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '1 ano e 9 meses', ultimaAvaliacao: undefined },
  // ─── Operações — j24 Coordenador de Operações ─────────────────────────────
  { id: '81', nome: 'Adriana Pires',        cargo: 'Coordenador de Operações',          cargoId: 'c32', jornadaId: 'j24', carreiraId: '6',  gerencia: 'Operações',   status: 'Ativo' as const, ultimoAcesso: '10 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '3 anos',          ultimaAvaliacao: undefined },
  { id: '82', nome: 'Fábio Ribeiro',        cargo: 'Coordenador de Operações',          cargoId: 'c32', jornadaId: 'j24', carreiraId: '6',  gerencia: 'Operações',   status: 'Ativo' as const, ultimoAcesso: '09 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '2 anos e 5 meses',ultimaAvaliacao: undefined },
  // ─── Operações — j25 Gerente de Operações ─────────────────────────────────
  { id: '83', nome: 'Cristiane Duarte',     cargo: 'Gerente de Operações',              cargoId: 'c33', jornadaId: 'j25', carreiraId: '6',  gerencia: 'Operações',   status: 'Ativo' as const, ultimoAcesso: '08 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '5 anos',          ultimaAvaliacao: undefined },
  // ─── Inovação — j26 Analista de Inovação ──────────────────────────────────
  { id: '84', nome: 'Matheus Carvalho',     cargo: 'Analista de Inovação Junior',       cargoId: 'c34', jornadaId: 'j26', carreiraId: '14', gerencia: 'Inovação',    status: 'Ativo' as const, ultimoAcesso: '14 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '7 meses',         ultimaAvaliacao: undefined },
  { id: '85', nome: 'Eliane Rocha',         cargo: 'Analista de Inovação Junior',       cargoId: 'c34', jornadaId: 'j26', carreiraId: '14', gerencia: 'Inovação',    status: 'Ativo' as const, ultimoAcesso: '13 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '4 meses',         ultimaAvaliacao: undefined },
  { id: '86', nome: 'João Pedro Fernandes', cargo: 'Analista de Inovação Pleno',        cargoId: 'c35', jornadaId: 'j26', carreiraId: '14', gerencia: 'Inovação',    status: 'Ativo' as const, ultimoAcesso: '12 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '2 anos',          ultimaAvaliacao: undefined },
  { id: '87', nome: 'Bianca Correia',       cargo: 'Analista de Inovação Pleno',        cargoId: 'c35', jornadaId: 'j26', carreiraId: '14', gerencia: 'Inovação',    status: 'Ativo' as const, ultimoAcesso: '11 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '1 ano e 6 meses', ultimaAvaliacao: undefined },
  // ─── Inovação — j27 Especialista em Inovação ──────────────────────────────
  { id: '88', nome: 'Sérgio Marcelino',     cargo: 'Especialista em Inovação',          cargoId: 'c37', jornadaId: 'j27', carreiraId: '14', gerencia: 'Inovação',    status: 'Ativo' as const, ultimoAcesso: '10 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '4 anos e 8 meses',ultimaAvaliacao: undefined },
  // ─── Extras para completar 45 novos (ids 89–95) ───────────────────────────
  { id: '89', nome: 'Aline Couto',          cargo: 'Engenheiro de Software Junior',     cargoId: 'c25', jornadaId: 'j22', carreiraId: '11', gerencia: 'Engenharia',  status: 'Ativo' as const, ultimoAcesso: '09 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '2 meses',         ultimaAvaliacao: undefined },
  { id: '90', nome: 'Tarcísio Brandão',     cargo: 'Engenheiro de Software Pleno',      cargoId: 'c26', jornadaId: 'j22', carreiraId: '11', gerencia: 'Engenharia',  status: 'Ativo' as const, ultimoAcesso: '08 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '3 anos e 1 mês',  ultimaAvaliacao: undefined },
  { id: '91', nome: 'Mariana Rezende',      cargo: 'Product Manager Pleno',             cargoId: 'c18', jornadaId: 'j18', carreiraId: '9',  gerencia: 'Produto',     status: 'Ativo' as const, ultimoAcesso: '07 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '1 ano e 3 meses', ultimaAvaliacao: undefined },
  { id: '92', nome: 'Anderson Lima',        cargo: 'Product Manager Sênior',            cargoId: 'c19', jornadaId: 'j18', carreiraId: '9',  gerencia: 'Produto',     status: 'Ativo' as const, ultimoAcesso: '06 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '5 anos',          ultimaAvaliacao: undefined },
  { id: '93', nome: 'Kelly Cristina',       cargo: 'Analista de Inovação Pleno',        cargoId: 'c35', jornadaId: 'j26', carreiraId: '14', gerencia: 'Inovação',    status: 'Ativo' as const, ultimoAcesso: '05 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '2 anos e 7 meses',ultimaAvaliacao: undefined },
  { id: '94', nome: 'Rodrigo Mesquita',     cargo: 'Analista de Inovação Sênior',       cargoId: 'c36', jornadaId: 'j26', carreiraId: '14', gerencia: 'Inovação',    status: 'Ativo' as const, ultimoAcesso: '04 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '4 anos e 3 meses',ultimaAvaliacao: undefined },
  { id: '95', nome: 'Débora Cavalcanti',    cargo: 'Analista de Inovação Sênior',       cargoId: 'c36', jornadaId: 'j26', carreiraId: '14', gerencia: 'Inovação',    status: 'Ativo' as const, ultimoAcesso: '03 de junho de 2026', atualizacaoDisponivel: false, tempoNoCargo: '3 anos e 5 meses',ultimaAvaliacao: undefined },
];

// ─── Dados de avaliações (interfaces em src/data/schema.ts) ──────────────────

// Data de referência fixa usada para simular "hoje" nos cálculos temporais do
// mock (ex.: avaliações respondidas hoje/ontem no Dashboard). Nunca usar a data
// real do navegador (new Date()) — mantém os dados determinísticos, seguindo o
// mesmo princípio de MOCK_DATA_VERSION em CarreirasContext.tsx.
export const HOJE_SIMULADO = new Date('2026-07-06T00:00:00Z');

export const avaliacoesData: Avaliacao[] = [
  // ─── id=1 · Competências Técnicas TI Q1 2026 · Ativa ───────────────────────
  {
    id: '1',
    nome: 'Avaliação de Competências Técnicas Q1 2026',
    tipo: 'Autoavaliação',
    status: 'Ativa',
    periodoInicio: '2026-03-01',
    periodoFim: '2026-07-31', // corrigido — estava com periodoFim no passado (2026-03-31) enquanto status='Ativa'; alinhado a HOJE_SIMULADO
    publicoLabel: 'Gerência Tecnologia',
    habilidades: ['1', '2', '3', '9', '18'],
    participantes: [
      { colaboradorId: '10', status: 'Em andamento', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Avançado', dataResposta: '2026-07-04' },
        { habilidadeId: '2', nivelRespondido: 'Avançado', dataResposta: '2026-07-04' },
      ]},
      { colaboradorId: '1',  status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-14' },
        { habilidadeId: '2',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-14' },
        { habilidadeId: '18', nivelRespondido: 'Intermediário', dataResposta: '2026-06-14' },
        { habilidadeId: '3',  nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
        { habilidadeId: '9',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-14' },
      ]},
      { colaboradorId: '8',  status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Avançado', dataResposta: '2026-06-10' },
        { habilidadeId: '2',  nivelRespondido: 'Avançado', dataResposta: '2026-06-10' },
        { habilidadeId: '18', nivelRespondido: 'Avançado', dataResposta: '2026-06-10' },
        { habilidadeId: '3',  nivelRespondido: 'Avançado', dataResposta: '2026-06-10' },
        { habilidadeId: '9',  nivelRespondido: 'Avançado', dataResposta: '2026-06-10' },
      ]},
      { colaboradorId: '3',  status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Básico', dataResposta: '2026-06-24' },
        { habilidadeId: '2',  nivelRespondido: 'Básico', dataResposta: '2026-06-24' },
        { habilidadeId: '18', nivelRespondido: 'Básico', dataResposta: '2026-06-24' },
        { habilidadeId: '3',  nivelRespondido: 'Básico', dataResposta: '2026-06-24' },
        { habilidadeId: '9',  nivelRespondido: 'Básico', dataResposta: '2026-06-24' },
      ]},
      { colaboradorId: '39', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Especialista', dataResposta: '2026-06-24' },
        { habilidadeId: '2',  nivelRespondido: 'Especialista', dataResposta: '2026-06-24' },
        { habilidadeId: '18', nivelRespondido: 'Especialista', dataResposta: '2026-06-24' },
        { habilidadeId: '3',  nivelRespondido: 'Avançado', dataResposta: '2026-06-24' },
        { habilidadeId: '9',  nivelRespondido: 'Avançado', dataResposta: '2026-06-24' },
      ]},
      { colaboradorId: '23', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-14' },
        { habilidadeId: '2',  nivelRespondido: 'Avançado', dataResposta: '2026-06-14' },
        { habilidadeId: '18', nivelRespondido: 'Intermediário', dataResposta: '2026-06-14' },
        { habilidadeId: '3',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-14' },
        { habilidadeId: '9',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-14' },
      ]},
      { colaboradorId: '31', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Avançado', dataResposta: '2026-07-04' },
        { habilidadeId: '2',  nivelRespondido: 'Avançado', dataResposta: '2026-07-04' },
        { habilidadeId: '18', nivelRespondido: 'Avançado', dataResposta: '2026-07-04' },
        { habilidadeId: '3',  nivelRespondido: 'Avançado', dataResposta: '2026-07-04' },
        { habilidadeId: '9',  nivelRespondido: 'Avançado', dataResposta: '2026-07-04' },
      ]},
      { colaboradorId: '5',  status: 'Em andamento', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Básico', dataResposta: '2026-07-02' },
        { habilidadeId: '2',  nivelRespondido: 'Básico', dataResposta: '2026-07-02' },
      ]},
      { colaboradorId: '11', status: 'Não iniciada', respostas: [] },
    ],
  },

  // ─── id=2 · Avaliação de Liderança 2026 · Encerrada ────────────────────────
  {
    id: '2',
    nome: 'Avaliação de Liderança 2026',
    tipo: 'Autoavaliação',
    status: 'Encerrada',
    periodoInicio: '2026-02-15',
    periodoFim: '2026-02-28',
    publicoLabel: 'Gerências Recursos Humanos e Operações',
    habilidades: ['9', '10', '14', '21', '22'],
    participantes: [
      { colaboradorId: '2',  status: 'Concluída', respostas: [
        { habilidadeId: '14', nivelRespondido: 'Avançado', dataResposta: '2026-06-28' },
        { habilidadeId: '9',  nivelRespondido: 'Avançado', dataResposta: '2026-06-28' },
        { habilidadeId: '10', nivelRespondido: 'Avançado', dataResposta: '2026-06-28' },
        { habilidadeId: '21', nivelRespondido: 'Avançado', dataResposta: '2026-06-28' },
        { habilidadeId: '22', nivelRespondido: 'Avançado', dataResposta: '2026-06-28' },
      ]},
      { colaboradorId: '1',  status: 'Concluída', respostas: [
        { habilidadeId: '14', nivelRespondido: 'Avançado', dataResposta: '2026-07-06' },
        { habilidadeId: '9',  nivelRespondido: 'Avançado', dataResposta: '2026-07-06' },
        { habilidadeId: '10', nivelRespondido: 'Avançado', dataResposta: '2026-07-06' },
        { habilidadeId: '21', nivelRespondido: 'Intermediário', dataResposta: '2026-07-06' },
        { habilidadeId: '22', nivelRespondido: 'Avançado', dataResposta: '2026-07-06' },
      ]},
      { colaboradorId: '10', status: 'Concluída', respostas: [
        { habilidadeId: '14', nivelRespondido: 'Intermediário', dataResposta: '2026-06-22' },
        { habilidadeId: '9',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-22' },
        { habilidadeId: '10', nivelRespondido: 'Intermediário', dataResposta: '2026-06-22' },
        { habilidadeId: '21', nivelRespondido: 'Intermediário', dataResposta: '2026-06-22' },
        { habilidadeId: '22', nivelRespondido: 'Intermediário', dataResposta: '2026-06-22' },
      ]},
      { colaboradorId: '4',  status: 'Concluída', respostas: [
        { habilidadeId: '14', nivelRespondido: 'Básico', dataResposta: '2026-07-06' },
        { habilidadeId: '9',  nivelRespondido: 'Básico', dataResposta: '2026-07-06' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-07-06' },
        { habilidadeId: '21', nivelRespondido: 'Básico', dataResposta: '2026-07-06' },
        { habilidadeId: '22', nivelRespondido: 'Intermediário', dataResposta: '2026-07-06' },
      ]},
      { colaboradorId: '3',  status: 'Concluída', respostas: [
        { habilidadeId: '14', nivelRespondido: 'Básico', dataResposta: '2026-07-02' },
        { habilidadeId: '9',  nivelRespondido: 'Básico', dataResposta: '2026-07-02' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-07-02' },
        { habilidadeId: '21', nivelRespondido: 'Básico', dataResposta: '2026-07-02' },
        { habilidadeId: '22', nivelRespondido: 'Básico', dataResposta: '2026-07-02' },
      ]},
    ],
  },

  // ─── id=3 · Soft Skills Semestral · Rascunho ────────────────────────────────
  {
    id: '3',
    nome: 'Soft Skills - Semestral',
    tipo: 'Autoavaliação',
    status: 'Rascunho',
    periodoInicio: '2026-04-10',
    periodoFim: '2026-04-30',
    publicoLabel: 'Todos os colaboradores',
    descricao: 'Avaliação semestral de competências comportamentais e habilidades interpessoais para todos os colaboradores da organização.',
    habilidades: ['9', '10', '21', '22', '14'],
    participantes: [],
  },

  // ─── id=4 · Competências Financeiras Q1 · Ativa ─────────────────────────────
  {
    id: '4',
    nome: 'Competências Financeiras Q1',
    tipo: 'Autoavaliação',
    status: 'Ativa',
    periodoInicio: '2026-03-05',
    periodoFim: '2026-03-25',
    publicoLabel: 'Gerência Financeiro',
    habilidades: ['110', '111', '112'],
    participantes: [
      { colaboradorId: '19', status: 'Concluída', respostas: [
        { habilidadeId: '110', nivelRespondido: 'Básico', dataResposta: '2026-06-16' },
        { habilidadeId: '111', nivelRespondido: 'Básico', dataResposta: '2026-06-16' },
        { habilidadeId: '112', nivelRespondido: 'Básico', dataResposta: '2026-06-16' },
      ]},
      { colaboradorId: '51', status: 'Concluída', respostas: [
        { habilidadeId: '110', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '111', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '112', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
      ]},
      { colaboradorId: '52', status: 'Não iniciada', respostas: [] },
      { colaboradorId: '53', status: 'Concluída', respostas: [
        { habilidadeId: '110', nivelRespondido: 'Intermediário', dataResposta: '2026-07-02' },
        { habilidadeId: '111', nivelRespondido: 'Intermediário', dataResposta: '2026-07-02' },
        { habilidadeId: '112', nivelRespondido: 'Intermediário', dataResposta: '2026-07-02' },
      ]},
      { colaboradorId: '55', status: 'Não iniciada', respostas: [] },
      { colaboradorId: '57', status: 'Concluída', respostas: [
        { habilidadeId: '110', nivelRespondido: 'Avançado', dataResposta: '2026-06-13' },
        { habilidadeId: '111', nivelRespondido: 'Intermediário', dataResposta: '2026-06-13' },
        { habilidadeId: '112', nivelRespondido: 'Avançado', dataResposta: '2026-06-13' },
      ]},
    ],
  },

  // ─── id=5 · Competências Analíticas · Encerrada ─────────────────────────────
  {
    id: '5',
    nome: 'Competências Analíticas',
    tipo: 'Autoavaliação',
    status: 'Encerrada',
    periodoInicio: '2026-01-01',
    periodoFim: '2026-01-31',
    publicoLabel: 'Gerências Tecnologia e Financeiro',
    habilidades: ['65', '66', '67'],
    participantes: [
      { colaboradorId: '1',  status: 'Concluída', respostas: [
        { habilidadeId: '65', nivelRespondido: 'Intermediário', dataResposta: '2026-06-21' },
        { habilidadeId: '66', nivelRespondido: 'Avançado', dataResposta: '2026-06-21' },
        { habilidadeId: '67', nivelRespondido: 'Básico', dataResposta: '2026-06-21' },
      ]},
      { colaboradorId: '10', status: 'Concluída', respostas: [
        { habilidadeId: '65', nivelRespondido: 'Intermediário', dataResposta: '2026-06-14' },
        { habilidadeId: '66', nivelRespondido: 'Avançado', dataResposta: '2026-06-14' },
        { habilidadeId: '67', nivelRespondido: 'Intermediário', dataResposta: '2026-06-14' },
      ]},
      { colaboradorId: '23', status: 'Concluída', respostas: [
        { habilidadeId: '65', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '66', nivelRespondido: 'Intermediário', dataResposta: '2026-07-01' },
        { habilidadeId: '67', nivelRespondido: 'Intermediário', dataResposta: '2026-07-01' },
      ]},
      { colaboradorId: '19', status: 'Concluída', respostas: [
        { habilidadeId: '65', nivelRespondido: 'Básico', dataResposta: '2026-06-16' },
        { habilidadeId: '66', nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '67', nivelRespondido: 'Básico', dataResposta: '2026-06-16' },
      ]},
      { colaboradorId: '53', status: 'Concluída', respostas: [
        { habilidadeId: '65', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '66', nivelRespondido: 'Avançado', dataResposta: '2026-07-03' },
        { habilidadeId: '67', nivelRespondido: 'Avançado', dataResposta: '2026-07-03' },
      ]},
    ],
  },

  // ─── id=6 · Metodologias Ágeis · Rascunho ──────────────────────────────────
  {
    id: '6',
    nome: 'Metodologias Ágeis',
    tipo: 'Autoavaliação',
    status: 'Rascunho',
    periodoInicio: '2026-03-20',
    periodoFim: '2026-04-10',
    publicoLabel: 'Gerências Tecnologia e Produto',
    descricao: 'Avaliação do nível de adoção e domínio das metodologias ágeis pelas equipes de tecnologia e produto.',
    habilidades: ['11', '12'],
    participantes: [],
  },

  // ─── id=7 · Avaliação Design Q1 2026 · Ativa ────────────────────────────────
  {
    id: '7',
    nome: 'Avaliação Design Q1 2026',
    tipo: 'Autoavaliação',
    status: 'Ativa',
    periodoInicio: '2026-03-01',
    periodoFim: '2026-03-20',
    publicoLabel: 'Gerências Design e Produto',
    habilidades: ['118', '119', '124', '125'],
    participantes: [
      { colaboradorId: '67', status: 'Concluída', respostas: [
        { habilidadeId: '124', nivelRespondido: 'Básico', dataResposta: '2026-07-06' },
        { habilidadeId: '125', nivelRespondido: 'Básico', dataResposta: '2026-07-06' },
        { habilidadeId: '118', nivelRespondido: 'Básico', dataResposta: '2026-07-06' },
        { habilidadeId: '119', nivelRespondido: 'Básico', dataResposta: '2026-07-06' },
      ]},
      { colaboradorId: '69', status: 'Concluída', respostas: [
        { habilidadeId: '124', nivelRespondido: 'Intermediário', dataResposta: '2026-07-06' },
        { habilidadeId: '125', nivelRespondido: 'Avançado', dataResposta: '2026-07-06' },
        { habilidadeId: '118', nivelRespondido: 'Intermediário', dataResposta: '2026-07-06' },
        { habilidadeId: '119', nivelRespondido: 'Intermediário', dataResposta: '2026-07-06' },
      ]},
      { colaboradorId: '59', status: 'Concluída', respostas: [
        { habilidadeId: '124', nivelRespondido: 'Básico', dataResposta: '2026-06-18' },
        { habilidadeId: '125', nivelRespondido: 'Básico', dataResposta: '2026-06-18' },
        { habilidadeId: '118', nivelRespondido: 'Intermediário', dataResposta: '2026-06-18' },
        { habilidadeId: '119', nivelRespondido: 'Básico', dataResposta: '2026-06-18' },
      ]},
      { colaboradorId: '61', status: 'Concluída', respostas: [
        { habilidadeId: '124', nivelRespondido: 'Intermediário', dataResposta: '2026-07-02' },
        { habilidadeId: '125', nivelRespondido: 'Intermediário', dataResposta: '2026-07-02' },
        { habilidadeId: '118', nivelRespondido: 'Avançado', dataResposta: '2026-07-02' },
        { habilidadeId: '119', nivelRespondido: 'Intermediário', dataResposta: '2026-07-02' },
      ]},
      { colaboradorId: '71', status: 'Não iniciada', respostas: [] },
    ],
  },

  // ─── id=8 · Competências em Cloud Computing · Encerrada ────────────────────
  {
    id: '8',
    nome: 'Competências em Cloud Computing',
    tipo: 'Autoavaliação',
    status: 'Encerrada',
    periodoInicio: '2026-01-15',
    periodoFim: '2026-02-15',
    publicoLabel: 'Gerência Tecnologia',
    habilidades: ['53', '56', '57', '58'],
    participantes: [
      { colaboradorId: '6',  status: 'Concluída', respostas: [
        { habilidadeId: '56', nivelRespondido: 'Básico', dataResposta: '2026-07-04' },
        { habilidadeId: '57', nivelRespondido: 'Básico', dataResposta: '2026-07-04' },
        { habilidadeId: '58', nivelRespondido: 'Básico', dataResposta: '2026-07-04' },
        { habilidadeId: '53', nivelRespondido: 'Básico', dataResposta: '2026-07-04' },
      ]},
      { colaboradorId: '7',  status: 'Expirada', respostas: [] },
      { colaboradorId: '47', status: 'Concluída', respostas: [
        { habilidadeId: '56', nivelRespondido: 'Intermediário', dataResposta: '2026-06-30' },
        { habilidadeId: '57', nivelRespondido: 'Intermediário', dataResposta: '2026-06-30' },
        { habilidadeId: '58', nivelRespondido: 'Intermediário', dataResposta: '2026-06-30' },
        { habilidadeId: '53', nivelRespondido: 'Avançado', dataResposta: '2026-06-30' },
      ]},
      { colaboradorId: '48', status: 'Concluída', respostas: [
        { habilidadeId: '56', nivelRespondido: 'Avançado', dataResposta: '2026-07-02' },
        { habilidadeId: '57', nivelRespondido: 'Avançado', dataResposta: '2026-07-02' },
        { habilidadeId: '58', nivelRespondido: 'Intermediário', dataResposta: '2026-07-02' },
        { habilidadeId: '53', nivelRespondido: 'Avançado', dataResposta: '2026-07-02' },
      ]},
      { colaboradorId: '76', status: 'Concluída', respostas: [
        { habilidadeId: '56', nivelRespondido: 'Intermediário', dataResposta: '2026-06-22' },
        { habilidadeId: '57', nivelRespondido: 'Básico', dataResposta: '2026-06-22' },
        { habilidadeId: '58', nivelRespondido: 'Avançado', dataResposta: '2026-06-22' },
        { habilidadeId: '53', nivelRespondido: 'Avançado', dataResposta: '2026-06-22' },
      ]},
    ],
  },

  // ─── id=9 · Competências de Produto Q2 2026 · Encerrada ────────────────────
  {
    id: '9',
    nome: 'Competências de Produto Q2 2026',
    tipo: 'Autoavaliação',
    status: 'Encerrada',
    periodoInicio: '2026-04-01',
    periodoFim: '2026-04-30',
    publicoLabel: 'Gerência Produto',
    habilidades: ['88', '89', '104', '118', '119', '120', '121', '122'],
    participantes: [
      { colaboradorId: '62', status: 'Concluída', respostas: [
        { habilidadeId: '118', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '119', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '120', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '121', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '122', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
      ]},
      { colaboradorId: '63', status: 'Concluída', respostas: [
        { habilidadeId: '118', nivelRespondido: 'Básico', dataResposta: '2026-06-09' },
        { habilidadeId: '119', nivelRespondido: 'Básico', dataResposta: '2026-06-09' },
        { habilidadeId: '120', nivelRespondido: 'Básico', dataResposta: '2026-06-09' },
        { habilidadeId: '121', nivelRespondido: 'Básico', dataResposta: '2026-06-09' },
        { habilidadeId: '122', nivelRespondido: 'Básico', dataResposta: '2026-06-09' },
      ]},
      { colaboradorId: '64', status: 'Concluída', respostas: [
        { habilidadeId: '118', nivelRespondido: 'Intermediário', dataResposta: '2026-06-11' },
        { habilidadeId: '119', nivelRespondido: 'Intermediário', dataResposta: '2026-06-11' },
        { habilidadeId: '120', nivelRespondido: 'Intermediário', dataResposta: '2026-06-11' },
        { habilidadeId: '121', nivelRespondido: 'Avançado', dataResposta: '2026-06-11' },
        { habilidadeId: '122', nivelRespondido: 'Intermediário', dataResposta: '2026-06-11' },
      ]},
      { colaboradorId: '65', status: 'Concluída', respostas: [
        { habilidadeId: '118', nivelRespondido: 'Avançado', dataResposta: '2026-06-13' },
        { habilidadeId: '119', nivelRespondido: 'Intermediário', dataResposta: '2026-06-13' },
        { habilidadeId: '120', nivelRespondido: 'Intermediário', dataResposta: '2026-06-13' },
        { habilidadeId: '121', nivelRespondido: 'Avançado', dataResposta: '2026-06-13' },
        { habilidadeId: '122', nivelRespondido: 'Intermediário', dataResposta: '2026-06-13' },
      ]},
      { colaboradorId: '91', status: 'Concluída', respostas: [
        { habilidadeId: '118', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '119', nivelRespondido: 'Intermediário', dataResposta: '2026-06-27' },
        { habilidadeId: '120', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '121', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '122', nivelRespondido: 'Intermediário', dataResposta: '2026-06-27' },
      ]},
      { colaboradorId: '92', status: 'Concluída', respostas: [
        { habilidadeId: '118', nivelRespondido: 'Avançado', dataResposta: '2026-06-29' },
        { habilidadeId: '119', nivelRespondido: 'Avançado', dataResposta: '2026-06-29' },
        { habilidadeId: '120', nivelRespondido: 'Avançado', dataResposta: '2026-06-29' },
        { habilidadeId: '121', nivelRespondido: 'Avançado', dataResposta: '2026-06-29' },
        { habilidadeId: '122', nivelRespondido: 'Avançado', dataResposta: '2026-06-29' },
        { habilidadeId: '104', nivelRespondido: 'Intermediário', dataResposta: '2026-06-29' },
      ]},
      { colaboradorId: '66', status: 'Concluída', respostas: [
        { habilidadeId: '118', nivelRespondido: 'Avançado', dataResposta: '2026-06-13' },
        { habilidadeId: '119', nivelRespondido: 'Especialista', dataResposta: '2026-06-13' },
        { habilidadeId: '120', nivelRespondido: 'Avançado', dataResposta: '2026-06-13' },
        { habilidadeId: '104', nivelRespondido: 'Avançado', dataResposta: '2026-06-13' },
        { habilidadeId: '89',  nivelRespondido: 'Avançado', dataResposta: '2026-06-13' },
        { habilidadeId: '88',  nivelRespondido: 'Avançado', dataResposta: '2026-06-13' },
      ]},
    ],
  },

  // ─── id=10 · Competências de Operações Q2 2026 · Encerrada ─────────────────
  {
    id: '10',
    nome: 'Competências de Operações Q2 2026',
    tipo: 'Autoavaliação',
    status: 'Encerrada',
    periodoInicio: '2026-04-01',
    periodoFim: '2026-04-30',
    publicoLabel: 'Gerência Operações',
    habilidades: ['88', '137', '138', '139', '140', '141'],
    participantes: [
      { colaboradorId: '50', status: 'Concluída', respostas: [
        { habilidadeId: '137', nivelRespondido: 'Iniciante', dataResposta: '2026-06-15' },
        { habilidadeId: '138', nivelRespondido: 'Iniciante', dataResposta: '2026-06-15' },
        { habilidadeId: '139', nivelRespondido: 'Iniciante', dataResposta: '2026-06-15' },
        { habilidadeId: '141', nivelRespondido: 'Iniciante', dataResposta: '2026-06-15' },
      ]},
      { colaboradorId: '77', status: 'Concluída', respostas: [
        { habilidadeId: '137', nivelRespondido: 'Iniciante', dataResposta: '2026-06-23' },
        { habilidadeId: '138', nivelRespondido: 'Iniciante', dataResposta: '2026-06-23' },
        { habilidadeId: '139', nivelRespondido: 'Iniciante', dataResposta: '2026-06-23' },
        { habilidadeId: '141', nivelRespondido: 'Iniciante', dataResposta: '2026-06-23' },
      ]},
      { colaboradorId: '78', status: 'Concluída', respostas: [
        { habilidadeId: '137', nivelRespondido: 'Iniciante', dataResposta: '2026-07-06' },
        { habilidadeId: '138', nivelRespondido: 'Iniciante', dataResposta: '2026-07-06' },
        { habilidadeId: '139', nivelRespondido: 'Iniciante', dataResposta: '2026-07-06' },
        { habilidadeId: '141', nivelRespondido: 'Iniciante', dataResposta: '2026-07-06' },
      ]},
      { colaboradorId: '79', status: 'Concluída', respostas: [
        { habilidadeId: '137', nivelRespondido: 'Aprendiz', dataResposta: '2026-07-04' },
        { habilidadeId: '138', nivelRespondido: 'Aprendiz', dataResposta: '2026-07-04' },
        { habilidadeId: '139', nivelRespondido: 'Experiente', dataResposta: '2026-07-04' },
        { habilidadeId: '140', nivelRespondido: 'Aprendiz', dataResposta: '2026-07-04' },
        { habilidadeId: '141', nivelRespondido: 'Aprendiz', dataResposta: '2026-07-04' },
      ]},
      { colaboradorId: '80', status: 'Concluída', respostas: [
        { habilidadeId: '137', nivelRespondido: 'Iniciante', dataResposta: '2026-06-15' },
        { habilidadeId: '138', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-15' },
        { habilidadeId: '139', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-15' },
        { habilidadeId: '140', nivelRespondido: 'Iniciante', dataResposta: '2026-06-15' },
        { habilidadeId: '141', nivelRespondido: 'Iniciante', dataResposta: '2026-06-15' },
      ]},
      { colaboradorId: '81', status: 'Concluída', respostas: [
        { habilidadeId: '137', nivelRespondido: 'Experiente', dataResposta: '2026-06-17' },
        { habilidadeId: '138', nivelRespondido: 'Experiente', dataResposta: '2026-06-17' },
        { habilidadeId: '139', nivelRespondido: 'Experiente', dataResposta: '2026-06-17' },
        { habilidadeId: '140', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-17' },
        { habilidadeId: '141', nivelRespondido: 'Experiente', dataResposta: '2026-06-17' },
      ]},
      { colaboradorId: '82', status: 'Concluída', respostas: [
        { habilidadeId: '137', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-19' },
        { habilidadeId: '138', nivelRespondido: 'Experiente', dataResposta: '2026-06-19' },
        { habilidadeId: '139', nivelRespondido: 'Experiente', dataResposta: '2026-06-19' },
        { habilidadeId: '140', nivelRespondido: 'Iniciante', dataResposta: '2026-06-19' },
        { habilidadeId: '141', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-19' },
      ]},
      { colaboradorId: '83', status: 'Concluída', respostas: [
        { habilidadeId: '137', nivelRespondido: 'Referência', dataResposta: '2026-06-21' },
        { habilidadeId: '138', nivelRespondido: 'Referência', dataResposta: '2026-06-21' },
        { habilidadeId: '139', nivelRespondido: 'Referência', dataResposta: '2026-06-21' },
        { habilidadeId: '140', nivelRespondido: 'Experiente', dataResposta: '2026-06-21' },
        { habilidadeId: '141', nivelRespondido: 'Referência', dataResposta: '2026-06-21' },
        { habilidadeId: '88',  nivelRespondido: 'Avançado', dataResposta: '2026-06-21' },
      ]},
    ],
  },

  // ─── id=11 · Competências de Inovação Q2 2026 · Encerrada ──────────────────
  {
    id: '11',
    nome: 'Competências de Inovação Q2 2026',
    tipo: 'Autoavaliação',
    status: 'Encerrada',
    periodoInicio: '2026-04-01',
    periodoFim: '2026-04-30',
    publicoLabel: 'Gerência Inovação',
    habilidades: ['23', '104', '106', '142', '143', '144', '145', '146'],
    participantes: [
      { colaboradorId: '84', status: 'Concluída', respostas: [
        { habilidadeId: '142', nivelRespondido: 'Iniciante', dataResposta: '2026-06-23' },
        { habilidadeId: '143', nivelRespondido: 'Iniciante', dataResposta: '2026-06-23' },
        { habilidadeId: '144', nivelRespondido: 'Iniciante', dataResposta: '2026-06-23' },
        { habilidadeId: '146', nivelRespondido: 'Iniciante', dataResposta: '2026-06-23' },
      ]},
      { colaboradorId: '85', status: 'Concluída', respostas: [
        { habilidadeId: '142', nivelRespondido: 'Iniciante', dataResposta: '2026-06-25' },
        { habilidadeId: '143', nivelRespondido: 'Iniciante', dataResposta: '2026-06-25' },
        { habilidadeId: '144', nivelRespondido: 'Iniciante', dataResposta: '2026-06-25' },
        { habilidadeId: '146', nivelRespondido: 'Iniciante', dataResposta: '2026-06-25' },
      ]},
      { colaboradorId: '86', status: 'Concluída', respostas: [
        { habilidadeId: '142', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-27' },
        { habilidadeId: '143', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-27' },
        { habilidadeId: '144', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-27' },
        { habilidadeId: '146', nivelRespondido: 'Iniciante', dataResposta: '2026-06-27' },
        { habilidadeId: '23',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-27' },
      ]},
      { colaboradorId: '87', status: 'Concluída', respostas: [
        { habilidadeId: '142', nivelRespondido: 'Iniciante', dataResposta: '2026-06-29' },
        { habilidadeId: '143', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-29' },
        { habilidadeId: '144', nivelRespondido: 'Iniciante', dataResposta: '2026-06-29' },
        { habilidadeId: '146', nivelRespondido: 'Iniciante', dataResposta: '2026-06-29' },
        { habilidadeId: '23',  nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
      ]},
      { colaboradorId: '93', status: 'Concluída', respostas: [
        { habilidadeId: '142', nivelRespondido: 'Experiente', dataResposta: '2026-06-25' },
        { habilidadeId: '143', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-25' },
        { habilidadeId: '144', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-25' },
        { habilidadeId: '146', nivelRespondido: 'Iniciante', dataResposta: '2026-06-25' },
        { habilidadeId: '23',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-25' },
      ]},
      { colaboradorId: '94', status: 'Concluída', respostas: [
        { habilidadeId: '142', nivelRespondido: 'Experiente', dataResposta: '2026-07-04' },
        { habilidadeId: '143', nivelRespondido: 'Experiente', dataResposta: '2026-07-04' },
        { habilidadeId: '144', nivelRespondido: 'Experiente', dataResposta: '2026-07-04' },
        { habilidadeId: '145', nivelRespondido: 'Aprendiz', dataResposta: '2026-07-04' },
        { habilidadeId: '146', nivelRespondido: 'Aprendiz', dataResposta: '2026-07-04' },
        { habilidadeId: '23',  nivelRespondido: 'Avançado', dataResposta: '2026-07-04' },
      ]},
      { colaboradorId: '95', status: 'Concluída', respostas: [
        { habilidadeId: '142', nivelRespondido: 'Aprendiz', dataResposta: '2026-07-06' },
        { habilidadeId: '143', nivelRespondido: 'Experiente', dataResposta: '2026-07-06' },
        { habilidadeId: '144', nivelRespondido: 'Experiente', dataResposta: '2026-07-06' },
        { habilidadeId: '145', nivelRespondido: 'Iniciante', dataResposta: '2026-07-06' },
        { habilidadeId: '146', nivelRespondido: 'Iniciante', dataResposta: '2026-07-06' },
        { habilidadeId: '23',  nivelRespondido: 'Intermediário', dataResposta: '2026-07-06' },
      ]},
      { colaboradorId: '88', status: 'Concluída', respostas: [
        { habilidadeId: '142', nivelRespondido: 'Referência', dataResposta: '2026-07-05' },
        { habilidadeId: '143', nivelRespondido: 'Referência', dataResposta: '2026-07-05' },
        { habilidadeId: '144', nivelRespondido: 'Referência', dataResposta: '2026-07-05' },
        { habilidadeId: '145', nivelRespondido: 'Experiente', dataResposta: '2026-07-05' },
        { habilidadeId: '146', nivelRespondido: 'Experiente', dataResposta: '2026-07-05' },
        { habilidadeId: '104', nivelRespondido: 'Avançado', dataResposta: '2026-07-05' },
        { habilidadeId: '106', nivelRespondido: 'Avançado', dataResposta: '2026-07-05' },
      ]},
    ],
  },

  // ─── id=12 · Competências de Engenharia de Software Q2 2026 · Encerrada ────
  {
    id: '12',
    nome: 'Competências de Engenharia de Software Q2 2026',
    tipo: 'Autoavaliação',
    status: 'Encerrada',
    periodoInicio: '2026-04-01',
    periodoFim: '2026-04-30',
    publicoLabel: 'Gerência Engenharia',
    habilidades: ['131', '132', '133', '134', '135', '136'],
    participantes: [
      { colaboradorId: '22', status: 'Concluída', respostas: [
        { habilidadeId: '131', nivelRespondido: 'Iniciante', dataResposta: '2026-06-22' },
        { habilidadeId: '132', nivelRespondido: 'Iniciante', dataResposta: '2026-06-22' },
        { habilidadeId: '133', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-22' },
        { habilidadeId: '134', nivelRespondido: 'Iniciante', dataResposta: '2026-06-22' },
        { habilidadeId: '135', nivelRespondido: 'Iniciante', dataResposta: '2026-06-22' },
      ]},
      { colaboradorId: '72', status: 'Concluída', respostas: [
        { habilidadeId: '131', nivelRespondido: 'Iniciante', dataResposta: '2026-07-06' },
        { habilidadeId: '132', nivelRespondido: 'Iniciante', dataResposta: '2026-07-06' },
        { habilidadeId: '133', nivelRespondido: 'Iniciante', dataResposta: '2026-07-06' },
        { habilidadeId: '134', nivelRespondido: 'Iniciante', dataResposta: '2026-07-06' },
        { habilidadeId: '135', nivelRespondido: 'Iniciante', dataResposta: '2026-07-06' },
      ]},
      { colaboradorId: '73', status: 'Concluída', respostas: [
        { habilidadeId: '131', nivelRespondido: 'Iniciante', dataResposta: '2026-06-08' },
        { habilidadeId: '132', nivelRespondido: 'Iniciante', dataResposta: '2026-06-08' },
        { habilidadeId: '133', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-08' },
        { habilidadeId: '134', nivelRespondido: 'Iniciante', dataResposta: '2026-06-08' },
        { habilidadeId: '135', nivelRespondido: 'Iniciante', dataResposta: '2026-06-08' },
      ]},
      { colaboradorId: '74', status: 'Concluída', respostas: [
        { habilidadeId: '131', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-10' },
        { habilidadeId: '132', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-10' },
        { habilidadeId: '133', nivelRespondido: 'Praticante', dataResposta: '2026-06-10' },
        { habilidadeId: '134', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-10' },
        { habilidadeId: '135', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-10' },
        { habilidadeId: '136', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-10' },
      ]},
      { colaboradorId: '75', status: 'Concluída', respostas: [
        { habilidadeId: '131', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-12' },
        { habilidadeId: '132', nivelRespondido: 'Praticante', dataResposta: '2026-06-12' },
        { habilidadeId: '133', nivelRespondido: 'Praticante', dataResposta: '2026-06-12' },
        { habilidadeId: '134', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-12' },
        { habilidadeId: '135', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-12' },
        { habilidadeId: '136', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-12' },
      ]},
      { colaboradorId: '76', status: 'Concluída', respostas: [
        { habilidadeId: '131', nivelRespondido: 'Praticante', dataResposta: '2026-06-14' },
        { habilidadeId: '132', nivelRespondido: 'Praticante', dataResposta: '2026-06-14' },
        { habilidadeId: '133', nivelRespondido: 'Experiente', dataResposta: '2026-06-14' },
        { habilidadeId: '134', nivelRespondido: 'Praticante', dataResposta: '2026-06-14' },
        { habilidadeId: '135', nivelRespondido: 'Praticante', dataResposta: '2026-06-14' },
        { habilidadeId: '136', nivelRespondido: 'Praticante', dataResposta: '2026-06-14' },
      ]},
      { colaboradorId: '89', status: 'Concluída', respostas: [
        { habilidadeId: '131', nivelRespondido: 'Iniciante', dataResposta: '2026-07-01' },
        { habilidadeId: '132', nivelRespondido: 'Iniciante', dataResposta: '2026-07-01' },
        { habilidadeId: '133', nivelRespondido: 'Iniciante', dataResposta: '2026-07-01' },
        { habilidadeId: '134', nivelRespondido: 'Iniciante', dataResposta: '2026-07-01' },
        { habilidadeId: '135', nivelRespondido: 'Iniciante', dataResposta: '2026-07-01' },
      ]},
      { colaboradorId: '90', status: 'Concluída', respostas: [
        { habilidadeId: '131', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-19' },
        { habilidadeId: '132', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-19' },
        { habilidadeId: '133', nivelRespondido: 'Praticante', dataResposta: '2026-06-19' },
        { habilidadeId: '134', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-19' },
        { habilidadeId: '135', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-19' },
        { habilidadeId: '136', nivelRespondido: 'Aprendiz', dataResposta: '2026-06-19' },
      ]},
    ],
  },

  // ─── id=13 · Liderança Design e Financeiro Q2 2026 · Encerrada ─────────────
  {
    id: '13',
    nome: 'Liderança Design e Financeiro Q2 2026',
    tipo: 'Autoavaliação',
    status: 'Encerrada',
    periodoInicio: '2026-04-01',
    periodoFim: '2026-04-30',
    publicoLabel: 'Gerências Design e Financeiro',
    habilidades: ['86', '87', '88', '89', '110', '111', '112', '113', '124', '125', '126', '128'],
    participantes: [
      { colaboradorId: '71', status: 'Concluída', respostas: [
        { habilidadeId: '124', nivelRespondido: 'Especialista', dataResposta: '2026-07-03' },
        { habilidadeId: '125', nivelRespondido: 'Especialista', dataResposta: '2026-07-03' },
        { habilidadeId: '126', nivelRespondido: 'Especialista', dataResposta: '2026-07-03' },
        { habilidadeId: '128', nivelRespondido: 'Especialista', dataResposta: '2026-07-03' },
        { habilidadeId: '86',  nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '87',  nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
      ]},
      { colaboradorId: '58', status: 'Concluída', respostas: [
        { habilidadeId: '110', nivelRespondido: 'Avançado', dataResposta: '2026-07-05' },
        { habilidadeId: '111', nivelRespondido: 'Avançado', dataResposta: '2026-07-05' },
        { habilidadeId: '112', nivelRespondido: 'Avançado', dataResposta: '2026-07-05' },
        { habilidadeId: '113', nivelRespondido: 'Avançado', dataResposta: '2026-07-05' },
        { habilidadeId: '89',  nivelRespondido: 'Intermediário', dataResposta: '2026-07-05' },
        { habilidadeId: '88',  nivelRespondido: 'Intermediário', dataResposta: '2026-07-05' },
      ]},
    ],
  },

  // ─── id=14 · Competências Técnicas TI Q2 2026 · Encerrada ──────────────────
  {
    id: '14',
    nome: 'Competências Técnicas TI Q2 2026',
    tipo: 'Autoavaliação',
    status: 'Encerrada',
    periodoInicio: '2026-05-01',
    periodoFim: '2026-05-31',
    publicoLabel: 'Gerência Tecnologia',
    habilidades: ['1', '2', '3', '9', '10', '14', '18', '21', '22', '86', '87', '88'],
    participantes: [
      // c1 — Desenvolvedor Junior
      { colaboradorId: '11', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '2',  nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '18', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '9',  nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '21', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '22', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
      ]},
      { colaboradorId: '12', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Básico', dataResposta: '2026-06-09' },
        { habilidadeId: '2',  nivelRespondido: 'Básico', dataResposta: '2026-06-09' },
        { habilidadeId: '18', nivelRespondido: 'Básico', dataResposta: '2026-06-09' },
        { habilidadeId: '9',  nivelRespondido: 'Básico', dataResposta: '2026-06-09' },
        { habilidadeId: '21', nivelRespondido: 'Intermediário', dataResposta: '2026-06-09' },
        { habilidadeId: '22', nivelRespondido: 'Básico', dataResposta: '2026-06-09' },
      ]},
      { colaboradorId: '15', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Básico', dataResposta: '2026-06-17' },
        { habilidadeId: '2',  nivelRespondido: 'Básico', dataResposta: '2026-06-17' },
        { habilidadeId: '18', nivelRespondido: 'Básico', dataResposta: '2026-06-17' },
        { habilidadeId: '9',  nivelRespondido: 'Básico', dataResposta: '2026-06-17' },
        { habilidadeId: '21', nivelRespondido: 'Básico', dataResposta: '2026-06-17' },
        { habilidadeId: '22', nivelRespondido: 'Básico', dataResposta: '2026-06-17' },
      ]},
      { colaboradorId: '16', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Básico', dataResposta: '2026-06-19' },
        { habilidadeId: '2',  nivelRespondido: 'Básico', dataResposta: '2026-06-19' },
        { habilidadeId: '18', nivelRespondido: 'Básico', dataResposta: '2026-06-19' },
        { habilidadeId: '9',  nivelRespondido: 'Básico', dataResposta: '2026-06-19' },
        { habilidadeId: '21', nivelRespondido: 'Básico', dataResposta: '2026-06-19' },
        { habilidadeId: '22', nivelRespondido: 'Básico', dataResposta: '2026-06-19' },
      ]},
      { colaboradorId: '17', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Básico', dataResposta: '2026-06-21' },
        { habilidadeId: '2',  nivelRespondido: 'Básico', dataResposta: '2026-06-21' },
        { habilidadeId: '18', nivelRespondido: 'Básico', dataResposta: '2026-06-21' },
        { habilidadeId: '9',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-21' },
        { habilidadeId: '21', nivelRespondido: 'Básico', dataResposta: '2026-06-21' },
        { habilidadeId: '22', nivelRespondido: 'Básico', dataResposta: '2026-06-21' },
      ]},
      { colaboradorId: '18', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Básico', dataResposta: '2026-06-23' },
        { habilidadeId: '2',  nivelRespondido: 'Básico', dataResposta: '2026-06-23' },
        { habilidadeId: '18', nivelRespondido: 'Básico', dataResposta: '2026-06-23' },
        { habilidadeId: '9',  nivelRespondido: 'Básico', dataResposta: '2026-06-23' },
        { habilidadeId: '21', nivelRespondido: 'Básico', dataResposta: '2026-06-23' },
        { habilidadeId: '22', nivelRespondido: 'Básico', dataResposta: '2026-06-23' },
      ]},
      // c2 — Desenvolvedor Pleno
      { colaboradorId: '13', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-07' },
        { habilidadeId: '2',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-07' },
        { habilidadeId: '18', nivelRespondido: 'Avançado', dataResposta: '2026-06-07' },
        { habilidadeId: '9',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-07' },
        { habilidadeId: '10', nivelRespondido: 'Intermediário', dataResposta: '2026-06-07' },
        { habilidadeId: '14', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '21', nivelRespondido: 'Intermediário', dataResposta: '2026-06-07' },
        { habilidadeId: '22', nivelRespondido: 'Intermediário', dataResposta: '2026-06-07' },
      ]},
      { colaboradorId: '24', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-25' },
        { habilidadeId: '2',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-25' },
        { habilidadeId: '18', nivelRespondido: 'Intermediário', dataResposta: '2026-06-25' },
        { habilidadeId: '9',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-25' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '14', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '21', nivelRespondido: 'Intermediário', dataResposta: '2026-06-25' },
        { habilidadeId: '22', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
      ]},
      { colaboradorId: '25', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Avançado', dataResposta: '2026-06-27' },
        { habilidadeId: '2',  nivelRespondido: 'Avançado', dataResposta: '2026-06-27' },
        { habilidadeId: '18', nivelRespondido: 'Avançado', dataResposta: '2026-06-27' },
        { habilidadeId: '9',  nivelRespondido: 'Avançado', dataResposta: '2026-06-27' },
        { habilidadeId: '10', nivelRespondido: 'Intermediário', dataResposta: '2026-06-27' },
        { habilidadeId: '14', nivelRespondido: 'Intermediário', dataResposta: '2026-06-27' },
        { habilidadeId: '21', nivelRespondido: 'Avançado', dataResposta: '2026-06-27' },
        { habilidadeId: '22', nivelRespondido: 'Avançado', dataResposta: '2026-06-27' },
      ]},
      { colaboradorId: '26', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-29' },
        { habilidadeId: '2',  nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '18', nivelRespondido: 'Intermediário', dataResposta: '2026-06-29' },
        { habilidadeId: '9',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-29' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '14', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '21', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '22', nivelRespondido: 'Intermediário', dataResposta: '2026-06-29' },
      ]},
      { colaboradorId: '27', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Intermediário', dataResposta: '2026-07-01' },
        { habilidadeId: '2',  nivelRespondido: 'Avançado', dataResposta: '2026-07-01' },
        { habilidadeId: '18', nivelRespondido: 'Intermediário', dataResposta: '2026-07-01' },
        { habilidadeId: '9',  nivelRespondido: 'Intermediário', dataResposta: '2026-07-01' },
        { habilidadeId: '10', nivelRespondido: 'Intermediário', dataResposta: '2026-07-01' },
        { habilidadeId: '14', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '21', nivelRespondido: 'Avançado', dataResposta: '2026-07-01' },
        { habilidadeId: '22', nivelRespondido: 'Intermediário', dataResposta: '2026-07-01' },
      ]},
      { colaboradorId: '28', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '2',  nivelRespondido: 'Intermediário', dataResposta: '2026-07-03' },
        { habilidadeId: '18', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '9',  nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '14', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '21', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '22', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
      ]},
      { colaboradorId: '29', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Avançado', dataResposta: '2026-07-05' },
        { habilidadeId: '2',  nivelRespondido: 'Intermediário', dataResposta: '2026-07-05' },
        { habilidadeId: '18', nivelRespondido: 'Avançado', dataResposta: '2026-07-05' },
        { habilidadeId: '9',  nivelRespondido: 'Avançado', dataResposta: '2026-07-05' },
        { habilidadeId: '10', nivelRespondido: 'Avançado', dataResposta: '2026-07-05' },
        { habilidadeId: '14', nivelRespondido: 'Intermediário', dataResposta: '2026-07-05' },
        { habilidadeId: '21', nivelRespondido: 'Avançado', dataResposta: '2026-07-05' },
        { habilidadeId: '22', nivelRespondido: 'Avançado', dataResposta: '2026-07-05' },
      ]},
      { colaboradorId: '30', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '2',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '18', nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '9',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '10', nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '14', nivelRespondido: 'Básico', dataResposta: '2026-06-16' },
        { habilidadeId: '21', nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '22', nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
      ]},
      // c3 — Desenvolvedor Sênior
      { colaboradorId: '32', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Avançado', dataResposta: '2026-06-21' },
        { habilidadeId: '2',  nivelRespondido: 'Avançado', dataResposta: '2026-06-21' },
        { habilidadeId: '3',  nivelRespondido: 'Avançado', dataResposta: '2026-06-21' },
        { habilidadeId: '18', nivelRespondido: 'Avançado', dataResposta: '2026-06-21' },
        { habilidadeId: '9',  nivelRespondido: 'Avançado', dataResposta: '2026-06-21' },
        { habilidadeId: '10', nivelRespondido: 'Avançado', dataResposta: '2026-06-21' },
        { habilidadeId: '21', nivelRespondido: 'Avançado', dataResposta: '2026-06-21' },
        { habilidadeId: '22', nivelRespondido: 'Avançado', dataResposta: '2026-06-21' },
      ]},
      { colaboradorId: '33', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Avançado', dataResposta: '2026-06-23' },
        { habilidadeId: '2',  nivelRespondido: 'Especialista', dataResposta: '2026-06-23' },
        { habilidadeId: '3',  nivelRespondido: 'Avançado', dataResposta: '2026-06-23' },
        { habilidadeId: '18', nivelRespondido: 'Avançado', dataResposta: '2026-06-23' },
        { habilidadeId: '9',  nivelRespondido: 'Avançado', dataResposta: '2026-06-23' },
        { habilidadeId: '10', nivelRespondido: 'Avançado', dataResposta: '2026-06-23' },
        { habilidadeId: '21', nivelRespondido: 'Avançado', dataResposta: '2026-06-23' },
        { habilidadeId: '22', nivelRespondido: 'Avançado', dataResposta: '2026-06-23' },
      ]},
      { colaboradorId: '34', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Avançado', dataResposta: '2026-06-25' },
        { habilidadeId: '2',  nivelRespondido: 'Avançado', dataResposta: '2026-06-25' },
        { habilidadeId: '3',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-25' },
        { habilidadeId: '18', nivelRespondido: 'Avançado', dataResposta: '2026-06-25' },
        { habilidadeId: '9',  nivelRespondido: 'Avançado', dataResposta: '2026-06-25' },
        { habilidadeId: '10', nivelRespondido: 'Intermediário', dataResposta: '2026-06-25' },
        { habilidadeId: '21', nivelRespondido: 'Avançado', dataResposta: '2026-06-25' },
        { habilidadeId: '22', nivelRespondido: 'Avançado', dataResposta: '2026-06-25' },
      ]},
      { colaboradorId: '35', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Especialista', dataResposta: '2026-07-04' },
        { habilidadeId: '2',  nivelRespondido: 'Avançado', dataResposta: '2026-07-04' },
        { habilidadeId: '3',  nivelRespondido: 'Avançado', dataResposta: '2026-07-04' },
        { habilidadeId: '18', nivelRespondido: 'Especialista', dataResposta: '2026-07-04' },
        { habilidadeId: '9',  nivelRespondido: 'Avançado', dataResposta: '2026-07-04' },
        { habilidadeId: '10', nivelRespondido: 'Avançado', dataResposta: '2026-07-04' },
        { habilidadeId: '21', nivelRespondido: 'Avançado', dataResposta: '2026-07-04' },
        { habilidadeId: '22', nivelRespondido: 'Avançado', dataResposta: '2026-07-04' },
      ]},
      { colaboradorId: '36', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Avançado', dataResposta: '2026-07-06' },
        { habilidadeId: '2',  nivelRespondido: 'Avançado', dataResposta: '2026-07-06' },
        { habilidadeId: '3',  nivelRespondido: 'Avançado', dataResposta: '2026-07-06' },
        { habilidadeId: '18', nivelRespondido: 'Avançado', dataResposta: '2026-07-06' },
        { habilidadeId: '9',  nivelRespondido: 'Avançado', dataResposta: '2026-07-06' },
        { habilidadeId: '10', nivelRespondido: 'Avançado', dataResposta: '2026-07-06' },
        { habilidadeId: '21', nivelRespondido: 'Avançado', dataResposta: '2026-07-06' },
        { habilidadeId: '22', nivelRespondido: 'Avançado', dataResposta: '2026-07-06' },
      ]},
      { colaboradorId: '37', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Especialista', dataResposta: '2026-06-08' },
        { habilidadeId: '2',  nivelRespondido: 'Especialista', dataResposta: '2026-06-08' },
        { habilidadeId: '3',  nivelRespondido: 'Avançado', dataResposta: '2026-06-08' },
        { habilidadeId: '18', nivelRespondido: 'Avançado', dataResposta: '2026-06-08' },
        { habilidadeId: '9',  nivelRespondido: 'Avançado', dataResposta: '2026-06-08' },
        { habilidadeId: '10', nivelRespondido: 'Avançado', dataResposta: '2026-06-08' },
        { habilidadeId: '21', nivelRespondido: 'Especialista', dataResposta: '2026-06-08' },
        { habilidadeId: '22', nivelRespondido: 'Avançado', dataResposta: '2026-06-08' },
      ]},
      { colaboradorId: '38', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Avançado', dataResposta: '2026-06-10' },
        { habilidadeId: '2',  nivelRespondido: 'Avançado', dataResposta: '2026-06-10' },
        { habilidadeId: '3',  nivelRespondido: 'Avançado', dataResposta: '2026-06-10' },
        { habilidadeId: '18', nivelRespondido: 'Avançado', dataResposta: '2026-06-10' },
        { habilidadeId: '9',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-10' },
        { habilidadeId: '10', nivelRespondido: 'Avançado', dataResposta: '2026-06-10' },
        { habilidadeId: '21', nivelRespondido: 'Avançado', dataResposta: '2026-06-10' },
        { habilidadeId: '22', nivelRespondido: 'Avançado', dataResposta: '2026-06-10' },
      ]},
      // c4 — Tech Lead
      { colaboradorId: '40', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Especialista', dataResposta: '2026-06-24' },
        { habilidadeId: '2',  nivelRespondido: 'Especialista', dataResposta: '2026-06-24' },
        { habilidadeId: '18', nivelRespondido: 'Especialista', dataResposta: '2026-06-24' },
        { habilidadeId: '9',  nivelRespondido: 'Especialista', dataResposta: '2026-06-24' },
        { habilidadeId: '10', nivelRespondido: 'Avançado', dataResposta: '2026-06-24' },
        { habilidadeId: '21', nivelRespondido: 'Especialista', dataResposta: '2026-06-24' },
        { habilidadeId: '22', nivelRespondido: 'Especialista', dataResposta: '2026-06-24' },
        { habilidadeId: '86', nivelRespondido: 'Especialista', dataResposta: '2026-06-24' },
        { habilidadeId: '87', nivelRespondido: 'Avançado', dataResposta: '2026-06-24' },
        { habilidadeId: '88', nivelRespondido: 'Especialista', dataResposta: '2026-06-24' },
      ]},
      { colaboradorId: '41', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Avançado', dataResposta: '2026-06-26' },
        { habilidadeId: '2',  nivelRespondido: 'Avançado', dataResposta: '2026-06-26' },
        { habilidadeId: '18', nivelRespondido: 'Especialista', dataResposta: '2026-06-26' },
        { habilidadeId: '9',  nivelRespondido: 'Avançado', dataResposta: '2026-06-26' },
        { habilidadeId: '10', nivelRespondido: 'Avançado', dataResposta: '2026-06-26' },
        { habilidadeId: '21', nivelRespondido: 'Avançado', dataResposta: '2026-06-26' },
        { habilidadeId: '22', nivelRespondido: 'Especialista', dataResposta: '2026-06-26' },
        { habilidadeId: '86', nivelRespondido: 'Avançado', dataResposta: '2026-06-26' },
        { habilidadeId: '87', nivelRespondido: 'Avançado', dataResposta: '2026-06-26' },
        { habilidadeId: '88', nivelRespondido: 'Avançado', dataResposta: '2026-06-26' },
      ]},
      { colaboradorId: '42', status: 'Concluída', respostas: [
        { habilidadeId: '1',  nivelRespondido: 'Especialista', dataResposta: '2026-06-28' },
        { habilidadeId: '2',  nivelRespondido: 'Avançado', dataResposta: '2026-06-28' },
        { habilidadeId: '18', nivelRespondido: 'Especialista', dataResposta: '2026-06-28' },
        { habilidadeId: '9',  nivelRespondido: 'Especialista', dataResposta: '2026-06-28' },
        { habilidadeId: '10', nivelRespondido: 'Especialista', dataResposta: '2026-06-28' },
        { habilidadeId: '21', nivelRespondido: 'Especialista', dataResposta: '2026-06-28' },
        { habilidadeId: '22', nivelRespondido: 'Especialista', dataResposta: '2026-06-28' },
        { habilidadeId: '86', nivelRespondido: 'Especialista', dataResposta: '2026-06-28' },
        { habilidadeId: '87', nivelRespondido: 'Especialista', dataResposta: '2026-06-28' },
        { habilidadeId: '88', nivelRespondido: 'Especialista', dataResposta: '2026-06-28' },
      ]},
    ],
  },

  // ─── id=15 · Competências de Infraestrutura Q2 2026 · Encerrada ────────────
  {
    id: '15',
    nome: 'Competências de Infraestrutura Q2 2026',
    tipo: 'Autoavaliação',
    status: 'Encerrada',
    periodoInicio: '2026-05-01',
    periodoFim: '2026-05-31',
    publicoLabel: 'Gerência Infraestrutura',
    habilidades: ['9', '10', '53', '55', '56', '80', '81'],
    participantes: [
      // c5 — Analista de Infraestrutura Junior
      { colaboradorId: '7',  status: 'Concluída', respostas: [
        { habilidadeId: '80', nivelRespondido: 'Básico', dataResposta: '2026-06-18' },
        { habilidadeId: '53', nivelRespondido: 'Básico', dataResposta: '2026-06-18' },
        { habilidadeId: '56', nivelRespondido: 'Básico', dataResposta: '2026-06-18' },
        { habilidadeId: '9',  nivelRespondido: 'Básico', dataResposta: '2026-06-18' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-06-18' },
      ]},
      { colaboradorId: '14', status: 'Concluída', respostas: [
        { habilidadeId: '80', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
        { habilidadeId: '53', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
        { habilidadeId: '56', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
        { habilidadeId: '9',  nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
      ]},
      { colaboradorId: '43', status: 'Concluída', respostas: [
        { habilidadeId: '80', nivelRespondido: 'Básico', dataResposta: '2026-06-28' },
        { habilidadeId: '53', nivelRespondido: 'Básico', dataResposta: '2026-06-28' },
        { habilidadeId: '56', nivelRespondido: 'Básico', dataResposta: '2026-06-28' },
        { habilidadeId: '9',  nivelRespondido: 'Básico', dataResposta: '2026-06-28' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-06-28' },
      ]},
      { colaboradorId: '44', status: 'Concluída', respostas: [
        { habilidadeId: '80', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '53', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '56', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '9',  nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
      ]},
      { colaboradorId: '45', status: 'Concluída', respostas: [
        { habilidadeId: '80', nivelRespondido: 'Básico', dataResposta: '2026-06-09' },
        { habilidadeId: '53', nivelRespondido: 'Intermediário', dataResposta: '2026-06-09' },
        { habilidadeId: '56', nivelRespondido: 'Básico', dataResposta: '2026-06-09' },
        { habilidadeId: '9',  nivelRespondido: 'Básico', dataResposta: '2026-06-09' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-06-09' },
      ]},
      { colaboradorId: '46', status: 'Concluída', respostas: [
        { habilidadeId: '80', nivelRespondido: 'Básico', dataResposta: '2026-06-11' },
        { habilidadeId: '53', nivelRespondido: 'Básico', dataResposta: '2026-06-11' },
        { habilidadeId: '56', nivelRespondido: 'Básico', dataResposta: '2026-06-11' },
        { habilidadeId: '9',  nivelRespondido: 'Básico', dataResposta: '2026-06-11' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-06-11' },
      ]},
      // c6 — Analista de Infraestrutura Pleno
      { colaboradorId: '9',  status: 'Concluída', respostas: [
        { habilidadeId: '80', nivelRespondido: 'Intermediário', dataResposta: '2026-06-25' },
        { habilidadeId: '81', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '53', nivelRespondido: 'Intermediário', dataResposta: '2026-06-25' },
        { habilidadeId: '56', nivelRespondido: 'Intermediário', dataResposta: '2026-06-25' },
        { habilidadeId: '55', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '9',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-25' },
      ]},
      { colaboradorId: '49', status: 'Concluída', respostas: [
        { habilidadeId: '80', nivelRespondido: 'Avançado', dataResposta: '2026-06-18' },
        { habilidadeId: '81', nivelRespondido: 'Intermediário', dataResposta: '2026-06-18' },
        { habilidadeId: '53', nivelRespondido: 'Avançado', dataResposta: '2026-06-18' },
        { habilidadeId: '56', nivelRespondido: 'Avançado', dataResposta: '2026-06-18' },
        { habilidadeId: '55', nivelRespondido: 'Intermediário', dataResposta: '2026-06-18' },
        { habilidadeId: '9',  nivelRespondido: 'Intermediário', dataResposta: '2026-06-18' },
      ]},
    ],
  },

  // ─── id=16 · Financeiro Complementar Q2 2026 · Ativa ───────────────────────
  {
    id: '16',
    nome: 'Financeiro Complementar Q2 2026',
    tipo: 'Autoavaliação',
    status: 'Ativa',
    periodoInicio: '2026-06-01',
    periodoFim: '2026-06-30',
    publicoLabel: 'Gerência Financeiro',
    habilidades: ['110', '111', '112', '113', '114', '115', '117'],
    participantes: [
      { colaboradorId: '52', status: 'Concluída', respostas: [
        { habilidadeId: '110', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
        { habilidadeId: '111', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
        { habilidadeId: '112', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
        { habilidadeId: '117', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
      ]},
      { colaboradorId: '54', status: 'Concluída', respostas: [
        { habilidadeId: '110', nivelRespondido: 'Intermediário', dataResposta: '2026-06-10' },
        { habilidadeId: '111', nivelRespondido: 'Intermediário', dataResposta: '2026-06-10' },
        { habilidadeId: '112', nivelRespondido: 'Avançado', dataResposta: '2026-06-10' },
        { habilidadeId: '113', nivelRespondido: 'Intermediário', dataResposta: '2026-06-10' },
        { habilidadeId: '117', nivelRespondido: 'Intermediário', dataResposta: '2026-06-10' },
      ]},
      { colaboradorId: '55', status: 'Concluída', respostas: [
        { habilidadeId: '110', nivelRespondido: 'Intermediário', dataResposta: '2026-06-12' },
        { habilidadeId: '112', nivelRespondido: 'Intermediário', dataResposta: '2026-06-12' },
        { habilidadeId: '113', nivelRespondido: 'Intermediário', dataResposta: '2026-06-12' },
        { habilidadeId: '114', nivelRespondido: 'Básico', dataResposta: '2026-06-12' },
        { habilidadeId: '115', nivelRespondido: 'Básico', dataResposta: '2026-06-12' },
      ]},
      { colaboradorId: '56', status: 'Concluída', respostas: [
        { habilidadeId: '110', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
        { habilidadeId: '112', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
        { habilidadeId: '113', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
        { habilidadeId: '114', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
        { habilidadeId: '115', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
      ]},
    ],
  },

  // ─── id=17 · Design e Produto Designer Q2 2026 · Ativa ─────────────────────
  {
    id: '17',
    nome: 'Design e Produto Designer Q2 2026',
    tipo: 'Autoavaliação',
    status: 'Ativa',
    periodoInicio: '2026-06-01',
    periodoFim: '2026-06-30',
    publicoLabel: 'Gerências Design e Produto',
    habilidades: ['118', '119', '124', '125', '126', '127', '128', '129', '130'],
    participantes: [
      // j17 — Product Designer Junior (c14)
      { colaboradorId: '20', status: 'Concluída', respostas: [
        { habilidadeId: '118', nivelRespondido: 'Básico', dataResposta: '2026-06-28' },
        { habilidadeId: '119', nivelRespondido: 'Básico', dataResposta: '2026-06-28' },
        { habilidadeId: '124', nivelRespondido: 'Básico', dataResposta: '2026-06-28' },
        { habilidadeId: '125', nivelRespondido: 'Básico', dataResposta: '2026-06-28' },
        { habilidadeId: '127', nivelRespondido: 'Básico', dataResposta: '2026-06-28' },
      ]},
      { colaboradorId: '60', status: 'Concluída', respostas: [
        { habilidadeId: '118', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '119', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '124', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '125', nivelRespondido: 'Intermediário', dataResposta: '2026-06-07' },
        { habilidadeId: '127', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
      ]},
      // j20 — Designer Junior (c21)
      { colaboradorId: '21', status: 'Concluída', respostas: [
        { habilidadeId: '124', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '125', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '126', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '128', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '129', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
      ]},
      { colaboradorId: '68', status: 'Concluída', respostas: [
        { habilidadeId: '124', nivelRespondido: 'Básico', dataResposta: '2026-06-17' },
        { habilidadeId: '125', nivelRespondido: 'Básico', dataResposta: '2026-06-17' },
        { habilidadeId: '126', nivelRespondido: 'Básico', dataResposta: '2026-06-17' },
        { habilidadeId: '128', nivelRespondido: 'Básico', dataResposta: '2026-06-17' },
        { habilidadeId: '129', nivelRespondido: 'Básico', dataResposta: '2026-06-17' },
      ]},
      // j20 — Designer Pleno (c22)
      { colaboradorId: '70', status: 'Concluída', respostas: [
        { habilidadeId: '124', nivelRespondido: 'Intermediário', dataResposta: '2026-07-01' },
        { habilidadeId: '125', nivelRespondido: 'Avançado', dataResposta: '2026-07-01' },
        { habilidadeId: '126', nivelRespondido: 'Intermediário', dataResposta: '2026-07-01' },
        { habilidadeId: '128', nivelRespondido: 'Intermediário', dataResposta: '2026-07-01' },
        { habilidadeId: '129', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '130', nivelRespondido: 'Aprendiz', dataResposta: '2026-07-01' },
      ]},
    ],
  },

  // ─── Avaliações da gerência Tecnologia (ids 18–25) ─────────────────────────
  // Público-alvo = gerência Tecnologia (17 colaboradores reais de
  // colaboradoresData, cargos c1–c4 da jornada j1). João Silva (id='10')
  // participa das 8 — status e respostas combinados com Alice antes de
  // escrever (ver histórico da conversa "Meu Perfil"). Datas de resposta das
  // 3 avaliações Ativas evitam propositalmente 2026-07-05/06 (HOJE_SIMULADO
  // e véspera) para não alterar os cards "Avaliações respondidas" do
  // Dashboard como efeito colateral não pedido.

  // ─── id=18 · Competências Técnicas Q4 2025 · Encerrada ─────────────────────
  {
    id: '18',
    nome: 'Competências Técnicas Q4 2025',
    tipo: 'Autoavaliação',
    status: 'Encerrada',
    periodoInicio: '2025-10-01',
    periodoFim: '2025-10-31',
    publicoLabel: 'Gerência Tecnologia',
    habilidades: ['1', '2', '18'],
    participantes: [
      { colaboradorId: '1',  status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Avançado', dataResposta: '2025-10-16' },
        { habilidadeId: '2', nivelRespondido: 'Avançado', dataResposta: '2025-10-16' },
        { habilidadeId: '18', nivelRespondido: 'Avançado', dataResposta: '2025-10-16' },
      ]},
      { colaboradorId: '3',  status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Básico', dataResposta: '2025-10-17' },
        { habilidadeId: '2', nivelRespondido: 'Básico', dataResposta: '2025-10-17' },
        { habilidadeId: '18', nivelRespondido: 'Básico', dataResposta: '2025-10-17' },
      ]},
      { colaboradorId: '4',  status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Básico', dataResposta: '2025-10-18' },
        { habilidadeId: '2', nivelRespondido: 'Básico', dataResposta: '2025-10-18' },
        { habilidadeId: '18', nivelRespondido: 'Básico', dataResposta: '2025-10-18' },
      ]},
      { colaboradorId: '8',  status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Avançado', dataResposta: '2025-10-20' },
        { habilidadeId: '2', nivelRespondido: 'Avançado', dataResposta: '2025-10-20' },
        { habilidadeId: '18', nivelRespondido: 'Avançado', dataResposta: '2025-10-20' },
      ]},
      // João Silva — recém no cargo (início ~jul/2025), não respondeu a tempo.
      { colaboradorId: '10', status: 'Expirada', respostas: [] },
      { colaboradorId: '11', status: 'Expirada', respostas: [] },
      { colaboradorId: '13', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Básico', dataResposta: '2025-10-21' },
        { habilidadeId: '2', nivelRespondido: 'Básico', dataResposta: '2025-10-21' },
        { habilidadeId: '18', nivelRespondido: 'Básico', dataResposta: '2025-10-21' },
      ]},
      { colaboradorId: '16', status: 'Expirada', respostas: [] },
      { colaboradorId: '18', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Básico', dataResposta: '2025-10-19' },
        { habilidadeId: '2', nivelRespondido: 'Básico', dataResposta: '2025-10-19' },
        { habilidadeId: '18', nivelRespondido: 'Básico', dataResposta: '2025-10-19' },
      ]},
      { colaboradorId: '23', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Intermediário', dataResposta: '2025-10-22' },
        { habilidadeId: '2', nivelRespondido: 'Intermediário', dataResposta: '2025-10-22' },
        { habilidadeId: '18', nivelRespondido: 'Intermediário', dataResposta: '2025-10-22' },
      ]},
      { colaboradorId: '26', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Intermediário', dataResposta: '2025-10-23' },
        { habilidadeId: '2', nivelRespondido: 'Intermediário', dataResposta: '2025-10-23' },
        { habilidadeId: '18', nivelRespondido: 'Intermediário', dataResposta: '2025-10-23' },
      ]},
      { colaboradorId: '29', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Intermediário', dataResposta: '2025-10-24' },
        { habilidadeId: '2', nivelRespondido: 'Intermediário', dataResposta: '2025-10-24' },
        { habilidadeId: '18', nivelRespondido: 'Intermediário', dataResposta: '2025-10-24' },
      ]},
      { colaboradorId: '31', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Especialista', dataResposta: '2025-10-25' },
        { habilidadeId: '2', nivelRespondido: 'Especialista', dataResposta: '2025-10-25' },
        { habilidadeId: '18', nivelRespondido: 'Especialista', dataResposta: '2025-10-25' },
      ]},
      { colaboradorId: '35', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Intermediário', dataResposta: '2025-10-26' },
        { habilidadeId: '2', nivelRespondido: 'Intermediário', dataResposta: '2025-10-26' },
        { habilidadeId: '18', nivelRespondido: 'Intermediário', dataResposta: '2025-10-26' },
      ]},
      { colaboradorId: '38', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Avançado', dataResposta: '2025-10-27' },
        { habilidadeId: '2', nivelRespondido: 'Avançado', dataResposta: '2025-10-27' },
        { habilidadeId: '18', nivelRespondido: 'Avançado', dataResposta: '2025-10-27' },
      ]},
      { colaboradorId: '39', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Especialista', dataResposta: '2025-10-28' },
        { habilidadeId: '2', nivelRespondido: 'Especialista', dataResposta: '2025-10-28' },
        { habilidadeId: '18', nivelRespondido: 'Especialista', dataResposta: '2025-10-28' },
      ]},
      { colaboradorId: '42', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Especialista', dataResposta: '2025-10-29' },
        { habilidadeId: '2', nivelRespondido: 'Especialista', dataResposta: '2025-10-29' },
        { habilidadeId: '18', nivelRespondido: 'Especialista', dataResposta: '2025-10-29' },
      ]},
    ],
  },

  // ─── id=19 · Avaliação de Ferramentas e Versionamento · Encerrada ──────────
  {
    id: '19',
    nome: 'Avaliação de Ferramentas e Versionamento',
    tipo: 'Autoavaliação',
    status: 'Encerrada',
    periodoInicio: '2025-12-01',
    periodoFim: '2025-12-18',
    publicoLabel: 'Gerência Tecnologia',
    habilidades: ['3', '4', '18'],
    participantes: [
      { colaboradorId: '1',  status: 'Concluída', respostas: [
        { habilidadeId: '18', nivelRespondido: 'Avançado', dataResposta: '2025-12-08' },
        { habilidadeId: '3',  nivelRespondido: 'Avançado', dataResposta: '2025-12-08' },
        { habilidadeId: '4',  nivelRespondido: 'Avançado', dataResposta: '2025-12-08' },
      ]},
      { colaboradorId: '3',  status: 'Concluída', respostas: [
        { habilidadeId: '18', nivelRespondido: 'Básico', dataResposta: '2025-12-09' },
        { habilidadeId: '3',  nivelRespondido: 'Básico', dataResposta: '2025-12-09' },
        { habilidadeId: '4',  nivelRespondido: 'Básico', dataResposta: '2025-12-09' },
      ]},
      // Rafael Mendes não respondeu a tempo.
      { colaboradorId: '4',  status: 'Expirada', respostas: [] },
      { colaboradorId: '8',  status: 'Concluída', respostas: [
        { habilidadeId: '18', nivelRespondido: 'Avançado', dataResposta: '2025-12-10' },
        { habilidadeId: '3',  nivelRespondido: 'Avançado', dataResposta: '2025-12-10' },
        { habilidadeId: '4',  nivelRespondido: 'Avançado', dataResposta: '2025-12-10' },
      ]},
      { colaboradorId: '10', status: 'Concluída', respostas: [
        { habilidadeId: '18', nivelRespondido: 'Intermediário', dataResposta: '2025-12-11' },
        { habilidadeId: '3',  nivelRespondido: 'Intermediário', dataResposta: '2025-12-11' },
        { habilidadeId: '4',  nivelRespondido: 'Intermediário', dataResposta: '2025-12-11' },
      ]},
      { colaboradorId: '11', status: 'Concluída', respostas: [
        { habilidadeId: '18', nivelRespondido: 'Básico', dataResposta: '2025-12-06' },
        { habilidadeId: '3',  nivelRespondido: 'Básico', dataResposta: '2025-12-06' },
        { habilidadeId: '4',  nivelRespondido: 'Básico', dataResposta: '2025-12-06' },
      ]},
      { colaboradorId: '13', status: 'Concluída', respostas: [
        { habilidadeId: '18', nivelRespondido: 'Básico', dataResposta: '2025-12-12' },
        { habilidadeId: '3',  nivelRespondido: 'Básico', dataResposta: '2025-12-12' },
        { habilidadeId: '4',  nivelRespondido: 'Básico', dataResposta: '2025-12-12' },
      ]},
      { colaboradorId: '16', status: 'Concluída', respostas: [
        { habilidadeId: '18', nivelRespondido: 'Básico', dataResposta: '2025-12-13' },
        { habilidadeId: '3',  nivelRespondido: 'Básico', dataResposta: '2025-12-13' },
        { habilidadeId: '4',  nivelRespondido: 'Básico', dataResposta: '2025-12-13' },
      ]},
      { colaboradorId: '18', status: 'Concluída', respostas: [
        { habilidadeId: '18', nivelRespondido: 'Básico', dataResposta: '2025-12-14' },
        { habilidadeId: '3',  nivelRespondido: 'Básico', dataResposta: '2025-12-14' },
        { habilidadeId: '4',  nivelRespondido: 'Básico', dataResposta: '2025-12-14' },
      ]},
      // Gustavo Lima não respondeu a tempo.
      { colaboradorId: '23', status: 'Expirada', respostas: [] },
      { colaboradorId: '26', status: 'Concluída', respostas: [
        { habilidadeId: '18', nivelRespondido: 'Intermediário', dataResposta: '2025-12-15' },
        { habilidadeId: '3',  nivelRespondido: 'Intermediário', dataResposta: '2025-12-15' },
        { habilidadeId: '4',  nivelRespondido: 'Intermediário', dataResposta: '2025-12-15' },
      ]},
      { colaboradorId: '29', status: 'Concluída', respostas: [
        { habilidadeId: '18', nivelRespondido: 'Intermediário', dataResposta: '2025-12-16' },
        { habilidadeId: '3',  nivelRespondido: 'Intermediário', dataResposta: '2025-12-16' },
        { habilidadeId: '4',  nivelRespondido: 'Intermediário', dataResposta: '2025-12-16' },
      ]},
      { colaboradorId: '31', status: 'Concluída', respostas: [
        { habilidadeId: '18', nivelRespondido: 'Especialista', dataResposta: '2025-12-17' },
        { habilidadeId: '3',  nivelRespondido: 'Especialista', dataResposta: '2025-12-17' },
        { habilidadeId: '4',  nivelRespondido: 'Especialista', dataResposta: '2025-12-17' },
      ]},
      { colaboradorId: '35', status: 'Concluída', respostas: [
        { habilidadeId: '18', nivelRespondido: 'Intermediário', dataResposta: '2025-12-07' },
        { habilidadeId: '3',  nivelRespondido: 'Intermediário', dataResposta: '2025-12-07' },
        { habilidadeId: '4',  nivelRespondido: 'Intermediário', dataResposta: '2025-12-07' },
      ]},
      { colaboradorId: '38', status: 'Concluída', respostas: [
        { habilidadeId: '18', nivelRespondido: 'Avançado', dataResposta: '2025-12-11' },
        { habilidadeId: '3',  nivelRespondido: 'Avançado', dataResposta: '2025-12-11' },
        { habilidadeId: '4',  nivelRespondido: 'Avançado', dataResposta: '2025-12-11' },
      ]},
      { colaboradorId: '39', status: 'Concluída', respostas: [
        { habilidadeId: '18', nivelRespondido: 'Especialista', dataResposta: '2025-12-12' },
        { habilidadeId: '3',  nivelRespondido: 'Avançado', dataResposta: '2025-12-12' },
        { habilidadeId: '4',  nivelRespondido: 'Avançado', dataResposta: '2025-12-12' },
      ]},
      { colaboradorId: '42', status: 'Concluída', respostas: [
        { habilidadeId: '18', nivelRespondido: 'Especialista', dataResposta: '2025-12-13' },
        { habilidadeId: '3',  nivelRespondido: 'Avançado', dataResposta: '2025-12-13' },
        { habilidadeId: '4',  nivelRespondido: 'Avançado', dataResposta: '2025-12-13' },
      ]},
    ],
  },

  // ─── id=20 · Fundamentos de Frontend Avançado · Encerrada ──────────────────
  {
    id: '20',
    nome: 'Fundamentos de Frontend Avançado',
    tipo: 'Autoavaliação',
    status: 'Encerrada',
    periodoInicio: '2026-02-02',
    periodoFim: '2026-02-20',
    publicoLabel: 'Gerência Tecnologia',
    habilidades: ['1', '50', '51'],
    participantes: [
      { colaboradorId: '1',  status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Avançado', dataResposta: '2026-02-09' },
        { habilidadeId: '50', nivelRespondido: 'Avançado', dataResposta: '2026-02-09' },
        { habilidadeId: '51', nivelRespondido: 'Avançado', dataResposta: '2026-02-09' },
      ]},
      { colaboradorId: '3',  status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Básico', dataResposta: '2026-02-10' },
        { habilidadeId: '50', nivelRespondido: 'Básico', dataResposta: '2026-02-10' },
        { habilidadeId: '51', nivelRespondido: 'Básico', dataResposta: '2026-02-10' },
      ]},
      { colaboradorId: '4',  status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Básico', dataResposta: '2026-02-11' },
        { habilidadeId: '50', nivelRespondido: 'Básico', dataResposta: '2026-02-11' },
        { habilidadeId: '51', nivelRespondido: 'Básico', dataResposta: '2026-02-11' },
      ]},
      { colaboradorId: '8',  status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Avançado', dataResposta: '2026-02-12' },
        { habilidadeId: '50', nivelRespondido: 'Avançado', dataResposta: '2026-02-12' },
        { habilidadeId: '51', nivelRespondido: 'Avançado', dataResposta: '2026-02-12' },
      ]},
      { colaboradorId: '10', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Intermediário', dataResposta: '2026-02-13' },
        { habilidadeId: '50', nivelRespondido: 'Intermediário', dataResposta: '2026-02-13' },
        { habilidadeId: '51', nivelRespondido: 'Intermediário', dataResposta: '2026-02-13' },
      ]},
      { colaboradorId: '11', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Básico', dataResposta: '2026-02-08' },
        { habilidadeId: '50', nivelRespondido: 'Básico', dataResposta: '2026-02-08' },
        { habilidadeId: '51', nivelRespondido: 'Básico', dataResposta: '2026-02-08' },
      ]},
      { colaboradorId: '13', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Básico', dataResposta: '2026-02-14' },
        { habilidadeId: '50', nivelRespondido: 'Básico', dataResposta: '2026-02-14' },
        { habilidadeId: '51', nivelRespondido: 'Básico', dataResposta: '2026-02-14' },
      ]},
      { colaboradorId: '16', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Básico', dataResposta: '2026-02-15' },
        { habilidadeId: '50', nivelRespondido: 'Básico', dataResposta: '2026-02-15' },
        { habilidadeId: '51', nivelRespondido: 'Básico', dataResposta: '2026-02-15' },
      ]},
      { colaboradorId: '18', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Básico', dataResposta: '2026-02-16' },
        { habilidadeId: '50', nivelRespondido: 'Básico', dataResposta: '2026-02-16' },
        { habilidadeId: '51', nivelRespondido: 'Básico', dataResposta: '2026-02-16' },
      ]},
      { colaboradorId: '23', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Intermediário', dataResposta: '2026-02-17' },
        { habilidadeId: '50', nivelRespondido: 'Intermediário', dataResposta: '2026-02-17' },
        { habilidadeId: '51', nivelRespondido: 'Intermediário', dataResposta: '2026-02-17' },
      ]},
      { colaboradorId: '26', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Intermediário', dataResposta: '2026-02-18' },
        { habilidadeId: '50', nivelRespondido: 'Intermediário', dataResposta: '2026-02-18' },
        { habilidadeId: '51', nivelRespondido: 'Intermediário', dataResposta: '2026-02-18' },
      ]},
      // Diego Araújo não respondeu a tempo.
      { colaboradorId: '29', status: 'Expirada', respostas: [] },
      { colaboradorId: '31', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Especialista', dataResposta: '2026-02-19' },
        { habilidadeId: '50', nivelRespondido: 'Especialista', dataResposta: '2026-02-19' },
        { habilidadeId: '51', nivelRespondido: 'Especialista', dataResposta: '2026-02-19' },
      ]},
      { colaboradorId: '35', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Intermediário', dataResposta: '2026-02-10' },
        { habilidadeId: '50', nivelRespondido: 'Intermediário', dataResposta: '2026-02-10' },
        { habilidadeId: '51', nivelRespondido: 'Intermediário', dataResposta: '2026-02-10' },
      ]},
      // Sandra Rocha não respondeu a tempo.
      { colaboradorId: '38', status: 'Expirada', respostas: [] },
      { colaboradorId: '39', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Especialista', dataResposta: '2026-02-11' },
        { habilidadeId: '50', nivelRespondido: 'Avançado', dataResposta: '2026-02-11' },
        { habilidadeId: '51', nivelRespondido: 'Avançado', dataResposta: '2026-02-11' },
      ]},
      { colaboradorId: '42', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Especialista', dataResposta: '2026-02-12' },
        { habilidadeId: '50', nivelRespondido: 'Avançado', dataResposta: '2026-02-12' },
        { habilidadeId: '51', nivelRespondido: 'Avançado', dataResposta: '2026-02-12' },
      ]},
    ],
  },

  // ─── id=21 · Boas Práticas de Colaboração em Equipe · Encerrada ────────────
  {
    id: '21',
    nome: 'Boas Práticas de Colaboração em Equipe',
    tipo: 'Autoavaliação',
    status: 'Encerrada',
    periodoInicio: '2026-04-06',
    periodoFim: '2026-04-24',
    publicoLabel: 'Gerência Tecnologia',
    habilidades: ['9', '10', '21', '22'],
    participantes: [
      { colaboradorId: '1',  status: 'Concluída', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Avançado', dataResposta: '2026-04-11' },
        { habilidadeId: '10', nivelRespondido: 'Avançado', dataResposta: '2026-04-11' },
        { habilidadeId: '21', nivelRespondido: 'Avançado', dataResposta: '2026-04-11' },
        { habilidadeId: '22', nivelRespondido: 'Avançado', dataResposta: '2026-04-11' },
      ]},
      { colaboradorId: '3',  status: 'Concluída', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Básico', dataResposta: '2026-04-12' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-04-12' },
        { habilidadeId: '21', nivelRespondido: 'Básico', dataResposta: '2026-04-12' },
        { habilidadeId: '22', nivelRespondido: 'Básico', dataResposta: '2026-04-12' },
      ]},
      { colaboradorId: '4',  status: 'Concluída', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Básico', dataResposta: '2026-04-13' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-04-13' },
        { habilidadeId: '21', nivelRespondido: 'Básico', dataResposta: '2026-04-13' },
        { habilidadeId: '22', nivelRespondido: 'Básico', dataResposta: '2026-04-13' },
      ]},
      // Thiago Rodrigues não respondeu a tempo.
      { colaboradorId: '8',  status: 'Expirada', respostas: [] },
      { colaboradorId: '10', status: 'Concluída', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Intermediário', dataResposta: '2026-04-14' },
        { habilidadeId: '10', nivelRespondido: 'Intermediário', dataResposta: '2026-04-14' },
        { habilidadeId: '21', nivelRespondido: 'Intermediário', dataResposta: '2026-04-14' },
        { habilidadeId: '22', nivelRespondido: 'Intermediário', dataResposta: '2026-04-14' },
      ]},
      { colaboradorId: '11', status: 'Concluída', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Básico', dataResposta: '2026-04-10' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-04-10' },
        { habilidadeId: '21', nivelRespondido: 'Básico', dataResposta: '2026-04-10' },
        { habilidadeId: '22', nivelRespondido: 'Básico', dataResposta: '2026-04-10' },
      ]},
      { colaboradorId: '13', status: 'Concluída', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Básico', dataResposta: '2026-04-15' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-04-15' },
        { habilidadeId: '21', nivelRespondido: 'Básico', dataResposta: '2026-04-15' },
        { habilidadeId: '22', nivelRespondido: 'Básico', dataResposta: '2026-04-15' },
      ]},
      { colaboradorId: '16', status: 'Concluída', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Básico', dataResposta: '2026-04-16' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-04-16' },
        { habilidadeId: '21', nivelRespondido: 'Básico', dataResposta: '2026-04-16' },
        { habilidadeId: '22', nivelRespondido: 'Básico', dataResposta: '2026-04-16' },
      ]},
      { colaboradorId: '18', status: 'Concluída', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Básico', dataResposta: '2026-04-17' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-04-17' },
        { habilidadeId: '21', nivelRespondido: 'Básico', dataResposta: '2026-04-17' },
        { habilidadeId: '22', nivelRespondido: 'Básico', dataResposta: '2026-04-17' },
      ]},
      { colaboradorId: '23', status: 'Concluída', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Intermediário', dataResposta: '2026-04-18' },
        { habilidadeId: '10', nivelRespondido: 'Intermediário', dataResposta: '2026-04-18' },
        { habilidadeId: '21', nivelRespondido: 'Intermediário', dataResposta: '2026-04-18' },
        { habilidadeId: '22', nivelRespondido: 'Intermediário', dataResposta: '2026-04-18' },
      ]},
      { colaboradorId: '26', status: 'Concluída', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Intermediário', dataResposta: '2026-04-19' },
        { habilidadeId: '10', nivelRespondido: 'Intermediário', dataResposta: '2026-04-19' },
        { habilidadeId: '21', nivelRespondido: 'Intermediário', dataResposta: '2026-04-19' },
        { habilidadeId: '22', nivelRespondido: 'Intermediário', dataResposta: '2026-04-19' },
      ]},
      { colaboradorId: '29', status: 'Concluída', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Intermediário', dataResposta: '2026-04-20' },
        { habilidadeId: '10', nivelRespondido: 'Intermediário', dataResposta: '2026-04-20' },
        { habilidadeId: '21', nivelRespondido: 'Intermediário', dataResposta: '2026-04-20' },
        { habilidadeId: '22', nivelRespondido: 'Intermediário', dataResposta: '2026-04-20' },
      ]},
      { colaboradorId: '31', status: 'Concluída', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Especialista', dataResposta: '2026-04-21' },
        { habilidadeId: '10', nivelRespondido: 'Especialista', dataResposta: '2026-04-21' },
        { habilidadeId: '21', nivelRespondido: 'Especialista', dataResposta: '2026-04-21' },
        { habilidadeId: '22', nivelRespondido: 'Especialista', dataResposta: '2026-04-21' },
      ]},
      { colaboradorId: '35', status: 'Concluída', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Intermediário', dataResposta: '2026-04-22' },
        { habilidadeId: '10', nivelRespondido: 'Intermediário', dataResposta: '2026-04-22' },
        { habilidadeId: '21', nivelRespondido: 'Intermediário', dataResposta: '2026-04-22' },
        { habilidadeId: '22', nivelRespondido: 'Intermediário', dataResposta: '2026-04-22' },
      ]},
      { colaboradorId: '38', status: 'Concluída', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Avançado', dataResposta: '2026-04-23' },
        { habilidadeId: '10', nivelRespondido: 'Avançado', dataResposta: '2026-04-23' },
        { habilidadeId: '21', nivelRespondido: 'Avançado', dataResposta: '2026-04-23' },
        { habilidadeId: '22', nivelRespondido: 'Avançado', dataResposta: '2026-04-23' },
      ]},
      { colaboradorId: '39', status: 'Concluída', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Especialista', dataResposta: '2026-04-13' },
        { habilidadeId: '10', nivelRespondido: 'Especialista', dataResposta: '2026-04-13' },
        { habilidadeId: '21', nivelRespondido: 'Especialista', dataResposta: '2026-04-13' },
        { habilidadeId: '22', nivelRespondido: 'Especialista', dataResposta: '2026-04-13' },
      ]},
      // Luciana Nogueira não respondeu a tempo.
      { colaboradorId: '42', status: 'Expirada', respostas: [] },
    ],
  },

  // ─── id=22 · Avaliação de Metodologias Ágeis · Encerrada ───────────────────
  {
    id: '22',
    nome: 'Avaliação de Metodologias Ágeis',
    tipo: 'Autoavaliação',
    status: 'Encerrada',
    periodoInicio: '2026-05-11',
    periodoFim: '2026-05-29',
    publicoLabel: 'Gerência Tecnologia',
    habilidades: ['11', '12'],
    participantes: [
      { colaboradorId: '1',  status: 'Concluída', respostas: [
        { habilidadeId: '11', nivelRespondido: 'Avançado', dataResposta: '2026-05-16' },
        { habilidadeId: '12', nivelRespondido: 'Avançado', dataResposta: '2026-05-16' },
      ]},
      { colaboradorId: '3',  status: 'Concluída', respostas: [
        { habilidadeId: '11', nivelRespondido: 'Básico', dataResposta: '2026-05-17' },
        { habilidadeId: '12', nivelRespondido: 'Básico', dataResposta: '2026-05-17' },
      ]},
      { colaboradorId: '4',  status: 'Concluída', respostas: [
        { habilidadeId: '11', nivelRespondido: 'Básico', dataResposta: '2026-05-18' },
        { habilidadeId: '12', nivelRespondido: 'Básico', dataResposta: '2026-05-18' },
      ]},
      { colaboradorId: '8',  status: 'Concluída', respostas: [
        { habilidadeId: '11', nivelRespondido: 'Avançado', dataResposta: '2026-05-19' },
        { habilidadeId: '12', nivelRespondido: 'Intermediário', dataResposta: '2026-05-19' },
      ]},
      { colaboradorId: '10', status: 'Concluída', respostas: [
        { habilidadeId: '11', nivelRespondido: 'Intermediário', dataResposta: '2026-05-20' },
        { habilidadeId: '12', nivelRespondido: 'Básico', dataResposta: '2026-05-20' },
      ]},
      { colaboradorId: '11', status: 'Concluída', respostas: [
        { habilidadeId: '11', nivelRespondido: 'Básico', dataResposta: '2026-05-15' },
        { habilidadeId: '12', nivelRespondido: 'Básico', dataResposta: '2026-05-15' },
      ]},
      // Juliana Martins não respondeu a tempo.
      { colaboradorId: '13', status: 'Expirada', respostas: [] },
      { colaboradorId: '16', status: 'Concluída', respostas: [
        { habilidadeId: '11', nivelRespondido: 'Básico', dataResposta: '2026-05-21' },
        { habilidadeId: '12', nivelRespondido: 'Básico', dataResposta: '2026-05-21' },
      ]},
      { colaboradorId: '18', status: 'Concluída', respostas: [
        { habilidadeId: '11', nivelRespondido: 'Básico', dataResposta: '2026-05-22' },
        { habilidadeId: '12', nivelRespondido: 'Básico', dataResposta: '2026-05-22' },
      ]},
      { colaboradorId: '23', status: 'Concluída', respostas: [
        { habilidadeId: '11', nivelRespondido: 'Intermediário', dataResposta: '2026-05-23' },
        { habilidadeId: '12', nivelRespondido: 'Básico', dataResposta: '2026-05-23' },
      ]},
      { colaboradorId: '26', status: 'Concluída', respostas: [
        { habilidadeId: '11', nivelRespondido: 'Intermediário', dataResposta: '2026-05-24' },
        { habilidadeId: '12', nivelRespondido: 'Básico', dataResposta: '2026-05-24' },
      ]},
      { colaboradorId: '29', status: 'Concluída', respostas: [
        { habilidadeId: '11', nivelRespondido: 'Intermediário', dataResposta: '2026-05-25' },
        { habilidadeId: '12', nivelRespondido: 'Básico', dataResposta: '2026-05-25' },
      ]},
      // Eduardo Correia não respondeu a tempo.
      { colaboradorId: '31', status: 'Expirada', respostas: [] },
      { colaboradorId: '35', status: 'Concluída', respostas: [
        { habilidadeId: '11', nivelRespondido: 'Intermediário', dataResposta: '2026-05-26' },
        { habilidadeId: '12', nivelRespondido: 'Básico', dataResposta: '2026-05-26' },
      ]},
      { colaboradorId: '38', status: 'Concluída', respostas: [
        { habilidadeId: '11', nivelRespondido: 'Avançado', dataResposta: '2026-05-27' },
        { habilidadeId: '12', nivelRespondido: 'Intermediário', dataResposta: '2026-05-27' },
      ]},
      { colaboradorId: '39', status: 'Concluída', respostas: [
        { habilidadeId: '11', nivelRespondido: 'Avançado', dataResposta: '2026-05-28' },
        { habilidadeId: '12', nivelRespondido: 'Avançado', dataResposta: '2026-05-28' },
      ]},
      { colaboradorId: '42', status: 'Concluída', respostas: [
        { habilidadeId: '11', nivelRespondido: 'Avançado', dataResposta: '2026-05-19' },
        { habilidadeId: '12', nivelRespondido: 'Avançado', dataResposta: '2026-05-19' },
      ]},
    ],
  },

  // ─── id=23 · Competências Técnicas Q3 2026 · Ativa ─────────────────────────
  {
    id: '23',
    nome: 'Competências Técnicas Q3 2026',
    tipo: 'Autoavaliação',
    status: 'Ativa',
    periodoInicio: '2026-06-01',
    periodoFim: '2026-08-10',
    publicoLabel: 'Gerência Tecnologia',
    habilidades: ['1', '2', '3', '4', '18'],
    participantes: [
      { colaboradorId: '1',  status: 'Em andamento', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Avançado', dataResposta: '2026-06-26' },
        { habilidadeId: '2', nivelRespondido: 'Avançado', dataResposta: '2026-06-26' },
      ]},
      { colaboradorId: '3',  status: 'Não iniciada', respostas: [] },
      { colaboradorId: '4',  status: 'Não iniciada', respostas: [] },
      { colaboradorId: '8',  status: 'Não iniciada', respostas: [] },
      { colaboradorId: '10', status: 'Em andamento', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Avançado', dataResposta: '2026-07-04' },
        { habilidadeId: '2', nivelRespondido: 'Avançado', dataResposta: '2026-07-04' },
      ]},
      { colaboradorId: '11', status: 'Não iniciada', respostas: [] },
      { colaboradorId: '13', status: 'Em andamento', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '2', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
      ]},
      { colaboradorId: '16', status: 'Não iniciada', respostas: [] },
      { colaboradorId: '18', status: 'Não iniciada', respostas: [] },
      { colaboradorId: '23', status: 'Em andamento', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Intermediário', dataResposta: '2026-06-28' },
        { habilidadeId: '2', nivelRespondido: 'Intermediário', dataResposta: '2026-06-28' },
      ]},
      { colaboradorId: '26', status: 'Em andamento', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Intermediário', dataResposta: '2026-06-29' },
        { habilidadeId: '2', nivelRespondido: 'Intermediário', dataResposta: '2026-06-29' },
      ]},
      { colaboradorId: '29', status: 'Em andamento', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Intermediário', dataResposta: '2026-06-30' },
        { habilidadeId: '2', nivelRespondido: 'Intermediário', dataResposta: '2026-06-30' },
      ]},
      { colaboradorId: '31', status: 'Não iniciada', respostas: [] },
      { colaboradorId: '35', status: 'Não iniciada', respostas: [] },
      { colaboradorId: '38', status: 'Não iniciada', respostas: [] },
      { colaboradorId: '39', status: 'Em andamento', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Especialista', dataResposta: '2026-07-01' },
        { habilidadeId: '2', nivelRespondido: 'Especialista', dataResposta: '2026-07-01' },
      ]},
      { colaboradorId: '42', status: 'Em andamento', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Especialista', dataResposta: '2026-07-02' },
        { habilidadeId: '2', nivelRespondido: 'Especialista', dataResposta: '2026-07-02' },
      ]},
    ],
  },

  // ─── id=24 · Avaliação de Liderança Técnica e Comunicação · Ativa ──────────
  {
    id: '24',
    nome: 'Avaliação de Liderança Técnica e Comunicação',
    tipo: 'Autoavaliação',
    status: 'Ativa',
    periodoInicio: '2026-07-01',
    periodoFim: '2026-07-25',
    publicoLabel: 'Gerência Tecnologia',
    habilidades: ['9', '10', '14', '23'],
    participantes: [
      { colaboradorId: '1',  status: 'Não iniciada', respostas: [] },
      { colaboradorId: '3',  status: 'Em andamento', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Básico', dataResposta: '2026-07-02' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-07-02' },
      ]},
      { colaboradorId: '4',  status: 'Em andamento', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
      ]},
      { colaboradorId: '8',  status: 'Em andamento', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Avançado', dataResposta: '2026-07-04' },
        { habilidadeId: '10', nivelRespondido: 'Avançado', dataResposta: '2026-07-04' },
      ]},
      { colaboradorId: '10', status: 'Não iniciada', respostas: [] },
      { colaboradorId: '11', status: 'Em andamento', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Básico', dataResposta: '2026-07-02' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-07-02' },
      ]},
      { colaboradorId: '13', status: 'Não iniciada', respostas: [] },
      { colaboradorId: '16', status: 'Em andamento', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
      ]},
      { colaboradorId: '18', status: 'Em andamento', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Básico', dataResposta: '2026-07-04' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-07-04' },
      ]},
      { colaboradorId: '23', status: 'Não iniciada', respostas: [] },
      { colaboradorId: '26', status: 'Não iniciada', respostas: [] },
      { colaboradorId: '29', status: 'Não iniciada', respostas: [] },
      { colaboradorId: '31', status: 'Em andamento', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Especialista', dataResposta: '2026-07-03' },
        { habilidadeId: '10', nivelRespondido: 'Especialista', dataResposta: '2026-07-03' },
      ]},
      { colaboradorId: '35', status: 'Em andamento', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Intermediário', dataResposta: '2026-07-02' },
        { habilidadeId: '10', nivelRespondido: 'Intermediário', dataResposta: '2026-07-02' },
      ]},
      { colaboradorId: '38', status: 'Em andamento', respostas: [
        { habilidadeId: '9', nivelRespondido: 'Avançado', dataResposta: '2026-07-04' },
        { habilidadeId: '10', nivelRespondido: 'Avançado', dataResposta: '2026-07-04' },
      ]},
      { colaboradorId: '39', status: 'Não iniciada', respostas: [] },
      { colaboradorId: '42', status: 'Não iniciada', respostas: [] },
    ],
  },

  // ─── id=25 · Avaliação de Práticas de Testes e Qualidade · Ativa ───────────
  {
    id: '25',
    nome: 'Avaliação de Práticas de Testes e Qualidade',
    tipo: 'Autoavaliação',
    status: 'Ativa',
    periodoInicio: '2026-06-20',
    periodoFim: '2026-07-20',
    publicoLabel: 'Gerência Tecnologia',
    habilidades: ['74', '11', '12'],
    participantes: [
      { colaboradorId: '1',  status: 'Não iniciada', respostas: [] },
      { colaboradorId: '3',  status: 'Não iniciada', respostas: [] },
      { colaboradorId: '4',  status: 'Em andamento', respostas: [
        { habilidadeId: '74', nivelRespondido: 'Básico', dataResposta: '2026-06-23' },
      ]},
      { colaboradorId: '8',  status: 'Em andamento', respostas: [
        { habilidadeId: '74', nivelRespondido: 'Avançado', dataResposta: '2026-06-24' },
      ]},
      { colaboradorId: '10', status: 'Não iniciada', respostas: [] },
      { colaboradorId: '11', status: 'Não iniciada', respostas: [] },
      { colaboradorId: '13', status: 'Não iniciada', respostas: [] },
      { colaboradorId: '16', status: 'Em andamento', respostas: [
        { habilidadeId: '74', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
      ]},
      { colaboradorId: '18', status: 'Não iniciada', respostas: [] },
      { colaboradorId: '23', status: 'Em andamento', respostas: [
        { habilidadeId: '74', nivelRespondido: 'Intermediário', dataResposta: '2026-06-26' },
      ]},
      { colaboradorId: '26', status: 'Não iniciada', respostas: [] },
      { colaboradorId: '29', status: 'Em andamento', respostas: [
        { habilidadeId: '74', nivelRespondido: 'Intermediário', dataResposta: '2026-06-27' },
      ]},
      { colaboradorId: '31', status: 'Não iniciada', respostas: [] },
      { colaboradorId: '35', status: 'Em andamento', respostas: [
        { habilidadeId: '74', nivelRespondido: 'Intermediário', dataResposta: '2026-06-28' },
      ]},
      { colaboradorId: '38', status: 'Não iniciada', respostas: [] },
      { colaboradorId: '39', status: 'Em andamento', respostas: [
        { habilidadeId: '74', nivelRespondido: 'Especialista', dataResposta: '2026-06-29' },
      ]},
      { colaboradorId: '42', status: 'Não iniciada', respostas: [] },
    ],
  },

  // ─── id=26 · Consolidação de Competências — Desenvolvedor Pleno · Encerrada ──
  // Migrada de avaliacoesColaboradoresData (extinta) — cada participante mantém a
  // dataResposta original que tinha no snapshot. Cobre os 11 colaboradores do
  // cargo c2 (Desenvolvedor Pleno). periodoFim não é mais usado como critério de
  // recência (ver getHabilidadesAvaliadasColaborador) — só dataResposta individual
  // decide qual resposta vence quando há mais de uma avaliação pra mesma habilidade.
  {
    id: '26',
    nome: 'Consolidação de Competências — Desenvolvedor Pleno',
    tipo: 'Autoavaliação',
    status: 'Encerrada',
    periodoInicio: '2026-05-15',
    periodoFim: '2026-05-30',
    publicoLabel: 'Cargo Desenvolvedor Pleno',
    habilidades: ['1', '2', '3', '4', '9', '10', '11', '12', '14', '18', '21', '22', '23', '50', '51', '52', '53', '54', '56', '59', '60', '61', '62', '63', '64', '65', '66', '68', '69', '70', '74', '75', '76', '77', '83', '86', '87', '88', '91', '92', '95', '98', '104', '107', '147', '148', '149', '150', '151', '152', '153'],
    participantes: [
      // Ana Silva (id='1')
      { colaboradorId: '1', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Intermediário', dataResposta: '2026-01-15' },
        { habilidadeId: '2', nivelRespondido: 'Intermediário', dataResposta: '2026-01-15' },
        { habilidadeId: '3', nivelRespondido: 'Básico', dataResposta: '2026-01-15' },
        { habilidadeId: '4', nivelRespondido: 'Básico', dataResposta: '2026-01-15' },
        { habilidadeId: '18', nivelRespondido: 'Intermediário', dataResposta: '2026-01-15' },
        { habilidadeId: '9', nivelRespondido: 'Avançado', dataResposta: '2026-01-15' },
        { habilidadeId: '10', nivelRespondido: 'Intermediário', dataResposta: '2026-01-15' },
        { habilidadeId: '11', nivelRespondido: 'Intermediário', dataResposta: '2026-01-15' },
        { habilidadeId: '12', nivelRespondido: 'Básico', dataResposta: '2026-01-15' },
        { habilidadeId: '21', nivelRespondido: 'Básico', dataResposta: '2026-01-15' },
        { habilidadeId: '22', nivelRespondido: 'Intermediário', dataResposta: '2026-01-15' },
        { habilidadeId: '23', nivelRespondido: 'Básico', dataResposta: '2026-01-15' },
        { habilidadeId: '14', nivelRespondido: 'Básico', dataResposta: '2026-01-15' },
      ]},
      // João Silva (id='10')
      { colaboradorId: '10', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Avançado', dataResposta: '2026-03-10' },
        { habilidadeId: '2', nivelRespondido: 'Avançado', dataResposta: '2026-03-10' },
        { habilidadeId: '3', nivelRespondido: 'Intermediário', dataResposta: '2026-03-10' },
        { habilidadeId: '4', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '18', nivelRespondido: 'Avançado', dataResposta: '2026-03-10' },
        { habilidadeId: '9', nivelRespondido: 'Intermediário', dataResposta: '2026-03-10' },
        { habilidadeId: '10', nivelRespondido: 'Intermediário', dataResposta: '2026-03-10' },
        { habilidadeId: '11', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '12', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '21', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '22', nivelRespondido: 'Intermediário', dataResposta: '2026-03-10' },
        { habilidadeId: '50', nivelRespondido: 'Intermediário', dataResposta: '2026-03-10' },
        { habilidadeId: '51', nivelRespondido: 'Intermediário', dataResposta: '2026-03-10' },
        { habilidadeId: '74', nivelRespondido: 'Intermediário', dataResposta: '2026-03-10' },
        { habilidadeId: '91', nivelRespondido: 'Intermediário', dataResposta: '2026-03-10' },
        { habilidadeId: '86', nivelRespondido: 'Intermediário', dataResposta: '2026-03-10' },
        { habilidadeId: '75', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '76', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '68', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '147', nivelRespondido: 'Intermediário', dataResposta: '2026-03-10' },
        { habilidadeId: '148', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '150', nivelRespondido: 'Avançado', dataResposta: '2026-03-10' },
        { habilidadeId: '151', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '152', nivelRespondido: 'Intermediário', dataResposta: '2026-03-10' },
        { habilidadeId: '61', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '64', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '70', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '52', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '53', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '54', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '56', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '59', nivelRespondido: 'Intermediário', dataResposta: '2026-03-10' },
        { habilidadeId: '60', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '62', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '63', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '65', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '66', nivelRespondido: 'Intermediário', dataResposta: '2026-03-10' },
        { habilidadeId: '69', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '77', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '83', nivelRespondido: 'Intermediário', dataResposta: '2026-03-10' },
        { habilidadeId: '87', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
        { habilidadeId: '92', nivelRespondido: 'Intermediário', dataResposta: '2026-03-10' },
        { habilidadeId: '95', nivelRespondido: 'Intermediário', dataResposta: '2026-03-10' },
        { habilidadeId: '98', nivelRespondido: 'Intermediário', dataResposta: '2026-03-10' },
        { habilidadeId: '104', nivelRespondido: 'Básico', dataResposta: '2026-03-10' },
      ]},
      // Gustavo Lima (id='23')
      { colaboradorId: '23', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Intermediário', dataResposta: '2026-06-14' },
        { habilidadeId: '2', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
        { habilidadeId: '3', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
        { habilidadeId: '4', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
        { habilidadeId: '9', nivelRespondido: 'Intermediário', dataResposta: '2026-06-14' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
        { habilidadeId: '11', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
        { habilidadeId: '18', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
        { habilidadeId: '21', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
        { habilidadeId: '22', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
        { habilidadeId: '68', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
        { habilidadeId: '74', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
        { habilidadeId: '75', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
        { habilidadeId: '76', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
        { habilidadeId: '86', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
        { habilidadeId: '91', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
        { habilidadeId: '147', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
        { habilidadeId: '150', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
        { habilidadeId: '151', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
        { habilidadeId: '153', nivelRespondido: 'Básico', dataResposta: '2026-06-14' },
      ]},
      // Juliana Martins (id='13')
      { colaboradorId: '13', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Intermediário', dataResposta: '2026-06-07' },
        { habilidadeId: '2', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '3', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '4', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '9', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '11', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '12', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '14', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '18', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '21', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '22', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '23', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '50', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '51', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '68', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '74', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '75', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '76', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '86', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '88', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '91', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '107', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '147', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '148', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '149', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '150', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '151', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '152', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
        { habilidadeId: '153', nivelRespondido: 'Básico', dataResposta: '2026-06-07' },
      ]},
      // Renata Alves (id='24')
      { colaboradorId: '24', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Intermediário', dataResposta: '2026-06-25' },
        { habilidadeId: '2', nivelRespondido: 'Intermediário', dataResposta: '2026-06-25' },
        { habilidadeId: '3', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '4', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '9', nivelRespondido: 'Intermediário', dataResposta: '2026-06-25' },
        { habilidadeId: '10', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '11', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '12', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '14', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '18', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '21', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '22', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '23', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '50', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '51', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '68', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '74', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '75', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '76', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '86', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '88', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '91', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '107', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '147', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '148', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '149', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '150', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '151', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '152', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
        { habilidadeId: '153', nivelRespondido: 'Básico', dataResposta: '2026-06-25' },
      ]},
      // Bruno Nascimento (id='25')
      { colaboradorId: '25', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Intermediário', dataResposta: '2026-06-27' },
        { habilidadeId: '2', nivelRespondido: 'Intermediário', dataResposta: '2026-06-27' },
        { habilidadeId: '3', nivelRespondido: 'Intermediário', dataResposta: '2026-06-27' },
        { habilidadeId: '4', nivelRespondido: 'Intermediário', dataResposta: '2026-06-27' },
        { habilidadeId: '9', nivelRespondido: 'Intermediário', dataResposta: '2026-06-27' },
        { habilidadeId: '10', nivelRespondido: 'Intermediário', dataResposta: '2026-06-27' },
        { habilidadeId: '11', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '12', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '14', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '18', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '21', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '22', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '23', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '50', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '51', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '68', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '74', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '75', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '76', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '86', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '88', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '91', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '107', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '147', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '148', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '149', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '150', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '151', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '152', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
        { habilidadeId: '153', nivelRespondido: 'Básico', dataResposta: '2026-06-27' },
      ]},
      // Letícia Costa (id='26')
      { colaboradorId: '26', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Intermediário', dataResposta: '2026-06-29' },
        { habilidadeId: '2', nivelRespondido: 'Intermediário', dataResposta: '2026-06-29' },
        { habilidadeId: '3', nivelRespondido: 'Intermediário', dataResposta: '2026-06-29' },
        { habilidadeId: '4', nivelRespondido: 'Intermediário', dataResposta: '2026-06-29' },
        { habilidadeId: '9', nivelRespondido: 'Intermediário', dataResposta: '2026-06-29' },
        { habilidadeId: '10', nivelRespondido: 'Intermediário', dataResposta: '2026-06-29' },
        { habilidadeId: '11', nivelRespondido: 'Intermediário', dataResposta: '2026-06-29' },
        { habilidadeId: '12', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '14', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '18', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '21', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '22', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '23', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '50', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '51', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '68', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '74', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '75', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '76', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '86', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '88', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '91', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '107', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '147', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '148', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '149', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '150', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '151', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '152', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
        { habilidadeId: '153', nivelRespondido: 'Básico', dataResposta: '2026-06-29' },
      ]},
      // Vinícius Gomes (id='27')
      { colaboradorId: '27', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Intermediário', dataResposta: '2026-07-01' },
        { habilidadeId: '2', nivelRespondido: 'Intermediário', dataResposta: '2026-07-01' },
        { habilidadeId: '3', nivelRespondido: 'Intermediário', dataResposta: '2026-07-01' },
        { habilidadeId: '4', nivelRespondido: 'Intermediário', dataResposta: '2026-07-01' },
        { habilidadeId: '9', nivelRespondido: 'Intermediário', dataResposta: '2026-07-01' },
        { habilidadeId: '10', nivelRespondido: 'Intermediário', dataResposta: '2026-07-01' },
        { habilidadeId: '11', nivelRespondido: 'Intermediário', dataResposta: '2026-07-01' },
        { habilidadeId: '12', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '14', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '18', nivelRespondido: 'Intermediário', dataResposta: '2026-07-01' },
        { habilidadeId: '21', nivelRespondido: 'Intermediário', dataResposta: '2026-07-01' },
        { habilidadeId: '22', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '23', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '50', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '51', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '68', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '74', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '75', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '76', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '86', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '88', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '91', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '107', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '147', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '148', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '149', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '150', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '151', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '152', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
        { habilidadeId: '153', nivelRespondido: 'Básico', dataResposta: '2026-07-01' },
      ]},
      // Fabiana Martins (id='28')
      { colaboradorId: '28', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Intermediário', dataResposta: '2026-07-03' },
        { habilidadeId: '2', nivelRespondido: 'Intermediário', dataResposta: '2026-07-03' },
        { habilidadeId: '3', nivelRespondido: 'Intermediário', dataResposta: '2026-07-03' },
        { habilidadeId: '4', nivelRespondido: 'Intermediário', dataResposta: '2026-07-03' },
        { habilidadeId: '9', nivelRespondido: 'Intermediário', dataResposta: '2026-07-03' },
        { habilidadeId: '10', nivelRespondido: 'Intermediário', dataResposta: '2026-07-03' },
        { habilidadeId: '11', nivelRespondido: 'Intermediário', dataResposta: '2026-07-03' },
        { habilidadeId: '12', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '14', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '18', nivelRespondido: 'Intermediário', dataResposta: '2026-07-03' },
        { habilidadeId: '21', nivelRespondido: 'Intermediário', dataResposta: '2026-07-03' },
        { habilidadeId: '22', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '23', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '50', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '51', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '68', nivelRespondido: 'Intermediário', dataResposta: '2026-07-03' },
        { habilidadeId: '74', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '75', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '76', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '86', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '88', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '91', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '107', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '147', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '148', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '149', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '150', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '151', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '152', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
        { habilidadeId: '153', nivelRespondido: 'Básico', dataResposta: '2026-07-03' },
      ]},
      // Diego Araújo (id='29')
      { colaboradorId: '29', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Intermediário', dataResposta: '2026-07-05' },
        { habilidadeId: '2', nivelRespondido: 'Intermediário', dataResposta: '2026-07-05' },
        { habilidadeId: '3', nivelRespondido: 'Intermediário', dataResposta: '2026-07-05' },
        { habilidadeId: '4', nivelRespondido: 'Intermediário', dataResposta: '2026-07-05' },
        { habilidadeId: '9', nivelRespondido: 'Intermediário', dataResposta: '2026-07-05' },
        { habilidadeId: '10', nivelRespondido: 'Intermediário', dataResposta: '2026-07-05' },
        { habilidadeId: '11', nivelRespondido: 'Intermediário', dataResposta: '2026-07-05' },
        { habilidadeId: '12', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
        { habilidadeId: '14', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
        { habilidadeId: '18', nivelRespondido: 'Intermediário', dataResposta: '2026-07-05' },
        { habilidadeId: '21', nivelRespondido: 'Intermediário', dataResposta: '2026-07-05' },
        { habilidadeId: '22', nivelRespondido: 'Intermediário', dataResposta: '2026-07-05' },
        { habilidadeId: '23', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
        { habilidadeId: '50', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
        { habilidadeId: '51', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
        { habilidadeId: '68', nivelRespondido: 'Intermediário', dataResposta: '2026-07-05' },
        { habilidadeId: '74', nivelRespondido: 'Intermediário', dataResposta: '2026-07-05' },
        { habilidadeId: '75', nivelRespondido: 'Intermediário', dataResposta: '2026-07-05' },
        { habilidadeId: '76', nivelRespondido: 'Intermediário', dataResposta: '2026-07-05' },
        { habilidadeId: '86', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
        { habilidadeId: '88', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
        { habilidadeId: '91', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
        { habilidadeId: '107', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
        { habilidadeId: '147', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
        { habilidadeId: '148', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
        { habilidadeId: '149', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
        { habilidadeId: '150', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
        { habilidadeId: '151', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
        { habilidadeId: '152', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
        { habilidadeId: '153', nivelRespondido: 'Básico', dataResposta: '2026-07-05' },
      ]},
      // Monique Teixeira (id='30')
      { colaboradorId: '30', status: 'Concluída', respostas: [
        { habilidadeId: '1', nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '2', nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '3', nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '4', nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '9', nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '10', nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '11', nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '12', nivelRespondido: 'Básico', dataResposta: '2026-06-16' },
        { habilidadeId: '14', nivelRespondido: 'Básico', dataResposta: '2026-06-16' },
        { habilidadeId: '18', nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '21', nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '22', nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '23', nivelRespondido: 'Básico', dataResposta: '2026-06-16' },
        { habilidadeId: '50', nivelRespondido: 'Básico', dataResposta: '2026-06-16' },
        { habilidadeId: '51', nivelRespondido: 'Básico', dataResposta: '2026-06-16' },
        { habilidadeId: '68', nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '74', nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '75', nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '76', nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '86', nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '88', nivelRespondido: 'Básico', dataResposta: '2026-06-16' },
        { habilidadeId: '91', nivelRespondido: 'Básico', dataResposta: '2026-06-16' },
        { habilidadeId: '107', nivelRespondido: 'Básico', dataResposta: '2026-06-16' },
        { habilidadeId: '147', nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '148', nivelRespondido: 'Básico', dataResposta: '2026-06-16' },
        { habilidadeId: '149', nivelRespondido: 'Básico', dataResposta: '2026-06-16' },
        { habilidadeId: '150', nivelRespondido: 'Intermediário', dataResposta: '2026-06-16' },
        { habilidadeId: '151', nivelRespondido: 'Básico', dataResposta: '2026-06-16' },
        { habilidadeId: '152', nivelRespondido: 'Básico', dataResposta: '2026-06-16' },
        { habilidadeId: '153', nivelRespondido: 'Básico', dataResposta: '2026-06-16' },
      ]},
    ],
  },
];

// Histórico de avaliações
export const historicoAvaliacoesData: HistoricoAvaliacao[] = [
  {
    id: 'av1',
    colaboradorId: '1',
    nome: 'Avaliação de Desempenho - Q4 2025',
    tipo: 'Gestor',
    data: '15 de janeiro de 2026',
    status: 'Concluída',
  },
  {
    id: 'av2',
    colaboradorId: '1',
    nome: 'Autoavaliação - Q4 2025',
    tipo: 'Autoavaliação',
    data: '10 de janeiro de 2026',
    status: 'Concluída',
  },
  {
    id: 'av3',
    colaboradorId: '1',
    nome: 'Avaliação de Desempenho - Q3 2025',
    tipo: 'Gestor',
    data: '20 de outubro de 2025',
    status: 'Concluída',
  },
  {
    id: 'av4',
    colaboradorId: '1',
    nome: 'Autoavaliação - Q3 2025',
    tipo: 'Autoavaliação',
    data: '15 de outubro de 2025',
    status: 'Concluída',
  },
  {
    id: 'av5',
    colaboradorId: '2',
    nome: 'Avaliação de Desempenho - Q4 2025',
    tipo: 'Gestor',
    data: '10 de janeiro de 2026',
    status: 'Concluída',
  },
];

export const competenciasData: Competencia[] = [
  { id: 'comp1',  nome: 'Desenvolvimento Frontend',  descricao: 'Engloba tecnologias e práticas para construção de interfaces web modernas, com foco em frameworks como React e tipagem estática com TypeScript.',                                          status: 'Ativa' },
  { id: 'comp2',  nome: 'Desenvolvimento Backend',   descricao: 'Abrange linguagens, bancos de dados relacionais e controle de versão para desenvolvimento de sistemas e APIs do lado servidor.',                                                          status: 'Ativa' },
  { id: 'comp3',  nome: 'Comunicação Corporativa',   descricao: 'Habilidades de expressão objetiva e colaboração efetiva no ambiente de trabalho, essenciais para o alinhamento entre pessoas e equipes.',                                                 status: 'Ativa' },
  { id: 'comp4',  nome: 'Metodologias Ágeis',        descricao: 'Frameworks e práticas ágeis para gestão de fluxo de trabalho, cerimônias de time e alinhamento com partes interessadas.',                                                                status: 'Ativa' },
  { id: 'comp5',  nome: 'Liderança',                 descricao: 'Capacidade de orientar o desenvolvimento de pessoas por meio de feedback efetivo e construtivo.',                                                                                        status: 'Ativa' },
  { id: 'comp6',  nome: 'Inteligência Emocional',    descricao: 'Habilidades socioemocionais de resiliência sob pressão e empatia na relação com colegas, fundamentais para ambientes colaborativos.',                                                    status: 'Ativa' },
  { id: 'comp7',  nome: 'Resolução de Problemas',    descricao: 'Abordagens analíticas para identificar causas raiz, pensar sistemicamente e priorizar soluções de forma estruturada.',                                                                   status: 'Ativa' },
  { id: 'comp8',  nome: 'Frontend Avançado',         descricao: 'Especialização em acessibilidade, performance e arquitetura CSS para construção de interfaces web robustas e inclusivas.',                                                                status: 'Ativa' },
  { id: 'comp9',  nome: 'DevOps',                    descricao: 'Práticas e ferramentas para containerização, pipelines de entrega contínua, monitoramento de sistemas e gestão segura de dependências.',                                                 status: 'Ativa' },
  { id: 'comp10', nome: 'Cloud Computing',            descricao: 'Serviços de nuvem e provisionamento de infraestrutura como código nos principais provedores do mercado.',                                                                               status: 'Ativa' },
  { id: 'comp11', nome: 'Arquitetura de Software',   descricao: 'Padrões de projeto, estilos arquiteturais distribuídos e práticas de documentação para sistemas escaláveis e bem estruturados.',                                                         status: 'Ativa' },
  { id: 'comp12', nome: 'Banco de Dados',            descricao: 'Modelagem e operação de bancos de dados relacionais e não-relacionais, incluindo estratégias de cache com Redis.',                                                                        status: 'Ativa' },
  { id: 'comp13', nome: 'Análise de Dados',          descricao: 'Ferramentas e técnicas para extração, transformação, visualização e interpretação de dados quantitativos e de comportamento do usuário.',                                                status: 'Ativa' },
  { id: 'comp14', nome: 'Segurança da Informação',   descricao: 'Proteção de sistemas contra vulnerabilidades web, gestão de identidades e aplicação de técnicas criptográficas.',                                                                        status: 'Ativa' },
  { id: 'comp15', nome: 'Mobile',                    descricao: 'Desenvolvimento de aplicativos móveis multiplataforma com React Native e Flutter, incluindo otimização de performance em dispositivos.',                                                  status: 'Ativa' },
  { id: 'comp16', nome: 'Qualidade e Testes',        descricao: 'Práticas e ferramentas para garantir qualidade de software por meio de automação de testes, pirâmide de testes e revisão de código.',                                                   status: 'Ativa' },
  { id: 'comp17', nome: 'Inteligência Artificial',   descricao: 'Conceitos e práticas de Machine Learning, engenharia de prompts para LLMs e operacionalização de modelos em produção.',                                                                  status: 'Ativa' },
  { id: 'comp18', nome: 'Redes e Infraestrutura',    descricao: 'Fundamentos e práticas de redes, balanceamento de carga, resolução de nomes e segurança de infraestrutura de rede.',                                                                    status: 'Ativa' },
  { id: 'comp19', nome: 'Gestão de Projetos',        descricao: 'Metodologias para planejar, controlar riscos, medir performance de engenharia, gerir orçamentos e coordenar times multidisciplinares.',                                                 status: 'Ativa' },
  { id: 'comp20', nome: 'Liderança Técnica',         descricao: 'Habilidades de delegação, desenvolvimento de pessoas e tomada de decisão técnica aplicadas à liderança de times de tecnologia.',                                                        status: 'Ativa' },
  { id: 'comp21', nome: 'Comunicação Estratégica',   descricao: 'Capacidades de comunicação com audiências executivas, negociação de interesses e escuta ativa para alinhamento estratégico.',                                                           status: 'Ativa' },
  { id: 'comp22', nome: 'Colaboração Remota',        descricao: 'Práticas e ferramentas para trabalho eficaz em times distribuídos, incluindo comunicação assíncrona e condução de reuniões produtivas.',                                                status: 'Ativa' },
  { id: 'comp23', nome: 'Gestão do Tempo',           descricao: 'Habilidades pessoais de organização, priorização e manutenção de foco para entrega consistente e de alto impacto.',                                                                    status: 'Ativa' },
  { id: 'comp24', nome: 'Adaptabilidade',            descricao: 'Capacidade de se adaptar a mudanças, aprender continuamente e manter performance operacional em cenários adversos.',                                                                    status: 'Ativa' },
  { id: 'comp25', nome: 'Pensamento Estratégico',    descricao: 'Compreensão do modelo de negócio, análise de mercado, geração de inovação e criação de propostas de valor diferenciadas.',                                                             status: 'Ativa' },
  { id: 'comp26', nome: 'Orientação a Resultados',   descricao: 'Habilidades de definição e acompanhamento de metas, responsabilização por resultados e orientação às necessidades do cliente.',                                                         status: 'Ativa' },
  { id: 'comp27', nome: 'Finanças Corporativas',     descricao: 'Análise e modelagem financeira, gestão de fluxo de caixa e elaboração de orçamento para suporte à tomada de decisão empresarial.',                                                      status: 'Ativa' },
  { id: 'comp28', nome: 'Contabilidade e Fiscal',    descricao: 'Geração de informações contábeis gerenciais, gestão de obrigações tributárias e garantia de conformidade fiscal da organização.',                                                       status: 'Ativa' },
  { id: 'comp29', nome: 'Gestão de Produto',         descricao: 'Práticas de discovery, definição de roadmap, análise de métricas e priorização de backlog para criação de produtos de alto valor.',                                                    status: 'Ativa' },
  { id: 'comp30', nome: 'Design de Produto',         descricao: 'Pesquisa com usuários, prototipação, criação de design systems e testes de usabilidade para garantir experiências centradas no usuário.',                                               status: 'Ativa' },
  { id: 'comp31', nome: 'Design Visual',             descricao: 'Criação de interfaces visualmente coesas, animações e identidade visual de marca para produtos e canais de comunicação.',                                                               status: 'Ativa' },
  { id: 'comp32', nome: 'Inovação e Estratégia',     descricao: 'Metodologias e práticas para geração, validação e gestão de inovações, incluindo design thinking, análise de tendências e prototipação ágil.',                                         status: 'Ativa' },
  { id: 'comp33', nome: 'Gestão Operacional',        descricao: 'Mapeamento e otimização de processos operacionais, definição de KPIs, melhoria contínua e gestão de acordos de nível de serviço.',                                                     status: 'Ativa' },
];

export function getCompetenciaPorId(id: string): Competencia | undefined {
  return competenciasData.find(c => c.id === id);
}

export function getCompetenciaNome(id: string): string {
  return getCompetenciaPorId(id)?.nome ?? 'Sem competência';
}

export const habilidadesData: Habilidade[] = [
  { id: '1',  nome: 'React',               descricao: 'Desenvolvimento com React e ecossistema',          competencia: 'Desenvolvimento Frontend', competenciaId: 'comp1', tipo: 'Técnica',       status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Cria componentes funcionais simples e entende JSX' },
    { nivelId: '2', criterio: 'Usa hooks, gerencia estado local e consome APIs REST' },
    { nivelId: '3', criterio: 'Domina Context API, hooks customizados e otimização de re-renders em aplicações médias' },
    { nivelId: '4', criterio: 'Define arquitetura de componentes, otimização e boas práticas do time' },
    { nivelId: '5', criterio: 'É referência em React na organização, avalia estratégias de migração de versão e orienta múltiplos times' },
  ]},
  { id: '2',  nome: 'TypeScript',           descricao: 'Programação com tipagem estática',                 competencia: 'Desenvolvimento Frontend', competenciaId: 'comp1', tipo: 'Técnica',       status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Aplica tipagem básica em variáveis, funções e interfaces simples' },
    { nivelId: '2', criterio: 'Usa generics, types utilitários e integra tipagem com frameworks' },
    { nivelId: '3', criterio: 'Domina tipos condicionais, template literals e cria bibliotecas de tipos reutilizáveis' },
    { nivelId: '4', criterio: 'Define estratégias de tipagem para o projeto e orienta o time' },
    { nivelId: '5', criterio: 'É referência em TypeScript na organização, contribui com tipos para libs internas e define políticas de strict mode' },
  ]},
  { id: '3',  nome: 'Node.js',              descricao: 'Desenvolvimento backend com Node.js',               competencia: 'Desenvolvimento Backend', competenciaId: 'comp2',  tipo: 'Técnica',       status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Entende o event loop, cria scripts básicos e executa aplicações Node.js com orientação' },
    { nivelId: '2', criterio: 'Cria APIs REST com Express, gerencia rotas e middlewares básicos' },
    { nivelId: '3', criterio: 'Projeta serviços escaláveis, aplica segurança e autenticação avançada' },
    { nivelId: '4', criterio: 'Define padrões de backend e lidera decisões arquiteturais do time' },
    { nivelId: '5', criterio: 'É referência em ecossistema Node.js na organização, define estratégias de plataforma e contribui com a comunidade' },
  ]},
  { id: '4',  nome: 'PostgreSQL',           descricao: 'Modelagem e consultas em banco relacional',         competencia: 'Desenvolvimento Backend', competenciaId: 'comp2',  tipo: 'Técnica',       status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Executa queries básicas de SELECT, INSERT e UPDATE com filtros' },
    { nivelId: '2', criterio: 'Domina JOINs, índices e transações, modela banco relacional' },
    { nivelId: '3', criterio: 'Escreve queries complexas com CTEs e window functions, analisa planos de execução' },
    { nivelId: '4', criterio: 'Otimiza queries complexas, define estratégias de particionamento e replicação' },
    { nivelId: '5', criterio: 'É referência em banco relacional, define arquitetura de dados e estratégias de HA para a organização' },
  ]},
  { id: '9',  nome: 'Comunicação Clara',    descricao: 'Habilidade de se expressar de forma objetiva',      competencia: 'Comunicação Corporativa', competenciaId: 'comp3',  tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Expressa ideias de forma objetiva em situações cotidianas' },
    { nivelId: '2', criterio: 'Adapta linguagem ao público e estrutura mensagens com clareza' },
    { nivelId: '3', criterio: 'Comunica temas técnicos e complexos para audiências mistas com consistência e assertividade' },
    { nivelId: '4', criterio: 'Facilita reuniões complexas e comunica decisões estratégicas com precisão' },
    { nivelId: '5', criterio: 'É modelo de comunicação na organização, habilita líderes e define padrões de comunicação institucional' },
  ]},
  { id: '10', nome: 'Trabalho em Equipe',   descricao: 'Colaboração efetiva com colegas',                   competencia: 'Comunicação Corporativa', competenciaId: 'comp3',  tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Colabora com colegas em tarefas compartilhadas sem conflitos' },
    { nivelId: '2', criterio: 'Age de forma proativa no time e resolve conflitos simples' },
    { nivelId: '3', criterio: 'Facilita colaboração entre áreas e atua como ponto de integração em projetos multidisciplinares' },
    { nivelId: '4', criterio: 'Potencializa o desempenho coletivo e promove cultura colaborativa' },
    { nivelId: '5', criterio: 'Constrói times de alta performance e é referência em práticas colaborativas para toda a organização' },
  ]},
  { id: '11', nome: 'Scrum',                descricao: 'Framework ágil para gestão de projetos',            competencia: 'Metodologias Ágeis', competenciaId: 'comp4',       tipo: 'Técnica',       status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Participa das cerimônias e entende os papéis do Scrum' },
    { nivelId: '2', criterio: 'Facilita cerimônias, acompanha métricas ágeis e propõe melhorias' },
    { nivelId: '3', criterio: 'Atua como Scrum Master ou equivalente com autonomia, removendo impedimentos e evoluindo o processo' },
    { nivelId: '4', criterio: 'Lidera times ágeis, adapta o framework ao contexto e mede resultados' },
    { nivelId: '5', criterio: 'Define estratégia ágil para múltiplos times e é referência em transformação ágil na organização' },
  ]},
  { id: '12', nome: 'Kanban',               descricao: 'Método visual de gestão de fluxo',                  competencia: 'Metodologias Ágeis', competenciaId: 'comp4',       tipo: 'Técnica',       status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Visualiza fluxo de trabalho e respeita os limites de WIP' },
    { nivelId: '2', criterio: 'Identifica gargalos, otimiza fluxo e usa métricas de lead time' },
    { nivelId: '3', criterio: 'Configura e evolui sistemas Kanban para o time, aplicando Classes of Service' },
    { nivelId: '4', criterio: 'Adapta Kanban a múltiplos fluxos e lidera revisões de processo com métricas consistentes' },
    { nivelId: '5', criterio: 'Define estratégia Kanban para a organização e orienta outros times e líderes' },
  ]},
  { id: '14', nome: 'Feedback Construtivo', descricao: 'Fornecer feedback efetivo e orientado',              competencia: 'Liderança', competenciaId: 'comp5',                tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Dá feedbacks baseados em comportamento observado' },
    { nivelId: '2', criterio: 'Estrutura feedbacks com frameworks (SCI/STAR) e recebe com abertura' },
    { nivelId: '3', criterio: 'Dá e recebe feedbacks em situações difíceis com naturalidade e usa o feedback para desenvolver parceiros' },
    { nivelId: '4', criterio: 'Cria cultura de feedback no time e treina outros na prática' },
    { nivelId: '5', criterio: 'É referência em cultura de feedback na organização, treina gestores e define rituais de feedback em todas as áreas' },
  ]},
  { id: '18', nome: 'Git',                  descricao: 'Controle de versão e colaboração',                  competencia: 'Desenvolvimento Backend', competenciaId: 'comp2',  tipo: 'Técnica',       status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Usa comandos básicos: clone, commit, push e pull' },
    { nivelId: '2', criterio: 'Trabalha com branches, merge, rebase e resolve conflitos' },
    { nivelId: '3', criterio: 'Configura repositórios, hooks e aplica padrões de commit (conventional commits)' },
    { nivelId: '4', criterio: 'Define estratégias de branching (GitFlow) e lidera processos de code review' },
    { nivelId: '5', criterio: 'Define estratégia de versionamento para múltiplos produtos e orienta práticas de engenharia na organização' },
  ]},
  { id: '147', nome: 'Arquitetura de APIs REST', descricao: 'Design, versionamento e boas práticas de APIs RESTful', competencia: 'Desenvolvimento Backend', competenciaId: 'comp2', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Cria endpoints REST simples seguindo convenções básicas de verbos HTTP' },
    { nivelId: '2', criterio: 'Projeta recursos, paginação e tratamento de erros consistentes' },
    { nivelId: '3', criterio: 'Define estratégias de versionamento e evolução de contratos sem quebrar consumidores' },
    { nivelId: '4', criterio: 'Estabelece padrões de API para múltiplos times e revisa designs de API do time' },
    { nivelId: '5', criterio: 'É referência em design de APIs na organização e define diretrizes adotadas por toda a engenharia' },
  ]},
  { id: '148', nome: 'GraphQL', descricao: 'Modelagem de schemas, queries e resolvers com GraphQL', competencia: 'Desenvolvimento Backend', competenciaId: 'comp2', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Escreve queries e mutations simples contra um schema existente' },
    { nivelId: '2', criterio: 'Modela types, resolvers e trata autenticação em um schema GraphQL' },
    { nivelId: '3', criterio: 'Otimiza resolvers (evita N+1), pagina resultados e versiona o schema com segurança' },
    { nivelId: '4', criterio: 'Define arquitetura de federação/schema stitching para múltiplos serviços' },
    { nivelId: '5', criterio: 'É referência em GraphQL na organização e define padrões adotados por vários times' },
  ]},
  { id: '149', nome: 'Mensageria e Filas', descricao: 'Comunicação assíncrona entre serviços com filas e brokers como RabbitMQ e Kafka', competencia: 'Desenvolvimento Backend', competenciaId: 'comp2', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Publica e consome mensagens em uma fila com orientação' },
    { nivelId: '2', criterio: 'Configura filas, tópicos e trata falhas de consumo com retry básico' },
    { nivelId: '3', criterio: 'Projeta fluxos assíncronos resilientes, com dead-letter queues e idempotência' },
    { nivelId: '4', criterio: 'Define arquitetura de mensageria para múltiplos serviços e garante observabilidade do fluxo' },
    { nivelId: '5', criterio: 'É referência em arquitetura orientada a eventos na organização e define padrões de mensageria' },
  ]},
  { id: '150', nome: 'Python para Backend', descricao: 'Desenvolvimento de serviços e automações backend com Python', competencia: 'Desenvolvimento Backend', competenciaId: 'comp2', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Escreve scripts e funções básicas em Python com orientação' },
    { nivelId: '2', criterio: 'Constrói APIs com frameworks como Flask ou FastAPI e gerencia dependências' },
    { nivelId: '3', criterio: 'Projeta serviços escaláveis, aplica testes automatizados e boas práticas de tipagem' },
    { nivelId: '4', criterio: 'Define padrões de projeto Python para o time e lidera decisões arquiteturais' },
    { nivelId: '5', criterio: 'É referência em Python na organização e orienta múltiplos times em boas práticas' },
  ]},
  { id: '151', nome: 'Integração de Sistemas', descricao: 'Integração entre serviços internos e sistemas externos via APIs e webhooks', competencia: 'Desenvolvimento Backend', competenciaId: 'comp2', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Consome uma API externa simples seguindo documentação existente' },
    { nivelId: '2', criterio: 'Integra sistemas via webhooks e trata autenticação e erros de integração' },
    { nivelId: '3', criterio: 'Projeta integrações resilientes com retry, circuit breaker e monitoramento' },
    { nivelId: '4', criterio: 'Define arquitetura de integração entre múltiplos sistemas internos e externos' },
    { nivelId: '5', criterio: 'É referência em integração de sistemas na organização e define padrões corporativos' },
  ]},
  { id: '152', nome: 'Migrações de Banco de Dados', descricao: 'Versionamento e evolução segura de schemas de banco de dados', competencia: 'Desenvolvimento Backend', competenciaId: 'comp2', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Executa migrações existentes seguindo scripts prontos' },
    { nivelId: '2', criterio: 'Cria migrações reversíveis com ferramentas como Flyway, Liquibase ou ORM' },
    { nivelId: '3', criterio: 'Planeja migrações sem downtime em bases de produção com alto volume' },
    { nivelId: '4', criterio: 'Define estratégia de versionamento de schema para múltiplos serviços' },
    { nivelId: '5', criterio: 'É referência em evolução de schema na organização e define padrões corporativos' },
  ]},
  { id: '153', nome: 'Testes de Carga', descricao: 'Avaliação de performance e capacidade de serviços sob carga com ferramentas como k6 ou JMeter', competencia: 'Desenvolvimento Backend', competenciaId: 'comp2', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Executa scripts de teste de carga existentes e interpreta relatórios básicos' },
    { nivelId: '2', criterio: 'Cria cenários de teste de carga e identifica gargalos simples' },
    { nivelId: '3', criterio: 'Projeta testes de carga e estresse representativos do tráfego real e propõe otimizações' },
    { nivelId: '4', criterio: 'Define estratégia de testes de performance para múltiplos serviços' },
    { nivelId: '5', criterio: 'É referência em performance de sistemas na organização e define padrões corporativos' },
  ]},
  { id: '21', nome: 'Resiliência',          descricao: 'Capacidade de lidar com pressão',                   competencia: 'Inteligência Emocional', competenciaId: 'comp6',   tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Mantém produtividade sob pressão moderada e prazo' },
    { nivelId: '2', criterio: 'Supera adversidades sem impactar a entrega e aprende com falhas' },
    { nivelId: '3', criterio: 'Enfrenta situações de alta pressão com equilíbrio e ajuda colegas próximos a manter o foco' },
    { nivelId: '4', criterio: 'Opera em ambiguidade intensa e apoia o time a manter foco' },
    { nivelId: '5', criterio: 'Constrói cultura de resiliência no time, prepara líderes para crises e é referência organizacional' },
  ]},
  { id: '22', nome: 'Empatia',              descricao: 'Compreensão das necessidades dos outros',            competencia: 'Inteligência Emocional', competenciaId: 'comp6',   tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Ouve ativamente e considera perspectivas alheias no cotidiano' },
    { nivelId: '2', criterio: 'Adapta comunicação ao estado emocional dos colegas e oferece suporte' },
    { nivelId: '3', criterio: 'Navega situações interpessoais complexas com naturalidade e apoia pessoas em momentos de vulnerabilidade' },
    { nivelId: '4', criterio: 'Cria segurança psicológica no time e media situações delicadas' },
    { nivelId: '5', criterio: 'Cultiva ambientes de alto cuidado e pertencimento em toda a organização, habilitando líderes empáticos' },
  ]},
  { id: '23', nome: 'Pensamento Crítico',   descricao: 'Análise lógica e fundamentada',                     competencia: 'Resolução de Problemas', competenciaId: 'comp7',   tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Questiona premissas com abertura e articula o raciocínio por trás de suas conclusões' },
    { nivelId: '2', criterio: 'Analisa problemas sob múltiplas perspectivas com raciocínio lógico' },
    { nivelId: '3', criterio: 'Questiona premissas e propõe soluções baseadas em dados e evidências' },
    { nivelId: '4', criterio: 'Define metodologias analíticas e orienta o time em decisões estratégicas' },
    { nivelId: '5', criterio: 'É referência em raciocínio analítico na organização e institucionaliza cultura de decisão baseada em evidências' },
  ]},

  // ─── Frontend Avançado ─────────────────────────────────────────────────────
  { id: '50', nome: 'Acessibilidade Web',     descricao: 'Criação de interfaces acessíveis conforme WCAG',            competencia: 'Frontend Avançado', competenciaId: 'comp8',        tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Conhece as diretrizes WCAG e aplica atributos ARIA básicos' },
    { nivelId: '2', criterio: 'Garante contraste, navegação por teclado e testa com leitores de tela' },
    { nivelId: '3', criterio: 'Realiza auditorias de acessibilidade em componentes existentes e cria guias práticas para o time' },
    { nivelId: '4', criterio: 'Define padrões de acessibilidade para o projeto e audita componentes da equipe' },
    { nivelId: '5', criterio: 'É referência em acessibilidade, contribui com padrões organizacionais e influencia decisões de produto e design' },
  ]},
  { id: '51', nome: 'Performance Web',        descricao: 'Otimização de carregamento e Core Web Vitals',              competencia: 'Frontend Avançado', competenciaId: 'comp8',        tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Identifica problemas óbvios de performance como imagens não otimizadas' },
    { nivelId: '2', criterio: 'Usa Lighthouse, otimiza bundle size, lazy loading e Core Web Vitals' },
    { nivelId: '3', criterio: 'Implementa estratégias de code splitting, pré-caching e monitora Core Web Vitals em produção' },
    { nivelId: '4', criterio: 'Define estratégia de performance do produto e implementa SSR/SSG quando relevante' },
    { nivelId: '5', criterio: 'Define metas de performance para toda a plataforma e é referência técnica em otimização web' },
  ]},
  { id: '52', nome: 'CSS Avançado',           descricao: 'Estilização complexa e arquitetura de CSS',                 competencia: 'Frontend Avançado', competenciaId: 'comp8',        tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Usa Flexbox, Grid e variáveis CSS com segurança em layouts responsivos' },
    { nivelId: '2', criterio: 'Cria sistemas de design em CSS, animações e tokens de design' },
    { nivelId: '3', criterio: 'Implementa design tokens, dark mode e estratégias de theming em aplicações de médio porte' },
    { nivelId: '4', criterio: 'Define arquitetura de CSS para projetos grandes e orienta convenções no time' },
    { nivelId: '5', criterio: 'É referência em arquitetura CSS, cria frameworks internos e define padrões para múltiplos produtos' },
  ]},

  // ─── DevOps ────────────────────────────────────────────────────────────────
  { id: '53', nome: 'Docker e Containers',    descricao: 'Containerização de aplicações com Docker',                  competencia: 'DevOps', competenciaId: 'comp9',                   tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Cria e executa containers com Dockerfile e docker-compose básico' },
    { nivelId: '2', criterio: 'Otimiza imagens, usa multi-stage builds e gerencia redes e volumes' },
    { nivelId: '3', criterio: 'Configura ambientes Docker para desenvolvimento e staging com boas práticas de segurança de imagens' },
    { nivelId: '4', criterio: 'Define estratégia de containerização e integra com orquestração (K8s)' },
    { nivelId: '5', criterio: 'Define arquitetura de containers para a organização e lidera adoção de plataformas de orquestração' },
  ]},
  { id: '54', nome: 'CI/CD',                  descricao: 'Pipelines de integração e entrega contínua',               competencia: 'DevOps', competenciaId: 'comp9',                   tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Configura pipelines básicos com GitHub Actions ou similar' },
    { nivelId: '2', criterio: 'Implementa stages de build, testes e deploy automatizado com rollback' },
    { nivelId: '3', criterio: 'Otimiza pipelines com paralelismo, cache de dependências e integração de ferramentas de qualidade' },
    { nivelId: '4', criterio: 'Projeta estratégia de CI/CD para múltiplos ambientes e times' },
    { nivelId: '5', criterio: 'Define plataforma de CI/CD para a organização, reduz lead time de entrega e lidera cultura de entrega contínua' },
  ]},
  { id: '55', nome: 'Monitoramento e Observabilidade', descricao: 'Logs, métricas e rastreamento de sistemas',       competencia: 'DevOps', competenciaId: 'comp9',                   tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Configura logs estruturados e cria alertas básicos em plataformas de monitoramento' },
    { nivelId: '2', criterio: 'Implementa traces distribuídos, dashboards e define SLOs' },
    { nivelId: '3', criterio: 'Constrói observabilidade end-to-end em serviços críticos e responde incidentes com dados precisos' },
    { nivelId: '4', criterio: 'Define estratégia de observabilidade end-to-end e conduz pós-mortems' },
    { nivelId: '5', criterio: 'É referência em confiabilidade de sistemas, define SLAs organizacionais e lidera a cultura de SRE' },
  ]},

  // ─── Cloud Computing ───────────────────────────────────────────────────────
  { id: '56', nome: 'AWS',                    descricao: 'Serviços Amazon Web Services',                              competencia: 'Cloud Computing', competenciaId: 'comp10',          tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Usa serviços básicos como EC2, S3 e Lambda com auxílio de documentação' },
    { nivelId: '2', criterio: 'Projeta arquiteturas com VPC, RDS, IAM e serviços gerenciados' },
    { nivelId: '3', criterio: 'Implementa soluções Well-Architected com HA, auto-scaling e monitoramento de custos' },
    { nivelId: '4', criterio: 'Define estratégia de cloud, otimiza custos e lidera migrações' },
    { nivelId: '5', criterio: 'É arquiteto de referência em AWS, define padrões organizacionais e lidera estratégia multi-cloud' },
  ]},
  { id: '57', nome: 'Azure',                  descricao: 'Serviços Microsoft Azure',                                  competencia: 'Cloud Computing', competenciaId: 'comp10',          tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Provisiona recursos básicos no portal Azure com orientação' },
    { nivelId: '2', criterio: 'Usa Azure DevOps, AKS, Functions e gerencia identidades com AAD' },
    { nivelId: '3', criterio: 'Implementa soluções Azure com HA, gerencia custos e garante conformidade com políticas de segurança' },
    { nivelId: '4', criterio: 'Arquiteta soluções enterprise no Azure e lidera adoção da plataforma' },
    { nivelId: '5', criterio: 'Define estratégia Azure da organização, avalia serviços emergentes e lidera certificações técnicas do time' },
  ]},
  { id: '58', nome: 'Infraestrutura como Código', descricao: 'Provisionamento de infra com Terraform ou similar',   competencia: 'Cloud Computing', competenciaId: 'comp10',          tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Cria e aplica configurações Terraform básicas com auxílio' },
    { nivelId: '2', criterio: 'Modulariza infraestrutura, usa state remoto e integra em pipelines CI/CD' },
    { nivelId: '3', criterio: 'Mantém módulos Terraform reutilizáveis e realiza refatorações de infra com segurança' },
    { nivelId: '4', criterio: 'Define padrões de IaC para a organização e avalia alternativas (CDK, Pulumi)' },
    { nivelId: '5', criterio: 'É referência em infraestrutura como código, publica módulos abertos e forma profissionais na organização' },
  ]},

  // ─── Arquitetura de Software ───────────────────────────────────────────────
  { id: '59', nome: 'Design Patterns',        descricao: 'Padrões de projeto e princípios SOLID',                    competencia: 'Arquitetura de Software', competenciaId: 'comp11',  tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Reconhece e aplica padrões comuns (Factory, Observer) com orientação' },
    { nivelId: '2', criterio: 'Escolhe padrões adequados ao contexto e aplica SOLID com autonomia' },
    { nivelId: '3', criterio: 'Conduz revisões arquiteturais e orienta o time na adoção de padrões' },
    { nivelId: '4', criterio: 'Define padrões de referência para a organização e avalia trade-offs arquiteturais' },
    { nivelId: '5', criterio: 'Publica e apresenta sobre arquitetura de software, é reconhecido externamente e influencia decisões de longo prazo' },
  ]},
  { id: '60', nome: 'Microsserviços',         descricao: 'Arquitetura e comunicação entre microsserviços',           competencia: 'Arquitetura de Software', competenciaId: 'comp11',  tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Entende os princípios de decomposição por domínio e comunicação síncrona/assíncrona' },
    { nivelId: '2', criterio: 'Projeta microsserviços com contratos claros, resiliência e rastreamento' },
    { nivelId: '3', criterio: 'Implementa microsserviços com Service Mesh, Circuit Breaker e observabilidade end-to-end' },
    { nivelId: '4', criterio: 'Lidera migração de monolito para microsserviços e define padrões organizacionais' },
    { nivelId: '5', criterio: 'É referência em arquitetura de microsserviços, define padrões para múltiplos produtos e orienta CTOs' },
  ]},
  { id: '61', nome: 'Event-Driven Architecture', descricao: 'Comunicação por eventos com filas e streaming',         competencia: 'Arquitetura de Software', competenciaId: 'comp11',  tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Entende publishers e consumers e usa Kafka ou RabbitMQ com exemplos guiados' },
    { nivelId: '2', criterio: 'Projeta fluxos event-driven com idempotência, DLQ e monitoramento' },
    { nivelId: '3', criterio: 'Implementa event sourcing e CQRS em sistemas de médio porte com testes e documentação' },
    { nivelId: '4', criterio: 'Define estratégia de eventos para o produto e orienta o time em event sourcing' },
    { nivelId: '5', criterio: 'Define padrões de EDA para a organização, avalia plataformas e forma arquitetos de evento' },
  ]},

  // ─── Banco de Dados ────────────────────────────────────────────────────────
  { id: '62', nome: 'NoSQL',                  descricao: 'Bancos não-relacionais (MongoDB, DynamoDB)',               competencia: 'Banco de Dados', competenciaId: 'comp12',           tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Executa operações CRUD em MongoDB ou similar com orientação' },
    { nivelId: '2', criterio: 'Modela documentos para alta performance e projeta índices eficientes' },
    { nivelId: '3', criterio: 'Otimiza queries complexas, define estratégias de sharding e replica sets com autonomia' },
    { nivelId: '4', criterio: 'Avalia quando usar NoSQL vs SQL e lidera decisões de modelagem no time' },
    { nivelId: '5', criterio: 'É referência em bancos NoSQL, define estratégia de persistência políglotica e orienta múltiplas squads' },
  ]},
  { id: '63', nome: 'Redis e Caching',        descricao: 'Estratégias de cache com Redis',                          competencia: 'Banco de Dados', competenciaId: 'comp12',           tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Usa Redis para caching simples de chave-valor em aplicações' },
    { nivelId: '2', criterio: 'Implementa cache-aside, write-through e define TTLs e estratégias de invalidação' },
    { nivelId: '3', criterio: 'Configura clusters Redis, pipelines e pubsub para casos avançados de uso' },
    { nivelId: '4', criterio: 'Define estratégia de caching distribuído e avalia trade-offs de consistência' },
    { nivelId: '5', criterio: 'Projeta infraestrutura de caching para sistemas de alta escala e é referência na organização' },
  ]},
  { id: '64', nome: 'Modelagem de Dados',     descricao: 'Projeto de esquemas e estruturas de dados',               competencia: 'Banco de Dados', competenciaId: 'comp12',           tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Cria modelos ER básicos e normaliza até a 3ª forma normal' },
    { nivelId: '2', criterio: 'Modela para performance, usa desnormalização quando adequado e cria dicionários' },
    { nivelId: '3', criterio: 'Projeta modelos de dados para sistemas distribuídos e garante governança básica' },
    { nivelId: '4', criterio: 'Lidera decisões de modelagem e define governança de dados para o projeto' },
    { nivelId: '5', criterio: 'Define estratégia de dados para a organização, implementa Data Mesh e forma engenheiros de dados' },
  ]},

  // ─── Análise de Dados ──────────────────────────────────────────────────────
  { id: '65', nome: 'Python para Dados',      descricao: 'Pandas, NumPy e análise exploratória',                    competencia: 'Análise de Dados', competenciaId: 'comp13',         tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Usa Pandas para carregar, filtrar e transformar datasets simples' },
    { nivelId: '2', criterio: 'Realiza análise exploratória completa, limpeza e visualizações com Matplotlib' },
    { nivelId: '3', criterio: 'Cria pipelines de dados com transformações complexas e garante qualidade e reprodutibilidade' },
    { nivelId: '4', criterio: 'Constrói pipelines de análise reproduzíveis e orienta o time em boas práticas' },
    { nivelId: '5', criterio: 'Define arquitetura de dados e machine learning em Python para a organização e forma engenheiros' },
  ]},
  { id: '66', nome: 'SQL Avançado',           descricao: 'CTEs, window functions e otimização de queries',          competencia: 'Análise de Dados', competenciaId: 'comp13',         tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Escreve queries com JOINs múltiplos e funções de agregação' },
    { nivelId: '2', criterio: 'Usa CTEs, window functions e otimiza queries com EXPLAIN ANALYZE' },
    { nivelId: '3', criterio: 'Escreve procedures, views materializadas e gerencia migrações de schema com segurança' },
    { nivelId: '4', criterio: 'Define padrões SQL para o time e conduz revisões de performance de banco' },
    { nivelId: '5', criterio: 'Define estratégia de governança de queries e modelos analíticos para toda a plataforma de dados' },
  ]},
  { id: '67', nome: 'Power BI',               descricao: 'Dashboards e relatórios com Power BI',                   competencia: 'Análise de Dados', competenciaId: 'comp13',         tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Cria dashboards simples conectando fontes de dados e usando visuais padrão' },
    { nivelId: '2', criterio: 'Desenvolve medidas DAX complexas e modelos de dados publicados' },
    { nivelId: '3', criterio: 'Cria relatórios paginated, implementa RLS e publica no Service com governança básica' },
    { nivelId: '4', criterio: 'Arquiteta soluções de BI corporativo e treina usuários de negócio' },
    { nivelId: '5', criterio: 'Define estratégia de BI da organização, governa o catálogo de dados e certifica analistas' },
  ]},

  // ─── Segurança da Informação ───────────────────────────────────────────────
  { id: '68', nome: 'OWASP e Vulnerabilidades Web', descricao: 'Prevenção das principais vulnerabilidades web',     competencia: 'Segurança da Informação', competenciaId: 'comp14',  tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Conhece o OWASP Top 10 e identifica vulnerabilidades comuns em código' },
    { nivelId: '2', criterio: 'Aplica mitigações para XSS, CSRF, SQL Injection e conduz code reviews de segurança' },
    { nivelId: '3', criterio: 'Realiza threat modeling e integra SAST/DAST em pipelines CI/CD' },
    { nivelId: '4', criterio: 'Lidera programa de secure coding e define padrões de segurança para o time' },
    { nivelId: '5', criterio: 'Define estratégia de segurança aplicacional da organização e representa a empresa em comunidades de segurança' },
  ]},
  { id: '69', nome: 'Autenticação e Autorização', descricao: 'OAuth 2.0, JWT, RBAC e gestão de identidades',       competencia: 'Segurança da Informação', competenciaId: 'comp14',  tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Implementa autenticação básica com JWT e sessões gerenciadas' },
    { nivelId: '2', criterio: 'Projeta fluxos OAuth 2.0, OIDC e controle de acesso baseado em papéis (RBAC)' },
    { nivelId: '3', criterio: 'Implementa ABAC, gerencia escopos de API e trata casos avançados como delegação e impersonation' },
    { nivelId: '4', criterio: 'Define estratégia de identidade do produto e avalia provedores de IdP' },
    { nivelId: '5', criterio: 'Define arquitetura IAM da organização, avalia Zero Trust e lidera conformidade com regulações de identidade' },
  ]},
  { id: '70', nome: 'Criptografia',           descricao: 'Fundamentos e aplicação prática de criptografia',        competencia: 'Segurança da Informação', competenciaId: 'comp14',  tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Usa bibliotecas criptográficas para hash de senhas e dados sensíveis' },
    { nivelId: '2', criterio: 'Escolhe algoritmos adequados (AES, RSA, SHA) e gerencia chaves com segurança' },
    { nivelId: '3', criterio: 'Implementa PKI básica, gerencia certificados e realiza rotação de chaves automatizada' },
    { nivelId: '4', criterio: 'Define estratégia criptográfica do produto e conduz análises de risco' },
    { nivelId: '5', criterio: 'Define políticas criptográficas para a organização e avalia impacto de computação quântica' },
  ]},

  // ─── Mobile ────────────────────────────────────────────────────────────────
  { id: '71', nome: 'React Native',           descricao: 'Desenvolvimento mobile multiplataforma',                  competencia: 'Mobile', competenciaId: 'comp15',                   tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Cria telas básicas com componentes nativos e navegação simples' },
    { nivelId: '2', criterio: 'Integra APIs nativas, otimiza performance e publica nos stores' },
    { nivelId: '3', criterio: 'Implementa módulos nativos em Swift/Kotlin, gerencia builds e usa ferramentas avançadas de debugging' },
    { nivelId: '4', criterio: 'Arquiteta apps complexos, cria bridges nativas e lidera o time mobile' },
    { nivelId: '5', criterio: 'É referência em React Native na organização, define estratégia mobile e contribui com a comunidade' },
  ]},
  { id: '72', nome: 'Flutter',                descricao: 'Desenvolvimento mobile com Flutter e Dart',               competencia: 'Mobile', competenciaId: 'comp15',                   tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Cria widgets básicos, gerencia estado com setState e navega entre telas' },
    { nivelId: '2', criterio: 'Usa gerenciamento de estado avançado (Riverpod/BLoC) e integra APIs' },
    { nivelId: '3', criterio: 'Cria packages Dart, integra plataformas nativas e implementa animações complexas com Flutter' },
    { nivelId: '4', criterio: 'Define arquitetura do app, cria packages reutilizáveis e lidera adoção do Flutter' },
    { nivelId: '5', criterio: 'É referência em Flutter na organização, define padrões de plataforma mobile e orienta decisões de SDK' },
  ]},
  { id: '73', nome: 'Performance Mobile',     descricao: 'Otimização de aplicativos móveis',                        competencia: 'Mobile', competenciaId: 'comp15',                   tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Identifica gargalos com profiler e aplica correções básicas' },
    { nivelId: '2', criterio: 'Otimiza re-renders, usa memoização e implementa carregamento lazy de recursos' },
    { nivelId: '3', criterio: 'Analisa traces nativas, reduz jank e garante 60fps em fluxos críticos do app' },
    { nivelId: '4', criterio: 'Define metas de performance do app e guia o time em profiling avançado' },
    { nivelId: '5', criterio: 'Define padrão de performance mobile para a organização e é referência em otimização de apps multiplataforma' },
  ]},

  // ─── Qualidade e Testes ────────────────────────────────────────────────────
  { id: '74', nome: 'Testes Unitários',       descricao: 'Criação de testes unitários com Jest ou similar',         competencia: 'Qualidade e Testes', competenciaId: 'comp16',       tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Escreve testes simples para funções isoladas com Jest' },
    { nivelId: '2', criterio: 'Aplica TDD, usa mocks/stubs e mantém cobertura de código significativa' },
    { nivelId: '3', criterio: 'Cria helpers de teste reutilizáveis, define padrões de mock e revisa testes do time com foco em design' },
    { nivelId: '4', criterio: 'Define estratégia de testes do time e conduz revisões de qualidade' },
    { nivelId: '5', criterio: 'Define filosofia de testes para múltiplos produtos, habilita TDD no time e publica práticas de qualidade' },
  ]},
  { id: '75', nome: 'Testes de Integração',   descricao: 'Testes entre camadas e contratos de API',                 competencia: 'Qualidade e Testes', competenciaId: 'comp16',       tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Escreve testes de integração básicos com banco de dados em memória' },
    { nivelId: '2', criterio: 'Testa contratos de API, usa TestContainers e isola dependências externas' },
    { nivelId: '3', criterio: 'Estrutura suítes de testes de integração com ambientes isolados e dados de teste gerenciados' },
    { nivelId: '4', criterio: 'Define pirâmide de testes do projeto e garante confiabilidade dos contratos' },
    { nivelId: '5', criterio: 'Define estratégia de testes de integração para plataformas distribuídas e lidera comunidade de qualidade' },
  ]},
  { id: '76', nome: 'Automação de Testes',    descricao: 'Testes end-to-end com Cypress, Playwright ou similar',    competencia: 'Qualidade e Testes', competenciaId: 'comp16',       tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Cria testes E2E básicos com Cypress ou Playwright usando seletores simples' },
    { nivelId: '2', criterio: 'Organiza suítes de testes, usa Page Object Model e integra em CI/CD' },
    { nivelId: '3', criterio: 'Cria frameworks de teste reutilizáveis e implementa visual regression testing' },
    { nivelId: '4', criterio: 'Define estratégia de automação E2E e treina o time em boas práticas' },
    { nivelId: '5', criterio: 'Define plataforma de automação de testes da organização e forma engenheiros de qualidade' },
  ]},

  // ─── Inteligência Artificial ───────────────────────────────────────────────
  { id: '77', nome: 'Machine Learning Básico', descricao: 'Conceitos e aplicação prática de ML',                   competencia: 'Inteligência Artificial', competenciaId: 'comp17',  tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Entende regressão e classificação e usa scikit-learn em exemplos guiados' },
    { nivelId: '2', criterio: 'Prepara dados, escolhe algoritmos adequados e avalia modelos com métricas' },
    { nivelId: '3', criterio: 'Otimiza hiperparâmetros, aplica feature engineering avançada e interpreta modelos com XAI' },
    { nivelId: '4', criterio: 'Projeta pipelines de ML, detecta viés e orienta o time em experimentações' },
    { nivelId: '5', criterio: 'Define estratégia de ML da organização, lidera programa de responsible AI e publica pesquisas internas' },
  ]},
  { id: '78', nome: 'Prompt Engineering',     descricao: 'Criação e otimização de prompts para LLMs',              competencia: 'Inteligência Artificial', competenciaId: 'comp17',  tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Usa técnicas básicas de prompting (zero-shot, few-shot) com LLMs populares' },
    { nivelId: '2', criterio: 'Aplica chain-of-thought, RAG e avalia qualidade de saídas sistematicamente' },
    { nivelId: '3', criterio: 'Implementa agentes LLM com ferramentas, avalia alucinações e cria benchmarks internos' },
    { nivelId: '4', criterio: 'Define estratégia de IA generativa do produto e avalia modelos para casos de uso' },
    { nivelId: '5', criterio: 'Define governança de IA generativa da organização e representa a empresa em discussões de política de IA' },
  ]},
  { id: '79', nome: 'MLOps',                  descricao: 'Operacionalização de modelos de Machine Learning',       competencia: 'Inteligência Artificial', competenciaId: 'comp17',  tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Empacota e implanta modelos simples com APIs REST' },
    { nivelId: '2', criterio: 'Implementa monitoramento de modelos, data drift e retreinamento automatizado' },
    { nivelId: '3', criterio: 'Configura plataforma MLOps (MLflow, Vertex) e garante reprodutibilidade de experimentos' },
    { nivelId: '4', criterio: 'Lidera plataforma de ML e define práticas de governança de modelos' },
    { nivelId: '5', criterio: 'Define arquitetura de MLOps para múltiplos times e é referência em produtização de modelos' },
  ]},

  // ─── Redes e Infraestrutura ────────────────────────────────────────────────
  { id: '80', nome: 'Protocolos de Rede',     descricao: 'TCP/IP, HTTP, DNS e fundamentos de redes',               competencia: 'Redes e Infraestrutura', competenciaId: 'comp18',   tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Entende modelo OSI, TCP/IP e depura problemas básicos de conectividade' },
    { nivelId: '2', criterio: 'Configura roteamento, resolve latência e analisa tráfego com Wireshark' },
    { nivelId: '3', criterio: 'Projeta segmentação de rede, analisa flows e define regras de QoS para aplicações críticas' },
    { nivelId: '4', criterio: 'Projeta topologias de rede seguras e resilientes para ambientes de produção' },
    { nivelId: '5', criterio: 'Define arquitetura de rede corporativa, avalia tecnologias emergentes (SD-WAN, SASE) e forma engenheiros' },
  ]},
  { id: '81', nome: 'DNS e Load Balancer',    descricao: 'Resolução de nomes e balanceamento de carga',             competencia: 'Redes e Infraestrutura', competenciaId: 'comp18',   tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Configura registros DNS básicos (A, CNAME) e entende como load balancers funcionam' },
    { nivelId: '2', criterio: 'Projeta alta disponibilidade com load balancers e define estratégias de failover' },
    { nivelId: '3', criterio: 'Implementa health checks avançados, canary deployments e traffic shifting com load balancers' },
    { nivelId: '4', criterio: 'Lidera decisões de arquitetura de rede para disponibilidade e performance' },
    { nivelId: '5', criterio: 'Define estratégia de edge computing e CDN da organização e é referência em disponibilidade global' },
  ]},
  { id: '82', nome: 'Firewall e Segurança de Rede', descricao: 'Proteção e segmentação de redes',                  competencia: 'Redes e Infraestrutura', competenciaId: 'comp18',   tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Configura regras básicas de firewall e entende grupos de segurança em cloud' },
    { nivelId: '2', criterio: 'Projeta segmentação de rede com VPCs, VLANs e implementa zero-trust básico' },
    { nivelId: '3', criterio: 'Audita políticas de rede, implementa IDS/IPS e revisa postura de segurança com regularidade' },
    { nivelId: '4', criterio: 'Define política de segurança de rede corporativa e conduz revisões de postura' },
    { nivelId: '5', criterio: 'Define arquitetura zero-trust para a organização e representa segurança em decisões de infraestrutura' },
  ]},

  // ─── Gestão de Projetos ────────────────────────────────────────────────────
  { id: '83', nome: 'Planejamento de Projetos', descricao: 'Escopo, cronograma e gestão de entregas',             competencia: 'Gestão de Projetos', competenciaId: 'comp19',       tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Participa de cerimônias de planejamento e entende o escopo das suas tarefas' },
    { nivelId: '2', criterio: 'Estrutura backlog, estima com técnicas formais e acompanha progresso proativamente' },
    { nivelId: '3', criterio: 'Gerencia entregas de projetos médios com autonomia, controlando escopo, prazo e qualidade' },
    { nivelId: '4', criterio: 'Lidera planejamento de projetos complexos e gerencia dependências e stakeholders' },
    { nivelId: '5', criterio: 'Define metodologia de gestão de projetos da organização e certifica profissionais internos' },
  ]},
  { id: '84', nome: 'Gestão de Riscos',       descricao: 'Identificação e mitigação de riscos em projetos',        competencia: 'Gestão de Projetos', competenciaId: 'comp19',       tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Identifica riscos técnicos óbvios e reporta ao time ou gestor' },
    { nivelId: '2', criterio: 'Cria matriz de riscos, propõe mitigações e acompanha planos de contingência' },
    { nivelId: '3', criterio: 'Revisa riscos periodicamente e escala decisões de mitigação com dados e histórico' },
    { nivelId: '4', criterio: 'Lidera gestão de riscos de iniciativas estratégicas e dissemina a prática' },
    { nivelId: '5', criterio: 'Define framework de gestão de riscos corporativo e forma gestores na prática' },
  ]},
  { id: '85', nome: 'Métricas de Engenharia', descricao: 'DORA metrics, qualidade e saúde do time',                competencia: 'Gestão de Projetos', competenciaId: 'comp19',       tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Acompanha métricas de deployment frequency e lead time' },
    { nivelId: '2', criterio: 'Define OKRs técnicos, monitora tendências e propõe melhorias baseadas em dados' },
    { nivelId: '3', criterio: 'Cria dashboards de saúde do time e usa métricas para priorizar iniciativas de melhoria' },
    { nivelId: '4', criterio: 'Lidera cultura de melhoria contínua e reporta métricas para a liderança' },
    { nivelId: '5', criterio: 'Define padrão de métricas de engenharia para múltiplos times e conecta indicadores técnicos a resultados de negócio' },
  ]},

  // ─── Liderança Técnica ────────────────────────────────────────────────────
  { id: '86', nome: 'Delegação e Empoderamento', descricao: 'Distribuir responsabilidades e desenvolver autonomia', competencia: 'Liderança Técnica', competenciaId: 'comp20',        tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Aceita tarefas delegadas com clareza e executa com autonomia crescente' },
    { nivelId: '2', criterio: 'Distribui tarefas ao time considerando capacidade e potencial de desenvolvimento' },
    { nivelId: '3', criterio: 'Delega com contexto e critérios claros, acompanha sem microgerenciar e dá feedback de desenvolvimento' },
    { nivelId: '4', criterio: 'Cria sistemas de responsabilidade que geram autonomia e crescimento no time' },
    { nivelId: '5', criterio: 'Forma líderes capazes de delegar com excelência e é referência organizacional em empoderamento de times' },
  ]},
  { id: '87', nome: 'Desenvolvimento de Pessoas', descricao: 'Mentoria e crescimento de profissionais',            competencia: 'Liderança Técnica', competenciaId: 'comp20',        tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Compartilha conhecimento informalmente e apoia colegas em dúvidas técnicas' },
    { nivelId: '2', criterio: 'Estrutura planos de desenvolvimento para o time e oferece mentoria formal' },
    { nivelId: '3', criterio: 'Conduz 1:1s de impacto, identifica gaps de crescimento e acompanha trajetórias individuais' },
    { nivelId: '4', criterio: 'Lidera cultura de aprendizado contínuo e desenvolve lideranças no time' },
    { nivelId: '5', criterio: 'Forma gerentes e tech leads e é referência organizacional em desenvolvimento de talentos de tecnologia' },
  ]},
  { id: '88', nome: 'Tomada de Decisão',      descricao: 'Decisões técnicas e de negócio com qualidade e agilidade', competencia: 'Liderança Técnica', competenciaId: 'comp20',      tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Toma decisões no escopo das suas tarefas com clareza e documenta o raciocínio' },
    { nivelId: '2', criterio: 'Decide em contextos de ambiguidade, usa frameworks decisórios e alinha stakeholders' },
    { nivelId: '3', criterio: 'Facilita decisões coletivas com estrutura, garante que todos têm voz e registra critérios' },
    { nivelId: '4', criterio: 'Lidera decisões estratégicas, cria consenso no time e aprende com resultados' },
    { nivelId: '5', criterio: 'Define cultura decisória da organização, forma líderes em frameworks de decisão e acelera velocidade sem perder qualidade' },
  ]},

  // ─── Comunicação Estratégica ───────────────────────────────────────────────
  { id: '89', nome: 'Apresentações Executivas', descricao: 'Comunicação com liderança e stakeholders',             competencia: 'Comunicação Estratégica', competenciaId: 'comp21',  tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Prepara apresentações estruturadas para públicos técnicos do time' },
    { nivelId: '2', criterio: 'Adapta linguagem e nível de abstração para audiências de diferentes áreas' },
    { nivelId: '3', criterio: 'Estrutura narrativas com dados e impacto de negócio para gestores de área' },
    { nivelId: '4', criterio: 'Conduz apresentações estratégicas para diretoria e influencia decisões de negócio' },
    { nivelId: '5', criterio: 'Representa a organização externamente, influencia decisões de conselho e define padrão de comunicação executiva' },
  ]},
  { id: '90', nome: 'Negociação',             descricao: 'Alinhamento de expectativas e resolução de conflitos',   competencia: 'Comunicação Estratégica', competenciaId: 'comp21',  tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Expõe pontos de vista com clareza e busca acordo em situações simples' },
    { nivelId: '2', criterio: 'Usa técnicas de negociação baseada em interesses e encontra soluções ganha-ganha' },
    { nivelId: '3', criterio: 'Negocia prazos, escopo e recursos com partes internas com clareza de prioridades' },
    { nivelId: '4', criterio: 'Lidera negociações complexas com múltiplas partes e resolve impasses estratégicos' },
    { nivelId: '5', criterio: 'Conduz negociações corporativas estratégicas (parcerias, contratos) e forma negociadores no time' },
  ]},
  { id: '91', nome: 'Escuta Ativa',           descricao: 'Compreensão profunda de necessidades e perspectivas',    competencia: 'Comunicação Estratégica', competenciaId: 'comp21',  tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Ouve sem interromper e confirma entendimento em conversas cotidianas' },
    { nivelId: '2', criterio: 'Faz perguntas que aprofundam o entendimento e identifica necessidades não ditas' },
    { nivelId: '3', criterio: 'Conduz conversas difíceis com escuta empática e reformula perspectivas de forma construtiva' },
    { nivelId: '4', criterio: 'Usa escuta ativa para facilitar alinhamentos difíceis e cria segurança para falar' },
    { nivelId: '5', criterio: 'Modela escuta ativa para a organização e cria processos que garantem que todas as vozes sejam ouvidas' },
  ]},

  // ─── Colaboração Remota ────────────────────────────────────────────────────
  { id: '92', nome: 'Trabalho Assíncrono',    descricao: 'Comunicação e entrega eficaz em times distribuídos',     competencia: 'Colaboração Remota', competenciaId: 'comp22',       tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Documenta decisões e atualizações de forma clara sem precisar ser lembrado' },
    { nivelId: '2', criterio: 'Define acordos de comunicação com o time e usa ferramentas assíncronas com maestria' },
    { nivelId: '3', criterio: 'Cria guias de trabalho assíncrono e onboarda novos membros nas práticas do time' },
    { nivelId: '4', criterio: 'Lidera cultura de trabalho assíncrono e cria sistemas de comunicação escaláveis' },
    { nivelId: '5', criterio: 'Define padrão organizacional de trabalho distribuído e é referência externa em times assíncronos de alta performance' },
  ]},
  { id: '93', nome: 'Ferramentas de Colaboração', descricao: 'Uso eficaz de Notion, Confluence, Slack e similares', competencia: 'Colaboração Remota', competenciaId: 'comp22',      tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Usa as ferramentas padrão do time para comunicação e documentação básica' },
    { nivelId: '2', criterio: 'Cria estruturas de documentação que o time consegue manter e encontrar facilmente' },
    { nivelId: '3', criterio: 'Padroniza templates e fluxos de documentação que reduzem retrabalho e buscas desnecessárias' },
    { nivelId: '4', criterio: 'Define o stack de colaboração do time e dissemina boas práticas de gestão do conhecimento' },
    { nivelId: '5', criterio: 'Define estratégia de gestão do conhecimento da organização e garante continuidade de informação crítica' },
  ]},
  { id: '94', nome: 'Gestão de Reuniões',     descricao: 'Condução eficaz de reuniões com objetivos claros',       competencia: 'Colaboração Remota', competenciaId: 'comp22',       tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Participa ativamente e chega preparado para as reuniões do time' },
    { nivelId: '2', criterio: 'Facilita reuniões com pauta clara, timeboxing e decisões registradas' },
    { nivelId: '3', criterio: 'Avalia regularidade e necessidade de cada recorrência e elimina reuniões sem valor claro' },
    { nivelId: '4', criterio: 'Define cultura de reuniões do time e maximiza tempo focado' },
    { nivelId: '5', criterio: 'Define política de reuniões para a organização e habilita times a maximizar tempo produtivo' },
  ]},

  // ─── Resolução de Problemas (extensão) ────────────────────────────────────
  { id: '95', nome: 'Root Cause Analysis',    descricao: 'Identificação das causas raiz de problemas e incidentes', competencia: 'Resolução de Problemas', competenciaId: 'comp7',   tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Usa os 5 Porquês para investigar problemas simples com orientação' },
    { nivelId: '2', criterio: 'Conduz análises com Fishbone e Pareto e propõe ações preventivas' },
    { nivelId: '3', criterio: 'Facilita análise de causa raiz em problemas recorrentes e acompanha efetividade das ações' },
    { nivelId: '4', criterio: 'Lidera análise de incidentes críticos e institucionaliza pós-mortems' },
    { nivelId: '5', criterio: 'Define cultura de análise de causa raiz para a organização e conecta aprendizados de incidentes a melhorias sistêmicas' },
  ]},
  { id: '96', nome: 'Pensamento Sistêmico',   descricao: 'Visão de interações e consequências em sistemas complexos', competencia: 'Resolução de Problemas', competenciaId: 'comp7',  tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Identifica impactos imediatos de mudanças no seu escopo de trabalho' },
    { nivelId: '2', criterio: 'Mapeia dependências entre sistemas e prevê efeitos de segunda ordem' },
    { nivelId: '3', criterio: 'Modela sistemas complexos com loops de feedback e usa diagramas de influência em decisões' },
    { nivelId: '4', criterio: 'Usa modelos sistêmicos para resolver problemas organizacionais e orienta o time' },
    { nivelId: '5', criterio: 'É referência em pensamento sistêmico, conecta dinâmicas organizacionais a estratégia de negócio e forma profissionais' },
  ]},
  { id: '97', nome: 'Priorização Estratégica', descricao: 'Técnicas para priorizar trabalho com impacto máximo',   competencia: 'Resolução de Problemas', competenciaId: 'comp7',   tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Prioriza tarefas do próprio escopo usando critérios claros' },
    { nivelId: '2', criterio: 'Usa frameworks (RICE, MoSCoW) para priorizar backlog com stakeholders' },
    { nivelId: '3', criterio: 'Alinha prioridades de múltiplos contextos considerando dependências e capacidade do time' },
    { nivelId: '4', criterio: 'Define critérios de priorização organizacional e facilita alinhamentos de roadmap' },
    { nivelId: '5', criterio: 'Define processo de priorização estratégica para múltiplos produtos e habilita líderes a dizer não com base em evidências' },
  ]},

  // ─── Gestão do Tempo ───────────────────────────────────────────────────────
  { id: '98', nome: 'Planejamento Pessoal',   descricao: 'Organização pessoal e gestão de agenda',                 competencia: 'Gestão do Tempo', competenciaId: 'comp23',          tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Mantém agenda organizada e cumpre compromissos com pontualidade' },
    { nivelId: '2', criterio: 'Usa sistema pessoal de produtividade e planeja semanas com clareza de objetivos' },
    { nivelId: '3', criterio: 'Integra planejamento pessoal com metas do time e antecipa bloqueios antes que virem problemas' },
    { nivelId: '4', criterio: 'Modela planejamento pessoal eficaz e compartilha práticas com o time' },
    { nivelId: '5', criterio: 'Define cultura de planejamento da organização e habilita profissionais a operarem com foco e clareza de impacto' },
  ]},
  { id: '99', nome: 'Gestão de Prioridades',  descricao: 'Foco nas atividades de maior impacto',                   competencia: 'Gestão do Tempo', competenciaId: 'comp23',          tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Distingue tarefas urgentes de importantes e executa o essencial primeiro' },
    { nivelId: '2', criterio: 'Negocia prazos proativamente e reestrutura prioridades diante de mudanças' },
    { nivelId: '3', criterio: 'Mantém foco do time em entregas de alto impacto mesmo sob pressão e múltiplas demandas' },
    { nivelId: '4', criterio: 'Ajuda o time a focar no que gera maior valor e elimina trabalho sem impacto' },
    { nivelId: '5', criterio: 'Define princípios de foco estratégico para a organização e cria sistemas que eliminam trabalho de baixo valor em escala' },
  ]},
  { id: '100', nome: 'Foco e Produtividade',  descricao: 'Capacidade de manter foco e entregar com consistência',  competencia: 'Gestão do Tempo', competenciaId: 'comp23',          tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Mantém foco durante blocos de trabalho e minimiza distrações no cotidiano' },
    { nivelId: '2', criterio: 'Usa técnicas (Pomodoro, deep work) e cria ambiente favorável à concentração' },
    { nivelId: '3', criterio: 'Protege blocos de trabalho focado para si e para o time, reduzindo interrupções estruturais' },
    { nivelId: '4', criterio: 'Estabelece normas de foco para o time e reduz interrupções desnecessárias' },
    { nivelId: '5', criterio: 'Define políticas organizacionais de foco e produtividade e é referência em times de alta performance sustentável' },
  ]},

  // ─── Adaptabilidade ───────────────────────────────────────────────────────
  { id: '101', nome: 'Gestão de Mudanças',    descricao: 'Adaptação e suporte em processos de transformação',      competencia: 'Adaptabilidade', competenciaId: 'comp24',           tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Aceita mudanças com abertura e adapta seu trabalho ao novo contexto' },
    { nivelId: '2', criterio: 'Contribui ativamente em mudanças e ajuda colegas a se adaptarem' },
    { nivelId: '3', criterio: 'Comunica mudanças com antecedência, explica o porquê e reduz ansiedade do time no processo' },
    { nivelId: '4', criterio: 'Lidera iniciativas de mudança, reduz resistência e acelera a adoção' },
    { nivelId: '5', criterio: 'Define metodologia de change management para a organização e é referência em transformações culturais' },
  ]},
  { id: '102', nome: 'Aprendizado Contínuo',  descricao: 'Busca proativa de novos conhecimentos e habilidades',    competencia: 'Adaptabilidade', competenciaId: 'comp24',           tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Estuda regularmente e aplica aprendizados ao trabalho quando solicitado' },
    { nivelId: '2', criterio: 'Experimenta novas tecnologias proativamente e compartilha aprendizados com o time' },
    { nivelId: '3', criterio: 'Organiza comunidades de aprendizado (guild, study group) e estimula troca de conhecimento entre pares' },
    { nivelId: '4', criterio: 'Cria cultura de aprendizado contínuo e identifica tendências relevantes para o negócio' },
    { nivelId: '5', criterio: 'Define estratégia de learning & development técnico da organização e conecta aprendizado a resultados de carreira' },
  ]},
  { id: '103', nome: 'Resiliência Operacional', descricao: 'Manutenção da performance em situações adversas',      competencia: 'Adaptabilidade', competenciaId: 'comp24',           tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Mantém qualidade de entrega mesmo em períodos de alta demanda ou incerteza' },
    { nivelId: '2', criterio: 'Recupera o time de crises mantendo foco em soluções e minimizando impacto emocional' },
    { nivelId: '3', criterio: 'Identifica sinais de esgotamento no time antecipadamente e ajusta ritmo de trabalho com inteligência' },
    { nivelId: '4', criterio: 'Constrói processos resilientes e prepara o time para operar sob pressão prolongada' },
    { nivelId: '5', criterio: 'Define padrões de saúde operacional para a organização e é referência em times que entregam alta performance de forma sustentável' },
  ]},

  // ─── Pensamento Estratégico ────────────────────────────────────────────────
  { id: '104', nome: 'Visão de Negócio',      descricao: 'Compreensão do modelo de negócio e impacto das decisões técnicas', competencia: 'Pensamento Estratégico', competenciaId: 'comp25', tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Entende como o produto gera valor e como seu trabalho contribui' },
    { nivelId: '2', criterio: 'Avalia impacto de decisões técnicas em métricas de negócio' },
    { nivelId: '3', criterio: 'Conecta decisões do dia a dia a objetivos estratégicos do produto e propõe iniciativas com visão de negócio' },
    { nivelId: '4', criterio: 'Propõe iniciativas técnicas alinhadas à estratégia da empresa e influencia o roadmap' },
    { nivelId: '5', criterio: 'Define direção estratégica técnica da organização, alinha liderança e é interlocutor de negócio no nível executivo' },
  ]},
  { id: '105', nome: 'Análise de Mercado',    descricao: 'Avaliação de tendências e posicionamento competitivo',   competencia: 'Pensamento Estratégico', competenciaId: 'comp25',   tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Acompanha tendências tecnológicas e do mercado de forma autônoma' },
    { nivelId: '2', criterio: 'Analisa concorrentes e traduz insights em propostas para o produto' },
    { nivelId: '3', criterio: 'Apresenta análises de mercado para o time com recomendações acionáveis e priorizadas' },
    { nivelId: '4', criterio: 'Lidera análises estratégicas de mercado e conecta tecnologia a vantagens competitivas' },
    { nivelId: '5', criterio: 'Define estratégia competitiva da organização no mercado tecnológico e representa a empresa em fóruns do setor' },
  ]},
  { id: '106', nome: 'Inovação',              descricao: 'Geração e validação de ideias de alto impacto',           competencia: 'Pensamento Estratégico', competenciaId: 'comp25',   tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Sugere melhorias incrementais e experimenta soluções alternativas no cotidiano' },
    { nivelId: '2', criterio: 'Conduz experimentos estruturados e valida hipóteses com dados' },
    { nivelId: '3', criterio: 'Facilita sessões de ideação com o time, prioriza experimentos por impacto e aprende com falhas rápidas' },
    { nivelId: '4', criterio: 'Lidera ciclos de inovação, cria cultura de experimentação e escala sucessos' },
    { nivelId: '5', criterio: 'Define programa de inovação da organização, identifica oportunidades disruptivas e conecta pesquisa a produto' },
  ]},

  // ─── Orientação a Resultados ───────────────────────────────────────────────
  { id: '107', nome: 'Gestão de Metas',       descricao: 'Definição, acompanhamento e alcance de objetivos',       competencia: 'Orientação a Resultados', competenciaId: 'comp26',  tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Entende suas metas, acompanha progresso e reporta status proativamente' },
    { nivelId: '2', criterio: 'Define metas SMART para o time, monitora com OKRs e ajusta curso quando necessário' },
    { nivelId: '3', criterio: 'Revisa metas com o time regularmente, identifica bloqueios antecipados e reformula key results quando o contexto muda' },
    { nivelId: '4', criterio: 'Lidera o processo de OKRs da área e cria accountability organizacional' },
    { nivelId: '5', criterio: 'Define o sistema de gestão por objetivos da organização e é referência em alinhamento estratégico de metas' },
  ]},
  { id: '108', nome: 'Accountability',        descricao: 'Responsabilização pessoal e do time por resultados',     competencia: 'Orientação a Resultados', competenciaId: 'comp26',  tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Assume responsabilidade pelos próprios resultados sem transferir culpa' },
    { nivelId: '2', criterio: 'Cria ambiente de accountability no time e aborda desvios de forma construtiva' },
    { nivelId: '3', criterio: 'Conduz revisões de resultado com o time usando dados e conversas diretas e sem julgamento' },
    { nivelId: '4', criterio: 'Estabelece cultura de alta performance onde o time se responsabiliza coletivamente' },
    { nivelId: '5', criterio: 'Define cultura de accountability para a organização e forma líderes capazes de criar times autorresponsáveis' },
  ]},
  { id: '109', nome: 'Foco no Cliente',       descricao: 'Orientação às necessidades do cliente interno e externo', competencia: 'Orientação a Resultados', competenciaId: 'comp26',  tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Considera o impacto das suas entregas no cliente e prioriza sua satisfação' },
    { nivelId: '2', criterio: 'Busca feedback do cliente e propõe melhorias medindo resultados pelo lado do usuário' },
    { nivelId: '3', criterio: 'Incorpora pesquisa com usuários na rotina do time e defende necessidades do cliente em decisões técnicas' },
    { nivelId: '4', criterio: 'Lidera cultura centrada no cliente e conecta decisões técnicas ao sucesso do cliente' },
    { nivelId: '5', criterio: 'Define estratégia de customer success para a organização e é referência em design orientado ao cliente' },
  ]},

  // ─── Finanças Corporativas ─────────────────────────────────────────────────
  { id: '110', nome: 'Análise de Demonstrações Financeiras', descricao: 'Leitura e interpretação de balanços, DRE e fluxo de caixa', competencia: 'Finanças Corporativas', competenciaId: 'comp27', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Lê e interpreta demonstrações financeiras básicas com auxílio' },
    { nivelId: '2', criterio: 'Analisa tendências e indicadores financeiros com autonomia' },
    { nivelId: '3', criterio: 'Elabora análises de variação e compara indicadores com benchmarks do setor' },
    { nivelId: '4', criterio: 'Produz análises comparativas e orienta decisões estratégicas com base em demonstrações' },
    { nivelId: '5', criterio: 'É referência em análise financeira, assessora C-level em decisões de alocação de capital e define padrões analíticos da organização' },
  ]},
  { id: '111', nome: 'Gestão de Fluxo de Caixa', descricao: 'Controle e projeção das entradas e saídas financeiras', competencia: 'Finanças Corporativas', competenciaId: 'comp27', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Registra e categoriza transações financeiras conforme processos estabelecidos' },
    { nivelId: '2', criterio: 'Elabora projeções de fluxo de caixa e identifica riscos de liquidez' },
    { nivelId: '3', criterio: 'Monitora posição de caixa em tempo real e antecipa necessidades de funding com margem adequada' },
    { nivelId: '4', criterio: 'Define estratégias de gestão de caixa e otimiza capital de giro' },
    { nivelId: '5', criterio: 'Define política de tesouraria corporativa e representa a empresa em negociações com instituições financeiras' },
  ]},
  { id: '112', nome: 'Elaboração de Budget', descricao: 'Planejamento e controle do orçamento empresarial', competencia: 'Finanças Corporativas', competenciaId: 'comp27', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Apoia a coleta de informações e preenchimento de planilhas orçamentárias' },
    { nivelId: '2', criterio: 'Elabora orçamentos por centro de custo e acompanha variações mensais' },
    { nivelId: '3', criterio: 'Consolida e reconcilia budgets de múltiplas áreas, produzindo análise de variação com insights acionáveis' },
    { nivelId: '4', criterio: 'Lidera o ciclo orçamentário da empresa e apresenta análises para a diretoria' },
    { nivelId: '5', criterio: 'Define metodologia de planejamento orçamentário (zero-based, rolling forecast) e lidera transformação do processo na organização' },
  ]},
  { id: '113', nome: 'Modelagem Financeira', descricao: 'Criação de modelos para projeções e avaliações financeiras', competencia: 'Finanças Corporativas', competenciaId: 'comp27', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Constrói planilhas financeiras básicas com fórmulas e premissas fornecidas' },
    { nivelId: '2', criterio: 'Desenvolve modelos de projeção e valuation com premissas próprias' },
    { nivelId: '3', criterio: 'Modela cenários de stress test e sensibilidade para suporte a decisões de médio prazo' },
    { nivelId: '4', criterio: 'Projeta modelos complexos de fusões, aquisições e avaliação estratégica' },
    { nivelId: '5', criterio: 'É referência em modelagem financeira, define padrões corporativos e assessora board em decisões de M&A e investimentos estratégicos' },
  ]},

  // ─── Contabilidade e Fiscal ────────────────────────────────────────────────
  { id: '114', nome: 'Contabilidade Gerencial', descricao: 'Geração de informações contábeis para apoio à gestão', competencia: 'Contabilidade e Fiscal', competenciaId: 'comp28', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Realiza lançamentos contábeis e conciliações sob orientação' },
    { nivelId: '2', criterio: 'Produz relatórios gerenciais e apura resultados por centro de custo' },
    { nivelId: '3', criterio: 'Analisa desvios de resultado, elabora relatórios gerenciais com comentários analíticos e propõe ajustes' },
    { nivelId: '4', criterio: 'Define metodologia contábil e apresenta análises para tomada de decisão gerencial' },
    { nivelId: '5', criterio: 'Define padrões de contabilidade gerencial da organização e lidera implementação de sistemas de gestão financeira' },
  ]},
  { id: '115', nome: 'Gestão Tributária', descricao: 'Conhecimento e gestão das obrigações fiscais da empresa', competencia: 'Contabilidade e Fiscal', competenciaId: 'comp28', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Identifica os tributos aplicáveis e apoia o preenchimento de obrigações acessórias' },
    { nivelId: '2', criterio: 'Gerencia o ciclo de apuração e recolhimento de tributos com autonomia' },
    { nivelId: '3', criterio: 'Identifica oportunidades de planejamento tributário lícito e propõe alternativas de economia fiscal' },
    { nivelId: '4', criterio: 'Lidera estratégias de planejamento tributário e coordena auditorias fiscais' },
    { nivelId: '5', criterio: 'Define estratégia tributária corporativa, avalia impacto de mudanças legislativas e representa a empresa perante o fisco' },
  ]},
  { id: '116', nome: 'Conformidade Fiscal', descricao: 'Garantia de aderência às obrigações legais e regulatórias fiscais', competencia: 'Contabilidade e Fiscal', competenciaId: 'comp28', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Acompanha prazos e entrega obrigações acessórias com supervisão' },
    { nivelId: '2', criterio: 'Monitora mudanças na legislação e adapta processos internos' },
    { nivelId: '3', criterio: 'Garante conformidade fiscal de múltiplas entidades e elabora parecer técnico sobre novas normas' },
    { nivelId: '4', criterio: 'Implementa programas de compliance fiscal e lidera relacionamento com autoridades' },
    { nivelId: '5', criterio: 'Define política de conformidade fiscal da organização, conduz due diligence e forma profissionais na área' },
  ]},

  // ─── Gestão de Projetos (Financeiro) ──────────────────────────────────────
  { id: '117', nome: 'Planejamento Orçamentário', descricao: 'Estruturação e acompanhamento do orçamento de projetos e iniciativas', competencia: 'Gestão de Projetos', competenciaId: 'comp19', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Registra custos de projetos e acompanha orçamento com orientação' },
    { nivelId: '2', criterio: 'Elabora planos orçamentários de projetos e controla variações' },
    { nivelId: '3', criterio: 'Analisa variações de custo com earned value, propõe reprevisões e comunica impactos ao gestor' },
    { nivelId: '4', criterio: 'Lidera planejamento financeiro de portfólio de projetos e alinha com estratégia da empresa' },
    { nivelId: '5', criterio: 'Define padrão de gestão financeira de portfólio para a organização e forma gestores de projeto em controle orçamentário' },
  ]},

  // ─── Gestão de Produto ────────────────────────────────────────────────────
  { id: '118', nome: 'Discovery de Produto', descricao: 'Identificação e validação de oportunidades de produto com usuários e dados', competencia: 'Gestão de Produto', competenciaId: 'comp29', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Participa de entrevistas e pesquisas com usuários documentando achados' },
    { nivelId: '2', criterio: 'Conduz ciclos de discovery com métodos qualitativos e quantitativos de forma autônoma' },
    { nivelId: '3', criterio: 'Combina múltiplos métodos de pesquisa, sintetiza achados em oportunidades priorizadas e valida hipóteses rapidamente' },
    { nivelId: '4', criterio: 'Define o processo de discovery do time e orienta priorização com base em evidências' },
    { nivelId: '5', criterio: 'Define cultura de discovery orientado por evidências para múltiplos produtos e forma PMs e designers na prática' },
  ]},
  { id: '119', nome: 'Definição de Roadmap', descricao: 'Criação e comunicação do plano estratégico de evolução do produto', competencia: 'Gestão de Produto', competenciaId: 'comp29', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Contribui com itens para o roadmap e entende as priorizações do time' },
    { nivelId: '2', criterio: 'Elabora roadmap com visão de curto e médio prazo alinhado a stakeholders' },
    { nivelId: '3', criterio: 'Mantém roadmap atualizado com contexto de negócio, comunica mudanças com transparência e gerencia expectativas' },
    { nivelId: '4', criterio: 'Define visão de longo prazo do produto e conecta roadmap à estratégia da empresa' },
    { nivelId: '5', criterio: 'Define estratégia de produto para a organização, lidera decisões de portfólio e inspira times com visão de futuro' },
  ]},
  { id: '120', nome: 'Métricas de Produto', descricao: 'Definição e análise de indicadores para medir o sucesso do produto', competencia: 'Gestão de Produto', competenciaId: 'comp29', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Acompanha métricas básicas de produto com ferramentas como Analytics ou Mixpanel' },
    { nivelId: '2', criterio: 'Define North Star Metric, OKRs de produto e analisa funis de conversão' },
    { nivelId: '3', criterio: 'Cria framework de métricas hierárquico (input → output → outcome) e detecta anomalias nos dados com agilidade' },
    { nivelId: '4', criterio: 'Estrutura framework de métricas do produto e dissemina cultura data-driven no time' },
    { nivelId: '5', criterio: 'Define arquitetura de dados de produto para a organização e é referência em experimentação e análise de impacto' },
  ]},
  { id: '121', nome: 'Priorização de Backlog', descricao: 'Ordenação do backlog de produto por impacto e esforço', competencia: 'Gestão de Produto', competenciaId: 'comp29', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Documenta requisitos e apoia o refinamento do backlog com o time' },
    { nivelId: '2', criterio: 'Prioriza backlog com frameworks (RICE, ICE) e alinha com stakeholders' },
    { nivelId: '3', criterio: 'Mantém backlog saudável, revisa prioridades com dados e explica trade-offs com clareza ao time e stakeholders' },
    { nivelId: '4', criterio: 'Define critérios de priorização organizacional e facilita decisões em cenários de conflito' },
    { nivelId: '5', criterio: 'Define processo de priorização de portfólio para múltiplos produtos e forma PMs em tomada de decisão orientada por valor' },
  ]},

  // ─── Metodologias Ágeis (Produto) ─────────────────────────────────────────
  { id: '122', nome: 'Gestão de Stakeholders', descricao: 'Alinhamento e gestão de expectativas com partes interessadas do produto', competencia: 'Metodologias Ágeis', competenciaId: 'comp4', tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Comunica atualizações do produto e coleta feedback de stakeholders' },
    { nivelId: '2', criterio: 'Gerencia expectativas, negocia escopo e cria canais de comunicação estruturados' },
    { nivelId: '3', criterio: 'Mapeia influência de stakeholders, prioriza relacionamentos estratégicos e cria rituais de alinhamento eficazes' },
    { nivelId: '4', criterio: 'Influencia stakeholders executivos e constrói alianças estratégicas para o produto' },
    { nivelId: '5', criterio: 'É referência em gestão de stakeholders C-level, constrói coalizões organizacionais e representa produto em decisões corporativas' },
  ]},

  // ─── Análise de Dados (Produto) ───────────────────────────────────────────
  { id: '123', nome: 'Análise de Comportamento do Usuário', descricao: 'Interpretação de dados de uso para embasar decisões de produto', competencia: 'Análise de Dados', competenciaId: 'comp13', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Consome relatórios de uso e interpreta dados básicos de comportamento' },
    { nivelId: '2', criterio: 'Realiza análises de cohort, funil e retenção usando ferramentas analíticas' },
    { nivelId: '3', criterio: 'Cruza dados qualitativos e quantitativos para identificar padrões de comportamento não óbvios' },
    { nivelId: '4', criterio: 'Define instrumentação de dados do produto e orienta experimentos de otimização' },
    { nivelId: '5', criterio: 'Define arquitetura de analytics comportamental da organização e forma analistas de produto' },
  ]},

  // ─── Design de Produto ────────────────────────────────────────────────────
  { id: '124', nome: 'Pesquisa com Usuários', descricao: 'Condução de pesquisas para entender necessidades e comportamentos dos usuários', competencia: 'Design de Produto', competenciaId: 'comp30', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Participa de entrevistas e testes de usabilidade coletando notas e observações' },
    { nivelId: '2', criterio: 'Planeja e conduz pesquisas qualitativas e quantitativas com autonomia' },
    { nivelId: '3', criterio: 'Triangula múltiplos métodos de pesquisa, produz relatórios com recomendações acionáveis e comunica ao time de produto' },
    { nivelId: '4', criterio: 'Define estratégia de pesquisa do produto e sintetiza insights em decisões de design' },
    { nivelId: '5', criterio: 'Define programa de pesquisa com usuários da organização, cria comunidade de pesquisadores e forma designers em UXR' },
  ]},
  { id: '125', nome: 'Prototipação', descricao: 'Criação de protótipos para validar ideias antes do desenvolvimento', competencia: 'Design de Produto', competenciaId: 'comp30', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Cria wireframes e protótipos básicos em Figma ou ferramenta similar' },
    { nivelId: '2', criterio: 'Desenvolve protótipos interativos de alta fidelidade para testes com usuários' },
    { nivelId: '3', criterio: 'Escolhe fidelidade de protótipo ideal para cada fase de validação e conduz testes moderados com usuários' },
    { nivelId: '4', criterio: 'Define metodologia de prototipação do time e lidera ciclos de validação rápida' },
    { nivelId: '5', criterio: 'Define filosofia de prototipação da organização e forma designers em cultura de validação antes de construir' },
  ]},
  { id: '126', nome: 'Design System', descricao: 'Criação e manutenção de sistemas de design reutilizáveis e consistentes', competencia: 'Design de Produto', competenciaId: 'comp30', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Usa componentes do design system seguindo as diretrizes estabelecidas' },
    { nivelId: '2', criterio: 'Cria e documenta novos componentes mantendo consistência com o design system' },
    { nivelId: '3', criterio: 'Propõe evoluções no design system, revisa componentes com o time e garante adoção consistente' },
    { nivelId: '4', criterio: 'Define a arquitetura do design system e lidera sua adoção pelo time de produto' },
    { nivelId: '5', criterio: 'Define estratégia de design system multi-produto e é referência organizacional em consistência de experiência' },
  ]},
  { id: '127', nome: 'Testes de Usabilidade', descricao: 'Avaliação da usabilidade de produtos com usuários reais', competencia: 'Design de Produto', competenciaId: 'comp30', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Executa roteiros de teste e registra observações de usabilidade' },
    { nivelId: '2', criterio: 'Planeja e facilita sessões de teste, analisa resultados e propõe melhorias' },
    { nivelId: '3', criterio: 'Cria programa recorrente de testes de usabilidade com painel de usuários e métricas de maturidade da experiência' },
    { nivelId: '4', criterio: 'Define programa de testes contínuos e cria cultura de validação com usuários' },
    { nivelId: '5', criterio: 'Define padrão de qualidade de experiência para a organização e é referência em UX research e design centrado no usuário' },
  ]},

  // ─── Design Visual ────────────────────────────────────────────────────────
  { id: '128', nome: 'Interface Visual (UI)', descricao: 'Criação de interfaces visualmente coesas e alinhadas à identidade do produto', competencia: 'Design Visual', competenciaId: 'comp31', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Aplica estilos visuais e componentes existentes em novos layouts' },
    { nivelId: '2', criterio: 'Cria interfaces originais com hierarquia visual, tipografia e cores consistentes' },
    { nivelId: '3', criterio: 'Propõe evoluções visuais embasadas em dados e testa variações com usuários antes de consolidar' },
    { nivelId: '4', criterio: 'Define linguagem visual do produto e garante consistência em múltiplas plataformas' },
    { nivelId: '5', criterio: 'Define identidade visual de múltiplos produtos, orienta Art Directors e é referência em excelência visual na organização' },
  ]},
  { id: '129', nome: 'Motion Design', descricao: 'Criação de animações e transições para enriquecer a experiência do usuário', competencia: 'Design Visual', competenciaId: 'comp31', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Aplica animações pré-definidas e entende os princípios de timing e easing' },
    { nivelId: '2', criterio: 'Cria microinterações e transições que comunicam estado e guiam a atenção' },
    { nivelId: '3', criterio: 'Produz animações complexas com After Effects ou Lottie e garante desempenho nos dispositivos alvo' },
    { nivelId: '4', criterio: 'Define princípios de motion para o produto e orienta o time na aplicação de animações' },
    { nivelId: '5', criterio: 'Define linguagem de motion para múltiplos produtos, publica guias de referência e é reconhecido como referência em design de movimento' },
  ]},
  { id: '130', nome: 'Design de Marca', descricao: 'Desenvolvimento e aplicação de identidade visual e diretrizes de marca', competencia: 'Design Visual', competenciaId: 'comp31', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '6',  criterio: 'Aplica diretrizes de marca em materiais e comunicações com consistência' },
    { nivelId: '7',  criterio: 'Cria materiais de marca e adapta a identidade visual a novos canais e formatos' },
    { nivelId: '8',  criterio: 'Produz peças de marca originais para múltiplos canais mantendo coesão visual' },
    { nivelId: '9',  criterio: 'Define e evolui a identidade visual da marca e lidera sua expressão em todos os touchpoints' },
    { nivelId: '10', criterio: 'É referência em branding, constrói identidades de marca de alto impacto e orienta a estratégia de marca da organização' },
  ]},

  // ─── Arquitetura de Software (Engenharia) ─────────────────────────────────
  { id: '131', nome: 'Padrões de Design de Software', descricao: 'Aplicação de padrões de projeto e boas práticas de desenvolvimento', competencia: 'Arquitetura de Software', competenciaId: 'comp11', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '6',  criterio: 'Reconhece e aplica padrões comuns (Factory, Strategy) com orientação do time' },
    { nivelId: '7',  criterio: 'Seleciona padrões adequados ao contexto e aplica SOLID com autonomia' },
    { nivelId: '8',  criterio: 'Refatora código legado aplicando padrões adequados e documenta as decisões com clareza' },
    { nivelId: '9',  criterio: 'Define padrões arquiteturais para o projeto e conduz revisões de código e design' },
    { nivelId: '10', criterio: 'É referência em arquitetura de software, define padrões organizacionais e publica sobre design de software' },
  ]},
  { id: '132', nome: 'Documentação Técnica', descricao: 'Criação de documentação clara e útil para sistemas e decisões técnicas', competencia: 'Arquitetura de Software', competenciaId: 'comp11', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '6',  criterio: 'Documenta funcionalidades e APIs seguindo templates e padrões do time' },
    { nivelId: '7',  criterio: 'Cria ADRs, diagramas de arquitetura e documentação que o time consegue manter' },
    { nivelId: '8',  criterio: 'Produz documentação técnica de alta qualidade (runbooks, playbooks) e mede sua utilidade com o time' },
    { nivelId: '9',  criterio: 'Define padrões de documentação da organização e lidera cultura de knowledge sharing' },
    { nivelId: '10', criterio: 'É referência em gestão do conhecimento técnico, cria sistemas de documentação que sobrevivem à rotatividade e forma times' },
  ]},

  // ─── Qualidade e Testes (Engenharia) ──────────────────────────────────────
  { id: '133', nome: 'Testes Automatizados', descricao: 'Criação e manutenção de suítes de testes automatizados de software', competencia: 'Qualidade e Testes', competenciaId: 'comp16', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '6',  criterio: 'Escreve testes unitários básicos para funções e componentes com orientação' },
    { nivelId: '7',  criterio: 'Implementa pirâmide de testes com unitários, integração e E2E com cobertura significativa' },
    { nivelId: '8',  criterio: 'Mantém suítes de testes rápidas e confiáveis, elimina flakiness e garante feedback em menos de 10 min' },
    { nivelId: '9',  criterio: 'Define estratégia de automação de testes do time e garante qualidade no processo de CI/CD' },
    { nivelId: '10', criterio: 'Define programa de automação de qualidade para múltiplos produtos e forma engenheiros de QA' },
  ]},
  { id: '134', nome: 'Code Review', descricao: 'Revisão de código com foco em qualidade, segurança e boas práticas', competencia: 'Qualidade e Testes', competenciaId: 'comp16', tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '6',  criterio: 'Participa de code reviews dando feedbacks pontuais sobre bugs e legibilidade' },
    { nivelId: '7',  criterio: 'Conduz reviews completos avaliando arquitetura, segurança e aderência aos padrões' },
    { nivelId: '8',  criterio: 'Dá feedbacks de code review que ensinam e elevam a qualidade do time sem criar bloqueios no fluxo' },
    { nivelId: '9',  criterio: 'Define critérios de code review para o time e lidera a cultura de qualidade de código' },
    { nivelId: '10', criterio: 'É referência em cultura de code review, publica guias e forma engenheiros em revisão técnica de alto impacto' },
  ]},

  // ─── DevOps (Engenharia) ───────────────────────────────────────────────────
  { id: '135', nome: 'Integração Contínua', descricao: 'Configuração e manutenção de pipelines de build e testes automatizados', competencia: 'DevOps', competenciaId: 'comp9', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '6',  criterio: 'Configura pipelines básicos de CI com ferramentas como GitHub Actions' },
    { nivelId: '7',  criterio: 'Otimiza pipelines com stages paralelos, cache e integração com ferramentas de qualidade' },
    { nivelId: '8',  criterio: 'Mantém pipelines de CI com tempo de execução abaixo de 10 min e failure rate controlado' },
    { nivelId: '9',  criterio: 'Define estratégia de CI para múltiplos repositórios e times e reduz tempo de feedback' },
    { nivelId: '10', criterio: 'Define plataforma de CI da organização, reduz lead time de mudança e é referência em engenharia de entrega' },
  ]},
  { id: '136', nome: 'Gestão de Dependências', descricao: 'Controle e atualização de dependências de software com segurança', competencia: 'DevOps', competenciaId: 'comp9', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '6',  criterio: 'Instala e atualiza dependências seguindo orientação do time' },
    { nivelId: '7',  criterio: 'Audita vulnerabilidades, gerencia versões e define políticas de atualização' },
    { nivelId: '8',  criterio: 'Automatiza atualização de dependências com Dependabot ou similar e garante processo de validação segura' },
    { nivelId: '9',  criterio: 'Define estratégia de gestão de dependências para o portfólio de projetos da equipe' },
    { nivelId: '10', criterio: 'Define política de supply chain security para a organização e forma times em gestão segura de dependências' },
  ]},

  // ─── Gestão Operacional ───────────────────────────────────────────────────
  { id: '137', nome: 'Mapeamento de Processos', descricao: 'Documentação e análise de fluxos operacionais e processos de negócio', competencia: 'Gestão Operacional', competenciaId: 'comp33', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '6',  criterio: 'Documenta processos existentes em diagramas e checklists com orientação' },
    { nivelId: '7',  criterio: 'Mapeia processos AS-IS e TO-BE identificando ineficiências e oportunidades' },
    { nivelId: '8',  criterio: 'Facilita workshops de mapeamento com múltiplas áreas e consolida visão TO-BE com consenso das partes' },
    { nivelId: '9',  criterio: 'Lidera projetos de redesenho de processos críticos e implementa melhorias sistêmicas' },
    { nivelId: '10', criterio: 'Define metodologia de gestão de processos da organização e é referência em transformação operacional' },
  ]},
  { id: '138', nome: 'Indicadores Operacionais (KPIs)', descricao: 'Definição e acompanhamento de indicadores de performance operacional', competencia: 'Gestão Operacional', competenciaId: 'comp33', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '6',  criterio: 'Acompanha KPIs definidos e reporta desvios ao gestor' },
    { nivelId: '7',  criterio: 'Define KPIs de processos, cria dashboards e analisa tendências com autonomia' },
    { nivelId: '8',  criterio: 'Garante qualidade e confiabilidade dos KPIs operacionais e promove revisões periódicas de relevância' },
    { nivelId: '9',  criterio: 'Estrutura framework de indicadores operacionais e conecta métricas à estratégia da empresa' },
    { nivelId: '10', criterio: 'Define arquitetura de KPIs corporativos, conecta indicadores operacionais a OKRs estratégicos e forma gestores' },
  ]},
  { id: '139', nome: 'Melhoria Contínua', descricao: 'Aplicação de metodologias para otimização contínua de processos operacionais', competencia: 'Gestão Operacional', competenciaId: 'comp33', tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '6',  criterio: 'Identifica oportunidades de melhoria no próprio escopo e sugere soluções' },
    { nivelId: '7',  criterio: 'Conduz ciclos PDCA, aplica Lean e Kaizen para otimizar processos do time' },
    { nivelId: '8',  criterio: 'Facilita retrospectivas de processo com foco em dados e implementa melhorias com acompanhamento de impacto' },
    { nivelId: '9',  criterio: 'Lidera programas de melhoria contínua na organização e dissemina cultura de excelência operacional' },
    { nivelId: '10', criterio: 'Define sistema de melhoria contínua para a organização, integra Lean Six Sigma e forma black belts internos' },
  ]},
  { id: '140', nome: 'Gestão de SLA', descricao: 'Definição e monitoramento de acordos de nível de serviço', competencia: 'Gestão Operacional', competenciaId: 'comp33', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '6',  criterio: 'Monitora SLAs estabelecidos e escalona violações conforme processo' },
    { nivelId: '7',  criterio: 'Define SLAs com parceiros, cria mecanismos de monitoramento e planos de contingência' },
    { nivelId: '8',  criterio: 'Analisa padrões de violação de SLA, propõe ajustes nos processos e comunica impacto ao cliente' },
    { nivelId: '9',  criterio: 'Estrutura governança de SLA da operação e negocia contratos com fornecedores estratégicos' },
    { nivelId: '10', criterio: 'Define política de SLA corporativa, integra SLAs em contratos estratégicos e forma gestores em gestão de nível de serviço' },
  ]},

  // ─── Gestão de Projetos (Operações) ───────────────────────────────────────
  { id: '141', nome: 'Coordenação de Times Multidisciplinares', descricao: 'Articulação entre equipes de diferentes áreas para entrega de resultados', competencia: 'Gestão de Projetos', competenciaId: 'comp19', tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '6',  criterio: 'Participa de projetos multidisciplinares cumprindo responsabilidades do próprio escopo' },
    { nivelId: '7',  criterio: 'Coordena times multidisciplinares, remove impedimentos e garante alinhamento entre áreas' },
    { nivelId: '8',  criterio: 'Facilita acordos de trabalho entre áreas com papéis claros, ritmos definidos e comunicação eficaz' },
    { nivelId: '9',  criterio: 'Lidera iniciativas cross-funcionais complexas e constrói pontes entre áreas estratégicas' },
    { nivelId: '10', criterio: 'É referência em coordenação de iniciativas corporativas de alta complexidade e forma líderes de projetos multidisciplinares' },
  ]},

  // ─── Inovação e Estratégia ────────────────────────────────────────────────
  { id: '142', nome: 'Design Thinking', descricao: 'Aplicação da metodologia de design thinking para solução de problemas', competencia: 'Inovação e Estratégia', competenciaId: 'comp32', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '6',  criterio: 'Participa de workshops de design thinking entendendo as etapas da metodologia' },
    { nivelId: '7',  criterio: 'Facilita sessões de design thinking e sintetiza insights em protótipos de solução' },
    { nivelId: '8',  criterio: 'Adapta a metodologia ao contexto do problema, combina com outras abordagens e garante qualidade dos artefatos' },
    { nivelId: '9',  criterio: 'Lidera programas de design thinking na organização e treina times na metodologia' },
    { nivelId: '10', criterio: 'É referência em design thinking, publica sobre a metodologia e define programas de inovação centrada no usuário na organização' },
  ]},
  { id: '143', nome: 'Gestão de Inovação', descricao: 'Estruturação de processos para geração e implementação de inovações', competencia: 'Inovação e Estratégia', competenciaId: 'comp32', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '6',  criterio: 'Apoia iniciativas de inovação registrando ideias e acompanhando experimentos' },
    { nivelId: '7',  criterio: 'Gerencia o funil de inovação, prioriza experimentos e mede resultados de iniciativas' },
    { nivelId: '8',  criterio: 'Cria mecanismos de seleção e escalonamento de iniciativas de inovação com critérios claros de decisão' },
    { nivelId: '9',  criterio: 'Define estratégia de inovação da empresa e estrutura ecossistema de parcerias externas' },
    { nivelId: '10', criterio: 'Define e executa agenda de inovação corporativa, conecta open innovation a resultados de negócio e representa a organização no ecossistema' },
  ]},
  { id: '144', nome: 'Análise de Tendências', descricao: 'Identificação e análise de tendências de mercado e tecnologia', competencia: 'Inovação e Estratégia', competenciaId: 'comp32', tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '6',  criterio: 'Monitora fontes de tendências e compartilha achados relevantes com o time' },
    { nivelId: '7',  criterio: 'Analisa tendências e avalia seu impacto no negócio com embasamento' },
    { nivelId: '8',  criterio: 'Elabora relatórios de tendências periódicos com recomendações estratégicas para o negócio' },
    { nivelId: '9',  criterio: 'Lidera processo de análise de tendências e conecta insights à estratégia de inovação' },
    { nivelId: '10', criterio: 'Define programa de inteligência de mercado da organização e é reconhecido externamente como voz de referência sobre tendências do setor' },
  ]},
  { id: '145', nome: 'Prototipação Rápida', descricao: 'Construção ágil de protótipos para testar hipóteses de inovação', competencia: 'Inovação e Estratégia', competenciaId: 'comp32', tipo: 'Técnica', status: 'Ativa', niveis: [
    { nivelId: '6',  criterio: 'Participa de sprints de prototipação construindo artefatos com orientação' },
    { nivelId: '7',  criterio: 'Lidera criação de protótipos de baixo custo para validar hipóteses em dias' },
    { nivelId: '8',  criterio: 'Escolhe a ferramenta certa para cada tipo de hipótese e garante que o protótipo testa o risco principal' },
    { nivelId: '9',  criterio: 'Define metodologia de prototipação da organização e escala experimentos bem-sucedidos' },
    { nivelId: '10', criterio: 'É referência em cultura de experimentação rápida, publica sobre o tema e forma times em prototipação orientada a aprendizado' },
  ]},

  // ─── Pensamento Estratégico (Inovação) ────────────────────────────────────
  { id: '146', nome: 'Desenvolvimento de Propostas de Valor', descricao: 'Criação de propostas de valor diferenciadas para clientes e parceiros', competencia: 'Pensamento Estratégico', competenciaId: 'comp25', tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '6',  criterio: 'Entende a proposta de valor do produto e contribui com ideias de diferenciação' },
    { nivelId: '7',  criterio: 'Estrutura propostas de valor com canvas e valida com clientes reais' },
    { nivelId: '8',  criterio: 'Refina proposta de valor com dados de mercado e feedback de clientes, comunicando-a com clareza para o time' },
    { nivelId: '9',  criterio: 'Lidera o processo de definição e evolução da proposta de valor estratégica da empresa' },
    { nivelId: '10', criterio: 'É referência em estratégia de posicionamento, define propostas de valor para múltiplos segmentos e assessora a liderança em decisões de mercado' },
  ]},
];

// Escala de cores automática por peso (1–5): claro → escuro, texto sempre branco
const ESCALA_CORES_NIVEL: Record<number, string> = {
  1: '#60A5FA',
  2: '#2563EB',
  3: '#4338CA',
  4: '#5B21B6',
  5: '#581C87',
};

export function getCorFromPeso(peso: number): string {
  return ESCALA_CORES_NIVEL[Math.max(1, Math.min(5, peso))];
}

// Fonte única de verdade para os níveis de habilidades padrão
export const niveisDefaultData: Nivel[] = [
  { id: '1',  nome: 'Básico',        descricao: 'Conhecimento inicial. Realiza atividades simples com supervisão constante.',               peso: 1, status: 'Ativo', emUso: 45 },
  { id: '2',  nome: 'Intermediário', descricao: 'Executa tarefas com autonomia em situações conhecidas. Busca suporte em contextos novos.', peso: 2, status: 'Ativo', emUso: 38 },
  { id: '3',  nome: 'Avançado',      descricao: 'Atua com autonomia em situações complexas e orienta outros profissionais.',                peso: 4, status: 'Ativo', emUso: 22 },
  { id: '4',  nome: 'Especialista',  descricao: 'Referência na área. Define padrões, resolve problemas críticos e forma outros.',           peso: 5, status: 'Ativo', emUso: 12 },
  { id: '5',  nome: 'Proficiente',   descricao: 'Executa com consistência em contextos variados e começa a orientar colegas próximos.',     peso: 3, status: 'Ativo', emUso: 0  },
  { id: '6',  nome: 'Iniciante',     descricao: 'Primeiro contato com a área. Necessita de supervisão constante para executar atividades.', peso: 1, status: 'Ativo', emUso: 0  },
  { id: '7',  nome: 'Aprendiz',      descricao: 'Consegue executar tarefas básicas com apoio. Está desenvolvendo autonomia gradualmente.',  peso: 2, status: 'Ativo', emUso: 0  },
  { id: '8',  nome: 'Praticante',    descricao: 'Aplica conhecimentos com autonomia em situações conhecidas. Consolida a prática.',          peso: 3, status: 'Ativo', emUso: 0  },
  { id: '9',  nome: 'Experiente',    descricao: 'Opera com autonomia em situações complexas e apoia outros com desenvoltura.',               peso: 4, status: 'Ativo', emUso: 0  },
  { id: '10', nome: 'Referência',    descricao: 'Reconhecido como referência na área. Define padrões e forma outros profissionais.',         peso: 5, status: 'Ativo', emUso: 0  },
];

export function getPesoFromNome(nome: string): number {
  const nivel = niveisDefaultData.find(n => n.nome === nome);
  return nivel?.peso ?? 0;
}

// Retorna o nível mais recente respondido por um colaborador para uma habilidade,
// buscando em todas as avaliações. Usa periodoFim como critério de recência.
// Retorna null se o colaborador nunca respondeu sobre essa habilidade.
export function getNivelAtualColaborador(
  colaboradorId: string,
  habilidadeId: string
): string | null {
  let melhorNivel: string | null = null;
  let melhorData = '';

  for (const avaliacao of avaliacoesData) {
    const participante = avaliacao.participantes.find(p => p.colaboradorId === colaboradorId);
    const resposta = participante?.respostas.find(r => r.habilidadeId === habilidadeId);
    if (resposta) {
      const data = avaliacao.periodoFim ?? avaliacao.periodoInicio;
      if (data > melhorData) {
        melhorData = data;
        melhorNivel = resposta.nivelRespondido;
      }
    }
  }

  return melhorNivel;
}

// Retorna Map<habilidadeId, nivelMaisRecente> para todas as habilidades já avaliadas
// pelo colaborador. Mais eficiente que getNivelAtualColaborador em loop — percorre
// avaliacoesData uma única vez.
// Critério de recência: dataResposta de CADA resposta individual — nunca o
// periodoFim da avaliação inteira. Duas respostas da mesma avaliação podem ter
// dataResposta diferentes (rascunho salvo em datas distintas antes do envio),
// e usar o periodoFim da avaliação como proxy de "quando essa habilidade foi
// respondida" fazia essa função (e o Dashboard/Admin/páginas de teste que
// dependem dela) ignorar respostas mais recentes de uma habilidade só porque
// vieram de uma avaliação mais antiga — bug encontrado e corrigido em 2026-07-21.
export function getHabilidadesAvaliadasColaborador(
  colaboradorId: string
): Map<string, string> {
  const resultado = new Map<string, { nivel: string; data: string }>();

  for (const avaliacao of avaliacoesData) {
    const participante = avaliacao.participantes.find(p => p.colaboradorId === colaboradorId);
    if (!participante) continue;

    for (const resposta of participante.respostas) {
      const data = resposta.dataResposta;
      const atual = resultado.get(resposta.habilidadeId);
      if (!atual || data > atual.data) {
        resultado.set(resposta.habilidadeId, { nivel: resposta.nivelRespondido, data });
      }
    }
  }

  return new Map(Array.from(resultado.entries()).map(([id, v]) => [id, v.nivel]));
}

// ─── Dados exclusivos das telas de teste (João Silva, id='10') ────────────────

// Matriz do cargo de João (replica c2 + extensão com novas habilidades).
// Usada apenas pelas telas de teste — não afeta habilidadesCargoData nem Ana Silva.
// Distribuição João vs esta matriz: 5 ACIMA | 8 NO | 6 ABAIXO | 4 SEM
export const joaoHabilidadesCargoMatriz: JoaoHabilidadeCargoMatriz[] = [
  // Habilidades originais do cargo Desenvolvedor Pleno (c2)
  { habilidadeId: '1',   nivelEsperado: 'Intermediário' },
  { habilidadeId: '2',   nivelEsperado: 'Intermediário' },
  { habilidadeId: '3',   nivelEsperado: 'Intermediário' },
  { habilidadeId: '4',   nivelEsperado: 'Intermediário' },
  { habilidadeId: '18',  nivelEsperado: 'Intermediário' },
  { habilidadeId: '9',   nivelEsperado: 'Intermediário' },
  { habilidadeId: '10',  nivelEsperado: 'Intermediário' },
  { habilidadeId: '11',  nivelEsperado: 'Intermediário' },
  { habilidadeId: '12',  nivelEsperado: 'Básico' },
  { habilidadeId: '21',  nivelEsperado: 'Intermediário' },
  { habilidadeId: '22',  nivelEsperado: 'Intermediário' },
  { habilidadeId: '23',  nivelEsperado: 'Básico' },        // SEM avaliação
  { habilidadeId: '14',  nivelEsperado: 'Básico' },        // SEM avaliação
  // Extensão para visualização enriquecida (novos IDs ≥ 50)
  { habilidadeId: '50',  nivelEsperado: 'Básico' },
  { habilidadeId: '51',  nivelEsperado: 'Básico' },
  { habilidadeId: '74',  nivelEsperado: 'Intermediário' },
  { habilidadeId: '91',  nivelEsperado: 'Intermediário' },
  { habilidadeId: '86',  nivelEsperado: 'Intermediário' },
  { habilidadeId: '75',  nivelEsperado: 'Intermediário' },
  { habilidadeId: '76',  nivelEsperado: 'Intermediário' },
  { habilidadeId: '68',  nivelEsperado: 'Intermediário' },
  { habilidadeId: '88',  nivelEsperado: 'Básico' },        // SEM avaliação
  { habilidadeId: '107', nivelEsperado: 'Básico' },        // SEM avaliação
  // Extensão Desenvolvimento Backend — habilidades adicionadas para popular a
  // competência com volume suficiente para exigir rolagem na tela de teste
  // "Minha Carreira" (Cobertura por competência)
  { habilidadeId: '147', nivelEsperado: 'Intermediário' },
  { habilidadeId: '148', nivelEsperado: 'Básico' },
  { habilidadeId: '149', nivelEsperado: 'Básico' },        // SEM avaliação
  { habilidadeId: '150', nivelEsperado: 'Intermediário' },
  { habilidadeId: '151', nivelEsperado: 'Intermediário' },
  { habilidadeId: '152', nivelEsperado: 'Básico' },
  { habilidadeId: '153', nivelEsperado: 'Intermediário' },  // SEM avaliação
  // Habilidades com GAP alto — nunca avaliadas antes para João (nem na
  // matriz, nem como "extra"), adicionadas para popular "Oportunidades de
  // desenvolvimento" com casos de gap grande (3–4 níveis), não só o gap=1
  // que já existia em todos os 7 itens ABAIXO originais.
  { habilidadeId: '61',  nivelEsperado: 'Especialista' },   // gap 4 (vs Básico)
  { habilidadeId: '64',  nivelEsperado: 'Avançado' },       // gap 3 (vs Básico)
  { habilidadeId: '70',  nivelEsperado: 'Avançado' },       // gap 3 (vs Básico)
];

// Histórico de cargos ocupados por João Silva (id='10') — dado simulado,
// exclusivo da tela de teste "Minha Carreira" (retrospecto "Minha Trajetória").
// Não existe hoje um histórico de cargos por colaborador no restante do
// sistema; se isso virar feature real, avaliar generalizar por colaboradorId
// em vez de manter isolado a João. `cargoId: null` marca um cargo anterior à
// jornada cadastrada (ex: estágio) — não corresponde a nenhuma linha de
// cargosData. Quando `cargoId` existe, o nome do cargo deve ser lido de
// cargosData (cargoRM) na tela, nunca duplicado aqui, para não divergir se o
// nome do cargo mudar. `dataInicio: '2025-07'` do cargo atual (c2) é
// coerente com `tempoNoCargo: '1 ano'` de colaboradoresData.
export const historicoCargosJoaoData: HistoricoCargoJoao[] = [
  { cargoId: null, cargoNome: 'Estagiário de Desenvolvimento', dataInicio: '2022-01' },
  { cargoId: 'c1', dataInicio: '2023-07' },
  { cargoId: 'c2', dataInicio: '2025-07' },
];

// Cargos de benchmark — usados apenas pelas telas de teste
export const benchmarkCargosData: BenchmarkCargo[] = [
  { id: 'CARGO_ATUAL', nome: 'Desenvolvedor Pleno',      area: 'Tecnologia',             cargoBase: 'Desenvolvedor',         senioridade: 'Pleno'  },
  { id: 'cb1',  nome: 'Analista de Dados Sênior',       area: 'Dados e Analytics',       cargoBase: 'Analista de Dados',     senioridade: 'Sênior' },
  { id: 'cb7',  nome: 'Analista de Dados Pleno',        area: 'Dados e Analytics',       cargoBase: 'Analista de Dados',     senioridade: 'Pleno'  },
  { id: 'cb10', nome: 'Analista de Dados Júnior',       area: 'Dados e Analytics',       cargoBase: 'Analista de Dados',     senioridade: 'Júnior' },
  { id: 'cb2',  nome: 'Engenheiro DevOps Pleno',        area: 'Infraestrutura e Cloud',  cargoBase: 'Engenheiro DevOps',     senioridade: 'Pleno'  },
  { id: 'cb8',  nome: 'Engenheiro DevOps Sênior',       area: 'Infraestrutura e Cloud',  cargoBase: 'Engenheiro DevOps',     senioridade: 'Sênior' },
  { id: 'cb11', nome: 'Engenheiro DevOps Júnior',       area: 'Infraestrutura e Cloud',  cargoBase: 'Engenheiro DevOps',     senioridade: 'Júnior' },
  { id: 'cb12', nome: 'Arquiteto de Soluções Pleno',    area: 'Arquitetura',             cargoBase: 'Arquiteto de Soluções', senioridade: 'Pleno'  },
  { id: 'cb3',  nome: 'Arquiteto de Soluções',          area: 'Arquitetura',             cargoBase: 'Arquiteto de Soluções', senioridade: 'Sênior' },
  { id: 'cb4',  nome: 'Analista de Segurança Sênior',   area: 'Segurança da Informação', cargoBase: 'Analista de Segurança', senioridade: 'Sênior' },
  { id: 'cb9',  nome: 'Analista de Segurança Pleno',    area: 'Segurança da Informação', cargoBase: 'Analista de Segurança', senioridade: 'Pleno'  },
  { id: 'cb13', nome: 'Analista de Segurança Júnior',   area: 'Segurança da Informação', cargoBase: 'Analista de Segurança', senioridade: 'Júnior' },
  { id: 'cb14', nome: 'Tech Lead Pleno',                area: 'Liderança Técnica',       cargoBase: 'Tech Lead',             senioridade: 'Pleno'  },
  { id: 'cb5',  nome: 'Tech Lead',                      area: 'Liderança Técnica',       cargoBase: 'Tech Lead',             senioridade: 'Sênior' },
  { id: 'cb6',  nome: 'Product Manager',                area: 'Produto',                 cargoBase: 'Product Manager',       senioridade: 'Sênior' },
  { id: 'cb16', nome: 'Product Manager Pleno',          area: 'Produto',                 cargoBase: 'Product Manager',       senioridade: 'Pleno'  },
  { id: 'cb15', nome: 'Product Manager Júnior',         area: 'Produto',                 cargoBase: 'Product Manager',       senioridade: 'Júnior' },
];

// Matrizes de habilidades dos cargos de benchmark — usadas apenas pelas telas de teste
export const habilidadesCargoDataBenchmark: HabilidadeCargoBenchmark[] = [
  // cb1 — Analista de Dados Sênior
  { cargoId: 'cb1', habilidadeId: '65',  nivelEsperado: 'Avançado' },
  { cargoId: 'cb1', habilidadeId: '66',  nivelEsperado: 'Avançado' },
  { cargoId: 'cb1', habilidadeId: '67',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb1', habilidadeId: '62',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb1', habilidadeId: '64',  nivelEsperado: 'Básico' },
  { cargoId: 'cb1', habilidadeId: '4',   nivelEsperado: 'Intermediário' },
  { cargoId: 'cb1', habilidadeId: '83',  nivelEsperado: 'Básico' },
  { cargoId: 'cb1', habilidadeId: '91',  nivelEsperado: 'Básico' },

  // cb2 — Engenheiro DevOps Pleno
  { cargoId: 'cb2', habilidadeId: '53',  nivelEsperado: 'Avançado' },
  { cargoId: 'cb2', habilidadeId: '54',  nivelEsperado: 'Avançado' },
  { cargoId: 'cb2', habilidadeId: '55',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb2', habilidadeId: '56',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb2', habilidadeId: '58',  nivelEsperado: 'Básico' },
  { cargoId: 'cb2', habilidadeId: '69',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb2', habilidadeId: '92',  nivelEsperado: 'Básico' },
  { cargoId: 'cb2', habilidadeId: '18',  nivelEsperado: 'Intermediário' },

  // cb3 — Arquiteto de Soluções
  { cargoId: 'cb3', habilidadeId: '59',  nivelEsperado: 'Especialista' },
  { cargoId: 'cb3', habilidadeId: '60',  nivelEsperado: 'Avançado' },
  { cargoId: 'cb3', habilidadeId: '61',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb3', habilidadeId: '2',   nivelEsperado: 'Avançado' },
  { cargoId: 'cb3', habilidadeId: '56',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb3', habilidadeId: '63',  nivelEsperado: 'Básico' },
  { cargoId: 'cb3', habilidadeId: '83',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb3', habilidadeId: '95',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb3', habilidadeId: '87',  nivelEsperado: 'Básico' },

  // cb4 — Analista de Segurança Sênior
  { cargoId: 'cb4', habilidadeId: '68',  nivelEsperado: 'Avançado' },
  { cargoId: 'cb4', habilidadeId: '69',  nivelEsperado: 'Avançado' },
  { cargoId: 'cb4', habilidadeId: '70',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb4', habilidadeId: '53',  nivelEsperado: 'Básico' },
  { cargoId: 'cb4', habilidadeId: '56',  nivelEsperado: 'Básico' },
  { cargoId: 'cb4', habilidadeId: '82',  nivelEsperado: 'Básico' },
  { cargoId: 'cb4', habilidadeId: '95',  nivelEsperado: 'Básico' },

  // cb5 — Tech Lead
  { cargoId: 'cb5', habilidadeId: '86',  nivelEsperado: 'Avançado' },
  { cargoId: 'cb5', habilidadeId: '87',  nivelEsperado: 'Avançado' },
  { cargoId: 'cb5', habilidadeId: '88',  nivelEsperado: 'Avançado' },
  { cargoId: 'cb5', habilidadeId: '1',   nivelEsperado: 'Intermediário' },
  { cargoId: 'cb5', habilidadeId: '2',   nivelEsperado: 'Intermediário' },
  { cargoId: 'cb5', habilidadeId: '59',  nivelEsperado: 'Avançado' },
  { cargoId: 'cb5', habilidadeId: '91',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb5', habilidadeId: '95',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb5', habilidadeId: '83',  nivelEsperado: 'Avançado' },

  // cb6 — Product Manager
  { cargoId: 'cb6', habilidadeId: '104', nivelEsperado: 'Avançado' },
  { cargoId: 'cb6', habilidadeId: '91',  nivelEsperado: 'Avançado' },
  { cargoId: 'cb6', habilidadeId: '83',  nivelEsperado: 'Avançado' },
  { cargoId: 'cb6', habilidadeId: '95',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb6', habilidadeId: '87',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb6', habilidadeId: '98',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb6', habilidadeId: '92',  nivelEsperado: 'Básico' },
  { cargoId: 'cb6', habilidadeId: '107', nivelEsperado: 'Básico' },

  // cb7 — Analista de Dados Pleno (mesmo cargoBase que cb1, nível mais baixo)
  { cargoId: 'cb7', habilidadeId: '65',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb7', habilidadeId: '66',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb7', habilidadeId: '67',  nivelEsperado: 'Básico' },
  { cargoId: 'cb7', habilidadeId: '62',  nivelEsperado: 'Básico' },
  { cargoId: 'cb7', habilidadeId: '4',   nivelEsperado: 'Básico' },
  { cargoId: 'cb7', habilidadeId: '91',  nivelEsperado: 'Básico' },

  // cb8 — Engenheiro DevOps Sênior (mesmo cargoBase que cb2, nível mais alto)
  { cargoId: 'cb8', habilidadeId: '53',  nivelEsperado: 'Especialista' },
  { cargoId: 'cb8', habilidadeId: '54',  nivelEsperado: 'Especialista' },
  { cargoId: 'cb8', habilidadeId: '55',  nivelEsperado: 'Avançado' },
  { cargoId: 'cb8', habilidadeId: '56',  nivelEsperado: 'Avançado' },
  { cargoId: 'cb8', habilidadeId: '58',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb8', habilidadeId: '69',  nivelEsperado: 'Avançado' },
  { cargoId: 'cb8', habilidadeId: '92',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb8', habilidadeId: '18',  nivelEsperado: 'Avançado' },
  { cargoId: 'cb8', habilidadeId: '80',  nivelEsperado: 'Intermediário' },

  // cb9 — Analista de Segurança Pleno (mesmo cargoBase que cb4, nível mais baixo)
  { cargoId: 'cb9', habilidadeId: '68',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb9', habilidadeId: '69',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb9', habilidadeId: '70',  nivelEsperado: 'Básico' },
  { cargoId: 'cb9', habilidadeId: '53',  nivelEsperado: 'Básico' },
  { cargoId: 'cb9', habilidadeId: '56',  nivelEsperado: 'Básico' },
  { cargoId: 'cb9', habilidadeId: '82',  nivelEsperado: 'Básico' },

  // cb10 — Analista de Dados Júnior (★ = não avaliado por João)
  { cargoId: 'cb10', habilidadeId: '65',  nivelEsperado: 'Básico' },
  { cargoId: 'cb10', habilidadeId: '66',  nivelEsperado: 'Básico' },
  { cargoId: 'cb10', habilidadeId: '4',   nivelEsperado: 'Básico' },
  { cargoId: 'cb10', habilidadeId: '67',  nivelEsperado: 'Básico' },        // ★
  { cargoId: 'cb10', habilidadeId: '64',  nivelEsperado: 'Básico' },        // ★
  { cargoId: 'cb10', habilidadeId: '91',  nivelEsperado: 'Básico' },
  { cargoId: 'cb10', habilidadeId: '98',  nivelEsperado: 'Básico' },
  { cargoId: 'cb10', habilidadeId: '9',   nivelEsperado: 'Básico' },
  { cargoId: 'cb10', habilidadeId: '107', nivelEsperado: 'Básico' },        // ★

  // cb11 — Engenheiro DevOps Júnior (★ = não avaliado por João)
  { cargoId: 'cb11', habilidadeId: '53',  nivelEsperado: 'Básico' },
  { cargoId: 'cb11', habilidadeId: '54',  nivelEsperado: 'Básico' },
  { cargoId: 'cb11', habilidadeId: '56',  nivelEsperado: 'Básico' },
  { cargoId: 'cb11', habilidadeId: '55',  nivelEsperado: 'Básico' },        // ★
  { cargoId: 'cb11', habilidadeId: '58',  nivelEsperado: 'Básico' },        // ★
  { cargoId: 'cb11', habilidadeId: '80',  nivelEsperado: 'Básico' },        // ★
  { cargoId: 'cb11', habilidadeId: '18',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb11', habilidadeId: '92',  nivelEsperado: 'Básico' },

  // cb12 — Arquiteto de Soluções Pleno (★ = não avaliado por João)
  { cargoId: 'cb12', habilidadeId: '59',  nivelEsperado: 'Avançado' },
  { cargoId: 'cb12', habilidadeId: '60',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb12', habilidadeId: '2',   nivelEsperado: 'Intermediário' },
  { cargoId: 'cb12', habilidadeId: '56',  nivelEsperado: 'Básico' },
  { cargoId: 'cb12', habilidadeId: '61',  nivelEsperado: 'Básico' },        // ★
  { cargoId: 'cb12', habilidadeId: '63',  nivelEsperado: 'Básico' },
  { cargoId: 'cb12', habilidadeId: '83',  nivelEsperado: 'Básico' },
  { cargoId: 'cb12', habilidadeId: '64',  nivelEsperado: 'Básico' },        // ★
  { cargoId: 'cb12', habilidadeId: '58',  nivelEsperado: 'Básico' },        // ★

  // cb13 — Analista de Segurança Júnior (★ = não avaliado por João)
  { cargoId: 'cb13', habilidadeId: '68',  nivelEsperado: 'Básico' },
  { cargoId: 'cb13', habilidadeId: '69',  nivelEsperado: 'Básico' },
  { cargoId: 'cb13', habilidadeId: '70',  nivelEsperado: 'Básico' },        // ★
  { cargoId: 'cb13', habilidadeId: '56',  nivelEsperado: 'Básico' },
  { cargoId: 'cb13', habilidadeId: '82',  nivelEsperado: 'Básico' },        // ★
  { cargoId: 'cb13', habilidadeId: '9',   nivelEsperado: 'Básico' },
  { cargoId: 'cb13', habilidadeId: '80',  nivelEsperado: 'Básico' },        // ★
  { cargoId: 'cb13', habilidadeId: '18',  nivelEsperado: 'Básico' },

  // cb14 — Tech Lead Pleno (★ = não avaliado por João)
  { cargoId: 'cb14', habilidadeId: '86',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb14', habilidadeId: '87',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb14', habilidadeId: '88',  nivelEsperado: 'Intermediário' }, // ★
  { cargoId: 'cb14', habilidadeId: '1',   nivelEsperado: 'Intermediário' },
  { cargoId: 'cb14', habilidadeId: '2',   nivelEsperado: 'Intermediário' },
  { cargoId: 'cb14', habilidadeId: '59',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb14', habilidadeId: '91',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb14', habilidadeId: '95',  nivelEsperado: 'Básico' },
  { cargoId: 'cb14', habilidadeId: '83',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb14', habilidadeId: '14',  nivelEsperado: 'Básico' },        // ★
  { cargoId: 'cb14', habilidadeId: '89',  nivelEsperado: 'Básico' },        // ★

  // cb15 — Product Manager Júnior (★ = não avaliado por João)
  { cargoId: 'cb15', habilidadeId: '104', nivelEsperado: 'Básico' },
  { cargoId: 'cb15', habilidadeId: '91',  nivelEsperado: 'Básico' },
  { cargoId: 'cb15', habilidadeId: '83',  nivelEsperado: 'Básico' },
  { cargoId: 'cb15', habilidadeId: '95',  nivelEsperado: 'Básico' },
  { cargoId: 'cb15', habilidadeId: '98',  nivelEsperado: 'Básico' },
  { cargoId: 'cb15', habilidadeId: '107', nivelEsperado: 'Básico' },        // ★
  { cargoId: 'cb15', habilidadeId: '9',   nivelEsperado: 'Básico' },
  { cargoId: 'cb15', habilidadeId: '97',  nivelEsperado: 'Básico' },        // ★
  { cargoId: 'cb15', habilidadeId: '105', nivelEsperado: 'Básico' },        // ★

  // cb16 — Product Manager Pleno (★ = não avaliado por João)
  { cargoId: 'cb16', habilidadeId: '104', nivelEsperado: 'Intermediário' },
  { cargoId: 'cb16', habilidadeId: '91',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb16', habilidadeId: '83',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb16', habilidadeId: '95',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb16', habilidadeId: '87',  nivelEsperado: 'Básico' },
  { cargoId: 'cb16', habilidadeId: '98',  nivelEsperado: 'Intermediário' },
  { cargoId: 'cb16', habilidadeId: '92',  nivelEsperado: 'Básico' },
  { cargoId: 'cb16', habilidadeId: '107', nivelEsperado: 'Básico' },        // ★
  { cargoId: 'cb16', habilidadeId: '97',  nivelEsperado: 'Básico' },        // ★
  { cargoId: 'cb16', habilidadeId: '105', nivelEsperado: 'Básico' },        // ★
];