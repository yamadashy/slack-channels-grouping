import { type DefaultTheme, defineConfig } from 'vitepress';

export const configEs = defineConfig({
  lang: 'es',
  description: 'Una extensión de navegador que agrupa los canales de Slack por prefijo',

  themeConfig: {
    nav: nav(),
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Inicio', link: '/es/' },
    { text: 'Cómo Funciona', link: '/es/how-it-works' },
    { text: 'Instalar', link: '/es/#install' },
    { text: 'Política de Privacidad', link: '/es/privacy-policy' },
  ];
}
