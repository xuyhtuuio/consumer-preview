<template>
  <div class="container" v-loading="loading">
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
        <file-preview ref="filePreview" :files="files"></file-preview>
        <orcTxt ref="ocrTxt" :approval="approval"></orcTxt>
        <editorial ref="editorial" :approval="approval"></editorial>
      </div>
    </div>
    <add-review ref="addReview"></add-review>
    <add-file-source ref="addFileSource"></add-file-source>
    <submit-review></submit-review>
  </div>
</template>

<script>
import filePreview from './components/file-preview'
import orcTxt from './components/ocr-txt'
import editorial from './components/editorial'
import { files, pngOcr, recommends } from "./files";
import addFileSource from './dialogs/add-file-source.vue'
import addReview from './dialogs/add-review.vue'
import submitReview from './dialogs/submit-review.vue'
export default {
  name: 'aiApproval',
  components: { filePreview, orcTxt, editorial, addReview, addFileSource,submitReview },
  data() {
    return {
      loading: false,
      files: [], // 文件相关信息
      comments: [], // 编辑意见
      approval: {}, // 当前审批文件的相关内容
    }
  },
  mounted() {
    this.loading = true;
    setTimeout(() => {
      this.files = files;
      this.loading = false;
      this.$nextTick(() => {
        this.$refs.filePreview.init();
        this.files[0].ocr = pngOcr;
        this.files[0].recommends = recommends;
        this.approval = this.files[0];
      })
    }, 1000);
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
  overflow: hidden;
  >div {
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0px 0px 10px 0px #4343430D;
    flex: 1;
    width: 30%;
    overflow: hidden;
    &:first-child{
      width: calc(100% - 60% - 24px);
    }
  }
}
</style>
