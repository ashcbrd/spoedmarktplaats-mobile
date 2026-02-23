import {create} from 'zustand';

interface NetworkState {
  isApiDegraded: boolean;
  markApiHealthy: () => void;
  markApiDegraded: () => void;
}

export const useNetworkStore = create<NetworkState>(set => ({
  isApiDegraded: false,
  markApiHealthy: () => set({isApiDegraded: false}),
  markApiDegraded: () => set({isApiDegraded: true}),
}));
