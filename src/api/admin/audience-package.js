import request from '@/router/axios'
import { LONG_TIME, ROOT_URL } from '@/api/common'

/**
 * 人群包分页查询
 * @param { object } params
 * @param { string } params.projectId 项目ID
 * @param { string } params.startTime 起始时间
 * @param { string } params.endTime 结束时间
 * @param { number } params.current 当前页
 * @param { number } params.size 一页多少列
 * @param { string } params.name 包名
 * @param { string } params.packageType 包类型
 * @param { string } params.getNumberType 取号类型
 */
export function getList(params) {
  return request({
    url: ROOT_URL + '/audiencepackage/page',
    method: 'get',
    params: params
  })
}

/**
 * 创建人群包
 * @param { object } params
 */
export function createPackage(params) {
  return request({
    url: ROOT_URL + '/audiencepackage',
    method: 'post',
    data: params,
    timeout: LONG_TIME
  })
}

/**
 * 通过ID查询人群包
 * @param { object } params
 */
export function getDetail(params) {
  const { id } = params

  return request({
    url: ROOT_URL + '/audiencepackage/' + id,
    method: 'get'
  })
}

export function getSignRank(params) {
  return request({
    url: ROOT_URL + '/audiencepackage/getsigncategory',
    method: 'get',
    params: params
  })
}

/**
 * 取号
 * @param { object } params
 */
export function getNumberById(params) {
  const { id, ...other } = params

  return request({
    url: ROOT_URL + '/audiencepackage/' + id,
    method: 'post',
    params: other
  })
}

/**
 * 删除包
 * @param { object } params
 */
export function deleteById(params) {
  const { id } = params

  return request({
    url: ROOT_URL + '/audiencepackage/' + id,
    method: 'delete'
  })
}

/**
 * 生成人群包名称，在 导出人群包 之前使用
 * @param { object } params
 */
export function createPackageName(params) {
  return request({
    url: ROOT_URL + '/audiencepackage/name',
    method: 'post',
    data: params,
    timeout: LONG_TIME
  })
}

/**
 * 导出人群包
 * @param { object } params
 */
export function exportPackage(params,settings) {
  return request({
    url: ROOT_URL + '/audiencepackage/export',
    method: 'post',
    params: params,
    timeout: LONG_TIME,
    responseType: 'blob',
    ...settings
  })
}
/**
 * 获取任务列表
 * @param { object } params
 */
export function getTaskList(params) {
  return request({
    url: ROOT_URL + '/audiencepackage/taskList',
    method: 'get',
    params: params,
    timeout: LONG_TIME,
   
  })
}

/**
 * 推送 任务
 * @param { object } params
 */
export function pushTask(params, settings) {
  return request({
    url: ROOT_URL + '/audiencepackage/push',
    method: 'post',
    params: params,
    ...settings
  })
}
/**
 * 获得 userId
 * @param { object } params
 */
export function getUserIdList(params, settings) {
  console.log(params,'chaxun人群包')
  return request({
    url: ROOT_URL + '/audiencepackage/userid',
    method: 'post',
    data: params,
    ...settings
  })
}
/**
 * 获得 userId
 * @param { object } params
 */
export function getUserIdByPackage(params, settings) {
  return request({
    url: ROOT_URL + '/audiencepackage/getUserIdByPackage',
    method: 'post',
    data: params,
    ...settings
  })
}

export function uploadTxt(query) {
  const { files } = query
  return request({
    url: ROOT_URL + '/audiencepackage/upload',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    data: files,
    timeout: LONG_TIME
  })
}

export function filteraudiencepackage(query){
  return request({
    url: ROOT_URL + '/audiencepackage/filter',
    method: 'post',
    data: query
  })
  
}