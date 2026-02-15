import axios, {AxiosInstance, InternalAxiosRequestConfig} from 'axios';
import {ENV} from '../config/env';
import {useAuthStore} from '../store/authStore';

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: ENV.API_BASE_URL,
    timeout: 30_000,
    headers: {'Content-Type': 'application/json'},
  });

  // ── Attach token ────────────────────────
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const {token} = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // ── Refresh on 401 ─────────────────────
  client.interceptors.response.use(
    res => res,
    async error => {
      const orig = error.config;
      if (error.response?.status === 401 && !orig._retry) {
        orig._retry = true;
        try {
          const {refreshToken} = useAuthStore.getState();
          if (!refreshToken) {
            throw new Error('No refresh token');
          }
          const {data} = await client.post('/auth/refresh-token', {
            refreshToken,
          });
          useAuthStore.getState().setTokens(data.token, data.refreshToken);
          orig.headers.Authorization = `Bearer ${data.token}`;
          return client(orig);
        } catch {
          useAuthStore.getState().clearAuth();
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    },
  );

  return client;
};

export const apiClient = createApiClient();
