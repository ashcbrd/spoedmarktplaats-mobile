import {useQuery, useMutation, useQueryClient, useInfiniteQuery} from '@tanstack/react-query';
import {bidsApi} from '../api/endpoints/bids';
import {showErrorAlert} from '../utils/errorHandling';

export const useBidsForJob = (jobId: string) =>
  useQuery({
    queryKey: ['bids', 'job', jobId],
    queryFn: () => bidsApi.forJob(jobId),
    enabled: !!jobId,
  });

export const useMyBids = (status?: string) =>
  useInfiniteQuery({
    queryKey: ['bids', 'mine', status],
    queryFn: ({pageParam = 1}) => bidsApi.myBids({status, page: pageParam}),
    getNextPageParam: (last, pages) =>
      last.data.length < 20 ? undefined : pages.length + 1,
    initialPageParam: 1,
  });

export const usePlaceBid = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bidsApi.place,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({queryKey: ['bids']});
      qc.invalidateQueries({queryKey: ['jobs', vars.jobId]});
    },
    onError: e => showErrorAlert(e),
  });
};

export const useBidActions = () => {
  const qc = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: bidsApi.accept,
    onSuccess: () => {
      qc.invalidateQueries({queryKey: ['bids']});
      qc.invalidateQueries({queryKey: ['deals']});
      qc.invalidateQueries({queryKey: ['jobs']});
    },
    onError: e => showErrorAlert(e),
  });

  const rejectMutation = useMutation({
    mutationFn: bidsApi.reject,
    onSuccess: () => qc.invalidateQueries({queryKey: ['bids']}),
    onError: e => showErrorAlert(e),
  });

  const withdrawMutation = useMutation({
    mutationFn: bidsApi.withdraw,
    onSuccess: () => qc.invalidateQueries({queryKey: ['bids']}),
    onError: e => showErrorAlert(e),
  });

  return {
    accept: acceptMutation.mutateAsync,
    reject: rejectMutation.mutateAsync,
    withdraw: withdrawMutation.mutateAsync,
    acceptPending: acceptMutation.isPending,
  };
};
