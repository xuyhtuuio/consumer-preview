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
