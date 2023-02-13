import shuffle from 'lodash/shuffle'
import { getPlaylistDetail } from '@/api/playlist'
import { getMP3, getTrackDetail } from '@/api/track'
import { getArtist } from '@/api/artist'
import { getAlbum } from '@/api/album'
// import { personalFM } from '@/api/others'
import { isAccountLoggedIn } from '@/utils/auth'
import { Howl, Howler } from 'howler'
import { getStore, setStore } from '@/utils'
let howler
// let volume = 1
const PLAY_PAUSE_FADE_DURATION = 200
const state = {
  enabled: false, // 是否启用enabled
  playListID: [], // 当前播放列表的id
  current: 0, // 当前正在播放歌曲的index
  playlistSourceType: getStore('playlistSourceType') || { type: 'playlist', id: 5278068783 }, // 当前播放列表的信息
  currentTrack: {}, // 当前播放歌曲的信息
  shuffledList: [], // 随机播放列表
  shuffle: false, // 是否随机播放
  onshuffledList: [], // 未随机的列表
  playing: false, // 是否开始播放
  volume: 1, // 播放的声音
  playNextList: [], // 插队播放
  repeatMode: 'off', // 循环方式
  reversed: false, // 是否倒叙播放
  preTrack: [], // 上一首播放的歌曲
  nextTrack: [], // 下一首播放的歌曲
  shuffledCurrent: 0, // 随机播放的索引
  liked: false, //
  isPersonalFM: false,
  volumeBeforeMuted: 1, // 保存静音前的音量
  likedPlayList: false, // 是否喜欢歌单
  currentPlayListid: '',
  changepalyListLiked: false,
  personalFMTrack: { id: 0 },
  personalFMNextTrack: { id: 0 }
}

const mutations = {
  changeEnabled(state, data) {
    state.enabled = data
  },
  changePlayListID(state, data) {
    // state.shuffle ? state.playListID = state.shuffledList : state.playListID = data
    // state.onshuffledList = data
    if (state.shuffle) {
      // 开启循环
      state.onshuffledList = data
      state.playListID = state.shuffledList
    } else {
      state.playListID = state.onshuffledList.length > 0 ? state.onshuffledList : data
    }
  },
  changeCurrent(state, data) {
    // state.shuffle ? state.current = state.shuffledCurrent : state.current = data
    state.current = data
  },
  changePlaylistSource(state, data) {
    state.playlistSourceType = data
    setStore('playlistSourceType', data)
  },
  changeCurrentTrack(state, data) {
    state.currentTrack = data
  },
  setPlaying(state, data) {
    state.playing = data
  },
  changeShuffle(state, data) {
    state.shuffle = data
  },
  changeshuffledList(state, data) {
    state.onshuffledList = data
  },
  shuffleTheList(state, firstTrackID = state.currentTrack.id) {
    let playListID = state.playListID.filter(tid => tid !== firstTrackID)
    if (firstTrackID === 'first') playListID = state.playListID
    state.shuffledList = shuffle(playListID)
    if (firstTrackID !== 'first') state.shuffledList.unshift(firstTrackID)
    // console.log(state.playListID)
  },
  // 查找下一首歌曲
  getNextTrack(state) {
    const next = state.reversed ? state.current - 1 : state.current + 1
    if (state.playNextList.length > 0) {
      const trackID = state.playNextList.shift()
      state.nextTrack = [trackID, state.current]
      console.log(state.nextTrack, '82')
      return
    }
    // 循环模式开启，则重新播放当前模式下的相对的下一首
    if (state.repeatMode === 'on') {
      if (state.reversed && state.current === 0) {
        // 倒序模式，当前歌曲是第一首，则重新播放列表最后一首
        state.nextTrack = [state.playListID[state.playListID.length - 1], state.playListID.length - 1]
      } else if (state.playListID.length === state.current + 1) {
        // 正序模式，当前歌曲是最后一首，则重新播放第一首
        state.nextTrack = [state.playListID[0], 0]
      }
    }
    state.nextTrack = [state.playListID[next], next]
  },
  // 查找上一首歌曲
  getPrevTrack(state) {
    const next = state.reversed ? state.current + 1 : state.current - 1

    // 循环模式开启，则重新播放当前模式下的相对的下一首
    if (state.repeatMode === 'on') {
      if (state.reversed && state.current === 0) {
        // 倒序模式，当前歌曲是最后一首，则重新播放列表第一首
        state.preTrack = [state.playListID[0], 0]
      } else if (state.playListID.length === state.current + 1) {
        // 正序模式，当前歌曲是第一首，则重新播放列表最后一首
        state.preTrack = [state.playListID[state.playListID.length - 1], state.playListID.length - 1]
      }
    }

    // 返回 [trackID, index]
    state.preTrack = [state.playListID[next], next]
  },
  // 设置播放顺序
  switchRepeatModes(state) {
    // console.log(state.repeatMode)
    if (state.repeatMode === 'on') {
      state.repeatMode = 'one'
    } else if (state.repeatMode === 'one') {
      state.repeatMode = 'off'
      // commit('repeatMode', 'off')
    } else {
      state.repeatMode = 'on'
      // commit('repeatMode', 'on')
    }
  },
  // 插队
  changePlayNextList(state, data) {
    console.log(data)
    if (typeof data === 'number') {
      state.playNextList.push(data)
    } else if (typeof data === 'object') {
      for (let i = 0; i < data.length; i++) {
        // console.log(data[i])
        state.playNextList.push(data[i])
      }
    }
  },
  // 是否喜欢
  changeLiked(state, data) {
    state.liked = data
  },
  // 静音
  mutes(state) {
    if (state.volume === 0) {
      // 打开声音
      state.volume = state.volumeBeforeMuted
      howler?.fade(state.volume, state.volume, PLAY_PAUSE_FADE_DURATION)
    } else {
      state.volumeBeforeMuted = state.volume
      state.volume = 0
      howler?.fade(0, 0, PLAY_PAUSE_FADE_DURATION)
    }
  },
  // 修改音量
  changeVolumes(state, val) {
    // console.log(val)
    state.volume = val
    howler?.fade(val, val, PLAY_PAUSE_FADE_DURATION)
  },
  changePlayListid(state, id) {
    state.currentPlayListid = id
  }
}

