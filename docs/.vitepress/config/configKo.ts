import { type DefaultTheme, defineConfig } from 'vitepress';

export const configKo = defineConfig({
  lang: 'ko',
  description: 'Slack 채널을 접두사별로 그룹화하는 브라우저 확장 프로그램',

  themeConfig: {
    nav: nav(),
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: '홈', link: '/ko/' },
    { text: '작동 방식', link: '/ko/how-it-works' },
    { text: '설치', link: '/ko/#install' },
    { text: '개인정보 처리방침', link: '/ko/privacy-policy' },
  ];
}
