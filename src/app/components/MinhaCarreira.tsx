import { useState } from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import {
  getCorFromPeso,
  niveisDefaultData,
  habilidadesCargoData,
  habilidadesData,
  avaliacoesColaboradoresData,
} from '../data/mockData';
import { calcularCoberturaCargo, HabilidadeColaborador, MatrizCargo } from '../utils/cobertura';

const colaborador = {
  cargoAtual: 'Desenvolvedor Frontend',
  senioridade: 'Pleno',
  jornada: 'Desenvolvedor',
  tempoNoCargo: '1 ano e 6 meses',
  ultimaAvaliacao: '15 de janeiro de 2026',
};

// Próximo cargo fixo na jornada do colaborador
const proximoCargo = { id: 'c3', nome: 'Desenvolvedor Sênior' };

// Habilidades do colaborador para cálculo de cobertura na jornada (mesmo modelo de ColaboradorView)
const habilidadesColaboradorJornada: HabilidadeColaborador[] = [
  { habilidadeId: '1',  nivelAtual: 'Avançado' },
  { habilidadeId: '2',  nivelAtual: 'Avançado' },
  { habilidadeId: '3',  nivelAtual: 'Intermediário' },
  { habilidadeId: '4',  nivelAtual: 'Intermediário' },
  { habilidadeId: '5',  nivelAtual: 'Intermediário' },
  { habilidadeId: '6',  nivelAtual: 'Intermediário' },
  { habilidadeId: '7',  nivelAtual: 'Básico' },
  { habilidadeId: '8',  nivelAtual: 'Avançado' },
  { habilidadeId: '9',  nivelAtual: 'Avançado' },
  { habilidadeId: '10', nivelAtual: 'Intermediário' },
  { habilidadeId: '11', nivelAtual: 'Básico' },
  { habilidadeId: '12', nivelAtual: 'Intermediário' },
  { habilidadeId: '13', nivelAtual: 'Intermediário' },
  { habilidadeId: '14', nivelAtual: 'Intermediário' },
  { habilidadeId: '15', nivelAtual: 'Avançado' },
  { habilidadeId: '16', nivelAtual: 'Avançado' },
];

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

