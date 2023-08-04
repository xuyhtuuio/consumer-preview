import request from '@/api/request.js'

/* 表单管理start */
// 表单管理-获取审查事项类型列表
export function obtainExamineTypeList(param) {
  return request({
    url: '/cpr/FormManagement/getFormCategoryList',
    method: 'get',
    params: param
  })
}
// 表单管理-新增表单
export function addFormCategory(param) {
  return request({
    url: '/cpr/FormManagement/addFormCategory',
    method: 'get',
    params: param
  })
}
// 修改表单类别的 名称 
export function modifyNameFormCategory(param) {
  return request({
    url: '/cpr/FormManagement/modifyNameFormCategory',
    method: 'get',
    params: param
  })
}
// 修改表单类别的 时限、图标
export function modifyTimeLimitFormCategory(param) {
  return request({
    url: '/cpr/FormManagement/modifyTimeLimitFormCategory',
    method: 'get',
    params: param
  })
}
// 修改表单类别 停用 恢复
export function switchFormCategoryState(param) {
  return request({
    url: '/cpr/FormManagement/switchFormCategoryState',
    method: 'get',
    params: param
  })
}
// 表单管理-复制表单
export function copyFormCategory(formCategoryId) {
  return request({
    url: '/cpr/FormManagement/copyFormCategory',
    method: 'get',
    params: {
      formCategoryId
    }
  })
}

// 表单管理-新增字段
export function addFormField(param) {
  return request({
    url: '/cpr/FormManagement/addItem',
    method: 'post',
    data: param
  })
}
// 表单管理-编辑表单项
export function editItem(param) {
  return request({
    url: '/cpr/FormManagement/editItem',
    method: 'post',
    data: param
  })
}
// 表单管理-根据表单类别id找到字段详情
export function itemPagingList(param) {
  return request({
    url: '/cpr/FormManagement/itemPagingList',
    method: 'get',
    params: param
  })
}
// 表单管理-修改表单字段序号
export function modifyOrder(param) {
  return request({
    url: '/cpr/FormManagement/modifyOrder',
    method: 'post',
    contentType : 'application/x-www-form-urlencoded;charset=utf-8',
    data: param
  })
}
// 表单管理-删除表单项
export function deletedFormItem(param) {
  return request({
    url: '/cpr/FormManagement/deletedFormItem',
    method: 'get',
    params: param
  })
}
// 表单管理-停用或重新启用表单项
export function switchFormItemState(param) {
  return request({
    url: '/cpr/FormManagement/switchFormItemState',
    method: 'get',
    params: param
  })
}
/* 表单管理end */


/* 流程管理start */
// 流程列表
export function getProcessList(param) {
  return request({
    url: '/cpr/admin/form/list',
    method: 'get',
    params: param
  })
}
/* 流程管理end */