import request from '@/router/axios'
import { ROOT_URL } from '@/api/common'

export function getAudiencePackageData(params) {
  return request({
    url: ROOT_URL + '/audiencepackagereport/audiencePackageData',
    method: 'get',
    params: params
  })
}
export function getOverallDeliveryEffect(params) {
  return request({
    url: ROOT_URL + '/audiencepackagereport/overallDeliveryEffect',
    method: 'get',
    params: params
  })
}

export function getAudiencePackageDataInfo(params) {
  return request({
    url: ROOT_URL + '/audiencepackagereport/audiencePackageDataInfo',
    method: 'get',
    params: params
  })
}
export function getMonthlyConsumeInfo(params) {
  return request({
    url: ROOT_URL + '/audiencepackagereport/monthlyConsumeInfo',
    method: 'get',
    params: params
  })
}
