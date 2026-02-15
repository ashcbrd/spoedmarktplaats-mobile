import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { useAuthStore } from '../../store/authStore';
import type { SubscriptionTier } from '../../types/models';

const PROVIDER_PLANS: SubscriptionTier[] = [
  {
    key: 'free',
    name: 'Free',
    priceMonthly: 0,
    credits: 3,
    features: ['3 gratis credits', 'Basis profiel', 'Push meldingen'],
  },
  {
    key: 'pro',
    name: 'Pro',
    priceMonthly: 29,
    credits: 50,
    features: [
      '50 credits/maand',
      'Prioriteit in zoekresultaten',
      'Uitgebreid profiel',
      'Alle meldingen',
    ],
  },
  {
    key: 'team',
    name: 'Team',
    priceMonthly: 79,
    credits: 'unlimited',
    features: [
      'Onbeperkt credits',
      'Team seats',
      'Prioriteit support',
      'Alle Pro features',
    ],
  },
];

const CLIENT_PLANS: SubscriptionTier[] = [
  {
    key: 'free',
    name: 'Free',
    priceMonthly: 0,
    credits: 3,
    features: ['3 gratis credits', 'Opdrachten plaatsen', 'Push meldingen'],
  },
  {
    key: 'business',
    name: 'Business',
    priceMonthly: 49,
    credits: 50,
    features: [
      '50 credits/maand',
      'Privaat Pool',
      'Boost & Ping',
      'Alle meldingen',
    ],
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    priceMonthly: 149,
    credits: 'unlimited',
    features: [
      'Onbeperkt credits',
      'Team seats',
      'Prioriteit support',
      'API toegang',
      'Rapportages',
    ],
  },
];

export const PlansScreen: React.FC = () => {
  const role = useAuthStore(s => s.user?.role);
  const plans = role === 'provider' ? PROVIDER_PLANS : CLIENT_PLANS;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Kies je abonnement</Text>
      <Text style={styles.subtitle}>Upgrade voor meer credits en features</Text>

      {plans.map((plan, idx) => (
        <Card
          key={plan.key}
          style={
            idx === 1
              ? { ...styles.planCard, ...styles.popularCard }
              : styles.planCard
          }
        >
          {idx === 1 && (
            <Badge
              label="Populair"
              variant="primary"
              style={styles.popularBadge}
            />
          )}
          <Text style={styles.planName}>{plan.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              {plan.priceMonthly === 0 ? 'Gratis' : `€${plan.priceMonthly}`}
            </Text>
            {plan.priceMonthly > 0 && (
              <Text style={styles.priceUnit}>/maand</Text>
            )}
          </View>
          <Text style={styles.credits}>
            {plan.credits === 'unlimited'
              ? 'Onbeperkt credits'
              : `${plan.credits} credits`}
          </Text>
          <View style={styles.features}>
            {plan.features.map(f => (
              <View key={f} style={styles.featureRow}>
                <Icon name="check" size={16} color={colors.success} />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>
          <Button
            title={plan.key === 'free' ? 'Huidig plan' : 'Kies dit plan'}
            onPress={() =>
              Alert.alert(
                'Abonnement',
                'Betaling wordt extern afgehandeld in de MVP.',
              )
            }
            variant={
              plan.key === 'free' ? 'ghost' : idx === 1 ? 'primary' : 'outline'
            }
            disabled={plan.key === 'free'}
          />
        </Card>
      ))}

      <Text style={styles.disclaimer}>
        Betaling wordt extern afgehandeld. Geen in-app betalingen in de MVP.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.huge },
  title: { ...typography.h2, color: colors.textPrimary, textAlign: 'center' },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  planCard: { marginBottom: spacing.lg, position: 'relative' },
  popularCard: { borderWidth: 2, borderColor: colors.primary },
  popularBadge: { position: 'absolute', top: -10, right: spacing.lg },
  planName: { ...typography.h3, color: colors.textPrimary },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: spacing.sm,
  },
  price: { fontSize: 32, fontWeight: '700', color: colors.primary },
  priceUnit: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  credits: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  features: { marginBottom: spacing.lg },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  featureText: { ...typography.body, color: colors.textPrimary },
  disclaimer: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
