import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, AlertCircle, BarChart2, CheckCircle2, Info } from 'lucide-react';
import { habilidadesData, joaoHabilidadesCargoMatriz, getCorFromPeso, getPesoFromNome } from '../data/mockData';
import { useAvaliacoes } from '../context/AvaliacoesContext';
import { JOAO_ID, getStatus } from '../pages/minhaCarreiraShared';

function media(pesos: number[]): number {
  if (pesos.length === 0) return 0;
  return Math.round((pesos.reduce((a, b) => a + b, 0) / pesos.length) * 10) / 10;
}

// Rótulo amigável para o sentinela 'nao_sei' — nunca exibir o valor cru do
// campo. Nomes de nível reais passam direto.
function labelNivelResposta(nivel: string): string {
  return nivel === 'nao_sei' ? 'Sem conhecimento' : nivel;
}

export function ResultadoAvaliacao() {
  const { avaliacaoId } = useParams<{ avaliacaoId: string }>();
  const navigate = useNavigate();
  const onVoltar = () => navigate('/minhas-avaliacoes');
  const { avaliacoes } = useAvaliacoes();
  // Sem "!" — avaliacaoId inválido na URL ou colaborador fora dos
  // participantes não pode quebrar a tela (ver estado vazio abaixo).
  const avaliacao = avaliacoes.find(a => a.id === avaliacaoId);
  const participante = avaliacao?.participantes.find(p => p.colaboradorId === JOAO_ID);

  // Estado vazio — mesmo padrão visual já usado em
  // AvaliacaoDetalhePage.tsx/CarreiraDetalhePage.tsx/CompetenciaDetalhePage.tsx
  // para "não encontrado", reaproveitado aqui em vez de criar um novo.
  if (!avaliacao || !participante) {
    return (
      <div className="max-w-2xl mx-auto mt-16">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {!avaliacao ? 'Avaliação não encontrada' : 'Você não tem acesso a esta avaliação'}
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {!avaliacao
              ? 'Esta avaliação não existe ou foi removida.'
              : 'Você não está entre os participantes desta avaliação.'}
          </p>
          <button
            onClick={onVoltar}
            className="px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors"
          >
            Voltar para Minhas Avaliações
          </button>
        </div>
      </div>
    );
  }

  // Respostas reais do participante desta avaliação específica — nunca dado
  // de exemplo fixo. Cada resposta cruzada com habilidadesData para saber a
  // competência (por id, nunca por nome de string).
  const respostasComHabilidade = participante.respostas
    .map(r => {
      const habilidade = habilidadesData.find(h => h.id === r.habilidadeId);
      return habilidade ? { resposta: r, habilidade } : null;
    })
    .filter((x): x is { resposta: typeof participante.respostas[number]; habilidade: (typeof habilidadesData)[number] } => x != null);

  // Nível esperado do cargo ATUAL de João, por habilidade — mesma matriz
  // usada em Minha Carreira/Meu Perfil (joaoHabilidadesCargoMatriz), nunca
  // recriada aqui. Habilidades desta avaliação sem entrada na matriz não têm
  // "esperado" para comparar (caso "sem referência").
  const matrizEsperadoMap = new Map(joaoHabilidadesCargoMatriz.map(m => [m.habilidadeId, m.nivelEsperado]));

  // Contagem de gap — reusa getStatus (nivelRespondido desta avaliação vs
  // nivelEsperado da matriz), nunca enriquecerMatriz (que resolveria
  // nivelAtual pelo histórico entre avaliações, não o que interessa aqui).
  // Habilidades sem referência na matriz são excluídas do numerador, mesmo
  // princípio de excluir "sem dado" já usado em calcularAderenciaPorTipo.
  const habilidadesAbaixoDoEsperado = respostasComHabilidade.filter(({ resposta }) => {
    const nivelEsperado = matrizEsperadoMap.get(resposta.habilidadeId);
    return nivelEsperado != null && getStatus(resposta.nivelRespondido, nivelEsperado) === 'abaixo';
  }).length;

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

  return (
    <div className="space-y-6">
      {/* Header com botão voltar */}
      <div>
        <button
          onClick={onVoltar}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
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

        {/* Wrapper colorido de ícone — exceção documentada em
            04-regras-negocio.md/02-design-system.md para cards de métrica do
            Colaborador (ColaboradorView.tsx), reaproveitada aqui: âmbar =
            gap real contra o cargo atual. */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">Habilidades abaixo do esperado</span>
            <div className="p-2 rounded-lg bg-amber-100 flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{habilidadesAbaixoDoEsperado}</p>
        </div>
      </div>

      {/* Banner de contexto */}
      <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-700">
          Use estes resultados como ponto de partida para uma conversa com seu gestor sobre seu desenvolvimento. Os dados refletem sua autopercepção neste momento.
        </p>
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
              {competencia.itens.map(({ habilidade, resposta }) => {
                const nivelEsperado = matrizEsperadoMap.get(habilidade.id);
                const status = nivelEsperado != null ? getStatus(resposta.nivelRespondido, nivelEsperado) : null;
                return (
                  <div key={habilidade.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-900">{habilidade.nome}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {nivelEsperado != null ? (
                        <span className={`text-xs font-medium ${status === 'abaixo' ? 'text-amber-600' : 'text-[var(--brand-600)]'}`}>
                          Esperado: {nivelEsperado}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Sem referência para seu cargo atual</span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          resposta.nivelRespondido === 'nao_sei' ? 'bg-gray-100 text-gray-600' : 'text-white'
                        }`}
                        style={resposta.nivelRespondido === 'nao_sei' ? {} : { backgroundColor: getCorFromPeso(getPesoFromNome(resposta.nivelRespondido)) }}
                      >
                        {labelNivelResposta(resposta.nivelRespondido)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
