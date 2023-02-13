<template>
  <div class="formulate-container">
    <MyInput
      v-bind="$attrs"
      ref="input"
      :class-name="className"
      v-on="$listeners"
      @onBlur="onBlurs"
      @onFocu="onFocus"
    />
    <span>{{ error }}</span>
  </div>
</template>

<script>
import MyInput from '../MyInput'
import Validate from '@/utils/validate.js'

export default {
  components: {
    MyInput
  },
  props: {
    rules: {
      type: Object,
      // required: true
      default: () => {}
    },
    messages: {
      type: Object,
      // required: true
      default: () => {}
    },
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      error: '',
      type: 'phone',
      flag: false,
      className: 'common'
    }
  },
  mounted() {
    this.className = 'common'
  },
  methods: {
    // 失焦验证
    onBlurs() {
      this.className = 'common'
      if (!(this.messages && this.rules)) {
        return true
      }
      const value = this.$refs['input'].value
      const validate = new Validate(this.rules, this.messages)
      const valItem = {}
      valItem[this.name] = value
      this.flag = validate.checkForm(valItem)
      if (!value) {
        const [{ msg }] = validate.validationErrors(valItem) || ''
        this.error = msg
        return false
      }
      if (!validate.checkForm(valItem)) {
        const [{ msg }] = validate.validationErrors(valItem)
        this.error = msg
        this.className = 'error'
        return false
      }
      this.className = 'primary'
      return true
    },
    // 聚焦修改边框
    onFocus(val) {
      // this.active = true
      this.className = 'primary'
      if (val) {
        this.active = 'primary'
        this.error = ''
      }
    },
    changeFocus() {
      this.$children[0].changeFoucs()
    }
  }
}
</script>

<style scoped lang="scss">
.formulate-container span {
  font-size: var(--font-size-xs);
  color: var(--color-danger);
  height: 19px;
  display: block;
  margin-left: 7px;
}
</style>
