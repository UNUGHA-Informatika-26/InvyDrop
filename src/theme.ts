export const theme = {
  colors: {
    primary: '#D97757',
    primaryDark: '#C15F3C',
    primarySoft: '#FDF2EE',
    primaryForeground: '#FFFFFF',

    secondary: '#F0EEE6',
    secondaryDark: '#2A2927',
    secondaryForeground: '#141413',

    background: '#FAF9F5',
    card: '#FFFFFF',
    border: '#E8E5DD',
    muted: '#F5F3EC',
    mutedForeground: '#76746E',
    foreground: '#141413',

    success: '#788C5D',
    successSoft: '#F2F5ED',
    warning: '#D4A24C',
    warningSoft: '#FCF7ED',
    destructive: '#B5483A',
    destructiveSoft: '#FBEEEC',
    info: '#6A9BCB',
    infoSoft: '#F0F5FA',

    white: '#FFFFFF',
    black: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  radii: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 18,
    full: 9999,
  },
  typography: {
    fontXs: 11,
    fontSm: 13,
    fontBase: 15,
    fontLg: 17,
    fontXl: 20,
    font2xl: 24,
    font3xl: 28,
  },
};

export type Theme = typeof theme;
