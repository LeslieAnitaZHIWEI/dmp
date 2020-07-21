
import request from '@/router/axios';
import { ROOT_URL,LONG_TIME } from '@/api/common';

/**
 * 
 * @param {*} query 分页查询
 */
export function gettablesList(query) {
  return request({
    url: ROOT_URL + '/warehouse/tables',
    method: 'get',
    params: query,
    timeout: LONG_TIME
  })
}

export function gettablerecord(query, setting = {}) {
    return request({
      url: ROOT_URL + '/warehouse/tablerecord',
      method: 'get',
      params: query,
      timeout: LONG_TIME,
      ...setting
    })
  }