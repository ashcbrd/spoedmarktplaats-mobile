export type JobDraftForm = {
  subcategory: string;
  urgency: string;
  postcode: string;
  city: string;
  title: string;
  description: string;
  budgetType: string;
  budgetAmount: string;
  budgetMin: string;
  budgetMax: string;
};

export type JobDraftErrors = Partial<Record<keyof JobDraftForm, string>>;

const numberValue = (value: string): number | null => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const validateJobDraft = (draft: JobDraftForm): JobDraftErrors => {
  const errors: JobDraftErrors = {};

  if (!draft.subcategory) errors.subcategory = 'Kies een categorie';
  if (!draft.urgency) errors.urgency = 'Kies urgentie';
  if (!draft.postcode || draft.postcode.length < 4) errors.postcode = 'Postcode is te kort';
  if (!draft.city || draft.city.length < 2) errors.city = 'Voer een geldige stad in';
  if (!draft.title || draft.title.length < 5) errors.title = 'Titel moet minimaal 5 tekens zijn';
  if (!draft.description || draft.description.length < 20) {
    errors.description = 'Omschrijving moet minimaal 20 tekens zijn';
  }
  if (draft.description.length > 1000) {
    errors.description = 'Omschrijving mag maximaal 1000 tekens bevatten';
  }

  if (!draft.budgetType) {
    errors.budgetType = 'Kies een budgettype';
  }

  if (draft.budgetType === 'fixed' || draft.budgetType === 'hourly') {
    const amount = numberValue(draft.budgetAmount);
    if (!amount || amount <= 0) {
      errors.budgetAmount = 'Voer een geldig bedrag in';
    }
  }

  if (draft.budgetType === 'range') {
    const min = numberValue(draft.budgetMin);
    const max = numberValue(draft.budgetMax);
    if (!min || min <= 0) {
      errors.budgetMin = 'Minimum budget is ongeldig';
    }
    if (!max || max <= 0) {
      errors.budgetMax = 'Maximum budget is ongeldig';
    }
    if (min && max && min > max) {
      errors.budgetMax = 'Maximum moet hoger zijn dan minimum';
    }
  }

  return errors;
};
