import React, { type ComponentProps } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

type Variant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'
  | 'purple';

interface Props {
  label: string;
  variant?: Variant;
  icon?: ComponentProps<typeof Icon>['name'];
  style?: ViewStyle;
  small?: boolean;
}

const bgMap: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: colors.primaryLight + '20' },
  success: { backgroundColor: colors.success + '20' },
  warning: { backgroundColor: colors.warning + '20' },
  error: { backgroundColor: colors.error + '20' },
  info: { backgroundColor: colors.info + '20' },
  neutral: { backgroundColor: colors.surfaceSecondary },
  purple: { backgroundColor: colors.privatePool + '20' },
};

const textMap: Record<Variant, TextStyle> = {
  primary: { color: colors.primary, fontWeight: '600' },
  success: { color: colors.success, fontWeight: '600' },
  warning: { color: colors.warning, fontWeight: '600' },
  error: { color: colors.error, fontWeight: '600' },
  info: { color: colors.info, fontWeight: '600' },
  neutral: { color: colors.textSecondary, fontWeight: '600' },
  purple: { color: colors.privatePool, fontWeight: '600' },
};

export const Badge: React.FC<Props> = ({
  label,
  variant = 'neutral',
  icon,
  style,
  small,
}) => (
  <View
    style={[styles.badge, bgMap[variant], small && styles.badgeSmall, style]}
  >
    {icon && (
      <Icon
        name={icon}
        size={small ? 12 : 14}
        color={textMap[variant].color}
        style={styles.icon}
      />
    )}
    <Text
      style={[small ? typography.small : typography.caption, textMap[variant]]}
    >
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  badgeSmall: { paddingVertical: 1, paddingHorizontal: spacing.xs },
  icon: { marginRight: spacing.xxs },
});
