<template>
  <div class="player" @click="toggleLyrics">
    <div
      class="progress-bar"
      :class="{
        nyancat: nyancatStyle,
        'nyancat-stop': nyancatStyle && !playing,
      }"
      @click.stop
    >
      <vue-slider
        v-model="progress"
        :min="0"
        :max="currentTrackDuration"
        :interval="1"
        :drag-on-click="true"
        :duration="0"
        :dot-size="12"
        :height="2"
        :tooltip-formatter="formatTrackTime"
        :lazy="true"
        :silent="true"
        @change="change"
      />
    </div>
    <div class="controls">
      <div class="playing">
        <div class="container" @click.stop>
          <img
            :src="currentTrack.al && currentTrack.al.picUrl | resizeImage(224)"
            loading="lazy"
            @click="goToAlbum"
          >
          <div class="track-info" title="musicTitle">
            <div
              :class="['name', { 'has-list': hasList() }]"
              @click="hasList() && goToList()"
            >
              {{ musicTitle }}
            </div>
            <div class="artist">
              <span
                v-for="(ar, index) in currentTrack.ar"
                :key="ar.id"
                @click="ar.id && goToArtist(ar.id)"
              >
                <span :class="{ ar: ar.id }">{{ ar.name }}</span>
                <span v-if="index !== currentTrack.ar.length - 1">,</span>
              </span>
            </div>
          </div>
          <div class="like-button">
            <button-icon
              title="喜欢"
              @click.native="likeATrack(currentTrack.id)"
            >
              <svg-icon v-show="!liked" icon-class="heart" />
              <svg-icon v-show="liked" icon-class="heart-solid" />
            </button-icon>
          </div>
        </div>
        <div class="blank" />
      </div>
      <div class="middle-control-buttons">
        <div class="blank" />
        <div class="container" @click.stop>
          <button-icon
            v-show="!isPersonalFM"
            title="上一首"
            @click.native="playPrevTrack"
          >
            <svg-icon icon-class="previous" />
          </button-icon>
          <button-icon
            v-show="isPersonalFM"
            title="不喜欢"
            @click.native="moveToFMTrash"
          >
            <svg-icon icon-class="thumbs-down" />
          </button-icon>
          <button-icon
            style="position: relative"
            class="play"
            :title="playing ? '暂停' : '播放'"
            @click.native="playOrPause"
          >
            <svg-icon :icon-class="playing ? 'pause' : 'play'" />
            <svg-icon v-if="loading" :icon-class="'loading'" class="loading" />
          </button-icon>
          <button-icon title="下一首" @click.native="playNextTrack">
            <svg-icon icon-class="next" />
          </button-icon>
        </div>
        <div class="blank" />
      </div>
      <div class="right-control-buttons">
        <div class="blank" />
        <div class="container" @click.stop>
          <button-icon
            title="播放列表"
            :class="{ active: $route.name === 'Next', disabled: isPersonalFM }"
            @click.native="goToNextTracksPage"
          >
            <svg-icon icon-class="list" />
          </button-icon>
          <button-icon
            :class="{
              active: repeatMode !== 'off',
              disabled: isPersonalFM,
            }"
            :title="repeatMode === 'one' ? '单曲循环' : '循环播放'"
            @click.native="switchRepeatMode"
          >
            <svg-icon v-show="repeatMode !== 'one'" icon-class="repeat" />
            <svg-icon v-show="repeatMode === 'one'" icon-class="repeat-1" />
          </button-icon>
          <button-icon
            :class="{ active: shuffle, disabled: isPersonalFM }"
            @click.native="switchShuffle"
          >
            <svg-icon icon-class="shuffle" />
          </button-icon>
          <button-icon
            v-if="enableReversedMode"
            :class="{ active: reversed, disabled: isPersonalFM }"
            @click.native="switchReversed"
          >
            <svg-icon icon-class="sort-up" />
          </button-icon>

          <div class="volume-control">
            <button-icon title="静音" @click.native="mute">
              <svg-icon v-show="volume > 0.5" icon-class="volume" />
              <svg-icon v-show="volume === 0" icon-class="volume-mute" />
              <svg-icon
                v-show="volume <= 0.5 && volume !== 0"
                icon-class="volume-half"
              />
            </button-icon>
            <div class="volume-bar">
              <vue-slider
                v-model="volume"
                :min="0"
                :max="1"
                :interval="0.01"
                :drag-on-click="true"
                :duration="0"
                tooltip="none"
                :dot-size="12"
                @change="changeVolume"
              />
            </div>
          </div>

          <button-icon
            class="lyrics-button"
            title="歌词"
            style="margin-left: 12px"
            @click.native="toggleLyrics"
          >
            <svg-icon icon-class="arrow-up" />
          </button-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/css/slider.css'
