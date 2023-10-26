<template>
  <div class="container" ref="refContainer" v-loading="containLoading">
    <sidebar ref="sidebar"></sidebar>
    <div class="content">
      <div class="content-header" ref="refContentHeader">
        <span class="content-title">
          <i class="iconfont icon-shenpiyemiantubiao" v-if="formBase?.urgent === '1'"></i>{{ formBase?.entryName }}</span>
        <span class="content-btns">
          <el-button @click="goBack"><i class="iconfont icon-fanhui1"></i>返回</el-button>
          <el-button type="tuihui" @click="reject" v-if="approvalLetter.permissions === 'passAllow'">
            <i class="iconfont icon-tuihui1"></i>退回/驳回</el-button>
          <el-button @click="turnTo" v-if="nextStepObj.isChangeHandle !== null"><i
              class="iconfont icon-zhuanban1"></i>转办</el-button>
          <el-button @click="save"><i class="iconfont icon-baocun"></i>保存</el-button>
          <el-button type="primary" @click="changeOcrView"
            v-if="specialFileType.includes(approval?.fileName?.split('.')[approval?.fileName?.split('.').length - 1])"><i
              class="iconfont icon-ocr"></i>{{ showOcr ? '关闭' : '打开' }}智能审批</el-button>
          <el-popover v-show="examineIsShow" popper-class="con-popover" style="margin: 0 0 0 10px" placement="bottom"
            width="380" trigger="click">
            <ExaminePivot class="cont-examine" :style="myContStyle" ref="refExamine">
            </ExaminePivot>
            <el-button slot="reference" type="primary" @click="handleExamine">
              <i class="iconfont icon-heduiyaodian"></i>要点核对
            </el-button>
          </el-popover>

          <el-button type="primary" @click="showSubmit" style="margin-left: 10px"><i
              class="iconfont icon-tijiao"></i>提交</el-button>
        </span>
      </div>
      <div class="content-cont" v-loading="fileloading">
        <div class="content-cont-body">
          <div class="content-cont-body-top">
            <div class="cont-top-btns">
              <!-- <span>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-Frame2"></use>
                </svg>
                更多材料</span> -->
              <el-popover placement="bottom" popper-class="cont-top-popover" v-model="filePopoverShow" width="300" :offset="100" trigger="click"
                :visible-arrow=false>
                <div class="cont-top-fileList">
                  <div class="fileList-search">
                    <el-input v-model.trim="keyWords" placeholder="请输入关键字" @keyup.enter.native="search" @blur="search">
                      <i slot="suffix" class="el-input__icon el-icon-search pointer" @click="search"></i>
                    </el-input>
                  </div>
                  <div class="fileList-tip">
                    <el-switch v-model="filterFocus" active-color="#165DFF" inactive-color="#C9CDD4">
                    </el-switch>
                    <span class="fileList-tip-text">仅看问题文件</span>
                  </div>
                  <div class="fileList-list-item" @click="changeFile(index)" v-for="(file, index) in files" :key="index"
                    :class="{
                      'swiper-slide-img': ['jpeg', 'jpg', 'png'].includes(getfileType(file.fileName))
                    }">
                    <span class="">{{ index + 1 }}.</span>
                    <el-image v-if="['jpeg', 'jpg', 'png'].includes(getfileType(file.fileName))"
                      :src="file.url"></el-image>
                    <file-type class="icon" v-else :fileName="file.fileName"></file-type>
                    <span class="fileList-list-item-fileName">{{ getfileName(file.fileName) }}
                      <i class="fileList-list-item-fileSuf">.{{ getfileType(file.fileName) }}</i>
                    </span>
                  </div>
                </div>
                <span slot="reference">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-Frame2"></use>
                  </svg>
                  更多材料
                </span>
              </el-popover>
              <span @click="saveFile">
                <!-- <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-xiazai"></use>
                </svg> -->
                <i class="iconfont icon-xiazai"></i>
                下载</span>
              <span @click="toggleMode">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-dianjitianjiapizhu"></use>
                </svg>
                切换模式</span>
            </div>
            <div class="cont-top-infos">
              <span>提醒：共发现 4 处风险信息，请认真核对</span>
              <el-input v-model.trim="keyWords" placeholder="请输入关键字" @keyup.enter.native="search" @blur="search"
                size="medium">
                <i slot="suffix" class="el-input__icon el-icon-search pointer" @click="search"></i>
              </el-input>
            </div>
          </div>
          <div class="content-cont-body-bottom">
            <fileChange :curMode="curMode" @toggleMode="toggleMode" @changeFile="changeFile" :activeIndex="activeIndex" :fileList="files" v-if="curMode !== 0 && files[activeIndex]?.type !== 'pdf'"></fileChange>
            <pdfChange @changePdfPageNow="changePdfPageNow" @changePdfPage="changePdfPage" :pdfPageSize="pdfInfo.pageSize" :pdfPageNow="pdfInfo.pageNow" :pdfTotalPage="pdfInfo.pdfTotalPage" :activeIndex="activePdfIndex" :fileList="pdfInfo.list" v-if="files[activeIndex]?.type === 'pdf'"></pdfChange>
            <file-preview ref="filePreview" :files="files" :formId="formId" :activeIndex="activeIndex" v-if="curMode !== 2"
              @changeFile="changeFile" :lineWordItem="lineWordItem" @linePosition="linePosition" :approval="approval"
              @getProps="getProps" @findIconPosition="findIconPosition"></file-preview>
            <orcTxtNew ref="ocrTxt" :approval="approval" @addWord="addWord"
              @lineRemove="lineRemove" @checkEdit="checkEdit"
              v-if="specialFileType.includes(approval?.fileName?.split('.')[approval?.fileName?.split('.').length - 1]) && showOcr && curMode !== 1"
              @showLine="showLine" @showOcrCommentLine="showOcrCommentLine" :lineWordItem="lineWordItem" :styleProp="styleProp" @hasBg="hasBg">
            </orcTxtNew>
            <el-popover ref="postilPopover" class="postil-popover" v-model="popoverShow" popper-class="postil-popover" placement="right"
              trigger="manual">
              <div class="postil-header">
                <div>
                  <!-- <span><img src="@/assets/image/ai-approval/ocr-postil.png" alt=""></span> -->
                  <span class="postil-text">{{ isEdit ? '修改批注' : '添加批注' }}</span>
                </div>
              </div>
              <div class="line"></div>
              <div class="postil-tabs">
                <span>批注意见</span>
                <span class="postil-tab-rel" v-if="this.comments.length" @click="addRelComment">关联意见</span>
              </div>
              <div class="postil-input">
                <el-input type="textarea" resize="none" placeholder="请输入批注意见描述" v-model="postil.textarea">
                </el-input>
              </div>
              <div class="postil-tipText">编辑完成后该条批注可在已编辑意见中查看</div>
              <div class="postil-keyword">
                <span>添加关键字</span>
                <el-radio v-model="postil.isKeyWord" label="1">是</el-radio>
                <el-radio v-model="postil.isKeyWord" label="0">否</el-radio>
              </div>
              <el-form ref="keywordsFrom" v-show="postil.isKeyWord==='1'" :rules="keywordsRules" :model="keywordsInfo" class="postil-keyword-form">
                <el-form-item label="关键词内容" prop="content" class="postil-keyword-item">
                  <el-input v-model="keywordsInfo.content" placeholder="请输入关键词"></el-input>
                </el-form-item>
                <el-form-item label="关键词类型" prop="type" class="postil-keyword-item">
                  <el-select v-model="keywordsInfo.type" placeholder="请选择">
                    <el-option
                      v-for="item in keywordsOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="postil-btn-group">
                <span class="postil-btn cancle" @click="changeRel(false)">取消</span>
                <span class="postil-btn verify" @click="addCommentWithPosition">确认</span>
              </div>
            </el-popover>
            <!-- <orcTxt ref="ocrTxt" :approval="approval" @addWord="addWord" @lineRemove="lineRemove"
              v-if="specialFileType2.includes(approval?.fileName?.split('.')[approval?.fileName?.split('.').length - 1]) && showOcr && curMode !== 1"
              @showLine="showLine" :lineWordItem="lineWordItem">
            </orcTxt> -->
            <p class="content-cont-icons" v-if="specialFileType1.includes(approval?.fileName?.split('.')[approval?.fileName?.split('.').length - 1]) && showOcr">
              <span class="icons">
                <span v-for="(item,index) in icons" :style="{ position: 'absolute', top: (item.iconTop) + 'px' }" :key="index" @click="showIconLine(item)">
                <!-- 单一评论 - 未激活 -->
                <span :data-icon="index" v-if="item.positionWithId?.length === 1 && item.showIndex === -1">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-a-Component13"></use>
                  </svg>
                </span>
                <!-- 多评论 - 未激活 -->
                <span :data-icon="index" v-else-if="item.positionWithId?.length > 1 && item.showIndex === -1">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-a-Component132"></use>
                  </svg>
                </span>
                <!-- 多评论 - 激活 -->
                <span :data-icon="index" v-else-if="item.positionWithId?.length > 1 && item.showIndex === 1">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-a-Component131"></use>
                  </svg>
                </span>
                <!-- 单一评论 - 激活 -->
                <span :data-icon="index" v-else-if="item.positionWithId?.length === 1 && item.showIndex === 1">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-a-Component133"></use>
                  </svg>
                </span>
                </span>
              </span>
            </p>
          </div>
        </div>
        <div class="content-cont-editor">
          <editorial ref="editorial" :approval="approval" :files="files" :formId="formId" @linePosition="linePosition"
            :lineWordItem="lineWordItem" @upDateComments="upDateComments" @showLine="showLine" :activeIndex="activeIndex"
            :activeWordType="activeWordType" @showCommentLine="showCommentLine" @changeEditorialType="changeEditorialType"
            :showOcr="showOcr" :formBase="formBase" @changeFileById="changeFileById" :isRel="isRel" @changeRel="changeRel">
          </editorial>
        </div>
      </div>
    </div>
    <add-review ref="addReview" @addRecommend="addRecommend"></add-review>
    <submit-review ref="submitReview" :formId="formId" :formBase="formBase" :refuseOpiton="refuseOpiton" :approvalLetter="approvalLetter" :applyFormWithPermissions="applyFormWithPermissions" :nextStepObj="nextStepObj" :rejectOption="rejectOption" @submit="submit">
    </submit-review>
    <reject-dialog ref="rejectDialog" :refuseDisabled="refuseDisabled" :refuseOpiton="refuseOpiton" :formBase="formBase" :nextStepObj="nextStepObj"  :rejectOption="rejectOption" @submit="submit"></reject-dialog>
    <el-dialog :visible.sync="previewDialog" width="800px" custom-class="preview-dialog">
      <applyFormFilePreview :url="previewfileUrl"></applyFormFilePreview>
    </el-dialog>
    <secondary-confirmation
      :option="saveOption"
      ref="confirmation"
      @handleClose="goBack"
      @handleConfirm="save"
    ></secondary-confirmation>
    <TurnDialog ref="turnDialog" :formBase="formBase" :nextStepObj="nextStepObj"></TurnDialog>
  </div>
