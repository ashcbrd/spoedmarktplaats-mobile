import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Card} from '../../components/common/Card';
import {Badge} from '../../components/common/Badge';
import {Loading} from '../../components/common/Loading';
import {EmptyState} from '../../components/common/EmptyState';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing, borderRadius} from '../../theme/spacing';
import {useMyBids} from '../../hooks/useBids';
import {formatPrice} from '../../utils/formatters';
import {relativeTime} from '../../utils/date';
import type {Bid} from '../../types/models';

const TABS = [
  {key: undefined, label: 'Alle'},
  {key: 'PENDING', label: 'In afwachting'},
  {key: 'ACCEPTED', label: 'Geaccepteerd'},
  {key: 'REJECTED', label: 'Afgewezen'},
] as const;

const statusVariant: Record<string, 'warning' | 'success' | 'error' | 'neutral'> = {
  PENDING: 'warning', ACCEPTED: 'success', REJECTED: 'error', WITHDRAWN: 'neutral', EXPIRED: 'neutral',
};

export const MyBidsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [tab, setTab] = useState<string | undefined>(undefined);
  const {data, isLoading, fetchNextPage, hasNextPage, refetch} = useMyBids(tab);
  const bids = data?.pages.flatMap(p => p.data) ?? [];

  const handlePress = (bid: Bid) => {
    if (bid.status === 'ACCEPTED') {
      navigation.navigate('DealsTab', {screen: 'ActiveDeals'});
    } else {
      navigation.navigate('FeedTab', {screen: 'JobDetail', params: {jobId: bid.jobId}});
    }
  };

  const renderBid = ({item}: {item: Bid}) => (
    <Card onPress={() => handlePress(item)} style={styles.bidCard}>
      <View style={styles.bidHeader}>
        <Text style={styles.bidTitle} numberOfLines={1}>{item.job?.title ?? 'Opdracht'}</Text>
        <Badge label={item.status} variant={statusVariant[item.status] ?? 'neutral'} small />
      </View>
      <View style={styles.bidDetails}>
        <Text style={styles.bidPrice}>{formatPrice(item.priceAmount)}{item.priceType === 'hourly' ? '/uur' : ''}</Text>
        <Text style={styles.bidDate}>{relativeTime(item.createdAt)}</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {TABS.map(t => (
          <TouchableOpacity key={t.label} style={[styles.tab, tab === t.key && styles.tabActive]} onPress={() => setTab(t.key)}>
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {isLoading ? <Loading /> : (
        <FlatList
          data={bids}
          keyExtractor={item => item.id}
          renderItem={renderBid}
          contentContainerStyle={styles.list}
          onEndReached={() => hasNextPage && fetchNextPage()}
          refreshing={false}
          onRefresh={refetch}
          ListEmptyComponent={<EmptyState icon="hand-back-right-outline" title="Geen biedingen" message="Je hebt nog geen biedingen geplaatst" />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  tabs: {flexDirection: 'row', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, gap: spacing.sm},
  tab: {paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.surfaceSecondary},
  tabActive: {backgroundColor: colors.primary},
  tabText: {...typography.captionBold, color: colors.textPrimary},
  tabTextActive: {color: colors.white},
  list: {padding: spacing.lg, paddingBottom: 40},
  bidCard: {marginBottom: spacing.sm},
  bidHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  bidTitle: {...typography.bodyBold, color: colors.textPrimary, flex: 1, marginRight: spacing.sm},
  bidDetails: {flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm},
  bidPrice: {...typography.bodyBold, color: colors.primary},
  bidDate: {...typography.caption, color: colors.textTertiary},
});
