import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useJobDetail } from '../../hooks/useJobs';
import { useAuth } from '../../hooks/useAuth';
import { UrgencyTimer } from '../../components/jobs/UrgencyTimer';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Loading } from '../../components/common/Loading';
import { Card } from '../../components/common/Card';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { formatBudget } from '../../utils/formatters';
import { isExpired, getUrgencyLabel } from '../../utils/date';
import { SUBCATEGORIES } from '../../config/constants';
import type { FeedStackParamList } from '../../types/navigation';
import type { Attachment } from '../../types/models';

type DetailRoute = RouteProp<FeedStackParamList, 'JobDetail'>;
type Nav = NativeStackNavigationProp<FeedStackParamList, 'JobDetail'>;

export const JobDetailScreen: React.FC = () => {
  const route = useRoute<DetailRoute>();
  const navigation = useNavigation<Nav>();
  const { jobId } = route.params;
  const { user } = useAuth();

  const { data: job, isLoading } = useJobDetail(jobId);

  const expired = job ? isExpired(job.bidWindowEnd) : false;
  const isOwner = job?.clientUserId === user?.id;
  const subcat = job
    ? SUBCATEGORIES.find(s => s.key === job.subcategory)
    : undefined;

  const handlePlaceBid = useCallback(() => {
    navigation.navigate('PlaceBid', { jobId });
  }, [navigation, jobId]);

  const handleManage = useCallback(() => {
    navigation
      .getParent()
      ?.navigate('JobsTab', { screen: 'JobManagement', params: { jobId } });
  }, [navigation, jobId]);

  if (isLoading || !job) {
    return <Loading message="Klus ophalen..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Urgency + status header */}
        <View style={styles.headerRow}>
          <UrgencyTimer bidWindowEnd={job.bidWindowEnd} urgency={job.urgency} />
          <View style={styles.headerBadges}>
            {job.boostedUntil && (
              <Badge
                label="Boost"
                variant="warning"
                icon="rocket-launch"
                small
              />
            )}
            {job.visibility === 'private_pool' && (
              <Badge label="Privaat" variant="purple" icon="lock" small />
            )}
            <Badge
              label={getUrgencyLabel(job.urgency)}
              variant={
                job.urgency === 'ASAP'
                  ? 'error'
                  : job.urgency === 'TODAY'
                  ? 'warning'
                  : job.urgency === 'SCHEDULED'
                  ? 'info'
                  : 'success'
              }
              small
            />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{job.title}</Text>

        {/* Category + location */}
        <View style={styles.metaRow}>
          {subcat && (
            <View style={styles.metaItem}>
              <Icon name={subcat.icon} size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{subcat.label}</Text>
            </View>
          )}
          <View style={styles.metaItem}>
            <Icon name="map-marker" size={16} color={colors.textSecondary} />
            <Text style={styles.metaText}>
              {job.postcode} {job.city}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Beschrijving</Text>
          <Text style={styles.description}>{job.description}</Text>
        </Card>

        {/* Budget */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Budget</Text>
          <Text style={styles.budgetValue}>
            {formatBudget(
              job.budgetType,
              job.budgetAmount,
              job.budgetMin,
              job.budgetMax,
            )}
          </Text>
        </Card>

        {/* Workers needed + staffing status */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Personeel</Text>
          <View style={styles.workerRow}>
            <Icon name="account-group" size={18} color={colors.textSecondary} />
            <Text style={styles.workerText}>
              {job.workersNeeded} werknemer{job.workersNeeded !== 1 ? 's' : ''}{' '}
              nodig
            </Text>
          </View>
          {(job.acceptedCrewTotal ?? 0) > 0 && (
            <View style={styles.staffingRow}>
              <View style={styles.staffingBar}>
                <View
                  style={[
                    styles.staffingFill,
                    {
                      width: `${Math.min(
                        100,
                        ((job.acceptedCrewTotal ?? 0) / job.workersNeeded) *
                          100,
                      )}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.staffingText}>
                {job.acceptedCrewTotal}/{job.workersNeeded} ingevuld
              </Text>
            </View>
          )}
          {(job.bidsCount ?? 0) > 0 && (
            <View style={styles.bidCountRow}>
              <Icon name="hand-back-right" size={16} color={colors.primary} />
              <Text style={styles.bidCountText}>
                {job.bidsCount} bod{(job.bidsCount ?? 0) !== 1 ? 'en' : ''}{' '}
                ontvangen
              </Text>
            </View>
          )}
        </Card>

        {/* Requirements */}
        {(job.requirements.ownTools ||
          job.requirements.ownTransport ||
          job.requirements.bouwpasRequired ||
          job.requirements.vcaRequired ||
          job.requirements.accessNotes) && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Vereisten</Text>
            <View style={styles.reqBadges}>
              {job.requirements.ownTools && (
                <Badge
                  label="Eigen gereedschap"
                  icon="tools"
                  variant="neutral"
                />
              )}
              {job.requirements.ownTransport && (
                <Badge label="Eigen vervoer" icon="car" variant="neutral" />
              )}
              {job.requirements.bouwpasRequired && (
                <Badge
                  label="Bouwpas"
                  icon="card-account-details"
                  variant="warning"
                />
              )}
              {job.requirements.vcaRequired && (
                <Badge label="VCA" icon="certificate" variant="warning" />
              )}
            </View>
            {job.requirements.accessNotes && (
              <Text style={styles.accessNotes}>
                {job.requirements.accessNotes}
              </Text>
            )}
          </Card>
        )}

        {/* Attachments */}
        {job.attachments.length > 0 && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Bijlagen</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.attachScroll}
            >
              {job.attachments.map((att: Attachment) => (
                <TouchableOpacity key={att.id} style={styles.attachThumb}>
                  {att.type === 'photo' ? (
                    <Image
                      source={{ uri: att.thumbnailUrl ?? att.url }}
                      style={styles.attachImage}
                    />
                  ) : (
                    <View style={styles.attachFile}>
                      <Icon
                        name={
                          att.type === 'pdf' ? 'file-pdf-box' : 'file-document'
                        }
                        size={32}
                        color={colors.error}
                      />
                      <Text style={styles.attachFileName} numberOfLines={1}>
                        {att.fileName}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Card>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        {isOwner ? (
          <Button
            title="Beheren"
            onPress={handleManage}
            variant="secondary"
            size="lg"
            icon={<Icon name="cog" size={20} color={colors.white} />}
            style={styles.ctaButton}
          />
        ) : (
          <Button
            title="Bod plaatsen"
            onPress={handlePlaceBid}
            disabled={expired}
            size="lg"
            icon={
              <Icon name="hand-back-right" size={20} color={colors.white} />
            }
            style={styles.ctaButton}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.huge,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerBadges: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
  },
  budgetValue: {
    ...typography.h3,
    color: colors.primary,
  },
  workerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  workerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  staffingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  staffingBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  staffingFill: {
    height: 8,
    backgroundColor: colors.success,
    borderRadius: borderRadius.full,
  },
  staffingText: {
    ...typography.captionBold,
    color: colors.success,
  },
  bidCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  bidCountText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  reqBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  accessNotes: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  attachScroll: {
    flexGrow: 0,
  },
  attachThumb: {
    width: 100,
    height: 100,
    marginRight: spacing.sm,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  attachImage: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.sm,
  },
  attachFile: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  attachFileName: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
    textAlign: 'center',
  },
  bottomBar: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  ctaButton: {
    width: '100%',
  },
});
