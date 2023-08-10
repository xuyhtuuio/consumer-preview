<template>
  <div class="container" v-loading="loading">
    <div class="tools" >
      <div ref="tools">
      <div v-for="(item, index) in tools" :key="index" :arrow-offset="-30" :ref="`popover-${item.toolSign}`">
        <span :ref='`sideBar-popover-` + item.toolSign'
          :class="crtTools == item.toolSign ? 'active-tools el-popover__reference' : 'el-popover__reference'"
          @click="changeTools(item)">
          <i :class="['iconfont', 'sidebar-icon', item.icon]"></i>
        </span>
      </div>
      <el-popover v-if="showPopper" ref="sidebar-popover" :reference='reference' placement="right" trigger="click"
        popper-class="sidebar-popper" @after-leave="hiddenPopover">
        <component :is="crtToolComponent" :sidebarParam="sidebarParam" @previewFile="previewFile" :personInfo="personInfo"></component>
      </el-popover>
    </div>
  </div>
    <div class="content">
      <div class="content-header">
        <span class="content-title">
          <i class="iconfont icon-shenpiyemiantubiao" v-if="tools?.[0]?.sidebarParam?.urgent === 1"></i>{{ projectName
          }}</span>
        <span class="content-btns">
          <el-button @click="goBack"><i class="iconfont icon-fanhui1"></i>返回</el-button>
          <el-button type="tuihui" @click="reject"><i class="iconfont icon-tuihui1"></i>退回/驳回</el-button>
          <el-button @click="save"><i class="iconfont icon-baocun"></i>保存</el-button>
          <el-button type="primary" @click="changeOcrView"
            v-if="specialFileType.includes(approval?.fileName?.split('.')[1])"><i class="iconfont icon-ocr"></i>{{ showOcr
              ? '关闭' :
              '打开' }}智能审批</el-button>
          <!-- <el-button type="primary"><i class="iconfont icon-heduiyaodian"></i>要点核对</el-button> -->
          <el-button type="primary" @click="showSubmit"><i class="iconfont icon-tijiao"></i>提交</el-button>
        </span>
      </div>
      <div class="content-cont" v-loading="fileloading">
        <file-preview ref="filePreview" :files="files" :activeIndex="activeIndex" @changeFile="changeFile"
          :lineWordItem="lineWordItem" @linePosition="linePosition" :approval="approval"></file-preview>
        <orcTxt ref="ocrTxt" :approval="approval" @addWord="addWord"
          v-if="specialFileType.includes(approval?.fileName?.split('.')[1]) && showOcr" @showLine="showLine"
          :lineWordItem="lineWordItem">
        </orcTxt>
        <editorial ref="editorial" :approval="approval" :files="files" :formId="formId" @linePosition="linePosition"
          :lineWordItem="lineWordItem" @upDateComments="upDateComments" @drawLine="drawLine"
          @changeEditorialType="changeEditorialType">
        </editorial>
      </div>
    </div>
    <add-review ref="addReview" @addRecommend="addRecommend"></add-review>
    <submit-review ref="submitReview" :formId="formId" :formBase="formBase"></submit-review>
    <reject-dialog ref="rejectDialog" :formBase="formBase"></reject-dialog>
    <el-dialog :visible.sync="previewDialog" width="800px" custom-class="preview-dialog">
      <applyFormFilePreview :url="previewfileUrl"></applyFormFilePreview>
    </el-dialog>
    <secondary-confirmation :option="saveOption" ref="confirmation" @handleClose="goBack"
      @handleConfirm="save"></secondary-confirmation>
  </div>
</template>

