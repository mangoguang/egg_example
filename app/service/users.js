const Service = require('egg').Service;
const { getDate, dataToLine, getWxUserInfo } = require('../utils/common')
const { weappInfo } = require('../utils/constants')
const { md5 } = require('../utils/common')

class UserService extends Service {
  // constructor() {
  //   super()
  //   /**
  //   * 查询用户详情
  //   */
  //   this.showByName = async function(user_name) {
  //     const { app } = this
  //     try {
  //       const result = await app.mysql.get('users', { user_name })
  //       return result
  //     } catch (error) {
  //       return error
  //     }
  //   }
  // }
  async index() {
    const { app } = this
    const result = await app.mysql.select('users')
    return result
  }

  /**
   * 检测用户是否存在
   */
  async check(userName) {
    // 根据用户 id 从数据库获取用户详细信息
    const userInfo = await this.app.mysql.get('users', { user_name: userName });
    if (!userInfo) {
      return '用户不存在！'
    }
    return userInfo
  }

  /**
   * 查询用户详情
   */
  async show(id) {
    const { app } = this
    try {
      const result = await app.mysql.get('users', { id })
      return result
    } catch (error) {
      return error
    }
  }

  /**
   * 根据微信jsCode获取用户信息
   */
  async userInfo(weappName, jsCode, uuid) {
    const { app } = this
    try {
      const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${weappInfo[weappName].appid}&secret=${weappInfo[weappName].secret}&js_code=${jsCode}&grant_type=authorization_code`
      const temp = await this.ctx.curl(url, { dataType: 'json' })
      const result = await app.mysql.get('users', { openid: temp.data.openid || '' })
      if (result) {
        // 生成token
        const token = app.jwt.sign({
          exp: Math.floor(Date.now() / 1000) + (2 * 60 * 60),
          userName: result.user_name,
          uuid
        }, app.config.jwt.secret)
        return { ...result, token }
      }
      return { result: '用户不存在', info: temp.data }
    } catch (error) {
      return error
    }
  }

  /**
   * 创建用户
   */
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

  /**
   * 根据微信jsCode创建用户
   */
  async createUserByCode(params) {
    const { ctx, app } = this
    const { weappName, jsCode, encryptedData, iv, phone, address, month_quota } = params
    try {
      // getWxUserInfo
      const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${weappInfo[weappName].appid}&secret=${weappInfo[weappName].secret}&js_code=${jsCode}&grant_type=authorization_code`
      let temp = await this.ctx.curl(url, { dataType: 'json' })
      const sessionKey = temp.data.session_key
      // 获取微信用户开放数据
      let userInfo = getWxUserInfo(sessionKey, encryptedData, iv)
      let data = {
        phone,
        address,
        month_quota,
        avatarUrl: userInfo.avatarUrl,
        city: userInfo.city,
        country: userInfo.country,
        gender: userInfo.gender,
        nickName: userInfo.nickName,
        openid: userInfo.openId,
        province: userInfo.province,
        userName: userInfo.nickName,
      }
      data = dataToLine(data)
      const result = await app.mysql.insert('users', data)
      ctx.logger.info('根据微信jsCode创建用户：', params)
      return result
    } catch (error) {
      return error
    }
  }

  // async update(data) {
  //   const { app } = this
  //   try {
  //     const result = await app.mysql.query('update users set phone = ?, password = ? where id = ?', [data.phone, data.password, data.id]);
  //     return result
  //   } catch (error) {
  //     return error
  //   }
  // }

  async login(params) {
    const { ctx, app } = this
    const { password, userName, uuid } = params
    try {
      console.log(this, UserService)
      const userInfo = await app.mysql.get('users', { user_name: userName })
      ctx.logger.info('登录用户的IP地址---------------：', ctx.request.socket.remoteAddress);
      // 校验密码
      if (md5(userInfo.password) !== password) return '用户不存在或密码错误。'
      const token = app.jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (2 * 60 * 60),
        userName: userName,
        uuid
      }, app.config.jwt.secret);
      return { token }
    } catch (error) {
      return error
    }
  }

  /**
   * 用户收支情况
   */
  async payInfo() {
    const { ctx, app } = this
    const date = new Date()

    try {
      // 获取用户信息
      const userName = ctx.state.user.userName
      const userInfo = await app.mysql.query('select * from users where user_name = ?', [ctx.state.user.userName])

      // 获取当天数据
      const today = getDate(new Date(), 'yyyy-MM-dd')
      let [dayIncome, dayPay] = [0, 0]
      const dayList = await app.mysql.query('select * from orders where user_name = ? and to_days(create_time) = to_days(?)', [ctx.state.user.userName, today])
      dayList.forEach(item => {
        if (parseInt(item.order_type)) {
          dayIncome += parseFloat(item.money)
        } else {
          dayPay += parseFloat(item.money)
        }
      })

      // 获取本周数据
      let [weekIncome, weekPay] = [0, 0]
      const weekTemp = date.getDay()
      const weekStartDate = getDate(new Date(+new Date() - (weekTemp - 1) * 86400000))
      const weekList = await app.mysql.query('select * from orders where user_name = ? and create_time between ? and ?', [ctx.state.user.userName, `${weekStartDate} 00:00:00`, `${today} 23:59:59`])
      weekList.forEach(item => {
        if (parseInt(item.order_type)) {
          weekIncome += parseFloat(item.money)
        } else {
          weekPay += parseFloat(item.money)
        }
      })


      // 获取本月数据
      let [monthIncome, monthPay] = [0, 0]
      const monthStartDate = getDate(new Date(+new Date() - (date.getDate() - 1) * 86400000))
      const monthList = await app.mysql.query('select * from orders where user_name = ? and create_time between ? and ?', [ctx.state.user.userName, `${monthStartDate} 00:00:00`, `${today} 23:59:59`])
      monthList.forEach(item => {
        if (parseInt(item.order_type)) {
          monthIncome += parseFloat(item.money)
        } else {
          monthPay += parseFloat(item.money)
        }
      })

      // 获取本年数据
      let [yearIncome, yearPay] = [0, 0]
      const yearStartDate = `${date.getFullYear()}-01-01`
      const yearList = await app.mysql.query('select * from orders where user_name = ? and create_time between ? and ?', [ctx.state.user.userName, `${yearStartDate} 00:00:00`, `${today} 23:59:59`])
      yearList.forEach(item => {
        if (parseInt(item.order_type)) {
          yearIncome += parseFloat(item.money)
        } else {
          yearPay += parseFloat(item.money)
        }
      })
      const data = {
        monthQuota: userInfo[0].month_quota,
        dayIncome,
        dayPay,
        weekIncome,
        weekPay,
        monthIncome,
        monthPay,
        yearIncome,
        yearPay
      }
      return data
    } catch (error) {
      console.log(error)
      return error
    }
  }

  // 设置每月可用额度
  async setMonthQuota(monthQuota) {
    const { ctx, app } = this
    const userName = ctx.state.user.userName
    try {
      const row = { month_quota: monthQuota }
      const options = {
        where: { user_name: userName }
      }
      // 根据用户名更新用户每月可用额度
      await app.mysql.update('users', row, options)
      return { msg: '更新成功' }
    } catch (error) {
      return error
    }
  }
}

module.exports = UserService