import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { competenciasData, Competencia } from '../data/mockData';

interface CompetenciasContextType {
  competencias: Competencia[];
  addCompetencia: (data: Omit<Competencia, 'id'>) => string;
  updateCompetencia: (id: string, data: Partial<Competencia>) => void;
}

const CompetenciasContext = createContext<CompetenciasContextType | null>(null);

const STORAGE_KEY = 'habilidades_competencias';
const VERSION_KEY = 'habilidades_competencias_mock_version';
// Mesmo padrão de AvaliacoesContext.tsx: sempre que mockData.ts sofrer
// alteração estrutural em competenciasData, incremente esta versão para
// descartar dados antigos salvos no navegador.
const MOCK_DATA_VERSION = '2026-08-26-1';

function loadFromStorage(): Competencia[] {
  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    if (storedVersion !== MOCK_DATA_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, MOCK_DATA_VERSION);
      return competenciasData;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (error) {
    console.error('Erro ao carregar competências do localStorage:', error);
  }
  return competenciasData;
}

export function CompetenciasProvider({ children }: { children: ReactNode }) {
  const [competencias, setCompetencias] = useState<Competencia[]>(loadFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(competencias));
    } catch (error) {
      console.error('Erro ao salvar competências no localStorage:', error);
    }
  }, [competencias]);

  function addCompetencia(data: Omit<Competencia, 'id'>): string {
    const id = `comp${Date.now()}`;
    const nova = { ...data, id };
    setCompetencias(prev => [nova, ...prev]);
    return id;
  }

  function updateCompetencia(id: string, data: Partial<Competencia>) {
    setCompetencias(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  }

  return (
    <CompetenciasContext.Provider value={{ competencias, addCompetencia, updateCompetencia }}>
      {children}
    </CompetenciasContext.Provider>
  );
}

export function useCompetencias() {
  const ctx = useContext(CompetenciasContext);
  if (!ctx) throw new Error('useCompetencias must be used within CompetenciasProvider');
  return ctx;
}
