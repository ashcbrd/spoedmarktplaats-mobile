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

  setTokens: (token: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  updateUser: (partial: Partial<User>) => void;
  touchSession: () => void;
  hasSessionExpired: (maxIdleMs: number) => boolean;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      user: null,
      lastActivityAt: null,

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
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
