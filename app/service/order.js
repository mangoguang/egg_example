const fs = require('fs');
const path = require('path');
const Service = require('egg').Service;
const async = require('async');
const { createOrderNo } = require('../utils/service/order');
const { getDate, dataToLine, sendDateTime } = require('../utils/common')

class OrderService extends Service {
  async index() {
    const { app } = this
    const result = await app.mysql.select('dictionary')
    return result
  }

  /**
   * 查询订单详情
   */
  async show(id) {
    const { app } = this
    try {
      const result = await app.mysql.get('orders', { id })
      return result
    } catch (error) {
      return error
    }
  }

  /**
   * 创建订单
   */
  async create(params) {
    try {
      const { ctx, app } = this
      const orderNo = createOrderNo(params.orderType)
      const userInfo = await app.mysql.get('users', { user_name: ctx.state.user.userName })
      const data = {
        order_no: orderNo,
        create_time: sendDateTime(params.date, 'yyyy-MM-dd hh:mm:ss'),
        money: params.money,
        order_type: params.orderType,
        level_two_name: params.classifyType,
        user_name: ctx.state.user.userName,
        member_name: params.memberType,
        project_name: params.projectType,
        remark: params.remark,
        user_id: userInfo.id,
        img_url: params.imgUrl
      }

      // 根据二级分类名称获取二级分类代码
      const levelTwoDict = await app.mysql.get('dictionary', { dict_name: data.level_two_name })
      data.level_two_code = JSON.parse(JSON.stringify(levelTwoDict)).dict_code
      // 根据二级分类father_id获取一级分类名称&代码
      const levelOneDict = await app.mysql.get('dictionary', { id: JSON.parse(JSON.stringify(levelTwoDict)).father_id })
      data.level_one_code = JSON.parse(JSON.stringify(levelOneDict)).dict_code
      data.level_one_name = JSON.parse(JSON.stringify(levelOneDict)).dict_name
      // 根据成员名称获取对应成员代码
      const memberDict = await app.mysql.get('dictionary', { dict_name: data.member_name })
      data.member_code = memberDict ? JSON.parse(JSON.stringify(memberDict)).dict_code : ''
      // 根据项目名称获取对应项目代码
      const projectDict = await app.mysql.get('dictionary', { dict_name: data.project_name })
      data.project_code = projectDict ? JSON.parse(JSON.stringify(projectDict)).dict_code : ''
      await app.mysql.insert('orders', data)
      return '新增成功'
    } catch (error) {
      return error
    }
  }

  async update(id, params) {
    const { app } = this
    try {
      // 过滤空参数
      for (let item in params) {
        if (!params[item]) delete params[item]
      }
      // 如果对象不为空，才更新数据库
      if (Object.keys(params).length) {
        const row = dataToLine(params)
        const options = {
          where: { id }
        }
        // 根据order id更新order信息
        const result  = await app.mysql.update('orders', row, options)
      }
      return { msg: '更新成功' }
    } catch (error) {
      return error
    }
  }

  /**
   * 根据订单id删除订单
   */
  async destroy(id) {
    const { ctx, app } = this
    try {
      let data = await app.mysql.query('select img_url from orders where user_name = ? and id = ?', [ctx.state.user.userName, id])
      data =  JSON.parse(JSON.stringify(data))
      let imgUrl = data[0].img_url
      // 如果存在图片，一并删除
      if (imgUrl) {
        const baseUrl = __dirname.slice(0, __dirname.length - 8)
        const filePath = path.join(baseUrl, data[0].img_url || '')
        console.log(filePath)
        // /public/uploads/guang/app/public/uploads/guang/202102/1612425598356.png
        fs.unlink(filePath, function(error){
          if(error){
            return false;
          }
        })
      }
      await app.mysql.delete('orders', { id })
      return '删除成功！'
    } catch (error) {
      return error
    }
  }

  /**
   * 根据时间分页区间查询订单列表
   */
  async list(startTime, endTime, limit, page) {

    try {
      // 根据order id更新order信息
      let list = this._getDayList(startTime, endTime, limit, page)
      return list
    } catch (error) {
      console.log(error)
      return error
    }
    // ctx.state.user.userName
  }

  /**
   * 根据查询条件获取订单记录
   */
  async getOrdersBySearch(params = {}) {
    const { ctx, app } = this
    // 获取时间区间
    const { startTime, endTime } = params
    delete params.startTime
    delete params.endTime
    let [names, values] = [[], []]
    params.userName = ctx.state.user.userName
    params = dataToLine(params)
    // 过滤空字段
    for (let key in params) {
      if (params[key]) {
        names.push(key)
        values.push(params[key])
      }
    }
    // 生成sql语句
    const whereCurd = ` where ${names.join(' = ? and ')} = ?`
    const createTimeCurd = ' and create_time between ? and ?'
    const curd = `select * from orders${names.length ? whereCurd : ''}${startTime ? createTimeCurd : ''}`
    // 查询
    let orders = app.mysql.query(curd, [...values, startTime, endTime])
    return orders
  }

  /**
   * 获取时间间隔内数据
   * @param {number} limit - 查询数量
   * @param {number} page - 页数
   * @param {string} startTime - 开始时间
   * @param {string} endTime - 结束时间
   */
  async _getDayList(startTime, endTime, limit, page) {
    const { ctx, app } = this
    try {
      if (+new Date(endTime) < +new Date(startTime)) return '开始时间必须小于结束时间'
      let [list, result] = [[], []]
      const oneDaySeconds = 24 * 60 * 60 * 1000
      for (let i = 0; i < 1000; i++) {
        let [income, pay] = [0, 0]
        const tempArray = await app.mysql.query('select * from orders where user_name = ? and to_days(create_time) = to_days(?)', [ctx.state.user.userName, endTime])
        // 将查询到的数据进行处理并添加到数组
        if (tempArray.length) {
          tempArray.forEach(item => {
            if (parseInt(item.order_type)) {
              income += parseInt(item.money)
            } else {
              pay += parseInt(item.money)
            }
          })
          list.push({
            date: endTime,
            list: tempArray,
            surplus: income - pay,
            income,
            pay
          })
        }
        // 如果查询的数据达到所要查询数据的数量，则停止查询并返回结果
        if (list.length >= limit * page) break
        // 时间区间内数据查询完毕
        if (startTime === endTime) {
          break
        }
        endTime = getDate(new Date(+new Date(endTime) - oneDaySeconds))
      }
      result = list.slice(limit * (page - 1), limit * page)
      return result
    } catch (error) {
      return error
    }
  }
}

module.exports = OrderService