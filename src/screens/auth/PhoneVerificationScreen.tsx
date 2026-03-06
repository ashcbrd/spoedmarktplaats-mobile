import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing, borderRadius} from '../../theme/spacing';
import {Button} from '../../components/common/Button';
import {useAuth} from '../../hooks/useAuth';
import {useI18n} from '../../i18n/I18nProvider';
import {useAuthStore} from '../../store/authStore';

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 30;

export const PhoneVerificationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {user, sendOtp, verifyPhone} = useAuth();
  const pendingOtpVerification = useAuthStore(s => s.pendingOtpVerification);
  const setPendingOtpVerification = useAuthStore(s => s.setPendingOtpVerification);
  const pendingOnboarding = useAuthStore(s => s.pendingOnboarding);
  const setPendingOnboarding = useAuthStore(s => s.setPendingOnboarding);
  const {language} = useI18n();

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const codeLength = code.join('').length;

  // Start countdown on mount and send initial OTP
  useEffect(() => {
    if (user?.phone) {
      sendOtp(user.phone).catch(() => {});
    }
  }, [user?.phone, sendOtp]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = useCallback(
    (text: string, index: number) => {
      // Allow only digits
      const digit = text.replace(/[^0-9]/g, '');
      if (digit.length > 1) {
        // Handle paste: fill from current index
        const digits = digit.slice(0, CODE_LENGTH - index).split('');
        const newCode = [...code];
        digits.forEach((d, i) => {
          newCode[index + i] = d;
        });
        setCode(newCode);
        const nextIndex = Math.min(index + digits.length, CODE_LENGTH - 1);
        inputRefs.current[nextIndex]?.focus();
        return;
      }

      const newCode = [...code];
      newCode[index] = digit;
      setCode(newCode);
      setError('');

      if (digit && index < CODE_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [code],
  );

  const handleKeyPress = useCallback(
    (key: string, index: number) => {
      if (key === 'Backspace' && !code[index] && index > 0) {
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      }
    },
    [code],
  );

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== CODE_LENGTH) {
      setError(t('Voer de volledige 6-cijferige code in'));
      return;
    }

    setLoading(true);
    setError('');
    try {
      await verifyPhone(fullCode);
      // Clear OTP flag — RootNavigator will transition to onboarding or Main automatically
      setPendingOtpVerification(false);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? 'Ongeldige code. Probeer het opnieuw.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || !user?.phone) return;
    try {
      await sendOtp(user.phone);
      setCountdown(RESEND_COOLDOWN);
      setCode(Array(CODE_LENGTH).fill(''));
      setError('');
      inputRefs.current[0]?.focus();
    } catch {
      setError('Code versturen mislukt. Probeer het opnieuw.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <Text style={styles.title}>Verificatie</Text>
          <Text style={styles.subtitle}>
            Voer de 6-cijferige code in die we naar{' '}
            <Text style={styles.phoneHighlight}>{user?.phone ?? 'je telefoon'}</Text>{' '}
            hebben gestuurd.
          </Text>

          {/* OTP boxes */}
          <View style={styles.otpRow}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpBox,
                  digit ? styles.otpBoxFilled : undefined,
                  error ? styles.otpBoxError : undefined,
                ]}
                value={digit}
                onChangeText={text => handleChange(text, index)}
                onKeyPress={({nativeEvent}) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                keyboardType="number-pad"
                maxLength={index === 0 ? CODE_LENGTH : 1}
                textContentType="oneTimeCode"
                autoComplete={index === 0 ? 'sms-otp' : 'off'}
                selectTextOnFocus
              />
            ))}
          </View>

          <Text style={styles.counterHelper}>
            {language === 'en' ? `Exactly ${CODE_LENGTH} digits` : `Precies ${CODE_LENGTH} cijfers`}
          </Text>
          <Text
            style={[
              styles.counterText,
              codeLength > 0 && codeLength < CODE_LENGTH
                ? styles.counterTextWarning
                : undefined,
            ]}>
            {language === 'en'
              ? `${codeLength}/${CODE_LENGTH} digits`
              : `${codeLength}/${CODE_LENGTH} cijfers`}
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button
            title={t('Verifieer')}
            onPress={handleVerify}
            loading={loading}
            size="lg"
            style={styles.verifyButton}
          />

          {/* Resend link */}
          <TouchableOpacity
            onPress={handleResend}
            disabled={countdown > 0}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.resendText,
                countdown > 0 && styles.resendTextDisabled,
              ]}>
              {countdown > 0
                ? t(`Code opnieuw versturen (${countdown}s)`)
                : t('Code opnieuw versturen')}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.huge,
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
  },
  phoneHighlight: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  otpBoxFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '08',
  },
  otpBoxError: {
    borderColor: colors.error,
  },
  counterHelper: {
    ...typography.small,
    color: colors.textSecondary,
    marginBottom: spacing.xxs,
  },
  counterText: {
    ...typography.small,
    color: colors.textTertiary,
    marginBottom: spacing.md,
  },
  counterTextWarning: {
    color: colors.warning,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  verifyButton: {
    width: '100%',
    marginBottom: spacing.xxl,
  },
  resendText: {
    ...typography.bodyBold,
    color: colors.primary,
    textAlign: 'center',
  },
  resendTextDisabled: {
    color: colors.textTertiary,
  },
});
