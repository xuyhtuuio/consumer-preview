import request from '@/api/request'

// 通过模板id查看流程信息 会附带流程定义id
export function onlyBankOrgTree() {
  return request({
    url: '/cpr/censor/onlyBankOrgTree',
    method: 'post',
  })
}

export function getFormCategoryArray() {
  return request({
    url: '/cpr/applicationForm/getFormCategoryArray',
    method: 'GET',
  })
}

// 数据概览
export function overviewOfReviewData(data) {
  return request({
    url: '/cpr/Statistics/overviewOfReviewData',
    method: 'POST',
    data
  })
}

// 类型分布
export function distributionOfReviewTypes(data) {
  return request({
    url: '/cpr/Statistics/distributionOfReviewTypes',
    method: 'POST',
    data
  })
}
// 审查任务趋势
export function reviewTaskTrends(data) {
  return request({
    url: '/cpr/Statistics/reviewTaskTrends',
    method: 'POST',
    data
  })
}
// 审查任务分布图
export function reviewTaskDistributionChart(data) {
  return request({
    url: '/cpr/Statistics/reviewTaskDistributionChart',
    method: 'POST',
    data
  })
}

// 审查任务分布图
export function reviewTaskDistribution(data) {
  return request({
    url: '/cpr/Statistics/reviewTaskDistribution',
    method: 'POST',
    data
  })
}
// 触达消费者渠道

export function touchingConsumerChannels(data) {
  return request({
    url: '/cpr/Statistics/touchingConsumerChannels',
    method: 'POST',
    data
  })
}

// 驳回统计
export function rejectStatistics(data, url) {
  return request({
    url,
    method: 'POST',
    data
  })
}

// 常见禁用词/敏感词
export function commonKeywordsPaginationList(data) {
  return request({
    url: '/cpr/Statistics/commonKeywordsPaginationList',
    method: 'POST',
    data
  })
}
// 高频词汇
export function highFrequencyVocabulary(data) {
  return request({
    url: '/cpr/Statistics/highFrequencyVocabulary',
    method: 'POST',
    data
  })
}
