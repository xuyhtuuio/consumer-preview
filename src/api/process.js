
import request from '@/api/request.js'

// 通过模板id查看流程信息 会附带流程定义id
export function getProcessDetail(templateId) {
  return request({
    url: '/workflow/workspace/process/detail',
    method: 'GET',
    params: {
      templateId
    }
  })
}
// 通过流程定义id启动流程
export function processStart(data) {
  return request({
    url: '/workflow/workspace/process/start',
    method: 'POST',
    data
  })
}
// 查看我发起的流程
export function getApplyList(data) {
  return request({
    url: '/workflow/workspace/process/applyList',
    method: 'POST',
    data
  })
}
export default {
  getApplyList
}