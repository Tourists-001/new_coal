import store from '@/store'

const { body } = document
const WIDTH = 992
export default {
  watch: {
    $route(route) {
      if (this.device === 'mobile') {
        store.dispatch('app/toggleHeader', false)
        store.dispatch('app/toggleBottom', true)
      }
    }
  },
  beforeMount() {
    // 监听视口尺寸大小改变事件
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted() {
    const isMobile = this.$_isMobile()
    if (isMobile) {
      store.dispatch('app/toggleDevice', 'mobile')
      store.dispatch('app/toggleHeader', false)
      store.dispatch('app/toggleBottom', true)
    }
  },
  methods: {
    /**
     *
     * 是否为移动端
     */
    $_isMobile() {
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    /**
     * 调整尺寸的处理程序
     */
    $_resizeHandler() {
      if (!document.hidden) {
        // 是否达到移动端触发的要求
        const isMobile = this.$_isMobile()
        store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          store.dispatch('app/toggleHeader', false)
          store.dispatch('app/toggleBottom', true)
        } else {
          store.dispatch('app/toggleHeader', true)
          store.dispatch('app/toggleBottom', false)
        }
      }
    }
  }
}
