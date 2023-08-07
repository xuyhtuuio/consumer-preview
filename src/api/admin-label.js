import request from '@/api/request.js'
// 获取关键词列表
export function getList(param) {
  return request({
    url: '/cpr/keyword/search',
    method: 'get',
    params: param
  })
}
// 编辑关键词
export function edit(param) {
  return request({
    url: '/cpr/keyword/edit',
    method: 'post',
    data: param
  })
}
// 添加关键词
export function add(param) {
  return request({
    url: '/cpr/keyword/add',
    method: 'post',
    data: param
  })
}