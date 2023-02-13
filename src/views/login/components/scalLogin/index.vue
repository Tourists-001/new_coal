<template>
  <div class="scallogin_container">
    <var-loading type="circle" :loading="loadCode" color="#2979ff">
      <img :src="qrCodeSvg" class="code_img">
    </var-loading>
    <div v-show="isMask" class="loading_exception">
      <div class="mask_loading" />
      <div class="btn_text">
        <span>二维码已失效</span>
        <var-button type="primary" class="btn" @click="getQrimg">
          请点击刷新
        </var-button>
      </div>
    </div>
    <div class="wangyiyun_login">
      <FontIcon
        name="icon-wangyiyunyinle"
        style="
           {
            width: 24px;
            height: 24px;
            font-size: 20px;
            text-align: center;
            line-height: 24px;
          }
        "
      />
      <span class="wangyiyun">网易云安全登录</span>
    </div>
    <span class="register_user" @click="$router.push({ name: 'Register' })">
      注册账号
    </span>
  </div>
</template>

<script>
import FontIcon from '@/components/FontIcon'
import { getQrKey, checkQrStatus } from '@/api/login'
import QRCode from 'qrcode'
import errorPng from '@/assets/images/imgerror.png'
export default {
  components: { FontIcon },
  data() {
    return {
      qrCodeSvg: require('@/assets/images/qr.png'),
      qrCodeCheckInterva: null,
      loadCode: true,
      isMask: false
    }
  },
  created() {
    this.getQrimg()
  },
  beforeDestroy() {
    // 清除定时器
    clearInterval(this.qrCodeCheckInterva)
  },
  methods: {
    async getQrimg() {
      const { data } = await getQrKey()
      if (data.code !== 200) return
      this.unikey = data.unikey
      // 由于CORB的限制,我们无法直接获取到图片,所以做一些修改,把图片的http路径变为base64
      QRCode.toString(`https://music.163.com/login?codekey=${this.unikey}`, {
        width: 164,
        height: 164,
        margin: 0,
        color: {
          dark: '#335eea',
          light: '#00000000'
        },
        type: 'svg'
      })
        .then((svg) => {
          this.qrCodeSvg = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
          this.loadCode = false
        })
        .catch((err) => {
          console.error(err)
          this.qrCodeSvg = errorPng
        })
      // 轮询
      this.checkQrCodeLogin()
    },
    checkQrCodeLogin() {
      this.qrCodeCheckInterva = setInterval(async() => {
        if (this.unikey === '') return
        const res = await checkQrStatus(this.unikey)
        if (res.code === 800) {
          // 二维码过期
          this.isMask = true
        } else if (res.code === 802) {
          this.$Snackbar({
            content: '扫描成功，请在手机上确认登录',
            type: 'info',
            duration: 1000 * 2
          })
        } else if (res.code === 803) {
          clearInterval(this.qrCodeCheckInterval)
          this.$Snackbar({
            content: '登录成功，请稍等...',
            type: 'info',
            duration: 1000 * 2
          })
          this.$store.dispatch('user/setToken')
          this.$store.dispatch('user/setAccount')
          this.$router.push('/home')
          clearInterval(this.qrCodeCheckInterva)
        }
      }, 1000 * 2)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
.scallogin_container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  .loading_exception {
    width: 180px;
    height: 180px;
    @include position-center($type: xy);
    top: 35%;
    .mask_loading {
      width: 180px;
      height: 180px;
      background-color: rgba(255, 255, 255, 0.9);
    }
    .btn_text {
      width: 150px;
      @include position-center($type: xy);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      > span {
        font-size: 20px;
        line-height: 28px;
        font-weight: 600;
        color: var(--color-text);
        margin-bottom: 10px;
      }
      .btn {
        width: 100%;
        font-size: 16px;
        line-height: 22px;
        font-weight: 600;
      }
    }
  }
  .wangyiyun_login {
    margin-top: 20px;
    color: var(--color-text);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .wangyiyun {
      margin-left: 9.5px;
      font-size: 16px;
      line-height: 22px;
      font-weight: bold;
    }
  }
  .register_user {
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    color: var(--color-primary);
    cursor: pointer;
    margin-top: 30px;
  }
}
</style>
