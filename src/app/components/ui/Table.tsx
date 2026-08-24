import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { ReactNode } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';

export interface Column {
  key: string;
  label: string;
  width?: string;
  render?: (value: any, row: any, index?: number) => ReactNode;
  renderHeader?: () => ReactNode;
}

export interface InlineAction {
  icon?: ReactNode | ((row: any) => ReactNode);
  label: string | ((row: any) => string);
  onClick: (row: any) => void;
  variant?: 'default' | 'danger' | 'toggle' | 'text';
  show?: (row: any) => boolean;
  disabled?: (row: any) => boolean;
  badge?: (row: any) => ReactNode;
}

export interface PaginationConfig {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

interface TableProps {
  columns: Column[];
  data: any[];
  actions?: InlineAction[];
  pagination?: PaginationConfig;
  onRowClick?: (row: any) => void;
}

export function Table({ columns, data, actions, pagination, onRowClick }: TableProps) {
  // Calcular informações de paginação
  const startItem = pagination ? (pagination.currentPage - 1) * pagination.itemsPerPage + 1 : 0;
  const endItem = pagination ? Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems) : 0;
  const totalPages = pagination ? Math.ceil(pagination.totalItems / pagination.itemsPerPage) : 0;

  // Gerar números de página para exibir
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (pagination!.currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (pagination!.currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(pagination!.currentPage - 1);
        pages.push(pagination!.currentPage);
        pages.push(pagination!.currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // table-layout: fixed só quando TODA coluna configurada já define width —
  // com table-fixed, o navegador decide a largura de cada coluna pelas
  // células da primeira linha (thead) e para de considerar o conteúdo; uma
  // coluna sem width nesse modo não "encolhe pro conteúdo" como antes, ela
  // some no rateio igual entre as colunas sem width, o que pode deformar
  // tabelas que nunca foram desenhadas para isso. Aplicar condicionalmente
  // preserva table-layout: auto (comportamento de sempre) para qualquer
  // tabela que ainda não definiu width em todas as colunas — nenhuma tabela
  // existente muda de layout só por essa mudança. Sem isso (table-layout:
  // auto), um `width` em % é só um palpite inicial: célula com conteúdo
  // grande (ex: Descrição) força a coluna a crescer além do previsto e gera
  // scroll horizontal infinito — motivo real desta mudança.
  const colunasComWidthCompleto = columns.length > 0 && columns.every(column => !!column.width);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className={`w-full ${colunasComWidthCompleto ? 'table-fixed' : ''}`}>
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-3 md:px-6 py-3 md:py-4 text-left text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.renderHeader ? column.renderHeader() : column.label}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-3 md:px-6 py-3 md:py-4 text-right text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider w-20 md:w-24">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => {
              const rowId = row.id || `row-${index}`;
              
              return (
                <tr 
                  key={rowId} 
                  className={`transition-colors ${onRowClick ? 'hover:bg-[rgba(0,159,194,0.06)] cursor-pointer' : ''}`}
                  onClick={(e) => {
                    // Não acionar onRowClick se clicar em botões de ação
                    if (!(e.target as HTMLElement).closest('button')) {
                      onRowClick?.(row);
                    }
                  }}
                >
                  {columns.map((column) => (
                    <td key={`${rowId}-${column.key}`} className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-900">
                      {column.render
                        ? column.render(row[column.key], row, index)
                        : row[column.key]}
                    </td>
                  ))}
                  {/* A partir de 4 ações configuradas para a tabela, vira menu
                      de contexto (MoreVertical) — abaixo disso continuam
                      ícones soltos. Decisão pelo tamanho de `actions` (o
                      conjunto TOTAL configurado), nunca pela contagem de
                      ações visíveis linha a linha (`show`): se decidisse por
                      linha, duas linhas da MESMA coluna poderiam renderizar
                      modos diferentes (uma com ícones, outra com menu) só
                      porque uma ação condicional não se aplica àquela linha
                      — inconsistência visual dentro da mesma coluna. Ver
                      02-design-system.md > Tabelas > Menu de ações. */}
                  {actions && actions.length > 0 && actions.length < 4 && (
                    <td className="px-3 md:px-6 py-3 md:py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {actions
                          .filter(action => action.show ? action.show(row) : true)
                          .map((action, actionIndex) => {
                            const icon = typeof action.icon === 'function' ? action.icon(row) : action.icon;
                            const label = typeof action.label === 'function' ? action.label(row) : action.label;
                            
                            // Se for variant 'text', renderizar botão de texto
                            if (action.variant === 'text') {
                              return (
                                <button
                                  key={actionIndex}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick(row);
                                  }}
                                  className="text-xs md:text-sm font-medium text-[var(--brand-600)] hover:text-[var(--brand-700)] hover:underline transition-colors"
                                >
                                  {label}
                                </button>
                              );
                            }

                            const isDisabled = action.disabled ? action.disabled(row) : false;
                            return (
                              <button
                                key={actionIndex}
                                disabled={isDisabled}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isDisabled) action.onClick(row);
                                }}
                                title={label}
                                className={`p-1.5 md:p-2 rounded-lg transition-colors relative ${
                                  isDisabled
                                    ? 'text-gray-400 opacity-40 cursor-not-allowed'
                                    : action.variant === 'danger'
                                    ? 'text-red-600 hover:bg-red-50'
                                    : action.variant === 'toggle'
                                    ? ''
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                                }`}
                              >
                                <div className="flex items-center gap-1">
                                  {icon}
                                  {action.badge && action.badge(row)}
                                </div>
                              </button>
                            );
                          })}
                      </div>
                    </td>
                  )}

                  {actions && actions.length >= 4 && (
                    <td className="px-3 md:px-6 py-3 md:py-4 text-right">
                      <div className="flex items-center justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              title="Ações"
                              className="p-1.5 md:p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          {/* onClick aqui, não em cada item: DropdownMenuContent
                              é renderizado via Portal direto em <body>, fora da
                              hierarquia real do DOM da <tr> — o clique nele
                              ainda propaga para o onClick da linha através da
                              árvore React (delegação de evento de Portal), então
                              sem este stopPropagation um onRowClick da tabela
                              disparava junto com a ação escolhida do menu. */}
                          <DropdownMenuContent
                            align="end"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {actions
                              .filter(action => action.show ? action.show(row) : true)
                              .map((action, actionIndex) => {
                                const icon = typeof action.icon === 'function' ? action.icon(row) : action.icon;
                                const label = typeof action.label === 'function' ? action.label(row) : action.label;
                                const isDisabled = action.disabled ? action.disabled(row) : false;
                                return (
                                  <DropdownMenuItem
                                    key={actionIndex}
                                    disabled={isDisabled}
                                    variant={action.variant === 'danger' ? 'destructive' : 'default'}
                                    onSelect={() => action.onClick(row)}
                                  >
                                    {icon}
                                    {label}
                                  </DropdownMenuItem>
                                );
                              })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer de Paginação */}
      {pagination && (
        <div className="flex flex-col md:flex-row items-center justify-between px-3 md:px-6 py-3 md:py-4 border-t border-gray-200 bg-gray-50 gap-3 md:gap-0">
          {/* Informação à esquerda */}
          <div className="text-xs md:text-sm text-gray-700">
            <span className="hidden md:inline">Exibindo </span>
            <span className="font-medium">{startItem}</span>–
            <span className="font-medium">{endItem}</span> de{' '}
            <span className="font-medium">{pagination.totalItems}</span>
          </div>

          {/* Controles à direita */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Botão Anterior */}
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-3 md:w-4 h-3 md:h-4" />
            </button>

            {/* Números de Página */}
            <div className="flex items-center gap-0.5 md:gap-1">
              {getPageNumbers().map((page, index) =>
                typeof page === 'number' ? (
                  <button
                    key={index}
                    onClick={() => pagination.onPageChange(page)}
                    className={`min-w-[32px] md:min-w-[40px] px-2 md:px-3 py-1.5 md:py-2 text-xs font-normal rounded-lg transition-colors ${
                      pagination.currentPage === page
                        ? 'bg-gray-100 text-gray-900 border border-gray-200'
                        : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={index} className="px-1 md:px-2 text-xs text-gray-400">
                    {page}
                  </span>
                )
              )}
            </div>

            {/* Botão Próximo */}
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === totalPages}
              className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            >
              <ChevronRight className="w-3 md:w-4 h-3 md:h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}