import LeaderLine from '@/utils/leader-line';
import {
  getUploadedFilesList,
  getOCRAnalysisResults,
  getOcrExamineShow,
  approvalStorageDraft,
  getApprovalDraft,
  getOpinionApprovalLetter,
  queryFormItemPermissions,
  getNextUserOption,
  rollback,
  getNodeHandleUser,
  updateRuleCode,
  getPdfPage
} from '@/api/aiApproval';
import { downloadAllFiles } from '@/api/applyCenter'
import { getApplyForm } from '@/api/front';
import { add } from '@/api/admin-label';

export default {
  methods: {
    saveFile() {
      const params = {
        formId: this.formId,
        key: this.approval.id
      }
      this.$message.info('下载中，请稍等！')
      downloadAllFiles(params).then((res) => {
        const disposition = res.headers['content-disposition']
        const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf;charset=utf-8' }))
        const link = document.createElement('a');
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', decodeURI(disposition.replace('attachment;filename=', '')))
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    turnTo() {
      this.$refs.turnDialog.turnDialog = true;
    },
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
          this.$refs.sidebar.tools[3].show = (data.permissions === 'passAllow' && data.list.length !== 0)
          this.$forceUpdate()
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
        } else {
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
        processInstanceId: this.formBase.processInstanceId
        // bool: 'Y'
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
      const permissions = formItemPermissions.filter(item => item?.authorityFlag === 'E');
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
    },
    // 鼠标选中 添加新批注
    addWord(obj, nodes) {
      const popover = this.$refs.postilPopover.$refs.popper
      popover.classList.remove('positil-popover-left')
      this.changeRel(false)
      this.popoverShow = true
      this.domInfo = obj
      this.keywordsInfo.content = obj.string
      this.comments_nodes = Array.from(nodes)
    },
    addBg(nodes) {
      const popover = this.$refs.postilPopover.$refs.popper
      popover.classList.remove('positil-popover-left')
      nodes.forEach((node) => {
        node.classList.add('commentNode')
      })
    },
    hasBg(i, reValue) {
      let isHas = false
      const fileType = this.files[this.activeIndex].type
      // 遍历意见 寻找当前文件
      if (fileType !== 'pdf') {
        this.comments.map((comment) => {
          if (comment?.files.includes(this.files[this.activeIndex].id)) {
            // 遍历文件与批注的关系，判断是否包含 第 i 条
            comment?.filesWithBg.map((fwb) => {
              if (fwb.fileId === this.files?.[this.activeIndex]?.id) {
                isHas = fwb.fileBgs.includes(i)
                if (isHas) {
                  reValue(isHas)
                }
              }
            })
          }
        })
      } else {
        this.comments.map((comment) => {
          if (comment?.files.includes(this.files[this.activeIndex].id)) {
            // 遍历文件与批注的关系，判断是否包含 第 i 条
            comment?.filesWithBg.map((fwb) => {
              if (fwb.fileId === this.files[this.activeIndex].child[this.activePdfIndex].id) {
                isHas = fwb.fileBgs.includes(i)
                if (isHas) {
                  reValue(isHas)
                }
              }
            })
          }
        })
      }
      reValue(isHas)
    },
    beforeAddComment() {
      let preComment = {}
      if (this.isEdit) {
        preComment = this.findComment(this.domInfo?.position)
        this.postil.textarea = preComment.str
      }
      this.preComment = preComment
    },
    async addKeyWord() {
      const res = await add({
        keywordContent: this.keywordsInfo.content,
        type: this.keywordsInfo.type
      });
      // data
      const { success, msg } = res.data;
      if (success) {
        return success
      } else {
        this.$message.error(msg)
      }
    },
    addCommentWithPosition() {
      this.beforeAddComment()
      const timestamp = this.preComment.id || new Date().getTime()
      let files = []
      const words = this.preComment.words || []
      let filesWithComment = []
      let filesWithBg = []
      if (this.files?.[this.activeIndex].type === 'pdf') {
        files = this.preComment.files || [this.files?.[this.activeIndex].id]
        filesWithComment = this.preComment.filesWithComment || [this.files?.[this.activeIndex].id]
        if (this.preComment?.filesWithBg) {
          this.preComment.filesWithBg.map((fwb) => {
            if (fwb.fileId === this.files?.[this.activeIndex]?.child[this.activePdfIndex]?.id) {
              fwb.fileBgs = [...fwb.fileBgs, ...this.domInfo.domIndexs]
            }
          })
        }
        filesWithBg = [{
          fileId: this.files?.[this.activeIndex]?.child[this.activePdfIndex]?.id,
          fileBgs: this.domInfo.domIndexs
        }]
      } else {
        if (this.preComment?.filesWithBg) {
          this.preComment.filesWithBg.map((fwb) => {
            if (fwb.fileId === this.files?.[this.activeIndex]?.id) {
              fwb.fileBgs = [...fwb.fileBgs, ...this.domInfo.domIndexs]
            }
          })
        }
        filesWithBg = [{
          fileId: this.files?.[this.activeIndex]?.id,
          fileBgs: this.domInfo.domIndexs
        }]
        files = this.preComment.files || [this.files?.[this.activeIndex]?.id]
        filesWithComment = this.preComment.filesWithComment || [this.files?.[this.activeIndex]?.id]
      }
      const newComment = {
        id: timestamp,
        str: this.postil.textarea,
        files: [...files],
        filesWithComment: [...filesWithComment],
        words,
        icons: [this.domInfo?.ocrId],
        position: [this.domInfo?.position],
        selectText: this.domInfo?.string,
        filesWithBg: this.preComment?.filesWithBg || filesWithBg
      }
      if (!newComment.str) {
        return;
      }
      let validGoOn = false
      if (this.postil.isKeyWord === '1') {
        this.$refs.keywordsFrom.validate((valid) => {
          if (valid) {
            validGoOn = true
            const status = this.addKeyWord()
            if (!status) {
              validGoOn = false
            }
          }
        });
      }

      if (this.postil.isKeyWord === '0' || validGoOn) {
        this.upDateComments('add', newComment)
        // this.addBg(this.comments_nodes)
        this.getComments()
        this.$refs.ocrTxt.getInitContent(this.approval)
        this.changeRel(false)
        this.postil.textarea = ''
        this.$refs.editorial.changeType(2)
        this.dealIconWithComment()
        console.log('增加后', this.approval)
      }
    },
    changeFileById(fileId) {
      const fileIndex = this.files.findIndex((file) => fileId === file.id)
      this.changeFile(fileIndex)
    },
    // 展示连线
    showCommentLine(obj, fileId) {
      if (fileId) {
        this.changeFileById(fileId)
      }
      if (!obj?.position?.length) {
        return;
      }
      this.lineRemoveOnly();
      this.$nextTick(() => {
        const commenDom = document.querySelector(`div[data-commenid=c${obj.id}]`)
        this.appendHighLightDom(obj, commenDom)
      })
    },
    appendHighLightDom(obj, commenDom) {
      const data = obj.position
      const doms = []
      const location = []
      data.map((item) => {
        const newDom = document.createElement('div')
        newDom.style.position = 'absolute'
        newDom.style.left = `${item.left / this.styleProp.wordDomStyle.scale}px`
        newDom.style.top = `${item.top / this.styleProp.wordDomStyle.scale}px`
        newDom.style.width = `${(item.width / this.styleProp.wordDomStyle.scale)}px`
        newDom.style.height = `${(item.height / this.styleProp.wordDomStyle.scale)}px`
        const highlight = {
          word: obj.str,
          // 证明为点击意见连线
          isComment: true,
          location: {
            x: item.left,
            y: item.top,
            w: item.width,
            h: item.height
          }
        }
        location.push(highlight)
        doms.push(newDom)
      })
      // 获取高亮元素 dom
      // this.$refs.filePreview.setHighLight(location)
      this.lineWordItem = location
      this.drawCommentLine(doms, commenDom)
    },
    drawCommentLine(start, end) {
      // const highLightDoms = Array.from(document.getElementsByClassName('imgLight'));
      const endDomId = end.getAttribute('data-commenid')
      const rootDom = document.getElementsByClassName('results-div')[0]
      const onlyHide = endDomId === this.endDomId
      if (onlyHide) {
        this.lineRemove();
        this.endDomId = ''
        this.preDoms = [...this.preDoms]
        this.preDoms.map((child) => {
          child.remove()
        })
        return;
      }
      // 动画参数
      const animOptions = {
        duration: 2000,
        timing: 'linear'
      };
      this.endDomId = endDomId
      const showEffectName = 'draw';
      if (this.curMode === 0) {
        start.map((item, index) => {
          rootDom.appendChild(item)
          this.word_lines[index] = new LeaderLine(end, item, {
            color: '#EB5D78',
            size: 1,
            startPlug: 'disc',
            endPlug: 'disc'
            // endSocket: 'auto'
          });
          this.word_lines[index].show(showEffectName, animOptions);
          this.$nextTick(() => {
            const highLightDoms = Array.from(document.getElementsByClassName('imgLight'));
            this.high_light_lines[index] = new LeaderLine(highLightDoms[index], item, {
              color: '#EB5D78',
              size: 1,
              startPlug: 'disc',
              endPlug: 'disc'
              // endSocket: 'auto'
            });
            this.high_light_lines[index].show(showEffectName, animOptions);
          })
        })
      } else if (this.curMode === 1) {
        start.map((item, index) => {
          this.$nextTick(() => {
            const highLightDoms = Array.from(document.getElementsByClassName('imgLight'));
            this.high_light_lines[index] = new LeaderLine(highLightDoms[index], end, {
              color: '#EB5D78',
              size: 1,
              startPlug: 'disc',
              endPlug: 'disc'
              // endSocket: 'auto'
            });
            this.high_light_lines[index].show(showEffectName, animOptions);
          })
        })
      } else if (this.curMode === 2) {
        start.map((item, index) => {
          rootDom.appendChild(item)
          this.word_lines[index] = new LeaderLine(end, item, {
            color: '#EB5D78',
            size: 1,
            startPlug: 'disc',
            endPlug: 'disc'
            // endSocket: 'auto'
          });
          this.word_lines[index].show(showEffectName, animOptions);
        })
      }
      this.preDoms = start
      if (this.curMode !== 1) {
        document.querySelector('.ocr-txt .results').addEventListener('scroll', () => {
          this.linePosition();
        });
      }
      document.querySelector('.content-cont-editor').addEventListener('scroll', () => {
        this.linePosition();
      });
      if (this.curMode !== 2) {
        document.querySelector('.file-preview .preview .preview').addEventListener('scroll', () => {
          this.linePosition();
        });
      }
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
      const suffer = ['jpeg', 'jpg', 'png', 'pdf'].includes(temp?.fileName?.split('.')[temp?.fileName?.split('.').length - 1]);
      // 当前文件为 pdf 处理
      if (this.files?.[this.activeIndex].type === 'pdf') {
        this.pdfInfo.pageNow = 1
        this.changePdfPageNow(1)
      } else if (!temp.ocr && !temp.recommends && suffer) {
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
        this.approval = temp;
      }
      // 更新图标
      const curFileType = this.getfileType(this.files[this.activeIndex].fileName)
      this.$nextTick(() => {
        if (this.specialFileType1.includes(curFileType)) {
          this.findIconPosition()
          this.lisScroll()
        }
      })
      this.fileloading = false;
      this.filePopoverShow = false
    },
    async getOcr(temp) {
      let ocr = [];
      await getOCRAnalysisResults({
        fileId: temp.id
      }).then(res => {
        const { data, status } = res.data;
        if (status === 200) {
          if (Array.isArray(data.results)) {
            ocr.push(...data.results);
            return;
          }
          for (const key in data.results) {
            ocr.push(...data.results[key]);
          }
        }
      });
      ocr = ocr.map((o, i) => {
        const id = '' + new Date().getTime() + i
        o.ocrId = id
        return o
      })
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
      this.high_light_lines.forEach(line => {
        line.position()
      })
    },
    // 仅移除连线不做其他操作
    lineRemoveOnly() {
      (this.word_lines || []).forEach(item => {
        item.remove();
      });
      (this.high_light_lines || []).forEach(item => {
        item.remove();
      });
      this.word_lines = [];
      this.high_light_lines = []
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
      if (val === 2 && this.files[this.activeIndex].type !== 'pdf') {
        this.files[this.activeIndex] = this.approval;
        this.getComments(this.files[this.activeIndex]);
        this.$refs.editorial.collection = this.comments;
      }
      if (val === 2 && this.files[this.activeIndex].type === 'pdf') {
        this.files[this.activeIndex].child[this.activePdfIndex] = this.approval;
        this.getComments(this.files[this.activeIndex].child[this.activePdfIndex]);
        this.$refs.editorial.collection = this.comments;
      }
    },
    getComments() {
      const arr = [];
      const fileType = this.files[this.activeIndex].type
      if (fileType !== 'pdf') {
        this.files.forEach(file => {
          // 存在推荐意见
          file?.recommends?.map(recommend => {
          // 存在选择意见
            if (recommend.selected) {
              const selected = recommend.list.filter(a => a.id === recommend.selected);
              const isRepeat = file.comments?.filter(f => f.id === selected?.[0].id)
              if (!isRepeat) {
                arr.push({
                  id: selected?.[0].id,
                  str: selected?.[0].str,
                  files: [file.id],
                  words: [recommend.id]
                });
              }
            }
          })
          // 未关联word的 意见
          file?.comments && arr.push(...file?.comments);
        });
      } else {
        const pdfs = this.files[this.activeIndex].child
        pdfs.forEach((pdf) => {
          // 存在推荐意见
          pdf?.recommends?.map(recommend => {
            // 存在选择意见
            if (recommend.selected) {
              const selected = recommend.list.filter(a => a.id === recommend.selected);
              const isRepeat = pdf.comments?.filter(f => f.id === selected?.[0].id)
              if (!isRepeat) {
                arr.push({
                  id: selected?.[0].id,
                  str: selected?.[0].str,
                  files: [pdf.id],
                  words: [recommend.id]
                });
              }
            }
          })
          // 未关联word的 意见
          pdf?.comments && arr.push(...pdf?.comments);
        })
      }
      // comment id去重
      const setArr = [];
      arr.forEach(comment => {
        if (comment) {
          const exist = setArr.filter(a => a.id === comment.id);
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
      console.log('getComments', this.files[this.activeIndex])
    },
    // 编辑意见后,同步更新  文件的推荐意见状态
    upDateComments(type, item, newVal) {
      let filterFiles = [];
      if (type !== 'upd') {
        filterFiles = this.files.filter(file => item.files.includes(file.id))
      }
      const fileType = this.files[this.activeIndex].type
      switch (type) {
        // 新增意见,至少找到一个 关联文件,将新增意见插入即可
        case 'add':
          if (fileType !== 'pdf') {
            if (!filterFiles[0]?.comments) {
              filterFiles[0].comments = [];
              filterFiles[0].comments.push(item);
            } else {
              let num = 0
              filterFiles?.[0]?.comments.map((comment) => {
                if (comment.str === item.str) {
                  if (!comment.position) {
                    comment.position = item.position
                  } else {
                    comment.position = [...comment.position, ...item.position]
                  }
                } else if (comment.id === item.id) {
                  comment.str = item.str
                  comment.words = item.words
                } else {
                  num++
                }
              })
              if (num === filterFiles?.[0]?.comments.length) {
                filterFiles[0].comments.push(item);
              }
            }
          } else {
            const pdf = this.files[this.activeIndex].child[this.activePdfIndex]
            if (!pdf?.comments) {
              pdf.comments = [];
              pdf.comments.push(item);
            } else {
              let num = 0
              pdf?.comments.map((comment) => {
                if (comment.str === item.str) {
                  if (!comment.position) {
                    comment.position = item.position
                  } else {
                    comment.position = [...comment.position, ...item.position]
                  }
                } else if (comment.id === item.id) {
                  comment.str = item.str
                  comment.words = item.words
                } else {
                  num++
                }
              })
              if (num === pdf?.comments.length) {
                pdf.comments.push(item);
              }
            }
          }
          break;
        // 修改类型为修改意见字符串,找到意见关联的所有文件,  如果意见存在关联 关键词,修改对应词,对应意见的str,  如果 comments下包含,则修改 该意见
        case 'editStr':
        // 删除意见,找到意见关联的所有文件, 如果意见存在关联 关键词,则取消关键词 选择 的 意见,如果 comments下包含,则移除 该意见
        // eslint-disable-next-line
        case 'remove':
          filterFiles.map(file => {
            // const matchWord = file?.recommends?.filter(word => item.words.includes(word.id));
            // matchWord
            //   && matchWord.forEach(word => {
            //     if (type === 'remove') {
            //       word.selected = null;
            //     } else if (type === 'editStr') {
            //       const recommend = word.list.filter(a => a.id === word.selected);
            //       recommend[0].str = newVal;
            //     }
            //   });
            // 对于推荐意见处理
            file?.recommends?.map((word) => {
              if (item.words.includes(word.id)) {
                if (type === 'remove') {
                  word.selected = null;
                } else if (type === 'editStr') {
                  const recommend = word.list.filter(a => a.id === word.selected);
                  recommend[0].str = newVal;
                }
              }
            })
            file?.comments
              && file?.comments.map((comment, i) => {
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
            const matchWord = removeFile?.recommends?.filter(word => item.words.includes(word.id)) || [];
            if (matchWord.length) {
              matchWord.forEach(word => {
                word.selected = null;
              });
            } else {
              removeFile?.comments
                && removeFile?.comments.map((comment, i) => {
                  if (item.str === comment.str) {
                    if (!filterFiles[0]?.comments) {
                      filterFiles[0].comments = [];
                    }
                    filterFiles?.[0]?.comments
                      && filterFiles[0].comments.push({
                        ...item,
                        files: newVal
                      });
                    removeFile.comments.splice(i, 1);
                  }
                });
            }
            // 更新已存在的意见里的 ids
            const existIds = item.files.filter(val => newVal.includes(val));
            existIds.map(val => {
              const addFile = this.files.filter(file => file.id === val)?.[0];
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
        // 新增意见 后执行意见同步操作: 查找新增意见所关联的文件，将意见绑定到对应的文件上
        case 'upd':
          if (fileType !== 'pdf') {
            this.files.filter(file => item?.some((f) => {
              if (f.files.includes(file.id)) {
                if (!file.comments) {
                  file.comments = []
                }
                // file.comments = [...new Set([...file.comments, f])]
                file.comments.push(f)
              }
            }))
          } else {
            const pdf = this.files[this.activeIndex].child[this.activePdfIndex]
            console.log(pdf)
            pdf.files.filter(file => item?.some((f) => {
              if (f.files.includes(file.id)) {
                if (!file.comments) {
                  file.comments = []
                }
                // file.comments = [...new Set([...file.comments, f])]
                file.comments.push(f)
              }
            }))
          }
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
        const { status, message } = res.data;
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
    async submit({ reason, txt, prevUser }) {
      this.refuseDisabled = true
      let updateRuleRes = {
        data: {
          status: 200,
          msg: ''
        }
      }
      this.$message.info('正在驳回，请稍等！')
      updateRuleRes = await updateRuleCode({
        rollbackId:
          this.nextStepObj?.refuseWay === 'TO_BEFORE'
            ? prevUser.split('/')[0]
            : '',
        nextUserInfo: [
          {
            id: this.nextStepObj?.refuseWay === 'TO_BEFORE' ? prevUser.split('/')[1] : '',
          }
        ],
        processInstanceId: this.formBase.processInstanceId,
        templateId: this.formBase.processTemplateId,
        nodeId: this.formBase.nodeId
      }).catch(() => {
        updateRuleRes.data.status = 400
        this.refuseDisabled = false
      })
      const user = JSON.parse(window.localStorage.getItem('user_name'))
      const data = {
        comments: `${reason}${txt.trim() ? '-' + txt : ''}`,
        currentUserInfo: {
          id: user.id,
          name: user.fullname
        },
        processInstanceId: this.formBase.processInstanceId,
        rollbackId:
          this.nextStepObj?.refuseWay === 'TO_BEFORE'
            ? prevUser.split('/')[0]
            : '',
        signInfo: this.formBase.signInfo,
        nodeId: this.formBase.nodeId,
        taskId: this.formBase.taskId,
        templateId: this.formBase.templateId
      }
      const { status: ruleStatus } = updateRuleRes.data
      if (ruleStatus === 200) {
        rollback(data)
          .then((res) => {
            const { status, msg } = res.data
            if (status === 200) {
              this.$message.success('操作成功！')
              this.$router.go(-1)
              this.refuseDisabled = false
            } else {
              this.$message.error({ offset: 40, message: msg })
              this.refuseDisabled = false
            }
          })
          .catch(() => {
            this.refuseDisabled = false
          })
      }
    },
    // 获取节点审批人
    getNodeHandleUserApi() {
      const data = {
        templateId: this.formBase.processTemplateId,
        processInstanceId: this.formBase.processInstanceId,
        nodeId: this.formBase.nodeId,
      }
      getNodeHandleUser(data).then((res) => {
        const { status } = res.data;
        if (status === 200) {
          this.refuseOpiton = res.data.data
        }
      })
    },
    // icon 数量计算
    findIconPosition() {
      this.$nextTick(() => {
        const img = document.getElementById('picture')
        const realHeight = img.scrollHeight
        const iconTops = []
        const ocrLocation = []
        const ocrIds = []
        const scale = img.naturalWidth / img.clientWidth;
        this.approval.ocr.map((ocr) => {
          // icon 高度 等于 ocr 的 top + ocr 高度的一半 乘以缩放 - 图标自身高度的一半
          const newTop = (ocr.location.y + ocr.location.h / 2) / scale - 7.5
          iconTops.push(Math.floor(newTop))
          ocrIds.push(ocr.ocrId)
          ocrLocation.push({
            left: ocr.location.x,
            top: ocr.location.y,
            height: ocr.location.h,
            width: ocr.location.w,
          })
        })
        const iconContainer = document.querySelector('.icons')
        if (iconContainer) {
          iconContainer.style.height = realHeight + 'px'
        }
        const iconNum = iconTops.length
        const icons = []
        for (let i = 0; i < iconNum; i++) {
          icons.push({
            icon_id: '' + new Date().getTime() + i,
            ocrId: ocrIds[i],
            iconTop: iconTops[i],
            ocrLocation: ocrLocation[i],
            showIndex: -1
          })
        }
        this.icons = icons
        this.dealIconWithComment()
      })
    },
    // icon 管理的意见计算
    dealIconWithComment() {
      // const img = document.getElementById('picture')
      // const scale = img.naturalWidth / img.clientWidth;
      const { comments } = this
      // const iconTotal = this.icons.length
      comments.map((comment) => {
        // 如果该意见存在批注
        if (comment.position?.length) {
          comment.position.map((pos) => {
            // if(comment.icons.includes())
            const commentId = comment.id
            // 现有的icons
            const findIconLive = this.icons.filter((icon) => {
              return icon.positionWithId?.length > 0
            })
            // 要生成的icon
            const findIcon = this.icons.filter((icon) => {
              // console.log(icon.ocrLocation, pos, this.positionIsSame(icon.ocrLocation, pos))
              if (this.positionIsSame(icon.ocrLocation, pos)) {
                return icon
              }
            })
            console.log('要生成的icon', findIcon)
            // 与生成的icon产生堆叠影响的icons
            const findNewIcon = findIconLive.filter((icon) => {
              if (Math.abs(findIcon[0]?.iconTop - icon.iconTop) < 7.5) {
                return icon
              }
            })
            console.log('要影响的icon', findNewIcon)
            let newIcon = {}
            if (findNewIcon.length) {
              newIcon = {
                ...findNewIcon[0],
                files: comment.files,
                selectText: comment.selectText,
                str: comment.str,
                words: comment.words,
                positionWithId: [
                  ...findNewIcon[0].positionWithId,
                  { commentId, pos },
                ]
              }
            } else {
              if (!findIcon.length) {
                return
              }
              if (!findIcon[0]?.positionWithId) {
                findIcon[0].positionWithId = []
              }
              newIcon = {
                ...findIcon[0],
                files: comment.files,
                selectText: comment.selectText,
                str: comment.str,
                words: comment.words,
                positionWithId: [
                  ...findIcon[0].positionWithId,
                  { commentId, pos },
                ]
              }
            }
            let newIconIndex = 0
            this.icons.map((icon, i) => {
              if (icon.icon_id === newIcon.icon_id) {
                newIconIndex = i
              }
            })
            newIcon.positionWithId = newIcon?.positionWithId.filter((pwi) => {
              if (!this.positionIsSame(pos, pwi.pos)) return pwi
            })
            newIcon.positionWithId.push({ commentId, pos })
            this.$set(this.icons, newIconIndex, newIcon)
          })
        }
      })
      console.log('comments', this.comments)
      console.log('icons', this.icons)
    },
    // 展示 icon 的连线
    showIconLine(icon) {
      this.$refs.editorial.changeType(2)
      this.lineRemove()
      if (this.curActiveIcon !== icon.icon_id) { // 点击新icon
        this.curIconLine = 0
        this.changeIconShow(this.curActiveIcon, -1)
        this.changeIconShow(icon.icon_id, 1)
        this.curActiveIcon = icon.icon_id
      } else if (this.curIconLine >= icon.positionWithId.length) { // 此时为当前icon对应的最后一条线
        this.changeIconShow(icon.icon_id, -1)
        this.curActiveIcon = ''
      }
      let obj = {}
      // 存在当前激活的 icon 即代表可执行连线操作
      if (this.curActiveIcon) {
        // 传入正常对象 并 进行连线
        obj = {
          id: icon.positionWithId[this.curIconLine]?.commentId,
          files: icon.files,
          icon_id: icon.icon_id,
          position: [icon.positionWithId[this.curIconLine]?.pos],
          str: icon.str,
          selectText: icon.selectText,
          words: icon.words
        }
      } else {
        // 传入上一次的对象 且 取消连线
        obj = {
          id: icon.positionWithId[(this.curIconLine - 1) >= 0 ? this.curIconLine - 1 : 0]?.commentId,
          files: icon.files,
          icon_id: icon.icon_id,
          position: [icon.positionWithId[(this.curIconLine - 1) >= 0 ? this.curIconLine - 1 : 0]?.pos],
          str: icon.str,
          selectText: icon.selectText,
          words: icon.words
        }
      }
      this.showCommentLine(obj)
      // this.$forceUpdate()
      this.curIconLine += 1
    },
    // 修改 icon 激活状态 showIndex 为 1 为激活 -1 为不激活
    changeIconShow(id, showIndex) {
      if (!id) return
      this.icons?.map((icon) => {
        if (id === icon.icon_id) {
          // const newIcon = icon
          // newIcon.showIndex = showIndex
          // this.$set(this.icons, this.icons[index], newIcon)
          icon.showIndex = showIndex
        }
      })
    },
    // ocr 点击批注进行连线
    showOcrCommentLine(ocrPosition, ocrItem) {
      this.$refs.editorial.changeType(2)
      const findComment = this.findComment(ocrPosition)
      const findIcon = this.findIconPos(findComment, ocrItem)
      this.showIconLine(findIcon)
    },
    // 利用ocr定位 寻找对应 comment
    findComment(ocrPosition) {
      let findComment = {}
      this.comments.map((comment) => {
        comment.position?.map((pos) => {
          if (this.positionIsSame(pos, ocrPosition)) {
            findComment = comment
            findComment.position = [pos]
          }
        })
      })
      return findComment
    },
    // 点击ocr，获取对应 icon 最终走到意见，执行连线逻辑
    findIconPos(findComment, ocrItem) {
      let resIcon = {}
      const { ocrId } = ocrItem
      console.log(ocrId)
      this.icons.map((icon) => {
        let findIcon = icon.positionWithId?.map((ipos) => {
          if (this.positionIsSame(ipos.pos, findComment.position && findComment.position[0])) {
            return ipos
          }
        })
        findIcon = findIcon?.filter((fi) => fi !== undefined)
        if (Array.isArray(findIcon) && findIcon.length) {
          resIcon = {
            ...icon
          }
          resIcon.positionWithId = findIcon
        }
      })
      return resIcon
    },
    // 比较对象是否相等
    objIsSame(first, second) {
      const arr1 = Object.keys(first)
      const arr2 = Object.keys(second)
      if (arr1.length !== arr2.length) {
        return false
      }
      for (const k in first) {
        if (first[k] !== second[k]) {
          return false
        }
      }
      return true
    },
    // 位置比对 - 做了相似度 log 显示
    positionIsSame(first, second) {
      const pos1 = Object.keys(first)
      const pos2 = Object.keys(second)
      let numTure = 0
      if (pos1.length !== pos2.length) {
        return false
      }
      for (const k in first) {
        if (first[k] === second[k]) {
          // 完全匹配
        } else if (Math.abs(first[k] - second[k]) <= 2) {
          numTure++;
          // 误差处理
        } else {
          // 不匹配
          if (numTure >= 3) {
            console.log('----------相似度输出ing------------------')
            console.log(first, second)
            console.log('----------相似度输出结束------------------')
          }
          return false
        }
      }
      return true
    },
    // 判断当前选中批注状态是否为修改
    checkEdit(boolean) {
      this.isEdit = false
      if (boolean) {
        this.isEdit = true
      }
    },
    addRelComment() {
      const popover = this.$refs.postilPopover.$refs.popper
      popover.classList.add('positil-popover-left')
      this.$refs.editorial.changeType(2)
      this.isRel = true
    },
    changeRel(boolean) {
      this.isRel = boolean
      this.popoverShow = false
    },
    // pdf 相关操作处理
    // pdf 切换页码
    async changePdfPage(i) {
      console.log('当前index', i)
      this.fileloading = true;
      this.filePopoverShow = true;
      this.activePdfIndex = i
      const temp = this.files[this.activeIndex].child[this.activePdfIndex]
      if (!temp.ocr) {
        temp.ocr = await this.getOcr(temp);
      }
      if (!temp.recommends) {
        const { data } = await getOcrExamineShow({
          formId: this.formId,
          fileId: temp.id,
          processInstanceId: this.formBase.processInstanceId
        })
        const ocrRes = data.data;
        if (data.status === 200) {
          temp.recommends = ocrRes.recommends || [];
        } else {
          temp.recommends = []
        }
      }
      this.$nextTick(() => {
        this.findIconPosition()
        this.lisScroll()
      })
      this.approval = temp;
      this.fileloading = false;
      this.filePopoverShow = false;
    },
    async changePdfPageNow(pageNow) {
      console.log('当前页数', pageNow)
      this.fileloading = true;
      this.filePopoverShow = true;
      const params = {
        formId: this.formId,
        key: this.files?.[this.activeIndex].key,
        pageNow: pageNow || this.pdfInfo.pageNow,
        pageSize: this.pdfInfo.pageSize,
      }
      const pdfRes = await getPdfPage(params)
      const { data } = pdfRes.data
      if (data) {
        this.pdfInfo.pageNow = pageNow
        this.pdfInfo.pdfTotal = data.totalCount
        this.pdfInfo.pdfTotalPage = data.totalPage
        const { list } = data
        this.pdfInfo.list = list?.map((pdf) => {
          pdf.id = pdf.key
          return pdf
        })
        // 当前为第一页
        if (!this.files[this.activeIndex].child) {
          this.files[this.activeIndex].child = this.pdfInfo.list
          // 不是第一页
        } else {
          this.files[this.activeIndex].child.push(...this.pdfInfo.list)
        }
        this.activePdfIndex = 0 + this.pdfInfo.pageSize * (pageNow - 1)
        this.pdfInfo.list = this.files[this.activeIndex].child.slice(this.activePdfIndex, this.activePdfIndex + 10)
        const temp = this.files[this.activeIndex].child[this.activePdfIndex]
        if (!temp.ocr) {
          temp.ocr = await this.getOcr(temp);
        }
        if (!temp.recommends) {
          const ocrERes = await getOcrExamineShow({
            formId: this.formId,
            fileId: temp.id,
            processInstanceId: this.formBase.processInstanceId
          })
          const ocrRes = ocrERes.data.data;
          if (ocrERes.data.status === 200) {
            temp.recommends = ocrRes.recommends || [];
          } else {
            temp.recommends = []
          }
        }
        this.approval = temp
        this.$nextTick(() => {
          this.findIconPosition()
          this.lisScroll()
        })
        this.fileloading = false;
        this.filePopoverShow = false;
      }
    }
  },
};
