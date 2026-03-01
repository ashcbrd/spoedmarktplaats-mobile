import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {User} from '../types/models';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: User | null;
  lastActivityAt: number | null;
  pendingOtpVerification: boolean;

  setTokens: (token: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  updateUser: (partial: Partial<User>) => void;
  touchSession: () => void;
  hasSessionExpired: (maxIdleMs: number) => boolean;
  clearAuth: () => void;
  setPendingOtpVerification: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      user: null,
      lastActivityAt: null,
      pendingOtpVerification: false,

      setTokens: (token, refreshToken) =>
        set({
          token,
          refreshToken,
          isAuthenticated: true,
          lastActivityAt: Date.now(),
        }),

      setUser: user => set({user}),

      updateUser: partial =>
        set(state => ({
          user: state.user ? {...state.user, ...partial} : null,
        })),

      touchSession: () =>
        set(state =>
          state.isAuthenticated ? {lastActivityAt: Date.now()} : state,
        ),

      hasSessionExpired: maxIdleMs => {
        const {isAuthenticated, lastActivityAt} = get();
        if (!isAuthenticated || !lastActivityAt) return false;
        return Date.now() - lastActivityAt > maxIdleMs;
      },

      clearAuth: () =>
        set({
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          user: null,
          lastActivityAt: null,
          pendingOtpVerification: false,
        }),

      setPendingOtpVerification: val => set({pendingOtpVerification: val}),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        lastActivityAt: state.lastActivityAt,
      }),
    },
  ),
);
