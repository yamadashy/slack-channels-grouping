import { type DefaultTheme, defineConfig } from 'vitepress';

export const configRu = defineConfig({
  lang: 'ru',
  description: 'Расширение браузера, которое группирует каналы Slack по префиксу',

  themeConfig: {
    nav: nav(),
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: 'Главная', link: '/ru/' },
    { text: 'Как это работает', link: '/ru/how-it-works' },
    { text: 'Установить', link: '/ru/#install' },
    { text: 'Политика конфиденциальности', link: '/ru/privacy-policy' },
  ];
}
