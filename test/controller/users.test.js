const { app, mock, assert } = require('egg-mock/bootstrap');

describe('test/controller/users.test.js', () => {
  describe('GET /api/v1/check/xiaowei', () => {
    it('should status 200 and get the body', () => {
      // 对 app 发起 `GET /` 请求
      return app.httpRequest()
        .get('/api/v1/check/xiaowei')
        .expect(200) // 期望返回 status 200
        .expect({
          code: '1',
          data: '',
          message: '成功',
          result: true
        })
    })
  });
});