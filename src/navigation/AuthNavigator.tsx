import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '../types/navigation';
import {WelcomeScreen} from '../screens/auth/WelcomeScreen';
import {LoginScreen} from '../screens/auth/LoginScreen';
import {SignupScreen} from '../screens/auth/SignupScreen';
import {PhoneVerificationScreen} from '../screens/auth/PhoneVerificationScreen';
import {ClientOnboardingScreen} from '../screens/auth/ClientOnboardingScreen';
import {ProviderOnboardingScreen} from '../screens/auth/ProviderOnboardingScreen';
import {colors} from '../theme/colors';
import {useI18n} from '../i18n/I18nProvider';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  const {t} = useI18n();

  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: colors.background},
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen
        name="PhoneVerification"
        component={PhoneVerificationScreen}
        options={{headerShown: true, title: t('Telefoon verificatie')}}
      />
      <Stack.Screen
        name="ClientOnboarding"
        component={ClientOnboardingScreen}
        options={{headerShown: true, title: t('Bedrijf instellen')}}
      />
      <Stack.Screen
        name="ProviderOnboarding"
        component={ProviderOnboardingScreen}
        options={{headerShown: true, title: t('Voorkeuren instellen')}}
      />
    </Stack.Navigator>
  );
};
