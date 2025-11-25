import { type DefaultTheme, defineConfig } from 'vitepress';

export const configZhTw = defineConfig({
  lang: 'zh-TW',
  description: '一個按前綴對 Slack 頻道進行分組的瀏覽器擴充功能',

  themeConfig: {
    nav: nav(),
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: '首頁', link: '/zh-tw/' },
    { text: '運作原理', link: '/zh-tw/how-it-works' },
    { text: '安裝', link: '/zh-tw/#install' },
    { text: '隱私權政策', link: '/zh-tw/privacy-policy' },
  ];
}
