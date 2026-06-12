import { useTheme } from '@/lib/ThemeContext';
import { Sun, Moon, Palette, Circle } from 'lucide-react';

const icons = {
  'light-color': <Sun size={14} />,
  'light-bw': <Circle size={14} />,
  'dark-color': <Palette size={14} />,
  'dark-bw': <Moon size={14} />,
};

export default function ThemeSwitcher({ className = '' }) {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          title={t.label}
          className={`w-7 h-7 flex items-center justify-center rounded transition-all duration-200 ${
            theme === t.id
              ? 'bg-gold text-obsidian'
              : 'text-current opacity-40 hover:opacity-80'
          }`}
        >
          {icons[t.id]}
        </button>
      ))}
    </div>
  );
}