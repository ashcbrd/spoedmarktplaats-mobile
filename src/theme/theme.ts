import {colors} from './colors';
import {typography} from './typography';
import {spacing, borderRadius} from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  layout: {
    screenPadding: spacing.xl,
    sectionGap: spacing.xl,
  },
  components: {
    buttonHeight: 50,
    inputHeight: 48,
    cardRadius: borderRadius.lg,
  },
  elevation: {
    none: {
      shadowOpacity: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: colors.black,
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: colors.black,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 4,
    },
  },
  motion: {
    quick: 140,
    standard: 220,
    slow: 320,
  },
} as const;

export type AppTheme = typeof theme;

export {colors, typography, spacing, borderRadius};
