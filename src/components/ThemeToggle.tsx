import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`inline-flex items-center justify-center p-2 text-ink hover:text-accent border border-line hover:border-ink transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-accent ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 text-ink" />
      ) : (
        <Sun className="w-4 h-4 text-ink" />
      )}
    </button>
  );
}
