import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router';
import {
  RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Cell, LabelList, Tooltip,
} from 'recharts';
import { CheckCircle2, ChevronRight, ClipboardList, Info, TrendingUp } from 'lucide-react';
import { cargosData, historicoCargosJoaoData, colaboradoresData, getPesoFromNome } from '../data/mockData';
import {
  JOAO_CARGO_ATUAL,
  MAX_PESO,
  MAPEAMENTO_COMPETENCIAS_SECTION_ID,
  HabilidadeEnriquecida,
  matrizParaCargo,
  enriquecerMatriz,
  calcularAderenciaPorTipo,
  AderenciaRing,
} from './minhaCarreiraShared';

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

type FiltroCompetencia = 'todas' | 'abaixo' | 'no-caminho';
type FiltroTipo = 'todas' | 'Técnica' | 'Comportamental';

// "Contexto na empresa" — 4 faixas de 25 pontos (0-25/25-50/50-75/75-100).
const FAIXAS_CONTEXTO = ['0-25%', '25-50%', '50-75%', '75-100%'];

// Gradiente por barra (topo mais claro → base mais escura), progressão
// brand-100→200 (faixa 1) até brand-400→500 (faixa 4) — faixa mais alta =
// mais escura, como na referência aprovada. TODAS as barras usam gradiente,
// inclusive a faixa de destaque ("Você"), que usa o gradiente mais forte
// (brand-500→600) em vez de um dos 4 abaixo — ver GRADIENTE_VOCE e Cell.
const GRADIENTES_FAIXA: [string, string][] = [
  ['var(--brand-100)', 'var(--brand-200)'],
  ['var(--brand-200)', 'var(--brand-300)'],
  ['var(--brand-300)', 'var(--brand-400)'],
  ['var(--brand-400)', 'var(--brand-500)'],
];
const GRADIENTE_VOCE: [string, string] = ['var(--brand-500)', 'var(--brand-600)'];

// Rótulo das faixas no eixo X — a faixa do próprio colaborador fica em
// destaque (brand-600, semibold), igual à referência aprovada.
function FaixaTick(props: { x?: number; y?: number; payload?: { value: string }; faixaAtualIndex: number }) {
  const { x = 0, y = 0, payload, faixaAtualIndex } = props;
  const index = FAIXAS_CONTEXTO.indexOf(payload?.value ?? '');
  const isVoce = index === faixaAtualIndex;
  return (
    <text
      x={x}
      y={y + 12}
      textAnchor="middle"
      fontSize={12}
      fontWeight={isVoce ? 600 : 400}
      fill={isVoce ? 'var(--brand-600)' : '#6B7280'}
    >
      {payload?.value}
    </text>
  );
}

