import { getSignDetail } from '@/api/project/industry-sign'
const sign = {
  namespaced: true,
  state: {
    form: {
      signListData: [],
      sign: '',
      categoryId: '',
      industryId: ''
    },
    controlSign: {
      und: null,
      judge: false
    },
    controlDate:{
      judge:false,
      date:null
    }
  },
  getters: {},
  actions: {
    getSignInit({ commit }, payload) {
      console.log('store ,sign 调试', payload)
      /** 先清空数据 */
      commit('setSignInit', {
        extSignNames: []
      })

      return new Promise((resolve, reject) => {
        getSignDetail({ id: payload.id })
          .then(res => {
            const { data } = res

            if (data.code === 0) {
              commit('setSignInit', data.data)
              resolve()
            } else {
              reject()
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    clearForm({ commit }, payload) {
      commit('clearForm', {})
    },
    signChange({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('signChange', payload)

        resolve()
      })
    },
    formChange({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('formChange', payload)

        resolve()
      })
    },
    addExtend({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        if (state.form.signListData.length < 10) {
          commit('addExtend', payload)
          resolve()
        } else {
          reject('最多只能添加 10 个签名扩展')
        }
      })
    },
    deleteExtend({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        commit('deleteExtend', payload)

        resolve()
      })
    },
    formChange({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('formChange', payload)

        resolve()
      })
    },
    extendFormChange({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('extendFormChange', payload)

        resolve()
      })
    },
    controlSign({ commit }, payload) {
      console.log(payload, 'controlSignpayload')
      commit('controlSign', payload)
    },
    controlDate({commit},payload){
      commit('controlDate',payload)
    }
  },
  mutations: {
    setSignInit: (state, payload) => {
      console.log(payload, 'payloaddddddddd')
      /** 如果有数据 */
      if (payload.extSignNames.length != 0) {
        payload.extSignNames.forEach(item => {
          item.signNames = item.signNames.join('\n')
        })
        // state.form.signListData=payload
        state.form = {
          ...state.form,
          categoryId: payload.categoryId,
          industryId: payload.industryId,
          sign: payload.sign,
          signListData: payload.extSignNames
        }
      } else {
        // state.form.signListData = [];
        state.form = {
          ...state.form,
          categoryId: payload.categoryId,
          industryId: payload.industryId,
          sign: payload.sign,
          signListData: []
        }
      }
    },
    clearForm: (state, payload) => {
      state.form = {
        signListData: [],
        sign: '',
        categoryId: '',
        industryId: ''
      }
    },
    signChange: (state, payload) => {
      state.form.signListData[payload.extendIndex][payload.name] = payload.value
      console.log('store,,,,', state.form.signListData)
    },
    formChange: (state, payload) => {
      console.log(payload, 'formchange')
      state.form[payload.name] = payload.value
    },
    addExtend: (state, payload) => {
      state.form.signListData.push(payload)
    },
    deleteExtend: (state, payload) => {
      console.log(payload, '删除')
      state.form.signListData.splice(payload.index, 1)
    },

    extendFormChange: (state, payload) => {
      if (payload.name) {
        state.form.signListData[payload.extendIndex][payload.name] =
          payload.value
      }
    },
    controlSign: (state, payload) => {
      state.controlSign.judge = payload.judge
      state.controlSign.und = payload.und
    },
    controlDate:(state,payload)=>{
      state.controlDate.judge=payload.judge
      state.controlDate.date=payload.date
    }
  }
}

export default sign
