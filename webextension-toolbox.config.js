'use strict';

const path = require('path');
const GlobEntriesPlugin = require('webpack-watched-glob-entries-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { DefinePlugin } = require('webpack');

module.exports = {
  webpack: (config, { vendor }) => {
    // NOTE: This is a workaround for this issue.
    // @see https://github.com/webextension-toolbox/webextension-toolbox/issues/882
    const isDev = process.argv.includes('dev');
    const envName = isDev ? 'development' : 'production';

    // Definitions
    config.plugins.push(new DefinePlugin({
      IS_PRODUCTION_BUILD: !isDev,
    }))

    // BundleAnalyzer
    config.plugins.push(new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: 'static',
      reportFilename: __dirname + '/storage/bundle-analyzer/' + vendor + '-' + envName + '.html'
    }));

    return config
  },
  copyIgnore: [
    path.resolve('**/*.ts'),
  ]
};
