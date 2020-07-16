succData = (data = '') => {
  return {
    code : '1',
    data: data,
    message: "成功",
    result: true
  }
}

errData = (message, data = '') => {
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