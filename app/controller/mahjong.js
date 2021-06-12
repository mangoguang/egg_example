const Controller = require('egg').Controller;

/**
 * @controller mahjong 牌局接口
 */
class MahjongController extends Controller {

  async index() {
    const { ctx } = this
    const data = await ctx.service.mahjong.index()
    ctx.body = data
  }

  /**
   * @summary 查询牌局详情
   * @description 根据牌局id查询牌局详情
   * @router get /api/v1/mahjong/{id}
   * @request path integer *id eg:1 牌局ＩＤ
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
      const data = await ctx.service.mahjong.show(id)
      ctx.body = data
    } catch (error) {
      ctx.body = `${error.message}: ${error.errors[0].code}-${error.errors[0].field}`
    }
  }

  /**
   * @summary 新增牌局
   * @description 新增牌局
   * @router post /api/v1/mahjong
   * @request body createOrderRequest *body
   * @response 200 createOrderResponse 创建成功
   */
  async create() {
    const { ctx } = this
    const { date, addressName, addressCode, eastId, westId, southId, northId, eastName, westName, southName, northName, eastNum, westNum, southNum, northNum } = ctx.request.body
    ctx.logger.info('新增牌局：', { date, addressName, addressCode, eastName, westName, southName, northName, eastNum, westNum, southNum, northNum });
    try {
      ctx.validate({
        addressName: { type: 'string' },
        eastName: { type: 'string' },
        westName: { type: 'string' },
        southName: { type: 'string' },
        northName: { type: 'string' },
      }, ctx.request.body)
      const data = await ctx.service.mahjong.create({ date, addressName, addressCode, eastId, westId, southId, northId, eastName, westName, southName, northName, eastNum, westNum, southNum, northNum })
      ctx.body = data
    } catch (error) {
      ctx.body = `${error.message}: ${error.errors[0].code}-${error.errors[0].field}`
    }
  }

  // /**
  //  * @summary 更新订单
  //  * @description 更新订单
  //  * @router put /api/v1/order/{id}
  //  * @request header string *Authorization token
  //  * @request path integer *id eg:1 订单ＩＤ
  //  * @request query string money 金额
  //  * @request query string levelOneCode 一级分类编码
  //  * @request query string levelOneName 一级分类名称
  //  * @request query string levelTwoCode 二级分类编码
  //  * @request query string levelTwoName 二级分类名称
  //  * @request query string memberCode 成员编码
  //  * @request query string memberName 成员名称
  //  * @request query string remark 备注
  //  * @response 200 updateOrderByIdResponse 更新结果
  //  */
  // async update() {
  //   const { ctx } = this
  //   const { id } = ctx.params
  //   const { money, classifyType, accountType, date, memberType, projectType, remark } = ctx.request.body
  //   try {
  //     console.log('++++++++++++++++', ctx.query, ':::',ctx.params, ':::', ctx.request.body)
  //     ctx.validate({
  //       id: { type: 'string' }
  //     }, ctx.params)
  //     const result = await ctx.service.order.update(id, { money, classifyType, accountType, date, memberType, projectType, remark })
  //     ctx.body = result
  //   } catch (error) {
  //     ctx.body = `更新失败`
  //     // ctx.body = `${error.message}: ${error.errors[0].code}-${error.errors[0].field}`
  //   }
  // }

  // /**
  //  * @summary 删除订单
  //  * @description 根据订单id删除订单
  //  * @router delete /api/v1/order/{id}
  //  * @request path integer *id eg:1 用户ＩＤ
  //  * @request header string *Authorization token
  //  * @response 200 deleteOrderByIdResponse 删除成功！
  //  */
  // async destroy() {
  //   const { ctx } = this
  //   const { id } = ctx.params
  //   const result = await ctx.service.order.destroy(id)
  //   ctx.body = result
  // }

  /**
   * @summary 根据时间分页区间查询牌局列表
   * @description 根据时间分页区间查询牌局列表
   * @router post /api/v1/mahjong/list
   * @request body getOrderByTimeTervalRequest *body
   * @request header string *Authorization token
   * @response 200 getOrderByTimeTervalResponse
   */
  async list () {
    const { ctx } = this
    const { limit, page } = ctx.request.body
    const data = await ctx.service.mahjong.list(limit, page)
      console.log('list--------------------------------------2', data)
      ctx.body = data
  }

  // /**
  //  * @summary 根据查询条件获取订单列表
  //  * @description 根据查询条件获取订单列表
  //  * @router post /api/v1/order/getOrdersBySearch
  //  * @request header string *Authorization token
  //  * @request body getOrdersBySearchRequest *body
  //  * @response 200 getOrdersBySearchResponse
  //  */
  // async getOrdersBySearch () {
  //   const { ctx } = this
  //   const data = await ctx.service.order.getOrdersBySearch(ctx.request.body)
  //   ctx.body = data
  // }
}
module.exports = MahjongController;