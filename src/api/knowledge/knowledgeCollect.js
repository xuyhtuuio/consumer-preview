import request from '@/api/request'
// 知识分页列表
export function getRecommendList(data) {
  return request({
    url: '/cpr/KnowledgeMarket/recommendList',
    method: 'post',
    data
  })
}
// 查看单个知识数据
export function getOneKnowledge(knowledgeId) {
  return request({
    url: '/cpr/KnowledgeMarket/oneKnowledge/' + knowledgeId,
    method: 'get',
    contentType: 'application/x-www-form-urlencoded;charset=utf-8',
  })
}
// 标签列表
export function getTagInfoList(data) {
  return request({
    url: '/cpr/KnowledgeMarket/tagInfoList',
    method: 'get',
    params: data,
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
    contentType: 'application/x-www-form-urlencoded;charset=utf-8',
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

// 发布知识
export function addKnowledge(data) {
  return request({
    url: '/cpr/KnowledgeMarket/addKnowledge',
    method: 'post',
    data
  })
}

// 发布评论
export function addComment(data) {
  return request({
    url: '/cpr/KnowledgeMarket/addComment',
    method: 'post',
    data
  })
}

// 知识评论列表
export function getCommentList(data) {
  return request({
    url: '/cpr/KnowledgeMarket/commentList',
    method: 'get',
    contentType: 'application/x-www-form-urlencoded;charset=utf-8',
    params: data
  })
}

// 获取登陆人的拼音缩写
export function getPinYin() {
  return request({
    url: '/cpr/KnowledgeMarket/getPinYin',
    method: 'get',
    contentType: 'application/x-www-form-urlencoded;charset=utf-8'
  })
}

// 查询法规库列表
export function queryRegulationList(data) {
  return request({
    url: '/cpr/regulationController/queryRegulationList',
    method: 'post',
    data
  })
}
// 查询法规标签
export function queryTagCode(data) {
  return request({
    url: '/cpr/regulationController/queryTagCode',
    method: 'post',
    data
  })
}
// 查询权益标签
export function queryBenefitLabel(data) {
  return request({
    url: '/cpr/regulationController/queryBenefitLabel',
    method: 'post',
    data
  })
}
// 添加法规标签
export function insertTagCode(data) {
  return request({
    url: '/cpr/regulationController/insertTagCode',
    method: 'post',
    contentType: 'application/json',
    data
  })
}
// 添加权益标签
export function insertBenefitLabel(data) {
  return request({
    url: '/cpr/regulationController/insertBenefitLabel',
    method: 'post',
    contentType: 'application/json',
    data
  })
}
// 添加法规
export function insertRegulation(data) {
  return request({
    url: '/cpr/regulationController/insertRegulation',
    method: 'post',
    data
  })
}
// 更新法规
export function updateRegulation(data) {
  return request({
    url: '/cpr/regulationController/updateRegulation',
    method: 'post',
    data
  })
}
// 删除法规
export function deleteRegulation(data) {
  return request({
    url: '/cpr/regulationController/deleteRegulation',
    method: 'post',
    data
  })
}
// 法规详情
export function queryDetails(data) {
  return request({
    url: '/cpr/regulationController/queryDetails',
    method: 'get',
    params: data
  })
}
// 增加阅读次数
export function updateReadCount(data) {
  return request({
    url: '/cpr/regulationController/updateReadCount',
    method: 'post',
    data
  })
}
// 查询历史沿革
export function queryHistoryLogs(data) {
  return request({
    url: '/cpr/regulationController/queryHistoryLogs',
    method: 'get',
    params: data
  })
}
// 查询最近浏览
export function queryViewLogs(data) {
  return request({
    url: '/cpr/regulationController/queryViewLogs',
    method: 'get',
    params: data
  })
}
// 预览文件、
export function filePreview(data) {
  return request({
    url: '/cpr/file/preview',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    data
  })
}
