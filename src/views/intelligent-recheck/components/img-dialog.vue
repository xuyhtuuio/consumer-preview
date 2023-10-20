<template>
  <el-dialog
    :visible.sync="imgDialog"
    width="800px"
    :before-close="handleClose"
    center
    custom-class="add-review"
    title="图片预览"
  >
    <div class="to-link" @click="toDetail">查看详情 ></div>
    <ImagePreview
      :url="url"
      ref="imgPreview1"
    ></ImagePreview>
  </el-dialog>
</template>
<script>
import ImagePreview from './imgae-preview'
export default {
  name: 'rejectDialog',
  components: {
    ImagePreview
  },
  props: {
    url: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      imgDialog: false
    }
  },
  mounted() {},
  methods: {
    handleClose() {
      this.imgDialog = false
    },
    toDetail() {
      window.localStorage.setItem(
        'order-detail',
        JSON.stringify({
          item: this.item,
        })
      )
      this.$router.push({
        name: 'approval-details',
        params: {
          formId: this.item.formId,
          taskName: this.item.taskName,
          processInstanceId: this.item.processInstanceId,
          formManagementId: this.item.formCategoryId,
          nodeId: this.item.nodeId,
          processTemplateId: this.item.processTemplateId
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-dialog {
  .el-dialog__body {
    height: 500px;
    padding-bottom: 60px;
    .to-link {
      text-align: right;
      color: #2d5cf6;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      cursor: pointer;
      margin-bottom: 8px;
    }
  }
}
</style>
