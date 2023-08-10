<template>
  <el-dialog :visible.sync="dialogVisible" width="460px" :before-close="handleClose"  append-to-body>
    <p><i class="iconfont icon-a-tubiao1"></i></p>
    <span>{{ option.message }}</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">{{ option.cancelBtn }}</el-button>
      <el-button type="primary" @click="handleConfirm">{{ option.confirmBtn }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { debounce } from 'lodash';
export default {
  props: {
    option: {
      type: Object,
      default: () => ({
        message: '是否保存本审查项目的审查意见？',
        cancelBtn: '不保存',
        confirmBtn: '保存',
      })
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  mounted() { },
  methods: {
    handleClose() {
      this.dialogVisible = false;
      this.$emit("handleClose", true)
    },
    handleConfirm: debounce(function() {
      this.dialogVisible = false;
      this.$emit("handleConfirm")
    }, 500)
  }
}
</script>

<style lang="less" scoped>
.el-dialog__wrapper {
  /deep/ .el-dialog__header{
    padding: 0;
  } 
  /deep/ .el-dialog__body {
    text-align: center;
    font-size: 14px;
    font-weight: 400;

    span {
      line-height: 22px;
      color: #1D2128;
    }

    .icon-a-tubiao1 {
      display: inline-block;
      color: #FDB123;
      font-size: 50px;
      margin-bottom: 22px;
    }
  }

  /deep/ .el-dialog__footer {
    text-align: center;

    .el-button {
      min-width: 88px;
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      border-radius: 6px;

      &+.el-button {
        margin-left: 24px;
      }
    }

    .el-button--default {
      border: 1px solid #CACDD3;
      color: #1D2128;
    }
    .el-button--primary{
      line-height: 24px;
      background: linear-gradient(90deg, #2F54EB 0%, #5196FF 100%);
      border: none;
    }
  }
}</style>