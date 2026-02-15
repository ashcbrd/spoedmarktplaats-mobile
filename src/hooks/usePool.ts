import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {poolApi} from '../api/endpoints/pool';
import {showErrorAlert} from '../utils/errorHandling';

export const usePoolMembers = (orgId: string) =>
  useQuery({
    queryKey: ['pool', orgId],
    queryFn: () => poolApi.members(orgId),
    enabled: !!orgId,
  });

export const usePoolActions = (orgId: string) => {
  const qc = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (body: {firstName: string; lastName: string; email: string; phone?: string; notes?: string}) =>
      poolApi.addMember(orgId, body),
    onSuccess: () => qc.invalidateQueries({queryKey: ['pool', orgId]}),
    onError: e => showErrorAlert(e),
  });

  const importMutation = useMutation({
    mutationFn: (formData: FormData) => poolApi.importCsv(orgId, formData),
    onSuccess: () => qc.invalidateQueries({queryKey: ['pool', orgId]}),
    onError: e => showErrorAlert(e),
  });

  const removeMutation = useMutation({
    mutationFn: (memberId: string) => poolApi.removeMember(orgId, memberId),
    onSuccess: () => qc.invalidateQueries({queryKey: ['pool', orgId]}),
    onError: e => showErrorAlert(e),
  });

  return {
    addMember: addMutation.mutateAsync,
    importCsv: importMutation.mutateAsync,
    removeMember: removeMutation.mutateAsync,
    isImporting: importMutation.isPending,
  };
};

export const useMyPoolInvites = () =>
  useQuery({
    queryKey: ['pool', 'invites'],
    queryFn: poolApi.myInvites,
  });

export const usePoolInviteActions = () => {
  const qc = useQueryClient();
  const acceptMutation = useMutation({
    mutationFn: poolApi.acceptInvite,
    onSuccess: () => qc.invalidateQueries({queryKey: ['pool']}),
    onError: e => showErrorAlert(e),
  });
  const declineMutation = useMutation({
    mutationFn: poolApi.declineInvite,
    onSuccess: () => qc.invalidateQueries({queryKey: ['pool']}),
    onError: e => showErrorAlert(e),
  });
  return {
    accept: acceptMutation.mutateAsync,
    decline: declineMutation.mutateAsync,
  };
};
