import {apiClient} from '../client';

export type OrganizationProfile = {
  id: string;
  name: string;
  kvkNumber?: string;
  vatNumber?: string;
  iban?: string;
  address?: string;
  postcode?: string;
  city?: string;
  country?: string;
  website?: string;
  email?: string;
  phone?: string;
  locations: {
    id: string;
    orgId: string;
    label: string;
    address: string;
    postcode: string;
    city: string;
  }[];
};

export type UpdateOrganizationPayload = Partial<
  Omit<OrganizationProfile, 'id' | 'locations'>
>;

export const organizationsApi = {
  get: (orgId: string) =>
    apiClient
      .get<OrganizationProfile>(`/organizations/${orgId}`)
      .then(r => r.data),

  update: (orgId: string, data: UpdateOrganizationPayload) =>
    apiClient
      .put<OrganizationProfile>(`/organizations/${orgId}`, data)
      .then(r => r.data),

  addLocation: (
    orgId: string,
    data: {label: string; address: string; postcode: string; city: string},
  ) =>
    apiClient
      .post<OrganizationProfile['locations'][0]>(
        `/organizations/${orgId}/locations`,
        data,
      )
      .then(r => r.data),
};
