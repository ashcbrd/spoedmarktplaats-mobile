import AsyncStorage from '@react-native-async-storage/async-storage';
import type { JobDraftForm } from './jobDraftSchema';

const getKey = (userId: string) => `job-draft-checkpoint-v1:${userId}`;

type DraftCheckpoint = {
  draft: JobDraftForm;
  draftId?: string | null;
};

export const saveDraftCheckpoint = async (
  draft: JobDraftForm,
  draftId: string | null | undefined,
  userId: string,
): Promise<void> => {
  await AsyncStorage.setItem(getKey(userId), JSON.stringify({
    savedAt: new Date().toISOString(),
    draft,
    draftId,
  }));
};

export const loadDraftCheckpoint = async (userId: string): Promise<DraftCheckpoint | null> => {
  const raw = await AsyncStorage.getItem(getKey(userId));
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as DraftCheckpoint;
    if (!parsed?.draft) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const clearDraftCheckpoint = async (userId: string): Promise<void> => {
  await AsyncStorage.removeItem(getKey(userId));
};
