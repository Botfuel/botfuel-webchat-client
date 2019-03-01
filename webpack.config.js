const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: [
    // 'react-hot-loader/patch',
    // `webpack-dev-server/client?http://localhost:${process.env.PORT || 7000}`,
    // 'webpack/hot/only-dev-server',
    // 'babel-regenerator-runtime',
    './src/App.jsx',
  ],

  externals: [
    {
      BotfuelWeb: true,
    },
  ],

  output: {
    filename: 'build/bundle.js',
    chunkFilename: 'build/[name].chunk.js',
  },

  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules\/(?!react-voice-components)|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    ie: 9,
                  },
                  useBuiltIns: 'entry',
                },
              ],
            ],
            plugins: [
              'module:babel-root-import',
              'react-hot-loader/babel',
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-transform-async-to-generator',
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-transform-react-jsx',
              '@babel/plugin-transform-runtime',
            ],
            comments: false,
          },
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {},
          },
        ],
      },
      {
        test: /\.(mp3|wav)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
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
          process.env.SERVER_ENDPOINT_WEBSOCKET || 'ws://localhost:7001/graphql',
        ),
      },
    }),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),

    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: true,
    }),
  ],

  devServer: {
    port: process.env.PORT || 7000,
    hot: true,
    historyApiFallback: true,
    stats: {
      colors: true,
      cached: false,
      cachedAssets: false,
    },
  },
};
