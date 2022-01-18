const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const Controller = require('egg').Controller;
const pump = require('mz-modules/pump');
const { sendDateTime } = require('../utils/common')

const uploadBasePath = '/public/uploads'

/**
 * @controller file 文件上传
 */
class FileController extends Controller {

  /**
   * @summary 文件上传
   * @description 文件上传
   * @router post /api/v1/file
   * @request header string *Authorization token
   * @response 200 uploadFileResponse
   */
  async create() {
    const { ctx } = this
    try {
      // 生成对应用户图片存放文件
      function mkdirsSync(dirname) {
        if (fs.existsSync(dirname)) {
          return true;
        } else {
          if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
          }
        }
      }
      const userName = ctx.state.user.userName
      // 生成对应月份文件夹名称
      const folderName = sendDateTime(new Date(), 'yyyyMM')
      const filePath = path.join(`app${uploadBasePath}/`, userName, folderName)
      mkdirsSync(filePath);

      const stream = await ctx.getFileStream()
      const filename = +new Date() + path.extname(stream.filename).toLowerCase()
      const target = path.join(this.config.baseDir, filePath, filename)
      const writeStream = fs.createWriteStream(target)
      await pump(stream, writeStream)

      ctx.body = { url: `${uploadBasePath}/${userName}/${folderName}/${filename}` }
    } catch (error) {
      ctx.body = error
    }
  }

  /**
   * @summary 文件分片上传
   * @description 文件分片上传
   * @router post /api/v1/file/slice
   * @request body createOrderRequest *body
   * @response 200 getOrderDetailByIdResponse 上传成功
   */
  async slice() {
    const { ctx } = this
    try {
      // 生成对应用户存放大文件文件夹
      function mkdirsSync(dirname) {
        if (fs.existsSync(dirname)) {
          return true;
        } else {
          if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
          }
        }
      }

      const stream = await ctx.getFileStream()
      const { hash } = stream.fields
      console.log('----------strem', stream.fields, stream.filename)
      const userName = ctx.state.user.userName
      // 生成对应文件hash值文件夹名称
      const folderName = 'bigfile'
      const filePath = path.join(`app${uploadBasePath}/`, userName, folderName, hash)
      mkdirsSync(filePath);

      const filename = stream.filename
      console.log('!!!!!!!!', filename)
      const target = path.join(this.config.baseDir, filePath, filename)
      const writeStream = fs.createWriteStream(target)
      await pump(stream, writeStream)
      
      // const data = await ctx.service.file.slice()
      ctx.body = { status: 200, data: { filename, hash } }
    } catch (error) {
      ctx.body = `error:::${error.message}`
    }
  }

  /**
   * @summary 合并文件
   * @description 合并文件
   * @router post /api/v1/file/merge
   * @request body createOrderRequest *body
   * @response 200 getOrderDetailByIdResponse 合并成功
   */
  async merge() {
    const { ctx } = this
    
    try {
      const pipeStream = (path, writeStream) =>
      new Promise(resolve => {
        const readStream = fse.createReadStream(path);
        readStream.on("end", () => {
          fse.unlinkSync(path);
          resolve();
        });
        readStream.pipe(writeStream);
      });

      const size = 1024 * 1024
      const { chunks, hash } = ctx.request.body
      const userName = ctx.state.user.userName
      const folderName = 'bigfile'
      const fileDir = path.join(`app${uploadBasePath}/`, userName, folderName, hash)
      const chunkPaths = await fse.readdir(fileDir);
      chunkPaths.sort((a, b) => a.split('_')[1].split('.')[0] - b.split('_')[1].split('.')[0]);
      console.log('+++++!!!!!', chunkPaths)
      if (chunks != chunkPaths.length) {
        ctx.body = { status: 0, data: { result: '文件上传不完整，合并文件失败！' } }
        return
      }
      const ext = chunkPaths[0].split('.')[1]
      const filePath = `${fileDir}.${ext}`
      // chunkPaths.splice(0, 1)
      // chunkPaths.sort((a, b) => a.slice(-1) - b.slice(-1));

      await Promise.all(
        chunkPaths.map((chunkPath, index) => {
          return pipeStream(
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

      ctx.body = { status: 200, data: { url: filePath.slice(3) } }
    } catch (e) {
      ctx.body = `error:::${e.message}`
    }
  }
}
module.exports = FileController