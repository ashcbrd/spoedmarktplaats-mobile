import React, { type ComponentProps } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { Loading } from '../../components/common/Loading';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { useNotifications } from '../../hooks/useNotifications';
import { relativeTime } from '../../utils/date';
import type { AppNotification, NotificationType } from '../../types/models';

const NOTIF_ICONS: Record<NotificationType, ComponentProps<typeof Icon>['name']> = {
  new_bid: 'hand-back-right',
  bid_accepted: 'check-circle',
  bid_rejected: 'close-circle',
  provider_started: 'progress-wrench',
  provider_completed: 'check-decagram',
  client_confirmed: 'thumb-up',
  review_required: 'star',
  new_message: 'chat',
  job_expiring: 'clock-alert',
  job_alert: 'bell-ring',
  pool_invite: 'account-plus',
  pool_accepted: 'account-check',
};

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { notifications, isLoading, markRead, markAllRead, unreadCount } =
    useNotifications();

  const handlePress = (notif: AppNotification) => {
    markRead(notif.id);
    const { data } = notif;
    if (data?.dealId) {
      navigation.navigate('DealsTab', {
        screen: 'DealDetail',
        params: { dealId: data.dealId },
      });
    } else if (data?.jobId) {
      navigation.navigate('FeedTab', {
        screen: 'JobDetail',
        params: { jobId: data.jobId },
      });
    }
  };

  const renderItem = ({ item }: { item: AppNotification }) => (
    <TouchableOpacity
      style={[styles.item, !item.read && styles.itemUnread]}
      onPress={() => handlePress(item)}
    >
      <Icon
        name={NOTIF_ICONS[item.type] ?? 'bell'}
        size={22}
        color={item.read ? colors.textTertiary : colors.primary}
      />
      <View style={styles.itemContent}>
        <Text style={[styles.itemTitle, !item.read && styles.itemTitleUnread]}>
          {item.title}
        </Text>
        <Text style={styles.itemBody} numberOfLines={2}>
          {item.body}
        </Text>
        <Text style={styles.itemTime}>{relativeTime(item.createdAt)}</Text>
      </View>
      {!item.read && <View style={styles.dot} />}
    </TouchableOpacity>
  );

  if (isLoading) return <Loading />;

  return (
    <View style={styles.container}>
      {unreadCount > 0 && (
        <View style={styles.headerAction}>
          <Button
            title="Alles gelezen"
            onPress={markAllRead}
            variant="ghost"
            size="sm"
          />
        </View>
      )}
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState
            icon="bell-off-outline"
            title="Geen meldingen"
            message="Je hebt nog geen meldingen ontvangen"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerAction: { alignItems: 'flex-end', padding: spacing.md },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  itemUnread: { backgroundColor: colors.primary + '08' },
  itemContent: { flex: 1 },
  itemTitle: { ...typography.body, color: colors.textPrimary },
  itemTitleUnread: { fontWeight: '600' },
  itemBody: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xxs,
  },
  itemTime: {
    ...typography.small,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: spacing.xs,
  },
});
