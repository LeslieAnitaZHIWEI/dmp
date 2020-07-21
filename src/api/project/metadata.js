import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/project/meatadata/page',
    method: 'get',
    params: query
  })
}
