import axios from 'axios'
import { Snackbar } from '@varlet-vue2/ui'
// ! 开始并不知道响应体的类型，无法做请求拦截，先不写
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
  withCredentials: true
})
service.interceptors.response.use((response) => {
  const code = [800, 801, 802, 801]
  const res = response.data
  if (code.indexOf(res.code) !== -1) return res
  if (res.code !== 200) {
    Snackbar({
      content: res.message || 'Error',
      type: 'error',
      duration: 1000 * 3
    })
  }
  return res
}, error => {
  console.log('err' + error) // for debug
  Snackbar({
    message: error.message || '网络错误',
    type: 'error',
    duration: 3 * 1000
  })
  return Promise.reject(error)
})

export default service
