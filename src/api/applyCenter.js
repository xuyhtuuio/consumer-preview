import request from '@/api/request.js'
/* 申请中心start */
// 表单管理-获取审查事项类型列表
export function getDataStatistics(param) {
  return request({
    url: '/cpr/applicationcenter/header',
    method: 'get',
    params: param
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
    url: '/cpr/applicationcenter/approvalStage',
    method: 'get',
    params: param
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
// 删除

export function delApplication(param) {
  return request({
    url: '/cpr/applicationcenter/del',
    method: 'post',
    contentType:'application/x-www-form-urlencoded',
    data: param
  })
}
// 撤销

export function quashApplication(param) {
  return request({
    url: '/cpr/applicationcenter/quash',
    method: 'post',
    contentType:'application/x-www-form-urlencoded',
    data: param
  })
}
//关注

export function concernApplication(param) {
  return request({
    url: '/cpr/applicationcenter/concern',
    method: 'post',
    contentType:'application/x-www-form-urlencoded',
    data: param
  })
}

export function getApprovalRecordByFromid(param) {
  return request({
    url: '/cpr/approvalrecord/getApprovalRecordByFromId',
    method: 'post',
    contentType:'application/x-www-form-urlencoded',
    data: param
  })
}
//下载

export function downloadAllFiles(param) {
  return request({
    url: '/cpr/applicationForm/downloadAllFiles',
    method: 'post',

    data: param
  })
}
// 用id获取意见详情
export function getEditedCommentsByFormId(param){
  return request({
    url: '/cpr/approvalrecord/getEditedCommentsByFormId',
    contentType:'application/x-www-form-urlencoded',
    method: 'post',
    data: param
  })
}
//审查意见书 保存
export function insertApprovalRecordAndEditedComments(param){
  return request({
    url: '/cpr/approvalrecord/insertApprovalRecordAndEditedComments',
    method: 'post',
    data: param
  })
} 

//审查意见书 提交
export function updateAdoptEditedComments(param){
  return request({
    url: '/cpr/approvalrecord/updateAdoptEditedComments',
    method: 'post',
    data: param
  })
} 
// 保存审查意见书
export function updateEditedComments(param){
  return request({
    url: '/cpr/approvalrecord/updateEditedComments',
    method: 'post',
    contentType:'application/json',
    data: param
  })
} 


