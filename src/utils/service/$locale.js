export default (function () {
  var locales = {}
  let fields = {}
  let messages = {}
  locales.FIELDS = fields
  locales.MESSAGES = messages
  messages['NodeStatus'] = {
    '0': '草稿',
    '1': '审批中',
    '2': '撤销',
    '3': '待修改',
    '4': '已完成',
    '5': '待确认',
  }
  return locales
})()