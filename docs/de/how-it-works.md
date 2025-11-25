# Wie es funktioniert

Slack Channels Grouping organisiert automatisch Ihre Slack-Seitenleiste, indem Kanäle mit dem gleichen Präfix gruppiert werden.

## Präfix-Erkennung

Die Erweiterung erkennt Präfixe, indem sie nach dem ersten `-` (Bindestrich) oder `_` (Unterstrich) im Kanalnamen sucht.

| Kanalname | Erkanntes Präfix |
|-----------|------------------|
| `dev-api` | `dev` |
| `dev-frontend` | `dev` |
| `project_backend` | `project` |
| `team-design-v2` | `team` |
| `general` | (kein Präfix) |

## Gruppierungsbeispiel

Kanäle mit dem gleichen Präfix werden visuell zusammen gruppiert:

**Vorher:**
```
# dev-api
# dev-frontend
# dev-backend
# sales-leads
# sales-reports
# general
```

**Nachher:**
```
# ┬ dev-api
# ├ dev-frontend
# └ dev-backend
# ┬ sales-leads
# └ sales-reports
# general
```

## Visuelle Indikatoren

Die Erweiterung verwendet Baum-Stil-Trennzeichen, um die Gruppierung anzuzeigen:

| Symbol | Bedeutung |
|--------|-----------|
| `┬` | Erster Kanal in einer Gruppe |
| `├` | Mittlerer Kanal in einer Gruppe |
| `└` | Letzter Kanal in einer Gruppe |

## Unterstützte Kanaltypen

| Kanaltyp | Gruppiert |
|----------|-----------|
| Öffentliche Kanäle | Ja |
| Private Kanäle | Ja |
| Direktnachrichten | Nein |
| Gruppen-DMs | Nein |

Direktnachrichten und Gruppen-DMs werden absichtlich von der Gruppierung ausgeschlossen, um Ihre Gespräche leicht zugänglich zu halten.

## Keine Konfiguration

Einfach die Erweiterung installieren und sie funktioniert automatisch. Keine Einrichtung oder Konfiguration erforderlich.
