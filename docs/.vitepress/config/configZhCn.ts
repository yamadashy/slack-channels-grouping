import { type DefaultTheme, defineConfig } from 'vitepress';

export const configZhCn = defineConfig({
  lang: 'zh-CN',
  description: '一个按前缀对 Slack 频道进行分组的浏览器扩展',

  themeConfig: {
    nav: nav(),
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: '首页', link: '/zh-cn/' },
    { text: '工作原理', link: '/zh-cn/how-it-works' },
    { text: '安装', link: '/zh-cn/#install' },
    { text: '隐私政策', link: '/zh-cn/privacy-policy' },
  ];
}
