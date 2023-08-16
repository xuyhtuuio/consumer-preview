
import request from '@/api/request.js'
// 获取关键词列表
export function getRoleList(data) {
  return request({
    url: '/cpr/roleManagement/getRoleList',
    method: 'post',
    data
  })
}

export function getPermissionList(data) {
  return request({
    url: '/cpr/roleManagement/getPermissionList',
    method: 'post',
    data
  })
}

export function deactivateRecoveryRole(params) {
  return request({
    url: '/cpr/roleManagement/deactivateRecoveryRole',
    method: 'post',
    params
  })
}

export function editThePermissionsPage(params) {
  return request({
    url: '/cpr/roleManagement/editThePermissionsPage',
    method: 'post',
    params
  })
}
export function updateRolePermission(data) {
  return request({
    url: '/cpr/roleManagement/updateRolePermission',
    method: 'post',
    data
  })
}