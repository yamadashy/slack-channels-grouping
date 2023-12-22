'use strict';

const path = require('path');
const GlobEntriesPlugin = require('webpack-watched-glob-entries-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { DefinePlugin } = require('webpack');

module.exports = {
  webpack: (config, { dev, vendor }) => {
    const envName = dev ? 'development' : 'production';

    // Definitions
    config.plugins.push(new DefinePlugin({
      IS_PRODUCTION_BUILD: !dev,
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
