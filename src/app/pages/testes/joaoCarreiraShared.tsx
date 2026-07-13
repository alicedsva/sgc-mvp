import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import {
  habilidadesData,
  habilidadesCargoData,
  joaoHabilidadesCargoMatriz,
  avaliacoesColaboradoresData,
  niveisDefaultData,
  getPesoFromNome,
} from '../../data/mockData';

// Lógica compartilhada entre TesteCarreiraPage ("Mapeamento de competências",
// Etapas 1/2) e TesteCompetenciaDetalhePage (Etapa 3) — João Silva é o único
// colaborador de teste em toda a exploração /testes/carreira/*, sempre no
// escopo do seu cargo ATUAL (c2). Extraído para módulo próprio para as duas
// páginas calcularem a partir da MESMA fonte (mockData.ts) sem duplicar a
// lógica de enriquecimento/matriz.

export const JOAO_ID = '10';
export const JOAO_CARGO_ATUAL = 'c2';
export const MAX_PESO = Math.max(...niveisDefaultData.map(n => n.peso));

export type Status = 'acima' | 'no' | 'abaixo' | 'sem';

export const STATUS_LABEL: Record<Status, string> = {
  acima: 'Acima do esperado',
  no: 'No esperado',
  abaixo: 'Abaixo do esperado',
  sem: 'Não avaliada',
};

export type HabilidadeEnriquecida = {
  habilidadeId: string;
  nome: string;
  tipo: string;
  competenciaId: string;
  competenciaNome: string;
  nivelEsperado: string;
  pesoEsperado: number;
  nivelAtual: string | null;
  pesoAtual: number | null;
  status: Status;
};

export function getStatus(nivelAtual: string | null, nivelEsperado: string): Status {
  if (!nivelAtual) return 'sem';
  const pa = getPesoFromNome(nivelAtual);
  const pe = getPesoFromNome(nivelEsperado);
  if (pa > pe) return 'acima';
  if (pa === pe) return 'no';
  return 'abaixo';
}

export function getNivelAtualJoao(habilidadeId: string): string | null {
  return (
    avaliacoesColaboradoresData.find(
      a => a.colaboradorId === JOAO_ID && a.habilidadeId === habilidadeId
    )?.nivelAtual ?? null
  );
}

// Matriz de habilidades esperadas para um cargo da jornada de João.
// c2 (cargo atual) usa a versão enriquecida joaoHabilidadesCargoMatriz — os demais
// cargos usam habilidadesCargoData (mesma fonte usada pelo admin).
export function matrizParaCargo(cargoId: string): { habilidadeId: string; nivelEsperado: string }[] {
  if (cargoId === JOAO_CARGO_ATUAL) return joaoHabilidadesCargoMatriz;
  return habilidadesCargoData
    .filter(h => h.cargoId === cargoId)
    .map(h => ({ habilidadeId: h.habilidadeId, nivelEsperado: h.nivelEsperado }));
}

export function enriquecerMatriz(matriz: { habilidadeId: string; nivelEsperado: string }[]): HabilidadeEnriquecida[] {
  return matriz
    .map(entry => {
      const hab = habilidadesData.find(h => h.id === entry.habilidadeId);
      if (!hab) return null;
      const nivelAtual = getNivelAtualJoao(entry.habilidadeId);
      return {
        habilidadeId: entry.habilidadeId,
        nome: hab.nome,
        tipo: hab.tipo,
        competenciaId: hab.competenciaId,
        competenciaNome: hab.competencia,
        nivelEsperado: entry.nivelEsperado,
        pesoEsperado: getPesoFromNome(entry.nivelEsperado),
        nivelAtual,
        pesoAtual: nivelAtual ? getPesoFromNome(nivelAtual) : null,
        status: getStatus(nivelAtual, entry.nivelEsperado),
      };
    })
    .filter((h): h is HabilidadeEnriquecida => h !== null);
}

// Faixas de cor dos anéis de percentual (cards do grid + card de visão geral
// da página de detalhe) — mesmos limiares 80/50 já documentados em
// 04-regras-negocio.md, mas com tons PROPOSITALMENTE diferentes de "Boa
// cobertura"/"Cobertura parcial"/"Baixa cobertura" (text-green-600/yellow-600/
// red-600, ver cobertura.ts e DashboardPage.tsx) — pedido explícito para não
// confundir os dois indicadores visualmente.
export function getFaixaAderencia(pct: number): { ring: string } {
  if (pct >= 80) return { ring: '#4ADE80' };
  if (pct >= 50) return { ring: '#FBBF24' };
  return { ring: '#F87171' };
}

// Anel de percentual via RadialBarChart — reaproveitado pelos cards do grid
// de "Mapeamento de competências" e pelo card de visão geral da página de
// detalhe (tamanho maior). startAngle/endAngle FIXOS (círculo completo,
// sentido horário a partir do topo) — o PolarAngleAxis com domain=[0,100]
// converte o value em ângulo proporcionalmente; calcular o endAngle a partir
// do percentual aqui SERIA duplicar essa conversão — bug já cometido:
// colapsava startAngle===endAngle em 0%, e o recharts não desenha NENHUM
// sector (nem o track de fundo) quando start===end.
export function AderenciaRing({
  percentual,
  size,
  textClassName = 'text-xs font-bold text-gray-900',
}: {
  percentual: number;
  size: number;
  textClassName?: string;
}) {
  const faixa = getFaixaAderencia(percentual);
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius={size * 0.375}
          outerRadius={size * 0.5}
          data={[{ value: percentual }]}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            dataKey="value"
            cornerRadius={size / 8}
            fill={faixa.ring}
            background={{ fill: '#E5E7EB' }}
            isAnimationActive={false}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={textClassName}>{percentual}%</span>
      </div>
    </div>
  );
}

// Barrinhas de peso — segmentos 1..nível atual: azul. Se o atual for menor
// que o esperado, os segmentos entre o atual e o esperado ficam âmbar.
// Segmentos além do esperado ficam cinza. Se o atual já atende ou supera o
// esperado, não há segmento âmbar.
export function PesoBars({ pesoAtual, pesoEsperado }: { pesoAtual: number | null; pesoEsperado: number }) {
  const atual = pesoAtual ?? 0;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: MAX_PESO }).map((_, i) => {
        const segmento = i + 1;
        let cor = '#D1D5DB';
        if (segmento <= atual) {
          cor = 'var(--brand-600)';
        } else if (atual < pesoEsperado && segmento <= pesoEsperado) {
          cor = '#F59E0B';
        }
        return <span key={i} className="w-2.5 h-1.5 rounded-sm flex-shrink-0" style={{ backgroundColor: cor }} />;
      })}
    </div>
  );
}
