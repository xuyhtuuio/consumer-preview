/*
 * @Author: nimeimix huo.linchun@trs.com.cn
 * @Date: 2023-08-29 13:49:23
 * @LastEditors: nimeimix huo.linchun@trs.com.cn
 * @LastEditTime: 2023-09-04 16:47:01
 * @FilePath: /consumer-preview/src/utils/service/$locale.js
 * @Description:
 */
// eslint-disable-next-line
export default (function () {
  // eslint-disable-next-line
  let locales = {}
  // eslint-disable-next-line
  let fields = {}
  // eslint-disable-next-line
  let messages = {}
  locales.FIELDS = fields
  locales.MESSAGES = messages
  fields.isUrgent = [
    { label: '普通', value: '0' },
    { label: '加急', value: '1' }
  ]
  fields.isOpinions = [
    { label: '无', value: '0' },
    { label: '有', value: '1' },
  ]
  fields.adoptionSituations = [
    { label: '未采纳', value: '0' },
    { label: '已采纳', value: '1' },
  ]
  fields.isOncePass = [
    { label: '一次通过', value: '1' },
    { label: '不是一次通过', value: '0' },
  ]
  fields.isReject = [
    { label: '驳回', value: '1' },
    { label: '未驳回', value: '0' },
  ]
  fields.updateTimeGroup = [
    {
      options: [
        {
          value: 1,
          label: '发起时间',
        },
        {
          value: 2,
          label: '更新时间',
        },
      ],
    },
    {
      options: [
        {
          value: 'asc',
          label: '升序',
        },
        {
          value: 'desc',
          label: '降序',
        },
      ],
    },
  ]
  messages['NodeStatus'] = {
    // eslint-disable-next-line
    '0': '草稿',
    // eslint-disable-next-line
    '1': '审批中',
    // eslint-disable-next-line
    '2': '撤销',
    // eslint-disable-next-line
    '3': '待修改',
    // eslint-disable-next-line
    '4': '已完成',
    // eslint-disable-next-line
    '5': '待确认',
    // eslint-disable-next-line
    '6': '待比对'
  }
  return locales
  // eslint-disable-next-line
})()