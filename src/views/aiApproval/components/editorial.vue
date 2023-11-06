<template>
  <div class="editorial">
    <div class="header">
      <span v-show="showRecommend && showOcr" :class="{ active: active === 1 }" @click="changeType(1)">推荐意见</span>
      <i v-show="showRecommend && showOcr">|</i>
      <span :class="{ active: active === 2 }" @click="changeType(2)">编辑意见</span>
    </div>
    <div class="results" ref="results">
      <!-- 推荐意见 -->
      <template v-if="active === 1">
        <div class="recommend" v-for="(recommend, a) in recommends" :key="recommend.word + recommend.wordType"
          :word="recommend.word + recommend.wordType"
          :class="{ hidden: lineWordItem?.word && lineWordItem.word !== recommend.word }">
          <template v-if="activeWordType === 0 || activeWordType === recommend.wordType">
            <span class="recommend-word" :wordType="recommend.wordType">{{ recommend.word }}</span>
            <div class="list-item"
              v-for="(item, i) in recommend.list.slice(0, recommend.hideMore ? 3 : recommend.list.length)" :key="i"
              :class="{ active: item.id === recommend.selected, edit: item.showEdit }">
              <p style="cursor: pointer;" @dblclick="showEdit(a, i)" v-if="!item.showEdit">{{ item.str }}</p>
              <el-input v-char v-else :ref="`input_${a}_${i}`" @blur="hideEdit(a, i, true)" v-model.trim="input"
                placeholder="请输入意见" type="textarea" :rows="3" class="edit-input" resize="none"
                @keyup.enter.native="hideEdit(a, i, true)"></el-input>
              <i class="iconfont icon-tubiao3 previousApprover"  v-if="item.previousApprover"></i>
              <i v-else class="checkbox" @click="changeSelect(a, i)" :class="{active: item.id === recommend.selected}">
                <i class="el-icon-check" v-if="item.id === recommend.selected"></i>
              </i>
            </div>
            <!-- 展开收起 -->
            <p class="list-btns">
              <i class="iconfont icon-zhankai" @click="getMoreList(a)"
                v-if="recommend.hideMore || recommend.totalPage > recommend.pageNow"></i>
              <i class="iconfont icon-shouqi" @click="hideList(a)"
                v-if="recommend.pageNow > 1 && !recommend.hideMore"></i>
            </p>
          </template>
        </div>
        <div v-if="recommends?.length === 0" class="nodata">
          <img src="@/assets/image/ai-approval/nodata.svg" alt="" class="暂无推荐的意见">
          <p>暂无推荐的意见</p>
          <p>可在 <span class="underline">识别结果</span> 中选中认为敏感词汇添加关键词和意见。</p>
          <p>也可点击 <span class="underline" style="cursor: pointer;" @click="changeType(2)">已编辑意见</span> 手动输入意见。</p>
        </div>
      </template>
      <!-- 编辑意见 -->
      <div v-else class="recommend">
        <div class="list-item list-item2" v-for="(item, i) in collection" :key="i" :class="{ edit: item.showEdit }">
          <p style="cursor: pointer;" @dblclick="showEdit_collection(i)" v-if="!item.showEdit">{{ item.str }}</p>
          <el-input v-char v-else :ref="`input_${i}`" @blur="hideEdit_collection(i)" v-model.trim="input" placeholder="请输入意见"
            type="textarea" :rows="3" class="edit-input" resize="none"
            @keyup.enter.native="hideEdit_collection(i)"></el-input>
          <i class="el-icon-close" @click="removeItem(item, i)"></i>
          <div class="item-files">
            <span>文件来源：</span>
            <div class="files">
              <el-tag v-for="(tag) in files.filter(file => item.files.includes(file.id))" :key="tag.id" closable
                size="small" @close="removeFile(item, tag.id)">
                <span>{{ tag.fileName }}</span>
              </el-tag>
            </div>
            <div class="icon-plus">
              <i class="el-icon-circle-plus" @click="showDialog(item)"></i>
            </div>
          </div>
        </div>
        <!-- 可手动新增 -->
        <div class="list-item list-item2 list-edit" :class="{ edit: newFocus }">
          <el-input v-char ref="input_edit" v-model.trim="newInput" placeholder="可以输入新的意见，按Enter键确认" type="textarea" :rows="3"
            class="edit-input" resize="none" @blur="addNewComment(true)" @focus="inputFocus"
            @keyup.enter.native="addNewComment(true)"></el-input>
          <div class="item-files">
            <span>文件来源：</span>
            <div class="files">
              <el-tag v-for="(tag) in files.filter(file => newFiles.includes(file.id))" :key="tag.id" closable
                size="small" @close="new_removeFile(tag.id)">
                <span>{{ tag.fileName }}</span>
              </el-tag>
            </div>
            <div class="icon-plus">
              <i class="el-icon-circle-plus" @click="showDialog()"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <add-file-source ref="addFileSource" :files="files" @updateFile="updateFile"></add-file-source>
  </div>
</template>

