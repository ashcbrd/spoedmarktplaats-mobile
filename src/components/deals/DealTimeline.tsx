import React, { type ComponentProps } from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {formatDateTime} from '../../utils/date';
import {useI18n} from '../../i18n/I18nProvider';
import type {DealStatus} from '../../types/models';

const ORDER: Record<DealStatus, number> = {
  ACCEPTED: 0,
  IN_PROGRESS: 1,
  COMPLETED_PENDING_CLIENT_CONFIRM: 2,
  COMPLETED_PENDING_REVIEWS: 3,
  CLOSED: 4,
  DISPUTED: -1,
};

interface Props {
  status: DealStatus;
  timestamps?: {
    createdAt?: string;
    startedAt?: string;
    completedAt?: string;
    confirmedAt?: string;
    closedAt?: string;
  };
}

export const DealTimeline: React.FC<Props> = ({status, timestamps}) => {
  const {t} = useI18n();
  const currentIdx = ORDER[status] ?? 0;

  const STEPS: {key: DealStatus; label: string; icon: ComponentProps<typeof Icon>['name']}[] = [
    {key: 'ACCEPTED', label: t('Geaccepteerd'), icon: 'handshake'},
    {key: 'IN_PROGRESS', label: t('In uitvoering'), icon: 'progress-wrench'},
    {key: 'COMPLETED_PENDING_CLIENT_CONFIRM', label: t('Voltooid'), icon: 'check-circle-outline'},
    {key: 'COMPLETED_PENDING_REVIEWS', label: t('Reviews'), icon: 'star-outline'},
    {key: 'CLOSED', label: t('Afgerond'), icon: 'check-decagram'},
  ];
  const tsArray = [
    timestamps?.createdAt,
    timestamps?.startedAt,
    timestamps?.completedAt,
    timestamps?.confirmedAt,
    timestamps?.closedAt,
  ];

  if (status === 'DISPUTED') {
    return (
      <View style={styles.disputeContainer}>
        <Icon name="alert-circle" size={24} color={colors.error} />
        <Text style={styles.disputeText}>{t('Geschil - neem contact op met support')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        const dotColor = done ? colors.primary : colors.border;

        return (
          <View key={step.key} style={styles.step}>
            {/* Connector line */}
            {idx > 0 && (
              <View style={[styles.line, {backgroundColor: done ? colors.primary : colors.border}]} />
            )}
            {/* Dot */}
            <View style={[styles.dot, {backgroundColor: dotColor, borderColor: dotColor}]}>
              <Icon name={step.icon} size={14} color={done ? colors.white : colors.textTertiary} />
            </View>
            {/* Label */}
            <Text style={[styles.label, isCurrent && styles.labelActive]}>
              {step.label}
            </Text>
            {tsArray[idx] && done && (
              <Text style={styles.timestamp}>{formatDateTime(tsArray[idx]!)}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'},
  step: {alignItems: 'center', flex: 1, position: 'relative'},
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    zIndex: 1,
  },
  line: {
    position: 'absolute',
    top: 14,
    left: -20,
    right: 20,
    height: 2,
  },
  label: {...typography.small, color: colors.textTertiary, marginTop: spacing.xs, textAlign: 'center'},
  labelActive: {color: colors.primary, fontWeight: '600'},
  timestamp: {...typography.small, color: colors.textTertiary, fontSize: 9, marginTop: 2, textAlign: 'center'},
  disputeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.error + '10',
    borderRadius: 8,
  },
  disputeText: {...typography.bodyBold, color: colors.error},
});
