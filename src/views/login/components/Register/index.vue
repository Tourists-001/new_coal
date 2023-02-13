<template>
  <div class="phoneLogin-container">
    <var-card class="card">
      <template #extra>
        <var-tabs :active.sync="active">
          <var-tab name="msgLogin">手机注册</var-tab>
          <var-tab name="pwdLogin">邮箱注册</var-tab>
        </var-tabs>
        <var-tabs-items :active.sync="active" can-swipe>
          <var-tab-item
            style="margin-top: 30px; padding: 0 0px"
            name="msgLogin"
          >
            <Formulate
              ref="validate"
              v-model="phone"
              type="tel"
              name="phone"
              placeholder="请输入手机号"
              :rules="{
                phone: {
                  required: true,
                  tel: true,
                },
              }"
              :messages="{
                phone: {
                  required: '手机号不能为空',
                  tel: '请输入正确的手机号',
                },
              }"
              @inputVal="phone = $event"
            />
            <var-button
              block
              type="primary"
              style="margin-top: 10px; height: 50px; border-radius: 6px"
              @click="goCode"
            >
              <var-loading v-if="isCodeLoaing" type="cube" />
              <span v-else class="btn_span">下一步</span>
            </var-button>
          </var-tab-item>
          <var-tab-item name="pwdLogin" style="margin-top: 30px">
            <Formulate
              ref="validatePwd"
              v-model="pwdLogin.email"
              type="email"
              name="email"
              placeholder="请输入邮箱号"
              :rules="{
                email: {
                  required: true,
                  email: true,
                },
              }"
              :messages="{
                email: {
                  required: '邮箱号不能为空',
                  email: '请输入正确的邮箱号',
                },
              }"
              @inputVal="pwdLogin.email = $event"
            />
            <Formulate
              v-model="pwdLogin.password"
              :type="textPwd"
              name="password"
              placeholder="请输入密码"
              :icon="true"
              @inputVal="pwdLogin.password = $event"
            />
            <var-button
              block
              type="primary"
              style="margin-top: 10px; height: 50px; border-radius: 6px"
              @click="goPwdLogin"
            >
              <var-loading v-if="isPwdLoading" type="cube" />
              <span v-else class="btn_span">下一步</span>
            </var-button>
          </var-tab-item>
        </var-tabs-items>
        <div class="sign-in-by-account--btns">
          <span class="sign-in-by-account--btns__signup">
            <var-radio v-model="isClause">
              阅读并同意
              <span class="hight_text">隐私政策</span>
            </var-radio>
          </span>
          <span
            class="sign-in-by-account--btns__forget"
            @click="$router.push({ name: 'PhoneLogin' })"
          >
            账户登录
          </span>
        </div>
        <div class="sign-in-by-account--third">
          <div class="sign-in-by-account--divider" />
          <span class="text-body1">其他方式</span>
          <div class="sign-in-by-account--divider" />
        </div>
        <var-button text block class="three-party-login">
          <FontIcon name="icon-wangyiyunyinle" class="sign-code-icon" />
          <span class="sign-code-btn">扫码登录</span>
        </var-button>
      </template>
    </var-card>
    <router-view />
  </div>
</template>

