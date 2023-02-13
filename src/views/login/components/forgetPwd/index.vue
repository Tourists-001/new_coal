<template>
  <div class="forget-container">
    <div class="input-code-box--return-btn" @click="$router.go(-1)">
      <FontIcon name="icon-fanhuijiantou" />
      <span>返回</span>
    </div>
    <div class="box-title">忘记密码</div>
    <Formulate
      ref="validate"
      v-model="value"
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
      @inputVal="value = $event"
    />
    <var-button
      block
      type="primary"
      style="margin-top: 30px; height: 50px; border-radius: 6px"
      @click="goCode"
    >
      <var-loading v-if="isLoaing" type="cube" />
      <span v-else class="btn_span">下一步</span>
    </var-button>
  </div>
</template>

<script>
import Formulate from '@/components/Formulate'
import FontIcon from '@/components/FontIcon'
import { getPhoneCode } from '@/api/login'
export default {
  components: { Formulate, FontIcon },
  data() {
    return {
      value: '',
      isLoaing: false
    }
  },
  methods: {
    async goCode() {
      this.isLoaing = true
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
    }
  }
}
</script>

<style lang="scss" scoped>
.forget-container {
  width: 380px;
  padding: 71px 30px 123px;
  position: initial !important;
  .input-code-box--return-btn {
    position: absolute;
    top: 28px;
    left: 32px;
    display: flex;
    align-items: center;
    padding: 0 10px 0 5px;
    height: 28px;
    border-radius: 6px;
    // margin-left: -8px;
    cursor: pointer;
    color: var(--color-text);
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    &:hover {
      background-color: #eee;
    }
    span {
      color: var(--color-text-dark);
    }
  }
  .box-title {
    font-weight: bold;
    font-size: 28px;
    line-height: 100%;
    color: var(--color-text);
    text-align: center;
    padding: 11px 0;
    margin-bottom: 24px;
  }
}
</style>

<style>
@media screen and (min-width: 762px) {
  .forget-container {
    width: 300px !important;
  }
}
</style>
