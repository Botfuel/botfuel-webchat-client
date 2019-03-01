const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

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
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minification steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: true,
      }),
    ],
  },
};
