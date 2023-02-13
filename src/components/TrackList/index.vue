<template>
  <div class="track-list">
    <ContextMenu ref="menu">
      <div v-show="type !== 'cloudDisk'" class="item-info">
        <img
          :src="rightClickedTrackComputed.al.picUrl | resizeImage(224)"
          loading="lazy"
        >
        <div class="info">
          <div class="title">{{ rightClickedTrackComputed.name }}</div>
          <div class="subtitle">{{ rightClickedTrackComputed.ar[0].name }}</div>
        </div>
      </div>
      <hr v-show="type !== 'cloudDisk'">
      <div class="item" @click="play">{{ '播放' }}</div>
      <div class="item" @click="addToQueue">添加到队列</div>
      <div
        v-if="extraContextMenuItem.includes('removeTrackFromQueue')"
        class="item"
        @click="removeTrackFromQueue"
      >
        从队列删除
      </div>
      <hr v-show="type !== 'cloudDisk'">
      <div
        v-show="!isRightClickedTrackLiked && type !== 'cloudDisk'"
        class="item"
        @click="like"
      >
        添加到我喜欢的音乐
      </div>
      <div
        v-show="isRightClickedTrackLiked && type !== 'cloudDisk'"
        class="item"
        @click="like"
      >
        从喜欢的音乐中删除
      </div>
      <div
        v-if="extraContextMenuItem.includes('removeTrackFromPlaylist')"
        class="item"
        @click="removeTrackFromPlaylist"
      >
        从歌单中删除
      </div>
      <div
        v-show="type !== 'cloudDisk'"
        class="item"
        @click="addTrackToPlaylist"
      >
        {{ '从歌单中删除' }}
      </div>
      <div v-show="type !== 'cloudDisk'" class="item" @click="copyLink">
        {{ '复制歌曲链接' }}
      </div>
    </ContextMenu>
    <div :style="listStyles">
      <TrackListItem
        v-for="(track, index) in tracks"
        :key="itemKey === 'id' ? track.id : `${track.id}${index}`"
        :track-prop="track"
        :highlight-playing-track="highlightPlayingTrack"
        @dblclick.native="playThisList(track.id || track.songId)"
        @click.right.native="openMenu($event, track, index)"
      />
    </div>
  </div>
</template>

<script>
import ContextMenu from '@/components/ContextMenu'
import TrackListItem from '@/components/TrackListItem'
import { mapActions, mapState } from 'vuex'
export default {
  components: { ContextMenu, TrackListItem },
  props: {
    tracks: {
      type: Array,
      default: () => {
        return []
      }
    },
    type: {
      type: String,
      default: 'tracklist'
    }, // tracklist | album | playlist | cloudDisk
    id: {
      type: Number,
      default: 0
    },
    dbclickTrackFunc: {
      type: String,
      default: 'default'
    },
    albumObject: {
      type: Object,
      default: () => {
        return {
          artist: {
            name: ''
          }
        }
      }
    },
    extraContextMenuItem: {
      type: Array,
      default: () => {
        return [
          // 'removeTrackFromPlaylist'
          // 'removeTrackFromQueue'
          // 'removeTrackFromCloudDisk'
        ]
      }
    },
    columnNumber: {
      type: Number,
      default: 4
    },
    highlightPlayingTrack: {
      type: Boolean,
      default: true
    },
    itemKey: {
      type: String,
      default: 'id'
    }
  },
  data() {
    return {
      rightClickedTrack: {
        id: 0,
        name: '',
        ar: [{ name: '' }],
        al: { picUrl: '' }
      },
      rightClickedTrackIndex: -1,
      listStyles: {}
    }
  },
  computed: {
    ...mapState('player', ['playlistDetail', 'playNextList']),
    ...mapState('liked', ['liked']),
    isRightClickedTrackLiked() {
      return ''
    },
    rightClickedTrackComputed() {
      return this.type === 'cloudDisk'
        ? {
          id: 0,
          name: '',
          ar: [{ name: '' }],
          al: { picUrl: '' }
        }
        : this.rightClickedTrack
    }
  },
  created() {
    // console.log(this.tracks)
    if (this.type === 'tracklist') {
      this.listStyles = {
        display: 'grid',
        gap: '4px',
        gridTemplateColumns: `repeat(${this.columnNumber}, 1fr)`
      }
    }
  },
  methods: {
    ...mapActions('player', ['replaceCurrentTrack', 'addTrackToPlayNext']),
    ...mapActions('liked', ['likeATracks']),
    play() {
      console.log(this.rightClickedTrack.id)
      this.addTrackToPlayNext({ id: this.rightClickedTrack.id, autoplay: true })
    },
    addToQueue() {
      this.addTrackToPlayNext({
        id: this.rightClickedTrack.id,
        autoplay: false
      })
    },
    removeTrackFromQueue() {},
    like() {
      this.likeATracks(this.rightClickedTrack.id)
    },
    removeTrackFromPlaylist() {},
    addTrackToPlaylist() {},
    playThisList() {},
    openMenu(e, track, index = -1) {
      this.rightClickedTrack = track
      this.rightClickedTrackIndex = index
      this.$refs.menu.openMenu(e)
    },
    copyLink() {}
  }
}
</script>

<style></style>
