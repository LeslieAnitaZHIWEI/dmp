import request from '@/router/axios';
import { ROOT_URL } from '@/api/common';


export function getList(params) {
  return request({
    url: ROOT_URL + '/getnumberrecord/page',
    method: 'get',
    params: params
  })
}
