import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {Card} from '../common/Card';
import {Badge} from '../common/Badge';
import {UrgencyTimer} from './UrgencyTimer';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {formatBidCount, formatBudget} from '../../utils/formatters';
import {SUBCATEGORIES} from '../../config/constants';
import type {Job} from '../../types/models';

interface Props {
  job: Job;
  onPress: (job: Job) => void;
}

export const JobCard: React.FC<Props> = ({job, onPress}) => {
  const subcat = SUBCATEGORIES.find(s => s.key === job.subcategory);

  return (
    <Card onPress={() => onPress(job)} style={styles.card}>
      {/* Header row */}
      <View style={styles.header}>
        <UrgencyTimer bidWindowEnd={job.bidWindowEnd} urgency={job.urgency} />
        <View style={styles.badges}>
          {job.boostedUntil && <Badge label="Boost" variant="warning" icon="rocket-launch" small />}
          {job.visibility === 'private_pool' && (
            <Badge label="Privaat" variant="purple" icon="lock" small />
          )}
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {job.title}
      </Text>

      {/* Category + Location */}
      <View style={styles.meta}>
        {subcat && (
          <View style={styles.metaItem}>
            <Icon name={subcat.icon} size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{subcat.label}</Text>
          </View>
        )}
        <View style={styles.metaItem}>
          <Icon name="map-marker" size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>
            {job.postcode} {job.city}
          </Text>
        </View>
      </View>

      {/* Footer: budget + workers + bids count */}
      <View style={styles.footer}>
        <Text style={styles.budget}>
          {formatBudget(job.budgetType, job.budgetAmount, job.budgetMin, job.budgetMax)}
        </Text>
        {job.workersNeeded > 1 && (
          <View style={styles.metaItem}>
            <Icon name="account-group" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{job.workersNeeded}x</Text>
          </View>
        )}
        {(job.bidsCount ?? 0) > 0 && (
          <View style={styles.metaItem}>
            <Icon name="hand-back-right" size={14} color={colors.primary} />
            <Text style={[styles.metaText, {color: colors.primary}]}>
              {formatBidCount(job.bidsCount ?? 0)}
            </Text>
          </View>
        )}
      </View>

      {/* Requirement badges */}
      {(job.requirements.ownTools ||
        job.requirements.ownTransport ||
        job.requirements.bouwpasRequired ||
        job.requirements.vcaRequired) && (
        <View style={styles.reqRow}>
          {job.requirements.ownTools && <Badge label="Eigen gereedschap" small />}
          {job.requirements.ownTransport && <Badge label="Eigen vervoer" small />}
          {job.requirements.bouwpasRequired && <Badge label="Bouwpas" variant="warning" small />}
          {job.requirements.vcaRequired && <Badge label="VCA" variant="warning" small />}
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
    marginBottom: spacing.sm,
  },
  badges: {flexDirection: 'row', gap: spacing.xs},
  title: {...typography.h4, color: colors.textPrimary, marginBottom: spacing.sm},
  meta: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.sm},
  metaItem: {flexDirection: 'row', alignItems: 'center', gap: spacing.xxs},
  metaText: {...typography.caption, color: colors.textSecondary},
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  budget: {...typography.bodyBold, color: colors.primary},
  reqRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
