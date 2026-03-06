import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Pressable} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {Badge} from '../../components/common/Badge';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {useAuthStore} from '../../store/authStore';
import {useI18n} from '../../i18n/I18nProvider';
import type {Language} from '../../i18n/translateText';

const LANGUAGES: {code: Language; label: string; flag: string}[] = [
  {code: 'nl', label: 'Nederlands', flag: '🇳🇱'},
  {code: 'en', label: 'English', flag: '🇬🇧'},
];

export const SettingsScreen: React.FC = () => {
  const user = useAuthStore(s => s.user);
  const {language, setLanguage, t} = useI18n();
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const placeholder = (title: string) => () => Alert.alert(title, 'Binnenkort beschikbaar');

  return (
    <>
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
        <TouchableOpacity style={styles.row} onPress={() => setShowLanguagePicker(true)}>
          <Text style={styles.label}>{t('Taal')}</Text>
          <View style={styles.valueRow}>
            <Text style={styles.value}>{language === 'nl' ? 'Nederlands' : 'English'}</Text>
            <Icon name="chevron-right" size={18} color={colors.textTertiary} />
          </View>
        </TouchableOpacity>
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

    <Modal
      visible={showLanguagePicker}
      transparent
      animationType="fade"
      onRequestClose={() => setShowLanguagePicker(false)}>
      <Pressable style={styles.backdrop} onPress={() => setShowLanguagePicker(false)}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <Text style={styles.sheetTitle}>{t('Taal')}</Text>
          {LANGUAGES.map(lang => (
            <TouchableOpacity
              key={lang.code}
              style={[styles.langOption, language === lang.code && styles.langOptionActive]}
              onPress={() => {
                setLanguage(lang.code);
                setShowLanguagePicker(false);
              }}
              activeOpacity={0.7}>
              <Text style={styles.langFlag}>{lang.flag}</Text>
              <Text style={[styles.langLabel, language === lang.code && styles.langLabelActive]}>
                {lang.label}
              </Text>
              {language === lang.code && (
                <Icon name="check" size={20} color={colors.primary} style={styles.langCheck} />
              )}
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowLanguagePicker(false)}>
            <Text style={styles.cancelText}>{t('Annuleren')}</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
    </>
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
  backdrop: {flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end'},
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.xl,
    paddingBottom: spacing.huge,
  },
  sheetTitle: {...typography.h3, color: colors.textPrimary, marginBottom: spacing.lg, textAlign: 'center'},
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  langOptionActive: {borderColor: colors.primary, backgroundColor: colors.primary + '0D'},
  langFlag: {fontSize: 24, marginRight: spacing.md},
  langLabel: {...typography.body, color: colors.textPrimary},
  langLabelActive: {color: colors.primary, fontWeight: '600'},
  langCheck: {marginLeft: 'auto'},
  cancelBtn: {marginTop: spacing.md, alignItems: 'center', paddingVertical: spacing.md},
  cancelText: {...typography.body, color: colors.textSecondary},
});
