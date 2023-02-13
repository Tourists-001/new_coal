import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({ showSpinner: false }) // NProgress Configuration
// import getPageTitle from '@/utils/get-page-title'
// import { getToken } from '@/utils/token'
Vue.use(VueRouter)

// 重写push方法, 高版本的router在多次点击的时候控制台会报错，通过重写push和replace方法，在控制台上屏蔽错误
const originPush = VueRouter.prototype.push
const originReplace = VueRouter.prototype.replace
VueRouter.prototype.push = function(location, resolve, reject) {
  if (resolve && reject) {
    originPush.call(this, location, resolve, reject)
  } else {
    originPush.call(this, location, () => {}, () => {
      // console.log(e)
    })
  }
}
VueRouter.prototype.replace = function(location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject)
  } else {
    originReplace.call(this, location, () => {}, () => {
      // console.log(e)
    })
  }
}

const router = new VueRouter({
  // history: createWebHashHistory(),
  mode: 'history',
  routes
  // scrollBehavior(to, from, savedPosition) {
  //   // return new Promise((resolve, reject) => {
  //   //   setTimeout(() => {
  //   //     resolve({ left: 0, top: 100 })
  //   //   }, 500)
  //   // })
  // }
})
// 可以进入验证码页面的路由
// const whiteSpace = ['PhoneLogin', 'Register', 'ForgetPwd']
// // 路由守卫
// router.beforeEach((to, from, next) => {
//   // 进度条
//   NProgress.start()
//   if (to.name === 'inputCode' && whiteSpace.indexOf(from.name) !== -1) {
//     next()
//   }

//   document.title = getPageTitle(to.meta.title)
//   // 通过token判断是否登录
//   const token = getToken()
//   if (to.meta.isRequired) {
//     // 进入需要登陆的页面
//     if (token) {
//       next()
//       NProgress.done()
//     } else {
//       next({ path: '/login' })
//       NProgress.done()
//     }
//   } else {
//     // 进入不需要登录的页面
//     next()
//   }
// })

// 确保进度条加载完成
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

export default router
