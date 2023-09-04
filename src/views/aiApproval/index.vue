<template>
  <div class="container" ref="refContainer" v-loading="loading">
    <sidebar ref="sidebar"></sidebar>
    <div class="content">
      <div class="content-header" ref="refContentHeader">
        <span class="content-title">
          <i class="iconfont icon-shenpiyemiantubiao" v-if="formBase?.urgent === '1'"></i
          >{{ formBase?.entryName }}</span
        >
        <span class="content-btns">
          <el-button @click="goBack"><i class="iconfont icon-fanhui1"></i>返回</el-button>
          <el-button type="tuihui" @click="reject"
            ><i class="iconfont icon-tuihui1"></i>退回/驳回</el-button
          >
          <el-button @click="save"><i class="iconfont icon-baocun"></i>保存</el-button>
          <el-button
            type="primary"
            @click="changeOcrView"
            v-if="specialFileType.includes(approval?.fileName?.split('.')[approval?.fileName?.split('.').length -  1])"
            ><i class="iconfont icon-ocr"></i>{{ showOcr ? '关闭' : '打开' }}智能审批</el-button
          >
          <el-popover
            v-show="examineIsShow"
            popper-class="con-popover"
            style="margin: 0 0 0 10px"
            placement="bottom"
            width="380"
            trigger="click"
          >
            <ExaminePivot class="cont-examine" :style="myContStyle" ref="refExamine">
            </ExaminePivot>
            <el-button slot="reference" type="primary" @click="handleExamine">
              <i class="iconfont icon-heduiyaodian"></i>要点核对
            </el-button>
          </el-popover>

          <el-button type="primary" @click="showSubmit" style="margin-left: 10px"
            ><i class="iconfont icon-tijiao"></i>提交</el-button
          >
        </span>
      </div>
      <div class="content-cont" v-loading="fileloading">
        <div class="content-cont-body">
          <file-preview
            ref="filePreview"
            :files="files"
            :activeIndex="activeIndex"
            @changeFile="changeFile"
            :lineWordItem="lineWordItem"
            @linePosition="linePosition"
            :approval="approval"
          ></file-preview>
          <orcTxt
            ref="ocrTxt"
            :approval="approval"
            @addWord="addWord"
            @lineRemove="lineRemove"
            v-if="specialFileType.includes(approval?.fileName?.split('.')[approval?.fileName?.split('.').length-1]) && showOcr"
            @showLine="showLine"
            :lineWordItem="lineWordItem"
          >
          </orcTxt>
          <editorial
            ref="editorial"
            :approval="approval"
            :files="files"
            :formId="formId"
            @linePosition="linePosition"
            :lineWordItem="lineWordItem"
            @upDateComments="upDateComments"
            @showLine="showLine"
            :activeWordType="activeWordType"
            @changeEditorialType="changeEditorialType"
            :showOcr="showOcr"
            :formBase="formBase"
          >
          </editorial>
        </div>
        <!-- <div v-show="examineShow"></div> -->
      </div>
    </div>
    <add-review ref="addReview" @addRecommend="addRecommend"></add-review>
    <submit-review ref="submitReview" :formId="formId" :formBase="formBase" :approvalLetter="approvalLetter" :applyFormWithPermissions="applyFormWithPermissions" :nextStepObj="nextStepObj" :rejectOption="rejectOption" @submit="submit">
    </submit-review>
    <reject-dialog ref="rejectDialog" :formBase="formBase" :nextStepObj="nextStepObj"  :rejectOption="rejectOption" @submit="submit"></reject-dialog>
    <el-dialog :visible.sync="previewDialog" width="800px" custom-class="preview-dialog">
      <applyFormFilePreview :url="previewfileUrl"></applyFormFilePreview>
    </el-dialog>
    <secondary-confirmation
      :option="saveOption"
      ref="confirmation"
      @handleClose="goBack"
      @handleConfirm="save"
    ></secondary-confirmation>
  </div>
</template>

<script>
import applyFormFilePreview from '@/components/filePreview';
import secondaryConfirmation from '@/components/common/secondaryConfirmation';

import sidebar from './sidebar/sidebar';
import filePreview from './components/file-preview';
import orcTxt from './components/ocr-txt';
import editorial from './components/editorial';
import addReview from './dialogs/add-review';
import submitReview from './dialogs/submit-review';
import rejectDialog from './dialogs/reject-dialog';
import ExaminePivot from './components/examine-pivot';

