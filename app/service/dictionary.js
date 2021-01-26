const Service = require('egg').Service;
let async = require('async');

class DictService extends Service {
  async index() {
    const { app } = this
    const result = await app.mysql.select('dictionary')
    return result
  }

  /**
   * 创建代码字典
   */
  async create(params) {
      try {
      const { ctx, app } = this
      const userName = ctx.state.user.userName
      const fatherDict = await app.mysql.get('dictionary', { dict_code: params.fatherCode })

      const data = {
        father_id: fatherDict.id,
        dict_name: params.dictName,
        create_time: sendDateTime(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        creater: userName,
        dict_code: `${userName}${+new Date()}`,
        dict_type: userName.toUpperCase() + '_TYPE'
      }
      await app.mysql.insert('dictionary', data)
      return '添加成功！'
    } catch (error) {
      return error
    }
  }

  /**
   * 根据dictCode删除对应代码字典
   * @param {string} dictCode 
   */
  async destroy(dictCode) {
    const { app } = this
    try {
      await app.mysql.delete('dictionary', { dict_code: dictCode })
      return '删除成功！'
    } catch (error) {
      return error
    }
  }

  /**
   * 根据dictType查询代码字典列表
   * @param {string} dictType 
   */
  async list (dictType) {
    const { ctx, app } = this
    try {
      // 获取一级分类
      let list = await app.mysql.query('select * from dictionary where dict_type = ?', [dictType])
      list = list.map(item => {
        return {
          dictName: item.dict_name,
          dictCode: item.dict_code,
          id: item.id
        }
      })
      const getData = new Promise((resolve, reject) => {
        // 异步循环遍历，根据一级分类的id获取二级分类（根据father_id字段）
        async.map(list, async (item, callback) => {
          const childs = await app.mysql.query('select * from dictionary where father_id = ? and (creater = ? or creater = ?)', [item.id, 'admin', ctx.state.user.userName])
          // 取出的数据为RowDataPacket数据，转为正常json数据
          const temp = JSON.parse(JSON.stringify(childs)).map(item => {
            return {
              dictName: item.dict_name,
              dictCode: item.dict_code
            }
          })
          item.childs = temp
          callback(null, item)
        }, function(err, results) {
          if (err) {
            reject(err)
          } else {
            // console.log('数据字典结果1', results)
            resolve(results)
          }
        })
      })
      return await getData
    } catch (error) {
        return error
    }
  }

}

module.exports = DictService