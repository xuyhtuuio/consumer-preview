<template>
  <div class="compare-body">
    <div class="return-1" @click="returnBack">
      <i class="el-icon-back"></i>
    </div>
    <div class="return-2" @click="returnBack">
      <i class="el-icon-close"></i>
    </div>
    <div class="compare-detail">
      <div class="compare-left">
        <div class="include-img">
          <ImagePreview
            url="http://192.168.210.51:9090/cpr/cpr_1697708778477_微信图片_20230906141828.jpg"
            :showEdit="false"
             @fullImage="fullScreen"
          ></ImagePreview>
        </div>
      </div>
      <div class="compare-right">
        <div class="compare-img">
          <div class="detail-header">
            <div class="header-left">
              <svg class="icon urgent-icon" aria-hidden="true">
                <use xlink:href="#icon-shenpiyemiantubiao"></use>
              </svg>
              <svg class="icon urgent-icon" aria-hidden="true">
                <use xlink:href="#icon-tongyongtubiao2"></use>
              </svg>
              <div class="detail-title">睿远平衡18月产品宣传图审核</div>
              <div class="line"></div>
              <div class="detail-title">产品类产品类产品类</div>
              <div class="line"></div>
              <div class="detail-title">任务单号：202308090023</div>
            </div>
          </div>
          <div class="detail-img">
            <div class="similar">相似度:98.7%</div>
            <div class="btn-prev">
              <img src="@/assets/image/home-index/prev.png" alt="" />
            </div>
            <div class="btn-next">
              <img src="@/assets/image/home-index/next.png" alt="" />
            </div>
            <div class="include-img">
              <ImagePreview
                url="http://192.168.210.51:9090/cpr/cpr_1697708778477_微信图片_20230906141828.jpg"
                :showEdit="false"
                @fullImage="fullScreen"
              ></ImagePreview>
            </div>
            <div class="compare-btn" style="bottom: 42px" @click="showDetail">
              <img src="@/assets/image/intelligent-recheck/pre-see.png" alt="">
              <div class="btn-word">查看详情</div>
            </div>
            <div class="compare-btn" style="bottom: 0" @click="showUserEdit">
              <img src="@/assets/image/intelligent-recheck/edit-input.png" alt="">
              <div class="btn-word">添加意见</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="preview" :class="{ fullScreen: showFullScreen }">
      <!-- 全屏关闭按钮 -->
      <i
        class="el-icon-circle-close"
        v-show="showFullScreen"
        @click="fullScreen"
      ></i>
      <!-- 图片 -->
      <FullImage
        ref="imgPreview1"
        url="http://192.168.210.51:9090/cpr/cpr_1697708778477_微信图片_20230906141828.jpg"
      ></FullImage>
      <!-- 其他类型文件 -->
      <div
        class="tool"
        v-if="showFullScreen"
      >
        <span @click="saveFile">
          <i
            ><img src="@/assets/image/intelligent-recheck/download.png" alt=""
          /></i>
          下载</span
        >
        <span @click="changeSize(1)">
          <i><img src="@/assets/image/intelligent-recheck/zoom-in.png" alt="" /></i>
          放大</span
        >
        <span @click="changeSize(0)">
          <i><img src="@/assets/image/intelligent-recheck/zoom-out.png" alt="" /></i>
          缩小</span
        >
      </div>
    </div>
    <DetailDialog ref="detailDia"></DetailDialog>
    <el-dialog
      title="提示"
      :visible.sync="editDialog"
      custom-class="edit-dialog"
      width="600"
      :before-close="editClose">
      <div class="show-num">
        <div class="num-left">该文件已被回检1次</div>
        <div class="num-left num-right">查看回检内容</div>
      </div>
      <div class="agree-change">
        <div class="agree-label">是否通过<span>*</span></div>
        <div>
          <el-radio v-model="userAgree" label="1">通过</el-radio>
          <el-radio v-model="userAgree" label="2">不通过</el-radio>
        </div>
      </div>
      <div class="agree-change">
        <div class="agree-label">回检意见<span style="color: transparent;">*</span></div>
        <div style="flex: 1">
          <el-input
            type="textarea"
            resize="none"
            :rows="3"
            placeholder="请输入回检意见"
            v-model="agreeInput">
          </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editClose">取 消</el-button>
        <el-button type="primary" @click="agreeClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { downloadStream } from '@/api/applyCenter'
