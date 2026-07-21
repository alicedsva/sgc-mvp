import { ArrowLeft, Award, BarChart2, CheckCircle2, Info } from 'lucide-react';
import { habilidadesData, getCorFromPeso, getPesoFromNome } from '../data/mockData';
import { useAvaliacoes } from '../context/AvaliacoesContext';
import { JOAO_ID } from '../pages/minhaCarreiraShared';

interface ResultadoAvaliacaoProps {
  avaliacaoId: string;
  onVoltar: () => void;
}

function media(pesos: number[]): number {
  if (pesos.length === 0) return 0;
  return Math.round((pesos.reduce((a, b) => a + b, 0) / pesos.length) * 10) / 10;
}

export function ResultadoAvaliacao({ avaliacaoId, onVoltar }: ResultadoAvaliacaoProps) {
  const { avaliacoes } = useAvaliacoes();
  const avaliacao = avaliacoes.find(a => a.id === avaliacaoId)!;
  const participante = avaliacao.participantes.find(p => p.colaboradorId === JOAO_ID)!;

  // Respostas reais do participante desta avaliação específica — nunca dado
  // de exemplo fixo. Cada resposta cruzada com habilidadesData para saber a
  // competência (por id, nunca por nome de string).
  const respostasComHabilidade = participante.respostas
    .map(r => {
      const habilidade = habilidadesData.find(h => h.id === r.habilidadeId);
      return habilidade ? { resposta: r, habilidade } : null;
    })
    .filter((x): x is { resposta: typeof participante.respostas[number]; habilidade: (typeof habilidadesData)[number] } => x != null);

  const mediaGeral = media(respostasComHabilidade.map(x => getPesoFromNome(x.resposta.nivelRespondido)));

  const competenciasMap = new Map<string, { id: string; nome: string; itens: typeof respostasComHabilidade }>();
  respostasComHabilidade.forEach(item => {
    const compId = item.habilidade.competenciaId;
    if (!competenciasMap.has(compId)) {
      competenciasMap.set(compId, { id: compId, nome: item.habilidade.competencia, itens: [] });
    }
    competenciasMap.get(compId)!.itens.push(item);
  });
  const competencias = Array.from(competenciasMap.values()).map(comp => ({
    ...comp,
    media: media(comp.itens.map(x => getPesoFromNome(x.resposta.nivelRespondido))),
  }));

  // Distribuição por nível respondido — só os níveis que de fato aparecem,
  // pra não misturar as duas escalas do sistema (Básico/Avançado vs
  // Iniciante/Aprendiz) com barras zeradas sem sentido.
  const distribuicaoMap = new Map<string, number>();
  respostasComHabilidade.forEach(x => {
    distribuicaoMap.set(x.resposta.nivelRespondido, (distribuicaoMap.get(x.resposta.nivelRespondido) ?? 0) + 1);
  });
  const distribuicao = Array.from(distribuicaoMap.entries())
    .map(([nivel, quantidade]) => ({ nivel, quantidade, peso: getPesoFromNome(nivel) }))
    .sort((a, b) => a.peso - b.peso);

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
        <p className="text-sm text-gray-600 mt-1">{avaliacao.nome}</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">Nível médio geral</span>
            <Award className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{mediaGeral}</p>
          <p className="text-xs text-gray-400 mt-1">escala de 1 a 5</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">Habilidades avaliadas</span>
            <CheckCircle2 className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{respostasComHabilidade.length}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">Competências avaliadas</span>
            <BarChart2 className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{competencias.length}</p>
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
          {distribuicao.map((item) => (
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

        {competencias.map((competencia) => (
          <div key={competencia.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header da competência */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">{competencia.nome}</h3>
                  <p className="text-sm text-gray-500">{competencia.itens.length} habilidades</p>
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
              {competencia.itens.map(({ habilidade, resposta }) => (
                <div key={habilidade.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-900">{habilidade.nome}</span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: getCorFromPeso(getPesoFromNome(resposta.nivelRespondido)) }}
                  >
                    {resposta.nivelRespondido}
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
