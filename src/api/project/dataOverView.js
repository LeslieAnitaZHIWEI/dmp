import request from '@/router/axios';
import { ROOT_URL, LONG_TIME } from '@/api/common';


export function getDataOverview(query) {
  return request({
    url: ROOT_URL + '/dataOverview',
    method: 'get',
    params: query,
    timeout: LONG_TIME,
  })
}
export function getDataFactory(query) {
  return request({
    url: ROOT_URL + '/dataOverview/getDataFactory',
    method: 'get',
    params: query,
    timeout: LONG_TIME,
  })
}
export function getDataPort(query) {
  return request({
    url: ROOT_URL + '/dataOverview/getDataPort',
    method: 'get',
    params: query,
    timeout: LONG_TIME,
  })
}
export function getDataResult(query) {
  return request({
    url: ROOT_URL + '/dataOverview/getDataResult',
    method: 'get',
    params: query,
    timeout: LONG_TIME,
  })
}
export function getEventDataAndTagData(query) {
  return request({
    url: ROOT_URL + '/dataOverview/getEventDataAndTagData',
    method: 'get',
    params: query,
    timeout: LONG_TIME,
  })
}
