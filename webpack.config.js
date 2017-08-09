const path = require('path');
// const BabiliPlugin = require('babili-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/App.jsx',
  externals: [
    {
      BotfuelWeb: true,
    },
  ],
  // plugins: [new BabiliPlugin()],
  output: {
    path: path.join(__dirname, './build'),
    filename: 'script.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              'transform-object-rest-spread',
              'transform-react-jsx',
              'react-hot-loader/babel',
              'transform-runtime',
            ],
            presets: [
              [
                'env',
                {
                  targets: {
                    ie: 9,
                  },
                  useBuiltIns: true,
                },
              ],
            ],
            comments: false,
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      ROOT: path.join(process.cwd()),
      react: path.join(process.cwd(), 'node_modules', 'react'),
    },
    modules: ['node_modules'],
    extensions: ['.js', '.jsx'],
  },

  devtool: 'eval-cheap-module-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        SERVER_ENDPOINT: JSON.stringify(
          process.env.SERVER_ENDPOINT || 'http://localhost:7001/graphql',
        ),
        SERVER_ENDPOINT_WEBSOCKET: JSON.stringify(
          process.env.SERVER_ENDPOINT_WEBSOCKET || 'ws://localhost:7002/graphql',
        ),
      },
    }),
  ],
};
