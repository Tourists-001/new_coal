<template>
  <div v-show="show" class="artist-page">
    <div class="artist-info">
      <div class="head">
        <img :src="artist.img1v1Url | resizeImage(1024)" loading="lazy">
      </div>
      <div>
        <div class="name">{{ artist.name }}</div>
        <div class="artist">艺人</div>
        <div class="statistics">
          <a @click="scrollTo('popularTracks')">
            {{ artist.musicSize }} {{ '首歌' }}
          </a>
          ·
          <a @click="scrollTo('seeMore', 'start')">
            {{ artist.albumSize }} {{ '张专辑' }}
          </a>
          ·
          <a @click="scrollTo('mvs')">{{ artist.mvSize }} {{ '个MV' }}</a>
        </div>
        <div class="description" @click="toggleFullDescription">
          {{ artist.briefDesc }}
        </div>
        <div class="buttons">
          <ButtonTwoTone icon-class="play" @click.native="playPopularSongs()">
            {{ '播放' }}
          </ButtonTwoTone>
          <ButtonTwoTone color="grey" @click.native="followArtist">
            <span v-if="isLikeArt">{{ '正在关注' }}</span>
            <span v-else>{{ '关注' }}</span>
          </ButtonTwoTone>
          <ButtonTwoTone
            icon-class="more"
            :icon-button="true"
            :horizontal-padding="0"
            color="grey"
            @click.native="openMenu"
          />
        </div>
      </div>
    </div>
    <div v-if="latestRelease !== undefined" class="latest-release">
      <div class="section-title">{{ '最新发布' }}</div>
      <div class="release">
        <div class="container">
          <Cover
            :id="latestRelease.id"
            :image-url="latestRelease.picUrl | resizeImage"
            type="album"
            :fixed-size="128"
            :play-button-size="30"
          />
          <div class="info">
            <div class="name">
              <router-link :to="`/album/${latestRelease.id}`">
                {{ latestRelease.name }}
              </router-link>
            </div>
            <div class="date">
              {{ latestRelease.publishTime | formatDate }}
            </div>
            <div class="type">
              {{ latestRelease.type | formatAlbumType(latestRelease) }} ·
              {{ latestRelease.size }} {{ '首歌' }}
            </div>
          </div>
        </div>
        <div v-show="latestMV.id" class="container latest-mv">
          <div
            class="cover"
            @mouseover="mvHover = true"
            @mouseleave="mvHover = false"
            @click="goToMv(latestMV.id)"
          >
            <img :src="latestMV.coverUrl" loading="lazy">
            <transition name="fade">
              <div
                v-show="mvHover"
                class="shadow"
                :style="{
                  background: 'url(' + latestMV.coverUrl + ')',
                }"
              />
            </transition>
          </div>
          <div class="info">
            <div class="name">
              <router-link :to="'/mv/' + latestMV.id">
                {{ latestMV.name }}
              </router-link>
            </div>
            <div class="date">
              {{ latestMV.publishTime | formatDate }}
            </div>
            <div class="type">{{ '最新 MV' }}</div>
          </div>
        </div>
        <div v-show="!latestMV.id" />
      </div>
    </div>
    <div id="popularTracks" class="popular-tracks">
      <div class="section-title">{{ '热门歌曲' }}</div>
      <TrackList
        :tracks="popularTracks.slice(0, showMorePopTracks ? 24 : 12)"
        :type="'tracklist'"
      />
      <div id="seeMore" class="show-more">
        <button @click="showMorePopTracks = !showMorePopTracks">
          <span v-show="!showMorePopTracks">{{ '显示更多' }}</span>
          <span v-show="showMorePopTracks">{{ '收起' }}</span>
        </button>
      </div>
    </div>

    <div v-if="albums.length !== 0" id="albums" class="albums">
      <div class="section-title">{{ '专辑' }}</div>
      <CoverRow
        :type="'album'"
        :items="albums"
        :sub-text="'releaseYear'"
        :show-play-button="true"
      />
    </div>

    <div v-if="mvs.length !== 0" id="mvs" class="mvs">
      <div class="section-title">
        MVs
        <router-link v-show="hasMoreMV" :to="`/artist/${artist.id}/mv`">
          {{ '显示更多' }}
        </router-link>
      </div>
      <MvRow :mvs="mvs" subtitle="publishTime" />
    </div>
    <div v-if="eps.length !== 0" class="eps">
      <div class="section-title">{{ 'EP 和单曲' }}</div>
      <CoverRow
        :type="'album'"
        :items="eps"
        :sub-text="'albumType+releaseYear'"
        :show-play-button="true"
      />
    </div>
    <div v-if="similarArtists.length !== 0" class="similar-artists">
      <div class="section-title">{{ '相似艺人' }}</div>
      <CoverRow
        type="artist"
        :column-number="6"
        gap="36px 28px"
        :items="similarArtists.slice(0, 12)"
      />
    </div>
    <Modal
      :show="showFullDescription"
      :close="toggleFullDescription"
      :show-footer="false"
      :click-outside-hide="true"
      title="描述"
    >
      <p class="description-fulltext">
        {{ artist.briefDesc }}
      </p>
    </Modal>

    <ContextMenu ref="artistMenu">
      <div class="item" @click="copyUrl(artist.id)">
        {{ '复制URL' }}
      </div>
      <div class="item" @click="openInBrowser(artist.id)">
        {{ '在浏览器打开' }}
      </div>
    </ContextMenu>
  </div>
