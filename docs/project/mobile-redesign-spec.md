# Spoedmarktplaats Mobile Redesign Specification

## 1) Redesign Goal

Create a premium, trustworthy mobile experience for urgent home and construction services while preserving:

- existing API contracts
- existing data flow hooks/stores
- existing navigation graph and route names
- existing business logic (credits, verification gates, role-based behavior)

This redesign is visual + interaction-focused, not a functional scope cut.

## 2) Product UX Principles

1. **Trust first**: clear pricing, verification status, and service expectations.
2. **Speed to action**: fewer visual decisions per screen, stronger hierarchy.
3. **Calm density**: generous spacing, precise typography, clear hit areas.
4. **One-handed flow**: key actions in thumb zone, predictable primary CTA placement.
5. **Accessible by default**: contrast-safe colors, readable text sizes, 44px minimum touch targets.

## 3) Visual Direction

- No gradients.
- Solid color surfaces, subtle elevation, crisp borders/dividers.
- Warm premium brand accent (construction-forward, not playful).
- Neutral canvas with strong text contrast.
- Native-feeling typography with restrained weight usage.

## 4) Design Tokens (Implemented)

- `src/theme/colors.ts`
- `src/theme/typography.ts`
- `src/theme/spacing.ts`
- `src/theme/theme.ts`

### Token Intent

- **Color roles**: background, surface, border, primary action, semantic states.
- **Type scale**: display/headline/body/caption tuned for mobile readability.
- **Spacing/radius**: larger vertical rhythm and modern rounded geometry.
- **Elevation**: only two reusable levels (`sm`, `md`) to prevent visual noise.

## 5) Component System (Implemented UI Structure)

### Core components

- `Button`: premium action states, haptic tap cue, stronger sizing, clear variants.
- `Card`: subtle border + elevation, consistent touch feedback.
- `Input`: labels, translated placeholders/errors, min/max helper, live char counters.
- `Badge`: compact status chips with consistent edge treatment.
- `Chip`: reusable selection chip for filters and segmented choices.
- `SheetModal`: reusable bottom sheet container for filter/action flows.
- `Loading`: lighter spinner treatment.
- `SkeletonBlock` + `FeedSkeleton`: perceived-performance loading state.
- `NetworkBanner`: API degradation/offline resilience feedback.

### New/updated files

- `src/components/common/Chip.tsx`
- `src/components/common/SheetModal.tsx`
- `src/components/common/Skeleton.tsx`
- `src/components/common/NetworkBanner.tsx`
- `src/utils/haptics.ts`

## 6) Navigation + Motion Rules

### Implemented

- Unified stack motion (`slide_from_right`) with gestures enabled.
- Center-aligned stack titles for cleaner hierarchy.
- Reworked tab bar spacing, height, and touch ergonomics.

### Motion rules (product-wide)

- Motion is structural (navigation context, hierarchy changes), never decorative.
- Max transition duration target: ~220ms standard interactions.
- CTA feedback via subtle scale + haptic cue.

## 7) Reliability/State Patterns

### Implemented

- Global API degradation banner driven by network-aware store updates.
- Feed skeleton for first-load speed perception.

### Standardized state order

1. loading skeleton
2. content
3. empty state with one clear next action
4. non-blocking error recovery

## 8) Screen-by-Screen Redesign Spec

All screens keep current route names and data hooks. The following defines layout, hierarchy, and interaction behavior.

### A) Auth Flow

#### Welcome

- Hero title + concise value proposition.
- Two role CTAs with clear visual priority.
- Secondary login link anchored lower region.
- Floating language switch remains globally visible.

#### Login

- Single-column form with explicit label hierarchy.
- Primary CTA fixed after fields.
- Error feedback near form and via alert fallback.

#### Signup

- Progressive field grouping (identity, contact, password, consent).
- Counter/helpers on constrained fields.
- Validation copy remains action-oriented.

#### Phone Verification

- 6-digit segmented input.
- Exact-length helper + live translated counter.
- Cooldown resend state clearly visible.

#### Client/Provider Onboarding

- Step-by-step structure with strong section headers.
- Chip-based taxonomy selection where possible.
- Single primary next action per step.

### B) Discovery + Job Feed

#### Job Feed

- Filter rail on top with chips + active count.
- Skeleton cards while loading.
- Job cards with urgency, badges, budget, staffing context.
- FAB for client job creation remains unchanged functionally.

#### Filter Sheet

- Replaced generic modal with bottom sheet pattern.
- Sections: category, budget type, location.
- Sticky footer actions: clear + apply.

#### Job Detail

- Section-based card layout.
- Budget, staffing, requirements, and attachments grouped for scanning.
- Primary action remains role-aware.

#### Place Bid

- Price type toggle + numeric input focus.
- Verification/credit gates unchanged.
- Message field supports max length and translated helper patterns.

### C) Job Creation + Management

#### Create Job (multi-step)

- Preserves existing step logic and publishing flow.
- Added translated min/max guidance and live counters on constrained text fields.
- Budget inputs enforce digits-only for cleaner data entry.
- Review step remains final confirmation before publish.

#### My Jobs / Job Management / My Bids

- Card-first list layout.
- Strong status legibility via badges and grouped actions.
- Action buttons maintain current backend integration.

### D) Deals + Communication

#### Active Deals / Deal Detail

- Status-forward card hierarchy.
- Timeline and next-action CTA above secondary metadata.

#### Chat

- Message input remains lightweight with safety copy.
- Input placeholder translation is preserved.

#### Completion Upload

- Upload evidence first, note second.
- Field requirement copy + char threshold guidance.

#### Review

- Star rating first, tags second, text last.
- Maintain max-length limit and helper feedback.

### E) Profile + Account + Billing

#### Profile

- Account trust indicators (verification, credits, role) grouped at top.

#### Settings / Notifications / Preferences

- List-row architecture with clear disclosure behavior.
- Language display reflects active locale.

#### Verification Center

- Checklist progression with status clarity and evidence upload links.

#### Credits / Plans

- Financial clarity first: balance, cost map, transaction list.
- External payment notice remains explicit in MVP state.

#### Private Pool

- Membership list, invite entry, import flow with actionable empty states.

## 9) Layout Rules (Production Constraints)

1. Screen horizontal padding: tokenized (`spacing.xl`).
2. Vertical section spacing: tokenized (`spacing.xl`/`xxl`).
3. Card radius and border: unified, no ad-hoc shadow recipes.
4. Primary CTA minimum height >= 48.
5. Inputs use standardized helper + counter where limits exist.
6. Touch target minimum >= 44.

## 10) Accessibility Rules

- Use semantic color roles only (no low-contrast custom hex per screen).
- Keep long-form text at body size or above.
- Preserve clear focus/pressed feedback for all tappable controls.
- Do not encode meaning by color alone (status also labeled textually).

## 11) Implementation Map (Current)

Primary redesign implementation touches:

- Theme tokens: `src/theme/*`
- Common components: `src/components/common/*`
- Feed UI: `src/components/jobs/JobFilters.tsx`, `src/components/jobs/JobCard.tsx`, `src/screens/feed/JobFeedScreen.tsx`
- Navigation polish: `src/navigation/MainNavigator.tsx`, `src/navigation/AuthNavigator.tsx`
- App shell resilience: `src/api/client.ts`, `src/store/networkStore.ts`, `src/components/common/NetworkBanner.tsx`, `App.tsx`

## 12) Non-breaking Contract Guarantee

The redesign keeps existing:

- route names
- query/mutation hooks
- endpoint usage
- state stores
- role/verification/credits gates

This is a UI-system modernization layer that preserves functional behavior.
