const fs = require('fs');
const path = require('path');
const Service = require('egg').Service;
const async = require('async');
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
      const result = await app.mysql.get('notes', { id })
      return result
    } catch (error) {
      return error
    }
  }

  /**
   * 创建笔记
   */
  async create(params) {
    try {
      const { ctx, app } = this
      const userInfo = await app.mysql.get('users', { user_name: ctx.state.user.userName })
      const { date, longitude, latitude, title, content, remark, weather, type, imgList } = params
      const data = {
        date, longitude, latitude, title, content, remark, weather, type,
        img_list: imgList,
        user_id: userInfo.id,
        user_name: ctx.state.user.userName,
      }
      await app.mysql.insert('notes', data)
      return '新增成功'
    } catch (error) {
      return error
    }
  }

  /**
   * 根据笔记id删除订单
   */
  async destroy(id) {
    const { ctx, app } = this
    try {
      await app.mysql.delete('notes', { id })
      return '删除成功！'
    } catch (error) {
      return error
    }
  }

  /**
   * 根据时间分页区间查询笔记列表
   */
  async list(limit, page) {
    const { ctx, app } = this

    try {
      const list = await app.mysql.query('select * from notes where user_name = ?', [ctx.state.user.userName])
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
  // async getnotesBySearch(params = {}) {
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
  //   const curd = `select * from notes${names.length ? whereCurd : ''}${startTime ? createTimeCurd : ''}`
  //   // 查询
  //   let notes = app.mysql.query(curd, [...values, startTime, endTime])
  //   return notes
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