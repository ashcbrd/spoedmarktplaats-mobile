import {apiClient} from '../client';

export interface UploadUrlResponse {
  uploadUrl: string;
  fileKey: string;
  publicUrl: string;
}

export const mediaApi = {
  getUploadUrl: (type: 'job_photo' | 'completion_photo' | 'document' | 'id') =>
    apiClient
      .post<UploadUrlResponse>('/media/upload-url', {type})
      .then(r => r.data),
};
