const {succData, errData} = require('../utils/service');

module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next()
      ctx.body = succData(ctx.body)
    } catch (err) {
      // const status = err.response.status
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', err, ctx)

      const status = err.status || 500
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const error = status === 500 && ctx.app.config.env === 'prod'
        ? 'Internal Server Error'
        : err.message

      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = errData(ctx.response.message)
      console.log('---', ctx.response.body.message)
      switch (status) {
        case 401:
          ctx.response.body.message = 'token失效，请重新登录。'
          break
        case 404:
          ctx.body.detail = err.errors
          break
      }
      ctx.status = status
    }
  }
}