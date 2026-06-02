import { useEffect } from 'react';
import { useOutletContext } from 'react-router';
import * as amplitude from '@amplitude/unified';
import { ContentArea } from '../components/ContentArea';

interface OutletContext {
  isSidebarCollapsed: boolean;
  viewMode: 'admin' | 'colaborador';
}

export default function MinhaCarreiraPage() {
  const { isSidebarCollapsed, viewMode } = useOutletContext<OutletContext>();

  useEffect(() => {
    amplitude.track('Career Path Viewed', { view_mode: viewMode });
  }, []);

  return (
    <ContentArea
      selectedItem="minha-carreira"
      viewMode={viewMode}
      isSidebarCollapsed={isSidebarCollapsed}
    />
  );
}
