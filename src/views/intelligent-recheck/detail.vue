<template>
  <div class="detail">
    <div class="detail-body">
      <div class="detail-top">
        <div class="detail-input">
          <div class="input-left">
            <el-input
              placeholder="请输入关键词或上传图片进行回检"
              v-model="recheckInput"
              class="input-with-select"
            >
              <el-select v-model="select" slot="prepend" placeholder="请选择">
                <el-option label="按文件名称" value="1"></el-option>
                <el-option label="按文本内容" value="2"></el-option>
              </el-select>
              <div slot="append">
                <div class="append-set">
                  <div class="upload">
                    <i class="el-icon-camera" @click="showUpload"></i>
                  </div>
                </div>
              </div>
            </el-input>
          </div>
          <div class="input-right">
            <div class="right-tip">查看回检记录</div>
            <img src="@/assets/image/intelligent-recheck/txt.png" alt="" />
          </div>
        </div>
        <div class="list-select">
          <div class="select-left">
            <div class="select-item">
              <el-select
                v-model="selectType"
                slot="prepend"
                placeholder="选择文件格式"
              >
                <el-option label="png" value="1"></el-option>
                <el-option label="pdf" value="2"></el-option>
              </el-select>
            </div>
            <div class="select-item select-org">
              <el-select
                v-model="selectOrg"
                slot="prepend"
                placeholder="选择机构"
              >
                <el-option label="总行" value="1"></el-option>
                <el-option label="分行" value="2"></el-option>
              </el-select>
              <img src="@/assets/image/intelligent-recheck/tip.png" alt="" />
            </div>
            <div class="select-item select-time">
              <el-select
                v-model="selectTime"
                slot="prepend"
                placeholder="上线时间"
              >
                <el-option label="今天" value="1"></el-option>
                <el-option label="昨天" value="2"></el-option>
              </el-select>
            </div>
            <div class="select-item select-time">
              <el-select
                v-model="selectTime"
                slot="prepend"
                placeholder="提单时间"
              >
                <el-option label="今天" value="1"></el-option>
                <el-option label="昨天" value="2"></el-option>
              </el-select>
            </div>
            <div class="select-item select-time">
              <el-select
                v-model="selectTime"
                slot="prepend"
                placeholder="是否回检"
              >
                <el-option label="今天" value="1"></el-option>
                <el-option label="昨天" value="2"></el-option>
              </el-select>
            </div>
          </div>
          <div class="select-right">
            <div class="right-total">
              共 <span class="total-weight">{{ total }}</span> 条
            </div>
            <div
              class="sort-item"
              :class="{ active: item.label === activeSort.label }"
              v-for="(item, index) in sortList"
              :key="'sort' + index"
              @click="changeSort(item)"
            >
              <div>{{ item.label }}</div>
              <i v-if="item.sort === 'desc'" class="el-icon-bottom"></i>
              <i v-if="item.sort === 'asc'" class="el-icon-top"></i>
            </div>
            <div class="right-icon">
              <img src="@/assets/image/intelligent-recheck/icon1.png" alt="" />
            </div>
            <div class="right-icon">
              <img src="@/assets/image/intelligent-recheck/icon2.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div class="detail-bottom">
        <div class="bottom-left">
          <div class="img-header">
            <span class="header-btns">
              <i class="iconfont">&#xe62e;</i>
              <i class="iconfont" @click="fullScreen(1)">&#xe62f;</i>
            </span>
          </div>
          <div class="img-show">
            <div class="preview" :class="{ fullScreen: showFullScreen }">
              <!-- 全屏关闭按钮 -->
              <i
                class="el-icon-circle-close"
                v-show="showFullScreen"
                @click="fullScreen()"
              ></i>
              <!-- 图片 -->
              <div class="perview-div">
                <ImagePreview :url="item.url" ref="imgPreview"></ImagePreview>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom-right" v-loading="loading">
          <div class="total-list">
            <el-row :gutter="16">
              <el-col
                :span="6"
                v-for="(item, index) in totalList"
                :key="'list' + index"
              >
                <div class="list-item" @click="showScreen(item)">
                  <div class="num">
                    {{ (item.distance * 100).toFixed(2) }}%{{
                      item.formCategoryName
                    }}
                  </div>
                  <img :src="item.fileUrl" alt="" />
                  <div class="item-title">{{ item.fileName }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
          <TrsPagination
            v-if="total"
            class="trs-pagination"
            :pageSize="pageSize"
            :pageNow="pageNum"
            :total="total"
            @getList="handleCurrentChange"
            scrollType="scrollCom"
            scrollName="scrollCom"
          >
          </TrsPagination>
        </div>
      </div>
    </div>
    <UploadDialog ref="uploadDia"></UploadDialog>
    <ImgDialog ref="imgDia" :url="listItemActive.fileUrl" :item="listItemActive"></ImgDialog>
  </div>
</template>

<script>
import { getSimilarityComparisonList } from '@/api/intelligent-recheck'
import UploadDialog from './components/upload-dialog'
import ImgDialog from './components/img-dialog'
import ImagePreview from './components/imgae-preview'
export default {
  components: {
    UploadDialog,
    ImgDialog,
    ImagePreview
  },
  data: () => ({
    recheckInput: '',
    select: '1',
    selectType: '',
    selectOrg: '',
    selectTime: '',
    showFullScreen: false,
    sortList: [
      {
        label: '按相似度',
        val: 1,
        sort: 'desc'
      },
      {
        label: '按上线时间',
        val: 3,
        sort: 'desc'
      },
      {
        label: '按提单时间',
        val: 2,
        sort: 'desc'
      }
    ],
    activeSort: {
      label: '按相似度',
      val: 1,
      sort: 'desc'
    },
    total: 0,
    pageSize: 8,
    pageNum: 1,
    item: {},
    loading: false,
    totalList: [],
    listItemActive: {
      fileUrl: ''
    }
  }),
  created() {
    if (this.$route.params.item) {
      this.item = this.$route.params.item
      this.getSimilarityComparisonList()
    } else {
      this.$router.go(-1)
    }
  },
  methods: {
    showUpload() {
      this.$refs.uploadDia.turnDialog = true
    },
    changeSort(item) {
      if (item.label === this.activeSort.label) {
        this.activeSort.sort = item.sort === 'desc' ? 'asc' : 'desc'
        this.sortList.forEach((ite) => {
          if (this.activeSort.label === ite.label) {
            ite.sort = this.activeSort.sort
          }
        })
      } else {
        this.sortList.forEach((ite) => {
          ite.sort = 'desc'
        })
        this.activeSort = {
          label: item.label,
          val: item.val,
          sort: 'desc'
        }
      }
      this.pageNum = 1
      this.getSimilarityComparisonList()
    },
    fullScreen() {
      this.showFullScreen = !this.showFullScreen
      this.$nextTick(() => {
        this.$refs.imgPreview.handleImageLoaded()
      })
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getSimilarityComparisonList()
    },
    showScreen(item) {
      this.listItemActive = item;
      this.$refs.imgDia.imgDialog = true
    },
    getSimilarityComparisonList() {
      this.loading = true
      const data = {
        fileKey: this.item.key,
        pageNow: this.pageNum,
        pageSize: this.pageSize,
        sort: this.activeSort.val,
        sortType: this.activeSort.sort === 'desc' ? 1 : 2
      }
      getSimilarityComparisonList(data)
        .then((res) => {
          if (res.data.status === 200) {
            this.totalList = res.data.data.list.map((v) => {
              return {
                ...v,
                taskNumber: v.formId + '',
                taskName: v.entryName,
                initiator: {
                  ...v.originator,
                  label: v.institutional && v.institutional[1]
                },
                taskStatus: v.nodeStatus
              }
            })
            this.total = res.data.data.totalCount
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.detail-body {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  .detail-top {
    padding: 16px 24px 12px;
    border-bottom: 1px solid #e5e6eb;
  }
  .detail-input {
    display: flex;
    align-items: center;
    margin-bottom: 13px;
    .input-left {
      flex: 1;
      border-radius: 20px;
      overflow: hidden;
      background-color: #f2f3f5;
      padding: 0 20px;
      /deep/ .el-input {
        height: 40px;
        .el-icon-arrow-up::before {
          content: '\e78f';
        }
        .el-input__inner {
          height: 40px;
          border: none;
          background-color: #f2f3f5;
        }
        .el-input-group__prepend {
          border: none;
          .el-select {
            width: 105px;
            display: flex;
            align-items: center;
            background-color: #f2f3f5;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
            color: #505968;
            .el-input__inner {
              padding-left: 0;
            }
          }
          .el-select::after {
            content: '';
            display: inline-block;
            width: 1px;
            height: 16px;
            background-color: #cacdd3;
          }
        }
        .el-input-group__append {
          height: 40px;
          border: none;
          background: #f2f3f5;
          .append-set {
            display: flex;
            align-items: center;
            .recheck-btn {
              color: #fff;
              font-size: 14px;
              font-style: normal;
              font-weight: 700;
              line-height: 40px;
              cursor: pointer;
            }
            .upload {
              width: 40px;
              height: 40px;
              margin-right: 20px;
              background: #f2f3f5;
              margin-right: -20px;
              display: flex;
              align-items: center;
              justify-content: center;
              .el-icon-camera {
                width: 20px;
                height: 20px;
                font-size: 20px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
    .input-right {
      margin-left: 18px;
      width: 124px;
      display: flex;
      align-items: center;
      cursor: pointer;
      .right-tip {
        color: #1d2128;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        margin-right: 8px;
      }
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
  .list-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .select-left {
      display: flex;
      align-items: center;
      .select-item {
        margin-right: 24px;
        display: flex;
        align-items: center;
        width: 104px;
        /deep/.el-select {
          height: 22px;
          .el-input__inner {
            height: 22px;
            border: none;
            padding: 0 20px 0 0;
            color: #1d2128;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
          }
          .el-input__icon {
            width: 16px;
          }
          .el-icon-arrow-up::before {
            content: '\e78f';
          }
        }
        img {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
      }
      .select-org {
        width: 104px;
        /deep/.el-select {
          width: 78px;
        }
      }
      .select-time {
        width: 76px;
      }
    }
    .select-right {
      display: flex;
      align-items: center;
      .right-total {
        color: #1d2128;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        margin-right: 24px;
        .total-weight {
          color: #2d5cf6;
          font-weight: 700;
        }
      }
      .sort-item {
        color: #505968;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
        display: flex;
        align-items: center;
        margin-right: 16px;
        cursor: pointer;
      }
      .right-icon {
        width: 24px;
        height: 24px;
        margin-right: 8px;
        img {
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      }
      .active {
        color: #2d5cf6;
      }
    }
  }
  .detail-bottom {
    padding: 16px 24px;
    flex: 1;
    width: 100%;
    display: flex;
    overflow: scroll;
    .bottom-left {
      width: 400px;
      border-radius: 10px;
      border: 1px solid #f2f3f5;
      background: #f7f8fa;
      margin-right: 16px;
      display: flex;
      flex-direction: column;
      .img-header {
        padding-top: 8px;
        display: flex;
        justify-content: flex-end;
        margin-bottom: 8px;
        i + i::before {
          content: ' ';
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
      .img-show {
        flex: 1;
        width: 100%;
        display: flex;
      }
    }
    .bottom-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      .total-list {
        flex: 1;
        overflow: scroll;
        /deep/.el-row {
          height: 100%;
          .el-col {
            height: 50%;
          }
        }
        .list-item {
          position: relative;
          height: 95%;
          margin-bottom: 24px;
          border-radius: 8px;
          border: 1px solid #e5e6eb;
          background: #fff;
          padding: 8px;
          display: flex;
          flex-direction: column;
          .num {
            position: absolute;
            top: 8px;
            left: 8px;
            padding: 2px 10px;
            border-radius: 6px 0px 8px 0px;
            background: linear-gradient(90deg, #2f54eb 0%, #5196ff 100%);
            color: #fff;
            font-size: 10px;
            font-style: normal;
            font-weight: 400;
            line-height: 18px;
          }
          img {
            width: 100%;
            flex: 1;
            object-fit: cover;
            border-radius: 4px;
            box-shadow: 0px 0px 10px 0px rgba(67, 67, 67, 0.1);
            overflow: hidden;
            cursor: pointer;
          }
          .item-title {
            height: 22px;
            margin-top: 10px;
            color: #1d2128;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
            word-break: break-all;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            cursor: pointer;
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
