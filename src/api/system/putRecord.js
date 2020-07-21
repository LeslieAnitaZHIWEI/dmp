import request from '@/router/axios'
import { ROOT_URL } from '@/api/common'

export function getList(query){
  return request({
        url:ROOT_URL+'/putrecord/page',
     
        method: 'get',
        params: query

    })
}

export function deleteRecord(query){
    const {id}=query
    return request({
          url:ROOT_URL+'/putrecord/'+id,
       
          method: 'delete',
          params: {}
  
      })
  }
  export function addRecord(query){
    return request({
          url:ROOT_URL+'/putrecord',
       
          method: 'post',
        data:query
      })
  }
  
