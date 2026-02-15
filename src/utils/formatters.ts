import type {BudgetType} from '../types/models';

export const formatPrice = (amount: number): string =>
  new Intl.NumberFormat('nl-NL', {style: 'currency', currency: 'EUR'}).format(
    amount,
  );

export const formatBudget = (
  type: BudgetType,
  amount?: number,
  min?: number,
  max?: number,
): string => {
  switch (type) {
    case 'fixed':
      return amount ? formatPrice(amount) : 'Vast bedrag';
    case 'hourly':
      return amount ? `${formatPrice(amount)}/uur` : 'Uurtarief';
    case 'range':
      if (min != null && max != null) {
        return `${formatPrice(min)} – ${formatPrice(max)}`;
      }
      return 'Prijsrange';
    case 'let_bid':
      return 'Bieden';
    default:
      return '–';
  }
};

export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
};

export const formatRating = (avg: number, count: number): string => {
  if (count === 0) {
    return 'Geen reviews';
  }
  return `${avg.toFixed(1)} (${count})`;
};

export const truncate = (text: string, maxLen: number): string =>
  text.length > maxLen ? `${text.slice(0, maxLen)}…` : text;

export const formatCrewSize = (size: number): string =>
  size === 1 ? '1 persoon' : `${size} personen`;

export const formatWorkersNeeded = (needed: number, accepted: number): string =>
  `${accepted}/${needed} ingevuld`;
