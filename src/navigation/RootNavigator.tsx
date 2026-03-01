import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuthStore} from '../store/authStore';
import {AuthNavigator} from './AuthNavigator';
import {MainNavigator} from './MainNavigator';
import {PhoneVerificationScreen} from '../screens/auth/PhoneVerificationScreen';
import type {RootStackParamList} from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const pendingOtpVerification = useAuthStore(s => s.pendingOtpVerification);

  if (isAuthenticated && pendingOtpVerification) {
    return (
      <Stack.Navigator screenOptions={{animation: 'fade'}}>
        <Stack.Screen
          name="OtpVerification"
          component={PhoneVerificationScreen}
          options={{
            headerShown: true,
            title: 'Telefoon verificatie',
            headerTitleAlign: 'center',
            headerBackVisible: false,
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
