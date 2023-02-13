import Vue from 'vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
Vue.filter('formatPlayCount', count => {
  if (!count) return ''
  if (count > 100000000) {
    return `${Math.floor((count / 100000000) * 100) / 100}亿` // 2.32 亿
  }
  if (count > 100000) {
    return `${Math.floor((count / 10000) * 10) / 10}万` // 232.1 万
  }
  if (count > 10000) {
    return `${Math.floor((count / 10000) * 100) / 100}万` // 2.3 万
  }
  return count
}
)

Vue.filter('resizeImage', (imgUrl, size = 512) => {
  if (!imgUrl) return ''
  let httpsImgUrl = imgUrl
  if (imgUrl.slice(0, 5) !== 'https') {
    httpsImgUrl = 'https' + imgUrl.slice(4)
  }
  return `${httpsImgUrl}?param=${size}y${size}`
})

Vue.filter('formatTime', (Milliseconds, format = 'HH:MM:SS') => {
  if (!Milliseconds) return ''
  dayjs.extend(duration)
  dayjs.extend(relativeTime)

  const time = dayjs.duration(Milliseconds)
  const hours = time.hours().toString()
  const mins = time.minutes().toString()
  const seconds = time.seconds().toString().padStart(2, '0')

  if (format === 'HH:MM:SS') {
    return hours !== '0'
      ? `${hours}:${mins.padStart(2, '0')}:${seconds}`
      : `${mins}:${seconds}`
  }
  // } else if (format === 'Human') {
  //   let hoursUnit, minitesUnit
  //   switch (locale.locale) {
  //     case 'zh-CN':
  //       hoursUnit = '小时'
  //       minitesUnit = '分钟'
  //       break
  //     case 'zh-TW':
  //       hoursUnit = '小時'
  //       minitesUnit = '分鐘'
  //       break
  //     default:
  //       hoursUnit = 'hr'
  //       minitesUnit = 'min'
  //       break
  //   }
  //   return hours !== '0'
  //     ? `${hours} ${hoursUnit} ${mins} ${minitesUnit}`
  //     : `${mins} ${minitesUnit}`
  // }
})

Vue.filter('formatDate', (timestamp, format = 'MMM D, YYYY') => {
  if (!timestamp) return ''
  return dayjs(timestamp).format(format)
})

Vue.filter('formatAlbumType', (type, album) => {
  if (!type) return ''
  if (type === 'EP/Single') {
    return album.size === 1 ? 'Single' : 'EP'
  } else if (type === 'Single') {
    return 'Single'
  } else if (type === '专辑') {
    return 'Album'
  } else {
    return type
  }
})
