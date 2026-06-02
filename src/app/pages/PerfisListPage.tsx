import { useOutletContext } from 'react-router';
import { ContentArea } from '../components/ContentArea';

interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}

export default function PerfisListPage() {
  const { isSidebarCollapsed, viewMode } = useOutletContext<OutletContext>();
  
  return (
    <ContentArea 
      selectedItem="perfis" 
      viewMode={viewMode}
      isSidebarCollapsed={isSidebarCollapsed}
    />
  );
}
