import React, {useState, type ComponentProps} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing, borderRadius} from '../../theme/spacing';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: ComponentProps<typeof Icon>['name'];
  isPassword?: boolean;
}

export const Input: React.FC<Props> = ({
  label,
  error,
  leftIcon,
  isPassword,
  style,
  ...rest
}) => {
  const [secureVisible, setSecureVisible] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error ? styles.inputError : undefined]}>
        {leftIcon && (
          <Icon name={leftIcon} size={20} color={colors.textTertiary} style={styles.icon} />
        )}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={isPassword && !secureVisible}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setSecureVisible(!secureVisible)}>
            <Icon
              name={secureVisible ? 'eye-off' : 'eye'}
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {marginBottom: spacing.lg},
  label: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  inputError: {borderColor: colors.error},
  icon: {marginRight: spacing.sm},
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  error: {
    ...typography.small,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
