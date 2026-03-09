import {z} from 'zod';
import {getRuntimeLanguage} from '../i18n/runtimeLanguage';
import {translateText} from '../i18n/translateText';

const t = (nl: string) => translateText(nl, getRuntimeLanguage());

// ── Auth schemas ────────────────────────────
export const loginSchema = z.object({
  email: z.string().email(() => t('Ongeldig e-mailadres')),
  password: z.string().min(1, () => t('Vul je wachtwoord in')),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, () => t('Minimaal 2 tekens')),
    email: z.string().email(() => t('Ongeldig e-mailadres')),
    phone: z
      .string()
      .regex(/^06\d{8}$/, () => t('Voer een geldig Nederlands mobiel nummer in (06XXXXXXXX)')),
    password: z.string().min(8, () => t('Minimaal 8 tekens')),
    confirmPassword: z.string(),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: t('Wachtwoorden komen niet overeen'),
    path: ['confirmPassword'],
  });

export const phoneOtpSchema = z.object({
  code: z.string().length(6, () => t('Voer 6-cijferige code in')),
});

// ── Job schemas ─────────────────────────────
export const createJobSchema = z.object({
  subcategory: z.string().min(1, () => t('Kies een categorie')),
  urgency: z.enum(['ASAP', 'TODAY', 'SCHEDULED', 'FLEXIBLE']),
  title: z.string().min(5, () => t('Minimaal 5 tekens')).max(120, () => t('Maximaal 120 tekens')),
  description: z.string().min(20, () => t('Minimaal 20 tekens')),
  postcode: z
    .string()
    .regex(/^\d{4}\s?[A-Za-z]{2}$/, () => t('Ongeldige postcode (bijv. 1012 AB)')),
  city: z.string().min(2, () => t('Vul stad in')),
  budgetType: z.enum(['fixed', 'hourly', 'range', 'let_bid']),
  budgetAmount: z.number().positive().optional(),
  budgetMin: z.number().positive().optional(),
  budgetMax: z.number().positive().optional(),
  workersNeeded: z.number().int().min(1).default(1),
  visibility: z.enum(['public', 'private_pool']).default('public'),
  desiredStart: z.string().optional(),
});

// ── Bid schema ──────────────────────────────
export const placeBidSchema = z.object({
  priceType: z.enum(['fixed', 'hourly']),
  priceAmount: z.number().positive(() => t('Voer een geldig bedrag in')),
  eta: z.string().min(1, () => t('Kies een datum')),
  crewSize: z.number().int().min(1).default(1),
  message: z.string().max(500).optional(),
});

// ── Review schema ───────────────────────────
export const reviewSchema = z.object({
  stars: z.number().int().min(1).max(5),
  tags: z.array(z.string()),
  text: z.string().max(1000).optional(),
});

// ── KvK ─────────────────────────────────────
export const kvkSchema = z.object({
  kvkNumber: z
    .string()
    .regex(/^\d{8}$/, () => t('KvK-nummer moet 8 cijfers zijn')),
});

// ── IBAN ────────────────────────────────────
export const ibanSchema = z.object({
  iban: z
    .string()
    .regex(
      /^[A-Z]{2}\d{2}[A-Z]{4}\d{10}$/,
      () => t('Ongeldig IBAN (bijv. NL91ABNA0417164300)'),
    ),
});

// ── Pool member ─────────────────────────────
export const poolMemberSchema = z.object({
  firstName: z.string().min(1, () => t('Vul voornaam in')),
  lastName: z.string().min(1, () => t('Vul achternaam in')),
  email: z.string().email(() => t('Ongeldig e-mailadres')),
  phone: z.string().optional(),
  subcategory: z.string().optional(),
  postcode: z.string().optional(),
  notes: z.string().optional(),
});

// Helper types
export type LoginForm = z.infer<typeof loginSchema>;
export type SignupForm = z.infer<typeof signupSchema>;
export type PhoneOtpForm = z.infer<typeof phoneOtpSchema>;
export type CreateJobForm = z.infer<typeof createJobSchema>;
export type PlaceBidForm = z.infer<typeof placeBidSchema>;
export type ReviewForm = z.infer<typeof reviewSchema>;
export type KvkForm = z.infer<typeof kvkSchema>;
export type IbanForm = z.infer<typeof ibanSchema>;
export type PoolMemberForm = z.infer<typeof poolMemberSchema>;
