
const addTrack = require('./babelPlugins/addTrack')
const RemoveBabelLoaderCache = require('./webpackPlugins/removeBabelLoaderCache')

module.exports = {
  addTrack: addTrack,
  removeBabelLoaderCache: RemoveBabelLoaderCache
}