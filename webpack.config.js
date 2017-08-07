const BabiliPlugin = require('babili-webpack-plugin');
const path = require('path');

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
            plugins: ['transform-react-jsx'],
            presets: [
              [
                'env',
                {
                  targets: {
                    browsers: '> 5%',
                  },
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
};
