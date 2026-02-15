import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing, borderRadius} from '../../theme/spacing';

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

  return (
    <TouchableOpacity
      style={[
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}>
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
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  disabled: {opacity: 0.5},
  text: {...typography.button},
});

const sizeStyles: Record<Size, ViewStyle> = {
  sm: {paddingVertical: spacing.sm, paddingHorizontal: spacing.md},
  md: {paddingVertical: spacing.md, paddingHorizontal: spacing.xl},
  lg: {paddingVertical: spacing.lg, paddingHorizontal: spacing.xxl},
};

const sizeTextStyles: Record<Size, TextStyle> = {
  sm: {fontSize: 13},
  md: {fontSize: 15},
  lg: {fontSize: 17},
};

const variantStyles: Record<Variant, ViewStyle> = {
  primary: {backgroundColor: colors.primary},
  secondary: {backgroundColor: colors.secondary},
  outline: {backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary},
  ghost: {backgroundColor: 'transparent'},
  danger: {backgroundColor: colors.error},
};

const variantTextStyles: Record<Variant, TextStyle> = {
  primary: {color: colors.white},
  secondary: {color: colors.white},
  outline: {color: colors.primary},
  ghost: {color: colors.primary},
  danger: {color: colors.white},
};
