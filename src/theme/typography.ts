import {TextStyle, Platform} from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography: Record<string, TextStyle> = {
  h1: {fontSize: 28, fontWeight: '700', lineHeight: 34, fontFamily},
  h2: {fontSize: 22, fontWeight: '700', lineHeight: 28, fontFamily},
  h3: {fontSize: 18, fontWeight: '600', lineHeight: 24, fontFamily},
  h4: {fontSize: 16, fontWeight: '600', lineHeight: 22, fontFamily},
  body: {fontSize: 15, fontWeight: '400', lineHeight: 22, fontFamily},
  bodyBold: {fontSize: 15, fontWeight: '600', lineHeight: 22, fontFamily},
  caption: {fontSize: 13, fontWeight: '400', lineHeight: 18, fontFamily},
  captionBold: {fontSize: 13, fontWeight: '600', lineHeight: 18, fontFamily},
  small: {fontSize: 11, fontWeight: '400', lineHeight: 16, fontFamily},
  button: {fontSize: 16, fontWeight: '600', lineHeight: 22, fontFamily},
  tabLabel: {fontSize: 10, fontWeight: '500', lineHeight: 14, fontFamily},
};
