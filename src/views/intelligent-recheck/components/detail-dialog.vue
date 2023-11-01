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
          <svg class="icon urgent-icon" aria-hidden="true" v-if="detailItem.urgent == 1">
            <use xlink:href="#icon-shenpiyemiantubiao"></use>
          </svg>
          <svg class="icon urgent-icon" aria-hidden="true" v-if="detailItem.dismissalMark == 1">
            <use xlink:href="#icon-tongyongtubiao2"></use>
          </svg>
          <div class="detail-title">{{ detailItem.formName }}</div>
          <div class="titel-icon">{{ detailItem.formCategoryName }}</div>
        </div>
        <div class="header-right" @click="toDetail">查看更多 ></div>
      </div>
      <OrderBasicInfo :personInfo="detailItem.originator" :params="params"></OrderBasicInfo>
    </el-dialog>
  </div>
</template>

<script>
import OrderBasicInfo from './order-basic-info'
export default {
  props: {
    detailItem: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    OrderBasicInfo
  },
  data: () => ({
    show: true,
    params: {}
  }),
  created() {
    this.params = {
      formId: this.detailItem.formId,
      taskName: this.detailItem.taskName,
      processInstanceId: this.detailItem.processInstanceId,
      formManagementId: this.detailItem.formCategoryId,
      nodeId: this.detailItem.nodeId,
      processTemplateId: this.detailItem.processTemplateId
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
    },
    toDetail() {
      window.localStorage.setItem(
        'order-detail',
        JSON.stringify({
          item: this.detailItem,
        })
      )
      this.$router.push({
        name: 'approval-details',
        params: this.params
      })
    }
  }
}
</script>

<style lang="less">
.detail-dialog {
  max-height: 70vh;
  overflow: scroll;
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
