# Como Funciona

O Slack Channels Grouping organiza automaticamente sua barra lateral do Slack agrupando canais que compartilham o mesmo prefixo.

## Detecção de Prefixo

A extensão detecta prefixos procurando pelo primeiro `-` (hífen) ou `_` (sublinhado) no nome do canal.

| Nome do Canal | Prefixo Detectado |
|---------------|-------------------|
| `dev-api` | `dev` |
| `dev-frontend` | `dev` |
| `project_backend` | `project` |
| `team-design-v2` | `team` |
| `general` | (sem prefixo) |

## Exemplo de Agrupamento

Canais com o mesmo prefixo são agrupados visualmente juntos:

**Antes:**
```
# dev-api
# dev-frontend
# dev-backend
# sales-leads
# sales-reports
# general
```

**Depois:**
```
# ┬ dev-api
# ├ dev-frontend
# └ dev-backend
# ┬ sales-leads
# └ sales-reports
# general
```

## Indicadores Visuais

A extensão usa separadores estilo árvore para mostrar o agrupamento:

| Símbolo | Significado |
|---------|-------------|
| `┬` | Primeiro canal em um grupo |
| `├` | Canal do meio em um grupo |
| `└` | Último canal em um grupo |

## Tipos de Canais Suportados

| Tipo de Canal | Agrupado |
|---------------|----------|
| Canais públicos | Sim |
| Canais privados | Sim |
| Mensagens diretas | Não |
| DMs em grupo | Não |

Mensagens diretas e DMs em grupo são intencionalmente excluídos do agrupamento para manter suas conversas facilmente acessíveis.

## Zero Configuração

Simplesmente instale a extensão e ela funciona automaticamente. Nenhuma configuração necessária.
