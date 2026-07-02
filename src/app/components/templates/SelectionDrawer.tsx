import { ReactNode, useState } from 'react';
import { X, Search } from 'lucide-react';

export interface SelectionItem {
  id: string;
  label: string;
  sublabel?: string;
  metadata?: any;
}

interface SelectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  items: SelectionItem[];
  selectedIds?: string[];
  onConfirm: (selectedIds: string[]) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  confirmLabel?: string;
  children?: ReactNode; // Para controles adicionais (ex: seletor de nível)
}

export function SelectionDrawer({
  isOpen,
  onClose,
  title,
  description,
  items,
  selectedIds: initialSelectedIds = [],
  onConfirm,
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'Nenhum item disponível',
  confirmLabel = 'Adicionar selecionados',
  children,
}: SelectionDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);

  if (!isOpen) return null;

  // Filtrar itens pela busca
  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sublabel?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle seleção
  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Confirmar seleção
  const handleConfirm = () => {
    onConfirm(selectedIds);
    handleClose();
  };

  // Fechar e resetar
  const handleClose = () => {
    setSearchQuery('');
    setSelectedIds([]);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 ml-0 md:ml-20 lg:ml-64 mt-16 bg-black/20 z-40 transition-opacity duration-200 ease-out"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-full md:w-[35%] md:max-w-xl md:min-w-[400px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-white">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900 truncate">{title}</h2>
            {description && (
              <p className="text-xs text-gray-600 mt-1">{description}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search */}
          <div className="px-4 md:px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[var(--brand-500)] focus:border-[var(--brand-500)] outline-none"
              />
            </div>

            {/* Controles adicionais (ex: seletor de nível) */}
            {children && (
              <div className="mt-3">
                {children}
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto">
            {filteredItems.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredItems.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  
                  return (
                    <label
                      key={item.id}
                      className={`flex items-center gap-3 px-4 md:px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                        isSelected ? 'bg-[var(--brand-50)]' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(item.id)}
                        className="w-4 h-4 text-[var(--brand-600)] rounded focus:ring-2 focus:ring-[var(--brand-500)]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{item.label}</div>
                        {item.sublabel && (
                          <div className="text-xs text-gray-500 truncate">{item.sublabel}</div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-8">
                <p className="text-sm text-gray-500">{emptyMessage}</p>
              </div>
            )}
          </div>

          {/* Counter */}
          {selectedIds.length > 0 && (
            <div className="px-4 md:px-6 py-3 bg-blue-50 border-t border-blue-200">
              <p className="text-sm font-medium text-blue-900">
                {selectedIds.length} {selectedIds.length === 1 ? 'item selecionado' : 'itens selecionados'}
              </p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="px-4 md:px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selectedIds.length === 0}
              className="flex-1 px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
