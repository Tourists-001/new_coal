import { getToken, setToken } from '@/utils/token'
import { removeStore } from '@/utils'
import { guid } from '@/utils/uid'
import { logout, userAccount, userDetail } from '@/api/user'
const state = {
  token: getToken(),
  account: {},
  profile: JSON.parse(localStorage.getItem('PROFILE')) || {}
}
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ACCOUNT: (state, account) => {
    state.account = account
  },
  SET_PROFILE: (state, profile) => {
    state.profile = profile
  }
}
const actions = {
  setToken: ({ commit }) => {
    const token = guid()
    setToken(token)
    commit('SET_TOKEN', token)
  },
  setAccount: async({ commit }) => {
    const { account, profile } = await userAccount()
    // 存储用户信息到vuex
    commit('SET_ACCOUNT', account)
    commit('SET_PROFILE', profile)
    // 存储用户信息到本地
    localStorage.setItem('PROFILE', JSON.stringify(profile))
    // 存储id到本地
    localStorage.setItem('UID', account.id)
  },
  getUserDetail: async({ state, commit }) => {
    const id = state.profile.userId
    if (!id) {
      return
    }
    const res = await userDetail(id)
    console.log(res)
  },
  logOut: async({ state, commit }) => {
    await logout()
    removeStore('TOKEN')
    commit('SET_ACCOUNT', '')
    commit('SET_PROFILE', '')
    removeStore('UID')
    removeStore('PROFILE')
  }
}
const getters = {
  token: state => {
    return state.token
  },
  profile: state => {
    return state.profile
  },
  avatar: state => {
    return state?.profile?.avatarUrl
  },
  nickname: state => {
    return state.profile?.nickname
  },
  userId: state => {
    return state.profile.userId
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