</template>

<script>
import NProgress from 'nprogress'
import ButtonTwoTone from '@/components/ButtonTwoTone'
import Cover from '@/components/Cover'
import MvRow from '@/components/MvRow'
import TrackList from '@/components/TrackList'
import CoverRow from '@/components/CoverRow'
import Modal from '@/components/Modal'
import ContextMenu from '@/components/ContextMenu'
import {
  getArtist,
  getArtistAlbum,
  artistMv,
  similarArtists
} from '@/api/artist'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'Artist',
  components: {
    ButtonTwoTone,
    Cover,
    MvRow,
    Modal,
    ContextMenu,
    TrackList,
    CoverRow
  },
  beforeRouteUpdate(to, from, next) {
    this.artist.img1v1Url =
      'https://p1.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg'
    this.loadData(to.params.id, next)
  },
  data() {
    return {
      show: false,
      artist: {
        img1v1Url:
          'https://p1.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg'
      },
      popularTracks: [],
      albumsData: [],
      latestRelease: {
        picUrl: '',
        publishTime: 0,
        id: 0,
        name: '',
        type: '',
        size: ''
      },
      showMorePopTracks: false,
      showFullDescription: false,
      mvs: [],
      hasMoreMV: false,
      similarArtists: [],
      mvHover: false
    }
  },
  computed: {
    ...mapState('liked', ['liked']),
    isLikeArt() {
      const arr = this.liked?.artists.includes(this.$route.params.id)
      console.log(arr)
      return arr
    },
    latestMV() {
      const mv = this.mvs[0] || {}
      return {
        id: mv.id || mv.vid,
        name: mv.name || mv.title,
        coverUrl: `${mv.imgurl16v9 || mv.cover || mv.coverUrl}?param=464y260`,
        publishTime: mv.publishTime
      }
    },
    albums() {
      return this.albumsData.filter((a) => a.type === '专辑')
    },
    eps() {
      return this.albumsData.filter((a) =>
        ['EP/Single', 'EP', 'Single'].includes(a.type)
      )
    }
  },
  activated() {
    if (this.artist?.id?.toString() !== this.$route.params.id) {
      this.loadData(this.$route.params.id)
    } else {
      this.$parent.$refs.scrollbar.restorePosition()
    }
  },
  methods: {
    ...mapActions('player', ['playPlayListByArt']),
    ...mapActions('liked', ['likeArtist']),
    ...mapActions('toast', ['showToast']),
    async loadData(id, next = undefined) {
      if (!id) return
      setTimeout(() => {
        if (!this.show) NProgress.start()
      }, 1000)
      this.show = false
      this.$parent.$refs.main.scrollTo({ top: 0 })
      const data = await getArtist(id)
      this.artist = data.artist
      this.popularTracks = data.hotSongs
      if (next !== undefined) next()
      NProgress.done()
      this.show = true
      // 获取歌手专辑
      const album = await getArtistAlbum({ id: id, limit: 200 })
      this.albumsData = album.hotAlbums
      this.latestRelease = album.hotAlbums[0]
      // 获取歌手mv
      const mv = await artistMv({ id })
      this.mvs = mv.mvs
      this.hasMoreMV = mv.hasMore
      // 相似歌手
      const similar = await similarArtists(id)
      this.similarArtists = similar.artists
    },
    scrollTo() {},
    toggleFullDescription() {
      this.showFullDescription = !this.showFullDescription
      if (this.showFullDescription) {
        this.$store.commit('main/enableScrolling', false)
      } else {
        this.$store.commit('main/enableScrolling', true)
      }
    },
    playPopularSongs(trackID = 'first') {
      this.playPlayListByArt({ id: this.$route.params.id })
    },
    followArtist() {
      this.likeArtist(this.$route.params.id)
    },
    openMenu(e) {
      this.$refs.artistMenu.openMenu(e)
    },
    goToMv(id) {
      this.$router.push({ path: '/mv/' + id })
    },
    copyUrl(id) {
      const showToast = this.showToast
      this.$copyText(`https://music.163.com/#/artist?id=${id}`)
        .then(function() {
          showToast('复制成功')
        })
        .catch((error) => {
          showToast('复制失败', error)
        })
    },
    openInBrowser(id) {
      const url = `https://music.163.com/#/artist?id=${id}`
      window.open(url)
    }
  }
}
</script>

