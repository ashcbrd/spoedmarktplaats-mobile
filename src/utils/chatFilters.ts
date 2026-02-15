import {BLOCKED_CHAT_PATTERNS} from '../config/constants';

export const detectBlockedKeywords = (message: string): boolean =>
  BLOCKED_CHAT_PATTERNS.some(pattern => pattern.test(message));

export const BLOCKED_WARNING =
  'Je bericht bevat mogelijk contactgegevens. ' +
  'Deel geen telefoonnummers, e-mailadressen of IBAN-nummers in de chat.';
