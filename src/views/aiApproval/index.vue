<template>
  <div class="container" v-loading="loading">
    <div class="tools">
      <el-popover placement="right" trigger="click" popper-class="sidebar-popper" @after-leave="hiddenPopover" v-for="(item,index) in tools" :key="index">
         <component :is="crtToolComponent"></component>
        <span slot="reference" :class="crtTools == item.toolSign ? 'active-tools el-popover__reference' : 'el-popover__reference'"
          @click="changeTools(item)">
          <i :class="['iconfont',item.icon]"></i>
        </span>
      </el-popover>
    </div>
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
        <orcTxt ref="ocrTxt"></orcTxt>
        <editorial ref="editorial"></editorial>
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
import { files, pngOcr } from "./files";
import addFileSource from './dialogs/add-file-source.vue'
import addReview from './dialogs/add-review.vue'
import submitReview from './dialogs/submit-review.vue'
import applyForm from './sidebar/apply-form.vue'
import approvalRecordDetail from './sidebar/approval-record-detail'
import similarCase from './sidebar/similar-case.vue'
import approvedOpinion from './sidebar/approved-opinion'
import aiKnowledgeBase from './sidebar/ai-knowledge-base'

export default {
  name: 'aiApproval',
  components: { filePreview, orcTxt, editorial, addReview, addFileSource, submitReview, applyForm, similarCase, approvalRecordDetail, approvedOpinion, aiKnowledgeBase },
  data() {
    return {
      loading: false,
      files: [], // 文件相关信息
      comments: [], // 编辑意见
      crtTools: '',//当前侧边工具栏激活项

      tools: [
        {
          component: 'applyForm',
          toolSign: 'apply-form',
          icon: 'icon-shenqingdan'
        },
        {
          component: 'approvalRecordDetail',
          toolSign: 'approval-record',
          icon: 'icon-jilumingxi'
        },
        {
          component: 'similarCase',
          toolSign: 'similar-case',
          icon: 'icon-xiangsianli'
        },
        {
          component: 'approvedOpinion',
          toolSign: 'approved-opinion',
          icon: 'icon-yijianshu'
        },
        {
          component: 'aiKnowledgeBase',
          toolSign: 'ai',
          icon: 'icon-ciku'
        }
      ],
      crtToolComponent:'',
    }
  },
  mounted() {
    this.loading = true;
    setTimeout(() => {
      this.files = files;
      this.loading = false;
      this.$refs.filePreview.init()
    }, 1000);
  },
  methods: {
    changeTools(item) {
      this.crtTools = item.toolSign,
      this.crtToolComponent=item.component
    },
    hiddenPopover() {
      this.crtTools = ''
    },
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
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 60px;

    .iconfont {
      font-size: 22px;

    }

    span {
      display: inline-block;
      cursor: pointer;

      .el-popover__reference {
        padding: 6px !important;
        margin-bottom: 24px;
      }
    }

    span:hover {
      .el-popover__reference {
        background: #F2F3F5;
        border-radius: 4px;
        padding: 6px;

      }

    }

    .active-tools {
      background: #F2F3F5;
      border-radius: 4px;
      padding: 6px;



    }

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
    border-radius: 10px;
    box-shadow: 0px 0px 10px 0px #4343430D;
    flex: 1;
    width: 30%;

    &:first-child {
      width: calc(100% - 60% - 24px);
    }
  }
}
</style>
<style lang="less">
.sidebar-popper {
  border-radius: 10px;
  background: #FFF;
  padding: 24px;
  /* 投影/10% */
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.15);
}
</style>
