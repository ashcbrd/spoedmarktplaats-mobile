import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useI18n} from '../../i18n/I18nProvider';
import {colors} from '../../theme/colors';
import {spacing, borderRadius} from '../../theme/spacing';
import {typography} from '../../theme/typography';

export const FloatingLanguageToggle: React.FC = () => {
  const {language, toggleLanguage} = useI18n();
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, {top: insets.top + spacing.md}]}
    >
      <Pressable onPress={toggleLanguage} style={styles.button}>
        <Text style={styles.label}>{language === 'nl' ? 'NL' : 'EN'}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: spacing.lg,
    zIndex: 1000,
  },
  button: {
    minWidth: 52,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  label: {
    ...typography.captionBold,
    color: colors.white,
    letterSpacing: 0.6,
  },
});
