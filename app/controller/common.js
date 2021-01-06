const Controller = require('egg').Controller;

/**
 * @controller common 通用接口
 */
class CommonController extends Controller {

  // /**
  //  * @summary 微信登录凭证校验
  //  * @description 微信登录凭证校验
  //  * @router get /api/v1/common/code2Session
  //  * @request query string weappName 小程序/公众号名称
  //  * @request query string jsCode 登录时获取的 code
  //  * @response 200 code2SessionResponse 创建成功
  //  */
  async code2Session() {
    const { ctx } = this
    const { weappName, jsCode } = ctx.query
    const data = await ctx.service.common.code2Session(weappName, jsCode)
    // ctx.logger.info('登录凭证校验', { name: ctx.state.user.userName});
    ctx.body = data
  }

}
module.exports = CommonController;