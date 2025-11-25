# Comment ça Fonctionne

Slack Channels Grouping organise automatiquement votre barre latérale Slack en regroupant les canaux qui partagent le même préfixe.

## Détection des Préfixes

L'extension détecte les préfixes en recherchant le premier `-` (tiret) ou `_` (underscore) dans le nom du canal.

| Nom du Canal | Préfixe Détecté |
|--------------|-----------------|
| `dev-api` | `dev` |
| `dev-frontend` | `dev` |
| `project_backend` | `project` |
| `team-design-v2` | `team` |
| `general` | (pas de préfixe) |

## Exemple de Regroupement

Les canaux avec le même préfixe sont regroupés visuellement ensemble :

**Avant :**
```
# dev-api
# dev-frontend
# dev-backend
# sales-leads
# sales-reports
# general
```

**Après :**
```
# ┬ dev-api
# ├ dev-frontend
# └ dev-backend
# ┬ sales-leads
# └ sales-reports
# general
```

## Indicateurs Visuels

L'extension utilise des séparateurs de style arborescent pour montrer le regroupement :

| Symbole | Signification |
|---------|---------------|
| `┬` | Premier canal d'un groupe |
| `├` | Canal du milieu d'un groupe |
| `└` | Dernier canal d'un groupe |

## Types de Canaux Pris en Charge

| Type de Canal | Regroupé |
|---------------|----------|
| Canaux publics | Oui |
| Canaux privés | Oui |
| Messages directs | Non |
| DMs de groupe | Non |

Les messages directs et les DMs de groupe sont intentionnellement exclus du regroupement pour garder vos conversations facilement accessibles.

## Zéro Configuration

Installez simplement l'extension et elle fonctionne automatiquement. Aucune configuration requise.
