import {apiClient} from '../client';
import type {Bid} from '../../types/models';
import type {PaginatedResponse} from './jobs';

export const bidsApi = {
  forJob: (jobId: string) =>
    apiClient.get<Bid[]>(`/jobs/${jobId}/bids`).then(r => r.data),

  myBids: (params?: {status?: string; page?: number}) =>
    apiClient
      .get<PaginatedResponse<Bid>>('/bids/my-bids', {params})
      .then(r => r.data),

  place: (body: {
    jobId: string;
    priceType: 'fixed' | 'hourly';
    priceAmount: number;
    eta: string;
    crewSize: number;
    message?: string;
  }) => apiClient.post<Bid>('/bids', body).then(r => r.data),

  accept: (bidId: string) =>
    apiClient.post<{dealId: string}>(`/bids/${bidId}/accept`).then(r => r.data),

  reject: (bidId: string) =>
    apiClient.post(`/bids/${bidId}/reject`).then(r => r.data),

  withdraw: (bidId: string) =>
    apiClient.put(`/bids/${bidId}/withdraw`).then(r => r.data),

  rebid: (
    bidId: string,
    body: {priceType: 'fixed' | 'hourly'; priceAmount: number; eta: string; crewSize: number; message?: string},
  ) => apiClient.post<Bid>(`/bids/${bidId}/rebid`, body).then(r => r.data),
};
