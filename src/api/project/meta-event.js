import request from '@/router/axios'
import { ROOT_URL, LONG_TIME } from '@/api/common'

export function getTypeListByProjectId(params) {
  const { id, ...query } = params

  return request({
    url: ROOT_URL + '/metaeventtype/byprojectid/' + id,
    method: 'get',
    params: query
  })
}

export function addEventType(query) {
  return request({
    url: ROOT_URL + '/metaeventtype',
    method: 'post',
    data: query
  })
}

export function editEventType(query) {
  return request({
    url: ROOT_URL + '/metaeventtype',
    method: 'put',
    data: query
  })
}

export function deleteEventType(query) {
  const { id, ...other } = query

  return request({
    url: ROOT_URL + '/metaeventtype/' + id,
    method: 'delete',
    data: other
  })
}

export function getEventList(query) {
  return request({
    url: ROOT_URL + '/metaevent/page',
    method: 'get',
    params: query
  })
}

/** 获得一个元事件的详情 */
export function getEventInfo(query) {
  const { id, ...other } = query

  return request({
    url: ROOT_URL + '/metaevent/info/' + id,
    method: 'get',
    params: other
  })
}

export function addEvent(query) {
  return request({
    url: ROOT_URL + '/metaevent',
    method: 'post',
    data: query
  })
}

export function updateEvent(query) {
  return request({
    url: ROOT_URL + '/metaevent',
    method: 'put',
    data: query
  })
}

export function getEvent(query) {
  const { id } = query

  return request({
    url: ROOT_URL + '/metaevent/' + id,
    method: 'get',
    timeout: LONG_TIME
  })
}

export function deleteEvent(query) {
  const { id } = query

  return request({
    url: ROOT_URL + '/metaevent/' + id,
    method: 'delete',
    timeout: LONG_TIME
  })
}

export function getEventListByTypeId(query) {
  const { id, ...other } = query

  return request({
    url: ROOT_URL + '/metaevent/bytypeid/' + id,
    method: 'get',
    params: other
  })
}

export function getEventListByProjectId(query) {
  return request({
    url: ROOT_URL + '/metaevent/byprojectid',
    method: 'get',
    params: query
  })
}

export function getUserAnalysis(query, settings) {
  const { ...other } = query

  return request({
    url: ROOT_URL + '/metaevent/analysis',

    /** 虽然使用 post ，但其实是个查询操作 */
    method: 'post',

    data: other,

    /** 可很长时间 */
    timeout: LONG_TIME,

    ...settings
  })
}

export function doSample(query) {
  return request({
    url: ROOT_URL + '/metaevent/sample',

    /** 虽然使用 post ，但其实是个查询操作 */
    method: 'get',

    params: query,

    /** 可很长时间 */
    timeout: LONG_TIME
  })
}

/**
 * 获取用户包
 * @param { object } query
 * @returns { string }
 */
export function exportUserAnalysis(query) {
  return request({
    url: ROOT_URL + '/metaevent/userBag',
    method: 'post',
    data: query,
    timeout: LONG_TIME,
    responseType: 'blob'
  })
}

export function getMetaEventPropByEventId(params) {
  const { id, ...other } = params

  return request({
    url: ROOT_URL + '/metaeventproperty/bymetaeventid/' + id,
    method: 'get',
    data: other
  })
}
