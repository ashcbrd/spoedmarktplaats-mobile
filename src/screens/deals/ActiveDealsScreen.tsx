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
import {useI18n} from '../../i18n/I18nProvider';
import type {Deal} from '../../types/models';

export const ActiveDealsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {t} = useI18n();
  const [tab, setTab] = useState<'active' | 'closed'>('active');
  const statusFilter = tab === 'closed' ? 'CLOSED' : undefined;
  const {data, isLoading, fetchNextPage, hasNextPage, refetch} = useMyDeals(statusFilter);
  const deals = (data?.pages.flatMap(p => p.data) ?? []).filter(d =>
    tab === 'active' ? d.status !== 'CLOSED' : d.status === 'CLOSED',
  );

  const TABS = [{key: 'active' as const, label: t('Actief')}, {key: 'closed' as const, label: t('Afgerond')}];

  const handlePress = (deal: Deal) => {
    navigation.navigate('DealDetail', {dealId: deal.id});
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {TABS.map(item => (
          <TouchableOpacity key={item.key} style={[styles.tab, tab === item.key && styles.tabActive]} onPress={() => setTab(item.key)}>
            <Text style={[styles.tabText, tab === item.key && styles.tabTextActive]}>{item.label}</Text>
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
          ListEmptyComponent={<EmptyState icon="handshake-outline" title={t('Geen deals')} message={tab === 'active' ? t('Je hebt nog geen actieve deals') : t('Je hebt nog geen afgeronde deals')} />}
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
