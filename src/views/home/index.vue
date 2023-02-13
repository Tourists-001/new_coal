<template>
  <div class="home_container">
    <pcHome v-if="isShowHeader" />
    <phHome v-else />
  </div>
</template>

<script>
import pcHome from './components/pcHome.vue'
import phHome from './components/phHome.vue'
export default {
  components: { pcHome, phHome },
  computed: {
    isShowHeader() {
      return this.$store.getters['app/isShowHeader']
    },
    isShowBottom() {
      return this.$store.getters['app/isShowBottom']
    }
  }
}
</script>

<style></style>
