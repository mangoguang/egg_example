const Controller = require('egg').Controller;

/**
 * @controller note 笔记接口
 */
class NoteController extends Controller {

  async index() {
    const { ctx } = this
    const data = await ctx.service.note.index()
    ctx.body = data
  }

  /**
   * @summary 查询笔记详情
   * @description 根据笔记id查询笔记详情
   * @router get /api/v1/note/{id}
   * @request path integer *id eg:1 笔记ＩＤ
   * @request header string *Authorization token
   * @response 200 getOrderDetailByIdResponse 创建成功
   */
  async show() {
    const { ctx } = this
    const { id } = ctx.params
    try {
      ctx.validate({
        id: { type: 'string' }
      }, ctx.params)
      const data = await ctx.service.note.show(id)
      ctx.body = data
    } catch (error) {
      ctx.body = `${error.message}: ${error.errors[0].code}-${error.errors[0].field}`
    }
  }

  /**
   * @summary 新增笔记
   * @description 新增笔记
   * @router post /api/v1/note
   * @request body createOrderRequest *body
   * @response 200 createOrderResponse 创建成功
   */
  async create() {
    const { ctx } = this
    const { date, longitude, latitude, title, content, imgList, remark, weather, type } = ctx.request.body
    ctx.logger.info('新增笔记：', { date, longitude, latitude, title, content, imgList, remark, weather, type });
    try {
      ctx.validate({
        title: { type: 'string' },
        date: { type: 'string' }
      }, ctx.request.body)
      const data = await ctx.service.note.create({ date, longitude, latitude, title, content, imgList, remark, weather, type })
      ctx.body = data
    } catch (error) {
      ctx.body = `${error.message}: ${error.errors[0].code}-${error.errors[0].field}`
    }
  }

  /**
   * @summary 删除笔记
   * @description 根据笔记id删除订单
   * @router delete /api/v1/note/{id}
   * @request path integer *id eg:1 用户ＩＤ
   * @request header string *Authorization token
   * @response 200 deleteOrderByIdResponse 删除成功！
   */
  async destroy() {
    const { ctx } = this
    const { id } = ctx.params
    const result = await ctx.service.note.destroy(id)
    ctx.body = result
  }

  /**
   * @summary 根据时间分页区间查询笔记列表
   * @description 根据时间分页区间查询笔记列表
   * @router post /api/v1/note/list
   * @request body getOrderByTimeTervalRequest *body
   * @request header string *Authorization token
   * @response 200 getOrderByTimeTervalResponse
   */
  async list () {
    const { ctx } = this
    const { limit, page } = ctx.request.body
    const data = await ctx.service.note.list(limit, page)
      ctx.body = data
  }
}
module.exports = NoteController;