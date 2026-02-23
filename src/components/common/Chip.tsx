import React from 'react';
import {Pressable, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import {colors} from '../../theme/colors';
import {borderRadius, spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';
import {triggerSelectionHaptic} from '../../utils/haptics';

interface ChipProps {
  label: string;
  selected?: boolean;
  icon?: React.ComponentProps<typeof Icon>['name'];
  onPress?: () => void;
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  icon,
  onPress,
  style,
}) => {
  const body = (
    <View style={[styles.base, selected ? styles.selected : styles.default, style]}>
      {icon ? (
        <Icon
          name={icon}
          size={15}
          color={selected ? colors.white : colors.textSecondary}
        />
      ) : null}
      <Text style={[styles.label, selected ? styles.labelSelected : styles.labelDefault]}>
        {label}
      </Text>
    </View>
  );

  if (!onPress) {
    return body;
  }

  return (
    <Pressable
      onPress={() => {
        triggerSelectionHaptic();
        onPress();
      }}
      hitSlop={8}
    >
      {body}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  default: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  selected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  label: {
    ...typography.captionBold,
  },
  labelDefault: {
    color: colors.textPrimary,
  },
  labelSelected: {
    color: colors.white,
  },
});
