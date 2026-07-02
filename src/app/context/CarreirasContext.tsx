import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jornadasData as jornadasIniciais, cargosData as cargosIniciais, habilidadesCargoData as habilidadesIniciais, colaboradoresData } from '../data/mockData';

interface Jornada {
  id: string;
  carreiraId: string;
  nome: string;
  carreira: string;
  tipo: string;
  quantidadeCargos: number;
  status: string;
}

interface Cargo {
  id: string;
  jornadaId: string;
  cargoRM: string;
  ordem: string;
  habilidadesConfiguradas: number;
  status: string;
}

interface HabilidadeCargo {
  id: string;
  cargoId: string;
  habilidadeId: string;
  nivelEsperado: string;
}

interface Vinculo {
  colaboradorId: string;
  jornadaId: string;
}

interface CarreirasContextType {
  jornadas: Jornada[];
  cargos: Cargo[];
  habilidadesCargo: HabilidadeCargo[];
  adicionarJornada: (jornada: Jornada) => void;
  atualizarJornada: (jornadaId: string, dadosAtualizados: Partial<Jornada>) => void;
  removerJornada: (jornadaId: string) => void;
  adicionarCargo: (cargo: Cargo) => void;
  atualizarCargo: (cargoId: string, dadosAtualizados: Partial<Cargo>) => void;
  removerCargo: (cargoId: string) => void;
  atualizarCargosJornada: (jornadaId: string, novosCargos: Cargo[]) => void;
  atualizarHabilidadesCargo: (cargoId: string, novasHabilidades: HabilidadeCargo[]) => void;
  vinculos: Vinculo[];
  vincularColaborador: (jornadaId: string, colaboradorId: string) => void;
  desvincularColaborador: (jornadaId: string, colaboradorId: string) => void;
  getColaboradoresPorJornada: (jornadaId: string) => string[];
}

const CarreirasContext = createContext<CarreirasContextType | undefined>(undefined);

// Chaves do localStorage
const STORAGE_KEYS = {
  JORNADAS: 'carreiras_jornadas',
  CARGOS: 'carreiras_cargos',
  HABILIDADES_CARGO: 'carreiras_habilidades_cargo',
  VINCULOS: 'carreiras_vinculos',
};

// Função para gerar IDs únicos e consistentes
let idCounter = Date.now();
export function generateId(prefix: string): string {
  idCounter++;
  return `${prefix}-${idCounter}`;
}

// Carregar dados do localStorage ou usar dados iniciais
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error(`Erro ao carregar ${key} do localStorage:`, error);
  }
  return defaultValue;
}

