import request from '@/router/axios'
import { ROOT_URL, LONG_TIME } from '@/api/common'

/**
 *
 * @param {*} query 按签名和时间获取统计的数量
 */
export function getReportsourcet(query) {
  return request({
    url: ROOT_URL + '/reportsource',
    method: 'get',
    params: query
  })
}
export function getData(query) {
  return request({
    url: ROOT_URL + '/reportsource/ReportSourceStatistics',
    method: 'get',
    params: query
  })
}
/**
 *
 * @param {*} query 取样接口
 */
export function getSample(query) {
  return request({
    url: ROOT_URL + '/sample',
    method: 'post',
    data: query,
    responseType: 'blob',
    timeout: LONG_TIME
  })
}

/**
 *
 * @param {*} query 按日,月,周查询新用户数量接口
 */
export function getReportnewuser(query) {
  return request({
    url: ROOT_URL + '/reportnewuser',
    method: 'get',
    params: query
  })
}

/**
 *
 * @param {*} query 获取历史人数
 */
export function getTotalnewuser(query) {
  return request({
    url: ROOT_URL + '/reportnewuser/total',
    method: 'get',
    params: query
  })
}

/**
 *
 * @param {*} query 获取待处理
 */
export function getDealSign(query) {
  return request({
    url: ROOT_URL + '/industrysign/pending',
    method: 'get',
    params: query
  })
}
export function exportSign(query) {
  return request({
    url: ROOT_URL + '/reportsource/exportSign',
    method: 'post',
    params: query,
    responseType: 'blob',
    timeout: LONG_TIME
  })
}
