import { useOutletContext } from 'react-router';
import { ContentArea } from '../components/ContentArea';

interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}

export default function MeuPerfilPage() {
  const { isSidebarCollapsed, viewMode } = useOutletContext<OutletContext>();
  
  return (
    <ContentArea 
      selectedItem="meu-perfil" 
      viewMode={viewMode}
      isSidebarCollapsed={isSidebarCollapsed}
    />
  );
}
