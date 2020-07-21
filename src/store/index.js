import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import common from './modules/common';
import tags from './modules/tags';
import logs from './modules/logs';
import project from './modules/project';
import metaEvent from './modules/meta-event';
import userTag from './modules/user-tag';
import sign from './modules/sign';
import getters from './getters';
import numberPackage from './modules/numberPackage';

Vue.use(Vuex)
const store = new Vuex.Store({

  /**
   * 在严格模式下，
   * 无论何时发生了状态变更且不是由 mutation 函数引起的，
   * 将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。
   * @see {@link https://vuex.vuejs.org/zh/guide/strict.html#严格模式 }
   */
  strict: process.env.NODE_ENV !== 'production',

  modules: {
    user,
    common,
    logs,
    tags,
    project,
    metaEvent,
    userTag,
    sign,
    numberPackage
  },
  getters
});

export default store;
