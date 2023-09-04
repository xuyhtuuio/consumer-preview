import request from '@/api/request';
export function getList(data) {
  return request({
    url: '/cpr/applicationcenter/applicationList',
    method: 'post',
    data
  })
}

export function getNum(data) {
  return request({
    url: '/cpr/applicationcenter/getsTheNumberOfHeaders',
    method: 'post',
    data
  })
}
