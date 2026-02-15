import {apiClient} from '../client';
import type {Job, JobFilters} from '../../types/models';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const jobsApi = {
  list: (filters?: JobFilters) =>
    apiClient
      .get<PaginatedResponse<Job>>('/jobs', {params: filters})
      .then(r => r.data),

  detail: (jobId: string) =>
    apiClient.get<Job>(`/jobs/${jobId}`).then(r => r.data),

  myJobs: (params?: {status?: string; page?: number}) =>
    apiClient
      .get<PaginatedResponse<Job>>('/jobs/my-jobs', {params})
      .then(r => r.data),

  createDraft: (body: Partial<Job>) =>
    apiClient.post<Job>('/jobs/draft', body).then(r => r.data),

  updateDraft: (jobId: string, body: Partial<Job>) =>
    apiClient.put<Job>(`/jobs/draft/${jobId}`, body).then(r => r.data),

  publish: (jobId: string) =>
    apiClient.post<Job>(`/jobs/${jobId}/publish`).then(r => r.data),

  cancel: (jobId: string) =>
    apiClient.post<Job>(`/jobs/${jobId}/cancel`).then(r => r.data),

  boost: (jobId: string) =>
    apiClient.post<Job>(`/jobs/${jobId}/boost`).then(r => r.data),

  pingTop5: (jobId: string) =>
    apiClient.post(`/jobs/${jobId}/ping-top-5`).then(r => r.data),

  extend: (jobId: string, hours: 6 | 24) =>
    apiClient.post<Job>(`/jobs/${jobId}/extend`, {hours}).then(r => r.data),

  repost: (jobId: string) =>
    apiClient.post<Job>(`/jobs/${jobId}/repost`).then(r => r.data),
};
