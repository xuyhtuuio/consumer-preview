import request from '@/api/request'

// 上传文件
export function getFormGroups(formData) {
  return request({
    url: '/cpr/file/upload',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 删除文件
export function deleteFormGroups(params) {
  return request({
    url: '/cpr/file/remove',
    method: 'post',
    params
  })
}

/**
 * 根据文件的md5获取未上传完的任务
 * @param identifier 文件md5
 * @returns {Promise<AxiosResponse<any>>}
 */
export const taskInfo = (identifier, fileName) => {
  return request({
    url: '/cpr/minioUpload/taskInfo',
    method: 'post',
    params: {
      fileName,
      identifier
    }
  })
}

/**
 * 初始化一个分片上传任务
 * @param identifier 文件md5
 * @param fileName 文件名称
 * @param totalSize 文件大小
 * @param chunkSize 分块大小
 * @returns {Promise<AxiosResponse<any>>}
 */
export const initTask = ({ identifier, fileName, totalSize, chunkSize }) => {
  return request.post('/cpr/minioUpload/initTask', {
    identifier,
    fileName,
    totalSize,
    chunkSize
  })
}

/**
 * 获取预签名分片上传地址
 * @param identifier 文件md5
 * @param partNumber 分片编号
 * @returns {Promise<AxiosResponse<any>>}
 */
// fileName, identifier,
export const preSignUrl = ({ partNumber, task }) => {
  const { uploadId, bucketName, objectKey } = task
  return request({
    url: '/cpr/minioUpload/preSignUploadUrl',
    params: {
      // fileName,
      // identifier,
      partNumber,
      uploadId,
      bucketName,
      objectKey
    }
  })
}

/**
 * 合并分片
 * @param identifier
 * @returns {Promise<AxiosResponse<any>>}
 */
export const merge = (identifier, fileName) => {
  return request({
    url: '/cpr/minioUpload/merge',
    method: 'post',
    params: {
      identifier,
      fileName
    }
  })
}

export function getFormCategoryArray(params) {
  return request({
    url: '/cpr/applicationForm/getFormCategoryAssociated',
    method: 'get',
    params
  })
}

export function getApplyForm(params) {
  return request({
    url: '/cpr/applicationForm/getApplyForm',
    method: 'get',
    params
  })
}

// 提交表单
export function submit(data) {
  return request({
    url: '/cpr/applicationForm/submit',
    method: 'post',
    data
  })
}
// 保存草稿
export function saveDraft(data) {
  return request({
    url: '/cpr/applicationForm/saveDraft',
    method: 'post',
    data
  })
}
// 查询工单详情
export function workOrderTaskInfo(params) {
  return request({
    url: '/cpr/applicationForm/workOrderTaskInfo',
    method: 'get',
    params
  })
}
// 查询工单详情
export function externalLogicController(params) {
  return request({
    url: '/cpr/externalLogicController/getProcessDefinitionId',
    method: 'post',
    params
  })
}

export function processStart(data) {
  return request({
    url: '/cpr/workspace/process/start',
    method: 'post',
    data
  })
}
// 获取当前登录用户信息
export function getCurrentUserInfo() {
  return request({
    url: '/cpr/user/getCurrentUser',
    method: 'get'
  })
}
// 单个流程
export function getProcess(params) {
  return request({
    url: '/cpr/admin/form/list',
    method: 'get',
    params: {
      ...params,
      pageNow: 1,
      pageSize: 10
    }
  })
}
