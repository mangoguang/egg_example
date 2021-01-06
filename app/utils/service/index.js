const { dataToHump } = require('../common')
const succData = (data = '') => {
  if (typeof data === 'object') data = dataToHump(data)

  return {
    code : '1',
    data: data,
    message: "成功",
    result: true
  }
}

const errData = (message, data = '') => {
  return {
    code : '0',
    data: data,
    message: message,
    result: false
  }
}

module.exports = {
  succData,
  errData
}