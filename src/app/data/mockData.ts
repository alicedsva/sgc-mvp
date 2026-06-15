// Dados mockados compartilhados entre todas as páginas

export const carreirasData = [
  { id: '1', nome: 'Tecnologia da Informação', jornadas: 8, status: 'Ativa' },
  { id: '2', nome: 'Recursos Humanos', jornadas: 5, status: 'Ativa' },
  { id: '3', nome: 'Financeiro', jornadas: 6, status: 'Ativa' },
  { id: '4', nome: 'Marketing', jornadas: 7, status: 'Ativa' },
  { id: '5', nome: 'Vendas', jornadas: 9, status: 'Ativa' },
  { id: '6', nome: 'Operações', jornadas: 4, status: 'Ativa' },
  { id: '7', nome: 'Jurídico', jornadas: 3, status: 'Ativa' },
  { id: '8', nome: 'Atendimento ao Cliente', jornadas: 5, status: 'Ativa' },
  { id: '9', nome: 'Produto', jornadas: 6, status: 'Ativa' },
  { id: '10', nome: 'Design', jornadas: 4, status: 'Ativa' },
  { id: '11', nome: 'Engenharia', jornadas: 7, status: 'Ativa' },
  { id: '12', nome: 'Qualidade', jornadas: 3, status: 'Ativa' },
  { id: '13', nome: 'Projetos', jornadas: 0, status: 'Desativada' },
  { id: '14', nome: 'Inovação', jornadas: 5, status: 'Ativa' },
  { id: '15', nome: 'Suprimentos', jornadas: 4, status: 'Ativa' },
  { id: '16', nome: 'Logística', jornadas: 0, status: 'Desativada' },
  { id: '17', nome: 'Compliance', jornadas: 2, status: 'Ativa' },
  { id: '18', nome: 'Comunicação', jornadas: 3, status: 'Ativa' },
];

export const jornadasData = [
  { id: 'j1', carreiraId: '1', nome: 'Desenvolvedor', carreira: 'Tecnologia da Informação', tipo: 'Contribuidor Individual', quantidadeCargos: 4, cargosConfigurados: 3, status: 'Ativa' },
  { id: 'j2', carreiraId: '1', nome: 'Analista de Infraestrutura', carreira: 'Tecnologia da Informação', tipo: 'Contribuidor Individual', quantidadeCargos: 2, cargosConfigurados: 2, status: 'Ativa' },
  { id: 'j3', carreiraId: '1', nome: 'Analista de Dados', carreira: 'Tecnologia da Informação', tipo: 'Contribuidor Individual', quantidadeCargos: 3, cargosConfigurados: 3, status: 'Ativa' },
  { id: 'j4', carreiraId: '1', nome: 'Engenheiro de Software', carreira: 'Tecnologia da Informação', tipo: 'Contribuidor Individual', quantidadeCargos: 5, cargosConfigurados: 4, status: 'Ativa' },
  { id: 'j5', carreiraId: '1', nome: 'Gerente de Tecnologia', carreira: 'Tecnologia da Informação', tipo: 'Gestão', quantidadeCargos: 4, cargosConfigurados: 2, status: 'Ativa' },
  { id: 'j6', carreiraId: '1', nome: 'Product Manager', carreira: 'Tecnologia da Informação', tipo: 'Contribuidor Individual', quantidadeCargos: 3, cargosConfigurados: 1, status: 'Ativa' },
  { id: 'j7', carreiraId: '1', nome: 'Arquiteto de Software', carreira: 'Tecnologia da Informação', tipo: 'Contribuidor Individual', quantidadeCargos: 2, cargosConfigurados: 0, status: 'Ativa' },
  { id: 'j8', carreiraId: '1', nome: 'DevOps', carreira: 'Tecnologia da Informação', tipo: 'Contribuidor Individual', quantidadeCargos: 0, cargosConfigurados: 0, status: 'Desativada' },
  { id: 'j9', carreiraId: '2', nome: 'Analista de RH', carreira: 'Recursos Humanos', tipo: 'Contribuidor Individual', quantidadeCargos: 3, cargosConfigurados: 2, status: 'Ativa' },
  { id: 'j10', carreiraId: '2', nome: 'Recrutador', carreira: 'Recursos Humanos', tipo: 'Contribuidor Individual', quantidadeCargos: 2, cargosConfigurados: 2, status: 'Ativa' },
  { id: 'j11', carreiraId: '2', nome: 'Business Partner', carreira: 'Recursos Humanos', tipo: 'Contribuidor Individual', quantidadeCargos: 4, cargosConfigurados: 3, status: 'Ativa' },
  { id: 'j12', carreiraId: '2', nome: 'Gerente de RH', carreira: 'Recursos Humanos', tipo: 'Gestão', quantidadeCargos: 3, cargosConfigurados: 1, status: 'Ativa' },
  { id: 'j13', carreiraId: '2', nome: 'Analista de Remuneração', carreira: 'Recursos Humanos', tipo: 'Contribuidor Individual', quantidadeCargos: 0, cargosConfigurados: 0, status: 'Desativada' },
];

// Base de habilidades de cada jornada (habilidades comuns que serão herdadas por todos os cargos)
export const habilidadesBaseJornada = [
  // Jornada: Desenvolvedor (j1)
  { jornadaId: 'j1', habilidadeId: '1', nivelBase: 'Básico' }, // React
  { jornadaId: 'j1', habilidadeId: '2', nivelBase: 'Básico' }, // TypeScript
  { jornadaId: 'j1', habilidadeId: '18', nivelBase: 'Básico' }, // Git
  { jornadaId: 'j1', habilidadeId: '9', nivelBase: 'Básico' }, // Comunicação Clara
  { jornadaId: 'j1', habilidadeId: '10', nivelBase: 'Básico' }, // Trabalho em Equipe
  { jornadaId: 'j1', habilidadeId: '21', nivelBase: 'Básico' }, // Resiliência
  { jornadaId: 'j1', habilidadeId: '22', nivelBase: 'Básico' }, // Empatia
];

export const cargosData = [
  { id: 'c1', jornadaId: 'j1', cargoRM: 'Desenvolvedor Junior', ordem: 'Júnior', habilidadesConfiguradas: 8, status: 'Configurado' },
  { id: 'c2', jornadaId: 'j1', cargoRM: 'Desenvolvedor Pleno', ordem: 'Pleno', habilidadesConfiguradas: 12, status: 'Configurado' },
  { id: 'c3', jornadaId: 'j1', cargoRM: 'Desenvolvedor Sênior', ordem: 'Sênior', habilidadesConfiguradas: 15, status: 'Configurado' },
  { id: 'c4', jornadaId: 'j1', cargoRM: 'Tech Lead', ordem: 'Especialista', habilidadesConfiguradas: 0, status: 'Não Configurado' },
  { id: 'c5', jornadaId: 'j2', cargoRM: 'Analista de Infraestrutura Junior', ordem: 'Júnior', habilidadesConfiguradas: 5, status: 'Configurado' },
  { id: 'c6', jornadaId: 'j2', cargoRM: 'Analista de Infraestrutura Pleno', ordem: 'Pleno', habilidadesConfiguradas: 9, status: 'Configurado' },
];

