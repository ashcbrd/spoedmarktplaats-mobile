import { Platform, Vibration } from 'react-native';

export const triggerSelectionHaptic = () => {
  if (Platform.OS === 'android') {
    Vibration.vibrate(8);
  }
};

export const triggerSuccessHaptic = () => {
  if (Platform.OS === 'android') {
    Vibration.vibrate([0, 12, 24, 12]);
  }
};
