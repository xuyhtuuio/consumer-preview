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

// 精选-取消精选 接口
export function setSelected(data) {
  return request({
    url: '/cpr/KnowledgeMarket/selected',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded;charset=utf-8',
    data
  })
}
// 点赞-取消点赞 接口
export function setLike(data) {
  return request({
    url: '/cpr/KnowledgeMarket/like',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded;charset=utf-8',
    data
  })
}

// 关注-取消关注 接口
export function setAttention(data) {
  return request({
    url: '/cpr/KnowledgeMarket/attention',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded;charset=utf-8',
    data
  })
}
// 删除 接口
export function deleteKnowledge(data) {
  return request({
    url: '/cpr/KnowledgeMarket/delete',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded;charset=utf-8',
    data
  })
}

// 关注 标签列表
export function getAttentionTagList(data) {
  return request({
    url: '/cpr/KnowledgeMarket/attentionTagList',
    method: 'get',
    params: data
  })
}
// 创建标签
export function addTag(data) {
  return request({
    url: '/cpr/KnowledgeMarket/addTag',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded;charset=utf-8',
    data
  })
}
// 标签详情
export function getTagBaseInformation(data) {
  return request({
    url: '/cpr/KnowledgeMarket/tagBaseInformation',
    method: 'get',
    params: data
  })
}
