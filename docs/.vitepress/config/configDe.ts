import { type DefaultTheme, defineConfig } from 'vitepress';

export const configDe = defineConfig({
  lang: 'de',
  description: 'Eine Browser-Erweiterung, die Slack-Kanäle nach Präfix gruppiert',

  themeConfig: {
    nav: nav(),
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Startseite', link: '/de/' },
    { text: 'Wie es funktioniert', link: '/de/how-it-works' },
    { text: 'Installieren', link: '/de/#install' },
    { text: 'Datenschutzrichtlinie', link: '/de/privacy-policy' },
  ];
}
