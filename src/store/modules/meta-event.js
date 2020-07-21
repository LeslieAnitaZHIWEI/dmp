import { getStore, setStore } from '@/util/store'
import { isURL, validatenull } from '@/util/validate';
import { getTypeListByProjectId, addEventType, editEventType, deleteEventType } from '@/api/project/meta-event';
import { deepClone, encryption } from '@/util/util';

const metaEvent = {
  state: {
    meteEventTypes: []
  },

  actions: {
    /** 获取元事件类型 */
    getMetaEventTypes: ({ commit, state }, payload) => {
      return new Promise((resolve, reject) => {

        getTypeListByProjectId({
          id: payload.projectId
        }).then((res) => {
          const { data } = res;

          if (data.code === 0) {

            commit('SET_EVENT_TYPES', {
              types: data.data
            })

            resolve();
          }

        }).catch(e => {
          reject(e);
        });
      });
    },

    addMetaEventType({ commit, rootState, dispatch }, payload) {

      return new Promise((resolve, reject) => {

        addEventType(payload).then((res) => {
          const { data } = res;

          if (data.code === 0) {

            dispatch('getMetaEventTypes', {
              projectId: rootState.project.projectId
            });

            resolve();
          }

        }).catch(e => {
          reject(e);
        });
      });

    },

    editMetaEventType({ dispatch, rootState }, payload) {

      return new Promise((resolve, reject) => {

        editEventType(payload).then((res) => {
          const { data } = res;

          if (data.code === 0) {

            /** 重新获取元事件类型 */
            dispatch('getMetaEventTypes', {
              projectId: rootState.project.projectId
            });

            resolve();
          }

        }).catch(e => {console.log(e);
          reject(e);
        });
      });

    },

    deleteMetaEventType({ dispatch, rootState }, payload) {

      return new Promise((resolve, reject) => {

        deleteEventType(payload).then((res) => {
          const { data } = res;

          if (data.code === 0) {

            /** 重新获取元事件类型 */
            dispatch('getMetaEventTypes', {
              projectId: rootState.project.projectId
            });

            resolve();
          }

        }).catch(e => {
          reject(e);
        });
      });

    }
  },

  mutations: {
    'SET_EVENT_TYPES': (state, payload) => {
      state.meteEventTypes = payload.types;
    }
  }
};

export default metaEvent;
