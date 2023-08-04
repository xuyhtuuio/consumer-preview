import request from '@/api/request.js'


// 根据id 查询表单详情
export function getFormTemplateById(formId) {
  return request({
    url: `/cpr/admin/form/detail/${formId}`,
    method: 'get',
    params: {}
  })
}

// 发布
export function publishProcess(data) {
  return request({
    url: '/cpr/admin/form',
    method: 'post',
    data
  })
}
// 保存
export function saveProcess(data) {
  return request({
    url: '/cpr/admin/insert',
    method: 'post',
    data
  })
}
// 删除
export function deleteProcess(templateId) {
  return request({
    url: '/cpr/admin/delete',
    method: 'get',
    params: {
      templateId
    }
  })
}
// 通过模板id查看流程信息 会附带流程定义id
export function getProcessDetailByTemplateId(templateId) {
  return request({
    url: '/cpr/workspace/process/detail',
    method: 'get',
    params: {
      templateId
    }
  })
}
// 通过流程定义id停用流程
export function stopProcess(processDefinitionId, templateId) {
  return request({
    url: '/cpr/workspace/process/stop',
    method: 'post',
    contentType: 'application/x-www-form-urlencoded',
    data: {
      processDefinitionId,
      templateId
    }
  })
}
// 查询模版详情
export function getProcessDetail(templateId) {
  return request({
    url: '/cpr/admin/form/detail',
    method: 'get',
    params: {
      templateId
    }
  })
}
// 查询表单组
export function getFormGroups(param) {
  return request({
    url: '/workflow/admin/form/group',
    method: 'get',
    params: param
  })
}

// 表单排序
export function groupItemsSort(param) {
  return request({
    url: '/workflow/admin/form/group/sort',
    method: 'put',
    data: param
  })
}

// 更新表单组
export function updateGroup(param, method) {
  return request({
    url: '/workflow/admin/form/group',
    method: method,
    params: param
  })
}

// 获取表单分组
export function getGroup() {
  return request({
    url: '/workflow/admin/form/group/list',
    method: 'get'
  })
}

// 更新表单
export function updateForm(param) {
  return request({
    url: '/workflow/admin/form',
    method: 'put',
    params: param
  })
}

export function createForm(param){
  return request({
    url: '/workflow/admin/form',
    method: 'post',
    data: param
  })
}

// 查询表单详情
export function getFormDetail(id) {
  return request({
    url: '/workflow/admin/form/detail/' + id,
    method: 'get'
  })
}

// 更新表单详情
export function updateFormDetail(param) {
  return request({
    url: '/workflow/admin/form/detail',
    method: 'put',
    data: param
  })
}

export default {
  getFormGroups, groupItemsSort, createForm, getFormDetail,
  updateGroup, getGroup, updateForm, updateFormDetail
}
