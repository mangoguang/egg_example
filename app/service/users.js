const Service = require('egg').Service;

class UserService extends Service {
  async index() {
    const { app } = this
    const result = await app.mysql.select('users')
    return result
  }

  async check(userName) {
    // 根据用户 id 从数据库获取用户详细信息
    const userInfo = await this.app.mysql.get('users', { user_name: userName });
    if (!userInfo) {
      return '用户不存在！'
    }
    return userInfo
  }

  async show(id) {
    const { app } = this
    try {
      const result = await app.mysql.get('users', { id })
      return result
    } catch (error) {
      return error
    }
  }

  async create(params) {
    const { ctx, app } = this
    const data = { ...params, register_time: new Date(), user_name: params.userName }
    delete data.userName
    try {
      const result = await app.mysql.insert('users', data)
      ctx.logger.info('创建用户：', params)
      return result
    } catch (error) {
      return error
    }
  }

  async update(data) {
    const { app } = this
    try {
      const result = await app.mysql.query('update users set phone = ?, password = ? where id = ?', [data.phone, data.password, data.id]);
      return result
    } catch (error) {
      return error
    }
  }
}

module.exports = UserService