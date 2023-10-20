<template>
  <div class="comment">
    <div class="textarea">
      <el-input v-model.trim="title" placeholder="请输入标题(选填)" :maxlength="50" :minlength="1"></el-input>
      <el-input v-model.trim="content" type="textarea" placeholder="有什么新的案例分享给大家？" :rows="3" :maxlength="500" :minlength="1"></el-input>
      <img class="entry-dialog pointer" src="@/assets/image/knowledge/输入框弹框.svg" @click="openDialog" alt=""/>
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
        v-for="(tag, index) in tags"
        :key="tag"
        :tag="{ label: tag, ...tagConfig }"
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
        trigger="hover"
      >
        <div class="content">
          <el-input v-model.trim="serach" size="mini" class="is-dark" placeholder="请输入关键词搜索"></el-input>
          <ul class="tags-list trs-scroll">
            <li class="tag-li pointer" v-for="(tag, index) in tagsList" :key="index" @mouseover="hoverText = tag"  @mouseout="hoverText = ''">
              <span class="tag-text ellipsis">#{{ tag }}</span>
              <span v-show="tag === serach || hoverText === tag" style="color:#2D5CF6;" @click="addTags(tag)">创建新标签</span>
            </li>
          </ul>
          <el-empty v-if="serach && tagsList.length === 0" description="暂无数据"></el-empty>
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
          <el-option label="正面案例" value="正面案例"></el-option>
          <el-option label="反面案例" value="反面案例"></el-option>
        </el-select>
      </span>
      <el-button type="primary" style="width:88px;float: right;" :disabled="!content" @click="handleConfirm">发 布</el-button>
    </div>
    <!-- 输入评论的弹框 -->
    <CommentTextareaDialog ref="CommentTextareaDialog" @handleConfirm="handleConfirm"/>
  </div>
</template>
<script>
import { getFormGroups } from '@/api/front';
import fileType from '@/components/common/file-type'
import CommentTextareaDialog from './comment-textarea-dialog'
export default {
  name: 'comment-textarea',
  components: {
    fileType,
    CommentTextareaDialog
  },
  data() {
    return {
      title: '',
      content: '',
      type: '',
      serach: '',
      hoverText: '',
      tagsList: [
        // '案范围分为',
        // 'afws wefwef文',
        // 'wefwae问的人违反文档威风威风为',
        // '阿尔法违法未',
        // '案范围分为1',
        // 'afws wefwef文1',
        // 'wefwae问的人违反',
        // '阿尔法违法未1',
        // '案范围分为2',
        // 'afws wefwef文2',
        // 'wefwae问的人违反2',
        // '阿尔法违法未2',
        // '案范围分为3',
        // 'afws wefwef文3',
        // 'wefwae问的人违反3',
        // '阿尔法违法未3',
        // '案范围分为4',
        // 'afws wefwef文4',
        // 'wefwae问的人违反4',
        // '阿尔法违法未4'
      ],
      tags: [], // 添加的标签池
      tagConfig: {
        background: '#f0f6ff',
        color: '#2d5cf6',
        borderColor: 'transparent',
        borderRadius: '20px',
        closable: true,
        size: 'mini'
      },
      fileList: []
    }
  },
  computed: {
    getfileType() {
      return val => {
        return val?.split('.')[val.split('.').length - 1]
      }
    },
  },
  methods: {
    addTags(tag) {
      this.tags.push(tag)
    },
    removeTag(index) {
      this.tags.splice(index, 1)
    },
    openDialog() {
      this.$refs['CommentTextareaDialog'].showDialog = true
      this.$nextTick(() => {
        this.$refs['CommentTextareaDialog'].initForm({
          title: this.title,
          content: this.content,
          type: this.type,
          serach: this.serach,
          tags: this.tags,
          fileList: this.fileList
        })
      })
    },
    handleConfirm() {

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
    }
  }
}
</script>
<style lang="less" scoped>
.comment {
  position: relative;
  padding: 16px 20px;
  width: calc(100vw - 372px);
  background: #FFFFFF;
  border-radius: 10px;
  .textarea {
    border-radius: 10px;
    background: #F7F8FA;
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
</style>
