import request from './request'

// 获取手机号的验证码
export const getPhoneCode = (params) => {
  return request({
    url: '/captcha/sent',
    method: 'get',
    params
  })
}

// 验证验证码
export const RegPhoneCode = (params) => {
  return request({
    url: '/captcha/verify',
    method: 'get',
    params
  })
}

// 手机号账号密码登录
export const PhoneLogin = (params) => {
  return request({
    url: '/login/cellphone',
    method: 'get',
    params
  })
}

// 检测手机号是否被注册
export const isPhoneReg = (params) => {
  return request({
    url: '/cellphone/existence/check',
    method: 'get',
    params
  })
}

// 邮箱注册登录
export const emailReg = (params) => {
  return request({
    url: '/login',
    method: 'get',
    params
  })
}

// 获取二维码的key
export const getQrKey = () => {
  return request({
    url: '/login/qr/key',
    method: 'get',
    params: {
      timestamp: new Date().getTime()
    }
  })
}

// 获取二维码
export const createQrimg = (params) => {
  return request({
    url: '/login/qr/create',
    method: 'get',
    params: {
      ...params,
      timestamp: new Date().getTime()
    }
  })
}

// 检测二维码的状态
export const checkQrStatus = (key) => {
  return request({
    url: '/login/qr/check',
    method: 'get',
    params: {
      key,
      timestamp: new Date().getTime()
    }
  })
}

