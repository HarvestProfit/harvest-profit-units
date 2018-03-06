const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

/**
 * This is our webpack config for the final built product.
 * It pumps out a dist/index.js file that is ready for web-based use.
 */
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    library: 'HarvestProfitUnits',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    path: path.resolve(__dirname, 'dist'),
  },
  /* We use uglifyjs to compile/minify our bundle from this project */
  plugins: [
    new UglifyJSPlugin({
      parallel: true,
      sourceMap: true,
    }),
  ],
  /* We use both math.js and lodash, but have them externally */
  externals: {
    lodash: 'lodash',
    mathjs: 'mathjs',
  },
  devtool: 'source-map',
  /* We use babel-loader to replicate the .babelrc file in webpack */
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              'airbnb',
              'stage-2',
            ],
          },
        },
      },
    ],
  },
};
