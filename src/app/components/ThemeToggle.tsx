import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
    >
      {theme === 'light' ? (
        <>
          <Moon className="w-4 h-4" />
          <span>Modo Escuro</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4" />
          <span>Modo Claro</span>
        </>
      )}
    </button>
  );
}
