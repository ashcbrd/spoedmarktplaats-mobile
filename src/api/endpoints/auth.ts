import {apiClient} from '../client';
import type {User} from '../../types/models';

export interface AuthTokens {
  token: string;
  refreshToken: string;
  user: User;
}

export const authApi = {
  signup: (body: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'client' | 'provider';
    clientType?: 'b2c' | 'b2b';
  }) => apiClient.post<AuthTokens>('/auth/signup', body).then(r => r.data),

  login: (body: {email: string; password: string}) =>
    apiClient.post<AuthTokens>('/auth/login', body).then(r => r.data),

  sendOtp: (phone: string) =>
    apiClient.post('/auth/send-otp', {phone}).then(r => r.data),

  verifyPhone: (code: string) =>
    apiClient.post<{verified: boolean}>('/auth/verify-phone', {code}).then(r => r.data),

  refreshToken: (refreshToken: string) =>
    apiClient.post<AuthTokens>('/auth/refresh-token', {refreshToken}).then(r => r.data),

  me: () => apiClient.get<User>('/auth/me').then(r => r.data),

  logout: () => apiClient.post('/auth/logout').then(r => r.data),
};