// Balão fixo "Você" acima da barra da faixa onde o colaborador se encontra —
// SEMPRE visível, marcador estático (não é a interação de hover — ver
// ContextoTooltip abaixo). Sem percentual de aderência no rótulo (já aparece
// no gauge ao lado, seria redundante).
function VoceBubble(props: { x?: number; y?: number; width?: number; index?: number; faixaAtualIndex: number }) {
  const { x = 0, y = 0, width = 0, index, faixaAtualIndex } = props;
  if (index !== faixaAtualIndex) return null;
  const cx = x + width / 2;
  const boxWidth = 54;
  const boxHeight = 26;
  const boxY = y - boxHeight - 10;
  return (
    <g>
      <rect x={cx - boxWidth / 2} y={boxY} width={boxWidth} height={boxHeight} rx={13} fill="var(--brand-600)" />
      <polygon
        points={`${cx - 5},${boxY + boxHeight} ${cx + 5},${boxY + boxHeight} ${cx},${boxY + boxHeight + 6}`}
        fill="var(--brand-600)"
      />
      <text x={cx} y={boxY + boxHeight / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={600} fill="#ffffff">
        Você
      </text>
    </g>
  );
}

// Tooltip ao passar o mouse — QUALQUER uma das 4 barras, não só a de
// destaque. Usa o <Tooltip> nativo do recharts (mesmo padrão já usado em
// DashboardPage/Cobertura por competência): ele mesmo rastreia a posição do
// mouse sobre a área de plotagem inteira (inclusive os espaços entre
// barras) e posiciona a caixa perto do cursor via overlay HTML — por isso
// NÃO precisa de margin.top reservado no BarChart nem de handlers manuais de
// mouseenter/mouseleave por barra, ao contrário da tentativa anterior (balão
// com estado próprio, tooltip fixa acima, só na barra de destaque).
function ContextoTooltip({ active, payload }: {
  active?: boolean;
  payload?: { payload: { faixa: string; percentual: number } }[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const { faixa, percentual } = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2">
      <p className="text-xs font-semibold text-gray-900">{faixa}</p>
      <p className="text-xs text-gray-500 mt-0.5">{`${percentual}% dos colaboradores estão nesta faixa`}</p>
    </div>
  );
}

// Texto do chip abaixo da barra de nível — separado do resto do JSX pra
// poder validar isoladamente os 3 casos (abaixo/no/acima do esperado). Dentro
// da lista real de "Oportunidades de desenvolvimento" só o ramo gap>0 é
// alcançável (a lista já filtra status==='abaixo', gap sempre positivo por
// construção) — os outros dois ramos existem pela robustez pedida e foram
// validados fora da lista real (ver relato de verificação). A quantidade de
// níveis vem em negrito (pedido de Alice) só no ramo gap>0 — os outros dois
// ramos não têm número nenhum no texto.
export function textoChipNivel(gap: number) {
  if (gap > 0) {
    return (
      <>
        Você está a <span className="font-bold">{gap}</span> {gap === 1 ? 'nível' : 'níveis'} do esperado
      </>
    );
  }
  if (gap === 0) return 'Você atingiu o nível esperado';
  return 'Você está acima do esperado';
}

// Barra de progressão por NÍVEL (Você) dos cards de "Oportunidades de
// desenvolvimento" — BLOCOS SEGMENTADOS (1 bloco por nível da escala,
// MAX_PESO blocos ao todo). O rótulo/destaque "Alvo" (âmbar) foi removido a
// pedido — o bloco do nível esperado não tem mais cor sólida nem rótulo:
// fica cinza como os demais não alcançados, só com um CONTORNO TRACEJADO em
// azul da marca marcando a posição, sem chamar tanta atenção quanto antes.
// Blocos até "Você" (inclusive) ficam azuis sólidos (var(--brand-600)); os
// demais ficam cinza (gray-200). Sem colisão de rótulo pra resolver mais —
// só existe UM rótulo agora ("VOCÊ"), então não há mais empilhamento em 2
// linhas (isso só existia por causa do rótulo "Alvo" que foi removido).
// Posições SEMPRE por peso (÷ índice do bloco), nunca por nome — mesma regra
// de sempre (06-integridade-de-dados.md).
function OportunidadeBarraNivel({
  voceNivel,
  esperadoNivel,
}: {
  voceNivel: string;
  esperadoNivel: string;
}) {
  const pesoVoce = getPesoFromNome(voceNivel);
  const pesoEsperado = getPesoFromNome(esperadoNivel);
  const indices = Array.from({ length: MAX_PESO }, (_, i) => i + 1);

  return (
    <div>
      <div className="flex gap-1">
        {indices.map(i => (
          <div key={i} className="flex-1 flex justify-center">
            {i === pesoVoce && (
              <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--brand-600)] whitespace-nowrap">VOCÊ</span>
            )}
          </div>
        ))}
      </div>

      {/* Blocos — cada um com tooltip mostrando o NOME real do nível daquele
          bloco (Você / nível esperado), não o percentual. O bloco do nível
          esperado nunca leva preenchimento sólido — só o contorno tracejado. */}
      <div className="flex gap-1 mt-1">
        {indices.map(i => {
          const ehEsperado = i === pesoEsperado;
          const ehVoce = i === pesoVoce;
          const classeBloco = ehEsperado
            ? 'h-3 rounded-full bg-gray-200 border-2 border-dashed border-[var(--brand-600)]'
            : 'h-3 rounded-full';
          const corBloco = ehEsperado ? undefined : i <= pesoVoce ? 'var(--brand-600)' : '#E5E7EB';
          if (!ehVoce && !ehEsperado) {
            return <div key={i} className={`flex-1 ${classeBloco}`} style={{ backgroundColor: corBloco }} />;
          }
          return (
            <div key={i} className="group relative flex-1">
              <div className={classeBloco} style={{ backgroundColor: corBloco }} />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 bg-white border border-gray-200 rounded-lg shadow-lg px-2 py-1 whitespace-nowrap z-10">
                <span className="text-xs font-medium text-gray-900">{ehEsperado ? esperadoNivel : voceNivel}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MinhaCarreiraPage() {
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  const location = useLocation();

  // Ao voltar do detalhe de uma competência (CompetenciaDetalhePage),
  // o botão "voltar" passa state.scrollTarget para reabrir a página já
  // rolada até a seção "Mapeamento de competências" (em vez de subir para o
  // topo, pedido explícito — a seção fica no fim de uma página longa).
  // Entrada normal na página (sem state) não faz scroll nenhum — comportamento
  // padrão do navegador (topo) já é o esperado nesse caso.
  useEffect(() => {
    const target = (location.state as { scrollTarget?: string } | null)?.scrollTarget;
    if (!target) return;
    document.getElementById(target)?.scrollIntoView({ block: 'start' });
  }, [location.state]);

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

  // "Contexto na empresa" — aderência ao cargo de TODOS os colaboradores no
  // mesmo cargo atual de João (c2), agrupada em 4 faixas de 25 pontos. Reusa
  // a MESMA matriz do gauge acima (matrizParaCargo) e a mesma fórmula
  // (enriquecerMatriz + calcularAderenciaPorTipo), generalizada para aceitar
  // qualquer colaboradorId — garante que a faixa de destaque bata com
  // aderenciaMedia já exibida no gauge ao lado, calculada com os mesmos
  // dados/regra.
  const contagemPorFaixa = useMemo(() => {
    const matriz = matrizParaCargo(JOAO_CARGO_ATUAL);
    const contagem = [0, 0, 0, 0];
    colaboradoresData
      .filter(c => c.cargoId === JOAO_CARGO_ATUAL)
      .forEach(c => {
        const habilidades = enriquecerMatriz(matriz, c.id);
        const tecnica = calcularAderenciaPorTipo(habilidades, 'Técnica');
        const comportamental = calcularAderenciaPorTipo(habilidades, 'Comportamental');
        const media = Math.round((tecnica + comportamental) / 2);
        contagem[Math.min(Math.floor(media / 25), 3)] += 1;
      });
    return contagem;
  }, []);
  const faixaAtualIndex = Math.min(Math.floor(aderenciaMedia / 25), 3);
  // Percentual por faixa (dentre todos os colaboradores do cargo) — vai no
  // payload de cada barra para a tooltip de hover (ContextoTooltip) mostrar
  // o número certo não importa qual das 4 barras o mouse estiver sobre.
  // Calculado dinamicamente a partir de contagemPorFaixa, nunca fixo.
  const totalColaboradoresCargo = contagemPorFaixa.reduce((soma, n) => soma + n, 0);
  const dadosContextoEmpresa = FAIXAS_CONTEXTO.map((faixa, i) => ({
    faixa,
    quantidade: contagemPorFaixa[i],
    percentual: totalColaboradoresCargo === 0 ? 0 : Math.round((contagemPorFaixa[i] / totalColaboradoresCargo) * 100),
  }));

  // Mapeamento de competências — lista de competências com aderência.
  // Cálculo POR COMPETÊNCIA segue a regra geral do Dashboard (habilidade não
  // avaliada EXCLUÍDA do numerador e do denominador) — igual a
  // calcularAderenciaPorTipo acima, mas agrupado por competência em vez de
  // por tipo. Competências sem NENHUMA habilidade avaliada (Y=0) ficam de
  // fora da lista até a 1ª autoavaliação — decisão confirmada com Alice, não
  // exibir linha com "Sem avaliações"/divisão por zero nesta etapa.
  // `tipos` guarda os tipos de habilidade PRESENTES na competência (para o
  // filtro Técnicas/Comportamentais) — algumas competências têm habilidades
  // dos dois tipos (ex: Metodologias Ágeis), por isso é array, não valor
  // único. Decisão confirmada com Alice: o filtro de tipo só decide quais
  // linhas aparecem — x/y/percentual NUNCA são recalculados por tipo,
  // continuam somando TODAS as habilidades avaliadas da competência.
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
          tipos: Array.from(new Set(g.habilidades.map(h => h.tipo))),
        };
      })
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }, [habilidadesCargoAtualGauge]);

  // Filtro da LISTA de "Mapeamento de competências" — "Abaixo do esperado"
  // = competência com percentual < 100% (badge "Parcial"); "No caminho
  // certo" = percentual === 100% (badge "Completo"). Mesma partição usada
  // pela badge de cada linha, nunca recalculada separadamente. Pills sem
  // contador (só texto) — pedido explícito.
  const [filtroCompetencia, setFiltroCompetencia] = useState<FiltroCompetencia>('todas');

  // Filtro por tipo — mesmo padrão de segmented control já usado em
  // HabilidadesSelectionModal.tsx (Todas/Técnica/Comportamental). Uma
  // competência com habilidades dos dois tipos aparece nos dois filtros
  // (ver comentário em competenciasAderencia).
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>('todas');

  const totalCompetenciasAvaliadas = competenciasAderencia.length;

  const competenciasFiltradas = useMemo(() => {
    return competenciasAderencia.filter(c => {
      const passaStatus =
        filtroCompetencia === 'todas' ||
        (filtroCompetencia === 'abaixo' ? c.percentual < 100 : c.percentual === 100);
      const passaTipo = filtroTipo === 'todas' || c.tipos.includes(filtroTipo);
      return passaStatus && passaTipo;
    });
  }, [competenciasAderencia, filtroCompetencia, filtroTipo]);

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
      {/* space-y-10 — separação entre os GRUPOS de topo da página: Header,
          bloco "Jornada + gráficos" (Evolução profissional + Aderência ao
          cargo/Contexto na empresa, agrupados à parte com seu próprio
          space-y-6 — ver comentário mais abaixo), Oportunidades de
          desenvolvimento e Mapeamento de competências. Pedido explícito:
          jornada e gráficos devem ficar próximos entre si (como antes);
          só a distância ENTRE esses grupos maiores precisava de mais
          respiro. O space-y-6 interno de cada grupo (ex.: dentro do
          wrapper de Mapeamento de competências) continua o mesmo. */}
      <div className="p-4 md:p-8 space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Minha Carreira</h1>
          <p className="text-sm text-gray-600 mt-1">
            Acompanhe sua jornada de cargos e as competências que precisa desenvolver para evoluir
          </p>
        </div>

        {/* Jornada (Evolução profissional) + gráficos (Aderência ao cargo /
            Contexto na empresa) agrupados num único bloco com space-y-6 —
            ficam mais próximos entre si do que o space-y-10 usado entre as
            SEÇÕES da página (este bloco / Oportunidades / Mapeamento).
            Pedido explícito: só esse par deveria voltar a ficar próximo
            como antes, o resto do espaçamento entre seções já está certo
            e não deve ser alterado. */}
        <div className="space-y-6">

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
            cargos passados — mesmo token, sem variação. O cargo ATUAL
            também tem ponto, igual aos demais (mesmo tamanho/posição na
            borda esquerda da coluna) — a única diferença é o preenchimento:
            sólido (bg-brand-600) em vez de vazio (bg-white), representando
            a posição selecionada/atual. O badge "Atual" não fica mais sobre
            a linha — fica ao lado do nome do cargo, na linha de rótulos.
            Como o ponto do cargo atual agora tem o MESMO tamanho dos
            demais, nome/data não precisam de nenhum deslocamento especial
            de alinhamento (removido o antigo atualTextShift, que existia só
            por causa do badge largo sobre a linha). Wrapper com
            overflow-x-auto scrollbar-thin: a timeline ocupa só a largura
            que precisa (alinhada à esquerda) e ganha scroll horizontal
            quando não couber. */}
        <div className="border border-gray-200 rounded-lg p-5 flex flex-col gap-8 bg-gradient-to-tr from-white via-white via-55% to-[var(--brand-50)]">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Evolução profissional</h2>
            <p className="text-sm text-gray-500 mt-0.5">Representação da sua jornada na Energisa até o momento atual</p>
          </div>

          {(() => {
            const COL_WIDTH = 220; // px por coluna — espaço suficiente para nomes longos + badge "Atual" ao lado
            const DOT_RADIUS = 7; // w-3.5 (14px) / 2 — ponto fica na borda esquerda da coluna, seu CENTRO fica em index*COL_WIDTH + DOT_RADIUS
            const ultimoIndex = historicoCargos.length - 1;
            const solidWidth = ultimoIndex * COL_WIDTH; // distância entre o centro do 1º e do último ponto
            const totalWidth = (historicoCargos.length + 1) * COL_WIDTH; // +1 coluna extra p/ degradê
            const ultimoPontoX = DOT_RADIUS + solidWidth; // centro do ponto do cargo atual — início do trecho em degradê

            return (
              <div className="overflow-x-auto scrollbar-thin">
                <div style={{ width: totalWidth }}>
                  {/* Trilho — linha única (absoluta, atrás) + pontos (flex por
                      cima). Movido para ANTES do bloco nome+data (pedido
                      explícito: o nome do cargo desce, ficando posicionado
                      em cima do período, os dois logo abaixo do trilho — só
                      a POSIÇÃO mudou, cores/alinhamento continuam os
                      mesmos). */}
                  <div className="relative h-6">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-[var(--brand-600)]"
                      style={{ left: DOT_RADIUS, width: solidWidth }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-0.5"
                      style={{
                        left: ultimoPontoX,
                        width: COL_WIDTH,
                        background: 'linear-gradient(to right, var(--brand-600), transparent)',
                      }}
                    />
                    <div className="relative z-10 flex h-full">
                      {historicoCargos.map((item, index) => {
                        const isAtual = index === ultimoIndex;
                        return (
                          <div key={`dot-${item.cargoId ?? 'externo'}-${item.dataInicio}`} className="flex items-center" style={{ width: COL_WIDTH }}>
                            {/* Ponto do cargo atual: mesmo tamanho/posição dos demais,
                                mas preenchido (bg-brand-600) em vez de vazio (bg-white)
                                — representa a posição selecionada/atual. */}
                            <div
                              className={`w-3.5 h-3.5 rounded-full border-2 border-[var(--brand-600)] flex-shrink-0 ${isAtual ? 'bg-[var(--brand-600)]' : 'bg-white'}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Nome + data — agora um único bloco por coluna, logo
                      abaixo do trilho (nome em cima, data embaixo). Cargos
                      passados ganharam mais peso de fonte (font-normal →
                      font-semibold, pedido explícito) — cor continua
                      text-gray-500, sem alteração. */}
                  <div className="flex mt-3">
                    {historicoCargos.map((item, index) => {
                      const isAtual = index === ultimoIndex;
                      return (
                        <div
                          key={`label-${item.cargoId ?? 'externo'}-${item.dataInicio}`}
                          className="pr-3 text-left overflow-hidden"
                          style={{ width: COL_WIDTH }}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`text-sm truncate ${isAtual ? 'font-semibold text-[var(--brand-600)]' : 'font-semibold text-gray-500'}`}>
                              {item.nome}
                            </span>
                            {isAtual && (
                              <span className="flex-shrink-0 px-2 py-0.5 text-[10px] font-semibold text-white rounded-full bg-[var(--brand-600)]">
                                Atual
                              </span>
                            )}
                          </div>
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
          <div className="border border-gray-200 rounded-lg p-4 md:p-5 flex flex-col gap-5 bg-white h-full">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Aderência ao cargo</h2>
              <p className="text-sm text-gray-500 mt-0.5">Média calculada entre suas habilidades técnicas e comportamentais</p>
            </div>

            {/* Conjunto gauge + nome do cargo + pill técnicas/comportamentais
                centralizado verticalmente no espaço restante do card (entre
                o cabeçalho e o aviso slate no rodapé) — flex-1 +
                items-center justify-center. */}
            <div className="flex-1 flex flex-col items-center justify-center gap-5">
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

              <p className="text-lg font-semibold text-gray-900 text-center">{cargoAtualNome}</p>

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
            </div>

            {/* Container slate — mesmo padrão de "Instrução de formulário" do
                DS (bg-slate-100 border-slate-300, ícone Info text-slate-500,
                texto text-slate-700), sem o label "Instruções:" porque o
                texto aqui é um aviso, não um passo a passo. */}
            <div className="bg-slate-100 border border-slate-300 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700">Atingir a porcentagem máxima desta escala não garante mudança de cargo.</p>
            </div>
          </div>

          {/* Contexto na empresa — aderência ao cargo de João comparada à dos
              colegas no mesmo cargo (c2), agrupada em 4 faixas de 25 pontos.
              Mesma matriz/fórmula do gauge "Aderência ao cargo" ao lado (ver
              contagemPorFaixa acima) — a faixa em destaque sempre bate com
              aderenciaMedia. BarChart do recharts, mesmo padrão de biblioteca
              já usado no Dashboard (Cobertura por competência), inclusive o
              <Tooltip> nativo (hover funciona em qualquer uma das 4 barras,
              não só a de destaque — ver ContextoTooltip). Sem barSize/
              maxBarSize fixo: as barras ocupam proporcionalmente o espaço de
              cada categoria (controlado só por barCategoryGap), responsivo à
              largura do container. */}
          <div className="border border-gray-200 rounded-lg p-4 md:p-5 flex flex-col bg-white h-full">
            <h2 className="text-lg font-semibold text-gray-900">Contexto na empresa</h2>
            <p className="text-sm text-gray-500 mt-0.5">Como sua aderência se posiciona entre colaboradores do mesmo cargo</p>

            <div className="flex-1 min-h-[220px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosContextoEmpresa} margin={{ top: 40, right: 8, left: 8, bottom: 0 }} barCategoryGap="15%">
                  <defs>
                    {GRADIENTES_FAIXA.map(([top, bottom], i) => (
                      <linearGradient key={i} id={`faixaGradient${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={top} />
                        <stop offset="100%" stopColor={bottom} />
                      </linearGradient>
                    ))}
                    <linearGradient id="faixaGradientVoce" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={GRADIENTE_VOCE[0]} />
                      <stop offset="100%" stopColor={GRADIENTE_VOCE[1]} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="faixa"
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    tick={<FaixaTick faixaAtualIndex={faixaAtualIndex} />}
                  />
                  <YAxis hide />
                  <Tooltip content={<ContextoTooltip />} cursor={{ fill: 'rgba(17, 24, 39, 0.04)' }} />
                  <Bar dataKey="quantidade" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                    {dadosContextoEmpresa.map((_, i) => (
                      <Cell key={i} fill={i === faixaAtualIndex ? 'url(#faixaGradientVoce)' : `url(#faixaGradient${i})`} />
                    ))}
                    <LabelList
                      dataKey="quantidade"
                      content={(props: object) => <VoceBubble {...props} faixaAtualIndex={faixaAtualIndex} />}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="text-xs text-gray-500 text-center mt-3">
              Baseado nos colaboradores da empresa no cargo {cargoAtualNome}.
            </p>
          </div>
        </div>

        </div>

        {/* Oportunidades de desenvolvimento — movida para ANTES de "Mapeamento
            de competências" (era a última seção da página, decisão de
            hierarquia de Alice: colegas devem ver primeiro onde focar o
            desenvolvimento, o mapeamento completo fica como referência
            detalhada ao final). */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Oportunidades de desenvolvimento</h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1 mb-4">
            Top 8 habilidades com maior oportunidade de crescimento profissional
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
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {oportunidades.map(op => (
                  <div key={op.habilidadeId} className="bg-white border border-gray-200 rounded-lg p-4 md:p-5">
                    <p className="text-sm font-semibold text-gray-900">{op.nome}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{op.competenciaNome}</p>
                    <div className="mt-5">
                      {/* op.nivelAtual nunca é null aqui: status 'abaixo' só é
                          atribuído por getStatus quando existe nivelAtual (ver
                          minhaCarreiraShared.tsx) */}
                      <OportunidadeBarraNivel voceNivel={op.nivelAtual!} esperadoNivel={op.nivelEsperado} />
                    </div>
                    <div className="mt-4 flex items-center gap-2.5 rounded-xl bg-[var(--brand-50)] px-4 py-3">
                      <TrendingUp className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0" />
                      <span className="text-sm font-medium text-[var(--brand-700)]">{textoChipNivel(op.gap)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card informativo — variante SLATE de "Mensagens de
                  orientação — B" (02-design-system.md), NÃO a variante brand
                  usada no card de referência de "Aderência ao cargo"
                  (Atingir a porcentagem máxima...) — pedido explícito para
                  este card específico, não assumir como padrão novo para
                  outros cards informativos do sistema. mt-6 no lugar de um
                  wrapper space-y-6 porque este bloco não está dentro de um
                  container space-y — mesmo respiro equivalente. */}
              <div className="bg-slate-100 border border-slate-300 rounded-lg p-4 flex items-start gap-3 mt-6">
                <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  Estas são as habilidades com maior distância entre seu nível atual e o esperado para o cargo. Considere conversar com seu líder para priorizar o desenvolvimento nelas.
                </p>
              </div>
            </>
          )}
        </div>

        <div id={MAPEAMENTO_COMPETENCIAS_SECTION_ID} className="space-y-6 scroll-mt-20">

          {/* Mapeamento de competências — agora a ÚLTIMA seção da página (ver
              comentário acima em "Oportunidades de desenvolvimento"). Os
              cards de métrica (Total de competências/habilidades/No
              esperado/Abaixo) foram removidos a pedido — a lista abaixo já
              expõe essa informação por linha, os cards eram redundantes.
              A página de detalhe de cada competência (substituindo o antigo
              master-detail "Cobertura por Competência") — "Ver detalhes" por
              enquanto é placeholder (ver comentário no botão). Escopo sempre
              o cargo ATUAL de João (c2), igual ao gauge "Aderência ao cargo"
              acima. */}
          <h2 className="text-lg font-semibold text-gray-900">Mapeamento de competências</h2>

          {/* Bloco de filtros — card PRÓPRIO, separado do card da lista (era
              a toolbar interna da lista, com border-b; pedido explícito para
              destacar o bloco de filtros). Mesmo gap padrão (space-y-6, do
              wrapper acima) usado entre os demais blocos desta seção — igual
              ao padrão toolbar/tabela em cards separados já usado em
              Perfis.tsx e ListingPage.tsx. */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setFiltroCompetencia('todas')}
                  className={`px-3 py-2 text-sm font-normal rounded-md whitespace-nowrap transition-all ${
                    filtroCompetencia === 'todas' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Todas
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroCompetencia('abaixo')}
                  className={`px-3 py-2 text-sm font-normal rounded-md whitespace-nowrap transition-all ${
                    filtroCompetencia === 'abaixo' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Abaixo do esperado
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroCompetencia('no-caminho')}
                  className={`px-3 py-2 text-sm font-normal rounded-md whitespace-nowrap transition-all ${
                    filtroCompetencia === 'no-caminho' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  No caminho certo
                </button>
              </div>
              {/* Filtro por tipo — mesmo componente de segmented control
                  (bg-gray-100 rounded-lg p-1), padrão já usado em
                  HabilidadesSelectionModal.tsx. Uma competência com
                  habilidades dos dois tipos aparece nos dois filtros — ver
                  comentário em competenciasAderencia. */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setFiltroTipo('todas')}
                  className={`px-3 py-2 text-sm font-normal rounded-md whitespace-nowrap transition-all ${
                    filtroTipo === 'todas' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Todas
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroTipo('Técnica')}
                  className={`px-3 py-2 text-sm font-normal rounded-md whitespace-nowrap transition-all ${
                    filtroTipo === 'Técnica' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Técnicas
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroTipo('Comportamental')}
                  className={`px-3 py-2 text-sm font-normal rounded-md whitespace-nowrap transition-all ${
                    filtroTipo === 'Comportamental' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Comportamentais
                </button>
              </div>
            </div>
            <span className="text-sm text-gray-500 flex-shrink-0">{totalCompetenciasAvaliadas} competências avaliadas</span>
          </div>

          {/* Lista de competências — reaproveita o mesmo cálculo de
              competenciasAderencia (percentual, "X de Y", competências com
              Y=0 fora da lista) — uma linha por competência. Anel de
              percentual reaproveita AderenciaRing (mesmo componente do card
              de visão geral da página de detalhe) — cor vem de getCorAnelLista
              (minhaCarreiraShared.tsx), fonte única compartilhada com a
              página de detalhe da competência, sem divergência entre as duas
              telas. */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {competenciasFiltradas.length === 0 ? (
              <div className="px-3 md:px-6 py-8 text-center text-sm text-gray-500">
                Nenhuma competência encontrada para este filtro.
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {competenciasFiltradas.map((comp, index) => (
                  <div
                    key={comp.competenciaId}
                    className={`flex items-center justify-between gap-4 px-4 md:px-6 py-4 ${index % 2 === 1 ? 'bg-[#F9FAFB]' : 'bg-white'}`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <AderenciaRing
                        percentual={comp.percentual}
                        size={48}
                        textClassName="text-[10px] font-bold text-gray-900"
                      />
                      <div className="min-w-0">
                        {/* text-sm font-semibold — padronizado com o nome da
                            habilidade em "Oportunidades de desenvolvimento"
                            (op.nome acima), que usa o mesmo tamanho/peso. */}
                        <p className="text-sm font-semibold text-gray-900 truncate">{comp.nome}</p>
                        <p className="text-xs md:text-sm text-gray-500">{comp.x} de {comp.y} habilidades no esperado</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
                      {/* Badge nunca repete o percentual (já está no anel) —
                          só sinaliza Parcial/Completo. Completo = verde
                          (positivo, mesma semântica de "Concluída"); Parcial
                          = amarelo (atenção, mesma semântica de "Rascunho"). */}
                      <span
                        className={`inline-flex px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full ${
                          comp.percentual === 100 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {comp.percentual === 100 ? 'Completo' : 'Parcial'}
                      </span>
                      <button
                        type="button"
                        onClick={() => navigate(`/minha-carreira/competencia/${comp.competenciaId}`)}
                        className="inline-flex items-center gap-0.5 text-xs md:text-sm font-medium text-[var(--brand-600)]"
                      >
                        Ver detalhes
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
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
