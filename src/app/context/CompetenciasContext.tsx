import { createContext, useContext, useState, ReactNode } from 'react';
import { competenciasData, Competencia } from '../data/mockData';

interface CompetenciasContextType {
  competencias: Competencia[];
  addCompetencia: (data: Omit<Competencia, 'id'>) => string;
  updateCompetencia: (id: string, data: Partial<Competencia>) => void;
}

const CompetenciasContext = createContext<CompetenciasContextType | null>(null);

export function CompetenciasProvider({ children }: { children: ReactNode }) {
  const [competencias, setCompetencias] = useState<Competencia[]>(competenciasData);

  function addCompetencia(data: Omit<Competencia, 'id'>): string {
    const id = `comp${Date.now()}`;
    const nova = { ...data, id };
    setCompetencias(prev => [nova, ...prev]);
    competenciasData.push(nova); // sincroniza array estático para getCompetenciaNome
    return id;
  }

  function updateCompetencia(id: string, data: Partial<Competencia>) {
    setCompetencias(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    const index = competenciasData.findIndex(c => c.id === id);
    if (index !== -1) {
      competenciasData[index] = { ...competenciasData[index], ...data };
    }
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
