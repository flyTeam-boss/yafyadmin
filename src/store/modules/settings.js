import defaultSettings from '@/settings'
const { theme } = defaultSettings
// showSettings, tagsView, fixedHeader, sidebarLogo,

const state = {
  theme: theme,
  // showSettings: showSettings,
  // tagsView: tagsView,
  // fixedHeader: fixedHeader,
  // sidebarLogo: sidebarLogo
  showSettings: true,
  tagsView: true,
  fixedHeader: true,
  sidebarLogo: true
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

