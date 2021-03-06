module.exports = {
    cluster: {
        listen: {
            path: '',
            port: 8888,
            hostname: '0.0.0.0'
        }
    },
    mysql: {
      // 单数据库信息配置
      client: {
        // host
        host: '127.0.0.1',
        // 端口号
        port: '3306',
        // 用户名
        user: 'root',
        // 密码
        password: 'Admin123.',
        // 数据库名
        database: 'egg_example',
      },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    }
  };