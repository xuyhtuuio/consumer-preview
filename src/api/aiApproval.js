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