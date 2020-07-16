// app/router.js
module.exports = app => {
  const { router, controller, jwt, io } = app;
  router.get('/', controller.users.login);
  // router.post('/user', jwt, controller.user.index);
  router.get('/api/login/:userName', controller.users.login);
  router.resources('users', '/api/v1/users', jwt, controller.users);
  router.get('/api/v1/users/check/:userName', controller.users.check);

  // io路由
  // io.of('/').route('server', io.controller.home.server);
};