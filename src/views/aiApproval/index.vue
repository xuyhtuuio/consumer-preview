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
        <file-preview ref="filePreview" :files="files" :activeIndex="activeIndex" @changeFile="changeFile"
          :lineWordItem="lineWordItem" @linePosition="linePosition"></file-preview>
        <orcTxt ref="ocrTxt" :approval="approval"
          v-show="['jpeg', 'jpg', 'png', 'pdf'].includes(approval?.fileName?.split('.')[1])" @showLine="showLine"
          :lineWordItem="lineWordItem">
        </orcTxt>
        <editorial ref="editorial" :approval="approval" :files="files" @linePosition="linePosition"
          :lineWordItem="lineWordItem" @upDateComments="upDateComments" @drawLine="drawLine"
          @changeEditorialType="changeEditorialType">
        </editorial>
      </div>
    </div>
    <add-review ref="addReview"></add-review>
    <!-- <submit-review></submit-review> -->
  </div>
</template>

<script>
import LeaderLine from '@/utils/leader-line';
import filePreview from './components/file-preview'
import orcTxt from './components/ocr-txt'
import editorial from './components/editorial'
import { files, pngOcr, recommends } from "./files";
import addReview from './dialogs/add-review.vue'
import submitReview from './dialogs/submit-review.vue'
export default {
  name: 'aiApproval',
  components: { filePreview, orcTxt, editorial, addReview, submitReview },
  data() {
    return {
      loading: false,
      files: [], // 文件相关信息
      comments: [], // 总编辑意见
      approval: {}, // 当前审批文件的相关内容
      activeIndex: null,
      word_lines: [], // 连线
      lineWordItem: {}, // 当前展示连线的词的基本信息
    }
  },
  mounted() {
    this.loading = true;
    setTimeout(() => {
      this.files = files;
      this.loading = false;
      this.$nextTick(() => {
        this.$refs.filePreview.init();
        this.changeFile(0)
      })
    }, 1000);
  },
  methods: {
    init() {
      this.$refs['addReview'].init()
    },
    // 初始化文件
    initFile() {
      this.$refs['addFileSource'].init()
    },
    // 切换审批文件
    changeFile(i) {
      if (this.activeIndex === i) {
        return;
      }
      this.lineWordItem = {}
      this.lineRemove()
      if (!this.files[i].ocr && !this.files[i].recommends) {
        this.files[i].ocr = JSON.parse(JSON.stringify(pngOcr));
        this.files[i].recommends = JSON.parse(JSON.stringify(recommends));
      }
      if (this.files?.[this.activeIndex]?.ocr) {
        this.files[this.activeIndex] = {
          ...this.approval,
          recommends: this.$refs.editorial.recommends
        };
        // this.getComments(this.files[this.activeIndex])
      }
      this.activeIndex = i;
      this.approval = this.files[i];
    },
    // 展示连线
    showLine(wordItem) {
      if (wordItem.ocrWordId === this.lineWordItem.ocrWordId) {
        this.lineRemove();
        this.lineWordItem = {}
        return;
      }
      this.lineWordItem = wordItem;
      this.$nextTick(() => {
        this.drawLine()
      })
    },
    drawLine() {
      this.lineRemove();
      const start = document.querySelector('#' + this.lineWordItem.ocrWordId)
      const ends = [...document.querySelectorAll(`[word="${this.lineWordItem.word}"] .list-item`), document.querySelector('#imgLight')]
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
          if (recommend.selected !== null) {
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
      // console.log(this.comments)
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
            const matchWord = file?.recommends.filter(word => item.words.includes(word.id));
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
                  delete file.comments[i]
                } else if (type === 'editStr') {
                  file.comments[i] = newVal
                }
              }
            });
            file.comments = file?.comments?.filter(comment => comment?.str)
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
                  delete removeFile.comments[i]
                }
              });
            }
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
  },
  beforeDestroy() {
    this.lineRemove()
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
    width: 380px;
    overflow: hidden;

    &:first-child {
      flex: 1;
      // width: calc(100% - 60% - 24px);
    }
  }
}
</style>
<style lang="less">
svg.leader-line {
  z-index: 2;
}
</style>