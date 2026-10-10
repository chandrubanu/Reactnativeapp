// Central design tokens. Every component should read colors/spacing/type
// from here instead of hardcoding values — this is our equivalent of an
// Angular Material theme / SCSS variables file.

export const colors = {
  primary: '#1449C7',
  primaryDark: '#0E3494',
  primaryLight: '#EAF0FF',
  background: '#F4F6FB',
  surface: '#FFFFFF',
  textPrimary: '#141B2D',
  textSecondary: '#6B7280',
  success: '#1FAE5A',
  warning: '#E0A400',
  danger: '#D9432F',
  border: '#E7EAF3',
  chartTrackLight: '#DCE4FA',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radii = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 26, fontWeight: '700' as const },
  h2: { fontSize: 20, fontWeight: '700' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodyBold: { fontSize: 15, fontWeight: '600' as const },
  caption: { fontSize: 12, fontWeight: '500' as const },
};
