export default {
  data() {
    return {
      colConfig: [
        {
          label: '机构',
          prop: 'org',
          bind: {
            align: 'center',
            width: '120px'
          }
        },
        {
          label: '产品类',
          prop: 'project'
        },
        {
          label: '活动类',
          prop: 'actType'
        },
        {
          label: '客户类',
          prop: 'cusType'
        },
        {
          label: '其他',
          prop: 'other',
        },
        {
          label: '总计',
          prop: 'all',
        },
        {
          label: '驳回率',
          prop: 'rate',
        }
      ],
      data: [
        {
          org: '招商银行总行',
          project: '56',
          actType: '37',
          cusType: '37',
          other: '',
          all: '130',
          rate: ''
        },
        {
          org: '招商银行总行',
          project: '56',
          actType: '37',
          cusType: '37',
          other: '',
          all: '130',
          rate: ''
        },
        {
          org: '招商银行总行',
          project: '56',
          actType: '37',
          cusType: '37',
          other: '',
          all: '130',
          rate: ''
        },
        {
          org: '招商银行总行',
          project: '56',
          actType: '37',
          cusType: '37',
          other: '',
          all: '130',
          rate: ''
        },
        {
          org: '招商银行总行',
          project: '56',
          actType: '37',
          cusType: '37',
          other: '',
          all: '130',
          rate: ''
        },
      ],
      page: {
        pageNow: 1,
        total: 20,
        pageSize: 6
      }
    }
  },
  methods: {
    handleCurrentChange() {

    },
    sortChange() {

    },
    submitEdit() {

    },
  }
}
