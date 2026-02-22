import React from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing, borderRadius} from '../../theme/spacing';
import {Button} from '../../components/common/Button';
import {useI18n} from '../../i18n/I18nProvider';
import type {AuthStackParamList} from '../../types/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<Props> = ({navigation}) => {
  const {t} = useI18n();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.secondary} />

      {/* Top branding area */}
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <Icon name="hammer-wrench" size={56} color={colors.primary} />
        </View>
        <Text style={styles.title}>{t('Spoedmarktplaats')}</Text>
        <Text style={styles.subtitle}>{t('Urgente klussen, snel geregeld')}</Text>
      </View>

      {/* CTA area */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaHeading}>{t('Wat beschrijft jou het beste?')}</Text>

        <Button
          title={t('Ik zoek een vakman')}
          onPress={() => navigation.navigate('Signup', {role: 'client'})}
          variant="primary"
          size="lg"
          icon={<Icon name="account-search" size={22} color={colors.white} />}
          style={styles.ctaButton}
        />

        <Button
          title={t('Ik ben vakman')}
          onPress={() => navigation.navigate('Signup', {role: 'provider'})}
          variant="outline"
          size="lg"
          icon={<Icon name="hard-hat" size={22} color={colors.primary} />}
          style={styles.ctaButton}
        />
      </View>

      {/* Bottom link */}
      <View style={styles.bottomSection}>
        <Text style={styles.loginText}>
          {t('Heb je al een account?')}{' '}
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}>
            {t('Inloggen')}
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  brandSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.h1,
    fontSize: 32,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  ctaSection: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.lg,
  },
  ctaHeading: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  ctaButton: {
    marginBottom: spacing.md,
    width: '100%',
  },
  bottomSection: {
    backgroundColor: colors.white,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
  },
  loginText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  loginLink: {
    ...typography.bodyBold,
    color: colors.primary,
  },
});
