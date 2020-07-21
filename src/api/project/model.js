import request from '@/router/axios'
import { ROOT_URL, LONG_TIME } from '@/api/common'

/**
 *
 * @param {*} query 分页查询
 */
export function getModelList(query) {
  return request({
    url: ROOT_URL + '/projectmodel/page',
    method: 'get',
    params: query,
    timeout: LONG_TIME
  })
}
/**
 *
 * @param {*} query 新增模型
 */
export function addModel(query) {
  return request({
    url: ROOT_URL + '/projectmodel',
    method: 'post',
    data: query,
    timeout: LONG_TIME
  })
}

/**
 *
 * @param {*} query 修改模型
 */
export function editModel(query) {
  return request({
    url: ROOT_URL + '/projectmodel',
    method: 'put',
    params: query,
    timeout: LONG_TIME
  })
}

/**
 *
 * @param {*} query 通过id 查询
 */
export function queryById(query) {
  return request({
    url: ROOT_URL + '/projectmodel/' + query.id,
    method: 'get',
    timeout: LONG_TIME
  })
}

/**
 *
 * @param {int} query 通过id 删除
 */
export function deleteById(query) {
  return request({
    url: ROOT_URL + '/projectmodel/' + query.id,
    method: 'delete',
    timeout: LONG_TIME
  })
}

/**
 *
 * @param {*} query 通过id 查询etl模型
 */
export function getProjectmodeletl(query) {

  const { id } = query

  return request({
    url: ROOT_URL + '/projectmodel/' + id,
    method: 'get',
    timeout: LONG_TIME
  })

}

export function getTableRules(query) {

  const { tableName } = query;

  return request({
    url: ROOT_URL + '/projectmodeletl/hive/' + tableName,
    method: 'get',
    timeout: LONG_TIME
  })
}
/**
 *
 * @param {*} query 上传py文件
 */
export function editModal(query) {
  const { file, ...other } = query
  return request({
    url: ROOT_URL + '/projectmodelcal',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'put',
    data: file,
    params: other,
    timeout: LONG_TIME
  })
}
