<template>
  <div class="detail">
    <div class="detail-body">
      <div class="detail-top">
        <div class="detail-input">
          <div class="input-icon">
            <img
              src="@/assets/image/intelligent-recheck/recheck-icon.png"
              alt=""
            />
          </div>
          <!-- <div class="input-left input-left-focus"> -->
          <div class="input-left" :class="{ 'input-left-focus': inputFocus }">
            <el-input
              :placeholder="placeholder"
              v-model.trim="recheckInput"
              class="input-with-select"
              @focus="inputFocusFun"
              @blur="inputBlurFun"
              clearable
            >
              <el-select
                v-model="select"
                slot="prepend"
                placeholder="请选择"
                popper-class="content-select"
                @change="changeSearch"
              >
                <el-option label="按文件名称" value="1"></el-option>
                <el-option label="按文本内容" value="2"></el-option>
              </el-select>
              <div slot="append">
                <div class="append-set">
                  <div
                    class="upload"
                    :style="{
                      'padding-right': !inputFocus ? '0' : '4px',
                      'margin-right': !inputFocus ? '16px' : '0'
                    }"
                  >
                    <i class="el-icon-camera" @click="showUpload"></i>
                  </div>
                  <div v-show="inputFocus" class="append-btn" @click="searchRecheck">
                    <i class="el-icon-search"></i>搜索
                  </div>
                </div>
              </div>
            </el-input>
          </div>
          <div class="input-right">
            <img
              src="@/assets/image/intelligent-recheck/show-more.png"
              alt=""
            />
            <div class="right-tip" @click="tpRecord">回检记录</div>
          </div>
        </div>
        <div class="list-select">
          <div class="select-left">
            <div class="select-item select-org">
              <el-popover
                ref="ref-popover3"
                width="400"
                popper-class="org-date-style"
                placement="bottom-start"
                trigger="click"
                @show="handlePopoverShow3"
              >
                <el-cascader
                  placeholder="选择机构"
                  v-model="searchForm.org"
                  ref="org-cascader"
                  :options="agenciesList"
                  @change="changeSearchForm"
                  clearable
                  :props="{
                    emitPath: false,
                    checkStrictly: true,
                    label: 'name',
                    value: 'id',
                    children: 'children'
                  }"
                  filterable></el-cascader>
                <div slot="reference">
                  <div class="select-set">
                    <div class="tip-style" :class="{ 'tip-style-active': searchForm.org }">选择机构</div>
                    <i class="el-icon-caret-bottom"></i>
                    <img src="@/assets/image/intelligent-recheck/tip.png" alt="" />
                  </div>
                </div>
              </el-popover>
            </div>
            <div class="select-item select-time">
              <el-popover
                ref="ref-popover2"
                popper-class="date-style"
                width="400"
                placement="bottom-start"
                trigger="click"
                @show="handlePopoverShow1"
              >
                <el-date-picker
                  v-model="searchForm.setTime"
                  type="daterange"
                  ref="my-date-picker"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  popper-class="date-style"
                  clearable
                  @change="changeSearchForm"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
                <div slot="reference">
                  <div class="select-set">
                    <div class="tip-style" :class="{ 'tip-style-active': searchForm.setTime && searchForm.setTime.length > 0 }">上线时间</div>
                    <i class="el-icon-caret-bottom"></i>
                  </div>
                </div>
              </el-popover>
            </div>
            <div class="select-item select-time">
              <el-popover
                ref="ref-popover1"
                width="400"
                popper-class="date-style"
                placement="bottom-start"
                trigger="click"
                @show="handlePopoverShow2"
              >
                <el-date-picker
                  v-model="searchForm.getTime"
                  type="daterange"
                  ref="my-date-picker2"
                  align="right"
                  unlink-panels
                  clearable
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  popper-class="date-style"
                  @change="changeSearchForm"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
                <div slot="reference">
                  <div class="select-set">
                    <div class="tip-style" :class="{ 'tip-style-active': searchForm.getTime && searchForm.getTime.length > 0 }">提单时间</div>
                    <i class="el-icon-caret-bottom"></i>
                  </div>
                </div>
              </el-popover>
            </div>
            <div class="select-item select-org">
              <div class="select-set">
                <div class="tip-style" :class="{ 'tip-style-active': searchForm.type }">事项类型</div>
                <i class="el-icon-caret-bottom"></i>
              </div>
              <el-select
                @focus="getFocus"
                popper-class="content-select op-select"
                v-model="searchForm.type"
                slot="prepend"
                @change="changeSearchForm"
                placeholder="事项类型"
              >
                <el-option v-for="(item, index) in transactionTypes" :key="'type' + index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div class="select-item select-time" style="width: 92px">
              <el-switch v-model="searchForm.recheck" active-text="已回检" @change="changeSearchForm">
              </el-switch>
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
            <!-- <div class="right-icon">
              <img src="@/assets/image/intelligent-recheck/icon1.png" alt="" />
            </div>
            <div class="right-icon">
              <img src="@/assets/image/intelligent-recheck/icon2.png" alt="" />
            </div> -->
          </div>
        </div>
      </div>
      <div class="detail-bottom">
        <div class="bottom-left" v-if="searchType === 2">
          <div class="img-show">
            <ImagePreview :url="item.url" ref="imgPreview" @fullImage="fullScreen()" @changeImgFun="changeImgFun"></ImagePreview>
          </div>
        </div>
        <div class="bottom-right" :class="{ 'bottom-right-border' : searchType === 1 }" v-loading="loading">
          <div class="total-list" v-if="totalList.length > 0" @scroll="scrollGet" ref="listBody">
            <Waterfall line="v" :line-gap="200"
              :min-line-gap="100"
              :max-line-gap="220"
              :single-max-width="300"
              :grow="searchType === 2 ? [1, 1, 1, 1] : [1, 1, 1, 1, 1]"
              :watch="totalList">
              <!-- each component is wrapped by a waterfall slot -->
              <WaterfallSlot
                v-for="(ite, index) in totalList"
                :width="192"
                :height="ite.height"
                :order="index"
                :key="ite.id"
                move-class="item-move"
              >
                <div class="list-item">
                  <div class="num" v-if="searchType === 2">
                    {{ (ite.distance * 100).toFixed(2) }}%
                  </div>
                  <div class="img-model">
                    <img :src="ite.fileUrl" alt="" />
                    <div class="img-up" @click="toCompare(ite, index, total)">
                      <div class="recheck-num">回检{{ ite.recheckCount }}次</div>
                    </div>
                    <div class="show-more" @click="showDetail(ite)">
                      <img src="@/assets/image/intelligent-recheck/see.png" alt="">
                      <div>查看详情</div>
                    </div>
                  </div>
                  <div class="item-title">{{ ite.fileName }}</div>
                </div>
              </WaterfallSlot>
            </Waterfall>
            <Loading v-if="scrollLoading && !loading"></Loading>
            <div class="bottom-tip" v-if="!canScroll">已经到底啦 ~</div>
          </div>
          <empty v-else></empty>
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
        :url="item.url"
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
    <UploadDialog ref="uploadDia" @changeImgFun="changeImgFun"></UploadDialog>
    <DetailDialog ref="detailDia" v-if="showDetailDia" :detailItem="detailItem" @handleClose="handleClose"></DetailDialog>
  </div>
