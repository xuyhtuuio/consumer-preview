<template>
  <div class="review-material" v-if="list.length" ref="globalRef">
    <g-table-card :title="title">
      <template v-slot:cardInfo>
        <div class="cardInfo">
          <span style="color: #eb5757">*</span>
          {{ cardInfo }}
        </div>
        <div class="warn" v-if="judgeWarnFlag">
          <warn-info :info="warnInfo"> </warn-info>
        </div>
      </template>
      <template v-slot:content>
        <div class="content">
          <el-upload
            class="upload"
            drag
            :action="action"
            :multiple="true"
            :http-request="uploadBpmn"
            :file-list="fileList"
            :before-upload="handleBefore"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
              <div class="el-upload__tip" slot="tip">{{ uploadTip }}</div>
            </div>
          </el-upload>
          <div class="upload-list">
            <div
              class="item"
              v-for="(item, index) in fileList"
              :key="index"
              @mouseenter="handleMouseEnter(item)"
              @mouseleave="handleMouseLeave(item)"
            >
              <div class="left">{{ `${index + 1}.` }}</div>
              <div class="center">
                <file-type
                  class="left-icon"
                  :fileName="item.name || item.fileName"
                ></file-type>
                {{ item.name || item.fileName }}
              </div>
              <div class="right">
                <div class="r-item progress" v-if="item.status === -1">
                  上传中...
                </div>
                <div
                  class="r-item progress"
                  v-if="item.status === 1 && !item.isClick"
                >
                  上传完成
                </div>
                <div
                  class="r-item error"
                  v-if="item.status === -2 && !item.isClick"
                >
                  上传失败
                </div>
                <div
                  class="r-item success"
                  v-if="item.status === 1 && item.isClick"
                >
                  <span class="s-item" @click="handleUploadLook(item.url)"
                    >预览</span
                  >
                  <span class="s-item" @click="handleUploadDelete(item)"
                    >删除</span
                  >
                </div>
                <div
                  class="r-item error"
                  v-if="item.status === -2 && item.isClick"
                >
                  <span
                    class="s-item success"
                    @click="handleUploadDelete(item, false)"
                    >删除</span
                  >
                </div>
              </div>
              <el-progress
                class="my-progress"
                v-if="item.status === -1"
                :percentage="item.percentage"
                :stroke-width="2"
                :show-text="false"
              ></el-progress>
            </div>
          </div>
        </div>
      </template>
    </g-table-card>
  </div>
</template>

<script>
import Queue from 'promise-queue-plus'
import FileType from '@/components/common/file-type'
import {
  getFormGroups,
  deleteFormGroups,
  taskInfo,
  initTask,
  preSignUrl,
  merge
} from '@/api/front'

import md5 from '@/utils/md5'
import WarnInfo from './warn-info'

