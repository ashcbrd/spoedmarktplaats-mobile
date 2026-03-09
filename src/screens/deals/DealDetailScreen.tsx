import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Card } from '../../components/common/Card';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { Loading } from '../../components/common/Loading';
import { DealTimeline } from '../../components/deals/DealTimeline';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { useDealDetail, useDealActions } from '../../hooks/useDeals';
import { useAuthStore } from '../../store/authStore';
import { formatPrice, formatCrewSize } from '../../utils/formatters';
import { useI18n } from '../../i18n/I18nProvider';
import type { DealsStackParamList } from '../../types/navigation';

export const DealDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<DealsStackParamList, 'DealDetail'>>();
  const navigation = useNavigation<any>();
  const { dealId } = route.params;
  const {t} = useI18n();
  const userId = useAuthStore(s => s.user?.id);
  const { data: deal, isLoading } = useDealDetail(dealId);
  const { start, confirm, startPending, confirmPending } = useDealActions();

  if (isLoading || !deal) return <Loading />;

  const isProvider = userId === deal.providerUserId;
  const isClient = userId === deal.clientUserId;

  const handleStart = () => {
    Alert.alert(t('Werk starten'), t('Bevestig dat je begint met het werk.'), [
      { text: t('Annuleren'), style: 'cancel' },
      { text: t('Starten'), onPress: () => start(dealId) },
    ]);
  };

  const handleConfirm = () => {
    Alert.alert(
      t('Werk bevestigen'),
      t('Bevestig dat het werk naar tevredenheid is afgerond.'),
      [
        { text: t('Annuleren'), style: 'cancel' },
        { text: t('Bevestigen'), onPress: () => confirm(dealId) },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Timeline */}
        <Card style={styles.timelineCard}>
          <DealTimeline
            status={deal.status}
            timestamps={{
              createdAt: deal.createdAt,
              startedAt: deal.startedAt,
              completedAt: deal.completedAt,
              confirmedAt: deal.confirmedAt,
              closedAt: deal.closedAt,
            }}
          />
        </Card>

        {/* Job summary */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>{t('Opdracht')}</Text>
          <Text style={styles.jobTitle}>{deal.job?.title}</Text>
          <Text style={styles.jobMeta}>
            {deal.job?.postcode} {deal.job?.city}
          </Text>
        </Card>

        {/* Counterparty info */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isClient ? t('Vakman') : t('Opdrachtgever')}
          </Text>
          <View style={styles.personRow}>
            <Avatar
              name={isClient ? deal.provider?.user?.name : deal.client?.name}
              size={44}
            />
            <View>
              <Text style={styles.personName}>
                {isClient ? deal.provider?.user?.name : deal.client?.name}
              </Text>
              {isClient && deal.provider && (
                <View style={styles.ratingRow}>
                  <Icon name="star" size={14} color={colors.warning} />
                  <Text style={styles.ratingText}>
                    {deal.provider.ratingAvg.toFixed(1)} (
                    {deal.provider.ratingCount})
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Card>

        {/* Bid details */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>{t('Bod details')}</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('Prijs')}</Text>
            <Text style={styles.detailValue}>
              {deal.bid
                ? `${formatPrice(deal.bid.priceAmount)}${
                    deal.bid.priceType === 'hourly' ? t('/uur') : ''
                  }`
                : '–'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('Crew')}</Text>
            <Text style={styles.detailValue}>
              {deal.bid ? formatCrewSize(deal.bid.crewSize) : '–'}
            </Text>
          </View>
        </Card>

        {/* Completion proof */}
        {deal.completionPhotos && deal.completionPhotos.length > 0 && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>{t('Bewijs van voltooiing')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {deal.completionPhotos.map((photo, idx) => (
                <Image
                  key={idx}
                  source={{ uri: photo.url }}
                  style={styles.proofPhoto}
                />
              ))}
            </ScrollView>
            {deal.completionNote && (
              <Text style={styles.completionNote}>{deal.completionNote}</Text>
            )}
          </Card>
        )}

        {/* Actions */}
        {isProvider && deal.status === 'ACCEPTED' && (
          <Button
            title={t('Werk starten')}
            onPress={handleStart}
            loading={startPending}
            style={styles.actionBtn}
          />
        )}
        {isProvider && deal.status === 'IN_PROGRESS' && (
          <Button
            title={t('Werk afronden')}
            onPress={() => navigation.navigate('CompletionUpload', { dealId })}
            style={styles.actionBtn}
          />
        )}
        {isClient && deal.status === 'COMPLETED_PENDING_CLIENT_CONFIRM' && (
          <Button
            title={t('Bevestig voltooid')}
            onPress={handleConfirm}
            loading={confirmPending}
            style={styles.actionBtn}
          />
        )}
        {deal.status === 'COMPLETED_PENDING_REVIEWS' && (
          <Button
            title={t('Review schrijven')}
            onPress={() => navigation.navigate('Review', { dealId })}
            variant="secondary"
            style={styles.actionBtn}
          />
        )}

        {/* Report */}
        <TouchableOpacity
          style={styles.reportLink}
          onPress={() =>
            Alert.alert(
              t('Probleem melden'),
              t('Neem contact op met support@spoedmarktplaats.nl'),
            )
          }
        >
          <Icon name="flag" size={16} color={colors.textTertiary} />
          <Text style={styles.reportText}>{t('Probleem melden')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating chat button */}
      <TouchableOpacity
        style={styles.chatFab}
        onPress={() => navigation.navigate('Chat', { dealId })}
      >
        <Icon name="chat" size={24} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 100 },
  timelineCard: { marginBottom: spacing.lg, padding: spacing.lg },
  section: { marginBottom: spacing.md },
  sectionTitle: {
    ...typography.captionBold,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
  },
  jobTitle: { ...typography.h3, color: colors.textPrimary },
  jobMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  personRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  personName: { ...typography.bodyBold, color: colors.textPrimary },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    marginTop: spacing.xxs,
  },
  ratingText: { ...typography.caption, color: colors.textSecondary },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  detailLabel: { ...typography.body, color: colors.textSecondary },
  detailValue: { ...typography.bodyBold, color: colors.textPrimary },
  proofPhoto: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
  },
  completionNote: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  actionBtn: { marginTop: spacing.lg },
  reportLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.xl,
  },
  reportText: { ...typography.caption, color: colors.textTertiary },
  chatFab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
