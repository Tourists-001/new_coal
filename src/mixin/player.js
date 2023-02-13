import { Howl, Howler } from 'howler'
import { getMP3, getTrackDetail, scrobble } from '@/api/track'
import { isAccountLoggedIn } from '@/utils/auth'
export default {
  data() {
    return {
      playList: [],
      howler: null,
      currentTrack: { id: 86827685 }, // 当前播放歌曲的详细信息
      playlistSource: { type: 'album', id: 123 }, // 当前播放列表的信息
      isPersonalFM: false, // 是否是私人FM模式
      repeatMode: 'off' // off | on | one
    }
  },
  methods: {
    // 开始播放歌曲
    async playAudioSource(source, autoplay = true) {
      Howler.unload()
      this.howler = new Howl({
        src: [source],
        html5: true,
        preload: true,
        format: ['mp3', 'flac'],
        onend: () => {
          this.nextTrackCallback()
        }
      })
      if (autoplay) {
        // 如果是自动播放，则直接播放下一首
        // this.play()
        // if (this.currentTrack.name) {}
      }
    },
    // 播放下一首歌曲
    nextTrackCallback() {
      // 记录播放的时间
      this.scrobble(this.currentTrack, 0, true)

      if (!this.isPersonalFM && this.repeatMode === 'one') {
        // 当前是单曲循环模式
        this.replaceCurrentTrack(this.currentTrack.id)
      } else if (this.isPersonalFM) {
        // 私人FM模式
        this.playNextFMTrack()
      } else {
        // 随机播放和顺序播放
        this.playNextTrack()
      }
    },
    // 替换当前歌曲
    /**
     *
     * @param {替换的id} id
     * @param {是否自动播放} autoplay
     * @param {如果无法播放如何处理} ifUnplayableThen
     */
    replaceCurrentTrack(id, autoplay = true, ifUnplayableThen = 'playNextTrack') {
      if (autoplay && this.currentTrack.name) {
        this.scrobble(this.currentTrack, this.howler?.seek())
      }
      return getTrackDetail(id).then(data => {
        const track = data.songs[0]
        this.currentTrack = track
        return this.getAudioSourceFromNetease(track).then(source => {
          if (source) {
            this.playAudioSource(source, autoplay)
          }
        })
      })
    },
    // 获取播放url
    getAudioSourceFromNetease(track) {
      if (isAccountLoggedIn()) {
        return getMP3(track.id).then(result => {
          if (!result.data[0]) return null
          if (!result.data[0].url) return null
          if (result.data[0].freeTrialInfo !== null) return null // 跳过只能试听的歌曲
          const source = result.data[0].url.replace(/^http:/, 'https:')
          // if (store.state.settings.automaticallyCacheSongs) {
          //   // 是否自动缓存歌曲
          //   cacheTrackSource(track, source, result.data[0].br)
          // }
          return source
        })
      } else {
        return new Promise(resolve => {
          resolve(`https://music.163.com/song/media/outer/url?id=${track.id}`)
        })
      }
    },
    // 记录播放时间
    /**
     *
     * @param {被记录的歌曲信息} track
     * @param {播放的时间} time
     * @param {是否完成} completed
     */
    async scrobble(track, time, completed = false) {
      console.debug(
        `[debug][Player.js] scrobble track 👉 ${track.name} by ${track.ar[0].name} 👉 time:${time} completed: ${completed}`
      )
      const trackDuration = ~~(track.dt / 1000)
      time = completed ? trackDuration : ~~time
      await scrobble({
        id: track.id,
        sourceid: this.playlistSource.id,
        time
      })
    }
  }
}
