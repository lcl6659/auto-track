前端工程化-vue项目自动埋点

# 一、为什么做这个？
在项目中添加埋点，是数据分析的重要一环，每次项目的跌点，都会或多或少有些埋点的需求，那么，能不能通过自动化的形式，去添加这些埋点呢？

答案：针对大部分的埋点，可以自动化添加

# 二、是什么？
这是一个非常基础的功能插件，完成对methods下的函数，其函数名是以_track结尾的函数，添加一段埋点代码，举个例子：

```js
// vue源码
export default {
  data () {
    return {
      baseTrackProps: {
        appName: 'ardf'
      }
    }
  },
  methods: {
    getApp_track (param_01, params_02) {
      console.log(param_01, params_02, this.baseTrackProps)
    }
  }
}

```
以上这段代码，在打包之后，会在getApp_track这个函数内，添加一段这样的代码

```js
this.$track('getApp_track', {
    param_01: param_01,
    params_02: params_02,
    baseTrackProps: this.baseTrackProps
})
```

# 三、如何做到的呢？
编写一个babel插件，使用babel对AST（抽象语法树）的操作，找到对应的函数，在函数体内插入语句


# 四、项目设计
计划编写一个开发框架，可以最后可以发布到npm上，方便其他项目引入使用

```
auto-track
├─ .gitignore
├─ README.md
├─ babel.config.js
├─ lib
│  ├─ index.js
│  └─ index.js.map
├─ package.json
├─ rollup.config.js
├─ src
│  ├─ babelPlugins
│  │  └─ addTrack.js    // babel插件，负责想函数内，插入语句
│  ├─ index.js
│  ├─ lib
│  │  └─ util.js
│  └─ webpackPlugins
│     └─ removeBabelLoaderCache.js
└─ yarn.lock

```


> 由于webpack使用babel-loader会有缓存，导致babel插件不会每次都执行，所以要在运行之前，删除babel插件，所以用到了一个webpack插件，负责在webpack打包开始的时候，删掉babel-loader的缓存


核心代码：
#### index.js

```js
const addTrack = require('./babelPlugins/addTrack')
const RemoveBabelLoaderCache = require('./webpackPlugins/removeBabelLoaderCache')

module.exports = {
  addTrack: addTrack,
  removeBabelLoaderCache: RemoveBabelLoaderCache
}
```

#### removeBabelLoaderCache.js

```js
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
      
      // 删除babel-loader缓存
      util.removeDir(babelLoaderCachePath)
    })

    compiler.hooks.done.tap(pluginName, (stats) => {
      console.log('***** Webpack 构建结束！*****')
    })
  }
}

module.exports = RemoveBabelLoaderCache;

```

#### addTrack.js

```js
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
                if (types.isBlockStatement(body)) {
                  const params = functionNode.params
                  var s = '{'
                  params.forEach(p => {
                    s = s + p.name + ':' + p.name + ','
                  })
                  s = s + 'baseTrackProps: this.baseTrackProps}'
                  const tName = `'${name}'`
                  const addCodeStr = `this.$track(${tName},${s})`
                  
                  // 向函数内，插入埋点语句
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
```
> 编写解析AST语句的代码是，可以使用[astexplorer](https://astexplorer.net/#) 配合，在里面编写相似的代码，快速找到需要观察的AST节点类型



# 五、vue项目中如何使用？

### 第一步：在main.js中，添加埋点方法
demo代码

```
...

Vue.prototype.$track = (name, data={}) => {
  if (data.baseTrackProps) {
    const baseTrackProps = {
      ...data.baseTrackProps
    }
    delete data.baseTrackProps
    const params = {
      ...data,
      ...baseTrackProps
    }
    console.log(`****track：${name},${JSON.stringify(params)}******`)
  } else {
    delete data.baseTrackProps
    const params = {
      ...data
    }
    console.log(`****track：${name},${JSON.stringify(params)}******`)
  }
}

...

```

### 第二步：在vue.config.js中，配置使用webpack插件

```
const autoTrack = require('auto-track')

module.exports = {
  ...// 省略其他
  configureWebpack: (config) => {
    config.plugins.push(new autoTrack.removeBabelLoaderCache({
      basePath: __dirname
    }))
  }
  ...
}

```

### 第三步：在babel.config.js中，配置使用babel插件


```
const autoTrack = require('auto-track')

module.exports = {
  presets: [
    ...
  ],
  plugins: [
    ... // 其他插件
    autoTrack.addTrack
  ]
}

```

> 这样就可以啦，之后，在你需要添加埋点的函数上，将其名字后面加上_track，那么打包之后的代码中，就会自定加上埋点语句了