<script>
import Formulate from '@/components/Formulate'
import FontIcon from '@/components/FontIcon'
// eslint-disable-next-line no-unused-vars
import { getPhoneCode, isPhoneReg, emailReg } from '@/api/login'
import { Snackbar } from '@varlet-vue2/ui'
export default {
  components: { Formulate, FontIcon, [Snackbar.Component.name]: Snackbar },
  data() {
    return {
      phone: '',
      active: 'msgLogin',
      pwdLogin: {
        email: '',
        password: ''
      },
      textPwd: 'password',
      isCodeLoaing: false,
      isPwdLoading: false,
      isClause: false
    }
  },
  created() {
    this.$bus.$on('isShowPwd', this.hiddenPwd)
  },
  methods: {
    async goCode() {
      if (!this.$refs['validate'].onBlurs()) {
        return
      }
      if (!this.isClause) {
        Snackbar.info('请同意隐私政策')
      }
      // 验证手机号是否被注册
      const res = await isPhoneReg({ phone: this.phone })
      if (res.exist !== -1) {
        Snackbar.info('该手机号已注册')
        return
      }
      const { data } = await getPhoneCode({ phone: this.phone })
      if (data) {
        this.$router.push({
          name: 'inputCode',
          query: {
            phone: this.phone
          }
        })
        this.isLoaing = false
      }
    },
    // 验证手机号是否被注册
    async RegPhone() {
      const res = await isPhoneReg({ phone: this.phone })
      if (res.exist === -1) {
        // 未注册
        return true
      } else {
        Snackbar.info('该手机号已注册')
        return false
      }
    },
    hiddenPwd(item) {
      item ? (this.textPwd = 'password') : (this.textPwd = 'text')
    },
    // 账号密码登录
    async goPwdLogin() {
      if (!this.$refs['validatePwd'].onBlurs()) {
        return
      }
      try {
        const res = await emailReg(this.pwdLogin)
        if (res.data) {
          // !前往主页面
          this.$store.dispatch('user/setToken')
          this.$router.push('/home')
        }
      } catch (err) {
        Snackbar.error('接口错误，请使手机号注册')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.phoneLogin-container {
  .card {
    .btn_span {
      width: 100%;
      height: 50px;
      padding: 14px 0;
      font-size: 16px;
      line-height: 22px;
      text-align: center;
      box-sizing: border-box;
      color: var(--color-bg-btn);
      background: var(--color-primary);
      border-radius: 6px;
      cursor: pointer;
      user-select: none;
      font-weight: 600;
      transition: all 0.25s ease-in-out;
    }
    .sign-in-by-account--btns {
      width: 100%;
      margin-top: 8px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      cursor: default;
      outline: none;
      .sign-in-by-account--btns__signup,
      .sign-in-by-account--btns__forget {
        color: var(--color-secondary);
        font-size: var(--font-size-md);
        line-height: 35px;
        font-weight: 400;
        cursor: pointer;
        ::v-deep .var-icon {
          font-size: 14px !important;
        }
        .hight_text {
          text-decoration: none;
          color: var(--color-primary);
          font-weight: bold;
          cursor: pointer;
        }
      }
    }
    .sign-in-by-account--third {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin: 24px 0 16px;
      cursor: default;
      outline: none;
      .sign-in-by-account--divider {
        width: 112px;
        height: 1px;
        background: var(--color-border);
      }
      span {
        margin: 0 18px;
        color: var(--color-secondary);
        white-space: nowrap;
        font-weight: 400;
        font-size: var(--font-size-sm);
      }
    }
    .three-party-login {
      height: 50px;
      border-radius: 6px;
      border: 1px solid rgba(19, 18, 43, 0.07);
      background-color: var(--color-primary-bt);
      position: relative;
    }
    .sign-code-icon {
      position: absolute;
      top: 12px;
      font-size: 25px;
      // transform: translateZ(0);
    }
    .sign-code-btn {
      cursor: pointer;
      margin-left: 28px;
      font-size: 16px;
      line-height: 50px;
      color: var(--color-text);
    }
  }
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
  }
}
</style>

<style lang="scss" scoped>
@media screen and (min-width: 762px) {
  .phoneLogin-container {
    width: 444px;
    height: 520px;
    background: var(--color-body-bg);
    border: 1px solid rgba(19, 18, 43, 0.07);
    box-shadow: 0 22px 50px #d9e0fd5c;
    border-radius: 16px;
    position: relative;
    display: flex;
    justify-content: center;
    .card {
      width: 384px;
      border: none !important;
      box-shadow: none !important;
      padding: 28px 0 0 0;
      overflow: hidden;
      .var-tab ::v-deep {
        font-size: var(--font-size-lg);
        color: var(--color-text);
      }
    }
  }
}
</style>
<style lang="scss" scoped>
@media screen and (max-width: 762px) {
  .phoneLogin-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    height: 480px;
    border-radius: 16px;
    background: var(--color-body-bg);
  }
  .card {
    box-sizing: border-box;
    border: none !important;
    box-shadow: none !important;
    height: 100%;
    .var-tab ::v-deep {
      font-size: var(--font-size-lg);
      color: var(--color-text);
    }
  }
}
</style>
