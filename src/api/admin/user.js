import request from '@/api/request'
import $GLOBAL from '@/utils/const'
const { cpr } = $GLOBAL;
// 获取关键词列表
export function queryUserList() {
  return request({
    url: cpr + 'admin/queryUserList',
  })
}

export function queryRoleList(params) {
  return request({
    url: cpr + 'admin/queryRoleList',
    params
  })
}

export function getOrgTree(params) {
  return request({
    url: cpr + 'censor/getOrgTree',
    method: 'post',
    params
  })
}
export function getUserList(data) {
  return request({
    url: cpr + 'userManagement/getUserList',
    method: 'post',
    data
  })
}

export function deactivateRecoveryUser(params) {
  return request({
    url: cpr + 'userManagement/deactivateRecoveryUser',
    method: 'post',
    params
  })
}

export function changeUserRoles(params) {
  return request({
    url: cpr + 'userManagement/changeUserRoles',
    method: 'post',
    params
  })
}
