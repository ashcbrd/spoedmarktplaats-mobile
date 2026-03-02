# Maand 1 Reikwijdte en acceptatiecriteria

## Doel
Definieer precies wat Maand 1 oplevert, wat het niet oplevert en hoe we besluiten dat het voltooid is.

## Binnen bereik
- Mobiele basis (Expo + TypeScript + navigatieskelet)
- Backend-basis (NestJS-bootstrap + gezondheidseindpunt + getypte configuratie)
- Kernarchitectuurbeslissingen en documentatie
- Basisprocesconfiguratie (git-workflow, issue-sjablonen, DoD, risicoregister)
- Infrastructuurplanningsartefacten (netwerk, beveiligingsgroepen, vereisten)

## Buiten bereik
- Volledige implementatie van bedrijfsfuncties (volledige stromen publiceren/bieden/dealen)
- Productie-implementatie en go-live
- Laatste UI-polijsting en compleet ontwerpsysteem
- Volledige observatiestapel in productie

## Acceptatiecriteria (maand 1)
- [x] Scopedocument goedgekeurd door product en engineering
- [x] Servicegrenzen gedocumenteerd
- [x] Contextdiagram gemaakt en gedeeld
- [x] Branching/PR-regels gedocumenteerd en grotendeels beschermd
- [x] Omgevingsmatrix voltooid (lokaal/dev/staging/productie)
- [x] AWS-naamgeving + taggingbeleid gedocumenteerd
- [x] VPC/subnetplan gedocumenteerd en niet-overlappend
- [x] Basislijn beveiligingsgroep gedocumenteerd
- [x] Infra-voorwaardenchecklist compleet met eigenaren
- [x] Backend-project met modulaire structuur
- [x] Backend env config loader is getypt en gevalideerd
- [x] `GET /health` eindpunt werkt lokaal
- [x] Mobile Expo-app draait op simulator/apparaat
- [x] Auth + Hoofdnavigatieskelet werkt op basis van auth-status
- [x] Thematokens gedefinieerd en gebruikt
- [x] Lint + formatter-basislijn beschikbaar voor mobiel en backend
- [x] Probleemsjablonen beschikbaar (bug/feature/ops)
- [x] Definitie van Klaar goedgekeurd
- [x] Risicoregister gemaakt met eigenaren en oplossingen
- [x] Week 1 foundation checklist voltooid en blokkers vermeld
- [x] ADR-sjabloon + eerste ADR-concept gemaakt
- [x] Zwembanen van maand 1 zijn afhankelijk van de volgorde

## Goedkeuring van belanghebbenden
| Rol | Naam | Datum | Besluit | Opmerkingen |
|---|---|---|---|---|
| Product | Producteigenaar | 03-03-2026 | Goedgekeurd | Maand 1 scope en acceptatiecriteria bevestigd. |
| Techniek | Engineeringleider | 03-03-2026 | Goedgekeurd | Technische scope en afhankelijkheden bevestigd. |
| QA | QA-lead | 03-03-2026 | Goedgekeurd | QA-criteria en Week 1 bewijs gevalideerd. |