import utils from './index'
export default {
  name: 'aiApproval',
  mixins: [utils],
  components: {
    applyFormFilePreview,
    filePreview,
    orcTxt,
    editorial,
    addReview,
    submitReview,
    secondaryConfirmation,
    rejectDialog,
    sidebar,
    ExaminePivot
  },
  data() {
    return {
      formBase: {},
      previewDialog: false,
      previewfileUrl: '',
      loading: false,
      fileloading: false,
      examineShow: false,
      specialFileType: ['jpeg', 'jpg', 'png', 'pdf'],
      files: [], // 文件相关信息
      comments: [], // 编辑意见
      approval: {}, // 当前审批文件的相关内容
      activeIndex: null,
      word_lines: [], // 连线
      lineWordItem: {}, // 当前展示连线的词的基本信息
      increasedIds: {
        words: [],
        strIds: []
      },
      showOcr: true,
      formId: '',
      inDraft: false, // 判断当前单子是否有 已存的审批意见
      formCategoryId: '',
      saveOption: {
        message: '是否保存本审查项目的审查意见？',
        cancelBtn: '不保存',
        confirmBtn: '保存'
      },
      activeWordType: 0, // 高亮禁用词或敏感词, 1 禁用词,  2 敏感词
      myContStyle: {
        height: '0px'
      },
      examineIsShow: false,
      // 允许提有实质性意见 passAllow 允许提意见以及驳回；passNotAllow不可提意见允许驳回；disPassNotAllow不允许
      approvalLetter: {
        permissions: 'passNotAllow',
        list: []
      },
      applyForm: {},
      applyFormWithPermissions: {
        keyPointsForVerification: [],
        filledInByApprover: []
      },
      formItemPermissions: [],
      nextStepObj: {
        // 提交： selectObject：1 上一审批选择，nodeSelectUserList
        // 驳回：  "refuseWay": "TO_BEFORE" ： 调回指定节点  nodeSelectList
        nextNodeName: '',
        selectObject: '',
        nodeSelectUserList: [],
        refuseWay: '',
        nodeSelectList: []
      },
      rejectOption: [
        {
          value: '文件预览失败（文件损坏/清晰度过低）',
          label: '文件预览失败（文件损坏/清晰度过低）'
        },
        {
          value: '附件材料与审批项目不匹配',
          label: '附件材料与审批项目不匹配'
        },
        {
          value: '其他',
          label: '其他'
        }
      ],
    };
  },
  created() {
    this.getElHeight();
  },
  mounted() {
    if (!this.$route.params.item) {
      this.$router.go(-1);
      return;
    }
    const { item } = this.$route.params;
    this.formId = item.taskNumber;
    this.inDraft = item.draftFlag === 1;
    this.formCategoryId = item.formManagementId;
    this.loading = true;
    this.init(item);
    this.formBase = item;
    // 获取前面的审批意见
    this.getOpinionApprovalLetter();
  },
  beforeDestroy() {
    this.lineRemove();
  }
};
</script>

<style lang="less" scoped>
.container {
  display: flex;

  // height: 100%;

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
    color: #eb5d78;
    margin-right: 12px;
  }
}

.content-btns {
  margin-left: 20px;
  white-space: pre;
  .iconfont {
    font-size: 20px;
    margin-right: 4px;
  }

  /deep/ .el-button {
    > span {
      display: flex;
    }
  }

  .el-popver {
  }

  .el-button--tuihui {
    background: #ffffff;
    color: #eb5757;
  }
}

.content-cont {
  position: relative;
  flex: 1;
  display: flex;
  gap: 12px;
  overflow: hidden;
  &-body {
    flex: 1;
    display: flex;
    gap: 12px;
    overflow: hidden;
    > div {
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0px 0px 10px 0px #4343430d;
      width: 380px;
      overflow: auto;

      &:first-child {
        overflow: hidden;

        &:first-child {
          flex: 1;
          // width: calc(100% - 60% - 24px);
        }
      }
    }
  }
}

/deep/ .preview-dialog {
  height: 80vh;

  .el-dialog__body {
    height: 96%;
  }
}

</style>
<style lang="less">
.sidebar-popper {
  border-radius: 10px;
  background: #fff;
  padding: 24px;
  height: calc(100% - 52px);
  /* 投影/10% */
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.15);
  left: 64px !important;
  top: 50px !important;
}

svg.leader-line {
  z-index: 2;
}

.preview-dialog {
  .el-dialog__body {
    height: 76vh;
  }
}
.con-popover {
  padding: 0 !important;
  .cont-examine {
    overflow-y: scroll;
    // height: 100%;
  }
}

</style>
