import { createContext, useContext, useState, useEffect } from 'react';

// Themes: light-color, light-bw, dark-color, dark-bw
const ThemeContext = createContext(null);

const THEMES = [
  { id: 'light-color', label: 'Jasny', dark: false, bw: false },
  { id: 'light-bw', label: 'Bezbarwny', dark: false, bw: true },
  { id: 'dark-color', label: 'Ciemny', dark: true, bw: false },
  { id: 'dark-bw', label: 'Ciemny B&W', dark: true, bw: true },
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('wm-theme') || 'light-color';
  });

  useEffect(() => {
    localStorage.setItem('wm-theme', theme);
    const t = THEMES.find(t => t.id === theme) || THEMES[0];
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove('dark', 'theme-bw');

    if (t.dark) root.classList.add('dark');
    if (t.bw) root.classList.add('theme-bw');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}