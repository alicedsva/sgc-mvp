import type { Status } from '../../pages/minhaCarreiraShared';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

interface NivelReguaProps {
  /** Níveis aplicáveis DESTA habilidade específica (habilidade.niveis via getNiveisHabilidade), nunca a escala global. */
  niveis: { nome: string; peso: number; criterio?: string }[];
  /** Nome do nível respondido pelo colaborador, ou null quando não há ponto para marcar (ex.: resposta 'nao_sei'). */
  nivelVoce: string | null;
  /** Nome do nível esperado pelo cargo atual, ou null quando a habilidade não tem referência de cargo. */
  nivelEsperado: string | null;
  /** Resultado de getStatus(nivelRespondido, nivelEsperado) — null quando nivelEsperado é null. */
  status: Status | null;
}

const CORES = {
  brand: { dot: 'bg-[var(--brand-600)]', ring: 'ring-[var(--brand-300)]', badge: 'bg-[var(--brand-100)] text-[var(--brand-700)]' },
  amber: { dot: 'bg-amber-600', ring: 'ring-amber-300', badge: 'bg-amber-100 text-amber-700' },
  green: { dot: 'bg-green-600', ring: 'ring-green-300', badge: 'bg-green-100 text-green-700' },
  neutro: { dot: 'bg-gray-400', ring: 'ring-gray-300', badge: 'bg-gray-100 text-gray-600' },
} as const;

/**
 * Régua horizontal read-only mostrando os níveis aplicáveis de uma
 * habilidade como pontos, marcando "Você" e "Esperado" (que podem coincidir
 * no mesmo ponto). Sem interação/clique além do hover (tooltip com o
 * critério de cada nível) — puramente informativa.
 */
export function NivelRegua({ niveis, nivelVoce, nivelEsperado, status }: NivelReguaProps) {
  const ordenados = [...niveis].sort((a, b) => a.peso - b.peso);

  if (ordenados.length === 0) return null;

  // "Esperado" nunca muda de cor — é sempre azul de marca. "Você" varia
  // conforme o status (abaixo = âmbar, no esperado = azul de marca igual a
  // Esperado, acima = verde); sem referência de cargo ou sem resposta fica
  // neutro.
  const corVoce = status === 'abaixo' ? CORES.amber : status === 'acima' ? CORES.green : status === 'no' ? CORES.brand : CORES.neutro;
  const corEsperado = CORES.brand;

  return (
    <div className="pt-1 pb-1">
      {/* Linha 1: tags Você/Esperado — bottom-aligned via items-end, sem
          altura fixa, para não depender de pixel mágico para alinhar com a
          linha/bolinhas abaixo. */}
      <div className="flex items-end justify-between mb-2">
        {ordenados.map(nivel => {
          const isVoce = nivel.nome === nivelVoce;
          const isEsperado = nivel.nome === nivelEsperado;
          return (
            <div key={`${nivel.nome}-tag`} className="flex-1 min-w-0 flex flex-col items-center justify-end gap-0.5 px-0.5">
              {isVoce && isEsperado ? (
                <span className={`px-1.5 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${corEsperado.badge}`}>
                  Você está no esperado
                </span>
              ) : (
                (isVoce || isEsperado) && (
                  <div className="flex items-center gap-1">
                    {isVoce && (
                      <span className={`px-1.5 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${corVoce.badge}`}>
                        Você
                      </span>
                    )}
                    {isEsperado && (
                      <span className={`px-1.5 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${corEsperado.badge}`}>
                        Esperado
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>

      {/* Linha 2: linha horizontal + bolinhas — mesmo container (h-4,
          items-center) para garantir que a linha (top-1/2) e as bolinhas
          fiquem exatamente no mesmo eixo vertical. */}
      <div className="relative h-4 flex items-center justify-between">
        <div className="absolute left-[5%] right-[5%] top-1/2 -translate-y-1/2 h-0.5 bg-gray-200" aria-hidden="true" />
        {ordenados.map(nivel => {
          const isVoce = nivel.nome === nivelVoce;
          const isEsperado = nivel.nome === nivelEsperado;
          const ativo = isVoce || isEsperado;
          const cor = isVoce ? corVoce : corEsperado;
          const dot = (
            <span
              className={`w-3 h-3 rounded-full flex-shrink-0 ${
                ativo ? `${cor.dot} ring-2 ring-offset-1 ${cor.ring}` : 'bg-white border-2 border-gray-300'
              }`}
            />
          );
          return (
            <div key={`${nivel.nome}-dot`} className="relative z-10 flex-1 min-w-0 flex justify-center px-0.5">
              {nivel.criterio ? (
                <Tooltip>
                  <TooltipTrigger asChild>{dot}</TooltipTrigger>
                  <TooltipContent>{nivel.criterio}</TooltipContent>
                </Tooltip>
              ) : (
                dot
              )}
            </div>
          );
        })}
      </div>

      {/* Linha 3: nomes dos níveis — mesmo tamanho (text-xs) para todos,
          selecionados ou não; a única diferença é o peso da fonte. */}
      <div className="flex items-start justify-between mt-2">
        {ordenados.map(nivel => {
          const ativo = nivel.nome === nivelVoce || nivel.nome === nivelEsperado;
          return (
            <div key={`${nivel.nome}-label`} className="flex-1 min-w-0 flex justify-center px-0.5">
              <span className={`text-xs text-gray-600 text-center leading-tight ${ativo ? 'font-semibold' : 'font-normal'}`}>
                {nivel.nome}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
