import request from '@/api/request.js'
// 获取申请单所有的文件列表
export function getUploadedFilesList(param) {
  return request({
    url: '/cpr/OcrExamine/getUploadedFilesList',
    method: 'get',
    params: param
  })
}
// 根据附件id获取orc解析后的内容
export function getOCRAnalysisResults(param) {
  return request({
    url: '/cpr/OcrExamine/getOCRAnalysisResults',
    method: 'get',
    params: param
  })
}
// 获取ocr结果命中的关键词及推荐意见
export function getOcrExamineShow(param) {
  return request({
    url: '/cpr/OcrExamine/getOcrExamineShow',
    method: 'get',
    params: param
  })
}
// 保存ocr审批草稿
export function approvalStorageDraft(param) {
  return request({
    url: '/cpr/OcrExamine/approvalStorageDraft',
    method: 'post',
    data: param
  })
}
// 获取审批草稿
export function getApprovalDraft(param) {
  return request({
    url: '/cpr/OcrExamine/getApprovalDraft',
    method: 'get',
    params: param
  })
}
// 文件下载
export function download(param) {
  return request({
    url: '/cpr/file/download',
    method: 'post',
    contentType : 'application/x-www-form-urlencoded;charset=utf-8',
    data: param
  })
}
// 推荐列表加载更多
export function RecommendedListLoadMore(param) {
  return request({
    url: '/cpr/OcrExamine/RecommendedListLoadMore',
    method: 'get',
    params: param
  })
}
// ocr审批提交
export function ocrApprovalSubmission(param) {
  return request({
    url: '/cpr/workspace/agree',
    method: 'post',
    data: param
  })
}

// ocr审批驳回
export function rollback(param) {
  return request({
    url: '/cpr/workspace/rollback',
    method: 'post',
    data: param
  })
}
// 获取前面审批人的审批意见，以及当前节点的审批权限
export function getOpinionApprovalLetter(param) {
  return request({
    url: '/cpr/OcrExamine/getOpinionApprovalLetter',
    method: 'get',
    params: param
  })
}