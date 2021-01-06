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

module.exports = {
  toHump,
  toLine,
  dataToHump,
  dataToLine,
  getDate
}