export const habilidadesCargoData = [
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
];

export const colaboradoresData = [
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
];

// Avaliações dos colaboradores (níveis atuais)
export const avaliacoesColaboradoresData = [
  // Ana Silva - Desenvolvedor Pleno
  { colaboradorId: '1', habilidadeId: '1', nivelAtual: 'Intermediário', dataAvaliacao: '2026-01-15' },
  { colaboradorId: '1', habilidadeId: '2', nivelAtual: 'Intermediário', dataAvaliacao: '2026-01-15' },
  { colaboradorId: '1', habilidadeId: '3', nivelAtual: 'Básico', dataAvaliacao: '2026-01-15' },
  { colaboradorId: '1', habilidadeId: '4', nivelAtual: 'Básico', dataAvaliacao: '2026-01-15' },
  { colaboradorId: '1', habilidadeId: '18', nivelAtual: 'Intermediário', dataAvaliacao: '2026-01-15' },
  { colaboradorId: '1', habilidadeId: '9', nivelAtual: 'Avançado', dataAvaliacao: '2026-01-15' },
  { colaboradorId: '1', habilidadeId: '10', nivelAtual: 'Intermediário', dataAvaliacao: '2026-01-15' },
  { colaboradorId: '1', habilidadeId: '11', nivelAtual: 'Intermediário', dataAvaliacao: '2026-01-15' },
  { colaboradorId: '1', habilidadeId: '12', nivelAtual: 'Básico', dataAvaliacao: '2026-01-15' },
  { colaboradorId: '1', habilidadeId: '21', nivelAtual: 'Básico', dataAvaliacao: '2026-01-15' },
  { colaboradorId: '1', habilidadeId: '22', nivelAtual: 'Intermediário', dataAvaliacao: '2026-01-15' },
  { colaboradorId: '1', habilidadeId: '23', nivelAtual: 'Básico', dataAvaliacao: '2026-01-15' },
  { colaboradorId: '1', habilidadeId: '14', nivelAtual: 'Básico', dataAvaliacao: '2026-01-15' },

  // João Silva (id='10') — Desenvolvedor Pleno — Avaliação março 2026
  // Distribuição vs joaoHabilidadesCargoMatriz: 5 ACIMA | 8 NO | 6 ABAIXO | 4 SEM
  { colaboradorId: '10', habilidadeId: '1',   nivelAtual: 'Avançado',      dataAvaliacao: '2026-03-10' }, // ACIMA  (vs Intermediário)
  { colaboradorId: '10', habilidadeId: '2',   nivelAtual: 'Avançado',      dataAvaliacao: '2026-03-10' }, // ACIMA
  { colaboradorId: '10', habilidadeId: '3',   nivelAtual: 'Intermediário', dataAvaliacao: '2026-03-10' }, // NO
  { colaboradorId: '10', habilidadeId: '4',   nivelAtual: 'Básico',        dataAvaliacao: '2026-03-10' }, // ABAIXO
  { colaboradorId: '10', habilidadeId: '18',  nivelAtual: 'Avançado',      dataAvaliacao: '2026-03-10' }, // ACIMA
  { colaboradorId: '10', habilidadeId: '9',   nivelAtual: 'Intermediário', dataAvaliacao: '2026-03-10' }, // NO
  { colaboradorId: '10', habilidadeId: '10',  nivelAtual: 'Intermediário', dataAvaliacao: '2026-03-10' }, // NO
  { colaboradorId: '10', habilidadeId: '11',  nivelAtual: 'Básico',        dataAvaliacao: '2026-03-10' }, // ABAIXO
  { colaboradorId: '10', habilidadeId: '12',  nivelAtual: 'Básico',        dataAvaliacao: '2026-03-10' }, // NO    (vs Básico)
  { colaboradorId: '10', habilidadeId: '21',  nivelAtual: 'Básico',        dataAvaliacao: '2026-03-10' }, // ABAIXO
  { colaboradorId: '10', habilidadeId: '22',  nivelAtual: 'Intermediário', dataAvaliacao: '2026-03-10' }, // NO
  // h23 (Pensamento Crítico) e h14 (Feedback Construtivo): SEM AVALIAÇÃO
  { colaboradorId: '10', habilidadeId: '50',  nivelAtual: 'Intermediário', dataAvaliacao: '2026-03-10' }, // ACIMA (vs Básico)
  { colaboradorId: '10', habilidadeId: '51',  nivelAtual: 'Intermediário', dataAvaliacao: '2026-03-10' }, // ACIMA
  { colaboradorId: '10', habilidadeId: '74',  nivelAtual: 'Intermediário', dataAvaliacao: '2026-03-10' }, // NO    (vs Intermediário)
  { colaboradorId: '10', habilidadeId: '91',  nivelAtual: 'Intermediário', dataAvaliacao: '2026-03-10' }, // NO
  { colaboradorId: '10', habilidadeId: '86',  nivelAtual: 'Intermediário', dataAvaliacao: '2026-03-10' }, // NO
  { colaboradorId: '10', habilidadeId: '75',  nivelAtual: 'Básico',        dataAvaliacao: '2026-03-10' }, // ABAIXO
  { colaboradorId: '10', habilidadeId: '76',  nivelAtual: 'Básico',        dataAvaliacao: '2026-03-10' }, // ABAIXO
  { colaboradorId: '10', habilidadeId: '68',  nivelAtual: 'Básico',        dataAvaliacao: '2026-03-10' }, // ABAIXO
  // h88 (Tomada de Decisão) e h107 (Gestão de Metas): SEM AVALIAÇÃO
  // Habilidades extras avaliadas — fora da matriz do cargo, alimentam radar e benchmark
  { colaboradorId: '10', habilidadeId: '52',  nivelAtual: 'Básico',        dataAvaliacao: '2026-03-10' },
  { colaboradorId: '10', habilidadeId: '53',  nivelAtual: 'Básico',        dataAvaliacao: '2026-03-10' },
  { colaboradorId: '10', habilidadeId: '54',  nivelAtual: 'Básico',        dataAvaliacao: '2026-03-10' },
  { colaboradorId: '10', habilidadeId: '56',  nivelAtual: 'Básico',        dataAvaliacao: '2026-03-10' },
  { colaboradorId: '10', habilidadeId: '59',  nivelAtual: 'Intermediário', dataAvaliacao: '2026-03-10' },
  { colaboradorId: '10', habilidadeId: '60',  nivelAtual: 'Básico',        dataAvaliacao: '2026-03-10' },
  { colaboradorId: '10', habilidadeId: '62',  nivelAtual: 'Básico',        dataAvaliacao: '2026-03-10' },
  { colaboradorId: '10', habilidadeId: '63',  nivelAtual: 'Básico',        dataAvaliacao: '2026-03-10' },
  { colaboradorId: '10', habilidadeId: '65',  nivelAtual: 'Básico',        dataAvaliacao: '2026-03-10' },
  { colaboradorId: '10', habilidadeId: '66',  nivelAtual: 'Intermediário', dataAvaliacao: '2026-03-10' },
  { colaboradorId: '10', habilidadeId: '69',  nivelAtual: 'Básico',        dataAvaliacao: '2026-03-10' },
  { colaboradorId: '10', habilidadeId: '77',  nivelAtual: 'Básico',        dataAvaliacao: '2026-03-10' },
  { colaboradorId: '10', habilidadeId: '83',  nivelAtual: 'Intermediário', dataAvaliacao: '2026-03-10' },
  { colaboradorId: '10', habilidadeId: '87',  nivelAtual: 'Básico',        dataAvaliacao: '2026-03-10' },
  { colaboradorId: '10', habilidadeId: '92',  nivelAtual: 'Intermediário', dataAvaliacao: '2026-03-10' },
  { colaboradorId: '10', habilidadeId: '95',  nivelAtual: 'Intermediário', dataAvaliacao: '2026-03-10' },
  { colaboradorId: '10', habilidadeId: '98',  nivelAtual: 'Intermediário', dataAvaliacao: '2026-03-10' },
  { colaboradorId: '10', habilidadeId: '104', nivelAtual: 'Básico',        dataAvaliacao: '2026-03-10' },
];

