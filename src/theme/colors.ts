/**
 * Design tokens - colours.
 *
 * The palette is anchored on the 1Fi brand purple (#6C28D9, the theme colour the
 * 1Fi app shell ships with). Everything else is derived from it so the
 * Marketplace feels native to the rest of the app instead of bolted on.
 *
 * No component hard-codes a hex value; if the design system shifts, this file is
 * the only thing that changes.
 */
export const palette = {
  purple900: '#2E1065',
  purple700: '#4C1D95',
  purple600: '#5B21B6',
  purple500: '#6C28D9', // brand
  purple400: '#8B5CF6',
  purple100: '#EDE9FE',
  purple50: '#F5F3FF',

  green600: '#047857',
  green500: '#059669',
  green100: '#D1FAE5',

  amber700: '#B45309',
  amber100: '#FEF3C7',

  red600: '#DC2626',
  red100: '#FEE2E2',

  ink900: '#0F0B1E',
  ink700: '#241C3A',
  ink500: '#5B5470',
  ink400: '#847D99',
  ink300: '#B4AEC4',
  ink200: '#E3E0EA',
  ink100: '#F1EFF5',
  ink50: '#F8F7FB',

  white: '#FFFFFF',
  black: '#000000',
} as const;

export const colors = {
  brand: palette.purple500,
  brandDark: palette.purple700,
  brandDeep: palette.purple900,
  brandSoft: palette.purple100,
  brandSurface: palette.purple50,

  background: palette.ink50,
  surface: palette.white,
  surfaceMuted: palette.ink100,

  border: palette.ink200,
  borderStrong: palette.ink300,

  textPrimary: palette.ink900,
  textSecondary: palette.ink500,
  textTertiary: palette.ink400,
  textInverse: palette.white,
  textOnBrand: palette.white,

  success: palette.green500,
  successSoft: palette.green100,
  successText: palette.green600,

  warning: palette.amber700,
  warningSoft: palette.amber100,

  danger: palette.red600,
  dangerSoft: palette.red100,

  skeleton: palette.ink200,
  overlay: 'rgba(15, 11, 30, 0.45)',
} as const;

export type ColorToken = keyof typeof colors;
