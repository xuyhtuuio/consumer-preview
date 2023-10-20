import request from '@/api/request';
export function getSimilarityComparisonList(data) {
  return request({
    url: '/cpr/recheck/similarityComparisonList',
    method: 'post',
    data
  })
}
