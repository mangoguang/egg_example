const { app, mock, assert } = require('egg-mock/bootstrap')

describe('test/service/users.test.js', () => {
  describe('check()', () => {
    it('should get exists user', async () => {
      const ctx = app.mockContext()
      const user = await ctx.service.users.check('mangoguang')
      assert(user)
      assert(user.user_name === 'mangoguang')
    })

    it('should get 用户不存在！ when user not exists', async () => {
      const ctx = app.mockContext();
      const user = await ctx.service.users.check('fengmk1');
      assert(user === '用户不存在！');
    });

    it('should mock fengmk1 exists', function* () {
      const ctx = app.mockContext();
      app.mockService('users', 'check', function* () {
        return {
          user_name: 'fengmk1',
        };
      });
      const user = yield ctx.service.users.check('fengmk1');
      assert(user);
      assert(user.user_name === 'fengmk1');
    });
  })
})