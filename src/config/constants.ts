// ──────────────────────────────────────────────
// Credit costs
// ──────────────────────────────────────────────
export const CREDIT_COSTS = {
  PUBLISH_JOB: 1,
  BOOST_24H: 1,
  PING_TOP_5: 1,
  EXTEND_6H: 1,
  EXTEND_24H: 2,
  REPOST_JOB: 1,
  PLACE_BID: 1,
} as const;

export const INITIAL_FREE_CREDITS = 3;

// ──────────────────────────────────────────────
// Bid window durations (ms)
// ──────────────────────────────────────────────
export const BID_WINDOW_MS: Record<string, number> = {
  ASAP: 2 * 60 * 60 * 1000, // 2 h
  TODAY: 6 * 60 * 60 * 1000, // 6 h
  SCHEDULED: 24 * 60 * 60 * 1000, // 24 h
  FLEXIBLE: 7 * 24 * 60 * 60 * 1000, // 7 d
};

// ──────────────────────────────────────────────
// Construction subcategories (MVP)
// ──────────────────────────────────────────────
export const SUBCATEGORIES = [
  {key: 'plumber', label: 'Plumber', icon: 'water'},
  {key: 'electrician', label: 'Electrician', icon: 'flash'},
  {key: 'carpenter', label: 'Carpenter', icon: 'hammer'},
  {key: 'painter', label: 'Painter', icon: 'format-paint'},
  {key: 'tiling', label: 'Tiling / Bathroom', icon: 'grid'},
  {key: 'roofing', label: 'Roofing / Gutters', icon: 'home-roof'},
  {key: 'hvac', label: 'HVAC / Install', icon: 'air-conditioner'},
  {key: 'locks', label: 'Locks / Security', icon: 'lock'},
  {key: 'handyman', label: 'All-round Handyman', icon: 'wrench'},
  {key: 'repairs', label: 'Small Repairs', icon: 'tools'},
] as const;

export type SubcategoryKey = (typeof SUBCATEGORIES)[number]['key'];

// ──────────────────────────────────────────────
// Urgency options
// ──────────────────────────────────────────────
export const URGENCY_OPTIONS = [
  {key: 'ASAP', label: 'ASAP', description: '2 h bid window'},
  {key: 'TODAY', label: 'Today', description: '6 h bid window'},
  {key: 'SCHEDULED', label: 'Scheduled', description: '24 h bid window'},
  {key: 'FLEXIBLE', label: 'Flexible', description: '7 day bid window'},
] as const;

// ──────────────────────────────────────────────
// Budget types
// ──────────────────────────────────────────────
export const BUDGET_TYPES = [
  {key: 'fixed', label: 'Fixed price'},
  {key: 'hourly', label: 'Hourly rate'},
  {key: 'range', label: 'Price range'},
  {key: 'let_bid', label: 'Let providers bid'},
] as const;

// ──────────────────────────────────────────────
// Review tags
// ──────────────────────────────────────────────
export const REVIEW_TAGS_POSITIVE = [
  'Professional',
  'On time',
  'Quality work',
  'Good communication',
  'Clean work',
  'Fair price',
] as const;

export const REVIEW_TAGS_NEGATIVE = [
  'Late',
  'Poor quality',
  'Bad communication',
  'Unprofessional',
  'Overpriced',
  'Messy',
] as const;

// ──────────────────────────────────────────────
// Provider document types
// ──────────────────────────────────────────────
export const DOCUMENT_TYPES = [
  {key: 'bouwpas', label: 'Bouwpas / Site access pass'},
  {key: 'vca', label: 'VCA Certificate'},
  {key: 'insurance', label: 'Insurance proof'},
  {key: 'diploma', label: 'Trade diploma / certification'},
  {key: 'other', label: 'Other compliance document'},
] as const;

// ──────────────────────────────────────────────
// Pagination
// ──────────────────────────────────────────────
export const PAGE_SIZE = 20;

// ──────────────────────────────────────────────
// Chat
// ──────────────────────────────────────────────
export const BLOCKED_CHAT_PATTERNS = [
  /\b0[1-9]\d{8}\b/, // NL phone
  /\+31\d{9}/, // NL intl phone
  /\b[A-Z]{2}\d{2}\s?[A-Z]{4}\s?\d{4}\s?\d{4}\s?\d{2}\b/i, // IBAN
  /\b[\w._%+-]+@[\w.-]+\.[a-z]{2,}\b/i, // email
];
