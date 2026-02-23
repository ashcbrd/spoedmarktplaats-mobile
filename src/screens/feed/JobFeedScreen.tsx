import React, { useState, useCallback, useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useJobFeed } from '../../hooks/useJobs';
import { useAuth } from '../../hooks/useAuth';
import { JobCard } from '../../components/jobs/JobCard';
import { JobFilters } from '../../components/jobs/JobFilters';
import { Loading } from '../../components/common/Loading';
import { EmptyState } from '../../components/common/EmptyState';
import { FeedSkeleton } from '../../components/common/Skeleton';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { theme } from '../../theme/theme';
import type { JobFilters as FilterType, Job } from '../../types/models';
import type { FeedStackParamList } from '../../types/navigation';

type Nav = NativeStackNavigationProp<FeedStackParamList, 'JobFeed'>;

export const JobFeedScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const [filters, setFilters] = useState<FilterType>({});

  const {
    data,
    isLoading,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useJobFeed(filters);

  const jobs = useMemo(
    () => data?.pages.flatMap(page => page.data) ?? [],
    [data],
  );

  const handleJobPress = useCallback(
    (job: Job) => {
      navigation.navigate('JobDetail', { jobId: job.id });
    },
    [navigation],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCreateJob = useCallback(() => {
    navigation.getParent()?.navigate('JobsTab', { screen: 'CreateJob' });
  }, [navigation]);

  const renderItem = useCallback(
    ({ item }: { item: Job }) => (
      <JobCard job={item} onPress={handleJobPress} />
    ),
    [handleJobPress],
  );

  const keyExtractor = useCallback((item: Job) => item.id, []);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return <Loading fullScreen={false} message="Meer laden..." />;
  }, [isFetchingNextPage]);

  if (isLoading) {
    return <FeedSkeleton />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <JobFilters filters={filters} onChange={setFilters} />

      {jobs.length === 0 ? (
        <EmptyState
          icon="clipboard-text-search-outline"
          title="Geen klussen gevonden"
          message="Pas je filters aan of kom later terug voor nieuwe opdrachten."
          actionLabel="Filters wissen"
          onAction={() => setFilters({})}
        />
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.list}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      )}

      {/* FAB for clients to create a new job */}
      {user?.role === 'client' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleCreateJob}
          activeOpacity={0.8}
        >
          <Icon name="plus" size={28} color={colors.white} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.huge,
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xxl,
    width: 58,
    height: 58,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.white,
    ...theme.elevation.md,
  },
});
