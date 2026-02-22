import * as ImagePicker from 'expo-image-picker';
import {mediaApi} from '../api/endpoints/media';
import type {UploadMimeType} from '../api/endpoints/media';
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

const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

const normalizeMimeType = (asset: Asset): UploadMimeType => {
  const input = (asset.type ?? '').toLowerCase();
  if (input === 'image/png') return 'image/png';
  if (input === 'image/webp') return 'image/webp';
  if (input === 'application/pdf') return 'application/pdf';
  return 'image/jpeg';
};

const extensionForMimeType = (mimeType: UploadMimeType): string => {
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  if (mimeType === 'application/pdf') return 'pdf';
  return 'jpg';
};

const resolveAssetSize = async (asset: Asset): Promise<number> => {
  if (asset.fileSize && asset.fileSize > 0) {
    return asset.fileSize;
  }

  const response = await fetch(asset.uri);
  const blob = await response.blob();
  return blob.size;
};

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
  const mimeType = normalizeMimeType(asset);
  const fileSize = await resolveAssetSize(asset);

  if (fileSize <= 0 || fileSize > MAX_UPLOAD_SIZE_BYTES) {
    throw new Error('Bestand moet tussen 1 byte en 10 MB zijn.');
  }

  const {uploadUrl, publicUrl, uploadMethod, uploadFields} =
    await mediaApi.getUploadUrl({
      type,
      mimeType,
      fileSize,
    });

  const fileName = asset.fileName ?? `upload.${extensionForMimeType(mimeType)}`;

  if (uploadMethod === 'POST') {
    if (!uploadFields) {
      throw new Error('Upload configuratie ontbreekt');
    }

    const formData = new FormData();
    for (const [key, value] of Object.entries(uploadFields)) {
      formData.append(key, value);
    }

    formData.append('file', {
      uri: asset.uri,
      type: mimeType,
      name: fileName,
    } as any);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload mislukt (${response.status})`);
    }
  } else {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {'Content-Type': mimeType},
      body: {
        uri: asset.uri,
        type: mimeType,
        name: fileName,
      } as any,
    });

    if (!response.ok) {
      throw new Error(`Upload mislukt (${response.status})`);
    }
  }

  return {
    id: publicUrl,
    type: asset.type?.includes('pdf') ? 'pdf' : 'photo',
    url: publicUrl,
    fileName,
  };
};

export const uploadMultipleAssets = async (
  assets: Asset[],
  type: 'job_photo' | 'completion_photo' | 'document' | 'id',
): Promise<Attachment[]> => {
  return Promise.all(assets.map(a => uploadAsset(a, type)));
};
