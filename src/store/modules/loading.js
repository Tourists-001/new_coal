const state = {
  loading: true
}

const mutations = {
  updataLoading: (state, data) => {
    state.loading = data
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
