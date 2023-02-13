<template>
  <div class="app-container">
    <div class="right-content">
      <div class="title">
        <img src="@/assets/images/title.png" alt="coal_music">
        <h1>Coal</h1>
      </div>
      <div class="desc">
        <h2>新一代的音乐播放器</h2>
        <p>Coal，一键设置主题，使用VARLST，拥有更加丝滑的动画和现代化样式</p>
      </div>
    </div>
    <div class="left-content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login'
}
</script>

<style>
.left-content {
  position: relative;
  align-items: center;
}
</style>

<style lang="scss" scoped>
@media screen and (min-width: 762px) {
  .app-container {
    width: 100%;
    height: 100%;
    min-width: 320px;
    min-height: 100vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: var(--color-body-bg);
    .right-content {
      width: 445px;
      margin-right: 150px;
      .title {
        display: flex;
        height: 70px;
        align-items: center;
        margin-bottom: 50px;
        color: var(--color-text);
        cursor: pointer;
        img {
          width: 55px;
          height: 55px;
        }
        h1 {
          color: var(--color-text);
          font-size: 2.5rem;
          font-weight: bold;
          margin-left: 30px;
        }
      }
      .desc {
        h2 {
          color: var(--color-text);
          font-size: 48px;
          margin: 0;
        }
        p {
          font-size: 18px;
          padding-top: 10px;
          width: 370px;
          color: var(--color-secondary);
        }
      }
    }
    .left-content {
      width: 444px;
      height: 520px;
      background: var(--color-body-bg);
      border: 1px solid rgba(19, 18, 43, 0.07);
      box-shadow: 0 22px 50px #d9e0fd5c;
      border-radius: 16px;
      position: relative;
      display: flex;
      justify-content: center;
    }
  }
}
</style>

<style lang="scss" scoped>
@media screen and (max-width: 762px) {
  .app-container {
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 20px;
    .right-content {
      width: 100%;
      .title {
        color: var(--color-text);
        display: flex;
        align-items: center;
        img {
          width: 50px;
          height: 50px;
        }
        h1 {
          color: var(--color-text);
          margin-left: 20px;
          font-size: 2rem;
        }
      }
    }
    .left-content {
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
  }
  .desc {
    display: none;
  }
}
</style>
