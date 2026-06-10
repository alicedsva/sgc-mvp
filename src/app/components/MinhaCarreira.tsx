import { useState, useMemo } from 'react';
import { BarChart2, Info, Target } from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  niveisDefaultData,
  habilidadesCargoData,
  habilidadesData,
  avaliacoesColaboradoresData,
  cargosData,
} from '../data/mockData';
import type { MatrizCargo } from '../utils/cobertura';

const COLABORADOR_ID = '1';

// ─── dados estáticos da jornada (Seção 3) ────────────────────────────────────

interface CargoJornada {
  id: string;
  nome: string;
  senioridade: string;
  matrizCargo: MatrizCargo[];
  atual: boolean;
}

const cargosJornada: CargoJornada[] = [
  {
    id: '2',
    nome: 'Desenvolvedor Frontend',
    senioridade: 'Pleno',
    matrizCargo: [
      { habilidadeId: '1',  nivelEsperado: 'Intermediário' },
      { habilidadeId: '2',  nivelEsperado: 'Intermediário' },
      { habilidadeId: '3',  nivelEsperado: 'Intermediário' },
      { habilidadeId: '4',  nivelEsperado: 'Básico' },
      { habilidadeId: '5',  nivelEsperado: 'Básico' },
      { habilidadeId: '6',  nivelEsperado: 'Básico' },
      { habilidadeId: '8',  nivelEsperado: 'Intermediário' },
      { habilidadeId: '9',  nivelEsperado: 'Intermediário' },
      { habilidadeId: '15', nivelEsperado: 'Básico' },
      { habilidadeId: '16', nivelEsperado: 'Básico' },
    ],
    atual: true,
  },
  {
    id: '3',
    nome: 'Desenvolvedor Frontend',
    senioridade: 'Sênior',
    matrizCargo: [
      { habilidadeId: '1',  nivelEsperado: 'Avançado' },
      { habilidadeId: '2',  nivelEsperado: 'Avançado' },
      { habilidadeId: '3',  nivelEsperado: 'Avançado' },
      { habilidadeId: '4',  nivelEsperado: 'Avançado' },
      { habilidadeId: '5',  nivelEsperado: 'Intermediário' },
      { habilidadeId: '6',  nivelEsperado: 'Intermediário' },
      { habilidadeId: '7',  nivelEsperado: 'Intermediário' },
      { habilidadeId: '8',  nivelEsperado: 'Avançado' },
      { habilidadeId: '9',  nivelEsperado: 'Avançado' },
      { habilidadeId: '10', nivelEsperado: 'Intermediário' },
      { habilidadeId: '11', nivelEsperado: 'Intermediário' },
      { habilidadeId: '12', nivelEsperado: 'Intermediário' },
      { habilidadeId: '15', nivelEsperado: 'Avançado' },
      { habilidadeId: '16', nivelEsperado: 'Intermediário' },
    ],
    atual: false,
  },
  {
    id: '4',
    nome: 'Tech Lead Frontend',
    senioridade: '',
    matrizCargo: [
      { habilidadeId: '1',  nivelEsperado: 'Avançado' },
      { habilidadeId: '2',  nivelEsperado: 'Avançado' },
      { habilidadeId: '3',  nivelEsperado: 'Avançado' },
      { habilidadeId: '4',  nivelEsperado: 'Avançado' },
      { habilidadeId: '5',  nivelEsperado: 'Avançado' },
      { habilidadeId: '6',  nivelEsperado: 'Avançado' },
      { habilidadeId: '7',  nivelEsperado: 'Intermediário' },
      { habilidadeId: '8',  nivelEsperado: 'Avançado' },
      { habilidadeId: '9',  nivelEsperado: 'Avançado' },
      { habilidadeId: '10', nivelEsperado: 'Avançado' },
      { habilidadeId: '11', nivelEsperado: 'Avançado' },
      { habilidadeId: '12', nivelEsperado: 'Avançado' },
      { habilidadeId: '13', nivelEsperado: 'Intermediário' },
      { habilidadeId: '15', nivelEsperado: 'Especialista' },
      { habilidadeId: '16', nivelEsperado: 'Avançado' },
    ],
    atual: false,
  },
];

