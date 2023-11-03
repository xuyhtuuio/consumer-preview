export default {
  data() {
    return {
      colConfig: [],
      data: [],
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
    sortChange(data) {
      if (data.order) {
        if (data.order && data.order.includes('asc')) {
          this.initData(this.searchData, 1, data.prop)
        } else {
          this.initData(this.searchData, 2, data.prop)
        }
      }
    },
    submitEdit() {

    },
  }
}
