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
