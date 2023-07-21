import request from '@/api/request.js'


// 上传图片
export function getFormGroups(formData) {
  return request({
    url: '/cpr/cpr/file/upload',
    method: 'post',
    data: formData,
    headers: {'Content-Type': 'multipart/form-data'}
  })
}


// 删除图片
export function deleteFormGroups(params) {
  return request({
    url: '/cpr/cpr/file/remove',
    method: 'post',
    params,
  })
}

export function getFormCategoryArray(params) {
  return request({
    url: '/cpr/cpr/applicationForm/getFormCategoryArray',
    method: 'get',
    params
  })
}

export function getApplyForm(params) {
  return request({
    url: '/cpr/cpr/applicationForm/getApplyForm',
    method: 'get',
    params
  })
}

// 提交表单
export function submit(data) {
  return request({
    url: '/cpr/cpr/applicationForm/submit',
    method: 'post',
    data
  })
}
// 保存草稿
export function saveDraft(data) {
  return request({
    url: '/cpr/cpr/applicationForm/saveDraft',
    method: 'post',
    data
  })
}