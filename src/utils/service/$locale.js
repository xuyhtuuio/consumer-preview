export default (function () {
  var locales = {}
  let fields = {}
  let messages = {}
  locales.FIELDS = fields
  locales.MESSAGES = messages
  fields.isUrgent=[
    { label: "普通", value: "0" },
    { label: "加急", value: "1" },
  ]
  fields.isOpinions= [
    { label: "无", value: "0" },
    { label: "有", value: "1" },
  ],
  fields.adoptionSituations=[
    { label: "未采纳", value: "0" },
    { label: "已采纳", value: "1" },
  ],
  fields.updateTimeGroup= [
    {
      options: [
        {
          value: 1,
          label: "发起时间",
        },
        {
          value: 2,
          label: "更新时间",
        },
      ],
    },
    {
      options: [
        {
          value: "asc",
          label: "升序",
        },
        {
          value: "desc",
          label: "降序",
        },
      ],
    },
  ],
  messages['NodeStatus'] = {
    '0': '草稿',
    '1': '审批中',
    '2': '撤销',
    '3': '待修改',
    '4': '已完成',
    '5': '待确认',
    '6': '待比对'
  }
  return locales
})()