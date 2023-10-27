<template>
  <div class="record-body">
    <div class="outer">
      <div class="search-area">
        <div class="search-title">智能回检</div>
        <el-input
          placeholder="请输入关键词开始检索"
          @keyup.enter.native="handleSubmit"
          v-model="search.searchInput"
        ></el-input>
      </div>

      <div class="search-middle-area">
        <div class="left-area">
          <div
            class="scrren-com"
            :class="search.mechanism ? 'active' : ''"
            style="font-size: 14px"
          >
            {{ search.orgIds ? search.orgName : '选择机构' }}
            <img
              src="../../assets/image/person-center/down.png"
              class="down"
              alt=""
            />
            <el-cascader
              class="my-hidden"
              :options="agenciesList"
              :show-all-levels="false"
              :props="{
                emitPath: false,
                checkStrictly: true,
                label: 'name',
                value: 'id',
                children: 'children'
              }"
              @change="changeAgencies"
              v-model="search.orgIds"
              ref="agencies"
              clearable
            ></el-cascader>

            <img
              src="../../assets/image/why.png"
              alt=""
              style="width: 20px; height: 20px; margin-left: 4px"
            />
          </div>

          <div
            class="scrren-com"
            :class="search.datePickerOnline ? 'active' : ''"
            style="font-size: 14px"
          >
            <el-popover
              ref="ref-popover"
              width="400"
              placement="bottom-start"
              trigger="click"
            >
              <el-date-picker
                class="my-date-picker"
                ref="my-date-picker"
                v-model="search.datePickerOnline"
                type="monthrange"
                align="right"
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                :picker-options="pickerOptions"
                @change="changeOnlineDate"
              >
              </el-date-picker>
              <div slot="reference">
                上线时间
                <img
                  src="../../assets/image/person-center/down.png"
                  class="down"
                  alt=""
                />
              </div>
            </el-popover>
          </div>
          <div
            class="scrren-com"
            :class="search.datePickerBill ? 'active' : ''"
            style="font-size: 14px"
          >
            <el-popover
              ref="ref-popover"
              width="400"
              placement="bottom-start"
              trigger="click"
            >
              <el-date-picker
                class="my-date-picker"
                ref="my-date-picker"
                v-model="search.datePickerBill"
                type="monthrange"
                align="right"
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
              <div slot="reference">
                提单时间
                <img
                  src="../../assets/image/person-center/down.png"
                  class="down"
                  alt=""
                />
              </div>
            </el-popover>
          </div>
          <!-- <div
            class="scrren-com"
            :class="search.datePickerBill ? 'active' : ''"
            style="font-size: 14px"
          >

          </div> -->
          <div
            class="scrren-com"
            :class="search.mechanism ? 'active' : ''"
            style="font-size: 14px"
          >
            {{
              search.approvalType
                ? this.getTransationName(search.approvalType)
                : '事项类型'
            }}
            <img
              src="../../assets/image/person-center/down.png"
              class="down"
              alt=""
            />
            <el-select
              v-model="search.approvalType"
              @change="changeArrrovalType"
              clearable
            >
              <el-option
                v-for="(item, index) in transactionTypes"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div
            style="
              display: flex;
              align-items: center;
              font-size: 14px;
              font-weight: 400;
            "
          >
            <el-switch
              size="small"
              style="margin-right: 4px"
              v-model="isBackCheck"
            />
            已回检
          </div>
        </div>

        <div class="right-area">
          <el-row>
            <el-col :span="8"
              ><p class="tot-num">共<span class="num">3216</span>条</p></el-col
            >
            <el-col :span="8" justify="center" style="cursor: pointer">
              <p class="sort" @click="onlineClick">
                按上线时间<img src="../../assets/image/upup.png" alt="" /></p
            ></el-col>
            <el-col :span="8" justify="center" style="cursor: pointer">
              <p class="sort" @click="billClick">
                按提单时间<img src="../../assets/image/upup.png" alt="" /></p
            ></el-col>
          </el-row>
        </div>
      </div>
      <div v-loading="search.loading">
        <recordTableVue
          @openOption="handleOpenOption"
          @openRecord="handleOpenRecord"
          @openFilePreview="fullScreen"
          :recordList="recordList"
        />
      </div>

      <TrsPagination
        :pageSize="page.pageSize"
        :pageNow="page.pageNow"
        :total="page.totalCount"
        @getList="handleCurrentChange"
      >
      </TrsPagination>
    </div>

    <el-dialog
      title="回检意见"
      :visible="optionDialogVisible"
      width="50%"
      align="left"
      :before-close="handleClose"
    >
      <span>{{ optionValue }}</span>
    </el-dialog>

    <el-dialog
      title="回检记录"
      :visible="recordDialogVisible"
      width="70%"
      align="center"
      :before-close="handleClose"
    >
      <record-dialog />
    </el-dialog>

    <div class="preview" :class="{ fullScreen: showFullScreen }">
      <!-- 全屏关闭按钮 -->
      <i
        class="el-icon-circle-close"
        v-show="showFullScreen"
        @click="fullScreen"
      ></i>
      <!-- 图片 -->
      <fullImage
        ref="imgPreview1"
        url="http://192.168.210.51:9090/cpr/cpr_1697708778477_微信图片_20230906141828.jpg"
      ></fullImage>
      <div class="tool" v-if="showFullScreen">
        <span @click="saveFile">
          <i
            ><img src="@/assets/image/intelligent-recheck/download.png" alt=""
          /></i>
          下载</span
        >
        <span @click="changeSize(1)">
          <i
            ><img src="@/assets/image/intelligent-recheck/zoom-in.png" alt=""
          /></i>
          放大</span
        >
        <span @click="changeSize(0)">
          <i
            ><img src="@/assets/image/intelligent-recheck/zoom-out.png" alt=""
          /></i>
          缩小</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getOrgTree, getApprovalType } from '@/api/approvalCenter'
