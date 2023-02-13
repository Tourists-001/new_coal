const state = {
  showLyrics: false
}

const mutations = {
  toggleLyrics: (state, data) => {
    state.showLyrics = !state.showLyrics
  }
}

const actions = {
  showLyrics: ({ commit }, data) => {
    commit('toggleLyrics', data)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
