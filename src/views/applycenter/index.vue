<template>
  <div class="apply-center" v-cloak ref="apply-center">
    <p class="welcoming">欢迎来到消保智能审查平台！</p>
    <p class="tips" v-if="tipsMsg">
      <i class="iconfont icon-xiaoxi-tongzhi"></i>{{ tipsMsg }}
    </p>
    <div class="apply-center-box">
      <div class="data-statistics">
        <div v-for="(item, index) in dataStatistics" :key="index" @click="changeStatis(item)" :class="item.value !== crtSign
            ? 'data-statistics-item'
            : 'data-statistics-item active-item'
          ">
          <div class="icon">
            <img :src="item.value == crtSign ? item.activeIcon : item.icon" :alt="item.name"
              :class="item.value == crtSign ? 'active-icon' : 'default-icon'" />
          </div>
          <div class="name-count">
            <span class="name">{{ item.name }}</span>
            <span class="count"><i>{{ item.count }}</i> 个</span>
          </div>
        </div>
        <div class="new-apply pointer" @click="$router.push({ name: 'addApply' })">
          <img src="@/assets/image/apply-center/newApply.svg" alt="" />
          <p>新建申请</p>
        </div>
      </div>
      <div class="apply-content">
        <div class="filters">
          <div class="filters-content">
            <div class="floor1">
              <!-- <div class="floor1-item"> -->
              <el-select popper-class="transaction-select" v-model="search.formManagementId" placeholder="事项类型"
                @change="changeArrrovalType" clearable @clear="searchList">
                <el-option v-for="(item, index) in transactionTypes" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
              <el-select v-model="search.approvalStage" placeholder="审批阶段" @change="searchList" clearable
                @clear="searchList">
                <el-option v-for="(item, index) in approvalPhases" :key="index" :label="item.label"
                  :value="item.value"></el-option></el-select>
              <!-- </div> -->
              <!-- <div class="floor1-item"> -->
              <el-select v-model="search.urgent" placeholder="是否加急" @change="searchList" clearable>
                <el-option v-for="(item, index) in $field('isUrgent')" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
              <el-select v-model="search.hasOpinions" placeholder="有/无实质意见" @change="searchList" clearable>
                <el-option v-for="(item, index) in $field('isOpinions')" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
              <!-- </div> -->
              <!-- <div class="floor1-item"> -->

              <el-select v-model="search.isOneTimePassed" placeholder="是否一次通过" @change="searchList" clearable>
                <el-option v-for="(item, index) in $field('isOncePass')" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
              <el-select v-model="search.updateTime2" ref="multiSelect" placeholder="排序" multiple @change="changeSort"
                :class="search.updateTime2[1] == 'desc'
                    ? 'arrow-select descArrow'
                    : 'arrow-select ascArrow'
                  ">
                <el-option-group v-for="group in $field('updateTimeGroup')" :key="group.label">
                  <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-option-group>
              </el-select>
              <!-- </div> -->
            </div>
            <div class="floor2">
              <div class="floor2-item">
                <el-input v-char v-model="search.keywords" placeholder="请输入项目名称关键词查询" clearable @clear="searchList"
                  @keyup.enter.native="searchList">
                  <i slot="suffix" class="el-input__icon el-icon-search pointer" @click="searchList"></i>
                </el-input>
              </div>
              <div class="floor2-item">
                <span>发起时间</span>
                <el-date-picker v-model="search.startDate" type="daterange" @clear="searchList" @change="searchList"
                  value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间">
                </el-date-picker>
              </div>
              <div class="floor2-item">
                <span>上线时间</span>
                <el-date-picker v-model="search.productLaunchDate" value-format="yyyy-MM-dd" clearable type="daterange"
                  range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" @clear="searchList"
                  @change="searchList">
                </el-date-picker>
              </div>
            </div>
          </div>
          <div class="export-reset">
            <el-button type="text" @click="reset">重置</el-button>
          </div>
        </div>
        <div v-if="list.length" v-loading="search.loading" class="list">
          <applyEventCard :item="item" @del="del" @quash="quash" @concern="concern" v-for="(item, index) in list" :key="index"> </applyEventCard>
          <trs-pagination :total="search.total" @getList="nextPage" :pageNow="pageNow"></trs-pagination>
        </div>
        <Empty v-else v-loading="search.loading" class="list"></Empty>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getsTheNumberOfHeaders,
  getApprovalType,
  getApprovalStage,
  getApplicationList,
  delApplication,
  quashApplication
} from '@/api/applyCenter'
import applyEventCard from '@/components/card/apply-event-card'
export default {
  name: 'apply-center-index',
  components: {
    applyEventCard
  },
  data() {
    return {
      tipsMsg: null,
      crtSign: 'applyAll',
      crtId: 0,
      dataStatistics: [
        {
          name: '全部申请', // (1：我的关注 2：已撤销 3：草稿箱 4:待修改 5：待确认 6：审批中)
          count: 0,
          value: 'applyAll',
          id: 0,
          icon: require('@/assets/image/apply-center/all-attention.svg'),
          activeIcon: require('@/assets/image/apply-center/all-attention.svg')
        },
        {
          name: '我的关注',
          count: 0,
          value: 'myConcern',
          id: 1,
          icon: require('@/assets/image/apply-center/my-attention.svg'),
          activeIcon: require('@/assets/image/apply-center/my-attention-active.svg')
        },
        {
          name: '待修改',
          count: 0,
          value: 'toModified',
          id: 4,
          icon: require('@/assets/image/apply-center/wait-modify.svg'),
          activeIcon: require('@/assets/image/apply-center/wait-modify-active.svg')
        },
        {
          name: '待确认',
          count: 0,
          value: 'toConfirmed',
          id: 5,
          icon: require('@/assets/image/apply-center/wait-check.svg'),
          activeIcon: require('@/assets/image/apply-center/wait-check-active.svg')
        },
        {
          name: '审批中',
          count: 0,
          value: 'Approval',
          id: 6,
          icon: require('@/assets/image/apply-center/in-approval.svg'),
          activeIcon: require('@/assets/image/apply-center/in-approval-active.svg')
        },
        {
          name: '草稿箱',
          count: 0,
          value: 'draftBin',
          id: 3,
          icon: require('@/assets/image/apply-center/draft-box.svg'),
          activeIcon: require('@/assets/image/apply-center/draft-box-active.svg')
        }
      ],
      search: {
        formManagementId: '',
        approvalStage: '',
        urgent: '',
        hasOpinions: '',
        updateTime: [2, 'desc'],
        updateTime2: [2, 'desc'],
        keywords: '',
        isOneTimePassed: '',
        productLaunchDate: [],
        total: 0,
        loading: false,
        startDate: []
      },
      transactionTypes: [],
      approvalPhases: [],

      list: []
    }
  },
  activated() {
    this.getDataStatistic()
    this.searchList()
  },
  async mounted() {
    this.setDatePicker()
    this.getApprovalType()
  },
  watch: {
    'search.formManagementId': {
      handler(val) {
        if (!val) {
          this.approvalPhases = []
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() { },
  methods: {
    to(path) {
      if (path !== this.$route.path) {
        this.$router.push(path)
      }
    },
    /**
     * @description: 回显时间排序
     * @return {*}
     */
    setDatePicker() {
      const dom = document
        .querySelectorAll('.arrow-select')[0]
        .querySelector('.el-select__tags')
      this.$nextTick(() => {
        const text = this.search.updateTime[0] === 1 ? '发起时间' : '更新时间'
        dom.innerText = text
      })
    },
    changeArrrovalType() {
      if (this.search.formManagementId || this.search.formManagementId === 0) {
        this.getApprovalStage();
      } else {
        this.search.approvalStage = '';
        this.approvalPhases = [];
      }
      this.searchList()
    },
    /**
     * @description: 获取事项类型
     * @return {*}
     */
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
    /**
     * @description: 获取事项类型对应的审批阶段
     * @return {*}
     */
    getApprovalStage() {
      getApprovalStage(this.search.formManagementId).then((res) => {
        const { data } = res.data
        this.approvalPhases = data?.map((v) => {
          return {
            label: v.nodeName,
            value: v.nodeId
          }
        }) || []
      })
    },
    /**
     * @description: 获取头部各类型的统计
     * @return {*}
     */
    getDataStatistic() {
      const userinfo = JSON.parse(window.localStorage.getItem('user_name'))
      const param = {
        pageNow: 1,
        pageSize: 10,
        approvalType: '',
        approvalStage: '',
        urgent: '',
        hasOpinions: '',
        currentActivityName: this.search.approvalStage,
        sortType: 1,
        id: userinfo.id,
        name: userinfo.fullname
      }
      getsTheNumberOfHeaders(param).then((res) => {
        const data = res.data.data[0]
        for (const key in data) {
          this.dataStatistics.forEach((m) => {
            if (m.value === key) {
              m.count = data[key]
            }
          })
        }
        this.userStatus(data)
      })
    },
    /**
     * @description: 时间排序筛选
     * @return {*}
     */
    changeSort() {
      const lastKey = this.search.updateTime2[this.search.updateTime2.length - 1]
      if (this.search.updateTime2.length < 2) {
        this.search.updateTime2 = this.search.updateTime
      } else {
        // eslint-disable-next-line
        if (!isNaN(lastKey)) {
          this.search.updateTime[0] = lastKey
        } else {
          this.search.updateTime[1] = lastKey
        }
        this.$nextTick(() => {
          this.search.updateTime2 = this.search.updateTime
        })
      }
      const dom = document
        .querySelectorAll('.arrow-select')[0]
        .querySelector('.el-select__tags')
      this.$nextTick(() => {
        const text = this.search.updateTime[0] === 1 ? '发起时间' : '更新时间'
        dom.innerText = text
        setTimeout(() => {
          this.$refs.multiSelect.blur()
        }, 50)

        this.searchList()
      })
    },
    /**
     * @description: 调用列表接口
     * @param {*} pageNow
     * @return {*}
     */
    async getApplicationListAll(pageNow) {
      // 在此时分流  调不同的接口
      this.pageNow = pageNow
      const userinfo = JSON.parse(window.localStorage.getItem('user_name'))
      // 关于排序
      const param = {
        pageNow,
        pageSize: 10,
        ...this.search,
        id: userinfo.id,
        name: userinfo.fullname,
        startDate: this.search.startDate?.map((v, index) => { return v + (index > 0 ? ' 23:59:59' : ' 00:00:00') }).join('TO'),
        productLaunchDate: this.search.productLaunchDate?.map((v, index) => { return v + (index > 0 ? ' 23:59:59' : ' 00:00:00') }).join('TO')
      }
      let sortType = ''
      // desc:降序 asc 升序 1 发起时间 2 更新时间
      // 1：创建时间：升序 2：创建时间：降序 3：更新时间：升序 4：更新时间：降序
      if (this.search.updateTime2[0] === 1) {
        sortType = this.search.updateTime2[1] === 'desc' ? 2 : 1
      } else if (this.search.updateTime2[0] === 2) {
        sortType = this.search.updateTime2[1] === 'desc' ? 4 : 3
      }
      param.sortType = sortType
      Reflect.deleteProperty(param, 'updateTime')
      Reflect.deleteProperty(param, 'updateTime2')
      Reflect.deleteProperty(param, 'total')
      Reflect.deleteProperty(param, 'loading')
      this.search.loading = true
      let res = {}
      // eslint-disable-next-line
      switch (this.crtSign) {
        case 'applyAll':
          break
        case 'myConcern':
          param.isAttention = 1
          break
        case 'toModified':
          param.queryStatus = '3'
          break
        case 'toConfirmed':
          param.queryStatus = '5'
          break
        case 'Approval':
          param.queryStatus = '1'
          break
        case 'draftBin':
          param.queryStatus = '0'
          break
      }
      res = await getApplicationList(param)
      const { data } = res.data
      this.search.total = data.totalCount
      // eslint-disable-next-line
      this.list = data.list?.map((v) => {
        return {
          ...v,
          formId: v.taskNumber,
          recordId: v.taskNumber,
          taskStatus: v.submitted === 0 ? '0' : v.businessStatus,
          initiator: {
            ...v.sponsorMap,
            label: v.industryList?.[1]
          },
          institutional: v.industryList,
          processInstanceId: v.process_instance_id,
          currentAssignee: v.currentAssignee?.map((m) => {
            return {
              ...m,
              hasReminder: false
            }
          }) || []
        }
      }) || []
      this.search.loading = false
    },
    nextPage(pageNow) {
      this.getApplicationListAll(pageNow)
      this.$refs['apply-center'].scrollTo({
        top: 0, behavior: 'smooth'
      })
    },
    concern() {
      this.getDataStatistic()
      this.getApplicationListAll(1)
    },
    del(id) {
      const param = {
        recordId: id
      }
      delApplication(param).then((res) => {
        if (res.status === 200) {
          this.$message.success('删除成功')
          this.getDataStatistic()
          this.getApplicationListAll(1)
        }
      })
    },
    quash(item) {
      const param = {
        taskId: item.taskNumber,
        processInstanceId: item.process_instance_id,
        currentUserInfo: item.sponsorMap
      }
      quashApplication(param).then((res) => {
        if (res.status === 200) {
          this.$message.success('撤销成功')
          this.getDataStatistic()
          this.getApplicationListAll(1)
        }
      })
    },
    userStatus(counts) {
      const modifyCount = counts['toModified']
      const toConfirmedCount = counts['toConfirmed']
      const ApprovalCount = counts['Approval']
      const draftBinCount = counts['draftBin']
      const applyAllCount = counts['applyAll']
      const finished = ApprovalCount - modifyCount - toConfirmedCount - draftBinCount - applyAllCount
      if (modifyCount > 0 && modifyCount <= 5) {
        // eslint-disable-next-line
        return (this.tipsMsg = `您有${modifyCount}笔申请单待修改哦，请尽快修改。`)
      }
      if (toConfirmedCount <= 5 && toConfirmedCount > 0) {
        // eslint-disable-next-line
        return (this.tipsMsg = `您有${toConfirmedCount}笔申请单待确认哦，请尽快确认。`)
      }
      if (ApprovalCount > 0) {
        // eslint-disable-next-line
        return (this.tipsMsg = `您的申请单正在处理哦，请耐心等待。`)
      }
      if (finished === 0) {
        // eslint-disable-next-line
        return (this.tipsMsg = `您今日还没有提起新的申请，快去操作吧！`)
      }
    },
    changeStatis(item) {
      if (item.value === this.crtSign) return
      this.crtSign = item.value
      this.crtId = item.id
      this.getApplicationListAll(1)
    },
    searchList() {
      this.getApplicationListAll(1)
    },
    reset() {
      this.search = {
        formManagementId: '',
        approvalStage: '',
        urgent: '',
        hasOpinions: '',
        adoptionSituation: '',
        updateTime: [2, 'desc'],
        updateTime2: [2, 'desc'],
        keywords: '',
        startDate: [],
        productLaunchDate: [],
        total: 0,
        loading: false
      }
      // 时间排序
      this.setDatePicker()
      this.approvalPhases = []
      this.searchList()
    }
  },
  beforeRouteEnter(to, from, next) {
    next(() => {
      localStorage.removeItem('order-detail')
    })
  }
}
</script>
<style lang="less" scoped>
[v-cloak] {
  display: none;
}

.apply-center {
  overflow-y: auto;
  background: #f9fbff;

  .welcoming {
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0em;
    text-align: left;
    margin-bottom: 8px;
  }

  .tips {
    display: inline-block;
    color: #fa8c16;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    padding: 6px 12px;
    border-radius: 20px;
    background: #fffce8;
    margin-bottom: 8px;
    cursor: default;

    align-items: center;

    i {
      margin-right: 8px;
      font-size: 16px;
      line-height: 22px;
    }
  }

  .apply-center-box {
    border-radius: 10px;
    background: #fff;
    padding: 24px;
  }

  .data-statistics {
    display: flex;
    align-items: center;
    position: relative;
    justify-content: space-between;

    &-item {
      margin-right: 24px;
      flex: 1;
      padding: 12px;
      padding-left: 24px;

      display: flex;
      cursor: pointer;
      // justify-content: center;

      .icon {
        box-sizing: border-box;
        width: 50px;
        height: 50px;
        border-radius: 50px;
        background: #f2f3f5;
        margin-right: 12px;
        position: relative;

        img {
          width: 36px;
          height: 36px;
        }

        .active-icon,
        .default-icon {
          position: absolute;
          top: 12px;
          left: 6px;
        }
      }

      .name-count {
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
        color: #505968;
        display: flex;
        flex-direction: column;

        .name {
          margin-bottom: 8px;
          word-break: keep-all;
        }

        .count {
          color: #1d2128;
          word-break: keep-all;
          display: flex;
          flex-wrap: nowrap;
          align-items: flex-end;

          i {
            font-weight: 700;
            line-height: 28px;
            font-size: 20px;
            margin-right: 8px;
          }
        }
      }
    }

    &-item:hover {
      background: #fff;
      border-radius: 6px;
    }

    .active-item {
      .icon {

        .active-icon,
        .default-icon {
          position: absolute;
          top: 12px;
          left: 6px;
        }
      }
    }

    .active-item {
      position: relative;
      border-radius: 8px;
      background: linear-gradient(90deg, #7b61ff 0%, #61a0ff 100%);

      .name-count,
      .count {
        color: #fff;
      }
    }

    .new-apply {
      width: 120px !important;

      img {
        margin-bottom: 8px;
        width: 32px;
        height: 32px;
      }

      margin-right: 0;
      display: flex;
      padding: 6px 32px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      align-self: stretch;
      border-radius: 6px;
      color: #2d5cf6;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 22px;
      /* 157.143% */
    }

    .new-apply:hover {
      background: linear-gradient(90deg,
          rgba(123, 97, 255, 0.07) 0%,
          rgba(97, 160, 255, 0.07) 100%);

      img {
        transform: scale(1.2);
        transition: all 0.2s ease;
        margin-bottom: 8px;
      }
    }
  }

  .apply-content {
    margin-top: 16px;
  }

  .filters {
    display: flex;

    justify-content: space-between;

    .filters-content {
      display: flex;
      flex-direction: column;
      flex: 1;

      /deep/ .el-input__inner,
      /deep/ .el-range-input {
        border-radius: 4px;
        border: none;
        background: #f7f8fa;
        color: #1d2128;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;

        .el-range-separator {
          padding: 0;
        }
      }

      .floor1 {
        margin-bottom: 12px;
        padding-right: 16px;
        display: flex;
        justify-content: space-between;

        .el-select {
          margin-right: 16px;
          flex: 1;
        }

        .el-select:last-of-type {
          margin-right: 0;
        }

        /deep/ .el-select .el-input .el-icon-arrow-up::before {
          font-family: element-icons !important;
          content: '\e78f';
        }

        .descArrow,
        .ascArrow {
          display: flex;
          align-items: center;

          &::before {
            font-family: element-icons !important;
            content: '\e6e6';
            display: inline-block;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 12px;
            color: #86909c;
            z-index: 10;
            font-size: 18px;
          }

          /deep/ .el-select__tags {
            position: absolute;
            left: 40px;
            width: 0;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
            color: #1d2128;

            span {
              display: none;
            }
          }
        }

        .descArrow {
          &::before {
            font-family: element-icons !important;
            content: '\e6eb';
            display: inline-block;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 12px;
            color: #86909c;
            z-index: 10;
            font-size: 18px;
          }
        }

        .floor1-item {
          flex: 1;
          display: flex;
          margin-right: 16px;
          justify-content: space-between;

          .el-select {
            width: 49%;
          }
        }

        .floor1-item:last-of-type {
          margin-right: 0;
        }
      }

      .floor2 {
        width: 100%;
        display: flex;
        padding-right: 16px;

        .floor2-item {
          // width: 33%;
          flex: 1;
          margin-right: 16px;
          display: flex;
          align-items: center;

          .el-input,
          .el-date-editor {
            width: 100%;
          }

          span {
            color: #86909c;
            font-size: 14px;
            font-weight: 400;
            line-height: 22px;
            word-break: keep-all;
            margin-right: 8px;
          }
        }

        .floor2-item:last-of-type {
          margin-right: 0;
        }

        /deep/.el-range-editor {
          position: relative;

          .el-icon-date,
          .el-icon-time {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
          }

          .el-icon-time::before {
            font-family: element-icons !important;
            content: '\e78e';
          }

          .el-input__suffix {
            right: 20px;
          }
        }
      }
    }

    .export-reset {
      border-left: 1px dashed #e5e6eb;
      padding-left: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .el-button {
        height: 38px;
        padding: 6px 28px;
        border-radius: 6px;
        border: 1px solid #a8c5ff;
        background: #f0f6ff;
        margin-left: 0;
        margin-bottom: 12px;
      }

      .el-button:last-of-type {
        margin-bottom: 0;
      }
    }
  }
}
</style>
<style lang="less">
.transaction-select {
  max-width: 200px !important;
}
</style>