// 核对要点
export default {
  components: {
    WarnInfo,
    FileType
  },
  props: {
    list: {
      typeof: Array,
      required: true
    }
  },
  data() {
    return {
      title: '审查材料',
      cardInfo: '（上传的文件必须为同一个产品或活动的材料）',
      warnInfo: '至少上传一个附件材料才可提交申请',
      judgeWarnFlag: false,
      uploadTip:
        '支持zip/jpeg/jpg/png/pdf/doc/docx/xls/xlsx/mp4/ppt/pptx/txt/格式的文件，压缩包中文件名不得包含*&^%$_-+=等特殊字',
      uploadTip1: '*&^%$_-+=',
      judgment: 'zip/jpeg/jpg/png/pdf/doc/docx/xls/xlsx/mp4/ppt/pptx/txt/',
      // judgment:this.list
      action: 'http://192.168.210.57:31602/cpr/file/upload',
      fileList: [],
      info: {
        err: '您当前存在上传失败的材料，可能是文件名中包含特殊字符，请重新上传后再提交',
        errT: '您当前存在正在上传的材料，请等待文件上传成功后再提交'
      },
      fileSuffix: {
        zip: '#icon-zip',
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
      // 文件上传分块任务的队列（用于移除文件时，停止该文件的上传队列） key：fileUid value： queue object
      fileUploadChunkQueue: {}
    }
  },
  watch: {
    list(newVal) {
      if (newVal.length) {
        this.judgeWarnFlag = false
        this.fileList = newVal[0].value
        this.fileList.length
          && this.fileList.forEach((item) => {
            item.status = 1
            item.name = item.fileName
            item.type = item.fileName.replace(/.+\./, '')
            this.$set(item, 'isClick', false)
          })
      }
    },
    'fileList.length': function () {
      if (this.judgeWarnFlag) this.judgeWarnFlag = false
    }
  },
  methods: {
    handleSuccess(data, id) {
      this.fileList.forEach((item) => {
        if (item.id === id) {
          item.percentage = 100
          item.key = data.key
          item.url = data.url
          item.child = data.child || null
          setTimeout(() => {
            item.status = 1
          }, 1000)
        }
      })
      this.judgeWarnFlag = false
    },
    handleError(id, msg) {
      this.fileList.forEach((item) => {
        if (item.id === id) {
          item.status = -2
        }
      })

      if (msg) {
        this.$message.error(msg)
      }
    },
    async handleBefore(file) {
      // 上传文件之前钩子
      const type = file.name.replace(/.+\./, '')
      const judgeArr = this.judgment.split('/')
      const judgeRes = judgeArr.includes(type)
      if (!judgeRes) {
        this.$message({
          type: 'error',
          message:
            '只支持zip/jpeg/jpg/png/pdf/doc/docx/xls/xlsx/mp4/ppt/pptx/txt/格式的文件！'
        })
        return false
      }
      const item = {
        name: file.name,
        id: file.uid,
        status: -1,
        isClick: false,
        type,
        percentage: 0
      }
      this.fileList.push(item)
      if (type === 'zip') {
        return true
      }
      const res = await this.getFileInfo(file, (val) => {
        item.percentage = Number(val)
        // item.percentage = Number(val) > 100 ? 100 : val
      })

      if (Object.keys(res).length > 0) {
        this.handleSuccess(res, file.uid)
      }
    },

    async getFileInfo(file, callback) {
      const { getTaskInfo, handleUpload } = this
      const task = await getTaskInfo(file)
      if (task) {
        const { finished, path, key, taskRecord } = task
        const { fileIdentifier: identifier } = taskRecord
        if (finished) {
          return { url: path, key }
        } else {
          const errorList = await handleUpload(file, taskRecord, callback)
          if (errorList.length > 0) {
            const message = '部分分片上次失败，请尝试重新上传文件'
            this.handleError(file.uid, message)
            return
          }
          const {
            data: { code, data: res, msg }
          } = await merge(identifier, file.name)
          if (code === '00') {
            return { url: res.url, key: res.key }
          } else {
            this.handleError(file.uid, msg)
          }
        }
      } else {
        this.handleError(file.uid, '获取上传任务失败')
      }
    },

    /**
     * 获取一个上传任务，没有则初始化一个
     */
    async getTaskInfo(file) {
      let task
      const identifier = await md5(file)
      const {
        data: { code, data }
      } = await taskInfo(identifier, file.name).catch(() => {
        this.handleError(file.uid, '文件上传失败')
      })
      if (code === '00') {
        task = data
        if (!task) {
          const initTaskData = {
            identifier,
            fileName: file.name,
            totalSize: file.size,
            chunkSize: 5 * 1024 * 1024
          }
          const {
            data: { code: code1, data: data1 }
          } = await initTask(initTaskData).catch(() => {
            this.handleError(file.uid, '文件上传失败')
          })
          if (code1 === '00') {
            task = data1
          }
        }
      }
      return task
    },

    /**
     * 上传逻辑处理，如果文件已经上传完成（完成分块合并操作），则不会进入到此方法中
     */
    handleUpload(file, taskRecord, callback) {
      let lastUploadedSize = 0 // 上次断点续传时上传的总大小
      let uploadedSize = 0 // 已上传的大小
      const totalSize = file.size || 0 // 文件总大小
      const startMs = new Date().getTime() // 开始上传的时间
      const { exitPartList, chunkSize, chunkNum, fileIdentifier } = taskRecord

      // 获取从开始上传到现在的平均速度（byte/s）
      const getSpeed = () => {
        // 已上传的总大小 - 上次上传的总大小（断点续传）= 本次上传的总大小（byte）
        const intervalSize = uploadedSize - lastUploadedSize
        const nowMs = new Date().getTime()
        // 时间间隔（s）
        const intervalTime = (nowMs - startMs) / 1000
        return intervalSize / intervalTime
      }

      const uploadNext = async (partNumber) => {
        const start = Number(chunkSize) * (partNumber - 1)
        const end = start + Number(chunkSize)
        const blob = file.slice(start, end)
        const {
          data: { code, data }
        } = await preSignUrl({
          identifier: fileIdentifier,
          partNumber,
          fileName: file.name,
          task: taskRecord
        }).catch(() => {
          this.handleError(file.uid, '部分上传失败')
        })
        if (code === '00' && data) {
          await this.$http({
            url: data,
            method: 'PUT',
            data: blob,
            headers: { 'Content-Type': 'application/octet-stream' }
          })
          return Promise.resolve({ partNumber, uploadedSize: blob.size })
        } else {
          return Promise.reject(
            new Error(`分片${partNumber}， 获取上传地址失败`)
          )
        }
      }
      /**
       * 更新上传进度
       * @param increment 为已上传的进度增加的字节量
       */
      const updateProcess = (increment) => {
        increment = Number(increment)
        const factor = 1000 // 每次增加1000 byte
        let from = 0
        // 通过循环一点一点的增加进度
        while (from <= increment) {
          from += factor
          uploadedSize += factor
          const percent = Math.round((uploadedSize / totalSize) * 100).toFixed(
            2
          )
          callback && percent < 100 && callback(percent)
        }

        const speed = getSpeed()
        const remainingTime = speed !== 0
          ? Math.ceil((totalSize - uploadedSize) / speed) + 's'
          : '未知'
        // console.log('剩余大小：', (totalSize - uploadedSize) / 1024 / 1024, 'mb');
        // console.log('当前速度：', (speed / 1024 / 1024).toFixed(2), 'mbps');
        // console.log('预计完成：', remainingTime);
        this.remainingTime1 = remainingTime
      }

      return new Promise((resolve) => {
        const failArr = []
        const queue = Queue(5, {
          retry: 3, // Number of retries
          retryIsJump: false, // retry now?
          workReject(reason) {
            failArr.push(reason)
          },
          queueEnd() {
            resolve(failArr)
          }
        })
        this.fileUploadChunkQueue[file.uid] = queue
        for (let partNumber = 1; partNumber <= chunkNum; partNumber++) {
          const exitPart = (exitPartList || []).find(
            (exitPartItem) => exitPartItem.partNumber === partNumber
          )
          if (exitPart) {
            // 分片已上传完成，累计到上传完成的总额中,同时记录一下上次断点上传的大小，用于计算上传速度
            lastUploadedSize += Number(exitPart.size)
            updateProcess(exitPart.size)
          } else {
            queue.push(() => uploadNext(partNumber).then((res) => {
              // 单片文件上传完成再更新上传进度
              updateProcess(res.uploadedSize)
            }))
          }
        }
        if (queue.getLength() === 0) {
          // 所有分片都上传完，但未合并，直接return出去，进行合并操作
          resolve(failArr)
          return
        }
        queue.start()
        // this.queue = queue
      })
    },
    // 上传文件
    uploadBpmn(param) {
      const type = param.file.name.replace(/.+\./, '')
      if (type !== 'zip') { return }
      const formData = new FormData()
      formData.append('mf', param.file) // 传入bpmn文件
      getFormGroups(formData)
        .then((res) => {
          if (res.data.success) {
            // param.onSuccess(res.data.data)
            this.handleSuccess(res.data.data, param.file.uid)
          } else {
            this.$message.error(res.data.msg)
            this.handleError(param.file.uid)
          }
        })
        .catch(() => {
          this.handleError(param.file.uid)
        })
    },
    handleUploadLook(url) {
      const routeUrl = this.$router.resolve({
        name: 'showReview',
        query: {
          url
        }
      })
      window.open(routeUrl.href, '_blank')
    },
    // 删除图片
    handleUploadDelete(item, flag = true) {
      if (flag) {
        deleteFormGroups({ key: item.key }).then((res) => {
          const idx = this.fileList.findIndex((iten) => iten.key === item.key)
          this.fileList.splice(idx, 1)
          this.$message({ type: 'success', message: res.data.data })
        })
      } else {
        const idx = this.fileList.findIndex((iten) => iten.id === item.id)
        this.fileList.splice(idx, 1)
        this.$message({ type: 'success', message: '删除成功' })
      }
    },
    handleMouseEnter(item) {
      item.isClick = true
    },
    handleMouseLeave(item) {
      item.isClick = false
    },

    judgeWarn(flag = true) {
      const { offsetTop } = this.$refs['globalRef']
      if (this.fileList.some((item) => item.status === -2)) {
        this.warnInfoMessage(this.info.err)
        flag && (this.judgeWarnFlag = true)
        return [false, offsetTop]
      }
      if (this.fileList.some((item) => item.status === -1)) {
        this.warnInfoMessage(this.info.errT)
        flag && (this.judgeWarnFlag = true)
        return [false, offsetTop]
      }
      if (!this.fileList.length) {
        if (flag) {
          this.judgeWarnFlag = true
          return [false, offsetTop]
        } else {
          return [true]
        }
      }
      return [true]
    },
    warnInfoMessage(
      message,
      type = 'warning',
      customClass = 'el-icon-warning-one'
    ) {
      this.$message({
        type,
        customClass,
        message
      })
    }
  }
}
</script>

<style lang="less" scoped>
.review-material {
  .warn {
    display: flex;
    align-items: center;
    margin-left: 14px;
    font-size: 12px;
    color: rgba(235, 87, 87, 1);
    .right-icon {
      margin-right: 8px;
    }
  }
  .content {
    padding: 16px 72px 0;
    .upload {
      /deep/.el-upload {
        width: 100%;
        .el-upload-dragger {
          width: 100%;
          background: #f7f8fa;
        }
      }
      /deep/.el-upload-list {
        display: none;
        .el-upload-list__item {
          margin-top: 10px;
          border-bottom: 1px dashed rgba(229, 230, 235, 1);
          &:hover {
            border-bottom: 1px dashed transparent;
          }
        }
      }
    }
    .upload-list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-top: 28px;
      .item {
        position: relative;
        display: flex;
        align-items: center;
        flex: 1;
        min-width: 48%;
        max-width: 48%;
        height: 38px;
        padding: 0 12px;
        border-radius: 4px;
        border-bottom: 1px dotted rgba(229, 230, 235, 1);
        &:hover {
          background: rgba(247, 248, 250, 1);
          border-bottom: 1px dotted transparent;
        }
        &:nth-child(2n-1) {
          margin-right: 24px;
        }
        .center {
          flex: 1;
          display: flex;
          align-items: center;
          .left-icon {
            margin: 0 10px;
          }
        }
        .right {
          .r-item {
            display: flex;
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
        .my-progress {
          position: absolute;
          bottom: 0;
          left: 12px;
          right: 12px;
        }
      }
    }
  }
}
// /deep/.el-message--warning {
//   .el-icon-warning {
//     &::before {
//       content: "";
//       color: red;
//     }
//   }
// }
</style>
