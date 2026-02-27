/* eslint-env jest */
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'Icon',
}));

jest.mock('expo-font', () => ({
  useFonts: () => [true],
}));

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(async () => undefined),
  hideAsync: jest.fn(async () => undefined),
}));

jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      API_BASE_URL: 'http://localhost:3000/api/v1',
      WS_URL: 'ws://localhost:3000/chat',
    },
  },
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(async () => ({granted: true})),
  launchCameraAsync: jest.fn(async () => ({canceled: true, assets: []})),
  launchImageLibraryAsync: jest.fn(async () => ({canceled: true, assets: []})),
}));
