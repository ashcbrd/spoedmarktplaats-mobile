import * as ImagePicker from 'expo-image-picker';
import {mediaApi} from '../api/endpoints/media';
import type {Attachment} from '../types/models';

// Type to match old react-native-image-picker Asset interface
export interface Asset {
  uri: string;
  type?: string;
  fileName?: string;
  fileSize?: number;
  width?: number;
  height?: number;
}

const convertExpoAssetToAsset = (asset: ImagePicker.ImagePickerAsset): Asset => {
  return {
    uri: asset.uri,
    type: asset.mimeType || 'image/jpeg',
    fileName: asset.uri.split('/').pop() || 'upload',
    fileSize: asset.fileSize,
    width: asset.width,
    height: asset.height,
  };
};

export const pickPhotos = async (selectionLimit = 5): Promise<Asset[]> => {
  // Request permission
  const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Photo library permission is required');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
    allowsMultipleSelection: selectionLimit > 1,
    selectionLimit: selectionLimit,
  });

  if (result.canceled) {
    return [];
  }

  return result.assets.map(convertExpoAssetToAsset);
};

export const capturePhoto = async (): Promise<Asset | null> => {
  // Request permission
  const {status} = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Camera permission is required');
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
    allowsEditing: false,
  });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  return convertExpoAssetToAsset(result.assets[0]);
};

export const pickDocument = async (): Promise<Asset[]> => {
  // Request permission
  const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Media library permission is required');
  }

  // expo-image-picker doesn't support documents, only images/videos
  // For PDF support, you'd need expo-document-picker
  // For now, we'll just allow images
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsMultipleSelection: true,
    selectionLimit: 5,
  });

  if (result.canceled) {
    return [];
  }

  return result.assets.map(convertExpoAssetToAsset);
};

export const uploadAsset = async (
  asset: Asset,
  type: 'job_photo' | 'completion_photo' | 'document' | 'id',
): Promise<Attachment> => {
  const {uploadUrl, publicUrl} = await mediaApi.getUploadUrl(type);

  // Upload via PUT to pre-signed URL
  await fetch(uploadUrl, {
    method: 'PUT',
    headers: {'Content-Type': asset.type ?? 'image/jpeg'},
    body: {
      uri: asset.uri,
      type: asset.type ?? 'image/jpeg',
      name: asset.fileName ?? 'upload',
    } as any,
  });

  return {
    id: publicUrl,
    type: asset.type?.includes('pdf') ? 'pdf' : 'photo',
    url: publicUrl,
    fileName: asset.fileName ?? 'upload',
  };
};

export const uploadMultipleAssets = async (
  assets: Asset[],
  type: 'job_photo' | 'completion_photo' | 'document' | 'id',
): Promise<Attachment[]> => {
  return Promise.all(assets.map(a => uploadAsset(a, type)));
};
