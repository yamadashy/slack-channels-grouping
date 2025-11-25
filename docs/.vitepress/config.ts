import { defineConfig } from 'vitepress';
import { configDe } from './config/configDe';
import { configEl } from './config/configEl';
import { configEn } from './config/configEn';
import { configEs } from './config/configEs';
import { configFr } from './config/configFr';
import { configHi } from './config/configHi';
import { configIt } from './config/configIt';
import { configJa } from './config/configJa';
import { configKo } from './config/configKo';
import { configNl } from './config/configNl';
import { configPtBr } from './config/configPtBr';
import { configPtPt } from './config/configPtPt';
import { configRu } from './config/configRu';
import { configShard } from './config/configShard';
import { configZhCn } from './config/configZhCn';
import { configZhTw } from './config/configZhTw';

export default defineConfig({
  ...configShard,
  locales: {
    root: { label: 'English', ...configEn },
    de: { label: 'Deutsch', ...configDe },
    el: { label: 'Ελληνικά', ...configEl },
    es: { label: 'Español', ...configEs },
    fr: { label: 'Français', ...configFr },
    hi: { label: 'हिन्दी', ...configHi },
    it: { label: 'Italiano', ...configIt },
    ja: { label: '日本語', ...configJa },
    ko: { label: '한국어', ...configKo },
    nl: { label: 'Nederlands', ...configNl },
    'pt-br': { label: 'Português (Brasil)', ...configPtBr },
    'pt-pt': { label: 'Português (Portugal)', ...configPtPt },
    ru: { label: 'Русский', ...configRu },
    'zh-cn': { label: '简体中文', ...configZhCn },
    'zh-tw': { label: '繁體中文', ...configZhTw },
  },
});
