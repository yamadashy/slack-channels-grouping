# Infinity loop caused on 1.0.15.
Plese wait a moment for version up.
Currently under review,

# Slack Channels Grouping

Grouping slack channels.

![](./promo/Screenshot_1280x800.png)


## Install

- Chrome: [Slack Channels Grouping - Chrome Web Store](https://chrome.google.com/webstore/detail/slack-channels-grouping/lcbnhfianneihfgkmfncnhpkpghedbkm)
- Firefox: [Slack Channels Grouping – Firefox Add-ons](https://addons.mozilla.org/ja/firefox/addon/slack-channels-grouping/)

# Development
- Node.js v10.16.0

## Setup
```
$ yarn
```

## Watch and build
```
yarn dev chrome
yarn dev firefox
yarn dev opera
yarn dev edge
```

## Build extension
```
yarn build chrome
yarn build firefox
yarn build opera
yarn build edge
```

## Lint codes
Lint only.
```
yarn lint
```

Lint codes with fix.
```
yarn lint:fix
```

## Environment
The build tool also defines a variable named `process.env.NODE_ENV` in your scripts.

## Docs
* [webextension-toolbox](https://github.com/HaNdTriX/webextension-toolbox)
