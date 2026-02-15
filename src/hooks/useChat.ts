import {useState, useEffect, useCallback} from 'react';
import {useQuery} from '@tanstack/react-query';
import {chatApi} from '../api/endpoints/chat';
import {chatService} from '../services/chat.service';
import {detectBlockedKeywords, BLOCKED_WARNING} from '../utils/chatFilters';
import {Alert} from 'react-native';
import type {ChatMessage} from '../types/models';

export const useChat = (dealId: string) => {
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);

  // Fetch initial messages
  const messagesQuery = useQuery({
    queryKey: ['chat', dealId],
    queryFn: () => chatApi.messages(dealId),
    enabled: !!dealId,
  });

  // Set initial messages when fetched
  useEffect(() => {
    if (messagesQuery.data?.data) {
      setLocalMessages(messagesQuery.data.data);
    }
  }, [messagesQuery.data]);

  // Connect WebSocket + join deal
  useEffect(() => {
    chatService.connect();
    chatService.joinDeal(dealId);

    const unsub = chatService.onMessage(dealId, (msg: ChatMessage) => {
      setLocalMessages(prev => [...prev, msg]);
    });

    return () => {
      chatService.leaveDeal(dealId);
      unsub();
    };
  }, [dealId]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (detectBlockedKeywords(text)) {
        Alert.alert('Let op', BLOCKED_WARNING);
        return false;
      }
      // Optimistic add
      const optimistic: ChatMessage = {
        id: `temp-${Date.now()}`,
        dealId,
        fromUserId: 'me',
        message: text,
        timestamp: new Date().toISOString(),
      };
      setLocalMessages(prev => [...prev, optimistic]);

      try {
        await chatApi.send(dealId, text);
        return true;
      } catch {
        // Remove optimistic on failure
        setLocalMessages(prev => prev.filter(m => m.id !== optimistic.id));
        return false;
      }
    },
    [dealId],
  );

  return {
    messages: localMessages,
    isLoading: messagesQuery.isLoading,
    sendMessage,
  };
};
