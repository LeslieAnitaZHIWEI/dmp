import request from '@/router/axios';
import { ROOT_URL, LONG_TIME } from '@/api/common';

export function getList(query) {

  return request({
    url: ROOT_URL + '/personprofile/page',
    method: 'get',
    params: query
  });
}

/**
 * 导出人群包
 * @param {Object} params
 * @param {Number} params.id
 * @param {String} params.projectCode
 * @returns {Promise}
 */
export function exportUserBag(params) {

  const { ...query } = params;

  return request({
    url: ROOT_URL + '/personprofile/userBag',
    method: 'post',
    params: query,
    timeout: LONG_TIME,
    responseType: 'blob'
  });

}


/**
 * 通过id查询用户画像
 * @param {Object} params
 * @param {Number} params.id
 * @returns {Promise}
 **/
export function getPersonProfile(params) {

  const { id, ...query } = params;

  return request({
    url: ROOT_URL + '/personprofile/' + id,
    method: 'get',
    params: query
  });

}

/**
 * 新增用户分群（画像）
 * @param {*} params
 * @returns { Promise }
 */
export function addPersonProfile(params) {
  return request({
    url: ROOT_URL + '/personprofile',
    method: 'post',
    data: params
  });

}


/**
 * 修改用户分群（画像）
 * @param {*} params
 * @returns { Promise }
 */
export function editPersonProfile(params) {
  return request({
    url: ROOT_URL + '/personprofile',
    method: 'put',
    data: params
  });

}


/**
 * 删除用户分群（画像）
 * @param {*} params
 * @returns { Promise }
 */
export function deletePersonProfile(params) {

  const { id, ...query } = params;

  return request({
    url: ROOT_URL + '/personprofile/' + id,
    method: 'delete',
    data: query
  });

}
