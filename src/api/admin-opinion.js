import qs from 'qs';
import request from '@/api/request.js';
// 获取列表
export function getPageList(params) {
  return request({
    url: '/cpr/opinion/list',
    method: 'get',
    params,
  }).then(({ data: { data: res } }) => {
    return res;
  });
}
export function getSearchList(params) {
  return request({
    url: '/cpr/keyword/search',
    method: 'get',
    params,
  }).then(({ data: { data: res } }) => {
    return res;
  });
}
