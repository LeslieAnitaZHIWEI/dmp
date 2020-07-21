import request from '@/router/axios'
import { ROOT_URL } from '@/api/common'

/**
 *
 * @param {*} query 查询短信通道接口分页
 */
export function getSmschannelList(query) {
  return request({
    url: ROOT_URL + '/smschannel/page',
    method: 'get',
    params: query
  })
}
/**
 *
 * @param {*} query 新增短信通道接口
 */
export function postSmschannel(query) {
  return request({
    url: ROOT_URL + '/smschannel',
    method: 'post',
    data: query
  })
}
/**
 *
 * @param {*} query 编辑短信通道
 */
export function putSmschannel(query) {
  return request({
    url: ROOT_URL + '/smschannel',
    method: 'put',
    data: query
  })
}

/**
 *
 * @param {*} query 查看短信通道详情
 */
export function getSmschannelInfo(query) {
  const { id, ...other } = query
  return request({
    url: ROOT_URL + '/smschannel/' + id,
    method: 'get',
    params: query
  })
}
/**
 *
 * @param {*} query 删除
 */
export function deleteSmschannel(query) {
  const { id, ...other } = query
  return request({
    url: ROOT_URL + '/smschannel/' + id,
    method: 'delete',
    data: query
  })
}
