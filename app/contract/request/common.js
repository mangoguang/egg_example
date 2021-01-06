'use strict';

const { weappInfo } = require('../../utils/constants')

module.exports = {
  code2SessionRequest: {
    weappName: { type: 'string', required: true, enum: [weappInfo.MANGOGUANG.name], description: '小程序/公众号名称' },
    jsCode: { type: 'string', required: true, description: '登录时获取的 code' },
  },
};