<script>
import {
  RecommendedListLoadMore
} from '@/api/aiApproval';
import addFileSource from '../dialogs/add-file-source'
export default {
  name: 'editorial',
  components: { addFileSource },
  props: {
    formId: {
      type: String,
      default: ''
    },
    approval: {
      type: Object,
      default: () => ({})
    },
    lineWordItem: {
      type: Object,
      default: () => ({})
    },
    files: {
      type: Array,
      default: () => ([])
    },
    showOcr: {
      type: Boolean,
      default: true
    },
    formBase: {
      type: Object,
      default: () => ({})
    },
    activeWordType: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      active: 1,
      showRecommend: true,
      recommends: [], // 推荐意见,便于快捷修改,切换后会同步至 对应文件相关信息
      collection: [], // 最后的编辑及意见,需反向修改 对应选中的 意见
      input: '',
      editItem: {}, // 当前编辑关联的的文件
      newInput: '',
      newFiles: [],
      newFocus: false,
    }
  },
  watch: {
    approval: {
      handler(val) {
        this.init(val)
      },
      // deep: true
    },
    showOcr(val) {
      if (val === false && this.showRecommend) {
        this.changeType(2)
      }
    }
  },
  methods: {
    init(val) {
      const ocrType = ['pdf', 'jpeg', 'jpg', 'png'].includes(val.fileName.split('.')[val.fileName.split('.').length - 1])
      this.showRecommend = ocrType;
      this.active = ocrType ? 1 : 2;
      this.recommends = val.recommends?.map(item => {
        item.hideMore = item.hideMore || false;
        item.selected = item.selected || null;
        return item
      });
      this.newFiles = [val.id]
      this.$emit('changeEditorialType', this.active)
    },
    inputFocus() {
      this.newFocus = true;
    },
    new_removeFile(id) {
      if (this.newFiles.length === 1) {
        this.$message.info('请至少选择一个文件来源')
      } else {
        this.newFiles = this.newFiles.filter(file => file !== id)
      }
    },
    // 添加新的意见
    addNewComment(update) {
      if (this.newInput && update) {
        const item = {
          id: null,
          str: this.newInput,
          files: [...this.newFiles],
          words: [],
        }
        this.collection.push(item)
        this.newFiles = [this.approval.id];
        this.newInput = '';
        this.$emit('upDateComments', 'add', item)
      }
      this.newFocus = false
    },
    // 移除指定意见
    removeItem(item, i) {
      this.collection.splice(i, 1)
      this.$emit('upDateComments', 'remove', item)
    },
    // 移除绑定文件
    removeFile(item, id) {
      if (item.files.length === 1) {
        this.$message.info('请至少选择一个文件来源')
      } else {
        const newFiles = [...item.files.filter(file => file !== id)];
        this.$emit('upDateComments', 'editFiles', item, newFiles)
        item.files = newFiles;
      }
    },
    // 更新绑定的关联文件
    updateFile(files) {
      const oldFiles = this.editItem?.files ? this.editItem.files : this.newFiles;
      if (files.sort().toString() && oldFiles.sort().toString()) {
        // 同步更新推荐意见
        this.editItem?.files && this.$emit('upDateComments', 'editFiles', this.editItem, files)
        // 更新当前绑定的文件
        this.editItem?.files ? this.editItem.files = files : this.newFiles = files;
      }
    },
    showDialog(item) {
      this.$refs.addFileSource.init(item?.files || this.newFiles);
      this.editItem = item || {};
    },
    changeSelect(a, i, isedit) {
      const { id } = this.recommends[a].list[i];
      if (this.recommends[a].selected === id && !isedit) {
        this.recommends[a].selected = null;
      } else {
        this.recommends[a].selected = id;
      }
    },
    async getMoreList(a) {
      this.$set(this.recommends[a], 'hideMore', false);
      if (this.recommends[a].pageNow < this.recommends[a].totalPage) {
        const pageNow = this.recommends[a].pageNow + 1;
        await RecommendedListLoadMore({
          formId: this.formId,
          keywordId: this.recommends[a].id,
          processInstanceId: this.formBase.processInstanceId,
          pageNow,
        })
          .then(res => {
            const { data, status, message } = res.data;
            if (status === 200) {
              this.recommends[a].pageNow = pageNow;
              this.recommends[a].list.push(...data.list)
            } else {
              this.$message.error({ offset: 40, title: '提醒', message });
            }
          });
      }
      this.$nextTick(() => {
        this.$emit('showLine')
      })
    },
    hideList(a) {
      this.$set(this.recommends[a], 'hideMore', true);
      this.$nextTick(() => {
        this.$emit('showLine')
      })
    },
    showEdit(a, i) {
      if (this.recommends[a].list[i].previousApprover) {
        return;
      }
      this.$set(this.recommends[a].list[i], 'showEdit', true);
      this.input = this.recommends[a].list[i].str;
      this.$nextTick(() => {
        this.$refs[`input_${a}_${i}`][0].focus()
      })
    },
    hideEdit(a, i, update) {
      this.$set(this.recommends[a].list[i], 'showEdit', false);
      this.input && this.$set(this.recommends[a].list[i], 'str', this.input);
      update && this.changeSelect(a, i, true)
    },
    showEdit_collection(i) {
      this.$set(this.collection[i], 'showEdit', true);
      this.input = this.collection[i].str;
      this.$nextTick(() => {
        this.$refs[`input_${i}`][0].focus()
      })
    },
    hideEdit_collection(i) {
      this.$set(this.collection[i], 'showEdit', false);
      if (this.input && this.input !== this.collection[i].str) {
        this.$emit('upDateComments', 'editStr', this.collection[i], this.input)
        this.$set(this.collection[i], 'str', this.input);
      }
    },
    changeType(val) {
      this.active = val;
      this.$emit('changeEditorialType', val)
    }
  }
}
</script>

