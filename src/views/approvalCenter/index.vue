<template>
  <div class="approval-center">
    <p class="welcoming">欢迎来到消保管控平台！</p>
    <p class="tips" v-if="tipsMsg">
      <i class="iconfont icon-xiaoxi-tongzhi"></i>{{ tipsMsg }}
    </p>
    <div class="data-statistics">
      <div v-for="(item, index) in dataStatistics" :key="index" @click="changeStatis(item)" :class="item.value !== crtSign
        ? 'data-statistics-item'
        : 'data-statistics-item active-item'
        ">
        <div class="icon">
          <img src="@/assets/image/apply-center/attention.png" alt="" v-if="index == 0" class="active-icon" />
          <img src="@/assets/image/apply-center/no-attention.png" v-else alt="" class="default-icon" />
        </div>
        <div class="name-count">
          <span class="name">{{ item.name }}</span>
          <span class="count"><i>{{ item.count }}</i> 个</span>
        </div>
      </div>
    </div>
    <div class="apply-content">
      <div class="filters">
        <div class="filters-content">
          <div class="floor1">
            <el-select v-model="search.approvalType" placeholder="审批类型" @change="changeArrrovalType" clearable>
              <el-option v-for="(item, index) in transactionTypes" :key="index" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
            <el-select v-model="search.approvalStage" placeholder="审批阶段" @change="searchList" clearable>
              <el-option v-for="(item, index) in approvalPhases" :key="index" :label="item.label"
                :value="item.value"></el-option></el-select>
            <el-select v-model="search.urgent" placeholder="是否加急" @change="searchList" clearable>
              <el-option v-for="(item, index) in isUrgents" :key="index" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
            <el-select v-model="search.hasOpinions" placeholder="有/无实质意见" @change="searchList" clearable>
              <el-option v-for="(item, index) in isOpinions" :key="index" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
            <el-select v-model="search.adoptionStatus" placeholder="采纳情况" @change="searchList" clearable>
              <el-option v-for="(item, index) in adoptionSituations" :key="index" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
            <!-- <el-select
              v-model="search.billOrganization"
              placeholder="提单机构"
              @change="searchList"
              clearable
            >
              <el-option
                v-for="(item, index) in adoptionSituations"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select> -->
            <el-cascader :options="agenciesList" placeholder="提单机构" ref="agencies" v-model="search.institutionalCode"
              :show-all-levels="false" @change="changeAgencies"
              :props="{ checkStrictly: true, label: 'name', value: 'code' }" clearable></el-cascader>
            <el-select v-model="search.updateTime2" placeholder="排序" ref="multiSelect" multiple @change="changeSort"
              :class="search.updateTime2[1] == 'desc'
                ? 'arrow-select descArrow'
                : 'arrow-select ascArrow'
                ">
              <el-option-group v-for="group in updateTimeGroup" :key="group.label">
                <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-option-group>
            </el-select>
          </div>
          <div class="floor2">
            <el-input v-model="search.keywords" placeholder="请输入项目名称关键词查询" clearable @clear="searchList"
              @keyup.enter.native="searchList">
              <i slot="suffix" class="el-input__icon el-icon-search pointer" @click="searchList"></i>
            </el-input>
            <el-date-picker v-model="search.startDate" clearable type="date" placeholder="请选择发起时间" @change="searchList"
              @clear="searchList">
            </el-date-picker>
            <el-date-picker v-model="search.productLaunchDate" clearable type="date" placeholder="请选择产品上线时间"
              @change="searchList" @clear="searchList">
            </el-date-picker>
          </div>
        </div>
        <div class="export-reset">
          <el-button type="text">导出</el-button>
          <el-button type="text" @click="reset">重置</el-button>
        </div>
      </div>
      <div class="list" v-loading="search.loading">
        <div v-if="list.length">
          <div v-for="(item, index) in list" :key="index">
            <approvalEventCard :item="item"></approvalEventCard>
          </div>
          <trs-pagination :total="list.length"></trs-pagination>
        </div>
        <div v-loading="search.loading" v-else> 
          <Empty></Empty>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import approvalEventCard from "@/components/card/approval-event-card";
