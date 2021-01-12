const crypto = require('crypto')

/**
 * 传给后端日期格式化
 * @param {*} date 传入日期
 * @param {*} fmt 显示格式
 * reutrn fmt时间格式
 */
const sendDateTime = (date, fmt = 'yyyy-MM-dd hh:mm:ss') => {
  if (!date) return
  // if (fmt === 'yyyy-MM-dd') {
  //   date = `${dateFormat(date)} 23:59:59`
  // } else {
  //   date = dateFormat(date, 'yyyy-MM-dd hh:mm:ss')
  // }
  date = dateFormat(date, 'yyyy-MM-dd hh:mm:ss')
  const timestamp = new Date(date).getTime()
  const zone = 8
  const timeDiff = (8 - zone) * 3600 * 1000
  console.log('初始化数据')
  return dateFormat(timestamp + timeDiff, fmt)
}

/**
 * 时间格式化函数
 * @param {*} date 传入日期
 * @param {*} fmt 显示格式
 */
const dateFormat = (date, fmt = 'yyyy-MM-dd') => {
  if (!date) {
    return ''
  }
  if (typeof date === 'string') {
    date = date.split('+')[0]
    date = date.replace(/T/g, ' ').replace(/-/g, '/')
    date = new Date(date)
  }
  if (typeof date === 'number') {
    date = new Date(date)
  }
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'H+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  var week = { // 星期
    0: '\u65e5',
    1: '\u4e00',
    2: '\u4e8c',
    3: '\u4e09',
    4: '\u56db',
    5: '\u4e94',
    6: '\u516d'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

// 将对象/数组中属性名称为下划线_命名的改成小驼峰命名
const dataToHump = (origin, target) => {
  let tar = null
  // 判断是否为引用数据类型
  const toStr = Object.prototype.toString
  const arrType = '[object Array]'
  if (toStr.call(origin) === arrType) {
    // target是否存在如果不存在创建空对象
    tar = target || []
    // 判断是否为引用数据类型 对象或数组
    for (let i = 0; i < origin.length; i++) {
      if (typeof origin[i] === 'object' && origin[i] !== null) {
        if (toStr.call(origin[i]) === arrType) {
          tar[i] = []
          dataToHump(origin[i], tar[i])
        } else {
          tar[i] = {}
          dataToHump(origin[i], tar[i])
        }
      } else {
        tar[i] = origin[i]
      }
    }
  } else {
    // target是否存在如果不存在创建空对象
    tar = target || {}
    for (const key in origin) {
      // 剥离原型链的数据
      // eslint-disable-next-line no-prototype-builtins
      if (origin.hasOwnProperty(key)) {
        // 判断是否为引用数据类型 对象或数组
        if (typeof (origin[key]) === 'object' && origin[key] !== null) {
          if (toStr.call(origin[key]) === arrType) {
            tar[toHump(key)] = []
            dataToHump(origin[key], tar[toHump(key)])
          } else {
            tar[toHump(key)] = {}
            dataToHump(origin[key], tar[toHump(key)])
          }
        } else {
          tar[toHump(key)] = origin[key]
        }
      }
    }
  }
  return tar
}

// 将对象/数组中属性名称为小驼峰命名的改成下划线_命名
const dataToLine = (origin, target) => {
  let tar = null
  // 判断是否为引用数据类型
  const toStr = Object.prototype.toString
  const arrType = '[object Array]'
  if (toStr.call(origin) === arrType) {
    // target是否存在如果不存在创建空对象
    tar = target || []
    // 判断是否为引用数据类型 对象或数组
    for (let i = 0; i < origin.length; i++) {
      if (typeof origin[i] === 'object' && origin[i] !== null) {
        if (toStr.call(origin[i]) === arrType) {
          tar[i] = []
          dataToLine(origin[i], tar[i])
        } else {
          tar[i] = {}
          dataToLine(origin[i], tar[i])
        }
      } else {
        tar[i] = origin[i]
      }
    }
  } else {
    // target是否存在如果不存在创建空对象
    tar = target || {}
    for (const key in origin) {
      // 剥离原型链的数据
      // eslint-disable-next-line no-prototype-builtins
      if (origin.hasOwnProperty(key)) {
        // 判断是否为引用数据类型 对象或数组
        if (typeof (origin[key]) === 'object' && origin[key] !== null) {
          if (toStr.call(origin[key]) === arrType) {
            tar[toLine(key)] = []
            dataToLine(origin[key], tar[toLine(key)])
          } else {
            tar[toLine(key)] = {}
            dataToLine(origin[key], tar[toLine(key)])
          }
        } else {
          console.log('--------------------------', key, origin[key])
          tar[toLine(key)] = origin[key]
        }
      }
    }
  }
  return tar
}

// 下划线转换驼峰
const toHump = (name) => {
  return name.replace(/_(\w)/g, function (all, letter) {
    return letter.toUpperCase()
  })
}
// 驼峰转换下划线
const toLine = (name) => {
return name.replace(/([A-Z])/g, "_$1").toLowerCase()
}

/**
 * 时间补零函数，时间小于10的补0，使时间格式一致
 * @param {string} date - 时间
 */
const getDate = (date) => {
  function filterDate(str) {
    return str < 10 ? `0${str}` : str
  }
  return `${date.getFullYear()}-${filterDate(date.getMonth() + 1)}-${filterDate(date.getDate())}`
}

const md5 = (Str) => {
  var md5sum = crypto.createHash('md5')
  md5sum.update(new Buffer(Str))
  return md5sum.digest('hex')
}

module.exports = {
  sendDateTime,
  toHump,
  toLine,
  dataToHump,
  dataToLine,
  getDate,
  md5
}