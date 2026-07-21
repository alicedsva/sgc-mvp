import { habilidadesCargoData, habilidadesData, getHabilidadesAvaliadasColaborador, getPesoFromNome } from '../data/mockData';
import type { NivelNome } from '../../data/schema';

// Sentinel de UI — 'Não avaliado' nunca é um valor real de
// HabilidadeCargo.nivelEsperado (que é NivelNome | 'not_required'), mas o
// cálculo de gap abaixo precisa comparar contra ele explicitamente.
export type NivelEsperadoComFallback = NivelNome | 'not_required' | 'Não avaliado';

export interface HabilidadeComGap {
  habilidadeId: string;
  nome: string;
  competencia: string;
  competenciaId: string;
  tipo: string;
  nivelAtual: NivelNome | 'Não avaliado';
  nivelEsperado: NivelEsperadoComFallback;
  gap: number;
  obrigatoria: boolean;
}

// Extraído de PerfilColaboradorPage.tsx (Admin > Perfis > perfil individual)
// para uso compartilhado — nunca duplicar esta lógica em outra tela.
export function calcularHabilidadesComGap(cargoId: string, colaboradorId: string): HabilidadeComGap[] {
  const habilidadesEsperadas = habilidadesCargoData.filter(hc => hc.cargoId === cargoId);
  const habilidadesAvaliadas = getHabilidadesAvaliadasColaborador(colaboradorId);

  return habilidadesEsperadas.map(he => {
    const habilidade = habilidadesData.find(h => h.id === he.habilidadeId);
    const nivelAtual = habilidadesAvaliadas.get(he.habilidadeId) ?? null;
    const nivelEsperado = he.nivelEsperado as NivelEsperadoComFallback;

    const nivelAtualNum = nivelAtual ? (nivelAtual === 'Não avaliado' ? 0 : getPesoFromNome(nivelAtual)) : 0;
    const nivelEsperadoNum = nivelEsperado === 'Não avaliado' ? 0 : getPesoFromNome(nivelEsperado);
    const gap = nivelAtualNum - nivelEsperadoNum;

    return {
      habilidadeId: he.habilidadeId,
      nome: habilidade?.nome || '',
      competencia: habilidade?.competencia || '',
      competenciaId: habilidade?.competenciaId ?? '',
      tipo: habilidade?.tipo || '',
      nivelAtual: (nivelAtual ?? 'Não avaliado') as NivelNome | 'Não avaliado',
      nivelEsperado,
      gap,
      obrigatoria: he.obrigatoria,
    };
  });
}

export interface Cobertura {
  percentual: number;
  classificacao: string;
  mensagem: string;
}

// Cobertura — binária por habilidade: só conta se nivelAtual >= nivelEsperado
// (gap >= 0), sem crédito parcial por estar perto do nível esperado.
export function calcularCobertura(habilidadesComGap: HabilidadeComGap[]): Cobertura {
  const atendidas = habilidadesComGap.filter(h => h.gap >= 0).length;
  const total = habilidadesComGap.length;
  const percentual = total > 0 ? Math.round((atendidas / total) * 100) : 0;

  let classificacao = '';
  let mensagem = '';
  if (percentual >= 91) {
    classificacao = 'Alta cobertura';
    mensagem = 'O colaborador atende todas as habilidades esperadas para este cargo.';
  } else if (percentual >= 71) {
    classificacao = 'Boa cobertura';
    mensagem = 'O colaborador atende a maior parte das habilidades esperadas para este cargo.';
  } else if (percentual >= 41) {
    classificacao = 'Em desenvolvimento';
    mensagem = 'O colaborador está desenvolvendo as habilidades esperadas para este cargo.';
  } else {
    classificacao = 'Baixa cobertura';
    mensagem = 'Ainda há muitas habilidades a desenvolver para este cargo.';
  }
  return { percentual, classificacao, mensagem };
}

export interface AderenciaGeral {
  percentual: number;
  mensagemCriticidade: string;
}

// Aderência geral — média ponderada e contínua: soma dos pesos do nível
// atual sobre soma dos pesos do nível esperado, com crédito parcial por
// estar perto do nível esperado mesmo sem atingi-lo (diferente de Cobertura).
export function calcularAderenciaGeral(habilidadesComGap: HabilidadeComGap[]): AderenciaGeral {
  const totalAtual = habilidadesComGap.reduce(
    (sum, h) => sum + (h.nivelAtual === 'Não avaliado' ? 0 : getPesoFromNome(h.nivelAtual)), 0
  );
  const totalEsperado = habilidadesComGap.reduce(
    (sum, h) => sum + (h.nivelEsperado === 'Não avaliado' ? 0 : getPesoFromNome(h.nivelEsperado)), 0
  );
  const percentual = totalEsperado > 0 ? Math.round((totalAtual / totalEsperado) * 100) : 0;

  const habilidadesCriticas = habilidadesComGap.filter(h => h.gap < 0 && h.obrigatoria);
  const habilidadesComGapNegativo = habilidadesComGap.filter(h => h.gap < 0);

  let mensagemCriticidade = '';
  if (habilidadesCriticas.length > 0) {
    mensagemCriticidade = 'Existem habilidades críticas abaixo do esperado para este colaborador.';
  } else if (habilidadesComGapNegativo.length > 0) {
    mensagemCriticidade = 'Algumas habilidades ainda são importantes para a evolução deste colaborador.';
  }

  return { percentual, mensagemCriticidade };
}
