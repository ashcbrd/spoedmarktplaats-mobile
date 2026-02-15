import {apiClient} from '../client';
import type {Deal} from '../../types/models';
import type {PaginatedResponse} from './jobs';

export const dealsApi = {
  myDeals: (params?: {status?: string; page?: number}) =>
    apiClient
      .get<PaginatedResponse<Deal>>('/deals/my-deals', {params})
      .then(r => r.data),

  detail: (dealId: string) =>
    apiClient.get<Deal>(`/deals/${dealId}`).then(r => r.data),

  start: (dealId: string) =>
    apiClient.put<Deal>(`/deals/${dealId}/start`).then(r => r.data),

  complete: (dealId: string, body: {completionNote: string; photoIds: string[]}) =>
    apiClient.put<Deal>(`/deals/${dealId}/complete`, body).then(r => r.data),

  confirmCompleted: (dealId: string) =>
    apiClient.put<Deal>(`/deals/${dealId}/confirm-completed`).then(r => r.data),
};
