import {io, Socket} from 'socket.io-client';
import {ENV} from '../config/env';
import {useAuthStore} from '../store/authStore';
import type {ChatMessage} from '../types/models';

type MessageCallback = (msg: ChatMessage) => void;

type RealtimeEnvelope<T> = {
  eventId: string;
  eventName: string;
  occurredAtIso: string;
  payload: T;
};

class ChatService {
  private socket: Socket | null = null;
  private listeners: Map<string, MessageCallback[]> = new Map();
  private seenEventIds = new Set<string>();

  connect() {
    if (this.socket?.connected) {
      return;
    }
    const token = useAuthStore.getState().token;
    this.socket = io(ENV.WS_URL, {
      auth: {token},
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    this.socket.on('realtime.chat.message.v1', (envelope: RealtimeEnvelope<ChatMessage>) => {
      if (this.seenEventIds.has(envelope.eventId)) {
        return;
      }

      this.seenEventIds.add(envelope.eventId);
      if (this.seenEventIds.size > 5000) {
        this.seenEventIds.clear();
      }

      const cbs = this.listeners.get(envelope.payload.dealId) ?? [];
      cbs.forEach(cb => cb(envelope.payload));
    });

    this.socket.on('message', (msg: ChatMessage) => {
      const cbs = this.listeners.get(msg.dealId) ?? [];
      cbs.forEach(cb => cb(msg));
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.listeners.clear();
    this.seenEventIds.clear();
  }

  joinDeal(dealId: string) {
    this.socket?.emit('realtime.room.join.v1', {channel: 'deal', id: dealId});
    this.socket?.emit('join', {dealId});
  }

  leaveDeal(dealId: string) {
    this.socket?.emit('realtime.room.leave.v1', {channel: 'deal', id: dealId});
    this.socket?.emit('leave', {dealId});
    this.listeners.delete(dealId);
  }

  sendMessage(dealId: string, message: string) {
    this.socket?.emit('realtime.chat.send.v1', {dealId, message});
    this.socket?.emit('send_message', {dealId, message});
  }

  onMessage(dealId: string, callback: MessageCallback) {
    const existing = this.listeners.get(dealId) ?? [];
    this.listeners.set(dealId, [...existing, callback]);

    return () => {
      const cbs = this.listeners.get(dealId) ?? [];
      this.listeners.set(
        dealId,
        cbs.filter(cb => cb !== callback),
      );
    };
  }
}

export const chatService = new ChatService();
