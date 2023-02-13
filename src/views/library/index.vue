<template>
  <div v-show="show" ref="library">
    <h1>
      <img :src="avatar | resizeImage" class="avatar" loading="lazy">
      {{ nickname }}的音乐库
    </h1>
    <div class="section-one">
      <div class="liked-songs" @click="goToLikedSongsList">
        <div class="top">
          <p>
            <span
              v-for="(line, index) in pickedLyric"
              v-show="line !== ''"
              :key="`${line}${index}`"
            >
              {{ line }}
              <br>
            </span>
          </p>
        </div>
        <div class="bottom">
          <div class="titles">
            <div class="title">{{ '我喜欢的音乐' }}</div>
            <div class="sub-title">{{ liked.songs.length }} {{ '首歌' }}</div>
          </div>
          <button @click.stop="openPlayModeTabMenu">
            <svg-icon icon-class="play" />
          </button>
        </div>
      </div>
      <div class="songs">
        <TrackList
          :id="liked.playlists.length > 0 ? liked.playlists[0].id : 0"
          :tracks="likedSongs"
          :column-number="3"
          type="tracklist"
          dbclick-track-func="playPlaylistByID"
        />
      </div>
    </div>

    <div class="section-two">
      <div class="tabs-row">
        <div class="tabs">
          <div
            class="tab dropdown"
            :class="{ active: currentTab === 'playlists' }"
            @click="updateCurrentTab('playlists')"
          >
            <span class="text">
              {{
                {
                  all: '全部歌单',
                  mine: '创建的歌单',
                  liked: '收藏的歌单',
                }[playlistFilter]
              }}
            </span>
            <span class="icon" @click.stop="openPlaylistTabMenu">
              <svg-icon icon-class="dropdown" />
            </span>
          </div>
          <div
            class="tab"
            :class="{ active: currentTab === 'albums' }"
            @click="updateCurrentTab('albums')"
          >
            {{ '专辑' }}
          </div>
          <div
            class="tab"
            :class="{ active: currentTab === 'artists' }"
            @click="updateCurrentTab('artists')"
          >
            {{ '艺人' }}
          </div>
          <div
            class="tab"
            :class="{ active: currentTab === 'mvs' }"
            @click="updateCurrentTab('mvs')"
          >
            {{ 'MV' }}
          </div>
          <div
            class="tab"
            :class="{ active: currentTab === 'playHistory' }"
            @click="updateCurrentTab('playHistory')"
          >
            {{ '听歌排行' }}
          </div>
        </div>
        <button
          v-show="currentTab === 'playlists'"
          class="tab-button"
          @click="openAddPlaylistModal"
        >
          <svg-icon icon-class="plus" />
          {{ '新建歌单' }}
        </button>
      </div>
      <div v-show="currentTab === 'playlists'">
        <div v-if="liked.playlists.length > 1">
          <CoverRow
            :items="filterPlaylists"
            type="playlist"
            sub-text="creator"
            :show-play-button="true"
          />
        </div>
      </div>
      <div v-show="currentTab === 'albums'">
        <CoverRow
          :items="albums"
          type="album"
          sub-text="artist"
          :show-play-button="true"
        />
      </div>

      <div v-show="currentTab === 'artists'">
        <CoverRow :items="artist" type="artist" :show-play-button="true" />
      </div>

      <div v-show="currentTab === 'mvs'">
        <MvRow :mvs="mvs" />
      </div>
      <div v-show="currentTab === 'playHistory'">
        <button
          :class="{
            'playHistory-button': true,
            'playHistory-button--selected': playHistoryMode === 'week',
          }"
          @click="playHistoryMode = 'week'"
        >
          {{ '最近一周' }}
        </button>
        <button
          :class="{
            'playHistory-button': true,
            'playHistory-button--selected': playHistoryMode === 'all',
          }"
          @click="playHistoryMode = 'all'"
        >
          {{ '全部' }}
        </button>
        <TrackList
          :tracks="playHistoryList"
          :column-number="1"
          type="tracklist"
        />
      </div>
    </div>

    <ContextMenu ref="playlistTabMenu">
      <div class="item" @click="changePlaylistFilter('all')">
        {{ '全部歌单' }}
      </div>
      <hr>
      <div class="item" @click="changePlaylistFilter('mine')">
        {{ '创建歌单' }}
      </div>
      <div class="item" @click="changePlaylistFilter('liked')">
        {{ '收藏的歌单' }}
      </div>
    </ContextMenu>
  </div>