<style lang="scss" scoped>
.artist-page {
  margin-top: 32px;
}

.artist-info {
  display: flex;
  align-items: center;
  margin-bottom: 26px;
  color: var(--color-text);
  img {
    height: 248px;
    width: 248px;
    border-radius: 50%;
    margin-right: 56px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 16px -8px;
  }
  .name {
    font-size: 56px;
    font-weight: 700;
  }

  .artist {
    font-size: 18px;
    opacity: 0.88;
    margin-top: 24px;
  }

  .statistics {
    font-size: 14px;
    opacity: 0.68;
    margin-top: 2px;
  }

  .buttons {
    margin-top: 26px;
    display: flex;
    .shuffle {
      padding: 8px 11px;
      .svg-icon {
        margin: 0;
      }
    }
  }

  .description {
    user-select: none;
    font-size: 14px;
    opacity: 0.68;
    margin-top: 24px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    cursor: pointer;
    white-space: pre-line;
    &:hover {
      transition: opacity 0.3s;
      opacity: 0.88;
    }
  }
}

.section-title {
  font-weight: 600;
  font-size: 22px;
  opacity: 0.88;
  color: var(--color-text);
  margin-bottom: 16px;
  padding-top: 46px;

  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  a {
    font-size: 13px;
    font-weight: 600;
    opacity: 0.68;
  }
}

.latest-release {
  color: var(--color-text);
  .release {
    display: flex;
  }
  .container {
    display: flex;
    flex: 1;
    align-items: center;
    border-radius: 12px;
  }
  img {
    height: 96px;
    border-radius: 8px;
  }
  .info {
    margin-left: 24px;
  }
  .name {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .date {
    font-size: 14px;
    opacity: 0.78;
  }
  .type {
    margin-top: 2px;
    font-size: 12px;
    opacity: 0.68;
  }
}

.popular-tracks {
  .show-more {
    display: flex;

    button {
      padding: 4px 8px;
      margin-top: 8px;
      border-radius: 6px;
      font-size: 12px;
      opacity: 0.78;
      color: var(--color-secondary);
      font-weight: 600;
      &:hover {
        opacity: 1;
      }
    }
  }
}

.similar-artists {
  .section-title {
    margin-bottom: 24px;
  }
}

.latest-mv {
  .cover {
    position: relative;
    transition: transform 0.3s;
    &:hover {
      cursor: pointer;
    }
  }
  img {
    border-radius: 0.75em;
    height: 128px;
    object-fit: cover;
    user-select: none;
  }

  .shadow {
    position: absolute;
    top: 6px;
    height: 100%;
    width: 100%;
    filter: blur(16px) opacity(0.4);
    transform: scale(0.9, 0.9);
    z-index: -1;
    background-size: cover;
    border-radius: 0.75em;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
}

.description-fulltext {
  font-size: 16px;
  margin-top: 24px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-line;
}
</style>
