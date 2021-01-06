'use strict';

module.exports = {
  deleteDictByIdResponse: {
    data: { type: 'string', description: '返回结果' },
  },
  getDictListByDictTypeResponse: {
    data: { type: 'array', itemType: 'dictionary', description: '字典代码' },
  },
};