</template>

<script>
import applyFormFilePreview from '@/components/filePreview';
import secondaryConfirmation from '@/components/common/secondaryConfirmation';
import TurnDialog from '@/components/common/turn-dialog'
import fileType from '@/components/common/file-type'
import addReview from './dialogs/add-review';
import submitReview from './dialogs/submit-review';
import rejectDialog from './dialogs/reject-dialog';

import sidebar from './sidebar/sidebar';
import filePreview from './components/file-preview';
// import orcTxt from './components/ocr-txt';
import orcTxtNew from './components/ocr-txt-new';
import ExaminePivot from './components/examine-pivot';
import editorial from './components/editorial';
import fileChange from './components/file-change'
import pdfChange from './components/pdf-change'

import utils from './index-utils'
export default {
  name: 'aiApprovalNew',
  mixins: [utils],
  components: {
    pdfChange,
    sidebar,
    TurnDialog,
    addReview,
    secondaryConfirmation,
    applyFormFilePreview,
    submitReview,
    rejectDialog,
    fileChange,
    filePreview,
    ExaminePivot,
    orcTxtNew,
    // orcTxt,
    editorial,
    fileType,
  },
  data() {
    return {
      filePopoverShow: false,
      isRel: false,
      preComment: {},
      activePdfIndex: 0,
      pdfInfo: {
        pageSize: 10,
        pageNow: 1,
      },
      keywordsInfo: {
        content: '',
        type: ''
      },
      keywordsOptions: [
        { label: '禁用词', value: 1 },
        { label: '敏感词', value: 2 }
      ],
      keywordsRules: {
        content: [
          { required: true, message: '请填写关键词内容', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '请选择关键词类型', trigger: 'blur' },
        ],
      },
      curIconLine: 0,
      curActiveIcon: '',
      comments_nodes: [],
      icons: [],
      preDoms: [],
      domInfo: {},
      popoverShow: false,
      isEdit: false,
      postil: {
        isKeyWord: '0',
        textarea: ''
      },
      keyWords: '',
      filterFocus: false,
      formBase: {},
      previewDialog: false,
      previewfileUrl: '',
      containLoading: false,
      fileloading: false,
      examineShow: false,
      specialFileType: ['jpeg', 'jpg', 'png', 'pdf'],
      specialFileType1: ['jpeg', 'jpg', 'png'],
      specialFileType2: ['pdf'],
      files: [], // 文件相关信息
      comments: [], // 编辑意见
      approval: {}, // 当前审批文件的相关内容
      activeIndex: null,
      word_lines: [], // 连线
      high_light_lines: [], // ocr与原图高亮地区连线
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
        nodeSelectList: [],
        isChangeHandle: null
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
      // 驳回人列表
      refuseOpiton: [],
      refuseDisabled: false,
      styleProp: {},
      curMode: 0,
    };
  },
  created() {
    this.getElHeight();
  },
  computed: {
    getfileType() {
      return val => {
        return val?.split('.')[val.split('.').length - 1]
      }
    },
    getfileName() {
      return val => {
        return val?.split('.')[0]
      }
    },
  },
  watch: {
    comments: {
      handler(val) {
        if (val) {
          // debugger
          // this.dealIconWithComment()
        }
      },
      deep: true
    },
    curMode() {
      this.findIconPosition()
    }
  },
  methods: {
    // 三屏双屏切换 0 为三屏 1 为双屏原图 2 为双屏 0CR
    toggleMode(val) {
      if (val && typeof (val) === 'number') {
        this.curMode = val
      } else {
        this.curMode = this.curMode === 0 ? 1 : 0
      }
      const curFileType = this.getfileType(this.files[this.activeIndex].fileName)
      this.$nextTick(() => {
        if (!this.specialFileType1.includes(curFileType) || this.curMode === 2) {
          return;
        }
        this.$refs.filePreview.imgLoad()
        if (val !== 1) {
          this.lisScroll()
        }
      })
    },
    search() {
      if (this.keyWords) {
        this.$refs.ocrTxt.search(this.keyWords)
      }
    },
    getProps(val) {
      this.styleProp = val;
    },
    // OCR 与 icon 同步滚动
    lisScroll() {
      this.$nextTick(() => {
        const scrollContainer1 = document.querySelector('.ocr-txt .results');
        const scrollContainer2 = document.querySelector('.content-cont-icons');
        const scrollContainer3 = document.querySelector('.file-preview .preview .preview');
        scrollContainer1.addEventListener('scroll', () => {
          scrollContainer2.scrollTop = scrollContainer1.scrollTop;
          scrollContainer3.scrollTop = scrollContainer1.scrollTop;
        });
        scrollContainer2.addEventListener('scroll', () => {
          scrollContainer1.scrollTop = scrollContainer2.scrollTop;
        });
        scrollContainer3.addEventListener('scroll', () => {
          scrollContainer1.scrollTop = scrollContainer3.scrollTop;
        });
      })
    },
  },
  mounted() {
    const { item } = this.$route.params;
    this.formId = item.taskNumber;
    this.inDraft = item.draftFlag === 1;
    this.formCategoryId = item.formManagementId;
    this.init(item);
    this.formBase = item;
    // 获取前面的审批意见
    this.getOpinionApprovalLetter();
    this.getNodeHandleUserApi();
  },
  beforeDestroy() {
    this.lineRemove()
  }
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  padding: 0 !important;

  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 12px 16px 24px;
  }
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  .el-button {
    line-height: 22px;
    padding: 6px 16px;
    border: none;
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
      >span {
        display: flex;
      }
    }

    .el-button--tuihui {
      background: #ffffff;
      color: #eb5757;
    }
  }
}

