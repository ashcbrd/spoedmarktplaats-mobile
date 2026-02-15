import {apiClient} from '../client';
import type {AppNotification} from '../../types/models';

export const notificationsApi = {
  registerToken: (fcmToken: string, platform: 'ios' | 'android') =>
    apiClient
      .post('/notifications/register-token', {fcmToken, platform})
      .then(r => r.data),

  list: (page = 1) =>
    apiClient
      .get<{data: AppNotification[]; total: number; unread: number}>(
        '/notifications/my-notifications',
        {params: {page}},
      )
      .then(r => r.data),

  markRead: (id: string) =>
    apiClient.put(`/notifications/${id}/read`).then(r => r.data),

  markAllRead: () =>
    apiClient.put('/notifications/read-all').then(r => r.data),
};
