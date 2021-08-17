const autoAddPoint = require('./babelPlugins/autoAddPoint')

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [autoAddPoint.addTrack, {
      basePath: __dirname
    }]
  ]
}
