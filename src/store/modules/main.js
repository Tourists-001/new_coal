const state = {
  enableScrolling: true, // 主页面是否可以滚动
  dailyTracks: [] // 每日推荐的歌曲
}

const mutations = {
  enableScrolling: (state, status = null) => {
    console.log(status)
    state.enableScrolling = status || !state.enableScrolling
  },
  DAILYTRACKS: (state, data) => {
    state.dailyTracks = data
  }
}

const actions = {
  updateDailyTracks: ({ commit }, data) => {
    commit('DAILYTRACKS', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
