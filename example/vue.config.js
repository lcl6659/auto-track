const autoAddPoint = require('./babelPlugins/autoAddPoint')
module.exports = {
  configureWebpack: (config) => {
    config.plugins.push(new autoAddPoint.removeBabelLoaderCache({
      basePath: __dirname
    }))
  }
}
