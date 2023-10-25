<template>
  <div class="detail-dialog">
    <el-dialog
      :visible.sync="show"
      custom-class="detail-dialog"
      width="1000"
      :before-close="handleClose"
      :show-close="false"
    >
      <div class="detail-header">
        <div class="header-left">
          <svg class="icon urgent-icon" aria-hidden="true">
            <use xlink:href="#icon-shenpiyemiantubiao"></use>
          </svg>
          <svg class="icon urgent-icon" aria-hidden="true">
            <use xlink:href="#icon-tongyongtubiao2"></use>
          </svg>
          <div class="detail-title">睿远平衡18月产品宣传图审核</div>
          <div class="titel-icon">产品类</div>
        </div>
        <div class="header-right">查看更多 ></div>
      </div>
      <OrderBasicInfo></OrderBasicInfo>
    </el-dialog>
  </div>
</template>

<script>
import OrderBasicInfo from './order-basic-info'
export default {
  components: {
    OrderBasicInfo
  },
  data: () => ({
    show: false
  }),
  methods: {
    handleClose() {
      this.show = false
    }
  }
}
</script>

<style lang="less">
.detail-dialog {
  .el-dialog__header {
    padding: 12px 24px;
  }
  .el-dialog__body {
    padding: 0 24px 24px;
    .detail-header {
      height: 22px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      .header-left {
        display: flex;
        align-items: center;
        .urgent-icon {
          width: 16px;
          height: 16px;
          margin-right: 4px;
        }
        .detail-title {
          color: #1d2128;
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
          line-height: 22px;
          margin-right: 4px;
        }
        .titel-icon {
          border-radius: 4px;
          background: #f0f6ff;
          padding: 1px 6px;
          color: #2d5cf6;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 20px;
        }
      }
      .header-right {
        color: #2d5cf6;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
        cursor: pointer;
      }
    }
  }
}
</style>
