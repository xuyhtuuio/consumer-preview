import request from '@/api/request'
/* 申请中心start */
// 表单管理-获取审查事项类型列表
export function getDataStatistics(param) {
  return request({
    url: '/cpr/applicationcenter/header',
    method: 'get',
    params: param
  })
}
// 数量预览
export function getsTheNumberOfHeaders(param) {
  return request({
    url: '/cpr/applicationcenter/getsTheNumberOfHeaders',
    method: 'post',
    data: param
  })
}

export function getUserStatus(param) {
  return request({
    url: '/cpr/applicationcenter/user-status',
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
    url: `/cpr/applicationcenter/approvalPhase/${param}`,
    method: 'get',
  })
}
// 获取申请列表
export function getApplicationList(param) {
  return request({
    url: '/cpr/applicationcenter/applicationList',
    method: 'post',

    data: param
  })
}
// 获取关注列表
export function concernedList(param) {
  return request({
    url: '/cpr/applicationcenter/concernedList',
    method: 'post',
    data: param
  })
}

// 待确认
export function toBeConfirmed(param) {
  return request({
    url: '/cpr/applicationcenter/toBeConfirmed',
    method: 'post',
    data: param
  })
}
// 待修改
export function toReviseList(param) {
  return request({
    url: '/cpr/applicationcenter/toReviseList',
    method: 'post',
    data: param
  })
}

// 草稿
export function revoked(param) {
  return request({
    url: '/cpr/applicationcenter/revoked',
    method: 'post',
    data: param
  })
}
// 审批中
export function Approval(param) {
  return request({
    url: '/cpr/applicationcenter/approval',
    method: 'post',
    data: param
  })
}

// 删除

export function delApplication(param) {
  return request({
    url: '/cpr/applicationcenter/del',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
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

export function instanceInfo(param) {
  return request({
    url: '/cpr/workProcessQuery/instanceInfo',
    method: 'post',
    // contentType:'application/x-www-form-urlencoded',
    data: param
  })
}
// 下载

export function downloadAllFiles(param) {
  return request({
    url: '/cpr/applicationForm/downloadAllFiles',
    method: 'get',
    responseType: 'blob',
    params: param
  })
}
// 用id获取意见详情
export function getEditedCommentsByFormId(param) {
  return request({
    url: '/cpr/approvalrecord/getOpinionLetterByFormId',
    contentType: 'application/x-www-form-urlencoded',
    method: 'post',
    data: param
  })
}
// 审查意见书 保存
export function insertApprovalRecordAndEditedComments(param) {
  return request({
    url: '/cpr/approvalrecord/insertApprovalRecordAndEditedComments',
    method: 'post',
    data: param
  })
}
// 审查意见书 提交
export function updateAdoptEditedComments(param, id) {
  return request({
    url: `/cpr/approvalrecord/opinionConfirmation?taskId=${id}`,
    method: 'post',
    data: param
  })
}
// 保存审查意见书
export function updateEditedComments(param) {
  return request({
    url: '/cpr/approvalrecord/temporaryOpinions',
    method: 'post',
    contentType: 'application/json',
    data: param
  })
}

export function quashApplication(param) {
  return request({
    url: '/cpr/workspace/revoke',
    method: 'post',
    data: param
  })
}

export function canRoved(param) {
  return request({
    url: '/cpr/externalLogicController/rove',
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded',
    params: param
  })
}

// 获取当前process-id对应的流程配置信息
export function getTemplatedetail(param) {
  return request({
    url: '/cpr/workspace/process/templateDetail',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    data: param
  })
}
