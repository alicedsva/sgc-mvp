import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { ThemeProvider } from './contexts/ThemeContext';
import { CompetenciasProvider } from './context/CompetenciasContext';
import { HabilidadesProvider } from './context/HabilidadesContext';
import { router } from './routes';

export default function App() {
  return (
    <ThemeProvider>
      <CompetenciasProvider>
        <HabilidadesProvider>
          <div className="min-h-screen">
            <Toaster position="top-right" richColors />
            <RouterProvider router={router} />
          </div>
        </HabilidadesProvider>
      </CompetenciasProvider>
    </ThemeProvider>
  );
}