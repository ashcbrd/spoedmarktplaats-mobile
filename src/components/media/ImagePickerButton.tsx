import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Alert} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing, borderRadius} from '../../theme/spacing';
import {pickPhotos, capturePhoto, type Asset} from '../../services/media.service';

interface Props {
  assets: Asset[];
  onChange: (assets: Asset[]) => void;
  maxPhotos?: number;
  label?: string;
}

export const ImagePickerButton: React.FC<Props> = ({
  assets,
  onChange,
  maxPhotos = 5,
  label = 'Foto\'s toevoegen',
}) => {
  const handlePick = async () => {
    const remaining = maxPhotos - assets.length;
    if (remaining <= 0) return;
    const picked = await pickPhotos(remaining);
    onChange([...assets, ...picked]);
  };

  const handleCapture = async () => {
    if (assets.length >= maxPhotos) return;
    const photo = await capturePhoto();
    if (photo) {
      onChange([...assets, photo]);
    }
  };

  const handleRemove = (idx: number) => {
    onChange(assets.filter((_, i) => i !== idx));
  };

  const showOptions = () => {
    Alert.alert(label, 'Kies een optie', [
      {text: 'Camera', onPress: handleCapture},
      {text: 'Galerij', onPress: handlePick},
      {text: 'Annuleren', style: 'cancel'},
    ]);
  };

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {assets.map((asset, idx) => (
          <View key={idx} style={styles.thumb}>
            <Image source={{uri: asset.uri}} style={styles.image} />
            <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(idx)}>
              <Icon name="close-circle" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        ))}
        {assets.length < maxPhotos && (
          <TouchableOpacity style={styles.addBtn} onPress={showOptions}>
            <Icon name="camera-plus" size={28} color={colors.textTertiary} />
            <Text style={styles.addText}>
              {assets.length}/{maxPhotos}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  scroll: {flexGrow: 0},
  thumb: {width: 80, height: 80, marginRight: spacing.sm, position: 'relative'},
  image: {width: 80, height: 80, borderRadius: borderRadius.sm},
  removeBtn: {position: 'absolute', top: -6, right: -6},
  addBtn: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {...typography.small, color: colors.textTertiary, marginTop: spacing.xxs},
});
