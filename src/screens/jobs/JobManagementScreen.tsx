import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Loading } from '../../components/common/Loading';
import { BidCard } from '../../components/bids/BidCard';
import { UrgencyTimer } from '../../components/jobs/UrgencyTimer';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { useJobDetail, useJobActions } from '../../hooks/useJobs';
import { useBidsForJob, useBidActions } from '../../hooks/useBids';
import { useCredits } from '../../hooks/useCredits';
import { isExpired } from '../../utils/date';
import { formatWorkersNeeded } from '../../utils/formatters';
import { CREDIT_COSTS } from '../../config/constants';
import type { JobsStackParamList } from '../../types/navigation';

export const JobManagementScreen: React.FC = () => {
  const route = useRoute<RouteProp<JobsStackParamList, 'JobManagement'>>();
  const { jobId } = route.params;
  const { data: job, isLoading: jobLoading } = useJobDetail(jobId);
  const { data: bids, isLoading: bidsLoading } = useBidsForJob(jobId);
  const { accept, reject } = useBidActions();
  const { boost, ping, extend, cancel } = useJobActions();
  const { checkAndConsume } = useCredits();

  if (jobLoading || !job) return <Loading />;

  const expired = isExpired(job.bidWindowEnd);
  const staffed = (job.acceptedCrewTotal ?? 0) >= job.workersNeeded;

  const handleAccept = async (bidId: string) => {
    Alert.alert(
      'Bod accepteren',
      'Weet je het zeker? Er wordt een deal aangemaakt.',
      [
        { text: 'Annuleren', style: 'cancel' },
        { text: 'Accepteren', onPress: () => accept(bidId) },
      ],
    );
  };

  const handleBoost = async () => {
    if (
      await checkAndConsume(CREDIT_COSTS.BOOST_24H, 'een boost te plaatsen')
    ) {
      await boost(jobId);
      Alert.alert('Gelukt', 'Je opdracht is 24 uur geboost!');
    }
  };

  const handlePing = async () => {
    if (
      await checkAndConsume(
        CREDIT_COSTS.PING_TOP_5,
        'top 5 vakmannen te pingen',
      )
    ) {
      await ping(jobId);
      Alert.alert('Gelukt', 'Top 5 vakmannen zijn op de hoogte gebracht!');
    }
  };

  const handleExtend = async (hours: 6 | 24) => {
    const cost = hours === 6 ? CREDIT_COSTS.EXTEND_6H : CREDIT_COSTS.EXTEND_24H;
    if (
      await checkAndConsume(cost, `de deadline met ${hours} uur te verlengen`)
    ) {
      await extend({ jobId, hours });
      Alert.alert('Gelukt', `Biedperiode verlengd met ${hours} uur`);
    }
  };

  const handleCancel = () => {
    Alert.alert('Opdracht annuleren', 'Weet je het zeker?', [
      { text: 'Nee', style: 'cancel' },
      {
        text: 'Ja, annuleren',
        style: 'destructive',
        onPress: () => cancel(jobId),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{job.title}</Text>
        <View style={styles.headerRow}>
          <UrgencyTimer bidWindowEnd={job.bidWindowEnd} urgency={job.urgency} />
          <Badge
            label={job.status}
            variant={job.status === 'OPEN' ? 'success' : 'neutral'}
          />
        </View>
      </View>

      {/* Staffing progress */}
      {job.workersNeeded > 1 && (
        <View style={styles.staffingCard}>
          <Text style={styles.staffingLabel}>Bezetting</Text>
          <Text style={styles.staffingValue}>
            {formatWorkersNeeded(job.workersNeeded, job.acceptedCrewTotal ?? 0)}
          </Text>
          <View style={styles.staffingBar}>
            <View
              style={[
                styles.staffingFill,
                {
                  width: `${Math.min(
                    100,
                    ((job.acceptedCrewTotal ?? 0) / job.workersNeeded) * 100,
                  )}%`,
                },
              ]}
            />
          </View>
          {staffed && (
            <Badge
              label="Volledig bezet"
              variant="success"
              icon="check"
              style={{ marginTop: spacing.sm }}
            />
          )}
        </View>
      )}

      {/* Bids section */}
      <Text style={styles.sectionTitle}>Biedingen ({bids?.length ?? 0})</Text>
      {bidsLoading ? (
        <Loading fullScreen={false} />
      ) : bids && bids.length > 0 ? (
        bids.map(bid => (
          <BidCard
            key={bid.id}
            bid={bid}
            isClient
            isStaffed={staffed}
            onAccept={handleAccept}
            onReject={id => reject(id)}
          />
        ))
      ) : (
        <Text style={styles.emptyText}>Nog geen biedingen ontvangen</Text>
      )}

      {/* Actions */}
      <Text style={styles.sectionTitle}>Acties</Text>
      <View style={styles.actionsGrid}>
        {!expired && job.status === 'OPEN' && (
          <>
            <Button
              title="Boost 24u (1 credit)"
              onPress={handleBoost}
              variant="outline"
              size="sm"
              icon={
                <Badge label="" variant="warning" icon="rocket-launch" small />
              }
            />
            <Button
              title="Ping Top 5 (1 credit)"
              onPress={handlePing}
              variant="outline"
              size="sm"
            />
          </>
        )}
        {expired && (
          <>
            <Button
              title="Verleng +6u (1 credit)"
              onPress={() => handleExtend(6)}
              variant="outline"
              size="sm"
            />
            <Button
              title="Verleng +24u (2 credits)"
              onPress={() => handleExtend(24)}
              variant="outline"
              size="sm"
            />
          </>
        )}
        {job.status === 'OPEN' && (
          <Button
            title="Opdracht annuleren"
            onPress={handleCancel}
            variant="danger"
            size="sm"
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.huge },
  header: { marginBottom: spacing.xl },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  headerRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  staffingCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
  },
  staffingLabel: { ...typography.captionBold, color: colors.textSecondary },
  staffingValue: {
    ...typography.h3,
    color: colors.textPrimary,
    marginVertical: spacing.xs,
  },
  staffingBar: { height: 6, backgroundColor: colors.border, borderRadius: 3 },
  staffingFill: { height: 6, backgroundColor: colors.success, borderRadius: 3 },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  actionsGrid: { gap: spacing.sm },
});
