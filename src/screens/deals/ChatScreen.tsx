import React from 'react';
import {
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { ChatBubble } from '../../components/chat/ChatBubble';
import { MessageInput } from '../../components/chat/MessageInput';
import { Loading } from '../../components/common/Loading';
import { EmptyState } from '../../components/common/EmptyState';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { useChat } from '../../hooks/useChat';
import { useAuthStore } from '../../store/authStore';
import type { DealsStackParamList } from '../../types/navigation';

export const ChatScreen: React.FC = () => {
  const route = useRoute<RouteProp<DealsStackParamList, 'Chat'>>();
  const { dealId } = route.params;
  const userId = useAuthStore(s => s.user?.id);
  const { messages, isLoading, sendMessage } = useChat(dealId);

  if (isLoading) return <Loading />;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ChatBubble
            message={item}
            isOwn={item.fromUserId === userId || item.fromUserId === 'me'}
          />
        )}
        inverted
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="chat-outline"
            title="Geen berichten"
            message="Start het gesprek!"
          />
        }
      />
      <MessageInput onSend={sendMessage} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingVertical: spacing.sm,
  },
});
