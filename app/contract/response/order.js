'use strict';

module.exports = {
  getOrderByIdResponse: {
    id: { type: 'string', description: 'id 唯一键' },
    groupName: { type: 'string', description: '组名' },
  },
  getOrderDetailByIdResponse: {
    data: { type: 'string', description: '请求成功' },
  },
  createOrderResponse: {
    data: { type: 'string', description: '请求成功' },
  },
  deleteOrderByIdResponse: {
    data: { type: 'string', description: '请求成功' },
  },
  getOrderByTimeTervalResponse: {
    date: { type: 'string', description: '日期' },
    list: { type: 'array', itemType: 'orderDetail', description: '订单列表' },
    surplus: { type: 'string', description: '结余' },
    income: { type: 'number', description: '收入' },
    pay: { type: 'number', description: '支出' },
  },
  updateOrderByIdResponse: {
    data: { type: 'string', description: '更新结果' },
  }
};