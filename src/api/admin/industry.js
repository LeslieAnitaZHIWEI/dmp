import request from '@/router/axios';
import { ROOT_URL } from '@/api/common';

export function getIndustryList(query) {
  return request({
    url: ROOT_URL + '/industrysign/industry/page',
    method: 'get',
    params: query
  });
}



export function editIndustry(params) {

  return request({
    url: ROOT_URL + '/industrysign/industry',
    method: 'put',
    data: params
  });

}
