import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuthStore} from '../store/authStore';
import {AuthNavigator} from './AuthNavigator';
import {MainNavigator} from './MainNavigator';
import {PhoneVerificationScreen} from '../screens/auth/PhoneVerificationScreen';
import {ClientOnboardingScreen} from '../screens/auth/ClientOnboardingScreen';
import {ProviderOnboardingScreen} from '../screens/auth/ProviderOnboardingScreen';
import {colors} from '../theme/colors';
import {useI18n} from '../i18n/I18nProvider';
import type {RootStackParamList} from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const headerTitleStyle = {
  fontSize: 17,
  fontWeight: '600' as const,
  color: colors.textPrimary,
};

export const RootNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const pendingOtpVerification = useAuthStore(s => s.pendingOtpVerification);
  const pendingOnboarding = useAuthStore(s => s.pendingOnboarding);
  const userRole = useAuthStore(s => s.user?.role);
  const {t} = useI18n();

  if (isAuthenticated && pendingOtpVerification) {
    return (
      <Stack.Navigator screenOptions={{animation: 'fade'}}>
        <Stack.Screen
          name="OtpVerification"
          component={PhoneVerificationScreen}
          options={{
            headerShown: true,
            headerTitleStyle,
            title: t('Telefoon verificatie'),
            headerTitleAlign: 'center',
            headerBackVisible: false,
            contentStyle: {backgroundColor: colors.background},
          }}
        />
      </Stack.Navigator>
    );
  }

  if (isAuthenticated && pendingOnboarding) {
    return (
      <Stack.Navigator screenOptions={{animation: 'slide_from_right'}}>
        <Stack.Screen
          name={userRole === 'provider' ? 'ProviderOnboarding' : 'ClientOnboarding'}
          component={userRole === 'provider' ? ProviderOnboardingScreen : ClientOnboardingScreen}
          options={{
            headerShown: true,
            headerTitleStyle,
            headerTitleAlign: 'center',
            headerShadowVisible: false,
            headerBackVisible: false,
            title: userRole === 'provider' ? t('Voorkeuren instellen') : t('Bedrijf instellen'),
            contentStyle: {backgroundColor: colors.background},
          }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, animation: 'fade'}}
      initialRouteName={isAuthenticated ? 'Main' : 'Auth'}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};
