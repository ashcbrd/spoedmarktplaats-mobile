import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {Badge} from '../common/Badge';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing, borderRadius} from '../../theme/spacing';
import type {DocumentStatus} from '../../types/models';

interface Props {
  label: string;
  status?: DocumentStatus | 'none';
  onUpload: () => void;
}

const statusMap: Record<string, {badge: string; variant: 'success' | 'warning' | 'error' | 'neutral'}> = {
  none: {badge: 'Niet geupload', variant: 'neutral'},
  uploaded: {badge: 'Geupload', variant: 'warning'},
  verified: {badge: 'Geverifieerd', variant: 'success'},
  rejected: {badge: 'Afgewezen', variant: 'error'},
};

export const DocumentUpload: React.FC<Props> = ({label, status = 'none', onUpload}) => {
  const cfg = statusMap[status];

  return (
    <TouchableOpacity style={styles.container} onPress={onUpload} activeOpacity={0.7}>
      <View style={styles.left}>
        <Icon
          name={status === 'verified' ? 'check-circle' : 'file-upload-outline'}
          size={24}
          color={status === 'verified' ? colors.success : colors.textSecondary}
        />
        <View style={styles.textCol}>
          <Text style={styles.label}>{label}</Text>
          <Badge label={cfg.badge} variant={cfg.variant} small />
        </View>
      </View>
      <Icon name="chevron-right" size={20} color={colors.textTertiary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  left: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1},
  textCol: {gap: spacing.xxs},
  label: {...typography.body, color: colors.textPrimary},
});
