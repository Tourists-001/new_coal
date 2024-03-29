<template>
  <div class="mv-page">
    <div class="current-video">
      <div class="video">
        <video ref="videoPlayer" class="plyr" />
      </div>
      <div class="video-info">
        <div class="title">
          <router-link :to="'/artist/' + mv.data.artistId">
            {{ mv.data.artistName }}
          </router-link>
          - {{ mv.data.name }}
          <div class="like-button">
            <button-icon @click.native="likeMV">
              <svg-icon v-if="isLikeMv" icon-class="heart-solid" />
              <svg-icon v-else icon-class="heart" />
            </button-icon>
          </div>
        </div>
        <div class="info">
          {{ mv.data.playCount | formatPlayCount }} Views ·
          {{ mv.data.publishTime }}
        </div>
      </div>
    </div>
    <div class="more-video">
      <div class="section-title">{{ '更多' }}</div>
      <MvRow :mvs="simiMvs" />
    </div>
  </div>
</template>

<script>
import { mvDetail, mvUrl, simiMv } from '@/api/mv'
import ButtonIcon from '@/components/ButtonIcon'
import MvRow from '@/components/MvRow'
import NProgress from 'nprogress'
import '@/assets/css/plyr.css'
import Plyr from 'plyr'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'MV',
  components: { ButtonIcon, MvRow },
  beforeRouteUpdate(to, from, next) {
    this.getData(to.params.id)
    next()
  },
  data() {
    return {
      mv: {
        url: '',
        data: {
          name: '',
          artistName: '',
          playCount: '',
          publishTime: ''
        }
      },
      player: null,
      simiMvs: []
    }
  },
  computed: {
    ...mapState('player', ['volume']),
    ...mapState('liked', ['liked']),
    isLikeMv() {
      const like = this.liked.mvs.includes(this.$route.params.id)
      return like
    }
  },
  mounted() {
    const videoOptions = {
      settings: ['quality'],
      autoplay: false,
      quality: {
        default: 1080,
        options: [1080, 720, 480, 240]
      }
    }
    if (this.$route.query.autoplay === 'true') videoOptions.autoplay = true
    this.player = new Plyr(this.$refs.videoPlayer, videoOptions)
    this.player.volume = this.volume
    this.player.on('playing', () => {
      this.pause()
    })
    this.getData(this.$route.params.id)
  },
  methods: {
    ...mapActions('player', ['pause']),
    ...mapActions('liked', ['likeMvs']),
    async getData(id) {
      const data = await mvDetail(id)
      this.mv = data
      const requests = data.data.brs.map((br) => {
        return mvUrl({ id, r: br.br })
      })
      Promise.all(requests).then((results) => {
        const sources = results.map((result) => {
          return {
            src: result.data.url.replace(/^http:/, 'https:'),
            type: 'video/mp4',
            size: result.data.r
          }
        })
        this.player.source = {
          type: 'video',
          title: this.mv.data.name,
          sources: sources,
          poster: this.mv.data.cover.replace(/^http:/, 'https:')
        }
        NProgress.done()
      })
      const res = await simiMv(id)
      this.simiMvs = res.mvs
    },
    likeMV() {
      // console.log(this.mv.data.id)
      this.likeMvs(this.$route.params.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.video {
  --plyr-color-main: #335eea;
  --plyr-control-radius: 8px;
}

.mv-page {
  width: 100%;
  margin-top: 32px;
}
.current-video {
  width: 100%;
}
.video {
  border-radius: 16px;
  background: transparent;
  overflow: hidden;
  max-height: 100vh;
}

.video-info {
  margin-top: 12px;
  color: var(--color-text);
  .title {
    font-size: 24px;
    font-weight: 600;
  }
  .artist {
    font-size: 14px;
    opacity: 0.88;
    margin-top: 2px;
    font-weight: 600;
  }
  .info {
    font-size: 12px;
    opacity: 0.68;
    margin-top: 12px;
  }
}

.more-video {
  margin-top: 48px;
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text);
    opacity: 0.88;
    margin-bottom: 12px;
  }
}

.like-button {
  display: inline-block;
  .svg-icon {
    height: 18px;
    width: 18px;
    color: var(--color-primary);
  }
}
</style>
