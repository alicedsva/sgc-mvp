import { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Award,
  Briefcase,
  ClipboardCheck,
  ArrowLeftToLine,
  ArrowRightToLine,
  Layers,
  UserCircle,
  TrendingUp,
} from 'lucide-react';

interface SidebarProps {
  selectedItem: string;
  onSelectItem: (item: string) => void;
  viewMode: 'admin' | 'colaborador';
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

interface TooltipPosition {
  top: number;
  left: number;
}

export function Sidebar({ selectedItem, onSelectItem, viewMode, isCollapsed, onToggleCollapse, isMobileMenuOpen, onCloseMobileMenu }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ top: 0, left: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const hoverTimeoutRef = useRef<number | null>(null);

  const menuItemsAdmin = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'perfis', label: 'Perfis', icon: Users },
    { id: 'habilidades', label: 'Habilidades', icon: Award },
    { id: 'carreiras', label: 'Carreiras', icon: Briefcase },
    { id: 'avaliacoes', label: 'Avaliações', icon: ClipboardCheck },
  ];

  const menuItemsColaborador = [
    { id: 'meu-perfil', label: 'Meu Perfil', icon: UserCircle },
    { id: 'minhas-avaliacoes', label: 'Minhas Avaliações', icon: ClipboardCheck },
    { id: 'minha-carreira', label: 'Minha Carreira', icon: TrendingUp },
  ];

  const menuItems = viewMode === 'admin' ? menuItemsAdmin : menuItemsColaborador;

  const handleMenuItemClick = (itemId: string) => {
    onSelectItem(itemId);
    // Fechar menu mobile ao selecionar item
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      onCloseMobileMenu();
    }
  };

  const handleMouseEnter = (itemId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isCollapsed) return;

    // Limpar timeout anterior se existir
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Calcular posição da tooltip
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top + rect.height / 2,
      left: rect.right + 8, // 8px de espaço após o botão
    });
    
    setHoveredItem(itemId);

    // Delay de 200ms antes de mostrar a tooltip
    hoverTimeoutRef.current = window.setTimeout(() => {
      setShowTooltip(true);
    }, 200);
  };

  const handleMouseLeave = () => {
    // Limpar timeout se o mouse sair antes dos 200ms
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    setShowTooltip(false);
    setHoveredItem(null);
  };

  // Limpar timeout ao desmontar
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Encontrar o label do item hover
  const hoveredItemLabel = hoveredItem 
    ? menuItems.find(item => item.id === hoveredItem)?.label 
    : null;

  return (
    <>
      <aside 
        className={`
          bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col transition-all duration-300 z-50
          md:translate-x-0
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header com logo e botão de colapsar (quando expandido) */}
        <div className={`h-16 border-b border-gray-200 flex items-center ${isCollapsed ? 'justify-center px-4' : 'justify-between px-6'}`}>
          {/* Logo - mantém posição fixa */}
          <div className="flex items-center gap-2 min-w-0">
            <Layers className="w-5 h-5 text-gray-900 flex-shrink-0" />
            {!isCollapsed && <h1 className="text-xl font-semibold text-gray-900 whitespace-nowrap">SGC</h1>}
          </div>

          {/* Botão de recolher - INTERNO quando expandido */}
          {!isCollapsed && (
            <button
              onClick={() => onToggleCollapse(true)}
              className="hidden md:flex items-center justify-center w-8 h-8 bg-white text-gray-600 hover:text-[var(--brand-600)] rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex-shrink-0"
              title="Recolher menu"
              aria-label="Recolher menu"
            >
              <ArrowLeftToLine className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navegação */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className={`space-y-1 ${isCollapsed ? 'px-4' : 'px-3'}`}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = selectedItem === item.id;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuItemClick(item.id)}
                    onMouseEnter={(e) => handleMouseEnter(item.id, e)}
                    onMouseLeave={handleMouseLeave}
                    className={`w-full flex items-center rounded-lg text-sm font-medium transition-colors ${
                      isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'
                    } ${
                      isActive
                        ? 'bg-[var(--brand-50)]'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    aria-label={item.label}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[var(--brand-600)]' : ''}`} />
                    {!isCollapsed && (
                      <span className={isActive ? 'text-[var(--brand-700)] font-medium' : ''}>
                        {item.label}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Botão de expandir - EXTERNO à sidebar, apenas quando colapsado */}
      {isCollapsed && (
        <button
          onClick={() => onToggleCollapse(false)}
          className="hidden md:flex items-center justify-center w-8 h-8 bg-white text-gray-600 hover:text-[var(--brand-600)] transition-all duration-300 fixed z-[60] rounded-lg border border-gray-200 hover:bg-gray-50"
          style={{
            left: '68px',
            top: '32px',
            transform: 'translateY(-50%)',
          }}
          title="Expandir menu"
          aria-label="Expandir menu"
        >
          <ArrowRightToLine className="w-4 h-4" />
        </button>
      )}

      {/* Tooltip flutuante - renderizada fora da sidebar como overlay */}
      {isCollapsed && showTooltip && hoveredItemLabel && (
        <div
          className="hidden md:block fixed z-[100] px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg shadow-lg whitespace-nowrap pointer-events-none"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: 'translateY(-50%)',
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          {hoveredItemLabel}
        </div>
      )}
    </>
  );
}