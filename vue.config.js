const webpack = require('webpack');

module.exports = {
  transpileDependencies: [],
  configureWebpack: {
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ],
  },
  chainWebpack:
    (config) => {
      config.optimization.delete('splitChunks');
    },
};
