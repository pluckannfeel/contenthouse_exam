/* eslint-disable no-param-reassign */
const CracoAlias = require('craco-alias')

module.exports = {
  babel: {
    loaderOptions: {
      cacheDirectory: true,
      cacheCompression: false,
    },
  },
  eslint: {
    enable: false,
  },
  webpack: {
    configure: (webpackConfig) => {
      // remove CaseSensitivePathsPlugin (replace with tsconfig setting or eslint setting)
      webpackConfig.plugins = webpackConfig.plugins.filter(
        plugin => plugin.constructor.name !== 'CaseSensitivePathsPlugin',
      )

      // remove IgnorePlugin
      webpackConfig.plugins = webpackConfig.plugins.filter(plugin => plugin.constructor.name !== 'IgnorePlugin')

      return webpackConfig
    },
  },
  typescript: {
    enableTypeChecking: false,
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'jsconfig',
        baseUrl: './src',
      },
    },
  ],
  style: {
    css: {
      loaderOptions: {
        modules: {
          auto: true,
          exportLocalsConvention: 'camelCase',
        },
      },
    },
  },
}
