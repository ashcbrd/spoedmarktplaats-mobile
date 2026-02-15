# UI-tokens (mobiel)

## Doel
Houd stijlen consistent door gedeelde tokenbestanden te gebruiken.

## Tokenbronnen
- Kleuren: `spoedmarktplaats-mobile/src/theme/colors.ts`
- Afstand + straal: `spoedmarktplaats-mobile/src/theme/spacing.ts`
- Typografie: `spoedmarktplaats-mobile/src/theme/typography.ts`

## Gebruiksregels
- Codeer geen willekeurige kleuren in schermen/componenten.
- Gebruik afstandstokens (`sm`, `md`, `lg`, etc.) voor marges/opvulling.
- Gebruik gedeelde typografiestijlen voor koppen/hoofdtekst/bijschriften.
- Als een token ontbreekt, voeg deze dan eerst toe aan themabestanden en gebruik deze vervolgens.

## Snelle voorbeelden
- Goed: `backgroundColor: colors.surface`
- Goed: `padding: spacing.lg`
- Goed: `...typography.h3`
- Vermijd: `backgroundColor: '#f8f8f8'` tenzij eerst als token toegevoegd.
