# <img src="app/images/icon-128.png" height=26> Slack Channels Grouping

Grouping slack channels.

![](./promo/Screenshot_1280x800.png)

[![Chrome Users](https://img.shields.io/chrome-web-store/users/lcbnhfianneihfgkmfncnhpkpghedbkm?logo=google-chrome&logoColor=white)](https://chrome.google.com/webstore/detail/slack-channels-grouping/lcbnhfianneihfgkmfncnhpkpghedbkm)   [![Firefox Users](https://img.shields.io/amo/users/slack-channels-grouping?logo=firefox&color=blightcreen)](https://addons.mozilla.org/firefox/addon/slack-channels-grouping/)   [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/lcbnhfianneihfgkmfncnhpkpghedbkm?logo=google-chrome&logoColor=white)](https://chrome.google.com/webstore/detail/slack-channels-grouping/lcbnhfianneihfgkmfncnhpkpghedbkm)   [![Mozilla Add-on](https://img.shields.io/amo/v/slack-channels-grouping?logo=firefox)](https://addons.mozilla.org/ja/firefox/addon/slack-channels-grouping/)


## Install

- Chrome: [Slack Channels Grouping - Chrome Web Store](https://chrome.google.com/webstore/detail/slack-channels-grouping/lcbnhfianneihfgkmfncnhpkpghedbkm)
- Firefox: [Slack Channels Grouping – Firefox Add-ons](https://addons.mozilla.org/firefox/addon/slack-channels-grouping/)
- Opera: [Slack Channels Grouping extension - Opera add-ons](https://addons.opera.com/extensions/details/slack-channels-grouping)
- Edge: [Slack Channels Grouping – Microsoft Edge Addons](https://microsoftedge.microsoft.com/addons/detail/klpmclmecincfgkoebkackfkmkafpgml)

## Supported Languages
- `de` German
- `el` Greek
- `en` English
- `es` Spanish
- `fr` French
- `it` Italian
- `ja` Japanese
- `ko` Korean
- `nl` Dutch
- `pt_BR` Portuguese - BRAZIL
- `pt_PT` Portuguese
- `ru` Russian
- `zh_CN` Chinese - Simplified
- `zh_TW` Chinese - Traditional

## Development
- Node.js >= v23.6.0

### Setup
```
$ yarn
```

### Watch and build
```
yarn dev chrome
yarn dev firefox
yarn dev opera
yarn dev edge
yarn dev safari
```

### Build extension
```
yarn build chrome
yarn build firefox
yarn build opera
yarn build edge
yarn build safari
```

### Lint codes
Lint
```
# eslint, tsc --noEmit
yarn lint
```

### Generate font file for Box-drawing character
```
pip install fonttools
```

```
cd ./tools/font-builder
. build.sh
```

### Show supported browsers
```
yarn supported-browsers
```

## LICENSE
MIT
