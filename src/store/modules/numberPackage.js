const numberPackage = {
  state: {
    citys: [],
    isOpen: false,
    ispTypes: [],
    testPhoneList: '',
    textPhone: false,
    isContainCity: 1,
    isContainIspType: 1
  },
  actions: {
    // 发送错误日志
    changeCitys({ state, commit }, payload) {
      console.log('changeCitys', payload)
      commit('changeCitys', payload)
    },
    changeIsOpen({ state, commit }, payload) {
      console.log('changeIsOpen', payload)
      commit('changeIsOpen', payload)
    },
    changeIspTypes({ state, commit }, payload) {
      console.log('changeIspTypes', payload)
      commit('changeIspTypes', payload)
    },
    changeTestPhoneList({ commit }, payload) {
      commit('changeTestPhoneList', payload)
    },
    changeisContainIspType({ commit }, payload) {
      commit('changeisContainIspType', payload)
    },
    changeIsContainCity({ commit }, payload) {
      commit('changeIsContainCity', payload)
    }
  },
  mutations: {
    changeCitys: (state, payload) => {
      console.log('changeCitys333', payload)
      state.citys = payload.citys
    },
    changeIsOpen: (state, payload) => {
      state.isOpen = payload.isOpen
    },
    changeIspTypes: (state, payload) => {
      state.ispTypes = payload.ispTypes
    },
    changeTestPhoneList: (state, payload) => {
      state.testPhoneList = payload.testPhoneList
      state.textPhone = payload.textPhone
    },
    changeisContainIspType: (state, payload) => {
      state.isContainIspType = payload.isContainIspType
      console.log('tchangeisContainIspTypee的改变', state.isContainIspType)
    },
    changeIsContainCity: (state, payload) => {
      state.isContainCity = payload.isContainCity
    }
  }
}

export default numberPackage