const actions = {
  // 初始化播放
  init({ commit, state, dispatch }) {
    const { type, id } = state.playlistSourceType
    if (type === 'playlist') {
      dispatch('playPlaylistByID', { id })
    } else if (type === 'url') {
      const tracks = getStore('playDailyTracks')
      dispatch('playDailyTracksCard', { tracks })
    } else if (type === 'artist') {
      dispatch('playPlayListByArt', { id })
    }
  },
  // 替换播放列表
  /**
   *
   * @param {*} param0
   * @param {播放列表的id} trackIDs
   * @param {*} playlistSourceID
   * @param {*} playlistSourceType
   * @param {*} autoPlayTrackID
   */
  replacePlaylist({ commit, state, dispatch }, { trackIDs, playlistSourceID, playlistSourceType, autoPlayTrackID = 'first' }) {
    if (!state.enabled) commit('changeEnabled', true)
    // 修改当前播放列表
    commit('changePlayListID', trackIDs)
    commit('changeshuffledList', trackIDs)
    // 修改current
    commit('changeCurrent', 0)
    // 修改playlistsource
    commit('changePlaylistSource', { type: playlistSourceType, id: playlistSourceID })
    // console.log(trackIDs, playlistSourceID, playlistSourceType, autoPlayTrackID)
    // 随机播放
    if (state.shuffle) commit('shuffleTheList', autoPlayTrackID)
    if (autoPlayTrackID === 'first') {
      dispatch('replaceCurrentTrack', { id: state.playListID[0] })
    } else {
      commit('changeCurrent', trackIDs.indexOf(autoPlayTrackID))
      dispatch('replaceCurrentTrack', { id: autoPlayTrackID })
    }
  },
  // 切换当前播放歌曲
  /**
   *
   * @param {当前播放的歌曲id} id
   * @param {是否自动播放} autoplay
   */
  async replaceCurrentTrack({ commit, state, dispatch }, { id, autoplay = true, ifUnplayableThen = 'playNextTrack' }) {
    // console.log('object')
    // !如果想保存历史记录，可以写在这里
    // 通过id获取歌曲详情
    // console.log(id)
    commit('loading/updataLoading', true, { root: true })
    const data = await getTrackDetail(id)
    // console.log(data)
    const track = data.songs[0]
    commit('changeCurrentTrack', track)
    dispatch('isCurrentTrackLiked')
    // 判断歌曲是否可以播放
    dispatch('isMusicplay', { autoplay, ifUnplayableThen })
  },
  // 判断歌曲是否可以播放
  async isMusicplay({ commit, state, dispatch }, { autoplay, ifUnplayableThen = 'playNextTrack' }) {
    if (!state.currentTrack) dispatch('toast/showToast', `无正在播放的歌曲`, { root: true })
    const source = await getAudioSourceFromNetease(state.currentTrack)
    console.log(source)
    commit('loading/updataLoading', false, { root: true })
    if (!source) {
      dispatch('toast/showToast', `无法播放 ${state.currentTrack.name}`, { root: true })
      if (ifUnplayableThen === 'playNextTrack') {
        // 当遇到无法播放的歌曲则直接播放下一首歌曲
        dispatch('playNextTracks')
      }
    }
    // 歌曲可以播放
    dispatch('playAudioSource', { source, autoplay })
  },
  // 播放歌曲
  playAudioSource({ state, commit, dispatch }, { source, autoplay = true }) {
    // commit('setPlaying', true)
    Howler.unload()
    howler = new Howl({
      src: [source],
      html5: true,
      preload: true,
      format: ['mp3', 'flac'],
      onend: () => {
        // this.nextTrackCallback()
        dispatch('nextTrackCallback')
      }
    })
    // console.log(howler)
    if (autoplay) {
      dispatch('play')
      if (state.currentTrack.name) {
        setTitle(state.currentTrack)
        // vuex存储title
        commit('title/updateTitle', document.title, { root: true })
      }
    }
    // this.setOutputDevice()
  },
  // 播放
  play({ state, commit, dispatch }) {
    commit('setPlaying', true)
    if (!state.enabled) commit('changeEnabled', true)
    if (!state.playing) {
      return
    }
    if (howler?.playing()) return
    changeProgress()
    commit('loading/updataLoading', false, { root: true })
    howler?.play()
    howler?.once('play', () => {
      howler?.fade(0, state.volume, PLAY_PAUSE_FADE_DURATION)
      commit('setPlaying', true)
      // 设置标题
      if (state.currentTrack.name) {
        setTitle(state.currentTrack)
      }
    })
  },
  // 播放下一首
  playNextTracks({ state, commit, dispatch }) {
    // console.log('object')
    // !切换歌曲时增加加载中的状态
    // 查找下一首歌曲
    commit('getNextTrack')
    const [trackID, index] = state.nextTrack
    // console.log(state.nextTrack, 292)
    if (trackID === undefined) {
      howler?.stop()
      commit('setPlaying', false)
      return
    }
    commit('changeCurrent', index)
    // console.log(state.nextTrack)
    dispatch('replaceCurrentTrack', { id: trackID })
    // dispatch('replaceCurrentTrack', { type: 'music', id: trackID, ifUnplayableThen: 'playNextTrack' })
  },
  // 播放上一首歌曲
  playPrevTracks({ state, commit, dispatch }) {
    commit('getPrevTrack')
    const [trackID, index] = state.preTrack
    if (trackID === undefined) return false
    commit('changeCurrent', index)
    dispatch('replaceCurrentTrack', { type: 'music', id: trackID, ifUnplayableThen: 'playNextTrack' })
  },
  // 下一首播放
  nextTrackCallback({ commit, state, dispatch }) {
    // 如果想设置历史记录可以在这里设置
    if (state.repeatMode === 'one') {
      dispatch('replaceCurrentTrack', { id: state.currentTrack.id })
    } else {
      dispatch('playNextTracks')
    }
  },
  // 开始还是暂停
  playOrPauses({ state, commit, dispatch }) {
    // console.log('object')
    if (howler?.playing()) {
      // this.pause()
      commit('setPlaying', false)
      dispatch('pause')
    } else {
      // this.play()
      commit('setPlaying', true)
      dispatch('play')
    }
  },
  // 暂停
  pause({ state, commit, dispatch }) {
    howler?.fade(state.volume, 0, PLAY_PAUSE_FADE_DURATION)
    howler?.once('fade', () => {
      howler?.pause()
      commit('setPlaying', false)
      setTitle(null)
    })
  },
  // 随机播放
  switchShuffles({ commit, state, dispatch }) {
    if (state.shuffle) {
      // state.shuffle = false
      commit('changeShuffle', false)
      // commit('shuffleTheList')
      commit('changePlayListID', state.onshuffledList)
    } else {
      // state.shuffle = true
      commit('changeShuffle', true)
      commit('shuffleTheList')
      commit('changePlayListID', state.onshuffledList)
    }
  },
  // 插队播放
  addTrackToPlayNext({ commit, state, dispatch }, { id, autoplay = true }) {
    // console.log('object', id)
    commit('changePlayNextList', id)
    if (autoplay) {
      dispatch('playNextTracks')
    }
  },
  // 修改播放的时间
  updataProgress({ state, commit, dispatch }, time = null) {
    if (time === null) return
    howler?.seek(time)
    if (state.playing) {
      console.log('playing')
    }
  },
  // 是否喜欢
  isCurrentTrackLiked(context, data) {
    const liked = context.rootState.liked.liked.songs.includes(state.currentTrack.id)
    console.log(liked)
    // console.log(liked)
    context.commit('changeLiked', liked)
  },
  // 通过歌单id获取播放列表
  async playPlaylistByID({ commit, state, dispatch }, { id, trackID = 'first', noCache = false }) {
    // console.log(
    //   `[debug][Player.js] playPlaylistByID 👉 id:${id} trackID:${trackID} noCache:${noCache}`
    // )
    console.log(id, 'ids')
    const res = await getPlaylistDetail(id, noCache)
    // 存储当前播放歌单的id
    commit('changePlayListid', id)
    const trackIDs = res.playlist.trackIds.map(t => t.id)
    dispatch('replacePlaylist', { trackIDs, playlistSourceID: id, playlistSourceType: 'playlist', autoPlayTrackID: trackID })
  },
  // 播放每日推荐
  playDailyTracksCard({ commit, state, dispatch }, { trackIDs, trackID = 'first', noCache = false }) {
    console.log(trackIDs, trackID)
    dispatch('replacePlaylist', { trackIDs: trackIDs, playlistSourceID: '/daily/songs', playlistSourceType: 'url', autoPlayTrackID: trackID })
  },
  // 通过艺人id获取播放列表
  async playPlayListByArt({ commit, state, dispatch }, { id, trackID = 'first', noCache = false }) {
    const res = await getArtist(id)
    const popularTracks = res.hotSongs
    const trackIDs = popularTracks.map(t => t.id)
    dispatch('replacePlaylist', { trackIDs, playlistSourceID: id, playlistSourceType: 'artist', autoPlayTrackID: trackID })
  },
  // 通过专辑id获取播放列表
  async playPlayListByAlbum({ commit, dispatch }, { id, trackID = 'first', noCache = false }) {
    const res = await getAlbum(id)
    // console.log(res)
    const track = res.songs
    const trackIDs = track.map(t => t.id)
    dispatch('replacePlaylist', { trackIDs, playlistSourceID: id, playlistSourceType: 'album', autoPlayTrackID: trackID })
  }
}
// 获取url地址
function getAudioSourceFromNetease(track) {
  if (isAccountLoggedIn()) {
    return getMP3(track.id).then(result => {
      if (!result.data[0]) return null
      if (!result.data[0].url) return null
      if (result.data[0].freeTrialInfo !== null) return null // 跳过只能试听的歌曲
      const source = result.data[0].url.replace(/^http:/, 'https:')
      // if (store.state.settings.automaticallyCacheSongs) {
      //   cacheTrackSource(track, source, result.data[0].br)
      // }
      return source
    })
  } else {
    return new Promise(resolve => {
      resolve(`https://music.163.com/song/media/outer/url?id=${track.id}`)
    })
  }
}

