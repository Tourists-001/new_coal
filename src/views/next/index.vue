<template>
  <transition name="sider-up">
    <div class="next-tracks">
      <h1>正在播放</h1>
      <TrackList
        :tracks="[currentTrack]"
        type="playList"
        dbclick-track-func="none"
      />
      <h1 v-show="playNextList.length > 0">
        插队播放
        <button @click="clearPlayNextList">清除队列</button>
      </h1>
      <TrackList
        v-show="playNextList.length > 0"
        :tracks="playNextTracks"
        type="playlist"
        :highlight-playing-track="false"
        dbclick-track-func="playTrackOnListByID"
        item-key="id+index"
        :extra-context-menu-item="['removeTrackFromQueue']"
      />
      <h1>即将播放</h1>
      <TrackList
        :tracks="filteredTracks"
        type="playlist"
        :highlight-playing-track="false"
        dbclick-track-func="playTrackOnListByID"
      />
    </div>
  </transition>
</template>

<script>
import TrackList from '@/components/TrackList'
import { mapState } from 'vuex'
import { getTrackDetail } from '@/api/track'
export default {
  components: { TrackList },
  data() {
    return {
      tracks: []
    }
  },
  computed: {
    ...mapState('player', [
      'playNextList',
      'playListID',
      'current',
      'currentTrack'
    ]),
    filteredTracks() {
      const trackIDs = this.playListID.slice(
        this.current + 1,
        this.current + 100
      )
      // console.log(trackIDs)
      return this.tracks.filter((t) => trackIDs.includes(t.id))
    },
    playNextTracks() {
      return this.playNextList.map((tid) => {
        return this.tracks.find((t) => t.id === tid)
      })
    }
  },
  watch: {
    currentTrack() {
      this.loadTracks()
    },
    playNextList() {
      this.loadTracks()
    },
    playListID() {
      this.loadTracks()
    }
  },
  activated() {
    this.loadTracks()
    this.$parent.$refs.scrollbar.restorePosition()
  },
  methods: {
    clearPlayNextList() {},
    async loadTracks() {
      // 获取播放列表当前歌曲的后100
      const trackIDs = this.playListID.slice(
        this.current + 1,
        this.current + 100
      )
      // 将playNextList的歌曲加进trackIDs
      trackIDs.push(...this.playNextList)
      // 获取已经加载好的歌曲
      const loadedTrackIDs = this.tracks.map((t) => t.id)
      if (trackIDs.length > 0) {
        const data = await getTrackDetail(trackIDs.join(','))
        const newTracks = data.songs.filter(
          (t) => !loadedTrackIDs.includes(t.id)
        )
        this.tracks.push(...newTracks)
        // console.log(this.tracks)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  margin-top: 36px;
  margin-bottom: 18px;
  cursor: default;
  color: var(--color-text);
  display: flex;
  justify-content: space-between;
  button {
    color: var(--color-text);
    border-radius: 8px;
    padding: 0 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.2s;
    opacity: 0.68;
    font-weight: 500;
    &:hover {
      opacity: 1;
      background: var(--color-secondary-bg);
    }
    &:active {
      opacity: 1;
      transform: scale(0.92);
    }
  }
}
</style>
