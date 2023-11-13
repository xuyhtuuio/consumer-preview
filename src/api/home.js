import request from '@/api/request';
import $GLOBAL from '@/utils/const'
const { cpr } = $GLOBAL;
export function getList(data) {
  return request({
    url: cpr + 'applicationcenter/applicationList',
    method: 'post',
    data
  })
}

export function getNum(data) {
  return request({
    url: cpr + 'applicationcenter/getsTheNumberOfHeaders',
    method: 'post',
    data
  })
}