const getters = {
  musicTitle: (state) => {
    return state.currentTrack.name
  },
  musicArt: (state) => {
    return state.currentTrack.ar ? state.currentTrack.ar[0].name : ''
  },
  imgUrl: (state) => {
    return state.currentTrack.al ? state.currentTrack.al.picUrl : ''
  },
  currentTrackDuration: (state) => {
    const trackDuration = state.currentTrack.dt || 1000
    const duration = ~~(trackDuration / 1000)
    // console.log(duration > 1 ? duration - 1 : duration)
    return duration > 1 ? duration - 1 : duration
  },
  currentTrack: (state) => {
    if (state.currentTrack.id) {
      return state.currentTrack
    } else {
      return [1]
    }
  }
}
// 设置title
function setTitle(track) {
  document.title = track
    ? `${track.name} · ${track.ar[0].name} - 星球音乐`
    : '星球音乐'
}

// 修改滚动条进度
function changeProgress() {
  // 由于在vuex中不断触发滚动条，会异常的卡顿，我们把数据存储到本地，在player组件中直接从本地获取
  if (!howler) {
    const progress = 0
    setStore('playerCurrentTrackTime', progress)
    return
  }
  setInterval(() => {
    const progress = howler.seek()
    setStore('playerCurrentTrackTime', progress)
  }, 1000)
}
export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
