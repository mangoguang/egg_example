const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;
const pump = require('mz-modules/pump');
const { sendDateTime } = require('../utils/common')

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
    const uploadBasePath = '/public/uploads'
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

      this.ctx.body = { url: `${uploadBasePath}/${userName}/${folderName}/${filename}` }
    } catch (error) {
      ctx.body = error
    }
  }

}
module.exports = FileController