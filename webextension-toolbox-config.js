const path = require('path');
const GlobEntriesPlugin = require('webpack-watched-glob-entries-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  webpack: (config, { dev, vendor }) => {
    const envName = dev ? 'development' : 'production';
    config.resolve.extensions.push('.ts');
    config.entry = GlobEntriesPlugin.getEntries(
      [
        path.resolve('app', '*.{js,mjs,jsx,ts}'),
        path.resolve('app', '?(scripts)/*.{js,mjs,jsx,ts}')
      ]
    );
    config.module.rules.push({
      test: /\.ts$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            envName: envName
          }
        }
      ],
    });
    config.plugins.push(new BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: 'static',
      reportFilename: __dirname + '/storage/bundle-analyzer/' + vendor + '-' + envName + '.html'
    }));
    config.optimization.splitChunks = {
        name: 'scripts/vendor',
        chunks: 'initial',
    };
    config.output.chunkFilename = '[name].js';

    return config
  },
  copyIgnore: [ '**/*.ts' ]
};
