/**
 * src/theme/opnameTheme.ts
 * Konstanta tema dan warna khusus modul Stock Opname & Scan InvyDrop
 */

export const opnameTheme = {
  colors: {
    primary: '#E06A3B',
    background: '#FBF9F5',
    card: '#FFFFFF',
    stroke: '#EAE3D9',
    textDark: '#2C2623',
    textMuted: '#7A726A',
    summaryBg: '#F4EFE6',
    success: '#768E65',
    successBg: '#E8F0E5',
    danger: '#D9534F',
    dangerBg: 'rgba(217, 83, 79, 0.12)', // Tint merah 12%
    surplus: '#C98A1B',
    surplusBg: '#FBF1DC',
    backdrop: 'rgba(44, 38, 35, 0.4)',
    white: '#FFFFFF',
  },
  radii: {
    card: 16,
    button: 12,
    pill: 24,
    badge: 12,
    sheet: 24,
  },
} as const;

export type OpnameTheme = typeof opnameTheme;
