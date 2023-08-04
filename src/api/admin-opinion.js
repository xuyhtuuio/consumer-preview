
import request from '@/api/request.js'
// 获取列表
export function getPageList(data) {
  return request({
    url: '/cpr/opinion/list',
    method: 'get',
    data
  }).then(({data:{data:res}}) => {
    return res
  })
}