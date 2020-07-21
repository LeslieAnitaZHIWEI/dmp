import request from '@/router/axios'
import { ROOT_URL,LONG_TIME } from '@/api/common'

export function encryption(query){
  const { file, ...other } = query
  return request({
        url:ROOT_URL+'/encryption',
        headers: {
            'Content-Type': 'multipart/form-data'
          },
        method: 'post',
    responseType: 'blob',
    data: file,
        params: other,
    timeout:LONG_TIME

    })
}