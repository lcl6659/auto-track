/**
 * 用于生成日志文件
*/

const fs = require('fs')
const logFilePath = '/codeScannerLog/log.js'
const logFileDirPath = '/codeScannerLog'

function createDir (basePath) {
  //检查某个目录是否存在
  try {
    fs.accessSync(basePath + logFileDirPath)
    console.log('目录已存在')
  } catch (error) {
    fs.mkdirSync(basePath + logFileDirPath)
    console.log('创建目录成功')
  }
}

function objWriteToJsFile (log, basePath, filename) {
  try {
    let cache = []; 
    // 处理log序列化时，TypeError: Converting circular structure to JSON
    function stringifyCircularHandler(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return
            }
            // Store value in our collection
            cache.push(value)
        }
        return value
    }
    var txt = JSON.stringify(log, stringifyCircularHandler)
    if (!filename) {
      fs.writeFileSync(basePath + logFilePath, 'var obj = ' + txt)
    } else {
      fs.writeFileSync(`${basePath}${logFileDirPath}/${filename}`, 'var obj = ' + txt)
    }
  } catch (err) {
    console.error(err)
  }
}

function stringWriteToJsFile (str, basePath, filename) {
  try {
    if (!filename) {
      fs.writeFileSync(basePath + logFilePath, 'var obj = ' + str)
    } else {
      fs.writeFileSync(`${basePath}${logFileDirPath}/${filename}`, 'var obj = ' + str)
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  createDir,
  objWriteToJsFile,
  stringWriteToJsFile
}
