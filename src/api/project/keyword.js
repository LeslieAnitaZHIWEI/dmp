import request from '@/router/axios';
import { ROOT_URL } from '@/api/common';

/**
 * 从查询字与 词性查找关键字
 * @param { object } query - 参数
 * @param { string } query.keyWord - 查询字
 * @param { 'NOUN' | 'VERB' } query.wordType - 词性：NOUN 名词，VERB  动词
 * @param { number } query.projectId
 * @param { number } query.current
 * @param { number } query.size
 * @param { number } query.total
 * @param { Array } query.records
 * @param { boolean } query.searchCount
 */
export function getKeywords(query) {
  return request({
    url: ROOT_URL + '/keyword/page',
    method: 'get',
    params: query
  })
}
