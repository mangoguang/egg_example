const Service = require('egg').Service;
const { weappInfo } = require('../utils/constants')

class CommonService extends Service {

  /**
   * 微信登录凭证校验
   */
  async code2Session(weappName, jsCode) {
    const { app, ctx } = this
    try {
      const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${weappInfo[weappName].appid}&secret=${weappInfo[weappName].secret}&js_code=${jsCode}&grant_type=authorization_code`
      const result = await this.ctx.curl(url, { dataType: 'json' })
      return result.data
    } catch (error) {
      return error
    }
  }

}

module.exports = CommonService