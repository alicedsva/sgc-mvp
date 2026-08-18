import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Check } from 'lucide-react';
import { ToggleSwitch } from '../ui/ToggleSwitch';

interface ColaboradorItem {
  id: string;
  nome: string;
  gerencia: string;
}

interface SeletorGerenciaGranularProps {
  gerencias: string[];
  colaboradores: ColaboradorItem[];
  selecionados: Set<string>;
  onChangeSelecionados: (next: Set<string>) => void;
  /** Gerências marcadas para auto-inclusão de novos colaboradores — só tem efeito visível quando a gerência está INTEIRA selecionada (ver gerenciasComAutoInclusao no schema). */
  autoInclusao: Set<string>;
  onChangeAutoInclusao: (next: Set<string>) => void;
  className?: string;
}

// Duas colunas — gerências à esquerda (estado tri-state: toda/parcial/
// nenhuma) e colaboradores da gerência ativa à direita — mesmo SHELL visual
// de ColaboradoresSelectionModal.tsx (busca, "Selecionar todos"), mas não é
// reuso direto: aqui a seleção é em 3 níveis (grupo inteiro/parcial/
// nenhum), não "vinculado (travado) vs disponível", que aquele componente
// não tem. Sem chrome de modal — embeddable dentro do wizard de avaliação
// (Caminho "Por Público-alvo"). O contador de selecionados não é renderizado
// aqui — fica a cargo de quem usa o componente (FormularioAvaliacao.tsx
// mostra "X colaboradores selecionados" na mesma linha do label, mesmo
// padrão de HabilidadesMasterDetail/etapa Habilidades).
export function SeletorGerenciaGranular({
  gerencias,
  colaboradores,
  selecionados,
  onChangeSelecionados,
  autoInclusao,
  onChangeAutoInclusao,
  className = '',
}: SeletorGerenciaGranularProps) {
  const [gerenciaAtiva, setGerenciaAtiva] = useState(gerencias[0] ?? '');
  const [searchTerm, setSearchTerm] = useState('');

  const colaboradoresPorGerencia = useMemo(() => {
    const grupos: Record<string, ColaboradorItem[]> = {};
    colaboradores.forEach((c) => {
      if (!grupos[c.gerencia]) grupos[c.gerencia] = [];
      grupos[c.gerencia].push(c);
    });
    return grupos;
  }, [colaboradores]);

  const colaboradoresGerenciaAtiva = colaboradoresPorGerencia[gerenciaAtiva] || [];
  const colaboradoresFiltrados = useMemo(() => {
    if (!searchTerm.trim()) return colaboradoresGerenciaAtiva;
    const q = searchTerm.toLowerCase();
    return colaboradoresGerenciaAtiva.filter((c) => c.nome.toLowerCase().includes(q));
  }, [colaboradoresGerenciaAtiva, searchTerm]);

  const toggleColaborador = (id: string) => {
    const next = new Set(selecionados);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChangeSelecionados(next);
  };

  const estadoGerencia = (gerencia: string): 'toda' | 'parcial' | 'nenhuma' => {
    const habs = colaboradoresPorGerencia[gerencia] || [];
    if (habs.length === 0) return 'nenhuma';
    const marcados = habs.filter((c) => selecionados.has(c.id)).length;
    if (marcados === 0) return 'nenhuma';
    if (marcados === habs.length) return 'toda';
    return 'parcial';
  };

  const toggleGerenciaInteira = (gerencia: string) => {
    const habs = colaboradoresPorGerencia[gerencia] || [];
    const estado = estadoGerencia(gerencia);
    const next = new Set(selecionados);
    habs.forEach((c) => {
      if (estado === 'toda') next.delete(c.id);
      else next.add(c.id);
    });
    onChangeSelecionados(next);
    // Gerência deixou de estar inteira selecionada — auto-inclusão não faz
    // mais sentido sem o grupo completo marcado.
    if (estado === 'toda' && autoInclusao.has(gerencia)) {
      const nextAuto = new Set(autoInclusao);
      nextAuto.delete(gerencia);
      onChangeAutoInclusao(nextAuto);
    }
  };

  const toggleAutoInclusao = (gerencia: string) => {
    const next = new Set(autoInclusao);
    if (next.has(gerencia)) next.delete(gerencia);
    else next.add(gerencia);
    onChangeAutoInclusao(next);
  };

  const checkboxRefs = useRef<Record<string, HTMLInputElement | null>>({});
  useEffect(() => {
    gerencias.forEach((g) => {
      const el = checkboxRefs.current[g];
      if (el) el.indeterminate = estadoGerencia(g) === 'parcial';
    });
  });

  const gerenciaAtivaEstado = estadoGerencia(gerenciaAtiva);

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar colaboradores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent outline-none bg-white"
          />
        </div>
      </div>

      <div className="flex flex-1 min-h-0 border border-gray-200 rounded-lg overflow-hidden">
        {/* Coluna esquerda — gerências, tri-state */}
        <div className="w-56 flex-shrink-0 border-r border-gray-200 overflow-y-auto">
          {gerencias.map((g) => {
            const estado = estadoGerencia(g);
            const total = (colaboradoresPorGerencia[g] || []).length;
            const marcados = (colaboradoresPorGerencia[g] || []).filter((c) => selecionados.has(c.id)).length;
            const isActive = g === gerenciaAtiva;
            return (
              <div
                key={g}
                className={`flex items-center gap-2 px-3 py-2 text-sm border-l-2 transition-colors ${
                  isActive
                    ? 'bg-[var(--brand-50)] text-[var(--brand-700)] border-[var(--brand-600)] font-medium'
                    : 'text-gray-700 hover:bg-gray-50 border-transparent'
                }`}
              >
                <input
                  ref={(el) => { checkboxRefs.current[g] = el; }}
                  type="checkbox"
                  checked={estado === 'toda'}
                  onChange={() => toggleGerenciaInteira(g)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 text-[var(--brand-600)] border-gray-300 rounded focus:ring-2 focus:ring-[var(--brand-500)] flex-shrink-0"
                  title="Selecionar gerência inteira"
                />
                <span
                  onClick={() => setGerenciaAtiva(g)}
                  className="flex-1 truncate cursor-pointer"
                >
                  {g}
                </span>
                <span
                  onClick={() => setGerenciaAtiva(g)}
                  className={`text-xs tabular-nums flex-shrink-0 cursor-pointer ${
                    marcados > 0 ? 'text-[var(--brand-600)] font-medium' : 'text-gray-400'
                  }`}
                >
                  {marcados > 0 ? `${marcados}/${total}` : total}
                </span>
              </div>
            );
          })}
        </div>

        {/* Coluna direita — colaboradores da gerência ativa */}
        <div className="flex-1 overflow-y-auto p-4">
          {gerenciaAtiva && (
            <>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{gerenciaAtiva}</p>
                <button
                  type="button"
                  onClick={() => toggleGerenciaInteira(gerenciaAtiva)}
                  className="text-xs font-medium text-[var(--brand-600)] hover:text-[var(--brand-700)]"
                >
                  {gerenciaAtivaEstado === 'toda' ? 'Limpar seleção' : 'Selecionar todos'}
                </button>
              </div>

              {gerenciaAtivaEstado === 'toda' && (
                <div className="flex items-start gap-3 bg-[var(--brand-50)] border border-[var(--brand-100)] rounded-lg p-3 mb-3">
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">Incluir automaticamente novos colaboradores desta gerência</p>
                    <p className="text-xs text-gray-500 mt-0.5">Colaboradores que entrarem nesta gerência depois da criação da avaliação também serão incluídos automaticamente como participantes.</p>
                  </div>
                  <ToggleSwitch
                    checked={autoInclusao.has(gerenciaAtiva)}
                    onChange={() => toggleAutoInclusao(gerenciaAtiva)}
                    tone="neutral"
                  />
                </div>
              )}

              {colaboradoresFiltrados.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm text-gray-400">
                    {searchTerm ? 'Nenhum colaborador encontrado' : 'Nenhum colaborador nesta gerência'}
                  </p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {colaboradoresFiltrados.map((c) => {
                    const isChecked = selecionados.has(c.id);
                    return (
                      <div
                        key={c.id}
                        onClick={() => toggleColaborador(c.id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                          isChecked ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                            isChecked ? 'bg-[var(--brand-600)] border-[var(--brand-600)]' : 'border-gray-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="flex-1 text-sm text-gray-900">{c.nome}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
