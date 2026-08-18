import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, AlertCircle, CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { habilidadesData, joaoHabilidadesCargoMatriz, getPesoFromNome } from '../data/mockData';
import { useAvaliacoes } from '../context/AvaliacoesContext';
import { JOAO_ID, getStatus } from '../pages/minhaCarreiraShared';
import { getNiveisHabilidade, formatData } from '../utils/avaliacoes';
import { Accordion, AccordionItem } from './ui/Accordion';
import { NivelRegua } from './ui/NivelRegua';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

function media(pesos: number[]): number {
  if (pesos.length === 0) return 0;
  return Math.round((pesos.reduce((a, b) => a + b, 0) / pesos.length) * 10) / 10;
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

  const [abertas, setAbertas] = useState<Set<string>>(new Set());
  const toggleAberta = (id: string) => {
    setAbertas(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

  // Data da resposta mais recente entre as respostas desta avaliação — string
  // ISO 'YYYY-MM-DD' ordena corretamente por comparação lexicográfica.
  const dataRespondida = respostasComHabilidade.length > 0
    ? respostasComHabilidade.reduce((max, { resposta }) => (resposta.dataResposta > max ? resposta.dataResposta : max), respostasComHabilidade[0].resposta.dataResposta)
    : null;

  // Nível esperado do cargo ATUAL de João, por habilidade — mesma matriz
  // usada em Minha Carreira/Meu Perfil (joaoHabilidadesCargoMatriz), nunca
  // recriada aqui. Habilidades desta avaliação sem entrada na matriz não têm
  // "esperado" para comparar (caso "sem referência").
  const matrizEsperadoMap = new Map(joaoHabilidadesCargoMatriz.map(m => [m.habilidadeId, m.nivelEsperado]));

  // Status por habilidade — reusa getStatus (nivelRespondido desta avaliação
  // vs nivelEsperado da matriz), nunca enriquecerMatriz (que resolveria
  // nivelAtual pelo histórico entre avaliações, não o que interessa aqui).
  // Habilidades sem referência na matriz ficam com status null — contam
  // apenas no total de "avaliadas", nunca em "no esperado ou acima"/"abaixo".
  const itensComStatus = respostasComHabilidade.map(item => {
    const nivelEsperado = matrizEsperadoMap.get(item.resposta.habilidadeId) ?? null;
    const status = nivelEsperado != null ? getStatus(item.resposta.nivelRespondido, nivelEsperado) : null;
    return { ...item, nivelEsperado, status };
  });

  const totalAvaliadas = itensComStatus.length;
  const noOuAcima = itensComStatus.filter(i => i.status === 'no' || i.status === 'acima').length;
  const abaixoDoEsperado = itensComStatus.filter(i => i.status === 'abaixo').length;

  const competenciasMap = new Map<string, { id: string; nome: string; itens: typeof itensComStatus }>();
  itensComStatus.forEach(item => {
    const compId = item.habilidade.competenciaId;
    if (!competenciasMap.has(compId)) {
      competenciasMap.set(compId, { id: compId, nome: item.habilidade.competencia, itens: [] });
    }
    competenciasMap.get(compId)!.itens.push(item);
  });
  // Contagens por status reusam o mesmo campo `status` já calculado em
  // itensComStatus/getStatus (o mesmo usado pela régua) — nunca recalculadas
  // do zero aqui. Habilidades sem referência de cargo (status null) não
  // entram em nenhuma das 3 contagens.
  const competencias = Array.from(competenciasMap.values()).map(comp => ({
    ...comp,
    media: media(comp.itens.map(x => getPesoFromNome(x.resposta.nivelRespondido))),
    abaixoDoEsperado: comp.itens.filter(i => i.status === 'abaixo').length,
    noEsperado: comp.itens.filter(i => i.status === 'no').length,
    acimaDoEsperado: comp.itens.filter(i => i.status === 'acima').length,
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
        <h1 className="text-2xl font-semibold text-gray-900">{avaliacao.nome}</h1>
        {dataRespondida && (
          <p className="text-sm text-gray-600 mt-1">
            Avaliação respondida em {formatData(dataRespondida)}
          </p>
        )}
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">Habilidades avaliadas</span>
            <CheckCircle2 className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalAvaliadas}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">No esperado ou acima</span>
            <div className="p-2 rounded-lg bg-green-100 flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-green-800" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{noOuAcima}</p>
        </div>

        {/* Wrapper colorido de ícone — exceção documentada em
            04-regras-negocio.md/02-design-system.md para cards de métrica do
            Colaborador (ColaboradorView.tsx), reaproveitada aqui: âmbar =
            gap real contra o cargo atual. */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold text-gray-700">Abaixo do esperado</span>
            <div className="p-2 rounded-lg bg-amber-100 flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{abaixoDoEsperado}</p>
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
        <h2 className="text-lg font-semibold text-gray-900">Resultados da avaliação</h2>

        <Accordion>
          {competencias.map(competencia => (
            <AccordionItem
              key={competencia.id}
              id={competencia.id}
              isOpen={abertas.has(competencia.id)}
              onToggle={toggleAberta}
              trigger={
                <div className="flex items-center justify-between w-full pr-2 text-left">
                  <div>
                    <h3 className="text-sm md:text-base font-medium text-gray-900">{competencia.nome}</h3>
                    <p className="text-xs md:text-sm text-gray-500">{competencia.itens.length} habilidades</p>
                  </div>
                  <p className="text-xs text-gray-500 whitespace-nowrap ml-4">
                    Abaixo do esperado ({competencia.abaixoDoEsperado}) · Esperado ({competencia.noEsperado}) · Acima do esperado ({competencia.acimaDoEsperado})
                  </p>
                </div>
              }
              content={
                <div className="p-4 md:p-5 bg-white divide-y divide-gray-100">
                  {competencia.itens.map(({ habilidade, resposta, nivelEsperado, status }) => {
                    const niveisAplicaveis = getNiveisHabilidade(habilidade).map(n => ({ nome: n.nome, peso: n.peso, criterio: n.criterio }));
                    const nivelVoce = resposta.nivelRespondido === 'nao_sei' ? null : resposta.nivelRespondido;
                    return (
                      <div key={habilidade.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                          <span className="text-sm font-medium text-gray-900">{habilidade.nome}</span>
                          {nivelEsperado == null && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              Sem referência para seu cargo
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  Esta habilidade foi avaliada, mas não faz parte da matriz de habilidades esperadas para o seu cargo atual. Por isso, não há um nível esperado para comparação.
                                </TooltipContent>
                              </Tooltip>
                            </span>
                          )}
                          {resposta.nivelRespondido === 'nao_sei' && (
                            <span className="inline-flex px-1.5 py-0.5 rounded text-xs font-semibold whitespace-nowrap bg-gray-100 text-gray-600">
                              Sem conhecimento
                            </span>
                          )}
                        </div>
                        <div className="mt-3">
                          <NivelRegua
                            niveis={niveisAplicaveis}
                            nivelVoce={nivelVoce}
                            nivelEsperado={nivelEsperado}
                            status={status}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              }
            />
          ))}
        </Accordion>
      </div>
    </div>
  );
}
