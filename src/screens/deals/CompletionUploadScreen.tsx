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
import type { DealsStackParamList } from '../../types/navigation';

export const CompletionUploadScreen: React.FC = () => {
  const route = useRoute<RouteProp<DealsStackParamList, 'CompletionUpload'>>();
  const navigation = useNavigation<any>();
  const { dealId } = route.params;
  const { complete, completePending } = useDealActions();

  const [photos, setPhotos] = useState<Asset[]>([]);
  const [note, setNote] = useState('');
  const [uploading, setUploading] = useState(false);

  const canSubmit = photos.length >= 1 && note.trim().length >= 10;

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert(
        'Onvolledig',
        'Voeg minimaal 1 foto toe en schrijf een notitie (min. 10 tekens).',
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
        'Gelukt!',
        'Het werk is als voltooid gemarkeerd. Wacht op bevestiging van de opdrachtgever.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch {
      // handled by hook
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Werk afronden</Text>
      <Text style={styles.subtitle}>Upload bewijs van het voltooide werk</Text>

      <ImagePickerButton
        assets={photos}
        onChange={setPhotos}
        maxPhotos={3}
        label="Foto's van het voltooide werk (1-3 verplicht)"
      />

      <View style={styles.noteSection}>
        <Input
          label="Notitie (verplicht, min. 10 tekens)"
          placeholder="Beschrijf wat er is gedaan..."
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={4}
          style={styles.noteInput}
        />
      </View>

      <Button
        title={uploading ? 'Uploaden...' : 'Voltooiing indienen'}
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
