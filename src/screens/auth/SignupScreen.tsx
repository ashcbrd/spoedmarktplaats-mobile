import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing, borderRadius} from '../../theme/spacing';
import {Button} from '../../components/common/Button';
import {Input} from '../../components/common/Input';
import {useAuth} from '../../hooks/useAuth';
import {signupSchema, type SignupForm} from '../../utils/validators';
import type {AuthStackParamList} from '../../types/navigation';
import type {ClientType} from '../../types/models';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const sanitizePhoneInput = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 10);
};

const normalizeDutchMobileToE164 = (phone: string): string => {
  if (!phone.startsWith('0')) return phone;
  return `+31${phone.slice(1)}`;
};

export const SignupScreen: React.FC<Props> = ({navigation, route}) => {
  const role = route.params?.role;
  const {signup, signupPending} = useAuth();

  const [clientType, setClientType] = useState<ClientType>('b2c');
  const [agreedTerms, setAgreedTerms] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setError,
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupForm) => {
    if (!agreedTerms) {
      setError('root', {message: 'Je moet akkoord gaan met de voorwaarden.'});
      return;
    }

    try {
      await signup({
        name: data.name,
        email: data.email,
        phone: normalizeDutchMobileToE164(data.phone),
        password: data.password,
        role: role ?? 'client',
        ...(role === 'client' ? {clientType} : {}),
      });
      navigation.navigate('PhoneVerification');
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? 'Registratie mislukt. Probeer het opnieuw.';
      setError('root', {message});
    }
  };

  const heading =
    role === 'provider' ? 'Registreer als vakman' : 'Maak een account aan';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{heading}</Text>

          {/* B2C / B2B toggle for clients */}
          {role === 'client' && (
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  clientType === 'b2c' && styles.toggleActive,
                ]}
                onPress={() => setClientType('b2c')}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.toggleText,
                    clientType === 'b2c' && styles.toggleTextActive,
                  ]}>
                  Particulier (B2C)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  clientType === 'b2b' && styles.toggleActive,
                ]}
                onPress={() => setClientType('b2b')}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.toggleText,
                    clientType === 'b2b' && styles.toggleTextActive,
                  ]}>
                  Zakelijk (B2B)
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {errors.root?.message && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errors.root.message}</Text>
            </View>
          )}

          <Controller
            control={control}
            name="name"
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                label="Volledige naam"
                placeholder="Jan Jansen"
                leftIcon="account-outline"
                autoCapitalize="words"
                autoComplete="name"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                label="E-mailadres"
                placeholder="jouw@email.nl"
                leftIcon="email-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                label="Telefoonnummer"
                placeholder="0612345678"
                leftIcon="phone-outline"
                keyboardType="phone-pad"
                autoComplete="tel"
                value={value}
                onChangeText={text => onChange(sanitizePhoneInput(text))}
                onBlur={onBlur}
                minChars={10}
                maxChars={10}
                maxLength={10}
                error={errors.phone?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                label="Wachtwoord"
                placeholder="Minimaal 8 tekens"
                leftIcon="lock-outline"
                isPassword
                autoComplete="password-new"
                textContentType="newPassword"
                importantForAutofill="no"
                autoCorrect={false}
                spellCheck={false}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                label="Wachtwoord bevestigen"
                placeholder="Herhaal wachtwoord"
                leftIcon="lock-check-outline"
                isPassword
                autoComplete="password-new"
                textContentType="newPassword"
                importantForAutofill="no"
                autoCorrect={false}
                spellCheck={false}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          {/* Terms checkbox */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAgreedTerms(!agreedTerms)}
            activeOpacity={0.7}>
            <Icon
              name={agreedTerms ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={24}
              color={agreedTerms ? colors.primary : colors.textTertiary}
            />
            <Text style={styles.checkboxLabel}>
              Ik ga akkoord met de{' '}
              <Text style={styles.linkText}>algemene voorwaarden</Text>
            </Text>
          </TouchableOpacity>

          <Button
            title="Registreren"
            onPress={handleSubmit(onSubmit)}
            loading={signupPending}
            size="lg"
            style={styles.submitButton}
          />

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>
              Heb je al een account?{' '}
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate('Login')}>
                Inloggen
              </Text>
            </Text>
          </View>
        </ScrollView>
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
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.huge,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.xxl,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    marginBottom: spacing.xxl,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  toggleActive: {
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.primary,
  },
  errorBanner: {
    backgroundColor: colors.error + '15',
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorBannerText: {
    ...typography.caption,
    color: colors.error,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  checkboxLabel: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  linkText: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  submitButton: {
    width: '100%',
  },
  bottomRow: {
    marginTop: spacing.xxl,
    alignItems: 'center',
    paddingBottom: spacing.lg,
  },
  bottomText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
