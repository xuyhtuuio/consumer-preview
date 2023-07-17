import request from '@/api/request.js'

/* 表单管理start */
// 表单管理-获取审查事项类型列表
export function obtainExamineTypeList(param) {
  return request({
    url: '/workflow/formManagement/obtainExamineTypeList',
    method: 'get',
    params: param
  })
}
// 表单管理-新增字段
export function addFormField(param) {
  return request({
    url: '/workflow/formManagement/addFormField',
    method: 'post',
    data: param
  })
}
/* 表单管理end */