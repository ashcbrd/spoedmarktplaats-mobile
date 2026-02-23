import {TextStyle, Platform} from 'react-native';

const fontFamily = Platform.select({
  ios: 'SF Pro Text',
  android: 'sans-serif',
  default: 'sans-serif',
});

const displayFamily = Platform.select({
  ios: 'SF Pro Display',
  android: 'sans-serif-medium',
  default: 'sans-serif-medium',
});

export const typography: Record<string, TextStyle> = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.4,
    fontFamily: displayFamily,
  },
  h2: {
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 33,
    letterSpacing: -0.3,
    fontFamily: displayFamily,
  },
  h3: {
    fontSize: 21,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.2,
    fontFamily,
  },
  h4: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: -0.1,
    fontFamily,
  },
  body: {fontSize: 16, fontWeight: '400', lineHeight: 24, fontFamily},
  bodyBold: {fontSize: 16, fontWeight: '600', lineHeight: 24, fontFamily},
  caption: {fontSize: 13, fontWeight: '400', lineHeight: 18, fontFamily},
  captionBold: {fontSize: 13, fontWeight: '600', lineHeight: 18, fontFamily},
  small: {fontSize: 12, fontWeight: '400', lineHeight: 17, fontFamily},
  button: {fontSize: 16, fontWeight: '600', lineHeight: 22, fontFamily},
  tabLabel: {fontSize: 11, fontWeight: '500', lineHeight: 16, fontFamily},
};
