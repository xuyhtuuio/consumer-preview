<template>
  <div class="person-approval">
    <div class="approval-top">
      <div class="top-com" v-loading="passDataLoading">
        <div class="com-tit">一次通过率分布</div>
        <div class="com-echarts1">
          <barEcharts :industryData="passData"></barEcharts>
        </div>
      </div>
      <div class="top-com" v-loading="acceptanceLoading">
        <div class="com-tit">接受率分布</div>
        <div class="com-echarts1">
          <barEcharts :industryData="acceptanceDataBill"></barEcharts>
        </div>
      </div>
      <div class="top-com" v-loading="rejectionLoading">
        <div class="com-tit">驳回率分布</div>
        <div class="com-echarts1">
          <barEcharts :industryData="rejectionData"></barEcharts>
        </div>
      </div>
    </div>
    <div class="approval-table">
      <div class="table-tit">
        <div class="tit-left">
          <div class="left-com">全部人员</div>
          <div class="left-com black">共<span class="blue">{{ billListData.personTotalCount }}</span>人</div>
        </div>
        <div class="tit-search">
          <el-input v-model="billListData.username" placeholder="请输入提单人员姓名" clearable @clear="getProposePersonList(1)"
            @keyup.enter.native="getProposePersonList(1)">
            <i slot="suffix" class="el-input__icon el-icon-search pointer" @click="getProposePersonList(1)"></i>
          </el-input>
        </div>
      </div>
      <div class="table-wrap  TRS-table-gray" v-loading="personListLoading">
        <el-table :header-cell-style="{ background: '#f5f6f6' }" :data="billListData.list" style="width: 100%;"  @sort-change="sortChange">
          <el-table-column type="index" show-overflow-tooltip label="序号" align="center" width="75px">
            <template slot-scope="scope">
              <p class="black fs14">{{ scope.$index + 1 }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="userName" show-overflow-tooltip label="提单人员" min-width="100px">
            <template slot-scope="scope">
              <p class="black fs14">{{ scope.row.userName }}</p>
              <p class="gray fs12">{{ scope.row.userId }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="allCount" :sortable="'custom'" show-overflow-tooltip label="提单数" align="center" min-width="90px">
            <template slot-scope="scope">
              <div class="flex-box">
                <p class="black fs16 ">{{ scope.row.allCount }}</p>
                <p class="gray fs12 pt6 flex-box ">项<img class="icon pointer  w16"
                    @click="rejectDialogShow('申请概览', scope.row)" src="@/assets/image/person-center/tc2.png" alt="">
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="opinionCount" :sortable="'custom'" show-overflow-tooltip label="意见条数" align="center"
            min-width="120px">
            <template slot-scope="scope">
              <div class="flex-box">
                <p class="black fs16 ">{{ scope.row.opinionCount }}</p>
                <p class="gray fs12 pt6">条</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="substanCount" :sortable="'custom'" show-overflow-tooltip label="实质性意见" align="center"
            min-width="120px">
            <template slot-scope="scope">
              <div class="flex-box">
                <p class="black fs16 ">{{ scope.row.substanCount }}</p>
                <p class="gray fs12 pt6">/{{ scope.row.substantiveRate }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="unSubstanCount" :sortable="'custom'" show-overflow-tooltip label="非质性意见" align="center"
            min-width="120px">
            <template slot-scope="scope">
              <div class="flex-box">
                <p class="black fs16 ">{{ scope.row. unSubstanCount }}</p>
                <p class="gray fs12 pt6">/{{ scope.row.unSubstantiveRate }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="acceptRate" :sortable="'custom'" show-overflow-tooltip label="接受率" align="center" min-width="90px">
          </el-table-column>
          <el-table-column prop="onePassRate" :sortable="'custom'" show-overflow-tooltip label="一次通过率" align="center"
            min-width="120px">
          </el-table-column>
          <el-table-column prop="reject" :sortable="'custom'" show-overflow-tooltip label="驳回情况" align="center"
            min-width="120px">
            <template slot-scope="scope">
              <div class="flex-box">
                <p class="black fs16 ">{{ scope.row.reject }}</p>
                <p class="gray fs12 pt6 flex-box">/{{ scope.row.rejectRate }}<img class="icon pointer  w16"
                    @click="rejectDialogShow('驳回情况', scope.row)" src="@/assets/image/person-center/tc1.png" alt="">
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="returnPassRate" :sortable="'custom'" show-overflow-tooltip label="回检通过率" align="center"
            min-width="120px">
          </el-table-column>
        </el-table>
        <trs-pagination :total="billListData.totalCount" @getList="getProposePersonList"
          :pageNow="billListData.pageNow"></trs-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { proposeAcceptRate, proposeOnePassRate, proposeRejectRate, proposePersonList } from '@/api/personCenter'
import barEcharts from './bar-echarts'
export default {
  components: {
    barEcharts,
  },
  name: 'person-center-index',
  data() {
    return {
      billListData: {
        username: '',
        list: [],
        pageNow: 1,
        totalCount: 0,
        personTotalCount: 0,
        sortValue: null,
        sortType: ''
      },
      billTable: [
        {
          name: '谭新宇',
          id: 'ID.34279811',
          tds: 156,
          yjts: 39,
          szxyj: 2782,
          szxyjRate: '38%',
          fszxyj: 2782,
          fszxyjRate: '38%',
          jsl: '90%',
          yctgl: '90%',
          bhqk: 2378,
          bhqkRate: '90%',
          hjtgl: '80%',
        },
        {
          name: '谭新宇',
          id: 'ID.34279811',
          tds: 156,
          yjts: 39,
          szxyj: 2782,
          szxyjRate: '38%',
          fszxyj: 2782,
          fszxyjRate: '38%',
          jsl: '90%',
          yctgl: '90%',
          bhqk: 2378,
          bhqkRate: '90%',
          hjtgl: '80%',
        },
        {
          name: '谭新宇',
          id: 'ID.34279811',
          tds: 156,
          yjts: 39,
          szxyj: 2782,
          szxyjRate: '38%',
          fszxyj: 2782,
          fszxyjRate: '38%',
          jsl: '90%',
          yctgl: '90%',
          bhqk: 2378,
          bhqkRate: '90%',
          hjtgl: '80%',
        },
        {
          name: '谭新宇',
          id: 'ID.34279811',
          tds: 156,
          yjts: 39,
          szxyj: 2782,
          szxyjRate: '38%',
          fszxyj: 2782,
          fszxyjRate: '38%',
          jsl: '90%',
          yctgl: '90%',
          bhqk: 2378,
          bhqkRate: '90%',
          hjtgl: '80%',
        },
        {
          name: '谭新宇',
          id: 'ID.34279811',
          tds: 156,
          yjts: 39,
          szxyj: 2782,
          szxyjRate: '38%',
          fszxyj: 2782,
          fszxyjRate: '38%',
          jsl: '90%',
          yctgl: '90%',
          bhqk: 2378,
          bhqkRate: '90%',
          hjtgl: '80%',
        },
      ],
      keywords: '',
      passData: {
        name: '一次通过率分布（人）',
        xData: [],
        yData: [],
        rate: [],
      },
      acceptanceDataBill: {
        name: '接受率分布（人）',
        xData: [],
        yData: [],
        rate: [],
      },
      rejectionData: {
        name: '驳回率分布（人）',
        xData: [],
        yData: [],
        rate: [],
        seriesItemStyle: ['rgba(255,221,100,0.6)', 'rgba(255,153,0,0.6)'],
        emphasisItemStyle: ['#FFDD64', '#FF9900'],
      },
      rejectDialog: false,
      rejectDialogTit: '',
      passDataLoading: false,
      acceptanceLoading: false,
      rejectionLoading: false,
      personListLoading: false
    }
  },
  mounted() {
    this.getProposeOnePassRate()
    this.getProposeAcceptRate()
    this.getProposeRejectRate()
    this.getProposePersonList(1)
  },
  watch: {
  },
  created() {
  },
  methods: {
    rejectDialogShow(rejectDialogTit, rowData) {
      const rejectDialogData = {
        rejectDialogTit,
        rowData,
        rejectDialog: true
      }
      this.$emit('rejectDialogShow', rejectDialogData)
    },
    approvalList() {
    },
    initChart(ref, option) {
      const chart = document.getElementById(ref);
      let myChart;
      if (chart) {
        myChart = this.$echarts.init(chart);
        myChart.setOption(option);
        window.addEventListener('resize', () => {
          myChart.resize();
        });
      }
      this.$on('hook:destroyed', () => {
        window.removeEventListener('resize', () => {
          myChart.resize();
        });
      });
    },
    searchList() { },
    // 一次通过率分布
    getProposeOnePassRate() {
      this.passDataLoading = true
      proposeOnePassRate({ dataFlag: 1 }).then((res) => {
        const { data } = res
        if (data.data) {
          this.passData.xData = data.data.title
          this.passData.yData = data.data.count
          this.passData.rate = data.data.rate
        }
        this.passDataLoading = false
      })
    },
    // 接受率分布
    getProposeAcceptRate() {
      this.acceptanceLoading = true
      proposeAcceptRate({ dataFlag: 1 }).then((res) => {
        const { data } = res
        if (data.data) {
          this.acceptanceDataBill.xData = data.data.title
          this.acceptanceDataBill.yData = data.data.count
          this.acceptanceDataBill.rate = data.data.rate
        }
        this.acceptanceLoading = false
      })
    },
    // 驳回率分布
    getProposeRejectRate() {
      this.rejectionLoading = true
      proposeRejectRate({ dataFlag: 1 }).then((res) => {
        const { data } = res
        if (data.data) {
          this.rejectionData.xData = data.data.title
          this.rejectionData.yData = data.data.count
          this.rejectionData.rate = data.data.rate
        }
        this.rejectionLoading = false
      })
    },
    getProposePersonList(pageNow) {
      if (pageNow) {
        this.billListData.pageNow = pageNow
      }
      this.personListLoading = true
      this.billListData.list = []
      proposePersonList({
        dataFlag: 3,
        orgId: 23,
        sortValue: this.billListData.sortValue,
        sortType: this.billListData.sortType,
        pageNow: this.billListData.pageNow,
        username: this.billListData.username
      }).then((res) => {
        const { data } = res
        this.billListData.list = data.data.page.list
        this.billListData.totalCount = data.data.page.totalCount
        this.billListData.personTotalCount = data.data.personTotalCount
        this.personListLoading = false
      })
    },
    sortChange({ prop, order }) {
      const propList = {
        allCount: 1,
        opinionCount: 2,
        substanCount: 3,
        unSubstanCount: 4,
        acceptRate: 5,
        onePassRate: 6,
        reject: 7,
        returnPassRate: 8,
      }
      this.billListData.sortValue = propList[prop]
      // eslint-disable-next-line no-nested-ternary
      this.billListData.sortType = order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : ''
      this.getProposePersonList(1)
    },
  },
}
</script>
<style lang="less" scoped>
.person-approval {
  margin-top: 16px;

  .approval-top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .top-com {
      width: calc((100% - 32px) / 3);
      height: 290px;
      padding: 16px;
      box-sizing: border-box;
      border-radius: 10px;
      background: #FFFFFF;

      .com-tit {
        position: relative;
        padding-left: 13px;
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
        color: #1D2128;

        &::before {
          content: '';
          display: block;
          width: 5px;
          height: 20px;
          background: #306EF5;
          border-radius: 0px 10px 0px 10px;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }

      .com-echarts {
        width: 100%;
        height: 220px;
        margin-top: 16px;
      }

      .com-echarts1 {
        width: 100%;
        height: 220px;
        margin-top: 16px;
      }
    }
  }

  .approval-table {
    background: #fff;
    padding: 16px;
    box-sizing: border-box;
    border-radius: 10px;
    margin-top: 16px;

    .table-tit {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .tit-left {
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        text-align: left;
        color: #1D2128;
        display: flex;
        align-items: center;
        gap: 12px;

        .black {
          color: #000000;
        }

        .blue {
          color: #2D5CF6;
          font-weight: 600;
          margin: 0 5px;
        }
      }

      .tit-search {
        width: 280px;

        /deep/ .el-input__inner {
          border-radius: 4px;
          border: none;
          background: #f7f8fa;
          color: #1d2128;
          font-size: 14px;
          font-weight: 400;
          height: 36px;
          line-height: 36px;
        }
      }
    }

    .table-wrap {
      margin-top: 16px;

      &.TRS-table-gray {
        /deep/ .el-table {
          border: none;

          &::before {
            display: none;
          }

          th.el-table__cell {
            font-size: 14px;
            font-weight: 700;
            color: #1D2128;
          }

          td.el-table__cell {
            border-right: none;
            border-bottom: 1px dashed #E5E6EB;
          }

          .black {
            color: #1D2128;
          }

          .gray {
            color: #505968;
          }

          .fs12 {
            font-size: 12px;
          }

          .fs14 {
            font-size: 14px;
          }

          .fw {
            font-weight: 700;
          }

          .w16 {
            width: 16px;
            height: 16px;
          }

          .w24 {
            width: 24px;
            height: 24px;
            flex-shrink: 0;
          }

          .pt6 {
            padding-top: 6px;
          }

          .flex-box {
            display: flex;
            gap: 0 3px;
            align-items: center;
            justify-content: center;
          }

          .pointer {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
