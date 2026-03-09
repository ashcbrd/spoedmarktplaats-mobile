import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {Card} from '../../components/common/Card';
import {Button} from '../../components/common/Button';
import {Input} from '../../components/common/Input';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import {organizationsApi, type UpdateOrganizationPayload} from '../../api/endpoints/organizations';
import {useI18n} from '../../i18n/I18nProvider';

// In MVP, the org ID is derived from the user's ID (backend uses user ID as org ID for B2B clients)
const ORG_ID_PLACEHOLDER = 'current-org';

export const CompanyProfileScreen: React.FC = () => {
  const {t} = useI18n();
  const queryClient = useQueryClient();

  const {data: org, isLoading} = useQuery({
    queryKey: ['organization', ORG_ID_PLACEHOLDER],
    queryFn: () => organizationsApi.get(ORG_ID_PLACEHOLDER),
  });

  const [name, setName] = useState('');
  const [kvkNumber, setKvkNumber] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [city, setCity] = useState('');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (org) {
      setName(org.name ?? '');
      setKvkNumber(org.kvkNumber ?? '');
      setVatNumber(org.vatNumber ?? '');
      setAddress(org.address ?? '');
      setPostcode(org.postcode ?? '');
      setCity(org.city ?? '');
      setWebsite(org.website ?? '');
      setEmail(org.email ?? '');
      setPhone(org.phone ?? '');
    }
  }, [org]);

  const {mutate: save, isPending: saving} = useMutation({
    mutationFn: (data: UpdateOrganizationPayload) =>
      organizationsApi.update(ORG_ID_PLACEHOLDER, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['organization', ORG_ID_PLACEHOLDER]});
      Alert.alert(t('Opgeslagen'), t('Je bedrijfsgegevens zijn bijgewerkt.'));
    },
    onError: () => {
      Alert.alert(t('Fout'), t('Opslaan mislukt. Probeer het opnieuw.'));
    },
  });

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert(t('Fout'), t('Bedrijfsnaam is verplicht.'));
      return;
    }
    save({
      name: name.trim(),
      kvkNumber: kvkNumber.trim() || undefined,
      vatNumber: vatNumber.trim() || undefined,
      address: address.trim() || undefined,
      postcode: postcode.trim() || undefined,
      city: city.trim() || undefined,
      website: website.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.sectionTitle}>{t('Bedrijfsinformatie')}</Text>
        <Input
          label={t('Bedrijfsnaam')}
          placeholder={t('Bijv. Bouwbedrijf De Vries')}
          value={name}
          onChangeText={setName}
          leftIcon="domain"
        />
        <Input
          label={t('KvK-nummer')}
          placeholder="12345678"
          value={kvkNumber}
          onChangeText={setKvkNumber}
          keyboardType="numeric"
          leftIcon="card-account-details-outline"
          maxLength={8}
        />
        <Input
          label={t('BTW-nummer (optioneel)')}
          placeholder="NL123456789B01"
          value={vatNumber}
          onChangeText={setVatNumber}
          autoCapitalize="characters"
          leftIcon="receipt"
        />
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>{t('Adres')}</Text>
        <Input
          label={t('Straat en huisnummer')}
          placeholder="Keizersgracht 123"
          value={address}
          onChangeText={setAddress}
          leftIcon="map-marker-outline"
        />
        <Input
          label={t('Postcode')}
          placeholder="1012 AB"
          value={postcode}
          onChangeText={setPostcode}
          leftIcon="mailbox-outline"
        />
        <Input
          label={t('Stad')}
          placeholder="Amsterdam"
          value={city}
          onChangeText={setCity}
          leftIcon="city-variant-outline"
        />
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>{t('Contactgegevens')}</Text>
        <Input
          label={t('Website (optioneel)')}
          placeholder="https://www.bedrijf.nl"
          value={website}
          onChangeText={setWebsite}
          keyboardType="url"
          autoCapitalize="none"
          leftIcon="web"
        />
        <Input
          label={t('E-mailadres (optioneel)')}
          placeholder="info@bedrijf.nl"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon="email-outline"
        />
        <Input
          label={t('Telefoonnummer (optioneel)')}
          placeholder="0201234567"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          leftIcon="phone-outline"
        />
      </Card>

      <Button
        title={t('Opslaan')}
        onPress={handleSave}
        loading={saving}
        size="lg"
        style={styles.saveBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  container: {flex: 1, backgroundColor: colors.background},
  content: {padding: spacing.lg, paddingBottom: spacing.huge},
  section: {marginTop: spacing.md},
  sectionTitle: {
    ...typography.captionBold,
    color: colors.textTertiary,
    marginBottom: spacing.md,
  },
  saveBtn: {marginTop: spacing.xl},
});
