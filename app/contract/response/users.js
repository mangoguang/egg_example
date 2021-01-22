'use strict';

module.exports = {
  getUsersResponse: {
    users: { type: 'array', itemType: 'user' },
  },
  getUserByIdResponse: {
    id: { type: 'number', description: '用户唯一性id' },
    userName: { type: 'string', description: '用户名称' },
    password: { type: 'string', description: '用户密码' },
    phone: { type: 'string', description: '用户手机' },
    registerTime: { type: 'string', description: '用户注册时间' },
    address: { type: 'string', description: '用户地址' },
    monthQuota: { type: 'number', description: '用户每月限额' },
  },
  getUserInfoByCodeResponse: {
    id: { type: 'string', description: 'id 唯一键' },
  },
  createUsersResponse: {
    id: { type: 'string', description: 'id 唯一键' },
  },
  createUserByCodeResponse: {
    id: { type: 'string', description: 'id 唯一键' },
  },
  checkUsersResponse: {
    id: { type: 'string', description: 'id 唯一键' },
  },
  payInfoResponse: {
    monthQuota: { type: 'number', min: 0, description: '每月额度' },
    dayIncome: { type: 'number', min: 0, description: '今日收入' },
    dayPay: { type: 'number', min: 0, description: '今日支出' },
    weekIncome: { type: 'number', min: 0, description: '本周收入' },
    weekPay: { type: 'number', min: 0, description: '本周支出' },
    monthIncome: { type: 'number', min: 0, description: '本月收入' },
    monthPay: { type: 'number', min: 0, description: '本月支出' },
    yearIncome: { type: 'number', min: 0, description: '今年收入' },
    yearPay: { type: 'number', min: 0, description: '今年支出' },
  },
  setMonthQuotaResponse: {
    msg: { type: 'string', description: '请求结果描述' },
  }
};