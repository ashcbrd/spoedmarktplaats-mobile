import React, { type ComponentProps } from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {Button} from './Button';

interface Props {
  icon?: ComponentProps<typeof Icon>['name'];
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<Props> = ({icon, title, message, actionLabel, onAction}) => (
  <View style={styles.container}>
    {icon && <Icon name={icon} size={56} color={colors.textTertiary} />}
    <Text style={styles.title}>{title}</Text>
    {message && <Text style={styles.message}>{message}</Text>}
    {actionLabel && onAction && (
      <Button title={actionLabel} onPress={onAction} variant="outline" size="sm" style={styles.btn} />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  btn: {marginTop: spacing.xl},
});
