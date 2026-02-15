# UI Tokens (Mobile)

## Purpose
Keep styles consistent by using shared token files.

## Token Sources
- Colors: `spoedmarktplaats-mobile/src/theme/colors.ts`
- Spacing + Radius: `spoedmarktplaats-mobile/src/theme/spacing.ts`
- Typography: `spoedmarktplaats-mobile/src/theme/typography.ts`

## Usage Rules
- Do not hard-code random colors in screens/components.
- Use spacing tokens (`sm`, `md`, `lg`, etc.) for margins/padding.
- Use shared typography styles for headings/body/captions.
- If a token is missing, add it to theme files first, then use it.

## Quick Examples
- Good: `backgroundColor: colors.surface`
- Good: `padding: spacing.lg`
- Good: `...typography.h3`
- Avoid: `backgroundColor: '#f8f8f8'` unless added as a token first.
