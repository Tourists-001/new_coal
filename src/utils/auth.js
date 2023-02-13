import Cookies from 'js-cookie'
import store from '@/store'
export function getCookie(key) {
  return Cookies.get(key) ?? localStorage.getItem(`cookie-${key}`)
}
export function setCookies(string) {
  const cookies = string.split(';;')
  cookies.map(cookie => {
    document.cookie = cookie
    const cookieKeyValue = cookie.split(';')[0].split('=')
    localStorage.setItem(`cookie-${cookieKeyValue[0]}`, cookieKeyValue[1])
  })
}
// 账号登录
export function isAccountLoggedIn() {
  return (
    getCookie('MUSIC_U') !== undefined &&
    store.state.user.account !== {}
  )
}
