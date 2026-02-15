import {apiClient} from '../client';
import type {
  ProviderProfile,
  ProviderVerification,
  Organization,
  Location,
} from '../../types/models';

export const usersApi = {
  // ── Provider ─────────────────────
  getProviderProfile: (userId: string) =>
    apiClient.get<ProviderProfile>(`/providers/${userId}`).then(r => r.data),

  updateProviderProfile: (userId: string, body: Partial<ProviderProfile>) =>
    apiClient.put<ProviderProfile>(`/providers/${userId}`, body).then(r => r.data),

  // ── Verification ─────────────────
  getVerificationStatus: () =>
    apiClient.get<ProviderVerification>('/verification/status').then(r => r.data),

  uploadId: (formData: FormData) =>
    apiClient
      .post('/verification/id', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      })
      .then(r => r.data),

  verifyKvk: (kvkNumber: string) =>
    apiClient.post('/verification/kvk', {kvkNumber}).then(r => r.data),

  verifyIban: (iban: string) =>
    apiClient.post('/verification/iban', {iban}).then(r => r.data),

  uploadDocument: (formData: FormData) =>
    apiClient
      .post('/verification/documents', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      })
      .then(r => r.data),

  // ── Organization ─────────────────
  getOrganization: (orgId: string) =>
    apiClient.get<Organization>(`/organizations/${orgId}`).then(r => r.data),

  updateOrganization: (orgId: string, body: Partial<Organization>) =>
    apiClient.put<Organization>(`/organizations/${orgId}`, body).then(r => r.data),

  addLocation: (orgId: string, body: Omit<Location, 'id' | 'orgId'>) =>
    apiClient.post<Location>(`/organizations/${orgId}/locations`, body).then(r => r.data),
};
