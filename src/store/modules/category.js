import { playlistCategories } from '@/utils/staticData'
const enabledPlaylistCategories = playlistCategories.filter(c => c.enable)
  .map(c => c.name)

const state = {
  enabledPlaylistCategories
}
const mutations = {
  togglePlaylistCategory(state, name) {
    const index = state.enabledPlaylistCategories.findIndex(
      c => c === name
    )
    if (index !== -1) {
      state.enabledPlaylistCategories =
        state.enabledPlaylistCategories.filter(c => c !== name)
    } else {
      state.enabledPlaylistCategories.push(name)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
