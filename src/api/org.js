import request from '@/api/request'

// 查询人员，角色，部门列表
export function queryUserList(param) {
  return request({
    url: '/cpr/admin/queryUserList',
    method: 'get',
    params: param
  })
}

// 查询组织架构树
export function getOrgTree(param) {
  return request({
    url: '/workflow/oa/org/tree',
    method: 'get',
    params: param
  })
}

// 搜索人员
export function getUserByName(param) {
  return request({
    url: '/workflow/oa/org/tree/user/search',
    method: 'get',
    params: param
  })
}
