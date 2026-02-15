import {apiClient} from '../client';
import type {CreditTransaction, SubscriptionTier} from '../../types/models';

export const creditsApi = {
  balance: () =>
    apiClient.get<{balance: number}>('/credits/balance').then(r => r.data),

  transactions: (page = 1) =>
    apiClient
      .get<{data: CreditTransaction[]; total: number}>('/credits/transactions', {
        params: {page},
      })
      .then(r => r.data),

  purchase: (amount: number) =>
    apiClient
      .post<{balance: number}>('/credits/purchase', {amount})
      .then(r => r.data),

  plans: () =>
    apiClient.get<SubscriptionTier[]>('/subscriptions/plans').then(r => r.data),

  subscribe: (planKey: string) =>
    apiClient
      .post<{success: boolean}>('/subscriptions/subscribe', {planKey})
      .then(r => r.data),
};
