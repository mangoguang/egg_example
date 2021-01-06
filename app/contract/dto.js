'use strict';

module.exports = {
  user: {
    id: { type: 'number', description: '用户唯一性id' },
    userName: { type: 'string', description: '用户名称' },
    password: { type: 'string', description: '用户密码' },
    phone: { type: 'string', description: '用户手机' },
    registerTime: { type: 'string', description: '用户注册时间' },
    address: { type: 'string', description: '用户地址' },
    monthQuota: { type: 'number', description: '用户每月限额' },
    group: { type: 'group', description: '分组' },
  },
  group: {
    id: { type: 'string', description: 'id 唯一键' },
    groupName: { type: 'string', description: '组名' },
  },
  orderDetail: {
    id: { type: 'integer', description: 'id 唯一键' },
    orderNo: { type: 'string', description: '订单号' },
    createTime: { type: 'string', description: '订单创建时间' },
    money: { type: 'number', description: '金额' },
    orderType: { type: 'number', description: '订单类型' }, // 0:支出，1：收入
    levelOneName: { type: 'string', description: '一级分类名称' },
    levelOneCode: { type: 'string', description: '一级分类编码' },
    levelTwoName: { type: 'string', description: '二级分类名称' },
    levelTwoCode: { type: 'string', description: '二级分类编码' },
    userName: { type: 'string', description: '用户名称' },
    userId: { type: 'string', description: '用户id' },
    memberName: { type: 'string', description: '成员名称' },
    memberCode: { type: 'string', description: '成员编码' },
    remark: { type: 'string', description: '备注' },
    accountName: { type: 'string', description: '账号名称' },
    accountCode: { type: 'string', description: '账号编码' },
    imgUrl: { type: 'string', description: '上传的图片链接' },
  },
  dictionary: {
    dictName: { type: 'string', description: '字典代码名称' },
    dictCode: { type: 'string', description: '字典代码编码' },
    id: { type: 'integer', description: 'id 唯一键' },
    childs: { type: 'array', itemType: 'dictChild', description: '下级字典代码' },
  },
  dictChild: {
    dictName: { type: 'string', description: '字典代码名称' },
    dictCode: { type: 'string', description: '字典代码编码' },
  },
};