// Histórico de avaliações
export const historicoAvaliacoesData = [
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

export const habilidadesData = [
  { id: '1',  nome: 'React',               descricao: 'Desenvolvimento com React e ecossistema',          competencia: 'Desenvolvimento Frontend', tipo: 'Técnica',       status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Cria componentes funcionais simples e entende JSX' },
    { nivelId: '2', criterio: 'Usa hooks, gerencia estado local e consome APIs REST' },
    { nivelId: '3', criterio: 'Define arquitetura de componentes, otimização e boas práticas do time' },
  ]},
  { id: '2',  nome: 'TypeScript',           descricao: 'Programação com tipagem estática',                 competencia: 'Desenvolvimento Frontend', tipo: 'Técnica',       status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Aplica tipagem básica em variáveis, funções e interfaces simples' },
    { nivelId: '2', criterio: 'Usa generics, types utilitários e integra tipagem com frameworks' },
    { nivelId: '3', criterio: 'Define estratégias de tipagem para o projeto e orienta o time' },
  ]},
  { id: '3',  nome: 'Node.js',              descricao: 'Desenvolvimento backend com Node.js',               competencia: 'Desenvolvimento Backend',  tipo: 'Técnica',       status: 'Ativa', niveis: [
    { nivelId: '2', criterio: 'Cria APIs REST com Express, gerencia rotas e middlewares básicos' },
    { nivelId: '3', criterio: 'Projeta serviços escaláveis, aplica segurança e autenticação avançada' },
    { nivelId: '4', criterio: 'Define padrões de backend e lidera decisões arquiteturais do time' },
  ]},
  { id: '4',  nome: 'PostgreSQL',           descricao: 'Modelagem e consultas em banco relacional',         competencia: 'Desenvolvimento Backend',  tipo: 'Técnica',       status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Executa queries básicas de SELECT, INSERT e UPDATE com filtros' },
    { nivelId: '2', criterio: 'Domina JOINs, índices e transações, modela banco relacional' },
    { nivelId: '3', criterio: 'Otimiza queries complexas, define estratégias de particionamento e replicação' },
  ]},
  { id: '9',  nome: 'Comunicação Clara',    descricao: 'Habilidade de se expressar de forma objetiva',      competencia: 'Comunicação Corporativa',  tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Expressa ideias de forma objetiva em situações cotidianas' },
    { nivelId: '2', criterio: 'Adapta linguagem ao público e estrutura mensagens com clareza' },
    { nivelId: '3', criterio: 'Facilita reuniões complexas e comunica decisões estratégicas com precisão' },
  ]},
  { id: '10', nome: 'Trabalho em Equipe',   descricao: 'Colaboração efetiva com colegas',                   competencia: 'Comunicação Corporativa',  tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Colabora com colegas em tarefas compartilhadas sem conflitos' },
    { nivelId: '2', criterio: 'Age de forma proativa no time e resolve conflitos simples' },
    { nivelId: '3', criterio: 'Potencializa o desempenho coletivo e promove cultura colaborativa' },
  ]},
  { id: '11', nome: 'Scrum',                descricao: 'Framework ágil para gestão de projetos',            competencia: 'Metodologias Ágeis',       tipo: 'Técnica',       status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Participa das cerimônias e entende os papéis do Scrum' },
    { nivelId: '2', criterio: 'Facilita cerimônias, acompanha métricas ágeis e propõe melhorias' },
    { nivelId: '3', criterio: 'Lidera times ágeis, adapta o framework ao contexto e mede resultados' },
  ]},
  { id: '12', nome: 'Kanban',               descricao: 'Método visual de gestão de fluxo',                  competencia: 'Metodologias Ágeis',       tipo: 'Técnica',       status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Visualiza fluxo de trabalho e respeita os limites de WIP' },
    { nivelId: '2', criterio: 'Identifica gargalos, otimiza fluxo e usa métricas de lead time' },
  ]},
  { id: '14', nome: 'Feedback Construtivo', descricao: 'Fornecer feedback efetivo e orientado',              competencia: 'Liderança',                tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Dá feedbacks baseados em comportamento observado' },
    { nivelId: '2', criterio: 'Estrutura feedbacks com frameworks (SCI/STAR) e recebe com abertura' },
    { nivelId: '3', criterio: 'Cria cultura de feedback no time e treina outros na prática' },
  ]},
  { id: '18', nome: 'Git',                  descricao: 'Controle de versão e colaboração',                  competencia: 'Desenvolvimento Backend',  tipo: 'Técnica',       status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Usa comandos básicos: clone, commit, push e pull' },
    { nivelId: '2', criterio: 'Trabalha com branches, merge, rebase e resolve conflitos' },
    { nivelId: '3', criterio: 'Define estratégias de branching (GitFlow) e lidera processos de code review' },
  ]},
  { id: '21', nome: 'Resiliência',          descricao: 'Capacidade de lidar com pressão',                   competencia: 'Inteligência Emocional',   tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Mantém produtividade sob pressão moderada e prazo' },
    { nivelId: '2', criterio: 'Supera adversidades sem impactar a entrega e aprende com falhas' },
    { nivelId: '3', criterio: 'Opera em ambiguidade intensa e apoia o time a manter foco' },
  ]},
  { id: '22', nome: 'Empatia',              descricao: 'Compreensão das necessidades dos outros',            competencia: 'Inteligência Emocional',   tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Ouve ativamente e considera perspectivas alheias no cotidiano' },
    { nivelId: '2', criterio: 'Adapta comunicação ao estado emocional dos colegas e oferece suporte' },
    { nivelId: '3', criterio: 'Cria segurança psicológica no time e media situações delicadas' },
  ]},
  { id: '23', nome: 'Pensamento Crítico',   descricao: 'Análise lógica e fundamentada',                     competencia: 'Resolução de Problemas',   tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '2', criterio: 'Analisa problemas sob múltiplas perspectivas com raciocínio lógico' },
    { nivelId: '3', criterio: 'Questiona premissas e propõe soluções baseadas em dados e evidências' },
    { nivelId: '4', criterio: 'Define metodologias analíticas e orienta o time em decisões estratégicas' },
  ]},

  // ─── Frontend Avançado ─────────────────────────────────────────────────────
  { id: '50', nome: 'Acessibilidade Web',     descricao: 'Criação de interfaces acessíveis conforme WCAG',            competencia: 'Frontend Avançado',        tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Conhece as diretrizes WCAG e aplica atributos ARIA básicos' },
    { nivelId: '2', criterio: 'Garante contraste, navegação por teclado e testa com leitores de tela' },
    { nivelId: '3', criterio: 'Define padrões de acessibilidade para o projeto e audita componentes da equipe' },
  ]},
  { id: '51', nome: 'Performance Web',        descricao: 'Otimização de carregamento e Core Web Vitals',              competencia: 'Frontend Avançado',        tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Identifica problemas óbvios de performance como imagens não otimizadas' },
    { nivelId: '2', criterio: 'Usa Lighthouse, otimiza bundle size, lazy loading e Core Web Vitals' },
    { nivelId: '3', criterio: 'Define estratégia de performance do produto e implementa SSR/SSG quando relevante' },
  ]},
  { id: '52', nome: 'CSS Avançado',           descricao: 'Estilização complexa e arquitetura de CSS',                 competencia: 'Frontend Avançado',        tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Usa Flexbox, Grid e variáveis CSS com segurança em layouts responsivos' },
    { nivelId: '2', criterio: 'Cria sistemas de design em CSS, animações e tokens de design' },
    { nivelId: '3', criterio: 'Define arquitetura de CSS para projetos grandes e orienta convenções no time' },
  ]},

  // ─── DevOps ────────────────────────────────────────────────────────────────
  { id: '53', nome: 'Docker e Containers',    descricao: 'Containerização de aplicações com Docker',                  competencia: 'DevOps',                   tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Cria e executa containers com Dockerfile e docker-compose básico' },
    { nivelId: '2', criterio: 'Otimiza imagens, usa multi-stage builds e gerencia redes e volumes' },
    { nivelId: '3', criterio: 'Define estratégia de containerização e integra com orquestração (K8s)' },
  ]},
  { id: '54', nome: 'CI/CD',                  descricao: 'Pipelines de integração e entrega contínua',               competencia: 'DevOps',                   tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Configura pipelines básicos com GitHub Actions ou similar' },
    { nivelId: '2', criterio: 'Implementa stages de build, testes e deploy automatizado com rollback' },
    { nivelId: '3', criterio: 'Projeta estratégia de CI/CD para múltiplos ambientes e times' },
  ]},
  { id: '55', nome: 'Monitoramento e Observabilidade', descricao: 'Logs, métricas e rastreamento de sistemas',       competencia: 'DevOps',                   tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Configura logs estruturados e cria alertas básicos em plataformas de monitoramento' },
    { nivelId: '2', criterio: 'Implementa traces distribuídos, dashboards e define SLOs' },
    { nivelId: '3', criterio: 'Define estratégia de observabilidade end-to-end e conduz pós-mortems' },
  ]},

  // ─── Cloud Computing ───────────────────────────────────────────────────────
  { id: '56', nome: 'AWS',                    descricao: 'Serviços Amazon Web Services',                              competencia: 'Cloud Computing',          tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Usa serviços básicos como EC2, S3 e Lambda com auxílio de documentação' },
    { nivelId: '2', criterio: 'Projeta arquiteturas com VPC, RDS, IAM e serviços gerenciados' },
    { nivelId: '3', criterio: 'Define estratégia de cloud, otimiza custos e lidera migrações' },
  ]},
  { id: '57', nome: 'Azure',                  descricao: 'Serviços Microsoft Azure',                                  competencia: 'Cloud Computing',          tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Provisiona recursos básicos no portal Azure com orientação' },
    { nivelId: '2', criterio: 'Usa Azure DevOps, AKS, Functions e gerencia identidades com AAD' },
    { nivelId: '3', criterio: 'Arquiteta soluções enterprise no Azure e lidera adoção da plataforma' },
  ]},
  { id: '58', nome: 'Infraestrutura como Código', descricao: 'Provisionamento de infra com Terraform ou similar',   competencia: 'Cloud Computing',          tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Cria e aplica configurações Terraform básicas com auxílio' },
    { nivelId: '2', criterio: 'Modulariza infraestrutura, usa state remoto e integra em pipelines CI/CD' },
    { nivelId: '3', criterio: 'Define padrões de IaC para a organização e avalia alternativas (CDK, Pulumi)' },
  ]},

  // ─── Arquitetura de Software ───────────────────────────────────────────────
  { id: '59', nome: 'Design Patterns',        descricao: 'Padrões de projeto e princípios SOLID',                    competencia: 'Arquitetura de Software',  tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Reconhece e aplica padrões comuns (Factory, Observer) com orientação' },
    { nivelId: '2', criterio: 'Escolhe padrões adequados ao contexto e aplica SOLID com autonomia' },
    { nivelId: '3', criterio: 'Conduz revisões arquiteturais e orienta o time na adoção de padrões' },
    { nivelId: '4', criterio: 'Define padrões de referência para a organização e avalia trade-offs arquiteturais' },
  ]},
  { id: '60', nome: 'Microsserviços',         descricao: 'Arquitetura e comunicação entre microsserviços',           competencia: 'Arquitetura de Software',  tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Entende os princípios de decomposição por domínio e comunicação síncrona/assíncrona' },
    { nivelId: '2', criterio: 'Projeta microsserviços com contratos claros, resiliência e rastreamento' },
    { nivelId: '3', criterio: 'Lidera migração de monolito para microsserviços e define padrões organizacionais' },
  ]},
  { id: '61', nome: 'Event-Driven Architecture', descricao: 'Comunicação por eventos com filas e streaming',         competencia: 'Arquitetura de Software',  tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Entende publishers e consumers e usa Kafka ou RabbitMQ com exemplos guiados' },
    { nivelId: '2', criterio: 'Projeta fluxos event-driven com idempotência, DLQ e monitoramento' },
    { nivelId: '3', criterio: 'Define estratégia de eventos para o produto e orienta o time em event sourcing' },
  ]},

  // ─── Banco de Dados ────────────────────────────────────────────────────────
  { id: '62', nome: 'NoSQL',                  descricao: 'Bancos não-relacionais (MongoDB, DynamoDB)',               competencia: 'Banco de Dados',           tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Executa operações CRUD em MongoDB ou similar com orientação' },
    { nivelId: '2', criterio: 'Modela documentos para alta performance e projeta índices eficientes' },
    { nivelId: '3', criterio: 'Avalia quando usar NoSQL vs SQL e lidera decisões de modelagem no time' },
  ]},
  { id: '63', nome: 'Redis e Caching',        descricao: 'Estratégias de cache com Redis',                          competencia: 'Banco de Dados',           tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Usa Redis para caching simples de chave-valor em aplicações' },
    { nivelId: '2', criterio: 'Implementa cache-aside, write-through e define TTLs e estratégias de invalidação' },
    { nivelId: '3', criterio: 'Define estratégia de caching distribuído e avalia trade-offs de consistência' },
  ]},
  { id: '64', nome: 'Modelagem de Dados',     descricao: 'Projeto de esquemas e estruturas de dados',               competencia: 'Banco de Dados',           tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Cria modelos ER básicos e normaliza até a 3ª forma normal' },
    { nivelId: '2', criterio: 'Modela para performance, usa desnormalização quando adequado e cria dicionários' },
    { nivelId: '3', criterio: 'Lidera decisões de modelagem e define governança de dados para o projeto' },
  ]},

  // ─── Análise de Dados ──────────────────────────────────────────────────────
  { id: '65', nome: 'Python para Dados',      descricao: 'Pandas, NumPy e análise exploratória',                    competencia: 'Análise de Dados',         tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Usa Pandas para carregar, filtrar e transformar datasets simples' },
    { nivelId: '2', criterio: 'Realiza análise exploratória completa, limpeza e visualizações com Matplotlib' },
    { nivelId: '3', criterio: 'Constrói pipelines de análise reproduzíveis e orienta o time em boas práticas' },
  ]},
  { id: '66', nome: 'SQL Avançado',           descricao: 'CTEs, window functions e otimização de queries',          competencia: 'Análise de Dados',         tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Escreve queries com JOINs múltiplos e funções de agregação' },
    { nivelId: '2', criterio: 'Usa CTEs, window functions e otimiza queries com EXPLAIN ANALYZE' },
    { nivelId: '3', criterio: 'Define padrões SQL para o time e conduz revisões de performance de banco' },
  ]},
  { id: '67', nome: 'Power BI',               descricao: 'Dashboards e relatórios com Power BI',                   competencia: 'Análise de Dados',         tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Cria dashboards simples conectando fontes de dados e usando visuais padrão' },
    { nivelId: '2', criterio: 'Desenvolve medidas DAX complexas e modelos de dados publicados' },
    { nivelId: '3', criterio: 'Arquiteta soluções de BI corporativo e treina usuários de negócio' },
  ]},

  // ─── Segurança da Informação ───────────────────────────────────────────────
  { id: '68', nome: 'OWASP e Vulnerabilidades Web', descricao: 'Prevenção das principais vulnerabilidades web',     competencia: 'Segurança da Informação',  tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Conhece o OWASP Top 10 e identifica vulnerabilidades comuns em código' },
    { nivelId: '2', criterio: 'Aplica mitigações para XSS, CSRF, SQL Injection e conduz code reviews de segurança' },
    { nivelId: '3', criterio: 'Lidera programa de secure coding e define padrões de segurança para o time' },
  ]},
  { id: '69', nome: 'Autenticação e Autorização', descricao: 'OAuth 2.0, JWT, RBAC e gestão de identidades',       competencia: 'Segurança da Informação',  tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Implementa autenticação básica com JWT e sessões gerenciadas' },
    { nivelId: '2', criterio: 'Projeta fluxos OAuth 2.0, OIDC e controle de acesso baseado em papéis (RBAC)' },
    { nivelId: '3', criterio: 'Define estratégia de identidade do produto e avalia provedores de IdP' },
  ]},
  { id: '70', nome: 'Criptografia',           descricao: 'Fundamentos e aplicação prática de criptografia',        competencia: 'Segurança da Informação',  tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Usa bibliotecas criptográficas para hash de senhas e dados sensíveis' },
    { nivelId: '2', criterio: 'Escolhe algoritmos adequados (AES, RSA, SHA) e gerencia chaves com segurança' },
    { nivelId: '3', criterio: 'Define estratégia criptográfica do produto e conduz análises de risco' },
  ]},

  // ─── Mobile ────────────────────────────────────────────────────────────────
  { id: '71', nome: 'React Native',           descricao: 'Desenvolvimento mobile multiplataforma',                  competencia: 'Mobile',                   tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Cria telas básicas com componentes nativos e navegação simples' },
    { nivelId: '2', criterio: 'Integra APIs nativas, otimiza performance e publica nos stores' },
    { nivelId: '3', criterio: 'Arquiteta apps complexos, cria bridges nativas e lidera o time mobile' },
  ]},
  { id: '72', nome: 'Flutter',                descricao: 'Desenvolvimento mobile com Flutter e Dart',               competencia: 'Mobile',                   tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Cria widgets básicos, gerencia estado com setState e navega entre telas' },
    { nivelId: '2', criterio: 'Usa gerenciamento de estado avançado (Riverpod/BLoC) e integra APIs' },
    { nivelId: '3', criterio: 'Define arquitetura do app, cria packages reutilizáveis e lidera adoção do Flutter' },
  ]},
  { id: '73', nome: 'Performance Mobile',     descricao: 'Otimização de aplicativos móveis',                        competencia: 'Mobile',                   tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Identifica gargalos com profiler e aplica correções básicas' },
    { nivelId: '2', criterio: 'Otimiza re-renders, usa memoização e implementa carregamento lazy de recursos' },
    { nivelId: '3', criterio: 'Define metas de performance do app e guia o time em profiling avançado' },
  ]},

  // ─── Qualidade e Testes ────────────────────────────────────────────────────
  { id: '74', nome: 'Testes Unitários',       descricao: 'Criação de testes unitários com Jest ou similar',         competencia: 'Qualidade e Testes',       tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Escreve testes simples para funções isoladas com Jest' },
    { nivelId: '2', criterio: 'Aplica TDD, usa mocks/stubs e mantém cobertura de código significativa' },
    { nivelId: '3', criterio: 'Define estratégia de testes do time e conduz revisões de qualidade' },
  ]},
  { id: '75', nome: 'Testes de Integração',   descricao: 'Testes entre camadas e contratos de API',                 competencia: 'Qualidade e Testes',       tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Escreve testes de integração básicos com banco de dados em memória' },
    { nivelId: '2', criterio: 'Testa contratos de API, usa TestContainers e isola dependências externas' },
    { nivelId: '3', criterio: 'Define pirâmide de testes do projeto e garante confiabilidade dos contratos' },
  ]},
  { id: '76', nome: 'Automação de Testes',    descricao: 'Testes end-to-end com Cypress, Playwright ou similar',    competencia: 'Qualidade e Testes',       tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Cria testes E2E básicos com Cypress ou Playwright usando seletores simples' },
    { nivelId: '2', criterio: 'Organiza suítes de testes, usa Page Object Model e integra em CI/CD' },
    { nivelId: '3', criterio: 'Define estratégia de automação E2E e treina o time em boas práticas' },
  ]},

  // ─── Inteligência Artificial ───────────────────────────────────────────────
  { id: '77', nome: 'Machine Learning Básico', descricao: 'Conceitos e aplicação prática de ML',                   competencia: 'Inteligência Artificial',  tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Entende regressão e classificação e usa scikit-learn em exemplos guiados' },
    { nivelId: '2', criterio: 'Prepara dados, escolhe algoritmos adequados e avalia modelos com métricas' },
    { nivelId: '3', criterio: 'Projeta pipelines de ML, detecta viés e orienta o time em experimentações' },
  ]},
  { id: '78', nome: 'Prompt Engineering',     descricao: 'Criação e otimização de prompts para LLMs',              competencia: 'Inteligência Artificial',  tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Usa técnicas básicas de prompting (zero-shot, few-shot) com LLMs populares' },
    { nivelId: '2', criterio: 'Aplica chain-of-thought, RAG e avalia qualidade de saídas sistematicamente' },
    { nivelId: '3', criterio: 'Define estratégia de IA generativa do produto e avalia modelos para casos de uso' },
  ]},
  { id: '79', nome: 'MLOps',                  descricao: 'Operacionalização de modelos de Machine Learning',       competencia: 'Inteligência Artificial',  tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Empacota e implanta modelos simples com APIs REST' },
    { nivelId: '2', criterio: 'Implementa monitoramento de modelos, data drift e retreinamento automatizado' },
    { nivelId: '3', criterio: 'Lidera plataforma de ML e define práticas de governança de modelos' },
  ]},

  // ─── Redes e Infraestrutura ────────────────────────────────────────────────
  { id: '80', nome: 'Protocolos de Rede',     descricao: 'TCP/IP, HTTP, DNS e fundamentos de redes',               competencia: 'Redes e Infraestrutura',   tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Entende modelo OSI, TCP/IP e depura problemas básicos de conectividade' },
    { nivelId: '2', criterio: 'Configura roteamento, resolve latência e analisa tráfego com Wireshark' },
    { nivelId: '3', criterio: 'Projeta topologias de rede seguras e resilientes para ambientes de produção' },
  ]},
  { id: '81', nome: 'DNS e Load Balancer',    descricao: 'Resolução de nomes e balanceamento de carga',             competencia: 'Redes e Infraestrutura',   tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Configura registros DNS básicos (A, CNAME) e entende como load balancers funcionam' },
    { nivelId: '2', criterio: 'Projeta alta disponibilidade com load balancers e define estratégias de failover' },
    { nivelId: '3', criterio: 'Lidera decisões de arquitetura de rede para disponibilidade e performance' },
  ]},
  { id: '82', nome: 'Firewall e Segurança de Rede', descricao: 'Proteção e segmentação de redes',                  competencia: 'Redes e Infraestrutura',   tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Configura regras básicas de firewall e entende grupos de segurança em cloud' },
    { nivelId: '2', criterio: 'Projeta segmentação de rede com VPCs, VLANs e implementa zero-trust básico' },
    { nivelId: '3', criterio: 'Define política de segurança de rede corporativa e conduz revisões de postura' },
  ]},

  // ─── Gestão de Projetos ────────────────────────────────────────────────────
  { id: '83', nome: 'Planejamento de Projetos', descricao: 'Escopo, cronograma e gestão de entregas',             competencia: 'Gestão de Projetos',       tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Participa de cerimônias de planejamento e entende o escopo das suas tarefas' },
    { nivelId: '2', criterio: 'Estrutura backlog, estima com técnicas formais e acompanha progresso proativamente' },
    { nivelId: '3', criterio: 'Lidera planejamento de projetos complexos e gerencia dependências e stakeholders' },
  ]},
  { id: '84', nome: 'Gestão de Riscos',       descricao: 'Identificação e mitigação de riscos em projetos',        competencia: 'Gestão de Projetos',       tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Identifica riscos técnicos óbvios e reporta ao time ou gestor' },
    { nivelId: '2', criterio: 'Cria matriz de riscos, propõe mitigações e acompanha planos de contingência' },
    { nivelId: '3', criterio: 'Lidera gestão de riscos de iniciativas estratégicas e dissemina a prática' },
  ]},
  { id: '85', nome: 'Métricas de Engenharia', descricao: 'DORA metrics, qualidade e saúde do time',                competencia: 'Gestão de Projetos',       tipo: 'Técnica',        status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Acompanha métricas de deployment frequency e lead time' },
    { nivelId: '2', criterio: 'Define OKRs técnicos, monitora tendências e propõe melhorias baseadas em dados' },
    { nivelId: '3', criterio: 'Lidera cultura de melhoria contínua e reporta métricas para a liderança' },
  ]},

  // ─── Liderança Técnica ────────────────────────────────────────────────────
  { id: '86', nome: 'Delegação e Empoderamento', descricao: 'Distribuir responsabilidades e desenvolver autonomia', competencia: 'Liderança Técnica',        tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Aceita tarefas delegadas com clareza e executa com autonomia crescente' },
    { nivelId: '2', criterio: 'Distribui tarefas ao time considerando capacidade e potencial de desenvolvimento' },
    { nivelId: '3', criterio: 'Cria sistemas de responsabilidade que geram autonomia e crescimento no time' },
  ]},
  { id: '87', nome: 'Desenvolvimento de Pessoas', descricao: 'Mentoria e crescimento de profissionais',            competencia: 'Liderança Técnica',        tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Compartilha conhecimento informalmente e apoia colegas em dúvidas técnicas' },
    { nivelId: '2', criterio: 'Estrutura planos de desenvolvimento para o time e oferece mentoria formal' },
    { nivelId: '3', criterio: 'Lidera cultura de aprendizado contínuo e desenvolve lideranças no time' },
  ]},
  { id: '88', nome: 'Tomada de Decisão',      descricao: 'Decisões técnicas e de negócio com qualidade e agilidade', competencia: 'Liderança Técnica',      tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Toma decisões no escopo das suas tarefas com clareza e documenta o raciocínio' },
    { nivelId: '2', criterio: 'Decide em contextos de ambiguidade, usa frameworks decisórios e alinha stakeholders' },
    { nivelId: '3', criterio: 'Lidera decisões estratégicas, cria consenso no time e aprende com resultados' },
  ]},

  // ─── Comunicação Estratégica ───────────────────────────────────────────────
  { id: '89', nome: 'Apresentações Executivas', descricao: 'Comunicação com liderança e stakeholders',             competencia: 'Comunicação Estratégica',  tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Prepara apresentações estruturadas para públicos técnicos do time' },
    { nivelId: '2', criterio: 'Adapta linguagem e nível de abstração para audiências de diferentes áreas' },
    { nivelId: '3', criterio: 'Conduz apresentações estratégicas para diretoria e influencia decisões de negócio' },
  ]},
  { id: '90', nome: 'Negociação',             descricao: 'Alinhamento de expectativas e resolução de conflitos',   competencia: 'Comunicação Estratégica',  tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Expõe pontos de vista com clareza e busca acordo em situações simples' },
    { nivelId: '2', criterio: 'Usa técnicas de negociação baseada em interesses e encontra soluções ganha-ganha' },
    { nivelId: '3', criterio: 'Lidera negociações complexas com múltiplas partes e resolve impasses estratégicos' },
  ]},
  { id: '91', nome: 'Escuta Ativa',           descricao: 'Compreensão profunda de necessidades e perspectivas',    competencia: 'Comunicação Estratégica',  tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Ouve sem interromper e confirma entendimento em conversas cotidianas' },
    { nivelId: '2', criterio: 'Faz perguntas que aprofundam o entendimento e identifica necessidades não ditas' },
    { nivelId: '3', criterio: 'Usa escuta ativa para facilitar alinhamentos difíceis e cria segurança para falar' },
  ]},

  // ─── Colaboração Remota ────────────────────────────────────────────────────
  { id: '92', nome: 'Trabalho Assíncrono',    descricao: 'Comunicação e entrega eficaz em times distribuídos',     competencia: 'Colaboração Remota',       tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Documenta decisões e atualizações de forma clara sem precisar ser lembrado' },
    { nivelId: '2', criterio: 'Define acordos de comunicação com o time e usa ferramentas assíncronas com maestria' },
    { nivelId: '3', criterio: 'Lidera cultura de trabalho assíncrono e cria sistemas de comunicação escaláveis' },
  ]},
  { id: '93', nome: 'Ferramentas de Colaboração', descricao: 'Uso eficaz de Notion, Confluence, Slack e similares', competencia: 'Colaboração Remota',      tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Usa as ferramentas padrão do time para comunicação e documentação básica' },
    { nivelId: '2', criterio: 'Cria estruturas de documentação que o time consegue manter e encontrar facilmente' },
    { nivelId: '3', criterio: 'Define o stack de colaboração do time e dissemina boas práticas de gestão do conhecimento' },
  ]},
  { id: '94', nome: 'Gestão de Reuniões',     descricao: 'Condução eficaz de reuniões com objetivos claros',       competencia: 'Colaboração Remota',       tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Participa ativamente e chega preparado para as reuniões do time' },
    { nivelId: '2', criterio: 'Facilita reuniões com pauta clara, timeboxing e decisões registradas' },
    { nivelId: '3', criterio: 'Define cultura de reuniões do time e maximiza tempo focado' },
  ]},

  // ─── Resolução de Problemas (extensão) ────────────────────────────────────
  { id: '95', nome: 'Root Cause Analysis',    descricao: 'Identificação das causas raiz de problemas e incidentes', competencia: 'Resolução de Problemas',   tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Usa os 5 Porquês para investigar problemas simples com orientação' },
    { nivelId: '2', criterio: 'Conduz análises com Fishbone e Pareto e propõe ações preventivas' },
    { nivelId: '3', criterio: 'Lidera análise de incidentes críticos e institucionaliza pós-mortems' },
  ]},
  { id: '96', nome: 'Pensamento Sistêmico',   descricao: 'Visão de interações e consequências em sistemas complexos', competencia: 'Resolução de Problemas',  tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Identifica impactos imediatos de mudanças no seu escopo de trabalho' },
    { nivelId: '2', criterio: 'Mapeia dependências entre sistemas e prevê efeitos de segunda ordem' },
    { nivelId: '3', criterio: 'Usa modelos sistêmicos para resolver problemas organizacionais e orienta o time' },
  ]},
  { id: '97', nome: 'Priorização Estratégica', descricao: 'Técnicas para priorizar trabalho com impacto máximo',   competencia: 'Resolução de Problemas',   tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Prioriza tarefas do próprio escopo usando critérios claros' },
    { nivelId: '2', criterio: 'Usa frameworks (RICE, MoSCoW) para priorizar backlog com stakeholders' },
    { nivelId: '3', criterio: 'Define critérios de priorização organizacional e facilita alinhamentos de roadmap' },
  ]},

  // ─── Gestão do Tempo ───────────────────────────────────────────────────────
  { id: '98', nome: 'Planejamento Pessoal',   descricao: 'Organização pessoal e gestão de agenda',                 competencia: 'Gestão do Tempo',          tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Mantém agenda organizada e cumpre compromissos com pontualidade' },
    { nivelId: '2', criterio: 'Usa sistema pessoal de produtividade e planeja semanas com clareza de objetivos' },
    { nivelId: '3', criterio: 'Modela planejamento pessoal eficaz e compartilha práticas com o time' },
  ]},
  { id: '99', nome: 'Gestão de Prioridades',  descricao: 'Foco nas atividades de maior impacto',                   competencia: 'Gestão do Tempo',          tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Distingue tarefas urgentes de importantes e executa o essencial primeiro' },
    { nivelId: '2', criterio: 'Negocia prazos proativamente e reestrutura prioridades diante de mudanças' },
    { nivelId: '3', criterio: 'Ajuda o time a focar no que gera maior valor e elimina trabalho sem impacto' },
  ]},
  { id: '100', nome: 'Foco e Produtividade',  descricao: 'Capacidade de manter foco e entregar com consistência',  competencia: 'Gestão do Tempo',          tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Mantém foco durante blocos de trabalho e minimiza distrações no cotidiano' },
    { nivelId: '2', criterio: 'Usa técnicas (Pomodoro, deep work) e cria ambiente favorável à concentração' },
    { nivelId: '3', criterio: 'Estabelece normas de foco para o time e reduz interrupções desnecessárias' },
  ]},

  // ─── Adaptabilidade ───────────────────────────────────────────────────────
  { id: '101', nome: 'Gestão de Mudanças',    descricao: 'Adaptação e suporte em processos de transformação',      competencia: 'Adaptabilidade',           tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Aceita mudanças com abertura e adapta seu trabalho ao novo contexto' },
    { nivelId: '2', criterio: 'Contribui ativamente em mudanças e ajuda colegas a se adaptarem' },
    { nivelId: '3', criterio: 'Lidera iniciativas de mudança, reduz resistência e acelera a adoção' },
  ]},
  { id: '102', nome: 'Aprendizado Contínuo',  descricao: 'Busca proativa de novos conhecimentos e habilidades',    competencia: 'Adaptabilidade',           tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Estuda regularmente e aplica aprendizados ao trabalho quando solicitado' },
    { nivelId: '2', criterio: 'Experimenta novas tecnologias proativamente e compartilha aprendizados com o time' },
    { nivelId: '3', criterio: 'Cria cultura de aprendizado contínuo e identifica tendências relevantes para o negócio' },
  ]},
  { id: '103', nome: 'Resiliência Operacional', descricao: 'Manutenção da performance em situações adversas',      competencia: 'Adaptabilidade',           tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Mantém qualidade de entrega mesmo em períodos de alta demanda ou incerteza' },
    { nivelId: '2', criterio: 'Recupera o time de crises mantendo foco em soluções e minimizando impacto emocional' },
    { nivelId: '3', criterio: 'Constrói processos resilientes e prepara o time para operar sob pressão prolongada' },
  ]},

  // ─── Pensamento Estratégico ────────────────────────────────────────────────
  { id: '104', nome: 'Visão de Negócio',      descricao: 'Compreensão do modelo de negócio e impacto das decisões técnicas', competencia: 'Pensamento Estratégico', tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Entende como o produto gera valor e como seu trabalho contribui' },
    { nivelId: '2', criterio: 'Avalia impacto de decisões técnicas em métricas de negócio' },
    { nivelId: '3', criterio: 'Propõe iniciativas técnicas alinhadas à estratégia da empresa e influencia o roadmap' },
  ]},
  { id: '105', nome: 'Análise de Mercado',    descricao: 'Avaliação de tendências e posicionamento competitivo',   competencia: 'Pensamento Estratégico',   tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Acompanha tendências tecnológicas e do mercado de forma autônoma' },
    { nivelId: '2', criterio: 'Analisa concorrentes e traduz insights em propostas para o produto' },
    { nivelId: '3', criterio: 'Lidera análises estratégicas de mercado e conecta tecnologia a vantagens competitivas' },
  ]},
  { id: '106', nome: 'Inovação',              descricao: 'Geração e validação de ideias de alto impacto',           competencia: 'Pensamento Estratégico',   tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Sugere melhorias incrementais e experimenta soluções alternativas no cotidiano' },
    { nivelId: '2', criterio: 'Conduz experimentos estruturados e valida hipóteses com dados' },
    { nivelId: '3', criterio: 'Lidera ciclos de inovação, cria cultura de experimentação e escala sucessos' },
  ]},

  // ─── Orientação a Resultados ───────────────────────────────────────────────
  { id: '107', nome: 'Gestão de Metas',       descricao: 'Definição, acompanhamento e alcance de objetivos',       competencia: 'Orientação a Resultados',  tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Entende suas metas, acompanha progresso e reporta status proativamente' },
    { nivelId: '2', criterio: 'Define metas SMART para o time, monitora com OKRs e ajusta curso quando necessário' },
    { nivelId: '3', criterio: 'Lidera o processo de OKRs da área e cria accountability organizacional' },
  ]},
  { id: '108', nome: 'Accountability',        descricao: 'Responsabilização pessoal e do time por resultados',     competencia: 'Orientação a Resultados',  tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Assume responsabilidade pelos próprios resultados sem transferir culpa' },
    { nivelId: '2', criterio: 'Cria ambiente de accountability no time e aborda desvios de forma construtiva' },
    { nivelId: '3', criterio: 'Estabelece cultura de alta performance onde o time se responsabiliza coletivamente' },
  ]},
  { id: '109', nome: 'Foco no Cliente',       descricao: 'Orientação às necessidades do cliente interno e externo', competencia: 'Orientação a Resultados',  tipo: 'Comportamental', status: 'Ativa', niveis: [
    { nivelId: '1', criterio: 'Considera o impacto das suas entregas no cliente e prioriza sua satisfação' },
    { nivelId: '2', criterio: 'Busca feedback do cliente e propõe melhorias medindo resultados pelo lado do usuário' },
    { nivelId: '3', criterio: 'Lidera cultura centrada no cliente e conecta decisões técnicas ao sucesso do cliente' },
  ]},
];

