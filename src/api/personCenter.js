import request from '@/api/request'
// 提单人员-接受率分布
export function proposeAcceptRate(data) {
  return request({
    url: '/cpr/personController/proposeAcceptRate',
    method: 'POST',
    data
  })
}

// 提单人员-一次通过率分布
export function proposeOnePassRate(data) {
  return request({
    url: '/cpr/personController/proposeOnePassRate',
    method: 'POST',
    data
  })
}

// 提单人员-驳回率分布
export function proposeRejectRate(data) {
  return request({
    url: '/cpr/personController/proposeRejectRate',
    method: 'POST',
    data
  })
}

// 提单人员-贡献值月度变化
export function contributionChange(params) {
  return request({
    url: '/cpr/personController/contributionChange',
    method: 'GET',
    params
  })
}

// 提单人员-申请列表
export function oneApplicationList(data) {
  return request({
    url: '/cpr/personController/oneApplicationList',
    method: 'POST',
    data
  })
}

// 提单人员-列表
export function proposePersonList(data) {
  return request({
    url: '/cpr/personController/proposePersonList',
    method: 'POST',
    data
  })
}

// 驳回情况-驳回原因
export function rejectReason(params) {
  return request({
    url: '/cpr/personController/rejectReason',
    method: 'GET',
    params
  })
}

// 审批人员-贡献值分布
export function approveContribution(data) {
  return request({
    url: '/cpr/personController/approveContribution',
    method: 'POST',
    data
  })
}

// 审批人员-接受率分布
export function approveAcceptRate(data) {
  return request({
    url: '/cpr/personController/approveAcceptRate',
    method: 'POST',
    data
  })
}
// 审批人员-平均处理时长分布
export function approveAvgTime(data) {
  return request({
    url: '/cpr/personController/approveAvgTime',
    method: 'POST',
    data
  })
}

// 审批人员-列表
export function approvePersonList(data) {
  return request({
    url: '/cpr/personController/approvePersonList',
    method: 'POST',
    data
  })
}
