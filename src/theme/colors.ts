export const colors = {
  // brand
  primary: '#C25A18',
  primaryLight: '#D07035',
  primaryDark: '#9B4612',

  // secondary
  secondary: '#111827',
  secondaryLight: '#273449',

  // status
  success: '#1F9D63',
  warning: '#B7791F',
  error: '#C53030',
  info: '#2563EB',

  // urgency
  urgencyASAP: '#EF4444',
  urgencyToday: '#F59E0B',
  urgencyScheduled: '#3B82F6',
  urgencyFlexible: '#22C55E',

  // neutrals
  white: '#FFFFFF',
  black: '#000000',
  background: '#F4F5F7',
  surface: '#FFFFFF',
  surfaceSecondary: '#F8FAFC',
  border: '#E2E8F0',
  borderLight: '#EEF2F7',

  // text
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',
  textLink: '#FF6B00',

  // badges
  verified: '#1F9D63',
  boosted: '#B7791F',
  privatePool: '#5B5BD6',

  // overlay
  overlay: 'rgba(15,23,42,0.42)',
  overlayLight: 'rgba(15,23,42,0.08)',
} as const;

export type ColorKey = keyof typeof colors;
