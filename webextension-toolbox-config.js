const path = require('path')
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
    config.module.rules.push({
      test: /\.js$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            babelrc: true,
            extends: path.join(__dirname + '/.babelrc'),
            exclude: /node_modules/,
            cacheDirectory: true,
            envName: dev ? 'development' : 'production'
          }
        }
      ]
    })

    return config
  },
  copyIgnore: [ '**/*.ts' ]
}
