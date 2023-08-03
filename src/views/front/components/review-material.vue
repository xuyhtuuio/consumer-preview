<template>
  <div class="review-material" ref="globalRef" v-if="list.length">
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
            :on-success="handleSuccess"
            :before-upload="handleBefore"
            :on-error="handleError"
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
                <file-type class="left-icon" :fileName="item.name || item.fileName"></file-type>
                {{ item.name || item.fileName }}
              </div>
              <div class="right">
                <div class="r-item progress" v-if="item.status === -1">上传中...</div>
                <div class="r-item progress" v-if="item.status === 1 && !item.isClick">
                  上传完成
                </div>
                <div class="r-item error" v-if="item.status === -2 && !item.isClick">上传失败</div>
                <div class="r-item success" v-if="item.status === 1 && item.isClick">
                  <span class="s-item" @click="handleUploadLook(item.url)">预览</span>
                  <span class="s-item" @click="handleUploadDelete(item)">删除</span>
                </div>
                <div class="r-item error" v-if="item.status === -2 && item.isClick">
                  <span class="s-item success" @click="handleUploadDelete(item)">删除</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </g-table-card>
  </div>
</template>

<script>
import WarnInfo from './warn-info.vue';
import { getFormGroups, deleteFormGroups } from '@/api/front.js';
import FileType from '@/components/common/file-type';
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
      }
    };
  },
  watch: {
    list(newVal) {
      if (newVal.length) {
        this.fileList = newVal[0].value;
        this.fileList.length &&
          this.fileList.forEach(item => {
            item.status = 1;
            item.name = item.fileName;
            item.type = item.fileName.replace(/.+\./, '');
            this.$set(item, 'isClick', false);
          });
      }
    },
    'fileList.length'() {
      if (this.judgeWarnFlag) this.judgeWarnFlag = false;
    }
  },
  methods: {
    handleSuccess(data, id) {
      console.log('handleSuccess', data);
      this.fileList.forEach(item => {
        if (item.id === id) {
          item.key = data.key;
          item.url = data.url;
          item.status = 1;
        }
      });
    },
    handleError(id, file, fileList) {
      this.fileList.forEach(item => {
        if (item.id === id) {
          item.status = -2;
          console.log('handleError', id, item);
        }
      });
    },
    handleBefore(file) {
      // 上传文件之前钩子
      const type = file.name.replace(/.+\./, '');
      const judgeArr = this.judgment.split('/');
      const judgeRes = judgeArr.includes(type);
      // const judgeName = file.name.replace(`.${type}`,"")
      // const pattern = new RegExp(`${this.uploadTip1}`);
      // if(pattern.test(judgeName)){
      //   this.$message({
      //     type: 'error',
      //     message: '只支持zip/jpeg/jpg/png/pdf/doc/docx/xls/xlsx/mp4/ppt/pptx/txt/格式的文件！'
      //   });
      // }
      if (!judgeRes) {
        this.$message({
          type: 'error',
          message: '只支持zip/jpeg/jpg/png/pdf/doc/docx/xls/xlsx/mp4/ppt/pptx/txt/格式的文件！'
        });
        return false;
      }
      this.fileList.push({
        name: file.name,
        id: file.uid,
        status: -1,
        isClick: false,
        type: type
      });
      
    },
    // 上传文件
    uploadBpmn(param) {
      const formData = new FormData();
      console.log(param);
      formData.append('mf', param.file); // 传入bpmn文件
      getFormGroups(formData)
        .then(res => {
          console.log(res.data.data);
          // param.onSuccess(res.data.data)
          this.handleSuccess(res.data.data, param.file.uid);
        })
        .catch(err => {
          param.onError(param.file.uid);
        });
    },
    handleUploadLook(url) {
      let routeUrl = this.$router.resolve({
        name: 'showReview',
        query: {
          url
        }
      });
      window.open(routeUrl.href, '_blank');
    },
    //删除图片
    handleUploadDelete(item) {
      deleteFormGroups({ key: item.key }).then(res => {
        const idx = this.fileList.findIndex(iten => iten.key === item.key);
        this.fileList.splice(idx, 1);
        this.$message({ type: 'success', message: res.data.data });
      });
    },
    handleMouseEnter(item) {
      item.isClick = true;
    },
    handleMouseLeave(item) {
      item.isClick = false;
    },

    judgeWarn(flag = true) {
      const offsetTop = this.$refs['globalRef'].offsetTop;
      if (this.fileList.some(item => item.status === -2)) {
        this.warnInfoMessage(this.info.err);
        flag && (this.judgeWarnFlag = true);
        return [false, offsetTop];
      }
      if (this.fileList.some(item => item.status === -1)) {
        this.warnInfoMessage(this.info.errT);
        flag && (this.judgeWarnFlag = true);
        return [false, offsetTop];
      }
      if (!this.fileList.length) {
        if (flag) {
          this.judgeWarnFlag = true;
          return [false, offsetTop];
        } else {
          return [true];
        }
      }
      return [true];
    },
    warnInfoMessage( message, type = 'warning', customClass = 'el-icon-warning-one') {
      this.$message({
        type,
        customClass,
        message
      });
    }
  }
};
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