# 運作原理

Slack Channels Grouping 透過將具有相同前綴的頻道分組來自動整理您的 Slack 側邊欄。

## 前綴偵測

擴充功能透過查找頻道名稱中的第一個 `-`（連字號）或 `_`（底線）來偵測前綴。

| 頻道名稱 | 偵測到的前綴 |
|----------|--------------|
| `dev-api` | `dev` |
| `dev-frontend` | `dev` |
| `project_backend` | `project` |
| `team-design-v2` | `team` |
| `general` | （無前綴） |

## 分組範例

具有相同前綴的頻道會在視覺上分組在一起：

**使用前：**
```
# dev-api
# dev-frontend
# dev-backend
# sales-leads
# sales-reports
# general
```

**使用後：**
```
# ┬ dev-api
# ├ dev-frontend
# └ dev-backend
# ┬ sales-leads
# └ sales-reports
# general
```

## 視覺指示器

擴充功能使用樹狀分隔符號來顯示分組：

| 符號 | 含義 |
|------|------|
| `┬` | 群組中的第一個頻道 |
| `├` | 群組中的中間頻道 |
| `└` | 群組中的最後一個頻道 |

## 支援的頻道類型

| 頻道類型 | 是否分組 |
|----------|----------|
| 公開頻道 | 是 |
| 私人頻道 | 是 |
| 私訊 | 否 |
| 群組私訊 | 否 |

私訊和群組私訊被有意排除在分組之外，以保持您的對話易於存取。

## 零設定

只需安裝擴充功能，它就會自動運作。無需任何設定或配置。
