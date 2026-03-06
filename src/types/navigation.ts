import type {NavigatorScreenParams} from '@react-navigation/native';

// ── Auth Stack ──────────────────────────────
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: {role?: 'client' | 'provider'};
  PhoneVerification: undefined;
  ClientOnboarding: undefined;
  ProviderOnboarding: undefined;
};

// ── Main Tab ────────────────────────────────
export type MainTabParamList = {
  FeedTab: NavigatorScreenParams<FeedStackParamList>;
  JobsTab: NavigatorScreenParams<JobsStackParamList>;
  DealsTab: NavigatorScreenParams<DealsStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// ── Feed Stack ──────────────────────────────
export type FeedStackParamList = {
  JobFeed: undefined;
  JobDetail: {jobId: string};
  PlaceBid: {jobId: string};
};

// ── Jobs Stack (client = my jobs, provider = my bids) ──
export type JobsStackParamList = {
  MyJobs: undefined;
  CreateJob: undefined;
  JobManagement: {jobId: string};
  MyBids: undefined;
  BidDetail: {bidId: string};
};

// ── Deals Stack ─────────────────────────────
export type DealsStackParamList = {
  ActiveDeals: undefined;
  DealDetail: {dealId: string};
  Chat: {dealId: string};
  Review: {dealId: string};
  CompletionUpload: {dealId: string};
};

// ── Profile Stack ───────────────────────────
export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  VerificationCenter: undefined;
  Credits: undefined;
  PrivatePool: undefined;
  Preferences: undefined;
  Plans: undefined;
  Notifications: undefined;
  CompanyProfile: undefined;
};

// ── Root Stack ──────────────────────────────
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  OtpVerification: undefined;
};

// re-export for convenience
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
