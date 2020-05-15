'use strict';

const path = require('path');
const GlobEntriesPlugin = require('webpack-watched-glob-entries-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

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
      loader: 'babel-loader?cacheDirectory',
    });

    // Runs typescript type checker on a separate process.
    config.plugins.push(new ForkTsCheckerWebpackPlugin({
      checkSyntacticErrors: true,
      eslint: true,
      tsconfig: path.resolve(__dirname, 'tsconfig.json')
    }));

    // BundleAnalyzer
    config.plugins.push(new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: 'static',
      reportFilename: __dirname + '/storage/bundle-analyzer/' + vendor + '-' + envName + '.html'
    }));

    return config
  },
  copyIgnore: [ '**/*.ts' ]
};
