import { useOutletContext } from 'react-router';
import { ContentArea } from '../components/ContentArea';

interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}

export default function HabilidadesPage() {
  const { isSidebarCollapsed, viewMode } = useOutletContext<OutletContext>();
  
  return (
    <ContentArea 
      selectedItem="habilidades" 
      viewMode={viewMode}
      isSidebarCollapsed={isSidebarCollapsed}
    />
  );
}
