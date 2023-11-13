import request from '@/api/request';
import $GLOBAL from '@/utils/const'
const { cpr } = $GLOBAL;
// 获取列表
export function getPageList(params, url = cpr + 'opinion/list') {
  return request({
    url,
    method: 'get',
    params,
  }).then(({ data: { data: res } }) => {
    return res;
  });
}
export function getSearchList(params) {
  return request({
    url: cpr + 'keyword/search',
    method: 'get',
    params,
  }).then(({ data: { data: res } }) => {
    return res;
  });
}
// 编辑意见
export function edit(param) {
  return request({
    url: cpr + 'opinion/edit',
    method: 'post',
    data: param
  }).then(({ data: res }) => {
    return res;
  });
}
// 新增意见
export function add(param) {
  return request({
    url: cpr + 'opinion/add',
    method: 'post',
    data: param
  }).then(({ data: res }) => {
    return res;
  });
}
// 删除意见
export function remove(param) {
  return request({
    url: cpr + 'opinion/remove',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded;charset=utf-8',
    data: param
  }).then(({ data: res }) => {
    return res;
  });
}
