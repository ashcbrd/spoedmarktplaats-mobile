import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {Button} from '../../components/common/Button';
import {Input} from '../../components/common/Input';
import {useAuth} from '../../hooks/useAuth';
import {loginSchema, type LoginForm} from '../../utils/validators';
import type {AuthStackParamList} from '../../types/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({navigation}) => {
  const {login, loginPending} = useAuth();

  const {
    control,
    handleSubmit,
    formState: {errors},
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? 'Inloggen mislukt. Probeer het opnieuw.';
      setError('root', {message});
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Welkom terug</Text>
          <Text style={styles.subtitle}>
            Log in om verder te gaan met Spoedmarktplaats
          </Text>

          {errors.root?.message && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errors.root.message}</Text>
            </View>
          )}

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
            name="password"
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                label="Wachtwoord"
                placeholder="Wachtwoord"
                leftIcon="lock-outline"
                isPassword
                autoComplete="password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
              />
            )}
          />

          <Button
            title="Inloggen"
            onPress={handleSubmit(onSubmit)}
            loading={loginPending}
            size="lg"
            style={styles.submitButton}
          />

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>
              Nog geen account?{' '}
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate('Signup', {})}>
                Registreren
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
    paddingTop: spacing.huge,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xxxl,
  },
  errorBanner: {
    backgroundColor: colors.error + '15',
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorBannerText: {
    ...typography.caption,
    color: colors.error,
  },
  submitButton: {
    width: '100%',
    marginTop: spacing.sm,
  },
  bottomRow: {
    marginTop: spacing.xxl,
    alignItems: 'center',
  },
  bottomText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  linkText: {
    ...typography.bodyBold,
    color: colors.primary,
  },
});
