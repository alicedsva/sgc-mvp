import {
  User,
  Calendar,
  Clock,
  Briefcase,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Target,
  Award,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

// Dados mockados
const colaborador = {
  nome: 'João',
  cargo: 'Desenvolvedor Frontend',
  senioridade: 'Pleno',
  area: 'Engenharia de Software',
  tempoEmpresa: '2 anos e 4 meses',
  ultimaAvaliacao: '15 de dezembro de 2024',
  avaliacoesPendentes: 2,
  proximoUmPraUm: '12 de fevereiro de 2025',
  avaliacoesRespondidas: 8,
  habilidadesAvaliadas: 12,
  competenciasMapeadas: 6,
  statusUltimaAvaliacao: 'Concluída',
};

// Competências Técnicas
const competenciasTecnicas = [
  { competencia: 'Frontend', voce: 4.0, mediaArea: 3.5, mediaEmpresa: 3.2 },
  { competencia: 'Backend', voce: 3.2, mediaArea: 3.4, mediaEmpresa: 3.3 },
  { competencia: 'DevOps', voce: 2.8, mediaArea: 3.0, mediaEmpresa: 2.9 },
  { competencia: 'Testes', voce: 3.0, mediaArea: 3.3, mediaEmpresa: 3.1 },
  { competencia: 'Arquitetura', voce: 2.5, mediaArea: 3.2, mediaEmpresa: 3.0 },
];

// Competências Comportamentais
const competenciasComportamentais = [
  { competencia: 'Comunicação', voce: 4.0, mediaArea: 3.6, mediaEmpresa: 3.4 },
  { competencia: 'Colaboração', voce: 4.2, mediaArea: 3.8, mediaEmpresa: 3.5 },
  { competencia: 'Liderança', voce: 3.0, mediaArea: 3.2, mediaEmpresa: 3.1 },
  { competencia: 'Adaptabilidade', voce: 3.8, mediaArea: 3.5, mediaEmpresa: 3.3 },
  { competencia: 'Autonomia', voce: 3.5, mediaArea: 3.4, mediaEmpresa: 3.2 },
];

// Detalhamento por competência (para expansão futura)
const competenciasDetalhadas = [
  {
    id: 1,
    nome: 'Desenvolvimento Frontend',
    media: 4.0,
    habilidades: [
      { nome: 'React', nivel: 4 },
      { nome: 'TypeScript', nivel: 4 },
      { nome: 'CSS/Tailwind', nivel: 3.5 },
    ],
  },
  {
    id: 2,
    nome: 'Desenvolvimento Backend',
    media: 3.2,
    habilidades: [
      { nome: 'Node.js', nivel: 3 },
      { nome: 'API REST', nivel: 3.5 },
    ],
  },
  {
    id: 3,
    nome: 'DevOps e Infraestrutura',
    media: 2.8,
    habilidades: [
      { nome: 'Docker', nivel: 3 },
      { nome: 'CI/CD', nivel: 2.5 },
    ],
  },
  {
    id: 4,
    nome: 'Comunicação',
    media: 4.0,
    habilidades: [
      { nome: 'Comunicação Clara', nivel: 4 },
      { nome: 'Apresentações', nivel: 3.5 },
    ],
  },
];

export function MeuPerfil() {
  const [tipoCompetencia, setTipoCompetencia] = useState<'tecnicas' | 'comportamentais'>('tecnicas');
  const [competenciaExpandida, setCompetenciaExpandida] = useState<number | null>(null);

  const competenciasRadar = tipoCompetencia === 'tecnicas' ? competenciasTecnicas : competenciasComportamentais;

  const toggleCompetencia = (id: number) => {
    setCompetenciaExpandida(competenciaExpandida === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* 1. Bloco de Boas-vindas + Identidade (Hero) */}
      <div className="bg-gradient-to-br from-[var(--brand-50)] to-[var(--brand-100)] rounded-lg border border-[var(--brand-200)] p-8">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-20 h-20 bg-[var(--brand-600)] rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-10 h-10 text-white" />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-gray-900 mb-3">
              Olá, {colaborador.nome} 👋
            </h1>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-300 rounded-full mb-3">
              <span className="text-base font-medium text-gray-800">
                {colaborador.cargo}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-base font-medium text-[var(--brand-600)]">
                {colaborador.senioridade}
              </span>
            </div>

            <p className="text-base text-gray-700">
              Aqui você acompanha suas avaliações, evolução profissional e próximos passos na empresa.
            </p>
          </div>
        </div>

        {/* Informações secundárias */}
        <div className="flex items-center gap-6 pt-5 border-t border-[var(--brand-200)]">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{colaborador.area}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{colaborador.tempoEmpresa}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">Última avaliação: {colaborador.ultimaAvaliacao}</span>
          </div>
        </div>
      </div>

      {/* 2. Ações importantes agora */}
      {(colaborador.avaliacoesPendentes > 0 || colaborador.proximoUmPraUm) && (
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Ações importantes</h2>

          <div className="space-y-3">
            {/* Avaliações pendentes */}
            {colaborador.avaliacoesPendentes > 0 && (
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{colaborador.avaliacoesPendentes}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Avaliações pendentes</p>
                    <p className="text-xs text-gray-600">Mantenha seu perfil atualizado</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                  Responder
                </button>
              </div>
            )}

            {/* Próximo 1:1 */}
            {colaborador.proximoUmPraUm && (
              <div className="flex items-center gap-3 p-4 bg-[var(--brand-50)] rounded-lg border border-[var(--brand-200)]">
                <Calendar className="w-5 h-5 text-[var(--brand-600)]" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Próximo 1:1 agendado</p>
                  <p className="text-xs text-gray-600">{colaborador.proximoUmPraUm}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Indicadores rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--brand-100)] rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[var(--brand-600)]" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{colaborador.avaliacoesRespondidas}</p>
              <p className="text-xs text-gray-600">Avaliações respondidas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{colaborador.habilidadesAvaliadas}</p>
              <p className="text-xs text-gray-600">Habilidades avaliadas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{colaborador.competenciasMapeadas}</p>
              <p className="text-xs text-gray-600">Competências mapeadas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{colaborador.statusUltimaAvaliacao}</p>
              <p className="text-xs text-gray-600">Última avaliação</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Visão geral das competências + 5. Interpretação automática */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Radar */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Visão Geral de Competências
          </h2>
          <p className="text-sm text-gray-600 mb-5">
            Compare seu perfil com a média da área e da empresa
          </p>

          {/* Toggle Técnicas / Comportamentais */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setTipoCompetencia('tecnicas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tipoCompetencia === 'tecnicas'
                  ? 'bg-[var(--brand-600)] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Técnicas
            </button>
            <button
              onClick={() => setTipoCompetencia('comportamentais')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tipoCompetencia === 'comportamentais'
                  ? 'bg-[var(--brand-600)] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Comportamentais
            </button>
          </div>

          {/* Radar Chart */}
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={competenciasRadar}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="competencia"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Radar
                  name="Você"
                  dataKey="voce"
                  stroke="#009FC2"
                  fill="#009FC2"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Média da Área"
                  dataKey="mediaArea"
                  stroke="#a855f7"
                  fill="#a855f7"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Radar
                  name="Média da Empresa"
                  dataKey="mediaEmpresa"
                  stroke="#9ca3af"
                  fill="#9ca3af"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Legend iconType="circle" />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interpretação Automática do Perfil */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Análise do seu perfil
          </h3>

          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>
              Seu perfil está bem alinhado ao cargo atual, com destaque em{' '}
              <span className="font-medium text-gray-900">Frontend</span> e{' '}
              <span className="font-medium text-gray-900">Comunicação</span>.
            </p>

            <p>
              Há espaço de evolução em <span className="font-medium text-gray-900">DevOps</span> e{' '}
              <span className="font-medium text-gray-900">Arquitetura</span> para o próximo nível da carreira.
            </p>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Recomendações
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-[var(--brand-600)] mt-0.5">•</span>
                  <span>Busque mentorias em arquitetura de software</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-[var(--brand-600)] mt-0.5">•</span>
                  <span>Desenvolva habilidades de CI/CD</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-[var(--brand-600)] mt-0.5">•</span>
                  <span>Participe de projetos complexos</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-5 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              Análise gerada com base nas suas competências e no perfil esperado para o próximo cargo.
            </p>
          </div>
        </div>
      </div>

      {/* Detalhamento expandível (opcional) */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Detalhamento por Competência
        </h2>
        <p className="text-sm text-gray-600 mb-5">
          Expanda cada competência para ver suas habilidades individuais
        </p>

        <div className="space-y-2">
          {competenciasDetalhadas.map((competencia) => (
            <div key={competencia.id} className="rounded-lg overflow-hidden">
              <button
                onClick={() => toggleCompetencia(competencia.id)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {competenciaExpandida === competencia.id ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">{competencia.nome}</p>
                    <p className="text-xs text-gray-500">{competencia.habilidades.length} habilidades</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Média:</span>
                  <span className="text-base font-semibold text-[var(--brand-600)]">
                    {competencia.media.toFixed(1)}
                  </span>
                </div>
              </button>

              {competenciaExpandida === competencia.id && (
                <div className="px-4 pb-4 pt-2 bg-gray-50 rounded-b-lg">
                  <div className="space-y-3">
                    {competencia.habilidades.map((habilidade, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 mb-2">{habilidade.nome}</p>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[var(--brand-600)] rounded-full"
                              style={{ width: `${(habilidade.nivel / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="ml-6 text-right">
                          <p className="text-sm font-semibold text-gray-900">{habilidade.nivel}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 6. Evolução de carreira */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Evolução de Carreira</h2>
            <p className="text-sm text-gray-600 mb-5">
              Veja onde você está e para onde pode evoluir
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Função Atual
                </p>
                <p className="text-base font-semibold text-gray-900">Desenvolvedor Frontend</p>
              </div>

              <div className="p-4 bg-[var(--brand-50)] rounded-lg">
                <p className="text-xs font-medium text-[var(--brand-600)] uppercase tracking-wider mb-1">
                  Próxima Função
                </p>
                <p className="text-base font-semibold text-[var(--brand-900)]">Desenvolvedor Frontend Sênior</p>
              </div>
            </div>

            <div className="mb-5">
              <p className="text-sm font-medium text-gray-700 mb-3">Habilidades em desenvolvimento:</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700">
                  Arquitetura de software
                </span>
                <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700">
                  Mentoria técnica
                </span>
                <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700">
                  Liderança de projetos
                </span>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-900">
                Continue desenvolvendo suas habilidades e participando das avaliações. A trilha completa de carreira será disponibilizada em breve.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}