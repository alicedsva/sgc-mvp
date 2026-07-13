import { useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { BookOpen, CheckCircle2, ChevronRight, ClipboardList, Info, Layers, Sparkles, TrendingDown, Users } from 'lucide-react';
import { cargosData, historicoCargosJoaoData } from '../../data/mockData';
import {
  JOAO_CARGO_ATUAL,
  HabilidadeEnriquecida,
  matrizParaCargo,
  enriquecerMatriz,
  AderenciaRing,
} from './joaoCarreiraShared';

type OutletContext = { isSidebarCollapsed: boolean; viewMode: 'admin' | 'colaborador' };

// Minha Trajetória — retrospecto (não jornada prospectiva): mostra só os
// cargos já ocupados por João, do primeiro ao atual. Sem cargos futuros, sem
// aderência calculada — decisão de produto, ver detalhes no dot timeline do
// componente.
const MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
function formatarMesAno(data: string): string {
  const [ano, mes] = data.split('-');
  return `${MESES_ABREV[Number(mes) - 1]} ${ano}`;
}

// Aderência por tipo (Técnica/Comportamental) para o gauge "Aderência ao
// cargo": habilidade não avaliada é EXCLUÍDA do cálculo (nunca conta como
// gap), seguindo a regra geral já documentada em 04-regras-negocio.md
// ("Habilidades não avaliadas: excluídas da média — nunca contadas como
// zero").
function calcularAderenciaPorTipo(lista: HabilidadeEnriquecida[], tipo: string): number {
  const avaliadas = lista.filter(h => h.tipo === tipo && h.status !== 'sem');
  if (avaliadas.length === 0) return 0;
  const atendidas = avaliadas.filter(h => h.status === 'acima' || h.status === 'no').length;
  return Math.round((atendidas / avaliadas.length) * 100);
}

export default function TesteCarreiraPage() {
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();
  const navigate = useNavigate();

  // Retrospecto de "Minha Trajetória" — nome do cargo é sempre lido de
  // cargosData (cargoRM) quando existe cargoId, nunca duplicado em
  // historicoCargosJoaoData, para não divergir se o nome do cargo mudar.
  const historicoCargos = useMemo(() => {
    return historicoCargosJoaoData.map(item => ({
      ...item,
      nome: item.cargoId
        ? (cargosData.find(c => c.id === item.cargoId)?.cargoRM ?? item.cargoNome ?? 'Cargo')
        : (item.cargoNome ?? 'Cargo'),
    }));
  }, []);

  // Habilidades do CARGO ATUAL (c2), independente do cargo selecionado em
  // "Análise por cargo" — usadas só pelo gauge "Aderência ao cargo".
  const habilidadesCargoAtualGauge = useMemo(
    () => enriquecerMatriz(matrizParaCargo(JOAO_CARGO_ATUAL)),
    []
  );
  const aderenciaTecnica = useMemo(
    () => calcularAderenciaPorTipo(habilidadesCargoAtualGauge, 'Técnica'),
    [habilidadesCargoAtualGauge]
  );
  const aderenciaComportamental = useMemo(
    () => calcularAderenciaPorTipo(habilidadesCargoAtualGauge, 'Comportamental'),
    [habilidadesCargoAtualGauge]
  );
  // Valor central do gauge: média simples das duas aderências (não
  // ponderada pelo número de habilidades de cada tipo — decisão explícita
  // do pedido, "média simples").
  const aderenciaMedia = Math.round((aderenciaTecnica + aderenciaComportamental) / 2);
  const cargoAtualNome = cargosData.find(c => c.id === JOAO_CARGO_ATUAL)?.cargoRM ?? 'Cargo atual';

  // Mapeamento de competências — ETAPA 1 (título + cards de métrica). Escopo
  // sempre o cargo ATUAL de João (c2), reaproveitando habilidadesCargoAtualGauge
  // (mesma fonte já usada pelo gauge "Aderência ao cargo" acima) — evita
  // duplicar o cálculo de matrizParaCargo/enriquecerMatriz para o mesmo cargo.
  // Partição completa por status: noOuAcima + abaixo + naoAvaliadas === totalHabilidades.
  const mapeamentoStats = useMemo(() => {
    const totalHabilidades = habilidadesCargoAtualGauge.length;
    const totalCompetencias = new Set(habilidadesCargoAtualGauge.map(h => h.competenciaId)).size;
    const noOuAcima = habilidadesCargoAtualGauge.filter(h => h.status === 'no' || h.status === 'acima').length;
    const abaixo = habilidadesCargoAtualGauge.filter(h => h.status === 'abaixo').length;
    const naoAvaliadas = habilidadesCargoAtualGauge.filter(h => h.status === 'sem').length;
    return { totalCompetencias, totalHabilidades, noOuAcima, abaixo, naoAvaliadas };
  }, [habilidadesCargoAtualGauge]);

  // Mapeamento de competências — ETAPA 2 (grid de cards por competência).
  // Cálculo POR COMPETÊNCIA segue a regra geral do Dashboard (habilidade não
  // avaliada EXCLUÍDA do numerador e do denominador) — igual a
  // calcularAderenciaPorTipo acima, mas agrupado por competência em vez de
  // por tipo. Competências sem NENHUMA habilidade avaliada (Y=0) ficam de
  // fora do grid até a 1ª autoavaliação — decisão confirmada com Alice, não
  // exibir card com "Sem avaliações"/divisão por zero nesta etapa.
  const competenciasAderencia = useMemo(() => {
    const grupos = new Map<string, { competenciaId: string; nome: string; habilidades: HabilidadeEnriquecida[] }>();
    habilidadesCargoAtualGauge.forEach(h => {
      if (!grupos.has(h.competenciaId)) {
        grupos.set(h.competenciaId, { competenciaId: h.competenciaId, nome: h.competenciaNome, habilidades: [] });
      }
      grupos.get(h.competenciaId)!.habilidades.push(h);
    });
    return Array.from(grupos.values())
      .filter(g => g.habilidades.some(h => h.status !== 'sem'))
      .map(g => {
        const avaliadas = g.habilidades.filter(h => h.status !== 'sem');
        const atendidas = avaliadas.filter(h => h.status === 'no' || h.status === 'acima').length;
        return {
          competenciaId: g.competenciaId,
          nome: g.nome,
          y: avaliadas.length,
          x: atendidas,
          percentual: Math.round((atendidas / avaliadas.length) * 100),
        };
      })
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }, [habilidadesCargoAtualGauge]);

  // Oportunidades de desenvolvimento — sempre no escopo do cargo ATUAL de
  // João (filtro de cargo/tipo removido junto com "Cobertura por Competência").
  const oportunidades = useMemo(() => {
    return habilidadesCargoAtualGauge
      .filter(h => h.status === 'abaixo')
      .map(h => ({ ...h, gap: h.pesoEsperado - (h.pesoAtual ?? 0) }))
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 8);
  }, [habilidadesCargoAtualGauge]);

  // Habilidades do cargo atual ainda sem resposta — usado para diferenciar
  // "atingiu tudo" de "ainda falta responder" no estado vazio de
  // Oportunidades. Caso B (falta responder) tem prioridade sobre o Caso A
  // mesmo que zero gaps tenham sido encontrados entre as habilidades já
  // avaliadas.
  const pendentesAvaliar = useMemo(() => {
    return habilidadesCargoAtualGauge.filter(h => h.status === 'sem').length;
  }, [habilidadesCargoAtualGauge]);

  return (
    <main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
      <div className="p-4 md:p-8 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Minha Carreira</h1>
          <p className="text-sm text-gray-600 mt-1">
            Acompanhe sua jornada de cargos e as competências que precisa desenvolver para evoluir
          </p>
        </div>

        {/* Minha Trajetória — retrospecto: só cargos já ocupados, do primeiro
            ao atual. Sem cargos futuros, sem aderência, sem disclaimer de
            promoção (isso agora vive só em "Análise por cargo"). Timeline em
            linha reta (substituiu a versão em cards — objetivo: reduzir
            drasticamente o espaço vertical). LIÇÃO REAFIRMADA (já causou
            bug 2x nesta tela): NÃO desenhar a linha como um segmento por
            par de cargos — múltiplos elementos de linha lado a lado
            podem gerar costura/gap visível em certos zooms/larguras.
            Aqui a linha é UM ÚNICO elemento absoluto (mais o trecho de
            degradê, também único) atrás de TODOS os pontos (z-index
            menor); os pontos (z-index maior) ficam por cima, cobrindo a
            linha exatamente onde precisam. Cargo = coluna de largura fixa
            (COL_WIDTH); ponto sempre na borda ESQUERDA da coluna (posição
            x = index × COL_WIDTH), nome/data alinhados à esquerda da MESMA
            coluna — não centralizados. A linha sólida cobre do centro do
            1º ponto (x=0) até o centro do último ponto (x = ultimoIndex ×
            COL_WIDTH); dali em diante, uma coluna extra de degradê até
            transparente. Cor única (brand-600) na linha E nos pontos dos
            cargos passados — mesmo token, sem variação. O cargo ATUAL não
            tem ponto: em vez de círculo, o badge "Atual" fica posicionado
            (absolute, mesma coordenada x que um ponto teria) diretamente
            sobre a linha, com a linha passando por trás (z-index menor
            que o badge). O nome do cargo atual não carrega mais o badge
            ao lado — ele migrou para cima da linha. Wrapper com
            overflow-x-auto scrollbar-thin: a timeline ocupa só a largura
            que precisa (alinhada à esquerda) e ganha scroll horizontal
            quando não couber. */}
        <div className="border border-gray-200 rounded-lg p-5 flex flex-col gap-5 bg-gradient-to-tr from-white via-white via-55% to-[var(--brand-50)]">
          <h2 className="text-lg font-semibold text-gray-900">Evolução profissional</h2>

          {(() => {
            const COL_WIDTH = 220; // px por coluna — espaço suficiente para nomes longos + badge "Atual"
            const DOT_RADIUS = 7; // w-3.5 (14px) / 2 — ponto fica na borda esquerda da coluna, seu CENTRO fica em index*COL_WIDTH + DOT_RADIUS
            const BADGE_WIDTH = 40; // largura fixa do badge "Atual" (em vez de auto) — precisa ser determinística para calcular a borda esquerda dele
            const ultimoIndex = historicoCargos.length - 1;
            const solidWidth = ultimoIndex * COL_WIDTH; // distância entre o centro do 1º e do último ponto
            const totalWidth = (historicoCargos.length + 1) * COL_WIDTH; // +1 coluna extra p/ degradê
            const badgeCenterX = DOT_RADIUS + solidWidth; // mesma coordenada x que o ponto do cargo atual teria
            // Nome/data do cargo atual devem começar na mesma posição x da borda ESQUERDA do
            // badge (mesma regra dos outros cargos: texto começa onde o marcador começa) — não
            // na borda esquerda da coluna, que ficaria por baixo do meio do badge (mais largo
            // que um ponto) e pareceria centralizado. atualTextShift = deslocamento necessário
            // para puxar o texto da coluna do cargo atual até a borda esquerda do badge.
            const atualTextShift = BADGE_WIDTH / 2 - DOT_RADIUS;

            return (
              <div className="overflow-x-auto scrollbar-thin">
                <div style={{ width: totalWidth }}>
                  <div className="flex">
                    {historicoCargos.map((item, index) => {
                      const isAtual = index === ultimoIndex;
                      return (
                        <div
                          key={`label-${item.cargoId ?? 'externo'}-${item.dataInicio}`}
                          className="pr-3 text-left overflow-hidden"
                          style={{ width: COL_WIDTH, marginLeft: isAtual ? -atualTextShift : undefined }}
                        >
                          <span className={`block text-sm truncate ${isAtual ? 'font-semibold text-[var(--brand-600)]' : 'font-normal text-gray-700'}`}>
                            {item.nome}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Trilho — linha única (absoluta, atrás) + pontos (flex por cima) +
                      badge "Atual" (absoluto, mesma posição x do último ponto) */}
                  <div className="relative h-6 mt-3">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-[var(--brand-600)]"
                      style={{ left: DOT_RADIUS, width: solidWidth }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-0.5"
                      style={{
                        left: badgeCenterX,
                        width: COL_WIDTH,
                        background: 'linear-gradient(to right, var(--brand-600), transparent)',
                      }}
                    />
                    <div className="relative z-10 flex h-full">
                      {historicoCargos.map((item, index) => {
                        const isAtual = index === ultimoIndex;
                        return (
                          <div key={`dot-${item.cargoId ?? 'externo'}-${item.dataInicio}`} className="flex items-center" style={{ width: COL_WIDTH }}>
                            {!isAtual && (
                              <div className="w-3.5 h-3.5 rounded-full border-2 border-[var(--brand-600)] bg-white flex-shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <span
                      className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 text-center py-0.5 text-[10px] font-semibold text-white rounded-full bg-[var(--brand-600)]"
                      style={{ left: badgeCenterX, width: BADGE_WIDTH }}
                    >
                      Atual
                    </span>
                  </div>

                  <div className="flex mt-3">
                    {historicoCargos.map((item, index) => {
                      const isAtual = index === ultimoIndex;
                      return (
                        <div
                          key={`date-${item.cargoId ?? 'externo'}-${item.dataInicio}`}
                          className="pr-3 text-left overflow-hidden"
                          style={{ width: COL_WIDTH, marginLeft: isAtual ? -atualTextShift : undefined }}
                        >
                          <span className={`text-xs truncate block ${isAtual ? 'font-medium text-[var(--brand-600)]' : 'text-gray-500'}`}>
                            {formatarMesAno(item.dataInicio)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Exceção documentada — mensagem de orientação sem card/fundo
              (nenhum dos 3 padrões de "Mensagens de orientação" do DS se
              aplica aqui; decisão de Alice, não replicar sem confirmar). */}
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-500">Esta é uma representação da sua jornada na Energisa até o momento atual.</p>
          </div>
        </div>

        {/* Segunda linha: gauge autoreferente + placeholder de comparação com
            colegas (gráfico a definir em um próximo prompt). */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Aderência ao cargo — gauge com recharts (RadialBarChart),
              mesma biblioteca já usada em TesteRadarPage.tsx. Estrutura
              CORRIGIDA: arco e texto central não overlapam mais — são dois
              filhos flex diretos (arco em cima, texto abaixo, gap-3 real
              entre eles), em vez do texto em position:absolute por cima do
              container do arco (causava sobreposição quando o arco crescia).
              Container do arco aumentado de 220x110 para 280x150 (círculo-
              base de 280x280 cortado pela metade via overflow-hidden), com
              innerRadius/outerRadius em PIXELS (não percentual — recharts
              resolve percentuais de forma ambígua, já causou bug de tamanho
              antes). Tipografia do texto central alinhada aos tokens
              documentados: percentual = "Valor" de Cards de métrica
              (text-3xl font-bold text-gray-900); label = mesmo padrão já
              usado em Header.tsx (text-xs font-medium text-gray-500
              uppercase tracking-wider), não um tamanho customizado do Figma.
              AUTOREFERENTE: não compara com colegas (cálculo separado — ver
              placeholder ao lado). Valor central = média simples entre
              aderenciaTecnica e aderenciaComportamental, cada uma calculada
              com calcularAderenciaPorTipo (habilidade não avaliada é EXCLUÍDA
              do cálculo — ver comentário na função). Cargo sempre o ATUAL de
              João (c2) — mesmo escopo fixo usado por "Mapeamento de
              competências" logo abaixo. */}
          <div className="border border-gray-200 rounded-lg p-4 md:p-5 flex flex-col gap-7 bg-white h-full">
            <h2 className="text-lg font-semibold text-gray-900">Aderência ao cargo</h2>

            <div className="relative w-[280px] h-[150px] overflow-hidden mx-auto">
              <div className="absolute top-0 left-0 w-[280px] h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius={110}
                    outerRadius={135}
                    data={[{ value: aderenciaMedia }]}
                    startAngle={180}
                    endAngle={0}
                  >
                    <defs>
                      <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--brand-500)" />
                        <stop offset="100%" stopColor="var(--brand-400)" />
                      </linearGradient>
                    </defs>
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar
                      dataKey="value"
                      cornerRadius={12}
                      fill="url(#gaugeGradient)"
                      background={{ fill: '#E5E7EB' }}
                      isAnimationActive={false}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              {/* Ancorado no fundo do MESMO container do arco (bottom:0 +
                  translate-x -50%), não centralizado no meio vertical —
                  cai no espaço vazio abaixo da curva, medido/ajustado
                  visualmente para não tocar o traço (ver relato). */}
              <div className="absolute left-1/2 bottom-0 -translate-x-1/2 flex flex-col items-center pb-1">
                <span className="text-3xl font-bold text-gray-900">{aderenciaMedia}%</span>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Média no cargo</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">{cargoAtualNome}</p>
              <p className="text-sm text-gray-500 mt-1">Média calculada entre suas habilidades técnicas e comportamentais</p>
            </div>

            <div className="flex items-center justify-center bg-gray-50 rounded-xl px-5 py-3.5 gap-6">
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-gray-500">Técnicas:</span>
                <span className="text-sm font-bold text-[var(--brand-600)]">{aderenciaTecnica}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-gray-500">Comportamentais:</span>
                <span className="text-sm font-bold text-[var(--brand-600)]">{aderenciaComportamental}%</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-500">Atingir a porcentagem máxima desta escala não garante mudança de cargo.</p>
            </div>
          </div>

          {/* Placeholder — comparação com colegas, gráfico a definir num
              próximo prompt. Sem dado real ainda, por isso não usa nenhum
              card padrão de conteúdo — deixa claro que é espaço reservado. */}
          <div className="border border-dashed border-gray-300 rounded-lg p-4 md:p-5 flex flex-col items-center justify-center gap-2 bg-gray-50 h-full min-h-[280px]">
            <Users className="w-8 h-8 text-gray-300" />
            <p className="text-sm font-medium text-gray-500 text-center">Comparação com colegas</p>
            <p className="text-xs text-gray-400 text-center">Gráfico a definir em um próximo ajuste</p>
          </div>
        </div>

        <div className="space-y-6">

          {/* Mapeamento de competências — ETAPA 1: título + cards de métrica.
              ETAPA 2: grid de cards de competência (logo abaixo). A página de
              detalhe de cada competência (substituindo o antigo master-detail
              "Cobertura por Competência") vem na Etapa 3 — "Ver detalhes" por
              enquanto é placeholder (ver comentário no botão). Sem filtro de
              cargo/tipo — escopo sempre o cargo ATUAL de João (c2), igual ao
              gauge "Aderência ao cargo" acima. */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Mapeamento de competências</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-semibold text-gray-700">Total de competências</span>
                  <Layers className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{mapeamentoStats.totalCompetencias}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-semibold text-gray-700">Total de habilidades</span>
                  <BookOpen className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{mapeamentoStats.totalHabilidades}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-semibold text-gray-700">No esperado ou acima</span>
                  <CheckCircle2 className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{mapeamentoStats.noOuAcima}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-semibold text-gray-700">Abaixo do esperado</span>
                  <TrendingDown className="w-5 h-5 text-[var(--brand-600)] flex-shrink-0" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{mapeamentoStats.abaixo}</p>
              </div>
            </div>
          </div>

          {/* Grid de cards de competência — reaproveita a base de card já
              usada em "Oportunidades de desenvolvimento" (bg-white border
              border-gray-200 rounded-lg p-4 md:p-5). Anel de percentual via
              RadialBarChart (mesma técnica do gauge "Aderência ao cargo":
              innerRadius/outerRadius em pixels, não percentual). Competências
              com Y=0 (nenhuma habilidade avaliada) ficam fora deste grid —
              decisão confirmada com Alice, ver comentário em
              competenciasAderencia. */}
          {/* Teste: 3 colunas em telas grandes (lg:grid-cols-3) em vez de 4 —
              pedido explícito para avaliar se cards mais largos melhoram o
              equilíbrio visual (título/anel/contador/link). Ver relato. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {competenciasAderencia.map(comp => (
              <div key={comp.competenciaId} className="bg-white border border-gray-200 rounded-lg p-4 md:p-5">
                {/* items-start no container + nome/status agrupados num
                    flex-col próprio (não soltos como irmãos do anel): o
                    anel é mais alto (64px) que a linha do nome sozinha, e
                    quando o gap-nome-status era um irmão solto no mesmo
                    nível, a margem contava a partir do fundo da LINHA
                    inteira (esticada pela altura do anel), não do fundo do
                    texto — resultava num gap visualmente maior que 8px.
                    Agrupando nome+status juntos, o gap-2 entre eles fica
                    exatamente 8px, e o anel (irmão do grupo, não do nome)
                    alinha ao topo do bloco de texto via items-start. */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-2 min-w-0">
                    <p className="text-base font-bold text-gray-900">{comp.nome}</p>
                    {/* Sem ícone — só o texto colorido (verde/âmbar/vermelho
                        conforme a faixa) sinaliza o status. */}
                    <span className="text-xs md:text-sm text-gray-600">{comp.x} de {comp.y} no esperado</span>
                  </div>
                  <AderenciaRing percentual={comp.percentual} size={64} textClassName="text-xs font-bold text-gray-900" />
                </div>

                <div className="border-t border-gray-200 mt-5 pt-5">
                  <button
                    type="button"
                    onClick={() => navigate(`/testes/carreira/competencia/${comp.competenciaId}`)}
                    className="inline-flex items-center gap-0.5 text-xs md:text-sm font-medium text-[var(--brand-600)]"
                  >
                    Ver detalhes
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        {/* Oportunidades de desenvolvimento */}
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--brand-600)]" />
            <h3 className="text-base font-semibold text-gray-900">Oportunidades de desenvolvimento</h3>
          </div>
          <p className="text-xs md:text-sm text-gray-500 mt-1 mb-4">
            Top 8 habilidades com maior oportunidade de crescimento em {cargoAtualNome}
          </p>

          {oportunidades.length === 0 ? (
            pendentesAvaliar > 0 ? (
              // Caso B — tem prioridade sobre o Caso A: existe habilidade sem
              // resposta, então a ausência de gaps não significa "tudo certo".
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <ClipboardList className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Você ainda não respondeu todas as autoavaliações deste cargo.
                </p>
                <p className="text-sm text-gray-500">
                  Responda para ver suas oportunidades de desenvolvimento. Faltam {pendentesAvaliar} {pendentesAvaliar === 1 ? 'habilidade' : 'habilidades'} avaliar.
                </p>
              </div>
            ) : (
              // Caso A — todas as habilidades exigidas já foram avaliadas e
              // nenhuma ficou abaixo do esperado.
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <CheckCircle2 className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Você atingiu ou superou o nível esperado em todas as habilidades avaliadas para este cargo!
                </p>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {oportunidades.map(op => (
                <div key={op.habilidadeId} className="bg-white border border-gray-200 rounded-lg p-4 md:p-5">
                  <p className="text-sm font-medium text-gray-900">{op.nome}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{op.competenciaNome}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs md:text-sm text-gray-500">{op.nivelAtual}</span>
                    <span className="text-xs md:text-sm font-medium text-gray-900">{op.nivelEsperado}</span>
                  </div>
                  {/* Exceção: esta barra usa azul+cinza (progresso neutro), não
                      azul+âmbar+cinza (status), porque todo card aqui já é um gap
                      por definição — o contexto já comunica o "abaixo do esperado",
                      então a barra só mostra a distância até a meta. Decisão de
                      Alice, não replicar essa simplificação em outros componentes
                      sem confirmar. */}
                  <div className="mt-2 h-1.5 w-full rounded-full bg-gray-300 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--brand-600)]"
                      style={{ width: `${Math.round(((op.pesoAtual ?? 0) / op.pesoEsperado) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        </div>

      </div>
    </main>
  );
}
