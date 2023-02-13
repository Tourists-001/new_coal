// import router from '../router'
import store from '../store'

export function hasListSource() {
  // console.log(store.state.player.isPersonalFM)
  return !store.state.player.isPersonalFM && store.state.player.playlistSourceType.id !== 0
}

// export function goToListSource() {
//   router.push({ path: getListSourcePath() })
// }

export function getListSourcePath() {
  if (store.state.player.playlistSourceType.id === store.state.data.likedSongPlaylistID) {
    return '/library/liked-songs'
  } else if (store.state.player.playlistSourceType.type === 'url') {
    return store.state.player.playlistSourceType.id
  } else if (store.state.player.playlistSourceType.type === 'cloudDisk') {
    return '/library'
  } else {
    return `/${store.state.player.playlistSourceType.type}/${store.state.player.playlistSourceType.id}`
  }
}
