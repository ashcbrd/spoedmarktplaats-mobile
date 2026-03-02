import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { borderRadius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type VerificationBadgeProps = {
  label: string;
  verified: boolean;
};

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ label, verified }) => {
  return (
    <View style={[styles.badge, verified ? styles.verified : styles.pending]}>
      <Icon
        name={verified ? 'check-circle' : 'clock-outline'}
        size={14}
        color={verified ? colors.success : colors.warning}
      />
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.status, verified ? styles.statusVerified : styles.statusPending]}>
        {verified ? 'Geverifieerd' : 'In behandeling'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  verified: {
    borderColor: colors.success + '66',
    backgroundColor: colors.success + '12',
  },
  pending: {
    borderColor: colors.warning + '66',
    backgroundColor: colors.warning + '14',
  },
  label: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  status: {
    ...typography.captionBold,
  },
  statusVerified: {
    color: colors.success,
  },
  statusPending: {
    color: colors.warning,
  },
});
