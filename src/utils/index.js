// 存储localStorage
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

// 获取localStorage
export const getStore = (name) => {
  if (!name) return
  let content = window.localStorage.getItem(name)
  if (typeof content === 'string') {
    content = JSON.parse(content)
  }
  return content
}

// 删除localStorage
export const removeStore = (name) => {
  if (!name) return
  window.localStorage.removeItem(name)
}

// 深克隆
export const cloneDeep = function(obj) {
  if (obj === null) return null
  if (obj.constructor !== 'object') return obj
  if (obj.constructor === Date) return new Date(obj)
  if (obj.constructor === RegExp) return new RegExp(obj)
  var newObj = new obj.constructor() // 保持继承的原型
  for (var key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      var val = obj[key]
      // eslint-disable-next-line no-caller
      newObj[key] = typeof val === 'object' ? arguments.callee(val) : val
    }
  }
  return newObj
}

export function debounce(func, wait) {
  let timeout
  return function() {
    const context = this // 保存this指向
    const args = arguments // 拿到event对象
    clearTimeout(timeout)
    timeout = setTimeout(function() {
      func.apply(context, args)
    }, wait)
  }
}