.content-cont {
  position: relative;
  flex: 1;
  display: flex;
  gap: 12px;
  overflow: hidden;

  &-body {
    display: flex;
    flex: 1;
    flex-direction: column;

    &-top {
      padding: 12px 16px 12px 16px;
      border-bottom: 1px solid #E5E6EB;
      border-radius: 10px 10px 0px 0px;
      background: #ffffff;
      height: 48px;
      display: flex;
      justify-content: space-between;

      .cont-top-infos {
        display: inline-flex;

        span {
          min-width: 243px;
          display: flex;
          height: 24px;
          align-items: center;
          border-radius: 13px;
          padding: 2px 12px 2px 12px;
          background: #FFFCE8;
          color: #FA8C16;
          margin-right: 8px;
        }

        .el-input {
          width: 240px;
          height: 24px;
        }

        /deep/ .el-input__inner {
          border-radius: 18px;
          border: none;
          background: #F2F3F5;
          height: 24px;
        }

        /deep/ .el-input__suffix {
          display: flex;
          align-items: center;
        }
      }

      .cont-top-btns {
        display: flex;
        align-items: center;

        span:nth-of-type(n + 2) {
          &::before {
            content: " ";
            width: 1px;
            height: 12px;
            display: inline-block;
            margin: 0 10px;
            background: #cacdd3;
            cursor: default;
          }
        }

        span {
          .icon {
            width: 16px;
            height: 16px;
          }

          cursor: pointer;
          color: #505968;
        }

        .icon-xiazai {
          display: inline-block;
          width: 14px;
          height: 14px;
          color: #86909C;
        }
      }
    }

    &-bottom {
      flex: 1;
      display: flex;
      gap: 1px;
      overflow: hidden;

      >div {
        background: #ffffff;
        border-radius: 0px 0px 10px 10px;
        box-shadow: 0px 0px 10px 0px #4343430d;
        overflow: auto;

        &:first-child {
          overflow: hidden;

          &:first-child {
            flex: 1;
            // width: calc(100% - 60% - 24px);
          }
        }
      }
      >.file-change{
        flex: none !important;
        width: 60px;
      }
      >.pdf-change{
        flex: none !important;
        width: 116px;
      }
      >.file-preview{
        flex: 1;
      }
      >.ocr-txt{
        flex: 1;
      }
      >p {
        background: #ffffff;
        border-radius: 0px 0px 10px 10px;
        box-shadow: 0px 0px 10px 0px #4343430d;
      }

      .content-cont-icons {
        overflow: auto;
        .icons {
          width: 32px;
          position: relative;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: space-around;

          .icon {
            width: 15px;
            height: 15px;
            cursor: pointer;
          }
        }
      }
    }
  }

  &-editor {
    position: relative;
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

.cont-top-popover {
  .cont-top-fileList {
    height: calc(508px - 32px);
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: inline-block;
    }
  }

  .fileList-search {
    padding: 0px 16px;
    padding-bottom: 8px;
    display: flex;
    justify-content: center;
    align-items: center;

    /deep/ .el-input__inner {
      padding: 2px 12px 2px 12px;
      border: none;
      background: #F2F3F5;
      display: flex;
      align-items: center;
      height: 28px;
      border-radius: 18px;
    }
  }

  .fileList-tip {
    padding: 0 16px;

    .fileList-tip-text {
      margin-left: 4px;
      color: #86909C;
      font-size: 12px;
    }

    /deep/.el-switch__core {
      width: 28px !important;
      height: 16px !important;

      &::after {
        width: 12px;
        height: 12px;
      }
    }

    /deep/ .el-switch.is-checked .el-switch__core::after {
      margin-left: -13px;
    }
  }

  .fileList-list-item {
    border-bottom: 1px dashed #E5E6EB;
    cursor: pointer;
    padding: 10px 24px 10px 24px;
    display: flex;

    /deep/ .el-image {
      width: 20px;
      height: 20px;
      margin: 0 10px;
    }

    .icon {
      width: 20px;
      height: 20px;
      margin: 0 10px;
    }

    .fileList-list-item-fileName {
      width: 170px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &:hover {
      .fileList-list-item-fileName {
        font-weight: 700;
        color: #1D2128;
      }

      .fileList-list-item-fileSuf {
        font-weight: 400;
        color: #1D2128;
      }

      background: #F2F3F5;
    }
  }
}

.postil-popover {
  border-radius: 10px;
  height: calc(100% - 48px);
  /deep/ .el-popover{
    display: flex;
    margin-left: 12px;
    flex-direction: column;
    height: calc(100% - 48px);
    width: 380px;
  }
  .postil-header {
    display: flex;
    margin-bottom: 16px;
    align-items: center;
    justify-content: center;

    span {
      img {
        width: 20px;
        height: 20px;
      }
    }

    .postil-text {
      margin-left: 4px;
      font-size: 16px;
      font-weight: 700;
      line-height: 24px;
      letter-spacing: 0em;
      text-align: left;
      color: #1D2128;
    }
  }

  .line {
    background-color: #E5E6EB;
    width: 372px;
    height: 1px;
  }

  .postil-tabs {
    margin-top: 16px;
    margin-bottom: 8px;

    span {
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0em;
      text-align: left;
      color: #1D2128;

      &:first-child {
        margin-right: 8px;
      }
    }
    .postil-tab-rel{
      color: #2D5CF6;
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .postil-tipText {
    margin-top: 4px;
    color: #86909C;
    font-weight: 400;
    font-size: 12px;
    margin-bottom: 16px;
  }
  .postil-keyword {
    span{
      margin-right: 12px;
      color: #1d2128;
    }
  }
  .postil-keyword-form {
    /deep/ .el-input{
      .el-input__inner{
        border: none;
        width: 340px;
        height: 36px;
        border-radius: 4px;
        background: #F7F8FA;
      }
    }
    /deep/ .el-form-item__label{
      color: #1D2128;
    }
    /deep/ .el-form-item__error {
      display: inline-flex;
      align-items: center;
      &::before {
        content: url(../../assets/image/ai-approval/error.svg);
        width: 15px;
        display: inline-block;
        margin-right: 2.5px;
        height: 15px;
      }
    }
  }
  .postil-btn-group{
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: flex-end;
    .postil-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: 108px;
      height: 38px;
      padding: 8px, 40px, 8px, 40px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      letter-spacing: 0em;
    }

    .cancle {
      border: 1px solid #CACDD3;
      color: #1D2128;
    }

    .verify {
      margin-left: 20px;
      background: #2D5CF6;
      color: #fff;
    }
  }
}
/deep/ .positil-popover-left {
  left: 0 !important;
}
/deep/ .commentNode{
  background: #D1E2FF;
  cursor: pointer;
}
</style>

<style lang="less">.cont-top-popover {
  padding: 16px 0px;
}</style>