// Salvar dados no localStorage
function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Erro ao salvar ${key} no localStorage:`, error);
  }
}

// IMPORTANTE: sempre que mockData.ts sofrer
// alteração estrutural (novos cargos, jornadas,
// matriz de habilidades, vínculos), incremente
// esta versão. Isso força o sistema a descartar
// dados antigos salvos no navegador e recarregar
// do mockData.ts atualizado. Sem isso, mudanças
// no código não aparecem na interface para
// usuários com dados antigos no localStorage.
const MOCK_DATA_VERSION = '2026-06-24-4';
const VERSION_KEY = 'carreiras_mock_version';

function shouldResetStorage(): boolean {
  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    return storedVersion !== MOCK_DATA_VERSION;
  } catch {
    return false;
  }
}

export function CarreirasProvider({ children }: { children: ReactNode }) {
  // Verificar versão e limpar localStorage desatualizado antes de qualquer leitura
  if (shouldResetStorage()) {
    localStorage.removeItem(STORAGE_KEYS.JORNADAS);
    localStorage.removeItem(STORAGE_KEYS.CARGOS);
    localStorage.removeItem(STORAGE_KEYS.HABILIDADES_CARGO);
    localStorage.removeItem(STORAGE_KEYS.VINCULOS);
    localStorage.setItem(VERSION_KEY, MOCK_DATA_VERSION);
  }

  // Carregar do localStorage ou usar dados iniciais
  const [jornadas, setJornadas] = useState<Jornada[]>(() =>
    loadFromStorage(STORAGE_KEYS.JORNADAS, jornadasIniciais)
  );
  const [cargos, setCargos] = useState<Cargo[]>(() =>
    loadFromStorage(STORAGE_KEYS.CARGOS, cargosIniciais)
  );
  const [habilidadesCargo, setHabilidadesCargo] = useState<HabilidadeCargo[]>(() =>
    loadFromStorage(STORAGE_KEYS.HABILIDADES_CARGO, habilidadesIniciais)
  );
  const [vinculos, setVinculos] = useState<Vinculo[]>(() =>
    loadFromStorage(
      STORAGE_KEYS.VINCULOS,
      (colaboradoresData as Array<{ id: string; jornadaId?: string }>)
        .filter(c => c.jornadaId !== undefined)
        .map(c => ({ colaboradorId: c.id, jornadaId: c.jornadaId! }))
    )
  );

  // Persistir jornadas no localStorage sempre que mudarem
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.JORNADAS, jornadas);
  }, [jornadas]);

  // Persistir cargos no localStorage sempre que mudarem
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CARGOS, cargos);
  }, [cargos]);

  // Persistir habilidades no localStorage sempre que mudarem
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.HABILIDADES_CARGO, habilidadesCargo);
  }, [habilidadesCargo]);

  // Persistir vínculos no localStorage sempre que mudarem
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.VINCULOS, vinculos);
  }, [vinculos]);

  const adicionarJornada = (novaJornada: Jornada) => {
    setJornadas((prev) => [...prev, novaJornada]);
  };

  const atualizarJornada = (jornadaId: string, dadosAtualizados: Partial<Jornada>) => {
    setJornadas((prevJornadas) =>
      prevJornadas.map((j) =>
        j.id === jornadaId ? { ...j, ...dadosAtualizados } : j
      )
    );
  };

  const removerJornada = (jornadaId: string) => {
    setJornadas((prevJornadas) => prevJornadas.filter((j) => j.id !== jornadaId));
    // Remover cargos associados
    const cargosParaRemover = cargos.filter((c) => c.jornadaId === jornadaId);
    setCargos((prevCargos) => prevCargos.filter((c) => c.jornadaId !== jornadaId));
    // Remover habilidades dos cargos removidos
    const idsCargoRemovidos = cargosParaRemover.map((c) => c.id);
    setHabilidadesCargo((prevHabilidades) =>
      prevHabilidades.filter((h) => !idsCargoRemovidos.includes(h.cargoId))
    );
  };

  const adicionarCargo = (novoCargo: Cargo) => {
    setCargos((prev) => [...prev, novoCargo]);
  };

  const atualizarCargo = (cargoId: string, dadosAtualizados: Partial<Cargo>) => {
    setCargos((prevCargos) =>
      prevCargos.map((c) =>
        c.id === cargoId ? { ...c, ...dadosAtualizados } : c
      )
    );
  };

  const removerCargo = (cargoId: string) => {
    setCargos((prevCargos) => prevCargos.filter((c) => c.id !== cargoId));
    setHabilidadesCargo((prevHabilidades) => prevHabilidades.filter((h) => h.cargoId !== cargoId));
  };

  const atualizarCargosJornada = (jornadaId: string, novosCargos: Cargo[]) => {
    setCargos((prevCargos) => {
      // Remover cargos antigos da jornada
      const cargosFiltrados = prevCargos.filter(c => c.jornadaId !== jornadaId);
      // Adicionar novos cargos
      return [...cargosFiltrados, ...novosCargos];
    });

    // Atualizar quantidade de cargos na jornada
    setJornadas((prevJornadas) =>
      prevJornadas.map((j) =>
        j.id === jornadaId ? { ...j, quantidadeCargos: novosCargos.length } : j
      )
    );
  };

  const atualizarHabilidadesCargo = (cargoId: string, novasHabilidades: HabilidadeCargo[]) => {
    setHabilidadesCargo((prevHabilidades) => {
      // Remover habilidades antigas do cargo
      const habilidadesFiltradas = prevHabilidades.filter(h => h.cargoId !== cargoId);
      // Adicionar novas habilidades
      return [...habilidadesFiltradas, ...novasHabilidades];
    });

    // Atualizar status e contagem de habilidades do cargo
    setCargos((prevCargos) =>
      prevCargos.map((c) =>
        c.id === cargoId
          ? {
              ...c,
              habilidadesConfiguradas: novasHabilidades.length,
              status: novasHabilidades.length > 0 ? 'Configurado' : 'Pendente',
            }
          : c
      )
    );
  };

  const vincularColaborador = (jornadaId: string, colaboradorId: string) => {
    setVinculos(prev => {
      if (prev.some(v => v.jornadaId === jornadaId && v.colaboradorId === colaboradorId)) return prev;
      return [...prev, { colaboradorId, jornadaId }];
    });
  };

  const desvincularColaborador = (jornadaId: string, colaboradorId: string) => {
    setVinculos(prev => prev.filter(v => !(v.jornadaId === jornadaId && v.colaboradorId === colaboradorId)));
  };

  const getColaboradoresPorJornada = (jornadaId: string): string[] =>
    vinculos.filter(v => v.jornadaId === jornadaId).map(v => v.colaboradorId);

  return (
    <CarreirasContext.Provider
      value={{
        jornadas,
        cargos,
        habilidadesCargo,
        adicionarJornada,
        atualizarJornada,
        removerJornada,
        adicionarCargo,
        atualizarCargo,
        removerCargo,
        atualizarCargosJornada,
        atualizarHabilidadesCargo,
        vinculos,
        vincularColaborador,
        desvincularColaborador,
        getColaboradoresPorJornada,
      }}
    >
      {children}
    </CarreirasContext.Provider>
  );
}

export function useCarreiras() {
  const context = useContext(CarreirasContext);
  if (!context) {
    throw new Error('useCarreiras must be used within CarreirasProvider');
  }
  return context;
}