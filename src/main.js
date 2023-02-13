
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Varlet from '@varlet-vue2/ui'

// 由于自己的全局会被导入的全局样式覆盖，所以不能使用自动导入的方法使用组件，
import '@varlet-vue2/ui/es/style.js'

// 引入全局样式
import '@/styles/index.scss'
Vue.use(Varlet)
// 全局使用snackbar
import { Snackbar } from '@varlet-vue2/ui'
Vue.use(Snackbar)
Vue.prototype.$Snackbar = Snackbar

import './icons' // icon

// 导入事件总线
import './eventBus'

// 导入过滤器
import '@/utils/filters'
Vue.config.productionTip = false
import VueClipboard from 'vue-clipboard2'

VueClipboard.config.autoSetContainer = true // add this line
Vue.use(VueClipboard)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
