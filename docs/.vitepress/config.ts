import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Slack Channels Grouping',
  description: 'A browser extension that organizes Slack channels into visual groups based on prefixes',

  head: [
    ['link', { rel: 'icon', href: '/icon.png' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Slack Channels Grouping' }],
    ['meta', { property: 'og:description', content: 'A browser extension that organizes Slack channels into visual groups based on prefixes' }],
    ['meta', { property: 'og:image', content: 'https://slack-channels-grouping.com/screenshot.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  themeConfig: {
    logo: '/icon.png',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'How it Works', link: '/how-it-works' },
      { text: 'Install', link: '/#install' },
      { text: 'Privacy Policy', link: '/privacy-policy' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yamadashy/slack-channels-grouping' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © yamadashy'
    }
  }
})
