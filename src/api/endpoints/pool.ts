import {apiClient} from '../client';
import type {PoolMember, PoolInvite} from '../../types/models';

export const poolApi = {
  members: (orgId: string) =>
    apiClient.get<PoolMember[]>(`/private-pools/${orgId}`).then(r => r.data),

  addMember: (
    orgId: string,
    body: {firstName: string; lastName: string; email: string; phone?: string; notes?: string},
  ) =>
    apiClient.post<PoolMember>(`/private-pools/${orgId}/members`, body).then(r => r.data),

  importCsv: (orgId: string, formData: FormData) =>
    apiClient
      .post<{imported: number; failed: number; errors: string[]}>(
        `/private-pools/${orgId}/import-csv`,
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}},
      )
      .then(r => r.data),

  removeMember: (orgId: string, memberId: string) =>
    apiClient.delete(`/private-pools/${orgId}/members/${memberId}`).then(r => r.data),

  // Provider side
  myInvites: () =>
    apiClient.get<PoolInvite[]>('/private-pools/invites').then(r => r.data),

  acceptInvite: (inviteId: string) =>
    apiClient.put(`/private-pools/invites/${inviteId}/accept`).then(r => r.data),

  declineInvite: (inviteId: string) =>
    apiClient.put(`/private-pools/invites/${inviteId}/decline`).then(r => r.data),
};
