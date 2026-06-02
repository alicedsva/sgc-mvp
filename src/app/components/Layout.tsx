import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';

import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CarreirasProvider } from '../context/CarreirasContext';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDesignSystem = location.pathname.startsWith('/design-system');
  const [viewMode, setViewMode] = useState<'admin' | 'colaborador'>('admin');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determinar selectedItem baseado na rota
  const getSelectedItemFromPath = (pathname: string): string => {
    if (pathname === '/dashboard') return 'dashboard';
    if (pathname.startsWith('/perfis')) return 'perfis';
    if (pathname.startsWith('/carreiras')) return 'carreiras';
    if (pathname.startsWith('/avaliacoes')) return 'avaliacoes';
    if (pathname.startsWith('/meu-perfil')) return 'meu-perfil';
    if (pathname.startsWith('/minhas-avaliacoes')) return 'minhas-avaliacoes';
    if (pathname.startsWith('/minha-carreira')) return 'minha-carreira';
    return 'habilidades';
  };

  const selectedItem = getSelectedItemFromPath(location.pathname);

  // Detectar tamanho da tela e ajustar sidebar
  useEffect(() => {
    let lastBreakpoint = '';

    const handleResize = () => {
      const width = window.innerWidth;
      let currentBreakpoint = '';
      
      // Desktop (≥1200px): expandida por padrão
      if (width >= 1200) {
        currentBreakpoint = 'desktop';
        if (lastBreakpoint !== currentBreakpoint) {
          setIsSidebarCollapsed(false);
          setIsMobileMenuOpen(false);
        }
      }
      // Tablet (768px-1199px): recolhida por padrão
      else if (width >= 768) {
        currentBreakpoint = 'tablet';
        if (lastBreakpoint !== currentBreakpoint) {
          setIsSidebarCollapsed(true);
          setIsMobileMenuOpen(false);
        }
      }
      // Mobile (<768px): oculta por padrão
      else {
        currentBreakpoint = 'mobile';
        if (lastBreakpoint !== currentBreakpoint) {
          setIsSidebarCollapsed(true);
          setIsMobileMenuOpen(false);
        }
      }
      
      lastBreakpoint = currentBreakpoint;
    };

    // Executar na montagem
    handleResize();

    // Listener para resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset selectedItem ao mudar de visão
  const handleViewModeChange = (mode: 'admin' | 'colaborador') => {
    setViewMode(mode);
    if (mode === 'colaborador') {
      // Navegar para visão do colaborador (simulação MVP)
      navigate('/habilidades');
    } else {
      navigate('/habilidades');
    }
  };

  const handleSelectItem = (item: string) => {
    // Navegar baseado no item selecionado
    navigate(`/${item}`);
  };

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <CarreirasProvider>
      <div className="min-h-screen">
        {/* Backdrop mobile */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={handleCloseMobileMenu}
          />
        )}
        
        {!isDesignSystem && (
          <Sidebar
            selectedItem={selectedItem}
            onSelectItem={handleSelectItem}
            viewMode={viewMode}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={setIsSidebarCollapsed}
            isMobileMenuOpen={isMobileMenuOpen}
            onCloseMobileMenu={handleCloseMobileMenu}
          />
        )}
        <Header 
          viewMode={viewMode} 
          onChangeViewMode={handleViewModeChange}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleMobileMenu={handleToggleMobileMenu}
        />
        
        {/* Conteúdo das páginas */}
        <Outlet context={{ isSidebarCollapsed, viewMode }} />
      </div>
    </CarreirasProvider>
  );
}