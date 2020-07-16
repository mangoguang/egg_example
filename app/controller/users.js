// app/controller/user.js
const Controller = require('egg').Controller;

class UserController extends Controller {

  async index() {
    const { ctx } = this
    const data = await ctx.service.users.index()
    ctx.body = data
  }

  async new() {
    const { ctx } = this
    console.log('new', ctx)
    ctx.body = ctx
  }

  async show() {
    const { ctx } = this
    const { id } = ctx.params
    const data = await ctx.service.users.show(id)
    ctx.logger.info('获取用户信息', { name: ctx.state.user.userName}, { id: data.id });
    ctx.body = data
  }

  async create() {
    const { ctx } = this
    const { userName, password, phone, address } = ctx.query
    try {
      ctx.validate({
        userName: { type: 'string' },
        password: { type: 'string' },
        phone: { type: 'string' }
      }, ctx.query)
      const data = await ctx.service.users.create({ userName, password, phone, address })
      ctx.body = data
    } catch (error) {
      ctx.body = `${error.message}: ${error.errors[0].code}-${error.errors[0].field}`
    }
  }

  async update() {
    const { ctx } = this
    const { id } = ctx.params
    const { phone, password } = ctx.query
    const result = await ctx.service.users.update({ id: parseInt(id), password, phone})
    ctx.body = result
  }

  async login() {
    const { ctx, app } = this
    const { userName } = ctx.params
    const token = app.jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (2 * 60 * 60),
      userName: userName,
      uuid: '888888888'
    }, app.config.jwt.secret);
    ctx.body = { token }
  }

  async check() {
    const { ctx } = this
    const userName = ctx.params.userName
    const res = await ctx.service.users.check(userName);
    ctx.body = res
  }
}
module.exports = UserController;