</template>

<script>
import Waterfall from 'vue-waterfall/lib/waterfall'
import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'
import { getOrgTree, getApprovalType } from '@/api/approvalCenter'
import { getSimilarityComparisonList } from '@/api/intelligent-recheck'
import { downloadStream } from '@/api/applyCenter'
import Empty from '@/components/common/empty'
import Loading from './components/loading'
import UploadDialog from './components/upload-dialog'
import DetailDialog from './components/detail-dialog'
import ImagePreview from './components/imgae-preview'
import FullImage from './components/full-image'
const sortListType1 = [
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
];
const sortListType2 = [
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
];
export default {
  components: {
    Empty,
    Loading,
    UploadDialog,
    // ImgDialog,
    ImagePreview,
    FullImage,
    Waterfall,
    WaterfallSlot,
    DetailDialog
  },
  name: 'recheck-detail',
  data: () => ({
    recheckInput: '',
    select: '1',
    searchType: 2,
    searchForm: {
      org: '',
      setTime: [],
      getTime: [],
      type: '',
      recheck: null
    },
    showFullScreen: false,
    detailDialogShow: false,
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
    loading: true,
    scrollLoading: false,
    totalList: [],
    listItemActive: {
      fileUrl: ''
    },
    inputFocus: false,
    heightArr: [322, 262, 162],
    // pickerOptions: {
    //   disabledDate(date) {
    //     return date.getTime() > Date.now();
    //   }
    // },
    placeholder: '请输入文件名或上传图片进行回检',
    agenciesList: [],
    transactionTypes: [],
    canScroll: true,
    detailItem: {},
    showDetailDia: false
  }),
  created() {
    this.init();
  },
  watch: {
    $route: {
      handler(val) {
        if (!val.params.item) {
          return
        }
        this.init();
      },
      // 深度观察监听
      deep: true
    }
  },
  methods: {
    init() {
      this.getOrgTree();
      this.getApprovalType();
      const item = JSON.parse(localStorage.getItem('recheckItem'));
      if (this.$route.params.item || item) {
        this.item = this.$route.params.item || item;
        localStorage.setItem('recheckItem', JSON.stringify(this.item));
        this.searchType = this.item.searchType;
        this.recheckInput = this.item.recheckInput ? this.item.recheckInput : '';
        this.select = this.item.select ? this.select : '1';
        let activeSort = {};
        this.resetSearch();
        if (this.searchType === 1) {
          this.sortList = sortListType1;
          activeSort = {
            label: '按上线时间',
            val: 3,
            sort: 'desc'
          };
        } else {
          this.sortList = sortListType2;
          activeSort = {
            label: '按相似度',
            val: 1,
            sort: 'desc'
          };
        }
        this.activeSort = activeSort;
        this.getSimilarityComparisonList()
      } else {
        this.$router.go(-1)
      }
    },
    changeSearch(val) {
      if (val === '1') {
        this.placeholder = '请输入文件名或上传图片进行回检'
      } else {
        this.placeholder = '请输入关键词或上传图片进行回检'
      }
    },
    tpRecord() {
      this.$router.push({
        name: 'recheck-record'
      })
    },
    getApprovalType() {
      getApprovalType().then((res) => {
        this.transactionTypes = res.data.data.map((v) => {
          return {
            label: v.examineTypesName,
            value: v.recordId
          }
        })
      })
    },
    showDetail(ite) {
      this.detailItem = ite;
      this.showDetailDia = true;
    },
    handleClose() {
      this.showDetailDia = false;
    },
    toCompare(ite, index, total) {
      this.$router.push({
        name: 'recheck-compare',
        params: {
          leftItem: {
            ...this.item,
            searchType: this.searchType
          },
          compareItem: {
            ...ite,
            itemIndex: index,
            totalCount: total
          }
        }
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
    fullScreen() {
      this.showFullScreen = !this.showFullScreen;
      this.$nextTick(() => {
        this.$refs.imgPreview1.handleImageLoaded()
      })
    },
    inputFocusFun() {
      this.inputFocus = true
    },
    inputBlurFun() {
      if (!this.recheckInput) {
        this.inputFocus = false
      }
    },
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
      this.pageNum = 1;
      this.loading = true;
      this.canScroll = true;
      this.totalList = [];
      this.getSimilarityComparisonList()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getSimilarityComparisonList()
    },
    showScreen(item) {
      this.listItemActive = item
      this.$refs.imgDia.imgDialog = true
    },
    resetSearch() {
      this.pageNum = 1;
      this.loading = true;
      this.totalList = [];
      let activeSort = {};
      if (this.searchType === 1) {
        activeSort = {
          label: '按上线时间',
          val: 3,
          sort: 'desc'
        };
      } else {
        activeSort = {
          label: '按相似度',
          val: 1,
          sort: 'desc'
        };
      }
      this.activeSort = activeSort;
      this.searchForm = {
        org: '',
        setTime: '',
        getTime: '',
        type: '',
        recheck: false
      };
    },
    changeImgFun(item) {
      this.item = item;
      localStorage.setItem('recheckItem', JSON.stringify(this.item));
      this.searchType = 2;
      this.canScroll = true;
      this.sortList = sortListType2;
      this.resetSearch();
      this.getSimilarityComparisonList()
    },
    changeSearchForm() {
      this.pageNum = 1;
      this.loading = true;
      this.totalList = [];
      this.canScroll = true;
      this.getSimilarityComparisonList()
    },
    searchRecheck() {
      if (this.recheckInput === '') {
        this.$message.warning(this.placeholder)
        return;
      }
      this.item = {
        key: '',
        name: this.select === '1' ? this.recheckInput : '',
        text: this.select === '2' ? this.recheckInput : '',
        searchType: 1
      };
      this.canScroll = true;
      localStorage.setItem('recheckItem', JSON.stringify(this.item));
      this.searchType = 1;
      this.sortList = sortListType1;
      this.resetSearch();
      this.getSimilarityComparisonList()
    },
    getSimilarityComparisonList() {
      // this.loading = true
      this.scrollLoading = true;
      const data = {
        fileKey: this.item.key,
        name: this.item.name,
        text: this.item.text,
        pageNow: this.pageNum,
        pageSize: this.searchType === 1 ? 40 : 20,
        sort: this.activeSort.val,
        sortType: this.activeSort.sort === 'desc' ? 1 : 2,
        cstartTime: this.searchForm.getTime && this.searchForm.getTime.length > 0 ? this.searchForm.getTime[0] : '',
        cendTime: this.searchForm.getTime && this.searchForm.getTime.length > 0 ? this.searchForm.getTime[1] : '',
        startTime: this.searchForm.setTime && this.searchForm.setTime.length > 0 ? this.searchForm.setTime[0] : '',
        endTime: this.searchForm.setTime && this.searchForm.setTime.length > 0 ? this.searchForm.setTime[1] : '',
        orgId: this.searchForm.org,
        isRecheck: this.searchForm.recheck ? 1 : 0,
        formCategory: this.searchForm.type
      }
      // if (this.canScroll) {
      getSimilarityComparisonList(data)
        .then((res) => {
          if (res.data.status === 200) {
            const totalList = res.data.data.list.map((v) => {
              return {
                ...v,
                taskNumber: v.formId + '',
                taskName: v.formName,
                processTemplateId: v.templateId,
                initiator: {
                  ...v.originator,
                  label: v.institutional && v.institutional[1]
                },
                taskStatus: v.nodeStatus,
                height: this.heightArr[Math.floor(Math.random() * 3)]
              }
            })
            this.total = res.data.data.totalCount;
            this.totalList = this.totalList.concat(totalList);
          }
          this.loading = false;
          this.scrollLoading = false;
          this.canScroll = !(this.totalList.length === this.total);
        })
        .catch(() => {
          this.loading = false;
          this.scrollLoading = false;
        })
    },
    scrollGet() {
      if (this.scrollLoading || !this.canScroll) {
        return;
      }
      const { listBody } = this.$refs;
      if (listBody.offsetHeight + listBody.scrollTop + 200 >= listBody.scrollHeight) {
        this.pageNum += 1;
        this.getSimilarityComparisonList();
      }
    },
    handlePopoverShow1() {
      this.$refs['my-date-picker'].handleFocus()
    },
    handlePopoverShow2() {
      this.$refs['my-date-picker2'].handleFocus()
    },
    getOrgTree() {
      getOrgTree().then((res) => {
        const { data } = res.data
        if (data) {
          const value = this.formatOrg(data.children)
          this.agenciesList = [
            {
              ...data,
              children: value
            }
          ]
        }
      })
    },
    formatOrg(data) {
      data.forEach((m) => {
        if (m.children && m.children.length) {
          this.formatOrg(m.children)
        } else {
          m.children = null
        }
      })
      return data
    },
    handlePopoverShow3() {
      this.$refs['org-cascader'].handleFocus()
    },
    getFocus() {
      this.$refs['ref-popover1'].handleBlur()
      this.$refs['ref-popover2'].handleBlur()
      this.$refs['ref-popover3'].handleBlur()
    },
    changeSize(type) {
      this.$refs.imgPreview1.changeSize(type)
    },
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
    .input-icon {
      margin-right: 19px;
      img {
        width: 80px;
        height: 24px;
      }
    }
    .input-left {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      height: 44px;
      flex: 1;
      border-radius: 20px;
      overflow: hidden;
      background-color: #f2f3f5;
      padding: 0 4px 0 20px;
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
        .el-input__suffix {
          height: 40px;
        }
        .el-input-group__append {
          padding: 0;
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
              padding-right: 20px;
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
            .append-btn {
              margin-left: 6px;
              height: 32px;
              padding: 0 12px;
              border-radius: 40px;
              background: #2d5cf6;
              font-size: 12px;
              font-style: normal;
              font-weight: 400;
              line-height: 32px;
              color: #fff;
              cursor: pointer;
              .el-icon-search {
                font-size: 14px;
                margin-right: 4px;
              }
            }
          }
        }
      }
    }
    .input-left-focus {
      border: 2px solid #a8c5ff;
      background: #f9fbff;
      /deep/ .el-input {
        // height: 40px;
        .el-input__inner {
          // height: 40px;
          background: #f9fbff;
        }
        .el-input-group__append {
          background: #f9fbff;
          .upload {
            background: #f9fbff !important;
          }
        }
        // .el-select__caret {
        //   // height: 40px;
        // }
      }
    }
    .input-right {
      margin-left: 18px;
      display: flex;
      align-items: center;
      cursor: pointer;
      border-radius: 6px;
      padding: 6px;
      background: linear-gradient(90deg, #f0f6ff 0%, #d1e4ff 100%);
      .right-tip {
        display: none;
        color: #2d5cf6;
        font-size: 12px;
        font-style: normal;
        font-weight: 700;
        line-height: 20px;
        margin-left: 4px;
      }
      img {
        width: 20px;
        height: 20px;
      }
    }
    .input-right:hover {
      .right-tip {
        display: block;
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
        position: relative;
        margin-right: 24px;
        display: flex;
        align-items: center;
        width: 104px;
        color: #1d2128;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        .select-set {
          display: flex;
          align-items: center;
          cursor: pointer;
          .tip-style {
            color: #1d2128;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
          }
          .el-icon-caret-bottom {
            color: #88909B;
          }
          .tip-style-active {
            color: #2D5CF6;
          }
        }
        /deep/.el-select {
          position: absolute;
          height: 22px;
          opacity: 0;
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
          position: absolute;
          right: 10px;
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
        /deep/.is-active {
          color: #2d5cf6;
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
      margin-right: 8px;
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
      border-left: 1px solid #E5E6EB;
      .total-list {
        position: relative;
        flex: 1;
        overflow: scroll;
        .list-item {
          position: absolute;
          top: 0;
          left: 8px;
          right: 8px;
          bottom: 28px;
          border-radius: 8px;
          background: #fff;
          display: flex;
          flex-direction: column;
          .num {
            position: absolute;
            top: 7px;
            left: 7px;
            padding: 2px 8px;
            border-radius: 8px;
            background: rgba(29, 33, 40, 0.40);
            color: #FFF;
            font-size: 10px;
            font-style: normal;
            font-weight: 700;
            line-height: 18px;
            z-index: 100;
          }
          img {
            width: 100%;
            flex: 1;
            object-fit: cover;
            cursor: pointer;
          }
          .img-model {
            display: flex;
            position: relative;
            width: 100%;
            flex: 1;
            border-radius: 12px;
            border: 1.5px solid #E5E6EB;
            box-shadow: 0px 0px 10px 0px rgba(67, 67, 67, 0.1);
            overflow: hidden;
            cursor: pointer;
            .img-up {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              border-radius: 12px;
              background: rgba(29, 33, 40, 0.30);
              display: none;
              .recheck-num {
                position: absolute;
                top: 7px;
                right: 14px;
                color: #FFF;
                font-size: 12px;
                font-style: normal;
                font-weight: 700;
                line-height: 20px;
              }
            }
            .show-more {
              display: none;
              position: absolute;
              bottom: 16px;
              left: 50%;
              transform: translateX(-50%);
              width: 86px;
              height: 32px;
              padding: 6px 8px;
              border-radius: 4px;
              background: #2D5CF6;
              // display: flex;
              align-items: center;
              color: #FFF;
              font-size: 12px;
              font-style: normal;
              font-weight: 400;
              line-height: 20px;
              img {
                width: 20px;
                height: 20px;
                margin-right: 2px;
              }
            }
          }
          .img-model:hover {
            .img-up {
              display: block;
            }
            .show-more {
              display: flex;
            }
          }
          .item-title {
            color: #505968;
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px;
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
    .bottom-right-border {
      border-left: none;
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
.item-move {
  transition: all .5s cubic-bezier(.55,0,.1,1);
  -webkit-transition: all .5s cubic-bezier(.55,0,.1,1);
}
.bottom-tip {
  margin-left: 10px;
  font-size: 14px;
  text-align: center;
}
</style>
<style lang="less">
.content-select {
  padding: 16px 8px;
  margin-top: 8px;
  .el-scrollbar__view {
    padding: 0;
  }
  .el-select-dropdown__item {
    padding: 6px 16px;
    color: #1d2128;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
  }
  .popper__arrow::after {
    border-bottom-color: transparent !important;
  }
}
.date-style {
  .el-input__inner {
    width: 100% !important;
  }
}
.org-date-style {
  width: auto!important;
}
</style>
