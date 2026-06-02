import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router';
import { ArrowLeft, AlertCircle, Eye, X, Users, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import * as amplitude from '@amplitude/unified';

interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}

// ─── Types ───────────────────────────────────────────────────────────────────

type AvaliacaoStatus = 'Rascunho' | 'Ativa' | 'Encerrada';

interface RespostaHabilidade {
  competencia: string;
  habilidade: string;
  nota: number;
}

interface Participante {
  id: string;
  nome: string;
  cargo: string;
  gerencia: string;
  status: 'Respondeu' | 'Pendente';
  respostas: RespostaHabilidade[];
}

interface AvaliacaoMock {
  id: string;
  nome: string;
  status: AvaliacaoStatus;
  periodo: string;
  tipo: string;
  publicoLabel: string;
  descricao?: string;
  habilidadesPorCompetencia?: Record<string, string[]>;
  participantes: Participante[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const AVALIACOES_MOCK: AvaliacaoMock[] = [
  {
    id: '1',
    nome: 'Avaliação de Competências Técnicas Q1 2026',
    status: 'Ativa',
    periodo: '01/03 - 31/03/2026',
    tipo: 'Autoavaliação',
    publicoLabel: 'Gerência Tecnologia',
    participantes: [
      { id: 'p1', nome: 'Ana Silva', cargo: 'Desenvolvedora Pleno', gerencia: 'Tecnologia', status: 'Respondeu',
        respostas: [
          { competencia: 'Desenvolvimento Frontend', habilidade: 'React', nota: 4 },
          { competencia: 'Desenvolvimento Frontend', habilidade: 'TypeScript', nota: 3 },
          { competencia: 'Desenvolvimento Frontend', habilidade: 'CSS/Tailwind', nota: 5 },
          { competencia: 'Desenvolvimento Backend', habilidade: 'Node.js', nota: 3 },
          { competencia: 'Desenvolvimento Backend', habilidade: 'PostgreSQL', nota: 2 },
          { competencia: 'DevOps e Infraestrutura', habilidade: 'Docker', nota: 2 },
          { competencia: 'DevOps e Infraestrutura', habilidade: 'Git', nota: 4 },
        ] },
      { id: 'p2', nome: 'Carlos Mendes', cargo: 'Desenvolvedor Sênior', gerencia: 'Tecnologia', status: 'Respondeu',
        respostas: [
          { competencia: 'Desenvolvimento Frontend', habilidade: 'React', nota: 5 },
          { competencia: 'Desenvolvimento Frontend', habilidade: 'TypeScript', nota: 5 },
          { competencia: 'Desenvolvimento Frontend', habilidade: 'CSS/Tailwind', nota: 4 },
          { competencia: 'Desenvolvimento Backend', habilidade: 'Node.js', nota: 4 },
          { competencia: 'Desenvolvimento Backend', habilidade: 'PostgreSQL', nota: 4 },
          { competencia: 'DevOps e Infraestrutura', habilidade: 'Docker', nota: 3 },
          { competencia: 'DevOps e Infraestrutura', habilidade: 'Git', nota: 5 },
        ] },
      { id: 'p3', nome: 'Juliana Torres', cargo: 'Desenvolvedora Junior', gerencia: 'Tecnologia', status: 'Respondeu',
        respostas: [
          { competencia: 'Desenvolvimento Frontend', habilidade: 'React', nota: 2 },
          { competencia: 'Desenvolvimento Frontend', habilidade: 'TypeScript', nota: 2 },
          { competencia: 'Desenvolvimento Frontend', habilidade: 'CSS/Tailwind', nota: 3 },
          { competencia: 'Desenvolvimento Backend', habilidade: 'Node.js', nota: 1 },
          { competencia: 'Desenvolvimento Backend', habilidade: 'PostgreSQL', nota: 1 },
          { competencia: 'DevOps e Infraestrutura', habilidade: 'Docker', nota: 1 },
          { competencia: 'DevOps e Infraestrutura', habilidade: 'Git', nota: 3 },
        ] },
      { id: 'p4', nome: 'Marcos Oliveira', cargo: 'Tech Lead', gerencia: 'Tecnologia', status: 'Respondeu',
        respostas: [
          { competencia: 'Desenvolvimento Frontend', habilidade: 'React', nota: 5 },
          { competencia: 'Desenvolvimento Frontend', habilidade: 'TypeScript', nota: 5 },
          { competencia: 'Desenvolvimento Frontend', habilidade: 'CSS/Tailwind', nota: 4 },
          { competencia: 'Desenvolvimento Backend', habilidade: 'Node.js', nota: 5 },
          { competencia: 'Desenvolvimento Backend', habilidade: 'PostgreSQL', nota: 5 },
          { competencia: 'DevOps e Infraestrutura', habilidade: 'Docker', nota: 4 },
          { competencia: 'DevOps e Infraestrutura', habilidade: 'Git', nota: 5 },
        ] },
      { id: 'p5', nome: 'Fernanda Costa', cargo: 'Desenvolvedora Pleno', gerencia: 'Tecnologia', status: 'Respondeu',
        respostas: [
          { competencia: 'Desenvolvimento Frontend', habilidade: 'React', nota: 4 },
          { competencia: 'Desenvolvimento Frontend', habilidade: 'TypeScript', nota: 3 },
          { competencia: 'Desenvolvimento Frontend', habilidade: 'CSS/Tailwind', nota: 4 },
          { competencia: 'Desenvolvimento Backend', habilidade: 'Node.js', nota: 3 },
          { competencia: 'Desenvolvimento Backend', habilidade: 'PostgreSQL', nota: 3 },
          { competencia: 'DevOps e Infraestrutura', habilidade: 'Docker', nota: 2 },
          { competencia: 'DevOps e Infraestrutura', habilidade: 'Git', nota: 4 },
        ] },
      { id: 'p6', nome: 'Ricardo Lima', cargo: 'Desenvolvedor Sênior', gerencia: 'Tecnologia', status: 'Respondeu',
        respostas: [
          { competencia: 'Desenvolvimento Frontend', habilidade: 'React', nota: 4 },
          { competencia: 'Desenvolvimento Frontend', habilidade: 'TypeScript', nota: 4 },
          { competencia: 'Desenvolvimento Frontend', habilidade: 'CSS/Tailwind', nota: 3 },
          { competencia: 'Desenvolvimento Backend', habilidade: 'Node.js', nota: 5 },
          { competencia: 'Desenvolvimento Backend', habilidade: 'PostgreSQL', nota: 4 },
          { competencia: 'DevOps e Infraestrutura', habilidade: 'Docker', nota: 4 },
          { competencia: 'DevOps e Infraestrutura', habilidade: 'Git', nota: 5 },
        ] },
      { id: 'p7', nome: 'Beatriz Santos', cargo: 'Desenvolvedora Junior', gerencia: 'Tecnologia', status: 'Pendente', respostas: [] },
      { id: 'p8', nome: 'Thiago Alves', cargo: 'Desenvolvedor Pleno', gerencia: 'Tecnologia', status: 'Pendente', respostas: [] },
    ],
  },
  {
    id: '2',
    nome: 'Avaliação de Liderança 2026',
    status: 'Encerrada',
    periodo: '15/02 - 28/02/2026',
    tipo: 'Gestor',
    publicoLabel: 'Gerências Recursos Humanos e Operações',
    participantes: [
      { id: 'p1', nome: 'Patricia Rocha', cargo: 'Gerente de RH', gerencia: 'Recursos Humanos', status: 'Respondeu',
        respostas: [
          { competencia: 'Liderança', habilidade: 'Liderança Situacional', nota: 5 },
          { competencia: 'Liderança', habilidade: 'Feedback Construtivo', nota: 5 },
          { competencia: 'Liderança', habilidade: 'Gestão de Conflitos', nota: 4 },
          { competencia: 'Comunicação Corporativa', habilidade: 'Comunicação Clara', nota: 5 },
          { competencia: 'Comunicação Corporativa', habilidade: 'Escuta Ativa', nota: 5 },
        ] },
      { id: 'p2', nome: 'Rodrigo Ferreira', cargo: 'Coordenador de Operações', gerencia: 'Operações', status: 'Respondeu',
        respostas: [
          { competencia: 'Liderança', habilidade: 'Liderança Situacional', nota: 4 },
          { competencia: 'Liderança', habilidade: 'Feedback Construtivo', nota: 3 },
          { competencia: 'Liderança', habilidade: 'Gestão de Conflitos', nota: 4 },
          { competencia: 'Comunicação Corporativa', habilidade: 'Comunicação Clara', nota: 4 },
          { competencia: 'Comunicação Corporativa', habilidade: 'Escuta Ativa', nota: 3 },
        ] },
      { id: 'p3', nome: 'Camila Nunes', cargo: 'Analista de RH Sênior', gerencia: 'Recursos Humanos', status: 'Respondeu',
        respostas: [
          { competencia: 'Liderança', habilidade: 'Liderança Situacional', nota: 3 },
          { competencia: 'Liderança', habilidade: 'Feedback Construtivo', nota: 4 },
          { competencia: 'Liderança', habilidade: 'Gestão de Conflitos', nota: 3 },
          { competencia: 'Comunicação Corporativa', habilidade: 'Comunicação Clara', nota: 4 },
          { competencia: 'Comunicação Corporativa', habilidade: 'Escuta Ativa', nota: 4 },
        ] },
      { id: 'p4', nome: 'Eduardo Pinto', cargo: 'Supervisor de Operações', gerencia: 'Operações', status: 'Respondeu',
        respostas: [
          { competencia: 'Liderança', habilidade: 'Liderança Situacional', nota: 4 },
          { competencia: 'Liderança', habilidade: 'Feedback Construtivo', nota: 4 },
          { competencia: 'Liderança', habilidade: 'Gestão de Conflitos', nota: 5 },
          { competencia: 'Comunicação Corporativa', habilidade: 'Comunicação Clara', nota: 3 },
          { competencia: 'Comunicação Corporativa', habilidade: 'Escuta Ativa', nota: 4 },
        ] },
      { id: 'p5', nome: 'Mariana Gomes', cargo: 'Gestora de Talentos', gerencia: 'Recursos Humanos', status: 'Respondeu',
        respostas: [
          { competencia: 'Liderança', habilidade: 'Liderança Situacional', nota: 5 },
          { competencia: 'Liderança', habilidade: 'Feedback Construtivo', nota: 5 },
          { competencia: 'Liderança', habilidade: 'Gestão de Conflitos', nota: 4 },
          { competencia: 'Comunicação Corporativa', habilidade: 'Comunicação Clara', nota: 5 },
          { competencia: 'Comunicação Corporativa', habilidade: 'Escuta Ativa', nota: 5 },
        ] },
    ],
  },
  {
    id: '4',
    nome: 'Avaliação de Vendas Q1',
    status: 'Ativa',
    periodo: '05/03 - 25/03/2026',
    tipo: 'Autoavaliação',
    publicoLabel: 'Gerência Vendas',
    participantes: [
      { id: 'p1', nome: 'Lucas Andrade', cargo: 'Executivo de Vendas', gerencia: 'Vendas', status: 'Respondeu',
        respostas: [
          { competencia: 'Vendas e Negociação', habilidade: 'Técnicas de Vendas', nota: 4 },
          { competencia: 'Vendas e Negociação', habilidade: 'Gestão de Pipeline', nota: 3 },
          { competencia: 'Comunicação Corporativa', habilidade: 'Comunicação Clara', nota: 4 },
          { competencia: 'Comunicação Corporativa', habilidade: 'Apresentação', nota: 3 },
        ] },
      { id: 'p2', nome: 'Sabrina Vieira', cargo: 'Gerente de Vendas', gerencia: 'Vendas', status: 'Respondeu',
        respostas: [
          { competencia: 'Vendas e Negociação', habilidade: 'Técnicas de Vendas', nota: 5 },
          { competencia: 'Vendas e Negociação', habilidade: 'Gestão de Pipeline', nota: 5 },
          { competencia: 'Comunicação Corporativa', habilidade: 'Comunicação Clara', nota: 5 },
          { competencia: 'Comunicação Corporativa', habilidade: 'Apresentação', nota: 5 },
        ] },
      { id: 'p3', nome: 'Diego Souza', cargo: 'Executivo de Vendas', gerencia: 'Vendas', status: 'Respondeu',
        respostas: [
          { competencia: 'Vendas e Negociação', habilidade: 'Técnicas de Vendas', nota: 3 },
          { competencia: 'Vendas e Negociação', habilidade: 'Gestão de Pipeline', nota: 2 },
          { competencia: 'Comunicação Corporativa', habilidade: 'Comunicação Clara', nota: 3 },
          { competencia: 'Comunicação Corporativa', habilidade: 'Apresentação', nota: 2 },
        ] },
      { id: 'p4', nome: 'Tânia Medeiros', cargo: 'Analista de Vendas', gerencia: 'Vendas', status: 'Pendente', respostas: [] },
      { id: 'p5', nome: 'Gustavo Reis', cargo: 'Executivo de Vendas', gerencia: 'Vendas', status: 'Pendente', respostas: [] },
      { id: 'p6', nome: 'Priscila Moura', cargo: 'Analista de Vendas', gerencia: 'Vendas', status: 'Pendente', respostas: [] },
    ],
  },
  {
    id: '5',
    nome: 'Competências Analíticas',
    status: 'Encerrada',
    periodo: '01/01 - 31/01/2026',
    tipo: 'Autoavaliação',
    publicoLabel: 'Gerências Tecnologia e Financeiro',
    participantes: [
      { id: 'p1', nome: 'Rafael Costa', cargo: 'Analista de Dados Sênior', gerencia: 'Tecnologia', status: 'Respondeu',
        respostas: [
          { competencia: 'Análise de Dados', habilidade: 'SQL Avançado', nota: 5 },
          { competencia: 'Análise de Dados', habilidade: 'Python para Dados', nota: 4 },
          { competencia: 'Business Intelligence', habilidade: 'Power BI', nota: 4 },
          { competencia: 'Business Intelligence', habilidade: 'Visualização de Dados', nota: 5 },
        ] },
      { id: 'p2', nome: 'Vanessa Lima', cargo: 'Analista de BI', gerencia: 'Financeiro', status: 'Respondeu',
        respostas: [
          { competencia: 'Análise de Dados', habilidade: 'SQL Avançado', nota: 3 },
          { competencia: 'Análise de Dados', habilidade: 'Python para Dados', nota: 2 },
          { competencia: 'Business Intelligence', habilidade: 'Power BI', nota: 5 },
          { competencia: 'Business Intelligence', habilidade: 'Visualização de Dados', nota: 4 },
        ] },
      { id: 'p3', nome: 'Nelson Faria', cargo: 'Cientista de Dados', gerencia: 'Tecnologia', status: 'Respondeu',
        respostas: [
          { competencia: 'Análise de Dados', habilidade: 'SQL Avançado', nota: 5 },
          { competencia: 'Análise de Dados', habilidade: 'Python para Dados', nota: 5 },
          { competencia: 'Business Intelligence', habilidade: 'Power BI', nota: 3 },
          { competencia: 'Business Intelligence', habilidade: 'Visualização de Dados', nota: 4 },
        ] },
      { id: 'p4', nome: 'Isabela Queiroz', cargo: 'Analista Financeiro', gerencia: 'Financeiro', status: 'Respondeu',
        respostas: [
          { competencia: 'Análise de Dados', habilidade: 'SQL Avançado', nota: 2 },
          { competencia: 'Análise de Dados', habilidade: 'Python para Dados', nota: 1 },
          { competencia: 'Business Intelligence', habilidade: 'Power BI', nota: 3 },
          { competencia: 'Business Intelligence', habilidade: 'Visualização de Dados', nota: 3 },
        ] },
      { id: 'p5', nome: 'Bruno Carvalho', cargo: 'Analista de Dados Pleno', gerencia: 'Tecnologia', status: 'Respondeu',
        respostas: [
          { competencia: 'Análise de Dados', habilidade: 'SQL Avançado', nota: 4 },
          { competencia: 'Análise de Dados', habilidade: 'Python para Dados', nota: 3 },
          { competencia: 'Business Intelligence', habilidade: 'Power BI', nota: 4 },
          { competencia: 'Business Intelligence', habilidade: 'Visualização de Dados', nota: 4 },
        ] },
    ],
  },
  {
    id: '7',
    nome: 'Avaliação Design Q1 2026',
    status: 'Ativa',
    periodo: '01/03 - 20/03/2026',
    tipo: 'Autoavaliação',
    publicoLabel: 'Gerências Design e Produto',
    participantes: [
      { id: 'p1', nome: 'Amanda Freitas', cargo: 'UX Designer Sênior', gerencia: 'Design', status: 'Respondeu',
        respostas: [
          { competencia: 'Design de Produto', habilidade: 'Figma', nota: 5 },
          { competencia: 'Design de Produto', habilidade: 'Design Systems', nota: 4 },
          { competencia: 'UX Research', habilidade: 'Testes de Usabilidade', nota: 5 },
          { competencia: 'UX Research', habilidade: 'Entrevistas com Usuários', nota: 4 },
        ] },
      { id: 'p2', nome: 'Hugo Nascimento', cargo: 'Product Designer', gerencia: 'Produto', status: 'Respondeu',
        respostas: [
          { competencia: 'Design de Produto', habilidade: 'Figma', nota: 4 },
          { competencia: 'Design de Produto', habilidade: 'Design Systems', nota: 3 },
          { competencia: 'UX Research', habilidade: 'Testes de Usabilidade', nota: 4 },
          { competencia: 'UX Research', habilidade: 'Entrevistas com Usuários', nota: 3 },
        ] },
      { id: 'p3', nome: 'Letícia Prado', cargo: 'UI Designer Pleno', gerencia: 'Design', status: 'Respondeu',
        respostas: [
          { competencia: 'Design de Produto', habilidade: 'Figma', nota: 4 },
          { competencia: 'Design de Produto', habilidade: 'Design Systems', nota: 3 },
          { competencia: 'UX Research', habilidade: 'Testes de Usabilidade', nota: 2 },
          { competencia: 'UX Research', habilidade: 'Entrevistas com Usuários', nota: 2 },
        ] },
      { id: 'p4', nome: 'Paulo Ribeiro', cargo: 'UX Researcher', gerencia: 'Design', status: 'Pendente', respostas: [] },
    ],
  },
  {
    id: '8',
    nome: 'Competências em Cloud Computing',
    status: 'Encerrada',
    periodo: '15/01 - 15/02/2026',
    tipo: 'Autoavaliação',
    publicoLabel: 'Gerência Tecnologia',
    participantes: [
      { id: 'p1', nome: 'Fábio Duarte', cargo: 'DevOps Engineer', gerencia: 'Tecnologia', status: 'Respondeu',
        respostas: [
          { competencia: 'Cloud Computing', habilidade: 'AWS', nota: 5 },
          { competencia: 'Cloud Computing', habilidade: 'Azure', nota: 3 },
          { competencia: 'DevOps e Infraestrutura', habilidade: 'Kubernetes', nota: 4 },
          { competencia: 'DevOps e Infraestrutura', habilidade: 'Terraform', nota: 4 },
        ] },
      { id: 'p2', nome: 'Cíntia Borges', cargo: 'Cloud Architect', gerencia: 'Tecnologia', status: 'Respondeu',
        respostas: [
          { competencia: 'Cloud Computing', habilidade: 'AWS', nota: 5 },
          { competencia: 'Cloud Computing', habilidade: 'Azure', nota: 5 },
          { competencia: 'DevOps e Infraestrutura', habilidade: 'Kubernetes', nota: 5 },
          { competencia: 'DevOps e Infraestrutura', habilidade: 'Terraform', nota: 5 },
        ] },
      { id: 'p3', nome: 'Márcio Teles', cargo: 'SRE Engineer', gerencia: 'Tecnologia', status: 'Respondeu',
        respostas: [
          { competencia: 'Cloud Computing', habilidade: 'AWS', nota: 4 },
          { competencia: 'Cloud Computing', habilidade: 'Azure', nota: 2 },
          { competencia: 'DevOps e Infraestrutura', habilidade: 'Kubernetes', nota: 5 },
          { competencia: 'DevOps e Infraestrutura', habilidade: 'Terraform', nota: 3 },
        ] },
      { id: 'p4', nome: 'Débora Melo', cargo: 'DevOps Engineer', gerencia: 'Tecnologia', status: 'Respondeu',
        respostas: [
          { competencia: 'Cloud Computing', habilidade: 'AWS', nota: 3 },
          { competencia: 'Cloud Computing', habilidade: 'Azure', nota: 3 },
          { competencia: 'DevOps e Infraestrutura', habilidade: 'Kubernetes', nota: 3 },
          { competencia: 'DevOps e Infraestrutura', habilidade: 'Terraform', nota: 2 },
        ] },
      { id: 'p5', nome: 'Cristiano Lemos', cargo: 'Engenheiro de Infraestrutura', gerencia: 'Tecnologia', status: 'Respondeu',
        respostas: [
          { competencia: 'Cloud Computing', habilidade: 'AWS', nota: 4 },
          { competencia: 'Cloud Computing', habilidade: 'Azure', nota: 4 },
          { competencia: 'DevOps e Infraestrutura', habilidade: 'Kubernetes', nota: 4 },
          { competencia: 'DevOps e Infraestrutura', habilidade: 'Terraform', nota: 4 },
        ] },
    ],
  },
  {
    id: '3',
    nome: 'Soft Skills - Semestral',
    status: 'Rascunho',
    periodo: '10/04 - 30/04/2026',
    tipo: 'Autoavaliação',
    publicoLabel: 'Todos os colaboradores',
    descricao: 'Avaliação semestral de competências comportamentais e habilidades interpessoais para todos os colaboradores da organização.',
    habilidadesPorCompetencia: {
      'Comunicação Corporativa': ['Comunicação Clara', 'Escuta Ativa', 'Apresentações Executivas'],
      'Inteligência Emocional': ['Autoconhecimento', 'Gestão de Emoções', 'Empatia'],
      'Trabalho em Equipe': ['Colaboração', 'Feedback Construtivo', 'Resolução de Conflitos'],
    },
    participantes: [],
  },
  {
    id: '6',
    nome: 'Metodologias Ágeis',
    status: 'Rascunho',
    periodo: '20/03 - 10/04/2026',
    tipo: 'Gestor',
    publicoLabel: 'Gerências Tecnologia e Produto',
    descricao: 'Avaliação do nível de adoção e domínio das metodologias ágeis pelas equipes de tecnologia e produto.',
    habilidadesPorCompetencia: {
      'Metodologias Ágeis': ['Scrum', 'Kanban', 'OKRs', 'Retrospectivas Eficazes'],
      'Gestão de Projetos': ['Planejamento de Sprint', 'Gestão de Backlog', 'Estimativa de Esforço'],
    },
    participantes: [],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AvaliacaoDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();

  const avaliacao = AVALIACOES_MOCK.find((a) => a.id === id);

  useEffect(() => {
    if (avaliacao) {
      amplitude.track('Avaliacao Viewed', {
        avaliacao_nome: avaliacao.nome,
        avaliacao_status: avaliacao.status,
        avaliacao_tipo: avaliacao.tipo,
        total_participantes: avaliacao.participantes.length,
      });
    }
  }, [id]); // fire once per avaliacao ID change

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

function AvaliacaoRascunhoView({ avaliacao }: { avaliacao: AvaliacaoMock }) {
  const competencias = avaliacao.habilidadesPorCompetencia
    ? Object.keys(avaliacao.habilidadesPorCompetencia)
    : [];

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
          {avaliacao.periodo && (
            <>
              <span className="text-gray-300">·</span>
              <span>{avaliacao.periodo}</span>
            </>
          )}
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
      {competencias.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {competencias.map((comp) => (
            <div key={comp} className="p-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {comp}
              </p>
              <div className="space-y-4">
                {avaliacao.habilidadesPorCompetencia![comp].map((hab) => (
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

function AvaliacaoDetalheView({ avaliacao }: { avaliacao: AvaliacaoMock }) {
  const [drawerParticipante, setDrawerParticipante] = useState<Participante | null>(null);

  const total = avaliacao.participantes.length;
  const responderam = avaliacao.participantes.filter((p) => p.status === 'Respondeu').length;
  const pendentes = total - responderam;
  const percentual = total > 0 ? Math.round((responderam / total) * 100) : 0;

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
          <span>{avaliacao.periodo}</span>
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
          iconBg="bg-[var(--brand-50)]"
        />
        <SummaryCard
          icon={<CheckCircle className="w-5 h-5 text-green-600" />}
          label="Responderam"
          value={responderam}
          iconBg="bg-green-50"
        />
        <SummaryCard
          icon={<Clock className="w-5 h-5 text-yellow-600" />}
          label="Pendentes"
          value={pendentes}
          iconBg="bg-yellow-50"
        />
        <SummaryCard
          icon={<TrendingUp className="w-5 h-5 text-[var(--brand-600)]" />}
          label="Conclusão"
          value={`${percentual}%`}
          iconBg="bg-[var(--brand-50)]"
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
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Participantes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Cargo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Gerência</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {avaliacao.participantes.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{p.nome}</td>
                  <td className="px-6 py-4 text-gray-600">{p.cargo}</td>
                  <td className="px-6 py-4 text-gray-600">{p.gerencia}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        p.status === 'Respondeu'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {p.status === 'Respondeu' ? (
                      <button
                        onClick={() => {
                          setDrawerParticipante(p);
                          amplitude.track('Avaliacao Responses Viewed', {
                            avaliacao_nome: avaliacao.nome,
                            participante_cargo: p.cargo,
                            participante_gerencia: p.gerencia,
                            total_respostas: p.respostas.length,
                          });
                        }}
                        title="Visualizar respostas"
                        className="p-1.5 md:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="inline-block w-8" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
  iconBg,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconBg: string;
  highlight?: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          {icon}
        </div>
      </div>
      <p className={`text-2xl font-semibold ${highlight ?? 'text-gray-900'}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

// ─── Drawer de respostas ──────────────────────────────────────────────────────

function RespostasDrawer({
  participante,
  onClose,
}: {
  participante: Participante;
  onClose: () => void;
}) {
  const porCompetencia = useMemo(() => {
    const groups: Record<string, RespostaHabilidade[]> = {};
    participante.respostas.forEach((r) => {
      if (!groups[r.competencia]) groups[r.competencia] = [];
      groups[r.competencia].push(r);
    });
    return groups;
  }, [participante]);

  const competencias = Object.keys(porCompetencia);

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
          {competencias.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Nenhuma resposta registrada.</p>
          ) : (
            competencias.map((comp) => (
              <div key={comp}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {comp}
                </p>
                <div className="space-y-3">
                  {porCompetencia[comp].map((r) => (
                    <div key={r.habilidade} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
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
