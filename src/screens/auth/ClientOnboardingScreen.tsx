import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Switch} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Button} from '../../components/common/Button';
import {Input} from '../../components/common/Input';
import {VerificationBadge} from '../../components/common/VerificationBadge';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {useAuthStore} from '../../store/authStore';
import {useI18n} from '../../i18n/I18nProvider';

export const ClientOnboardingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {t} = useI18n();
  const user = useAuthStore(s => s.user);
  const isB2B = user?.clientType === 'b2b';
  const [orgName, setOrgName] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [locations, setLocations] = useState<{label: string; postcode: string; city: string}[]>([]);
  const [newLoc, setNewLoc] = useState({label: '', postcode: '', city: ''});

  const addLocation = () => {
    if (newLoc.label && newLoc.postcode && newLoc.city) {
      setLocations([...locations, newLoc]);
      setNewLoc({label: '', postcode: '', city: ''});
    }
  };

  const setPendingOnboarding = useAuthStore(s => s.setPendingOnboarding);

  const finish = () => {
    setPendingOnboarding(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {isB2B ? (
        <>
          <Text style={styles.title}>{t('Bedrijf instellen')}</Text>
          <Text style={styles.subtitle}>{t('Vul je bedrijfsgegevens in om te beginnen')}</Text>
          <View style={styles.badgeRow}>
            <VerificationBadge label={t('E-mail')} verified={Boolean(user?.emailVerified)} />
            <VerificationBadge label={t('Telefoon')} verified={Boolean(user?.phoneVerified)} />
          </View>

          <Input
            label={t('Bedrijfsnaam')}
            placeholder={t('Bijv. Bouwbedrijf De Vries')}
            value={orgName}
            onChangeText={setOrgName}
            leftIcon="domain"
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{t('Ik ben gemachtigd om namens dit bedrijf te handelen')}</Text>
            <Switch
              value={authorized}
              onValueChange={setAuthorized}
              trackColor={{true: colors.primary, false: colors.border}}
            />
          </View>

          <Text style={styles.sectionTitle}>{t('Locaties (optioneel)')}</Text>
          {locations.map((loc, i) => (
            <View key={i} style={styles.locationItem}>
              <Text style={styles.locationText}>{loc.label} - {loc.postcode} {loc.city}</Text>
            </View>
          ))}
          <Input label={t('Label')} placeholder={t('Bijv. Hoofdkantoor')} value={newLoc.label} onChangeText={v => setNewLoc({...newLoc, label: v})} />
          <Input label={t('Postcode')} placeholder="1012 AB" value={newLoc.postcode} onChangeText={v => setNewLoc({...newLoc, postcode: v})} />
          <Input label={t('Stad')} placeholder="Amsterdam" value={newLoc.city} onChangeText={v => setNewLoc({...newLoc, city: v})} />
          <Button title={t('Locatie toevoegen')} onPress={addLocation} variant="outline" size="sm" style={styles.addBtn} />
        </>
      ) : (
        <>
          <Text style={styles.title}>{t('Welkom!')}</Text>
          <Text style={styles.subtitle}>{t('Je account is aangemaakt. Je kunt nu direct een spoedopdracht plaatsen.')}</Text>
          <View style={styles.badgeRow}>
            <VerificationBadge label={t('E-mail')} verified={Boolean(user?.emailVerified)} />
            <VerificationBadge label={t('Telefoon')} verified={Boolean(user?.phoneVerified)} />
          </View>
        </>
      )}

      <View style={styles.footer}>
        <Button title={t('Doorgaan')} onPress={finish} disabled={isB2B && !authorized} />
        {isB2B && (
          <Button title={t('Overslaan')} onPress={finish} variant="ghost" style={styles.skipBtn} />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {padding: spacing.xl},
  title: {...typography.h1, color: colors.textPrimary, marginBottom: spacing.sm},
  subtitle: {...typography.body, color: colors.textSecondary, marginBottom: spacing.xxl},
  badgeRow: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg},
  sectionTitle: {...typography.h4, color: colors.textPrimary, marginTop: spacing.xl, marginBottom: spacing.md},
  switchRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xl, gap: spacing.md},
  switchLabel: {...typography.body, color: colors.textPrimary, flex: 1},
  locationItem: {paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.borderLight},
  locationText: {...typography.body, color: colors.textPrimary},
  addBtn: {alignSelf: 'flex-start', marginBottom: spacing.lg},
  footer: {marginTop: spacing.xxxl},
  skipBtn: {marginTop: spacing.sm},
});
