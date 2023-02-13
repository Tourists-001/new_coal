<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <div class="header_container">
    <div class="header_direction">
      <Button-icon class="button-icon" @click.native="go('back')">
        <SvgIcon icon-class="arrow-left" class="svg-iocn" />
      </Button-icon>
      <Button-icon class="button-icon" @click.native="go('forward')">
        <SvgIcon icon-class="arrow-right" class="svg-iocn" />
      </Button-icon>
    </div>
    <div class="header_sidebar">
      <var-tabs :active.sync="active" indicator-size="0" @change="changSider">
        <var-tab name="Home" class="var_tab">首页</var-tab>
        <var-tab name="Explore" class="var_tab">发现</var-tab>
        <var-tab name="Library" class="var_tab">音乐库</var-tab>
      </var-tabs>
    </div>
    <div class="right-part">
      <div class="search-box">
        <div class="container" :class="{ active: inputFocus }">
          <SvgIcon icon-class="search" class="svg-iocn" />
          <div class="input">
            <input
              ref="searchInput"
              v-model="keywords"
              type="search"
              :placeholder="inputFocus ? '' : '搜索'"
              @keydown.enter="doSearch"
              @focus="inputFocus = true"
              @blur="inputFocus = false"
            >
          </div>
        </div>
      </div>
      <div class="avatar_content" @click="showUserProfileMenu">
        <img :src="imgSrc" alt="">
      </div>
    </div>
    <ContextMenu ref="userProfileMenu">
      <div class="item" @click="toSettings">
        <svg-icon icon-class="settings" />
        设置
      </div>
      <div class="item" @click="logout">
        <svg-icon icon-class="logout" />
        登出
      </div>
      <hr>
      <div class="item" @click="toGitHub">
        <svg-icon icon-class="github" />
        GitHub
      </div>
    </ContextMenu>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
import ButtonIcon from '@/components/ButtonIcon'
import ContextMenu from '@/components/ContextMenu'
import { mapActions } from 'vuex'

export default {
  name: 'Header',
  components: { SvgIcon, ButtonIcon, ContextMenu },
  data() {
    return {
      active: 'Home',
      inputFocus: false,
      keywords: null
      // imgSrc: 'http://s4.music.126.net/style/web2/img/default/default_avatar.jpg?param=60y60'
    }
  },
  computed: {
    profile() {
      return this.$store.getters['user/profile']
      // return 's'
    },
    imgSrc() {
      if (
        this.$store.getters['user/avatar'] ||
        JSON.parse(localStorage.getItem('PROFILE')).avatarUrl
      ) {
        let src = ''
        // eslint-disable-next-line no-unused-vars
        src =
          JSON.parse(localStorage.getItem('PROFILE')).avatarUrl ||
          this.$store.getters['user/avatar'] ||
          'http://s4.music.126.net/style/web2/img/default/default_avatar.jpg?param=60y60'
        return src
      }
      return 'http://s4.music.126.net/style/web2/img/default/default_avatar.jpg?param=60y60'
    }
  },
  watch: {
    $route(newVal, oldVal) {
      this.active = newVal.name
    }
  },
  created() {
    if (this.profile) {
      return
    }
    this.$store.dispatch('user/setAccount')
  },
  methods: {
    ...mapActions('user', ['logOut']),
    go(where) {
      if (where === 'back') this.$router.go(-1)
      else this.$router.go(1)
    },
    changSider() {
      this.$router.push({
        name: this.active
      })
    },
    showUserProfileMenu(e) {
      this.$refs['userProfileMenu'].openMenu(e)
    },
    toSettings() {
      this.$router.push({ name: 'settings' })
    },
    logout() {
      this.logOut()
      this.$router.push({ name: 'Login' })
    },
    toGitHub() {},
    doSearch() {
      if (!this.keywords) return
      if (
        this.$route.name === 'search' &&
        this.$route.params.keywords === this.keywords
      ) {
        return
      }
      this.$router.push({
        name: 'search',
        params: { keywords: this.keywords }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.header_container {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding-right: 10vw;
  padding-left: 10vw;
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
  background-color: var(--color-navbar-bg);
  z-index: 100;
  .header_direction {
    flex: 1;
    display: flex;
    align-items: center;
    .button-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 8px;
      background: transparent;
      margin: 4px;
      border-radius: 25%;
      transition: 0.2s;
      .svg-icon {
        height: 24px;
        width: 24px;
        color: var(--color-text);
      }
      &:hover {
        background: var(--color-secondary-bg-for-transparent);
      }
    }
  }
  .header_sidebar {
    flex: 1;
    display: flex;
    justify-content: center;
    text-transform: uppercase;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    ::v-deep .var-tabs {
      // backdrop-filter: saturate(180%) blur(20px);
      background-color: inherit;
    }
    .var_tab {
      font-size: 18px;
      font-weight: 700;
      text-decoration: none;
      border-radius: 6px;
      padding: 6px 10px;
      color: var(--color-text);
      transition: 0.2s;
      -webkit-user-drag: none;
      margin-right: 12px;
      margin-left: 12px;
      &.var-tab--active {
        color: var(--color-primary);
      }
      &:hover {
        background: var(--color-secondary-bg-for-transparent);
      }
      &:active {
        transform: scale(0.92);
        transition: 0.2s;
      }
    }
    a.active {
      color: var(--color-primary);
    }
  }
  .right-part {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .search-box {
      display: flex;
      justify-content: flex-end;
      .container {
        display: flex;
        align-items: center;
        height: 32px;
        background: var(--color-secondary-bg-for-transparent);
        border-radius: 8px;
        width: 200px;
        .svg-iocn {
          height: 15px;
          width: 15px;
          color: var(--color-text);
          opacity: 0.28;
          margin-left: 8px;
          margin-right: 4px;
        }
        .input {
          input {
            font-size: 16px;
            border: none;
            background: transparent;
            width: 96%;
            font-weight: 600;
            margin-top: -1px;
            color: var(--color-text);
          }
        }
      }
      .active {
        background: var(--color-primary-bg-for-transparent);
        input,
        .svg-icon {
          opacity: 1;
          color: var(--color-primary);
        }
      }
    }
    .avatar_content {
      img {
        user-select: none;
        height: 30px;
        margin-left: 12px;
        vertical-align: -7px;
        border-radius: 50%;
        cursor: pointer;
        -webkit-app-region: no-drag;
        -webkit-user-drag: none;
      }
    }
  }
}
</style>