export function MinhaCarreira() {
  const [activeTab, setActiveTab] = useState<'minha-jornada' | 'proximo-passo'>('minha-jornada');

  // Aba 2 — dados computados para proximoCargo (fixo)
  const matrizProximoCargo = habilidadesCargoData.filter((h) => h.cargoId === proximoCargo.id);
  const chartDataProximo = matrizProximoCargo.map((req) => {
    const hab = habilidadesData.find((h) => h.id === req.habilidadeId);
    const av = avaliacoesColaboradoresData.find(
      (a) => a.colaboradorId === '1' && a.habilidadeId === req.habilidadeId
    );
    const pesoExigido = niveisDefaultData.find((n) => n.nome === req.nivelEsperado)?.peso ?? 1;
    const pesoAtual = av
      ? niveisDefaultData.find((n) => n.nome === av.nivelAtual)?.peso ?? 0
      : 0;
    return {
      habilidadeId: req.habilidadeId,
      habilidade: hab?.nome ?? `Habilidade ${req.habilidadeId}`,
      competencia: hab?.competencia ?? 'Outras',
      nivelAtual: pesoAtual,
      nivelExigido: pesoExigido,
      nivelAtualNome: av?.nivelAtual ?? null,
      nivelExigidoNome: req.nivelEsperado,
    };
  });

  const habilidadesComGapProximo = chartDataProximo
    .filter((h) => h.nivelAtual < h.nivelExigido)
    .sort((a, b) => {
      if (a.nivelAtual === 0 && b.nivelAtual !== 0) return 1;
      if (a.nivelAtual !== 0 && b.nivelAtual === 0) return -1;
      return b.nivelExigido - b.nivelAtual - (a.nivelExigido - a.nivelAtual);
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Minha Carreira</h1>
        <p className="text-sm text-gray-600 mt-2">
          Acompanhe sua jornada e o que precisa desenvolver para chegar onde quer
        </p>
      </div>

      {/* Tabs + conteúdo */}
      <div>
        <div className="border-b border-gray-200 mb-6 md:mb-8 -mx-4 md:mx-0">
          <div className="flex gap-3 md:gap-8 overflow-x-auto lg:overflow-x-visible scrollbar-hide px-4 md:px-0">
            {(['minha-jornada', 'proximo-passo'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap flex-shrink-0 inline-flex items-center gap-2 ${
                  activeTab === tab
                    ? 'border-[var(--brand-600)] text-[var(--brand-600)]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'minha-jornada' && 'Minha Jornada'}
                {tab === 'proximo-passo' && 'Próximo passo'}
              </button>
            ))}
          </div>
        </div>

        {/* Aba 1 — Minha Jornada */}
        {activeTab === 'minha-jornada' && (
          <div className="space-y-6">
            {/* Onde estou agora */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-500">Cargo atual</p>
                <p className="text-lg font-semibold text-gray-900">
                  {colaborador.cargoAtual} — {colaborador.senioridade}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Jornada: {colaborador.jornada} · {colaborador.tempoNoCargo} no cargo · Última
                  avaliação: {colaborador.ultimaAvaliacao}
                </p>
              </div>
            </div>

            {/* Jornada de Carreira */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Jornada de Carreira</h2>
              <p className="text-sm text-gray-600 mb-4">Indicadores de cobertura por nível</p>

              <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3 mb-5">
                <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  O progresso é calculado com base nas habilidades mapeadas na matriz da jornada.
                  Atingir 100% das habilidades não garante promoção — outros fatores são
                  considerados pela liderança.
                </p>
              </div>

              <div className="space-y-4">
                {cargosJornada.map((cargo) => {
                  const isAtual = cargo.atual;
                  const cobertura = calcularCoberturaCargo(
                    habilidadesColaboradorJornada,
                    cargo.matrizCargo
                  );
                  return (
                    <div
                      key={cargo.id}
                      className={`rounded-lg border p-4 transition-all ${
                        isAtual
                          ? 'bg-[var(--brand-50)] border-[var(--brand-200)]'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {cargo.nome}
                            {cargo.senioridade && ` - ${cargo.senioridade}`}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full mt-1 ${
                              isAtual
                                ? 'bg-[var(--brand-600)] text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {isAtual ? 'Cargo atual' : 'Referência para desenvolvimento'}
                          </span>
                        </div>
                      </div>
                      <div className="mb-2">
                        <p className="text-xs text-gray-600 mb-1.5">
                          <span className={cobertura.cor}>{cobertura.label}</span>
                          {' — '}{cobertura.percentual}% das habilidades mapeadas atendidas
                        </p>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className={`${cobertura.bgCor} h-1.5 rounded-full transition-all`}
                            style={{ width: `${cobertura.percentual}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Aba 2 — Próximo passo */}
        {activeTab === 'proximo-passo' && (
          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
              <p className="text-sm text-gray-500">Comparando com</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{proximoCargo.nome}</p>
              <p className="text-sm text-gray-500 mt-1">
                Próximo cargo na jornada {colaborador.jornada}
              </p>
            </div>

            <div className="bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-4 flex items-start gap-3 mb-6">
              <Info className="w-4 h-4 text-[var(--brand-600)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                O comparativo é baseado nas habilidades que você declarou nas autoavaliações.
                Habilidades não avaliadas aparecem como pendentes.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Habilidades com gap</h2>
              <p className="text-sm text-gray-500 mb-4">
                Habilidades onde seu nível está abaixo do exigido no cargo selecionado
              </p>

              {habilidadesComGapProximo.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  Você atende a todos os requisitos do cargo selecionado.
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Habilidade
                        </th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Competência
                        </th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Meu nível
                        </th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Necessário
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {habilidadesComGapProximo.map((h) => (
                        <tr key={h.habilidadeId}>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900">
                            {h.habilidade}
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-500">
                            {h.competencia}
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4">
                            {h.nivelAtualNome ? (
                              <span
                                className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white"
                                style={{ backgroundColor: getCorFromPeso(h.nivelAtual) }}
                              >
                                {h.nivelAtualNome}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400 italic">Não avaliada</span>
                            )}
                          </td>
                          <td className="px-3 md:px-6 py-3 md:py-4">
                            <span
                              className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: getCorFromPeso(h.nivelExigido) }}
                            >
                              {h.nivelExigidoNome}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
