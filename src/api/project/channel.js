import request from '@/router/axios'
import { ROOT_URL,LONG_TIME } from '@/api/common'

/**
 *
 * @param {*} query 渠道分页
 */
export function getChannel(query) {
  return request({
    url: ROOT_URL + '/channel/page',
    method: 'get',
    params: query
  })
}

export function exportChannel(query){
    return request({
        url:ROOT_URL+'/channel/export',
        method: 'post',
    responseType: 'blob',
    data: query,
    timeout:LONG_TIME

    })
}