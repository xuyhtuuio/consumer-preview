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
import LeaderLine from '@/utils/leader-line';
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

import {
  getUploadedFilesList,
  getOCRAnalysisResults,
  getOcrExamineShow,
  approvalStorageDraft,
  getApprovalDraft,
  getOpinionApprovalLetter,
  queryFormItemPermissions,
  getNextUserOption
} from '@/api/aiApproval';
import { getApplyForm } from '@/api/front';
import {
  rollback
} from "@/api/aiApproval";
export default {
  name: 'aiApproval',
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
      inDraft: false, //判断当前单子是否有 已存的审批意见
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
        permissions: "passNotAllow",
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
  methods: {
    reject() {
      this.$refs.rejectDialog.init();
    },
    getElHeight() {
      this.$nextTick(() => {
        const refContainer = this.$refs.refContainer.clientHeight;
        const refHeader = this.$refs.refContentHeader.clientHeight;
        const mainResult = refContainer - refHeader - 32; // 32 padding值
        this.myContStyle.height = mainResult + 'px';
      });
    },
    // 获取工单上一审查意见书
     getOpinionApprovalLetter() {
      getOpinionApprovalLetter({
        nodeId: this.formBase.nodeId,
        formId: this.formId,
        templateId: this.formBase.processTemplateId
      }).then(res => {
        const { data, status } = res.data;
        if (status === 200) {
          data.list.forEach(item => {
            item.str = item.content;
            item.opinion = Boolean(item.substantiveOpinions)
          })
          this.approvalLetter = data
        }
      });
    },
    // 获取工单基本信息
    init() {
      getApplyForm({
        formCategoryId: this.formCategoryId,
        formId: this.formId
      }).then(res => {
        const { data, status, message } = res.data;
        if (status === 200) {
          this.applyForm = data;
          this.queryFormItemPermissions();
          this.getNextUserOption();
          this.$refs.sidebar.tools[0].sidebarParam = {
            ...data,
            keyPointsForVerification: JSON.parse(JSON.stringify(data.keyPointsForVerification))
           };
        }
        else {
          this.$message.error({ offset: 40, title: '提醒', message });
        }
      });
      // 先获取工单基本信息，，然后判断获取草稿或初始化  文件信息
      this.getFileList();
    },
    // 获取  下一审批人列表
    getNextUserOption() {
      getNextUserOption({
        nodeId: this.formBase.nodeId,
        templateId: this.formBase.processTemplateId,
        bool: 'Y'
      }).then(res => {
        const { data, status } = res.data;
        const keys = Object.keys(data || {});
        if (status === 200 && keys.length) {
          this.nextStepObj = data;
        }
      });
    },
    queryFormItemPermissions() {
      queryFormItemPermissions({
        nodeId: this.formBase.nodeId,
        formCategoryIdsJoin: this.formCategoryId,
        processTemplateId: this.formBase.processTemplateId
      }).then(res => {
        const { data, status } = res.data;
        const keys = Object.keys(data || {});
        if (status === 200 && keys.length) {
          // 权限标识 R为只读 E为可编辑 H为隐藏
          this.formItemPermissions = data[keys[0]] || [];
          this.getApplyFormWithPermissions(this.applyForm, this.formItemPermissions)
        }
      });
    },
    getApplyFormWithPermissions(applyForm, formItemPermissions) {
      const keyPointsForVerification = [];
      const filledInByApprover = [];
      // 权限标识 R为只读 E为可编辑 H为隐藏
      const permissions = formItemPermissions.filter(item => item.authorityFlag	 === 'E');
      permissions.forEach(perm => {
        keyPointsForVerification.push(...applyForm.keyPointsForVerification.filter(item => item.id.toString() === perm.formItemId.toString()));
        filledInByApprover.push(...applyForm.filledInByApprover.filter(item => item.id.toString() === perm.formItemId.toString()));
      })
      this.applyFormWithPermissions = {
        keyPointsForVerification,
        filledInByApprover,
      }
      this.$refs.refExamine.list = keyPointsForVerification;
      this.examineIsShow = !!keyPointsForVerification.length
    },
    previewFile(url) {
      this.previewDialog = true;
      this.previewfileUrl = url;
    },
    async getFileList() {
      this.list = [];
      if (this.inDraft) {
        await getApprovalDraft({ formId: this.formId }).then(res => {
          const { data, status, message } = res.data;
          if (status === 200) {
            this.files = data.files;
            this.increasedIds = data.increasedIds;
          } else {
            this.$message.error({ offset: 40, title: '提醒', message });
          }
        });
      } else {
        await getUploadedFilesList({ formId: this.formId }).then(res => {
          const { data, status, message } = res.data;
          if (status === 200) {
            this.getFiles(data);
          } else {
            this.$message.error({ offset: 40, title: '提醒', message });
          }
        });
      }
      this.loading = false;
      if (this.files.length) {
        this.$nextTick(() => {
          this.$refs.filePreview.init();
          this.changeFile(0);
        });
      }
    },
    getFiles(data, zipName) {
      data.forEach(file => {
        if (file.child) {
          const suffer = file.fileName.split('.')[file.fileName.split('.').length - 1];
          this.getFiles(file.child, suffer === 'zip' ? file.fileName : zipName);
        } else {
          file.id = file.key;
          file.zip = zipName;
          this.files.push(file);
        }
      });
    },
    showSubmit() {
      this.examineShow = false;
      this.$refs.submitReview.submitReviewDialog = true;
      this.getComments();
      this.$refs.submitReview.increasedIds = this.increasedIds;
      this.$refs.submitReview.examineList = this.$refs.refExamine.list;
      this.$refs.submitReview.submission = JSON.parse(
        JSON.stringify(
          this.comments.map(comment => {
            comment.opinion = false;
            return comment;
          })
        )
      );
      // console.log({
      //   files: this.files,
      //   increasedIds: this.increasedIds,
      //   comments: this.comments
      // });
    },
    // 添加关键词
    addWord(word) {
      this.$refs.addReview.init(word);
      window.getSelection().removeAllRanges();
    },
    // 切换审批文件
    async changeFile(i) {
      if (this.activeIndex === i) {
        return;
      }
      this.activeWordType = 0;
      this.fileloading = true;
      this.showOcr = true;
      this.lineRemove();
      if (this.files?.[this.activeIndex]?.ocr) {
        this.files[this.activeIndex] = {
          ...this.approval,
          recommends: this.$refs.editorial.recommends
        };
      }
      this.activeIndex = i;
      // 更新对应文件的ocr和推荐意见
      const temp = this.files[i];
      const suffer = ['jpeg', 'jpg', 'png', 'pdf'].includes(temp?.fileName?.split('.')[temp?.fileName?.split('.').length-1]);
      if (!temp.ocr && !temp.recommends && suffer) {
        temp.ocr = await this.getOcr(temp);
        await getOcrExamineShow({
          formId: this.formId,
          fileId: temp.id,
          processInstanceId: this.formBase.processInstanceId
        })
          .then(res => {
            const { data, status } = res.data;
            if (status === 200) {
              temp.recommends = data.recommends || [];
            }
          })
          .catch(() => {
            temp.recommends = [];
          });
      }
      this.approval = temp;
      this.fileloading = false;
    },
    async getOcr(temp) {
      let ocr = [];
      await getOCRAnalysisResults({
        fileId: temp.id
      }).then(res => {
        const { data, status } = res.data;
        if (status === 200) {
          for (let key in data.results) {
            ocr.push(...data.results[key]);
          }
        }
      });
      return ocr;
    },
    changeOcrView() {
      this.lineRemove();
      this.showOcr = !this.showOcr;
    },
    // 展示连线
    showLine(wordItem) {
      const onlyHide = wordItem?.ocrWordId === this.lineWordItem.ocrWordId;
      if (onlyHide) {
        this.lineRemove();
        return;
      }
      this.lineRemoveOnly();
      this.lineWordItem = wordItem || this.lineWordItem;
      this.$nextTick(() => {
        this.drawLine();
      });
    },
    drawLine() {
      const start = document.querySelector('#' + this.lineWordItem.ocrWordId);
      const ends = [
        ...document.querySelectorAll(
          `[word="${this.lineWordItem.word + this.lineWordItem.wordType}"] .list-item`
        )
      ];
      const imgLight = document.querySelector('#imgLight');
      imgLight && ends.push(imgLight);
      if (start) {
        ends.forEach((item, index) => {
          // 动画参数
          const animOptions = {
            duration: 2000,
            timing: 'linear'
          };
          this.word_lines[index] = new LeaderLine(start, item, {
            color: '#EB5D78',
            size: 1
            // endSocket: 'auto'
          });
          const showEffectName = 'draw';
          this.word_lines[index].show(showEffectName, animOptions);
        });
        document.querySelector('.ocr-txt .results').addEventListener('scroll', () => {
          this.linePosition();
        });
        document.querySelector('.editorial .results').addEventListener('scroll', () => {
          this.linePosition();
        });
      }
    },
    linePosition() {
      this.word_lines.forEach(line => {
        line.position();
      });
    },
    // 仅移除连线不做其他操作
    lineRemoveOnly() {
      (this.word_lines || []).forEach(item => {
        item.remove();
      });
      this.word_lines = [];
    },
    // 移除连线
    lineRemove(activeWordType) {
      this.lineRemoveOnly();
      this.lineWordItem = {};
      if (activeWordType !== undefined) {
        this.activeWordType = activeWordType;
      }
    },
    // 切换意见编辑
    changeEditorialType(val) {
      this.lineRemove();
      // 整合编辑意见
      if (val === 2) {
        this.files[this.activeIndex] = this.approval;
        this.getComments(this.files[this.activeIndex]);
        this.$refs.editorial.collection = this.comments;
      }
    },
    getComments() {
      const arr = [];
      this.files.forEach(file => {
        // 存在推荐意见
        file?.recommends?.map(recommend => {
          // 存在选择意见
          if (recommend.selected) {
            const selected = recommend.list.filter(a => a.id === recommend.selected);
            arr.push({
              id: selected?.[0].id,
              str: selected?.[0].str,
              files: [file.id],
              words: [recommend.id]
            });
          }
        }),
          // 未关联word的 意见
          file?.comments && arr.push(...file?.comments);
      });
      // 去重
      const setArr = [];
      arr.forEach(comment => {
        if (comment) {
          const exist = setArr.filter(a => a.str === comment.str);
          if (exist.length === 0) {
            setArr.push(comment);
          } else if (exist.length) {
            exist[0].files = [...new Set([...exist[0].files, ...comment.files])];
            exist[0].words = [...new Set([...exist[0].words, ...comment.words])];
            exist[0].id = exist[0].id || comment.id;
          }
        }
      });
      this.comments = setArr;
    },
    // 编辑意见后,同步更新  文件的推荐意见状态
    upDateComments(type, item, newVal) {
      let filterFiles = this.files.filter(file => item.files.includes(file.id));
      switch (type) {
        // 新增意见,至少找到一个 关联文件,将新增意见插入即可
        case 'add':
          if (!filterFiles[0]?.comments) {
            filterFiles[0].comments = [];
          }
          filterFiles?.[0]?.comments && filterFiles[0].comments.push(item);
          break;
        // 修改类型为修改意见字符串,找到意见关联的所有文件,  如果意见存在关联 关键词,修改对应词,对应意见的str,  如果 comments下包含,则修改 该意见
        case 'editStr':
        // 删除意见,找到意见关联的所有文件, 如果意见存在关联 关键词,则取消关键词 选择 的 意见,如果 comments下包含,则移除 该意见
        case 'remove':
          filterFiles.map(file => {
            const matchWord = file?.recommends?.filter(word => item.words.includes(word.id));
            matchWord &&
              matchWord.forEach(word => {
                if (type === 'remove') {
                  word.selected = null;
                } else if (type === 'editStr') {
                  const recommend = word.list.filter(a => a.id === word.selected);
                  recommend[0].str = newVal;
                }
              });
            file?.comments &&
              file?.comments.map((comment, i) => {
                if (item.str === comment.str) {
                  if (type === 'remove') {
                    file.comments.splice(i, 1);
                  } else if (type === 'editStr') {
                    file.comments[i] = newVal;
                  }
                }
              });
          });
          // 意见存在于文件其他的  comments里,不在filterFiles
          this.files.forEach(file => {
            file?.comments?.forEach((comment, i) => {
              if (comment.str === item.str) {
                if (type === 'remove') {
                  file.comments.splice(i, 1);
                } else if (type === 'editStr') {
                  file.comments[i].str = newVal;
                }
              }
            });
          });
          break;
        // 修改类型为修改关联文件: 查找 意见对应关联文件与 更新的关联文件的新增或移除的 文件id,进入文件修改 对应的selectd,  comment内的内容,可不用处理
        case 'editFiles':
          // 移除的 关联文件
          const removeIds = item.files.filter(id => !newVal.includes(id));
          removeIds.map(id => {
            const removeFile = this.files.filter(file => file.id === id)?.[0];
            const matchWord =
              removeFile?.recommends?.filter(word => item.words.includes(word.id)) || [];
            if (matchWord.length) {
              matchWord.forEach(word => {
                word.selected = null;
              });
            } else {
              removeFile?.comments &&
                removeFile?.comments.map((comment, i) => {
                  if (item.str === comment.str) {
                    if (!filterFiles[0]?.comments) {
                      filterFiles[0].comments = [];
                    }
                    filterFiles?.[0]?.comments &&
                      filterFiles[0].comments.push({
                        ...item,
                        files: newVal
                      });
                    removeFile.comments.splice(i, 1);
                  }
                });
            }
            // 更新已存在的意见里的 ids
            const existIds = item.files.filter(id => newVal.includes(id));
            existIds.map(id => {
              const addFile = this.files.filter(file => file.id === id)?.[0];
              const matchComments = addFile?.comments?.filter(comment => comment.str === item.str);
              if (matchComments) {
                matchComments.forEach(comment => {
                  comment.files = newVal;
                });
              }
            });
          });
          // 新增关联的文件
          const addIds = newVal.filter(id => !item.files.includes(id));
          addIds.map(id => {
            const addFile = this.files.filter(file => file.id === id)?.[0];
            const matchWord = addFile?.recommends?.filter(word => item.words.includes(word.id));
            if (matchWord && matchWord?.length !== 0) {
              matchWord.forEach(word => {
                word.selected = word.list.filter(a => a.str === item.str)?.[0]?.id || null;
              });
            } else {
              const newItem = {
                ...item,
                files: [id]
              };
              addFile.comments ? addFile.comments.push(newItem) : (addFile.comments = [newItem]);
            }
          });
          break;
        default:
          break;
      }
    },
    // 新增的关键词和新增的话术
    addRecommend(recommend, wordId, strId) {
      this.increasedIds.words.push(wordId);
      this.increasedIds.strIds.push(strId);
      this.approval.recommends.unshift(recommend);
      this.$refs.ocrTxt.getInitContent(this.approval);
      this.$refs.editorial.init(this.approval);
      this.$nextTick(() => {
        this.$refs.editorial.$refs.results.scrollTop = 0;
      });
    },
    // 保存当前审批结果
    save() {
      this.getComments();
      approvalStorageDraft({
        formId: this.formId,
        ocrExamineShowDto: {
          files: this.files,
          increasedIds: this.increasedIds,
          comments: {}
        }
      }).then(res => {
        const { data, status, message } = res.data;
        if (status === 200) {
          // 返回审批列表
          this.$router.push({
            name: 'approvalcenter'
          });
        } else {
          this.$message.error({ offset: 40, title: '提醒', message });
        }
      });
    },
    // 返回
    goBack(backNow) {
      this.getComments();
      if (this.comments.length && backNow !== true) {
        this.$refs.confirmation.dialogVisible = true;
      } else {
        this.$router.go(-1);
      }
    },
    handleExamine() {
      this.examineShow = !this.examineShow;
    },
    // 驳回方法
    submit({reason, txt, prevUser}) {
      const user = JSON.parse(window.localStorage.getItem('user_name'))
      const data = {
        comments: `${reason}${txt.trim() ? '-' + txt : ''}`,
        currentUserInfo: {
          id: user.id,
          name: user.fullname
        },
        processInstanceId: this.formBase.processInstanceId,
        rollbackId: prevUser,
        // || this.formBase.rollbackId
        signInfo: this.formBase.signInfo,
        nodeId: this.formBase.nodeId,
        taskId: this.formBase.taskId,
        templateId: this.formBase.templateId
      }
      rollback(data).then((res) => {
        const { status, msg } = res.data;
        if (status === 200) {
          this.$message.success('操作成功！');
          this.$router.go(-1)
        } else {
          this.$message.error({ offset: 40, message: msg });
        }
      })
    },
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
