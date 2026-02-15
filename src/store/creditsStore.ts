import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CreditsState {
  balance: number;
  setBalance: (balance: number) => void;
  deduct: (amount: number) => void;
}

export const useCreditsStore = create<CreditsState>()(
  persist(
    set => ({
      balance: 0,
      setBalance: balance => set({balance}),
      deduct: amount =>
        set(s => ({balance: Math.max(0, s.balance - amount)})),
    }),
    {
      name: 'credits-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
