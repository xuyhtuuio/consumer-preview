<template>
  <div class="approval-center" ref="box">
    <p class="welcoming">欢迎来到消保管控平台！</p>
    <p class="tips" v-if="tipsMsg">
      <i class="iconfont icon-xiaoxi-tongzhi"></i>{{ tipsMsg }}
    </p>
    <div class="approval-center-box">
      <div class="data-statistics">
        <template v-for="(item, index) in dataStatistics">
          <div v-if="showAllTask(item)" :key="index" @click="changeStatis(item)" :class="item.value !== crtSign
            ? 'data-statistics-item'
            : 'data-statistics-item active-item'
            ">
            <div class="icon">
              <img :src="item.value == crtSign ? item.activeIcon : item.icon"
                :class="item.value == crtSign ? 'active-icon' : 'default-icon'">
            </div>
            <div class="name-count">
              <span class="name">{{ item.name }}</span>
              <span class="count"><i>{{ item.count }}</i> 个</span>
            </div>
          </div>
        </template>
      </div>
      <div class="apply-content">
        <div class="filters">
          <div class="filters-content">
            <div class="floor1">
              <el-select v-model="search.approvalType" placeholder="审批事项类型" @change="changeArrrovalType" clearable>
                <el-option v-for="(item, index) in transactionTypes" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
              <!-- <el-select v-model="search.approvalStage" placeholder="审批阶段" @change="searchList" clearable>
                <el-option v-for="(item, index) in approvalPhases" :key="index" :label="item.label"
                  :value="item.value"></el-option></el-select> -->
              <el-select v-model="search.urgent" placeholder="是否加急" @change="searchList" clearable>
                <el-option v-for="(item, index) in $field('isUrgent')" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
              <el-cascader :options="agenciesList" placeholder="提单机构" ref="agencies" v-model="search.orgIds"
                :show-all-levels="false" @change="changeAgencies"
                :props="{ checkStrictly: true, label: 'name', value: 'id', children: 'children', }"
                clearable></el-cascader>
              <el-select v-model="search.adoptionStatus" placeholder="采纳情况" @change="searchList" clearable>
                <el-option v-for="(item, index) in $field('adoptionSituations')" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
              <el-select v-model="search.updateTime2" ref="multiSelect" multiple @change="changeSort" :class="search.updateTime2[1] == 'desc'
                ? 'arrow-select descArrow'
                : 'arrow-select ascArrow'
                ">
                <el-option-group v-for="group in $field('updateTimeGroup')" :key="group.label">
                  <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-option-group>
              </el-select>
              <el-select v-model="search.returnSign" placeholder="驳回次数" @change="searchList" clearable>
                <el-option v-for="(item, index) in $field('isReject')" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
              <el-select v-model="search.onceAdopt" placeholder="一次通过" @change="searchList" clearable>
                <el-option v-for="(item, index) in $field('isOncePass')" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
              <el-select v-model="search.hasOpinions" placeholder="有/无实质意见" @change="searchList" clearable>
                <el-option v-for="(item, index) in $field('isOpinions')" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
              <div class="el-select"></div>
              <div class="el-select"></div>



            </div>
            <div class="floor2">
              <div class="floor2-item">
                <el-input v-model="search.keywords" placeholder="请输入任务名称/发起人关键词查询" clearable @clear="searchList"
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
            <el-button type="text" v-show="crtSign === 'allTask' && showExport" @click="exportXlsx" :loading="downloadLoading">导出</el-button>
            <el-button type="text" @click="reset">重置</el-button>
          </div>
        </div>
        <div class="list" v-loading="search.loading">
          <div v-if="list.length">
            <div v-for="(item, index) in list" :key="index">
              <approvalEventCard :item="item" @concern="concern" :crtSign="crtSign" @del="del"></approvalEventCard>
            </div>
            <trs-pagination :total="search.total" @getList='getList' :pageNow="pageNow"></trs-pagination>
          </div>
          <div v-loading="search.loading" v-else>
            <Empty></Empty>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import approvalEventCard from "@/components/card/approval-event-card";
