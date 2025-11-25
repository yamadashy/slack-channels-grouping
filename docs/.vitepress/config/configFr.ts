import { type DefaultTheme, defineConfig } from 'vitepress';

export const configFr = defineConfig({
  lang: 'fr',
  description: 'Une extension de navigateur qui regroupe les canaux Slack par préfixe',

  themeConfig: {
    nav: nav(),
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Accueil', link: '/fr/' },
    { text: 'Comment ça Fonctionne', link: '/fr/how-it-works' },
    { text: 'Installer', link: '/fr/#install' },
    { text: 'Politique de Confidentialité', link: '/fr/privacy-policy' },
  ];
}
