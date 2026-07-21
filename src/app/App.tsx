import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { ThemeProvider } from './contexts/ThemeContext';
import { CompetenciasProvider } from './context/CompetenciasContext';
import { HabilidadesProvider } from './context/HabilidadesContext';
import { AvaliacoesProvider } from './context/AvaliacoesContext';
import { router } from './routes';

export default function App() {
  return (
    <ThemeProvider>
      <CompetenciasProvider>
        <HabilidadesProvider>
          <AvaliacoesProvider>
            <div className="min-h-screen">
              <Toaster position="top-right" richColors />
              <RouterProvider router={router} />
            </div>
          </AvaliacoesProvider>
        </HabilidadesProvider>
      </CompetenciasProvider>
    </ThemeProvider>
  );
}