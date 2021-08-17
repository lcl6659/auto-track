module.exports = function (babel, options) {
  console.log('********************：babel插件开始执行*******************')
  const { types, template } = babel
  return {
    name: 'add-track-babel-plugin',
    visitor: {
      Identifier (path, state) {
        const { name } = path.node
        if (name.endsWith('_track')) {
          try {
            if (path.node.loc && path.node.loc.start) {
              const location = `---track: line ${path.node.loc.start.line}, column ${path.node.loc.start.column}, ${state.filename}---`;
              console.log(location)
              const parentNode = path.parent
              const functionNode = parentNode.value
              if (types.isFunctionExpression(functionNode)) {
                const body = functionNode.body
                if (types.isBlockStatement(body)) { // 有函数体就在开始插入埋点代码
                  const params = functionNode.params
                  var s = '{'
                  params.forEach(p => {
                    s = s + p.name + ':' + p.name + ','
                  })
                  s = s + 'baseTrackProps: this.baseTrackProps}'
                  const tName = `'${name}'`
                  const addCodeStr = `this.$track(${tName},${s})`
                  body.body.unshift(template.statement(addCodeStr)());
                }
              }
            }
          } catch (error) {
            console.error(error)
          }
        }
      }
    }
  }
}