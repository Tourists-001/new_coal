const state = {
  device: 'desktop',
  isShowHeader: true,
  isShowBottom: false
}

const mutations = {
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  TOGGLE_HEADER: (state, load) => {
    state.isShowHeader = load
  },
  TOGGLE_BOTTOM: (state, load) => {
    state.isShowBottom = load
  }
}

const actions = {
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  toggleHeader({ commit }, data) {
    commit('TOGGLE_HEADER', data)
  },
  toggleBottom: ({ commit }, load) => {
    commit('TOGGLE_BOTTOM', load)
  }
}

const getters = {
  device: (state) => {
    return state.device
  },
  isShowHeader: (state) => {
    return state.isShowHeader
  },
  isShowBottom: (state) => {
    return state.isShowBottom
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
