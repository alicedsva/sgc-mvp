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