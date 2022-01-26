const Service = require('egg').Service;
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const pump = require('mz-modules/pump');
const { sendDateTime } = require('../utils/common')

const uploadBasePath = '/public/uploads'

class FileService extends Service {
  // 单文件上传
  async create() {
    const { ctx } = this
    try {
      const userName = ctx.state.user.userName
      // 生成对应月份文件夹名称
      const folderName = sendDateTime(new Date(), 'yyyyMM')
      const filePath = path.join(`app${uploadBasePath}/`, userName, folderName)
      this._mkdirsSync(filePath);

      const stream = await ctx.getFileStream()
      const filename = +new Date() + path.extname(stream.filename).toLowerCase()
      const target = path.join(this.config.baseDir, filePath, filename)
      const writeStream = fs.createWriteStream(target)
      await pump(stream, writeStream)
      const result = { url: `${uploadBasePath}/${userName}/${folderName}/${filename}` }
      return result
    } catch (error) {
      return error
    }
  }

  // 文件分片
  async slice() {
    const { ctx } = this
    try {
      // 读取文件流，前端发送格式应为formData数据。
      const stream = await ctx.getFileStream()
      const { hash } = stream.fields
      const userName = ctx.state.user.userName
      // 生成对应文件hash值文件夹名称
      const folderName = 'bigfile'
      const filePath = path.join(`app${uploadBasePath}/`, userName, folderName, hash)
      this._mkdirsSync(filePath);

      const filename = stream.filename
      const target = path.join(this.config.baseDir, filePath, filename)
      const writeStream = fs.createWriteStream(target)
      await pump(stream, writeStream)
      let result = { status: 200, data: { filename, hash } }

      return result
    } catch (error) {
      return error
    }
  }

  // 合并切片
  async merge (chunks, hash) {
    const { ctx } = this
    try {
      const size = 1024 * 1024
      const userName = ctx.state.user.userName
      const folderName = 'bigfile'
      const fileDir = path.join(`app${uploadBasePath}/`, userName, folderName, hash)
      // 根据文件hash获取对应文件切片
      const chunkPaths = await fse.readdir(fileDir);
      // 对切片进行排序，保证拼接顺序正确
      chunkPaths.sort((a, b) => a.split('_')[1].split('.')[0] - b.split('_')[1].split('.')[0]);
      if (chunks != chunkPaths.length) {
        ctx.body = { status: 0, data: { result: '文件上传不完整，合并文件失败！' } }
        return
      }
      // 获取文件后缀
      const ext = chunkPaths[0].split('.')[1]
      const filePath = `${fileDir}.${ext}`
      // chunkPaths.splice(0, 1)
      // chunkPaths.sort((a, b) => a.slice(-1) - b.slice(-1));

      // 顺序写入文件内容
      await Promise.all(
        chunkPaths.map((chunkPath, index) => {
          return this._pipeStream(
            path.resolve(fileDir, chunkPath),
            // 指定位置创建可写流
            fse.createWriteStream(filePath, {
              start: index * size,
              end: (index + 1) * size
            })
          )
        })
      );
      fse.rmdirSync(fileDir); // 合并后删除保存切片的目录
      const result = { status: 200, data: { url: filePath.slice(3) } }

      return result
    } catch (error) {
      return error
    }
  }

  // 生成对应用户存放大文件文件夹
  _mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (this._mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
  }

  _pipeStream = (path, writeStream) => new Promise(resolve => {
    const readStream = fse.createReadStream(path);
    readStream.on("end", () => {
      fse.unlinkSync(path);
      resolve();
    });
    readStream.pipe(writeStream);
  });
}

module.exports = FileService