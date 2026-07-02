import { useOutletContext } from 'react-router';
import { ContentArea } from '../components/ContentArea';

interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}

export default function MinhaCarreiraPage() {
  const { isSidebarCollapsed, viewMode } = useOutletContext<OutletContext>();

  return (
    <ContentArea
      selectedItem="minha-carreira"
      viewMode={viewMode}
      isSidebarCollapsed={isSidebarCollapsed}
    />
  );
}
