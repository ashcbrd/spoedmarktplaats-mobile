import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { useCreditsStore } from '../../store/creditsStore';
import { creditsApi } from '../../api/endpoints/credits';
import { CREDIT_COSTS } from '../../config/constants';
import { relativeTime } from '../../utils/date';

const COST_LABELS: Record<string, string> = {
  PUBLISH_JOB: 'Opdracht publiceren',
  BOOST_24H: 'Boost 24 uur',
  PING_TOP_5: 'Ping Top 5',
  EXTEND_6H: 'Verleng +6 uur',
  EXTEND_24H: 'Verleng +24 uur',
  REPOST_JOB: 'Opnieuw plaatsen',
  PLACE_BID: 'Bod plaatsen',
};

export const CreditsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const balance = useCreditsStore(s => s.balance);
  const { data: txData } = useQuery({
    queryKey: ['credits', 'transactions'],
    queryFn: () => creditsApi.transactions(),
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Balance card */}
      <Card style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Huidige balans</Text>
        <Text style={styles.balanceValue}>{balance}</Text>
        <Text style={styles.balanceUnit}>credits</Text>
        <Button
          title="Credits kopen"
          onPress={() =>
            Alert.alert(
              'Credits kopen',
              'Betaling wordt extern afgehandeld in de MVP.',
            )
          }
          style={styles.buyBtn}
        />
      </Card>

      {/* Cost reference */}
      <Text style={styles.sectionTitle}>Credit kosten</Text>
      <Card>
        {Object.entries(CREDIT_COSTS).map(([key, cost]) => (
          <View key={key} style={styles.costRow}>
            <Text style={styles.costLabel}>{COST_LABELS[key] ?? key}</Text>
            <Text style={styles.costValue}>
              {cost} credit{cost > 1 ? 's' : ''}
            </Text>
          </View>
        ))}
      </Card>

      {/* Transaction history */}
      <Text style={styles.sectionTitle}>Transactiegeschiedenis</Text>
      {txData?.data && txData.data.length > 0 ? (
        txData.data.map(tx => (
          <View key={tx.id} style={styles.txRow}>
            <View style={styles.txLeft}>
              <Text style={styles.txAction}>{tx.action}</Text>
              <Text style={styles.txDate}>{relativeTime(tx.createdAt)}</Text>
            </View>
            <Text
              style={[
                styles.txAmount,
                { color: tx.amount > 0 ? colors.success : colors.error },
              ]}
            >
              {tx.amount > 0 ? '+' : ''}
              {tx.amount}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>Nog geen transacties</Text>
      )}

      <Button
        title="Bekijk abonnementen"
        onPress={() => navigation.navigate('Plans')}
        variant="outline"
        style={styles.plansBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.huge },
  balanceCard: { alignItems: 'center', paddingVertical: spacing.xxl },
  balanceLabel: { ...typography.caption, color: colors.textSecondary },
  balanceValue: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
    marginVertical: spacing.xs,
  },
  balanceUnit: { ...typography.body, color: colors.textSecondary },
  buyBtn: { marginTop: spacing.lg },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  costLabel: { ...typography.body, color: colors.textPrimary },
  costValue: { ...typography.captionBold, color: colors.primary },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  txLeft: { flex: 1 },
  txAction: { ...typography.body, color: colors.textPrimary },
  txDate: { ...typography.small, color: colors.textTertiary },
  txAmount: { ...typography.bodyBold },
  emptyText: {
    ...typography.body,
    color: colors.textTertiary,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  plansBtn: { marginTop: spacing.xl },
});
