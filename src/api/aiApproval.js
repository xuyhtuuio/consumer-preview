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
export function getOcrExamineShow(param) {
  return request({
    url: '/cpr/OcrExamine/getOcrExamineShow',
    method: 'get',
    params: param
  })
}