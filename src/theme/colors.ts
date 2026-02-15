export const colors = {
  // brand
  primary: '#FF6B00', // construction orange
  primaryLight: '#FF8C33',
  primaryDark: '#CC5500',

  // secondary
  secondary: '#1A1A2E',
  secondaryLight: '#2D2D44',

  // status
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // urgency
  urgencyASAP: '#EF4444',
  urgencyToday: '#F59E0B',
  urgencyScheduled: '#3B82F6',
  urgencyFlexible: '#22C55E',

  // neutrals
  white: '#FFFFFF',
  black: '#000000',
  background: '#F5F5F7',
  surface: '#FFFFFF',
  surfaceSecondary: '#F0F0F3',
  border: '#E5E5EA',
  borderLight: '#F2F2F7',

  // text
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  textLink: '#FF6B00',

  // badges
  verified: '#22C55E',
  boosted: '#F59E0B',
  privatePool: '#8B5CF6',

  // overlay
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.1)',
} as const;

export type ColorKey = keyof typeof colors;
