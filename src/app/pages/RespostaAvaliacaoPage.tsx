import { useOutletContext } from 'react-router';
import { RespostaAvaliacao } from '../components/RespostaAvaliacao';

type OutletContext = { isSidebarCollapsed: boolean; viewMode: 'admin' | 'colaborador' };

export default function RespostaAvaliacaoPage() {
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();

  return (
    <main className={`mt-16 flex flex-col bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''} h-[calc(100vh-4rem)]`}>
      <RespostaAvaliacao />
    </main>
  );
}
