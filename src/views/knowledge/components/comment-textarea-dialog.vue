<template>
  <!-- 输入评论的弹框 -->
  <el-dialog
    :visible.sync="showDialog"
    width="624"
    :show-close="false"
    custom-class="relevant-dialog">
    <div class="comment">
    <div class="textarea">
      <el-input v-model.trim="title" @focus="handleFocus" @blur="handleBlur" placeholder="请输入标题(选填)" :maxlength="50" :minlength="1"></el-input>
      <el-input v-model.trim="content" @focus="handleFocus" @blur="handleBlur" type="textarea" placeholder="有什么新的案例分享给大家？" :rows="6" :maxlength="500" :minlength="1"></el-input>
    </div>
    <div class="option-area">
      <div class="picture">
        <span v-for="(item, index) in fileList" :key="item.key">
          <i class="el-icon-error" @click="deleteFile(index)"></i>
          <el-image v-if="['jpeg', 'jpg', 'png'].includes(getfileType(item.fileName))" :src="item.url"></el-image>
          <file-type v-else :fileName="item.fileName"></file-type>
        </span>
        <el-upload v-if="fileList.length" class="avatar-uploader" action="/cpr/file/upload" :http-request="uploadBpmn" :show-file-list="false">
          <div class="add-icon">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </el-upload>
      </div>
      <TrsTag
        style="margin-bottom: 4px;"
        v-for="(tag, index) in tags"
        :key="tag"
        :tag="{ label: tag.name, ...tagConfig }"
        @handleClose="removeTag(index)"
      />
    </div>
    <div class="buttons">
      <span class="button pointer" style="margin-right: 16px;">
        <el-upload class="avatar-uploader" action="/cpr/file/upload" :http-request="uploadBpmn" :show-file-list="false">
          <span>
            <img src="@/assets/image/knowledge/文件.svg" alt=""/>
            <span class="text">文件</span>
          </span>
        </el-upload>
      </span>
      <el-popover
        placement="bottom-start"
        :width="260"
        trigger="click"
      >
        <div class="content">
          <el-input v-model.trim="serach" @keypress.native.enter="changeSearchTag" size="mini" class="is-dark" placeholder="请输入关键词搜索"></el-input>
          <ul class="tags-list trs-scroll" v-loading="loadingTag">
            <li class="tag-li pointer" v-if="showNewTag">
              <span class="tag-text ellipsis">#{{ serach }}</span>
              <span style="color:#2D5CF6;" @click="addTags()">创建新标签</span>
            </li>
            <li class="tag-li pointer" v-for="(tag) in tagsList" :key="tag.id" @click="changeCheckedTags(tag)" :class="{ active: checkedTags.includes(tag.id) }">
              <span class="tag-text ellipsis">#{{ tag.name }}</span>
            </li>
          </ul>
        </div>
        <template #reference>
          <span class="button pointer tags">
            <span class="img">+</span>
            <span class="text">关联标签</span>
          </span>
        </template>
      </el-popover>
      <span class="button pointer">
        <el-select v-model="type" placeholder="选择正反面" clearable>
          <el-option label="正面案例" :value="1"></el-option>
          <el-option label="反面案例" :value="0"></el-option>
        </el-select>
      </span>
      <el-button :loading="publishLoading" type="primary" style="width:88px;float: right;" :disabled="!content || publishLoading" @click="handleConfirm">发 布</el-button>
    </div>
  </div>
  </el-dialog>
