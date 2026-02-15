import {apiClient} from '../client';
import type {ChatMessage} from '../../types/models';

export const chatApi = {
  messages: (dealId: string, page = 1) =>
    apiClient
      .get<{data: ChatMessage[]; total: number}>(`/chat/${dealId}/messages`, {
        params: {page},
      })
      .then(r => r.data),

  send: (dealId: string, message: string) =>
    apiClient
      .post<ChatMessage>(`/chat/${dealId}/messages`, {message})
      .then(r => r.data),
};
