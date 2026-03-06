import React, { type ComponentProps } from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {Card} from '../common/Card';
import {Badge} from '../common/Badge';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {formatPrice} from '../../utils/formatters';
import {relativeTime} from '../../utils/date';
import {useI18n} from '../../i18n/I18nProvider';
import type {Deal} from '../../types/models';

interface Props {
  deal: Deal;
  onPress: (deal: Deal) => void;
}

export const DealCard: React.FC<Props> = ({deal, onPress}) => {
  const {t} = useI18n();

  const statusConfig: Record<string, {label: string; variant: 'warning' | 'info' | 'success' | 'error' | 'neutral'; icon: ComponentProps<typeof Icon>['name']}> = {
    ACCEPTED: {label: t('Geaccepteerd'), variant: 'info', icon: 'handshake'},
    IN_PROGRESS: {label: t('In uitvoering'), variant: 'warning', icon: 'progress-wrench'},
    COMPLETED_PENDING_CLIENT_CONFIRM: {label: t('Bevestiging nodig'), variant: 'warning', icon: 'check-circle-outline'},
    COMPLETED_PENDING_REVIEWS: {label: t('Review nodig'), variant: 'info', icon: 'star-outline'},
    CLOSED: {label: t('Afgerond'), variant: 'success', icon: 'check-decagram'},
    DISPUTED: {label: t('Geschil'), variant: 'error', icon: 'alert'},
  };

  const cfg = statusConfig[deal.status] ?? statusConfig.ACCEPTED;

  return (
    <Card onPress={() => onPress(deal)} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Icon name={cfg.icon} size={18} color={colors.textPrimary} />
          <Text style={styles.title} numberOfLines={1}>
            {deal.job?.title ?? `Opdracht #${deal.jobId.slice(0, 6)}`}
          </Text>
        </View>
        <Badge label={cfg.label} variant={cfg.variant} small />
      </View>

      <View style={styles.details}>
        <View style={styles.row}>
          <Icon name="cash" size={14} color={colors.textSecondary} />
          <Text style={styles.detailText}>
            {deal.bid ? formatPrice(deal.bid.priceAmount) : '–'}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="clock-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.detailText}>{relativeTime(deal.createdAt)}</Text>
        </View>
      </View>

      {deal.status === 'COMPLETED_PENDING_CLIENT_CONFIRM' && (
        <View style={styles.actionHint}>
          <Icon name="information" size={14} color={colors.warning} />
          <Text style={styles.actionHintText}>{t('Wacht op bevestiging van opdrachtgever')}</Text>
        </View>
      )}
      {deal.status === 'COMPLETED_PENDING_REVIEWS' && (
        <View style={styles.actionHint}>
          <Icon name="star" size={14} color={colors.info} />
          <Text style={styles.actionHintText}>{t('Laat een review achter om af te ronden')}</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {marginBottom: spacing.md},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1},
  title: {...typography.bodyBold, color: colors.textPrimary, flex: 1},
  details: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.md,
  },
  row: {flexDirection: 'row', alignItems: 'center', gap: spacing.xxs},
  detailText: {...typography.caption, color: colors.textSecondary},
  actionHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  actionHintText: {...typography.caption, color: colors.textSecondary, flex: 1},
});
