import React from 'react';
import {View, StyleSheet, Pressable, ViewStyle} from 'react-native';
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {theme} from '../../theme/theme';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padded?: boolean;
}

export const Card: React.FC<Props> = ({children, onPress, style, padded = true}) => {
  if (onPress) {
    return (
      <Pressable
        style={({pressed}) => [
          styles.card,
          padded && styles.padded,
          pressed && styles.pressed,
          style,
        ]}
        onPress={onPress}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, padded && styles.padded, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...theme.elevation.sm,
  },
  padded: {
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.96,
    transform: [{scale: 0.995}],
  },
});