import VueSlider from 'vue-slider-component'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import buttonIcon from '@/components/ButtonIcon'
import { getStore, setStore, debounce } from '@/utils'
// import { get } from 'http'
export default {
  name: 'Player',
  components: { VueSlider, buttonIcon },
  // mixins: [player],
  data() {
    return {
      progress: 0,
      timers: null
    }
  },
  computed: {
    ...mapState('pcSetting', ['nyancatStyle', 'enableReversedMode']),
    ...mapState('player', [
      'playing',
      'repeatMode',
      'isPersonalFM',
      'shuffle',
      'liked',
      'currentTrack',
      'isPersonalFM',
      'reversed',
      'volume'
    ]),
    ...mapState('loading', ['loading']),
    ...mapGetters({
      musicTitle: 'player/musicTitle',
      musicArt: 'player/musicArt',
      imgUrl: 'player/imgUrl',
      lastCurrentID: 'player/lastCurrentID',
      currentTrackDuration: 'player/currentTrackDuration'
    }),
    isLiked() {
      return this.$store.state('player/liked')
    },
    volume: {
      get() {
        console.log(this)
        return this.$store.state.player.volume
      },
      set(val) {
        this.changeVolumes(val)
      }
    }
  },
  created() {
    this.init()
    this.getProgress()
    setStore('playerCurrentTrackTime', 0)
    this.updataProgress(0)
  },
  beforeDestroy() {
    clearInterval(this.timers)
    setStore('playerCurrentTrackTime', 0)
    this.updataProgress(0)
  },
  methods: {
    ...mapActions('player', [
      'init',
      'playNextTracks',
      'playPrevTracks',
      'updataProgress',
      'playOrPauses',
      'switchShuffles',
      'isCurrentTrackLiked'
    ]),
    ...mapActions('liked', ['likeATracks']),
    ...mapMutations('player', ['switchRepeatModes', 'mutes', 'changeVolumes']),
    ...mapMutations('lyrics', ['toggleLyrics']),
    goToAlbum() {},
    hasList() {},
    goToList() {},
    likeATrack(id) {
      this.likeATracks(id)
      this.isCurrentTrackLiked()
    },
    playPrevTrack() {
      this.playPrevTracks()
    },
    moveToFMTrash() {},
    playOrPause() {
      this.playOrPauses()
    },
    playNextTrack() {
      this.playNextTracks()
    },
    formatTrackTime(value) {
      if (!value) return ''
      const min = ~~((value / 60) % 60)
      const sec = (~~(value % 60)).toString().padStart(2, '0')
      return `${min}:${sec}`
    },
    change(val) {
      setStore('playerCurrentTrackTime', this.progress)
      this.updataProgress(this.progress)
    },
    getProgress() {
      this.timers = setInterval(() => {
        this.progress = getStore('playerCurrentTrackTime')
      }, 1000)
    },
    goToNextTracksPage() {
      this.$route.name === 'Next'
        ? this.$router.go(-1)
        : this.$router.push({ name: 'Next' })
    },
    switchRepeatMode() {
      console.log(this.repeatMode)
      this.switchRepeatModes()
    },
    switchShuffle() {
      this.switchShuffles()
    },
    switchReversed() {},
    mute() {
      this.mutes()
    },
    changeVolume(val) {
      // console.log(val)
      debounce(this.changeVolumes(val), 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 64px;
  backdrop-filter: saturate(180%) blur(30px);
  // background-color: rgba(255, 255, 255, 0.86);
  background-color: var(--color-navbar-bg);
  z-index: 100;
}

@supports (-moz-appearance: none) {
  .player {
    background-color: var(--color-body-bg);
  }
}

.progress-bar {
  margin-top: -6px;
  margin-bottom: -6px;
  width: 100%;
}

.controls {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 100%;
  padding: {
    right: 10vw;
    left: 10vw;
  }
}

@media (max-width: 1336px) {
  .controls {
    padding: 0 5vw;
  }
}

.blank {
  flex-grow: 1;
}

.playing {
  display: flex;
}

.playing .container {
  display: flex;
  align-items: center;
  img {
    height: 46px;
    border-radius: 5px;
    box-shadow: 0 6px 8px -2px rgba(0, 0, 0, 0.16);
    cursor: pointer;
    user-select: none;
  }
  .track-info {
    height: 46px;
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .name {
      font-weight: 600;
      font-size: 16px;
      opacity: 0.88;
      color: var(--color-text);
      margin-bottom: 4px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }
    .has-list {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
    .artist {
      font-size: 12px;
      opacity: 0.58;
      color: var(--color-text);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
      span.ar {
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
.loading {
  width: 44px !important;
  height: 44px !important;
  position: absolute;
  left: 7px;
  animation: circular 2s ease-out infinite;
}
@keyframes circular {
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.middle-control-buttons {
  display: flex;
}

.middle-control-buttons .container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 8px;
  .button-icon {
    margin: 0 8px;
  }
  .play {
    height: 42px;
    width: 42px;
    .svg-icon {
      width: 20px;
      height: 20px;
    }
  }
}

.right-control-buttons {
  display: flex;
}

.right-control-buttons .container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .expand {
    margin-left: 24px;
    .svg-icon {
      height: 24px;
      width: 24px;
    }
  }
  .active .svg-icon {
    color: var(--color-primary);
  }
  .volume-control {
    margin-left: 4px;
    display: flex;
    align-items: center;
    .volume-bar {
      width: 84px;
    }
  }
}

.like-button {
  margin-left: 16px;
}

.button-icon.disabled {
  cursor: default;
  opacity: 0.38;
  &:hover {
    background: none;
  }
  &:active {
    transform: unset;
  }
}
</style>
