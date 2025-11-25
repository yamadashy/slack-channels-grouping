# Hoe Het Werkt

Slack Channels Grouping organiseert automatisch je Slack-zijbalk door kanalen te groeperen die dezelfde prefix delen.

## Prefix Detectie

De extensie detecteert prefixen door te zoeken naar de eerste `-` (streepje) of `_` (underscore) in de kanaalnaam.

| Kanaalnaam | Gedetecteerde Prefix |
|------------|----------------------|
| `dev-api` | `dev` |
| `dev-frontend` | `dev` |
| `project_backend` | `project` |
| `team-design-v2` | `team` |
| `general` | (geen prefix) |

## Groeperingsvoorbeeld

Kanalen met dezelfde prefix worden visueel samen gegroepeerd:

**Voor:**
```
# dev-api
# dev-frontend
# dev-backend
# sales-leads
# sales-reports
# general
```

**Na:**
```
# ┬ dev-api
# ├ dev-frontend
# └ dev-backend
# ┬ sales-leads
# └ sales-reports
# general
```

## Visuele Indicatoren

De extensie gebruikt boomstijl-scheidingstekens om de groepering te tonen:

| Symbool | Betekenis |
|---------|-----------|
| `┬` | Eerste kanaal in een groep |
| `├` | Middelste kanaal in een groep |
| `└` | Laatste kanaal in een groep |

## Ondersteunde Kanaaltypen

| Kanaaltype | Gegroepeerd |
|------------|-------------|
| Openbare kanalen | Ja |
| Privékanalen | Ja |
| Directe berichten | Nee |
| Groeps-DM's | Nee |

Directe berichten en groeps-DM's zijn opzettelijk uitgesloten van groepering om je gesprekken gemakkelijk toegankelijk te houden.

## Geen Configuratie

Installeer gewoon de extensie en het werkt automatisch. Geen setup of configuratie vereist.
