import { useMemo, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { habilidadesData, niveisDefaultData, getCorFromPeso } from '../../data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Cargo {
  id: string;
  cargoRM: string;
}

interface HabilidadeCargo {
  id: string;
  cargoId: string;
  habilidadeId: string;
  nivelEsperado: string;
}

interface MatrizProgressaoProps {
  cargos: Cargo[];
  habilidadesCargo: HabilidadeCargo[];
}

interface HabilidadeMatriz {
  id: string;
  nome: string;
  categoria: string;
  niveis: Record<string, string | null>; // cargoId -> nivel
}

const nivelPesoMap: Record<string, number> = Object.fromEntries(
  niveisDefaultData.map(n => [n.nome, n.peso])
);

export function MatrizProgressao({ cargos, habilidadesCargo }: MatrizProgressaoProps) {
  const [buscaHabilidade, setBuscaHabilidade] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');

  // Obter todas as categorias únicas
  const categorias = useMemo(() => {
    const cats = new Set(habilidadesData.map(h => h.competencia));
    return Array.from(cats).sort();
  }, []);

  // Construir matriz de habilidades
  const matrizHabilidades = useMemo(() => {
    // Coletar todas as habilidades únicas usadas
    const habilidadesIds = new Set<string>();
    habilidadesCargo.forEach(hc => habilidadesIds.add(hc.habilidadeId));

    const matriz: HabilidadeMatriz[] = [];

    habilidadesIds.forEach(habId => {
      const hab = habilidadesData.find(h => h.id === habId);
      if (!hab) return;

      const niveis: Record<string, string | null> = {};

      // Para cada cargo, encontrar o nível da habilidade
      cargos.forEach(cargo => {
        const habilidadeDoCargo = habilidadesCargo.find(
          hc => hc.cargoId === cargo.id && hc.habilidadeId === habId
        );
        niveis[cargo.id] = habilidadeDoCargo?.nivelEsperado || null;
      });

      matriz.push({
        id: habId,
        nome: hab.nome,
        categoria: hab.competencia,
        niveis,
      });
    });

    // Ordenar por categoria e depois por nome
    return matriz.sort((a, b) => {
      if (a.categoria !== b.categoria) {
        return a.categoria.localeCompare(b.categoria);
      }
      return a.nome.localeCompare(b.nome);
    });
  }, [cargos, habilidadesCargo]);

  // Filtrar habilidades
  const habilidadesFiltradas = useMemo(() => {
    let filtradas = matrizHabilidades;

    // Filtrar por busca
    if (buscaHabilidade.trim()) {
      const busca = buscaHabilidade.toLowerCase();
      filtradas = filtradas.filter(h =>
        h.nome.toLowerCase().includes(busca) ||
        h.categoria.toLowerCase().includes(busca)
      );
    }

    // Filtrar por categoria
    if (categoriaFiltro !== 'todas') {
      filtradas = filtradas.filter(h => h.categoria === categoriaFiltro);
    }

    return filtradas;
  }, [matrizHabilidades, buscaHabilidade, categoriaFiltro]);

  // Função para abreviar nível
  const getNivelAbrev = (nivel: string | null) => {
    if (!nivel) return '—';

    const abrev: Record<string, string> = {
      'Básico': 'Bás',
      'Intermediário': 'Int',
      'Avançado': 'Ava',
      'Especialista': 'Esp',
    };
    return abrev[nivel] || nivel.substring(0, 3);
  };

  if (cargos.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">Nenhum cargo adicionado</h3>
          <p className="text-sm text-gray-600">
            Adicione cargos na aba Configurar para visualizar a progressão.
          </p>
        </div>
      </div>
    );
  }

  if (matrizHabilidades.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">Nenhuma habilidade configurada</h3>
          <p className="text-sm text-gray-600">
            Configure habilidades nos cargos na aba Configurar para visualizar a progressão.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Legenda - movida para o topo */}
      <div className="mb-4 flex items-center gap-6 text-xs text-gray-600">
        <span className="font-medium">Legenda:</span>
        {niveisDefaultData.map(n => (
          <div key={n.id} className="flex items-center gap-1">
            <span
              className="inline-flex px-2 py-1 text-xs font-medium rounded-full text-white"
              style={{ backgroundColor: getCorFromPeso(n.peso) }}
            >
              {getNivelAbrev(n.nome)}
            </span>
            <span>{n.nome}</span>
          </div>
        ))}
      </div>

      {/* Controles */}
      <div className="mb-6 flex items-center gap-4">
        {/* Busca */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar habilidade..."
            value={buscaHabilidade}
            onChange={(e) => setBuscaHabilidade(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-500)] focus:border-[var(--brand-500)] outline-none"
          />
        </div>

        {/* Filtro de categoria */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
            <SelectTrigger className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[var(--brand-500)] focus:border-[var(--brand-500)] outline-none">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as categorias</SelectItem>
              {categorias.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Matriz */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 min-w-[200px]">
                  Habilidade
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider bg-gray-50 min-w-[120px]">
                  Categoria
                </th>
                {cargos.map((cargo, index) => (
                  <th
                    key={cargo.id}
                    className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider bg-gray-50 min-w-[100px]"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs text-gray-500">#{index + 1}</span>
                      <span className="font-medium text-gray-900 text-xs">{cargo.cargoRM}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {habilidadesFiltradas.length > 0 ? (
                habilidadesFiltradas.map((habilidade) => (
                  <tr key={habilidade.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 sticky left-0 bg-white z-10">
                      <div className="text-sm font-medium text-gray-900">{habilidade.nome}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-600">{habilidade.categoria}</span>
                    </td>
                    {cargos.map(cargo => {
                      const nivel = habilidade.niveis[cargo.id];
                      return (
                        <td key={cargo.id} className="px-4 py-3 text-center">
                          <span
                            className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium rounded-full min-w-[48px]"
                            style={
                              nivel
                                ? { backgroundColor: getCorFromPeso(nivelPesoMap[nivel] ?? 1), color: 'white' }
                                : { backgroundColor: '#E5E7EB', color: '#9CA3AF' }
                            }
                            title={nivel || 'Não configurado'}
                          >
                            {getNivelAbrev(nivel)}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2 + cargos.length} className="px-4 py-12 text-center">
                    <div className="text-sm text-gray-600">
                      Nenhuma habilidade encontrada com os filtros aplicados.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Indicador de scroll horizontal - fade gradient */}
        <div className="absolute top-0 right-0 bottom-0 w-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
      </div>
    </div>
  );
}