import {
  getDataStatistics,
  getUserStatus,
  censorList,
  getApprovalType,
  getApprovalStage,
  billOfLadingAgenciesList,
} from "@/api/approvalCenter";
export default {
  components: {
    approvalEventCard,
  },
  data() {
    return {
      crtSign: "toPending",
      pageNow: 1,
      // 待审批：pendingApproval 已审批：approvedCount 关注：applyAll 待修改：toModified 全部任务（本分行）：allTasksThis 总行的任务个数：allTasksOffice 驳回单的个数：overrule
      dataStatistics: [
        {
          name: "待处理",
          count: 0,
          value: "toPending",
        },
        {
          name: "已审批",
          count: 0,
          value: "approvedCount",
        },
        {
          name: "我的关注",
          count: 0,
          value: "applyAll",
        },
        {
          name: "全部任务",
          count: 0,
          value: "allTasksOffice",
        },
      ],
      search: {
        approvalType: "",
        approvalStage: "",
        urgent: "",
        hasOpinions: "",
        adoptionStatus: "",
        updateTime: [2, "asc"],
        updateTime2: [2, "asc"],
        keywords: "",
        productLaunchDate: "",
        total: 0,
        loading: false,
        institutionalCode: "",
      },
      agenciesList: [],
      transactionTypes: [],
      approvalPhases: [],
      isUrgents: [
        { label: "不加急", value: "0" },
        { label: "加急", value: "1" },
      ],
      isOpinions: [
        { label: "无", value: "0" },
        { label: "有", value: "1" },
      ],
      adoptionSituations: [
        { label: "未采纳", value: "0" },
        { label: "已采纳", value: "1" },
      ],
      updateTimeGroup: [
        {
          options: [
            {
              value: 1,
              label: "发起时间",
            },
            {
              value: 2,
              label: "更新时间",
            },
          ],
        },
        {
          options: [
            {
              value: "asc",
              label: "升序",
            },
            {
              value: "desc",
              label: "降序",
            },
          ],
        },
      ],
      tipsMsg: "",
      list: [],
    };
  },
  mounted() {
    let dom = document
      .querySelectorAll(".arrow-select")[0]
      .querySelector(".el-select__tags");
    this.$nextTick(() => {
      const text = this.search.updateTime[0] == 1 ? "发起时间" : "更新时间";
      dom.innerText = text;
    });
    this.resize();
    window.addEventListener("resize", () => {
      this.resize();
    });
    this.userStatus();
    this.getApprovalType();
    this.billOfLadingAgenciesList();
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
      getUserStatus()
        .then((res) => {
          this.tipsMsg = res.data.data;
        })
        .catch((err) => {
          this.tipsMsg = false;
        });
    },
    getDataStatistic() {
      getDataStatistics().then((res) => {
        const { data } = res.data;
        this.dataStatistics.forEach((v) => {
          v.count = data[v.value];
        });
      });
    },
    getApprovalType() {
      getApprovalType().then((res) => {
        this.transactionTypes = res.data.data.map((v, index) => {
          return {
            label: v,
            value: index,
          };
        });
      });
    },
    getApprovalStage() {
      const name = this.transactionTypes.filter(v => { return v.value == this.search.approvalType })[0].label
      let params = {
        approvalPhases: name,
      };
      getApprovalStage(params).then((res) => {
        this.approvalPhases = res.data.data.map((v) => {
          return {
            label: v,
            value: v,
          };
        });
      });
    },
    changeArrrovalType() {
      if (this.search.approvalType || this.search.approvalType == 0) {
        this.getApprovalStage();
      } else {
        this.search.approvalStage = "";
        this.approvalPhases = [];
      }
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
      let floor2 = document.querySelectorAll(".approval-center  .floor2")[0];
      floor2
        ? (floor2.style.paddingRight = floor2.offsetWidth * (1 / 7) + 16 + "px")
        : "";
    },
    searchList() {
      this.getList(1);
    },
    billOfLadingAgenciesList() {
      billOfLadingAgenciesList().then((res) => {
        this.agenciesList = res.data.data;
      });
    },
    getList(pageNow) {
      let headerFlag = null;
      switch (this.crtSign) {
        case "toPending":
          headerFlag = '1';
          break;
        case "approvedCount":
          headerFlag = '2';
          break;
        case "applyAll":
          headerFlag = '4';
          break;
        case "allTasksOffice":
          headerFlag = '0';
          break;

      }
      this.pageNow = pageNow;
      const param = {
        pageNow,
        pageSize: 10,
        ...this.search,
        headerFlag,
      };
      let sortType = "";
      // desc:降序 asc 升序 1 发起时间 2 更新时间
      // 1：创建时间：升序 2：创建时间：降序 3：更新时间：升序 4：更新时间：降序
      if (this.search.updateTime2[0] == 1) {
        sortType = this.search.updateTime2[1] == "desc" ? 2 : 1;
      } else if (this.search.updateTime2[0] == 2) {
        sortType = this.search.updateTime2[1] == "desc" ? 4 : 3;
      }
      param.sortType = sortType;
      Reflect.deleteProperty(param, "updateTime");
      Reflect.deleteProperty(param, "updateTime2");
      Reflect.deleteProperty(param, "total");
      Reflect.deleteProperty(param, "loading");
      this.search.loading = true;
      censorList(param)
        .then((res) => {
          const { data } = res.data;
          this.search.total = data.totalCount;
          this.list = data.list;
          this.search.loading = false;
        })
        .catch((err) => {
          this.list = [];
        })
        .finally(() => {
          this.search.loading = false;
        });
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
        releaseTime: "",
        productLaunchDate: "",
        total: 0,
        loading: false,
        institutionalCode: "",
      };
      this.approvalPhases = [];
      this.searchList();
    },
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
          width: 32px;
          height: 32px;
        }

        .active-icon,
        .default-icon {
          position: absolute;
          top: 12px;
          left: 9px;
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
          left: 8px;
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

    .active-item::after {
      position: absolute;
      content: "";
      top: 70px;
      left: 50%;
      background-image: url("../../assets/image/apply-center/triangle.svg");
      transform: translateX(-50%);
      width: 18px;
      height: 18px;
      background-size: 100% 100%;
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
    border-radius: 10px;
    background: #fff;
    padding: 24px;
    margin-top: 16px;
  }

  .filters {
    display: flex;

    justify-content: space-between;

    .filters-content {
      display: flex;
      flex-direction: column;
      flex: 1;

      /deep/ .el-input__inner {
        border-radius: 4px;
        border: none;
        background: #f7f8fa;
        color: #1d2128;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
      }

      .floor1 {
        margin-bottom: 12px;
        padding-right: 16px;
        display: flex;
        justify-content: space-between;

        .el-select,
        .el-cascader {
          margin-right: 16px;
          flex: 1;
        }

        .el-cascader {
          margin-right: 0;
        }

        .el-select:last-of-type {
          margin-left: 16px;
        }

        /deep/ .el-cascader .el-input .el-icon-arrow-down::before{
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

          &::before {
            font-family: element-icons !important;
            content: "\e6e6";
            display: inline-block;
            position: absolute;
            top: 52%;
            transform: translateY(-50%);
            left: 12px;
            color: #86909c;
            z-index: 10;
            font-size: 20px;
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
            top: 52%;
            transform: translateY(-50%);
            left: 12px;
            color: #86909c;
            z-index: 10;
            font-size: 20px;
          }
        }
      }

      .floor2 {
        width: 100%;
        display: flex;
        padding-right: 16px;

        .el-input {
          flex: 1;
          margin-right: 16px;
        }

        // .el-input:last-of-type {
        //   margin-right: 0;
        // }

        /deep/.el-date-editor {
          position: relative;

          .el-input__prefix {
            position: relative;
            right: 0;

            .el-icon-date {
              position: absolute;
              right: 8px;
              top: 50%;
              transform: translateY(-50%);
            }
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

