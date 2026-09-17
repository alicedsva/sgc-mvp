import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { ReactNode, useEffect, useRef, useState, type UIEvent } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

const ITENS_POR_PAGINA_OPCOES = [10, 25, 50];

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
  /**
   * Fixa a 1ª coluna de dados E a coluna de Ações (position: sticky,
   * left:0 / right:0) com fundo sólido, e aplica um piso de largura mínima
   * na tabela (min-w-[1280px]) que força rolagem horizontal em vez de
   * espremer as colunas nas larguras de notebook (1280-1440px). A sombra
   * suave dessas colunas só aparece depois que a tabela é rolada na
   * horizontal (estilo Notion). Já é produção em Habilidades e Avaliações
   * (ContentArea.tsx), que esmagavam nas larguras de notebook (1280-1440px).
   * Nas tabelas que já cabem confortavelmente nessas larguras (Carreiras,
   * Competências), pode ficar ligado sem problema: o
   * piso de 1280px só "acorda" a rolagem quando o conteúdo realmente não
   * cabe, então nunca há nada visível pra rolar ali. Default false.
   */
  stickyFirstColumn?: boolean;
  /**
   * true → não aplica a moldura do card (bg-white rounded-lg border
   * overflow-hidden) no <div> raiz. Uso restrito a telas que compõem a
   * tabela dentro de um card próprio que já tem outro conteúdo colado
   * acima dela no mesmo card (toolbar de pills, header com título) — sem
   * isso, a moldura da Table.tsx duplicaria a borda/cantos arredondados
   * por baixo desse conteúdo externo. Ver CompetenciaDetalhePage.tsx,
   * ParticipanteResultadoPage.tsx e PerfilColaboradorPage.tsx (aba
   * Avaliações). Default false → toda tabela nova ganha a moldura.
   */
  bare?: boolean;
}

