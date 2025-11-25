import { type DefaultTheme, defineConfig } from 'vitepress';

export const configIt = defineConfig({
  lang: 'it',
  description: "Un'estensione del browser che raggruppa i canali Slack per prefisso",

  themeConfig: {
    nav: nav(),
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Home', link: '/it/' },
    { text: 'Come Funziona', link: '/it/how-it-works' },
    { text: 'Installa', link: '/it/#install' },
    { text: 'Informativa sulla Privacy', link: '/it/privacy-policy' },
  ];
}
