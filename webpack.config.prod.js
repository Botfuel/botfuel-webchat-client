const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/App.jsx',
  externals: [
    {
      BotfuelWeb: true,
    },
  ],
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'botfuel-webchat-client.js',
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
            plugins: [
              'transform-object-rest-spread',
              'transform-react-jsx',
              'transform-runtime',
              'transform-class-properties',
              'babel-root-import',
              'transform-async-to-generator',
              'syntax-async-functions',
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

  devtool: 'inline-cheap-module-source-map',

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        SERVER_ENDPOINT: JSON.stringify(
          process.env.SERVER_ENDPOINT || 'http://localhost:7001/graphql',
        ),
        SERVER_ENDPOINT_WEBSOCKET: JSON.stringify(
          process.env.SERVER_ENDPOINT_WEBSOCKET || 'ws://localhost:7001/graphql',
        ),
      },
    }),
  ],

  optimization: {
    nodeEnv: 'production',
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        cache: true,
        parallel: true,
        uglifyOptions: {
          ecma: 8,
        },
      }),
    ],
  },
};
