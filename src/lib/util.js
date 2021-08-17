const fs = require('fs')

// 删除目录
function removeDir (path) {
  try {
    if (fs.existsSync(path)) {
      fs.accessSync(path)
      var files = fs.readdirSync(path);
      files.forEach(function (file, index) {
        var curPath = path +"/" + file;
        if (fs.statSync(curPath).isDirectory()) {// recurse
          removeDir(curPath)
        }else {// delete file
          fs.unlinkSync(curPath,function (err) {
            if (err)throw err
          })
        }
      })
      fs.rmdirSync(path)
    }
  } catch (error) {
    console.log(error)
  }
}


module.exports = {
  removeDir: removeDir
}

