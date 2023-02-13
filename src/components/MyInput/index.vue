<template>
  <div class="input-container">
    <div class="input">
      <input
        v-if="type === 'tel'"
        ref="input"
        v-model="inputVal"
        :class="className"
        :type="type"
        :placeholder="placeholder"
        :maxlength="maxlength"
        oninput="value = value.replace(/\D/g, '')"
        @focus="onFocus"
        @blur="onBlur"
      >
      <input
        v-else
        ref="input"
        v-model="inputVal"
        :class="className"
        :type="type"
        :placeholder="placeholder"
        :maxlength="maxlength"
        @focus="onFocus"
        @blur="onBlur"
      >
      <div v-if="icon" class="input_icon" @click="isShowPwd">
        <FontIcon v-show="isIcon" name="icon-yanjing_yincang_o" />
        <FontIcon v-show="!isIcon" name="icon-yanjing_xianshi_o" />
      </div>
    </div>
  </div>
</template>

<script>
import FontIcon from '@/components/FontIcon'
export default {
  components: { FontIcon },
  props: {
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'tel'
    },
    placeholder: {
      type: String,
      default: ''
    },
    maxlength: {
      type: Number,
      default: 20
    },
    className: {
      type: String,
      default: 'common'
    },
    icon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isIcon: true
    }
  },
  computed: {
    inputVal: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('inputVal', value)
      }
    }
  },
  mounted() {
    if (this.type === 'tel') {
      this.$refs['input'].setAttribute('pattern', '[0-9]{11}')
    } else if (this.type === 'code') {
      this.$refs['input'].setAttribute('pattern', '[0-9]{4}')
    }
  },
  methods: {
    // 密码的显示和隐藏
    isShowPwd() {
      this.isIcon = !this.isIcon
      this.$bus.$emit('isShowPwd', this.isIcon)
    },
    onFocus() {
      this.$emit('onFocu', true)
    },
    // 失焦
    onBlur() {
      this.$emit('onBlur')
    },
    changeFoucs() {
      this.$refs.input.focus()
    }
  }
}
</script>

<style scoped lang="scss">
.input {
  border-radius: 6px;
  input {
    width: 100%;
    height: 50px;
    padding: 14px 16px;
    background: #f7f7f9;
    border: 1px solid transparent;
    box-sizing: border-box;
    outline: none;
    // color: var(--color-text);
    border-radius: 6px;
    transition: all 0.25s ease-in-out;
    position: relative;
  }
  input::-webkit-input-placeholder {
    color: var(--color-secondary);
    font-size: 16px;
  }
}
.primary {
  border: 1px solid var(--color-primary) !important;
}
.error {
  border: 1px solid var(--color-danger) !important;
}
.input_icon {
  position: absolute;
  right: 11px;
  top: 83px;
  > i {
    font-size: 20px !important;
  }
}
</style>
