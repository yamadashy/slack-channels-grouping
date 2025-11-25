# Cómo Funciona

Slack Channels Grouping organiza automáticamente tu barra lateral de Slack agrupando los canales que comparten el mismo prefijo.

## Detección de Prefijos

La extensión detecta los prefijos buscando el primer `-` (guion) o `_` (guion bajo) en el nombre del canal.

| Nombre del Canal | Prefijo Detectado |
|------------------|-------------------|
| `dev-api` | `dev` |
| `dev-frontend` | `dev` |
| `project_backend` | `project` |
| `team-design-v2` | `team` |
| `general` | (sin prefijo) |

## Ejemplo de Agrupación

Los canales con el mismo prefijo se agrupan visualmente juntos:

**Antes:**
```
# dev-api
# dev-frontend
# dev-backend
# sales-leads
# sales-reports
# general
```

**Después:**
```
# ┬ dev-api
# ├ dev-frontend
# └ dev-backend
# ┬ sales-leads
# └ sales-reports
# general
```

## Indicadores Visuales

La extensión usa separadores estilo árbol para mostrar la agrupación:

| Símbolo | Significado |
|---------|-------------|
| `┬` | Primer canal en un grupo |
| `├` | Canal medio en un grupo |
| `└` | Último canal en un grupo |

## Tipos de Canales Compatibles

| Tipo de Canal | Agrupado |
|---------------|----------|
| Canales públicos | Sí |
| Canales privados | Sí |
| Mensajes directos | No |
| DMs grupales | No |

Los mensajes directos y los DMs grupales se excluyen intencionalmente de la agrupación para mantener tus conversaciones fácilmente accesibles.

## Sin Configuración

Simplemente instala la extensión y funciona automáticamente. No se requiere configuración ni ajustes.
