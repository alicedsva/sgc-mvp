import { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, ArrowLeftRight, LogOut, Menu, BookOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  viewMode: 'admin' | 'colaborador';
  onChangeViewMode: (mode: 'admin' | 'colaborador') => void;
  isSidebarCollapsed: boolean;
  onToggleMobileMenu: () => void;
}


export function Header({ viewMode, onChangeViewMode, isSidebarCollapsed, onToggleMobileMenu }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDesignSystem = location.pathname.startsWith('/design-system');
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  console.log('🎯 Header renderizado:', { viewMode, menuAberto });

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAberto(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const nomeUsuario = 'João Silva';
  const tipoUsuario = viewMode === 'admin' ? 'Administrador' : 'Desenvolvedor Frontend';
  
  return (
    <header className={`h-16 bg-white border-b border-gray-200 fixed top-0 right-0 z-50 transition-all duration-300 ${
      isDesignSystem ? 'left-0' : `left-0 md:left-20${!isSidebarCollapsed ? ' lg:left-64' : ''}`
    }`}>
      <div className="h-full flex items-center justify-between px-4 md:px-6">
        {/* Botão hamburger - apenas mobile, apenas fora do design-system */}
        {!isDesignSystem && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Título no header quando na rota /design-system */}
        {isDesignSystem && (
          <span className="hidden md:block text-sm font-semibold text-gray-900">Design System</span>
        )}

        <div className="flex items-center gap-4 md:ml-auto">
          <div className="relative pl-4 border-l border-gray-200" ref={menuRef}>
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors cursor-pointer"
            >
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{nomeUsuario}</div>
                <div className="text-xs text-gray-500">{tipoUsuario}</div>
              </div>
              <div className="w-9 h-9 bg-[var(--brand-600)] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${menuAberto ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown menu */}
            {menuAberto && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alternar visão
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    onChangeViewMode('admin');
                    setMenuAberto(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    viewMode === 'admin' && !isDesignSystem
                      ? 'bg-[var(--brand-50)] text-[var(--brand-700)]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>Visão do Administrador</span>
                  {viewMode === 'admin' && !isDesignSystem && (
                    <div className="ml-auto w-2 h-2 bg-[var(--brand-600)] rounded-full"></div>
                  )}
                </button>

                <button
                  onClick={() => {
                    onChangeViewMode('colaborador');
                    setMenuAberto(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    viewMode === 'colaborador' && !isDesignSystem
                      ? 'bg-[var(--brand-50)] text-[var(--brand-700)]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Visão do Colaborador</span>
                  {viewMode === 'colaborador' && !isDesignSystem && (
                    <div className="ml-auto w-2 h-2 bg-[var(--brand-600)] rounded-full"></div>
                  )}
                </button>

                <div className="my-2 border-t border-gray-100"></div>

                <div className="px-4 py-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aparência
                  </p>
                </div>

                <ThemeToggle />

                <div className="my-1 border-t border-gray-100"></div>

                <div className="px-3 py-2">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Padrões do Sistema
                  </p>
                </div>

                <button
                  onClick={() => {
                    navigate('/design-system');
                    setMenuAberto(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                    isDesignSystem
                      ? 'bg-[var(--brand-50)] text-[var(--brand-700)]'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Design System</span>
                  {isDesignSystem && (
                    <div className="ml-auto w-2 h-2 bg-[var(--brand-600)] rounded-full"></div>
                  )}
                </button>

                <div className="my-1 border-t border-gray-100"></div>

                <button
                  onClick={() => {
                    // Lógica de logout
                    console.log('Logout');
                    setMenuAberto(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}