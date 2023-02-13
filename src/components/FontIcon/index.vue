<template>
  <i class="iconfont" :class="`${name}`" aria-hidden="true" />
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/assets/fonts/iconfont.css';
</style>
