import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {usersApi} from '../api/endpoints/users';
import {showErrorAlert} from '../utils/errorHandling';
import type {ProviderVerification} from '../types/models';

export const useVerification = () => {
  const qc = useQueryClient();

  const statusQuery = useQuery({
    queryKey: ['verification'],
    queryFn: usersApi.getVerificationStatus,
  });

  const uploadIdMutation = useMutation({
    mutationFn: usersApi.uploadId,
    onSuccess: () => qc.invalidateQueries({queryKey: ['verification']}),
    onError: e => showErrorAlert(e),
  });

  const kvkMutation = useMutation({
    mutationFn: usersApi.verifyKvk,
    onSuccess: () => qc.invalidateQueries({queryKey: ['verification']}),
    onError: e => showErrorAlert(e),
  });

  const ibanMutation = useMutation({
    mutationFn: usersApi.verifyIban,
    onSuccess: () => qc.invalidateQueries({queryKey: ['verification']}),
    onError: e => showErrorAlert(e),
  });

  const docMutation = useMutation({
    mutationFn: usersApi.uploadDocument,
    onSuccess: () => qc.invalidateQueries({queryKey: ['verification']}),
    onError: e => showErrorAlert(e),
  });

  const canBid = (verification?: ProviderVerification | null): {allowed: boolean; reason?: string} => {
    if (!verification) {
      return {allowed: false, reason: 'Verificatiestatus onbekend'};
    }
    if (verification.idVerified !== 'verified') {
      return {allowed: false, reason: 'ID-verificatie vereist'};
    }
    if (verification.isZzp) {
      if (verification.kvkVerified !== 'verified') {
        return {allowed: false, reason: 'KvK-verificatie vereist'};
      }
      if (verification.ibanVerified !== 'verified') {
        return {allowed: false, reason: 'IBAN-verificatie vereist'};
      }
    }
    return {allowed: true};
  };

  return {
    verification: statusQuery.data ?? null,
    isLoading: statusQuery.isLoading,
    uploadId: uploadIdMutation.mutateAsync,
    verifyKvk: kvkMutation.mutateAsync,
    verifyIban: ibanMutation.mutateAsync,
    uploadDocument: docMutation.mutateAsync,
    canBid,
  };
};
