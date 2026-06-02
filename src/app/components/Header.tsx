import { useState, useRef, useEffect } from 'react';
import { Bell, User, ChevronDown, ArrowLeftRight, LogOut, Menu, Award, ClipboardCheck, RefreshCw, BookOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  viewMode: 'admin' | 'colaborador';
  onChangeViewMode: (mode: 'admin' | 'colaborador') => void;
  isSidebarCollapsed: boolean;
  onToggleMobileMenu: () => void;
}

// Tipo de notificação
interface Notificacao {
  id: number;
  tipo: string;
  icone: any;
  texto: string;
  timestamp: string;
  lida: boolean;
}

// Notificações mockadas iniciais
const notificacoesMockIniciais: Notificacao[] = [
  { id: 1, tipo: 'habilidade', icone: Award, texto: '5 novas habilidades adicionadas', timestamp: 'há 2h', lida: false },
  { id: 2, tipo: 'competencia', icone: Award, texto: '2 novas competências cadastradas', timestamp: 'há 3h', lida: false },
  { id: 3, tipo: 'avaliacao', icone: ClipboardCheck, texto: '3 novas avaliações criadas', timestamp: 'há 5h', lida: false },
  { id: 4, tipo: 'avaliacao', icone: ClipboardCheck, texto: 'Você respondeu 2 avaliações', timestamp: 'ontem', lida: true },
  { id: 5, tipo: 'sistema', icone: RefreshCw, texto: 'Dados de colaboradores atualizados via RM', timestamp: 'ontem', lida: true },
  { id: 6, tipo: 'sistema', icone: RefreshCw, texto: '1 perfil com pendência de sincronização', timestamp: 'há 2 dias', lida: true },
];

export function Header({ viewMode, onChangeViewMode, isSidebarCollapsed, onToggleMobileMenu }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDesignSystem = location.pathname.startsWith('/design-system');
  const [menuAberto, setMenuAberto] = useState(false);
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(notificacoesMockIniciais);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificacoesRef = useRef<HTMLDivElement>(null);

  console.log('🎯 Header renderizado:', { viewMode, menuAberto });

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAberto(false);
      }
      if (notificacoesRef.current && !notificacoesRef.current.contains(event.target as Node)) {
        setNotificacoesAbertas(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const nomeUsuario = 'João Silva';
  const tipoUsuario = viewMode === 'admin' ? 'Administrador' : 'Desenvolvedor Frontend';
  
  // Contar notificações não lidas
  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;

  // Função para marcar todas as notificações como lidas
  const marcarTodasComoLidas = () => {
    setNotificacoes(prevNotificacoes => 
      prevNotificacoes.map(notif => ({ ...notif, lida: true }))
    );
  };

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
          {/* Central de Notificações */}
          <div className="relative" ref={notificacoesRef}>
            <button
              onClick={() => setNotificacoesAbertas(!notificacoesAbertas)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative"
              aria-label="Notificações"
            >
              <Bell className="w-5 h-5" />
              {notificacoesNaoLidas > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-semibold rounded-full px-1">
                  {notificacoesNaoLidas}
                </span>
              )}
            </button>

            {/* Dropdown de notificações */}
            {notificacoesAbertas && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 flex flex-col">
                {/* Header do dropdown com botão de ação */}
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Notificações</h3>
                  {notificacoesNaoLidas > 0 && (
                    <button
                      onClick={marcarTodasComoLidas}
                      className="text-xs text-[var(--brand-600)] hover:text-[var(--brand-700)] hover:bg-[var(--brand-50)] px-3 py-1.5 rounded-md transition-colors font-medium"
                    >
                      Marcar como lidas
                    </button>
                  )}
                </div>
                
                <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                  {notificacoes.map((notificacao) => {
                    const IconeNotificacao = notificacao.icone;
                    return (
                      <div
                        key={notificacao.id}
                        className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                          !notificacao.lida ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                            notificacao.tipo === 'habilidade' || notificacao.tipo === 'competencia'
                              ? 'bg-purple-100 text-purple-600'
                              : notificacao.tipo === 'avaliacao'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <IconeNotificacao className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${!notificacao.lida ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                              {notificacao.texto}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{notificacao.timestamp}</p>
                          </div>
                          {!notificacao.lida && (
                            <div className="flex-shrink-0">
                              <span className="w-2 h-2 bg-[var(--brand-600)] rounded-full block"></span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

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