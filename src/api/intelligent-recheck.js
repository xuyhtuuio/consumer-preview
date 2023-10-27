import request from '@/api/request';
export function getSimilarityComparisonList(data) {
  return request({
    url: '/cpr/recheck/similarityComparisonList',
    method: 'post',
    data
  })
}

export function checkBackList(data) {
  return request({
    url: '/cpr/recheck/checkBackList',
    method: 'post',
    data
  })
}
