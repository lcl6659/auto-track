const util = require('../lib/util')

const pluginName = 'removeBabelLoaderCache'
class RemoveBabelLoaderCache {
  constructor({basePath}){
    // 传入的参数挂载在这个类的实例上.
    this.basePath = basePath
  }
  apply(compiler) {

    compiler.hooks.run.tap(pluginName, (compilation) => {
      console.log('***** Webpack 构建过程开始！*****');
      const babelLoaderCachePath = `${this.basePath}/node_modules/.cache/babel-loader`
      util.removeDir(babelLoaderCachePath)
    })

    compiler.hooks.done.tap(pluginName, (stats) => {
      console.log('***** Webpack 构建结束！*****')
    })
  }
}

module.exports = RemoveBabelLoaderCache;
