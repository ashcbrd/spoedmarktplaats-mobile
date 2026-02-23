import React, { useEffect } from 'react';
import { AppState, StatusBar, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView as GHRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { RootNavigator } from './src/navigation/RootNavigator';
import { FloatingLanguageToggle } from './src/components/i18n/FloatingLanguageToggle';
import { NetworkBanner } from './src/components/common/NetworkBanner';
import { I18nProvider } from './src/i18n/I18nProvider';
import { useAuthStore } from './src/store/authStore';
import { theme } from './src/theme/theme';

const GestureHandlerRootView = GHRootView ?? View;

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const SESSION_IDLE_LIMIT_MS = 15 * 60 * 1000;

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // Load fonts (using system fonts, so no custom fonts to load)
  const [fontsLoaded] = useFonts({
    // Add any custom fonts here if needed in the future
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', state => {
      if (state !== 'active') return;

      const {hasSessionExpired, clearAuth} = useAuthStore.getState();
      if (hasSessionExpired(SESSION_IDLE_LIMIT_MS)) {
        clearAuth();
      }
    });

    return () => sub.remove();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <NavigationContainer
              theme={{
                dark: isDarkMode,
                colors: {
                  primary: theme.colors.primary,
                  background: theme.colors.background,
                  card: theme.colors.surface,
                  text: theme.colors.textPrimary,
                  border: theme.colors.border,
                  notification: theme.colors.error,
                },
                fonts: {
                  regular: { fontFamily: 'System', fontWeight: '400' },
                  medium: { fontFamily: 'System', fontWeight: '500' },
                  bold: { fontFamily: 'System', fontWeight: '700' },
                  heavy: { fontFamily: 'System', fontWeight: '800' },
                },
              }}
            >
              <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.background}
              />
              <NetworkBanner />
              <RootNavigator />
              <FloatingLanguageToggle />
            </NavigationContainer>
          </SafeAreaProvider>
        </QueryClientProvider>
      </I18nProvider>
    </GestureHandlerRootView>
  );
}

const styles = {
  root: { flex: 1 },
};

export default App;
