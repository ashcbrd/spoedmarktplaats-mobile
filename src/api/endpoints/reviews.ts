import {apiClient} from '../client';
import type {Review} from '../../types/models';

export const reviewsApi = {
  submit: (body: {dealId: string; stars: number; tags: string[]; text?: string}) =>
    apiClient.post<Review>('/reviews', body).then(r => r.data),

  forUser: (userId: string) =>
    apiClient.get<Review[]>(`/reviews/${userId}`).then(r => r.data),

  forDeal: (dealId: string) =>
    apiClient.get<Review[]>(`/reviews/deal/${dealId}`).then(r => r.data),
};
