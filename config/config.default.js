module.exports = {
  keys: 'mangoguang',
  jwt: {
    secret: '123456'
  },
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
}
