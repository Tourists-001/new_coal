<template>
  <div
    class="cover"
    :class="{ 'cover-hover': coverHover }"
    @mouseover="focus = true"
    @mouseleave="focus = false"
    @click="clickCoverToPlay ? play() : goTo()"
  >
    <div class="cover-container">
      <div class="shade">
        <button
          v-show="focus"
          class="play-button"
          :style="playButtonStyles"
          @click.stop="play()"
        >
          <SvgIcon icon-class="play" />
        </button>
      </div>
      <img :src="imageUrl" :style="imageStyles" loading="lazy">
      <transition v-if="coverHover || alwaysShowShadow" name="fade">
        <div
          v-show="focus || alwaysShowShadow"
          class="shadow"
          :style="shadowStyles"
        />
      </transition>
    </div>
  </div>
</template>

<script>
// import SvgIcon from '@/components/SvgIcon'
import { mapActions } from 'vuex'
// import { getPlaylistDetail } from '@/api/track'
// import player from '@/mixin/player'
export default {
  name: 'Cover',
  // components: { SvgIcon },
  // mixins: [player],
  props: {
    id: { type: Number, required: true },
    type: { type: String, required: true },
    imageUrl: { type: String, required: true },
    fixedSize: { type: Number, default: 0 },
    playButtonSize: { type: Number, default: 22 },
    coverHover: { type: Boolean, default: true },
    alwaysShowPlayButton: { type: Boolean, default: true },
    alwaysShowShadow: { type: Boolean, default: false },
    clickCoverToPlay: { type: Boolean, default: false },
    shadowMargin: { type: Number, default: 12 },
    radius: { type: Number, default: 12 }
  },
  data() {
    return {
      focus: false
    }
  },
  computed: {
    imageStyles() {
      const styles = {}
      if (this.fixedSize !== 0) {
        styles.width = this.fixedSize + 'px'
        styles.height = this.fixedSize + 'px'
      }
      if (this.type === 'artist') styles.borderRadius = '50%'
      return styles
    },
    playButtonStyles() {
      const styles = {}
      styles.width = this.playButtonSize + '%'
      styles.height = this.playButtonSize + '%'
      return styles
    },
    shadowStyles() {
      const styles = {}
      styles.backgroundImage = `url(${this.imageUrl})`
      if (this.type === 'artist') styles.borderRadius = '50%'
      return styles
    }
  },
  methods: {
    ...mapActions('player', ['playPlaylistByID', 'playPlayListByAlbum', 'playPlayListByArt']),
    // 播放音乐
    async play() {
      // console.log(this.id)
      // const res = await getPlaylistDetail(this.id)
      if (this.type === 'album') {
        console.log(this.id)
        // this.addTrackToPlayNext({ id: this.id, autoplay: true })
        this.playPlayListByAlbum({ id: this.id })
        return
      } else if (this.type === 'artist') {
        this.playPlayListByArt({ id: this.id })
        return
      }
      this.playPlaylistByID({ id: this.id })
    },
    // 去音乐列表
    goTo() {
      // console.log(this.type)
      this.$router.push({ name: this.type, params: { id: this.id }})
    }
  }
}
</script>

<style lang="scss" scoped>
.cover {
  position: relative;
  transition: transform 0.3s;
}
.cover-container {
  position: relative;
}
img {
  border-radius: 0.75em;
  width: 100%;
  user-select: none;
  aspect-ratio: 1 / 1;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.cover-hover {
  &:hover {
    cursor: pointer;
    /* transform: scale(1.02); */
  }
}

.shade {
  position: absolute;
  top: 0;
  height: calc(100% - 3px);
  width: 100%;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}
.play-button {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.08);
  height: 22%;
  width: 22%;
  border-radius: 50%;
  cursor: default;
  transition: 0.2s;
  .svg-icon {
    height: 44%;
    margin: {
      left: 4px;
    }
  }
  &:hover {
    background: rgba(255, 255, 255, 0.28);
  }
  &:active {
    transform: scale(0.94);
  }
}

.shadow {
  position: absolute;
  top: 12px;
  height: 100%;
  width: 100%;
  filter: blur(16px) opacity(0.6);
  transform: scale(0.92, 0.96);
  z-index: -1;
  background-size: cover;
  border-radius: 0.75em;
  aspect-ratio: 1 / 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
