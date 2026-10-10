import React, { useMemo } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

function MuiThemeBridge({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const muiTheme = useMemo(() => {
    return createTheme({
      palette: {
        mode: isDark ? 'dark' : 'light',
        primary: {
          main: '#D97757',
          dark: '#C15F3C',
          contrastText: '#FFFFFF',
        },
        secondary: {
          main: isDark ? '#2A2927' : '#F0EEE6',
          contrastText: isDark ? '#FAF9F5' : '#141413',
        },
        background: {
          default: isDark ? '#141413' : '#FAF9F5',
          paper: isDark ? '#1F1E1D' : '#FFFFFF',
        },
        text: {
          primary: isDark ? '#FAF9F5' : '#141413',
          secondary: isDark ? '#B0AEA5' : '#5E5D59',
        },
        error: {
          main: isDark ? '#D4604F' : '#B5483A',
        },
        success: {
          main: '#788C5D',
        },
        warning: {
          main: '#D4A24C',
        },
        info: {
          main: '#6A9BCB',
        },
      },
      shape: {
        borderRadius: 10,
      },
    });
  }, [isDark]);

  return <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>;
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
      <MuiThemeBridge>{children}</MuiThemeBridge>
    </NextThemesProvider>
  );
}
