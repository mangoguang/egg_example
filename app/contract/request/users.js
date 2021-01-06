'use strict';

module.exports = {
  getUserRequest: {
    id: { type: 'number', required: true, description: '用户唯一性id' },
    
    // sexy: { type: 'string', required: true, enum: ['male', 'female'], description: '用户性别' },
    // age: { type: 'integer', required: true, min: 1, description: '年龄' },
    // group: { type: 'integer', required: true, min: 1, description: '组别' },
    // isLeader: { type: 'boolean', required: true, description: '是否小组负责人' },
    // email: { type: 'string', required: false, example: '952766532@qq.com', format: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, description: '邮箱' },
    // phoneNumber: { type: 'string', required: false, example: '18801731528', format: /^1[34578]\d{9}$/, description: '电话' },
  },
  createUserRequest: {
    password: { type: 'string', required: true, description: '用户密码' },
    address :{ type: 'string', required: true, description: '用户地址' },
    userName :{ type: 'string', required: true, description: '用户名称' },
    phone :{ type: 'string', required: true, description: '用户手机' },
  },
  createUserByCodeRequest: {
    address :{ type: 'string', required: false, description: '用户地址' },
    phone :{ type: 'string', required: false, description: '用户手机' },
    jscode: { type: 'string', required: true, description: '微信jscode' },
    nickName: { type: 'string', required: true, description: '微信昵称' },
    avatarUrl: { type: 'string', required: true, description: '微信头像链接' },
    gender: { type: 'number', required: false, description: '性别' }
  }
};