import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

const STORAGE_KEY = 'habilidades_habilidades';
const VERSION_KEY = 'habilidades_habilidades_mock_version';
// Mesmo padrão de AvaliacoesContext.tsx: sempre que mockData.ts sofrer
// alteração estrutural em habilidadesData, incremente esta versão para
// descartar dados antigos salvos no navegador.
const MOCK_DATA_VERSION = '2026-08-26-1';

function loadFromStorage(): Habilidade[] {
  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    if (storedVersion !== MOCK_DATA_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, MOCK_DATA_VERSION);
      return habilidadesData as Habilidade[];
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (error) {
    console.error('Erro ao carregar habilidades do localStorage:', error);
  }
  return habilidadesData as Habilidade[];
}

export function HabilidadesProvider({ children }: { children: ReactNode }) {
  const [habilidades, setHabilidades] = useState<Habilidade[]>(loadFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habilidades));
    } catch (error) {
      console.error('Erro ao salvar habilidades no localStorage:', error);
    }
  }, [habilidades]);

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