export function Table({ columns, data, actions, pagination, onRowClick, stickyFirstColumn = false, bare = false }: TableProps) {
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

  // Estado só usado pelo modo stickyFirstColumn: liga a sombra das colunas
  // fixas assim que a tabela é rolada na horizontal e a MANTÉM
  // estável enquanto continuar rolada (estilo Notion). onScroll do próprio
  // wrapper — NÃO há useEffect / addEventListener / re-registro de listener:
  // o `onScroll` do JSX é só uma prop, o React troca a referência a cada
  // render sem perder eventos nem scrollLeft, e `isScrolled` é state de
  // componente (sobrevive a re-render; só zeraria num remount, que não
  // acontece aqui). `handleHorizontalScroll` recriado a cada render é
  // irrelevante por isso.
  //
  // Histerese (essencial): liga ao passar de 2px (tolerância a arredondamento
  // sub-pixel) e só DESLIGA ao voltar a 0 ou negativo — nunca no intervalo
  // (0, 2]. Sem isso, o bounce elástico do trackpad faz scrollLeft oscilar
  // rápido em torno de 0 ao fim do gesto e o `> 0` puro acompanhava a
  // oscilação, piscando a linha. Com histerese: bounce na borda esquerda
  // (scrollLeft entre negativo e 0) desliga UMA vez e fica desligado; bounce
  // na borda direita (sempre > 2) fica ligado; parada no meio (> 2) fica
  // ligado. Zero oscilação.
  const [isScrolled, setIsScrolled] = useState(false);
  const handleHorizontalScroll = (e: UIEvent<HTMLDivElement>) => {
    if (!stickyFirstColumn) return;
    const x = e.currentTarget.scrollLeft;
    setIsScrolled(prev => {
      if (!prev && x > 2) return true;
      if (prev && x <= 0) return false;
      return prev;
    });
  };

  // Coluna fixa (esquerda) + coluna de Ações fixa (direita) quando
  // stickyFirstColumn. Duas camadas de indicação da divisa, ambas ligadas
  // pelo mesmo `isScrolled` com histerese:
  //
  // 1. BORDA CONTÍNUA — `border-r` (esquerda) / `border-l` (Ações) direto nas
  //    <td>/<th> sticky, alternando `border-transparent` ↔ `border-gray-200`
  //    (mesma cor das divisórias de linha do projeto). `border` É pintado no
  //    `border-collapse: collapse` (ao contrário de `box-shadow`), então cada
  //    célula empresta sua borda e o navegador desenha UMA linha única
  //    contínua ao longo da coluna, sem elemento extra. A largura (1px) fica
  //    sempre no box (transparent→gray) → nenhum reflow ao ligar/desligar.
  //
  // 2. SOMBRA CONTÍNUA — UM overlay só por lado (não por célula, senão
  //    "picota" nas divisórias de linha), renderizado como irmão da <table>
  //    dentro do wrapper overflow-x-auto. `position: sticky` + `left:0` /
  //    `right:0` prende no scroll; `width` = largura REAL da coluna fixa
  //    (medida por ref, varia entre telas); `height` = altura real da tabela
  //    (medida) + `marginTop` negativo para sobrepor a <table> sem ocupar
  //    espaço. `box-shadow` no overlay (um <div>, não <td>) não sofre a
  //    limitação do border-collapse. `pointer-events-none` + `aria-hidden`.
  //
  // Fundo sólido nas células sticky (bg-white / bg-gray-50) continua
  // obrigatório; hover reaplicado opaco via group-hover (#f0f9fb).
  const bordaCor = isScrolled ? 'border-gray-200' : 'border-transparent';
  const sombraEsquerda = isScrolled ? ' shadow-[4px_0_6px_-4px_rgba(0,0,0,0.15)]' : '';
  const sombraDireita = isScrolled ? ' shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.15)]' : '';
  const hoverOpaco = onRowClick ? ' group-hover:bg-[#f0f9fb]' : '';
  const stickyHeadClass = stickyFirstColumn
    ? ` sticky left-0 z-20 bg-gray-50 border-r ${bordaCor} transition-colors`
    : '';
  const stickyCellClass = stickyFirstColumn
    ? ` sticky left-0 z-10 bg-white border-r ${bordaCor} transition-colors${hoverOpaco}`
    : '';
  const stickyActionsHeadClass = stickyFirstColumn
    ? ` sticky right-0 z-20 bg-gray-50 border-l ${bordaCor} transition-colors`
    : '';
  const stickyActionsCellClass = stickyFirstColumn
    ? ` sticky right-0 z-10 bg-white border-l ${bordaCor} transition-colors${hoverOpaco}`
    : '';

  // Medição real das dimensões que os overlays de sombra precisam (larguras
  // das colunas fixas + altura da tabela). ResizeObserver na <table> +
  // resize da janela cobrem: mudança de página, quebra de linha de texto,
  // mudança de breakpoint (larguras em %), Habilidades vs Avaliações.
  const tableRef = useRef<HTMLTableElement>(null);
  const leftHeadCellRef = useRef<HTMLTableCellElement>(null);
  const actionsHeadCellRef = useRef<HTMLTableCellElement>(null);
  const [dims, setDims] = useState({ leftW: 0, rightW: 0, tableH: 0, tableW: 0 });
  useEffect(() => {
    if (!stickyFirstColumn) return;
    const medir = () => {
      const next = {
        leftW: leftHeadCellRef.current?.offsetWidth ?? 0,
        rightW: actionsHeadCellRef.current?.offsetWidth ?? 0,
        tableH: tableRef.current?.offsetHeight ?? 0,
        tableW: tableRef.current?.offsetWidth ?? 0,
      };
      setDims(prev =>
        prev.leftW === next.leftW && prev.rightW === next.rightW && prev.tableH === next.tableH && prev.tableW === next.tableW
          ? prev
          : next,
      );
    };
    medir();
    const ro = new ResizeObserver(medir);
    if (tableRef.current) ro.observe(tableRef.current);
    window.addEventListener('resize', medir);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', medir);
    };
  }, [stickyFirstColumn, data.length, columns.length, actions?.length, pagination?.currentPage, pagination?.itemsPerPage]);
  // Sem um min-width, `w-full` + `table-fixed` faz a tabela caber SEMPRE no
  // container (só espreme as colunas) e a rolagem horizontal — e portanto a
  // coluna fixa — nunca aparece. Só quando stickyFirstColumn está ligado
  // damos um piso de largura para o conteúdo (tabelas com muitas colunas ou
  // colunas com conteúdo longo não cabem legíveis abaixo disso nas larguras
  // de notebook 1280–1440px — ver Avaliações e Habilidades), ativando de
  // fato o overflow-x. Continua opt-in por tabela (prop `stickyFirstColumn`):
  // em tabelas que já cabem confortavelmente nesse piso (Carreiras,
  // Competências), o min-width simplesmente nunca é atingido de verdade e a
  // rolagem não aparece — não precisa decidir caso a caso se "esmaga ou não"
  // pra ligar a prop.
  const tableMinWidthClass = stickyFirstColumn ? ' min-w-[1280px]' : '';

  return (
    <div className={bare ? undefined : 'bg-white rounded-lg border border-gray-200 overflow-hidden'}>
      <div
        className={`overflow-x-auto${stickyFirstColumn ? ' overflow-y-hidden' : ''}`}
        onScroll={handleHorizontalScroll}
      >
        <table
          ref={tableRef}
          className={`w-full${tableMinWidthClass} ${colunasComWidthCompleto ? 'table-fixed' : ''}`}
        >
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map((column, colIndex) => (
                <th
                  key={column.key}
                  ref={colIndex === 0 ? leftHeadCellRef : undefined}
                  className={`px-3 md:px-6 py-3 md:py-4 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider${colIndex === 0 ? stickyHeadClass : ''}`}
                  style={{ width: column.width }}
                >
                  {column.renderHeader ? column.renderHeader() : column.label}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th
                  ref={actionsHeadCellRef}
                  className={`px-3 md:px-6 py-3 md:py-4 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-20 md:w-24 ${stickyActionsHeadClass}`}
                >
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
                  className={`transition-colors ${onRowClick ? 'group hover:bg-[rgba(0,159,194,0.06)] cursor-pointer' : ''}`}
                  onClick={(e) => {
                    // Não acionar onRowClick se clicar em botões de ação
                    if (!(e.target as HTMLElement).closest('button')) {
                      onRowClick?.(row);
                    }
                  }}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={`${rowId}-${column.key}`}
                      className={`px-3 md:px-6 py-3 md:py-4 text-xs text-gray-900${colIndex === 0 ? stickyCellClass : ''}`}
                    >
                      {column.render
                        ? column.render(row[column.key], row, index)
                        : row[column.key]}
                    </td>
                  ))}
                  {/* A partir de 3 ações configuradas para a tabela, vira menu
                      de contexto (MoreVertical) — abaixo disso continuam
                      ícones soltos. Decisão pelo tamanho de `actions` (o
                      conjunto TOTAL configurado), nunca pela contagem de
                      ações visíveis linha a linha (`show`): se decidisse por
                      linha, duas linhas da MESMA coluna poderiam renderizar
                      modos diferentes (uma com ícones, outra com menu) só
                      porque uma ação condicional não se aplica àquela linha
                      — inconsistência visual dentro da mesma coluna. Ver
                      02-design-system.md > Tabelas > Menu de ações. */}
                  {actions && actions.length > 0 && actions.length < 3 && (
                    <td className={`px-3 md:px-6 py-3 md:py-4 text-right${stickyActionsCellClass}`}>
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
                              <Tooltip key={actionIndex}>
                                <TooltipTrigger asChild>
                                  <button
                                    disabled={isDisabled}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!isDisabled) action.onClick(row);
                                    }}
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
                                </TooltipTrigger>
                                <TooltipContent>{label}</TooltipContent>
                              </Tooltip>
                            );
                          })}
                      </div>
                    </td>
                  )}

                  {actions && actions.length >= 3 && (
                    <td className={`px-3 md:px-6 py-3 md:py-4 text-right${stickyActionsCellClass}`}>
                      <div className="flex items-center justify-end">
                        <DropdownMenu>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <DropdownMenuTrigger asChild>
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-1.5 md:p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Ações</TooltipContent>
                          </Tooltip>
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

        {/* Overlays de SOMBRA das colunas fixas — um por lado, cobrindo a
            altura inteira (sem picotar por linha). `sticky left-0/right-0`
            prende no scroll horizontal; width = largura real da coluna fixa
            (medida); height = altura real da tabela (medida); marginTop
            negativo sobrepõe a <table> sem ocupar espaço. box-shadow num
            <div> não sofre a limitação do border-collapse. Só quando
            isScrolled (via sombraEsquerda/Direita).

            Wrapper com width: dims.tableW (largura real da <table>) +
            display:flex + justify-between: sticky com `right: 0` só prende
            corretamente na borda direita do conteúdo rolável se a posição
            estática (sem scroll) do elemento já nascer nessa borda direita —
            sem isso, um <div> solto em fluxo de bloco normal nasce encostado
            na ESQUERDA do container (mesma região do overlay esquerdo), já
            que a <table> é mais larga que a área visível (por isso ela rola)
            e um bloco comum não herda a largura total da tabela sozinho.
            O wrapper com dims.tableW reproduz exatamente a largura real da
            tabela; justify-between posiciona o filho esquerdo em x=0 e o
            direito encostado em x=tableW (= borda direita real da coluna
            Ações), dando ao `right-0` sticky do filho direito a mesma
            referência correta que o `left-0` do filho esquerdo já tinha. */}
        {stickyFirstColumn && dims.tableH > 0 && dims.tableW > 0 && (
          <div
            aria-hidden
            className="pointer-events-none relative flex justify-between"
            style={{ width: dims.tableW, marginTop: -dims.tableH }}
          >
            <div
              className={`sticky left-0 top-0 z-30 transition${sombraEsquerda}`}
              style={{ width: dims.leftW, height: dims.tableH }}
            />
            {actions && actions.length > 0 && (
              <div
                className={`sticky right-0 top-0 z-30 transition${sombraDireita}`}
                style={{ width: dims.rightW, height: dims.tableH }}
              />
            )}
          </div>
        )}
      </div>

      {/* Footer de Paginação */}
      {pagination && (
        <div className="flex flex-col md:flex-row items-center justify-between px-3 md:px-6 py-3 md:py-4 border-t border-gray-200 bg-gray-50 gap-3 md:gap-0">
          {/* Informação à esquerda */}
          <div className="flex items-center gap-4">
            {/* Itens por página — oculto em mobile (ver 02-design-system.md
                > Tabelas > Paginação). Só decide o TAMANHO da página; o
                reset para página 1 ao trocar é responsabilidade do
                onItemsPerPageChange de cada tela (mesma regra de "ao
                aplicar filtro ou busca"). Escondido também quando o total
                de itens é <= 10 (a menor opção disponível) — nesse caso
                nenhuma opção do seletor mudaria o resultado exibido. */}
            {pagination.totalItems > 10 && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-xs md:text-sm text-gray-700">Itens por página</span>
                <Select
                  value={String(pagination.itemsPerPage)}
                  onValueChange={(value) => pagination.onItemsPerPageChange(Number(value))}
                >
                  {/* w-[72px]: min-w-[180px] do SelectTrigger (select.tsx)
                      não é cancelado por w-16/w-[Npx] — min-width e width
                      são grupos diferentes pro twMerge, então min-w-0 aqui é
                      obrigatório. 72px = px-3 (24) + gap interno do trigger
                      (10) + chevron (14) + até 2 dígitos em text-sm (~17,
                      já que esse controle só aparece em md: pra cima) + ~7px
                      de folga. O corte ("2..." em vez de "25") não era só
                      largura insuficiente — select.tsx aplica
                      [&>span]:truncate/flex-1/min-w-0 em QUALQUER <span>
                      filho do trigger (é o <span> que o Radix usa por baixo
                      do SelectValue), pensado pra valores longos (Gerência,
                      Competência) — com o trigger apertado, isso faz o
                      <span> encolher e truncar bem antes do esperado. Não dá
                      pra remover essas classes de select.tsx (outros
                      SelectTrigger do sistema dependem delas pra truncar
                      valor longo) — por isso o override abaixo é só no
                      style inline do SelectValue desta instância. */}
                  <SelectTrigger className="w-[72px] min-w-0 h-8 text-xs md:text-sm">
                    <SelectValue
                      style={{ overflow: 'visible', textOverflow: 'clip', flex: 'none', minWidth: 'auto' }}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {ITENS_POR_PAGINA_OPCOES.map((opcao) => (
                      <SelectItem key={opcao} value={String(opcao)}>
                        {opcao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="text-xs md:text-sm text-gray-700">
              <span className="hidden md:inline">Exibindo </span>
              <span className="font-medium">{startItem}</span>–
              <span className="font-medium">{endItem}</span> de{' '}
              <span className="font-medium">{pagination.totalItems}</span>
            </div>
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