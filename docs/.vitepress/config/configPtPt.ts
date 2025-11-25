import { type DefaultTheme, defineConfig } from 'vitepress';

export const configPtPt = defineConfig({
  lang: 'pt-PT',
  description: 'Uma extensão de navegador que agrupa canais do Slack por prefixo',

  themeConfig: {
    nav: nav(),
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Início', link: '/pt-pt/' },
    { text: 'Como Funciona', link: '/pt-pt/how-it-works' },
    { text: 'Instalar', link: '/pt-pt/#install' },
    { text: 'Política de Privacidade', link: '/pt-pt/privacy-policy' },
  ];
}
