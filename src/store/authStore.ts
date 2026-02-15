import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {User} from '../types/models';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: User | null;

  setTokens: (token: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  updateUser: (partial: Partial<User>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      user: null,

      setTokens: (token, refreshToken) =>
        set({token, refreshToken, isAuthenticated: true}),

      setUser: user => set({user}),

      updateUser: partial =>
        set(state => ({
          user: state.user ? {...state.user, ...partial} : null,
        })),

      clearAuth: () =>
        set({
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          user: null,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