<style lang="less" scoped>
.editorial {
  display: flex;
  flex-direction: column;
}

.header {
  background: #F7F8FA;
  padding: 9px 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-around;

  >span {
    flex: 1;
    display: inline-block;
    text-align: center;
    padding: 4px 10px;
    line-height: 22px;
    font-size: 14px;
    white-space: pre;
    color: #86909C;
    cursor: pointer;
    height: fit-content;

    &.active {
      color: #333333;
      font-weight: 700;
    }
  }

  i {
    color: #86909C;
    margin: 0 10px;
  }
}

.results {
  background: #ffffff;
  flex: 1;
  margin: 24px 16px;
  overflow-y: auto;
  word-break: break-all;
  color: #1D2128;
  line-height: 22px;
  font-size: 14px;
  font-weight: 400;
}

.recommend {
  margin-bottom: 24px;
  counter-reset: sectioncounter;

  &.hidden {
    display: none;
  }

  &-word {
    padding: 2px 20px;
    border-radius: 4px;
    display: inline-block;

    &[wordtype="1"] {
      color: #F76560;
      background: #FDF1F4;
    }

    &[wordtype="2"] {
      color: #FDB123;
      background: #FFF7E6;
    }
  }

}

.list-item {
  margin-top: 10px;
  padding: 10px 50px 10px 42px;
  position: relative;
  border-radius: 8px;
  background: #F9F9FB;

  &.active {
    background: #F0F6FF;
    color: #2D5CF6;
  }

  &.edit {
    border: 1px solid #80A6FF;
    background: #ffffff;
  }

  &::before {
    content: counter(sectioncounter) ".";
    counter-increment: sectioncounter;

    position: absolute;
    left: 20px;
  }

  .previousApprover {
    display: inline-block;
    position: absolute;
    right: 20px;
    top: 10px;
    color: #505968;
    font-size: 24px;
  }

  .checkbox {
    display: inline-block;
    position: absolute;
    border: 1px solid #306EF5;
    border-radius: 4px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    right: 20px;
    top: 10px;
    color: #ffffff;
    font-weight: bold;
    cursor: pointer;

    &.active {
      text-align: center;
      background: #2D5CF6;
    }
  }

  .el-icon-close {
    display: inline-block;
    padding: 0 2px;
    font-size: 16px;
    position: absolute;
    border-radius: 4px;
    line-height: 20px;
    right: 12px;
    top: 10px;
    color: #2D5CF6;
    font-weight: bold;
    cursor: pointer;
  }

  /deep/ .edit-input textarea {
    border-color: #E5E6EB;
    padding: 0;
    border: none;
  }
}

.list-item2 {
  margin: 0 0 10px 0;
  padding: 10px 34px 8px 32px;

  &::before {
    left: 12px;
  }
}

.list-btns {
  text-align: center;
  color: #306EF5;
  display: flex;
  justify-content: center;
  gap: 10px;

  i {
    font-size: 12px;
    background: #F9F9FB;
    border-radius: 0px 0px 10px 10px;
    padding: 6px 30px;
    cursor: pointer;

  }
}

.list-edit {
  border: 1px solid #E5E6EB;
  background: #ffffff;
}

.item-files {
  display: flex;
  margin: 10px 0 0 -20px;
  width: calc(100% + 42px);

  >span {
    width: 60px;
    color: #86909C;
    font-size: 12px;
    line-height: 20px;
    word-break: keep-all;
  }

  .files {
    flex: 1;
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .el-tag {
    word-break: keep-all;
    border: none;
    background: #F0F6FF;
    color: #306EF5;
    line-height: 24px;
    padding: 0 12px;
    margin-bottom: 6px;
    display: inline-flex;
    align-items: center;

    >span {
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 200px;
    }

    /deep/ .el-icon-close {
      color: #ACB1B9;
      background: none;
      font-weight: bold;
      font-size: 16px;
    }
  }

  .icon-plus {
    display: flex;
    align-items: flex-end;
    margin: 0 14px 6px 0;
  }

  .el-icon-circle-plus {
    color: #2D5CF6;
    font-size: 15px;
    padding: 3px;
    cursor: pointer;
  }
}

.nodata {
  padding: 8px 0;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 28px;
  color: #86909C;

  img {
    margin-bottom: 32px;
  }

  .underline {
    color: #1D2128;
    text-decoration: underline;
  }
}
</style>
