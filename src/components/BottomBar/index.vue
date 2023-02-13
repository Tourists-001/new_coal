<template>
  <div class="bottomBar_container">

    <div class="bottom_bar_content">
      <div
        v-for="item in barList"
        :key="item.icon"
        class="bottom_bar_item"
        :class="{ active: item.path === path }"
        @click="changePage(item.path)"
      >
        <SvgIcon
          :icon-class="item.path === path ? item.iconBg : item.icon"
          class="svg-iocn"
        />
        <span class="name">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
export default {
  components: { SvgIcon },
  data() {
    return {
      barList: [
        {
          icon: 'music',
          name: '首页',
          path: 'Home',
          iconBg: 'music_p'
        },
        {
          icon: 'radio',
          name: '发现',
          path: 'Explore',
          iconBg: 'radio_p'
        },
        {
          icon: 'user',
          name: '我的',
          path: 'Library',
          iconBg: 'user_p'
        }
      ],
      path: 'Home'
    }
  },
  methods: {
    changePage(name) {
      this.path = name
      this.$router.push({ name })
    }
  }
}
</script>

<style scoped lang="scss">
.bottomBar_container {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: var(--color-body-bg);
  .bottom_bar_content {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding-bottom: 7px;
    .bottom_bar_item {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .svg-iocn {
        width: 24px;
        height: 24px;
        font-size: 24px;
        padding-bottom: 2px;
        color: var(--color-text);
      }
      .name {
        font-size: 12px;
      }
    }
    .active {
      // background-color: ;
      color: var(--color-primary);
      transform: scale(0.92);
      transition: 0.2s;
    }
  }
}
</style>
