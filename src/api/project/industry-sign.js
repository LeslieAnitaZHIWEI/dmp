import request from '@/router/axios';
import { LONG_TIME,ROOT_URL } from '@/api/common';

/**
 *
 * @param {Object} params
 * @param {Number} params.current 当前页数
 * @param {Number} params.size
 * @param {Array} params.industryCodes 字符串数组
 * @returns {Promise}
 */
export function getSignList(params) {
  return request({
    url: ROOT_URL+'/industrysign/sign/page',
    method: 'post',
    data: params
  })
}
export function getSignSearch(params) {
  return request({
    url: ROOT_URL+'/industrysign/blurry',
    method: 'get',
    params: params
  })
}
export function getIndustryList(query) {
  return request({
    url: ROOT_URL+'/industrysign/industry/page',
    method: 'get',
    params: query
  })
}

export function editIndustry(params) {
  return request({
    url:ROOT_URL+'/industrysign/industry',
    method: 'put',
    data: params
  })
}

export function addIndustry(params) {
  return request({
    url: ROOT_URL+'/industrysign/industry/save',
    method: 'post',
    data: params
  })
}

export function getSelectList(params) {
  return request({
    url: ROOT_URL+'/industrysign/industry/all',
    method: 'get',
    data: params
  })
}

export function editList(params) {
  return request({
    url: ROOT_URL+'/industrysign/sign',
    method: 'put',
    data: params
  })
}
export function addSign(params) {
  return request({
    url: ROOT_URL+'/industrysign/sign/save',
    method: 'post',
    data: params,
    timeout: LONG_TIME
  })
}

export function deleteIndustry(params) {

  return request({
    url: ROOT_URL+'/industrysign/industry/delete',
    method: 'delete',
    params: params
  });

}
/**
 *
 * @param {String} params 要删除的id值
 */
export function deleteSign(params) {

  return request({
    url: ROOT_URL+'/industrysign/sign/delete',
    method: 'delete',
    params: params
  });

}

export function getSignDetail(params) {

  return request({
    url: ROOT_URL+'/industrysign/sign',
    method: 'get',
    params: params
  });

}

export function getAllcate(query){
  return request({
    url: ROOT_URL+'/industrysign/sign/category',
    method: 'get',
    params: query
  });

}

export function getBatchSign(query){
  return request({
    url: ROOT_URL+'/industrysign/signs',
    method: 'get',
    params: query
  });

}

export function editBatchSign(query){
  return request({
    url: ROOT_URL+'/industrysign/signs',
    method: 'put',
    data: query
  });

}

export function editExpandSign(query){
  return request({
    url: ROOT_URL+'/industrysignkeyword',
    method: 'put',
    data: query
  });

}

export function getExpandSign(query){
  const {id}=query
  return request({
    url: ROOT_URL+'/industrysignkeyword/'+id,
    method: 'get',
    data: query
  });
}

export function deleteExpandSign(query){
  const {id}=query
  return request({
    url: ROOT_URL+'/industrysignkeyword/'+id,
    method: 'delete',
    data: query
  });
}

export function getExpandSignList(query){
  return request({
    url: ROOT_URL+'/industrysignkeyword/page',
    method: 'get',
    params: query
  });
}