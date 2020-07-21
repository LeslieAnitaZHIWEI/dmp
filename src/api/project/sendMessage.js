import request from '@/router/axios'
import { ROOT_URL } from '@/api/common'

/**
 *
 * @param {*} query 查询短信通道接口
 */
export function getSmschannel(query) {
  return request({
    url: ROOT_URL + '/smschannel/all',
    method: 'get',
    params: query
  })
}
/**
 *
 * @param {*} query 上传
 */
export function uploadphones(query) {
  const { file } = query
  return request({
    url: ROOT_URL + '/smstask/uploadphones',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: file
  })
}
/**
 *
 * @param {*} query 新增短信任务
 */
export function addSmstask(query) {
  const {
    fileUrls,
    isOpen,
    citys,
    ispTypes,
    isContainCity,
    isContainIspType,
    ...other
  } = query
  return request({
    url: ROOT_URL + '/smstask',
    method: 'post',
    data: other,
    params: {
      // token:token,
      fileUrls,
      isOpen,
      ispTypes,
      citys,
      isContainCity,
      isContainIspType
    }
  })
}

/**
 *
 * @param {*} query 查询短信任务记录接口
 */
export function getSmstaskList(query) {
  return request({
    url: ROOT_URL + '/smstask/page',
    method: 'get',
    params: query
  })
}

/**
 *
 * @param {*} query 修改定时发送时间接口
 */
export function putSmstask(query) {
  const {
    fileUrls,
    smsTaskFilterId,
    isOpen,
    citys,
    ispTypes,
    isContainCity,
    isContainIspType,
    ...other
  } = query

  return request({
    url: ROOT_URL + '/smstask',
    method: 'put',
    data: other,
    params: {
      // token:token,
      fileUrls,
      isOpen,
      ispTypes,
      citys,
      smsTaskFilterId,
      isContainCity,
      isContainIspType
    }
  })
}

/**
 *
 * @param {*} query 删除定时发送任务接口
 */
export function deleteSmstask(query) {
  const { id, ...other } = query
  return request({
    url: ROOT_URL + '/smstask/' + id,
    method: 'delete',
    data: other
  })
}

/**
 *
 * @param {*} query 查询短信任务详情
 */
export function getSmstaskInfo(query) {
  const { id, ...other } = query
  return request({
    url: ROOT_URL + '/smstask/' + id,
    method: 'get',
    params: other
  })
}
/**
 *
 * @param {*} query 分页查看短信发送记录
 */
export function getSmsrecord(query) {
  return request({
    url: ROOT_URL + '/smsrecord/page',
    method: 'get',
    params: query
  })
}

export function getSmsrecordStatistics(query) {
  return request({
    url: ROOT_URL + '/smsrecord/statistics',
    method: 'get',
    params: query
  })
}

export function getAllAudiencePackage(query) {
  return request({
    url: ROOT_URL + '/audiencepackage/getAudiencePackageByProjectId',
    method: 'get',
    params: query
  })
}

export function getAllProject(query) {
  return request({
    url: ROOT_URL + '/projectinfo/getAll',
    method: 'get',
    params: query
  })
}

export function uploadAudiencePackagePhones(query) {
  return request({
    url: ROOT_URL + '/smstask/uploadAudiencePackagePhones',
    method: 'post',
    params: query
  })
}

export function getNumberPacage(query) {
  return request({
    url: ROOT_URL + '/smsPackage/getPackage',
    method: 'get',
    params: query
  })
}

/**
 *
 * @param {*} query 获取号码数
 */
export function getNumber(query) {
  return request({
    url: ROOT_URL + '/smsPackage/getNumber',
    method: 'get',
    params: query
  })
}
/**
 *
 * @param {*} query 过滤
 */
export function numberFilter(query) {
  return request({
    url: ROOT_URL + '/numberFilter',
    method: 'post',
    data: query
  })
}

export function getSmsPackagePage(query) {
  return request({
    url: ROOT_URL + '/smsPackage/page',
    method: 'get',
    params: query
  })
}

export function initFilterPackagePage(query) {
  return request({
    url: ROOT_URL + '/smsPackage/initFilterPackagePage',
    method: 'post',
    data: query
  })
}

export function addSmsPackage(query) {
  const { token, ...other } = query
  return request({
    url: ROOT_URL + '/smsPackage/add',
    method: 'post',
    data: other,
    params: {
      token
    }
  })
}
export function updateSmsPackage(query) {
  const { token, ...other } = query
  return request({
    url: ROOT_URL + '/smsPackage/update',
    method: 'post',
    data: other,
    params: {
      token
    }
  })
}

export function uploadNumberPackage(query) {
  const { file } = query

  return request({
    url: ROOT_URL + '/smsPackage/uploadNumberPackage',
    method: 'post',
    data: file,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export function uploadFilterPackage(query) {
  const { file } = query

  return request({
    url: ROOT_URL + '/smsPackage/uploadFilterPackage',
    method: 'post',
    data: file,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function uploadPeoplePackage(query) {
  return request({
    url: ROOT_URL + '/smsPackage/uploadNumberPackage',
    method: 'post',
    params: query
  })
}

export function deletePackage(query) {
  return request({
    url: ROOT_URL + '/smsPackage/delete',
    method: 'post',
    params: query
  })
}

export function initSmsPackage(query) {
  return request({
    url: ROOT_URL + '/smsPackage/init',
    method: 'post',
    params: query
  })
}

export function addFilterPackage(query) {
  const { token, ...other } = query

  return request({
    url: ROOT_URL + '/smsPackage/addFilterPackage',
    method: 'post',
    data: query,
    params: {
      token
    }
  })
}

export function getTestPhone(query) {
  return request({
    url: ROOT_URL + '/smstask/getTestPhone',
    method: 'post',
    params: query
  })
}

export function getPhoneFillterQuery(query) {
  return request({
    url: ROOT_URL + '/numberFilter/phoneFillterQuery',
    method: 'post',
    data: query
  })
}
