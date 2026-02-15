// ──────────────────────────────────────────────
// Enums
// ──────────────────────────────────────────────

export type UserRole = 'visitor' | 'client' | 'provider' | 'admin';
export type ClientType = 'b2c' | 'b2b';
export type Urgency = 'ASAP' | 'TODAY' | 'SCHEDULED' | 'FLEXIBLE';
export type BudgetType = 'fixed' | 'hourly' | 'range' | 'let_bid';
export type Visibility = 'public' | 'private_pool';

export type JobStatus = 'DRAFT' | 'OPEN' | 'EXPIRED' | 'CANCELED' | 'CLOSED';
export type BidStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN' | 'EXPIRED';
export type DealStatus =
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED_PENDING_CLIENT_CONFIRM'
  | 'COMPLETED_PENDING_REVIEWS'
  | 'CLOSED'
  | 'DISPUTED';

export type VerificationStatus = 'none' | 'pending' | 'verified' | 'rejected';
export type DocumentStatus = 'uploaded' | 'verified' | 'rejected';
export type PoolMemberStatus = 'invited' | 'accepted' | 'declined';

export type SubscriptionPlan =
  | 'free'
  | 'pro'
  | 'team'
  | 'business'
  | 'enterprise';

// ──────────────────────────────────────────────
// Core Models
// ──────────────────────────────────────────────

export interface User {
  id: string;
  role: UserRole;
  clientType?: ClientType;
  name: string;
  email: string;
  phone?: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  type: ClientType;
  name: string;
  members: string[];
  locations: Location[];
  plan: SubscriptionPlan;
  createdAt: string;
}

export interface Location {
  id: string;
  orgId: string;
  label: string;
  address: string;
  postcode: string;
  city: string;
}

export interface ProviderProfile {
  userId: string;
  subcategories: string[];
  serviceAreaPostcode: string;
  radiusKm: number;
  minRate?: number;
  availabilityToggle: boolean;
  badges: string[];
  ratingAvg: number;
  ratingCount: number;
  user?: User;
}

export interface ProviderVerification {
  userId: string;
  idVerified: VerificationStatus;
  kvkVerified: VerificationStatus;
  ibanVerified: VerificationStatus;
  isZzp: boolean;
  documents: ProviderDocument[];
}

export interface ProviderDocument {
  id: string;
  documentType: string;
  fileUrl: string;
  status: DocumentStatus;
  expiresAt?: string;
  uploadedAt: string;
}

// ──────────────────────────────────────────────
// Job
// ──────────────────────────────────────────────

export interface JobRequirements {
  ownTools: boolean;
  ownTransport: boolean;
  bouwpasRequired: boolean;
  vcaRequired: boolean;
  requiredDocuments?: string[];
  accessNotes?: string;
  customText?: string;
}

export interface Attachment {
  id: string;
  type: 'photo' | 'pdf' | 'file';
  url: string;
  thumbnailUrl?: string;
  fileName: string;
}

export interface Job {
  id: string;
  clientUserId: string;
  orgId?: string;
  visibility: Visibility;
  invitedProviderIds?: string[];
  subcategory: string;
  title: string;
  description: string;
  urgency: Urgency;
  desiredStart?: string;
  flexibleWindow?: number;
  postcode: string;
  city: string;
  locationId?: string;
  budgetType: BudgetType;
  budgetAmount?: number;
  budgetMin?: number;
  budgetMax?: number;
  requirements: JobRequirements;
  workersNeeded: number;
  attachments: Attachment[];
  bidWindowEnd: string;
  boostedUntil?: string;
  status: JobStatus;
  createdAt: string;
  bidsCount?: number;
  acceptedCrewTotal?: number;
  isStaffed?: boolean;
  client?: User;
}

// ──────────────────────────────────────────────
// Bid
// ──────────────────────────────────────────────

export interface Bid {
  id: string;
  jobId: string;
  providerUserId: string;
  priceType: 'fixed' | 'hourly';
  priceAmount: number;
  eta: string;
  crewSize: number;
  message?: string;
  status: BidStatus;
  matchScore?: number;
  createdAt: string;
  job?: Job;
  provider?: ProviderProfile;
}

// ──────────────────────────────────────────────
// Deal
// ──────────────────────────────────────────────

export interface Deal {
  id: string;
  jobId: string;
  bidId: string;
  clientUserId: string;
  providerUserId: string;
  status: DealStatus;
  completionPhotos?: Attachment[];
  completionNote?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  confirmedAt?: string;
  closedAt?: string;
  job?: Job;
  bid?: Bid;
  provider?: ProviderProfile;
  client?: User;
  hasClientReview?: boolean;
  hasProviderReview?: boolean;
}

// ──────────────────────────────────────────────
// Chat
// ──────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  dealId: string;
  fromUserId: string;
  message: string;
  timestamp: string;
  flagged?: boolean;
}

// ──────────────────────────────────────────────
// Review
// ──────────────────────────────────────────────

export interface Review {
  id: string;
  dealId: string;
  fromUserId: string;
  toUserId: string;
  stars: number;
  tags: string[];
  text?: string;
  createdAt: string;
  fromUser?: User;
}

// ──────────────────────────────────────────────
// Credits
// ──────────────────────────────────────────────

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number; // positive = earned/purchased, negative = spent
  action: string;
  referenceId?: string;
  createdAt: string;
}

// ──────────────────────────────────────────────
// Notifications
// ──────────────────────────────────────────────

export type NotificationType =
  | 'new_bid'
  | 'bid_accepted'
  | 'bid_rejected'
  | 'provider_started'
  | 'provider_completed'
  | 'client_confirmed'
  | 'review_required'
  | 'new_message'
  | 'job_expiring'
  | 'job_alert'
  | 'pool_invite'
  | 'pool_accepted';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
  read: boolean;
  createdAt: string;
}

// ──────────────────────────────────────────────
// Private Pool
// ──────────────────────────────────────────────

export interface PoolMember {
  id: string;
  orgId: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subcategory?: string;
  postcode?: string;
  notes?: string;
  status: PoolMemberStatus;
  invitedAt: string;
  acceptedAt?: string;
}

export interface PoolInvite {
  id: string;
  orgId: string;
  orgName: string;
  status: PoolMemberStatus;
  invitedAt: string;
}

// ──────────────────────────────────────────────
// Subscription
// ──────────────────────────────────────────────

export interface SubscriptionTier {
  key: SubscriptionPlan;
  name: string;
  priceMonthly: number;
  credits: number | 'unlimited';
  features: string[];
}

// ──────────────────────────────────────────────
// Ad
// ──────────────────────────────────────────────

export interface AdPlacement {
  id: string;
  imageUrl: string;
  targetUrl?: string;
  placement: 'feed' | 'job_detail' | 'tools_tile';
  activeFrom: string;
  activeTo: string;
}

// ──────────────────────────────────────────────
// Filter types
// ──────────────────────────────────────────────

export interface JobFilters {
  subcategory?: string;
  urgency?: Urgency;
  budgetType?: BudgetType;
  postcode?: string;
  radiusKm?: number;
  status?: JobStatus;
  page?: number;
  limit?: number;
}
