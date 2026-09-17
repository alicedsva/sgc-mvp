import { ReactNode, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Table, Column, InlineAction, PaginationConfig } from '../ui/Table';
import { EmptyState } from '../ui/EmptyState';
import { ChipFiltro } from '../ui/ChipFiltro';

export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'checkbox';
  options?: { value: string; label: string }[];
}

interface ListingPageProps {
  title?: string;
  subtitle?: string;
  primaryAction?: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  };
  columns: Column[];
  data: any[];
  actions?: InlineAction[];
  statusFilter?: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
  };
  emptyState?: {
    icon: ReactNode;
    title: string;
    description: string;
  };
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  pagination?: PaginationConfig;
  onRowClick?: (row: any) => void;
  /**
   * 'chip' troca o controle segmentado de status por um ui/ChipFiltro (mesma
   * lógica de filtragem, só o visual do controle muda). Padrão vigente das
   * 4 listagens principais (Habilidades, Avaliações, Carreiras,
   * Competências) desde 2026-09-16 — ver 02-design-system.md > "Filtros e
   * Pills". Default 'pills' só por retrocompatibilidade do prop; toda
   * listagem principal nova deve passar 'chip' explicitamente.
   */
  statusFilterVariant?: 'pills' | 'chip';
  /**
   * Repassado direto pra Table.tsx — fixa a 1ª coluna de dados e a coluna de
   * Ações com piso de largura mínima, forçando rolagem em vez de espremer
   * colunas. Já é produção (ver Table.tsx). Default false.
   */
  stickyFirstColumn?: boolean;
}

export function ListingPage({
  title,
  subtitle,
  primaryAction,
  columns,
  data,
  actions,
  statusFilter,
  emptyState,
  searchPlaceholder = 'Buscar...',
  onSearch,
  pagination,
  onRowClick,
  statusFilterVariant = 'pills',
  stickyFirstColumn = false,
}: ListingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const hasData = data.length > 0;
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="space-y-6 relative">
      {/* Header - Apenas título quando presente */}
      {title && (
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-600 mt-2">{subtitle}</p>}
        </div>
      )}

      {/* Search and Filters Toolbar - Reorganizado para mobile */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
        {/* Mobile: Layout vertical */}
        <div className="flex flex-col gap-3 md:hidden">
          {/* Campo de busca - largura total */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
            />
          </div>

          {/* Filtros de status - scroll horizontal */}
          {statusFilter && statusFilterVariant === 'chip' && (
            <ChipFiltro
              label="Status"
              value={statusFilter.value}
              options={statusFilter.options}
              onChange={statusFilter.onChange}
            />
          )}
          {statusFilter && statusFilterVariant !== 'chip' && (
            <div className="overflow-x-auto -mx-3 px-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1 min-w-max">
                {statusFilter.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => statusFilter.onChange(option.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                      statusFilter.value === option.value
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Desktop: Layout horizontal original */}
        <div className="hidden md:flex items-center gap-3">
          {/* Campo de busca com largura média */}
          <div className="w-80 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent"
            />
          </div>

          {/* Controle de Status: chip (padrão) ou segmentado (statusFilterVariant='pills') */}
          {statusFilter && statusFilterVariant === 'chip' && (
            <ChipFiltro
              label="Status"
              value={statusFilter.value}
              options={statusFilter.options}
              onChange={statusFilter.onChange}
            />
          )}
          {statusFilter && statusFilterVariant !== 'chip' && (
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {statusFilter.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => statusFilter.onChange(option.value)}
                  className={`px-3 py-2 text-sm font-normal rounded-md transition-all ${
                    statusFilter.value === option.value
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {/* Espaçador flexível */}
          <div className="flex-1"></div>

          {/* Botão de ação primária - apenas desktop */}
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--brand-600)] text-white text-sm font-medium rounded-lg hover:bg-[var(--brand-700)] transition-colors"
            >
              {primaryAction.icon}
              {primaryAction.label}
            </button>
          )}
        </div>
      </div>

      {/* FAB - Floating Action Button (apenas mobile) */}
      {primaryAction && (
        <button
          onClick={primaryAction.onClick}
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-[var(--brand-600)] text-white rounded-full shadow-lg hover:bg-[var(--brand-700)] active:scale-95 transition-all flex items-center justify-center z-40"
          aria-label={primaryAction.label}
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Table or Empty State — a moldura do card (bg-white rounded-lg
          border overflow-hidden) já vem de dentro de ui/Table.tsx; aqui só
          aplicamos a moldura quando ELA NÃO estiver vindo de lá (EmptyState,
          que não passa por Table.tsx), para não aninhar duas bordas. */}
      {!hasData && emptyState && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <EmptyState
            icon={emptyState.icon}
            title={
              isSearching
                ? 'Nenhum resultado encontrado'
                : emptyState.title
            }
            description={
              isSearching
                ? `Não encontramos resultados para "${searchQuery}". Tente ajustar sua busca.`
                : emptyState.description
            }
            action={
              !isSearching && primaryAction
                ? {
                    label: primaryAction.label,
                    onClick: primaryAction.onClick,
                  }
                : undefined
            }
          />
        </div>
      )}

      {hasData && (
        <Table
          columns={columns}
          data={data}
          actions={actions}
          pagination={pagination}
          onRowClick={onRowClick}
          stickyFirstColumn={stickyFirstColumn}
        />
      )}
    </div>
  );
}