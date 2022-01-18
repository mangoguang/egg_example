const fs = require('fs');
const path = require('path');
const Service = require('egg').Service;
const async = require('async');
const { createOrderNo } = require('../utils/service/order');
const { getDate, dataToLine, sendDateTime } = require('../utils/common')

class MahjongService extends Service {
  async index() {
    const { app } = this
    const result = await app.mysql.select('dictionary')
    return result
  }

  /**
   * 查询牌局详情
   */
  async show(id) {
    const { app } = this
    try {
      const result = await app.mysql.get('mahjongs', { id })
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
      const userInfo = await app.mysql.get('users', { user_name: ctx.state.user.userName })
      const data = {
        user_id: userInfo.id,
        user_name: ctx.state.user.userName,
        address_name: params.addressName,
        address_code: params.addressCode,
        east_id: params.eastId,
        west_id: params.westId,
        south_id: params.southId,
        north_id: params.northId,
        east_name: params.eastName,
        west_name: params.westName,
        south_name: params.southName,
        north_name: params.northName,
        east_num: params.eastNum,
        west_num: params.westNum,
        south_num: params.southNum,
        north_num: params.northNum,
        create_time: sendDateTime(params.date, 'yyyy-MM-dd hh:mm:ss'),
      }

      // // 根据二级分类名称获取二级分类代码
      // const levelTwoDict = await app.mysql.get('dictionary', { dict_name: data.level_two_name })
      // data.level_two_code = JSON.parse(JSON.stringify(levelTwoDict)).dict_code
      // // 根据二级分类father_id获取一级分类名称&代码
      // const levelOneDict = await app.mysql.get('dictionary', { id: JSON.parse(JSON.stringify(levelTwoDict)).father_id })
      // data.level_one_code = JSON.parse(JSON.stringify(levelOneDict)).dict_code
      // data.level_one_name = JSON.parse(JSON.stringify(levelOneDict)).dict_name
      // // 根据成员名称获取对应成员代码
      // const memberDict = await app.mysql.get('dictionary', { dict_name: data.member_name })
      // data.member_code = memberDict ? JSON.parse(JSON.stringify(memberDict)).dict_code : ''
      // // 根据项目名称获取对应项目代码
      // const projectDict = await app.mysql.get('dictionary', { dict_name: data.project_name })
      // data.project_code = projectDict ? JSON.parse(JSON.stringify(projectDict)).dict_code : ''
      // // 根据账号名称获取对应账号代码
      // const accountDict = await app.mysql.get('dictionary', { dict_name: data.account_name })
      // data.account_code = accountDict ? JSON.parse(JSON.stringify(accountDict)).dict_code : ''
      await app.mysql.insert('mahjongs', data)
      return '新增成功'
    } catch (error) {
      return error
    }
  }

  // async update(id, params) {
  //   const { ctx, app } = this
  //   const userInfo = await app.mysql.get('users', { user_name: ctx.state.user.userName })
  //   try {
  //     console.log(111, params)
  //     const data = {
  //       create_time: sendDateTime(params.date, 'yyyy-MM-dd hh:mm:ss'),
  //       money: params.money,
  //       level_two_name: params.classifyType,
  //       user_name: ctx.state.user.userName,
  //       member_name: params.memberType,
  //       project_name: params.projectType,
  //       account_name: params.accountType,
  //       remark: params.remark,
  //       user_id: userInfo.id
  //     }
  //     console.log(2222, data)
  
  //     // 根据二级分类名称获取二级分类代码
  //     const levelTwoDict = await app.mysql.get('dictionary', { dict_name: data.level_two_name })
  //     data.level_two_code = JSON.parse(JSON.stringify(levelTwoDict)).dict_code
  //     // 根据二级分类father_id获取一级分类名称&代码
  //     const levelOneDict = await app.mysql.get('dictionary', { id: JSON.parse(JSON.stringify(levelTwoDict)).father_id })
  //     data.level_one_code = JSON.parse(JSON.stringify(levelOneDict)).dict_code
  //     data.level_one_name = JSON.parse(JSON.stringify(levelOneDict)).dict_name
  //     // 根据成员名称获取对应成员代码
  //     const memberDict = await app.mysql.get('dictionary', { dict_name: data.member_name })
  //     data.member_code = memberDict ? JSON.parse(JSON.stringify(memberDict)).dict_code : ''
  //     // 根据项目名称获取对应项目代码
  //     const projectDict = await app.mysql.get('dictionary', { dict_name: data.project_name })
  //     data.project_code = projectDict ? JSON.parse(JSON.stringify(projectDict)).dict_code : ''
  //     // 根据账号名称获取对应账号代码
  //     const accountDict = await app.mysql.get('dictionary', { dict_name: data.account_name })
  //     data.account_code = accountDict ? JSON.parse(JSON.stringify(accountDict)).dict_code : ''
  //     console.log('更新的数据：：：：', data)

  //     // 过滤空参数
  //     for (let item in data) {
  //       if (!data[item]) delete data[item]
  //     }
  //     // 如果对象不为空，才更新数据库
  //     if (Object.keys(data).length) {
  //       const row = dataToLine(data)
  //       const options = {
  //         where: { id }
  //       }
  //       // 根据order id更新order信息
  //       const result  = await app.mysql.update('orders', row, options)
  //     }
  //     return { msg: '更新成功' }
  //   } catch (error) {
  //     return error
  //   }
  // }

  /**
   * 根据订单id删除订单
   */
  async destroy(id) {
    const { ctx, app } = this
    try {
      await app.mysql.delete('mahjongs', { id })
      return '删除成功！'
    } catch (error) {
      return error
    }
  }

  /**
   * 根据时间分页区间查询牌局列表
   */
  async list(limit, page) {
    const { ctx, app } = this

    try {
      // 根据order id更新order信息
      const list = await app.mysql.query('select * from mahjongs where user_name = ?', [ctx.state.user.userName])
      console.log('list--------------------------------------1', list)
      return list 
    } catch (error) {
      console.log(error)
      return error
    }
    // ctx.state.user.userName
  }

  // /**
  //  * 根据查询条件获取订单记录
  //  */
  // async getOrdersBySearch(params = {}) {
  //   const { ctx, app } = this
  //   // 获取时间区间
  //   const { startTime, endTime } = params
  //   delete params.startTime
  //   delete params.endTime
  //   let [names, values] = [[], []]
  //   params.userName = ctx.state.user.userName
  //   params = dataToLine(params)
  //   // 过滤空字段
  //   for (let key in params) {
  //     if (params[key]) {
  //       names.push(key)
  //       values.push(params[key])
  //     }
  //   }
  //   // 生成sql语句
  //   const whereCurd = ` where ${names.join(' = ? and ')} = ?`
  //   const createTimeCurd = ' and create_time between ? and ?'
  //   const curd = `select * from orders${names.length ? whereCurd : ''}${startTime ? createTimeCurd : ''}`
  //   // 查询
  //   let orders = app.mysql.query(curd, [...values, startTime, endTime])
  //   return orders
  // }

  /**
   * 获取时间间隔内数据
   * @param {number} limit - 查询数量
   * @param {number} page - 页数
   */
  // async _getMahjongList(limit, page) {
  //   const { ctx, app } = this
  //   try {
  //     const list = await app.mysql.query('select * from mahjongs where user_name = ?', [ctx.state.user.userName])
  //     // result = list.slice(limit * (page - 1), limit * page)
  //     return list
  //   } catch (error) {
  //     return error
  //   }
  // }
}

module.exports = MahjongService