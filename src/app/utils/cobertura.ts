import { niveisDefaultData } from '../data/mockData';

export interface HabilidadeColaborador {
  habilidadeId: string;
  nivelAtual: string; // 'Básico' | 'Intermediário' | 'Avançado' | 'Especialista'
}

export interface MatrizCargo {
  habilidadeId: string;
  nivelEsperado: string;
}

export interface ResultadoCobertura {
  percentual: number;
  label: string;
  cor: string;   // Tailwind text color class
  bgCor: string; // Tailwind bg color class (for progress bars)
}

function pesoNivel(nome: string): number {
  return niveisDefaultData.find(n => n.nome === nome)?.peso ?? 0;
}

// Retorna true se nivelAtual (peso) >= nivelEsperado (peso)
export function calcularCobertura(nivelAtual: number, nivelEsperado: number): boolean {
  return nivelAtual >= nivelEsperado;
}

export function calcularCoberturaCargo(
  habilidadesColaborador: HabilidadeColaborador[],
  matrizCargo: MatrizCargo[],
): ResultadoCobertura {
  if (matrizCargo.length === 0) {
    return { percentual: 0, label: 'Sem dados', cor: 'text-gray-500', bgCor: 'bg-gray-400' };
  }

  const mapaColaborador = new Map(
    habilidadesColaborador.map(h => [h.habilidadeId, pesoNivel(h.nivelAtual)])
  );

  const atendidas = matrizCargo.filter(req => {
    const pesoAtual = mapaColaborador.get(req.habilidadeId) ?? 0;
    return calcularCobertura(pesoAtual, pesoNivel(req.nivelEsperado));
  }).length;

  const percentual = Math.round((atendidas / matrizCargo.length) * 100);

  if (percentual >= 80) {
    return { percentual, label: 'Boa cobertura', cor: 'text-green-600', bgCor: 'bg-green-500' };
  }
  if (percentual >= 50) {
    return { percentual, label: 'Cobertura parcial', cor: 'text-yellow-600', bgCor: 'bg-yellow-500' };
  }
  return { percentual, label: 'Baixa cobertura', cor: 'text-red-600', bgCor: 'bg-red-500' };
}
