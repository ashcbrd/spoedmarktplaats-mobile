import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { creditsApi } from '../../api/endpoints/credits';
import { useI18n } from '../../i18n/I18nProvider';

export const PlansScreen: React.FC = () => {
  const { t } = useI18n();
  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: creditsApi.plans,
  });

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('Kies je abonnement')}</Text>
      <Text style={styles.subtitle}>{t('Upgrade voor meer credits en features')}</Text>

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
              label={t('Populair')}
              variant="primary"
              style={styles.popularBadge}
            />
          )}
          <Text style={styles.planName}>{plan.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              {plan.priceMonthly === 0 ? t('Gratis') : `€${plan.priceMonthly}`}
            </Text>
            {plan.priceMonthly > 0 && (
              <Text style={styles.priceUnit}>{t('/maand')}</Text>
            )}
          </View>
          <Text style={styles.credits}>
            {plan.credits === 'unlimited'
              ? t('Onbeperkt credits')
              : `${plan.credits} credits`}
          </Text>
          <View style={styles.features}>
            {plan.features.map(f => (
              <View key={f} style={styles.featureRow}>
                <Icon name="check" size={16} color={colors.success} />
                <Text style={styles.featureText}>{t(f)}</Text>
              </View>
            ))}
          </View>
          <Button
            title={plan.key === 'free' ? t('Huidig plan') : t('Kies dit plan')}
            onPress={() =>
              Alert.alert(
                t('Abonnement'),
                t('Betaling wordt extern afgehandeld in de MVP.'),
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
        {t('Betaling wordt extern afgehandeld. Geen in-app betalingen in de MVP.')}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
