import { ArrowLeft, Award, BarChart2, CheckCircle2, Info } from 'lucide-react';
import { getCorFromPeso, niveisDefaultData } from '../data/mockData';

function getPesoFromNome(nome: string): number {
  const nivel = niveisDefaultData.find(n => n.nome === nome);
  return nivel?.peso ?? 0;
}

interface ResultadoAvaliacaoProps {
  avaliacao: any;
  onVoltar: () => void;
}

// Dados mockados do resultado detalhado
const resultadoDetalhado = {
  competencias: [
    {
      id: '1',
      nome: 'Desenvolvimento Frontend',
      habilidades: [
        { nome: 'React', nivel: 'Avançado', cor: '#3B82F6' },
        { nome: 'TypeScript', nivel: 'Avançado', cor: '#3B82F6' },
        { nome: 'Figma', nivel: 'Intermediário', cor: '#60A5FA' },
      ],
      media: 3.3,
    },
    {
      id: '2',
      nome: 'Desenvolvimento Backend',
      habilidades: [
        { nome: 'Node.js', nivel: 'Avançado', cor: '#3B82F6' },
        { nome: 'PostgreSQL', nivel: 'Intermediário', cor: '#60A5FA' },
        { nome: 'Python', nivel: 'Especialista', cor: '#6366F1' },
      ],
      media: 3.7,
    },
  ],
};

export function ResultadoAvaliacao({ avaliacao, onVoltar }: ResultadoAvaliacaoProps) {
  return (
    <div className="space-y-6">
      {/* Header com botão voltar */}
      <div>
        <button
          onClick={onVoltar}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Minhas Avaliações
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Resultado da Avaliação</h1>
        <p className="text-sm text-gray-600 mt-1">{avaliacao.titulo}</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">Nível médio geral</span>
            <Award className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{avaliacao.resultado?.media}</p>
          <p className="text-xs text-gray-400 mt-1">escala de 1 a 5</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">Habilidades avaliadas</span>
            <CheckCircle2 className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{avaliacao.habilidades}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">Competências avaliadas</span>
            <BarChart2 className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{avaliacao.competencias}</p>
        </div>
      </div>

      {/* Banner de contexto */}
      <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-700">
          Use estes resultados como ponto de partida para uma conversa com seu gestor sobre seu desenvolvimento. Os dados refletem sua autopercepção neste momento.
        </p>
      </div>

      {/* Distribuição de níveis */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Minha distribuição nesta avaliação</h2>
        <p className="text-sm text-gray-500 mb-4">Quantidade de habilidades avaliadas em cada nível</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {avaliacao.resultado?.distribuicao.map((item: any) => (
            <div key={item.nivel} className="text-center">
              <div className="text-2xl font-semibold text-gray-900 mb-1">{item.quantidade}</div>
              <div className="text-sm text-gray-600">{item.nivel}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Resultados por competência */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Resultados por Competência</h2>
        
        {resultadoDetalhado.competencias.map((competencia) => (
          <div key={competencia.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header da competência */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">{competencia.nome}</h3>
                  <p className="text-sm text-gray-500">{competencia.habilidades.length} habilidades</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-[var(--brand-600)]">{competencia.media}</div>
                  <div className="text-xs text-gray-500">Média da autoavaliação</div>
                  <div className="text-xs text-gray-400">escala de 1 a 5</div>
                </div>
              </div>
            </div>

            {/* Lista de habilidades */}
            <div className="p-5 space-y-3">
              {competencia.habilidades.map((habilidade, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-900">{habilidade.nome}</span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{
                      backgroundColor: getPesoFromNome(habilidade.nivel) > 0
                        ? getCorFromPeso(getPesoFromNome(habilidade.nivel))
                        : '#9CA3AF',
                    }}
                  >
                    {habilidade.nivel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
