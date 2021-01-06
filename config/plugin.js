'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  swaggerdoc: {
    enable: true,
    package: 'egg-swagger-doc',
  }
  // io: {
  //   enable: true,
  //   package: 'egg-socket.io',
  // },
};