</template>

<script>
import ContextMenu from '@/components/ContextMenu'
import CoverRow from '@/components/CoverRow'
import MvRow from '@/components/MvRow'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { randomNum } from '@/utils/common'
import TrackList from '@/components/TrackList'
import {
  userLikedSongsIDs,
  userPlaylist,
  likedAlbums,
  likedArtists,
  likedMVs
} from '@/api/user'
import { getTrackDetail, getLyric } from '@/api/track'
import { getStore } from '@/utils'
function extractLyricPart(rawLyric) {
  return rawLyric.split(']').pop().trim()
}
export default {
  components: { TrackList, ContextMenu, CoverRow, MvRow },
  data() {
    return {
      show: true,
      likedSongs: [],
      likedPlayList: [],
      albums: [],
      lyric: undefined,
      currentTab: 'playlists',
      playHistoryMode: 'week',
      artist: [],
      mvs: []
    }
  },
  computed: {
    ...mapState('liked', ['liked', 'playHistory']),
    ...mapGetters({
      avatar: 'user/avatar',
      nickname: 'user/nickname',
      userId: 'user/userId'
    }),
    pickedLyric() {
      /** @type {string?} */
      const lyric = this.lyric

      // Returns [] if we got no lyrics.
      if (!lyric) return []

      const lyricLine = lyric
        .split('\n')
        .filter((line) => !line.includes('作词') && !line.includes('作曲'))

      // Pick 3 or fewer lyrics based on the lyric lines.
      const lyricsToPick = Math.min(lyricLine.length, 3)

      // The upperBound of the lyric line to pick
      const randomUpperBound = lyricLine.length - lyricsToPick
      const startLyricLineIndex = randomNum(0, randomUpperBound - 1)

      // Pick lyric lines to render.
      return lyricLine
        .slice(startLyricLineIndex, startLyricLineIndex + lyricsToPick)
        .map(extractLyricPart)
    },
    playlistFilter() {
      return this.liked.libraryPlaylistFilter || 'all'
    },
    filterPlaylists() {
      const playlists = this.likedPlayList
      const userId = this.userId
      if (this.playlistFilter === 'mine') {
        return playlists.filter((p) => p.creator.userId === userId)
      } else if (this.playlistFilter === 'liked') {
        return playlists.filter((p) => p.creator.userId !== userId)
      }
      return playlists
    },
    playHistoryList() {
      if (this.show && this.playHistoryMode === 'week') {
        return this.liked.playHistory.weekData
      }
      if (this.show && this.playHistoryMode === 'all') {
        return this.liked.playHistory.allData
      }
      return []
    }
  },
  created() {
    if (this.userId) {
      this.getData()
    }
  },
  methods: {
    ...mapActions('player', ['playPlaylistByID']),
    ...mapMutations('liked', ['updateData']),
    ...mapActions('liked', ['fetchPlayHistory']),
    ...mapMutations('modals', ['updateModal']),
    async getData() {
      const { ids } = await userLikedSongsIDs({ uid: this.userId })
      // console.log(res)
      const { songs } = await getTrackDetail(ids.join(','))
      this.likedSongs = songs
      // 获取喜欢的歌单
      const { playlist } = await userPlaylist({
        uid: this.userId,
        limit: 2000,
        timestamp: new Date().getTime()
      })
      this.likedPlayList = playlist
      // 获取喜欢的专辑
      const { data } = await likedAlbums({ limit: 2000 })
      // console.log(res)
      this.albums = data
      // 获取喜欢的艺人
      const res = await likedArtists({ limit: 2000 })
      this.artist = res.data
      const mv = await likedMVs({ limit: 20 })
      this.mvs = mv.data
      this.getRandomLyric()
      this.fetchPlayHistory()
    },
    goToLikedSongsList() {
      this.$router.push({ path: '/library/liked-songs' })
    },
    getRandomLyric() {
      if (this.liked.songs.length === 0) return
      getLyric(
        this.liked.songs[randomNum(0, this.liked.songs.length - 1)]
      ).then((data) => {
        if (data.lrc !== undefined) {
          const isInstrumental = data.lrc.lyric
            .split('\n')
            .filter((l) => l.includes('纯音乐，请欣赏'))
          if (isInstrumental.length === 0) {
            this.lyric = data.lrc.lyric
          }
        }
      })
    },
    openPlayModeTabMenu(e) {
      const id = getStore('likedSongPlaylistID') || 5183220873
      // this.$refs.playModeTabMenu.openMenu(e)
      this.playPlaylistByID({ id })
    },
    updateCurrentTab(tab) {
      this.currentTab = tab
      this.$parent.$refs.main.scrollTo({ top: 375, behavior: 'smooth' })
    },
    openPlaylistTabMenu(e) {
      console.log('object')
      this.$refs.playlistTabMenu.openMenu(e)
    },
    openAddPlaylistModal() {
      this.updateModal({
        modalName: 'newPlaylistModal',
        key: 'show',
        value: true
      })
    },
    changePlaylistFilter(type) {
      this.updateData({ key: 'libraryPlaylistFilter', value: type })
      window.scrollTo({ top: 375, behavior: 'smooth' })
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  font-size: 42px;
  color: var(--color-text);
  display: flex;
  align-items: center;
  .avatar {
    height: 44px;
    margin-right: 12px;
    vertical-align: -7px;
    border-radius: 50%;
    border: rgba(0, 0, 0, 0.2);
  }
}

.section-one {
  display: flex;
  margin-top: 24px;
  .songs {
    flex: 7;
    margin-top: 8px;
    margin-left: 36px;
    overflow: hidden;
  }
}

.liked-songs {
  flex: 3;
  margin-top: 8px;
  cursor: pointer;
  border-radius: 16px;
  padding: 18px 24px;
  display: flex;
  flex-direction: column;
  transition: all 0.4s;
  box-sizing: border-box;

  background: var(--color-primary-bg);

  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color-primary);

    .title {
      font-size: 24px;
      font-weight: 700;
    }
    .sub-title {
      font-size: 15px;
      margin-top: 2px;
    }

    button {
      margin-bottom: 2px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 44px;
      width: 44px;
      background: var(--color-primary);
      border-radius: 50%;
      transition: 0.2s;
      box-shadow: 0 6px 12px -4px rgba(0, 0, 0, 0.2);
      cursor: default;

      .svg-icon {
        color: var(--color-primary-bg);
        margin-left: 4px;
        height: 16px;
        width: 16px;
      }
      &:hover {
        transform: scale(1.06);
        box-shadow: 0 6px 12px -4px rgba(0, 0, 0, 0.4);
      }
      &:active {
        transform: scale(0.94);
      }
    }
  }

  .top {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    opacity: 0.88;
    color: var(--color-primary);
    p {
      margin-top: 2px;
    }
  }
}

