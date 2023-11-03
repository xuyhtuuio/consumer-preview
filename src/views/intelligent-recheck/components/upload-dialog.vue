<template>
  <el-dialog
    :visible.sync="turnDialog"
    width="600px"
    :before-close="handleClose"
    center
    custom-class="add-review"
    title="智能回检帮您溯源文件信息"
  >
    <el-upload
      class="upload-demo"
      drag
      ref="uploadPic"
      :multiple="false"
      action
      :show-file-list="false"
      :disabled="uploading"
      :http-request="uploadFile"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        <div class="tip">将文件拖到此处</div>
        <div class="txt">支持jpg/png格式的文件</div>
        <div class="or">
          <div class="line"></div>
          <div class="txt">或</div>
          <div class="line"></div>
        </div>
        <div class="btn-body">
          <div class="btn btn-not" v-if="uploading">
            <i class="el-icon-loading" style="margin-right: 8px"></i>上传中
          </div>
          <div class="btn" v-if="!uploading">点击上传</div>
        </div>
      </div>
    </el-upload>
  </el-dialog>
</template>
<script>
import { getFormGroups } from '@/api/front'
export default {
  name: 'rejectDialog',
  data() {
    return {
      turnDialog: false,
      uploading: false
    }
  },
  mounted() {},
  methods: {
    handleClose() {
      this.turnDialog = false
    },
    uploadFile(param) {
      const formData = new FormData()
      this.uploading = true
      formData.append('mf', param.file)
      getFormGroups(formData)
        .then((res) => {
          if (res.data.success) {
            this.uploading = false
            this.$router.push({
              name: 'recheck-detail',
              params: {
                item: {
                  ...res.data.data,
                  name: '',
                  text: '',
                  searchType: 2,
                },
              }
            })
            this.$emit('changeImgFun', {
              ...res.data.data,
              name: '',
              text: '',
              searchType: 2,
            });
            this.turnDialog = false;
          } else {
            this.$message.error(res.data.msg)
            this.uploading = false
          }
        })
        .catch(() => {
          this.uploading = false;
          this.$message.error('上传失败')
        })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-dialog {
  .el-dialog__title {
    color: #999;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
  }
  .el-dialog__body {
    .el-upload {
      width: 560px;
      height: 228px;
      .el-upload-dragger {
        width: 100%;
        height: 100%;
        .el-icon-upload {
          margin: 12px 0 16px;
        }
      }
      .el-upload__text {
        .tip {
          color: #1d2128;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 22px;
          margin-bottom: 8px;
        }
        .txt {
          color: #999;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 20px;
          margin-bottom: 8px;
        }
        .or {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          .line {
            width: 242px;
            height: 1px;
            background-color: #e5e6eb;
          }
          .txt {
            color: #999;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px;
            margin: 0 8px;
          }
        }
        .btn-body {
          display: flex;
          justify-content: center;
          .btn {
            width: 152px;
            height: 38px;
            border-radius: 38px;
            background-color: #2d5cf6;
            text-align: center;
            color: #fff;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 38px;
            cursor: pointer;
          }
          .btn-not {
            cursor: not-allowed;
          }
        }
      }
    }
  }
}
</style>
