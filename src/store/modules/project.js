import { getStore, setStore, removeStore } from '@/util/store'
import { getProjectList, getProjectInfo } from '@/api/project/project'

const project = {
  state: {
    projectList: getStore({ name: 'projectList' }) || [],
    projectPage: getStore({ name: 'projectPage' }) || { currentPage: 1, pageSize: 10, total: 0 },
    projectId: getStore({ name: 'projectId' }) || '',
    projectInfo: getStore({ name: 'projectInfo' }) || {},
    /** 显示 */
    isShowSelectProject: false
  },

  actions: {
    showSelectProject({ commit }, isShow) {
      commit('SHOW_SELECT_PROJECT', { isShowSelectProject: isShow });
    },
    getProjectList({ commit }, payload) {
      return new Promise((resolve, reject) => {

        getProjectList(payload).then((res) => {

          const { data } = res;

          if (data.code === 0) {

            const proDate = data.data;
            const list = proDate && proDate.records || [];

            commit('SET_PROJECT_LIST', { projectList: list });
            commit('SET_PROJECT_PAGE', { projectPage: {
              currentPage: proDate.current,
              pageSize: proDate.size,
              total: proDate.total
            }});

            resolve(list);

          } else {
            reject(data);
          }

        }).catch((e) => {

          reject(e);

        });
      });
    },
    getProjectInfo({ commit }, payload) {

      return new Promise((resolve, reject) => {

        getProjectInfo(payload).then((res) => {

          const data = res.data.data || {};

          commit('SET_PROJECT_INFO', { projectInfo: data })

          resolve(data);

        }).catch((e) => {

          reject(e);

        });

      });
    },

    setProjectInfo({ commit }, payload) {
      commit('SET_PROJECT_INFO', payload);
    },

    clearProjectInfo({ commit }, payload) {
      commit('CLEAR_PROJECT_INFO', payload);
    }
  },

  mutations: {
    SET_PROJECT_INFO(state, payload) {

      state.projectInfo = payload.projectInfo;
      state.projectId = payload.projectInfo.id;

      setStore({ name: 'projectInfo', content: payload.projectInfo, type: 'session' });
      setStore({ name: 'projectId', content: payload.projectInfo.id, type: 'session' });

    },

    CLEAR_PROJECT_INFO(state) {

      state.projectInfo = {};
      state.projectId = '';

      removeStore({
        name: 'projectInfo',
        type: 'session'
      });
      removeStore({
        name: 'projectId',
        type: 'session'
      });

    },

    SET_PROJECT_LIST(state, payload) {
      state.projectList = payload.projectList;
      setStore({ name: 'projectList', content: payload.projectList, type: 'session' });
    },

    SET_PROJECT_PAGE(state, payload) {
      state.projectPage = payload.projectPage;
      setStore({ name: 'projectPage', content: payload.projectPage, type: 'session' });
    },

    SHOW_SELECT_PROJECT(state, payload) {
      state.isShowSelectProject = payload.isShowSelectProject;
    }
  }
};


export default project;
