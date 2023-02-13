<template>
  <div v-if="show" class="home_container">
    <div v-if="true" class="index-row first-row">
      <div class="title">by Apple Music</div>
      <CoverRow
        :type="'playlist'"
        :items="byAppleMusic"
        sub-text="appleMusic"
        :image-size="1024"
      />
    </div>
    <div class="index-row">
      <div class="title">
        推荐歌词
        <router-link to="/explore?category=推荐歌单">推荐歌单</router-link>
      </div>
      <CoverRow
        :type="'playlist'"
        :items="recommendPlaylist.items"
        sub-text="copywriter"
      />
    </div>
    <div class="index-row">
      <div class="title">For You</div>
      <div class="for-you-row">
        <DailyTracksCard ref="DailyTracksCard" />
        <!-- <FMCard /> -->
      </div>
    </div>
    <div class="index-row">
      <div class="title">推荐艺人</div>
      <CoverRow
        type="artist"
        :column-number="6"
        :items="recommendArtists.items"
      />
    </div>
    <div class="index-row">
      <div class="title">
        {{ '新歌速递' }}
        <router-link to="/new-album">查看全部</router-link>
      </div>
      <CoverRow
        type="album"
        :items="newReleasesAlbum.items"
        sub-text="artist"
      />
    </div>
    <div class="index-row">
      <div class="title">
        排行榜
        <router-link to="/explore?category=排行榜">查看全部</router-link>
      </div>
      <CoverRow
        type="playlist"
        :items="topList.items"
        sub-text="updateFrequency"
        :image-size="1024"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CoverRow from '@/components/CoverRow'
import { byAppleMusic } from '@/utils/staticData'
import { toplists, recommendPlaylist } from '@/api/playlist'
import { toplistOfArtists } from '@/api/artist'
import { newAlbums } from '@/api/album'
import DailyTracksCard from '@/components/DailyTracksCard'
// import FMCard from '@/components/FMCard'
export default {
  name: 'Home',
  components: { CoverRow, DailyTracksCard },
  data() {
    return {
      show: false,
      recommendPlaylist: { items: [] },
      newReleasesAlbum: { items: [] },
      recommendArtists: {
        items: [],
        indexs: []
      },
      topList: {
        items: [],
        ids: [19723756, 180106, 60198, 3812895, 60131]
      }
    }
  },
  computed: {
    ...mapState('pcSetting', ['isShowAppleMusic', 'musicLanguage']),
    byAppleMusic() {
      return byAppleMusic
    }
  },
  activated() {
    this.getData()
    this.$parent.$parent.$refs.scrollbar.restorePosition()
  },
  methods: {
    async getData() {
      const { result } = await recommendPlaylist({ limit: 10 })
      this.recommendPlaylist.items = result
      this.show = true
      const toplistOfArtistsAreaTable = {
        all: null,
        zh: 1,
        ea: 2,
        jp: 4,
        kr: 3
      }
      const data = await toplistOfArtists(
        toplistOfArtistsAreaTable[this.musicLanguage ?? 'all']
      )
      const indexs = []
      while (indexs.length < 6) {
        const tmp = ~~(Math.random() * 100)
        if (!indexs.includes(tmp)) indexs.push(tmp)
      }
      this.recommendArtists.indexs = indexs
      this.recommendArtists.items = data.list.artists.filter((l, index) =>
        indexs.includes(index)
      )
      const res = await newAlbums({
        area: this.musicLanguage ?? 'ALL',
        limit: 10
      })
      this.newReleasesAlbum.items = res.albums

      const list = await toplists()
      this.topList.items = list.list.filter((l) =>
        this.topList.ids.includes(l.id)
      )
      this.$refs.DailyTracksCard.loadDailyTracks()
    }
  }
}
</script>

<style lang="scss" scoped>
.index-row {
  margin-top: 54px;
}
.index-row.first-row {
  margin-top: 32px;
}
.playlists {
  display: flex;
  flex-wrap: wrap;
  margin: {
    right: -12px;
    left: -12px;
  }
  .index-playlist {
    margin: 12px 12px 24px 12px;
  }
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);
  a {
    font-size: 13px;
    font-weight: 600;
    opacity: 0.68;
  }
}

footer {
  display: flex;
  justify-content: center;
  margin-top: 48px;
}

.for-you-row {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;
  margin-bottom: 78px;
}
</style>
