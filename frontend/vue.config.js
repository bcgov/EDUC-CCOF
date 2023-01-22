//const path = require('path');
module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /config.*config\.js$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '/js/config/config.js'
              },
            }

          ]
        }
      ]
    },
    performance: {
      hints: false
    },
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000
      }
    }
  },
  devServer: {
    port:8082,
    proxy: {
      ...['/api'].reduce(
        (acc, ctx) => ({
          ...acc,
          [ctx]: {
            target: 'http://localhost:8080',
            changeOrigin: true,
            ws: false
          }
        }),
        {}
      ),
    }
  },
  transpileDependencies: ['vuetify'],
  publicPath: '/'
};
