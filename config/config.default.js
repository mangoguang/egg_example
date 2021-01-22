module.exports = {
  keys: 'mangoguang',
  jwt: {
    secret: '123456'
  },
  // cluster: {
  //   listen: {
  //     path: '',
  //     port: 8889,
  //     hostname: '0.0.0.0'
  //   }
  // },
  security: {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    // 允许访问接口的白名单
    domainWhiteList: [
      'http://localhost:8080',
      'http://localhost:8081',
      'http://localhost:8082',
      'http://localhost:8083',
      'http://localhost:8084',
    ],
  },
  middleware: [ 'errorHandler' ],
  // 只对 /api 前缀的 url 路径生效
  errorHandler: {
    match: '/api',
  },
  // io: {
  //   init: { }, // passed to engine.io
  //   namespace: {
  //     '/': {
  //       connectionMiddleware: [],
  //       packetMiddleware: [],
  //     },
  //     '/example': {
  //       connectionMiddleware: [],
  //       packetMiddleware: [],
  //     },
  //   },
  // },
  mysql: {
    // 单数据库信息配置
    client: {
      host: '127.0.0.1',
      port: '3306',
      user: 'root',
      password: 'Admin123.',
      // 数据库名
      database: 'egg_example',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  },
  swaggerdoc: {
    dirScanner: './app/controller',
    apiInfo: {
      title: 'egg-swagger',
      description: 'swagger-ui for egg',
      version: '1.0.0',
    },
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      // apikey: {
      //   type: 'apiKey',
      //   name: 'clientkey',
      //   in: 'header',
      // },
      // oauth2: {
      //   type: 'oauth2',
      //   tokenUrl: 'http://petstore.swagger.io/oauth/dialog',
      //   flow: 'password',
      //   scopes: {
      //     'write:access_token': 'write access_token',
      //     'read:access_token': 'read access_token',
      //   },
      // },
    },
    enableSecurity: false,
    // enableValidate: true,
    routerMap: false,
    enable: true,
  },
  logger: {
    outputJSON: true,
  }
}
