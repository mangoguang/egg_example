'use strict';

module.exports = {
  getOrderByIdRequest: {
    id: { type: 'number', required: true, min: 0, description: '订单id' },
  },

  updateUserRequest: {
    group: { type: 'integer', required: true, min: 1, description: '组别' },
    email: { type: 'string', required: false, format: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, description: '邮箱' },
    phoneNumber: { type: 'string', required: false, format: /^1[34578]\d{9}$/, description: '电话' },
  },
  createOrderRequest: {
    classifyType: { type: 'string', required: true, description: '分类' },
    accountType: { type: 'string', required: true, description: '账户' },
    memberType: { type: 'string', required: false, description: '成员' },
    date: { type: 'string', required: true, description: '日期' },
    money: { type: 'number', required: true, description: '金额' },
    remark: { type: 'string', required: false, description: '备注' },
    orderType: { type: 'number', required: true, enum: [0, 1], description: '订单类型，收入或支出' }, // 0:支出，1：收入
    imgUrl: { type: 'string', required: false, description: '上传的图片链接' },
  },
  getOrderByTimeTervalRequest: {
    startTime: { type: 'string', required: true, description: '开始时间' },
    endTime: { type: 'string', required: true, description: '结束时间' },
    limit: { type: 'number', required: true, description: '每页请求的数量' },
    page: { type: 'number', required: true, description: '页数' },
  },
  updateOrderRequest: {
    levelOneCode: { type: 'string', description: '一级分类编码' },
    levelOneName: { type: 'string', description: '一级分类名称' },
    levelTwoCode: { type: 'string', description: '二级分类编码' },
    levelTwoName: { type: 'string', description: '二级分类名称' },
    memberCode: { type: 'string', description: '成员编码' },
    memberName: { type: 'string', description: '成员名称' },
    money: { type: 'string', description: '金额' },
    remark: { type: 'string', description: '备注' }
  },
  getOrdersBySearchRequest: {
    startTime: { type: 'string', description: '开始时间' },
    endTime: { type: 'string', description: '结束时间' },
    orderType: { type: 'string', description: '订单类型' },
    memberName: { type: 'number', description: '成员名称' },
    levelOneName: { type: 'string', description: '一级分类名称' },
    levelTwoName: { type: 'string', description: '二级分类名称' },
    accountName: { type: 'string', description: '账户类型名称' },
    projectName: { type: 'string', description: '项目名称' },
  }
};