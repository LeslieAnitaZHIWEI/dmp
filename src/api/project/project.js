import request from '@/router/axios';
import { ROOT_URL,LONG_TIME } from '@/api/common';
import { pageQueryDefault } from '@/const/website';

/** 增加项目 */
export function addProject(params) {

  return request({
    url: ROOT_URL + '/projectinfo',
    method: 'post',
    data: params,
    timeout:LONG_TIME
  });

}
//修改項目
export function editProject(params) {

  return request({
    url: ROOT_URL + '/projectinfo',
    method: 'put',
    data: params,
    timeout:LONG_TIME

  });

}

export function getProjectList(query) {

  query = Object.assign({}, pageQueryDefault, query);

  return request({
    url: ROOT_URL + '/projectinfo/permissionpage',
    method: 'get',
    params: query
  });

}
//通過Id查詢
export function getProjectInfo(query) {

  const { id, ...other } = query;

  return request({
    url: ROOT_URL + '/projectinfo/' + id,
    method: 'get',
    params: other
  });

}
//通過id刪除項目
export function deleteProjectInfo(query) {

  const { id, ...other } = query;

  return request({
    url: ROOT_URL + '/projectinfo/' + id,
    method: 'delete',
    params: other
  });

}
//分頁查詢
export function getProject(params) {

  return request({
    url: ROOT_URL + '/projectinfo/page',
    method: 'get',
    params: params
  });

}
/**
 *
 * @param {*} params 获取用户
 */
export function getUser(params) {

  return request({
    url: '/admin/user/info/name',
    method: 'get',
    params: params
  });

}
/**
 *
 * @param {*} params 获取当前用户
 */
export function getUserInfo(params) {

  return request({
    url: '/admin/user/info',
    method: 'get',
    params: params
  });

}
/**
 *
 * @param {*} params 获取权限
 */
export function getProjectResourcePermission(params) {

  return request({
    url: ROOT_URL + '/projectresourcepermission/all',
    method: 'get',
    params: params
  });

}
/**
 *
 * @param {*} params 获取所有行业
 */
export function getIndustry(params) {

  return request({
    url: ROOT_URL+'/industrysign/industry/all',
    method: 'get',
    params: params
  });

}

export function getOnepermission(params) {

  return request({
    url: ROOT_URL + '/projectresourcepermission/byprojectid',
    method: 'get',
    params: params
  });

}

/**
 * 查询当前用户有权限可以创建哪些模型类型
 * 如： ETL 模型，计算模型，发布模型
 * @param {object} params 参数
 * @returns { Promise }
 */
export function getSourcePermissionList(params) {

  return request({
    url: ROOT_URL + '/projectresourcepermission/modelresourcepermission',
    method: 'get',
    params: params
  });

}

/**
 * 验证当前用户对项目是否有权限
 * @param { object } params
 * @param { number } params.projectId 项目 ID
 * @returns { Promise }
 */
export function checkInThisProject(params) {

  return request({
    url: ROOT_URL + '/projectresourcepermission/inthisproject',
    method: 'get',
    params: params
  });

}
