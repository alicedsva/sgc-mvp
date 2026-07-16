import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';

import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CarreirasProvider } from '../context/CarreirasContext';

// Rotas exclusivas de cada perfil — usadas para manter viewMode coerente com
// a URL em qualquer entrada direta na rota (link colado, F5, favorito), não
// só quando o usuário troca de visão pelo toggle do Header. Sem isso,
// viewMode nascia sempre 'admin' (valor inicial do useState) e a sidebar/
// header mostravam o layout errado toda vez que uma rota de Colaborador era
// acessada sem passar primeiro pelo toggle. Rotas ambíguas (/habilidades,
// /design-system) ficam de fora de propósito — continuam controladas só
// pelo toggle, mesmo comportamento de antes.
const ROTAS_COLABORADOR = ['/meu-perfil', '/minhas-avaliacoes', '/minha-carreira', '/testes/'];
const ROTAS_ADMIN = ['/dashboard', '/perfis', '/carreiras', '/avaliacoes'];

function getViewModeFromPath(pathname: string): 'admin' | 'colaborador' | null {
  if (ROTAS_COLABORADOR.some(p => pathname.startsWith(p))) return 'colaborador';
  if (ROTAS_ADMIN.some(p => pathname.startsWith(p))) return 'admin';
  return null;
}

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDesignSystem = location.pathname.startsWith('/design-system');
  // Inicialização preguiçosa a partir da URL atual — evita o "flash" de
  // sidebar errada entre o primeiro render (estado default) e o useEffect
  // de sincronização logo abaixo.
  const [viewMode, setViewMode] = useState<'admin' | 'colaborador'>(
    () => getViewModeFromPath(location.pathname) ?? 'admin'
  );
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sincroniza viewMode em navegações CLIENT-SIDE subsequentes (Layout não
  // remonta entre rotas dentro da SPA, então o useState acima só roda uma
  // vez — sem este efeito, navegar via URL/link direto para uma rota de
  // Colaborador depois de já estar montado em modo admin não corrigiria a
  // sidebar).
  useEffect(() => {
    const modoDaRota = getViewModeFromPath(location.pathname);
    if (modoDaRota) setViewMode(modoDaRota);
  }, [location.pathname]);

  // Determinar selectedItem baseado na rota
  const getSelectedItemFromPath = (pathname: string): string => {
    if (pathname === '/dashboard') return 'dashboard';
    if (pathname.startsWith('/perfis')) return 'perfis';
    if (pathname.startsWith('/carreiras')) return 'carreiras';
    if (pathname.startsWith('/avaliacoes')) return 'avaliacoes';
    if (pathname.startsWith('/meu-perfil')) return 'meu-perfil';
    if (pathname.startsWith('/minhas-avaliacoes')) return 'minhas-avaliacoes';
    if (pathname.startsWith('/minha-carreira')) return 'minha-carreira';
    if (pathname.startsWith('/testes/')) return pathname.slice(1); // 'testes/radar', etc.
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