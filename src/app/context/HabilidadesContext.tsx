import { createContext, useContext, useState, ReactNode } from 'react';
import { habilidadesData } from '../data/mockData';

export interface HabilidadeNivel {
  nivelId: string;
  criterio: string;
}

export interface Habilidade {
  id: string;
  nome: string;
  descricao: string;
  competencia: string;
  competenciaId: string;
  tipo: 'Técnica' | 'Comportamental';
  status: 'Ativa' | 'Desativada';
  niveis: HabilidadeNivel[];
}

interface HabilidadesContextType {
  habilidades: Habilidade[];
  addHabilidade: (data: Omit<Habilidade, 'id'>) => string;
  updateHabilidade: (id: string, data: Partial<Habilidade>) => void;
}

const HabilidadesContext = createContext<HabilidadesContextType | null>(null);

export function HabilidadesProvider({ children }: { children: ReactNode }) {
  const [habilidades, setHabilidades] = useState<Habilidade[]>(habilidadesData as Habilidade[]);

  function addHabilidade(data: Omit<Habilidade, 'id'>): string {
    const id = String(Date.now());
    setHabilidades(prev => [...prev, { ...data, id }]);
    return id;
  }

  function updateHabilidade(id: string, data: Partial<Habilidade>) {
    setHabilidades(prev => prev.map(h => h.id === id ? { ...h, ...data } : h));
  }

  return (
    <HabilidadesContext.Provider value={{ habilidades, addHabilidade, updateHabilidade }}>
      {children}
    </HabilidadesContext.Provider>
  );
}

export function useHabilidades() {
  const ctx = useContext(HabilidadesContext);
  if (!ctx) throw new Error('useHabilidades must be used within HabilidadesProvider');
  return ctx;
}
