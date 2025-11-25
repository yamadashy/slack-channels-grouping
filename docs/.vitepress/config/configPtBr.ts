import { type DefaultTheme, defineConfig } from 'vitepress';

export const configPtBr = defineConfig({
  lang: 'pt-BR',
  description: 'Uma extensão de navegador que agrupa canais do Slack por prefixo',

  themeConfig: {
    nav: nav(),
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Início', link: '/pt-br/' },
    { text: 'Como Funciona', link: '/pt-br/how-it-works' },
    { text: 'Instalar', link: '/pt-br/#install' },
    { text: 'Política de Privacidade', link: '/pt-br/privacy-policy' },
  ];
}
