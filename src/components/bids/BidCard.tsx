import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {Card} from '../common/Card';
import {Avatar} from '../common/Avatar';
import {Badge} from '../common/Badge';
import {Button} from '../common/Button';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {formatPrice, formatCrewSize} from '../../utils/formatters';
import {formatDateTime} from '../../utils/date';
import type {Bid} from '../../types/models';

interface Props {
  bid: Bid;
  isClient: boolean;
  isStaffed: boolean;
  onAccept?: (bidId: string) => void;
  onReject?: (bidId: string) => void;
  onPress?: (bid: Bid) => void;
}

const statusBadge: Record<string, {label: string; variant: 'success' | 'error' | 'warning' | 'neutral'}> = {
  PENDING: {label: 'In afwachting', variant: 'warning'},
  ACCEPTED: {label: 'Geaccepteerd', variant: 'success'},
  REJECTED: {label: 'Afgewezen', variant: 'error'},
  WITHDRAWN: {label: 'Ingetrokken', variant: 'neutral'},
  EXPIRED: {label: 'Verlopen', variant: 'neutral'},
};

export const BidCard: React.FC<Props> = ({bid, isClient, isStaffed, onAccept, onReject, onPress}) => {
  const status = statusBadge[bid.status] ?? statusBadge.PENDING;

  return (
    <Card onPress={onPress ? () => onPress(bid) : undefined} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.providerInfo}>
          <Avatar name={bid.provider?.user?.name} uri={bid.provider?.user?.avatarUrl} size={36} />
          <View style={styles.providerMeta}>
            <Text style={styles.name}>{bid.provider?.user?.name ?? 'Aanbieder'}</Text>
            {(bid.provider?.ratingAvg ?? 0) > 0 && (
              <View style={styles.rating}>
                <Icon name="star" size={12} color={colors.warning} />
                <Text style={styles.ratingText}>
                  {bid.provider!.ratingAvg.toFixed(1)} ({bid.provider!.ratingCount})
                </Text>
              </View>
            )}
          </View>
        </View>
        <Badge label={status.label} variant={status.variant} small />
      </View>

      {/* Match score */}
      {bid.matchScore != null && (
        <View style={styles.scoreRow}>
          <Icon name="bullseye-arrow" size={14} color={colors.info} />
          <Text style={styles.scoreText}>Match: {bid.matchScore}%</Text>
        </View>
      )}

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Prijs</Text>
          <Text style={styles.detailValue}>
            {formatPrice(bid.priceAmount)}
            {bid.priceType === 'hourly' ? '/uur' : ''}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>ETA</Text>
          <Text style={styles.detailValue}>{formatDateTime(bid.eta)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Crew</Text>
          <Text style={styles.detailValue}>{formatCrewSize(bid.crewSize)}</Text>
        </View>
      </View>

      {bid.message && (
        <Text style={styles.message} numberOfLines={2}>
          {bid.message}
        </Text>
      )}

      {/* Verification badges */}
      <View style={styles.verificationRow}>
        <Badge label="ID" variant="success" icon="check-decagram" small />
        {bid.provider?.badges?.includes('zzp') && <Badge label="ZZP" variant="info" small />}
        {bid.provider?.badges?.includes('bouwpas') && <Badge label="Bouwpas" variant="warning" small />}
      </View>

      {/* Actions (client only, pending bids, not yet staffed) */}
      {isClient && bid.status === 'PENDING' && !isStaffed && (
        <View style={styles.actions}>
          <Button
            title="Accepteren"
            onPress={() => onAccept?.(bid.id)}
            size="sm"
            style={styles.actionBtn}
          />
          <Button
            title="Negeren"
            onPress={() => onReject?.(bid.id)}
            variant="ghost"
            size="sm"
          />
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
    alignItems: 'flex-start',
  },
  providerInfo: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  providerMeta: {gap: spacing.xxs},
  name: {...typography.bodyBold, color: colors.textPrimary},
  rating: {flexDirection: 'row', alignItems: 'center', gap: spacing.xxs},
  ratingText: {...typography.small, color: colors.textSecondary},
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    marginTop: spacing.sm,
  },
  scoreText: {...typography.captionBold, color: colors.info},
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  detailItem: {alignItems: 'center'},
  detailLabel: {...typography.small, color: colors.textTertiary},
  detailValue: {...typography.captionBold, color: colors.textPrimary},
  message: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  verificationRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  actionBtn: {flex: 1},
});
