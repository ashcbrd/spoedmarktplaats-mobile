import {AxiosError} from 'axios';
import {Alert} from 'react-native';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export const parseApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    const envelopeError = data?.error;
    return {
      message:
        envelopeError?.message ??
        data?.message ??
        error.message ??
        'Er ging iets mis',
      code: envelopeError?.code ?? data?.code,
      status: envelopeError?.status ?? data?.statusCode ?? error.response?.status,
    };
  }
  if (error instanceof Error) {
    return {message: error.message};
  }
  return {message: 'Er ging iets mis'};
};

export const showErrorAlert = (error: unknown, title = 'Fout') => {
  const parsed = parseApiError(error);
  Alert.alert(title, parsed.message);
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return !error.response;
  }
  return false;
};
