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
import {useI18n} from '../../i18n/I18nProvider';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing, borderRadius} from '../../theme/spacing';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: ComponentProps<typeof Icon>['name'];
  isPassword?: boolean;
  minChars?: number;
  maxChars?: number;
  showLengthCounter?: boolean;
}

export const Input: React.FC<Props> = ({
  label,
  error,
  leftIcon,
  isPassword,
  minChars,
  maxChars,
  showLengthCounter = true,
  style,
  ...rest
}) => {
  const [secureVisible, setSecureVisible] = useState(false);
  const {language, t} = useI18n();

  const inputValue = typeof rest.value === 'string' ? rest.value : '';
  const hasLengthRules = typeof minChars === 'number' || typeof maxChars === 'number';
  const shouldShowCounter = showLengthCounter && hasLengthRules;

  const helperText = (() => {
    if (typeof minChars === 'number' && typeof maxChars === 'number') {
      if (minChars === maxChars) {
        return language === 'en'
          ? `Exactly ${minChars} characters`
          : `Precies ${minChars} tekens`;
      }

      return language === 'en'
        ? `Minimum ${minChars} and maximum ${maxChars} characters`
        : `Minimaal ${minChars} en maximaal ${maxChars} tekens`;
    }

    if (typeof minChars === 'number') {
      return language === 'en'
        ? `Minimum ${minChars} characters`
        : `Minimaal ${minChars} tekens`;
    }

    if (typeof maxChars === 'number') {
      return language === 'en'
        ? `Maximum ${maxChars} characters`
        : `Maximaal ${maxChars} tekens`;
    }

    return null;
  })();

  const counterText = (() => {
    if (!shouldShowCounter) return null;

    if (typeof maxChars === 'number') {
      return language === 'en'
        ? `${inputValue.length}/${maxChars} chars`
        : `${inputValue.length}/${maxChars} tekens`;
    }

    return language === 'en'
      ? `${inputValue.length} chars`
      : `${inputValue.length} tekens`;
  })();

  const isBelowMin =
    typeof minChars === 'number' && inputValue.length > 0 && inputValue.length < minChars;
  const isAboveMax =
    typeof maxChars === 'number' && inputValue.length > maxChars;

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
          placeholder={
            typeof rest.placeholder === 'string' ? t(rest.placeholder) : rest.placeholder
          }
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
      {helperText ? <Text style={styles.lengthHelper}>{helperText}</Text> : null}
      {counterText ? (
        <Text
          style={[
            styles.lengthCounter,
            (isBelowMin || isAboveMax) && styles.lengthCounterWarning,
          ]}
        >
          {counterText}
        </Text>
      ) : null}
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
  lengthHelper: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  lengthCounter: {
    ...typography.small,
    color: colors.textTertiary,
    textAlign: 'right',
    marginTop: spacing.xxs,
  },
  lengthCounterWarning: {
    color: colors.warning,
  },
});
