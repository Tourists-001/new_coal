
import { getStore } from '@/utils/index'
import pcSetting from '@/settings/pcSetting'
const { isShowAppleMusic, musicLanguage, nyancatStyle, subTitleDefault, enableReversedMode, theme, lyricsBackground, lyricFontSize, showLyricsTranslation } = pcSetting
const state = {
  isShowAppleMusic: isShowAppleMusic, // 是否显示Apple Music
  musicLanguage: musicLanguage,
  nyancatStyle: nyancatStyle,
  subTitleDefault: subTitleDefault,
  enableReversedMode: enableReversedMode,
  theme: theme,
  lyricsBackground: lyricsBackground,
  lyricFontSize: lyricFontSize,
  showLyricsTranslation: showLyricsTranslation
}

const mutations = {
  CHANGE_PCSETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
      getStore('pcSetting', state)
    }
  }
}
const actions = {
  changePCSetting({ commit }, data) {
    commit('CHANGE_PCSETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
