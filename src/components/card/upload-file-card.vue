<template>
  <div class="upload-file-card">
    <p v-if="status !== 4 && onlineFlag" class="normal-onLine">
      <span> 请选择活动是否正常上线 <i>*</i></span><br />
      <el-radio-group v-model="radio">
        <el-radio :label="1">活动正常上线</el-radio>
        <el-radio :label="0">活动未开展</el-radio>
      </el-radio-group>
    </p>
    <p class="head" v-if="status !== 4">
      请上传最终上线版本，且已审批通过的材料
    </p>
    <el-upload v-if="status !== 4 && radio == 1" class="upload-demo" drag action :http-request="uploadBpmn"
      :file-list="fileList" :on-success="handleSuccess" multiple  :before-upload="checkFileLegal" :on-error="handleError"
      :show-file-list="false">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        <p>将文件拖到此处，或<em>点击上传</em></p>
        <p>支持jpg/png/pdf/doc/xls/mp4/ppt/txt/格式的文件</p>
      </div>
    </el-upload>
    <div class="upload-demo" v-if="radio == 0">
      <div class="el-upload" >
        <div class="el-upload-dragger " style="cursor:default;">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">当前不需要上传材料</div>
        </div>
      </div>
    </div>
    <p style="color: #EB5757;margin: 16px 0; font-size: 12px;" v-if="status !== 4 && radio == 1&&fileList.length">材料上传完成后，请与初次上传材料进行关联</p>
    <div v-if="(status !== 4&&radio==1)||status==4">
    <div :class="{ 'upload-list': true, status4: status == 4 }" v-loading="loading" >
      <Empty v-if="status == 4 && fileList && fileList.length == 0"></Empty>
      <div class="item" v-for="(item, index) in fileList" :key="index" @mouseenter="handleMouseEnter(item,index)"
        @mouseleave="handleMouseLeave(item,index)">
        <div class="left">{{ `${index + 1}.` }}</div>
        <div class="center" style="color: #1d2128">
          <file-type :fileName="item.fileName"></file-type>
          <i class="file-name">{{ item.fileName | getFileName }} <i style="color: #505968">
              .{{
                item.fileName.split('.')[item.fileName.split('.').length - 1]
              }}</i></i>
        </div>
        <div class="right">
          <div class="r-item progress" v-if="item.status === -1">上传中...</div>
          <div class="r-item progress" v-if="item.status === 1">
            <!-- 在这里匹配是否关联成功 -->
            <span v-if="item.hasRelevant && !item.isClick" class="flex" style="line-height: 18px; color: #14c9c9">
              <i class="icon el-icon-circle-check" style="margin-right: 4px; font-size: 18px; color: #14c9c9"></i>
              已关联
            </span>
            <span v-if="!item.hasRelevant" class="flex" style="line-height: 18px; color: #eb5757"
              @click="openRelevant(item)">
              <i class="icon el-icon-warning-outline" style="margin-right: 4px; font-size: 18px; color: #eb5757"></i>
              去关联
            </span>
            <span v-if="item.hasRelevant && item.isClick" @click="cancelRelevant(item)">
              取消关联
            </span>
            <span v-if="item.isClick" @click="delItem(item)" style="margin-left: 3px">
              <i class="icon el-icon-circle-close" style="color: #86909c; font-size: 18px"></i>
            </span>
          </div>
          <div class="r-item error" v-if="item.status === -2 && !item.isClick">
            上传失败
          </div>
          <div class="r-item progress" style="color: #2d5cf6" v-if="item.isClick && status == 4" >
            <span @click="preview(item)" style="margin-right: 6px;">预览</span>
            <span @click="download(item)">下载</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="status == 4 && fileList && fileList.length">
      <p class="downloadAll" @click="download">下载全部</p>
    </div>
  </div>
    <el-dialog title="关联文件" :visible.sync="relevantDocumentDialog" width="624" :before-close="handleClose"
      custom-class="relevant-dialog">
      <div>
        <p class="relevant-filename">
          请选择与<i style="color: #2d5cf6">{{ waitRelevantDocument.name }}</i>关联的文件：
        </p>
        <ul style="overflow: hidden; padding-top: 16px">
          <div style="overflow: auto; max-height: 300px" class="trs-scroll">
            <li v-for="(item, index) in reviewMaterials" :key="index">
              <span>{{ index + 1 }}.
                <file-type :fileName="item.fileName"></file-type>
                <i class="file-name">{{ item.fileName | getFileName }}<i style="color: #505968">
                    .{{
                      item.fileName.split('.')[
                        item.fileName.split('.').length - 1
                      ]
                    }}</i></i>
              </span>
              <span>
                <i style="color: #2d5cf6" class="pointer" v-if="!item.hasRelevant" @click="relevantItem(item)">关联</i>
                <i style="color: #86909c" class="pointer" v-if="item.hasRelevant">已关联</i>
              </span>
            </li>
          </div>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { deleteFormGroups } from '@/api/front'
