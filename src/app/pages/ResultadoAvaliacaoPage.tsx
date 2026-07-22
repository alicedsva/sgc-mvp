import { useOutletContext } from 'react-router';
import { ResultadoAvaliacao } from '../components/ResultadoAvaliacao';

type OutletContext = { isSidebarCollapsed: boolean; viewMode: 'admin' | 'colaborador' };

export default function ResultadoAvaliacaoPage() {
  const { isSidebarCollapsed } = useOutletContext<OutletContext>();

  return (
    <main className={`mt-16 min-h-screen bg-gray-50 transition-all duration-300 ml-0 md:ml-20 ${!isSidebarCollapsed ? 'lg:ml-64' : ''}`}>
      <div className="p-4 md:p-8">
        <ResultadoAvaliacao />
      </div>
    </main>
  );
}
