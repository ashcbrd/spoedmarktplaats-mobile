/**
 * @format
 */

import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { installReactNativeTextPatch } from './src/i18n/patchReactNativeText';

installReactNativeTextPatch();

const App = require('./App').default;

registerRootComponent(App);
