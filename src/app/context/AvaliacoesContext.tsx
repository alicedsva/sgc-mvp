import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { avaliacoesData as avaliacoesIniciais, Avaliacao, RespostaAvaliacao as RespostaAvaliacaoItem } from '../data/mockData';

interface AvaliacoesContextType {
  avaliacoes: Avaliacao[];
  adicionarAvaliacao: (avaliacao: Avaliacao) => void;
  atualizarAvaliacao: (avaliacaoId: string, dadosAtualizados: Partial<Avaliacao>) => void;
  responderAvaliacao: (
    avaliacaoId: string,
    colaboradorId: string,
    respostas: RespostaAvaliacaoItem[],
    enviar: boolean
  ) => void;
}

const AvaliacoesContext = createContext<AvaliacoesContextType | null>(null);

const STORAGE_KEY = 'carreiras_avaliacoes';
const VERSION_KEY = 'carreiras_avaliacoes_mock_version';
// Primeira versão desta chave — introduzida em 2026-07-21 junto com a
// migração de Avaliações (Admin) para dado real via Context. Sempre que
// mockData.ts sofrer alteração estrutural nas avaliações, incremente esta
// versão para descartar dados antigos salvos no navegador (mesmo padrão de
// CarreirasContext.tsx).
const MOCK_DATA_VERSION = '2026-07-21-1';

function loadFromStorage(): Avaliacao[] {
  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    if (storedVersion !== MOCK_DATA_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, MOCK_DATA_VERSION);
      return avaliacoesIniciais;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (error) {
    console.error('Erro ao carregar avaliações do localStorage:', error);
  }
  return avaliacoesIniciais;
}

export function AvaliacoesProvider({ children }: { children: ReactNode }) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>(loadFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(avaliacoes));
    } catch (error) {
      console.error('Erro ao salvar avaliações no localStorage:', error);
    }
  }, [avaliacoes]);

  const adicionarAvaliacao = (novaAvaliacao: Avaliacao) => {
    // Inserida no início — mesma convenção de adicionarCarreira (CarreirasContext).
    setAvaliacoes((prev) => [novaAvaliacao, ...prev]);
  };

  const atualizarAvaliacao = (avaliacaoId: string, dadosAtualizados: Partial<Avaliacao>) => {
    setAvaliacoes((prev) =>
      prev.map((av) => (av.id === avaliacaoId ? { ...av, ...dadosAtualizados } : av))
    );
  };

  // Atualiza imutavelmente o participante daquele colaborador na avaliação
  // indicada — nunca muta avaliacoesData original. status vira 'Concluída'
  // quando enviar=true, 'Em andamento' quando é só rascunho.
  function responderAvaliacao(
    avaliacaoId: string,
    colaboradorId: string,
    respostas: RespostaAvaliacaoItem[],
    enviar: boolean
  ) {
    setAvaliacoes(prev => prev.map(av => {
      if (av.id !== avaliacaoId) return av;
      return {
        ...av,
        participantes: av.participantes.map(p =>
          p.colaboradorId === colaboradorId
            ? { ...p, status: enviar ? 'Concluída' as const : 'Em andamento' as const, respostas }
            : p
        ),
      };
    }));
  }

  return (
    <AvaliacoesContext.Provider
      value={{ avaliacoes, adicionarAvaliacao, atualizarAvaliacao, responderAvaliacao }}
    >
      {children}
    </AvaliacoesContext.Provider>
  );
}

export function useAvaliacoes() {
  const ctx = useContext(AvaliacoesContext);
  if (!ctx) throw new Error('useAvaliacoes must be used within AvaliacoesProvider');
  return ctx;
}
