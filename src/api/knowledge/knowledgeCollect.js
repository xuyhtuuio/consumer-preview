import request from '@/api/request'
// 知识分页列表
export function getRecommendList(data) {
  return request({
    url: '/cpr/KnowledgeMarket/recommendList',
    method: 'post',
    data
  })
}
// 标签列表
export function getTagInfoList(data) {
  return request({
    url: '/cpr/KnowledgeMarket/tagInfoList',
    method: 'get',
    params: data
  })
}
