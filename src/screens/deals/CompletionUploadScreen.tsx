import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ImagePickerButton } from '../../components/media/ImagePickerButton';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { useDealActions } from '../../hooks/useDeals';
import { uploadMultipleAssets, type Asset } from '../../services/media.service';
import { useI18n } from '../../i18n/I18nProvider';
import type { DealsStackParamList } from '../../types/navigation';

export const CompletionUploadScreen: React.FC = () => {
  const route = useRoute<RouteProp<DealsStackParamList, 'CompletionUpload'>>();
  const navigation = useNavigation<any>();
  const { dealId } = route.params;
  const {t} = useI18n();
  const { complete, completePending } = useDealActions();

  const [photos, setPhotos] = useState<Asset[]>([]);
  const [note, setNote] = useState('');
  const [uploading, setUploading] = useState(false);

  const canSubmit = photos.length >= 1 && note.trim().length >= 10;

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert(
        t('Onvolledig'),
        t('Voeg minimaal 1 foto toe en schrijf een notitie (min. 10 tekens).'),
      );
      return;
    }
    setUploading(true);
    try {
      const attachments = await uploadMultipleAssets(
        photos,
        'completion_photo',
      );
      await complete({
        dealId,
        completionNote: note.trim(),
        photoIds: attachments.map(a => a.id),
      });
      Alert.alert(
        t('Gelukt!'),
        t('Het werk is als voltooid gemarkeerd. Wacht op bevestiging van de opdrachtgever.'),
        [{ text: t('OK'), onPress: () => navigation.goBack() }],
      );
    } catch {
      // handled by hook
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('Werk afronden')}</Text>
      <Text style={styles.subtitle}>{t('Upload bewijs van het voltooide werk')}</Text>

      <ImagePickerButton
        assets={photos}
        onChange={setPhotos}
        maxPhotos={3}
        label={t("Foto's van het voltooide werk (1-3 verplicht)")}
      />

      <View style={styles.noteSection}>
        <Input
          label={t('Notitie (verplicht, min. 10 tekens)')}
          placeholder={t('Beschrijf wat er is gedaan...')}
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={4}
          style={styles.noteInput}
        />
      </View>

      <Button
        title={uploading ? t('Uploaden...') : t('Voltooiing indienen')}
        onPress={handleSubmit}
        loading={uploading || completePending}
        disabled={!canSubmit}
        style={styles.submitBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: spacing.huge },
  title: { ...typography.h2, color: colors.textPrimary },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  noteSection: { marginTop: spacing.xl },
  noteInput: { height: 100, textAlignVertical: 'top' },
  submitBtn: { marginTop: spacing.xxl },
});
