import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { useCreditsStore } from '../store/creditsStore';
import { authApi } from '../api/endpoints/auth';
import { creditsApi } from '../api/endpoints/credits';
import { parseApiError, showErrorAlert } from '../utils/errorHandling';
import { useI18n } from '../i18n/I18nProvider';
import { analyticsService } from '../services/analytics.service';

export const useAuth = () => {
  const store = useAuthStore();
  const queryClient = useQueryClient();
  const { t } = useI18n();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async data => {
      store.setTokens(data.token, data.refreshToken);
      store.setUser(data.user);
      const { balance } = await creditsApi.balance();
      useCreditsStore.getState().setBalance(balance);
      analyticsService.track('auth_login_success', {
        role: data.user.role,
        phoneVerified: data.user.phoneVerified,
      });
      if (data.user.phone) {
        store.setPendingOtpVerification(true);
      }
    },
    onError: e => {
      const parsed = parseApiError(e);
      analyticsService.track('auth_login_failed', {
        code: parsed.code,
        status: parsed.status,
      });
      showErrorAlert(e, t('Inloggen mislukt'));
    },
  });

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: data => {
      store.setTokens(data.token, data.refreshToken);
      store.setUser(data.user);
      useCreditsStore.getState().setBalance(3); // 3 free credits
      analyticsService.track('auth_signup_success', {
        role: data.user.role,
      });
    },
    onError: e => {
      const parsed = parseApiError(e);
      analyticsService.track('auth_signup_failed', {
        code: parsed.code,
        status: parsed.status,
      });
      showErrorAlert(e, t('Registratie mislukt'));
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: authApi.sendOtp,
    onSuccess: () => {
      analyticsService.track('auth_otp_send_success');
    },
    onError: e => {
      const parsed = parseApiError(e);
      analyticsService.track('auth_otp_send_failed', {
        code: parsed.code,
        status: parsed.status,
      });
      showErrorAlert(e, parsed.status === 429 ? t('Te veel verzoeken') : t('OTP versturen mislukt'));
    },
  });

  const verifyPhoneMutation = useMutation({
    mutationFn: authApi.verifyPhone,
    onSuccess: () => {
      store.updateUser({ phoneVerified: true });
      analyticsService.track('auth_otp_verify_success');
    },
    onError: e => {
      const parsed = parseApiError(e);
      analyticsService.track('auth_otp_verify_failed', {
        code: parsed.code,
        status: parsed.status,
      });
      showErrorAlert(e, t('Verificatie mislukt'));
    },
  });

  const logout = () => {
    authApi.logout().catch(() => {});
    store.clearAuth();
    useCreditsStore.getState().setBalance(0);
    queryClient.clear();
  };

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    login: loginMutation.mutateAsync,
    loginPending: loginMutation.isPending,
    signup: signupMutation.mutateAsync,
    signupPending: signupMutation.isPending,
    sendOtp: sendOtpMutation.mutateAsync,
    verifyPhone: verifyPhoneMutation.mutateAsync,
    logout,
  };
};
