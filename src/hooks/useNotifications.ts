import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/endpoints/notifications';
import { useNotificationsStore } from '../store/notificationsStore';
import { useEffect } from 'react';

export const useNotifications = () => {
  const items = useNotificationsStore(s => s.items);
  const unreadCount = useNotificationsStore(s => s.unreadCount);
  const setItems = useNotificationsStore(s => s.setItems);
  const setUnreadCount = useNotificationsStore(s => s.setUnreadCount);
  const markReadLocal = useNotificationsStore(s => s.markRead);
  const qc = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.list(),
    refetchInterval: 30_000,
  });

  useEffect(() => {
    if (listQuery.data) {
      setItems(listQuery.data.data);
      setUnreadCount(listQuery.data.unread);
    }
  }, [listQuery.data, setItems, setUnreadCount]);

  const markReadMutation = useMutation({
    mutationFn: notificationsApi.markRead,
    onSuccess: (_, id) => {
      markReadLocal(id);
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => {
      setUnreadCount(0);
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications: items,
    unreadCount,
    isLoading: listQuery.isLoading,
    markRead: markReadMutation.mutate,
    markAllRead: markAllReadMutation.mutate,
  };
};
