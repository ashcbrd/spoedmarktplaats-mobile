import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { useCreditsStore } from '../store/creditsStore';
import { authApi } from '../api/endpoints/auth';
import { creditsApi } from '../api/endpoints/credits';
import { showErrorAlert } from '../utils/errorHandling';

export const useAuth = () => {
  const store = useAuthStore();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async data => {
      store.setTokens(data.token, data.refreshToken);
      store.setUser(data.user);
      const { balance } = await creditsApi.balance();
      useCreditsStore.getState().setBalance(balance);
    },
    onError: e => showErrorAlert(e, 'Inloggen mislukt'),
  });

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: data => {
      store.setTokens(data.token, data.refreshToken);
      store.setUser(data.user);
      useCreditsStore.getState().setBalance(3); // 3 free credits
    },
    onError: e => showErrorAlert(e, 'Registratie mislukt'),
  });

  const sendOtpMutation = useMutation({
    mutationFn: authApi.sendOtp,
    onError: e => showErrorAlert(e, 'OTP versturen mislukt'),
  });

  const verifyPhoneMutation = useMutation({
    mutationFn: authApi.verifyPhone,
    onSuccess: () => store.updateUser({ phoneVerified: true }),
    onError: e => showErrorAlert(e, 'Verificatie mislukt'),
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
