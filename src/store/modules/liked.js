import { likeATrack } from '@/api/track'
import { isAccountLoggedIn } from '@/utils/auth'
import { getPlaylistDetail, subscribePlaylist } from '@/api/playlist'
import { getTrackDetail } from '@/api/track'
import { userLikedSongsIDs, userPlaylist, likedArtists, userPlayHistory } from '@/api/user'
import { followAArtist } from '@/api/artist'
import { likedAlbums, likedMVs } from '@/api/user'
import { likeAAlbum } from '@/api/album'
import { likeAMV } from '@/api/mv'
import { setStore } from '@/utils'
const state = {
  liked: {
    libraryPlaylistFilter: 'all',
    songs: [],
    songsWithDetails: [], // 只有前12首
    likedSongPlaylistID: [],
    playlists: [],
    albums: [],
    artists: [],
    mvs: [],
    cloudDisk: [],
    playHistory: {
      weekData: [],
      allData: []
    }
  }
}
const mutations = {
  updateData(state, { key, value }) {
    state.liked[key] = value
  },
  updateLikedXXX(state, { name, data }) {
    state.liked[name] = data
  },
  updateLiked(state, id) {
    const newLikeSongs = state.liked.songs
    newLikeSongs.push(id)
    state.liked.songs = newLikeSongs
    console.log(state.liked.songs)
  },
  updataLikePlayList(state, id) {
    const newLikeSongs = state.liked.playlists
    newLikeSongs.push(id)
    state.liked.playlists = newLikeSongs
    console.log(state.liked.playlists)
  },
  updataLikeArtList(state, id) {
    const newLikeSongs = state.liked.artists
    newLikeSongs.push(id)
    state.liked.artists = newLikeSongs
    console.log(state.liked.artists)
  },
  updataLikeAlbums(state, id) {
    const newLikeSongs = state.liked.albums
    newLikeSongs.push(id)
    state.liked.albums = newLikeSongs
    console.log(state.liked.albums)
  },
  updataLikeMVs(state, id) {
    const newLikeSongs = state.liked.mvs
    newLikeSongs.push(id)
    state.liked.mvs = newLikeSongs
    console.log(state.liked.mvs)
  }
}
const actions = {
  async likeATracks({ state, dispatch, commit }, id) {
    if (!isAccountLoggedIn()) {
      dispatch('toast/showToast', '此操作需要登录网易云账号', { root: true })
      return
    }
    let like = true
    if (state.liked.songs.includes(id)) like = false
    try {
      const res = await likeATrack({ id, like })
      console.log(res)
      if (like === false) {
        commit('updateLikedXXX', {
          name: 'songs',
          data: state.liked.songs.filter(d => d !== id)
        })
      } else {
        commit('updateLiked', id)
      }
      // dispatch('user/getUserDetail', '', { root: true })
      // dispatch('fetchLikedSongsWithDetails')
    } catch (err) {
      console.log(err)
      dispatch('toast/showToast', '操作失败，专辑下架或版权锁定', { root: true })
    }
  },
  async likePlayLists({ state, dispatch, commit }, id) {
    if (!isAccountLoggedIn()) {
      dispatch('toast/showToast', '此操作需要登录网易云账号', { root: true })
      return
    }
    let like = 1
    const arr = state.liked.playlists.filter((i) => i === id)
    // console.log(arr)
    if (arr.length > 0) like = 2
    const res = await subscribePlaylist({ t: like, id })
    console.log(res)
    if (like === 2) {
      commit('updateLikedXXX', {
        name: 'playlists',
        data: state.liked.playlists.filter(d => d !== id)
      })
    } else {
      commit('updataLikePlayList', id)
    }
  },
  async likeArtist({ state, dispatch, commit }, id) {
    if (!isAccountLoggedIn()) {
      dispatch('toast/showToast', '此操作需要登录网易云账号', { root: true })
      return
    }
    let like = 1
    const arr = state.liked.artists.filter((i) => i === id)
    console.log(arr)
    if (arr.length > 0) like = 0
    const res = await followAArtist({ t: like, id })
    console.log(res)
    if (like === 0) {
      console.log(state.liked.artists.filter(d => d !== id), '10i6')
      commit('updateLikedXXX', {
        name: 'artists',
        data: state.liked.artists.filter(d => d !== id)
      })
    } else {
      commit('updataLikeArtList', id)
    }
  },
  async likeAlbums({ state, dispatch, commit }, id) {
    if (!isAccountLoggedIn()) {
      dispatch('toast/showToast', '此操作需要登录网易云账号', { root: true })
      return
    }
    let like = 1
    const arr = state.liked.albums.filter((i) => i === id)
    console.log(arr)
    if (arr.length > 0) like = 0
    const res = await likeAAlbum({ t: like, id })
    console.log(res)
    if (like === 0) {
      console.log(state.liked.albums.filter(d => d !== id), '10i6')
      commit('updateLikedXXX', {
        name: 'albums',
        data: state.liked.albums.filter(d => d !== id)
      })
    } else {
      commit('updataLikeAlbums', id)
    }
  },
  async likeMvs({ state, dispatch, commit }, id) {
    if (!isAccountLoggedIn()) {
      dispatch('toast/showToast', '此操作需要登录网易云账号', { root: true })
      return
    }
    let like = 1
    const arr = state.liked.mvs.filter((i) => i === id)
    console.log(arr)
    if (arr.length > 0) like = 0
    const res = await likeAMV({ t: like, mvid: id })
    console.log(res)
    if (like === 0) {
      // console.log(state.liked.mvs.filter(d => d !== id), '10i6')
      commit('updateLikedXXX', {
        name: 'mvs',
        data: state.liked.mvs.filter(d => d !== id)
      })
    } else {
      commit('updataLikeMVs', id)
    }
  },
  fetchLikedSongsWithDetails: ({ state, commit }) => {
    return getPlaylistDetail('', true).then(
      result => {
        if (result.playlist?.trackIds?.length === 0) {
          return new Promise(resolve => {
            resolve()
          })
        }
        return getTrackDetail(
          result.playlist.trackIds
            .slice(0, 12)
            .map(t => t.id)
            .join(',')
        ).then(result => {
          commit('updateLikedXXX', {
            name: 'songsWithDetails',
            data: result.songs
          })
        })
      }
    )
  },
  fetchLikedSongs: (context) => {
    if (isAccountLoggedIn()) {
      const uid = context.rootState.user.profile.userId
      return userLikedSongsIDs({ uid }).then(result => {
        if (result.ids) {
          context.commit('updateLikedXXX', {
            name: 'songs',
            data: result.ids
          })
        }
      })
    } else {
      // TODO:搜索ID登录的用户
    }
  },
  fetchLikedPlaylist: async(context) => {
    if (!isAccountLoggedIn()) return
    if (isAccountLoggedIn()) {
      await userPlaylist({
        uid: context.rootState.user.profile.userId,
        limit: 2000,
        timestamp: new Date().getTime()
      }).then(result => {
        if (result.playlist) {
          // console.log(result, 'res')
          context.commit('updateLikedXXX', {
            name: 'playlists',
            data: result.playlist.map(i => i.id)
          })
          // 更新用户”喜欢的歌曲“歌单ID
          context.commit('updateData', {
            key: 'likedSongPlaylistID',
            value: result.playlist[0].id
          })
          // console.log(result.playlist[0].id)
          setStore('likedSongPlaylistID', result.playlist[0].id)
        }
      })
    } else {
      // TODO:搜索ID登录的用户
    }
  },
  fetchLikedArtists: ({ commit }) => {
    if (!isAccountLoggedIn()) return
    return likedArtists({ limit: 2000 }).then(result => {
      if (result.data) {
        commit('updateLikedXXX', {
          name: 'artists',
          data: result.data.map(i => i.id)
        })
      }
    })
  },
  fetchLikedAlbums: ({ commit }) => {
    if (!isAccountLoggedIn()) return
    return likedAlbums({ limit: 2000 }).then(result => {
      if (result.data) {
        commit('updateLikedXXX', {
          name: 'albums',
          data: result.data.map(i => i.id)
        })
      }
    })
  },
  fetchLikedMVs: ({ commit }) => {
    if (!isAccountLoggedIn()) return
    return likedMVs({ limit: 1000 }).then(result => {
      console.log(result)
      if (result.data) {
        commit('updateLikedXXX', {
          name: 'mvs',
          data: result.data.map(i => i.vid)
        })
      }
    })
  },
  fetchPlayHistory: (context) => {
    if (!isAccountLoggedIn()) return
    return Promise.all([
      userPlayHistory({ uid: context.rootState.user.profile?.userId, type: 0 }),
      userPlayHistory({ uid: context.rootState.user.profile?.userId, type: 1 })
    ]).then(result => {
      const data = {}
      const dataType = { 0: 'allData', 1: 'weekData' }
      if (result[0] && result[1]) {
        for (let i = 0; i < result.length; i++) {
          const songData = result[i][dataType[i]].map(item => {
            const song = item.song
            song.playCount = item.playCount
            return song
          })
          data[[dataType[i]]] = songData
        }
        context.commit('updateLikedXXX', {
          name: 'playHistory',
          data: data
        })
      }
    })
  }
}
const getters = {
  likedSongs: (state) => {
    return state.liked.name
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
