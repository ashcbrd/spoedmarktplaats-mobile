import {
  formatDistanceToNowStrict,
  differenceInMilliseconds,
  format,
  addHours,
  isPast,
} from 'date-fns';
import { enUS, nl } from 'date-fns/locale';
import { BID_WINDOW_MS } from '../config/constants';
import { getRuntimeLanguage } from '../i18n/runtimeLanguage';
import type { Urgency } from '../types/models';

const getLocale = () => (getRuntimeLanguage() === 'en' ? enUS : nl);

export const calculateBidWindowEnd = (
  urgency: Urgency,
  createdAt: Date = new Date(),
): Date => {
  const ms = BID_WINDOW_MS[urgency] ?? BID_WINDOW_MS.SCHEDULED;
  return new Date(createdAt.getTime() + ms);
};

export const getTimeLeft = (endIso: string): string => {
  const end = new Date(endIso);
  if (isPast(end)) {
    return getRuntimeLanguage() === 'en' ? 'Expired' : 'Verlopen';
  }
  return formatDistanceToNowStrict(end, {
    locale: getLocale(),
    addSuffix: false,
  });
};

export const getTimeLeftMs = (endIso: string): number =>
  Math.max(0, differenceInMilliseconds(new Date(endIso), new Date()));

export const isExpired = (endIso: string): boolean => isPast(new Date(endIso));

export const formatDate = (iso: string): string =>
  format(new Date(iso), 'd MMM yyyy', { locale: getLocale() });

export const formatDateTime = (iso: string): string =>
  format(new Date(iso), 'd MMM yyyy HH:mm', { locale: getLocale() });

export const formatTime = (iso: string): string =>
  format(new Date(iso), 'HH:mm');

export const extendBidWindow = (currentEnd: string, hours: number): string =>
  addHours(new Date(currentEnd), hours).toISOString();

export const getUrgencyLabel = (urgency: Urgency): string => {
  const map: Record<Urgency, string> =
    getRuntimeLanguage() === 'en'
      ? {
          ASAP: 'ASAP',
          TODAY: 'Today',
          SCHEDULED: 'Scheduled',
          FLEXIBLE: 'Flexible',
        }
      : {
          ASAP: 'ASAP',
          TODAY: 'Vandaag',
          SCHEDULED: 'Gepland',
          FLEXIBLE: 'Flexibel',
        };

  return map[urgency] ?? urgency;
};

export const relativeTime = (iso: string): string =>
  formatDistanceToNowStrict(new Date(iso), {
    locale: getLocale(),
    addSuffix: true,
  });
