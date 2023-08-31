<template>
  <div class="container">
    <SideBar ref="sidebar"></SideBar>
    <div class="content">
      <div class="content-header">
        <span class="content-title">
          <svg
            class="icon urgent-icon"
            aria-hidden="true"
            v-if="formBase.urgent == 1"
          >
            <use xlink:href="#icon-shenpiyemiantubiao"></use>
          </svg>
          <svg
            class="icon urgent-icon"
            aria-hidden="true"
            v-if="formBase.dismissalMark == 1"
          >
            <use xlink:href="#icon-tongyongtubiao2"></use>
          </svg>
          {{ formBase.entryName }}</span
        >
        <span class="content-btns">
          <el-button @click="goBack"
            ><i class="iconfont icon-fanhui1"></i>返回</el-button
          >
          <el-button type="tuihui" @click="reject"
            ><i class="iconfont icon-tuihui1"></i>退回/驳回</el-button
          >
          <el-button type="primary" @click="showSubmit"
            ><i class="iconfont icon-tijiao"></i>结束任务</el-button
          >
        </span>
      </div>
      <div class="content-cont" v-loading="loading">
        <div v-show="compareList.length > 0" class="content-cont-header">
          <div class="all-similar">
            <span class="text"
              >总体文本比对相似度：{{
                totalsimilarity ? totalsimilarity : "--"
              }}</span
            >
            <span>
              <el-popover
                placement="bottom"
                popper-class="popper-style"
                width="200"
                trigger="click"
              >
                <div class="show-compare">
                  <div>
                    <div
                      class="compare-item"
                      v-for="(item, index) in compareList"
                      :key="'compare' + index"
                    >
                      <div class="item-index">{{ index + 1 }}.</div>
                      <div class="item-name">
                        <div class="name-item" style="margin-bottom: 10px">
                          <file-type
                            class="left-icon"
                            :fileName="item.fileName"
                          ></file-type>
                          {{ item.fileName }}
                        </div>
                        <div class="name-item">
                          <file-type
                            class="left-icon"
                            :fileName="item.otherFileName"
                          ></file-type>
                          {{ item.otherFileName }}
                        </div>
                      </div>
                      <div class="similar-level">
                        相似度：{{ item.similarity ? item.similarity : 0 }}
                      </div>
                    </div>
                  </div>
                </div>
                <div slot="reference">
                  详情<i
                    class="el-icon-caret-bottom"
                    style="margin-left: 4px"
                  ></i>
                </div>
              </el-popover>
            </span>
          </div>
          <div class="carousel-div">
            <div class="btn-prev" :class="{ 'not-allow': !canLeft }">
              <img
                src="@/assets/image/home-index/prev.png"
                alt=""
                @click="moveLeft"
              />
            </div>
            <div class="btn-next" :class="{ 'not-allow': !canRight }">
              <img
                src="@/assets/image/home-index/next.png"
                alt=""
                @click="moveRight"
              />
            </div>
            <div class="carousel-body" ref="carouselBody">
              <div class="item-body" id="itemBody" ref="itemBodyRef">
                <div
                  class="carousel-item"
                  :style="{ width: carouselWidth + 'px' }"
                  v-for="(item, index) in compareList"
                  :key="'compare-carousel' + index"
                  :class="{ 'active-item': activeIndex === index }"
                  @click="changeActive(item, index)"
                >
                  <div class="file-img" v-if="item.fileType === 'png'">
                    <img :src="item.url" alt="" />
                  </div>
                  <file-type
                    v-else
                    class="left-icon"
                    :fileName="item.fileName"
                  ></file-type>
                  <div class="item-text">
                    <div class="text-style color-text">
                      文本相似度：{{ item.similarity ? item.similarity : 0 }}
                    </div>
                    <div class="text-style">
                      {{ item.fileName }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Empty v-if="compareList.length === 0"></Empty>
        <div class="file-view" v-if="compareList.length > 0">
          <div class="view-left">
            <div class="view-top">
              <div class="top-page">
                共 <span class="page-weight">{{ activeIndex + 1 }}</span> /{{
                  compareList.length
                }}
              </div>
              <div class="view-name">初版材料</div>
              <span class="header-btns">
                <i class="iconfont" @click="saveFile(1)">&#xe62e;</i>
                <i class="iconfont" @click="fullScreen(1)">&#xe62f;</i>
              </span>
            </div>
            <ImagePreview
              v-if="activeItem.otherFileType === 'png'"
              :url="activeItem.otherUrl"
            ></ImagePreview>
            <FilePreview v-else :url="activeItem.otherUrl"></FilePreview>
          </div>
          <div class="view-right">
            <div class="view-top">
              <div class="top-page">
                共 <span class="page-weight">{{ activeIndex + 1 }}</span> /{{
                  compareList.length
                }}
              </div>
              <div class="view-name">最终上线版本</div>
              <span class="header-btns">
                <i class="iconfont" @click="saveFile(2)">&#xe62e;</i>
                <i class="iconfont" @click="fullScreen(2)">&#xe62f;</i>
              </span>
            </div>
            <ImagePreview
              v-if="activeItem.fileType === 'png'"
              :url="activeItem.url"
            ></ImagePreview>
            <FilePreview v-else :url="activeItem.url"></FilePreview>
          </div>
        </div>
      </div>
    </div>
    <reject-dialog ref="rejectDialog" :formBase="formBase"></reject-dialog>
    <div class="fullScreen-none" :class="{ fullScreen: showFullScreen }">
      <!-- 全屏关闭按钮 -->
      <i
        class="el-icon-circle-close"
        v-show="showFullScreen"
        @click="fullScreen(1)"
      ></i>
      <!-- 图片 -->
      <div class="perview-div" v-if="fullScreenType === 1">
        <ImagePreview
          v-if="activeItem.otherFileType === 'png'"
          :url="activeItem.otherUrl"
        ></ImagePreview>
        <FilePreview v-else :url="activeItem.otherUrl"></FilePreview>
      </div>
      <div class="perview-div" v-if="fullScreenType === 2">
        <ImagePreview
          v-if="activeItem.fileType === 'png'"
          :url="activeItem.url"
        ></ImagePreview>
        <FilePreview v-else :url="activeItem.url"></FilePreview>
      </div>
    </div>
    <SecondaryConfirmation
      :option="option"
      ref="confirmation"
      @handleConfirm="endTaskSubmit"
    ></SecondaryConfirmation>
  </div>
</template>

<script>
import rejectDialog from "./dialogs/reject-dialog";
import SideBar from "../aiApproval/sidebar/sidebar";
import FileType from "@/components/common/file-type";
import SecondaryConfirmation from "@/components/common/secondaryConfirmation";
import ImagePreview from "./image-preview";
import FilePreview from "@/components/filePreview";
import { download } from "@/api/aiApproval";
import { dualScreenPreview, endTask } from "@/api/approvalCenter";
import { getApplyForm } from "@/api/front";
export default {
  name: "compare",
  components: {
    rejectDialog,
    FileType,
    SecondaryConfirmation,
    SideBar,
    ImagePreview,
    FilePreview,
  },
  data() {
    return {
      canLeft: false,
      canRight: false,
      carouselWidth: 0,
      itemBodyWidth: 0,
      bodyClientWidth: 0,
      scrollX: 0,
      showFullScreen: false,
      approval: {
        url: "http://192.168.210.51:9090/cpr/cpr_1692584431222_认证与上网.pdf",
      },
      compareList: [],
      formBase: {},
      totalsimilarity: "",
      activeIndex: 0,
      activeItem: {},
      fullScreenType: 1,
      loading: true,
      option: {
        message: '确认结束后该申请单结束流转，不可再进行修改',
        cancelBtn: '取消',
        confirmBtn: '确认',
      }
    };
  },
  mounted() {
    if (!this.$route.params.item) {
      this.$router.go(-1);
      return;
    }
    const { item } = this.$route.params;
    this.formId = item.taskNumber;
    this.inDraft = item.draftFlag === 1;
    this.formCategoryId = item.formManagementId;
    this.init(item);
    this.formBase = item;
    window.addEventListener("resize", this.resize, true);
    this.carouselWidth = Number(
      ((this.$refs.carouselBody.clientWidth - 40) / 6).toFixed(2)
    );
    this.itemBodyWidth = this.$refs.itemBodyRef.clientWidth.toFixed(2);
    this.bodyClientWidth = this.$refs.carouselBody.clientWidth.toFixed(2);
    this.getInfo();
  },
  methods: {
    // 获取工单基本信息
    init(item) {
      getApplyForm({
        formCategoryId: this.formCategoryId,
        formId: this.formId,
      }).then((res) => {
        const { data, status, message } = res.data;
        if (status === 200) {
          this.$refs.sidebar.tools[0].sidebarParam = { ...data };
          // if(data.keyPointsForVerification) {
          //   this.$refs.refExamine.list = [...data.keyPointsForVerification];
          // }
        } else {
          this.$message.error({ offset: 40, title: "提醒", message });
        }
      });
      // 先获取工单基本信息，，然后判断获取草稿或初始化  文件信息
      // this.getFileList();
    },
    resize() {
      this.carouselWidth = Number(
        ((this.$refs.carouselBody.clientWidth - 40) / 6).toFixed(2)
      );
      this.itemBodyWidth = this.$refs.itemBodyRef.clientWidth.toFixed(2);
      this.bodyClientWidth = this.$refs.carouselBody.clientWidth.toFixed(2);
    },
    moveLeft() {
      if (this.canLeft && this.compareList.length > 6) {
        this.scrollX = this.scrollX + this.carouselWidth + 8;
        let element = document.getElementById("itemBody");
        element.style.transform = `translateX(${this.scrollX}px)`;
        element.style.transition = "all 0.5s";
        if (this.scrollX >= 0) {
          this.canLeft = false;
          this.canRight = true;
        }
      }
    },
    moveRight() {
      let length = document.querySelectorAll(".carousel-item").length;
      if (this.canRight && this.compareList.length > 6) {
        this.scrollX = this.scrollX - this.carouselWidth - 8;
        let element = document.getElementById("itemBody");
        element.style.transform = `translateX(${this.scrollX}px)`;
        element.style.transition = "all 0.5s";
        if (
          this.scrollX <=
          this.bodyClientWidth - (this.carouselWidth + 8) * length + 8
        ) {
          this.canLeft = true;
          this.canRight = false;
        }
      }
    },
    reject() {
      this.$refs.rejectDialog.init();
    },
    showSubmit() {
      this.$refs.confirmation.dialogVisible = true;
    },
    endTaskSubmit() {
      let data = {
        taskId: this.formBase.taskId
      }
      endTask(data).then(res => {
        if (res.status == 200) {
          this.$message.success(res.data.msg);
          this.goBack();
        } else {
          this.$message.success(res.data.msg);
        }
      }).catch(err => {
        this.$message.success('申请单结束流转失败');
      })
    },
    // 获取线上对比数据
    getInfo() {
      this.loading = true;
      const param = {
        formId: this.formId,
        processInstanceId: this.formBase.processInstanceId,
      };
      dualScreenPreview(param)
        .then((res) => {
          if (res.data.data) {
            this.compareList = res.data.data.result;
            this.totalsimilarity = res.data.data.totalSimilarity;
            this.activeItem = this.compareList[0];
            this.loading = false;
          } else {
            this.loading = false;
          }
        })
        .catch((err) => {
          this.loading = false;
        });
      // this.compareList = [
      //   {
      //     fileName: "上网认证1.pdf",
      //     url: "http://192.168.210.51:9090/cpr/cpr_1692584431222_认证与上网.pdf",
      //     otherFileName: "图片22.png",
      //     otherUrl:
      //       "http://192.168.210.51:9090/cpr/cpr_1692588542064_Snipaste_test.png",
      //     fileType: "pdf",
      //     otherFileType: "png",
      //     similarity: 1,
      //   },
      //   {
      //     fileName: "图片.png",
      //     url: "http://192.168.210.51:9090/cpr/cpr_1692588542064_Snipaste_test.png",
      //     otherFileName: "图片22.png",
      //     otherUrl:
      //       "http://192.168.210.51:9090/cpr/cpr_1692588542064_Snipaste_test.png",
      //     fileType: "png",
      //     otherFileType: "png",
      //     similarity: 1,
      //   },
      //   {
      //     fileName: "上网认证1.pdf",
      //     url: "http://192.168.210.51:9090/cpr/cpr_1692584431222_认证与上网.pdf",
      //     otherFileName: "上网认证11.pdf",
      //     otherUrl:
      //       "http://192.168.210.51:9090/cpr/cpr_1692584431222_认证与上网.pdf",
      //     fileType: "pdf",
      //     otherFileType: "pdf",
      //     similarity: 1,
      //   },
      //   {
      //     fileName: "上网认证1.pdf",
      //     url: "http://192.168.210.51:9090/cpr/cpr_1692584431222_认证与上网.pdf",
      //     otherFileName: "上网认证11.doc",
      //     otherUrl:
      //       "http://192.168.210.51:9090/cpr/cpr_1692584431222_认证与上网.pdf",
      //     fileType: "pdf",
      //     otherFileType: "pdf",
      //     similarity: 1,
      //   },
      //   {
      //     fileName: "上网认证2.doc",
      //     url: "http://192.168.210.51:9090/cpr/cpr_1692584431222_认证与上网.pdf",
      //     otherFileName: "上网认证22.pdf",
      //     otherUrl:
      //       "http://192.168.210.51:9090/cpr/cpr_1692584431222_认证与上网.pdf",
      //     fileType: "pdf",
      //     otherFileType: "pdf",
      //     similarity: 1,
      //   },
      //   {
      //     fileName: "上网认证1.pdf",
      //     url: "http://192.168.210.51:9090/cpr/cpr_1692584431222_认证与上网.pdf",
      //     otherFileName: "上网认证11.pdf",
      //     otherUrl:
      //       "http://192.168.210.51:9090/cpr/cpr_1692584431222_认证与上网.pdf",
      //     fileType: "pdf",
      //     otherFileType: "pdf",
      //     similarity: 1,
      //   },
      //   {
      //     fileName: "上网认证1.pdf",
      //     url: "http://192.168.210.51:9090/cpr/cpr_1692584431222_认证与上网.pdf",
      //     otherFileName: "上网认证11.doc",
      //     otherUrl:
      //       "http://192.168.210.51:9090/cpr/cpr_1692584431222_认证与上网.pdf",
      //     fileType: "pdf",
      //     otherFileType: "pdf",
      //     similarity: 1,
      //   },
      //   {
      //     fileName: "上网认证2.doc",
      //     url: "http://192.168.210.51:9090/cpr/cpr_1692584431222_认证与上网.pdf",
      //     otherFileName: "上网认证22.pdf",
      //     otherUrl:
      //       "http://192.168.210.51:9090/cpr/cpr_1692584431222_认证与上网.pdf",
      //     fileType: "pdf",
      //     otherFileType: "pdf",
      //     similarity: 1,
      //   },
      //   {
      //     fileName: "上网认证1.pdf",
      //     url: "http://192.168.210.51:9090/cpr/cpr_1692584431222_认证与上网.pdf",
      //     otherFileName: "上网认证11.pdf",
      //     otherUrl:
      //       "http://192.168.210.51:9090/cpr/cpr_1692584431222_认证与上网.pdf",
      //     fileType: "pdf",
      //     otherFileType: "pdf",
      //     similarity: 1,
      //   },
      // ];

      if (this.compareList.length > 6) {
        this.canRight = true;
      }
      // this.totalsimilarity = "100%";
    },
    changeActive(item, index) {
      this.activeItem = item;
      this.activeIndex = index;
    },
    // 返回
    goBack(backNow) {
      this.$router.go(-1);
    },
    saveFile(type) {
      let key = "";
      if (type === 1) {
        key = this.activeItem.otherKey;
      } else if (type === 2) {
        key = this.activeItem.key;
      }
      download({ key: key })
        .then((res) => {
          const { data, status } = res.data;
          if (status === 200) {
            window.open(data);
          }
        })
        .catch(() => {
          this.list = [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
    fullScreen(type) {
      this.showFullScreen = !this.showFullScreen;
      this.fullScreenType = type;
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize, true);
  },
};
</script>

<style lang="less" scoped>
.container {
  display: flex;

  // height: 100%;
  .tools {
    background: #ffffff;
    width: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 60px;
    flex-shrink: 0;
  }

  .content {
    flex: 1;
    display: flex;
    padding: 16px 24px;
    flex-direction: column;
    width: calc(100% - 60px);
  }
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .el-button {
    line-height: 22px;
    padding: 6px 16px;
    border: none;
  }
}

.content-title {
  font-size: 16px;
  font-weight: 700;

  i {
    color: #eb5d78;
    margin-right: 12px;
  }
}

.content-btns {
  margin-left: 20px;
  white-space: pre;

  .iconfont {
    font-size: 20px;
    margin-right: 4px;
  }

  /deep/ .el-button {
    > span {
      display: flex;
    }
  }

  .el-button--tuihui {
    background: #ffffff;
    color: #eb5757;
  }
}

.content-cont {
  flex: 1;
  display: flex;
  gap: 12px;
  overflow: hidden;
  flex-direction: column;
  .content-cont-header {
    width: 100%;
    height: 118px;
    padding: 8px 16px 12px;
    border-radius: 8px;
    background: #fff;
    .all-similar {
      height: 34px;
      padding: 6px 0;
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      .text {
        color: #eb5757;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;
        margin-right: 8px;
      }
      /deep/.el-popover__reference {
        cursor: pointer;
        color: #2d5cf6;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
      }
    }
    .carousel-div {
      height: 60px;
      position: relative;
      .btn-prev,
      .btn-next {
        position: absolute;
        top: 18px;
        width: 24px;
        height: 24px;
        cursor: pointer;
        img {
          width: 24px;
          height: 24px;
        }
      }
      .not-allow {
        cursor: not-allowed;
      }
      .btn-next {
        right: 0;
      }
      .carousel-body {
        margin: 0 32px;
        height: 60px;
        overflow: hidden;
        .item-body {
          display: flex;
        }
        .carousel-item {
          border-radius: 6px;
          border: 1px solid #e5e6eb;
          background: #fff;
          height: 60px;
          cursor: pointer;
          margin-right: 8px;
          display: flex;
          align-items: center;
          padding: 8px;
          flex-shrink: 0;
          .icon {
            flex-shrink: 0;
            width: 36px;
            height: 36px;
            margin-right: 6px;
          }
          .file-img {
            flex-shrink: 0;
            width: 36px;
            height: 36px;
            margin-right: 6px;
            border-radius: 4px;
            border: 1px solid #306ef5;
            overflow: hidden;
            box-shadow: 0px 0px 10px 0px rgba(62, 114, 239, 0.4);
            img {
              width: 36px;
              height: 36px;
            }
          }
          .item-text {
            .text-style {
              color: #333;
              font-size: 14px;
              font-style: normal;
              line-height: 22px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
            }
            .color-text {
              color: #eb5757;
            }
          }
        }
        .active-item {
          border-radius: 6px;
          border: 1px solid #2d5cf6;
          background: #f0f6ff;
          .color-text {
            color: #eb5757;
            font-weight: 700;
          }
        }
      }
    }
  }
  .file-view {
    flex: 1;
    display: flex;
    .view-left,
    .view-right {
      flex: 1;
      flex-shrink: 0;
      border-radius: 10px 10px 0px 0px;
      background: #fff;
      padding: 16px;
      .view-top {
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        .top-page {
          color: #1d2128;
          font-size: 12px;
          font-style: normal;
          font-weight: 700;
          line-height: 20px;
          .page-weight {
            color: #2d5cf6;
            font-size: 14px;
          }
        }
        .view-name {
          color: #1d2128;
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
          line-height: 22px;
        }
        i + i::before {
          content: " ";
          width: 1px;
          height: 12px;
          display: inline-block;
          margin: 0 10px;
          background: #cacdd3;
          cursor: default;
        }
        .iconfont {
          font-size: 20px;
          margin-right: 4px;
          color: #505968;
          cursor: pointer;
        }
      }
    }
    .view-left {
      margin-right: 16px;
    }
  }
}

.preview {
  background: #ffffff;
  flex: 1;
}
.fullScreen-none {
  display: none;
}
.fullScreen {
  display: block;
  position: fixed;
  z-index: 10;
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
/deep/ .preview-dialog {
  height: 80vh;

  .el-dialog__body {
    height: 96%;
  }
}
.perview-div {
  width: 100%;
  height: 100%;
}
</style>
<style lang="less">
.sidebar-popper {
  border-radius: 10px;
  background: #fff;
  padding: 24px;
  height: calc(100% - 52px);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.15);
  left: 64px !important;
  top: 50px !important;
}

svg.leader-line {
  z-index: 2;
}

.preview-dialog {
  .el-dialog__body {
    height: 76vh;
  }
}
.popper-style {
  padding: 24px;
  width: 400px !important;
  .show-compare {
    max-height: 430px;
    overflow-y: scroll;
    .compare-item {
      height: 70px;
      display: flex;
      align-items: center;
      padding: 8px 12px;
      .item-index {
        color: #505968;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        height: 100%;
        margin-right: 10px;
        flex-shrink: 0;
      }
      .item-name {
        flex: 1;
        .name-item {
          color: #1d2128;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 22px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
      .similar-level {
        color: #eb5757;
        text-align: right;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        margin-left: 12px;
      }
    }
  }
}
</style>
