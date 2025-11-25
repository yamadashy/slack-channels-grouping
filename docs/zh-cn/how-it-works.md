# 工作原理

Slack Channels Grouping 通过将具有相同前缀的频道分组来自动整理您的 Slack 侧边栏。

## 前缀检测

扩展通过查找频道名称中的第一个 `-`（连字符）或 `_`（下划线）来检测前缀。

| 频道名称 | 检测到的前缀 |
|----------|--------------|
| `dev-api` | `dev` |
| `dev-frontend` | `dev` |
| `project_backend` | `project` |
| `team-design-v2` | `team` |
| `general` | （无前缀） |

## 分组示例

具有相同前缀的频道会在视觉上分组在一起：

**使用前：**
```
# dev-api
# dev-frontend
# dev-backend
# sales-leads
# sales-reports
# general
```

**使用后：**
```
# ┬ dev-api
# ├ dev-frontend
# └ dev-backend
# ┬ sales-leads
# └ sales-reports
# general
```

## 视觉指示器

扩展使用树形分隔符来显示分组：

| 符号 | 含义 |
|------|------|
| `┬` | 组中的第一个频道 |
| `├` | 组中的中间频道 |
| `└` | 组中的最后一个频道 |

## 支持的频道类型

| 频道类型 | 是否分组 |
|----------|----------|
| 公共频道 | 是 |
| 私人频道 | 是 |
| 私信 | 否 |
| 群组私信 | 否 |

私信和群组私信被有意排除在分组之外，以保持您的对话易于访问。

## 零配置

只需安装扩展，它就会自动工作。无需任何设置或配置。
