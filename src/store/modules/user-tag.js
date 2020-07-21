/**
 * 主要用于用户标签编辑
 **/
import {
  getUsertagInit,
  getUserTagTypeByProjectId
} from '@/api/project/user-tag'
import {
  getEventListByProjectId,
  getMetaEventPropByEventId
} from '@/api/project/meta-event'
import { validatenull } from '@/util/validate'

/** 标签数据模板 */
// const tagModel = {
//   id: '',
//   code: '',
//   deleteFlag: '',
//   projectId: '',
//   userTagTypeId: '',
//   computeType: '',
//   version: '',
//   name: '',
//   createTime: '',
//   updateTime: ''
// }

// const layerModel = {
//   id: '',
//   name: '',
//   relationDictId: '',
//   sortNumber: '',
//   userTagId: ''
// }

const userTag = {
  namespaced: true,
  state: {
    editTagData: {},

    /**
     * 仅用于标签编辑时使用
     * 可以共用
     */
    editTagTypeList: [],

    /**
     * 事件列表，
     * 可以共用
     **/
    eventList: []
  },
  getters: {},
  actions: {
    getUserTagInit({ commit }, payload) {
      /** 先清空数据 */
      commit('SET_EDIT_USER_TAG', { editTagData: {}})

      return new Promise((resolve, reject) => {
        getUsertagInit(payload)
          .then(res => {
            const { data } = res
            console.log(data.data, 'init tag 初始')
            if (data.code === 0) {
              commit('INIT_EDIT_USER_TAG', { editTagData: data.data })
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

    setEidtUserTag({ commit }, payload) {
      commit('SET_EDIT_USER_TAG', payload)
    },

    setEditUserTagData({ commit }, payload) {
      commit('SET_EDIT_USER_TAG_DATA', payload)
    },

    getUserTagTypeLis({ commit }, payload) {
      /** 先清空数据 */
      commit('SET_EDIT_TAG_TYPE_LIST', { editTagTypeList: {}})

      return new Promise((resolve, reject) => {
        getUserTagTypeByProjectId(payload)
          .then(res => {
            const { data } = res
            if (data.code === 0) {
              commit('SET_EDIT_TAG_TYPE_LIST', { editTagTypeList: data.data })
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

    addUserTagLayer({ commit }, payload) {
      commit('ADD_USER_TAG_LAYER', payload)
    },

    setUserTagLayer({ commit }, payload) {
      commit('SET_USER_TAG_LAYER', payload)
    },

    deleteUserTagLayer({ commit }, payload) {
      commit('DELETE_USER_TAG_LAYER', payload)
    },

    getUserTagEventList({ commit }, payload) {
      commit('SET_USER_TAG_EVENT_LIST', { eventList: [] })

      return new Promise((resolve, reject) => {
        getEventListByProjectId(payload)
          .then(res => {
            const { data } = res

            if (data.code === 0) {
              commit('SET_USER_TAG_EVENT_LIST', { eventList: data.data })
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

    addTagRule({ commit, state }, payload) {
      return new Promise((resolve, reject) => {
        if (state.editTagData.layers[payload.layerIndex].rules.length < 10) {
          commit('ADD_USER_TAG_RULE', payload)
          resolve()
        } else {
          reject('最多只能添加 10 个规则')
        }
      })
    },

    userTagRuleChange({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('SET_USER_TAG_RULE', payload)

        resolve()
      })
    },

    deleteTagRule({ commit }, payload) {
      commit('DELETE_USER_TAG_RULE', payload)
    },

    getMetaEventPropByEventId({ commit }, payload) {
      return new Promise((resolve, reject) => {
        getMetaEventPropByEventId({ id: payload.eventId })
          .then(res => {
            const { data } = res

            if (data.code === 0) {
              commit('SET_EVENT_PROP_LIST_MAP', {
                layerIndex: payload.layerIndex,
                ruleIndex: payload.ruleIndex,
                list: data.data
              })

              /** 如果查询的列表为空，则不显示后面的输入栏 */
              commit('SET_USER_TAG_RULE', {
                layerIndex: payload.layerIndex,
                ruleIndex: payload.ruleIndex,
                name: 'hasProperty',
                value: data.data.length !== 0
              })

              resolve()
            } else {
              reject()
            }
          })
          .catch(e => {
            reject()
          })
      })
    },

    setEventPropListMap({ commit }, payload) {
      commit('SET_EVENT_PROP_LIST_MAP', payload)
    },

    getOperateList({ commit }, payload) {
      commit('SET_EVENT_PROP_LIST_MAP', payload)
    },

    setOperateList({ commit }, payload) {
      commit('SET_OPERATE_LIST', {
        layerIndex: payload.layerIndex,
        ruleIndex: payload.ruleIndex,
        list: payload.list
      })
    },

    setPropertyTypeName({ commit }, payload) {
      commit('SET_PROPERTY_TYPE_NAME', payload)
    }
  },
  mutations: {
    /** 设置整个数据 */
    INIT_EDIT_USER_TAG: (state, payload) => {
      /** 对数据运行处理 */
      const eData = payload.editTagData

      /** 如果有数据 */
      if (eData && eData.userTagLayerCompleteDTO) {
        const layers = eData.userTagLayerCompleteDTO.map(item => {
          return {
            id: item.id,
            name: item.name,
            code: item.code,
            relationDictId: item.relationDictId,
            userTagId: item.userTagId,
            /** 另加的，用于判断是否在预估 */
            isPredicting: false,

            rules: item.userTagLayerRuleDTO.map(rule => {
              var layerRuleData = {
                id: rule.id,
                userTagLayerId: rule.userTagLayerId,
                /** 真实在 UI 中使用的值 */
                startEndTime: [rule.startTime, rule.endTime],
                // startTime: rule.startTime,
                // endTime: rule.endTime,
                existed: rule.existed,
                metaEventId: rule.metaEventId,
                metaEventPropertyId: rule.metaEventPropertyId,
                operateDict: rule.operateDict,
                propertyValue: rule.propertyValue,

                /** 另加的，用于判断是否显示属性以后的输入栏 */
                hasProperty: !validatenull(rule.metaEventPropertyId),

                /** 另加的，用于选择事件属性 */
                eventPropertyList: [],

                /** 另加的 NUMBER TEXT BOOLEAN DATE */
                propertyTypeName: '',

                /** 另加的，用于选择操作值 */
                operateList: [],

                /** UI 中真实使用的值 */
                rangeNumber1: '',
                rangeNumber2: '',
                rankqian: '',
                rankhou: '',
                rankrangeNumber1: '',
                rankrangeNumber2: '',
                rankValue: '',
                inDays: rule.inDays,
                /** 这个在这里求不出来，放到 UI 中求 */
                rangeDate: '',

                latest: rule.latest,
              }
              //事件属性处理
              if (rule.aggregateType != null) {
                console.log(rule, 'rule的agregatetype')
                layerRuleData.metaEventPropertyId = [
                  rule.metaEventPropertyId,
                  rule.aggregateType
                ]
              } else {
                layerRuleData.metaEventPropertyId = [rule.metaEventPropertyId]
              }
              //事件 区间处理
              if (rule.operateDict.indexOf('rank') != -1) {
                if (rule.operateDict == 'asc_rank') {
                  layerRuleData.rankqian = 'qian'
                  layerRuleData.rankhou = 'ming'
                  layerRuleData.rankValue = rule.propertyValue
                } else if (rule.operateDict == 'asc_percent_rank') {
                  layerRuleData.rankqian = 'qian'
                  layerRuleData.rankhou = 'percent'
                  layerRuleData.rankValue = rule.propertyValue
                } else if (rule.operateDict == 'desc_rank') {
                  layerRuleData.rankqian = 'hou'
                  layerRuleData.rankhou = 'ming'
                  layerRuleData.rankValue = rule.propertyValue
                } else if (rule.operateDict == 'desc_percent_rank') {
                  layerRuleData.rankqian = 'hou'
                  layerRuleData.rankhou = 'percent'
                  layerRuleData.rankValue = rule.propertyValue
                } else if (rule.operateDict == 'interval_rank') {
                  console.log('走这里了吗')
                  layerRuleData.rankqian = 'qujian'
                  layerRuleData.rankhou = 'ming'
                  layerRuleData.rankrangeNumber1 = rule.propertyValue.split(
                    ','
                  )[0]
                  layerRuleData.rankrangeNumber2 = rule.propertyValue.split(
                    ','
                  )[1]
                } else if (rule.operateDict == 'interval_percent_rank') {
                  layerRuleData.rankqian = 'qujian'
                  layerRuleData.rankhou = 'percent'
                  layerRuleData.rankrangeNumber1 = rule.propertyValue.split(
                    ','
                  )[0]
                  layerRuleData.rankrangeNumber2 = rule.propertyValue.split(
                    ','
                  )[1]
                }
                layerRuleData.operateDict = 'ranking'
              }
              //判断时间
              if (rule.startTime == null && rule.endTime == null) {
                layerRuleData.startEndTime = [
                  new Date()
                    .toLocaleString()
                    .replace(/\//g, '-')
                    .replace(/[日上下午]/g, ''),
                  new Date()
                    .toLocaleString()
                    .replace(/\//g, '-')
                    .replace(/[日上下午]/g, '')
                ]
              }
              return layerRuleData
            })
          }
        })

        state.editTagData = {
          id: eData.id,
          name: eData.name,
          projectId: eData.projectId,
          //updateTime: eData.updateTime,
          //createTime: eData.createTime,
          userTagTypeId: eData.userTagTypeId,
          computeType: eData.computeType,
          code: eData.code,
          //deleteFlag: eData.deleteFlag,
          version: eData.version,
          incident:eData.incident==1?true:false,
          content:eData.content,
          layers
        }
      } else {
        state.editTagData = {}
      }
    },

    SET_EDIT_USER_TAG: (state, payload) => {
      state.editTagData = payload.editTagData
    },

    /** 修改里面的一项目 */
    SET_EDIT_USER_TAG_DATA: (state, payload) => {
      state.editTagData[payload.name] = payload.value
    },

    SET_EDIT_TAG_TYPE_LIST: (state, payload) => {
      state.editTagTypeList = payload.editTagTypeList
    },

    ADD_USER_TAG_LAYER: (state, payload) => {
      state.editTagData.layers.push(payload.layer)
    },

    SET_USER_TAG_LAYER: (state, payload) => {
      state.editTagData.layers[payload.layerIndex][payload.name] = payload.value
    },

    DELETE_USER_TAG_LAYER: (state, payload) => {
      state.editTagData.layers.splice(payload.layerIndex, 1)
    },

    SET_USER_TAG_EVENT_LIST: (state, payload) => {
      state.eventList = payload.eventList
    },

    ADD_USER_TAG_RULE: (state, payload) => {
      state.editTagData.layers[payload.layerIndex].rules.push(payload.rule)
    },

    SET_USER_TAG_RULE: (state, payload) => {
      state.editTagData.layers[payload.layerIndex].rules[payload.ruleIndex][
        payload.name
      ] = payload.value
    },

    DELETE_USER_TAG_RULE: (state, payload) => {
      state.editTagData.layers[payload.layerIndex].rules.splice(
        payload.ruleIndex,
        1
      )
    },

    SET_EVENT_PROP_LIST_MAP: (state, payload) => {
      state.editTagData.layers[payload.layerIndex].rules[
        payload.ruleIndex
      ].eventPropertyList = payload.list
    },

    SET_OPERATE_LIST: (state, payload) => {
      state.editTagData.layers[payload.layerIndex].rules[
        payload.ruleIndex
      ].operateList = payload.list
    },

    SET_PROPERTY_TYPE_NAME: (state, payload) => {
      state.editTagData.layers[payload.layerIndex].rules[
        payload.ruleIndex
      ].propertyTypeName = payload.name
    }
  }
}

export default userTag