import FileType from '@/components/common/file-type'
import { findFinalMaterial, uploadCompareFile } from '@/api/approvalCenter'
import { downloadAllFilesOther } from '@/api/applyCenter'
export default {
  name: 'upload-file-card',
  components: { FileType },
  props: {
    status: {
      type: Number,
      // 3 代表待确认  4 已结束
      default: 0
    },
    filledInByApprover: {
      type: Array,
      default: () => []

    },
    processInstanceId: {
      type: String,
      default: ''
    },
    formId: {
      type: String,
      default: ''
    },
    taskId: {
      type: String,
      default: ''
    },
    reviewMaterial: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      fileList: [],
      reviewMaterials: this.reviewMaterial,
      loading: false,
      judgment: 'jpeg/jpg/png/pdf/doc/docx/xls/xlsx/mp4/ppt/pptx/txt/',
      fileSuffix: {
        pdf: 'icon-mianxingtubiao',
        doc: '#icon-mianxingtubiao-2',
        docx: '#icon-mianxingtubiao-2',
        xls: '#icon-mianxingtubiao-1',
        xlsx: '#icon-mianxingtubiao-1',
        mp4: '#icon-mp4',
        ppt: '#icon-file-ppt',
        pptx: '##icon-file-ppt',
        txt: '#icon-file-txt',
        jpeg: '#icon-picture',
        jpg: '#icon-picture',
        png: '#icon-picture'
      },
      radio: 1,
      relevantDocumentDialog: false,
      waitRelevantDocument: {}, // 等待关联的文件
      onlineFlag: false, // 判断活动是否上线
    }
  },
  watch: {
    radio(val) {
      this.$store.commit('setUploadFileRadio', val)
    }
  },
  mounted() {
    if (this.status === 3) {
      // 判断活动是否上线
      const onlineFlag = this.filledInByApprover?.filter(m => m.title === '活动是否上线') || false
      this.onlineFlag = onlineFlag

      // 3 待确认，需要上传材料
      this.reviewMaterials = this.reviewMaterials.map((v) => {
        return {
          ...v,
          name: v.fileName,
          hasRelevant: false,
          relevantFile: {}
        }
      })
    } else if (this.status === 4) {
      // 5 已结束，需要查询已上传的材料
      this.getMaterials()
    }
  },
  methods: {
    // test(){
    //   const { approvedOpinionForm, fileUploadForm, uploadFileRadio } = this.$store.state.checkApprovedForm
    //   const params = fileUploadForm.map(v => {
    //         return {
    //           fileName: v.fileName,
    //           key: v.key,
    //           url: v.url,
    //           isRelation: true,
    //           otherFilename: v.relevantFile.fileName,
    //           otherKey: v.relevantFile.key,
    //           otherUrl: v.relevantFile.url
    //         }
    //       })
    // },
    /**
     * @description: 下载
     * @return {*}
     */
    download(item) {
      const params = {
        formId: this.formId,
      }
      if (item) {
        params.key = item.key
      }
      this.$message.info('下载中，请稍等！')
      downloadAllFilesOther(params).then((res) => {
        const disposition = res.headers['content-disposition']
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a');
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', decodeURI(disposition.replace('attachment;filename=', '')))
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    preview(item) {
      this.$emit('preview', item.url)
    },
    /**
     * @description: 查询已经上传的最终上线材料
     * @return {*}
     */
    getMaterials() {
      this.loading = true
      findFinalMaterial(this.processInstanceId, this.taskId)
        .then((res) => {
          this.loading = false
          const { success, data } = res.data
          if (success) {
            this.fileList = data || []
          }
        })
        .catch(() => {
          this.loading = false
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleClose() {
      this.waitRelevantDocument = {}
      this.relevantDocumentDialog = false
    },
    // 弹窗内取消关联
    dialogCancelRev(item) {
      this.fileList.forEach((m) => {
        if (m.key === item.relevantFile.key) {
          m.hasRelevant = false
          m.relevantFile = {}
          m.relevantFileName = ''
        }
      })
      item.hasRelevant = false
      item.relevantFile = {}
      item.relevantFileName = ''
      this.$store.commit('setUploadFileRequired', this.fileList.length > 0)
      this.$store.commit('setUploadFileForm', this.fileList)
    },
    /**
     * @description: 打开弹窗，准备关联文件
     * @param {*} item
     * @return {*}
     */
    openRelevant(item) {
      this.waitRelevantDocument = item
      this.relevantDocumentDialog = true
    },
    /**
     * @description: 弹窗打开后，去关联刚才点击的文件
     * @return {*}
     */
    relevantItem(item) {
      const { key, url, fileName } = this.waitRelevantDocument
      item.relevantFile = {
        key,
        url,
        fileName
      }
      item.hasRelevant = true
      item.relevantFileName = fileName
      this.fileList.forEach((m) => {
        if (m.key === this.waitRelevantDocument.key) {
          m.hasRelevant = true
          item.relevantFileName = fileName
          m.relevantFile = {
            key: item.key,
            url: item.url,
            fileName: item.fileName
          }
        }
      })
      this.handleClose()
      this.$store.commit('setUploadFileRequired', this.fileList.length > 0)
      this.$store.commit('setUploadFileForm', this.fileList)
    },
    /**
     * @description: 已上传文件列表，操作取消关联文件
     * @param {*} item
     * @return {*}
     */
    cancelRelevant(item) {
      this.fileList.forEach((m) => {
        if (m.key === item.key) {
          m.hasRelevant = false
          m.relevantFileName = ''
          m.relevantFile = {}
        }
      })
      this.reviewMaterials.forEach((m) => {
        if (m?.relevantFile?.fileName === item.fileName) {
          m.hasRelevant = false
          m.relevantFile = {}
          m.relevantFileName = ''
        }
      })
      this.$store.commit('setUploadFileRequired', this.fileList.length > 0)
      this.$store.commit('setUploadFileForm', this.fileList)
    },
    /**
     * @description: 对于已上传的文件，删除选中项操作,若已经关联，取消弹窗内的关联文件 this.reviewMaterials
     * @param {*} item
     * @return {*}
     */
    delItem(item) {
      const index = this.fileList.findIndex((v) => v.key === item.key)
      this.fileList.splice(index, 1)
      this.reviewMaterials.forEach((m) => {
        if (m.relevantFile && m.relevantFile.key === item.key) {
          m.hasRelevant = false
          m.relevantFile = {}
          m.relevantFileName = ''
        }
      })
      this.$store.commit('setUploadFileRequired', this.fileList.length > 0)
      this.$store.commit('setUploadFileForm', this.fileList)
    },
    dialogLiEnter(item) {
      this.dialogCrtLi = item.key
    },
    dialogLiLeave() {
      this.dialogCrtLi = ''
    },
    handleSuccess(data, id) {
      this.fileList.forEach((item) => {
        const flag = this.reviewMaterials.some(
          (v) => v.fileName === data.fileName
        )
        // 上传完之后，跟reviewMaterials自动匹配
        const relevantFile = this.reviewMaterials.filter(
          (v) => v.fileName === data.fileName
        )[0]
        if (item.id === id) {
          item.key = data.key
          item.url = data.url
          item.status = 1
          item.hasRelevant = flag
          item.relevantFile = relevantFile
          item.relevantFileName = flag ? relevantFile.fileName : ''
        }
      })
      this.reviewMaterials.forEach((m) => {
        if (m.fileName === data.fileName) {
          m.hasRelevant = true
          m.relevantFile = data
          m.relevantFileName = data.fileName
        }
      })
      this.$store.commit('setUploadFileRequired', this.fileList.length > 0)
      this.$store.commit('setUploadFileForm', this.fileList)
    },
    handleDownload() {
      this.$message.success('下载中')
    },
    handleError(id) {
      this.fileList.forEach((item) => {
        if (item.id === id) {
          item.status = -2
        }
      })
    },
    // 上传文件
    uploadBpmn(param) {
      const formData = new FormData()
      formData.append('mf', param.file) // 传入bpmn文件
      formData.append('formId', this.formId) // 传入bpmn文件
      uploadCompareFile(formData).then((res) => {
        const { success } = res.data
        if (success) {
          this.handleSuccess(res.data.data, param.file.uid)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    handleUploadLook(url) {
      window.open(url)
    },
    handleMouseEnter(item, index) {
      item.isClick = true
      this.$set(this.fileList, index, item)
    },
    handleMouseLeave(item, index) {
      item.isClick = false
      this.$set(this.fileList, index, item)
    },
    // 删除图片
    handleUploadDelete(item) {
      deleteFormGroups({ key: item.key }).then((res) => {
        const idx = this.fileList.findIndex((iten) => iten.key === item.key)
        this.fileList.splice(idx, 1)
        this.$message({ type: 'success', message: res.data.data })
        // 更新store里的状态 form 和 是否上传文件的数量>1
        this.$store.commit('setUploadFileRequired', this.fileList.length > 0)
        this.$store.commit('setUploadFileForm', this.fileList)
      })
    },
    /**
     * @description: 上传文件之前校验文件格式
     * @param {*} file
     * @return {*}
     */
    checkFileLegal(file) {
      const type = file.name.replace(/.+\./, '')
      const judgeArr = this.judgment.split('/')
      const judgeRes = judgeArr.includes(type)
      if (!judgeRes) {
        this.$message({
          type: 'error',
          message:
            '只支持jpeg/jpg/png/pdf/doc/docx/xls/xlsx/mp4/ppt/pptx/txt/格式的文件！'
        })
        return false
      }
      this.fileList.push({
        fileName: file.name,
        id: file.uid,
        status: -1,
        isClick: false,
        type
      })
    }
  },
  filters: {
    getFileName(val) {
      return val.replace(/(.*\/)*([^.]+).*/gi, '$2')
    }
  }
}
</script>
<style lang="less" scoped>
.upload-file-card {
  .normal-onLine {
    margin-bottom: 16px;

    span {
      color: #000;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;

      /* 157.143% */
      i {
        color: #f76560;
      }
    }

    .el-radio-group {
      margin-top: 8px;
      border-radius: 4px;
      width: 100%;
      background: #f7f8fa;
      padding: 8px 12px;
    }
  }

  .head {
    color: #1d2128;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    margin-bottom: 16px;
  }

  /deep/ .upload-demo {
    border-radius: 4px;
    border: 1px dashed #cacdd3;
    background: #f7f8fa;

    .el-upload {
      width: 100%;
    }

    .el-upload-dragger {
      width: 100%;
      background: #f7f8fa;
      border: none;
    }

    .el-upload__text {
      p:nth-of-type(1) {
        color: #1d2128;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        margin-bottom: 8px;
      }

      p:nth-of-type(2) {
        color: #999;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
      }

      em {
        color: #2d5cf6;
      }
    }
  }

  .upload-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 28px;
    width: 100%;

    .item {
      display: flex;
      align-items: center;
      width: 100%;
      height: 38px;
      padding: 0 12px;
      border-radius: 4px;
      box-sizing: border-box;
      border-bottom: 1px dashed rgba(229, 230, 235, 1);
      cursor: pointer;
      margin-bottom: 8px;

      &:hover {
        background: rgba(247, 248, 250, 1);
        border-bottom: 1px dashed transparent;
      }

      .center {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        max-width: 76%;

        .icon {
          margin: 0 10px;
        }

        .file-name {
          white-space: pre;
          max-width: 80%;
          overflow: hidden;
          text-overflow: ellipsis; //文本超出省略号替代
          white-space: nowrap;
        }
      }

      .right {
        flex: 1;
        display: flex;
        text-align: right;
        justify-content: flex-end;
        .r-item {
          display: flex;
          justify-content: flex-end;
          margin-left: 4px;
        }

        .progress {
          color: rgba(134, 144, 156, 1);
        }

        .error {
          color: rgba(247, 101, 96, 1);
        }

        .success {
          color: rgba(45, 92, 246, 1);
        }

        .s-item {
          cursor: pointer;

          &:first-child {
            margin-right: 10px;
          }
        }
      }
    }
  }

  .status4 {
    margin-top: 0;
    min-height: 40px;

    .item {
      .success {
        visibility: hidden;
      }
    }

    .item:hover {
      .success {
        visibility: visible;
      }
    }
  }

  .downloadAll {
    text-align: right;
    color: #306ef5;
    cursor: pointer;
    text-align: right;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    text-decoration-line: underline;
    margin-top: 16px;
  }
}

/deep/ .relevant-dialog {
  padding: 36px;

  .el-dialog__header {
    text-align: center;
    padding: 0;
    margin-bottom: 20px;

    .el-dialog__title {
      color: #1d2128;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
    }

    .el-dialog__headerbtn {
      top: 32px;
      right: 40px;
    }
  }

  .el-dialog__body {
    padding: 0;
    max-height: 340px;
    font-size: 22px;

    .relevant-filename {
      color: #1d2128;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
    }

    ul {
      li {
        display: flex;
        justify-content: space-between;
        color: #1d2128;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        padding: 8px 12px;
        margin: 16px 0;

        .file-name {
          white-space: pre;
          max-width: 60%;
          overflow: hidden;
          text-overflow: ellipsis; //文本超出省略号替代
          white-space: nowrap;
        }

        .icon {
          margin: 0 10px;
          font-size: 20px;
        }
      }

      li:nth-of-type(1) {
        margin-top: 0;
      }
    }
  }
}
</style>
