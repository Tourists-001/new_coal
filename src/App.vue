<template>
  <div id="app">
    <div v-if="token && isShowHeader" class="pc">
      <Scrollbar v-show="!showLyrics" ref="scrollbar" />
      <Header ref="navbar" />
      <main
        ref="main"
        :style="{ overflow: enableScrolling ? 'auto' : 'hidden' }"
        @scroll="handleScroll"
      >
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" />
      </main>
      <transition name="slide-up">
        <Player v-if="enablePlayer" v-show="showPlayer" ref="player" />
      </transition>
      <transition v-if="enablePlayer" name="slide-up">
        <Lyrics v-show="showLyrics" />
      </transition>
      <Toast />
      <ModalNewPlaylist v-if="isAccountLoggedIn" />
    </div>
    <div v-if="token && isShowBottom" class="ph">
      <HeaderBar />
      <router-view />
      <BottomBar />
    </div>
    <div v-if="!token">
      <router-view />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import BottomBar from '@/components/BottomBar'
import HeaderBar from '@/components/HeaderBar'
import ResizeHandler from './mixin/ResizeHandler'
import Scrollbar from '@/components/ScrollBar'
import Player from '@/components/Player'
import Toast from '@/components/Toast'
import ModalNewPlaylist from '@/components/ModalNewPlaylist'
import Lyrics from '@/views/lyrics'
import { mapActions, mapState } from 'vuex'
import { isAccountLoggedIn } from '@/utils/auth'
export default {
  name: 'App',
  components: {
    Header,
    BottomBar,
    HeaderBar,
    Scrollbar,
    Player,
    Toast,
    Lyrics,
    ModalNewPlaylist
  },
  mixins: [ResizeHandler],
  computed: {
    isAccountLoggedIn() {
      return isAccountLoggedIn()
    },
    token() {
      return this.$store.getters['user/token']
    },
    device() {
      return this.$store.getters['app/device']
    },
    isShowHeader() {
      return this.$store.getters['app/isShowHeader']
    },
    isShowBottom() {
      return this.$store.getters['app/isShowBottom']
    },
    ...mapState('lyrics', ['showLyrics']),
    ...mapState('main', ['enableScrolling']),
    ...mapState('player', ['enabled']),
    enablePlayer() {
      return this.enabled && this.$route.name !== 'lastfmCallback'
    },
    showPlayer() {
      return (
        [
          'mv',
          'loginUsername',
          'login',
          'loginAccount',
          'lastfmCallback'
        ].includes(this.$route.name) === false
      )
    }
  },
  created() {
    // this.$router.replace('/home')
    if (this.$route.path === '/' && !this.token) {
      this.$router.replace({
        path: '/login'
      })
    }
    if (this.token) {
      this.$router.replace('/home')
      this.getData()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions('liked', [
      'fetchLikedSongs',
      'fetchLikedPlaylist',
      'fetchLikedArtists',
      'fetchLikedAlbums',
      'fetchLikedMVs'
    ]),
    ...mapActions('player', ['init']),
    handleScroll() {
      // console.log('object')
      this.$refs.scrollbar.handleScroll()
    },
    getData() {
      this.fetchLikedSongs()
      this.fetchLikedPlaylist()
      this.fetchLikedArtists()
      this.fetchLikedAlbums()
      this.fetchLikedMVs()
    }
  }
}
</script>

<style lang="scss">
#app {
  width: 100%;
  transition: all 0.4s;
}

main {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow: auto;
  padding: 64px 10vw 96px 10vw;
  box-sizing: border-box;
  scrollbar-width: none; // firefox
}

@media (max-width: 1336px) {
  main {
    padding: 64px 5vw 96px 5vw;
  }
}

main::-webkit-scrollbar {
  width: 0px;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s;
}
.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
