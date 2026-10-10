import React, { createContext, useContext, useState, useMemo } from 'react';
import { theme as defaultTheme, Theme } from './tokens';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  isDark: false,
  toggleTheme: () => {},
});

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(prev => !prev);

  const currentTheme = useMemo(() => {
    if (!isDark) return defaultTheme;
    return {
      ...defaultTheme,
      colors: {
        ...defaultTheme.colors,
        background: '#141413',
        card: '#1F1E1D',
        border: '#2A2927',
        foreground: '#FAF9F5',
        muted: '#2A2927',
        mutedForeground: '#B0AEA5',
      },
    };
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