import {
  getDataStatistics,
  getApprovalType,
  getApprovalStage,
  getApprovalListStation,
  exportApprovalList
} from "@/api/approvalCenter";
import { expordFile } from '@/utils/utils'
import { queryUserList } from '@/api/org'
export default {
  components: {
    approvalEventCard,
  },
  name: 'approval-center-index',
  data() {
    return {
      crtSign: "toPending",
      pageNow: 1,
      downloadLoading: false,
      // 待审批：pendingApproval 已审批：approvedCount 关注：applyAll 待修改：toModified 全部任务（本分行）：allTasksThis 总行的任务个数：allTasksOffice 驳回单的个数：overrule
      dataStatistics: [
        {
          name: "待处理",
          count: 0,
          value: "toPending",
          icon: require('@/assets/image/apply-center/wait-review.svg'),
          activeIcon: require('@/assets/image/apply-center/wait-review-active.svg'),
          show: true
        },
        {
          name: "已审批",
          count: 0,
          value: "approvedCount",
          icon: require('@/assets/image/apply-center/approved.svg'),
          activeIcon: require('@/assets/image/apply-center/approved-active.svg'),
          show: true
        },
        {
          name: "我的关注",
          count: 0,
          value: "applyAll",
          icon: require('@/assets/image/apply-center/my-attention.svg'),
          activeIcon: require('@/assets/image/apply-center/my-attention-active.svg'),
          show: true
        },
        {
          name: "全部任务",
          count: 0,
          value: "allTask",
          icon: require('@/assets/image/apply-center/all-attention.svg'),
          activeIcon: require('@/assets/image/apply-center/all-attention.svg'),
          show: false
        },
      ],
      search: {
        approvalType: "",
        approvalStage: "",
        urgent: "",
        hasOpinions: "",
        adoptionStatus: "",
        updateTime: [2, "desc"],
        updateTime2: [2, "desc"],
        keywords: "",
        startDate: [],
        productLaunchDate: [],
        total: 0,
        loading: false,
        orgIds: [],
      },
      agenciesList: [],
      transactionTypes: [],
      approvalPhases: [],
      tipsMsg: "",
      list: [],
    };
  },
  computed: {
    allTask() {
      const { permissionsPage = {} } = this.$store.state
      const approvalcenter = [...permissionsPage.funPerms, ...permissionsPage.defaultPerm].find(item => item.pathName === 'approval-list') || {}
      const isExsit = approvalcenter.child?.find(item => (item.name === '全部任务') && item.type)
      if (isExsit) {
        return true
      }
      return false
    },
    showExport() {
      const { permissionsPage = {} } = this.$store.state
      const approvalcenter = [...permissionsPage.funPerms, ...permissionsPage.defaultPerm].find(item => item.pathName === 'approval-list') || {}
      const isExsit = approvalcenter.child?.find(item => (item.name === '全部任务') && item.type === 'export')
      if (isExsit) {
        return true
      }
      return false
    },
    showAllTask() {
      const _this = this
      return (item) => {
        if (item.value === 'allTask') {
          return _this.allTask
        }
        return item.show
      }
    }
  },
  mounted() {
    let dom = document
      .querySelectorAll(".arrow-select")[0]
      .querySelector(".el-select__tags");
    this.$nextTick(() => {
      const text = this.search.updateTime[0] == 1 ? "发起时间" : "更新时间";
      dom.innerText = text;
    });
    this.userStatus();
    this.getApprovalType();
    this.queryUserList();
    this.searchList();

  },
  watch: {
    $route(to, from) {
      // 从审批页来, 刷新当前页码的数据且  跳转到审批页面
      if (from.name === 'aiApproval' && to.name === 'approval-list') {
        this.getList(this.pageNow);
      }
    }
  },
  created() {
    this.getDataStatistic();
  },
  methods: {
    changeAgencies() {
      this.$refs["agencies"].dropDownVisible = false;
      this.searchList();
    },
    userStatus() {
      // getUserStatus()
      //   .then((res) => {
      //     this.tipsMsg = res.data.data;
      //   })
      //   .catch((err) => {
      //     this.tipsMsg = false;
      //   });
    },
    getDataStatistic() {
      const userInfo = JSON.parse(window.localStorage.getItem('user_name'))
      const param = {
        taskDTO: {
          pageNo: 0,
          pageSize: 10,
          currentUserInfo: {
            id: userInfo.id,
            name: userInfo.fullname
          }
        }
      };
      getDataStatistics(param).then(res => {
        const { data } = res.data
        for (let i in data) {
          this.dataStatistics.forEach(v => {
            if (v.value == i) {
              v.count = data[i]
            }
          })
        }
      })
    },
    concern() {
      this.getDataStatistic()
      this.searchList();
    },
    del(id) {
      const param = {
        recordId: id,
      };
      delApplication(param).then((res) => {
        if (res.status === 200) {
          this.$message.success("删除成功");
          this.getDataStatistic()
          this.getApplicationListAll(1);
        }
      });
    },
    getApprovalType() {
      getApprovalType().then((res) => {
        this.transactionTypes = res.data.data.map((v) => {
          return {
            label: v.examineTypesName,
            value: v.recordId,
          };
        });
      });
    },
    exportXlsx() {
      let listType = null;
      const typeList = {
        toPending: '1',
        approvedCount: '2',
        applyAll: '3',
        allTask: '4',
      }
      listType = typeList[this.crtSign]
      const param = {
        pageNow: 1,
        pageSize: 10,
        ...this.search,
        listType,
        nodeid: this.search.approvalStage,
        orgIds: this.search.orgIds.length ? this.search.orgIds : null,
        createTimeStart: this.search.startDate && this.search.startDate.length > 0 ? this.search.startDate[0] + ' 00:00:00' : '',
        createTimeEnd: this.search.startDate && this.search.startDate.length > 0 ? this.search.startDate[1] + ' 00:00:00' : '',
        productLaunchDateStart: this.search.productLaunchDate && this.search.productLaunchDate.length > 0 ? this.search.productLaunchDate[0] + ' 00:00:00' : '',
        productLaunchDateEnd: this.search.productLaunchDate && this.search.productLaunchDate.length > 0 ? this.search.productLaunchDate[1] + ' 00:00:00' : '',
      };
      let sortType = "";
      // desc:降序 asc 升序 1 发起时间 2 更新时间
      // 1：创建时间：升序 2：创建时间：降序 3：更新时间：升序 4：更新时间：降序
      if (this.search.updateTime2[0] == 1) {
        sortType = this.search.updateTime2[1] == "desc" ? 2 : 1;
      } else if (this.search.updateTime2[0] == 2) {
        sortType = this.search.updateTime2[1] == "desc" ? 4 : 3;
      }
      param.sort = sortType;
      Reflect.deleteProperty(param, "updateTime");
      Reflect.deleteProperty(param, "updateTime2");
      Reflect.deleteProperty(param, "total");
      Reflect.deleteProperty(param, "loading");
      Reflect.deleteProperty(param, "productLaunchDate");
      Reflect.deleteProperty(param, "startDate");
      this.search.loading = true;
      const userInfo = JSON.parse(window.localStorage.getItem('user_name'))
      const taskDTO = {
        pageNo: 0,
        pageSize: 10,
        currentUserInfo: {
          id: userInfo.id,
          name: userInfo.fullname
        }
      }
      const wait_param = {
        ...param,
        taskDTO
      }
      this.downloadLoading = true
      exportApprovalList(wait_param).then(res => {
        // expordFile(res)
        this.downloadLoading = false
        let url = window.URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;" }))
        let link = document.createElement("a")
        link.style.display = "none"
        link.href = url
        link.setAttribute('download', '消保审核单.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }).catch(err => {
        this.downloadLoading = false
      })
    },
    getApprovalStage() {
      let params = {
        form_management_id: this.search.approvalType,
      };
      getApprovalStage(params).then((res) => {
        const { data } = res.data
        this.approvalPhases = data ? data.map((v) => {
          return {
            label: v,
            value: v,
          };
        }) : []
      });
    },
    changeArrrovalType() {
      // if (this.search.approvalType || this.search.approvalType == 0) {
      //   this.getApprovalStage();
      // } else {
      //   this.search.approvalStage = "";
      //   this.approvalPhases = [];
      // }
      this.searchList();
    },
    changeStatis(item) {
      if (item.value == this.crtSign) return;
      this.crtSign = item.value;
      this.searchList();
    },
    changeSort() {
      const lastKey =
        this.search.updateTime2[this.search.updateTime2.length - 1];
      if (this.search.updateTime2.length < 2) {
        this.search.updateTime2 = this.search.updateTime;
      } else {
        if (!isNaN(lastKey)) {
          this.search.updateTime[0] = lastKey;
        } else {
          this.search.updateTime[1] = lastKey;
        }
        this.$nextTick(() => {
          this.search.updateTime2 = this.search.updateTime;
        });
      }
      let dom = document
        .querySelectorAll(".arrow-select")[0]
        .querySelector(".el-select__tags");
      this.$nextTick(() => {
        const text = this.search.updateTime[0] == 1 ? "发起时间" : "更新时间";
        dom.innerText = text;
        setTimeout(() => {
          this.$refs.multiSelect.blur();
        }, 50);
        this.searchList();
      });
    },
    resize() {
      // let floor2 = document.querySelectorAll(".approval-center  .floor2")[0];
      // floor2
      //   ? (floor2.style.paddingRight = floor2.offsetWidth * (1 / 7) + 16 + "px")
      //   : "";
    },
    searchList() {
      this.getList(1);
    },
    queryUserList() {
      queryUserList().then((res) => {
        const { root } = res.data.data
        if (root) {
          this.agenciesList = root.children.map(item => {
            return {
              ...item,
              children: null,
              id: item.id,
              name: item.name,
            }
          })
        }
      });
    },
    getList(pageNow) {
      this.$refs['box'].scrollTo({
        top: 0,
        behavior: "smooth"
      })
      let listType = null;
      const typeList = {
        toPending: '1',
        approvedCount: '2',
        applyAll: '3',
        allTask: '4',
      }
      listType = typeList[this.crtSign]
      this.pageNow = pageNow;
      const param = {
        pageNow,
        pageSize: 10,
        ...this.search,
        listType,
        formManagementId: this.search.approvalType,
        nodeid: this.search.approvalStage,
        orgIds: this.search.orgIds.length ? this.search.orgIds : null,
        createTimeStart: this.search.startDate && this.search.startDate.length > 0 ? this.search.startDate[0] + ' 00:00:00' : '',
        createTimeEnd: this.search.startDate && this.search.startDate.length > 0 ? this.search.startDate[1] + ' 23:59:59' : '',
        productLaunchDateStart: this.search.productLaunchDate && this.search.productLaunchDate.length > 0 ? this.search.productLaunchDate[0] + ' 00:00:00' : '',
        productLaunchDateEnd: this.search.productLaunchDate && this.search.productLaunchDate.length > 0 ? this.search.productLaunchDate[1] + ' 23:59:59' : '',
      };
      let sortType = "";
      // desc:降序 asc 升序 1 发起时间 2 更新时间
      // 1：创建时间：升序 2：创建时间：降序 3：更新时间：升序 4：更新时间：降序
      if (this.search.updateTime2[0] == 1) {
        sortType = this.search.updateTime2[1] == "desc" ? 2 : 1;
      } else if (this.search.updateTime2[0] == 2) {
        sortType = this.search.updateTime2[1] == "desc" ? 4 : 3;
      }
      param.sort = sortType;
      Reflect.deleteProperty(param, "updateTime");
      Reflect.deleteProperty(param, "updateTime2");
      Reflect.deleteProperty(param, "total");
      Reflect.deleteProperty(param, "loading");
      Reflect.deleteProperty(param, "productLaunchDate");
      Reflect.deleteProperty(param, "startDate");
      this.search.loading = true;
      const userInfo = JSON.parse(window.localStorage.getItem('user_name'))
      const taskDTO = {
        pageNo: 0,
        pageSize: 10,
        currentUserInfo: {
          id: userInfo.id,
          name: userInfo.fullname
        }
      }
      const wait_param = {
        ...param,
        taskDTO
      }
      getApprovalListStation(wait_param).then(res => {
        const { data } = res.data;
        this.search.total = data.totalCount;
        const flag = Array.isArray(data.list)
        this.list = flag && data.list.length > 0 ? data.list.map(v => {
          return {
            ...v,
            taskNumber: v.recordId + '',
            taskName: v.entryName,
            initiator: { ...v.originator, label: v.institutional && v.institutional[1] },
            taskStatus: v.nodeStatus
          }
        }) : [];
        this.search.loading = false;
      }).catch(err => {
        this.search.loading = false
        this.search.total = 0
        this.list = []
      })
    },
    taskStatusSwitch(val) {
      let status = ''
      switch (val) {
        case '待修改':
          status = '2';
          break;
        case '审查中':
          status = '1';
          break;
        case '待确认':
          status = '3';
          break;
      }
      return status
    },
    reset() {
      this.search = {
        approvalType: "",
        approvalStage: "",
        urgent: "",
        hasOpinions: "",
        adoptionSituation: "",
        updateTime: [1, "asc"],
        updateTime2: [1, "asc"],
        keywords: "",
        startDate: [],
        productLaunchDate: [],
        total: 0,
        loading: false,
        orgIds: [],
      };
      this.approvalPhases = [];
      this.searchList();
    },
  },
  beforeRouteEnter(to, from, next) {
    next(() => {
      localStorage.removeItem('order-detail')
    })
  },
};
</script>
<style lang="less" scoped>
.approval-center {
  background: #f9fbff;
  overflow-y: auto;

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
    }
  }

  .approval-center-box {
    border-radius: 10px;
    background: #fff;
    padding: 24px;
  }

  .data-statistics {
    display: flex;
    align-items: center;
    position: relative;

    &-item {
      margin-right: 32px;
      padding: 12px;
      padding-left: 24px;
      display: flex;
      cursor: pointer;
      width: 180px;

      .icon {
        box-sizing: border-box;
        width: 50px;
        height: 50px;
        border-radius: 50px;
        background: #f2f3f5;
        margin-right: 12px;
        position: relative;

        img {
          width: 35px;
          height: 35px;
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

        .active-icon,
        .default-icon {
          position: absolute;
          width: 40px;
          height: 40px;
          top: 10px;
          left: 6px;
        }

        .name {
          margin-bottom: 8px;
        }

        .count {
          color: #1d2128;

          i {
            font-weight: 700;
            line-height: 28px;
            font-size: 20px;
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
      img {
        margin-bottom: 8px;
      }

      position: absolute;
      box-sizing: content-box;
      right: 0;
      // height: 68px;
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
      background: linear-gradient(90deg,
        rgba(123, 97, 255, 0.15) 0%,
        rgba(97, 160, 255, 0.15) 100%);
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

        // padding-right: 16px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .el-select,
        .el-cascader {
          margin-bottom: 12px;
          // margin-right: 16px;
          // flex: 1;
          width: 20%;
          padding-right: 16px;
        }

        // .el-select:last-of-type {
        //   padding-right: 16px;
        // }

        /deep/ .el-cascader .el-input .el-icon-arrow-down::before {
          font-family: element-icons !important;
          content: "\e790";
        }

        /deep/ .el-select .el-input .el-icon-arrow-up::before {
          font-family: element-icons !important;
          content: "\e78f";
        }

        .descArrow,
        .ascArrow {
          display: flex;
          align-items: center;

          /deep/ .el-input .el-input__suffix .el-input__suffix-inner {
            display: none !important;
          }


          &::before {
            display: none;
            font-family: element-icons !important;
            content: "\e6e6";
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
            content: "\e6eb";
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
      }

      .floor2 {
        width: 100%;
        display: flex;
        padding-right: 16px;

        .floor2-item {
          width: 33%;
          margin-right: 16px;
          display: flex;
          align-items: center;

          .el-input,
          .el-date-editor {
            width: 100%;
          }

          span {
            color: #86909C;
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
            content: "\e78e";
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

      .el-button {
        height: 38px;
        padding: 6px 0px;
        width: 84px;
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

