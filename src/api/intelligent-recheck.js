import request from '@/api/request';
export function getSimilarityComparisonList(data) {
  return request({
    url: '/cpr/recheck/similarityComparisonList',
    method: 'post',
    data
  })
}

export function getRecheckList(data) {
  return request({
    url: '/cpr/recheck/checkBackList',
    method: 'post',
    data
  })
}

export function AddRecheck(data) {
  return request({
    url: '/cpr/recheck/add',
    method: 'post',
    data
  })
}

export function getOne(data) {
  return request({
    url: '/cpr/recheck/getOne',
    contentType: 'application/x-www-form-urlencoded',
    method: 'post',
    data
  })
}

export function getRecheckDetailList(data) {
  return request({
    url: '/cpr/recheck/oneReCheck',
    method: 'post',
    data
  })
}
