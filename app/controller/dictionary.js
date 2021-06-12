const Controller = require('egg').Controller;

/**
 * @controller dictionary 数据字典接口
 */
class DictController extends Controller {

  async index() {
    const { ctx } = this
    const data = await ctx.service.dictionary.index()
    ctx.body = data
  }

  /**
   * @summary 创建代码字典
   * @description 创建代码字典
   * @router post /api/v1/dict
   * @request body createDictRequest *body
   * @response 200 baseResponse 创建成功
   */
  async create() {
    const { ctx } = this
    console.log(ctx.params)
    const { dictName, fatherCode } = ctx.request.body
    try {
      ctx.validate({
        dictName: { type: 'string' },
        fatherCode: { type: 'string' }
      }, ctx.request.body)
      const data = await ctx.service.dictionary.create({ dictName, fatherCode })
      ctx.body = data
    } catch (error) {
      ctx.body = `${error.message}: ${error.errors[0].code}-${error.errors[0].field}`
    }
  }

  /**
   * @summary 删除代码字典
   * @description 根据dictCode删除对应代码字典
   * @router delete /api/v1/dict/{id}
   * @request path integer *id eg:1 用户ＩＤ
   * @request header string *Authorization token
   * @response 200 deleteDictByIdResponse 删除成功！
   */
  async destroy() {
    const { ctx } = this
    try {
      const { id } = ctx.params
      const data = await ctx.service.dictionary.destroy(id)
      return data
    } catch (error) {
      return error
    }
  }

  /**
   * 
   */
  /**
   * @summary 查询代码字典列表
   * @description 根据dictType查询代码字典列表
   * @router get /api/v1/dict/list/{dictType}
   * @request path string *dictType eg:PAY_TYPE 字典代码类型
   * @request header string *Authorization token
   * @response 200 getDictListByDictTypeResponse 创建成功
   */
  async list () {
    const { ctx } = this
    const { dictType } = ctx.params
    const data = await ctx.service.dictionary.list(dictType)
    ctx.body = data
  }

}
module.exports = DictController;