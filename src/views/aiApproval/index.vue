<template>
  <div class="container">
    <div class="tools"></div>
    <div class="content">
      <div class="content-header">
        <span class="content-title">
          <i class="iconfont icon-shenpiyemiantubiao"></i>审查项目名称显审查项目名称显示审查项目名称显示</span>
        <span class="content-btns">
          <el-button>返回</el-button>
          <el-button type="primary">提交</el-button>
        </span>
      </div>
      <div class="content-cont">
        <file-preview></file-preview>
        <orcTxt></orcTxt>
        <editorial></editorial>
      </div>
    </div>
    <add-review ref="addReview"></add-review>
    <add-file-source ref="addFileSource"></add-file-source>
  </div>
</template>

<script>
import filePreview from './components/file-preview'
import orcTxt from './components/ocr-txt'
import editorial from './components/editorial'
import addFileSource from './dialogs/add-file-source.vue'
import addReview from './dialogs/add-review.vue'
export default {
  name: 'aiApproval',
  components: { filePreview, orcTxt, editorial, addReview, addFileSource },
  data() {
    return {}
  },
  methods: {
    init() {
      this.$refs['addReview'].init()

    },
    initFile() {
      this.$refs['addFileSource'].init()

    }
  }
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  height: 100%;

  .tools {
    background: #ffffff;
    width: 60px;
  }

  .content {
    flex: 1;
    display: flex;
    padding: 16px 24px;
    flex-direction: column;
  }
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .el-button {
    line-height: 22px;
    padding: 6px 16px;
    border: none;
  }
}

.content-title {
  font-size: 16px;
  font-weight: 700;

  i {
    color: #EB5D78;
    margin-right: 12px;
  }
}

.content-btns {
  margin-left: 20px;
  white-space: pre;
}

.content-cont {
  flex: 1;
  display: flex;
  gap: 12px;

  >div {
    background: #ffffff;
    flex: 1;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 0px #4343430D;
  }
}</style>
