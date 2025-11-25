import { type DefaultTheme, defineConfig } from 'vitepress';

export const configEl = defineConfig({
  lang: 'el',
  description: 'Μια επέκταση προγράμματος περιήγησης που ομαδοποιεί τα κανάλια Slack με πρόθεμα',

  themeConfig: {
    nav: nav(),
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Αρχική', link: '/el/' },
    { text: 'Πώς Λειτουργεί', link: '/el/how-it-works' },
    { text: 'Εγκατάσταση', link: '/el/#install' },
    { text: 'Πολιτική Απορρήτου', link: '/el/privacy-policy' },
  ];
}