<script>
import LeaderLine from '@/utils/leader-line';
import filePreview from './components/file-preview'
import orcTxt from './components/ocr-txt'
import editorial from './components/editorial'
import addReview from './dialogs/add-review'
import submitReview from './dialogs/submit-review'
import rejectDialog from './dialogs/reject-dialog';
import applyForm from './sidebar/apply-form'
import approvalRecordDetail from './sidebar/approval-record-detail'
import similarCase from './sidebar/similar-case'
import approvedOpinion from './sidebar/approved-opinion'
import aiKnowledgeBase from './sidebar/ai-knowledge-base'
import applyFormFilePreview from '@/components/filePreview'
import secondaryConfirmation from "@/components/common/secondaryConfirmation"
import {
  getUploadedFilesList,
  getOCRAnalysisResults,
  getOcrExamineShow,
  approvalStorageDraft,
  getApprovalDraft,

} from "@/api/aiApproval";
import {
  getApplyForm
} from "@/api/front";
export default {
  name: 'aiApproval',
  components: { applyFormFilePreview, filePreview, orcTxt, editorial, addReview, submitReview, applyForm, similarCase, approvalRecordDetail, approvedOpinion, aiKnowledgeBase, secondaryConfirmation, rejectDialog },
  data() {
    return {
      formBase: {},
      projectName: '',
      previewDialog: false,
      previewfileUrl: '',
      loading: false,
      fileloading: false,
      specialFileType: ['jpeg', 'jpg', 'png', 'pdf'],
      files: [], // 文件相关信息
      comments: [], // 编辑意见
      crtTools: '',//当前侧边工具栏激活项
      tools: [
        {
          component: 'applyForm',
          toolSign: 'apply-form',
          icon: 'icon-shenqingdan',
          sidebarParam: {}, //侧边工具栏激活项 props
        },
        {
          component: 'approvalRecordDetail',
          toolSign: 'approval-record',
          icon: 'icon-jilumingxi',
          sidebarParam: {}, //侧边工具栏激活项 props
        },
        {
          component: 'similarCase',
          toolSign: 'similar-case',
          icon: 'icon-xiangsianli',
          sidebarParam: {}, //侧边工具栏激活项 props
        },
        // {
        //   component: 'approvedOpinion',
        //   toolSign: 'approved-opinion',
        //   icon: 'icon-yijianshu',
        //   sidebarParam: {}, //侧边工具栏激活项 props
        // },
        {
          component: 'aiKnowledgeBase',
          toolSign: 'ai',
          icon: 'icon-ciku',
          sidebarParam: {}, //侧边工具栏激活项 props
        }
      ],
      sidebarParam: {},
      crtToolComponent: '',
      showPopper: false,
      reference: {},
      personInfo:{},
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
        confirmBtn: '保存',
      }
    }
  },

  mounted() {
    document.addEventListener('mouseup', (e) => {
      const toolsRef =this.$refs['tools']
      if(toolsRef){
        if (!toolsRef.contains(e.target)) {
          this.showPopper = false;
        }
      }
    });
    if (!this.$route.params.item) {
      this.$router.go(-1)
      return
    }
    const { item } = this.$route.params
    this.formId = item.taskNumber;
    this.inDraft = item.draftFlag === 1;
    this.formCategoryId = item.formManagementId
    this.loading = true;
    this.init(item)
    this.formBase = item;
  },
  methods: {
    doToggle() {
      this.showPopper = !this.showPopper;
    },
    reject() {
      this.$refs.rejectDialog.init()
    },
    // 获取工单基本信息
    init(item) {
      getApplyForm({
        formCategoryId: this.formCategoryId,
        formId: this.formId,
      }).then(res => {
        const { data, status, message } = res.data;
        if (status === 200) {
          this.sidebarParam = { data, formId: item.taskNumber, originatorId: item.originator.id };
          this.projectName = data.basicInformation.filter(item => item.title === '项目名称')?.[0]?.value
        } else {
          this.$message.error({ offset: 40, title: "提醒", message });
        }
      });
      // 先获取工单基本信息，，然后判断获取草稿或初始化  文件信息
      this.getFileList()
    },
    previewFile(url) {
      this.previewDialog = true
      console.log(url)
      this.previewfileUrl = url
    },
    async getFileList() {
      this.list = [];
      if (this.inDraft) {
        await getApprovalDraft({ formId: this.formId })
          .then((res) => {
            const { data, status, message } = res.data;
            if (status === 200) {
              this.files = data.files;
              this.increasedIds = data.increasedIds;
              this.changeFile(0)
            } else {
              this.$message.error({ offset: 40, title: "提醒", message });
            }
          })
      } else {
        await getUploadedFilesList({ formId: this.formId })
          .then((res) => {
            const { data, status, message } = res.data;
            if (status === 200) {
              this.getFiles(data)
              this.$nextTick(() => {
                this.$refs.filePreview.init();
                this.changeFile(0)
              })
            } else {
              this.$message.error({ offset: 40, title: "提醒", message });
            }
          })
      }
      this.loading = false;
    },
    getFiles(data, zipName) {
      data.forEach(file => {
        if (file.child) {
          const suffer = file.fileName.split('.')[file.fileName.split('.').length - 1]
          this.getFiles(file.child, suffer === 'zip' ? file.fileName : zipName);
        } else {
          file.id = file.key;
          file.zip = zipName;
          this.files.push(file)
        }
      })
    },
    showSubmit() {
      this.$refs.submitReview.submitReviewDialog = true;
      this.getComments();
      this.$refs.submitReview.increasedIds = this.increasedIds;
      this.$refs.submitReview.submission = JSON.parse(JSON.stringify(
        this.comments.map(comment => {
          comment.opinion = false
          return comment;
        })
      ))
      console.log({
        files: this.files,
        increasedIds: this.increasedIds,
        comments: this.comments
      })
    },
    // 添加关键词
    addWord(word) {
      this.$refs.addReview.init(word)
      window.getSelection().removeAllRanges();
    },
    changeTools(item) {
      if (this.crtTools === item.toolSign && this.showPopper) return
      this.showPopper = false
      this.crtTools = item.toolSign
      this.crtToolComponent = item.component
      let params = {}
      const { item: param_item } = this.$route.params
      switch (item.component) {
        case 'applyForm':
          params = {
            formId: param_item.taskNumber,
            originatorId: param_item.originatorId,
    
          }
          break;
        case 'approvalRecordDetail':
          params = {
            formId: param_item.taskNumber,
            originatorId: param_item.originatorId,
            processInstanceId:param_item.processInstanceId
          }
          break;
      }
      this.reference = this.$refs['sideBar-popover-' + item.toolSign][0].$el
      this.sidebarParam = params
      this.personInfo=param_item.initiator
      console.log('this.personInfo',this.personInfo,this.sidebarParam)
      this.$nextTick(() => {
        this.showPopper = true
        this.$nextTick(() => {
          // 此时才能获取refs引用
          this.$refs['sidebar-popover'].doShow()
        })
      })
    },
    hiddenPopover() {
      this.crtTools = ''
    },
    // 初始化文件
    initFile() {
      this.$refs['addFileSource'].init()
    },
    // 切换审批文件
    async changeFile(i) {
      if (this.activeIndex === i) {
        return;
      }
      this.fileloading = true;
      this.showOcr = true;
      this.lineRemove()
      if (this.files?.[this.activeIndex]?.ocr) {
        this.files[this.activeIndex] = {
          ...this.approval,
          recommends: this.$refs.editorial.recommends
        };
      }
      this.activeIndex = i;
      // 更新对应文件的ocr和推荐意见
      const temp = this.files[i];
      const suffer = ['jpeg', 'jpg', 'png', 'pdf'].includes(temp?.fileName?.split('.')[1])
      if (!temp.ocr && !temp.recommends && suffer) {
        await this.getOcr(temp)
        await getOcrExamineShow({
          formId: this.formId,
          fileId: temp.id
        })
          .then((res) => {
            const { data, status } = res.data;
            if (status === 200) {
              temp.recommends = data.recommends
            }
          })
          .catch(() => {
            temp.recommends = []
          })
      }
      this.approval = temp;
      this.fileloading = false;
    },
    getOcr(temp) {
      getOCRAnalysisResults({
        fileId: temp.id
      })
        .then((res) => {
          const { data, status } = res.data;
          if (status === 200) {
            let ocr = [];
            for (let key in data.results) {
              ocr.push(...data.results[key])
            }
            temp.ocr = ocr;
          }
        })
        .catch(() => {
          temp.ocr = []
        })
    },
    changeOcrView() {
      this.lineRemove()
      this.showOcr = !this.showOcr;
    },
    // 展示连线
    showLine(wordItem) {
      const onlyHide = wordItem.ocrWordId === this.lineWordItem.ocrWordId;
      this.lineRemove();
      if (onlyHide) {
        return;
      }
      this.lineWordItem = wordItem;
      this.$nextTick(() => {
        this.drawLine()
      })
    },
    drawLine() {
      const start = document.querySelector('#' + this.lineWordItem.ocrWordId)
      const ends = [...document.querySelectorAll(`[word="${this.lineWordItem.word}"] .list-item`)]
      const imgLight = document.querySelector('#imgLight');
      imgLight && ends.push(imgLight)
      if (start) {
        ends.forEach((item, index) => {
          // 动画参数
          const animOptions = {
            duration: 2000,
            timing: 'linear',
          };
          this.word_lines[index] = new LeaderLine(start, item, {
            color: '#EB5D78',
            size: 1,
            // endSocket: 'auto'
          });
          const showEffectName = 'draw';
          this.word_lines[index].show(showEffectName, animOptions);
        });
        document.querySelector('.ocr-txt .results').addEventListener('scroll', () => {
          this.linePosition()
        });
        document.querySelector('.editorial .results').addEventListener('scroll', () => {
          this.linePosition()
        });
      }
    },
    linePosition() {
      this.word_lines.forEach(line => {
        line.position()
      })
    },
    // 移除连线
    lineRemove() {
      (this.word_lines || []).forEach((item) => {
        item.remove();
      });
      this.lineWordItem = {}
      this.word_lines = [];
    },
    // 切换意见编辑
    changeEditorialType(val) {
      this.lineRemove();
      // 整合编辑意见
      if (val === 2) {
        this.files[this.activeIndex] = this.approval;
        this.getComments(this.files[this.activeIndex])
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
              words: [recommend.id],
            })
          }
        }),
          // 未关联word的 意见
          file?.comments && arr.push(...file?.comments)
      });
      // 去重
      const setArr = [];
      arr.forEach(comment => {
        if (comment) {
          const exist = setArr.filter(a => a.str === comment.str);
          if (exist.length === 0) {
            setArr.push(comment)
          } else if (exist.length) {
            exist[0].files = [...new Set([...exist[0].files, ...comment.files])];
            exist[0].words = [...new Set([...exist[0].words, ...comment.words])];
            exist[0].id = exist[0].id || comment.id;
          }
        }
      })
      this.comments = setArr;
      // console.log('comments', this.comments)
    },
    // 编辑意见后,同步更新  文件的推荐意见状态
    upDateComments(type, item, newVal) {
      let filterFiles = this.files.filter(file => item.files.includes(file.id));
      switch (type) {
        // 新增意见,至少找到一个 关联文件,将新增意见插入即可
        case 'add':
          if (!filterFiles[0]?.comments) {
            filterFiles[0].comments = []
          }
          filterFiles?.[0]?.comments && filterFiles[0].comments.push(item)
          break;
        // 修改类型为修改意见字符串,找到意见关联的所有文件,  如果意见存在关联 关键词,修改对应词,对应意见的str,  如果 comments下包含,则修改 该意见
        case 'editStr':
        // 删除意见,找到意见关联的所有文件, 如果意见存在关联 关键词,则取消关键词 选择 的 意见,如果 comments下包含,则移除 该意见
        case 'remove':
          filterFiles.map(file => {
            const matchWord = file?.recommends?.filter(word => item.words.includes(word.id));
            matchWord && matchWord.forEach(word => {
              if (type === 'remove') {
                word.selected = null;
              } else if (type === 'editStr') {
                const recommend = word.list.filter(a => a.id === word.selected);
                recommend[0].str = newVal;
              }
            });
            file?.comments && file?.comments.map((comment, i) => {
              if (item.str === comment.str) {
                if (type === 'remove') {
                  file.comments.splice(i, 1)
                } else if (type === 'editStr') {
                  file.comments[i] = newVal
                }
              }
            });
          });
          // 意见存在于文件其他的  comments里,不在filterFiles
          this.files.forEach(file => {
            file?.comments?.forEach((comment, i) => {
              if (comment.str === item.str) {
                if (type === 'remove') {
                  file.comments.splice(i, 1)
                } else if (type === 'editStr') {
                  file.comments[i].str = newVal;
                }
              }
            })
          })
          break;
        // 修改类型为修改关联文件: 查找 意见对应关联文件与 更新的关联文件的新增或移除的 文件id,进入文件修改 对应的selectd,  comment内的内容,可不用处理
        case 'editFiles':
          // 移除的 关联文件
          const removeIds = item.files.filter(id => !newVal.includes(id))
          removeIds.map(id => {
            const removeFile = this.files.filter(file => file.id === id)?.[0];
            const matchWord = removeFile?.recommends?.filter(word => item.words.includes(word.id)) || [];
            if (matchWord.length) {
              matchWord.forEach(word => {
                word.selected = null;
              });
            } else {
              removeFile?.comments && removeFile?.comments.map((comment, i) => {
                if (item.str === comment.str) {
                  if (!filterFiles[0]?.comments) {
                    filterFiles[0].comments = []
                  }
                  filterFiles?.[0]?.comments && filterFiles[0].comments.push({
                    ...item,
                    files: newVal
                  })
                  removeFile.comments.splice(i, 1)
                }
              });
            }
            // 更新已存在的意见里的 ids
            const existIds = item.files.filter(id => newVal.includes(id))
            existIds.map(id => {
              const addFile = this.files.filter(file => file.id === id)?.[0];
              const matchComments = addFile?.comments?.filter(comment => comment.str === item.str);
              if (matchComments) {
                matchComments.forEach(comment => {
                  comment.files = newVal
                })
              }
            })
          })
          // 新增关联的文件
          const addIds = newVal.filter(id => !item.files.includes(id))
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
              }
              addFile.comments ? addFile.comments.push(newItem) : addFile.comments = [newItem]
            }
          })
          break;
        default:
          break;
      }
      // console.log('files', this.files)
    },
    // 新增的关键词和新增的话术
    addRecommend(recommend, wordId, strId) {
      this.increasedIds.words.push(wordId)
      this.increasedIds.strIds.push(strId)
      this.approval.recommends.unshift(recommend);
      this.$refs.ocrTxt.getInitContent(this.approval)
      this.$refs.editorial.init(this.approval)
      this.$nextTick(() => {
        this.$refs.editorial.$refs.results.scrollTop = 0;
      })
    },
    // 保存当前审批结果
    save() {
      this.getComments()
      approvalStorageDraft({
        formId: this.formId,
        ocrExamineShowDto: {
          files: this.files,
          increasedIds: this.increasedIds,
          comments: {}
        }
      })
        .then((res) => {
          const { data, status, message } = res.data;
          if (status === 200) {
            // 返回审批列表
            this.$router.push({
              name: 'approvalcenter'
            })
          } else {
            this.$message.error({ offset: 40, title: "提醒", message });
          }
        })
    },
    // 返回
    goBack(backNow) {
      this.getComments()
      if (this.comments.length && backNow !== true) {
        this.$refs.confirmation.dialogVisible = true;
      } else {
        this.$router.go(-1);
      }
    },
  },
  beforeDestroy() {
    this.lineRemove()
  }
}
</script>

<style lang="less" scoped>
.container {
  display: flex;

  // height: 100%;
  .tools {
    background: #ffffff;
    width: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 60px;

    .iconfont {
      font-size: 22px;
      color: #506197;

    }

    span {
      display: inline-block;
      cursor: pointer;
      margin-bottom: 24px;
      padding: 6px !important;
    }

    span:hover {
      background: #F2F3F5;
      border-radius: 4px;
      padding: 6px;



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
    color: #EB5757;
  }
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
  background: #FFF;
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
.preview-dialog{
  .el-dialog__body{
    height: 76vh;
  }
}
</style>
