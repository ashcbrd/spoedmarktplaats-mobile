import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing, borderRadius} from '../../theme/spacing';
import {formatTime} from '../../utils/date';
import type {ChatMessage} from '../../types/models';

interface Props {
  message: ChatMessage;
  isOwn: boolean;
}

export const ChatBubble: React.FC<Props> = ({message, isOwn}) => (
  <View style={[styles.wrapper, isOwn ? styles.wrapperOwn : styles.wrapperOther]}>
    <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
      <Text style={[styles.text, isOwn ? styles.textOwn : styles.textOther]}>
        {message.message}
      </Text>
      <Text style={[styles.time, isOwn ? styles.timeOwn : styles.timeOther]}>
        {formatTime(message.timestamp)}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {marginBottom: spacing.sm, paddingHorizontal: spacing.lg},
  wrapperOwn: {alignItems: 'flex-end'},
  wrapperOther: {alignItems: 'flex-start'},
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  bubbleOwn: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: spacing.xs,
  },
  bubbleOther: {
    backgroundColor: colors.surfaceSecondary,
    borderBottomLeftRadius: spacing.xs,
  },
  text: {...typography.body},
  textOwn: {color: colors.white},
  textOther: {color: colors.textPrimary},
  time: {...typography.small, marginTop: spacing.xxs},
  timeOwn: {color: colors.white + 'AA'},
  timeOther: {color: colors.textTertiary},
});
