import {useQuery, useMutation, useQueryClient, useInfiniteQuery} from '@tanstack/react-query';
import {dealsApi} from '../api/endpoints/deals';
import {showErrorAlert} from '../utils/errorHandling';

export const useMyDeals = (status?: string) =>
  useInfiniteQuery({
    queryKey: ['deals', 'mine', status],
    queryFn: ({pageParam = 1}) => dealsApi.myDeals({status, page: pageParam}),
    getNextPageParam: (last, pages) =>
      last.data.length < 20 ? undefined : pages.length + 1,
    initialPageParam: 1,
  });

export const useDealDetail = (dealId: string) =>
  useQuery({
    queryKey: ['deals', dealId],
    queryFn: () => dealsApi.detail(dealId),
    enabled: !!dealId,
    refetchInterval: 30_000, // poll every 30s for status updates
  });

export const useDealActions = () => {
  const qc = useQueryClient();

  const startMutation = useMutation({
    mutationFn: dealsApi.start,
    onSuccess: (_, dealId) => {
      qc.invalidateQueries({queryKey: ['deals', dealId]});
      qc.invalidateQueries({queryKey: ['deals', 'mine']});
    },
    onError: e => showErrorAlert(e),
  });

  const completeMutation = useMutation({
    mutationFn: ({dealId, completionNote, photoIds}: {dealId: string; completionNote: string; photoIds: string[]}) =>
      dealsApi.complete(dealId, {completionNote, photoIds}),
    onSuccess: (_, {dealId}) => {
      qc.invalidateQueries({queryKey: ['deals', dealId]});
      qc.invalidateQueries({queryKey: ['deals', 'mine']});
    },
    onError: e => showErrorAlert(e),
  });

  const confirmMutation = useMutation({
    mutationFn: dealsApi.confirmCompleted,
    onSuccess: (_, dealId) => {
      qc.invalidateQueries({queryKey: ['deals', dealId]});
      qc.invalidateQueries({queryKey: ['deals', 'mine']});
    },
    onError: e => showErrorAlert(e),
  });

  return {
    start: startMutation.mutateAsync,
    complete: completeMutation.mutateAsync,
    confirm: confirmMutation.mutateAsync,
    startPending: startMutation.isPending,
    completePending: completeMutation.isPending,
    confirmPending: confirmMutation.isPending,
  };
};
