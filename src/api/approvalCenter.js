import request from '@/api/request'
/* 申请中心start */
// 表单管理-获取审查事项类型列表
export function getDataStatistics(param) {
  return request({
    url: '/cpr/censor/header',
    method: 'post',
    data: param
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
    method: 'post',
    data: param
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

// 关注

export function concernApplication(param) {
  return request({
    url: '/cpr/censor/follow',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    data: param
  })
}

// 驳回
export function overrule(param) {
  return request({
    url: '/cpr/censor/overrule',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    data: param
  })
}

// 提单机构
export function billOfLadingAgenciesList() {
  return request({
    url: '/cpr/censor/billOfLadingAgenciesList',
    method: 'get',
  })
}
// 详情页领导审批通过驳回
export function workSpaceAgree(param) {
  return request({
    url: '/cpr/workspace/agree',
    method: 'post',
    contentType: 'multipart/form-data',
    data: param
    // 新的查询列表条件
  })
}
export function toDoList(param) {
  return request({
    url: '/cpr/workspace/process/toDoList',
    method: 'post',
    data: param,

  })
}

export function getApprovalListStation(param) {
  return request({
    url: '/cpr/censor/getApprovalListStation',
    method: 'post',
    data: param,
    contentType: 'application/json'
  })
}
export function exportApprovalList(param) {
  return request({
    url: '/cpr/censor/exportApprovalList',
    method: 'post',
    data: param,
    responseType: 'blob',
  })
}
// 领导审批通过
export function leaderEdit(param) {
  return request({
    url: '/cpr/workspace/process/edit',
    method: 'post',
    contentType: 'application/json',
    data: param,
  })
}
// 领导审批保存后的查询
export function getEditById(param) {
  return request({
    url: '/cpr/workspace/process/getEditById',
    method: 'post',
    contentType: 'application/json',
    data: param,
  })
}
// 上线材料 提交
export function finalMaterial(param, processInstanceId, taskId, formId) {
  return request({
    url: `/cpr/workspace/finalMaterial/${processInstanceId}/${taskId}/${formId}`,
    method: 'post',
    contentType: 'application/json',
    data: param,
  })
}
/**
 * @description: 最终上线材料 上传文件
 * @return {*}
 */
export function uploadCompareFile(param) {
  return request({
    url: '/cpr/onlineComparison/uploadCompareFile',
    method: 'post',
    contentType: 'application/json',
    data: param,
  })
}

// 上线材料查询
export function findFinalMaterial(processInstanceId, taskId) {
  return request({
    url: `/cpr/workspace/findFinalMaterial/${processInstanceId}/${taskId}`,
    method: 'get',
  })
}

// 获取线上对比数据
export function dualScreenPreview(param) {
  return request({
    url: '/cpr/onlineComparison/dualScreenPreview',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    data: param,
  })
}

// 对比结束接口
export function endTask(param) {
  return request({
    url: '/cpr/workspace/endTask',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    data: param,
  })
}

// 获取提单机构
export function getOrgTree() {
  return request({
    url: '/cpr/censor/getOrgTree',
    method: 'post',
  })
}

// 管理员删除工单
export function del(param) {
  return request({
    url: '/cpr/censor/delete',
    method: 'get',
    params: param
  })
}
