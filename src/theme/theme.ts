import {colors} from './colors';
import {typography} from './typography';
import {spacing, borderRadius} from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  layout: {
    screenPadding: spacing.lg,
    sectionGap: spacing.xl,
  },
  components: {
    buttonHeight: 48,
    inputHeight: 44,
    cardRadius: borderRadius.lg,
  },
} as const;

export type AppTheme = typeof theme;

export {colors, typography, spacing, borderRadius};
