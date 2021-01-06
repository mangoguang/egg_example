const createOrderNo = (type) => {
  const date = new Date()
  let orderNo = type ? 'i' : 'p'
  orderNo = `${orderNo}${date.getFullYear()}${filterTime(date.getMonth())}${filterTime(date.getDate())}${filterTime(date.getHours())}${filterTime(date.getMinutes())}${filterTime(date.getSeconds())}`
  // 生成9位随机数
  let str = ''
  for (let i = 0; i < 9; i++) {
    str += parseInt(Math.random() * 10)
  }

  // 小于10补0
  function filterTime (number) {
    if (number < 10) number = '0' + number
    return number
  }
  return orderNo + str
}

module.exports = {
  createOrderNo
}