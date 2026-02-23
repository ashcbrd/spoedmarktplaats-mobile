import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useI18n} from '../../i18n/I18nProvider';
import {useNetworkStore} from '../../store/networkStore';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {typography} from '../../theme/typography';

export const NetworkBanner: React.FC = () => {
  const degraded = useNetworkStore(s => s.isApiDegraded);
  const {language} = useI18n();

  if (!degraded) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>
        {language === 'en'
          ? 'Connection is unstable. We will retry automatically.'
          : 'Verbinding is instabiel. We proberen automatisch opnieuw.'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  text: {
    ...typography.captionBold,
    color: colors.white,
    textAlign: 'center',
  },
});
