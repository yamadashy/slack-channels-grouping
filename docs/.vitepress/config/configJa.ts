import { type DefaultTheme, defineConfig } from 'vitepress';

export const configJa = defineConfig({
  lang: 'ja',
  description: 'Slackのチャンネルをプレフィックスでグループ化するブラウザ拡張機能',

  themeConfig: {
    nav: nav(),
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'ホーム', link: '/ja/' },
    { text: '仕組み', link: '/ja/how-it-works' },
    { text: 'インストール', link: '/ja/#install' },
    { text: 'プライバシーポリシー', link: '/ja/privacy-policy' },
  ];
}
