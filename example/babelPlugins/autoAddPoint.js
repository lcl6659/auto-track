'use strict';

var fs = require('fs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

var addTrack = function addTrack(babel, options) {
  console.log('********************：babel插件开始执行*******************');
  var types = babel.types,
      template = babel.template;
  return {
    name: 'custom-babel-plugin',
    visitor: {
      Identifier: function Identifier(path, state) {
        var name = path.node.name;

        if (name.endsWith('_track')) {
          try {
            if (path.node.loc && path.node.loc.start) {
              var location = "---track: line ".concat(path.node.loc.start.line, ", column ").concat(path.node.loc.start.column, ", ").concat(state.filename, "---");
              console.log(location);
              var parentNode = path.parent;
              var functionNode = parentNode.value;

              if (types.isFunctionExpression(functionNode)) {
                var body = functionNode.body;

                if (types.isBlockStatement(body)) {
                  // 有函数体就在开始插入埋点代码
                  var params = functionNode.params;
                  var s = '{';
                  params.forEach(function (p) {
                    s = s + p.name + ':' + p.name + ',';
                  });
                  s = s + 'baseTrackProps: this.baseTrackProps}';
                  var tName = "'".concat(name, "'");
                  var addCodeStr = "this.$track(".concat(tName, ",").concat(s, ")");
                  body.body.unshift(template.statement(addCodeStr)());
                }
              }
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  };
};

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function removeDir(path) {
  try {
    if (fs__default['default'].existsSync(path)) {
      fs__default['default'].accessSync(path);
      var files = fs__default['default'].readdirSync(path);
      files.forEach(function (file, index) {
        var curPath = path + "/" + file;

        if (fs__default['default'].statSync(curPath).isDirectory()) {
          // recurse
          removeDir(curPath);
        } else {
          // delete file
          fs__default['default'].unlinkSync(curPath, function (err) {
            if (err) throw err;
          });
        }
      });
      fs__default['default'].rmdirSync(path);
    }
  } catch (error) {
    console.log(error);
  }
}

var util = {
  removeDir: removeDir
};

var pluginName = 'removeBabelLoaderCache';

var RemoveBabelLoaderCache = /*#__PURE__*/function () {
  function RemoveBabelLoaderCache(_ref) {
    var basePath = _ref.basePath;

    _classCallCheck(this, RemoveBabelLoaderCache);

    // 传入的参数挂载在这个类的实例上.
    this.basePath = basePath;
  }

  _createClass(RemoveBabelLoaderCache, [{
    key: "apply",
    value: function apply(compiler) {
      var _this = this;

      compiler.hooks.run.tap(pluginName, function (compilation) {
        console.log('***** Webpack 构建过程开始！*****');
        var babelLoaderCachePath = "".concat(_this.basePath, "/node_modules/.cache/babel-loader");
        util.removeDir(babelLoaderCachePath);
      });
      compiler.hooks.done.tap(pluginName, function (stats) {
        console.log('***** Webpack 构建结束！*****');
      });
    }
  }]);

  return RemoveBabelLoaderCache;
}();

var removeBabelLoaderCache = RemoveBabelLoaderCache;

var src = {
  addTrack: addTrack,
  removeBabelLoaderCache: removeBabelLoaderCache
};

module.exports = src;
//# sourceMappingURL=autoAddPoint.js.map
