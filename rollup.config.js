import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'

const exportSdknName = 'autoAddPoint' // 全局变量名称

module.exports = [
  {
    input: 'src/index.js',
    output: {
      file: `lib/index.js`,
      format: "cjs",
      sourcemap: true,
      name: exportSdknName // 全局变量名称
    },
    plugins: [
      resolve(), 
      commonjs(),
      json(),
      babel({ babelHelpers: 'bundled' })
    ],
    external: ['fs']
  },
  {
    input: 'src/index.js',
    output: {
      file: `example/babelPlugins/autoAddPoint.js`,
      format: "cjs",
      sourcemap: true,
      name: exportSdknName // 全局变量名称
    },
    plugins: [
      resolve(), 
      commonjs(),
      json(),
      babel({ babelHelpers: 'bundled' })
    ],
    external: ['fs']
  }
]