// ─── helpers ─────────────────────────────────────────────────────────────────

const MAX_PESO = Math.max(...niveisDefaultData.map(n => n.peso));

function calcularRadarSemCargo() {
  const avs = avaliacoesColaboradoresData.filter(a => a.colaboradorId === COLABORADOR_ID);
  const map = new Map<string, { somaAtual: number; total: number }>();
  for (const av of avs) {
    const hab = habilidadesData.find(h => h.id === av.habilidadeId);
    if (!hab) continue;
    const peso = niveisDefaultData.find(n => n.nome === av.nivelAtual)?.peso ?? 0;
    const comp = hab.competencia;
    if (!map.has(comp)) map.set(comp, { somaAtual: 0, total: 0 });
    const e = map.get(comp)!;
    e.somaAtual += peso;
    e.total += MAX_PESO;
  }
  return Array.from(map.entries()).map(([competencia, { somaAtual, total }]) => ({
    competencia,
    'Você': total > 0 ? Math.round((somaAtual / total) * 100) : 0,
  }));
}

function calcularRadarComCargo(cargoId: string) {
  const matrizCargo = habilidadesCargoData.filter(h => h.cargoId === cargoId);
  const avs = avaliacoesColaboradoresData.filter(a => a.colaboradorId === COLABORADOR_ID);
  const mapaAvaliacoes = new Map(avs.map(a => [a.habilidadeId, a.nivelAtual]));

  const map = new Map<string, { total: number; cobertas: number }>();
  for (const req of matrizCargo) {
    const hab = habilidadesData.find(h => h.id === req.habilidadeId);
    if (!hab) continue;
    const comp = hab.competencia;
    if (!map.has(comp)) map.set(comp, { total: 0, cobertas: 0 });
    const e = map.get(comp)!;
    e.total++;
    const nivelAtual = mapaAvaliacoes.get(req.habilidadeId);
    if (nivelAtual) {
      const pesoAtual = niveisDefaultData.find(n => n.nome === nivelAtual)?.peso ?? 0;
      const pesoExigido = niveisDefaultData.find(n => n.nome === req.nivelEsperado)?.peso ?? 0;
      if (pesoAtual >= pesoExigido) e.cobertas++;
    }
  }
  return Array.from(map.entries()).map(([competencia, { total, cobertas }]) => ({
    competencia,
    'Você': total > 0 ? Math.round((cobertas / total) * 100) : 0,
    'Cargo': 100,
  }));
}

function calcularTop5Gaps(cargoId: string) {
  const matrizCargo = habilidadesCargoData.filter(h => h.cargoId === cargoId);
  const avs = avaliacoesColaboradoresData.filter(a => a.colaboradorId === COLABORADOR_ID);
  const mapaAvaliacoes = new Map(avs.map(a => [a.habilidadeId, a.nivelAtual]));

  return matrizCargo
    .map(req => {
      const hab = habilidadesData.find(h => h.id === req.habilidadeId);
      const nivelAtualNome = mapaAvaliacoes.get(req.habilidadeId) ?? null;
      const pesoAtual = nivelAtualNome
        ? (niveisDefaultData.find(n => n.nome === nivelAtualNome)?.peso ?? 0)
        : 0;
      const pesoExigido = niveisDefaultData.find(n => n.nome === req.nivelEsperado)?.peso ?? 0;
      return {
        habilidadeId: req.habilidadeId,
        habilidade: hab?.nome ?? req.habilidadeId,
        competencia: hab?.competencia ?? 'Outras',
        nivelAtualNome,
        pesoAtual,
        pesoExigido,
        nivelExigidoNome: req.nivelEsperado,
        naoAvaliada: nivelAtualNome === null,
        gap: pesoExigido - pesoAtual,
      };
    })
    .filter(h => h.gap > 0)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 5);
}

const cargosParaComparar = cargosData.filter(
  c => c.status === 'Configurado' && habilidadesCargoData.some(h => h.cargoId === c.id)
);

// ─── ícone de check inline ────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

// ─── componente ──────────────────────────────────────────────────────────────