</template>
<script>
import { debounce } from 'lodash';
import { mapState } from 'vuex'
import { addTag, addKnowledge, getTagInfoList } from '@/api/knowledge/knowledgeCollect'
import fileType from '@/components/common/file-type'
import { getFormGroups } from '@/api/front';
export default {
  name: 'comment-textarea',
  components: {
    fileType
  },
  data() {
    return {
      publishLoading: false,
      loadingTag: false,
      title: '',
      content: '',
      type: '',
      serach: '',
      hoverText: '',
      tagsList: [],
      tags: [], // 添加的标签池
      tagConfig: {
        background: '#f0f6ff',
        color: '#2d5cf6',
        borderColor: 'transparent',
        borderRadius: '20px',
        closable: true,
        size: 'mini'
      },
      showDialog: false,
      fileList: []
    }
  },
  computed: {
    showNewTag() {
      return this.serach && this.tagsList.findIndex(item => item.name === this.serach) === -1
    },
    checkedTags() {
      return this.tags.map(item => item.id)
    },
    getfileType() {
      return val => {
        return val?.split('.')[val.split('.').length - 1]
      }
    },
    ...mapState(['setDefalutTagsList'])
  },
  watch: {
    setDefalutTagsList(val) {
      this.tagsList = JSON.parse(JSON.stringify(val || []))
    }
  },
  methods: {
    async addTags() {
      const res = await addTag({ tagName: this.serach })
      if (res.data.success) {
        const { id } = res.data.data
        this.tags.push({
          name: this.serach,
          id
        })
        this.serach = ''
        this.$message.success('新建标签成功')
      }
    },
    changeCheckedTags(tag) {
      const index = this.tags.findIndex(item => item.id === tag.id);
      if (index === -1) {
        this.tags.push(tag)
      } else {
        this.tags.splice(index, 1)
      }
    },
    removeTag(index) {
      this.tags.splice(index, 1)
    },
    openDialog() {
      this.showDialog = true
    },
    resetForm() {
      this.title = ''
      this.content = ''
      this.fileList = []
      this.tags = []
      this.type = ''
    },
    handleConfirm: debounce(async function () {
      if (!this.content) {
        this.$message.warning('请填写内容后再发布')
        return;
      }
      this.publishLoading = true
      try {
        const res = await addKnowledge({
          title: this.title,
          content: this.content,
          fileKeys: this.fileList.map(item => item.key) || [],
          tagIds: this.tags.map(item => item.id) || [],
          type: this.type
        })
        if (res.data.success) {
          this.showDialog = false
          this.$message.success('发布成功')
          this.resetForm()
          this.$emit('updateList')
        }
        this.publishLoading = false
      } catch {
        this.publishLoading = false
      }
    }, 500),
    initForm(form) {
      Object.keys(form).forEach(key => {
        this[key] = form[key]
      })
    },
    uploadBpmn(param) {
      const formData = new FormData();
      formData.append('mf', param.file); // 传入bpmn文件
      getFormGroups(formData)
        .then((res) => {
          if (res.data.data) {
            this.handleAvatarSuccess(res.data.data, param.file.uid);
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch(() => {
          param.onError(param.file.uid);
        });
    },
    handleAvatarSuccess(data) {
      this.fileList.push({
        url: data.url,
        key: data.key,
        fileName: data.fileName
      })
    },
    deleteFile(index) {
      this.fileList.splice(index, 1)
    },
    async changeSearchTag() {
      this.loadingTag = true
      const res = await getTagInfoList({
        justCare: 0,
        keyword: this.serach
      })
      if (res.data.success) {
        this.tagsList = res.data.data || []
      }
      this.loadingTag = false
    },
    handleFocus(e) {
      e.target.parentNode.parentNode.style.border = '1px solid #2D5CF6'
    },
    handleBlur(e) {
      e.target.parentNode.parentNode.style.border = '1px solid transparent'
    },
  }
}
</script>
<style lang="less" scoped>
.comment {
  position: relative;
  padding: 24px;
  width: 695px;
  background: #FFFFFF;
  border-radius: 10px;
  .textarea {
    border-radius: 10px;
    background: #F7F8FA;
    border: 1px solid #F2F3F5;
    border-radius: 4;
    background: #FFFFFF;
    :deep(.el-input) .el-input__inner {
      background: transparent;
      border: none;
      font-weight: 700;
    }
    :deep(.el-textarea) textarea {
      background: transparent;
      border: none;
    }
  }
  .entry-dialog {
    position: absolute;
    right: 20px;
    top: 104px;
  }
  .entry-dialog {
    position: absolute;
    right: 20px;
    top: 104px;
  }
  .option-area {
    .picture {
      display: flex;
      align-items: center;
      margin: 10px 0;
      span {
        position: relative;
        margin-right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        background: #F2F3F5;
      }
      .el-icon-error {
        position: absolute;
        right: 2px;
        top: 2px;
        z-index: 999;
        cursor: pointer;
        font-size: 16px;
        opacity: 0.7;
      }
      .el-image {
        width: 50px;
        height: 50px;
      }
      svg {
        font-size: 50px;
      }
      .add-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        border-radius: 4px;
        border: 1px dashed #CACDD3;
        background: #FFF;
        cursor: pointer;
      }
    }
  }
  .buttons {
    .button {
      display: inline-block;
      .text {
        position: relative;
        top: 3px;
        font-size: 14px;
        margin-left: 4px;
        color: #505968;
      }
    }
    .tags {
      display: inline-block;
      height: 28px;
      padding: 0 16px;
      border-radius: 20px;
      border: 1px dashed #CACDD3;
    }
    /deep/ .el-select {
      position: relative;
      top: 2px;
      width: 115px;
      .el-input__inner {
        border: none;
      }
    }
  }
}
/deep/ .el-select .el-input .el-icon-arrow-up::before {
  font-family: element-icons !important;
  content: '\e78f';
}
.is-dark :deep(.el-input__inner) {
  border: none;
  background: #F7F8FA;
  border-radius: 20px;
}
.tags-list {
  margin-top: 16px;
  max-height: 200px;
  overflow: auto;
  .tag-li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 8px;
    font-size: 12px;
    .tag-text {
      width: 150px;
    }
  }
}
/deep/.el-dialog {
  &__header {
    padding: 0;
  }
  &__body {
    padding: 0;
  }
}
.active {
  color: #2D5CF6;
}
</style>
