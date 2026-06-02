import { createContext, useContext, useState, ReactNode } from 'react';

export interface HabilidadeNivel {
  nivelId: string;
  criterio: string;
}

export interface Habilidade {
  id: string;
  nome: string;
  descricao: string;
  competencia: string;
  tipo: 'Técnica' | 'Comportamental';
  status: 'Ativa' | 'Desativada';
  niveis: HabilidadeNivel[];
}

interface HabilidadesContextType {
  habilidades: Habilidade[];
  addHabilidade: (data: Omit<Habilidade, 'id'>) => string;
  updateHabilidade: (id: string, data: Partial<Habilidade>) => void;
}

const HabilidadesContext = createContext<HabilidadesContextType | null>(null);

const initialData: Habilidade[] = [
  { id: '1',  nome: 'React',                 descricao: 'Desenvolvimento com React e ecossistema',          competencia: 'Desenvolvimento Frontend',  tipo: 'Técnica',       status: 'Ativa',      niveis: [{ nivelId: '1', criterio: 'Cria componentes funcionais simples e entende JSX' }, { nivelId: '2', criterio: 'Usa hooks, gerencia estado local e consome APIs REST' }, { nivelId: '3', criterio: 'Define arquitetura de componentes, otimização e boas práticas do time' }] },
  { id: '2',  nome: 'TypeScript',             descricao: 'Programação com tipagem estática',                 competencia: 'Desenvolvimento Frontend',  tipo: 'Técnica',       status: 'Ativa',      niveis: [{ nivelId: '1', criterio: 'Aplica tipagem básica em variáveis, funções e interfaces simples' }, { nivelId: '2', criterio: 'Usa generics, types utilitários e integra tipagem com frameworks' }, { nivelId: '3', criterio: 'Define estratégias de tipagem para o projeto e orienta o time' }] },
  { id: '3',  nome: 'Node.js',                descricao: 'Desenvolvimento backend com Node.js',               competencia: 'Desenvolvimento Backend',   tipo: 'Técnica',       status: 'Ativa',      niveis: [{ nivelId: '2', criterio: 'Cria APIs REST com Express, gerencia rotas e middlewares básicos' }, { nivelId: '3', criterio: 'Projeta serviços escaláveis, aplica segurança e autenticação avançada' }, { nivelId: '4', criterio: 'Define padrões de backend e lidera decisões arquiteturais do time' }] },
  { id: '4',  nome: 'PostgreSQL',             descricao: 'Modelagem e consultas em banco relacional',         competencia: 'Desenvolvimento Backend',   tipo: 'Técnica',       status: 'Ativa',      niveis: [{ nivelId: '1', criterio: 'Executa queries básicas de SELECT, INSERT e UPDATE com filtros' }, { nivelId: '2', criterio: 'Domina JOINs, índices e transações, modela banco relacional' }, { nivelId: '3', criterio: 'Otimiza queries complexas, define estratégias de particionamento e replicação' }] },
  { id: '5',  nome: 'Docker',                 descricao: 'Containerização de aplicações',                    competencia: 'DevOps e Infraestrutura',   tipo: 'Técnica',       status: 'Desativada', niveis: [{ nivelId: '1', criterio: 'Entende conceitos de containers e executa imagens existentes' }, { nivelId: '2', criterio: 'Cria Dockerfiles otimizados e gerencia containers em ambiente local' }] },
  { id: '6',  nome: 'Kubernetes',             descricao: 'Orquestração de containers',                       competencia: 'DevOps e Infraestrutura',   tipo: 'Técnica',       status: 'Ativa',      niveis: [{ nivelId: '2', criterio: 'Faz deploy de aplicações, configura Services e entende pods/nodes' }, { nivelId: '3', criterio: 'Gerencia clusters em produção, configura Ingress e escalabilidade' }, { nivelId: '4', criterio: 'Arquiteta plataformas Kubernetes complexas e define estratégias de resiliência' }] },
  { id: '7',  nome: 'AWS',                    descricao: 'Serviços de cloud computing da Amazon',             competencia: 'Cloud Computing',           tipo: 'Técnica',       status: 'Ativa',      niveis: [{ nivelId: '1', criterio: 'Conhece os principais serviços (EC2, S3, RDS) e navega no console' }, { nivelId: '2', criterio: 'Provisiona infraestrutura básica com segurança (IAM, VPC) e monitora com CloudWatch' }, { nivelId: '3', criterio: 'Projeta arquiteturas de alta disponibilidade e otimiza custos de cloud' }, { nivelId: '4', criterio: 'Define estratégia multicloud e lidera adoção de cloud na organização' }] },
  { id: '8',  nome: 'Figma',                  descricao: 'Design de interfaces e prototipagem',               competencia: 'Design de Produto',         tipo: 'Técnica',       status: 'Ativa',      niveis: [{ nivelId: '1', criterio: 'Navega em arquivos, usa componentes e cria telas simples' }, { nivelId: '2', criterio: 'Cria componentes, usa auto-layout e mantém design system básico' }, { nivelId: '3', criterio: 'Lidera design system, define tokens e garante consistência do produto' }] },
  { id: '9',  nome: 'Comunicação Clara',       descricao: 'Habilidade de se expressar de forma objetiva',      competencia: 'Comunicação Corporativa',   tipo: 'Comportamental', status: 'Ativa',      niveis: [{ nivelId: '1', criterio: 'Expressa ideias de forma objetiva em situações cotidianas' }, { nivelId: '2', criterio: 'Adapta linguagem ao público e estrutura mensagens com clareza' }, { nivelId: '3', criterio: 'Facilita reuniões complexas e comunica decisões estratégicas com precisão' }] },
  { id: '10', nome: 'Trabalho em Equipe',      descricao: 'Colaboração efetiva com colegas',                   competencia: 'Comunicação Corporativa',   tipo: 'Comportamental', status: 'Ativa',      niveis: [{ nivelId: '1', criterio: 'Colabora com colegas em tarefas compartilhadas sem conflitos' }, { nivelId: '2', criterio: 'Age de forma proativa no time e resolve conflitos simples' }, { nivelId: '3', criterio: 'Potencializa o desempenho coletivo e promove cultura colaborativa' }] },
  { id: '11', nome: 'Scrum',                   descricao: 'Framework ágil para gestão de projetos',            competencia: 'Metodologias Ágeis',        tipo: 'Técnica',       status: 'Ativa',      niveis: [{ nivelId: '1', criterio: 'Participa das cerimônias e entende os papéis do Scrum' }, { nivelId: '2', criterio: 'Facilita cerimônias, acompanha métricas ágeis e propõe melhorias' }, { nivelId: '3', criterio: 'Lidera times ágeis, adapta o framework ao contexto e mede resultados' }] },
  { id: '12', nome: 'Kanban',                  descricao: 'Método visual de gestão de fluxo',                  competencia: 'Metodologias Ágeis',        tipo: 'Técnica',       status: 'Ativa',      niveis: [{ nivelId: '1', criterio: 'Visualiza fluxo de trabalho e respeita os limites de WIP' }, { nivelId: '2', criterio: 'Identifica gargalos, otimiza fluxo e usa métricas de lead time' }] },
  { id: '13', nome: 'Liderança Situacional',   descricao: 'Adaptação do estilo de liderança ao contexto',      competencia: 'Liderança',                 tipo: 'Comportamental', status: 'Ativa',      niveis: [{ nivelId: '2', criterio: 'Adapta o estilo de liderança ao nível de maturidade do colaborador' }, { nivelId: '3', criterio: 'Aplica liderança situacional em times híbridos e contextos de mudança' }, { nivelId: '4', criterio: 'Desenvolve outros líderes e estrutura programas de liderança na organização' }] },
  { id: '14', nome: 'Feedback Construtivo',    descricao: 'Fornecer feedback efetivo e orientado',              competencia: 'Liderança',                 tipo: 'Comportamental', status: 'Ativa',      niveis: [{ nivelId: '1', criterio: 'Dá feedbacks baseados em comportamento observado' }, { nivelId: '2', criterio: 'Estrutura feedbacks com frameworks (SCI/STAR) e recebe com abertura' }, { nivelId: '3', criterio: 'Cria cultura de feedback no time e treina outros na prática' }] },
  { id: '15', nome: 'Python',                  descricao: 'Programação em Python',                             competencia: 'Desenvolvimento Backend',   tipo: 'Técnica',       status: 'Ativa',      niveis: [{ nivelId: '1', criterio: 'Escreve scripts simples, usa estruturas de dados e bibliotecas básicas' }, { nivelId: '2', criterio: 'Desenvolve aplicações modulares, usa POO e frameworks como FastAPI/Flask' }, { nivelId: '3', criterio: 'Projeta arquiteturas Python escaláveis e define padrões de código do time' }, { nivelId: '4', criterio: 'Referência técnica em Python, contribui com a comunidade e define estratégia de plataforma' }] },
  { id: '16', nome: 'Machine Learning',        descricao: 'Algoritmos e modelos de ML',                        competencia: 'Machine Learning',          tipo: 'Técnica',       status: 'Ativa',      niveis: [{ nivelId: '2', criterio: 'Implementa modelos clássicos de ML (regressão, classificação) com scikit-learn' }, { nivelId: '3', criterio: 'Projeta pipelines de ML em produção, avalia modelos com rigor estatístico' }, { nivelId: '4', criterio: 'Define estratégia de ML/AI da organização e lidera pesquisa aplicada' }] },
  { id: '17', nome: 'Deep Learning',           descricao: 'Redes neurais profundas',                           competencia: 'Inteligência Artificial',   tipo: 'Técnica',       status: 'Ativa',      niveis: [{ nivelId: '3', criterio: 'Implementa e treina redes neurais com TensorFlow/PyTorch' }, { nivelId: '4', criterio: 'Projeta arquiteturas neurais avançadas e lidera pesquisa em deep learning' }] },
  { id: '18', nome: 'Git',                     descricao: 'Controle de versão e colaboração',                  competencia: 'Desenvolvimento Backend',   tipo: 'Técnica',       status: 'Ativa',      niveis: [{ nivelId: '1', criterio: 'Usa comandos básicos: clone, commit, push e pull' }, { nivelId: '2', criterio: 'Trabalha com branches, merge, rebase e resolve conflitos' }, { nivelId: '3', criterio: 'Define estratégias de branching (GitFlow) e lidera processos de code review' }] },
  { id: '19', nome: 'CI/CD',                   descricao: 'Integração e entrega contínua',                     competencia: 'DevOps e Infraestrutura',   tipo: 'Técnica',       status: 'Ativa',      niveis: [{ nivelId: '2', criterio: 'Configura pipelines básicas com GitHub Actions ou GitLab CI' }, { nivelId: '3', criterio: 'Projeta pipelines robustas com testes, quality gates e deploy automatizado' }, { nivelId: '4', criterio: 'Define estratégia de CI/CD da organização e lidera evolução da plataforma DevOps' }] },
  { id: '20', nome: 'Terraform',               descricao: 'Infrastructure as Code',                            competencia: 'DevOps e Infraestrutura',   tipo: 'Técnica',       status: 'Ativa',      niveis: [{ nivelId: '2', criterio: 'Provisiona infraestrutura básica como código e gerencia estado remoto' }, { nivelId: '3', criterio: 'Projeta módulos reutilizáveis, estrutura ambientes multi-region e gerencia dependências complexas' }] },
  { id: '21', nome: 'Resiliência',             descricao: 'Capacidade de lidar com pressão',                   competencia: 'Inteligência Emocional',    tipo: 'Comportamental', status: 'Ativa',      niveis: [{ nivelId: '1', criterio: 'Mantém produtividade sob pressão moderada e prazo' }, { nivelId: '2', criterio: 'Supera adversidades sem impactar a entrega e aprende com falhas' }, { nivelId: '3', criterio: 'Opera em ambiguidade intensa e apoia o time a manter foco' }] },
  { id: '22', nome: 'Empatia',                 descricao: 'Compreensão das necessidades dos outros',            competencia: 'Inteligência Emocional',    tipo: 'Comportamental', status: 'Ativa',      niveis: [{ nivelId: '1', criterio: 'Ouve ativamente e considera perspectivas alheias no cotidiano' }, { nivelId: '2', criterio: 'Adapta comunicação ao estado emocional dos colegas e oferece suporte' }, { nivelId: '3', criterio: 'Cria segurança psicológica no time e media situações delicadas' }] },
  { id: '23', nome: 'Pensamento Crítico',      descricao: 'Análise lógica e fundamentada',                     competencia: 'Resolução de Problemas',    tipo: 'Comportamental', status: 'Ativa',      niveis: [{ nivelId: '2', criterio: 'Analisa problemas sob múltiplas perspectivas com raciocínio lógico' }, { nivelId: '3', criterio: 'Questiona premissas e propõe soluções baseadas em dados e evidências' }, { nivelId: '4', criterio: 'Define metodologias analíticas e orienta o time em decisões estratégicas' }] },
  { id: '24', nome: 'Criatividade',            descricao: 'Geração de soluções inovadoras',                    competencia: 'Inovação',                  tipo: 'Comportamental', status: 'Ativa',      niveis: [{ nivelId: '1', criterio: 'Propõe ideias novas dentro do escopo do seu trabalho' }, { nivelId: '2', criterio: 'Questiona o status quo e gera soluções fora do óbvio' }, { nivelId: '3', criterio: 'Estrutura processos criativos e facilita dinâmicas de inovação no time' }] },
  { id: '25', nome: 'Excel Avançado',          descricao: 'Fórmulas, macros e análise de dados',               competencia: 'Análise de Dados',          tipo: 'Técnica',       status: 'Ativa',      niveis: [{ nivelId: '3', criterio: 'Cria dashboards com fórmulas avançadas (PROCV, tabelas dinâmicas, SOMASES)' }, { nivelId: '4', criterio: 'Desenvolve macros VBA, automatiza processos e treina o time no uso avançado' }] },
  { id: '26', nome: 'Power BI',                descricao: 'Visualização e análise de dados',                   competencia: 'Business Intelligence',     tipo: 'Técnica',       status: 'Ativa',      niveis: [{ nivelId: '1', criterio: 'Cria relatórios básicos, conecta fontes de dados e publica no serviço' }, { nivelId: '2', criterio: 'Cria medidas DAX, modelos de dados e relatórios interativos' }, { nivelId: '3', criterio: 'Projeta arquitetura de dados, gateway e governa o ambiente Power BI da organização' }] },
  { id: '27', nome: 'SQL',                     descricao: 'Linguagem de consulta estruturada',                  competencia: 'Análise de Dados',          tipo: 'Técnica',       status: 'Ativa',      niveis: [{ nivelId: '1', criterio: 'Escreve queries simples de SELECT com filtros e ordenação' }, { nivelId: '2', criterio: 'Usa JOINs, subqueries, GROUP BY e funções de agregação' }, { nivelId: '3', criterio: 'Otimiza queries com índices, CTEs e window functions' }] },
  { id: '28', nome: 'Gestão de Conflitos',     descricao: 'Mediação e resolução de conflitos',                  competencia: 'Liderança',                 tipo: 'Comportamental', status: 'Ativa',      niveis: [{ nivelId: '2', criterio: 'Media conflitos entre colegas de forma construtiva' }, { nivelId: '3', criterio: 'Facilita resolução de conflitos complexos entre times e stakeholders' }, { nivelId: '4', criterio: 'Estrutura processos organizacionais para prevenção e gestão de conflitos' }] },
  { id: '29', nome: 'Negociação',              descricao: 'Técnicas de negociação efetiva',                     competencia: 'Vendas e Negociação',       tipo: 'Comportamental', status: 'Ativa',      niveis: [{ nivelId: '1', criterio: 'Negocia prazos e recursos em situações cotidianas' }, { nivelId: '2', criterio: 'Prepara e conduz negociações com embasamento e alternativas (BATNA)' }, { nivelId: '3', criterio: 'Lidera negociações estratégicas com alto impacto organizacional' }] },
  { id: '30', nome: 'Apresentações Públicas',  descricao: 'Comunicação em público',                             competencia: 'Apresentações Executivas',  tipo: 'Comportamental', status: 'Ativa',      niveis: [{ nivelId: '1', criterio: 'Apresenta para grupos pequenos com clareza e organização' }, { nivelId: '2', criterio: 'Estrutura narrativas visuais e apresenta com confiança para grupos médios' }, { nivelId: '3', criterio: 'Apresenta para audiências grandes com impacto e persuasão' }, { nivelId: '4', criterio: 'Influencia decisões estratégicas com apresentações executivas e keynotes' }] },
  { id: '31', nome: 'Google Analytics',        descricao: 'Análise de métricas web',                            competencia: 'Analytics',                 tipo: 'Técnica',       status: 'Ativa',      niveis: [] },
  { id: '32', nome: 'SEO',                     descricao: 'Otimização para motores de busca',                   competencia: 'SEO e SEM',                 tipo: 'Técnica',       status: 'Ativa',      niveis: [] },
  { id: '33', nome: 'Gestão de Tempo',         descricao: 'Priorização e organização de tarefas',               competencia: 'Gestão de Projetos',        tipo: 'Comportamental', status: 'Ativa',      niveis: [] },
  { id: '34', nome: 'Orientação a Resultados', descricao: 'Foco em metas e entregas',                           competencia: 'Gestão de Projetos',        tipo: 'Comportamental', status: 'Ativa',      niveis: [] },
  { id: '35', nome: 'REST APIs',               descricao: 'Desenvolvimento de APIs RESTful',                    competencia: 'Desenvolvimento Backend',   tipo: 'Técnica',       status: 'Desativada', niveis: [] },
  { id: '36', nome: 'GraphQL',                 descricao: 'Query language para APIs',                           competencia: 'Desenvolvimento Backend',   tipo: 'Técnica',       status: 'Ativa',      niveis: [] },
  { id: '37', nome: 'MongoDB',                 descricao: 'Banco de dados NoSQL',                               competencia: 'Desenvolvimento Backend',   tipo: 'Técnica',       status: 'Ativa',      niveis: [] },
  { id: '38', nome: 'Redis',                   descricao: 'Cache e armazenamento em memória',                   competencia: 'Desenvolvimento Backend',   tipo: 'Técnica',       status: 'Ativa',      niveis: [] },
  { id: '39', nome: 'Testes Automatizados',    descricao: 'TDD e estratégias de testes',                        competencia: 'Testes e Qualidade',        tipo: 'Técnica',       status: 'Ativa',      niveis: [] },
  { id: '40', nome: 'Segurança de Aplicações', descricao: 'OWASP e boas práticas de segurança',                competencia: 'Segurança da Informação',   tipo: 'Técnica',       status: 'Ativa',      niveis: [] },
];

export function HabilidadesProvider({ children }: { children: ReactNode }) {
  const [habilidades, setHabilidades] = useState<Habilidade[]>(initialData);

  function addHabilidade(data: Omit<Habilidade, 'id'>): string {
    const id = String(Date.now());
    setHabilidades(prev => [...prev, { ...data, id }]);
    return id;
  }

  function updateHabilidade(id: string, data: Partial<Habilidade>) {
    setHabilidades(prev => prev.map(h => h.id === id ? { ...h, ...data } : h));
  }

  return (
    <HabilidadesContext.Provider value={{ habilidades, addHabilidade, updateHabilidade }}>
      {children}
    </HabilidadesContext.Provider>
  );
}

export function useHabilidades() {
  const ctx = useContext(HabilidadesContext);
  if (!ctx) throw new Error('useHabilidades must be used within HabilidadesProvider');
  return ctx;
}
