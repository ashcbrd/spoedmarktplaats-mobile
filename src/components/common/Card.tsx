import React from 'react';
import {View, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padded?: boolean;
}

export const Card: React.FC<Props> = ({children, onPress, style, padded = true}) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      style={[styles.card, padded && styles.padded, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}>
      {children}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  padded: {
    padding: spacing.lg,
  },
});
