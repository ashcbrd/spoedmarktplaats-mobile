import {apiClient} from '../client';

export interface UploadUrlResponse {
  uploadUrl: string;
  fileKey: string;
  publicUrl: string;
  uploadMethod: 'POST' | 'PUT';
  uploadFields?: Record<string, string>;
}

export type UploadMimeType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/webp'
  | 'application/pdf';

export interface UploadUrlRequest {
  type: 'job_photo' | 'completion_photo' | 'document' | 'id';
  mimeType: UploadMimeType;
  fileSize: number;
}

export const mediaApi = {
  getUploadUrl: (payload: UploadUrlRequest) =>
    apiClient
      .post<UploadUrlResponse>('/media/upload-url', payload)
      .then(r => r.data),
};
