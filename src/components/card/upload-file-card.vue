<template>
  <div class="upload-file-card">
    <p class="head" v-if="status !== 4">
      请上传最终上线版本，且已审批通过的材料
    </p>
    <el-upload
      v-if="status !== 4"
      class="upload-demo"
      drag
      :action="action"
      :http-request="uploadBpmn"
      :file-list="fileList"
      :on-success="handleSuccess"
      :before-upload="handleBefore"
      :on-error="handleError"
      :show-file-list="false"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        <p>将文件拖到此处，或<em>点击上传</em></p>
        <p>支持zip/jpg/png/pdf/doc/xls/mp4/ppt/txt/格式的文件</p>
      </div>
    </el-upload>
    <div :class="{ 'upload-list': true, status4: status == 4 }">
      <div class="item" v-for="(item, index) in fileList" :key="index">
        <div class="left">{{ `${index + 1}.` }}</div>
        <div class="center">
          <g-icon
            class="left-icon"
            stylePx="16"
            :href="fileSuffix[item.type]"
          />{{ item.name }}
        </div>
        <div class="right">
          <div class="r-item progress" v-if="item.status === -1">上传中...</div>
          <div
            class="r-item progress"
            v-if="item.status === 1 && !item.isClick"
          >
            上传完成
          </div>
          <div class="r-item error" v-if="item.status === -2 && !item.isClick">
            上传失败
          </div>
          <div class="r-item success" v-if="item.status === 1 && item.isClick">
            <span class="s-item" @click="handleUploadLook(item.url)">预览</span>
            <span
              class="s-item"
              @click="handleUploadDelete(item)"
              v-if="status !== 4"
              >删除</span
            >
            <span
              class="s-item"
              @click="handleDownload(item)"
              v-if="status == 4"
              >下载</span
            >
          </div>
          <div class="r-item error" v-if="item.status === -2 && item.isClick">
            <span class="s-item success" @click="handleUploadDelete(item)"
              >删除</span
            >
          </div>
        </div>
      </div>
    </div>
    <div v-if="status==4">
       <p class="downloadAll">下载全部</p>
    </div>
  </div>
</template>
<script>
import { getFormGroups, deleteFormGroups } from "@/api/front.js";
export default {
  name: "upload-file-card",
  components: {},
  props: {
    status: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      fileList: [
        {
          type: "zip",
          name: "压缩包.zip",
          status: 1,
          isClick: true,
        },
        {
          type: "xls",
          name: "压缩包.xls",
          status: 1,
          isClick: true,
        },
      ],
      judgment: "zip/jpeg/jpg/png/pdf/doc/docx/xls/xlsx/mp4/ppt/pptx/txt/",
      action: "http://192.168.210.57:31602/cpr/file/upload",
      fileSuffix: {
        zip: "#icon-zip",
        pdf: "icon-mianxingtubiao",
        doc: "#icon-mianxingtubiao-2",
        docx: "#icon-mianxingtubiao-2",
        xls: "#icon-mianxingtubiao-1",
        xlsx: "#icon-mianxingtubiao-1",
        mp4: "#icon-mp4",
        ppt: "#icon-file-ppt",
        pptx: "##icon-file-ppt",
        txt: "#icon-file-txt",
        jpeg: "#icon-picture",
        jpg: "#icon-picture",
        png: "#icon-picture",
      },
    };
  },
  methods: {
    handleSuccess(data, id) {
      this.fileList.forEach((item) => {
        if (item.id === id) {
          item.key = data.key;
          item.url = data.url;
          item.status = 1;
        }
      });
    },
    handleDownload() {
      this.$message.success("下载中");
    },
    handleError(id, file, fileList) {
      this.fileList.forEach((item) => {
        if (item.id === id) {
          item.status = -2;
          console.log("handleError", id, item);
        }
      });
    },
    // 上传文件
    uploadBpmn(param) {
      const formData = new FormData();
      console.log(param);
      formData.append("mf", param.file); // 传入bpmn文件
      getFormGroups(formData)
        .then((res) => {
          this.handleSuccess(res.data.data, param.file.uid);
        })
        .catch((err) => {
          param.onError(param.file.uid);
        });
    },
    handleUploadLook(url) {
      window.open(url);
    },
    handleMouseEnter(item) {
      item.isClick = true;
    },
    handleMouseLeave(item) {
      item.isClick = false;
    },
    handleBefore(file) {
      // 上传文件之前钩子
      const type = file.name.replace(/.+\./, "");
      const judgeArr = this.judgment.split("/");
      const judgeRes = judgeArr.includes(type);
      this.fileList.push({
        name: file.name,
        id: file.uid,
        status: -1,
        isClick: false,
        type: type,
      });
      if (!judgeRes) {
        this.$message({
          type: "error",
          message:
            "只支持zip/jpeg/jpg/png/pdf/doc/docx/xls/xlsx/mp4/ppt/pptx/txt/格式的文件！",
        });
        return false;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.upload-file-card {
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
      &:hover {
        background: rgba(247, 248, 250, 1);
        border-bottom: 1px dashed transparent;
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
  .status4{
    .item{
      .success{
        visibility: hidden;
      }
    }
    .item:hover{
      .success{
        visibility:visible;
      }
    }

  }
  .downloadAll{
    text-align: right;
    color:  #306EF5;
    cursor: pointer;
text-align: right;
font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: 22px; /* 157.143% */
text-decoration-line: underline;
margin-top: 16px;

  }
}
</style>