import { useOutletContext } from 'react-router';
import { ContentArea } from '../components/ContentArea';

interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}

export default function MinhasAvaliacoesPage() {
  const { isSidebarCollapsed, viewMode } = useOutletContext<OutletContext>();
  
  return (
    <ContentArea 
      selectedItem="minhas-avaliacoes" 
      viewMode={viewMode}
      isSidebarCollapsed={isSidebarCollapsed}
    />
  );
}
