import request from '@/router/axios';
import { ROOT_URL, LONG_TIME } from '@/api/common';


export function editModelEtl(params) {

  return request({
    url: ROOT_URL + '/projectmodeletl',
    method: 'put',
    data: params
  });

}

export function getModelEtl(params) {

  const { id, ...query } = params;

  return request({
    url: ROOT_URL + '/projectmodeletl/' + id,
    method: 'get',
    data: query
  });

}
