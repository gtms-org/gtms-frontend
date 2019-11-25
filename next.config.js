const path = require('path')
const withSass = require('@zeit/next-sass')

module.exports = withSass({
  cssModules: true,
  webpack(config, options) {
    config.resolve.alias['providers'] = path.join(__dirname, 'providers')
    config.resolve.alias['api'] = path.join(__dirname, 'api')
    config.resolve.alias['helpers'] = path.join(__dirname, 'helpers')
    config.resolve.alias['state'] = path.join(__dirname, 'state')
    config.resolve.alias['i18n'] = path.join(__dirname, 'i18n')
    return config
  },
})
