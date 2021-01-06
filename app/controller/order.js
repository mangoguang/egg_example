const Controller = require('egg').Controller;

/**
 * @controller order 订单接口
 */
class OrderController extends Controller {

  async index() {
    const { ctx } = this
    const data = await ctx.service.order.index()
    ctx.body = data
  }

  /**
   * @summary 查询订单详情
   * @description 根据订单id查询订单详情
   * @router get /api/v1/order/{id}
   * @request path integer *id eg:1 用户ＩＤ
   * @request header string *Authorization token
   * @response 200 getOrderDetailByIdResponse 创建成功
   */
  async show() {
    const { ctx } = this
    const { id } = ctx.params
    const data = await ctx.service.users.show(id)
    // ctx.logger.info('获取用户信息', { name: ctx.state.user.userName});
    ctx.body = data
  }

  /**
   * @summary 新增订单
   * @description 新增订单
   * @router post /api/v1/order
   * @request body createOrderRequest *body
   * @response 200 createOrderResponse 创建成功
   */
  async create() {
    const { ctx } = this
    const { money, classifyType, accountType, date, memberType, remark, orderType, imgUrl } = ctx.request.body
    try {
      ctx.validate({
        money: { type: 'string' },
        classifyType: { type: 'string' },
        accountType: { type: 'string' },
      }, ctx.request.body)
      const data = await ctx.service.order.create({ money, classifyType, accountType, date, memberType, remark, orderType, imgUrl })
      ctx.body = data
    } catch (error) {
      ctx.body = `${error.message}: ${error.errors[0].code}-${error.errors[0].field}`
    }
  }

  // async update() {
  //   const { ctx } = this
  //   const { id } = ctx.params
  //   const { phone, password } = ctx.query
  //   const result = await ctx.service.users.update({ id: parseInt(id), password, phone})
  //   ctx.body = result
  // }

  /**
   * @summary 删除订单
   * @description 根据订单id删除订单
   * @router delete /api/v1/order/{id}
   * @request path integer *id eg:1 用户ＩＤ
   * @request header string *Authorization token
   * @response 200 deleteOrderByIdResponse 删除成功！
   */
  async destroy() {
    const { ctx } = this
    const { id } = ctx.params
    const result = await ctx.service.order.destroy(id)
    ctx.body = result
  }

  /**
   * @summary 根据时间分页区间查询订单列表
   * @description 根据时间分页区间查询订单列表
   * @router post /api/v1/order/list
   * @request body getOrderByTimeTervalRequest *body
   * @request header string *Authorization token
   * @response 200 getOrderByTimeTervalResponse
   */
  async list () {
    const { ctx } = this
    const { startTime, endTime, limit, page } = ctx.request.body
    const data = await ctx.service.order.list(startTime, endTime, limit, page)
    ctx.body = data
  }
}
module.exports = OrderController;