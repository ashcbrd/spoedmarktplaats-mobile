import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {Badge} from '../../components/common/Badge';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {useAuthStore} from '../../store/authStore';
import {useI18n} from '../../i18n/I18nProvider';

export const SettingsScreen: React.FC = () => {
  const user = useAuthStore(s => s.user);
  const {language} = useI18n();

  const placeholder = (title: string) => () => Alert.alert(title, 'Binnenkort beschikbaar');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionHeader}>Account</Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>E-mail</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Telefoon</Text>
          <View style={styles.valueRow}>
            <Text style={styles.value}>{user?.phone ?? '–'}</Text>
            {user?.phoneVerified && <Badge label="Geverifieerd" variant="success" small />}
          </View>
        </View>
      </View>

      <Text style={styles.sectionHeader}>App</Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Taal</Text>
          <Text style={styles.value}>{language === 'nl' ? 'Nederlands' : 'English'}</Text>
        </View>
      </View>

      <Text style={styles.sectionHeader}>Juridisch</Text>
      <View style={styles.section}>
        {['Privacybeleid', 'Gebruiksvoorwaarden', 'Over Spoedmarktplaats'].map(item => (
          <TouchableOpacity key={item} style={styles.linkRow} onPress={placeholder(item)}>
            <Text style={styles.linkText}>{item}</Text>
            <Icon name="chevron-right" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionHeader}>Support</Text>
      <View style={styles.section}>
        <TouchableOpacity style={styles.linkRow} onPress={placeholder('Probleem melden')}>
          <Text style={styles.linkText}>Probleem melden</Text>
          <Icon name="chevron-right" size={18} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>Spoedmarktplaats v1.0.0 (MVP)</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  sectionHeader: {...typography.captionBold, color: colors.textTertiary, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.sm},
  section: {backgroundColor: colors.surface},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.borderLight},
  label: {...typography.body, color: colors.textPrimary},
  value: {...typography.body, color: colors.textSecondary},
  valueRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  linkRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.borderLight},
  linkText: {...typography.body, color: colors.textPrimary},
  version: {...typography.caption, color: colors.textTertiary, textAlign: 'center', paddingVertical: spacing.xxl},
});
