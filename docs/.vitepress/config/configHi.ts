import { type DefaultTheme, defineConfig } from 'vitepress';

export const configHi = defineConfig({
  lang: 'hi',
  description: 'एक ब्राउज़र एक्सटेंशन जो Slack चैनलों को प्रीफिक्स के अनुसार समूहित करता है',

  themeConfig: {
    nav: nav(),
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'होम', link: '/hi/' },
    { text: 'यह कैसे काम करता है', link: '/hi/how-it-works' },
    { text: 'इंस्टॉल', link: '/hi/#install' },
    { text: 'गोपनीयता नीति', link: '/hi/privacy-policy' },
  ];
}
