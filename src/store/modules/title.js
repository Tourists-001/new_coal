const state = {
  title: 'cola_music'
}

const mutations = {
  updateTitle(state, title) {
    state.title = title
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
