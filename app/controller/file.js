const fs = require('fs');
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
      const data = await ctx.service.file.create()
      ctx.body = data
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
      const data = await ctx.service.file.slice()
      ctx.body = data
    } catch (error) {
      ctx.body = `${error.message}`
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
      const { chunks, hash } = ctx.request.body
      const data = await ctx.service.file.merge(chunks, hash)
      ctx.body = data
    } catch (e) {
      ctx.body = `${e.message}`
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
}
module.exports = FileController