import DetailDialog from './components/detail-dialog'
import ImagePreview from './components/imgae-preview'
import FullImage from './components/full-image'
export default {
  components: {
    ImagePreview,
    DetailDialog,
    FullImage
  },
  data: () => ({
    showFullScreen: false,
    editDialog: false,
    userAgree: '1',
    agreeInput: ''
  }),
  mounted() {
    window.toLink = this.toLink
  },
  methods: {
    agreeClick() {
      this.$message({
        type: 'success',
        dangerouslyUseHTMLString: true,
        message: '<div style=display:flex><div>已提交当前回检意见内容，可以在</div><div onclick = toLink() style=color:#2D5CF6;cursor:pointer;text-decoration: underline;>回检记录</div><div>中查看</div></div>',
      })
    },
    showUserEdit() {
      this.editDialog = true;
    },
    editClose() {
      this.editDialog = false;
    },
    returnBack() {
      this.$router.go(-1)
    },
    showDetail() {
      this.$refs.detailDia.show = true;
    },
    fullScreen() {
      this.showFullScreen = !this.showFullScreen;
      this.$nextTick(() => {
        this.$refs.imgPreview1.handleImageLoaded()
      })
    },
    toLink() {
      this.$router.push({
        name: 'recheck-record'
      })
    },
    saveFile() {
      const params = {
        key: this.item.key
      }
      this.$message.info('下载中，请稍等！')
      downloadStream(params).then((res) => {
        const disposition = res.headers['content-disposition']
        const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf;charset=utf-8' }))
        const link = document.createElement('a');
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', decodeURI(disposition.replace('attachment;filename=', '')))
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    changeSize(type) {
      this.$refs.imgPreview1.changeSize(type)
    },
  }
}
</script>

<style lang="less" scoped>
.compare-body {
  position: relative;
  .return-1,
  .return-2 {
    position: absolute;
    top: 32px;
    cursor: pointer;
    i {
      font-size: 24px;
    }
  }
  .return-1 {
    left: 32px;
  }
  .return-2 {
    right: 32px;
  }
  .compare-detail {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background: #fff;
    display: flex;
    .compare-left {
      flex: 9;
      border-right: 1px solid #e5e6eb;
      padding: 16px 51px;
      display: flex;
      justify-content: center;
      .include-img {
        flex: 1;
        max-width: 450px;
        height: 100%;
      }
    }
    .compare-right {
      flex: 11;
      padding: 16px;
      display: flex;
      .compare-img {
        flex: 1;
        display: flex;
        flex-direction: column;
        .detail-header {
          height: 34px;
          display: flex;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5e6eb;
          margin-bottom: 8px;
          .header-left {
            display: flex;
            align-items: center;
            .urgent-icon {
              width: 16px;
              height: 16px;
              margin-right: 4px;
            }
            .detail-title {
              color: #1d2128;
              font-size: 14px;
              font-style: normal;
              font-weight: 700;
              line-height: 22px;
              margin-right: 4px;
            }
            .line {
              margin: 0 8px;
              width: 1px;
              height: 13.5px;
              background-color: #e5e6eb;
            }
          }
          .header-right {
            color: #2d5cf6;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px;
            cursor: pointer;
          }
        }
        .detail-img {
          position: relative;
          flex: 1;
          padding: 0 119px;
          display: flex;
          justify-content: center;
          .include-img {
            flex: 1;
            max-width: 450px;
            height: 100%;
          }
          .similar {
            position: absolute;
            top: 0;
            left: 0;
            padding: 4px 8px;
            border-radius: 6px 0px 16px 0px;
            background: #2d5cf6;
            color: #fff;
            font-size: 10px;
            font-style: normal;
            font-weight: 700;
            line-height: 18px;
          }
          .btn-prev,
          .btn-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 32px;
            height: 32px;
            cursor: pointer;
            img {
              width: 32px;
              height: 32px;
            }
          }
          .btn-prev {
            left: 24px;
          }
          .btn-next {
            right: 24px;
          }
          .compare-btn {
            position: absolute;
            right: 24px;
            padding: 8px;
            display: flex;
            align-items: center;
            border-radius: 8px;
            border: 1px solid var(--gray-gray-4, #E5E6EB);
            background: var(--gray-gray-1, #FFF);
            box-shadow: 0px 0px 10px 0px rgba(67, 67, 67, 0.10);
            cursor: pointer;
            img {
              width: 16px;
              height: 16px;
              margin-right: 2px;
            }
            .btn-word {
              color: #505968;
              font-size: 14px;
              font-style: normal;
              font-weight: 400;
              line-height: 22px;
            }
          }
        }
      }
    }
  }
}
.preview {
  flex: 1;
}
.fullScreen {
  display: block;
  position: fixed;
  z-index: 100;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgb(0 0 0 / 23%);

  .preview {
    background: rgb(0 0 0 / 23%);
  }

  .el-icon-circle-close {
    position: absolute;
    font-size: 30px;
    color: #ffffff;
    right: 20px;
    top: 20px;
    z-index: 1;
    cursor: pointer;
  }

  iframe {
    width: calc(100% - 80px);
    margin-left: 40px;
  }
}
.tool{
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  z-index: 1;
  width: 248px;
  box-shadow: 0px 0px 10px 0px #4343431A;
  height: 38px;
  border-radius: 8px;
  background-color: #1D2128BF;
  span{
    i{
      margin-right: 2px;
      img{
        width: 16px;
        height: 16px;
      }
    }
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    color: #FFFFFF;
  }
}
</style>
<style lang="less">
.edit-dialog {
  .el-dialog__header {
    padding: 40px 60px 24px;
    text-align: center;
    .el-dialog__title {
      color:  #1D2128;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px;
    }
    .el-dialog__headerbtn {
      top: 40px;
      right: 40px;
      .el-dialog__close {
        font-size: 24px;
        color: #505968;
      }
    }
  }
  .show-num {
    padding: 4px 8px;
    border-radius: 4px;
    background: #FFF7E6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    .num-left {
      color: #FA8C16;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
    }
    .num-right {
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .el-dialog__body {
    padding: 0 60px 40px;
  }
  .agree-change {
    display: flex;
    align-items: flex-start;
    margin-bottom: 16px;
    .agree-label {
      color: #1D2128;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
      margin-right: 8px;
      span {
        color: #EB5757;
        margin-left: 4px;
      }
    }
    .el-radio {
      margin-right: 46px;
    }
  }
  .el-dialog__footer {
    text-align: center;
    .el-button {
      padding: 8px 40px;
      border-radius: 6px;
      border: 1px solid #CACDD3;
      color: #1D2128;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
    }
    .el-button--primary {
      color: #FFF;
      margin-left: 20px;
    }
  }
}
</style>
