<template>

  <div class="review-material"> 
    <g-table-card :title="title">
      <template v-slot:cardInfo>
          <div class="cardInfo">
            {{cardInfo}}
          </div>
      </template>
      <template v-slot:content>
        <div class="content">
           <el-upload
        class="upload"
        drag
        :action="action"
        multiple
        :http-request="uploadBpmn"
       :file-list="fileList"
       :on-change="handleChange"
       :on-success="handleSuccess"
       :before-upload ="handleBefore"
       :on-error="handleError"
        >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>
        <div class="el-upload__tip" slot="tip">{{uploadTip}}</div>
        </div>
      </el-upload>
      <div class="upload-list">
        <div class="item" v-for="item,index in fileList" :key="index">
          <div class="left">{{`${index+1}.`}}</div>
          <div class="center">
            <g-icon class="left-icon" stylePx="16" href="#icon-mianxingtubiao"/>附件附件附件1.png
          </div>
          <div class="right">
             <div class="r-item progress" v-if="item.status === -1" >上传中...</div>
             <div class="r-item success" v-if="item.status === 1">
              <span class="s-item" @click="handleUploadLook(item.url)">预览</span>
              <span class="s-item" @click="handleUploadDelete(item)">删除</span>
            </div>
          <div class="r-item error" v-if="item.status === 0">
              上传失败
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
import {getFormGroups,deleteFormGroups} from "@/api/front.js"
// 核对要点
  export default {
    data(){
      return {
        title: '审查材料',
        cardInfo: "（上传的文件必须为同一个产品或活动的材料）",
        uploadTip:"支持zip/jpeg/jpg/png/pdf/doc/docx/xls/xlsx/mp4/ppt/pptx/txt/格式的文件，压缩包中文件名不得包含*&^%$_-+=等特殊字",
        uploadTip1:"*&^%$_-+=",
        judgment:"zip/jpeg/jpg/png/pdf/doc/docx/xls/xlsx/mp4/ppt/pptx/txt/",
        action: 'http://192.168.210.57:31602/cpr/file/upload',
        fileList: [],
      }
    },
    methods: {
      handleChange(file,fileList) {
  // this.fileList = fileList
      },
      handleSuccess(data,id) {
        console.log(data);
        this.fileList.forEach(item => {
          if(item.id === id) {
            item.key = data.key
            item.url = data.url
            item.status = 1
          }
        })
        
      },
      handleError (err,file,fileList) {
        console.log('handleError',err,file,fileList);
        file.status = 0
         this.fileList.forEach(item => {
          if(item.id === file.id) {
            item.status = 0
          }
        })
      },
      handleBefore (file) { // 上传文件之前钩子
        const type = file.name.replace(/.+\./, "")
        const judgeArr = this.judgment.split("/")
        const judgeRes = judgeArr.includes(type)
       this.fileList.push({
        name:file.name,
        id:file.uid,
        status:-1
        })
        if (!judgeRes) {
          this.$message({ type: 'error', message: '只支持zip/jpeg/jpg/png/pdf/doc/docx/xls/xlsx/mp4/ppt/pptx/txt/格式的文件！' })
          return false
        }
      },
      uploadBpmn(param) {
        const formData = new FormData()
        console.log(param);
        formData.append('mf', param.file) // 传入bpmn文件
        getFormGroups(formData).then(res => {
          console.log(res.data.data);
          // param.onSuccess(res.data.data)
          this.handleSuccess(res.data.data,param.file.uid)
        }).catch(err => {
           param.onError(data)
        })
      },
      handleUploadLook(url) {
        window.open(url)
      },
      handleUploadDelete(item) {
        deleteFormGroups({key: item.key}).then(res=> {
          console.log(res.data.data);
        // this.fileList.splice()
        })
      }
    }
  }
</script>

<style lang="less" scoped>


.review-material {
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
        padding:0 12px;
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
          flex:1;
          display: flex;
          align-items: center;
          .left-icon {
            margin:0 10px ;
          }
        }
        .right {
          .r-item  {
            display: flex;
          }
          .progress {
            color: rgba(134, 144, 156, 1);
          }
          .error {
            color: rgba(247, 101, 96, 1);
          }
          .success {
            .s-item {
              color: rgba(45, 92, 246, 1);
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
  
}
</style>