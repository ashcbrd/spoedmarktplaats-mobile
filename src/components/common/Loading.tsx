import React from 'react';
import {View, ActivityIndicator, Text, StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';

interface Props {
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<Props> = ({message, fullScreen = true}) => (
  <View style={[styles.container, fullScreen && styles.fullScreen]}>
    <ActivityIndicator size="large" color={colors.primary} />
    {message && <Text style={styles.message}>{message}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {alignItems: 'center', justifyContent: 'center', padding: spacing.xxl},
  fullScreen: {flex: 1},
  message: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
});
