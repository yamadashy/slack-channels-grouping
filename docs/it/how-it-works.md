# Come Funziona

Slack Channels Grouping organizza automaticamente la tua barra laterale di Slack raggruppando i canali che condividono lo stesso prefisso.

## Rilevamento del Prefisso

L'estensione rileva i prefissi cercando il primo `-` (trattino) o `_` (underscore) nel nome del canale.

| Nome del Canale | Prefisso Rilevato |
|-----------------|-------------------|
| `dev-api` | `dev` |
| `dev-frontend` | `dev` |
| `project_backend` | `project` |
| `team-design-v2` | `team` |
| `general` | (nessun prefisso) |

## Esempio di Raggruppamento

I canali con lo stesso prefisso vengono raggruppati visivamente insieme:

**Prima:**
```
# dev-api
# dev-frontend
# dev-backend
# sales-leads
# sales-reports
# general
```

**Dopo:**
```
# ┬ dev-api
# ├ dev-frontend
# └ dev-backend
# ┬ sales-leads
# └ sales-reports
# general
```

## Indicatori Visivi

L'estensione usa separatori a stile albero per mostrare il raggruppamento:

| Simbolo | Significato |
|---------|-------------|
| `┬` | Primo canale in un gruppo |
| `├` | Canale centrale in un gruppo |
| `└` | Ultimo canale in un gruppo |

## Tipi di Canali Supportati

| Tipo di Canale | Raggruppato |
|----------------|-------------|
| Canali pubblici | Sì |
| Canali privati | Sì |
| Messaggi diretti | No |
| DM di gruppo | No |

I messaggi diretti e i DM di gruppo sono intenzionalmente esclusi dal raggruppamento per mantenere le tue conversazioni facilmente accessibili.

## Zero Configurazione

Basta installare l'estensione e funziona automaticamente. Nessuna configurazione richiesta.
