const fs = require('fs');
const path = require('path');
const Service = require('egg').Service;
const async = require('async');
const { createOrderNo } = require('../utils/service/order');
const { getDate } = require('../utils/common')

class DictService extends Service {
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
      const result = await app.mysql.get('users', { id })
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
        create_time: params.date,
        money: params.money,
        order_type: params.orderType,
        level_two_name: params.classifyType,
        user_name: ctx.state.user.userName,
        member_name: params.memberType,
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
      await app.mysql.insert('orders', data)
      return '新增成功'
    } catch (error) {
      return error
    }
  }

  // async update(data) {
  //   const { app } = this
  //   try {
      // const result = await app.mysql.query('update users set phone = ?, password = ? where id = ?', [data.phone, data.password, data.id])
  //     return result
  //   } catch (error) {
  //     return error
  //   }
  // }

  /**
   * 根据订单id删除订单
   */
  async destroy(id) {
    const { app } = this
    try {
      console.log('database:---', id)
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
      let list = this._getDayList(startTime, endTime, limit, page)
      return list
    } catch (error) {
      console.log(error)
      return error
    }
    // ctx.state.user.userName
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

module.exports = DictService