// eslint-disable-next-line import/extensions
import { downloadStream } from '@/api/applyCenter'
// eslint-disable-next-line import/extensions
import * as dayjs from 'dayjs'
// eslint-disable-next-line import/extensions
import RecordDialog from './components/record-dialog.vue'
// eslint-disable-next-line import/extensions
import recordTableVue from './components/record-table.vue'
// eslint-disable-next-line import/extensions
import fullImage from './components/full-image.vue'
import { getRecheckList } from '../../api/intelligent-recheck'
export default {
  name: 'Record',
  data() {
    return {
      optionDialogVisible: false,
      recordDialogVisible: false,
      optionValue: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '近一个季度',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 3)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '近一年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 12)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      dataPickerBill: '',
      isBackCheck: '',
      showFullScreen: false,
      agenciesList: [],
      searchParm: {},
      search: {
        orgIds: '',
        searchInput: '',
        datePickerOnline: '',
        datePickerBill: '',
        loading: true,
        orgName: '',
        approvalType: ''
      },
      //  1-回检时间 2-提单时间 3-上线时间
      sort: 1,
      // 1-降序 2-升序
      sortType: 2,
      recordList: [],
      page: {
        pageNow: 1,
        pageSize: 8,
        totalCount: 10
      },
      transactionTypes: []
    }
  },
  components: {
    recordTableVue,
    RecordDialog,
    fullImage
  },
  methods: {
    changeOnlineDate() {
      console.log(
        this.search.datePickerOnline.map((item) => this.timeFormat(item))
      )
    },
    handleChange() {},
    changeArrrovalType() {},
    handleSubmit() {},
    handleClose() {
      this.optionDialogVisible = false
      this.recordDialogVisible = false
    },
    handleOpenOption(option) {
      this.optionValue = option
      this.optionDialogVisible = true
    },
    handleOpenRecord() {
      this.recordDialogVisible = true
    },
    fullScreen() {
      this.showFullScreen = !this.showFullScreen
      this.$nextTick(() => {
        this.$refs.imgPreview1.handleImageLoaded()
      })
    },
    changeSize(type) {
      this.$refs.imgPreview1.changeSize(type)
    },
    saveFile() {
      const params = {
        key: this.item.key
      }
      this.$message.info('下载中，请稍等！')
      downloadStream(params).then((res) => {
        const disposition = res.headers['content-disposition']
        const url = window.URL.createObjectURL(
          new Blob([res.data], { type: 'application/pdf;charset=utf-8' })
        )
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute(
          'download',
          decodeURI(disposition.replace('attachment;filename=', ''))
        )
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    getOrgTreeMeo() {
      getOrgTree().then((res) => {
        if (res.data.status === 200) {
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
        }
      })
    },
    getApprovalTypeMeo() {
      getApprovalType().then((res) => {
        this.transactionTypes = res.data.data.map((v) => {
          return {
            label: v.examineTypesName,
            value: v.recordId
          }
        })
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
    timeFormat(val) {
      return val ? dayjs(val).format('YYYY-MM-DD ') : '--'
    },
    changeAgencies() {
      this.$refs['agencies'].dropDownVisible = false
      if (this.agenciesList.length) {
        this.search.orgName = this.queryTreeName(
          this.search.orgIds,
          this.agenciesList
        )
        this.searchParm.orgId = this.search.orgIds
      }
      this.searchList()
    },

    // 在树里根据id查找name
    queryTreeName(id, tree) {
      let result
      // eslint-disable-next-line no-shadow
      const fn = function (id, tree) {
        for (let index = 0; index < tree.length; index++) {
          const element = tree[index]
          if (element.id === id) {
            result = element.name
            break
          } else if (
            element.id !== id
            && element.children
            && element.children.length > 0
          ) {
            fn(id, element.children)
          }
        }
      }
      fn(id, tree)
      return result
    },

    // 根据id获取事项类型
    getTransationName(id) {
      const item = this.transactionTypes.find((v) => v.value === id)
      return item ? item.label : ''
    },

    async searchList() {
      //    //  1-回检时间 2-提单时间 3-上线时间
      //    sort: 1,
      // // 1-降序 2-升序
      // sortType: 2,
      this.search.loading = true
      const mustParm = {
        pageNow: this.page.pageNow,
        pageSize: this.page.pageSize,
        sort: this.sort,
        sortType: this.sortType
      }
      const parm = {
        ...mustParm,
        ...this.searchParm
      }
      const res = await getRecheckList(parm)
      const { data } = res
      if (data.status === 200) {
        const { list, totalCount } = data.data
        this.page.totalCount = totalCount
        this.recordList = list
        this.search.loading = false
      }
    },

    handleCurrentChange() {},

    onlineClick() {
      this.searchParm.sort = 3
      this.searchParm.sortType = 1
      this.searchList()
    },
    billClick() {
      this.searchParm.sort = 2
      this.searchParm.sortType = 1
      this.searchList()
    }
  },

  created() {
    this.searchList()
  },
  mounted() {
    this.getOrgTreeMeo()
    this.getApprovalTypeMeo()
  },
  watch: {}
}
</script>

<style scoped lang="less">
.outer {
  border-radius: 10px;
  background: #fff;
  padding: 24px;
  .search-area {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 24px;
    gap: 19px;

    .search-title {
      background: var(--2, linear-gradient(90deg, #2f54eb 0%, #5196ff 100%));
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 18px;
      font-style: normal;
      font-weight: 900;
      font-style: italic;
      width: 81px;
      margin-left: 5px;
    }
    .el-input {
      margin-left: 5px;
      :deep(.el-input__inner) {
        display: flex;
        padding: 8px 20px;
        align-items: center;
        gap: 16px;
        flex: 1 0 0;
        border-radius: 32px;
        background: var(--gray-gray-3, #f2f3f5);
        border: none;
        width: 100%;
      }
    }
  }

  .search-middle-area {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    .left-area {
      // width: 525px;
      display: flex;
      gap: 20px;
    }

    .right-area {
      width: 300px;
      .tot-num {
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;

        .num {
          color: var(--unnamed, #2d5cf6);
          font-size: 14px;
          font-weight: 700;
          margin: 0px 4px;
        }
      }

      img {
        width: 12px;
        height: 12px;
      }

      .sort {
        color: var(--gray-gray-8, #505968);
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
      }
    }
  }

  :deep(.el-col-6) {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .scrren-com {
    cursor: pointer;
    color: #1d2128;
    font-size: 16px;
    line-height: 24px;
    width: fit-content;
    padding: 0 6px;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 4px;
    position: relative;
    color: var(--gray-gray-9, #1d2128);
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;

    img {
      margin-left: 4px;
      width: 9px;
      height: 5px;
    }

    &.active {
      color: #2d5cf6;
    }
    .my-hidden {
      position: absolute;
      opacity: 0;
    }

    .el-select {
      position: absolute;
      opacity: 0;
    }

    .hintIcon {
      width: 20px;
      margin-left: 4px;
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
:deep(.el-dialog__header) {
  display: flex;
  justify-content: center;
}

.my-date-picker {
  width: 100%;
  :deep(.el-range-separator) {
    width: 10%;
  }
}

.tool {
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  z-index: 1;
  width: 248px;
  box-shadow: 0px 0px 10px 0px #4343431a;
  height: 38px;
  border-radius: 8px;
  background-color: #1d2128bf;
  span {
    i {
      margin-right: 2px;
      img {
        width: 14px;
        height: 14px;
      }
    }
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    color: #ffffff;
  }
}

:deep(.el-dialog__body) {
  padding: 30px 20px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}

:deep(.el-dialog__wrapper) {
  position: fixed;
  right: 0;
  left: 0;
  top: -80px;
  margin: 0;
  overflow: visible;
}
</style>
