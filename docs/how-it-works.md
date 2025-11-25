# How it Works

Slack Channels Grouping automatically organizes your Slack sidebar by grouping channels that share the same prefix.

## Prefix Detection

The extension detects prefixes by looking for the first `-` (dash) or `_` (underscore) in a channel name.

| Channel Name | Detected Prefix |
|--------------|-----------------|
| `dev-api` | `dev` |
| `dev-frontend` | `dev` |
| `project_backend` | `project` |
| `team-design-v2` | `team` |
| `general` | (no prefix) |

## Grouping Example

Channels with the same prefix are visually grouped together:

**Before:**
```
# dev-api
# dev-frontend
# dev-backend
# sales-leads
# sales-reports
# general
```

**After:**
```
# ┬ dev-api
# ├ dev-frontend
# └ dev-backend
# ┬ sales-leads
# └ sales-reports
# general
```

## Visual Indicators

The extension uses tree-style separators to show grouping:

| Symbol | Meaning |
|--------|---------|
| `┬` | First channel in a group |
| `├` | Middle channel in a group |
| `└` | Last channel in a group |

## Supported Channel Types

| Channel Type | Grouped |
|--------------|---------|
| Public channels | Yes |
| Private channels | Yes |
| Direct messages | No |
| Group DMs | No |

Direct messages and group DMs are intentionally excluded from grouping to keep your conversations easily accessible.

## Zero Configuration

Simply install the extension and it works automatically. No setup or configuration required.
