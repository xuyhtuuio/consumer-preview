import request from '@/api/request.js'
/* 申请中心start */
// 表单管理-获取审查事项类型列表
export function getDataStatistics(param) {
  return request({
    url: '/cpr/censor/header',
    method: 'get',
    params: param
  })
}
export function getUserStatus(param) {
  return request({
    url: '/cpr/censor/user-status',
    method: 'get',
    params: param
  })
}
// 审批类型下拉列表
export function getApprovalType(param) {
  return request({
    url: '/cpr/applicationcenter/approvalType',
    method: 'get',
    params: param
  })
}
// 审批阶段下拉列表
export function getApprovalStage(param) {
  return request({
    url: '/cpr/applicationcenter/approvalStage',
    method: 'get',
    params: param
  })
}
// 获取申请列表
export function censorList(param) {
  return request({
    url: '/cpr/censor/censorList',
    method: 'post',
    data: param
  })
}

//关注

export function concernApplication(param) {
  return request({
    url: '/cpr/censor/concern',
    method: 'post',
    contentType:'application/x-www-form-urlencoded',
    data: param
  })
}

// 驳回
 export function overrule(param){
    return request({
        url: '/cpr/censor/overrule',
        method: 'post',
        contentType:'application/x-www-form-urlencoded',
        data: param
      })
 }