export function MinhaCarreira() {
  const [cargoComparativoId, setCargoComparativoId] = useState<string | null>(null);

  const temAvaliacao = avaliacoesColaboradoresData.some(a => a.colaboradorId === COLABORADOR_ID);

  const radarData = useMemo(
    () => cargoComparativoId ? calcularRadarComCargo(cargoComparativoId) : calcularRadarSemCargo(),
    [cargoComparativoId]
  );

  const top5Gaps = useMemo(
    () => cargoComparativoId ? calcularTop5Gaps(cargoComparativoId) : [],
    [cargoComparativoId]
  );

  const idxAtual = cargosJornada.findIndex(c => c.atual);
  const isUltimoNaJornada = idxAtual === cargosJornada.length - 1;

  const cargoSelecionadoNome = cargoComparativoId
    ? (cargosParaComparar.find(c => c.id === cargoComparativoId)?.cargoRM ?? 'cargo selecionado')
    : null;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Minha Carreira</h1>
        <p className="text-sm text-gray-600 mt-2">
          Acompanhe sua evolução e o que precisa desenvolver para chegar onde quer
        </p>
      </div>

      {/* ─── Filtros ─── */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg">
        <span className="text-sm font-medium text-gray-700">Comparar com cargo:</span>
        <Select
          value={cargoComparativoId ?? ''}
          onValueChange={v => setCargoComparativoId(v || null)}
        >
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Selecionar cargo para comparar" />
          </SelectTrigger>
          <SelectContent>
            {cargosParaComparar.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.cargoRM}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {cargoComparativoId && (
          <button
            type="button"
            onClick={() => setCargoComparativoId(null)}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Limpar
          </button>
        )}
      </div>

      {/* ─── Seção 2A — Radar de competências ─── */}
      {!temAvaliacao ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <BarChart2 className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            Nenhuma avaliação respondida ainda
          </p>
          <p className="text-sm text-gray-500">
            Responda uma avaliação para visualizar seu perfil de competências.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="mb-4">
            <p className="text-base font-semibold text-gray-900">
              {cargoComparativoId
                ? `Seu perfil vs. ${cargoSelecionadoNome}`
                : 'Seu perfil de competências'}
            </p>
            {!cargoComparativoId && (
              <p className="text-sm text-gray-500 mt-0.5">
                Selecione um cargo no filtro acima para comparar
              </p>
            )}
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid gridType="polygon" />
              <PolarAngleAxis dataKey="competencia" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Radar
                name="Você"
                dataKey="Você"
                fill="var(--brand-500)"
                fillOpacity={0.3}
                stroke="var(--brand-500)"
                strokeWidth={2}
              />
              {cargoComparativoId && (
                <Radar
                  name="Cargo"
                  dataKey="Cargo"
                  fill="transparent"
                  stroke="#d1d5db"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              )}
              <Legend />
            </RadarChart>
          </ResponsiveContainer>

          {cargoComparativoId && (
            <div className="mt-4 bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                O comparativo é calculado com base nas habilidades avaliadas. Habilidades não avaliadas contam como nível zero no cálculo de cobertura.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ─── Seção 2B — Container de gaps ─── */}
      {!cargoComparativoId ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Target className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-500">
            Selecione um cargo para ver seus gaps
          </p>
          <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto">
            Escolha um cargo de referência no filtro acima para visualizar as habilidades com maior
            distância entre seu nível atual e o esperado.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="mb-5">
            <p className="text-base font-semibold text-gray-900">
              Top 5 gaps para {cargoSelecionadoNome}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              Habilidades com maior distância entre seu nível atual e o esperado
            </p>
          </div>

          {top5Gaps.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-sm text-gray-500">
                Você atende todos os requisitos deste cargo. Parabéns!
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {top5Gaps.map(h => {
                const largura = h.pesoExigido > 0
                  ? Math.min(100, (h.pesoAtual / h.pesoExigido) * 100)
                  : 0;

                return (
                  <div key={h.habilidadeId} className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-gray-900">{h.habilidade}</span>
                          {h.naoAvaliada ? (
                            <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full">
                              Não avaliado
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                              Abaixo do esperado
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{h.competencia}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-700">
                          {h.nivelAtualNome ?? '—'} → {h.nivelExigidoNome}
                        </p>
                      </div>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          h.naoAvaliada ? 'bg-gray-300' : 'bg-red-400'
                        }`}
                        style={{ width: `${largura}%` }}
                      />
                    </div>

                    {h.naoAvaliada && (
                      <p className="text-xs text-gray-400">
                        Você ainda não foi avaliado nesta habilidade
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── Seção 3 — Minha Jornada ─── */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Minha Jornada</h2>

        <div className="bg-white border border-gray-200 rounded-lg p-6">

          {/* Mobile — vertical */}
          <div className="md:hidden space-y-0">
            {cargosJornada.map((cargo, idx) => {
              const isPassado = idx < idxAtual;
              const isAtual = cargo.atual;
              const isLast = idx === cargosJornada.length - 1;

              return (
                <div key={cargo.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isAtual
                          ? 'bg-[var(--brand-600)]'
                          : isPassado
                          ? 'bg-gray-400'
                          : 'bg-white border-2 border-dashed border-gray-300'
                      }`}
                    >
                      {(isAtual || isPassado) && <CheckIcon />}
                    </div>
                    {(!isLast || isUltimoNaJornada) && (
                      <div className="flex-1 w-0.5 bg-gray-200 my-1 min-h-[24px]" />
                    )}
                  </div>
                  <div className={`pb-6 pt-1.5 ${isLast && !isUltimoNaJornada ? 'pb-0' : ''}`}>
                    <p
                      className={`text-sm leading-snug ${
                        isAtual
                          ? 'font-semibold text-gray-900'
                          : isPassado
                          ? 'text-gray-500'
                          : 'text-gray-400'
                      }`}
                    >
                      {cargo.nome}{cargo.senioridade ? ` — ${cargo.senioridade}` : ''}
                    </p>
                    {isAtual && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-[var(--brand-50)] text-[var(--brand-600)] rounded-full">
                        Você está aqui
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {isUltimoNaJornada && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center ml-13 mt-1">
                <p className="text-sm text-gray-500">Você chegou ao último cargo desta jornada.</p>
                <p className="text-xs text-gray-400 mt-1">
                  Fale com seu gestor ou RH para explorar novos caminhos.
                </p>
              </div>
            )}
          </div>

          {/* Desktop — horizontal */}
          <div className="hidden md:flex">
            {cargosJornada.map((cargo, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === cargosJornada.length - 1;
              const isPassado = idx < idxAtual;
              const isAtual = cargo.atual;
              const showRightConnector = !isLast || isUltimoNaJornada;

              return (
                <div key={cargo.id} className="flex-1 flex flex-col items-center">
                  <div className="flex items-center w-full">
                    <div className={`flex-1 h-0.5 ${!isFirst ? 'bg-gray-200' : 'bg-transparent'}`} />
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isAtual
                          ? 'bg-[var(--brand-600)]'
                          : isPassado
                          ? 'bg-gray-400'
                          : 'bg-white border-2 border-dashed border-gray-300'
                      }`}
                    >
                      {(isAtual || isPassado) && <CheckIcon />}
                    </div>
                    <div className={`flex-1 h-0.5 ${showRightConnector ? 'bg-gray-200' : 'bg-transparent'}`} />
                  </div>
                  <div className="mt-3 text-center px-2">
                    <p
                      className={`text-xs leading-snug ${
                        isAtual
                          ? 'font-semibold text-gray-900'
                          : isPassado
                          ? 'text-gray-500'
                          : 'text-gray-400'
                      }`}
                    >
                      {cargo.nome}{cargo.senioridade ? ` — ${cargo.senioridade}` : ''}
                    </p>
                    {isAtual && (
                      <span className="inline-block mt-1.5 px-2 py-0.5 text-xs bg-[var(--brand-50)] text-[var(--brand-600)] rounded-full whitespace-nowrap">
                        Você está aqui
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {isUltimoNaJornada && (
              <div className="flex-1 flex flex-col items-center">
                <div className="flex items-center w-full">
                  <div className="flex-1 h-0.5 bg-gray-200" />
                  <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-400 text-sm leading-none">···</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-transparent" />
                </div>
                <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-4 text-center max-w-[200px]">
                  <p className="text-sm text-gray-500">Você chegou ao último cargo desta jornada.</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Fale com seu gestor ou RH para explorar novos caminhos.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
