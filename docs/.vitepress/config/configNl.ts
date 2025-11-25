import { type DefaultTheme, defineConfig } from 'vitepress';

export const configNl = defineConfig({
  lang: 'nl',
  description: 'Een browserextensie die Slack-kanalen groepeert op prefix',

  themeConfig: {
    nav: nav(),
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Home', link: '/nl/' },
    { text: 'Hoe Het Werkt', link: '/nl/how-it-works' },
    { text: 'Installeren', link: '/nl/#install' },
    { text: 'Privacybeleid', link: '/nl/privacy-policy' },
  ];
}
