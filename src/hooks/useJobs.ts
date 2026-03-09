import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { jobsApi } from '../api/endpoints/jobs';
import type { Job, JobFilters } from '../types/models';
import { showErrorAlert } from '../utils/errorHandling';

const makeIdempotencyKey = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const useJobFeed = (filters?: JobFilters) =>
  useInfiniteQuery({
    queryKey: ['jobs', 'feed', filters],
    queryFn: ({ pageParam = 1 }) =>
      jobsApi.list({ ...filters, page: pageParam }),
    getNextPageParam: (last, pages) =>
      last.data.length < (filters?.limit ?? 20) ? undefined : pages.length + 1,
    initialPageParam: 1,
  });

export const useJobDetail = (jobId: string) =>
  useQuery({
    queryKey: ['jobs', jobId],
    queryFn: () => jobsApi.detail(jobId),
    enabled: !!jobId,
  });

export const useMyJobs = (status?: string) =>
  useInfiniteQuery({
    queryKey: ['jobs', 'mine', status],
    queryFn: ({ pageParam = 1 }) => jobsApi.myJobs({ status, page: pageParam }),
    getNextPageParam: (last, pages) =>
      last.data.length < 20 ? undefined : pages.length + 1,
    initialPageParam: 1,
  });

export const useCreateJob = () => {
  return useMutation({
    mutationFn: jobsApi.createDraft,
    onError: e => showErrorAlert(e),
  });
};

export const useUpdateDraftJob = () => {
  return useMutation({
    mutationFn: ({ jobId, body }: { jobId: string; body: Partial<Job> }) =>
      jobsApi.updateDraft(jobId, body),
    onError: e => showErrorAlert(e),
  });
};

export const usePublishJob = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: string) => {
      const idempotencyKey = makeIdempotencyKey();
      try {
        return await jobsApi.publish(jobId, { idempotencyKey });
      } catch (error: any) {
        const isNetworkError = !error?.response;
        if (isNetworkError) {
          return jobsApi.publish(jobId, { idempotencyKey });
        }
        throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['jobs'] });
      qc.invalidateQueries({ queryKey: ['credits', 'balance'] });
    },
  });
};

export const useJobActions = () => {
  const qc = useQueryClient();

  const boostMutation = useMutation({
    mutationFn: jobsApi.boost,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
    onError: e => showErrorAlert(e),
  });

  const pingMutation = useMutation({
    mutationFn: jobsApi.pingTop5,
    onError: e => showErrorAlert(e),
  });

  const extendMutation = useMutation({
    mutationFn: ({ jobId, hours }: { jobId: string; hours: 6 | 24 }) =>
      jobsApi.extend(jobId, hours),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
    onError: e => showErrorAlert(e),
  });

  const repostMutation = useMutation({
    mutationFn: jobsApi.repost,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
    onError: e => showErrorAlert(e),
  });

  const cancelMutation = useMutation({
    mutationFn: jobsApi.cancel,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['jobs'] }),
    onError: e => showErrorAlert(e),
  });

  return {
    boost: boostMutation.mutateAsync,
    ping: pingMutation.mutateAsync,
    extend: extendMutation.mutateAsync,
    repost: repostMutation.mutateAsync,
    cancel: cancelMutation.mutateAsync,
  };
};
