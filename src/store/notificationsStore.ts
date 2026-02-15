import {create} from 'zustand';
import type {AppNotification} from '../types/models';

interface NotificationsState {
  items: AppNotification[];
  unreadCount: number;
  setItems: (items: AppNotification[]) => void;
  addItem: (item: AppNotification) => void;
  markRead: (id: string) => void;
  setUnreadCount: (count: number) => void;
}

export const useNotificationsStore = create<NotificationsState>(set => ({
  items: [],
  unreadCount: 0,

  setItems: items => set({items}),

  addItem: item =>
    set(s => ({
      items: [item, ...s.items],
      unreadCount: s.unreadCount + 1,
    })),

  markRead: id =>
    set(s => ({
      items: s.items.map(i => (i.id === id ? {...i, read: true} : i)),
      unreadCount: Math.max(0, s.unreadCount - 1),
    })),

  setUnreadCount: count => set({unreadCount: count}),
}));
