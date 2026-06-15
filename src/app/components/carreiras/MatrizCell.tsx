import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { niveisDefaultData, getCorFromPeso } from '../../data/mockData';

export interface NivelAplicavel {
  id: string;
  nome: string;
  peso: number;
  criterio: string;
}

interface MatrizCellProps {
  nivel: string | null;
  onChange: (nivel: string | null) => void;
  niveisAplicaveis?: NivelAplicavel[];
}

const defaultNiveisAplicaveis: NivelAplicavel[] = niveisDefaultData
  .slice()
  .sort((a, b) => a.peso - b.peso)
  .map((n) => ({ id: n.id, nome: n.nome, peso: n.peso, criterio: '' }));

export function MatrizCell({ nivel, onChange, niveisAplicaveis }: MatrizCellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cellRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        cellRef.current &&
        !cellRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const opcoes = niveisAplicaveis
    ? [...niveisAplicaveis].sort((a, b) => a.peso - b.peso)
    : defaultNiveisAplicaveis;

  const isNotRequired = nivel === 'not_required';
  const nivelAtual = nivel && !isNotRequired
    ? opcoes.find((n) => n.nome === nivel) ?? null
    : null;
  const corAtual = nivelAtual ? getCorFromPeso(nivelAtual.peso) : null;

  const handleSelectNivel = (nomeNivel: string) => {
    onChange(nomeNivel);
    setIsOpen(false);
  };

  const handleRemoveNivel = () => { onChange(null); setIsOpen(false); };
  const handleSetNotRequired = () => { onChange('not_required'); setIsOpen(false); };

  return (
    <div className="relative">
      {!nivel ? (
        <div
          ref={cellRef}
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            w-full inline-flex items-center justify-center px-3 py-1 rounded-full cursor-pointer transition-all text-xs font-medium
            ${isHovered || isOpen
              ? 'border border-solid border-[#3B82F6] bg-[#EFF6FF] text-[#3B82F6]'
              : 'border border-dashed border-[#D1D5DB] bg-transparent text-[#9CA3AF]'
            }
          `}
          title="Clique para definir o nível"
          aria-label="Definir nível"
        >
          +
        </div>
      ) : isNotRequired ? (
        <div
          ref={cellRef}
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            w-full inline-flex items-center justify-center px-3 py-1 rounded-full cursor-pointer transition-all text-xs font-medium
            ${isHovered || isOpen
              ? 'bg-amber-100 border border-solid border-amber-400 text-amber-700'
              : 'bg-amber-50 border border-dashed border-amber-300 text-amber-500'
            }
          `}
          title="Não exigido neste cargo"
          aria-label="Não exigido neste cargo"
        >
          –
        </div>
      ) : (
        <div
          ref={cellRef}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full cursor-pointer rounded-lg border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all text-left"
          style={{ borderLeftWidth: 3, borderLeftColor: corAtual ?? '#9CA3AF' }}
          title={nivelAtual?.criterio ? `${nivelAtual.nome}: ${nivelAtual.criterio}` : `Nível: ${nivelAtual?.nome} — clique para alterar`}
        >
          <div className="px-2.5 py-2 space-y-0.5">
            <span className="block text-xs font-semibold leading-tight" style={{ color: corAtual ?? '#374151' }}>
              {nivelAtual?.nome}
            </span>
            {nivelAtual?.criterio && (
              <p className="text-xs text-gray-500 leading-snug line-clamp-3">
                {nivelAtual.criterio}
              </p>
            )}
            <span className="block text-[10px] text-gray-400 leading-tight">
              Progressão {nivelAtual?.peso}
            </span>
          </div>
        </div>
      )}

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-1 w-[200px] bg-white rounded-lg shadow-lg border border-[#E5E7EB] z-50 overflow-hidden"
          style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' }}
        >
          {opcoes.map((op, idx) => (
            <button
              key={op.id}
              onClick={() => handleSelectNivel(op.nome)}
              className={`w-full px-4 py-2.5 flex items-center gap-2 hover:bg-[#F3F4F6] transition-colors text-left ${
                idx < opcoes.length - 1 ? 'border-b border-[#F3F4F6]' : ''
              }`}
            >
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap text-white"
                style={{ backgroundColor: getCorFromPeso(op.peso) }}
              >
                {op.nome}
              </span>
              <span className="text-xs text-gray-400">{op.peso}</span>
            </button>
          ))}

          <div className="border-t border-[#E5E7EB]" />

          <button
            onClick={handleSetNotRequired}
            className="w-full px-4 py-2.5 flex items-center text-[#374151] text-sm hover:bg-[#FEF9C3] hover:text-[#92400E] transition-colors"
          >
            <span className="whitespace-nowrap">Não exigido neste cargo</span>
          </button>

          {nivel && (
            <>
              <div className="border-t border-[#E5E7EB]" />
              <button
                onClick={handleRemoveNivel}
                className="w-full px-4 py-2.5 flex items-center gap-2 text-[#6B7280] text-sm hover:bg-[#F3F4F6] transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="whitespace-nowrap">Remover nível</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
