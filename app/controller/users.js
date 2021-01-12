// app/controller/user.js
const Controller = require('egg').Controller;

/**
 * @controller users 用户接口
 */
class UserController extends Controller {
  /**
   * @summary 查询用户列表
   * @description 查询所有用户
   * @router get /api/v1/users
   * @request header string *Authorization token
   * @response 200 getUsersResponse 查询成功
   */
  async index() {
    const { ctx } = this
    const data = await ctx.service.users.index()
    ctx.body = data
  }

  /**
   * @summary 查询用户详情
   * @description 根据用户id查询用户
   * @router get /api/v1/users/{id}
   * @request path integer *id eg:1 用户ＩＤ
   * @request header string *Authorization token
   * @response 200 getUserByIdResponse 查询成功
   */
  async show() {
    const { ctx } = this
    const { id } = ctx.params
    const data = await ctx.service.users.show(id)
    ctx.logger.info('获取用户信息', { name: ctx.state.user.userName}, { id: data.id });
    ctx.body = data
  }

  /**
   * @summary 获取用户信息
   * @description 根据jsCode获取用户信息
   * @router get /api/v1/getUserInfoByCode
   * @request header string *Authorization token
   * @request query string weappName 微信公众号名称 MANGOGUANG
   * @request query string jsCode 微信jsCode
   * @response 200 getUserInfoByCodeResponse 查询成功
   */
  async userInfo() {
    const { ctx } = this
    const { weappName, jsCode, uuid } = ctx.request.body
    const data = await ctx.service.users.userInfo(weappName, jsCode, uuid)
    ctx.logger.info('获取用户信息', data);
    ctx.body = data
  }

  /**
   * @summary 创建用户
   * @description 创建用户
   * @router post /api/v1/users
   * @request body createUserRequest *body
   * @request header string *Authorization token
   * @response 200 createUsersResponse 查询成功
   */
  async create() {
    const { ctx } = this
    const { userName, password, phone, address, openid, unionid, nickName, avatarUrl, gender } = ctx.query
    try {
      ctx.validate({
        userName: { type: 'string' },
        password: { type: 'string' },
        phone: { type: 'string' }
      }, ctx.query)
      const data = await ctx.service.users.create({ userName, password, phone, address, openid, unionid, nickName, avatarUrl, gender })
      ctx.body = data
    } catch (error) {
      ctx.body = `${error.message}: ${error.errors[0].code}-${error.errors[0].field}`
    }
  }

  /**
   * @summary 创建用户（微信端）
   * @description 根据微信jsCode创建用户
   * @router post /api/v1/users/createUserByCode
   * @request body createUserByCodeRequest *body
   * @request header string *Authorization token
   * @response 200 createUserByCodeResponse 查询成功
   */
  async createUserByCode() {
    const { ctx } = this
    try {
      ctx.validate({
        weappName: { type: 'string' },
      }, ctx.request.body)
      const data = await ctx.service.users.createUserByCode(ctx.request.body)
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
   * @summary 登录接口
   * @description 登录
   * @router get /api/login/{userName}
   * @request path string *userName 用户名称
   * @response 200 loginResponse 查询成功
   */
  async login() {
    const { ctx } = this
    const { userName } = ctx.params
    const { password, uuid } = ctx.query
    try {
      ctx.validate({
        password: { type: 'string' },
        uuid: { type: 'string' }
      }, { ...ctx.query })
      const data = await ctx.service.users.login({ userName, password, uuid })
      ctx.body = data
    } catch (error) {
      ctx.body = error
      // ctx.body = `${error.message}: ${error.errors[0].code}-${error.errors[0].field}`
    }
  }

  /**
   * @summary 检测用户是否存在
   * @description 检测用户是否存在
   * @router get /api/users/check/{userName}
   * @request path string *userName 用户名称
   * @request header string *Authorization token
   * @response 200 loginResponse 查询成功
   */
  async check() {
    const { ctx } = this
    const userName = ctx.params.userName
    const res = await ctx.service.users.check(userName);
    ctx.body = res
  }

  /**
   * @summary 收支情况
   * @description 用户收支情况
   * @router post /api/v1/users/payInfo
   * @request header string *Authorization token
   * @response 200 payInfoResponse 查询成功
   */
  async payInfo() {
    const { ctx } = this
    const data = await ctx.service.users.payInfo()
    ctx.body = data
  }
}
module.exports = UserController;