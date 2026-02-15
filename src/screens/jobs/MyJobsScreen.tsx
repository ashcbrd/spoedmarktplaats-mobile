import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {JobCard} from '../../components/jobs/JobCard';
import {Loading} from '../../components/common/Loading';
import {EmptyState} from '../../components/common/EmptyState';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing, borderRadius} from '../../theme/spacing';
import {useMyJobs} from '../../hooks/useJobs';
import type {Job} from '../../types/models';

const TABS = [
  {key: undefined, label: 'Alle'},
  {key: 'OPEN', label: 'Open'},
  {key: 'CLOSED', label: 'Gesloten'},
] as const;

export const MyJobsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const {data, isLoading, fetchNextPage, hasNextPage, refetch} = useMyJobs(activeTab);

  const jobs = data?.pages.flatMap(p => p.data) ?? [];

  const handlePress = (job: Job) => {
    navigation.navigate('JobManagement', {jobId: job.id});
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t.label}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
            onPress={() => setActiveTab(t.key)}>
            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={item => item.id}
          renderItem={({item}) => <JobCard job={item} onPress={handlePress} />}
          contentContainerStyle={styles.list}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          refreshing={false}
          onRefresh={refetch}
          ListEmptyComponent={
            <EmptyState
              icon="clipboard-text-outline"
              title="Geen opdrachten"
              message="Je hebt nog geen opdrachten geplaatst"
              actionLabel="Opdracht plaatsen"
              onAction={() => navigation.navigate('CreateJob')}
            />
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateJob')}>
        <Icon name="plus" size={28} color={colors.white} />
      </TouchableOpacity>
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
  list: {padding: spacing.lg, paddingBottom: 80},
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.black, shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  },
});
