<template>
  <div>
    <el-pagination v-bind="$attrs" :style="mainStyle" class="pagination noBg" background :layout="layout"
      @current-change="getList" :current-page="pageNow" :page-size="pageSize" :total="realTotal">
      <span>共{{ total > 10000 ? "10000+" : total }}条</span>
    </el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    pageNow: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    mainStyle: {
      type: Object,
      default: () => { }
    },
    layout: {
      type: String,
      default: 'slot,prev, pager, next, jumper'
    },
    scrollType: { // 翻页之后滑动顶部的类型
      type: String,
      default: ''
    },
    scrollName: { // 翻页之后滑动顶部的ref
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  computed: {
    realTotal() {
      const remainder = 10000 % this.pageSize
      if (remainder === 0) {
        return this.total > 10000 ? 10000 : this.total
      } else {
        const total = 10000 - remainder
        return this.total > total ? total : this.total
      }
    },
  },
  methods: {
    getList(val) {
      // 翻页之后父级滑动到顶部
      if (this.scrollName && this.$parent.$refs[this.scrollName]) {
        this.scrollType === 'scrollCom' ? this.$parent.$refs[this.scrollName].scrollTop = 0 : this.$parent.$refs[this.scrollName].bodyWrapper.scrollTop = 0
      }
      this.$emit('getList', val)
    }
  },
}
</script>
<style lang="less" scoped>
/deep/.el-pagination {
  font-weight: normal;
  margin-top: 16px;
  text-align: right;

  button {
    height: 24px;
    width: 24px;
    min-width: 0;
    padding: 0;
    background: #f3f3f5;
    border-radius: 2px;
  }

  .btn-prev {
    margin-right: 8px;
  }

  button:disabled {
    color: #909199 !important;
    background-color: #efeeee;
    border-color: #efeeee;
    cursor: not-allowed;
  }

  button:hover {
    color: #2d5cf6;
  }

  .el-pager li:hover {
    color: #2d5cf6;
  }

  .el-pager li:not(.disabled):hover {
    color: #2d5cf6;
  }

  .el-pagination__total {
    font-weight: 400;
    font-size: 10px;
    line-height: 24px;
    height: 24px;
    color: #88909b;
  }

  span:not([class*="suffix"]),
  button {
    color: #88909b;
    font-size: 12px;
    height: 24px;
    line-height: 24px;
  }

  .el-pager {
    height: 24px;

    .number {
      padding: 2px 8px;
      font-weight: 400;
      font-size: 12px;
      line-height: 20px;
      text-align: center;
      color: #292b34;
      background-color: #f7f8fa;
      margin-right: 8px;
      // border: 1px solid #E2E2E2;
      border-radius: 2px !important;
    }

    li {
      min-width: 24px;
      height: 24px;
      line-height: 24px;
      margin-right: 8px !important;
    }

    .active {
      background: #2d5cf6;
      color: #fff;
      font-weight: 700;
    }

    .active:hover {
      color: #fff !important;
    }

    .el-icon {
      margin-right: 8px;
    }

    .el-icon-d-arrow-right,
    .el-icon-d-arrow-left {
      color: #2d5cf6;
    }

    .more::before {
      line-height: 24px;
    }
  }

  .el-pagination__jump {
    height: 24px;
    font-weight: 400;
    font-size: 12px;
    line-height: 24px;
    text-align: center;
    color: #292b34;
    margin-left: 7px;

    .el-input__inner {
      height: 24px;
      border-radius: 2px;
      font-weight: 400;
      font-size: 12px;
      line-height: 24px;
      text-align: center;
    }

    .el-input {
      margin-left: 8px;
      margin-right: 4px;
    }

    // .el-input__inner:focus {
    //   border-color: #A8C5FF !important;
    // }
  }
}
</style>
