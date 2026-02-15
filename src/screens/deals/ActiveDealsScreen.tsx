import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {DealCard} from '../../components/deals/DealCard';
import {Loading} from '../../components/common/Loading';
import {EmptyState} from '../../components/common/EmptyState';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing, borderRadius} from '../../theme/spacing';
import {useMyDeals} from '../../hooks/useDeals';
import type {Deal} from '../../types/models';

const TABS = [{key: 'active', label: 'Actief'}, {key: 'closed', label: 'Afgerond'}] as const;

export const ActiveDealsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [tab, setTab] = useState<'active' | 'closed'>('active');
  const statusFilter = tab === 'closed' ? 'CLOSED' : undefined;
  const {data, isLoading, fetchNextPage, hasNextPage, refetch} = useMyDeals(statusFilter);
  const deals = (data?.pages.flatMap(p => p.data) ?? []).filter(d =>
    tab === 'active' ? d.status !== 'CLOSED' : d.status === 'CLOSED',
  );

  const handlePress = (deal: Deal) => {
    navigation.navigate('DealDetail', {dealId: deal.id});
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {TABS.map(t => (
          <TouchableOpacity key={t.key} style={[styles.tab, tab === t.key && styles.tabActive]} onPress={() => setTab(t.key)}>
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {isLoading ? <Loading /> : (
        <FlatList
          data={deals}
          keyExtractor={item => item.id}
          renderItem={({item}) => <DealCard deal={item} onPress={handlePress} />}
          contentContainerStyle={styles.list}
          onEndReached={() => hasNextPage && fetchNextPage()}
          refreshing={false}
          onRefresh={refetch}
          ListEmptyComponent={<EmptyState icon="handshake-outline" title="Geen deals" message={tab === 'active' ? 'Je hebt nog geen actieve deals' : 'Je hebt nog geen afgeronde deals'} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  tabs: {flexDirection: 'row', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, gap: spacing.sm},
  tab: {paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: colors.surfaceSecondary},
  tabActive: {backgroundColor: colors.primary},
  tabText: {...typography.captionBold, color: colors.textPrimary},
  tabTextActive: {color: colors.white},
  list: {padding: spacing.lg, paddingBottom: 40},
});
