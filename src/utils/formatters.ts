import type {BudgetType} from '../types/models';
import {getRuntimeLanguage} from '../i18n/runtimeLanguage';

export const formatPrice = (amount: number): string =>
  new Intl.NumberFormat(getRuntimeLanguage() === 'en' ? 'en-GB' : 'nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(
    amount,
  );

export const formatBudget = (
  type: BudgetType,
  amount?: number,
  min?: number,
  max?: number,
): string => {
  const language = getRuntimeLanguage();

  switch (type) {
    case 'fixed':
      return amount
        ? formatPrice(amount)
        : language === 'en'
          ? 'Fixed price'
          : 'Vaste prijs';
    case 'hourly':
      return amount
        ? `${formatPrice(amount)}/${language === 'en' ? 'hour' : 'uur'}`
        : language === 'en'
          ? 'Hourly rate'
          : 'Uurtarief';
    case 'range':
      if (min != null && max != null) {
        return `${formatPrice(min)} – ${formatPrice(max)}`;
      }
      return language === 'en' ? 'Price range' : 'Prijsrange';
    case 'let_bid':
      return language === 'en' ? 'Bidding' : 'Bieden';
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
    return getRuntimeLanguage() === 'en' ? 'No reviews' : 'Geen reviews';
  }
  return `${avg.toFixed(1)} (${count})`;
};

export const truncate = (text: string, maxLen: number): string =>
  text.length > maxLen ? `${text.slice(0, maxLen)}…` : text;

export const formatCrewSize = (size: number): string =>
  getRuntimeLanguage() === 'en'
    ? size === 1
      ? '1 person'
      : `${size} people`
    : size === 1
      ? '1 persoon'
      : `${size} personen`;

export const formatWorkersNeeded = (needed: number, accepted: number): string =>
  getRuntimeLanguage() === 'en'
    ? `${accepted}/${needed} filled`
    : `${accepted}/${needed} ingevuld`;

export const formatWorkersRequired = (count: number): string =>
  getRuntimeLanguage() === 'en'
    ? `${count} worker${count === 1 ? '' : 's'} needed`
    : `${count} werknemer${count === 1 ? '' : 's'} nodig`;

export const formatBidCount = (count: number): string =>
  getRuntimeLanguage() === 'en'
    ? `${count} bid${count === 1 ? '' : 's'} received`
    : `${count} bod${count === 1 ? '' : 'en'} ontvangen`;
