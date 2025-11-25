import { type DefaultTheme, defineConfig } from 'vitepress';

export const configEn = defineConfig({
  lang: 'en-US',
  description: 'A browser extension that organizes Slack channels into visual groups based on prefixes',

  themeConfig: {
    nav: nav(),
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Home', link: '/' },
    { text: 'How it Works', link: '/how-it-works' },
    { text: 'Install', link: '/#install' },
    { text: 'Privacy Policy', link: '/privacy-policy' },
  ];
}
