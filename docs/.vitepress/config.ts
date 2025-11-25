import { defineConfig } from 'vitepress';
import { configEn } from './config/configEn';
import { configJa } from './config/configJa';
import { configShard } from './config/configShard';

export default defineConfig({
  ...configShard,
  locales: {
    root: { label: 'English', ...configEn },
    ja: { label: '日本語', ...configJa },
  },
});
