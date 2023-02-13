<template>
  <div class="input-code">
    <div class="input-code-box--return-btn" @click="$router.go(-1)">
      <FontIcon name="icon-fanhuijiantou" />
      <span>返回</span>
    </div>
    <div class="box-title">输入验证码</div>
    <div class="input-code-box--tip">已发送至{{ phoneCode.phone || '' }}</div>
    <div ref="codeGroup" class="input-code-group">
      <Formulate
        ref="a"
        v-model="code.a"
        :maxlength="1"
        type="code"
        name="number"
        @inputVal="inputVal('a', 'b', $event)"
      />
      <Formulate
        ref="b"
        v-model="code.b"
        :maxlength="1"
        type="code"
        name="number"
        @inputVal="inputVal('b', 'c', $event)"
      />
      <Formulate
        ref="c"
        v-model="code.c"
        :maxlength="1"
        type="code"
        name="number"
        @inputVal="inputVal('c', 'd', $event)"
      />
      <Formulate
        ref="d"
        v-model="code.d"
        :maxlength="1"
        type="code"
        name="number"
        @inputVal="inputVal('d', ' ', $event)"
      />
    </div>
    <div v-if="isSendCodeShow" class="set-out-time">{{ time }}s后重新获取</div>
    <div v-else class="reacquire" @click="getPhoneCode">重新获取</div>
  </div>
</template>

<script>
import Formulate from '@/components/Formulate'
import FontIcon from '@/components/FontIcon'
import { RegPhoneCode, getPhoneCode } from '@/api/login'
export default {
  components: { Formulate, FontIcon },
  data() {
    return {
      phone: '',
      code: {
        a: '',
        b: '',
        c: '',
        d: ''
      },
      refDom: '',
      phoneCode: {},
      time: 60,
      timer: null,
      isSendCodeShow: true
    }
  },
  watch: {
    code: {
      handler(oldVal, newVal) {
        if (Object.keys(newVal).filter((v) => !newVal[v]).length <= 0) {
          const code = Object.values(newVal).reduce((p, c) => p + c)
          this.$set(this.phoneCode, 'captcha', code)
          this.RegCode()
        }
      },
      deep: true
    }
  },
  created() {
    this.countDown()
    const { phone } = this.$route.query || ''
    if (phone) {
      this.phone = phone
      this.$set(this.phoneCode, 'phone', phone)
    } else {
      this.$router.replace('/404')
    }
  },
  mounted() {
    this.$refs['codeGroup'].addEventListener('keydown', (e) => {
      if (e.keyCode === 8) {
        const arr = ['a', 'b', 'c', 'd']
        this.$refs[arr[this.refDom] || '0'].changeFocus()
        this.refDom = this.refDom - 1 <= -1 ? '0' : this.refDom - 1
      }
    })
  },
  beforeDestroy() {
    clearTimeout(this.timer)
    this.$refs['codeGroup'].removeEventListener('keydown', (e) => {
      if (e.keyCode === 8) {
        const arr = ['a', 'b', 'c', 'd']
        this.$refs[arr[this.refDom] || '0'].changeFocus()
        this.refDom = this.refDom - 1 <= -1 ? '0' : this.refDom - 1
      }
    })
  },
  methods: {
    inputVal(key, ref, value) {
      // this.code[key] = value
      this.$set(this.code, key, value)
      if (this.code[key] === '') {
        return
      }
      const arr = ['a', 'b', 'c', 'd']
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === ref) {
          this.$refs[ref].changeFocus()
          this.refDom = i
          break
        }
      }
    },
    // 验证验证码是否正确
    async RegCode() {
      // console.log(this.phoneCode)
      const res = await RegPhoneCode(this.phoneCode)
      if (res.data) {
        // 去其页面
        console.log('前往其他页面')
        // 本地和vuex 存储token
        this.$store.dispatch('user/setToken')
        this.$router.push('/home')
      }
    },
    // 倒计时
    countDown() {
      this.timer = setInterval(() => {
        this.time--
        if (this.time < 0) {
          clearTimeout(this.timer)
          this.isSendCodeShow = false
        }
      }, 1000)
    },
    // 重新获取验证码
    async getPhoneCode() {
      const { data } = await getPhoneCode({ phone: this.phone })
      if (data) {
        this.isSendCodeShow = true
        this.time = 60
        this.countDown()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.input-code {
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .input-code-box--return-btn {
    position: absolute;
    top: 28px;
    left: 32px;
    display: flex;
    align-items: center;
    padding-right: 10px;
    height: 28px;
    border-radius: 6px;
    margin-left: -8px;
    cursor: pointer;
    color: var(--color-text);
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    span {
      color: var(--color-text-dark);
    }
  }
  .box-title {
    // margin-top: 110px;
    font-weight: bold;
    font-size: 28px;
    line-height: 100%;
    color: var(--color-text);
    text-align: center;
    padding: 11px 0;
    margin-bottom: 24px;
  }
  .input-code-box--tip {
    margin-bottom: 24px;
    color: var(--color-text-dark);
  }
  .input-code-group {
    display: flex;
    > div {
      width: 43px;
      margin: 10px;
    }
  }
  .reacquire {
    font-size: var(--font-size-md);
    margin: 24px 0;
    color: var(--color-primary);
    cursor: pointer;
    // line-height: 16px;
    font-weight: 600;
  }
}
</style>
