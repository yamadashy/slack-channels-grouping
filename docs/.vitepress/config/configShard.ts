import { defineConfig } from 'vitepress';

const googleAnalyticsTag = 'G-XX03LFC5SQ';

export const configShard = defineConfig({
  title: 'Slack Channels Grouping',

  rewrites: {
    'en/:rest*': ':rest*',
  },

  cleanUrls: true,
  metaChunk: true,

  sitemap: {
    hostname: 'https://slack-channels-grouping.com/',
  },

  themeConfig: {
    logo: '/icon.png',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yamadashy/slack-channels-grouping' },
      { icon: 'x', link: 'https://x.com/yamadashy' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Kazuki Yamada',
    },
    langMenuLabel: 'Languages',
  },

  head: [
    ['link', { rel: 'icon', href: '/icon.png' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Slack Channels Grouping' }],
    ['meta', { property: 'og:description', content: 'A browser extension that organizes Slack channels into visual groups based on prefixes' }],
    ['meta', { property: 'og:image', content: 'https://slack-channels-grouping.com/screenshot.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    // Google Analytics
    [
      'script',
      {
        async: 'true',
        src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsTag}`,
      },
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${googleAnalyticsTag}');`,
    ],
  ],
});
