import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing, borderRadius} from '../../theme/spacing';
import {theme} from '../../theme/theme';
import {useI18n} from '../../i18n/I18nProvider';
import {triggerSelectionHaptic} from '../../utils/haptics';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Button: React.FC<Props> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
}) => {
  const isDisabled = disabled || loading;
  const {t} = useI18n();

  const handlePress = () => {
    if (isDisabled) return;
    triggerSelectionHaptic();
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      style={({pressed}) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      disabled={isDisabled}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              sizeTextStyles[size],
              variantTextStyles[variant],
              icon ? {marginLeft: spacing.sm} : undefined,
            ]}>
            {t(title)}
          </Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    minHeight: 44,
    ...theme.elevation.sm,
  },
  pressed: {transform: [{scale: 0.99}]},
  disabled: {opacity: 0.45},
  text: {...typography.button},
});

const sizeStyles: Record<Size, ViewStyle> = {
  sm: {paddingVertical: spacing.sm, paddingHorizontal: spacing.md, minHeight: 40},
  md: {paddingVertical: spacing.md, paddingHorizontal: spacing.xl, minHeight: 48},
  lg: {paddingVertical: spacing.lg, paddingHorizontal: spacing.xxl, minHeight: 54},
};

const sizeTextStyles: Record<Size, TextStyle> = {
  sm: {fontSize: 13},
  md: {fontSize: 15},
  lg: {fontSize: 17},
};

const variantStyles: Record<Variant, ViewStyle> = {
  primary: {backgroundColor: colors.primary},
  secondary: {backgroundColor: colors.secondary},
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  ghost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  danger: {backgroundColor: colors.error},
};

const variantTextStyles: Record<Variant, TextStyle> = {
  primary: {color: colors.white},
  secondary: {color: colors.white},
  outline: {color: colors.primary},
  ghost: {color: colors.primary},
  danger: {color: colors.white},
};
