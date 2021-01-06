'use strict';

module.exports = {
  loginResponse: {
    token: { type: 'string', description: 'token' },
  },
  code2SessionResponse: {
    sessionKey: { type: 'string', description: '微信sessionKey' },
    openid: { type: 'string', description: '微信openid' },
  },
  uploadFileResponse: {
    url: { type: 'string', description: '上传的文件链接' },
  },
};