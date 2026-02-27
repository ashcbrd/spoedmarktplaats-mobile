import axios, {AxiosInstance, InternalAxiosRequestConfig} from 'axios';
import {ENV} from '../config/env';
import {getRuntimeLanguage} from '../i18n/runtimeLanguage';
import {useAuthStore} from '../store/authStore';
import {useNetworkStore} from '../store/networkStore';

const SESSION_IDLE_LIMIT_MS = 15 * 60 * 1000;

type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  error?: {
    code?: string;
    status?: number;
    message?: string;
  };
  meta?: {
    requestId?: string;
    timestamp?: string;
    path?: string;
  };
};

const isEnvelope = (value: unknown): value is ApiEnvelope<unknown> => {
  if (!value || typeof value !== 'object') return false;
  return Object.prototype.hasOwnProperty.call(value, 'success');
};

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: ENV.API_BASE_URL,
    timeout: 30_000,
    headers: {'Content-Type': 'application/json'},
  });

  // ── Attach token ────────────────────────
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const {token, clearAuth, hasSessionExpired, touchSession} = useAuthStore.getState();

    if (hasSessionExpired(SESSION_IDLE_LIMIT_MS)) {
      clearAuth();
      return Promise.reject(
        new Error(
          getRuntimeLanguage() === 'en'
            ? 'Session expired due to inactivity'
            : 'Sessie verlopen door inactiviteit',
        ),
      );
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      touchSession();
    }

    useNetworkStore.getState().markApiHealthy();

    return config;
  });

  // ── Refresh on 401 ─────────────────────
  client.interceptors.response.use(
    res => {
      if (isEnvelope(res.data) && res.data.success && 'data' in res.data) {
        res.data = res.data.data;
      }

      useAuthStore.getState().touchSession();
      useNetworkStore.getState().markApiHealthy();
      return res;
    },
    async error => {
      const orig = error.config;

      if (!error.response) {
        useNetworkStore.getState().markApiDegraded();
      }

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
          useNetworkStore.getState().markApiHealthy();
          return client(orig);
        } catch {
          useAuthStore.getState().clearAuth();
          return Promise.reject(error);
        }
      }

      if (error.response) {
        useNetworkStore.getState().markApiHealthy();
      }

      return Promise.reject(error);
    },
  );

  return client;
};

export const apiClient = createApiClient();
