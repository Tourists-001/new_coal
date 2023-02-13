<template>
  <div class="headerBar_container">
    <div class="header_title">
      {{ title }}
    </div>
    <div class="header_icon">
      <SvgIcon icon-class="search" class="svg-iocn" />
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
export default {
  components: { SvgIcon },
  computed: {
    title() {
      return this.$route.meta.title || ''
    }
  }
}
</script>

<style scoped lang="scss">
.headerBar_container {
  position: fixed;
  left: 0;
  top: 0;
  height: 50px;
  width: 100%;
  // background-color:;
  padding: 0 30px 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header_title {
    font-size: 20px;
    font-weight: bold;
    color: var(--color-text);
  }
  .header_icon {
    .svg-icon {
      height: 20px;
      width: 20px;
      color: var(--color-text);
      margin: 0 50px 0 0;
    }
  }
}
</style>
