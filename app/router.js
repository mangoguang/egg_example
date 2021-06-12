// app/router.js
module.exports = app => {
  const { router, controller, jwt, io } = app
  router.get('/', controller.users.login)

  // 用户相关接口
  // router.post('/user', jwt, controller.user.index);
  router.get('/api/login/:userName', controller.users.login)
  router.resources('users', '/api/v1/users', jwt, controller.users)
  router.get('/api/v1/users/check/:userName', controller.users.check)
  router.post('/api/v1/users/payInfo', jwt, controller.users.payInfo)
  router.post('/api/v1/users/getUserInfoByCode', controller.users.userInfo)
  router.post('/api/v1/users/createUserByCode', controller.users.createUserByCode)
  router.post('/api/v1/users/setMonthQuota', jwt, controller.users.setMonthQuota)

  // 数据字典路由
  router.resources('dict', '/api/v1/dict', jwt, controller.dictionary)
  router.get('/api/v1/dict/list/:dictType', jwt, controller.dictionary.list)

  // 收支记录
  router.resources('order', '/api/v1/order', jwt, controller.order)
  router.post('/api/v1/order/list/', jwt, controller.order.list)
  router.post('/api/v1/order/getOrdersBySearch/', jwt, controller.order.getOrdersBySearch)

  // 牌局
  router.resources('mahjong', '/api/v1/mahjong', jwt, controller.mahjong)
  router.post('/api/v1/mahjong/list/', jwt, controller.mahjong.list)

  // 文件
  router.resources('file', '/api/v1/file', jwt, controller.file)

  // io路由
  // io.of('/').route('server', io.controller.home.server);

  // 通用接口
  router.get('/api/v1/common/code2Session', controller.common.code2Session)
};