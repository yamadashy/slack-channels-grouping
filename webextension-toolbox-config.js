const path = require('path')
const webpack = require('webpack')
const GlobEntriesPlugin = require('webpack-watched-glob-entries-plugin')

module.exports = {
  webpack: (config, { dev, vendor }) => {
    config.resolve.extensions.push('.ts')
    config.entry = GlobEntriesPlugin.getEntries(
      [
        path.resolve('app', '*.{js,mjs,jsx,ts}'),
        path.resolve('app', '?(scripts)/*.{js,mjs,jsx,ts}')
      ]
    )
    config.module.rules.push({
      test: /\.ts$/,
      loader: 'ts-loader'
    })

    return config
  },
  copyIgnore: [ '**/*.ts' ]
}