.section-two {
  margin-top: 54px;
  min-height: calc(100vh - 182px);
}

.tabs-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  font-size: 18px;
  color: var(--color-text);
  .tab {
    font-weight: 600;
    padding: 8px 14px;
    margin-right: 14px;
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
    transition: 0.2s;
    opacity: 0.68;
    &:hover {
      opacity: 0.88;
      background-color: var(--color-secondary-bg);
    }
  }
  .tab.active {
    opacity: 0.88;
    background-color: var(--color-secondary-bg);
  }
  .tab.dropdown {
    display: flex;
    align-items: center;
    padding: 0;
    overflow: hidden;
    .text {
      padding: 8px 3px 8px 14px;
    }
    .icon {
      height: 100%;
      display: flex;
      align-items: center;
      padding: 0 8px 0 3px;
      .svg-icon {
        height: 16px;
        width: 16px;
      }
    }
  }
}

button.tab-button {
  color: var(--color-text);
  border-radius: 8px;
  padding: 0 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s;
  opacity: 0.68;
  font-weight: 500;
  .svg-icon {
    width: 14px;
    height: 14px;
    margin-right: 8px;
  }
  &:hover {
    opacity: 1;
    background: var(--color-secondary-bg);
  }
  &:active {
    opacity: 1;
    transform: scale(0.92);
  }
}

button.playHistory-button {
  color: var(--color-text);
  border-radius: 8px;
  padding: 6px 8px;
  margin-bottom: 12px;
  margin-right: 4px;
  transition: 0.2s;
  opacity: 0.68;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    opacity: 1;
    background: var(--color-secondary-bg);
  }
  &:active {
    transform: scale(0.95);
  }
}

button.playHistory-button--selected {
  color: var(--color-text);
  background: var(--color-secondary-bg);
  opacity: 1;
  font-weight: 700;
  &:active {
    transform: none;
  }
}
</style>
