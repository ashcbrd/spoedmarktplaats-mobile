import AsyncStorage from '@react-native-async-storage/async-storage';
import type { JobDraftForm } from './jobDraftSchema';

const KEY = 'job-draft-checkpoint-v1';

type DraftCheckpoint = {
  draft: JobDraftForm;
  draftId?: string | null;
};

export const saveDraftCheckpoint = async (
  draft: JobDraftForm,
  draftId?: string | null,
): Promise<void> => {
  await AsyncStorage.setItem(KEY, JSON.stringify({
    savedAt: new Date().toISOString(),
    draft,
    draftId,
  }));
};

export const loadDraftCheckpoint = async (): Promise<DraftCheckpoint | null> => {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as DraftCheckpoint;
    if (!parsed?.draft) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const clearDraftCheckpoint = async (): Promise<void> => {
  await AsyncStorage.removeItem(KEY);
};
