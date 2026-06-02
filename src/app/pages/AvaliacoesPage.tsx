import { useOutletContext } from 'react-router';
import { ContentArea } from '../components/ContentArea';

interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}

export default function AvaliacoesPage() {
  const { isSidebarCollapsed, viewMode } = useOutletContext<OutletContext>();
  
  return (
    <ContentArea 
      selectedItem="avaliacoes" 
      viewMode={viewMode}
      isSidebarCollapsed={isSidebarCollapsed}
    />
  );
}
