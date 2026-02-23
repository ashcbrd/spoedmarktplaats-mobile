import Constants from 'expo-constants';

// All values come from app.config.js extra field
const extra = Constants.expoConfig?.extra || {};

export const ENV = {
  API_BASE_URL: extra.apiBaseUrl || 'http://localhost:3000/api/v1',
  WS_URL: extra.wsUrl || 'ws://localhost:3000/chat',
  ENVIRONMENT: (extra.environment || 'development') as
    | 'development'
    | 'staging'
    | 'production',
};