// Mapear níveis para valores numéricos para cálculo de GAP
export const nivelToNumber: Record<string, number> = {
  'Básico': 1,
  'Intermediário': 2,
  'Avançado': 3,
  'Especialista': 4,
};

export const numberToNivel: Record<number, string> = {
  1: 'Básico',
  2: 'Intermediário',
  3: 'Avançado',
  4: 'Especialista',
};

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
export const niveisDefaultData = [
  { id: '1', nome: 'Básico',        descricao: 'Conhecimento inicial. Realiza atividades simples com supervisão constante.',             peso: 1, status: 'Ativo', emUso: 45 },
  { id: '2', nome: 'Intermediário', descricao: 'Executa tarefas com autonomia em situações conhecidas. Busca suporte em contextos novos.', peso: 2, status: 'Ativo', emUso: 38 },
  { id: '3', nome: 'Avançado',      descricao: 'Atua com autonomia em situações complexas e orienta outros profissionais.',               peso: 4, status: 'Ativo', emUso: 22 },
  { id: '4', nome: 'Especialista',  descricao: 'Referência na área. Define padrões, resolve problemas críticos e forma outros.',          peso: 5, status: 'Ativo', emUso: 12 },
];

// ─── Dados exclusivos das telas de teste (João Silva, id='10') ────────────────

// Matriz do cargo de João (replica c2 + extensão com novas habilidades).
// Usada apenas pelas telas de teste — não afeta habilidadesCargoData nem Ana Silva.
// Distribuição João vs esta matriz: 5 ACIMA | 8 NO | 6 ABAIXO | 4 SEM
export const joaoHabilidadesCargoMatriz: { habilidadeId: string; nivelEsperado: string }[] = [
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
];

// Cargos de benchmark — usados apenas pelas telas de teste
export const benchmarkCargosData = [
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
export const habilidadesCargoDataBenchmark: { cargoId: string; habilidadeId: string; nivelEsperado: string }[] = [
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