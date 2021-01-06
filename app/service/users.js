const Service = require('egg').Service;
const { getDate } = require('../utils/common')
const { weappInfo } = require('../utils/constants')

class UserService extends Service {
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
  async userInfo(weappName, jsCode) {
    const { app } = this
    try {
      const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${weappInfo[weappName].appid}&secret=${weappInfo[weappName].secret}&js_code=${jsCode}&grant_type=authorization_code`
      const temp = await this.ctx.curl(url, { dataType: 'json' })
      const result = await app.mysql.get('users', { openid: temp.data.openid || '' })
      return result
    } catch (error) {
      return error
    }
  }

  /**
   * 查询用户详情
   */
  async showByName(user_name) {
    const { app } = this
    try {
      const result = await app.mysql.get('users', { user_name })
      return result
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
  async create(params) {
    const { ctx, app } = this
    const data = { ...params, register_time: new Date() }
    try {
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

  /**
   * 用户收支情况
   */
  async payInfo() {
    const { ctx, app } = this
    const date = new Date()

    try {
      // 获取用户信息
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
      console.log('---',monthStartDate, today, monthIncome, monthPay)

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
}

module.exports = UserService