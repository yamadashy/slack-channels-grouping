'use strict';

const path = require('path');
const GlobEntriesPlugin = require('webpack-watched-glob-entries-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { DefinePlugin } = require('webpack');

module.exports = {
  webpack: (config, { dev, vendor }) => {
    const envName = dev ? 'development' : 'production';

    // Support TypeScript
    config.resolve.extensions.push('.ts');
    config.entry = GlobEntriesPlugin.getEntries(
      [
        path.resolve('app', '*.{js,mjs,jsx,ts}'),
        path.resolve('app', '?(scripts)/*.{js,mjs,jsx,ts}')
      ]
    );

    // Loader
    config.module.rules.push({
      test: /\.ts$/,
      loader: 'babel-loader',
      options: {
        cacheDirectory: true
      }
    });

    // Definitions
    config.plugins.push(new DefinePlugin({
      IS_PRODUCTION_BUILD: !dev,
    }))

    // Runs typescript type checker on a separate process.
    config.plugins.push(new ForkTsCheckerWebpackPlugin({
      async: !!dev,
      eslint: {
        enable: !!dev,
        files: '**/*.ts',
        options: {
          extensions: ['ts'],
          cache: true,
        }
      },
      typescript: {
        enabled: true,
        configFile: path.resolve(__dirname, 'tsconfig.json'),
      },
    }));

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
