import request from '@/router/axios';
import { ROOT_URL, LONG_TIME } from '@/api/common';


export function addUserTag(params) {
  return request({
    url: ROOT_URL + '/usertag',
    method: 'post',
    data: params
  })
}


export function editUserTag(params) {
  return request({
    url: ROOT_URL + '/usertag',
    method: 'put',
    data: params
  })
}

export function deleteUserTag(params) {

  const { id, ...query } = params;

  return request({
    url: ROOT_URL + '/usertag/' + id,
    method: 'delete',
    params: query
  })
}

/**
 * 通过id查询用户标签记录
 * @param {object} query
 * @param {number} query.id 标签 ID
 * @param {'ONE_WEEK' | 'ONE_MONTH'} query.timeType 标签 ID
 * @param { object } setting 设置
 */
export function getTagRecord(query, setting = {}) {

  return request({
    url: ROOT_URL + '/usertag/record',
    method: 'get',
    params: query,
    timeout: LONG_TIME,
    ...setting
  })
}

/**
 * 
 * @param {*} query 
 */
export function computeRecord(query) {

  return request({
    url: ROOT_URL + '/usertag/command',
    method: 'get',
    params: query,
    timeout: LONG_TIME
  })
}

export function getUserTag(query) {

  return request({
    url: ROOT_URL + '/usertag/'+query.id,
    method: 'get',
    params: {},
    timeout: LONG_TIME
  })
}

export function getUsertagInit(params) {

  const { id, ...query } = params;

  return request({
    url: ROOT_URL + '/usertag/init/' + id,
    method: 'get',
    data: query
  })

}

/**
 * 获得用户包下载地址
 * @param { object } params
 * @returns { string }
 */
export function getUserTagExcelUrl(params) {

  return request({
    url: ROOT_URL + '/usertag/excel',
    method: 'post',
    params: params,
    timeout: LONG_TIME,
    responseType: 'blob'
  });

}

/**
 * 近似词查询关键字，可用于编辑元事件中的添加关键字
 * @param { object} params - 参数
 * @param { string } params.keyWord - 模糊查询的字段
 * @param { number } params.projectId - 项目 ID
 */
export function getWordSimilarity(params, settings) {

  return request({
    url: ROOT_URL + '/usertag/wordSimilarity',
    method: 'get',
    params: params,
    timeout: LONG_TIME,
    ...settings
  });

}

/**
 * 通过 name 获得用户分群标签
 * @param { Object } query
 * @param { Number } query.projectId
 * @param { String } query.name
 * @returns { Promise }
 */
export function getTagLayerName(query) {

  return request({
    url: ROOT_URL + '/usertaglayer/tagLayerName',
    method: 'get',
    params: query
  });
}

/**
 * 获得项目下的标签分类
 * @param { Object } params
 * @param { Number } params.id 项目 ID
 * @returns { Promise }
 */
export function getUserTagType(params) {

  const { id, ...query } = params;

  return request({
    url: ROOT_URL + '/usertagtype/' + id,
    method: 'get',
    params: query
  });
}

/**
 * 获得项目下的标签分类
 * 仅用于编辑标签时使用
 * @param { Object } params
 * @param { Number } params.id 项目 ID
 * @returns { Promise }
 */
export function getUserTagTypeByProjectId(params) {

  const { projectId, ...query } = params;

  return request({
    url: ROOT_URL + '/usertagtype/byprojectid/' + projectId,
    method: 'get',
    params: query
  });
}

/**
 * 新增用户分类标签
 * @param { Object } params
 * @param { 0 } params.id
 * @param { Number } params.projectId
 * @param { Number } params.parentId
 * @param { Number } params.deleteFlag
 * @param { String } params.name
 * @param { String } params.createTime
 * @param { String } params.updateTime
 * @returns { Promise }
 */
export function addUserTagType(params) {

  return request({
    url: ROOT_URL + '/usertagtype',
    method: 'post',
    data: params
  });
}

/**
 * 修改用户分类标签
 * @param { Object } params
 * @param { 0 } params.id
 * @param { Number } params.projectId
 * @param { Number } params.parentId
 * @param { Number } params.deleteFlag
 * @param { String } params.name
 * @param { String } params.createTime
 * @param { String } params.updateTime
 * @returns { Promise }
 */
export function editUserTagType(params) {

  return request({
    url: ROOT_URL + '/usertagtype',
    method: 'put',
    data: params
  });
}

/**
 * 删除用户分类标签
 * @param { Object } params
 * @param { Number } params.id
 * @returns { Promise }
 */
export function deleteUserTagType(params) {

  const { id, ...query } = params;

  return request({
    url: ROOT_URL + '/usertagtype/' + id,
    method: 'delete',
    data: query
  });
}

/**
 * 通过 name 值获取用户分群标签
 * @params { Object } params
 * @params { Number } params.projectId
 * @params { String } params.tagName
 */
export function getUserTagLayerByName(params) {

  return request({
    url: ROOT_URL + '/usertaglayer/tagLayerName',
    method: 'get',
    params: params
  });

}


/**
 * 通过 name 值获取用户分群标签
 * @params { Object } params
 * @params { Number } params.projectId
 * @params { String } params.tagName
 */
export function getUserTagLayerPredict(params) {

  return request({
    url: ROOT_URL + '/usertaglayer/predict',
    method: 'post',
    data: params,
    timeout: LONG_TIME
  });

}
